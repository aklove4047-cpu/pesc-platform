const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const file = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'pesc.db');
if (file !== ':memory:') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

const rawDb = new DatabaseSync(file);

// Pragma setup
try { rawDb.exec('PRAGMA journal_mode = WAL;'); } catch (_) {}
try { rawDb.exec('PRAGMA foreign_keys = ON;'); } catch (_) {}

// Wrap db.prepare and statements for better-sqlite3 compatibility
const origPrepare = rawDb.prepare.bind(rawDb);
let txDepth = 0;

const db = {
  exec: rawDb.exec.bind(rawDb),
  pragma: (cmd) => {
    try {
      return rawDb.prepare('PRAGMA ' + cmd).all();
    } catch (_) {
      try { rawDb.exec('PRAGMA ' + cmd); } catch (e) {}
    }
  },
  prepare: (sql) => {
    const stmt = origPrepare(sql);
    const origRun = stmt.run.bind(stmt);
    const origGet = stmt.get.bind(stmt);
    const origAll = stmt.all.bind(stmt);

    const wrap = (fn) => (...args) => {
      try {
        return fn(...args);
      } catch (err) {
        if (err && err.message && err.message.toLowerCase().includes('constraint failed')) {
          err.code = 'SQLITE_CONSTRAINT';
        }
        throw err;
      }
    };

    return {
      run: wrap(origRun),
      get: wrap(origGet),
      all: wrap(origAll),
    };
  },
  transaction: (fn) => {
    return function (...args) {
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
  },
  close: () => rawDb.close(),
};

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, mobile TEXT,
  password_hash TEXT,
  role TEXT NOT NULL CHECK(role IN ('super_admin','admin','coordinator','centre_owner','centre_staff','student')),
  state TEXT, centre_id INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','pending_setup','disabled')),
  failed_logins INTEGER NOT NULL DEFAULT 0, locked_until INTEGER, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS setup_tokens(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL, used_at INTEGER);
CREATE TABLE IF NOT EXISTS centres(
  id INTEGER PRIMARY KEY, centre_code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  owner_user_id INTEGER, coordinator_id INTEGER, state TEXT, district TEXT, address TEXT, pin TEXT,
  status TEXT NOT NULL DEFAULT 'provisioning' CHECK(status IN ('provisioning','provisioning_failed','active','suspended','deactivated')),
  valid_until INTEGER, settings TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS franchise_applications(
  id INTEGER PRIMARY KEY, app_no TEXT UNIQUE NOT NULL, owner_name TEXT NOT NULL, centre_name TEXT NOT NULL,
  mobile TEXT NOT NULL, email TEXT NOT NULL, address TEXT NOT NULL, state TEXT NOT NULL, district TEXT NOT NULL, pin TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Draft','Submitted','Under Review','Documents Required','Approved','Rejected','Cancelled')),
  decision_reason TEXT, decided_by INTEGER, decided_at INTEGER, centre_id INTEGER, created_at INTEGER NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS ux_app_slug_active ON franchise_applications(slug) WHERE status NOT IN ('Rejected','Cancelled');
CREATE INDEX IF NOT EXISTS ix_app_status ON franchise_applications(status);
CREATE TABLE IF NOT EXISTS provisioning_jobs(
  id INTEGER PRIMARY KEY, application_id INTEGER UNIQUE NOT NULL REFERENCES franchise_applications(id),
  status TEXT NOT NULL DEFAULT 'running', error TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS provisioning_logs(
  id INTEGER PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES provisioning_jobs(id), step TEXT NOT NULL,
  ok INTEGER NOT NULL, detail TEXT, at INTEGER NOT NULL, UNIQUE(job_id, step));
CREATE TABLE IF NOT EXISTS counters(name TEXT PRIMARY KEY, value INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS courses(
  id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, duration_months INTEGER NOT NULL,
  fee_paise INTEGER NOT NULL DEFAULT 0, total_marks INTEGER NOT NULL DEFAULT 100, pass_marks INTEGER NOT NULL DEFAULT 33,
  subjects TEXT DEFAULT '[]', active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS centre_courses(centre_id INTEGER NOT NULL REFERENCES centres(id), course_id INTEGER NOT NULL REFERENCES courses(id), PRIMARY KEY(centre_id, course_id));
CREATE TABLE IF NOT EXISTS students(
  id INTEGER PRIMARY KEY, student_code TEXT UNIQUE NOT NULL, centre_id INTEGER NOT NULL REFERENCES centres(id),
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL, father_name TEXT, mobile TEXT, email TEXT, dob TEXT, course_id INTEGER NOT NULL REFERENCES courses(id),
  session TEXT, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_students_centre ON students(centre_id, id);
CREATE TABLE IF NOT EXISTS certificates(
  id INTEGER PRIMARY KEY, cert_no TEXT UNIQUE, token TEXT UNIQUE,
  student_id INTEGER NOT NULL REFERENCES students(id), centre_id INTEGER NOT NULL REFERENCES centres(id), course_id INTEGER NOT NULL REFERENCES courses(id),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Rejected','Valid','Cancelled','Revoked')),
  issued_at INTEGER, expires_at INTEGER, requested_by INTEGER, decided_by INTEGER, reason TEXT, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_cert_centre ON certificates(centre_id, status);

CREATE TABLE IF NOT EXISTS marksheets(
  id INTEGER PRIMARY KEY,
  marksheet_no TEXT UNIQUE,
  token TEXT UNIQUE,
  student_id INTEGER NOT NULL REFERENCES students(id),
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  exam_session TEXT NOT NULL,
  roll_no TEXT,
  subjects TEXT NOT NULL DEFAULT '[]',
  total_max INTEGER NOT NULL,
  total_obtained INTEGER NOT NULL,
  percentage REAL NOT NULL,
  grade TEXT NOT NULL,
  result TEXT NOT NULL DEFAULT 'PASS' CHECK(result IN ('PASS','FAIL','WITHHELD')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Approved','Rejected','Revoked')),
  issue_date INTEGER,
  requested_by INTEGER REFERENCES users(id),
  decided_by INTEGER REFERENCES users(id),
  reason TEXT,
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_mrk_centre ON marksheets(centre_id, status);
CREATE INDEX IF NOT EXISTS ix_mrk_student ON marksheets(student_id);

CREATE TABLE IF NOT EXISTS wallets(centre_id INTEGER PRIMARY KEY REFERENCES centres(id), balance_paise INTEGER NOT NULL DEFAULT 0 CHECK(balance_paise >= 0));
CREATE TABLE IF NOT EXISTS wallet_transactions(
  id INTEGER PRIMARY KEY, centre_id INTEGER NOT NULL REFERENCES centres(id), kind TEXT NOT NULL CHECK(kind IN ('credit','debit')),
  amount_paise INTEGER NOT NULL CHECK(amount_paise > 0), balance_after INTEGER NOT NULL,
  reference TEXT UNIQUE NOT NULL, description TEXT, created_by INTEGER, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_wtx_centre ON wallet_transactions(centre_id, id);
CREATE TABLE IF NOT EXISTS payment_transactions(
  id INTEGER PRIMARY KEY, centre_id INTEGER NOT NULL REFERENCES centres(id), provider_ref TEXT UNIQUE NOT NULL,
  amount_paise INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','failed')),
  purpose TEXT NOT NULL DEFAULT 'wallet_recharge', created_at INTEGER NOT NULL, paid_at INTEGER);
CREATE TABLE IF NOT EXISTS audit_logs(
  id INTEGER PRIMARY KEY, user_id INTEGER, role TEXT, action TEXT NOT NULL, entity TEXT, entity_id TEXT,
  result TEXT NOT NULL DEFAULT 'ok', reason TEXT, ip TEXT, at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS notifications(
  id INTEGER PRIMARY KEY, channel TEXT NOT NULL, to_addr TEXT NOT NULL, template TEXT NOT NULL, payload TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, created_at INTEGER NOT NULL, sent_at INTEGER);
CREATE TABLE IF NOT EXISTS tickets(
  id INTEGER PRIMARY KEY, ticket_no TEXT UNIQUE NOT NULL, centre_id INTEGER NOT NULL REFERENCES centres(id), user_id INTEGER NOT NULL,
  category TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'normal', subject TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS ticket_messages(id INTEGER PRIMARY KEY, ticket_id INTEGER NOT NULL REFERENCES tickets(id), user_id INTEGER NOT NULL, body TEXT NOT NULL, at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS notices(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  content TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT 'all',
  link TEXT,
  pinned INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_by INTEGER REFERENCES users(id),
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_notices_active ON notices(active, pinned, id);

CREATE TABLE IF NOT EXISTS password_otps(
  id INTEGER PRIMARY KEY,
  mobile TEXT NOT NULL,
  email TEXT,
  otp_code TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_otps_user ON password_otps(user_id, otp_code, used);

CREATE TABLE IF NOT EXISTS admission_inquiries(
  id INTEGER PRIMARY KEY,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  course_id INTEGER REFERENCES courses(id),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New', 'Contacted', 'Enrolled', 'Cancelled')),
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_inq_centre ON admission_inquiries(centre_id, status);
CREATE TABLE IF NOT EXISTS student_attendance(
  id INTEGER PRIMARY KEY,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  student_id INTEGER NOT NULL REFERENCES students(id),
  att_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Present' CHECK(status IN ('Present','Absent','Leave')),
  created_at INTEGER NOT NULL,
  UNIQUE(centre_id, student_id, att_date));
CREATE INDEX IF NOT EXISTS ix_att_centre ON student_attendance(centre_id, att_date);

CREATE TABLE IF NOT EXISTS centre_study_materials(
  id INTEGER PRIMARY KEY,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  course_id INTEGER REFERENCES courses(id),
  title TEXT NOT NULL,
  material_type TEXT NOT NULL DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_mat_centre ON centre_study_materials(centre_id);

CREATE TABLE IF NOT EXISTS centre_events(
  id INTEGER PRIMARY KEY,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Notice',
  event_date TEXT,
  content TEXT,
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_cev_centre ON centre_events(centre_id);

CREATE TABLE IF NOT EXISTS centre_assignments(
  id INTEGER PRIMARY KEY,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  course_id INTEGER REFERENCES courses(id),
  title TEXT NOT NULL,
  max_marks INTEGER NOT NULL DEFAULT 50,
  due_date TEXT,
  instructions TEXT,
  created_at INTEGER NOT NULL);
`);

try { rawDb.exec("ALTER TABLE students ADD COLUMN initial_password TEXT DEFAULT 'Student@123';"); } catch (_) {}
try { rawDb.exec("ALTER TABLE students ADD COLUMN fee_total INTEGER DEFAULT 12000;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE students ADD COLUMN fee_paid INTEGER DEFAULT 8000;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE students ADD COLUMN photo_url TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centre_courses ADD COLUMN selling_price_paise INTEGER DEFAULT 0;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN seal_url TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN signature_url TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN logo_url TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE users ADD COLUMN photo_url TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN director_name TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN phone TEXT;"); } catch (_) {}
try { rawDb.exec("ALTER TABLE centres ADD COLUMN email TEXT;"); } catch (_) {}

module.exports = db;
