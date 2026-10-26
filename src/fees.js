// Head-Office-configurable fees, charged from the centre wallet.
// Charge happens when the centre submits (admission / certificate / marksheet request);
// a rejected request is refunded automatically. Every movement is idempotent via its reference.
const db = require('./db');
const wallet = require('./wallet');
const { HttpError } = require('./lib');

const ITEMS = ['admission', 'certificate', 'marksheet'];
const LABEL = { admission: 'Admission', certificate: 'Certificate', marksheet: 'Marksheet' };

const all = () => Object.fromEntries(db.prepare('SELECT item, amount_paise FROM fee_policy').all().map((r) => [r.item, r.amount_paise]));
const amount = (item) => (all()[item] || 0);

function setFee(item, amountPaise, userId) {
  if (!ITEMS.includes(item)) throw new HttpError(400, 'Unknown fee item');
  if (!Number.isInteger(amountPaise) || amountPaise < 0 || amountPaise > 10000000) throw new HttpError(400, 'Invalid amount');
  db.prepare('INSERT INTO fee_policy(item, amount_paise, updated_by, updated_at) VALUES(?,?,?,?) ON CONFLICT(item) DO UPDATE SET amount_paise=excluded.amount_paise, updated_by=excluded.updated_by, updated_at=excluded.updated_at')
    .run(item, amountPaise, userId || null, Date.now());
}

function charge(centreId, item, refId, userId) {
  const amt = amount(item);
  if (amt <= 0) return 0;
  try {
    wallet.debit(centreId, amt, `fee:${item}:${refId}`, `${LABEL[item]} fee`, userId);
  } catch (e) {
    if (e.status === 409 && /Insufficient/i.test(e.message)) {
      throw new HttpError(402, `Insufficient wallet balance: ₹${amt / 100} is needed for ${LABEL[item].toLowerCase()}. Please recharge your wallet.`);
    }
    throw e;
  }
  return amt;
}

// Refund exactly what was charged (not today's policy). Safe to call twice.
function refund(centreId, item, refId, userId) {
  const paid = db.prepare("SELECT amount_paise FROM wallet_transactions WHERE centre_id=? AND reference=? AND kind='debit'").get(centreId, `fee:${item}:${refId}`);
  if (!paid) return 0;
  try { wallet.credit(centreId, paid.amount_paise, `refund:${item}:${refId}`, `${LABEL[item]} fee refund (request rejected)`, userId); }
  catch (e) { if (e.status === 409 && /Duplicate/i.test(e.message)) return 0; throw e; }
  return paid.amount_paise;
}

module.exports = { ITEMS, all, amount, setFee, charge, refund };
