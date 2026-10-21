const db = require('./db');
const cfg = require('./config');

const resolveSlug = (slug) => {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  // 1. Direct match
  let c = db.prepare("SELECT * FROM centres WHERE LOWER(slug)=?").get(s);
  if (c) return c;
  // 2. Try removing 'computer', '-computer', 'institute', 'academy' suffix (e.g. navyacomputer -> navya)
  const stripped = s.replace(/[-_]?(?:computer|institute|academy|centre|center|tech|it)$/i, '');
  if (stripped && stripped !== s && stripped.length >= 3) {
    c = db.prepare("SELECT * FROM centres WHERE LOWER(slug)=?").get(stripped);
    if (c) return c;
  }
  // 3. Try adding 'computer' (e.g. navya -> navyacomputer)
  c = db.prepare("SELECT * FROM centres WHERE LOWER(slug)=?").get(s + 'computer');
  if (c) return c;
  // 4. Match centre code (e.g. pesc00001)
  c = db.prepare("SELECT * FROM centres WHERE UPPER(centre_code)=?").get(s.toUpperCase());
  return c || null;
};

function slugOf(hostHeader) {
  const host = String(hostHeader || '').toLowerCase().split(':')[0];
  const base = cfg.BASE_DOMAIN;

  // 1. Root apex domains, www, and standard dev hosts
  if (host === 'localhost' || host === '127.0.0.1' || host === 'pescouncil.in' || host === 'www.pescouncil.in') return { kind: 'main' };
  if (base && (host === base || host === 'www.' + base)) return { kind: 'main' };
  if (host.endsWith('.trycloudflare.com')) return { kind: 'main' };
  if (process.env.RENDER_EXTERNAL_HOSTNAME && host === process.env.RENDER_EXTERNAL_HOSTNAME.toLowerCase()) return { kind: 'main' };
  if (host.endsWith('.onrender.com') && (base === 'onrender.com' || !base || base === 'localhost')) return { kind: 'main' };

  // 2. Subdomains of configured base or pescouncil.in
  const effectiveBases = [base, 'pescouncil.in'].filter(b => b && b !== 'localhost' && b !== 'onrender.com');
  for (const b of effectiveBases) {
    if (host.endsWith('.' + b)) {
      const sub = host.slice(0, -(b.length + 1));
      if (sub.includes('.')) return { kind: 'invalid' };
      if (cfg.RESERVED.has(sub)) return { kind: 'main' };
      return { kind: 'tenant', slug: sub };
    }
  }

  // 3. Local development subdomains (e.g., navya.localhost)
  if (host.endsWith('.localhost')) {
    const sub = host.slice(0, -('.localhost'.length));
    if (sub.includes('.')) return { kind: 'invalid' };
    if (cfg.RESERVED.has(sub)) return { kind: 'main' };
    return { kind: 'tenant', slug: sub };
  }

  return { kind: 'main' };
}

const statusPage = (title, msg) =>
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
  `<body style="font-family:system-ui;background:#0a2a5e;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0"><div style="text-align:center;padding:24px"><h1>${title}</h1><p>${msg}</p></div></body>`;
const notFound = (res) => res.status(404).type('html').send(statusPage('Site not found', 'This address is not registered with PESC.'));

function healthz(req, res) {
  const r = slugOf(req.headers.host);
  const c = r.kind === 'tenant' ? resolveSlug(r.slug) : null;
  res.json({ ok: true, tenant: c ? c.slug : null });
}

function tenant(req, res, next) {
  req.tenant = null;
  const r = slugOf(req.headers.host);
  if (r.kind === 'main') return next();
  if (r.kind === 'invalid') return notFound(res);
  const c = resolveSlug(r.slug);
  if (!c || c.status === 'deactivated') return notFound(res);
  if (c.status === 'suspended') return res.status(403).type('html').send(statusPage('Centre suspended', 'This centre is currently restricted. Please contact PESC.'));
  if (c.status !== 'active') return res.status(503).type('html').send(statusPage('Centre is being set up', 'Please check back shortly.'));
  req.tenant = c;
  if (req.path.startsWith('/api/admin') || req.path === '/admin') return notFound(res);
  next();
}
module.exports = { tenant, healthz, resolveSlug, slugOf };
