const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { tenant, healthz } = require('./tenant');
const { loadUser, originCheck } = require('./auth');
const { HttpError } = require('./lib');

const lim = (windowMs, limit) => rateLimit({ windowMs, limit, skip: () => process.env.NODE_ENV === 'test', standardHeaders: true, legacyHeaders: false });
const PUB = path.join(__dirname, '..', 'public');
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.get('/healthz', healthz);
app.use('/api/webhooks', require('./routes/webhooks'));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(tenant);
app.use(loadUser);
app.use(originCheck);

app.use('/api/auth', lim(15 * 60e3, 100), require('./routes/auth'));
app.use('/api/public/apply', lim(3600e3, 20));
app.use('/api/public', lim(60e3, 120), require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/centre', require('./routes/centre'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/marksheets', require('./routes/marksheets'));
app.use('/api/coordinator', require('./routes/coordinator'));
app.use('/api/student', require('./routes/student'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use('/assets', express.static(PUB, { index: false }));
const page = (f) => (req, res) => res.sendFile(path.join(PUB, f));
app.get('/', (req, res) => res.sendFile(path.join(PUB, req.tenant ? 'centre-site.html' : 'index.html')));
app.get('/login', page('login.html'));
app.get('/setup', page('setup.html'));
app.get('/verify/:token', page('verify.html'));
app.get('/verify/marksheet/:token', page('verify.html'));
app.get('/admin', page('admin.html'));
app.get('/portal', page('centre.html'));
app.get('/coordinator', page('coordinator.html'));
app.get('/student', page('student.html'));

app.use((req, res) => res.status(404).type('text').send('Not found'));
app.use((err, req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Bad JSON' });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});
module.exports = app;
