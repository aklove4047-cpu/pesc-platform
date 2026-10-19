const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
const { HttpError, now, str, audit, next: counter } = require('../lib');

router.use(requireRole('student'));

// Helper to get student record for current logged-in user
function getStudent(req) {
  const u = req.user;
  const s = db.prepare(`
    SELECT s.*,
      c.name AS centre_name, c.centre_code, c.district AS centre_district, c.state AS centre_state, c.address AS centre_address,
      co.name AS course_name, co.code AS course_code, co.duration_months
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    WHERE s.user_id=? OR s.email=?
  `).get(u.id, u.email);

  if (!s) throw new HttpError(404, 'Student record not found for this account');
  return s;
}

// Student Profile & Academic Overview
router.get('/profile', (req, res) => {
  const s = getStudent(req);
  res.json({ student: s });
});

// Student Marksheets (supports both /marksheets and /marksheet)
const handleMarksheets = (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT m.id, m.marksheet_no, m.token, m.roll_no, m.exam_session,
      m.total_max, m.total_obtained, m.percentage, m.grade, m.result,
      m.status, m.issue_date, m.created_at, m.subjects,
      co.name AS course_name, c.name AS centre_name
    FROM marksheets m
    JOIN courses co ON co.id=m.course_id
    JOIN centres c ON c.id=m.centre_id
    WHERE m.student_id=?
    ORDER BY m.id DESC
  `).all(s.id);

  for (const r of rows) {
    try { r.subjects = JSON.parse(r.subjects); } catch { r.subjects = []; }
  }
  res.json({ marksheets: rows, marksheet: rows[0] || null });
};
router.get('/marksheets', handleMarksheets);
router.get('/marksheet', handleMarksheets);

// Student Certificates (supports both /certificates and /certificate)
const handleCertificates = (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT cert.id, cert.cert_no, cert.token, cert.status, cert.issued_at, cert.created_at,
      co.name AS course_name, c.name AS centre_name
    FROM certificates cert
    JOIN courses co ON co.id=cert.course_id
    JOIN centres c ON c.id=cert.centre_id
    WHERE cert.student_id=?
    ORDER BY cert.id DESC
  `).all(s.id);

  res.json({ certificates: rows, certificate: rows[0] || null });
};
router.get('/certificates', handleCertificates);
router.get('/certificate', handleCertificates);

// Student Digital ID Card data
router.get('/id-card', (req, res) => {
  const s = getStudent(req);
  res.json({
    id_card: {
      student_code: s.student_code,
      name: s.name,
      father_name: s.father_name,
      dob: s.dob,
      course_name: s.course_name,
      course_code: s.course_code,
      duration_months: s.duration_months,
      centre_name: s.centre_name,
      centre_code: s.centre_code,
      session: s.session,
      status: s.status,
      issued_on: new Date(s.created_at).toLocaleDateString('en-IN'),
      valid_until: s.session || `${new Date(s.created_at).getFullYear() + 2}`,
    },
  });
});

// Student Support Tickets to Centre
router.get('/tickets', (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT t.id, t.ticket_no, t.subject, t.category, t.priority, t.status, t.created_at
    FROM tickets t
    WHERE t.centre_id=? AND t.user_id=?
    ORDER BY t.id DESC LIMIT 50
  `).all(s.centre_id, req.user.id);

  res.json({ tickets: rows });
});

router.post('/tickets', (req, res) => {
  const s = getStudent(req);
  const subject = str(req.body.subject, 150);
  const body = str(req.body.body, 2000);
  const category = str(req.body.category, 40) || 'student_query';
  if (!subject || !body) throw new HttpError(400, 'Subject and message are required');

  const no = `STU-TKT-${String(counter('ticket')).padStart(6, '0')}`;
  db.transaction(() => {
    const r = db.prepare('INSERT INTO tickets(ticket_no,centre_id,user_id,category,priority,subject,created_at) VALUES(?,?,?,?,?,?,?)')
      .run(no, s.centre_id, req.user.id, category, 'normal', subject, now());
    db.prepare('INSERT INTO ticket_messages(ticket_id,user_id,body,at) VALUES(?,?,?,?)')
      .run(r.lastInsertRowid, req.user.id, body, now());
  })();

  audit(req, 'student.ticket', 'ticket', no);
  res.status(201).json({ ticket_no: no });
});

module.exports = router;
