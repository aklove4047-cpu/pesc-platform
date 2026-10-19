const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
const { HttpError, str, paginate } = require('../lib');

router.use(requireRole('super_admin', 'admin', 'coordinator'));

// Helper to get coordinator ID scope
function getScope(req) {
  if (req.user.role === 'coordinator') {
    return { isCoord: true, coordId: req.user.id };
  }
  return { isCoord: false, coordId: null };
}

// Coordinator Dashboard Overview
router.get('/dashboard', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const filter = isCoord ? 'WHERE coordinator_id=?' : '';
  const filterParams = isCoord ? [coordId] : [];

  const centreCount = db.prepare(`SELECT COUNT(*) n FROM centres ${filter}`).get(...filterParams).n;
  const activeCentres = db.prepare(`SELECT COUNT(*) n FROM centres WHERE status='active' ${isCoord ? 'AND coordinator_id=?' : ''}`).get(...filterParams).n;

  const studentCount = db.prepare(`
    SELECT COUNT(*) n FROM students s
    JOIN centres c ON c.id=s.centre_id
    ${isCoord ? 'WHERE c.coordinator_id=?' : ''}
  `).get(...filterParams).n;

  const certPending = db.prepare(`
    SELECT COUNT(*) n FROM certificates cert
    JOIN centres c ON c.id=cert.centre_id
    WHERE cert.status='Pending' ${isCoord ? 'AND c.coordinator_id=?' : ''}
  `).get(...filterParams).n;

  const certValid = db.prepare(`
    SELECT COUNT(*) n FROM certificates cert
    JOIN centres c ON c.id=cert.centre_id
    WHERE cert.status='Valid' ${isCoord ? 'AND c.coordinator_id=?' : ''}
  `).get(...filterParams).n;

  const mrkPending = db.prepare(`
    SELECT COUNT(*) n FROM marksheets m
    JOIN centres c ON c.id=m.centre_id
    WHERE m.status='Pending' ${isCoord ? 'AND c.coordinator_id=?' : ''}
  `).get(...filterParams).n;

  const mrkApproved = db.prepare(`
    SELECT COUNT(*) n FROM marksheets m
    JOIN centres c ON c.id=m.centre_id
    WHERE m.status='Approved' ${isCoord ? 'AND c.coordinator_id=?' : ''}
  `).get(...filterParams).n;

  res.json({
    coordinator: { id: req.user.id, name: req.user.name, email: req.user.email, state: req.user.state },
    stats: {
      centres_total: centreCount,
      centres_active: activeCentres,
      students_total: studentCount,
      certificates_pending: certPending,
      certificates_valid: certValid,
      marksheets_pending: mrkPending,
      marksheets_approved: mrkApproved,
    },
  });
});

// List assigned centres
router.get('/centres', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const { size, offset } = paginate(req);
  const rows = db.prepare(`
    SELECT c.id, c.centre_code, c.name, c.slug, c.district, c.state, c.status,
      u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile,
      (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS students_count,
      (SELECT COUNT(*) FROM certificates cert WHERE cert.centre_id=c.id AND cert.status='Valid') AS certs_count,
      (SELECT COUNT(*) FROM marksheets m WHERE m.centre_id=c.id AND m.status='Approved') AS marksheets_count
    FROM centres c
    LEFT JOIN users u ON u.id=c.owner_user_id
    ${isCoord ? 'WHERE c.coordinator_id=?' : ''}
    ORDER BY c.id DESC LIMIT ? OFFSET ?
  `).all(...(isCoord ? [coordId] : []), size, offset);

  res.json({ centres: rows });
});

// List students across assigned centres
router.get('/students', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const { size, offset } = paginate(req);
  const q = `%${str(req.query.q, 50)}%`;

  const rows = db.prepare(`
    SELECT s.id, s.student_code, s.name, s.father_name, s.mobile, s.email, s.session, s.status, s.created_at,
      co.name AS course_name, c.name AS centre_name, c.centre_code
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    WHERE (s.name LIKE ? OR s.student_code LIKE ? OR s.mobile LIKE ?)
      ${isCoord ? 'AND c.coordinator_id=?' : ''}
    ORDER BY s.id DESC LIMIT ? OFFSET ?
  `).all(q, q, q, ...(isCoord ? [coordId] : []), size, offset);

  res.json({ students: rows });
});

// List certificates across assigned centres
router.get('/certificates', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const { size, offset } = paginate(req);
  const st = str(req.query.status, 20);

  let sql = `
    SELECT cert.id, cert.cert_no, cert.status, cert.issued_at, cert.created_at, cert.reason,
      s.name AS student_name, s.student_code,
      co.name AS course_name,
      c.name AS centre_name, c.centre_code
    FROM certificates cert
    JOIN students s ON s.id=cert.student_id
    JOIN courses co ON co.id=cert.course_id
    JOIN centres c ON c.id=cert.centre_id
    WHERE 1=1
  `;
  const params = [];
  if (isCoord) {
    sql += ' AND c.coordinator_id=?';
    params.push(coordId);
  }
  if (st) {
    sql += ' AND cert.status=?';
    params.push(st);
  }
  sql += ' ORDER BY cert.id DESC LIMIT ? OFFSET ?';
  params.push(size, offset);

  res.json({ certificates: db.prepare(sql).all(...params) });
});

// List marksheets across assigned centres
router.get('/marksheets', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const { size, offset } = paginate(req);
  const st = str(req.query.status, 20);

  let sql = `
    SELECT m.id, m.marksheet_no, m.roll_no, m.exam_session, m.total_max, m.total_obtained,
      m.percentage, m.grade, m.result, m.status, m.issue_date, m.created_at, m.reason,
      s.name AS student_name, s.student_code,
      co.name AS course_name,
      c.name AS centre_name, c.centre_code
    FROM marksheets m
    JOIN students s ON s.id=m.student_id
    JOIN courses co ON co.id=m.course_id
    JOIN centres c ON c.id=m.centre_id
    WHERE 1=1
  `;
  const params = [];
  if (isCoord) {
    sql += ' AND c.coordinator_id=?';
    params.push(coordId);
  }
  if (st) {
    sql += ' AND m.status=?';
    params.push(st);
  }
  sql += ' ORDER BY m.id DESC LIMIT ? OFFSET ?';
  params.push(size, offset);

  res.json({ marksheets: db.prepare(sql).all(...params) });
});

module.exports = router;
