const fs = require('fs');
const path = require('path');
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile) && typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(envFile); } catch (_) {}
}

const db = require('./db');
const { seedDatabase } = require('./seed');

try {
  const c = db.prepare('SELECT COUNT(*) AS count FROM centres').get();
  if (!c || c.count === 0) {
    console.log('Database empty, seeding PESC system records automatically...');
    seedDatabase().catch(console.error);
  }
} catch (e) {
  console.error('Seed verification note:', e.message);
}

const app = require('./app');
const cfg = require('./config');
const notify = require('./notify');
if (cfg.isProd && !process.env.PAYMENT_WEBHOOK_SECRET) console.warn('WARNING: PAYMENT_WEBHOOK_SECRET not set; payment webhook disabled');
notify.startWorker();
app.listen(cfg.PORT, () => console.log(`PESC platform on :${cfg.PORT} (base domain ${cfg.BASE_DOMAIN})`));
