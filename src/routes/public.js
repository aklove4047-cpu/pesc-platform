const router = require('express').Router();
const db = require('../db');
const cfg = require('../config');
const { HttpError, now, str, h, next: counter } = require('../lib');
const { resolveSlug } = require('../tenant');

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;
const slugProblem = (slug) => {
  if (!SLUG_RE.test(slug)) return 'Subdomain must be 3-30 chars: a-z, 0-9, hyphen';
  if (cfg.RESERVED.has(slug)) return 'This name is reserved';
  if (resolveSlug(slug) || db.prepare("SELECT 1 FROM franchise_applications WHERE slug=? AND status NOT IN ('Rejected','Cancelled')").get(slug)) return 'Subdomain is not available';
  return null;
};
router.get('/slug-check', (req, res) => { const s = str(req.query.slug, 40).toLowerCase(); const p = slugProblem(s); res.json({ available: !p, reason: p }); });

router.post('/apply', h(async (req, res) => {
  const b = req.body || {};
  const a = { owner_name: str(b.owner_name, 100), centre_name: str(b.centre_name, 150), mobile: str(b.mobile, 15), email: str(b.email, 200).toLowerCase(),
    address: str(b.address, 400), state: str(b.state, 60), district: str(b.district, 60), pin: str(b.pin, 6), slug: str(b.slug, 40).toLowerCase() };
  if (Object.values(a).some((v) => !v)) throw new HttpError(400, 'All fields are required');
  if (!b.terms) throw new HttpError(400, 'Terms must be accepted');
  if (!/^[6-9]\d{9}$/.test(a.mobile)) throw new HttpError(400, 'Enter a valid 10-digit mobile number');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email)) throw new HttpError(400, 'Enter a valid email');
  if (!/^\d{6}$/.test(a.pin)) throw new HttpError(400, 'Enter a valid 6-digit PIN code');
  const sp = slugProblem(a.slug); if (sp) throw new HttpError(409, sp);
  if (db.prepare("SELECT 1 FROM franchise_applications WHERE (email=? OR mobile=?) AND status NOT IN ('Rejected','Cancelled')").get(a.email, a.mobile))
    throw new HttpError(409, 'An application with this email or mobile already exists');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(a.email)) throw new HttpError(409, 'This email is already registered');
  const appNo = `PESC-APP-${new Date().getFullYear()}-${String(counter('application')).padStart(6, '0')}`;
  try {
    db.prepare(`INSERT INTO franchise_applications(app_no,owner_name,centre_name,mobile,email,address,state,district,pin,slug,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,'Submitted',?)`)
      .run(appNo, a.owner_name, a.centre_name, a.mobile, a.email, a.address, a.state, a.district, a.pin, a.slug, now());
  } catch (e) { if (String(e.code).startsWith('SQLITE_CONSTRAINT')) throw new HttpError(409, 'Subdomain is not available'); throw e; }
  res.status(201).json({ application_no: appNo, status: 'Submitted' });
}));

router.get('/application/:no', (req, res) => {
  const a = db.prepare('SELECT app_no,status,decision_reason,centre_name,slug FROM franchise_applications WHERE app_no=? AND mobile=?').get(str(req.params.no, 40), str(req.query.mobile, 15));
  if (!a) throw new HttpError(404, 'Application not found');
  res.json(a);
});
router.get('/centres', (req, res) => res.json({ centres: db.prepare("SELECT name,district,state,slug FROM centres WHERE status='active' ORDER BY name LIMIT 500").all() }));
router.get('/site', (req, res) => { if (!req.tenant) throw new HttpError(404, 'Not a centre site'); res.json({ name: req.tenant.name, district: req.tenant.district, state: req.tenant.state, code: req.tenant.centre_code }); });

router.get('/courses', (req, res) => {
  res.json({ courses: db.prepare('SELECT id, code, name, duration_months, total_marks FROM courses WHERE active=1 ORDER BY name').all() });
});

// Mask holder name for privacy
const mask = (n) => String(n).split(/\s+/).map((w) => w[0] + '*'.repeat(Math.max(w.length - 1, 1))).join(' ');

// Certificate Verification
function verifyView(row) {
  if (!row || row.status === 'Pending' || row.status === 'Rejected') return { status: 'Not Found' };
  let status = row.status;
  if (status === 'Valid' && row.expires_at && row.expires_at < now()) status = 'Expired';
  return { status, certificate_no: row.cert_no, holder: mask(row.student_name), course: row.course_name, centre: row.centre_name, issued_on: new Date(row.issued_at).toISOString().slice(0, 10) };
}
const SEL = `SELECT c.*, s.name AS student_name, co.name AS course_name, ce.name AS centre_name FROM certificates c
  JOIN students s ON s.id=c.student_id JOIN courses co ON co.id=c.course_id JOIN centres ce ON ce.id=c.centre_id`;

router.get('/verify', (req, res) => res.json(verifyView(db.prepare(`${SEL} WHERE c.cert_no=?`).get(str(req.query.cert_no, 40)))));
router.get('/verify/:token', (req, res) => res.json(verifyView(db.prepare(`${SEL} WHERE c.token=?`).get(str(req.params.token, 80)))));

// Marksheet Verification view (privacy protected)
function verifyMarksheetView(row) {
  if (!row || row.status !== 'Approved') return { status: 'Not Found' };
  let subjects = [];
  try { subjects = JSON.parse(row.subjects); } catch { subjects = []; }
  return {
    status: 'Approved',
    type: 'Marksheet',
    marksheet_no: row.marksheet_no,
    holder: mask(row.student_name),
    roll_no: row.roll_no,
    student_code: row.student_code,
    course: row.course_name,
    centre: row.centre_name,
    centre_code: row.centre_code,
    session: row.exam_session,
    total_max: row.total_max,
    total_obtained: row.total_obtained,
    percentage: row.percentage,
    grade: row.grade,
    result: row.result,
    issued_on: row.issue_date ? new Date(row.issue_date).toISOString().slice(0, 10) : 'N/A',
    subject_count: subjects.length,
  };
}

const SEL_MRK = `SELECT m.*, s.name AS student_name, s.student_code, co.name AS course_name, ce.name AS centre_name, ce.centre_code
  FROM marksheets m
  JOIN students s ON s.id=m.student_id
  JOIN courses co ON co.id=m.course_id
  JOIN centres ce ON ce.id=m.centre_id`;

router.get('/verify-marksheet', (req, res) => {
  const mNo = str(req.query.marksheet_no, 40);
  const rNo = str(req.query.roll_no, 40);
  if (!mNo && !rNo) throw new HttpError(400, 'Marksheet number or Roll number required');
  const row = db.prepare(`${SEL_MRK} WHERE (m.marksheet_no=? OR m.roll_no=? OR s.student_code=?) AND m.status='Approved'`)
    .get(mNo || '', rNo || '', rNo || '');
  res.json(verifyMarksheetView(row));
});

router.get('/verify/marksheet/:token', (req, res) => {
  const row = db.prepare(`${SEL_MRK} WHERE m.token=?`).get(str(req.params.token, 80));
  res.json(verifyMarksheetView(row));
});

module.exports = router;
