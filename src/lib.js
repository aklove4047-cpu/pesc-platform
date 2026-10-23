const crypto = require('crypto');
const db = require('./db');
class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const now = () => Date.now();
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const rand = (n = 32) => crypto.randomBytes(n).toString('base64url');
const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function next(name) {
  db.prepare('INSERT INTO counters(name,value) VALUES(?,1) ON CONFLICT(name) DO UPDATE SET value=value+1').run(name);
  return db.prepare('SELECT value FROM counters WHERE name=?').get(name).value;
}
// ctx = req or { user, ip }. Never pass passwords/tokens in reason.
function audit(ctx, action, entity, entityId, result = 'ok', reason = null) {
  const u = ctx && ctx.user;
  db.prepare('INSERT INTO audit_logs(user_id,role,action,entity,entity_id,result,reason,ip,at) VALUES(?,?,?,?,?,?,?,?,?)')
    .run(u ? u.id : null, u ? u.role : null, action, entity || null, entityId == null ? null : String(entityId), result, reason, (ctx && ctx.ip) || null, now());
}
const paginate = (req) => {
  const size = Math.min(Math.max(+req.query.size || 20, 1), 50);
  const page = Math.max(+req.query.page || 1, 1);
  return { size, offset: (page - 1) * size, page };
};

function nextCentreCode() {
  const maxRow = db.prepare("SELECT MAX(CAST(SUBSTR(centre_code, 5) AS INTEGER)) AS max_num FROM centres WHERE centre_code LIKE 'PESC%'").get();
  const maxExisting = (maxRow && maxRow.max_num) || 0;
  const counterVal = next('centre');
  const num = Math.max(maxExisting + 1, counterVal);
  db.prepare("INSERT INTO counters(name,value) VALUES('centre',?) ON CONFLICT(name) DO UPDATE SET value=MAX(value, excluded.value)").run(num);
  return 'PESC' + String(num).padStart(5, '0');
}

function nextStudentCode(centreId) {
  const centre = db.prepare('SELECT centre_code FROM centres WHERE id=?').get(centreId);
  if (!centre) throw new HttpError(404, 'Centre not found');
  const year = new Date().getFullYear();
  const prefix = `${centre.centre_code}-${year}-`;
  const maxRow = db.prepare("SELECT student_code FROM students WHERE centre_id=? AND student_code LIKE ? ORDER BY id DESC LIMIT 1").get(centreId, prefix + '%');
  let maxExisting = 0;
  if (maxRow && maxRow.student_code) {
    const parts = maxRow.student_code.split('-');
    const numPart = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(numPart)) maxExisting = numPart;
  }
  const counterVal = next('student:' + centreId);
  const finalNum = Math.max(maxExisting + 1, counterVal);
  db.prepare("INSERT INTO counters(name,value) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value=MAX(value, excluded.value)").run('student:' + centreId, finalNum);
  return `${prefix}${String(finalNum).padStart(5, '0')}`;
}

function nextMarksheetNo() {
  const year = new Date().getFullYear();
  const prefix = `PESC/MRK/${year}/`;
  const maxRow = db.prepare("SELECT marksheet_no FROM marksheets WHERE marksheet_no LIKE ? ORDER BY id DESC LIMIT 1").get(prefix + '%');
  let maxExisting = 0;
  if (maxRow && maxRow.marksheet_no) {
    const parts = maxRow.marksheet_no.split('/');
    const numPart = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(numPart)) maxExisting = numPart;
  }
  const counterVal = next('mrk:' + year);
  const finalNum = Math.max(maxExisting + 1, counterVal);
  db.prepare("INSERT INTO counters(name,value) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value=MAX(value, excluded.value)").run('mrk:' + year, finalNum);
  return `${prefix}${String(finalNum).padStart(6, '0')}`;
}

function nextCertificateNo() {
  const year = new Date().getFullYear();
  const prefix = `PESC/${year}/`;
  const maxRow = db.prepare("SELECT cert_no FROM certificates WHERE cert_no LIKE ? ORDER BY id DESC LIMIT 1").get(prefix + '%');
  let maxExisting = 0;
  if (maxRow && maxRow.cert_no) {
    const parts = maxRow.cert_no.split('/');
    const numPart = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(numPart)) maxExisting = numPart;
  }
  const counterVal = next('cert:' + year);
  const finalNum = Math.max(maxExisting + 1, counterVal);
  db.prepare("INSERT INTO counters(name,value) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value=MAX(value, excluded.value)").run('cert:' + year, finalNum);
  return `${prefix}${String(finalNum).padStart(6, '0')}`;
}

function nextCoordinatorCertNo(state = '') {
  const year = new Date().getFullYear();
  const stCode = (state || 'IN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'HQ';
  const prefix = `PESC/COORD/${stCode}/${year}/`;
  const maxRow = db.prepare("SELECT cert_no FROM coordinator_certificates WHERE cert_no LIKE ? ORDER BY id DESC LIMIT 1").get(prefix + '%');
  let maxExisting = 0;
  if (maxRow && maxRow.cert_no) {
    const parts = maxRow.cert_no.split('/');
    const numPart = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(numPart)) maxExisting = numPart;
  }
  const counterVal = next('coord_cert:' + year);
  const finalNum = Math.max(maxExisting + 1, counterVal);
  db.prepare("INSERT INTO counters(name,value) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET value=MAX(value, excluded.value)").run('coord_cert:' + year, finalNum);
  return `${prefix}${String(finalNum).padStart(4, '0')}`;
}

function getOrCreateCoordinatorCert(userId, userObj = null) {
  let cert = db.prepare('SELECT * FROM coordinator_certificates WHERE user_id=?').get(userId);
  if (!cert) {
    const u = userObj || db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    if (!u) return null;
    const certNo = nextCoordinatorCertNo(u.state);
    const token = rand(24);
    const issueTime = u.created_at || now();
    const validUntil = issueTime + (3 * 365 * 864e5);
    try {
      db.prepare(`
        INSERT INTO coordinator_certificates(user_id, cert_no, token, state, status, issued_at, valid_until, created_at)
        VALUES(?,?,?,?,?,?,?,?)
      `).run(u.id, certNo, token, u.state || 'All State', 'Valid', issueTime, validUntil, now());
      cert = db.prepare('SELECT * FROM coordinator_certificates WHERE user_id=?').get(userId);
    } catch (_) {
      cert = db.prepare('SELECT * FROM coordinator_certificates WHERE user_id=?').get(userId);
    }
  }
  return cert;
}

module.exports = { HttpError, now, sha, rand, str, h, next, nextCentreCode, nextStudentCode, nextMarksheetNo, nextCertificateNo, nextCoordinatorCertNo, getOrCreateCoordinatorCert, audit, paginate };
