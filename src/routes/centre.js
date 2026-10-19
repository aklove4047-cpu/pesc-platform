const router = require('express').Router();
const crypto = require('crypto');
const db = require('../db');
const argon2 = require('../hash');
const { requireRole } = require('../auth');
const { HttpError, now, str, h, audit, paginate, next: counter, nextStudentCode } = require('../lib');

router.use(requireRole('centre_owner', 'centre_staff'));
const cid = (req) => req.user.centre_id;

router.get('/dashboard', (req, res) => {
  const c = cid(req); const n = (sql) => db.prepare(sql).get(c).n;
  res.json({
    centre: { name: req.tenant ? req.tenant.name : db.prepare('SELECT name FROM centres WHERE id=?').get(c).name },
    students: n('SELECT COUNT(*) n FROM students WHERE centre_id=?'), courses: n('SELECT COUNT(*) n FROM centre_courses WHERE centre_id=?'),
    certificates_pending: n("SELECT COUNT(*) n FROM certificates WHERE centre_id=? AND status='Pending'"), certificates_valid: n("SELECT COUNT(*) n FROM certificates WHERE centre_id=? AND status='Valid'"),
    marksheets_pending: n("SELECT COUNT(*) n FROM marksheets WHERE centre_id=? AND status='Pending'"), marksheets_approved: n("SELECT COUNT(*) n FROM marksheets WHERE centre_id=? AND status='Approved'"),
    wallet_paise: (db.prepare('SELECT balance_paise b FROM wallets WHERE centre_id=?').get(c) || { b: 0 }).b,
  });
});
router.get('/courses', (req, res) => res.json({ courses: db.prepare('SELECT co.id,co.code,co.name,co.duration_months,co.fee_paise FROM courses co JOIN centre_courses cc ON cc.course_id=co.id WHERE cc.centre_id=? AND co.active=1').all(cid(req)) }));

router.get('/students', (req, res) => {
  const { size, offset } = paginate(req); const q = `%${str(req.query.q, 50)}%`;
  const rows = db.prepare(`SELECT s.id,s.student_code,s.name,s.mobile,s.status,co.name AS course FROM students s JOIN courses co ON co.id=s.course_id
    WHERE s.centre_id=? AND (s.name LIKE ? OR s.student_code LIKE ? OR s.mobile LIKE ?) ORDER BY s.id DESC LIMIT ? OFFSET ?`).all(cid(req), q, q, q, size, offset);
  res.json({ students: rows });
});
router.get('/students/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM students WHERE id=? AND centre_id=?').get(+req.params.id, cid(req));
  if (!s) throw new HttpError(404, 'Student not found'); res.json({ student: s });
});
function studentInput(req) {
  const b = req.body, s = { name: str(b.name, 100), father_name: str(b.father_name, 100), mobile: str(b.mobile, 15), email: str(b.email, 200), dob: str(b.dob, 10), course_id: +b.course_id, session: str(b.session, 20) };
  if (!s.name) throw new HttpError(400, 'Student name is required');
  if (s.mobile && !/^[6-9]\d{9}$/.test(s.mobile)) throw new HttpError(400, 'Invalid mobile');
  if (s.dob && !/^\d{4}-\d{2}-\d{2}$/.test(s.dob)) throw new HttpError(400, 'DOB must be YYYY-MM-DD');
  if (!db.prepare('SELECT 1 FROM centre_courses WHERE centre_id=? AND course_id=?').get(cid(req), s.course_id)) throw new HttpError(400, 'Course is not assigned to this centre');
  return s;
}
router.post('/students', (req, res) => {
  const s = studentInput(req);
  let code;
  const id = db.transaction(() => {
    code = nextStudentCode(cid(req));
    return db.prepare('INSERT INTO students(student_code,centre_id,name,father_name,mobile,email,dob,course_id,session,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)')
      .run(code, cid(req), s.name, s.father_name, s.mobile, s.email, s.dob, s.course_id, s.session, now()).lastInsertRowid;
  })();
  audit(req, 'student.create', 'student', id); res.status(201).json({ id, student_code: code });
});
router.put('/students/:id', (req, res) => {
  const s = studentInput(req);
  const r = db.prepare('UPDATE students SET name=?,father_name=?,mobile=?,email=?,dob=?,course_id=?,session=? WHERE id=? AND centre_id=?').run(s.name, s.father_name, s.mobile, s.email, s.dob, s.course_id, s.session, +req.params.id, cid(req));
  if (!r.changes) throw new HttpError(404, 'Student not found'); audit(req, 'student.update', 'student', req.params.id); res.json({ ok: true });
});

router.post('/students/:id/account', h(async (req, res) => {
  const s = db.prepare('SELECT * FROM students WHERE id=? AND centre_id=?').get(+req.params.id, cid(req));
  if (!s) throw new HttpError(404, 'Student not found');
  const password = String(req.body.password || 'Student@12345');
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters');
  const hash = await argon2.hash(password);
  const email = (s.email || `${s.student_code.toLowerCase()}@student.pescouncil.in`).toLowerCase();

  db.transaction(() => {
    let u = db.prepare('SELECT id FROM users WHERE LOWER(email)=LOWER(?)').get(email);
    if (!u) {
      const r = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?, 'student', ?, ?, 'active', ?)")
        .run(email, s.name, hash, cid(req), now());
      db.prepare('UPDATE students SET user_id=? WHERE id=?').run(r.lastInsertRowid, s.id);
    } else {
      db.prepare("UPDATE users SET password_hash=?, status='active', role='student', centre_id=? WHERE id=?").run(hash, cid(req), u.id);
      db.prepare('UPDATE students SET user_id=? WHERE id=?').run(u.id, s.id);
    }
  })();
  audit(req, 'student.account_setup', 'student', s.id);
  res.json({ ok: true, login_id: s.student_code, email, default_password: password });
}));

router.get('/marksheets', (req, res) => {
  const rows = db.prepare(`SELECT m.id, m.marksheet_no, m.roll_no, m.exam_session, m.total_max, m.total_obtained, m.percentage, m.grade, m.result, m.status, m.reason,
    s.name AS student, s.student_code, co.name AS course
    FROM marksheets m
    JOIN students s ON s.id=m.student_id
    JOIN courses co ON co.id=m.course_id
    WHERE m.centre_id=? ORDER BY m.id DESC LIMIT 100`).all(cid(req));
  res.json({ marksheets: rows });
});

router.get('/certificates', (req, res) => res.json({ certificates: db.prepare(`SELECT c.id,c.cert_no,c.status,c.reason,s.name AS student,co.name AS course FROM certificates c
  JOIN students s ON s.id=c.student_id JOIN courses co ON co.id=c.course_id WHERE c.centre_id=? ORDER BY c.id DESC LIMIT 100`).all(cid(req)) }));
router.post('/certificates', (req, res) => {
  const s = db.prepare('SELECT * FROM students WHERE id=? AND centre_id=?').get(+req.body.student_id, cid(req));
  if (!s) throw new HttpError(404, 'Student not found');
  if (db.prepare("SELECT 1 FROM certificates WHERE student_id=? AND course_id=? AND status IN ('Pending','Valid')").get(s.id, s.course_id)) throw new HttpError(409, 'A certificate is already pending or issued');
  const r = db.prepare("INSERT INTO certificates(student_id,centre_id,course_id,status,requested_by,created_at) VALUES(?,?,?,'Pending',?,?)").run(s.id, cid(req), s.course_id, req.user.id, now());
  audit(req, 'certificate.apply', 'certificate', r.lastInsertRowid); res.status(201).json({ id: r.lastInsertRowid });
});

router.get('/wallet', (req, res) => res.json({
  balance_paise: (db.prepare('SELECT balance_paise b FROM wallets WHERE centre_id=?').get(cid(req)) || { b: 0 }).b,
  ledger: db.prepare('SELECT kind,amount_paise,balance_after,reference,description,created_at FROM wallet_transactions WHERE centre_id=? ORDER BY id DESC LIMIT 50').all(cid(req)),
}));
// Creates a PENDING order only. The wallet is credited exclusively by the verified webhook.
router.post('/wallet/recharge', (req, res) => {
  const rupees = Math.round(+req.body.amount_rupees);
  if (!(rupees >= 100 && rupees <= 100000)) throw new HttpError(400, 'Amount must be between 100 and 100000');
  const ref = 'order_' + crypto.randomBytes(9).toString('hex');
  db.prepare('INSERT INTO payment_transactions(centre_id,provider_ref,amount_paise,created_at) VALUES(?,?,?,?)').run(cid(req), ref, rupees * 100, now());
  audit(req, 'payment.order', 'payment', ref);
  // TODO(gateway adapter): create the order with Razorpay/PayU/etc. here and return its checkout payload. Not configured.
  res.status(201).json({ provider_ref: ref, amount_paise: rupees * 100, gateway: 'unconfigured' });
});

router.get('/tickets', (req, res) => res.json({ tickets: db.prepare('SELECT ticket_no,category,priority,subject,status,created_at FROM tickets WHERE centre_id=? ORDER BY id DESC LIMIT 50').all(cid(req)) }));
router.post('/tickets', (req, res) => {
  const subject = str(req.body.subject, 150), body = str(req.body.body, 2000), category = str(req.body.category, 40) || 'general';
  const priority = ['low', 'normal', 'high'].includes(req.body.priority) ? req.body.priority : 'normal';
  if (!subject || !body) throw new HttpError(400, 'Subject and message required');
  const no = `TKT-${String(counter('ticket')).padStart(6, '0')}`;
  db.transaction(() => { const r = db.prepare('INSERT INTO tickets(ticket_no,centre_id,user_id,category,priority,subject,created_at) VALUES(?,?,?,?,?,?,?)').run(no, cid(req), req.user.id, category, priority, subject, now());
    db.prepare('INSERT INTO ticket_messages(ticket_id,user_id,body,at) VALUES(?,?,?,?)').run(r.lastInsertRowid, req.user.id, body, now()); })();
  res.status(201).json({ ticket_no: no });
});
module.exports = router;
