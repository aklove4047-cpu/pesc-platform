// Payment webhook: raw body + HMAC signature + idempotent wallet credit.
const router = require('express').Router();
const crypto = require('crypto');
const express = require('express');
const db = require('../db');
const wallet = require('../wallet');
const { now, audit } = require('../lib');

router.post('/payment', express.raw({ type: '*/*', limit: '50kb' }), (req, res) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Webhook secret not configured' });
  const sig = Buffer.from(String(req.headers['x-signature'] || ''), 'hex');
  const want = crypto.createHmac('sha256', secret).update(req.body).digest();
  if (sig.length !== want.length || !crypto.timingSafeEqual(sig, want)) return res.status(401).json({ error: 'Bad signature' });
  let e; try { e = JSON.parse(req.body.toString('utf8')); } catch { return res.status(400).json({ error: 'Bad JSON' }); }
  try {
    const out = db.transaction(() => {
      const t = db.prepare('SELECT * FROM payment_transactions WHERE provider_ref=?').get(String(e.provider_ref));
      if (!t) return [404, { error: 'Unknown order' }];
      if (t.status !== 'pending') return [200, { ok: true, duplicate: true }];            // replay -> no double credit
      if (e.status !== 'paid') { db.prepare("UPDATE payment_transactions SET status='failed' WHERE id=?").run(t.id); return [200, { ok: true }]; }
      if (+e.amount_paise !== t.amount_paise) { audit({ ip: req.ip }, 'payment.amount_mismatch', 'payment', t.provider_ref, 'denied'); return [400, { error: 'Amount mismatch' }]; }
      db.prepare("UPDATE payment_transactions SET status='paid', paid_at=? WHERE id=?").run(now(), t.id);
      wallet.credit(t.centre_id, t.amount_paise, `pay:${t.provider_ref}`, 'Wallet recharge');
      audit({ ip: req.ip }, 'payment.paid', 'payment', t.provider_ref);
      return [200, { ok: true }];
    })();
    res.status(out[0]).json(out[1]);
  } catch (err) { console.error('webhook error', err.message); res.status(500).json({ error: 'Processing failed' }); }
});
module.exports = router;
