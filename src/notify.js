// Notification queue with retries. Only the email adapter exists; SMS/WhatsApp are NOT configured.
const db = require('./db');
const cfg = require('./config');
const { now } = require('./lib');

function queue(channel, to, template, payload) {
  db.prepare('INSERT INTO notifications(channel,to_addr,template,payload,status,created_at) VALUES(?,?,?,?,?,?)')
    .run(channel, to, template, JSON.stringify(payload || {}), 'queued', now());
}
function compose(n) {
  const p = JSON.parse(n.payload || '{}');
  if (n.template === 'centre_activated')
    return { subject: 'Your PESC centre is approved', text: `Hello ${p.name},\n\nYour centre "${p.centre}" is approved and active at ${p.site}.\nSet your password (link expires in 48 hours):\n${p.url}\n` };
  if (n.template === 'password_reset')
    return { subject: 'Reset your PESC password', text: `Use this link within 1 hour to set a new password:\n${p.url}\n` };
  return { subject: 'PESC notification', text: JSON.stringify(p) };
}
const adapters = {
  console: async (n) => { if (cfg.isProd) throw new Error('console adapter is disabled in production'); const m = compose(n); console.log(`[notify:${n.channel}] to=${n.to_addr}\n  ${m.subject}\n  ${m.text.replace(/\n/g, '\n  ')}`); },
  smtp: async (n) => {
    if (!process.env.SMTP_URL) throw new Error('SMTP_URL not configured');
    const t = require('nodemailer').createTransport(process.env.SMTP_URL);
    const m = compose(n);
    await t.sendMail({ from: process.env.MAIL_FROM, to: n.to_addr, subject: m.subject, text: m.text });
  },
};
async function processQueue() {
  const rows = db.prepare("SELECT * FROM notifications WHERE status='queued' AND attempts<5 ORDER BY id LIMIT 20").all();
  for (const n of rows) {
    try {
      if (n.channel !== 'email') throw new Error(`${n.channel} channel is not configured`);
      const ad = adapters[process.env.EMAIL_PROVIDER || 'none'];
      if (!ad) throw new Error('email provider unconfigured');
      await ad(n);
      db.prepare("UPDATE notifications SET status='sent', sent_at=?, payload='{}', attempts=attempts+1 WHERE id=?").run(now(), n.id);
    } catch (e) {
      const failed = n.attempts + 1 >= 5;
      db.prepare('UPDATE notifications SET attempts=attempts+1, last_error=?, status=? WHERE id=?').run(String(e.message).slice(0, 200), failed ? 'failed' : 'queued', n.id);
    }
  }
}
function startWorker() { return setInterval(() => processQueue().catch(() => {}), 10000).unref(); }
module.exports = { queue, processQueue, startWorker };
