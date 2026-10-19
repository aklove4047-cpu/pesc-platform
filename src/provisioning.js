// Approve -> provision centre. Every step is idempotent and logged; failed jobs can be retried/resumed.
const dns = require('dns').promises;
const db = require('./db');
const cfg = require('./config');
const notify = require('./notify');
const { resolveSlug } = require('./tenant');
const { HttpError, now, sha, rand, next, audit } = require('./lib');

const getApp = (id) => db.prepare('SELECT * FROM franchise_applications WHERE id=?').get(id);
const hostOf = (slug) => `${slug}.${cfg.BASE_DOMAIN}`;

const STEPS = [
  ['create_owner', (a) => db.transaction(() => {
    const email = a.email.toLowerCase();
    const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!u) { db.prepare("INSERT INTO users(email,name,mobile,role,status,created_at) VALUES(?,?,?,'centre_owner','pending_setup',?)").run(email, a.owner_name, a.mobile, now()); return 'owner created'; }
    if (u.role !== 'centre_owner') throw new Error('Email belongs to a non-owner account');
    if (u.centre_id && u.centre_id !== a.centre_id) throw new Error('Owner already linked to another centre');
    return 'owner exists';
  })()],
  ['create_centre', (a) => db.transaction(() => {
    if (a.centre_id) return 'centre exists';
    if (resolveSlug(a.slug)) throw new Error('Slug already taken');
    const owner = db.prepare('SELECT id FROM users WHERE email=?').get(a.email.toLowerCase());
    const code = 'PESC' + String(next('centre')).padStart(5, '0');
    const r = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,state,district,address,pin,status,created_at) VALUES(?,?,?,?,?,?,?,?,'provisioning',?)")
      .run(code, a.centre_name, a.slug, owner.id, a.state, a.district, a.address, a.pin, now());
    db.prepare('UPDATE franchise_applications SET centre_id=? WHERE id=?').run(r.lastInsertRowid, a.id);
    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(r.lastInsertRowid, owner.id);
    return code;
  })()],
  ['init_settings', (a) => db.transaction(() => {
    const c = getApp(a.id).centre_id;
    db.prepare("UPDATE centres SET settings=? WHERE id=? AND settings='{}'").run(JSON.stringify({ theme: { primary: '#0a2a5e' }, certificates: { enabled: true } }), c);
    db.prepare('INSERT OR IGNORE INTO wallets(centre_id,balance_paise) VALUES(?,0)').run(c);
    return 'settings + wallet ready';
  })()],
  ['health_tenant', (a) => { const c = resolveSlug(a.slug); if (!c || c.id !== getApp(a.id).centre_id) throw new Error('Tenant lookup failed'); return 'tenant resolves'; }],
  ['health_dns', async (a) => {
    if (process.env.PROVISION_CHECK_DNS !== 'true') return 'SKIPPED (PROVISION_CHECK_DNS != true)';
    try { await dns.lookup(hostOf(a.slug)); } catch { throw new Error(`DNS for ${hostOf(a.slug)} not resolving - check wildcard record`); }
    return 'dns ok';
  }],
  ['health_https', async (a) => {
    if (process.env.PROVISION_CHECK_HTTPS !== 'true') return 'SKIPPED (PROVISION_CHECK_HTTPS != true)';
    let j; try { const r = await fetch(`https://${hostOf(a.slug)}/healthz`, { signal: AbortSignal.timeout(8000) }); j = await r.json(); } catch { throw new Error('HTTPS check failed (certificate/routing)'); }
    if (!j || j.tenant !== a.slug) throw new Error('HTTPS reachable but tenant not resolved');
    return 'https + routing ok';
  }],
  ['activate', (a) => { db.prepare("UPDATE centres SET status='active' WHERE id=?").run(getApp(a.id).centre_id); return 'centre active'; }],
  ['send_setup_link', (a) => db.transaction(() => {
    const u = db.prepare('SELECT * FROM users WHERE email=?').get(a.email.toLowerCase());
    const token = rand(32);
    db.prepare('INSERT INTO setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(token), u.id, now() + 48 * 3600e3);
    const proto = cfg.PUBLIC_URL.startsWith('https') ? 'https' : 'http';
    notify.queue('email', u.email, 'centre_activated', { name: u.name, centre: a.centre_name, site: `${proto}://${hostOf(a.slug)}`, url: `${cfg.PUBLIC_URL}/setup?token=${token}` });
    return 'setup link queued (expires 48h)';
  })()],
];

async function runJob(jobId, ctx) {
  const job = db.prepare('SELECT * FROM provisioning_jobs WHERE id=?').get(jobId);
  const done = new Set(db.prepare('SELECT step FROM provisioning_logs WHERE job_id=? AND ok=1').all(jobId).map((r) => r.step));
  db.prepare("UPDATE provisioning_jobs SET status='running', error=NULL, updated_at=? WHERE id=?").run(now(), jobId);
  const cid = getApp(job.application_id).centre_id;
  if (cid) db.prepare("UPDATE centres SET status='provisioning' WHERE id=? AND status='provisioning_failed'").run(cid);
  for (const [name, fn] of STEPS) {
    if (done.has(name)) continue;
    try {
      const detail = await fn(getApp(job.application_id));
      db.prepare('INSERT OR REPLACE INTO provisioning_logs(job_id,step,ok,detail,at) VALUES(?,?,1,?,?)').run(jobId, name, detail, now());
    } catch (e) {
      db.prepare('INSERT OR REPLACE INTO provisioning_logs(job_id,step,ok,detail,at) VALUES(?,?,0,?,?)').run(jobId, name, e.message, now());
      db.prepare("UPDATE provisioning_jobs SET status='failed', error=?, updated_at=? WHERE id=?").run(`${name}: ${e.message}`, now(), jobId);
      const c = getApp(job.application_id).centre_id;
      if (c) db.prepare("UPDATE centres SET status='provisioning_failed' WHERE id=? AND status='provisioning'").run(c);
      audit(ctx, 'provision.failed', 'application', job.application_id, 'error', name);
      return { ok: false, step: name, error: e.message };
    }
  }
  db.prepare("UPDATE provisioning_jobs SET status='done', updated_at=? WHERE id=?").run(now(), jobId);
  audit(ctx, 'provision.done', 'application', job.application_id);
  return { ok: true };
}

async function approve(appId, ctx) {
  const a = getApp(appId);
  if (!a) throw new HttpError(404, 'Application not found');
  if (!['Submitted', 'Under Review', 'Documents Required', 'Approved'].includes(a.status)) throw new HttpError(409, `Cannot approve an application that is ${a.status}`);
  let job = db.prepare('SELECT * FROM provisioning_jobs WHERE application_id=?').get(appId);
  if (job && job.status === 'done') throw new HttpError(409, 'Already provisioned');
  db.transaction(() => {
    db.prepare("UPDATE franchise_applications SET status='Approved', decided_by=?, decided_at=? WHERE id=?").run(ctx.user.id, now(), appId);
    if (!job) { const r = db.prepare("INSERT INTO provisioning_jobs(application_id,status,created_at,updated_at) VALUES(?, 'running', ?, ?)").run(appId, now(), now()); job = { id: r.lastInsertRowid }; }
    audit(ctx, 'application.approve', 'application', appId);
  })();
  return runJob(job.id, ctx);
}
module.exports = { approve };
