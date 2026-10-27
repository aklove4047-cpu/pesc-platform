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

const handleApply = h(async (req, res) => {
  const b = req.body || {};
  const slug = str(b.slug, 40).toLowerCase() || str(b.centre_name || b.institute_name, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const a = {
    owner_name: str(b.owner_name, 100),
    centre_name: str(b.centre_name || b.institute_name, 150),
    mobile: str(b.mobile || b.phone || b.owner_phone, 15),
    email: str(b.email || b.owner_email, 200).toLowerCase(),
    address: str(b.address, 400),
    state: str(b.state, 60),
    district: str(b.district, 60),
    pin: str(b.pin || b.pincode, 6) || '221001',
    slug
  };
  if (Object.values(a).some((v) => !v)) throw new HttpError(400, 'All fields are required');
  if (!b.terms && !b.declaration) throw new HttpError(400, 'Terms must be accepted');
  if (!/^[6-9]\d{9}$/.test(a.mobile)) throw new HttpError(400, 'Enter a valid 10-digit mobile number');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email)) throw new HttpError(400, 'Enter a valid email');
  if (!/^\d{6}$/.test(a.pin)) throw new HttpError(400, 'Enter a valid 6-digit PIN code');
  const sp = slugProblem(a.slug); if (sp) throw new HttpError(409, sp);
  if (db.prepare("SELECT 1 FROM franchise_applications WHERE (email=? OR mobile=?) AND status NOT IN ('Rejected','Cancelled')").get(a.email, a.mobile))
    throw new HttpError(409, 'An application with this email or mobile already exists');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(a.email)) throw new HttpError(409, 'This email is already registered');
  const photo_url = b.photo_url || b.photo || b.director_photo || null;
  const appNo = `PESC-APP-${new Date().getFullYear()}-${String(counter('application')).padStart(6, '0')}`;
  let rowId;
  try {
    const r = db.prepare(`INSERT INTO franchise_applications(app_no,owner_name,centre_name,mobile,email,address,state,district,pin,slug,photo_url,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,'Submitted',?)`)
      .run(appNo, a.owner_name, a.centre_name, a.mobile, a.email, a.address, a.state, a.district, a.pin, a.slug, photo_url, now());
    rowId = r.lastInsertRowid;
  } catch (e) { if (String(e.code).startsWith('SQLITE_CONSTRAINT')) throw new HttpError(409, 'Subdomain is not available'); throw e; }
  res.status(201).json({ id: rowId, application_no: appNo, status: 'Submitted', photo_url });
});

router.post('/apply', handleApply);
router.post('/apply-centre', handleApply);

router.get('/application/:no', (req, res) => {
  const a = db.prepare('SELECT app_no,status,decision_reason,centre_name,slug FROM franchise_applications WHERE app_no=? AND mobile=?').get(str(req.params.no, 40), str(req.query.mobile, 15));
  if (!a) throw new HttpError(404, 'Application not found');
  res.json(a);
});
router.get('/centres', (req, res) => {
  const centres = db.prepare(`SELECT c.id, c.name, c.centre_code, c.district, c.state, c.slug, c.director_name, c.phone, c.address,
    (SELECT COUNT(*) FROM students WHERE centre_id=c.id) AS student_count
    FROM centres c
    WHERE c.status='active'
    ORDER BY c.id ASC LIMIT 500`).all();
  res.json({ centres });
});
router.get('/site', (req, res) => {
  const slug = req.query.slug || (req.tenant ? req.tenant.slug : null);
  let tenant = req.tenant;
  if (!tenant && slug) {
    tenant = resolveSlug(slug);
  }
  if (!tenant || tenant.status !== 'active') throw new HttpError(404, 'Centre site not found');

  const owner = db.prepare("SELECT u.name, u.email, u.mobile FROM users u WHERE u.centre_id=? AND u.role='centre_owner'").get(tenant.id) || {};
  let courses = db.prepare(`SELECT co.id, co.code, co.name, co.duration_months, co.fee_paise, co.total_marks
    FROM courses co
    JOIN centre_courses cc ON cc.course_id=co.id
    WHERE cc.centre_id=? AND co.active=1
    ORDER BY co.duration_months DESC, co.name ASC`).all(tenant.id);
  if (!courses || courses.length === 0) {
    courses = db.prepare(`SELECT id, code, name, duration_months, fee_paise, total_marks FROM courses WHERE active=1 ORDER BY duration_months DESC, name ASC LIMIT 6`).all();
  }

  const studentCount = db.prepare('SELECT count(*) n FROM students WHERE centre_id=?').get(tenant.id).n;
  const certCount = db.prepare("SELECT count(*) n FROM certificates WHERE centre_id=? AND status='Valid'").get(tenant.id).n;

  res.json({
    centre: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      code: tenant.centre_code,
      district: tenant.district,
      state: tenant.state,
      address: tenant.address || `${tenant.district}, ${tenant.state}`,
      created_at: tenant.created_at,
    },
    owner: {
      name: owner.name || 'Centre Director',
      email: owner.email || `desk@${tenant.slug}.pescouncil.in`,
      mobile: owner.mobile || '+91 98765 43210',
    },
    courses: courses.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      duration_months: c.duration_months,
      local_fee_rupees: c.fee_paise ? Math.round(c.fee_paise / 100) : (c.duration_months >= 12 ? 12000 : c.duration_months >= 6 ? 6500 : 4000),
      tag: c.duration_months >= 12 ? 'Diploma' : c.duration_months >= 6 ? 'Certificate' : 'Short Term',
    })),
    stats: {
      students: studentCount,
      certificates: certCount,
      lab_systems: 30,
      session: '2026-27',
      established_year: new Date(tenant.created_at).getFullYear() || 2021,
    }
  });
});

router.post('/admission-inquiry', (req, res) => {
  const b = req.body;
  const name = str(b.name, 100);
  const mobile = str(b.mobile, 15);
  const email = str(b.email, 150) || null;
  const centre_id = +b.centre_id;
  const course_id = b.course_id ? +b.course_id : null;
  const message = str(b.message, 500) || null;
  if (!name || !mobile) throw new HttpError(400, 'Student name and mobile number are required');
  if (!centre_id) throw new HttpError(400, 'Centre ID is required');

  db.prepare('INSERT INTO admission_inquiries(centre_id, name, mobile, email, course_id, message, created_at) VALUES(?,?,?,?,?,?,?)')
    .run(centre_id, name, mobile, email, course_id, message, now());

  res.status(201).json({ ok: true, message: 'Your admission inquiry has been submitted! The centre counsellor will contact you shortly.' });
});

router.get('/courses', (req, res) => {
  res.json({ courses: db.prepare('SELECT id, code, name, duration_months, total_marks FROM courses WHERE active=1 ORDER BY name').all() });
});

router.get('/notices', (req, res) => {
  const notices = db.prepare(`SELECT id, title, category, content, link, pinned, created_at
    FROM notices WHERE active=1 AND target IN ('all', 'public')
    ORDER BY pinned DESC, id DESC LIMIT 20`).all();
  res.json({ notices });
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

// Coordinator Certificate Verification view
function verifyCoordCertView(row) {
  if (!row || row.status !== 'Valid') return { status: 'Not Found' };
  let status = row.status;
  if (row.valid_until && row.valid_until < now()) status = 'Expired';
  return {
    status,
    type: 'Regional / State Coordinator Appointment Certificate',
    certificate_no: row.cert_no,
    coordinator_name: row.name,
    jurisdiction_state: row.state,
    photo_url: row.photo_url || null,
    issued_on: new Date(row.issued_at).toISOString().slice(0, 10),
    valid_until: row.valid_until ? new Date(row.valid_until).toISOString().slice(0, 10) : 'Permanent',
    council: 'Pariksha Evam Shiksha Council',
  };
}

const SEL_COORD = `SELECT cc.*, u.name, u.photo_url, u.email FROM coordinator_certificates cc JOIN users u ON u.id=cc.user_id`;

router.get('/verify/coordinator/:token', (req, res) => {
  const token = str(req.params.token, 80);
  const row = db.prepare(`${SEL_COORD} WHERE cc.token=? OR cc.cert_no=?`).get(token, token);
  res.json(verifyCoordCertView(row));
});

router.get('/settings', (req, res) => {
  const adminUser = db.prepare("SELECT * FROM users WHERE role='super_admin' OR role='admin' ORDER BY id ASC LIMIT 1").get() || {};
  res.json({
    email: adminUser.email || 'info@pescouncil.in',
    phone: adminUser.mobile || '+91 542-1234567',
    mobile: adminUser.mobile || '+91 94152 00000',
    head_office: adminUser.head_office || 'Purvanchal Education & Skill Council, Head Office, Gorakhpur / Lucknow, UP',
    address: adminUser.head_office || 'Gorakhpur / Varanasi, Uttar Pradesh, India',
    authorities: {
      head_office: {
        name: adminUser.name || 'Executive Director & Controller of Examinations',
        designation: adminUser.designation || 'Executive Director & Controller of Examinations',
        seal_url: adminUser.seal_url || '/assets/img/seal_council_head.svg',
        signature_url: adminUser.signature_url || '/assets/img/sign_council_head.svg',
        logo_url: adminUser.photo_url || '/assets/img/logo_council.svg'
      }
    }
  });
});

module.exports = router;
