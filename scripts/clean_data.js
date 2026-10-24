const db = require('../src/db');

try {
  db.exec('PRAGMA foreign_keys = OFF;');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  console.log('Tables:', tables);

  for (const t of tables) {
    if (t === 'users') {
      db.prepare("DELETE FROM users WHERE role != 'super_admin'").run();
    } else if (t === 'courses' || t.startsWith('sqlite_')) {
      // keep
    } else {
      db.prepare(`DELETE FROM ${t}`).run();
    }
  }
  db.exec('PRAGMA foreign_keys = ON;');
  console.log('CLEAN_DB_SUCCESS', {
    centres: db.prepare('SELECT count(*) as c FROM centres').get().c,
    students: db.prepare('SELECT count(*) as c FROM students').get().c,
    users: db.prepare('SELECT count(*) as c FROM users').get().c
  });
} catch (e) {
  console.error('ERROR:', e);
}
