const db = require('../src/db');
const argon2 = require('../src/hash');

async function run() {
  const ah = await argon2.hash('admin#12345678');
  const ch = await argon2.hash('coord#12345678');
  const oh = await argon2.hash('owner123');
  const sh = await argon2.hash('Student@123');

  db.prepare("UPDATE users SET password_hash=? WHERE role='super_admin'").run(ah);
  db.prepare("UPDATE users SET password_hash=? WHERE role='coordinator'").run(ch);
  db.prepare("UPDATE users SET password_hash=? WHERE role IN ('centre_owner', 'centre_staff')").run(oh);
  db.prepare("UPDATE users SET password_hash=? WHERE role='student'").run(sh);
  db.prepare("UPDATE users SET locked_until=NULL, failed_logins=0").run();
  console.log('PASSWORDS_UPDATED_SUCCESS');
}

run();
