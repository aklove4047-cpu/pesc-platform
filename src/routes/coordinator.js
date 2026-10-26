const router = require('express').Router();
const db = require('../db');
const cfg = require('../config');
const { requireRole } = require('../auth');
const { HttpError, str, paginate, now, getOrCreateCoordinatorCert } = require('../lib');

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

  // Get coordinator profile
  const profile = db.prepare('SELECT id, name, email, mobile, photo_url, state, seal_url, signature_url FROM users WHERE id=?').get(req.user.id) || {};

  res.json({
    coordinator: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      state: req.user.state,
      photo_url: profile.photo_url || null,
      seal_url: profile.seal_url || null,
      signature_url: profile.signature_url || null,
      mobile: profile.mobile || null,
    },
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
    SELECT c.id, c.centre_code, c.name, c.slug, c.district, c.state, c.status, c.address, c.pin,
      u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile, u.photo_url AS director_photo,
      c.seal_url, c.signature_url, c.logo_url,
      (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS students_count,
      (SELECT COUNT(*) FROM certificates cert WHERE cert.centre_id=c.id AND cert.status='Valid') AS certs_count,
      (SELECT COUNT(*) FROM marksheets m WHERE m.centre_id=c.id AND m.status='Approved') AS marksheets_count,
      (SELECT COUNT(*) FROM certificates cert WHERE cert.centre_id=c.id AND cert.status='Pending') AS certs_pending,
      (SELECT COUNT(*) FROM marksheets m WHERE m.centre_id=c.id AND m.status='Pending') AS marksheets_pending
    FROM centres c
    LEFT JOIN users u ON u.id=c.owner_user_id
    ${isCoord ? 'WHERE c.coordinator_id=?' : ''}
    ORDER BY c.id DESC LIMIT ? OFFSET ?
  `).all(...(isCoord ? [coordId] : []), size, offset);

  res.json({ centres: rows });
});

// Single centre detail with students, marksheets, certs
router.get('/centres/:id', (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const centreId = +req.params.id;
  const c = db.prepare(`SELECT c.*, u.name AS owner_name, u.email AS owner_email, u.mobile AS owner_mobile
    FROM centres c LEFT JOIN users u ON u.id=c.owner_user_id
    WHERE c.id=? ${isCoord ? 'AND c.coordinator_id=?' : ''}`).get(centreId, ...(isCoord ? [coordId] : []));
  if (!c) throw new HttpError(404, 'Centre not found or not in your jurisdiction');

  const students = db.prepare(`SELECT s.*, co.name AS course_name FROM students s
    JOIN courses co ON co.id=s.course_id WHERE s.centre_id=? ORDER BY s.id DESC LIMIT 50`).all(centreId);
  const marksheets = db.prepare(`SELECT m.*, s.name AS student_name, co.name AS course_name FROM marksheets m
    JOIN students s ON s.id=m.student_id JOIN courses co ON co.id=m.course_id
    WHERE m.centre_id=? ORDER BY m.id DESC LIMIT 50`).all(centreId);
  const certificates = db.prepare(`SELECT cert.*, s.name AS student_name, co.name AS course_name FROM certificates cert
    JOIN students s ON s.id=cert.student_id JOIN courses co ON co.id=cert.course_id
    WHERE cert.centre_id=? ORDER BY cert.id DESC LIMIT 50`).all(centreId);

  res.json({ centre: c, students, marksheets, certificates });
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

// GET coordinator profile
router.get('/profile', (req, res) => {
  const u = db.prepare('SELECT id, name, email, mobile, state, photo_url, seal_url, signature_url FROM users WHERE id=?').get(req.user.id);
  res.json({ profile: u || { id: req.user.id, name: req.user.name, email: req.user.email, state: req.user.state } });
});

// POST update coordinator profile (name, email, mobile, photo, mohar, sign)
router.post('/profile', (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 100);
  const mobile = str(b.mobile, 20);
  const email = str(b.email, 150);
  const photo_url = b.photo_url || null;
  const seal_url = b.seal_url || null;
  const signature_url = b.signature_url || null;
  const state = str(b.state, 100);

  // Ensure seal_url and signature_url columns exist (graceful)
  try {
    db.prepare('ALTER TABLE users ADD COLUMN seal_url TEXT').run();
  } catch (_) {}
  try {
    db.prepare('ALTER TABLE users ADD COLUMN signature_url TEXT').run();
  } catch (_) {}

  db.prepare(`UPDATE users SET
    name = COALESCE(?, name),
    mobile = COALESCE(?, mobile),
    email = COALESCE(?, email),
    photo_url = COALESCE(?, photo_url),
    seal_url = COALESCE(?, seal_url),
    signature_url = COALESCE(?, signature_url),
    state = COALESCE(?, state)
    WHERE id=?`).run(
    name || null,
    mobile || null,
    email || null,
    photo_url,
    seal_url,
    signature_url,
    state || null,
    req.user.id
  );

  res.json({ ok: true, message: 'Profile updated successfully!' });
});

// POST change coordinator password
router.post('/change-password', (req, res) => {
  const { new_password } = req.body || {};
  if (!new_password || new_password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash, req.user.id);
  res.json({ ok: true, message: 'Password changed successfully!' });
});

// GET coordinator appointment certificate
router.get('/appointment-cert', (req, res) => {
  const u = db.prepare('SELECT id, name, email, mobile, state, photo_url, seal_url, signature_url, created_at FROM users WHERE id=?').get(req.user.id);
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

module.exports = router;
