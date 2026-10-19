const db = require('./db');
const cfg = require('./config');
const { HttpError, now, sha } = require('./lib');

function loadUser(req, res, next) {
  req.user = null;
  const sid = req.cookies && req.cookies.sid;
  if (sid) {
    const row = db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id
      WHERE s.token_hash=? AND s.expires_at>? AND u.status='active'`).get(sha(sid), now());
    if (row) req.user = row;
  }
  next();
}
function originCheck(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const o = req.headers.origin;
  if (o) { try { if (new URL(o).host !== req.headers.host) return next(new HttpError(403, 'Bad origin')); } catch { return next(new HttpError(403, 'Bad origin')); } }
  next();
}
function requireAuth(req, res, next) {
  const u = req.user;
  if (!u) return next(new HttpError(401, 'Login required'));
  if (req.tenant && cfg.CENTRE_ROLES.includes(u.role) && u.centre_id !== req.tenant.id) return next(new HttpError(403, 'This account does not belong to this centre'));
  next();
}
const requireRole = (...roles) => (req, res, next) =>
  requireAuth(req, res, (e) => e ? next(e) : roles.includes(req.user.role) ? next() : next(new HttpError(403, 'Not permitted')));
module.exports = { loadUser, originCheck, requireAuth, requireRole };
