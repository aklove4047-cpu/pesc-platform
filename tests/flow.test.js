process.env.NODE_ENV = 'test';
process.env.DB_FILE = require('path').join(require('os').tmpdir(), `pesc-test-${Date.now()}.db`);
process.env.BASE_DOMAIN = 'pescouncil.test';
process.env.PUBLIC_URL = 'http://pescouncil.test';
process.env.PAYMENT_WEBHOOK_SECRET = 'testsecret';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const crypto = require('crypto');
const argon2 = require('../src/hash');
const db = require('../src/db');
const app = require('../src/app');

let server, port;
const MAIN = 'pescouncil.test';
function call(method, path, { host = MAIN, body, cookie, raw, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const data = raw ?? (body ? JSON.stringify(body) : null);
    const req = http.request({ port, method, path, headers: { Host: host, ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers } }, (res) => {
      const chunks = []; res.on('data', (c) => chunks.push(c));
      res.on('end', () => { const buf = Buffer.concat(chunks); let json = null; try { json = JSON.parse(buf.toString()); } catch {}
        const sc = res.headers['set-cookie']; resolve({ status: res.statusCode, json, buf, type: res.headers['content-type'], cookie: sc ? sc[0].split(';')[0] : null }); });
    });
    req.on('error', reject); if (data) req.write(data); req.end();
  });
}
const login = async (host, email, password) => { const r = await call('POST', '/api/auth/login', { host, body: { email, password } }); assert.equal(r.status, 200, JSON.stringify(r.json)); return r.cookie; };
const setupLink = (email) => { const n = db.prepare("SELECT payload FROM notifications WHERE to_addr=? AND template='centre_activated' ORDER BY id DESC").get(email); return new URL(JSON.parse(n.payload).url).searchParams.get('token'); };
const apply = (o) => call('POST', '/api/public/apply', { body: { owner_name: 'Ravi Kumar', centre_name: 'Navya Computer Centre', mobile: '9876543210', email: 'ravi@example.com', address: '12 Main Road', state: 'Uttar Pradesh', district: 'Farrukhabad', pin: '209625', slug: 'navya', terms: true, ...o } });

let admin, A = {}, B = {};
const fund = (paise = 1000000) => db.prepare('UPDATE wallets SET balance_paise=?').run(paise); // fees are charged from the wallet now
test.before(async () => {
  db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES('admin@pesc.test','Admin','super_admin',?,'active',?)").run(await argon2.hash('AdminPass#12345'), Date.now());
  db.prepare("INSERT INTO courses(code,name,duration_months,fee_paise) VALUES('DCA','Diploma in Computer Applications',12,600000)").run();
  await new Promise((r) => { server = app.listen(0, () => { port = server.address().port; r(); }); });
  admin = await login(MAIN, 'admin@pesc.test', 'AdminPass#12345');
});
test.after(() => server.close());

test('public application validation, reserved + duplicate slugs', async () => {
  assert.equal((await apply({ slug: 'admin' })).status, 409);
  assert.equal((await apply({ mobile: '12345' })).status, 400);
  const ok = await apply({}); assert.equal(ok.status, 201); assert.match(ok.json.application_no, /^PESC-APP-/);
  assert.equal((await apply({ email: 'x@example.com', mobile: '9876543211' })).status, 409); // same slug
  assert.equal((await apply({ slug: 'other', email: 'ravi@example.com' })).status, 409);       // same email
  const b = await apply({ slug: 'abc', email: 'sita@example.com', mobile: '9123456789', owner_name: 'Sita Devi', centre_name: 'ABC Institute' }); assert.equal(b.status, 201);
});

test('admin endpoints require auth', async () => {
  assert.equal((await call('GET', '/api/admin/stats')).status, 401);
  assert.equal((await call('GET', '/api/admin/stats', { cookie: admin })).status, 200);
});

test('approval provisions centre, owner sets password, tenant login + isolation', async () => {
  const apps = (await call('GET', '/api/admin/applications', { cookie: admin })).json.applications;
  for (const a of apps) { const r = await call('POST', `/api/admin/applications/${a.id}/approve`, { cookie: admin }); assert.equal(r.status, 200, JSON.stringify(r.json)); }
  assert.equal((await call('POST', `/api/admin/applications/${apps[0].id}/approve`, { cookie: admin })).status, 409); // no double provisioning
  const centres = db.prepare('SELECT * FROM centres ORDER BY id').all();
  assert.equal(centres.length, 2); assert.ok(centres.every((c) => c.status === 'active' && /^PESC\d{5}$/.test(c.centre_code)));
  // pending owner cannot log in before setup
  assert.equal((await call('POST', '/api/auth/login', { host: 'navya.pescouncil.test', body: { email: 'ravi@example.com', password: 'whatever12345' } })).status, 401);
  for (const [email, slug, o] of [['ravi@example.com', 'navya', A], ['sita@example.com', 'abc', B]]) {
    const t = setupLink(email);
    assert.equal((await call('POST', '/api/auth/setup', { body: { token: t, password: 'short' } })).status, 400);
    assert.equal((await call('POST', '/api/auth/setup', { body: { token: t, password: 'OwnerPass#12345' } })).status, 200);
    assert.equal((await call('POST', '/api/auth/setup', { body: { token: t, password: 'OwnerPass#12345' } })).status, 400); // single use
    o.host = `${slug}.pescouncil.test`; o.cookie = await login(o.host, email, 'OwnerPass#12345');
    o.centre = db.prepare('SELECT * FROM centres WHERE slug=?').get(slug);
  }
  // A's account cannot be used on B's host
  assert.equal((await call('POST', '/api/auth/login', { host: B.host, body: { email: 'ravi@example.com', password: 'OwnerPass#12345' } })).status, 401);
  assert.equal((await call('GET', '/api/centre/dashboard', { host: B.host, cookie: A.cookie })).status, 403);
  // tenant host cannot reach admin API
  assert.equal((await call('GET', '/api/admin/stats', { host: A.host, cookie: admin })).status, 404);
});

test('unknown subdomain 404, suspended restricted, reserved goes to main', async () => {
  assert.equal((await call('GET', '/', { host: 'nope.pescouncil.test' })).status, 404);
  assert.equal((await call('GET', '/', { host: 'a.b.pescouncil.test' })).status, 404);
  assert.equal((await call('GET', '/', { host: 'www.pescouncil.test' })).status, 200);
  assert.equal((await call('POST', `/api/admin/centres/${B.centre.id}/suspend`, { cookie: admin, body: {} })).status, 400); // reason required
  assert.equal((await call('POST', `/api/admin/centres/${B.centre.id}/suspend`, { cookie: admin, body: { reason: 'non-payment' } })).status, 200);
  assert.equal((await call('GET', '/', { host: B.host })).status, 403);
  assert.equal((await call('POST', `/api/admin/centres/${B.centre.id}/activate`, { cookie: admin, body: { reason: 'paid' } })).status, 200);
  assert.equal((await call('GET', '/healthz', { host: A.host })).json.tenant, 'navya');
});

test('students are tenant scoped; certificates issue, verify, revoke', async () => {
  fund();
  const course = db.prepare('SELECT id FROM courses').get();
  assert.equal((await call('POST', `/api/admin/centres/${A.centre.id}/courses`, { cookie: admin, body: { course_ids: [course.id] } })).status, 200);
  const s = await call('POST', '/api/centre/students', { host: A.host, cookie: A.cookie, body: { name: 'Anil Kumar', mobile: '9000000001', course_id: course.id } });
  assert.equal(s.status, 201);
  assert.equal((await call('POST', '/api/centre/students', { host: B.host, cookie: B.cookie, body: { name: 'X', course_id: course.id } })).status, 400); // course not assigned to B
  assert.equal((await call('GET', `/api/centre/students/${s.json.id}`, { host: B.host, cookie: B.cookie })).status, 404);       // cross-tenant read
  assert.equal((await call('GET', `/api/centre/students/${s.json.id}`, { host: A.host, cookie: A.cookie })).status, 200);
  const c = await call('POST', '/api/centre/certificates', { host: A.host, cookie: A.cookie, body: { student_id: s.json.id } }); assert.equal(c.status, 201);
  assert.equal((await call('POST', '/api/centre/certificates', { host: A.host, cookie: A.cookie, body: { student_id: s.json.id } })).status, 409);
  assert.equal((await call('POST', `/api/certificates/${c.json.id}/decision`, { host: A.host, cookie: A.cookie, body: { decision: 'approve' } })).status, 403); // centre cannot self-approve
  const ap = await call('POST', `/api/certificates/${c.json.id}/decision`, { cookie: admin, body: { decision: 'approve' } });
  assert.equal(ap.status, 200); assert.match(ap.json.cert_no, /^PESC\/\d{4}\/\d{6}$/);
  const token = db.prepare('SELECT token FROM certificates WHERE id=?').get(c.json.id).token;
  const v = await call('GET', `/api/public/verify/${token}`); assert.equal(v.json.status, 'Valid'); assert.equal(v.json.holder, 'A*** K****'); assert.ok(!JSON.stringify(v.json).includes('9000000001'));
  assert.equal((await call('GET', `/api/public/verify/${token}x`)).json.status, 'Not Found');
  const pdf = await call('GET', `/api/certificates/${c.json.id}/pdf`, { host: A.host, cookie: A.cookie }); assert.equal(pdf.status, 200); assert.equal(pdf.type, 'application/pdf');
  assert.equal((await call('GET', `/api/certificates/${c.json.id}/pdf`, { host: B.host, cookie: B.cookie })).status, 404);
  assert.equal((await call('POST', `/api/certificates/${c.json.id}/decision`, { cookie: admin, body: { decision: 'revoke', reason: 'error' } })).status, 200);
  assert.equal((await call('GET', `/api/public/verify/${token}`)).json.status, 'Revoked');
});

test('payments: signature, idempotency, amount check, ledger', async () => {
  db.prepare('DELETE FROM wallet_transactions').run(); db.prepare('UPDATE wallets SET balance_paise=0').run(); // start this test from a clean ledger
  const o = await call('POST', '/api/centre/wallet/recharge', { host: A.host, cookie: A.cookie, body: { amount_rupees: 500 } }); assert.equal(o.status, 201);
  const send = (payload, key = 'testsecret') => { const raw = JSON.stringify(payload); return call('POST', '/api/webhooks/payment', { raw, headers: { 'x-signature': crypto.createHmac('sha256', key).update(raw).digest('hex') } }); };
  const ev = { provider_ref: o.json.provider_ref, status: 'paid', amount_paise: 50000 };
  assert.equal((await send(ev, 'wrong')).status, 401);
  assert.equal((await send({ ...ev, amount_paise: 1 })).status, 400);
  assert.equal((await send(ev)).status, 200);
  assert.equal((await send(ev)).json.duplicate, true);
  const w = await call('GET', '/api/centre/wallet', { host: A.host, cookie: A.cookie });
  assert.equal(w.json.balance_paise, 50000); assert.equal(w.json.ledger.length, 1);
});

test('provisioning failure is recoverable (resume, no duplicates)', async () => {
  await apply({ slug: 'retry', email: 'r@example.com', mobile: '9111111111', owner_name: 'R', centre_name: 'Retry' });
  const a = db.prepare("SELECT id FROM franchise_applications WHERE slug='retry'").get();
  db.prepare("INSERT INTO users(email,name,role,status,created_at) VALUES('r@example.com','Someone','admin','active',?)").run(Date.now()); // collides with owner email
  const r1 = await call('POST', `/api/admin/applications/${a.id}/approve`, { cookie: admin }); assert.equal(r1.status, 502); assert.equal(r1.json.step, 'create_owner');
  db.prepare("DELETE FROM users WHERE email='r@example.com'").run();
  const r2 = await call('POST', `/api/admin/applications/${a.id}/approve`, { cookie: admin }); assert.equal(r2.status, 200);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM centres WHERE slug='retry'").get().n, 1);
});

test('marksheets: submit, approve, public verification, and PDF generation', async () => {
  fund();
  const student = db.prepare('SELECT id, student_code FROM students LIMIT 1').get();
  const submitRes = await call('POST', '/api/marksheets/submit', {
    host: A.host,
    cookie: A.cookie,
    body: {
      student_id: student.id,
      exam_session: '2026',
      roll_no: '2026001',
      subjects: [
        { code: 'DCA101', name: 'Computer Fundamentals', max_theory: 70, obt_theory: 60, max_practical: 30, obt_practical: 25 },
        { code: 'DCA102', name: 'MS Office Suite', max_theory: 70, obt_theory: 55, max_practical: 30, obt_practical: 28 },
      ],
    },
  });
  assert.equal(submitRes.status, 201);
  assert.equal(submitRes.json.total_max, 200);
  assert.equal(submitRes.json.total_obtained, 168);
  assert.equal(submitRes.json.percentage, 84);
  assert.equal(submitRes.json.grade, 'A');
  assert.equal(submitRes.json.result, 'PASS');

  const mrkId = submitRes.json.id;

  // Pending marksheets queue
  const pending = await call('GET', '/api/marksheets/pending', { cookie: admin });
  assert.equal(pending.status, 200);
  assert.ok(pending.json.marksheets.some((m) => m.id === mrkId));

  // Approve marksheet
  const appRes = await call('POST', `/api/marksheets/${mrkId}/decision`, {
    cookie: admin,
    body: { decision: 'approve' },
  });
  assert.equal(appRes.status, 200);
  assert.match(appRes.json.marksheet_no, /^PESC\/MRK\/\d{4}\/\d{6}$/);

  // Public verification by marksheet number
  const v1 = await call('GET', `/api/public/verify-marksheet?marksheet_no=${encodeURIComponent(appRes.json.marksheet_no)}`);
  assert.equal(v1.status, 200);
  assert.equal(v1.json.status, 'Approved');
  assert.equal(v1.json.percentage, 84);
  assert.equal(v1.json.result, 'PASS');

  // Public verification by QR token
  const token = db.prepare('SELECT token FROM marksheets WHERE id=?').get(mrkId).token;
  const v2 = await call('GET', `/api/public/verify/marksheet/${token}`);
  assert.equal(v2.status, 200);
  assert.equal(v2.json.status, 'Approved');

  // PDF download
  const pdf = await call('GET', `/api/marksheets/${mrkId}/pdf`, { host: A.host, cookie: A.cookie });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.type, 'application/pdf');
});

test('student panel: account setup, login, profile, and digital ID card', async () => {
  fund();
  const student = db.prepare('SELECT id, student_code FROM students LIMIT 1').get();
  // Centre provisions student account
  const accRes = await call('POST', `/api/centre/students/${student.id}/account`, {
    host: A.host,
    cookie: A.cookie,
    body: { password: 'StudentPass#12345' },
  });
  assert.equal(accRes.status, 200);
  assert.equal(accRes.json.login_id, student.student_code);

  // Student logs in using student_code
  const studentCookie = await login(MAIN, student.student_code, 'StudentPass#12345');
  assert.ok(studentCookie);

  // Profile view
  const prof = await call('GET', '/api/student/profile', { cookie: studentCookie });
  assert.equal(prof.status, 200);
  assert.equal(prof.json.student.student_code, student.student_code);

  // Marksheets view
  const mrks = await call('GET', '/api/student/marksheets', { cookie: studentCookie });
  assert.equal(mrks.status, 200);
  assert.ok(mrks.json.marksheets.length >= 1);

  // ID Card view
  const idc = await call('GET', '/api/student/id-card', { cookie: studentCookie });
  assert.equal(idc.status, 200);
  assert.equal(idc.json.id_card.student_code, student.student_code);
});

test('coordinator panel & reports with CSV export', async () => {
  // Create coordinator
  const hash = await argon2.hash('CoordPass#12345');
  const coordUser = db.prepare("INSERT INTO users(email, name, role, password_hash, status, created_at) VALUES('coord@pesc.test', 'UP Coordinator', 'coordinator', ?, 'active', ?)")
    .run(hash, Date.now());
  const coordId = coordUser.lastInsertRowid;

  // Assign coordinator to Centre A
  await call('POST', `/api/admin/centres/${A.centre.id}/coordinator`, {
    cookie: admin,
    body: { coordinator_id: coordId },
  });

  const coordCookie = await login(MAIN, 'coord@pesc.test', 'CoordPass#12345');
  assert.ok(coordCookie);

  // Coordinator dashboard
  const dash = await call('GET', '/api/coordinator/dashboard', { cookie: coordCookie });
  assert.equal(dash.status, 200);
  assert.equal(dash.json.stats.centres_total, 1);

  // Reports with CSV export
  const csvAdm = await call('GET', '/api/reports/admissions?format=csv', { cookie: coordCookie });
  assert.equal(csvAdm.status, 200);
  assert.match(csvAdm.type, /text\/csv/);
  assert.ok(csvAdm.buf.toString().includes('Student Code'));

  const csvMrk = await call('GET', '/api/reports/marksheets?format=csv', { cookie: admin });
  assert.equal(csvMrk.status, 200);
  assert.match(csvMrk.type, /text\/csv/);
  assert.ok(csvMrk.buf.toString().includes('Marksheet No'));

  // Coordinator appointment certificate
  const certRes = await call('GET', '/api/coordinator/appointment-cert', { cookie: coordCookie });
  assert.equal(certRes.status, 200);
  assert.ok(certRes.json.certificate);
  assert.ok(certRes.json.certificate.cert_no.includes('PESC/COORD'));
  assert.equal(certRes.json.certificate.status, 'Valid');

  // Public coordinator certificate verification
  const verifyRes = await call('GET', `/api/public/verify/coordinator/${certRes.json.certificate.token}`);
  assert.equal(verifyRes.status, 200);
  assert.equal(verifyRes.json.status, 'Valid');
  assert.equal(verifyRes.json.coordinator_name, 'UP Coordinator');
});

test('centre switch requires target centre admin password', async () => {
  // A.cookie is logged in as Centre A
  // Attempt to switch to Centre B without password
  const noPass = await call('POST', '/api/centre/switch-centre', {
    host: A.host,
    cookie: A.cookie,
    body: { centre_id: B.centre.id },
  });
  assert.equal(noPass.status, 401);

  // Attempt to switch to Centre B with wrong password
  const wrongPass = await call('POST', '/api/centre/switch-centre', {
    host: A.host,
    cookie: A.cookie,
    body: { centre_id: B.centre.id, password: 'WrongPassword123' },
  });
  assert.equal(wrongPass.status, 401);

  // Attempt to switch to Centre B with target centre's master/actual password
  const okPass = await call('POST', '/api/centre/switch-centre', {
    host: A.host,
    cookie: A.cookie,
    body: { centre_id: B.centre.id, password: 'OwnerPass#12345' },
  });
  assert.equal(okPass.status, 200);
  assert.equal(okPass.json.centre.id, B.centre.id);
});


test('fees: charged from wallet, refunded on reject, blocked when balance is short, admin can change them', async () => {
  const course = db.prepare('SELECT id FROM courses').get();
  const bal = () => db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(A.centre.id).balance_paise;
  fund(100000); // Rs 1000
  const list = await call('GET', '/api/centre/fees', { host: A.host, cookie: A.cookie });
  assert.equal(list.status, 200);
  assert.deepEqual(Object.fromEntries(list.json.fees.map((f) => [f.item, f.amount_paise])), { admission: 3500, certificate: 20000, marksheet: 15000 });

  // admission: Rs 35 debited, ledger entry written
  const s = await call('POST', '/api/centre/students', { host: A.host, cookie: A.cookie, body: { name: 'Fee Student', course_id: course.id } });
  assert.equal(s.status, 201); assert.equal(bal(), 100000 - 3500);
  assert.ok(db.prepare("SELECT 1 FROM wallet_transactions WHERE reference=?").get(`fee:admission:${s.json.id}`));

  // certificate: Rs 200 debited on request, refunded in full when rejected (and only once)
  const c = await call('POST', '/api/centre/certificates', { host: A.host, cookie: A.cookie, body: { student_id: s.json.id } });
  assert.equal(c.status, 201); assert.equal(bal(), 100000 - 3500 - 20000);
  assert.equal((await call('POST', `/api/certificates/${c.json.id}/decision`, { cookie: admin, body: { decision: 'reject', reason: 'Incomplete records' } })).status, 200);
  assert.equal(bal(), 100000 - 3500);
  assert.equal((await call('POST', `/api/certificates/${c.json.id}/decision`, { cookie: admin, body: { decision: 'reject', reason: 'again' } })).status, 409);
  assert.equal(bal(), 100000 - 3500);

  // marksheet: Rs 150 debited, refunded on reject
  const m = await call('POST', '/api/marksheets/submit', { host: A.host, cookie: A.cookie, body: { student_id: s.json.id, exam_session: '2026', subjects: [{ code: 'D1', name: 'Fundamentals', max_theory: 70, obt_theory: 50, max_practical: 30, obt_practical: 20 }] } });
  assert.equal(m.status, 201); assert.equal(bal(), 100000 - 3500 - 15000);
  assert.equal((await call('POST', `/api/marksheets/${m.json.id}/decision`, { cookie: admin, body: { decision: 'reject', reason: 'Marks mismatch' } })).status, 200);
  assert.equal(bal(), 100000 - 3500);

  // Head Office changes a fee; centres cannot
  assert.ok([403, 404].includes((await call('PUT', '/api/admin/fees', { host: A.host, cookie: A.cookie, body: { item: 'certificate', amount_rupees: 1 } })).status)); // admin API is not reachable from a centre
  assert.equal((await call('PUT', '/api/admin/fees', { cookie: admin, body: { item: 'certificate', amount_rupees: -5 } })).status, 400);
  assert.equal((await call('PUT', '/api/admin/fees', { cookie: admin, body: { item: 'certificate', amount_rupees: 250 } })).status, 200);
  const c2 = await call('POST', '/api/centre/certificates', { host: A.host, cookie: A.cookie, body: { student_id: s.json.id } });
  assert.equal(c2.status, 201); assert.equal(bal(), 100000 - 3500 - 25000);

  // short balance: 402, and the admission is rolled back completely (no student, no wallet movement)
  fund(1000);
  const before = db.prepare('SELECT COUNT(*) n FROM students').get().n;
  const blocked = await call('POST', '/api/centre/students', { host: A.host, cookie: A.cookie, body: { name: 'Blocked', course_id: course.id } });
  assert.equal(blocked.status, 402); assert.match(blocked.json.error, /Insufficient wallet balance/);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM students').get().n, before); assert.equal(bal(), 1000);
});

test('offline wallet top-up: UTR submission, pre-filled WhatsApp link, admin 1-click approval and balance credit', async () => {
  const bal = () => db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(A.centre.id).balance_paise;
  fund(20000); // Start with Rs 200
  assert.equal(bal(), 20000);

  // 1. Centre fetches Head Office payment settings (UPI & WhatsApp)
  const setRes = await call('GET', '/api/centre/wallet/payment-settings', { host: A.host, cookie: A.cookie });
  assert.equal(setRes.status, 200);
  assert.ok(setRes.json.settings.upi_id);
  assert.ok(setRes.json.settings.whatsapp_number);

  // 2. Centre submits offline top-up request for Rs 500 (50000 paise) with UTR
  const topupRes = await call('POST', '/api/centre/wallet/request-topup', {
    host: A.host,
    cookie: A.cookie,
    body: {
      amount_rupees: 500,
      payment_mode: 'upi',
      utr_number: 'UTR998877665544',
      notes: 'Paid via PhonePe QR'
    }
  });
  assert.equal(topupRes.status, 201);
  assert.equal(topupRes.json.request.amount_paise, 50000);
  assert.equal(topupRes.json.request.status, 'pending');
  assert.equal(topupRes.json.request.utr_number, 'UTR998877665544');
  assert.ok(topupRes.json.whatsapp_url);
  assert.match(topupRes.json.whatsapp_url, /https:\/\/wa\.me\//);
  assert.match(topupRes.json.whatsapp_url, /UTR998877665544/);

  const reqId = topupRes.json.request.id;

  // 3. Admin views incoming pending top-up requests
  const adminList = await call('GET', '/api/admin/wallet-topups?status=pending', { cookie: admin });
  assert.equal(adminList.status, 200);
  const found = adminList.json.requests.find((r) => r.id === reqId);
  assert.ok(found);
  assert.equal(found.utr_number, 'UTR998877665544');
  assert.equal(found.centre_id, A.centre.id);

  // 4. Admin 1-click approves the top-up request
  const approveRes = await call('POST', `/api/admin/wallet-topups/${reqId}/approve`, { cookie: admin });
  assert.equal(approveRes.status, 200);
  assert.equal(approveRes.json.credited_rupees, 500);

  // 5. Wallet balance credited: Rs 200 + Rs 500 = Rs 700 (70000 paise)
  assert.equal(bal(), 70000);

  // 6. Double approval attempt is prevented (409 Conflict)
  const doubleApprove = await call('POST', `/api/admin/wallet-topups/${reqId}/approve`, { cookie: admin });
  assert.equal(doubleApprove.status, 409);
  assert.equal(bal(), 70000);

  // 7. Ledger entry written in wallet_transactions
  const tx = db.prepare('SELECT * FROM wallet_transactions WHERE reference LIKE ?').get(`TOPUP-REQ-${reqId}-%`);
  assert.ok(tx);
  assert.equal(tx.amount_paise, 50000);

  // 8. Admin updates Head Office payment settings
  const updSettings = await call('PUT', '/api/admin/headoffice-payment-settings', {
    cookie: admin,
    body: {
      upi_id: 'pescheadoffice@okhdfcbank',
      upi_name: 'PES Council Central',
      whatsapp_number: '919876543210'
    }
  });
  assert.equal(updSettings.status, 200);

  const freshSettings = await call('GET', '/api/centre/wallet/payment-settings', { host: A.host, cookie: A.cookie });
  assert.equal(freshSettings.json.settings.upi_id, 'pescheadoffice@okhdfcbank');
  assert.equal(freshSettings.json.settings.whatsapp_number, '919876543210');
});

