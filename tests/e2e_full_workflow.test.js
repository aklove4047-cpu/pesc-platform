process.env.NODE_ENV = 'test';
process.env.DB_FILE = require('path').join(require('os').tmpdir(), `pesc-e2e-${Date.now()}.db`);
process.env.BASE_DOMAIN = 'pescouncil.test';
process.env.PUBLIC_URL = 'http://pescouncil.test';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const db = require('../src/db');
const argon2 = require('../src/hash');
const app = require('../src/app');

let server, port;
const MAIN = 'pescouncil.test';

function call(method, path, { host = MAIN, body, cookie, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      port,
      method,
      path,
      headers: {
        Host: host,
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...headers
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        let json = null;
        try { json = JSON.parse(buf.toString()); } catch {}
        const sc = res.headers['set-cookie'];
        resolve({
          status: res.statusCode,
          json,
          buf,
          cookie: sc ? sc[0].split(';')[0] : null
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const testStampHO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const testSignHO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const testPhotoHO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPifDwAEiAGAfbY5tQAAAABJRU5ErkJggg==';

const testStampCoord = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWMrwHwADsQF/JcM4uAAAAABJRU5ErkJggg==';
const testSignCoord = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWMjwHwADrAF8m3J5rQAAAABJRU5ErkJggg==';

const testDirectorPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwGAMTe3QAAAAABJRU5ErkJggg==';
const testCenterLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAHn2BAAAAAElFTkSuQmCC';
const testCenterSeal = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P//PwAF/AL+3eW8uAAAAABJRU5ErkJggg==';
const testCenterSign = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPj//38ACVwD/qU0yroAAAAASUVORK5CYII=';

const testStudentPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkeP7/PwAH+gMBb5dEwQAAAABJRU5ErkJggg==';

const testTs = Date.now();
const coordEmail = `coord_${testTs}@pescouncil.test`;
const franchiseEmail = `director_${testTs}@pitcouncil.test`;
const franchiseSlug = `preeti-tech-${testTs}`;

let hoCookie = '';
let coordCookie = '';
let centreCookie = '';
let studentCookie = '';

let coordId;
let franchiseAppId;
let centreId;
let studentId;
let studentCode;
let courseId;

test.before(async () => {
  // Seed super admin
  db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES('admin@pesc.test','Head Office Admin','super_admin',?,'active',?)")
    .run(await argon2.hash('Admin@123'), Date.now());

  // Seed course: Nursery Teacher Training
  const rCourse = db.prepare("INSERT INTO courses(code,name,duration_months,fee_paise) VALUES('NTT','Nursery Teacher Training',12,600000)").run();
  courseId = rCourse.lastInsertRowid;

  await new Promise((r) => { server = app.listen(0, () => { port = server.address().port; r(); }); });
});

test.after(() => server.close());

test('1. Head Office logs in, uploads Mohar + Sign, changes password, and re-logs in', async () => {
  const loginRes = await call('POST', '/api/auth/login', { body: { email: 'admin@pesc.test', password: 'Admin@123' } });
  assert.equal(loginRes.status, 200);
  hoCookie = loginRes.cookie;
  assert.ok(hoCookie, 'HO Cookie received');

  // Update Head Office Profile with Mohar + Sign
  const profileRes = await call('POST', '/api/admin/profile', {
    cookie: hoCookie,
    body: {
      name: 'Central Council Executive Director',
      email: 'admin@pesc.test',
      mobile: '9415200000',
      seal_url: testStampHO,
      signature_url: testSignHO,
      photo_url: testPhotoHO
    }
  });
  assert.equal(profileRes.status, 200);
  assert.equal(profileRes.json.ok, true);

  // Verify profile holds the uploaded assets
  const getProfile = await call('GET', '/api/admin/profile', { cookie: hoCookie });
  assert.equal(getProfile.status, 200);
  assert.equal(getProfile.json.profile.seal_url, testStampHO);
  assert.equal(getProfile.json.profile.signature_url, testSignHO);

  // Change Head Office Password to "AdminNew@2026"
  const chgPwRes = await call('POST', '/api/admin/change-password', {
    cookie: hoCookie,
    body: { new_password: 'AdminNew@2026' }
  });
  assert.equal(chgPwRes.status, 200);

  // Login with NEW password
  const reLoginRes = await call('POST', '/api/auth/login', { body: { email: 'admin@pesc.test', password: 'AdminNew@2026' } });
  assert.equal(reLoginRes.status, 200);
  hoCookie = reLoginRes.cookie;
  assert.ok(hoCookie);
});

test('2. Head Office creates regional coordinator and provides credentials', async () => {
  const addCoord = await call('POST', '/api/admin/coordinators', {
    cookie: hoCookie,
    body: {
      name: 'Purvanchal Coordinator Vikram',
      email: coordEmail,
      mobile: '9876543210',
      address: 'Civil Lines, Gorakhpur',
      district: 'Gorakhpur',
      state: 'Uttar Pradesh',
      pin: '273001',
      qualification: 'MCA',
      territory: 'Eastern UP'
    }
  });
  assert.equal(addCoord.status, 201);
  assert.ok(addCoord.json.id);
  assert.equal(addCoord.json.email, coordEmail);
  assert.equal(addCoord.json.password, 'Coord@123');
  assert.ok(addCoord.json.cert_no);
  coordId = addCoord.json.id;
});

test('3. Coordinator logs in with Coord@123, adds Sign+Mohar, changes password, re-logs in', async () => {
  const cLogin = await call('POST', '/api/auth/login', { body: { email: coordEmail, password: 'Coord@123' } });
  assert.equal(cLogin.status, 200);
  assert.equal(cLogin.json.user.role, 'coordinator');
  coordCookie = cLogin.cookie;

  // Update coordinator profile with Sign & Seal
  const cProfileRes = await call('POST', '/api/coordinator/profile', {
    cookie: coordCookie,
    body: {
      name: 'Purvanchal Coordinator Vikram',
      mobile: '9876543210',
      state: 'Uttar Pradesh',
      seal_url: testStampCoord,
      signature_url: testSignCoord
    }
  });
  assert.equal(cProfileRes.status, 200);

  // Verify coordinator profile
  const getCProfile = await call('GET', '/api/coordinator/profile', { cookie: coordCookie });
  assert.equal(getCProfile.status, 200);
  assert.equal(getCProfile.json.profile.seal_url, testStampCoord);
  assert.equal(getCProfile.json.profile.signature_url, testSignCoord);

  // Change coordinator password
  const chgPw = await call('POST', '/api/coordinator/change-password', {
    cookie: coordCookie,
    body: { new_password: 'CoordNew@2026' }
  });
  assert.equal(chgPw.status, 200);

  // Re-login with new password
  const cReLogin = await call('POST', '/api/auth/login', { body: { email: coordEmail, password: 'CoordNew@2026' } });
  assert.equal(cReLogin.status, 200);
  coordCookie = cReLogin.cookie;
});

test('4. Apply for franchise with photo from main website & approve from Head Office', async () => {
  const applyRes = await call('POST', '/api/public/apply', {
    body: {
      centre_name: 'Preeti Institute of Technology',
      owner_name: 'Preeti Director',
      mobile: '9876512345',
      email: franchiseEmail,
      address: 'Shahgarh, Azamgarh, Uttar Pradesh',
      state: 'Uttar Pradesh',
      district: 'Azamgarh',
      pin: '276001',
      slug: franchiseSlug,
      photo: testDirectorPhoto,
      terms: 'on',
      declaration: 'on'
    }
  });
  assert.equal(applyRes.status, 201);
  assert.ok(applyRes.json.application_no);
  franchiseAppId = applyRes.json.id;

  // Head Office reviews & approves application
  const approveRes = await call('POST', `/api/admin/applications/${franchiseAppId}/decision`, {
    cookie: hoCookie,
    body: { decision: 'Approved' }
  });
  assert.equal(approveRes.status, 200);

  const centre = db.prepare('SELECT * FROM centres WHERE slug=?').get(franchiseSlug);
  assert.ok(centre, 'Centre provisioned');
  centreId = centre.id;
  assert.equal(centre.director_photo, testDirectorPhoto, 'Director photo persisted');

  // Check Affiliation Certificate
  const certRes = await call('GET', `/api/admin/centres/${centreId}/affiliation-cert`, { cookie: hoCookie });
  assert.equal(certRes.status, 200);
  const cert = certRes.json.certificate;
  assert.equal(cert.director_photo, testDirectorPhoto, 'Affiliation cert shows director photo');
  assert.equal(cert.coordinator.seal_url, testStampCoord, 'Affiliation cert shows coordinator seal');
  assert.equal(cert.coordinator.signature_url, testSignCoord, 'Affiliation cert shows coordinator signature');
  assert.equal(cert.head_office.seal_url, testStampHO, 'Affiliation cert shows HO seal');
  assert.equal(cert.head_office.signature_url, testSignHO, 'Affiliation cert shows HO signature');
});

test('5. Center logs in with Centre@123, updates profile (Logo+Mohar+Sign), changes password', async () => {
  const cLogin = await call('POST', '/api/auth/login', { body: { email: franchiseEmail, password: 'Centre@123' } });
  assert.equal(cLogin.status, 200);
  assert.equal(cLogin.json.user.role, 'centre_owner');
  centreCookie = cLogin.cookie;

  // Update Centre Profile with Logo, Seal, Sign, Hindi Name
  const updProfile = await call('POST', '/api/centre/profile', {
    cookie: centreCookie,
    body: {
      name: 'Preeti Institute of Technology',
      hindi_name: 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी',
      logo_url: testCenterLogo,
      seal_url: testCenterSeal,
      signature_url: testCenterSign,
      director_name: 'Preeti Director',
      phone: '9876512345',
      address: 'Shahgarh, Azamgarh, Uttar Pradesh'
    }
  });
  assert.equal(updProfile.status, 200);

  // Verify settings
  const settingsRes = await call('GET', '/api/centre/settings', { cookie: centreCookie });
  assert.equal(settingsRes.status, 200);
  assert.equal(settingsRes.json.centre.logo_url, testCenterLogo);
  assert.equal(settingsRes.json.centre.seal_url, testCenterSeal);
  assert.equal(settingsRes.json.centre.signature_url, testCenterSign);
  assert.equal(settingsRes.json.centre.hindi_name, 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी');

  // Change Center Password
  const chgPw = await call('POST', '/api/centre/change-password', {
    cookie: centreCookie,
    body: { new_password: 'CentreNew@2026' }
  });
  assert.equal(chgPw.status, 200);

  // Re-login with new password
  const reLogin = await call('POST', '/api/auth/login', { body: { email: franchiseEmail, password: 'CentreNew@2026' } });
  assert.equal(reLogin.status, 200);
  centreCookie = reLogin.cookie;
});

test('6. Center wallet check (fails ₹35), requests ₹1000 topup, HO approves, student added (-₹35)', async () => {
  db.prepare('INSERT OR IGNORE INTO centre_courses(centre_id, course_id) VALUES(?,?)').run(centreId, courseId);
  // Attempt adding student with 0 balance -> Should fail 402 Insufficient wallet balance
  const failEnroll = await call('POST', '/api/centre/students', {
    cookie: centreCookie,
    body: {
      name: 'Preeti Student',
      course_id: courseId,
      duration_months: 12,
      dob: '2005-01-15',
      father_name: 'Ram',
      mother_name: 'Geeta',
      category: 'OBC',
      blood_group: 'O+',
      photo_url: testStudentPhoto
    }
  });
  assert.equal(failEnroll.status, 402, 'Should reject admission due to 0 wallet balance');

  // Request ₹1,000 top-up from center
  const topupReq = await call('POST', '/api/centre/wallet/request-topup', {
    cookie: centreCookie,
    body: {
      amount_rupees: 1000,
      payment_mode: 'upi',
      utr_number: 'UTR9823482390'
    }
  });
  assert.equal(topupReq.status, 201);
  const topupId = topupReq.json.request.id;

  // Head Office approves top-up
  const approveTopup = await call('POST', `/api/admin/wallet-topups/${topupId}/approve`, {
    cookie: hoCookie
  });
  assert.equal(approveTopup.status, 200);
  assert.equal(approveTopup.json.balance_paise, 100000, 'Wallet has ₹1,000');

  // Enroll student with photo -> Debits ₹35 (3500 paise)
  const enrollRes = await call('POST', '/api/centre/students', {
    cookie: centreCookie,
    body: {
      name: 'Preeti Student',
      course_id: courseId,
      duration_months: 12,
      dob: '2005-01-15',
      father_name: 'Ram',
      mother_name: 'Geeta',
      category: 'OBC',
      blood_group: 'O+',
      address: 'Village and post shahgarh district Azamgarh',
      photo_url: testStudentPhoto
    }
  });
  assert.equal(enrollRes.status, 201);
  assert.ok(enrollRes.json.student_code);
  assert.equal(enrollRes.json.password, 'Student@123');
  studentId = enrollRes.json.student ? enrollRes.json.student.id : enrollRes.json.id;
  studentCode = enrollRes.json.student_code;

  // Verify wallet balance is 100000 - 3500 = 96500 paise (₹965)
  const walletCheck = await call('GET', '/api/centre/wallet', { cookie: centreCookie });
  assert.equal(walletCheck.status, 200);
  assert.equal(walletCheck.json.balance_paise, 96500, '₹35 deducted');
});

test('7. Marksheet and Certificate issued with Head Office, Coordinator & Center seals', async () => {
  // Generate marksheet (debits ₹150)
  const mrkRes = await call('POST', `/api/centre/marksheets/${studentId}/sign-issue`, {
    cookie: centreCookie,
    body: { fee: 150, student_id: studentId }
  });
  assert.equal(mrkRes.status, 200);
  assert.equal(mrkRes.json.ok, true);

  // Generate certificate (debits ₹200)
  const certRes = await call('POST', `/api/centre/certificates/${studentId}/sign-issue`, {
    cookie: centreCookie,
    body: { fee: 200, student_id: studentId }
  });
  assert.equal(certRes.status, 200);
  assert.equal(certRes.json.ok, true);

  // Balance after 96500 - 35000 = 61500 paise (₹615)
  const walletAfter = await call('GET', '/api/centre/wallet', { cookie: centreCookie });
  assert.equal(walletAfter.status, 200);
  assert.equal(walletAfter.json.balance_paise, 61500);
});

test('8. Student logs in with Student@123, views profile, admission form, I-card, marksheet & cert', async () => {
  const stuLogin = await call('POST', '/api/auth/login', { body: { email: studentCode, password: 'Student@123' } });
  assert.equal(stuLogin.status, 200);
  assert.equal(stuLogin.json.user.role, 'student');
  studentCookie = stuLogin.cookie;

  // Check student profile
  const profileRes = await call('GET', '/api/student/profile', { cookie: studentCookie });
  assert.equal(profileRes.status, 200);
  const stu = profileRes.json.student;
  assert.equal(stu.name, 'Preeti Student');
  assert.equal(stu.father_name, 'Ram');
  assert.equal(stu.mother_name, 'Geeta');
  assert.equal(stu.photo, testStudentPhoto);

  // Check student marksheets
  const mrkList = await call('GET', '/api/student/marksheets', { cookie: studentCookie });
  assert.equal(mrkList.status, 200);
  assert.ok(mrkList.json.marksheets.length >= 1, 'Marksheet is available');

  // Check student certificates
  const certList = await call('GET', '/api/student/certificates', { cookie: studentCookie });
  assert.equal(certList.status, 200);
  assert.ok(certList.json.certificates.length >= 1, 'Certificate is available');

  // Check student ID card
  const idCard = await call('GET', '/api/student/id-card', { cookie: studentCookie });
  assert.equal(idCard.status, 200);
  assert.ok(idCard.json.id_card);
});
