const router = require('express').Router();
const db = require('../db');
const provisioning = require('../provisioning');
const notify = require('../notify');
const cfg = require('../config');
const { requireRole } = require('../auth');
const { HttpError, now, sha, rand, str, h, audit, paginate } = require('../lib');

router.use(requireRole('super_admin', 'admin'));

router.get('/stats', (req, res) => {
  const c = (sql) => db.prepare(sql).get().n;
  res.json({
    centres: { total: c('SELECT COUNT(*) n FROM centres'), active: c("SELECT COUNT(*) n FROM centres WHERE status='active'"), suspended: c("SELECT COUNT(*) n FROM centres WHERE status='suspended'"), failed: c("SELECT COUNT(*) n FROM centres WHERE status='provisioning_failed'") },
    applications_pending: c("SELECT COUNT(*) n FROM franchise_applications WHERE status IN ('Submitted','Under Review','Documents Required')"),
    students: c('SELECT COUNT(*) n FROM students'),
    certificates: { pending: c("SELECT COUNT(*) n FROM certificates WHERE status='Pending'"), valid: c("SELECT COUNT(*) n FROM certificates WHERE status='Valid'") },
    wallet_total_paise: c('SELECT COALESCE(SUM(balance_paise),0) n FROM wallets'),
  });
});

router.get('/applications', (req, res) => {
  const { size, offset } = paginate(req); const st = str(req.query.status, 30);
  const rows = db.prepare(`SELECT a.*, j.status AS job_status, j.error AS job_error, j.id AS job_id FROM franchise_applications a LEFT JOIN provisioning_jobs j ON j.application_id=a.id
    ${st ? 'WHERE a.status=?' : ''} ORDER BY a.id DESC LIMIT ? OFFSET ?`).all(...(st ? [st] : []), size, offset);
  for (const r of rows) if (r.job_id) r.log = db.prepare('SELECT step,ok,detail FROM provisioning_logs WHERE job_id=? ORDER BY id').all(r.job_id);
  res.json({ applications: rows });
});
router.post('/applications/:id/status', (req, res) => {
  const status = str(req.body.status, 30), reason = str(req.body.reason, 300);
  if (!['Under Review', 'Documents Required', 'Rejected'].includes(status)) throw new HttpError(400, 'Invalid status');
  if (['Documents Required', 'Rejected'].includes(status) && !reason) throw new HttpError(400, 'Reason is required');
  const a = db.prepare('SELECT * FROM franchise_applications WHERE id=?').get(+req.params.id);
  if (!a) throw new HttpError(404, 'Not found');
  if (['Approved', 'Rejected', 'Cancelled'].includes(a.status)) throw new HttpError(409, `Application is already ${a.status}`);
  db.prepare('UPDATE franchise_applications SET status=?, decision_reason=?, decided_by=?, decided_at=? WHERE id=?').run(status, reason || null, req.user.id, now(), a.id);
  audit(req, 'application.' + status.toLowerCase().replace(/ /g, '_'), 'application', a.id, 'ok', reason);
  res.json({ ok: true });
});
router.post('/applications/:id/approve', h(async (req, res) => {
  const r = await provisioning.approve(+req.params.id, req);   // also used for retry/resume
  res.status(r.ok ? 200 : 502).json(r);
}));

router.post('/applications/:id/decision', h(async (req, res) => {
  const d = str(req.body.decision, 10);
  if (d === 'approve') {
    const r = await provisioning.approve(+req.params.id, req);
    return res.status(r.ok ? 200 : 502).json(r);
  }
  const status = d === 'reject' ? 'Rejected' : str(req.body.status, 30);
  const reason = str(req.body.reason, 300);
  if (!['Under Review', 'Documents Required', 'Rejected'].includes(status)) throw new HttpError(400, 'Invalid decision');
  if (['Documents Required', 'Rejected'].includes(status) && !reason) throw new HttpError(400, 'Reason is required');
  const a = db.prepare('SELECT * FROM franchise_applications WHERE id=?').get(+req.params.id);
  if (!a) throw new HttpError(404, 'Not found');
  if (['Approved', 'Rejected', 'Cancelled'].includes(a.status)) throw new HttpError(409, `Application is already ${a.status}`);
  db.prepare('UPDATE franchise_applications SET status=?, decision_reason=?, decided_by=?, decided_at=? WHERE id=?').run(status, reason || null, req.user.id, now(), a.id);
  audit(req, 'application.' + status.toLowerCase().replace(/ /g, '_'), 'application', a.id, 'ok', reason);
  res.json({ ok: true });
}));

router.get('/centres', (req, res) => {
  const { size, offset } = paginate(req);
  res.json({ centres: db.prepare(`SELECT c.id,c.centre_code,c.name,c.slug,c.state,c.district,c.status,c.coordinator_id,
    (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS students FROM centres c ORDER BY c.id DESC LIMIT ? OFFSET ?`).all(size, offset) });
});
const setStatus = (to, from) => (req, res) => {
  const reason = str(req.body.reason, 300); if (!reason) throw new HttpError(400, 'Reason is required');
  const r = db.prepare('UPDATE centres SET status=? WHERE id=? AND status=?').run(to, +req.params.id, from);
  if (!r.changes) throw new HttpError(409, `Centre must be ${from}`);
  audit(req, 'centre.' + to, 'centre', req.params.id, 'ok', reason); res.json({ ok: true });
};
router.post('/centres/:id/suspend', setStatus('suspended', 'active'));
router.post('/centres/:id/activate', setStatus('active', 'suspended'));
router.post('/centres/:id/courses', (req, res) => {
  const ids = (Array.isArray(req.body.course_ids) ? req.body.course_ids : []).map(Number).filter(Number.isInteger);
  const cid = +req.params.id; if (!db.prepare('SELECT 1 FROM centres WHERE id=?').get(cid)) throw new HttpError(404, 'Centre not found');
  db.transaction(() => { db.prepare('DELETE FROM centre_courses WHERE centre_id=?').run(cid);
    for (const id of ids) if (db.prepare('SELECT 1 FROM courses WHERE id=?').get(id)) db.prepare('INSERT INTO centre_courses VALUES(?,?)').run(cid, id); })();
  audit(req, 'centre.courses', 'centre', cid, 'ok', ids.join(',')); res.json({ ok: true });
});
router.post('/centres/:id/coordinator', (req, res) => {
  const co = db.prepare("SELECT id FROM users WHERE id=? AND role='coordinator' AND status='active'").get(+req.body.coordinator_id);
  if (!co) throw new HttpError(400, 'Coordinator not found');
  db.prepare('UPDATE centres SET coordinator_id=? WHERE id=?').run(co.id, +req.params.id);
  audit(req, 'centre.assign_coordinator', 'centre', req.params.id, 'ok', String(co.id)); res.json({ ok: true });
});

// Get single centre details
router.get('/centres/:id', (req, res) => {
  const cid = +req.params.id;
  const c = db.prepare(`SELECT c.*, u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile,
    (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS student_count
    FROM centres c
    LEFT JOIN users u ON u.id=c.owner_user_id
    WHERE c.id=?`).get(cid);
  if (!c) throw new HttpError(404, 'Centre not found');
  res.json({ centre: c });
});

// Edit centre details
router.put('/centres/:id', (req, res) => {
  const cid = +req.params.id;
  const c = db.prepare('SELECT * FROM centres WHERE id=?').get(cid);
  if (!c) throw new HttpError(404, 'Centre not found');

  const b = req.body;
  const name = str(b.name, 150) || c.name;
  const state = str(b.state, 60) || c.state;
  const district = str(b.district, 60) || c.district;
  const address = str(b.address, 300) || c.address;
  const pin = str(b.pin, 10) || c.pin;
  const status = ['active', 'suspended', 'deactivated'].includes(b.status) ? b.status : c.status;

  db.transaction(() => {
    db.prepare('UPDATE centres SET name=?, state=?, district=?, address=?, pin=?, status=? WHERE id=?')
      .run(name, state, district, address, pin, status, cid);

    if (c.owner_user_id) {
      const ownerName = str(b.owner_name, 100);
      const ownerMobile = str(b.owner_mobile || b.mobile, 15);
      const ownerEmail = str(b.owner_email || b.email, 150);
      if (ownerName || ownerMobile || ownerEmail) {
        db.prepare('UPDATE users SET name=COALESCE(?, name), mobile=COALESCE(?, mobile), email=COALESCE(?, email) WHERE id=?')
          .run(ownerName || null, ownerMobile || null, ownerEmail ? ownerEmail.toLowerCase() : null, c.owner_user_id);
      }
    }
  })();

  audit(req, 'centre.update', 'centre', cid, 'ok', `Updated ${name}`);
  res.json({ ok: true, message: 'Centre updated successfully' });
});

router.get('/courses', (req, res) => res.json({ courses: db.prepare('SELECT * FROM courses ORDER BY name').all() }));
router.post('/courses', (req, res) => {
  const b = req.body, code = str(b.code, 20).toUpperCase(), name = str(b.name, 120);
  const dur = +b.duration_months, fee = Math.round(+b.fee_rupees * 100);
  if (!/^[A-Z0-9-]{2,20}$/.test(code) || !name || !(dur > 0) || !(fee >= 0)) throw new HttpError(400, 'Invalid course data');
  try { const r = db.prepare('INSERT INTO courses(code,name,duration_months,fee_paise) VALUES(?,?,?,?)').run(code, name, dur, fee); audit(req, 'course.create', 'course', r.lastInsertRowid); res.status(201).json({ id: r.lastInsertRowid }); }
  catch (e) { if (String(e.code).startsWith('SQLITE_CONSTRAINT')) throw new HttpError(409, 'Course code exists'); throw e; }
});

router.put('/courses/:id', (req, res) => {
  const cid = +req.params.id;
  const c = db.prepare('SELECT * FROM courses WHERE id=?').get(cid);
  if (!c) throw new HttpError(404, 'Course not found');

  const b = req.body;
  const name = str(b.name, 120) || c.name;
  const code = str(b.code, 20) ? str(b.code, 20).toUpperCase() : c.code;
  const dur = b.duration_months ? +b.duration_months : c.duration_months;
  const fee = b.fee_rupees !== undefined ? Math.round(+b.fee_rupees * 100) : (b.fee_paise !== undefined ? +b.fee_paise : c.fee_paise);
  const totalMarks = b.total_marks ? +b.total_marks : c.total_marks;
  const active = b.active !== undefined ? (b.active ? 1 : 0) : c.active;

  db.prepare('UPDATE courses SET code=?, name=?, duration_months=?, fee_paise=?, total_marks=?, active=? WHERE id=?')
    .run(code, name, dur, fee, totalMarks, active, cid);

  audit(req, 'course.update', 'course', cid, 'ok', `Updated ${code} - ${name}`);
  res.json({ ok: true, message: 'Course updated successfully' });
});

// Coordinators are created by super admin only; they receive a setup link, never a password.
router.post('/coordinators', requireRole('super_admin'), (req, res) => {
  const email = str(req.body.email).toLowerCase(), name = str(req.body.name, 100), state = str(req.body.state, 60);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) throw new HttpError(400, 'Name and valid email required');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new HttpError(409, 'Email already used');
  const r = db.prepare("INSERT INTO users(email,name,role,state,status,created_at) VALUES(?,?,'coordinator',?,'pending_setup',?)").run(email, name, state, now());
  const token = rand(32);
  db.prepare('INSERT INTO setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(token), r.lastInsertRowid, now() + 48 * 3600e3);
  notify.queue('email', email, 'password_reset', { url: `${cfg.PUBLIC_URL}/setup?token=${token}` });
  audit(req, 'coordinator.create', 'user', r.lastInsertRowid); res.status(201).json({ id: r.lastInsertRowid });
});
router.get('/coordinators', (req, res) => res.json({ coordinators: db.prepare("SELECT id,name,email,state,status FROM users WHERE role='coordinator'").all() }));

router.get('/audit', (req, res) => {
  const { size, offset } = paginate(req);
  const rows = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ? OFFSET ?').all(size, offset);
  res.json({ logs: rows });
});
const argon2 = require('../hash');

// Students Directory & Management (with centre-wise filtering)
router.get('/students', (req, res) => {
  const { size, offset } = paginate(req);
  const q = str(req.query.q, 100);
  const cid = req.query.centre_id ? +req.query.centre_id : null;
  let sql = `SELECT s.*, c.name AS centre_name, c.centre_code, co.name AS course_name, co.code AS course_code, u.status AS user_status
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    LEFT JOIN users u ON u.id=s.user_id WHERE 1=1`;
  const params = [];
  if (cid) {
    sql += ` AND s.centre_id=?`;
    params.push(cid);
  }
  if (q) {
    sql += ` AND (s.name LIKE ? OR s.student_code LIKE ? OR s.mobile LIKE ? OR c.name LIKE ?)`;
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += ` ORDER BY s.id DESC LIMIT ? OFFSET ?`;
  params.push(size, offset);
  res.json({ students: db.prepare(sql).all(...params) });
});

// Get single student details
router.get('/students/:id', (req, res) => {
  const sid = +req.params.id;
  const s = db.prepare(`SELECT s.*, c.name AS centre_name, c.centre_code, co.name AS course_name, co.code AS course_code
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    WHERE s.id=?`).get(sid);
  if (!s) throw new HttpError(404, 'Student not found');
  res.json({ student: s });
});

// Edit student details
router.put('/students/:id', (req, res) => {
  const sid = +req.params.id;
  const s = db.prepare('SELECT * FROM students WHERE id=?').get(sid);
  if (!s) throw new HttpError(404, 'Student not found');

  const b = req.body;
  const name = str(b.name, 100) || s.name;
  const father_name = str(b.father_name, 100) || s.father_name;
  const mobile = str(b.mobile, 15) || s.mobile;
  const email = str(b.email, 150) ? str(b.email, 150).toLowerCase() : s.email;
  const dob = str(b.dob, 20) || s.dob;
  const session = str(b.session, 30) || s.session;
  const course_id = b.course_id ? +b.course_id : s.course_id;
  const centre_id = b.centre_id ? +b.centre_id : s.centre_id;
  const status = str(b.status, 20) || s.status;

  db.transaction(() => {
    db.prepare(`UPDATE students SET name=?, father_name=?, mobile=?, email=?, dob=?, session=?, course_id=?, centre_id=?, status=? WHERE id=?`)
      .run(name, father_name, mobile, email, dob, session, course_id, centre_id, status, sid);

    if (s.user_id) {
      db.prepare('UPDATE users SET name=?, email=COALESCE(?, email), centre_id=? WHERE id=?')
        .run(name, email || null, centre_id, s.user_id);
    }
  })();

  audit(req, 'student.update', 'student', sid, 'ok', `Updated ${name}`);
  res.json({ ok: true, message: 'Student updated successfully' });
});

// Delete student
router.delete('/students/:id', (req, res) => {
  const sid = +req.params.id;
  const s = db.prepare('SELECT * FROM students WHERE id=?').get(sid);
  if (!s) throw new HttpError(404, 'Student not found');

  db.transaction(() => {
    db.prepare('DELETE FROM marksheets WHERE student_id=?').run(sid);
    db.prepare('DELETE FROM certificates WHERE student_id=?').run(sid);
    if (s.user_id) {
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(s.user_id);
      db.prepare('DELETE FROM users WHERE id=?').run(s.user_id);
    }
    db.prepare('DELETE FROM students WHERE id=?').run(sid);
  })();

  audit(req, 'student.delete', 'student', sid, 'ok', `Deleted ${s.name} (${s.student_code})`);
  res.json({ ok: true, message: 'Student deleted successfully' });
});

// View student credentials (for Head Office Admin)
router.get('/students/:id/credentials', (req, res) => {
  const sid = +req.params.id;
  const s = db.prepare(`SELECT s.*, c.name AS centre_name, c.centre_code, co.name AS course_name, co.code AS course_code,
    u.id AS user_id, u.email AS user_email, u.mobile AS user_mobile, u.status AS user_status
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    LEFT JOIN users u ON u.id=s.user_id
    WHERE s.id=?`).get(sid);
  if (!s) throw new HttpError(404, 'Student not found');

  const defaultEmail = s.user_email || s.email || `${s.student_code.toLowerCase()}@student.pescouncil.in`;
  res.json({
    credentials: {
      student_id: s.id,
      student_code: s.student_code,
      name: s.name,
      father_name: s.father_name,
      mobile: s.mobile || s.user_mobile,
      email: defaultEmail,
      password: s.initial_password || 'Student@123',
      centre_name: s.centre_name,
      centre_code: s.centre_code,
      course_name: s.course_name,
      portal_url: `${cfg.PUBLIC_URL}/student`,
      status: s.status,
    },
  });
});

// Set or reset student password directly (for Head Office Admin)
router.post('/students/:id/set-password', h(async (req, res) => {
  const sid = +req.params.id;
  const password = str(req.body.password, 64);
  if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

  const s = db.prepare('SELECT s.*, u.id AS uid FROM students s LEFT JOIN users u ON u.id=s.user_id WHERE s.id=?').get(sid);
  if (!s) throw new HttpError(404, 'Student not found');

  const hash = await argon2.hash(password);

  db.transaction(() => {
    db.prepare('UPDATE students SET initial_password=? WHERE id=?').run(password, sid);
    if (s.uid) {
      db.prepare("UPDATE users SET password_hash=?, failed_logins=0, locked_until=NULL, status='active' WHERE id=?").run(hash, s.uid);
    } else {
      const userEmail = s.email || `${s.student_code.toLowerCase()}@student.pescouncil.in`;
      const uIns = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?,'student',?,?,'active',?)")
        .run(userEmail, s.name, hash, s.centre_id, now());
      db.prepare('UPDATE students SET user_id=? WHERE id=?').run(uIns.lastInsertRowid, sid);
    }
  })();

  audit(req, 'student.set_password', 'student', sid, 'ok', `Updated credentials for ${s.name} (${s.student_code})`);
  res.json({ ok: true, message: 'Password updated successfully', password });
}));

// Wallets & Financial Ledger
router.get('/wallets', (req, res) => {
  const rows = db.prepare(`SELECT c.id AS centre_id, COALESCE(w.balance_paise, 0) AS balance_paise, c.name AS centre_name, c.centre_code, c.district, c.state, c.status AS centre_status
    FROM centres c
    LEFT JOIN wallets w ON w.centre_id=c.id
    ORDER BY balance_paise DESC, c.id DESC`).all();
  res.json({ wallets: rows });
});

router.post('/wallets/:centre_id/adjust', (req, res) => {
  const cid = +req.params.centre_id;
  const kind = str(req.body.kind || req.body.type, 10);
  const amountRupees = req.body.amount_rupees !== undefined ? +req.body.amount_rupees
    : req.body.amount !== undefined ? +req.body.amount
    : (+req.body.amount_paise / 100);
  const amountPaise = Math.round(amountRupees * 100);
  const reason = str(req.body.reason, 200) || 'Head Office Balance Adjustment';
  if (!['credit', 'debit'].includes(kind) || !(amountPaise > 0)) throw new HttpError(400, 'Valid kind and positive amount required');
  const w = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(cid) || { balance_paise: 0 };
  let newBal = kind === 'credit' ? w.balance_paise + amountPaise : w.balance_paise - amountPaise;
  if (newBal < 0) throw new HttpError(400, 'Insufficient balance for debit');
  db.transaction(() => {
    db.prepare('INSERT INTO wallets(centre_id, balance_paise) VALUES(?,?) ON CONFLICT(centre_id) DO UPDATE SET balance_paise=excluded.balance_paise').run(cid, newBal);
    const ref = `ADMIN-ADJ-${Date.now()}-${rand(4)}`;
    db.prepare(`INSERT INTO wallet_transactions(centre_id,kind,amount_paise,balance_after,reference,description,created_by,created_at)
      VALUES(?,?,?,?,?,?,?,?)`).run(cid, kind, amountPaise, newBal, ref, reason, req.user.id, now());
  })();
  audit(req, 'wallet.adjust', 'wallet', cid, 'ok', `${kind} ${amountPaise / 100} INR: ${reason}`);
  res.json({ ok: true, balance_paise: newBal });
});

// User Password Reset by Admin
router.post('/users/:id/reset-password', h(async (req, res) => {
  const uid = +req.params.id;
  const u = db.prepare('SELECT id,email,role,name FROM users WHERE id=?').get(uid);
  if (!u) throw new HttpError(404, 'User not found');
  const newPw = str(req.body.password, 64) || 'Pesc#2026';
  const hashed = await argon2.hash(newPw);
  db.prepare('UPDATE users SET password_hash=?, failed_logins=0, locked_until=NULL WHERE id=?').run(hashed, uid);
  audit(req, 'user.reset_password', 'user', uid, 'ok', `Reset by admin to ${newPw}`);
  res.json({ ok: true, message: `Password reset successfully for ${u.name} (${u.email})`, new_password: newPw });
}));

// Council Notices Management
router.get('/notices', (req, res) => {
  res.json({ notices: db.prepare('SELECT n.*, u.name AS author_name FROM notices n LEFT JOIN users u ON u.id=n.created_by ORDER BY n.pinned DESC, n.id DESC').all() });
});

router.post('/notices', (req, res) => {
  const b = req.body;
  const title = str(b.title, 200);
  const category = str(b.category, 50) || 'General';
  const content = str(b.content, 2000);
  const target = ['all', 'centres', 'students', 'public'].includes(b.target) ? b.target : 'all';
  const link = str(b.link, 200);
  const pinned = b.pinned ? 1 : 0;
  if (!title || !content) throw new HttpError(400, 'Title and content required');
  const r = db.prepare('INSERT INTO notices(title,category,content,target,link,pinned,active,created_by,created_at) VALUES(?,?,?,?,?,?,1,?,?)')
    .run(title, category, content, target, link || null, pinned, req.user.id, now());
  audit(req, 'notice.create', 'notice', r.lastInsertRowid, 'ok', title);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.post('/notices/:id/toggle', (req, res) => {
  const id = +req.params.id;
  const n = db.prepare('SELECT active FROM notices WHERE id=?').get(id);
  if (!n) throw new HttpError(404, 'Notice not found');
  const newActive = n.active ? 0 : 1;
  db.prepare('UPDATE notices SET active=? WHERE id=?').run(newActive, id);
  audit(req, 'notice.toggle', 'notice', id, 'ok', `active=${newActive}`);
  res.json({ ok: true, active: newActive });
});

router.delete('/notices/:id', (req, res) => {
  const id = +req.params.id;
  db.prepare('DELETE FROM notices WHERE id=?').run(id);
  audit(req, 'notice.delete', 'notice', id);
  res.json({ ok: true });
});

// Direct Centre Creation (Instant Onboarding)
const { next: counter, nextCentreCode, nextStudentCode } = require('../lib');
const { resolveSlug } = require('../tenant');

router.post('/centres/direct-create', h(async (req, res) => {
  const b = req.body;
  const name = str(b.name, 150);
  const owner_name = str(b.owner_name, 100);
  const email = str(b.email, 150).toLowerCase();
  const mobile = str(b.mobile, 15);
  const state = str(b.state, 60);
  const district = str(b.district, 60);
  const address = str(b.address, 300) || `${district}, ${state}`;
  const pin = str(b.pin, 10) || '000000';
  const slug = str(b.slug, 30).toLowerCase();
  const password = str(b.password, 64) || 'Centre@12345';
  const initialCreditRupees = Math.max(0, +b.initial_credit_rupees || 0);

  if (!name || !owner_name || !email || !slug) throw new HttpError(400, 'Name, owner name, email, and subdomain are required');
  if (resolveSlug(slug)) throw new HttpError(409, 'Subdomain is already taken');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new HttpError(409, 'Email is already registered');

  const hashed = await argon2.hash(password);

  const result = db.transaction(() => {
    const centreCode = nextCentreCode();

    const u = db.prepare("INSERT INTO users(email,name,mobile,password_hash,role,state,status,created_at) VALUES(?,?,?,?,'centre_owner',?,'active',?)")
      .run(email, owner_name, mobile, hashed, state, now());
    const ownerUserId = u.lastInsertRowid;

    const c = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,state,district,address,pin,status,created_at) VALUES(?,?,?,?,?,?,?,?, 'active', ?)")
      .run(centreCode, name, slug, ownerUserId, state, district, address, pin, now());
    const centreId = c.lastInsertRowid;

    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(centreId, ownerUserId);

    // Assign all active courses by default
    const allCourses = db.prepare('SELECT id FROM courses WHERE active=1').all();
    for (const co of allCourses) {
      db.prepare('INSERT OR IGNORE INTO centre_courses(centre_id, course_id) VALUES(?,?)').run(centreId, co.id);
    }

    // Initialize wallet
    const balPaise = initialCreditRupees * 100;
    db.prepare('INSERT INTO wallets(centre_id, balance_paise) VALUES(?,?)').run(centreId, balPaise);
    if (balPaise > 0) {
      const ref = `INIT-${Date.now()}-${rand(4)}`;
      db.prepare(`INSERT INTO wallet_transactions(centre_id,kind,amount_paise,balance_after,reference,description,created_by,created_at)
        VALUES(?, 'credit', ?, ?, ?, 'Initial Onboarding Wallet Credit', ?, ?)`)
        .run(centreId, balPaise, balPaise, ref, req.user.id, now());
    }

    return { centreId, centreCode, slug, email, password };
  })();

  audit(req, 'centre.direct_create', 'centre', result.centreId, 'ok', `Created ${name} (${result.centreCode})`);
  res.status(201).json(result);
}));

// Direct Student Enrolment by Admin
router.post('/students/direct-enroll', h(async (req, res) => {
  const b = req.body;
  const centreId = +b.centre_id;
  const courseId = +b.course_id;
  const name = str(b.name, 100);
  const father_name = str(b.father_name, 100);
  const mobile = str(b.mobile, 15);
  const email = str(b.email, 150).toLowerCase();
  const dob = str(b.dob, 20);
  const session = str(b.session, 30) || '2026-27';
  const password = str(b.password, 64) || 'Student@123';

  if (!centreId || !courseId || !name) throw new HttpError(400, 'Centre, course, and student name required');
  const centre = db.prepare('SELECT centre_code FROM centres WHERE id=?').get(centreId);
  if (!centre) throw new HttpError(404, 'Centre not found');

  const hash = await argon2.hash(password);

  const result = db.transaction(() => {
    const sCode = nextStudentCode(centreId);
    const s = db.prepare(`INSERT INTO students(student_code,centre_id,name,father_name,mobile,email,dob,course_id,session,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`)
      .run(sCode, centreId, name, father_name, mobile, email, dob, courseId, session, now());
    const studentId = s.lastInsertRowid;

    // Create student login user
    let userEmail = email || `${sCode.toLowerCase()}@student.pescouncil.in`;
    let u = db.prepare('SELECT id FROM users WHERE email=?').get(userEmail);
    if (!u) {
      const uIns = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?, 'student', ?, ?, 'active', ?)")
        .run(userEmail, name, hash, centreId, now());
      db.prepare('UPDATE students SET user_id=? WHERE id=?').run(uIns.lastInsertRowid, studentId);
    } else {
      db.prepare('UPDATE students SET user_id=? WHERE id=?').run(u.id, studentId);
    }

    return { studentId, studentCode: sCode, email: userEmail, password };
  })();

  audit(req, 'student.direct_enroll', 'student', result.studentId, 'ok', `Enrolled ${name} (${result.studentCode})`);
  res.status(201).json(result);
}));

// Direct Marksheet Generation by Admin
router.post('/marksheets/direct-issue', (req, res) => {
  const b = req.body;
  const studentId = +b.student_id;
  const s = db.prepare('SELECT s.*, co.name AS course_name, c.centre_code FROM students s JOIN courses co ON co.id=s.course_id JOIN centres c ON c.id=s.centre_id WHERE s.id=?').get(studentId);
  if (!s) throw new HttpError(404, 'Student not found');

  const rollNo = str(b.roll_no, 30) || s.student_code;
  const session = str(b.exam_session, 30) || s.session || '2026';
  const totalMax = +b.total_max || 400;
  const totalObt = +b.total_obtained || 320;
  const pct = Math.round((totalObt / totalMax) * 1000) / 10;
  const grade = b.grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C');
  const result = b.result || 'PASS';
  const subjects = b.subjects || JSON.stringify([
    { code: 'TH01', name: 'Theory Paper 1', max: 100, obt: Math.round(totalObt * 0.25) },
    { code: 'TH02', name: 'Theory Paper 2', max: 100, obt: Math.round(totalObt * 0.25) },
    { code: 'PR01', name: 'Practical Assessment', max: 100, obt: Math.round(totalObt * 0.25) },
    { code: 'PR02', name: 'Viva & Project Work', max: 100, obt: Math.round(totalObt * 0.25) }
  ]);

  const year = new Date().getFullYear();
  const mNum = counter('marksheet:' + year);
  const marksheetNo = `PESC/MRK/${year}/${String(mNum).padStart(6, '0')}`;
  const token = rand(32);

  const r = db.prepare(`INSERT INTO marksheets(marksheet_no,token,student_id,centre_id,course_id,exam_session,roll_no,subjects,total_max,total_obtained,percentage,grade,result,status,issue_date,decided_by,created_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'Approved',?,?,?)`)
    .run(marksheetNo, token, s.id, s.centre_id, s.course_id, session, rollNo, typeof subjects === 'string' ? subjects : JSON.stringify(subjects), totalMax, totalObt, pct, grade, result, now(), req.user.id, now());

  audit(req, 'marksheet.direct_issue', 'marksheet', r.lastInsertRowid, 'ok', marksheetNo);
  res.status(201).json({ id: r.lastInsertRowid, marksheet_no: marksheetNo, token, percentage: pct, grade });
});

// Direct Certificate Generation by Admin
router.post('/certificates/direct-issue', (req, res) => {
  const studentId = +req.body.student_id;
  const s = db.prepare('SELECT * FROM students WHERE id=?').get(studentId);
  if (!s) throw new HttpError(404, 'Student not found');

  const year = new Date().getFullYear();
  const cNum = counter('cert:' + year);
  const certNo = `PESC/${year}/${String(cNum).padStart(6, '0')}`;
  const token = rand(32);

  const r = db.prepare(`INSERT INTO certificates(cert_no,token,student_id,centre_id,course_id,status,issued_at,decided_by,created_at)
    VALUES(?,?,?,?,?,'Valid',?,?,?)`)
    .run(certNo, token, s.id, s.centre_id, s.course_id, now(), req.user.id, now());

  audit(req, 'certificate.direct_issue', 'certificate', r.lastInsertRowid, 'ok', certNo);
  res.status(201).json({ id: r.lastInsertRowid, cert_no: certNo, token });
});

// Edit Marksheet scores/details
router.put('/marksheets/:id', (req, res) => {
  const mid = +req.params.id;
  const m = db.prepare('SELECT * FROM marksheets WHERE id=?').get(mid);
  if (!m) throw new HttpError(404, 'Marksheet not found');

  const b = req.body;
  const roll_no = str(b.roll_no, 30) || m.roll_no;
  const exam_session = str(b.exam_session, 30) || m.exam_session;
  const total_max = b.total_max ? +b.total_max : m.total_max;
  const total_obtained = b.total_obtained ? +b.total_obtained : m.total_obtained;
  const percentage = Math.round((total_obtained / total_max) * 1000) / 10;
  const grade = b.grade || (percentage >= 85 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'D');
  const result = percentage >= 33 ? 'PASS' : 'FAIL';
  const subjects = b.subjects ? (typeof b.subjects === 'string' ? b.subjects : JSON.stringify(b.subjects)) : m.subjects;

  db.prepare('UPDATE marksheets SET roll_no=?, exam_session=?, total_max=?, total_obtained=?, percentage=?, grade=?, result=?, subjects=? WHERE id=?')
    .run(roll_no, exam_session, total_max, total_obtained, percentage, grade, result, subjects, mid);

  audit(req, 'marksheet.update', 'marksheet', mid, 'ok', `Updated marksheet ${m.marksheet_no || mid}`);
  res.json({ ok: true, percentage, grade, result });
});

module.exports = router;
