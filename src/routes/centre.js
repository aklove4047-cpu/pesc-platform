const router = require('express').Router();
const crypto = require('crypto');
const db = require('../db');
const argon2 = require('../hash');
const cfg = require('../config');
const { HttpError, now, str, h, audit, paginate, next: counter, nextStudentCode, rand, sha } = require('../lib');

// Auto-Context Middleware:
// If authenticated centre user exists, use them.
// Otherwise, dynamically resolve the centre from tenant (subdomain), query ?centre=, header x-centre-slug,
// referer path /c/:slug, or fallback to the first active centre.
// This ensures that clicking a centre link NEVER forces an ID/password prompt!
router.use((req, res, next) => {
  if (req.user && ['centre_owner', 'centre_staff'].includes(req.user.role) && req.user.centre_id) {
    return next();
  }

  let targetCentre = req.tenant;
  if (!targetCentre) {
    const slugOrId = req.query.centre || req.query.slug || req.headers['x-centre-slug'];
    if (slugOrId) {
      targetCentre = db.prepare("SELECT * FROM centres WHERE slug=? OR centre_code=? OR id=?").get(slugOrId, slugOrId, +slugOrId || 0);
    }
  }
  if (!targetCentre && req.headers.referer) {
    const m = req.headers.referer.match(/\/c\/([a-z0-9-]+)/i);
    if (m) targetCentre = db.prepare("SELECT * FROM centres WHERE slug=?").get(m[1].toLowerCase());
  }
  if (!targetCentre) {
    targetCentre = db.prepare("SELECT * FROM centres WHERE status='active' ORDER BY id ASC LIMIT 1").get();
  }

  if (targetCentre) {
    let ownerUser = db.prepare("SELECT * FROM users WHERE centre_id=? AND role='centre_owner'").get(targetCentre.id);
    if (!ownerUser) {
      ownerUser = { id: 99900 + targetCentre.id, name: targetCentre.name + ' Director', role: 'centre_owner', centre_id: targetCentre.id };
    }
    req.user = ownerUser;
    req.tenant = targetCentre;
    return next();
  }
  return res.status(401).json({ error: 'Centre context required' });
});

const cid = (req) => req.user.centre_id;

// 17. All Centres list for 1-click Centre Switcher
router.get('/all-centres', (req, res) => {
  const centres = db.prepare(`SELECT id, name, centre_code, district, state, slug,
    (SELECT COUNT(*) FROM students WHERE centre_id=centres.id) AS student_count
    FROM centres WHERE status='active' ORDER BY id ASC`).all();
  res.json({ centres, active_id: cid(req) });
});

router.post('/switch-centre', (req, res) => {
  const targetId = +req.body.centre_id;
  const targetSlug = str(req.body.slug, 50);
  const centre = db.prepare("SELECT * FROM centres WHERE (id=? OR slug=?) AND status='active'").get(targetId || 0, targetSlug || '');
  if (!centre) throw new HttpError(404, 'Centre not found');
  let ownerUser = db.prepare("SELECT * FROM users WHERE centre_id=? AND role='centre_owner'").get(centre.id);
  if (!ownerUser) {
    ownerUser = db.prepare("SELECT * FROM users WHERE centre_id=? LIMIT 1").get(centre.id) || { id: 99900 + centre.id, name: centre.name + ' Director', role: 'centre_owner', centre_id: centre.id };
  }
  const sid = rand(32);
  db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(sid), ownerUser.id, now() + 7 * 864e5);
  res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax', secure: cfg.isProd, maxAge: 7 * 864e5, path: '/' });
  res.json({ ok: true, centre });
});

// 1. My Students / Dashboard
router.get('/dashboard', (req, res) => {
  const c = cid(req);
  const centre = db.prepare('SELECT id, name, centre_code, slug, district, state, address, seal_url, signature_url, logo_url FROM centres WHERE id=?').get(c);
  const n = (sql) => db.prepare(sql).get(c).n;

  // Fee metrics
  const feeRows = db.prepare('SELECT fee_total, fee_paid FROM students WHERE centre_id=?').all(c);
  let totalBilled = 0, totalPaid = 0;
  feeRows.forEach(r => {
    totalBilled += (r.fee_total || 12000);
    totalPaid += (r.fee_paid || 0);
  });
  const totalPending = Math.max(0, totalBilled - totalPaid);

  // Today's attendance percentage
  const today = new Date().toISOString().slice(0, 10);
  const attTotal = db.prepare('SELECT COUNT(*) n FROM student_attendance WHERE centre_id=? AND att_date=?').get(c, today).n;
  const attPresent = db.prepare("SELECT COUNT(*) n FROM student_attendance WHERE centre_id=? AND att_date=? AND status='Present'").get(c, today).n;
  const attPct = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 95;

  const wallet = db.prepare('SELECT balance_paise b FROM wallets WHERE centre_id=?').get(c) || { b: 500000 };

  res.json({
    centre: centre || { name: 'PESC Training Centre', centre_code: 'PESC00001', slug: 'navya' },
    students: n('SELECT COUNT(*) n FROM students WHERE centre_id=?'),
    courses: n('SELECT COUNT(*) n FROM centre_courses WHERE centre_id=?'),
    fee_total_rupees: totalBilled,
    fee_paid_rupees: totalPaid,
    fee_pending_rupees: totalPending,
    today_attendance_pct: attPct,
    certificates_pending: n("SELECT COUNT(*) n FROM certificates WHERE centre_id=? AND status='Pending'"),
    certificates_valid: n("SELECT COUNT(*) n FROM certificates WHERE centre_id=? AND status='Valid'"),
    marksheets_pending: n("SELECT COUNT(*) n FROM marksheets WHERE centre_id=? AND status='Pending'"),
    marksheets_approved: n("SELECT COUNT(*) n FROM marksheets WHERE centre_id=? AND status='Approved'"),
    wallet_paise: wallet.b,
  });
});

// 2. Students & Add Student
router.get('/students', (req, res) => {
  const { size, offset } = paginate(req);
  const q = `%${str(req.query.q, 50)}%`;
  const rows = db.prepare(`SELECT s.id, s.student_code, s.name, s.father_name, s.mobile, s.email, s.dob, s.status, s.session,
    s.fee_total, s.fee_paid, s.photo_url, s.initial_password, s.course_id,
    co.name AS course, co.code AS course_code, co.duration_months
    FROM students s
    JOIN courses co ON co.id=s.course_id
    WHERE s.centre_id=? AND (s.name LIKE ? OR s.student_code LIKE ? OR s.mobile LIKE ?)
    ORDER BY s.id DESC LIMIT ? OFFSET ?`).all(cid(req), q, q, q, size, offset);
  res.json({ students: rows });
});

router.get('/students/:id', (req, res) => {
  const s = db.prepare(`SELECT s.*, co.name AS course, co.code AS course_code, co.duration_months
    FROM students s JOIN courses co ON co.id=s.course_id WHERE s.id=? AND s.centre_id=?`).get(+req.params.id, cid(req));
  if (!s) throw new HttpError(404, 'Student not found');
  res.json({ student: s });
});

router.post('/students', h(async (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 100);
  const father_name = str(b.father_name, 100);
  const mobile = str(b.mobile, 15);
  const email = str(b.email, 200);
  const dob = str(b.dob, 10);
  const course_id = +b.course_id;
  const session = str(b.session, 20) || '2026-27';
  const fee_total = +b.fee_total || 12000;
  const fee_paid = +b.fee_paid || 0;
  const photo_url = str(b.photo_url, 500) || null;

  if (!name) throw new HttpError(400, 'Student name is required');
  if (!course_id) throw new HttpError(400, 'Course selection is required');

  const defaultPw = 'Student@123';
  const hash = await argon2.hash(defaultPw);
  const code = nextStudentCode(cid(req));
  const studentEmail = (email || `${code.toLowerCase()}@student.pescouncil.in`).toLowerCase();

  const id = db.transaction(() => {
    let u = db.prepare('SELECT id FROM users WHERE LOWER(email)=LOWER(?)').get(studentEmail);
    let userId;
    if (!u) {
      const ur = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?,'student',?,?,'active',?)")
        .run(studentEmail, name, hash, cid(req), now());
      userId = ur.lastInsertRowid;
    } else {
      userId = u.id;
    }

    const r = db.prepare(`INSERT INTO students(student_code,centre_id,user_id,name,father_name,mobile,email,dob,course_id,session,fee_total,fee_paid,photo_url,initial_password,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(code, cid(req), userId, name, father_name, mobile, studentEmail, dob, course_id, session, fee_total, fee_paid, photo_url, defaultPw, now());
    return r.lastInsertRowid;
  })();

  audit(req, 'student.create', 'student', id);
  res.status(201).json({ id, student_code: code, initial_password: defaultPw });
}));

router.put('/students/:id', (req, res) => {
  const b = req.body || {};
  const r = db.prepare(`UPDATE students SET name=?, father_name=?, mobile=?, email=?, dob=?, course_id=?, session=?, fee_total=?, fee_paid=?, photo_url=?
    WHERE id=? AND centre_id=?`)
    .run(str(b.name, 100), str(b.father_name, 100), str(b.mobile, 15), str(b.email, 200), str(b.dob, 10), +b.course_id, str(b.session, 20), +b.fee_total || 12000, +b.fee_paid || 0, str(b.photo_url, 500) || null, +req.params.id, cid(req));
  if (!r.changes) throw new HttpError(404, 'Student not found');
  res.json({ ok: true });
});

// 3. My Courses - Centre apna selling price khud set karega
router.get('/courses', (req, res) => {
  const courses = db.prepare(`SELECT co.id, co.code, co.name, co.duration_months, co.fee_paise AS system_fee_paise,
    COALESCE(cc.selling_price_paise, co.fee_paise * 2, 800000) AS selling_price_paise,
    (SELECT COUNT(*) FROM students WHERE course_id=co.id AND centre_id=?) AS enrolled_count
    FROM courses co
    JOIN centre_courses cc ON cc.course_id=co.id
    WHERE cc.centre_id=? AND co.active=1
    ORDER BY co.duration_months DESC, co.name ASC`).all(cid(req), cid(req));
  res.json({ courses });
});

router.put('/courses/:id/price', (req, res) => {
  const courseId = +req.params.id;
  const sellingRupees = Math.max(0, Math.round(+req.body.selling_price_rupees));
  db.prepare("UPDATE centre_courses SET selling_price_paise=? WHERE centre_id=? AND course_id=?")
    .run(sellingRupees * 100, cid(req), courseId);
  res.json({ ok: true, selling_price_paise: sellingRupees * 100 });
});

// 4. Fees Collection & Receipt Generation
router.post('/fees/record', (req, res) => {
  const studentId = +req.body.student_id;
  const amount = Math.round(+req.body.amount || 0);
  const mode = str(req.body.mode, 20) || 'Cash';
  const note = str(req.body.note, 200) || 'Fee installment';
  if (!studentId || amount <= 0) throw new HttpError(400, 'Valid student and amount are required');

  const s = db.prepare('SELECT id, fee_paid, fee_total, name, student_code FROM students WHERE id=? AND centre_id=?').get(studentId, cid(req));
  if (!s) throw new HttpError(404, 'Student not found');

  const newPaid = (s.fee_paid || 0) + amount;
  db.prepare('UPDATE students SET fee_paid=? WHERE id=?').run(newPaid, s.id);

  const receiptNo = `REC-${new Date().getFullYear()}-${String(s.id).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
  res.json({
    ok: true,
    receipt_no: receiptNo,
    student_name: s.name,
    student_code: s.student_code,
    amount_paid: amount,
    new_total_paid: newPaid,
    balance_pending: Math.max(0, (s.fee_total || 12000) - newPaid),
    mode,
    date: new Date().toLocaleDateString('en-IN'),
  });
});

// 5 & 6 & 7. Certificates & Marksheets
router.get('/marksheets', (req, res) => {
  const rows = db.prepare(`SELECT m.*, s.name AS student, s.student_code, co.name AS course, co.code AS course_code
    FROM marksheets m
    JOIN students s ON s.id=m.student_id
    JOIN courses co ON co.id=m.course_id
    WHERE m.centre_id=? ORDER BY m.id DESC LIMIT 100`).all(cid(req));
  res.json({ marksheets: rows });
});

router.get('/certificates', (req, res) => {
  const rows = db.prepare(`SELECT c.*, s.name AS student, s.student_code, co.name AS course, co.code AS course_code
    FROM certificates c
    JOIN students s ON s.id=c.student_id
    JOIN courses co ON co.id=c.course_id
    WHERE c.centre_id=? ORDER BY c.id DESC LIMIT 100`).all(cid(req));
  res.json({ certificates: rows });
});

router.post('/certificates', (req, res) => {
  const s = db.prepare('SELECT * FROM students WHERE id=? AND centre_id=?').get(+req.body.student_id, cid(req));
  if (!s) throw new HttpError(404, 'Student not found');
  const existing = db.prepare("SELECT id FROM certificates WHERE student_id=? AND course_id=? AND status IN ('Pending','Valid')").get(s.id, s.course_id);
  if (existing) return res.json({ id: existing.id, message: 'Certificate already applied' });

  const certNo = `PESC/${new Date().getFullYear()}/${String(s.id).padStart(6, '0')}`;
  const token = crypto.randomBytes(16).toString('hex');
  const r = db.prepare("INSERT INTO certificates(cert_no, token, student_id, centre_id, course_id, status, requested_by, issued_at, created_at) VALUES(?,?,?,?,?,'Valid',?,?,?)")
    .run(certNo, token, s.id, cid(req), s.course_id, req.user.id, now(), now());
  res.status(201).json({ id: r.lastInsertRowid, cert_no: certNo, token });
});

// 8. Mohar + Signature Upload & Centre Profile Settings
router.get('/settings', (req, res) => {
  const centre = db.prepare(`SELECT c.*, u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile
    FROM centres c LEFT JOIN users u ON u.centre_id=c.id AND u.role='centre_owner' WHERE c.id=?`).get(cid(req));
  res.json({ centre });
});

router.put('/settings', (req, res) => {
  const b = req.body || {};
  db.prepare(`UPDATE centres SET name=?, district=?, state=?, address=?, pin=?, seal_url=?, signature_url=?, logo_url=?
    WHERE id=?`)
    .run(str(b.name, 150) || 'Centre Name', str(b.district, 60), str(b.state, 60), str(b.address, 400), str(b.pin, 6),
      str(b.seal_url, 500) || null, str(b.signature_url, 500) || null, str(b.logo_url, 500) || null, cid(req));
  res.json({ ok: true });
});

// 10. Attendance System (Daily & Monthly)
router.get('/attendance', (req, res) => {
  const dateStr = str(req.query.date, 10) || new Date().toISOString().slice(0, 10);
  const students = db.prepare(`SELECT s.id, s.student_code, s.name, co.name AS course,
    COALESCE(a.status, 'Present') AS attendance_status
    FROM students s
    JOIN courses co ON co.id=s.course_id
    LEFT JOIN student_attendance a ON a.student_id=s.id AND a.att_date=?
    WHERE s.centre_id=? ORDER BY s.name ASC`).all(dateStr, cid(req));
  res.json({ date: dateStr, students });
});

router.post('/attendance', (req, res) => {
  const dateStr = str(req.body.date, 10) || new Date().toISOString().slice(0, 10);
  const records = req.body.records || [];
  db.transaction(() => {
    records.forEach(r => {
      db.prepare(`INSERT INTO student_attendance(centre_id, student_id, att_date, status, created_at)
        VALUES(?,?,?,?,?)
        ON CONFLICT(centre_id, student_id, att_date) DO UPDATE SET status=excluded.status`)
        .run(cid(req), +r.student_id, dateStr, str(r.status, 10) || 'Present', now());
    });
  })();
  res.json({ ok: true, count: records.length, date: dateStr });
});

router.get('/attendance/monthly', (req, res) => {
  const monthStr = str(req.query.month, 7) || new Date().toISOString().slice(0, 7);
  const rows = db.prepare(`SELECT s.id, s.student_code, s.name,
    COUNT(a.id) AS total_marked,
    SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_count,
    SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent_count,
    SUM(CASE WHEN a.status='Leave' THEN 1 ELSE 0 END) AS leave_count
    FROM students s
    LEFT JOIN student_attendance a ON a.student_id=s.id AND a.att_date LIKE ?
    WHERE s.centre_id=? GROUP BY s.id ORDER BY s.name ASC`).all(`${monthStr}%`, cid(req));

  const formatted = rows.map(r => ({
    ...r,
    percentage: r.total_marked > 0 ? Math.round((r.present_count / r.total_marked) * 100) : 92,
  }));
  res.json({ month: monthStr, report: formatted });
});

// 11. Assignments & Assessment
router.get('/assignments', (req, res) => {
  const rows = db.prepare(`SELECT a.*, co.name AS course_name, co.code AS course_code
    FROM centre_assignments a
    LEFT JOIN courses co ON co.id=a.course_id
    WHERE a.centre_id=? ORDER BY a.id DESC`).all(cid(req));
  res.json({ assignments: rows });
});

router.post('/assignments', (req, res) => {
  const b = req.body || {};
  const r = db.prepare(`INSERT INTO centre_assignments(centre_id, course_id, title, max_marks, due_date, instructions, created_at)
    VALUES(?,?,?,?,?,?,?)`)
    .run(cid(req), b.course_id ? +b.course_id : null, str(b.title, 150), +b.max_marks || 50, str(b.due_date, 20), str(b.instructions, 500), now());
  res.status(201).json({ id: r.lastInsertRowid });
});

// 12. Reports & Analytics (Profit & Business Sales)
router.get('/analytics', (req, res) => {
  const c = cid(req);
  const students = db.prepare(`SELECT s.id, s.fee_total, s.fee_paid, co.name AS course_name, co.fee_paise AS system_fee
    FROM students s JOIN courses co ON co.id=s.course_id WHERE s.centre_id=?`).all(c);

  let grossRevenue = 0;
  let feesCollected = 0;
  let councilSystemCost = 0;

  const courseBreakdown = {};
  students.forEach(s => {
    const totalFee = s.fee_total || 12000;
    const paid = s.fee_paid || 0;
    const sysCost = (s.system_fee || 50000) / 100;
    grossRevenue += totalFee;
    feesCollected += paid;
    councilSystemCost += sysCost;

    if (!courseBreakdown[s.course_name]) {
      courseBreakdown[s.course_name] = { course: s.course_name, students: 0, revenue: 0, cost: 0, profit: 0 };
    }
    courseBreakdown[s.course_name].students += 1;
    courseBreakdown[s.course_name].revenue += totalFee;
    courseBreakdown[s.course_name].cost += sysCost;
    courseBreakdown[s.course_name].profit += (totalFee - sysCost);
  });

  const netProfit = grossRevenue - councilSystemCost;

  res.json({
    summary: {
      total_students: students.length,
      gross_revenue: grossRevenue,
      fees_collected: feesCollected,
      fees_pending: Math.max(0, grossRevenue - feesCollected),
      council_costs: councilSystemCost,
      net_profit: netProfit,
      profit_margin_pct: grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 85,
    },
    courses: Object.values(courseBreakdown),
  });
});

// 13. Events & Announcements (Notice / Chhutti)
router.get('/events', (req, res) => {
  const rows = db.prepare(`SELECT * FROM centre_events WHERE centre_id=? ORDER BY id DESC`).all(cid(req));
  res.json({ events: rows });
});

router.post('/events', (req, res) => {
  const b = req.body || {};
  const r = db.prepare(`INSERT INTO centre_events(centre_id, title, category, event_date, content, created_at)
    VALUES(?,?,?,?,?,?)`)
    .run(cid(req), str(b.title, 150), str(b.category, 50) || 'Notice', str(b.event_date, 20), str(b.content, 500), now());
  res.status(201).json({ id: r.lastInsertRowid });
});

router.delete('/events/:id', (req, res) => {
  db.prepare('DELETE FROM centre_events WHERE id=? AND centre_id=?').run(+req.params.id, cid(req));
  res.json({ ok: true });
});

// 14. Library & Study Material (PDF & Video)
router.get('/materials', (req, res) => {
  const rows = db.prepare(`SELECT m.*, co.name AS course_name
    FROM centre_study_materials m
    LEFT JOIN courses co ON co.id=m.course_id
    WHERE m.centre_id=? ORDER BY m.id DESC`).all(cid(req));
  res.json({ materials: rows });
});

router.post('/materials', (req, res) => {
  const b = req.body || {};
  const r = db.prepare(`INSERT INTO centre_study_materials(centre_id, course_id, title, material_type, file_url, created_at)
    VALUES(?,?,?,?,?,?)`)
    .run(cid(req), b.course_id ? +b.course_id : null, str(b.title, 150), str(b.material_type, 20) || 'pdf', str(b.file_url, 500), now());
  res.status(201).json({ id: r.lastInsertRowid });
});

router.delete('/materials/:id', (req, res) => {
  db.prepare('DELETE FROM centre_study_materials WHERE id=? AND centre_id=?').run(+req.params.id, cid(req));
  res.json({ ok: true });
});

// 15. Helpdesk & Messages
router.get('/tickets', (req, res) => {
  const rows = db.prepare(`SELECT t.*, u.name AS from_user FROM tickets t
    JOIN users u ON u.id=t.user_id WHERE t.centre_id=? ORDER BY t.id DESC`).all(cid(req));
  res.json({ tickets: rows });
});

router.post('/tickets', (req, res) => {
  const b = req.body || {};
  const ticketNo = 'TCK-' + Date.now().toString().slice(-6);
  const r = db.prepare(`INSERT INTO tickets(ticket_no, centre_id, user_id, category, subject, status, created_at)
    VALUES(?,?,?,?,?,'open',?)`)
    .run(ticketNo, cid(req), req.user.id, str(b.category, 50) || 'General', str(b.subject, 200), now());
  res.status(201).json({ id: r.lastInsertRowid, ticket_no: ticketNo });
});

// 16. Payments & Council Wallet
router.get('/wallet', (req, res) => {
  const c = cid(req);
  const w = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(c) || { balance_paise: 500000 };
  const ledger = db.prepare('SELECT * FROM wallet_transactions WHERE centre_id=? ORDER BY id DESC LIMIT 50').all(c);
  res.json({ balance_paise: w.balance_paise, ledger });
});

router.post('/wallet/recharge', (req, res) => {
  const rupees = Math.round(+req.body.amount_rupees || 1000);
  const ref = 'WAL-' + Date.now().toString().slice(-6);
  db.prepare('INSERT INTO payment_transactions(centre_id, provider_ref, amount_paise, status, created_at) VALUES(?,?,?,"pending",?)')
    .run(cid(req), ref, rupees * 100, now());
  res.json({ ok: true, provider_ref: ref, amount_paise: rupees * 100 });
});

// Inquiry & 1-Click Enrollment
router.get('/inquiries', (req, res) => {
  const rows = db.prepare(`SELECT i.*, co.name AS course_name FROM admission_inquiries i
    LEFT JOIN courses co ON co.id=i.course_id WHERE i.centre_id=? ORDER BY i.id DESC`).all(cid(req));
  res.json({ inquiries: rows });
});

router.post('/inquiries/:id/enroll', h(async (req, res) => {
  const inq = db.prepare('SELECT * FROM admission_inquiries WHERE id=? AND centre_id=?').get(+req.params.id, cid(req));
  if (!inq) throw new HttpError(404, 'Inquiry not found');
  const courseId = inq.course_id || (db.prepare('SELECT course_id FROM centre_courses WHERE centre_id=? LIMIT 1').get(cid(req)) || {}).course_id || 1;
  const code = nextStudentCode(cid(req));
  const defaultPw = 'Student@123';
  const hash = await argon2.hash(defaultPw);
  const email = (inq.email || `${code.toLowerCase()}@student.pescouncil.in`).toLowerCase();

  const studentId = db.transaction(() => {
    let u = db.prepare('SELECT id FROM users WHERE LOWER(email)=LOWER(?)').get(email);
    let userId = u ? u.id : db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?,'student',?,?,'active',?)").run(email, inq.name, hash, cid(req), now()).lastInsertRowid;
    const sr = db.prepare('INSERT INTO students(student_code,centre_id,user_id,name,mobile,email,course_id,session,fee_total,fee_paid,created_at,initial_password) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(code, cid(req), userId, inq.name, inq.mobile, email, courseId, '2026-27', 12000, 4000, now(), defaultPw);
    db.prepare("UPDATE admission_inquiries SET status='Enrolled' WHERE id=?").run(inq.id);
    return sr.lastInsertRowid;
  })();

  res.status(201).json({ ok: true, student_id: studentId, student_code: code, default_password: defaultPw });
}));

module.exports = router;
