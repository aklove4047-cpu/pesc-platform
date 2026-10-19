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
module.exports = { HttpError, now, sha, rand, str, h, next, audit, paginate };
