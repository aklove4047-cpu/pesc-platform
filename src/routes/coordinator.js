const router = require('express').Router();
const db = require('../db');
const cfg = require('../config');
const { requireRole } = require('../auth');
const { HttpError, str, paginate, now, getOrCreateCoordinatorCert, h, nextCentreCode, audit } = require('../lib');
const { resolveSlug } = require('../tenant');

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
  db.prepare('UPDATE users SET password_hash=?, password_plain=? WHERE id=?').run(hash, new_password, req.user.id);
  res.json({ ok: true, message: 'Password changed successfully! Head Office records have been updated.' });
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

// Grant new centre affiliation directly by regional coordinator
router.post('/centres', h(async (req, res) => {
  const coordId = req.user.role === 'coordinator' ? req.user.id : (+req.body.coordinator_id || req.user.id);
  const b = req.body || {};
  const name = str(b.name || b.centre_name, 150);
  const director_name = str(b.director_name || b.owner_name, 100);
  const email = str(b.email || b.owner_email, 150).toLowerCase();
  const mobile = str(b.mobile || b.phone, 15);
  const state = str(b.state, 60) || req.user.state || 'Uttar Pradesh';
  const district = str(b.district, 60);
  const address = str(b.address, 300) || `${district}, ${state}`;
  const pin = str(b.pin, 10) || '221001';
  const director_photo = b.director_photo || b.photo_url || null;
  const password = str(b.password, 64) || 'Centre@123';

  if (!name || !director_name || !email || !mobile) {
    throw new HttpError(400, 'Centre name, director name, email, and mobile are required');
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new HttpError(400, 'Enter a valid 10-digit mobile number');
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new HttpError(400, 'Enter a valid email address');
  }

  // Generate unique slug
  let rawSlug = str(b.slug, 30).toLowerCase() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!rawSlug || rawSlug.length < 3) rawSlug = `centre-${mobile.slice(-4)}`;
  let slug = rawSlug;
  let counterIdx = 1;
  while (resolveSlug(slug) || db.prepare('SELECT 1 FROM centres WHERE slug=?').get(slug)) {
    slug = `${rawSlug}-${counterIdx++}`;
  }

  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) {
    throw new HttpError(409, 'This email is already registered in the system');
  }

  const bcrypt = require('bcryptjs');
  const hashed = bcrypt.hashSync(password, 10);

  const result = db.transaction(() => {
    const centreCode = nextCentreCode();
    const certNo = `PESC/ATC/2026/${centreCode}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

    const u = db.prepare("INSERT INTO users(email,name,mobile,password_hash,password_plain,role,state,status,photo_url,created_at) VALUES(?,?,?,?,?,'centre_owner',?,'active',?,?)")
      .run(email, director_name, mobile, hashed, password, state, director_photo, now());
    const ownerUserId = u.lastInsertRowid;

    const c = db.prepare(`INSERT INTO centres(centre_code,name,slug,owner_user_id,coordinator_id,state,district,address,pin,director_name,director_photo,phone,email,affiliation_cert_no,affiliation_issue_date,affiliation_valid_thru,affiliation_session,login_password,status,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'active',?)`)
      .run(centreCode, name, slug, ownerUserId, coordId, state, district, address, pin, director_name, director_photo, mobile, email, certNo, todayStr, '31-03-2029', '2026 - 2029 (3 Academic Years)', password, now());
    const centreId = c.lastInsertRowid;

    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(centreId, ownerUserId);

    // Assign all active courses by default
    const allCourses = db.prepare('SELECT id FROM courses WHERE active=1').all();
    for (const co of allCourses) {
      db.prepare('INSERT OR IGNORE INTO centre_courses(centre_id, course_id) VALUES(?,?)').run(centreId, co.id);
    }

    // Initialize wallet
    db.prepare('INSERT OR IGNORE INTO wallets(centre_id, balance_paise) VALUES(?, 0)').run(centreId);

    audit(req, 'coordinator.grant_affiliation', 'centre', centreId, 'ok', `Coordinator ${req.user.name} granted affiliation to ${name} (${centreCode})`);

    return {
      id: centreId,
      centre_code: centreCode,
      name,
      slug,
      director_name,
      mobile,
      email,
      state,
      district,
      address,
      affiliation_cert_no: certNo,
      login_password: password
    };
  })();

  res.status(201).json({
    ok: true,
    message: 'New Centre Affiliation granted successfully!',
    centre: result,
    credentials: {
      login_id: result.centre_code,
      password,
      portal_url: `https://${result.slug}.${cfg.BASE_DOMAIN}/portal`
    }
  });
}));

// Edit affiliated centre details by coordinator
const handleCentreEdit = h(async (req, res) => {
  const { isCoord, coordId } = getScope(req);
  const centreId = +req.params.id;
  const c = db.prepare(`SELECT * FROM centres WHERE id=? ${isCoord ? 'AND coordinator_id=?' : ''}`).get(centreId, ...(isCoord ? [coordId] : []));
  if (!c) throw new HttpError(404, 'Centre not found or not in your jurisdiction');

  const b = req.body || {};
  const name = b.name !== undefined ? str(b.name, 150) : c.name;
  const director_name = b.director_name !== undefined ? str(b.director_name, 100) : c.director_name;
  const phone = b.phone !== undefined || b.mobile !== undefined ? str(b.phone || b.mobile, 15) : c.phone;
  const email = b.email !== undefined ? str(b.email, 150).toLowerCase() : c.email;
  const state = b.state !== undefined ? str(b.state, 60) : c.state;
  const district = b.district !== undefined ? str(b.district, 60) : c.district;
  const address = b.address !== undefined ? str(b.address, 300) : c.address;
  const pin = b.pin !== undefined ? str(b.pin, 10) : c.pin;
  const director_photo = b.director_photo !== undefined ? (b.director_photo || null) : c.director_photo;
  const seal_url = b.seal_url !== undefined ? (b.seal_url || null) : c.seal_url;
  const signature_url = b.signature_url !== undefined ? (b.signature_url || null) : c.signature_url;

  db.transaction(() => {
    db.prepare(`UPDATE centres SET
      name = ?,
      director_name = ?,
      phone = ?,
      email = ?,
      state = ?,
      district = ?,
      address = ?,
      pin = ?,
      director_photo = ?,
      seal_url = ?,
      signature_url = ?
      WHERE id=?`).run(
      name, director_name, phone, email, state, district, address, pin, director_photo, seal_url, signature_url, centreId
    );

    // Also update centre owner user
    if (c.owner_user_id) {
      db.prepare(`UPDATE users SET
        name = COALESCE(?, name),
        mobile = COALESCE(?, mobile),
        email = COALESCE(?, email),
        photo_url = COALESCE(?, photo_url)
        WHERE id=?`).run(director_name, phone, email, director_photo, c.owner_user_id);
    }
  })();

  audit(req, 'coordinator.edit_centre', 'centre', centreId, 'ok', `Coordinator ${req.user.name} updated centre ${name}`);

  res.json({
    ok: true,
    message: 'Centre details updated successfully!',
    centre: { id: centreId, name, director_name, phone, email, state, district, address, pin, director_photo }
  });
});

router.put('/centres/:id', handleCentreEdit);
router.post('/centres/:id/edit', handleCentreEdit);

module.exports = router;
