const argon2 = require('./hash');
const crypto = require('crypto');
const db = require('./db');
(async () => {
  const email = (process.env.SEED_ADMIN_EMAIL || '').toLowerCase();
  if (!email) { console.error('Set SEED_ADMIN_EMAIL (and SEED_ADMIN_PASSWORD) in .env'); process.exit(1); }
  let pw = process.env.SEED_ADMIN_PASSWORD; let generated = false;
  if (!pw) { pw = crypto.randomBytes(12).toString('base64url'); generated = true; }
  if (pw.length < 10) { console.error('SEED_ADMIN_PASSWORD must be 10+ chars'); process.exit(1); }
  if (!db.prepare('SELECT 1 FROM users WHERE email=?').get(email))
    db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES(?,?, 'super_admin', ?, 'active', ?)").run(email, 'Super Admin', await argon2.hash(pw), Date.now());
  else console.log('Admin already exists; password unchanged.');
  const ins = db.prepare('INSERT OR IGNORE INTO courses(code,name,duration_months,fee_paise) VALUES(?,?,?,?)');
  [['DCA', 'Diploma in Computer Applications', 12, 600000], ['ADCA', 'Advanced Diploma in Computer Applications', 18, 900000], ['TALLY', 'Tally with GST', 3, 300000]].forEach((c) => ins.run(...c));
  console.log(`Seeded. Admin: ${email}` + (generated ? `  generated password: ${pw}  (change it)` : ''));
})();
