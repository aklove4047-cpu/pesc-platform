const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
const { str } = require('../lib');

router.use(requireRole('super_admin', 'admin', 'coordinator'));

// CSV Converter Helper
function toCsv(headers, rows, getRow) {
  const escapeVal = (v) => {
    if (v === null || v === undefined) return '""';
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const headerLine = headers.map(escapeVal).join(',');
  const lines = rows.map((r) => getRow(r).map(escapeVal).join(','));
  return [headerLine, ...lines].join('\r\n');
}

function sendCsv(res, filename, csvContent) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
}

// Check coordinator scope
function getFilter(req) {
  if (req.user.role === 'coordinator') {
    return { isCoord: true, coordId: req.user.id };
  }
  return { isCoord: false, coordId: null };
}

// 1. Student Admissions Report
router.get('/admissions', (req, res) => {
  const { isCoord, coordId } = getFilter(req);
  const centreId = +req.query.centre_id || 0;
  const courseId = +req.query.course_id || 0;
  const format = str(req.query.format, 10);

  let sql = `
    SELECT s.id, s.student_code, s.name, s.father_name, s.mobile, s.email, s.dob, s.session, s.status, s.created_at,
      co.name AS course_name, co.code AS course_code,
      c.name AS centre_name, c.centre_code, c.district, c.state
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    WHERE 1=1
  `;
  const params = [];
  if (isCoord) { sql += ' AND c.coordinator_id=?'; params.push(coordId); }
  if (centreId) { sql += ' AND s.centre_id=?'; params.push(centreId); }
  if (courseId) { sql += ' AND s.course_id=?'; params.push(courseId); }
  sql += ' ORDER BY s.id DESC LIMIT 1000';

  const rows = db.prepare(sql).all(...params);

  if (format === 'csv') {
    const headers = ['Student ID', 'Student Code', 'Name', "Father's Name", 'Mobile', 'Email', 'DOB', 'Course', 'Centre', 'Centre Code', 'Session', 'Status', 'Admission Date'];
    const csv = toCsv(headers, rows, (r) => [
      r.id, r.student_code, r.name, r.father_name, r.mobile, r.email, r.dob,
      r.course_name, r.centre_name, r.centre_code, r.session, r.status,
      new Date(r.created_at).toISOString().slice(0, 10),
    ]);
    return sendCsv(res, 'pesc-admissions-report.csv', csv);
  }

  res.json({ admissions: rows, count: rows.length });
});

// 2. Marksheets Report
router.get('/marksheets', (req, res) => {
  const { isCoord, coordId } = getFilter(req);
  const centreId = +req.query.centre_id || 0;
  const status = str(req.query.status, 20);
  const format = str(req.query.format, 10);

  let sql = `
    SELECT m.id, m.marksheet_no, m.roll_no, m.exam_session, m.total_max, m.total_obtained,
      m.percentage, m.grade, m.result, m.status, m.issue_date, m.created_at,
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
  if (isCoord) { sql += ' AND c.coordinator_id=?'; params.push(coordId); }
  if (centreId) { sql += ' AND m.centre_id=?'; params.push(centreId); }
  if (status) { sql += ' AND m.status=?'; params.push(status); }
  sql += ' ORDER BY m.id DESC LIMIT 1000';

  const rows = db.prepare(sql).all(...params);

  if (format === 'csv') {
    const headers = ['Marksheet ID', 'Marksheet No', 'Roll No', 'Student Code', 'Student Name', 'Course', 'Centre', 'Session', 'Max Marks', 'Obt Marks', 'Percentage', 'Grade', 'Result', 'Status', 'Issue Date'];
    const csv = toCsv(headers, rows, (r) => [
      r.id, r.marksheet_no || 'N/A', r.roll_no, r.student_code, r.student_name,
      r.course_name, r.centre_name, r.exam_session, r.total_max, r.total_obtained,
      r.percentage, r.grade, r.result, r.status,
      r.issue_date ? new Date(r.issue_date).toISOString().slice(0, 10) : 'N/A',
    ]);
    return sendCsv(res, 'pesc-marksheets-report.csv', csv);
  }

  res.json({ marksheets: rows, count: rows.length });
});

// 3. Certificates Report
router.get('/certificates', (req, res) => {
  const { isCoord, coordId } = getFilter(req);
  const status = str(req.query.status, 20);
  const format = str(req.query.format, 10);

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
  if (isCoord) { sql += ' AND c.coordinator_id=?'; params.push(coordId); }
  if (status) { sql += ' AND cert.status=?'; params.push(status); }
  sql += ' ORDER BY cert.id DESC LIMIT 1000';

  const rows = db.prepare(sql).all(...params);

  if (format === 'csv') {
    const headers = ['Certificate ID', 'Certificate No', 'Student Code', 'Student Name', 'Course', 'Centre', 'Status', 'Requested Date', 'Issued Date'];
    const csv = toCsv(headers, rows, (r) => [
      r.id, r.cert_no || 'N/A', r.student_code, r.student_name,
      r.course_name, r.centre_name, r.status,
      new Date(r.created_at).toISOString().slice(0, 10),
      r.issued_at ? new Date(r.issued_at).toISOString().slice(0, 10) : 'N/A',
    ]);
    return sendCsv(res, 'pesc-certificates-report.csv', csv);
  }

  res.json({ certificates: rows, count: rows.length });
});

// 4. Centres Performance Report
router.get('/centres', (req, res) => {
  const { isCoord, coordId } = getFilter(req);
  const format = str(req.query.format, 10);

  const rows = db.prepare(`
    SELECT c.id, c.centre_code, c.name, c.slug, c.district, c.state, c.status, c.created_at,
      u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile,
      (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS total_students,
      (SELECT COUNT(*) FROM certificates cert WHERE cert.centre_id=c.id AND cert.status='Valid') AS valid_certs,
      (SELECT COUNT(*) FROM marksheets m WHERE m.centre_id=c.id AND m.status='Approved') AS approved_marksheets,
      (SELECT COALESCE(balance_paise, 0) FROM wallets w WHERE w.centre_id=c.id) AS wallet_paise
    FROM centres c
    LEFT JOIN users u ON u.id=c.owner_user_id
    ${isCoord ? 'WHERE c.coordinator_id=?' : ''}
    ORDER BY c.id DESC
  `).all(...(isCoord ? [coordId] : []));

  if (format === 'csv') {
    const headers = ['Centre ID', 'Centre Code', 'Centre Name', 'Slug', 'Owner Name', 'Owner Email', 'Mobile', 'District', 'State', 'Status', 'Students', 'Valid Certs', 'Approved Marksheets', 'Wallet Balance (INR)'];
    const csv = toCsv(headers, rows, (r) => [
      r.id, r.centre_code, r.name, r.slug, r.owner_name, r.owner_email, r.owner_mobile,
      r.district, r.state, r.status, r.total_students, r.valid_certs, r.approved_marksheets,
      (r.wallet_paise / 100).toFixed(2),
    ]);
    return sendCsv(res, 'pesc-centres-report.csv', csv);
  }

  res.json({ centres: rows, count: rows.length });
});

// 5. Financial / Wallet Transactions Report (Admin only)
router.get('/financials', (req, res) => {
  if (req.user.role === 'coordinator') {
    return res.status(403).json({ error: 'Financial reports restricted to Head Office Admin' });
  }
  const format = str(req.query.format, 10);

  const rows = db.prepare(`
    SELECT wt.id, wt.kind, wt.amount_paise, wt.balance_after, wt.reference, wt.description, wt.created_at,
      c.centre_code, c.name AS centre_name
    FROM wallet_transactions wt
    JOIN centres c ON c.id=wt.centre_id
    ORDER BY wt.id DESC LIMIT 1000
  `).all();

  if (format === 'csv') {
    const headers = ['Txn ID', 'Centre Code', 'Centre Name', 'Type', 'Amount (INR)', 'Balance After (INR)', 'Reference', 'Description', 'Date'];
    const csv = toCsv(headers, rows, (r) => [
      r.id, r.centre_code, r.centre_name, r.kind.toUpperCase(),
      (r.amount_paise / 100).toFixed(2), (r.balance_after / 100).toFixed(2),
      r.reference, r.description, new Date(r.created_at).toISOString().slice(0, 10),
    ]);
    return sendCsv(res, 'pesc-financial-report.csv', csv);
  }

  res.json({ transactions: rows, count: rows.length });
});

module.exports = router;
