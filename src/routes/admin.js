const router = require('express').Router();
const db = require('../db');
const provisioning = require('../provisioning');
const notify = require('../notify');
const cfg = require('../config');
const { requireRole } = require('../auth');
const { HttpError, now, sha, rand, str, h, audit, paginate } = require('../lib');

router.use(requireRole('super_admin', 'admin'));

router.get('/stats', (req, res) => {
  const c = (sql) => db.prepare(sql).get().n;
  res.json({
    centres: { total: c('SELECT COUNT(*) n FROM centres'), active: c("SELECT COUNT(*) n FROM centres WHERE status='active'"), suspended: c("SELECT COUNT(*) n FROM centres WHERE status='suspended'"), failed: c("SELECT COUNT(*) n FROM centres WHERE status='provisioning_failed'") },
    applications_pending: c("SELECT COUNT(*) n FROM franchise_applications WHERE status IN ('Submitted','Under Review','Documents Required')"),
    students: c('SELECT COUNT(*) n FROM students'),
    certificates: { pending: c("SELECT COUNT(*) n FROM certificates WHERE status='Pending'"), valid: c("SELECT COUNT(*) n FROM certificates WHERE status='Valid'") },
    wallet_total_paise: c('SELECT COALESCE(SUM(balance_paise),0) n FROM wallets'),
  });
});

router.get('/applications', (req, res) => {
  const { size, offset } = paginate(req); const st = str(req.query.status, 30);
  const rows = db.prepare(`SELECT a.*, j.status AS job_status, j.error AS job_error, j.id AS job_id FROM franchise_applications a LEFT JOIN provisioning_jobs j ON j.application_id=a.id
    ${st ? 'WHERE a.status=?' : ''} ORDER BY a.id DESC LIMIT ? OFFSET ?`).all(...(st ? [st] : []), size, offset);
  for (const r of rows) if (r.job_id) r.log = db.prepare('SELECT step,ok,detail FROM provisioning_logs WHERE job_id=? ORDER BY id').all(r.job_id);
  res.json({ applications: rows });
});
router.post('/applications/:id/status', (req, res) => {
  const status = str(req.body.status, 30), reason = str(req.body.reason, 300);
  if (!['Under Review', 'Documents Required', 'Rejected'].includes(status)) throw new HttpError(400, 'Invalid status');
  if (['Documents Required', 'Rejected'].includes(status) && !reason) throw new HttpError(400, 'Reason is required');
  const a = db.prepare('SELECT * FROM franchise_applications WHERE id=?').get(+req.params.id);
  if (!a) throw new HttpError(404, 'Not found');
  if (['Approved', 'Rejected', 'Cancelled'].includes(a.status)) throw new HttpError(409, `Application is already ${a.status}`);
  db.prepare('UPDATE franchise_applications SET status=?, decision_reason=?, decided_by=?, decided_at=? WHERE id=?').run(status, reason || null, req.user.id, now(), a.id);
  audit(req, 'application.' + status.toLowerCase().replace(/ /g, '_'), 'application', a.id, 'ok', reason);
  res.json({ ok: true });
});
router.post('/applications/:id/approve', h(async (req, res) => {
  const r = await provisioning.approve(+req.params.id, req);   // also used for retry/resume
  res.status(r.ok ? 200 : 502).json(r);
}));

router.get('/centres', (req, res) => {
  const { size, offset } = paginate(req);
  res.json({ centres: db.prepare(`SELECT c.id,c.centre_code,c.name,c.slug,c.state,c.district,c.status,c.coordinator_id,
    (SELECT COUNT(*) FROM students s WHERE s.centre_id=c.id) AS students FROM centres c ORDER BY c.id DESC LIMIT ? OFFSET ?`).all(size, offset) });
});
const setStatus = (to, from) => (req, res) => {
  const reason = str(req.body.reason, 300); if (!reason) throw new HttpError(400, 'Reason is required');
  const r = db.prepare('UPDATE centres SET status=? WHERE id=? AND status=?').run(to, +req.params.id, from);
  if (!r.changes) throw new HttpError(409, `Centre must be ${from}`);
  audit(req, 'centre.' + to, 'centre', req.params.id, 'ok', reason); res.json({ ok: true });
};
router.post('/centres/:id/suspend', setStatus('suspended', 'active'));
router.post('/centres/:id/activate', setStatus('active', 'suspended'));
router.post('/centres/:id/courses', (req, res) => {
  const ids = (Array.isArray(req.body.course_ids) ? req.body.course_ids : []).map(Number).filter(Number.isInteger);
  const cid = +req.params.id; if (!db.prepare('SELECT 1 FROM centres WHERE id=?').get(cid)) throw new HttpError(404, 'Centre not found');
  db.transaction(() => { db.prepare('DELETE FROM centre_courses WHERE centre_id=?').run(cid);
    for (const id of ids) if (db.prepare('SELECT 1 FROM courses WHERE id=?').get(id)) db.prepare('INSERT INTO centre_courses VALUES(?,?)').run(cid, id); })();
  audit(req, 'centre.courses', 'centre', cid, 'ok', ids.join(',')); res.json({ ok: true });
});
router.post('/centres/:id/coordinator', (req, res) => {
  const co = db.prepare("SELECT id FROM users WHERE id=? AND role='coordinator' AND status='active'").get(+req.body.coordinator_id);
  if (!co) throw new HttpError(400, 'Coordinator not found');
  db.prepare('UPDATE centres SET coordinator_id=? WHERE id=?').run(co.id, +req.params.id);
  audit(req, 'centre.assign_coordinator', 'centre', req.params.id, 'ok', String(co.id)); res.json({ ok: true });
});

router.get('/courses', (req, res) => res.json({ courses: db.prepare('SELECT * FROM courses ORDER BY name').all() }));
router.post('/courses', (req, res) => {
  const b = req.body, code = str(b.code, 20).toUpperCase(), name = str(b.name, 120);
  const dur = +b.duration_months, fee = Math.round(+b.fee_rupees * 100);
  if (!/^[A-Z0-9-]{2,20}$/.test(code) || !name || !(dur > 0) || !(fee >= 0)) throw new HttpError(400, 'Invalid course data');
  try { const r = db.prepare('INSERT INTO courses(code,name,duration_months,fee_paise) VALUES(?,?,?,?)').run(code, name, dur, fee); audit(req, 'course.create', 'course', r.lastInsertRowid); res.status(201).json({ id: r.lastInsertRowid }); }
  catch (e) { if (String(e.code).startsWith('SQLITE_CONSTRAINT')) throw new HttpError(409, 'Course code exists'); throw e; }
});

// Coordinators are created by super admin only; they receive a setup link, never a password.
router.post('/coordinators', requireRole('super_admin'), (req, res) => {
  const email = str(req.body.email).toLowerCase(), name = str(req.body.name, 100), state = str(req.body.state, 60);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) throw new HttpError(400, 'Name and valid email required');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new HttpError(409, 'Email already used');
  const r = db.prepare("INSERT INTO users(email,name,role,state,status,created_at) VALUES(?,?,'coordinator',?,'pending_setup',?)").run(email, name, state, now());
  const token = rand(32);
  db.prepare('INSERT INTO setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(token), r.lastInsertRowid, now() + 48 * 3600e3);
  notify.queue('email', email, 'password_reset', { url: `${cfg.PUBLIC_URL}/setup?token=${token}` });
  audit(req, 'coordinator.create', 'user', r.lastInsertRowid); res.status(201).json({ id: r.lastInsertRowid });
});
router.get('/coordinators', (req, res) => res.json({ coordinators: db.prepare("SELECT id,name,email,state,status FROM users WHERE role='coordinator'").all() }));
router.get('/audit', (req, res) => { const { size, offset } = paginate(req); res.json({ logs: db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ? OFFSET ?').all(size, offset) }); });
module.exports = router;
