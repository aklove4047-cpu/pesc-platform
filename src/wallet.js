// Ledger-based wallet. Balance only changes through these functions, inside a DB transaction.
const db = require('./db');
const { HttpError, now } = require('./lib');
const move = db.transaction((centreId, kind, amountPaise, reference, description, userId) => {
  if (!Number.isInteger(amountPaise) || amountPaise <= 0) throw new HttpError(400, 'Invalid amount');
  db.prepare('INSERT OR IGNORE INTO wallets(centre_id,balance_paise) VALUES(?,0)').run(centreId);
  const w = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId);
  const bal = kind === 'credit' ? w.balance_paise + amountPaise : w.balance_paise - amountPaise;
  if (bal < 0) throw new HttpError(409, 'Insufficient balance');
  try {
    db.prepare('INSERT INTO wallet_transactions(centre_id,kind,amount_paise,balance_after,reference,description,created_by,created_at) VALUES(?,?,?,?,?,?,?,?)')
      .run(centreId, kind, amountPaise, bal, reference, description || null, userId || null, now());
  } catch (e) {
    if (String(e.code).startsWith('SQLITE_CONSTRAINT')) throw new HttpError(409, 'Duplicate reference'); // idempotency guard
    throw e;
  }
  db.prepare('UPDATE wallets SET balance_paise=? WHERE centre_id=?').run(bal, centreId);
  return bal;
});
module.exports = { credit: (c, a, r, d, u) => move(c, 'credit', a, r, d, u), debit: (c, a, r, d, u) => move(c, 'debit', a, r, d, u) };
