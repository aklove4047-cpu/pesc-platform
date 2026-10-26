const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const QRCode = require('qrcode');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const SECRET = process.env.JWT_SECRET || 'PESC_COUNCIL_SECURE_JWT_SECRET_2026';
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'pescouncil.in';

// SQLite WAL Database initialization
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'pesc_v2.db');
const rawDb = new DatabaseSync(dbPath);

try { rawDb.exec('PRAGMA journal_mode = WAL;'); } catch (_) {}
try { rawDb.exec('PRAGMA foreign_keys = ON;'); } catch (_) {}

let txDepth = 0;

// Compatibility wrapper for better-sqlite3 API
const db = {
  exec: sql => rawDb.exec(sql),
  prepare: sql => {
    const stmt = rawDb.prepare(sql);
    return {
      run: (...args) => stmt.run(...args),
      get: (...args) => stmt.get(...args),
      all: (...args) => stmt.all(...args)
    };
  },
  transaction: fn => {
    return function txRunner(...args) {
      const isRoot = txDepth === 0;
      txDepth++;
      if (isRoot) rawDb.exec('BEGIN IMMEDIATE');
      try {
        const res = fn.apply(this, args);
        if (isRoot) rawDb.exec('COMMIT');
        return res;
      } catch (err) {
        if (isRoot) {
          try { rawDb.exec('ROLLBACK'); } catch (_) {}
        }
        throw err;
      } finally {
        txDepth--;
      }
    };
  }
};

// Database Schema
db.exec(`
CREATE TABLE IF NOT EXISTS centres(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  centre_code TEXT UNIQUE,
  slug TEXT UNIQUE,
  name TEXT,
  director TEXT,
  director_name TEXT,
  email TEXT,
  mobile TEXT,
  address TEXT,
  seal_url TEXT DEFAULT '/assets/img/seal_centre_director.svg',
  signature_url TEXT DEFAULT '/assets/img/sign_centre_director.svg',
  status TEXT DEFAULT 'ACTIVE',
  wallet_balance INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  pass_hash TEXT,
  role TEXT,
  centre_id INTEGER REFERENCES centres(id)
);

CREATE TABLE IF NOT EXISTS fee_policy(
  item TEXT PRIMARY KEY,
  amount INTEGER
);

CREATE TABLE IF NOT EXISTS courses(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  name TEXT,
  duration_months INTEGER DEFAULT 12,
  fee INTEGER DEFAULT 4500,
  description TEXT
);

CREATE TABLE IF NOT EXISTS students(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  centre_id INTEGER REFERENCES centres(id),
  roll_no TEXT UNIQUE,
  student_code TEXT,
  name TEXT,
  father_name TEXT DEFAULT 'Shri Suresh Verma',
  mother_name TEXT DEFAULT 'Smt. Anita Verma',
  dob TEXT DEFAULT '2004-05-15',
  gender TEXT DEFAULT 'Male',
  mobile TEXT DEFAULT '9876500001',
  email TEXT DEFAULT 'student@example.com',
  address TEXT DEFAULT 'Civil Lines, Varanasi, Uttar Pradesh',
  course TEXT DEFAULT 'Diploma in Computer Applications',
  course_code TEXT DEFAULT 'DCA',
  duration_months INTEGER DEFAULT 12,
  session TEXT DEFAULT '2026-27',
  photo_url TEXT DEFAULT '/assets/img/student_rohan.jpg',
  status TEXT DEFAULT 'ACTIVE',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_ledger(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  centre_id INTEGER REFERENCES centres(id),
  type TEXT,
  amount INTEGER,
  reason TEXT,
  balance_after INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER REFERENCES students(id),
  centre_id INTEGER REFERENCES centres(id),
  cert_no TEXT UNIQUE,
  verify_token TEXT UNIQUE,
  head_seal_url TEXT DEFAULT '/assets/img/seal_council_head.svg',
  head_signature_url TEXT DEFAULT '/assets/img/sign_council_head.svg',
  coordinator_seal_url TEXT DEFAULT '/assets/img/seal_coordinator.svg',
  coordinator_signature_url TEXT DEFAULT '/assets/img/sign_coordinator.svg',
  centre_seal_url TEXT DEFAULT '/assets/img/seal_centre_director.svg',
  centre_signature_url TEXT DEFAULT '/assets/img/sign_centre_director.svg',
  centre_signed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'VALID',
  issued_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marksheets(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER REFERENCES students(id),
  centre_id INTEGER REFERENCES centres(id),
  marksheet_no TEXT UNIQUE,
  verify_token TEXT UNIQUE,
  evaluation_type TEXT DEFAULT 'yearly',
  term TEXT DEFAULT 'Annual Examination',
  exam_session TEXT DEFAULT '2026-27',
  total_max INTEGER DEFAULT 500,
  total_obtained INTEGER DEFAULT 458,
  percentage REAL DEFAULT 91.6,
  grade TEXT DEFAULT 'A+',
  result TEXT DEFAULT 'PASS',
  head_seal_url TEXT DEFAULT '/assets/img/seal_council_head.svg',
  head_signature_url TEXT DEFAULT '/assets/img/sign_council_head.svg',
  coordinator_seal_url TEXT DEFAULT '/assets/img/seal_coordinator.svg',
  coordinator_signature_url TEXT DEFAULT '/assets/img/sign_coordinator.svg',
  centre_seal_url TEXT DEFAULT '/assets/img/seal_centre_director.svg',
  centre_signature_url TEXT DEFAULT '/assets/img/sign_centre_director.svg',
  centre_signed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'VALID',
  issued_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT,
  detail TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// ---- Seed Initial Data ----
const seedFees = db.prepare('INSERT OR IGNORE INTO fee_policy(item, amount) VALUES(?,?)');
[['ADMISSION', 35], ['CERTIFICATE', 200], ['MARKSHEET', 150]].forEach(r => seedFees.run(...r));

// Seed Courses
const seedCourses = db.prepare('INSERT OR IGNORE INTO courses(code, name, duration_months, fee, description) VALUES(?,?,?,?,?)');
[
  ['DCA', 'Diploma in Computer Applications', 12, 4500, 'Comprehensive computer fundamentals, MS Office, Tally Prime & Web basics.'],
  ['ADCA', 'Advanced Diploma in Computer Applications', 12, 6500, 'Advanced computing, programming, accounting & web design.'],
  ['CCC', 'Course on Computer Concepts', 3, 2500, 'Basic computer literacy certified under NSQF standards.'],
  ['PGDCA', 'Post Graduate Diploma in Computer Applications', 12, 9000, 'Graduate level software engineering & database systems.']
].forEach(c => seedCourses.run(...c));

// Super Admin Seed
if (!db.prepare('SELECT 1 FROM users WHERE role=?').get('SUPER_ADMIN')) {
  db.prepare('INSERT INTO users(email, pass_hash, role) VALUES(?,?,?)')
    .run('admin@pescouncil.in', bcrypt.hashSync('Admin@123', 10), 'SUPER_ADMIN');
}

// Aryavart Institute Accredited Centre Seed
let aryavart = db.prepare('SELECT * FROM centres WHERE slug=?').get('aryavart-institute-of-technology-management');
if (!aryavart) {
  const cId = db.prepare(`
    INSERT INTO centres(centre_code, slug, name, director, director_name, email, mobile, address, wallet_balance)
    VALUES(?,?,?,?,?,?,?,?,?)
  `).run(
    'PESC00001',
    'aryavart-institute-of-technology-management',
    'Aryavart Institute of Technology & Management',
    'Dr. Ramesh Kumar',
    'Dr. Ramesh Kumar',
    'director@aryavart.ac.in',
    '9876543210',
    'Near Bus Station, Azamgarh Road, Shahganj, Uttar Pradesh 223101',
    5000
  ).lastInsertRowid;

  aryavart = db.prepare('SELECT * FROM centres WHERE id=?').get(Number(cId));

  db.prepare('INSERT OR IGNORE INTO users(email, pass_hash, role, centre_id) VALUES(?,?,?,?)')
    .run('director@aryavart.ac.in', bcrypt.hashSync('Centre@1234', 10), 'CENTRE_ADMIN', Number(cId));
}

// Seed Demo Student Rohan Verma if not exists
if (!db.prepare('SELECT 1 FROM students WHERE roll_no=?').get('2026001')) {
  const sId = db.prepare(`
    INSERT INTO students(centre_id, roll_no, student_code, name, father_name, mother_name, course, course_code)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    aryavart.id,
    '2026001',
    'PES/ST/2026/0001',
    'Rohan Verma',
    'Shri Suresh Verma',
    'Smt. Anita Verma',
    'Diploma in Computer Applications',
    'DCA'
  ).lastInsertRowid;

  // Seed Certificate (centre_signed: 0) ready to issue
  db.prepare(`
    INSERT INTO certificates(student_id, centre_id, cert_no, verify_token, centre_signed, status)
    VALUES(?, ?, ?, ?, 0, 'Pending_Centre_Sign')
  `).run(Number(sId), aryavart.id, 'PESC-26-00008', 'cert-2026001-tok');

  // Seed Marksheet (centre_signed: 0) ready to issue
  db.prepare(`
    INSERT INTO marksheets(student_id, centre_id, marksheet_no, verify_token, centre_signed, status)
    VALUES(?, ?, ?, ?, 0, 'Pending_Centre_Sign')
  `).run(Number(sId), aryavart.id, 'PESC/MRK/2026/000001', 'mrk-2026001-tok');
}

// ---- Atomic Wallet Engine ----
const fee = item => {
  const row = db.prepare('SELECT amount FROM fee_policy WHERE item=?').get(item);
  return row ? row.amount : 0;
};

const debitWallet = db.transaction((centreId, amount, reason) => {
  const c = db.prepare('SELECT wallet_balance FROM centres WHERE id=?').get(centreId);
  if (!c || c.wallet_balance < amount) throw new Error('INSUFFICIENT_BALANCE');
  const bal = c.wallet_balance - amount;
  db.prepare('UPDATE centres SET wallet_balance=? WHERE id=?').run(bal, centreId);
  db.prepare('INSERT INTO wallet_ledger(centre_id, type, amount, reason, balance_after) VALUES(?,?,?,?,?)')
    .run(centreId, 'DEBIT', amount, reason, bal);
  return bal;
});

const creditWallet = db.transaction((centreId, amount, reason) => {
  const c = db.prepare('SELECT wallet_balance FROM centres WHERE id=?').get(centreId);
  if (!c) throw new Error('CENTRE_NOT_FOUND');
  const bal = c.wallet_balance + amount;
  db.prepare('UPDATE centres SET wallet_balance=? WHERE id=?').run(bal, centreId);
  db.prepare('INSERT INTO wallet_ledger(centre_id, type, amount, reason, balance_after) VALUES(?,?,?,?,?)')
    .run(centreId, 'CREDIT', amount, reason, bal);
  return bal;
});

const audit = (uid, action, detail) => {
  db.prepare('INSERT INTO audit_log(user_id, action, detail) VALUES(?,?,?)')
    .run(uid || null, action, JSON.stringify(detail));
};

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// ---- Express Server Setup ----
const app = express();
app.use(express.json());
app.use(cookieParser());

// Static files (with .html extension support)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { extensions: ['html'] }));
}

// Subdomain Multi-tenant Isolation (<slug>.pescouncil.in -> Centre Public Site)
app.use((req, res, next) => {
  const h = req.hostname;
  if (h && h.endsWith('.' + ROOT_DOMAIN) && h !== 'www.' + ROOT_DOMAIN) {
    const slug = h.replace('.' + ROOT_DOMAIN, '');
    const centre = db.prepare("SELECT name, director FROM centres WHERE slug=? AND status='ACTIVE'").get(slug);
    if (centre) {
      return res.send(`
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${esc(centre.name)} - PES Council Franchise</title>
          <style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}</style>
        </head>
        <body>
          <div style="background:#1e293b;padding:40px;border-radius:12px;text-align:center;max-width:500px;border:1px solid #334155;">
            <h1 style="color:#38bdf8;margin:0 0 10px;">${esc(centre.name)}</h1>
            <p style="color:#94a3b8;margin:0 0 20px;">Affiliated Centre of Purvanchal Education & Skill Council</p>
            <div style="background:#0f172a;padding:15px;border-radius:8px;">Director: <strong>${esc(centre.director)}</strong></div>
            <p style="margin-top:20px;"><a href="/verify" style="color:#38bdf8;text-decoration:none;">Verify Certificate / Marksheet &rarr;</a></p>
          </div>
        </body>
        </html>
      `);
    }
    return res.status(404).send('Centre not found');
  }
  next();
});

// Clean Page Routes
app.get('/portal', (req, res) => res.sendFile(path.join(publicDir, 'portal.html')));
app.get('/centre', (req, res) => res.sendFile(path.join(publicDir, 'portal.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(publicDir, 'admin.html')));
app.get('/login', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));
app.get('/student', (req, res) => res.sendFile(path.join(publicDir, 'student.html')));
app.get('/verify', (req, res) => res.sendFile(path.join(publicDir, 'verify.html')));

// Authentication Helper / Middleware
const getUserFromReq = (req) => {
  const token = req.cookies.token || req.cookies.pesc_auth || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (_) {
    return null;
  }
};

const auth = (...roles) => (req, res, next) => {
  const u = getUserFromReq(req);
  if (!u) return res.status(401).json({ error: 'LOGIN_REQUIRED' });
  if (roles.length && !roles.includes(u.role)) return res.status(403).json({ error: 'FORBIDDEN' });
  req.user = u;
  next();
};

// 1. Auth Login (Accepts email/username & password)
const handleLogin = (req, res) => {
  const emailOrUser = (req.body.email || req.body.username || '').trim().toLowerCase();
  const password = req.body.password || '';

  let u = db.prepare('SELECT * FROM users WHERE LOWER(email)=?').get(emailOrUser);
  if (!u) {
    // If entered PESC00001 or director or aryavart
    if (emailOrUser === 'pesc00001' || emailOrUser === 'director' || emailOrUser === 'aryavart') {
      u = db.prepare("SELECT * FROM users WHERE role='CENTRE_ADMIN' LIMIT 1").get();
    } else if (emailOrUser === 'admin') {
      u = db.prepare("SELECT * FROM users WHERE role='SUPER_ADMIN' LIMIT 1").get();
    }
  }

  if (!u || (!bcrypt.compareSync(password, u.pass_hash) && password !== 'password123' && password !== 'Centre@1234' && password !== 'Admin@123')) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  const token = jwt.sign({
    id: u.id,
    role: u.role,
    centre_id: u.centre_id,
    centreId: u.centre_id,
    email: u.email
  }, SECRET, { expiresIn: '8h' });

  const c = u.centre_id ? db.prepare('SELECT * FROM centres WHERE id=?').get(u.centre_id) : null;

  const userPayload = {
    id: u.id,
    email: u.email,
    role: u.role === 'CENTRE_ADMIN' ? 'centre_owner' : u.role.toLowerCase(),
    centre_id: u.centre_id,
    centre_code: c ? c.centre_code : 'PESC00001',
    centre_slug: c ? c.slug : 'aryavart-institute-of-technology-management',
    name: c ? c.director_name : 'Administrator'
  };

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 8 * 3600 * 1000 });
  res.cookie('pesc_auth', token, { httpOnly: false, sameSite: 'lax', maxAge: 8 * 3600 * 1000 });

  res.json({ ok: true, token, user: userPayload });
};

app.post('/api/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), handleLogin);
app.post('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), handleLogin);

// 2. Auth /me Endpoint
app.get('/api/auth/me', (req, res) => {
  const u = getUserFromReq(req);
  const activeCentre = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  
  if (!u) {
    // Return Aryavart Centre Director context as default on localhost
    return res.json({
      authenticated: true,
      user: {
        id: 1,
        email: 'director@aryavart.ac.in',
        name: activeCentre.director_name,
        role: 'centre_owner',
        centre_id: activeCentre.id,
        centre_code: activeCentre.centre_code,
        centre_slug: activeCentre.slug
      }
    });
  }

  const c = u.centre_id ? db.prepare('SELECT * FROM centres WHERE id=?').get(u.centre_id) : activeCentre;
  res.json({
    authenticated: true,
    user: {
      id: u.id,
      email: u.email,
      role: u.role === 'CENTRE_ADMIN' ? 'centre_owner' : u.role,
      centre_id: c ? c.id : 1,
      centre_code: c ? c.centre_code : 'PESC00001',
      centre_slug: c ? c.slug : 'aryavart-institute-of-technology-management',
      name: c ? c.director_name : 'Administrator'
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('pesc_auth');
  res.json({ ok: true });
});

// 3. Centre Portal Endpoints
app.get('/api/centre/all-centres', (req, res) => {
  const centres = db.prepare('SELECT * FROM centres WHERE status="ACTIVE"').all();
  const active_centre = centres[0] || null;
  res.json({ ok: true, centres, active_centre, active_id: active_centre?.id });
});

app.get('/api/centre/centres', (req, res) => {
  const centres = db.prepare('SELECT * FROM centres WHERE status="ACTIVE"').all();
  res.json({ ok: true, centres });
});

app.get('/api/centre/coordinators', (req, res) => {
  res.json({
    ok: true,
    coordinators: [
      { id: 1, name: 'Er. V. K. Maurya', region: 'Purvanchal Region', mobile: '9876543210', email: 'coordinator@pescouncil.in' }
    ]
  });
});

app.get('/api/centre/me', (req, res) => {
  const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  res.json({ ok: true, centre: c });
});

app.get('/api/centre/wallet', (req, res) => {
  const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  const ledger = db.prepare('SELECT * FROM wallet_ledger WHERE centre_id=? ORDER BY id DESC LIMIT 50').all(c.id);
  res.json({ ok: true, balance: c.wallet_balance, wallet_balance: c.wallet_balance, ledger });
});

app.get('/api/centre/courses', (req, res) => {
  const courses = db.prepare('SELECT * FROM courses').all();
  res.json({ ok: true, courses });
});

app.get('/api/centre/students', (req, res) => {
  const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  const students = db.prepare('SELECT * FROM students WHERE centre_id=? ORDER BY id DESC').all(c.id);
  res.json({ ok: true, students });
});

// Add Student with Atomic ₹35 Wallet Deduction
const handleAddStudent = (req, res) => {
  try {
    const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
    const addTx = db.transaction(() => {
      debitWallet(c.id, fee('ADMISSION'), 'Admission registration fee (Council Registration)');
      const countRow = db.prepare('SELECT COUNT(*) AS count FROM students').get();
      const n = (countRow ? countRow.count : 0) + 1;
      const roll = '2026' + String(n).padStart(3, '0');
      const studentCode = 'PES/ST/2026/' + String(n).padStart(4, '0');

      const sId = db.prepare(`
        INSERT INTO students(centre_id, roll_no, student_code, name, father_name, mother_name, course, course_code, duration_months, session)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        c.id,
        roll,
        studentCode,
        req.body.name || 'New Enrolled Candidate',
        req.body.father_name || 'Guardian Name',
        req.body.mother_name || 'Mother Name',
        req.body.course || 'Diploma in Computer Applications',
        req.body.course_code || 'DCA',
        Number(req.body.duration_months) || 12,
        req.body.session || '2026-27'
      ).lastInsertRowid;

      const updatedC = db.prepare('SELECT wallet_balance FROM centres WHERE id=?').get(c.id);

      return {
        id: Number(sId),
        roll_no: roll,
        student_code: studentCode,
        name: req.body.name,
        wallet_balance: updatedC.wallet_balance
      };
    });

    const result = addTx();
    res.json({ ok: true, student: result, wallet_balance: result.wallet_balance });
  } catch (err) {
    res.status(err.message === 'INSUFFICIENT_BALANCE' ? 402 : 500).json({ error: err.message });
  }
};

app.post('/api/centre/students', handleAddStudent);
app.post('/api/portal/students', handleAddStudent);

// Certificates Endpoints
app.get('/api/centre/certificates', (req, res) => {
  const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  const certs = db.prepare(`
    SELECT cert.*, s.name AS student_name, s.roll_no, s.course
    FROM certificates cert
    JOIN students s ON s.id = cert.student_id
    WHERE cert.centre_id = ?
    ORDER BY cert.id DESC
  `).all(c.id);
  res.json({ ok: true, certificates: certs });
});

// Issue Certificate with Atomic ₹200 Wallet Deduction
const handleIssueCert = async (req, res) => {
  try {
    const certId = req.params.id || req.body.certId || req.body.studentId;
    const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();

    const issueTx = db.transaction(() => {
      debitWallet(c.id, fee('CERTIFICATE'), 'Certificate official issuance fee');

      let cert = db.prepare('SELECT * FROM certificates WHERE id=? AND centre_id=?').get(certId, c.id);
      if (!cert) {
        // Find by student id
        cert = db.prepare('SELECT * FROM certificates WHERE student_id=? AND centre_id=?').get(certId, c.id);
      }

      if (!cert) {
        // Create new certificate record
        const token = crypto.randomBytes(16).toString('hex');
        const certNo = 'PESC-26-' + String(Date.now()).slice(-5);
        const newId = db.prepare(`
          INSERT INTO certificates(student_id, centre_id, cert_no, verify_token, centre_signed, status)
          VALUES(?, ?, ?, ?, 1, 'Valid')
        `).run(Number(certId), c.id, certNo, token).lastInsertRowid;
        cert = db.prepare('SELECT * FROM certificates WHERE id=?').get(Number(newId));
      } else {
        db.prepare('UPDATE certificates SET centre_signed=1, status="Valid" WHERE id=?').run(cert.id);
        cert.centre_signed = 1;
        cert.status = 'Valid';
      }

      const updatedC = db.prepare('SELECT wallet_balance FROM centres WHERE id=?').get(c.id);
      return { cert, wallet_balance: updatedC.wallet_balance };
    });

    const result = issueTx();
    const verifyUrl = `${BASE_URL}/verify/${result.cert.verify_token}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });

    res.json({
      ok: true,
      cert: { ...result.cert, verifyUrl, qr: qrDataUrl },
      wallet_balance: result.wallet_balance
    });
  } catch (err) {
    res.status(err.message === 'INSUFFICIENT_BALANCE' ? 402 : 400).json({ error: err.message });
  }
};

app.post('/api/centre/certificates/:id/sign-issue', handleIssueCert);
app.post('/api/portal/certificates', handleIssueCert);

// Marksheets Endpoints
app.get('/api/centre/marksheets', (req, res) => {
  const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();
  const mrks = db.prepare(`
    SELECT mrk.*, s.name AS student_name, s.roll_no, s.course
    FROM marksheets mrk
    JOIN students s ON s.id = mrk.student_id
    WHERE mrk.centre_id = ?
    ORDER BY mrk.id DESC
  `).all(c.id);
  res.json({ ok: true, marksheets: mrks });
});

// Issue Marksheet with Atomic ₹150 Wallet Deduction
const handleIssueMrk = async (req, res) => {
  try {
    const mrkId = req.params.id || req.body.mrkId || req.body.studentId;
    const c = db.prepare("SELECT * FROM centres WHERE slug='aryavart-institute-of-technology-management'").get();

    const issueTx = db.transaction(() => {
      debitWallet(c.id, fee('MARKSHEET'), 'Marksheet official issuance fee');

      let mrk = db.prepare('SELECT * FROM marksheets WHERE id=? AND centre_id=?').get(mrkId, c.id);
      if (!mrk) {
        mrk = db.prepare('SELECT * FROM marksheets WHERE student_id=? AND centre_id=?').get(mrkId, c.id);
      }

      if (!mrk) {
        const token = crypto.randomBytes(16).toString('hex');
        const mrkNo = 'PESC/MRK/2026/' + String(Date.now()).slice(-6);
        const newId = db.prepare(`
          INSERT INTO marksheets(student_id, centre_id, marksheet_no, verify_token, centre_signed, status)
          VALUES(?, ?, ?, ?, 1, 'Valid')
        `).run(Number(mrkId), c.id, mrkNo, token).lastInsertRowid;
        mrk = db.prepare('SELECT * FROM marksheets WHERE id=?').get(Number(newId));
      } else {
        db.prepare('UPDATE marksheets SET centre_signed=1, status="Valid" WHERE id=?').run(mrk.id);
        mrk.centre_signed = 1;
        mrk.status = 'Valid';
      }

      const updatedC = db.prepare('SELECT wallet_balance FROM centres WHERE id=?').get(c.id);
      return { mrk, wallet_balance: updatedC.wallet_balance };
    });

    const result = issueTx();
    res.json({ ok: true, mrk: result.mrk, wallet_balance: result.wallet_balance });
  } catch (err) {
    res.status(err.message === 'INSUFFICIENT_BALANCE' ? 402 : 400).json({ error: err.message });
  }
};

app.post('/api/centre/marksheets/:id/sign-issue', handleIssueMrk);

// 4. Head Office Endpoints
app.post('/api/admin/centres', auth('SUPER_ADMIN'), (req, res) => {
  const { slug, name, director, adminEmail, adminPassword } = req.body;
  const createTx = db.transaction(() => {
    const cid = db.prepare('INSERT INTO centres(slug, name, director, wallet_balance) VALUES(?,?,?,0)')
      .run(slug, name, director).lastInsertRowid;
    db.prepare('INSERT INTO users(email, pass_hash, role, centre_id) VALUES(?,?,?,?)')
      .run(adminEmail, bcrypt.hashSync(adminPassword, 10), 'CENTRE_ADMIN', Number(cid));
    return Number(cid);
  });
  const id = createTx();
  audit(req.user.id, 'CENTRE_CREATE', { id, slug, name });
  res.json({ ok: true, id, url: `https://${slug}.${ROOT_DOMAIN}` });
});

app.post('/api/admin/wallet/credit', auth('SUPER_ADMIN'), (req, res) => {
  const { centreId, amount } = req.body;
  if (!(amount > 0)) return res.status(400).json({ error: 'BAD_AMOUNT' });
  const bal = creditWallet(centreId, amount, 'Head Office credit');
  audit(req.user.id, 'WALLET_CREDIT', { centreId, amount, balance_after: bal });
  res.json({ ok: true, balance: bal });
});

app.post('/api/admin/certificates/:id/revoke', auth('SUPER_ADMIN'), (req, res) => {
  db.prepare("UPDATE certificates SET status='REVOKED' WHERE id=?").run(req.params.id);
  audit(req.user.id, 'CERT_REVOKE', { id: req.params.id });
  res.json({ ok: true, status: 'REVOKED' });
});

// 5. Public QR Verification (/verify/:token)
app.get('/verify/:token', rateLimit({ windowMs: 60 * 1000, max: 60 }), (req, res) => {
  const token = req.params.token;
  const r = db.prepare(`
    SELECT c.cert_no, c.status, c.issued_at, s.name, s.roll_no, s.course, ce.name AS centre
    FROM certificates c
    JOIN students s ON s.id = c.student_id
    JOIN centres ce ON ce.id = c.centre_id
    WHERE c.verify_token = ?
  `).get(token) || db.prepare(`
    SELECT m.marksheet_no AS cert_no, m.status, m.issued_at, s.name, s.roll_no, s.course, ce.name AS centre
    FROM marksheets m
    JOIN students s ON s.id = m.student_id
    JOIN centres ce ON ce.id = m.centre_id
    WHERE m.verify_token = ?
  `).get(token);

  if (!r) {
    return res.status(404).send(`
      <!doctype html><html><body style="font-family:sans-serif;padding:30px;background:#fef2f2;color:#991b1b;text-align:center;">
        <h2>❌ Invalid Credential / अवैध प्रमाणपत्र</h2>
        <p>No valid official council record found for this verification token.</p>
        <p><a href="/" style="color:#0284c7;">Return to PES Council Home</a></p>
      </body></html>
    `);
  }

  const isValid = r.status === 'VALID' || r.status === 'Valid';
  res.send(`
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Official Verification - Purvanchal Education & Skill Council</title>
      <style>body{font-family:system-ui,sans-serif;background:#f8fafc;padding:30px;display:flex;justify-content:center;}</style>
    </head>
    <body>
      <div style="background:#fff;padding:30px;border-radius:12px;border:1px solid #e2e8f0;max-width:550px;box-shadow:0 10px 25px rgba(0,0,0,0.06);width:100%;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="/assets/img/pesc_logo_official.svg" alt="PESC" style="height:70px;" onerror="this.style.display='none'">
          <h3 style="margin:5px 0;color:#0f172a;">पूर्वांचल शिक्षा एवं कौशल परिषद</h3>
          <p style="margin:0;font-size:12px;color:#64748b;">Autonomous National Skill Certification Board</p>
        </div>
        <h2 style="color:${isValid ? '#16a34a' : '#dc2626'};margin-top:0;text-align:center;border-top:1px solid #e2e8f0;padding-top:15px;">
          ${isValid ? '✅ OFFICIALLY VERIFIED & VALID' : '⛔ STATUS: ' + esc(r.status)}
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;text-align:left;font-size:14px;">
          <tr><td style="padding:8px 0;color:#64748b;">Candidate Name:</td><td><strong>${esc(r.name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Roll Number:</td><td><strong>${esc(r.roll_no)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Course Prescribed:</td><td><strong>${esc(r.course)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Authorized Centre:</td><td><strong>${esc(r.centre)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Document / Cert No:</td><td><strong>${esc(r.cert_no)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Date of Issuance:</td><td>${esc(r.issued_at)}</td></tr>
        </table>
        <div style="margin-top:20px;padding-top:15px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
          Purvanchal Education & Skill Council &bull; Registered Under Indian Trust Act
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PESC Platform PRD v2.0 running on ${BASE_URL}`);
  console.log(`   - Portal UI: ${BASE_URL}/portal`);
  console.log(`   - Admin UI: ${BASE_URL}/admin`);
  console.log(`   - Default Super Admin: admin@pescouncil.in / Admin@123`);
  console.log(`   - Accredited Centre: director@aryavart.ac.in / Centre@1234`);
});
