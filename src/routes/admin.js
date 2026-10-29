const router = require('express').Router();
const db = require('../db');
const provisioning = require('../provisioning');
const notify = require('../notify');
const cfg = require('../config');
const { requireRole } = require('../auth');
const { HttpError, now, sha, rand, str, h, audit, paginate, getOrCreateCoordinatorCert } = require('../lib');

try { db.prepare("ALTER TABLE users ADD COLUMN logo_url TEXT").run(); } catch (_) {}
try { db.prepare("ALTER TABLE users ADD COLUMN website TEXT").run(); } catch (_) {}

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
  const rows = db.prepare(`SELECT a.*, co.name AS coordinator_name, j.status AS job_status, j.error AS job_error, j.id AS job_id
    FROM franchise_applications a
    LEFT JOIN users co ON co.id=a.coordinator_id
    LEFT JOIN provisioning_jobs j ON j.application_id=a.id
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
  const d = str(req.body.decision, 15).toLowerCase();
  if (d === 'approve' || d === 'approved') {
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
  res.json({ centres: db.prepare(`SELECT c.id,c.centre_code,c.name,c.slug,c.state,c.district,c.status,c.coordinator_id,c.director_name,c.director_photo,c.phone,c.email,c.login_password,
    co.name AS coordinator_name,
    (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS students FROM centres c
    LEFT JOIN users co ON co.id=c.coordinator_id
    ORDER BY c.id DESC LIMIT ? OFFSET ?`).all(size, offset) });
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
    for (const id of ids) if (db.prepare('SELECT 1 FROM courses WHERE id=?').get(id)) db.prepare('INSERT INTO centre_courses(centre_id, course_id) VALUES(?,?)').run(cid, id); })();
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
  const totalMarks = +b.total_marks || 100;
  const singleFee = b.single_fee_rupees !== undefined ? Math.round(+b.single_fee_rupees * 100) : (+b.single_fee_paise || 20000);
  const semFee = b.semester_fee_rupees !== undefined ? Math.round(+b.semester_fee_rupees * 100) : (+b.semester_fee_paise || 60000);
  const curriculum = b.curriculum ? (typeof b.curriculum === 'string' ? b.curriculum : JSON.stringify(b.curriculum)) : '{}';
  const subjects = b.subjects ? (typeof b.subjects === 'string' ? b.subjects : JSON.stringify(b.subjects)) : '[]';
  if (!/^[A-Z0-9-]{2,20}$/.test(code) || !name || !(dur > 0) || !(fee >= 0)) throw new HttpError(400, 'Invalid course data');
  try {
    const r = db.prepare('INSERT INTO courses(code,name,duration_months,fee_paise,total_marks,single_fee_paise,semester_fee_paise,curriculum,subjects) VALUES(?,?,?,?,?,?,?,?,?)').run(code, name, dur, fee, totalMarks, singleFee, semFee, curriculum, subjects);
    audit(req, 'course.create', 'course', r.lastInsertRowid);
    res.status(201).json({ id: r.lastInsertRowid });
  }
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
  const totalMarks = b.total_marks ? +b.total_marks : (c.total_marks || 100);
  const singleFee = b.single_fee_rupees !== undefined ? Math.round(+b.single_fee_rupees * 100) : (b.single_fee_paise !== undefined ? +b.single_fee_paise : (c.single_fee_paise || 20000));
  const semFee = b.semester_fee_rupees !== undefined ? Math.round(+b.semester_fee_rupees * 100) : (b.semester_fee_paise !== undefined ? +b.semester_fee_paise : (c.semester_fee_paise || 60000));
  const active = b.active !== undefined ? (b.active ? 1 : 0) : c.active;
  let curriculum = b.curriculum !== undefined ? (typeof b.curriculum === 'string' ? b.curriculum : JSON.stringify(b.curriculum)) : (c.curriculum || '{}');
  let subjects = b.subjects !== undefined ? (typeof b.subjects === 'string' ? b.subjects : JSON.stringify(b.subjects)) : c.subjects;

  if (b.subjects && !b.curriculum) {
    try {
      const rawSubs = typeof b.subjects === 'string' ? JSON.parse(b.subjects) : b.subjects;
      if (Array.isArray(rawSubs) && rawSubs.length) {
        const mapped = rawSubs.map((s, idx) => {
          const th = (s.theory !== undefined ? +s.theory : (s.max_theory !== undefined ? +s.max_theory : 50)) || 50;
          const pr = (s.practical !== undefined ? +s.practical : (s.max_practical !== undefined ? +s.max_practical : 50)) || 50;
          return {
            code: s.code || `${code}-${idx + 1}`,
            name: s.name || s,
            theory: th,
            practical: pr,
            max_marks: s.max_marks || s.total_max || (th + pr)
          };
        });
        curriculum = JSON.stringify({
          yearly: { 'Annual Examination': mapped },
          semester: { 'Semester 1': mapped.slice(0, Math.ceil(mapped.length / 2) || 1), 'Semester 2': mapped.slice(Math.ceil(mapped.length / 2)) }
        });
      }
    } catch (_) {}
  } else if (b.curriculum && !b.subjects) {
    try {
      const curObj = typeof b.curriculum === 'string' ? JSON.parse(b.curriculum) : b.curriculum;
      const subsMap = new Map();
      ['yearly', 'semester'].forEach(pat => {
        const terms = curObj[pat] || {};
        Object.values(terms).forEach(list => {
          if (Array.isArray(list)) {
            list.forEach((s, idx) => {
              const name = (s.name || s || '').trim();
              if (name && !subsMap.has(name.toLowerCase())) {
                const th = (s.theory !== undefined ? +s.theory : (s.max_theory !== undefined ? +s.max_theory : 50)) || 50;
                const pr = (s.practical !== undefined ? +s.practical : (s.max_practical !== undefined ? +s.max_practical : 50)) || 50;
                subsMap.set(name.toLowerCase(), {
                  code: s.code || `${code}-${subsMap.size + 1}`,
                  name: name,
                  max_theory: th,
                  max_practical: pr,
                  total_max: s.max_marks || s.total_max || (th + pr)
                });
              }
            });
          }
        });
      });
      if (subsMap.size) subjects = JSON.stringify(Array.from(subsMap.values()));
    } catch (_) {}
  }

  db.prepare('UPDATE courses SET code=?, name=?, duration_months=?, fee_paise=?, total_marks=?, single_fee_paise=?, semester_fee_paise=?, curriculum=?, subjects=?, active=? WHERE id=?')
    .run(code, name, dur, fee, totalMarks, singleFee, semFee, curriculum, subjects, active, cid);

  audit(req, 'course.update', 'course', cid, 'ok', `Updated ${code} - ${name}`);
  res.json({ ok: true, message: 'Course updated successfully' });
});

const handleCourseCurriculum = (req, res) => {
  const cid = +req.params.id;
  const c = db.prepare('SELECT * FROM courses WHERE id=?').get(cid);
  if (!c) throw new HttpError(404, 'Course not found');

  const b = req.body;
  let curriculum = b.curriculum ? (typeof b.curriculum === 'string' ? b.curriculum : JSON.stringify(b.curriculum)) : (c.curriculum || '{}');
  let subjects = b.subjects ? (typeof b.subjects === 'string' ? b.subjects : JSON.stringify(b.subjects)) : c.subjects;

  if (b.curriculum) {
    try {
      const curObj = typeof b.curriculum === 'string' ? JSON.parse(b.curriculum) : b.curriculum;
      const subsMap = new Map();
      ['yearly', 'semester'].forEach(pat => {
        const terms = curObj[pat] || {};
        Object.values(terms).forEach(list => {
          if (Array.isArray(list)) {
            list.forEach((s, idx) => {
              const name = (s.name || s || '').trim();
              if (name && !subsMap.has(name.toLowerCase())) {
                const th = (s.theory !== undefined ? +s.theory : (s.max_theory !== undefined ? +s.max_theory : 50)) || 50;
                const pr = (s.practical !== undefined ? +s.practical : (s.max_practical !== undefined ? +s.max_practical : 50)) || 50;
                subsMap.set(name.toLowerCase(), {
                  code: s.code || `${c.code}-${subsMap.size + 1}`,
                  name: name,
                  max_theory: th,
                  max_practical: pr,
                  total_max: s.max_marks || s.total_max || (th + pr)
                });
              }
            });
          }
        });
      });
      if (subsMap.size) subjects = JSON.stringify(Array.from(subsMap.values()));
    } catch (_) {}
  } else if (b.subjects) {
    try {
      const rawSubs = typeof b.subjects === 'string' ? JSON.parse(b.subjects) : b.subjects;
      if (Array.isArray(rawSubs) && rawSubs.length) {
        const mapped = rawSubs.map((s, idx) => {
          const th = (s.theory !== undefined ? +s.theory : (s.max_theory !== undefined ? +s.max_theory : 50)) || 50;
          const pr = (s.practical !== undefined ? +s.practical : (s.max_practical !== undefined ? +s.max_practical : 50)) || 50;
          return {
            code: s.code || `${c.code}-${idx + 1}`,
            name: s.name || s,
            theory: th,
            practical: pr,
            max_marks: s.max_marks || s.total_max || (th + pr)
          };
        });
        curriculum = JSON.stringify({
          yearly: { 'Annual Examination': mapped },
          semester: { 'Semester 1': mapped.slice(0, Math.ceil(mapped.length / 2) || 1), 'Semester 2': mapped.slice(Math.ceil(mapped.length / 2)) }
        });
      }
    } catch (_) {}
  }

  const singleFee = b.single_fee_rupees !== undefined ? Math.round(+b.single_fee_rupees * 100) : (b.single_fee_paise !== undefined ? +b.single_fee_paise : (c.single_fee_paise || 20000));
  const semFee = b.semester_fee_rupees !== undefined ? Math.round(+b.semester_fee_rupees * 100) : (b.semester_fee_paise !== undefined ? +b.semester_fee_paise : (c.semester_fee_paise || 60000));

  db.prepare('UPDATE courses SET curriculum=?, subjects=?, single_fee_paise=?, semester_fee_paise=? WHERE id=?')
    .run(curriculum, subjects, singleFee, semFee, cid);

  audit(req, 'course.curriculum_update', 'course', cid, 'ok', `Updated curriculum for ${c.code}`);
  res.json({ ok: true, message: 'Curriculum & exam fees saved successfully' });
};

router.put('/courses/:id/curriculum', handleCourseCurriculum);
router.post('/courses/:id/curriculum', handleCourseCurriculum);

// Coordinators are created by super admin; initial password provided for immediate panel access.
router.post('/coordinators', requireRole('super_admin'), (req, res) => {
  const email = str(req.body.email).toLowerCase(), name = str(req.body.name, 100), state = str(req.body.state, 60);
  const mobile = str(req.body.mobile || req.body.phone, 20) || null;
  const district = str(req.body.district, 60) || null;
  const address = str(req.body.address, 300) || null;
  const pin = str(req.body.pin, 10) || null;
  const qualification = str(req.body.qualification, 100) || null;
  const territory = str(req.body.territory, 100) || null;
  const photo_url = req.body.photo_url || null;
  const initialPassword = String(req.body.password || req.body.initial_password || 'Coord@123').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) throw new HttpError(400, 'Name and valid email required');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new HttpError(409, 'Email already used');
  const bcrypt = require('bcryptjs');
  const hashed = bcrypt.hashSync(initialPassword, 10);
  const r = db.prepare("INSERT INTO users(email,name,mobile,password_hash,password_plain,role,state,district,address,pin,qualification,territory,photo_url,status,created_at) VALUES(?,?,?,?,?,'coordinator',?,?,?,?,?,?,?,'active',?)")
    .run(email, name, mobile, hashed, initialPassword, state, district, address, pin, qualification, territory, photo_url, now());
  const token = rand(32);
  db.prepare('INSERT INTO setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(token), r.lastInsertRowid, now() + 48 * 3600e3);
  notify.queue('email', email, 'password_reset', { url: `${cfg.PUBLIC_URL}/setup?token=${token}` });
  // Automatically issue appointment certificate upon coordinator creation
  const cert = getOrCreateCoordinatorCert(r.lastInsertRowid, { id: r.lastInsertRowid, name, email, state });
  audit(req, 'coordinator.create', 'user', r.lastInsertRowid);
  res.status(201).json({ id: r.lastInsertRowid, name, email, mobile, password: initialPassword, cert_no: cert ? cert.cert_no : null });
});

router.get('/coordinators', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.mobile, u.state, u.district, u.address, u.qualification, u.territory, u.status, u.photo_url, u.password_plain AS password, u.created_at,
           cc.cert_no, cc.status AS cert_status, cc.token AS cert_token, cc.issued_at AS cert_issued_at
    FROM users u
    LEFT JOIN coordinator_certificates cc ON cc.user_id = u.id
    WHERE u.role='coordinator'
    ORDER BY u.id DESC
  `).all();
  for (const r of rows) {
    if (!r.cert_no) {
      const c = getOrCreateCoordinatorCert(r.id, r);
      if (c) {
        r.cert_no = c.cert_no;
        r.cert_status = c.status;
        r.cert_token = c.token;
        r.cert_issued_at = c.issued_at;
      }
    }
    const centres = db.prepare(`SELECT id, centre_code, name, slug, director_name, phone, email, district, state, address, status, affiliation_cert_no, created_at
      FROM centres WHERE coordinator_id=? ORDER BY id DESC`).all(r.id);
    r.centres_count = centres.length;
    r.centres = centres;
  }
  res.json({ coordinators: rows });
});

router.get('/coordinators/:id/centres', (req, res) => {
  const cid = +req.params.id;
  const centres = db.prepare(`SELECT id, centre_code, name, slug, director_name, phone, email, district, state, address, status, affiliation_cert_no, created_at
    FROM centres WHERE coordinator_id=? ORDER BY id DESC`).all(cid);
  res.json({ centres });
});

router.post('/coordinators/:id/set-password', h(async (req, res) => {
  const cid = +req.params.id;
  const password = str(req.body.password, 64);
  if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("UPDATE users SET password_hash=?, password_plain=?, failed_logins=0, locked_until=NULL WHERE id=? AND role='coordinator'").run(hash, password, cid);
  res.json({ ok: true, message: 'Coordinator password updated successfully' });
}));

router.post('/centres/:id/set-password', h(async (req, res) => {
  const cid = +req.params.id;
  const password = str(req.body.password, 64);
  if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  const c = db.prepare('SELECT * FROM centres WHERE id=?').get(cid);
  if (!c) throw new HttpError(404, 'Centre not found');
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(password, 10);
  db.transaction(() => {
    db.prepare('UPDATE centres SET login_password=? WHERE id=?').run(password, cid);
    db.prepare("UPDATE users SET password_hash=?, password_plain=?, failed_logins=0, locked_until=NULL WHERE centre_id=? AND role='centre_owner'").run(hash, password, cid);
  })();
  res.json({ ok: true, message: 'Centre password updated successfully' });
}));

router.get('/coordinators/:id/cert', (req, res) => {
  const cid = +req.params.id;
  const u = db.prepare("SELECT id, name, email, mobile, state, photo_url, seal_url, signature_url, created_at FROM users WHERE id=? AND role='coordinator'").get(cid);
  if (!u) throw new HttpError(404, 'Coordinator not found');
  const cert = getOrCreateCoordinatorCert(u.id, u);
  res.json({
    certificate: {
      ...cert,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      photo_url: u.photo_url,
      seal_url: u.seal_url,
      signature_url: u.signature_url,
      state: u.state || cert.state || 'All Assigned Territories',
      verification_url: `${cfg.PUBLIC_URL}/verify/coordinator/${cert.token}`,
    }
  });
});

// Delete coordinator
router.delete('/coordinators/:id', (req, res) => {
  const cid = +req.params.id;
  const u = db.prepare("SELECT * FROM users WHERE id=? AND role='coordinator'").get(cid);
  if (!u) throw new HttpError(404, 'Coordinator not found');

  db.transaction(() => {
    db.prepare('UPDATE centres SET coordinator_id=NULL WHERE coordinator_id=?').run(cid);
    db.prepare('DELETE FROM coordinator_certificates WHERE user_id=?').run(cid);
    db.prepare('DELETE FROM setup_tokens WHERE user_id=?').run(cid);
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(cid);
    db.prepare("DELETE FROM users WHERE id=? AND role='coordinator'").run(cid);
  })();

  audit(req, 'coordinator.delete', 'user', cid, 'ok', `Deleted coordinator ${u.name} (${u.email})`);
  res.json({ ok: true, message: 'Coordinator deleted successfully' });
});

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
  let sql = `SELECT s.*, c.name AS centre_name, c.centre_code, co.name AS course_name, co.code AS course_code, u.status AS user_status,
    cert.id AS certificate_id, cert.cert_no, mrk.id AS marksheet_id, mrk.marksheet_no,
    CASE WHEN s.status='passout' OR s.status='completed' OR cert.id IS NOT NULL OR mrk.id IS NOT NULL THEN 1 ELSE 0 END AS is_passout
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    LEFT JOIN users u ON u.id=s.user_id
    LEFT JOIN certificates cert ON cert.student_id=s.id
    LEFT JOIN marksheets mrk ON mrk.student_id=s.id
    WHERE 1=1`;
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

router.post('/students/clear-all', (req, res) => {
  db.transaction(() => {
    db.prepare('DELETE FROM marksheets').run();
    db.prepare('DELETE FROM certificates').run();
    db.prepare("DELETE FROM users WHERE role='student'").run();
    db.prepare('DELETE FROM students').run();
  })();
  audit(req, 'student.clear_all', 'student', 0, 'ok', 'Cleared all students, marksheets and certificates');
  res.json({ ok: true, message: 'All students cleared successfully' });
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

// Student Passout Toggle
router.post('/students/:id/toggle-status', h(async (req, res) => {
  const sid = +req.params.id;
  const isPassout = req.body && (req.body.is_passout === true || req.body.status === 'passout');
  const newStatus = isPassout ? 'passout' : 'active';
  db.prepare("UPDATE students SET status=? WHERE id=?").run(newStatus, sid);
  const s = db.prepare('SELECT * FROM students WHERE id=?').get(sid);
  res.json({ ok: true, student: { ...s, is_passout: isPassout } });
}));

// Admin Edit Certificate Details (Signatures & Seals Permanently Locked)
router.post('/certificates/:id/edit', h(async (req, res) => {
  const cid = +req.params.id;
  const b = req.body || {};
  delete b.seal_url; delete b.signature_url; delete b.coordinator_seal_url; delete b.coordinator_signature_url; delete b.council_seal_url; delete b.council_signature_url;

  const updates = [];
  const vals = [];
  if (b.student_name !== undefined) { updates.push('student_name=?'); vals.push(b.student_name); }
  if (b.father_name !== undefined) { updates.push('father_name=?'); vals.push(b.father_name); }
  if (b.mother_name !== undefined) { updates.push('mother_name=?'); vals.push(b.mother_name); }
  if (b.roll_no !== undefined) { updates.push('roll_no=?'); vals.push(b.roll_no); }
  if (b.student_code !== undefined) { updates.push('student_code=?'); vals.push(b.student_code); }
  if (b.course_name !== undefined) { updates.push('course_name=?'); vals.push(b.course_name); }
  if (b.exam_session !== undefined) { updates.push('exam_session=?'); vals.push(b.exam_session); }
  if (b.term !== undefined) { updates.push('term=?'); vals.push(b.term); }
  if (b.grade !== undefined) { updates.push('grade=?'); vals.push(b.grade); }
  if (b.cert_no !== undefined) { updates.push('cert_no=?'); vals.push(b.cert_no); }
  if (b.issue_date !== undefined) { updates.push('issued_at=?'); vals.push(b.issue_date); }

  if (updates.length > 0) {
    vals.push(cid, cid);
    try {
      db.prepare(`UPDATE certificates SET ${updates.join(', ')} WHERE id=? OR student_id=?`).run(...vals);
    } catch (_) {}
  }
  const cert = db.prepare('SELECT * FROM certificates WHERE id=? OR student_id=?').get(cid, cid) || { id: cid, ...b };
  res.json({ ok: true, message: 'Certificate details updated successfully!', certificate: cert });
}));

// Admin Edit Marksheet Details & Marks (Signatures & Seals Permanently Locked)
router.post('/marksheets/:id/edit', h(async (req, res) => {
  const mid = +req.params.id;
  const b = req.body || {};
  delete b.seal_url; delete b.signature_url; delete b.coordinator_seal_url; delete b.coordinator_signature_url; delete b.council_seal_url; delete b.council_signature_url;

  const updates = [];
  const vals = [];
  if (b.student_name !== undefined) { updates.push('student_name=?'); vals.push(b.student_name); }
  if (b.father_name !== undefined) { updates.push('father_name=?'); vals.push(b.father_name); }
  if (b.mother_name !== undefined) { updates.push('mother_name=?'); vals.push(b.mother_name); }
  if (b.roll_no !== undefined) { updates.push('roll_no=?'); vals.push(b.roll_no); }
  if (b.student_code !== undefined) { updates.push('student_code=?'); vals.push(b.student_code); }
  if (b.course_name !== undefined) { updates.push('course_name=?'); vals.push(b.course_name); }
  if (b.exam_session !== undefined) { updates.push('exam_session=?'); vals.push(b.exam_session); }
  if (b.term !== undefined) { updates.push('term=?'); vals.push(b.term); }
  if (b.evaluation_type !== undefined) { updates.push('evaluation_type=?'); vals.push(b.evaluation_type); }
  if (b.marksheet_no !== undefined) { updates.push('marksheet_no=?'); vals.push(b.marksheet_no); }
  if (b.issue_date !== undefined) { updates.push('issued_at=?'); vals.push(b.issue_date); }
  if (b.total_max !== undefined) { updates.push('total_max=?'); vals.push(+b.total_max); }
  if (b.total_obtained !== undefined) { updates.push('total_obtained=?'); vals.push(+b.total_obtained); }
  if (b.percentage !== undefined) { updates.push('percentage=?'); vals.push(+b.percentage); }
  if (b.grade !== undefined) { updates.push('grade=?'); vals.push(b.grade); }
  if (b.result !== undefined) { updates.push('result=?'); vals.push(b.result); }
  if (b.subjects !== undefined) {
    const subsStr = typeof b.subjects === 'string' ? b.subjects : JSON.stringify(b.subjects);
    updates.push('subjects=?'); vals.push(subsStr);
  }

  if (updates.length > 0) {
    vals.push(mid, mid);
    try {
      db.prepare(`UPDATE marksheets SET ${updates.join(', ')} WHERE id=? OR student_id=?`).run(...vals);
    } catch (_) {}
  }
  const mrk = db.prepare('SELECT * FROM marksheets WHERE id=? OR student_id=?').get(mid, mid) || { id: mid, ...b };
  res.json({ ok: true, message: 'Marksheet details and marks updated successfully!', marksheet: mrk });
}));

// Wallets & Financial Ledger
router.get('/wallets', (req, res) => {
  const rows = db.prepare(`SELECT c.id AS centre_id, COALESCE(w.balance_paise, 0) AS balance_paise, c.name AS centre_name, c.centre_code, c.district, c.state, c.status AS centre_status
    FROM centres c
    LEFT JOIN wallets w ON w.centre_id=c.id
    ORDER BY balance_paise DESC, c.id DESC`).all();
  res.json({ wallets: rows });
});

router.get('/fees', (req, res) => res.json({ fees: require('../fees').all() }));
router.put('/fees', (req, res) => {
  const fees = require('../fees');
  const item = str(req.body.item, 20);
  const paise = Math.round(+req.body.amount_rupees * 100);
  fees.setFee(item, paise, req.user.id);
  audit(req, 'fees.update', 'fee_policy', null, 'ok', `${item}=${paise}`);
  res.json({ ok: true, fees: fees.all() });
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

// ─── Wallet Top-Up Requests Management (Head Office) ─────────────────────────
router.get('/wallet-topups', (req, res) => {
  const status = req.query.status;
  let q = `
    SELECT r.*, c.name AS centre_name, c.centre_code, c.district, c.state,
      COALESCE(w.balance_paise, 0) AS current_balance_paise,
      u.name AS reviewer_name
    FROM wallet_topup_requests r
    JOIN centres c ON c.id=r.centre_id
    LEFT JOIN wallets w ON w.centre_id=c.id
    LEFT JOIN users u ON u.id=r.reviewed_by
  `;
  const params = [];
  if (status) {
    q += ' WHERE r.status=?';
    params.push(status);
  }
  q += " ORDER BY CASE WHEN r.status='pending' THEN 0 ELSE 1 END, r.id DESC LIMIT 100";
  const rows = db.prepare(q).all(...params);
  const pendingCount = (db.prepare("SELECT COUNT(*) AS c FROM wallet_topup_requests WHERE status='pending'").get() || {}).c || 0;
  res.json({ requests: rows, pending_count: pendingCount });
});

router.post('/wallet-topups/:id/approve', (req, res) => {
  const reqId = +req.params.id;
  const topup = db.prepare(`
    SELECT r.*, c.name AS centre_name, c.centre_code
    FROM wallet_topup_requests r
    JOIN centres c ON c.id=r.centre_id
    WHERE r.id=?
  `).get(reqId);

  if (!topup) throw new HttpError(404, 'Top-up request not found');
  if (topup.status !== 'pending') throw new HttpError(409, `Request is already ${topup.status}`);

  const cid = topup.centre_id;
  const amountPaise = topup.amount_paise;

  const newBal = db.transaction(() => {
    const w = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(cid) || { balance_paise: 0 };
    const updatedBal = w.balance_paise + amountPaise;

    db.prepare('INSERT INTO wallets(centre_id, balance_paise) VALUES(?,?) ON CONFLICT(centre_id) DO UPDATE SET balance_paise=excluded.balance_paise')
      .run(cid, updatedBal);

    const ref = `TOPUP-REQ-${topup.id}-${Date.now().toString().slice(-4)}`;
    const desc = `Top-Up Approved (UTR: ${topup.utr_number || 'N/A'}, Mode: ${(topup.payment_mode || 'upi').toUpperCase()})`;

    db.prepare(`
      INSERT INTO wallet_transactions(centre_id, kind, amount_paise, balance_after, reference, description, created_by, created_at)
      VALUES(?, 'credit', ?, ?, ?, ?, ?, ?)
    `).run(cid, amountPaise, updatedBal, ref, desc, req.user.id, now());

    db.prepare(`
      UPDATE wallet_topup_requests
      SET status='approved', reviewed_by=?, reviewed_at=?
      WHERE id=?
    `).run(req.user.id, now(), reqId);

    return updatedBal;
  })();

  audit(req, 'wallet_topup.approve', 'wallet_topup_requests', reqId, 'ok', `Approved ₹${amountPaise / 100} for ${topup.centre_name}`);
  res.json({
    ok: true,
    id: reqId,
    status: 'approved',
    credited_rupees: amountPaise / 100,
    credited_paise: amountPaise,
    balance_paise: newBal,
    centre_id: cid
  });
});

router.post('/wallet-topups/:id/reject', (req, res) => {
  const reqId = +req.params.id;
  const reason = str(req.body.reason, 250) || 'Payment verification failed / UTR mismatch';
  const topup = db.prepare('SELECT * FROM wallet_topup_requests WHERE id=?').get(reqId);

  if (!topup) throw new HttpError(404, 'Top-up request not found');
  if (topup.status !== 'pending') throw new HttpError(409, `Request is already ${topup.status}`);

  db.prepare(`
    UPDATE wallet_topup_requests
    SET status='rejected', rejection_reason=?, reviewed_by=?, reviewed_at=?
    WHERE id=?
  `).run(reason, req.user.id, now(), reqId);

  audit(req, 'wallet_topup.reject', 'wallet_topup_requests', reqId, 'ok', reason);
  res.json({ ok: true, id: reqId, status: 'rejected', rejection_reason: reason });
});

// Head Office Payment Settings (Admin view and update)
router.get('/headoffice-payment-settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM headoffice_payment_settings WHERE id=1').get() || {
    upi_id: 'pescouncil@upi',
    upi_name: 'Purvanchal Education and Skill Council',
    qr_code_image: '/img/pesc-logo.png',
    bank_name: 'State Bank of India',
    account_number: '39820192830',
    ifsc_code: 'SBIN0001234',
    whatsapp_number: '919876543210'
  };
  res.json({ settings });
});

const handleUpdatePaymentSettings = (req, res) => {
  const b = req.body;
  const upiId = str(b.upi_id, 80) || 'pescouncil@upi';
  const upiName = str(b.upi_name, 100) || 'Purvanchal Education and Skill Council';
  const bankName = str(b.bank_name, 100) || 'State Bank of India';
  const accountNo = str(b.account_number, 50) || '';
  const ifscCode = str(b.ifsc_code, 30) || '';
  const qrImage = str(b.qr_code_image, 255) || '/img/pesc-logo.png';
  const wa = str(b.whatsapp_number, 30) || '919876543210';

  db.prepare(`
    INSERT INTO headoffice_payment_settings(id, upi_id, upi_name, qr_code_image, bank_name, account_number, ifsc_code, whatsapp_number)
    VALUES(1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      upi_id=excluded.upi_id,
      upi_name=excluded.upi_name,
      qr_code_image=excluded.qr_code_image,
      bank_name=excluded.bank_name,
      account_number=excluded.account_number,
      ifsc_code=excluded.ifsc_code,
      whatsapp_number=excluded.whatsapp_number
  `).run(upiId, upiName, qrImage, bankName, accountNo, ifscCode, wa);

  audit(req, 'headoffice_payment.update', 'headoffice_payment_settings', 1, 'ok');
  res.json({ ok: true });
};
router.put('/headoffice-payment-settings', handleUpdatePaymentSettings);
router.post('/headoffice-payment-settings', handleUpdatePaymentSettings);

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
  const coordinator_id = (b.coordinator_id && !isNaN(+b.coordinator_id)) ? +b.coordinator_id : null;

  if (!name || !owner_name || !email || !slug) throw new HttpError(400, 'Name, owner name, email, and subdomain are required');
  if (resolveSlug(slug)) throw new HttpError(409, 'Subdomain is already taken');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new HttpError(409, 'Email is already registered');

  const hashed = await argon2.hash(password);

  const result = db.transaction(() => {
    const centreCode = nextCentreCode();

    const u = db.prepare("INSERT INTO users(email,name,mobile,password_hash,role,state,status,created_at) VALUES(?,?,?,?,'centre_owner',?,'active',?)")
      .run(email, owner_name, mobile, hashed, state, now());
    const ownerUserId = u.lastInsertRowid;

    const c = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,coordinator_id,state,district,address,pin,status,created_at) VALUES(?,?,?,?,?,?,?,?,?, 'active', ?)")
      .run(centreCode, name, slug, ownerUserId, coordinator_id, state, district, address, pin, now());
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
  const s = db.prepare('SELECT s.*, co.name AS course_name, co.subjects AS course_subjects, c.centre_code FROM students s JOIN courses co ON co.id=s.course_id JOIN centres c ON c.id=s.centre_id WHERE s.id=?').get(studentId);
  if (!s) throw new HttpError(404, 'Student not found');

  const rollNo = str(b.roll_no, 30) || s.student_code;
  const session = str(b.exam_session, 30) || s.session || '2026';
  const evaluationType = b.evaluation_type === 'semester' ? 'semester' : 'yearly';
  const term = str(b.term, 50) || (evaluationType === 'semester' ? 'Semester 1' : 'Annual');
  const totalMax = +b.total_max || 400;
  const totalObt = +b.total_obtained || 320;
  const pct = Math.round((totalObt / totalMax) * 1000) / 10;
  const grade = b.grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C');
  const result = b.result || 'PASS';

  let subjects = b.subjects;
  if (!subjects) {
    try {
      const parsed = JSON.parse(s.course_subjects || '[]');
      if (parsed.length) {
        const perSub = Math.round(totalObt / parsed.length);
        subjects = parsed.map(sub => ({
          code: sub.code,
          name: sub.name,
          max_theory: sub.max_theory || 70,
          obt_theory: Math.round(perSub * 0.7),
          max_practical: sub.max_practical || 30,
          obt_practical: Math.round(perSub * 0.3),
          total_max: sub.total_max || 100,
          total_obt: perSub
        }));
      }
    } catch (_) {}
  }
  if (!subjects) {
    subjects = [
      { code: 'TH01', name: 'Theory Paper 1', max: 100, obt: Math.round(totalObt * 0.25) },
      { code: 'TH02', name: 'Theory Paper 2', max: 100, obt: Math.round(totalObt * 0.25) },
      { code: 'PR01', name: 'Practical Assessment', max: 100, obt: Math.round(totalObt * 0.25) },
      { code: 'PR02', name: 'Viva & Project Work', max: 100, obt: Math.round(totalObt * 0.25) }
    ];
  }

  const year = new Date().getFullYear();
  const mNum = counter('marksheet:' + year);
  const marksheetNo = `PESC/MRK/${year}/${String(mNum).padStart(6, '0')}`;
  const token = rand(32);

  const r = db.prepare(`INSERT INTO marksheets(marksheet_no,token,student_id,centre_id,course_id,exam_session,roll_no,subjects,total_max,total_obtained,percentage,grade,result,status,issue_date,decided_by,evaluation_type,term,created_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'Approved',?,?,?,?,?)`)
    .run(marksheetNo, token, s.id, s.centre_id, s.course_id, session, rollNo, typeof subjects === 'string' ? subjects : JSON.stringify(subjects), totalMax, totalObt, pct, grade, result, now(), req.user.id, evaluationType, term, now());

  audit(req, 'marksheet.direct_issue', 'marksheet', r.lastInsertRowid, 'ok', marksheetNo);
  res.status(201).json({ id: r.lastInsertRowid, marksheet_no: marksheetNo, token, percentage: pct, grade, evaluation_type: evaluationType, term });
});

// Direct Certificate Generation by Admin
router.post('/certificates/direct-issue', (req, res) => {
  const studentId = +req.body.student_id;
  const evaluationType = req.body.evaluation_type === 'semester' ? 'semester' : 'yearly';
  const term = str(req.body.term, 50) || (evaluationType === 'semester' ? 'Semester 1' : 'Annual');
  const s = db.prepare('SELECT * FROM students WHERE id=?').get(studentId);
  if (!s) throw new HttpError(404, 'Student not found');

  const year = new Date().getFullYear();
  const cNum = counter('cert:' + year);
  const certNo = `PESC/${year}/${String(cNum).padStart(6, '0')}`;
  const token = rand(32);

  const r = db.prepare(`INSERT INTO certificates(cert_no,token,student_id,centre_id,course_id,status,issued_at,decided_by,evaluation_type,term,created_at)
    VALUES(?,?,?,?,?,'Valid',?,?,?,?,?)`)
    .run(certNo, token, s.id, s.centre_id, s.course_id, now(), req.user.id, evaluationType, term, now());

  audit(req, 'certificate.direct_issue', 'certificate', r.lastInsertRowid, 'ok', certNo);
  res.status(201).json({ id: r.lastInsertRowid, cert_no: certNo, token, evaluation_type: evaluationType, term });
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

// Centre Affiliation Certificate Endpoints (Admin)
router.get('/centres/:id/affiliation-cert', (req, res) => {
  const cid = +req.params.id;
  const c = db.prepare('SELECT * FROM centres WHERE id=?').get(cid);
  if (!c) throw new HttpError(404, 'Centre not found');

  let owner = null;
  if (c.owner_user_id) owner = db.prepare('SELECT id, name, email, mobile, photo_url FROM users WHERE id=?').get(c.owner_user_id);
  if (!owner) owner = db.prepare("SELECT id, name, email, mobile, photo_url FROM users WHERE centre_id=? AND role='centre_owner'").get(cid);

  // Fallback to franchise application photo
  const app = db.prepare("SELECT photo_url, owner_name FROM franchise_applications WHERE centre_id=? OR (email=? AND status='Approved') ORDER BY id DESC LIMIT 1")
    .get(cid, c.email || (owner ? owner.email : ''));

  const director_photo = c.director_photo || (owner ? owner.photo_url : null) || (app ? app.photo_url : null) || null;

  // Coordinator info (assigned or first active)
  let coord = null;
  if (c.coordinator_id) {
    coord = db.prepare("SELECT id, name, email, mobile, state, seal_url, signature_url FROM users WHERE id=?").get(c.coordinator_id);
  }
  if (!coord) {
    coord = db.prepare("SELECT id, name, email, mobile, state, seal_url, signature_url FROM users WHERE role='coordinator' AND (state=? OR status='active') ORDER BY id ASC LIMIT 1").get(c.state);
  }
  if (!coord) {
    coord = db.prepare("SELECT id, name, email, mobile, state, seal_url, signature_url FROM users WHERE role='coordinator' ORDER BY id ASC LIMIT 1").get() || { name: 'Regional Coordinator', state: c.state };
  }

  // Head Office super admin
  const ho = db.prepare("SELECT id, name, email, mobile, logo_url, website, seal_url, signature_url FROM users WHERE role='super_admin' ORDER BY id ASC LIMIT 1").get() || {};
  const hoLogo = ho.logo_url || '/assets/img/logo_council.svg';
  const hoSeal = ho.seal_url || '/assets/img/seal_council_head.svg';
  const hoSign = ho.signature_url || '/assets/img/sign_council_head.svg';
  const hoWebsite = ho.website || 'https://pescouncil.in';

  const courses = db.prepare(`SELECT co.code FROM courses co JOIN centre_courses cc ON cc.course_id=co.id WHERE cc.centre_id=? AND co.active=1`).all(cid);
  const authorized_courses = courses.length ? courses.map(x => x.code).join(', ') : 'DCA, ADCA, TALLY, CCC, PGDCA, DTP';

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

  res.json({
    certificate: {
      centre_id: c.id,
      name: c.name,
      centre_code: c.centre_code,
      slug: c.slug,
      director_name: c.director_name || (owner ? owner.name : 'Centre Director'),
      director_photo,
      council_logo_url: hoLogo,
      logo_url: hoLogo,
      address: c.address || `${c.district}, ${c.state}`,
      district: c.district,
      state: c.state,
      pin: c.pin || '221001',
      phone: c.phone || (owner ? owner.mobile : ''),
      email: c.email || (owner ? owner.email : ''),
      cert_no: c.affiliation_cert_no || `PESC/ATC/2026/${c.centre_code}`,
      issue_date: c.affiliation_issue_date || todayStr,
      valid_thru: c.affiliation_valid_thru || '31-03-2029',
      session: c.affiliation_session || '2026 - 2029 (3 Academic Years)',
      status: c.status === 'active' ? 'Authorized' : c.status,
      authorized_courses,
      coordinator: {
        name: coord.name,
        state: coord.state,
        seal_url: coord.seal_url || null,
        signature_url: coord.signature_url || null,
      },
      head_office: {
        name: ho.name || 'Head Office',
        logo_url: hoLogo,
        seal_url: hoSeal,
        signature_url: hoSign,
        mobile: ho.mobile || '+91 91290 85551',
        email: ho.email || 'info@pescouncil.in',
        website: hoWebsite,
        address: 'Head Office: Gorakhpur / Lucknow, UP - 273001'
      }
    }
  });
});

const handleAffiliationCertUpdate = (req, res) => {
  const cid = +req.params.id;
  const b = req.body || {};
  db.prepare(`UPDATE centres SET
    affiliation_cert_no=COALESCE(?, affiliation_cert_no),
    affiliation_issue_date=COALESCE(?, affiliation_issue_date),
    affiliation_valid_thru=COALESCE(?, affiliation_valid_thru),
    affiliation_session=COALESCE(?, affiliation_session),
    director_photo=COALESCE(?, director_photo),
    director_name=COALESCE(?, director_name),
    name=COALESCE(?, name),
    address=COALESCE(?, address)
    WHERE id=?`).run(
    b.cert_no || b.affiliation_cert_no || null,
    b.issue_date || b.affiliation_issue_date || null,
    b.valid_thru || b.affiliation_valid_thru || null,
    b.session || b.affiliation_session || null,
    b.director_photo || null,
    b.director_name || null,
    b.name || null,
    b.address || null,
    cid
  );
  audit(req, 'centre.affiliation_cert_update', 'centre', cid, 'ok');
  res.json({ ok: true, message: 'Affiliation certificate details updated successfully!' });
};

router.post('/centres/:id/affiliation-cert', handleAffiliationCertUpdate);
router.put('/centres/:id/affiliation-cert', handleAffiliationCertUpdate);

// Admin Profile Endpoints
router.get('/profile', (req, res) => {
  let u = db.prepare('SELECT id, name, email, mobile, role, state, photo_url, logo_url, seal_url, signature_url, website, address, created_at FROM users WHERE id=?').get(req.user.id);
  if (!u) u = req.user;
  res.json({
    profile: {
      ...u,
      designation: 'Executive Director & Controller of Examinations',
      head_office: u.address || 'Purvanchal Education & Skill Council, Head Office, Gorakhpur / Lucknow, UP',
      badge_id: 'PESC-HQ-001',
      state: u.state || 'National Headquarters (India)',
      logo_url: u.logo_url || null,
      seal_url: u.seal_url || null,
      signature_url: u.signature_url || null,
      photo_url: u.photo_url || null,
      website: u.website || 'https://pescouncil.in'
    }
  });
});

router.post('/profile', (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 100);
  const email = str(b.email, 150);
  const mobile = str(b.mobile, 20);
  const photo_url = b.photo_url || null;
  const logo_url = b.logo_url || null;
  const seal_url = b.seal_url || null;
  const signature_url = b.signature_url || null;
  const state = str(b.state, 100);
  const website = str(b.website, 200);
  const address = str(b.head_office || b.address, 300);

  try {
    db.prepare(`UPDATE users SET
      name=COALESCE(?, name),
      email=COALESCE(?, email),
      mobile=COALESCE(?, mobile),
      photo_url=COALESCE(?, photo_url),
      logo_url=COALESCE(?, logo_url),
      seal_url=COALESCE(?, seal_url),
      signature_url=COALESCE(?, signature_url),
      state=COALESCE(?, state),
      website=COALESCE(?, website),
      address=COALESCE(?, address)
      WHERE id=?`)
      .run(name || null, email || null, mobile || null, photo_url, logo_url, seal_url, signature_url, state || null, website || null, address || null, req.user.id);
  } catch (err) {
    console.error('Admin profile update error:', err);
  }
  audit(req, 'admin.profile_update', 'user', req.user.id, 'ok');
  res.json({ ok: true, message: 'Admin profile updated successfully!' });
});

router.post('/change-password', (req, res) => {
  const np = str(req.body.new_password, 100);
  if (!np || np.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  const bcrypt = require('bcryptjs');
  const hashed = bcrypt.hashSync(np, 10);
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hashed, req.user.id);
  audit(req, 'admin.password_change', 'user', req.user.id, 'ok');
  res.json({ ok: true, message: 'Password changed successfully!' });
});

module.exports = router;

