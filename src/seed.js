const fs = require('fs');
const path = require('path');
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile) && typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(envFile); } catch (_) {}
}

const argon2 = require('./hash');
const crypto = require('crypto');
const db = require('./db');

(async () => {
  console.log('Seeding PESC Council Platform database…');

  // 1. Super Admin
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@pescouncil.in').toLowerCase();
  const adminPw = process.env.SEED_ADMIN_PASSWORD || 'Admin#12345678';
  let admin = db.prepare('SELECT id FROM users WHERE email=?').get(adminEmail);
  if (!admin) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES(?,?, 'super_admin', ?, 'active', ?)")
      .run(adminEmail, 'Super Admin (Head Office)', await argon2.hash(adminPw), Date.now());
    admin = { id: r.lastInsertRowid };
    console.log(`Created Super Admin: ${adminEmail}`);
  }

  // 2. Comprehensive Course Catalog (Vocational, IT, Technical & Skill Development)
  const coursesData = [
    ['DCA', 'Diploma in Computer Applications', 12, 600000, 100, 33],
    ['ADCA', 'Advanced Diploma in Computer Applications', 18, 900000, 100, 33],
    ['TALLY', 'Tally Prime with GST & Accounting', 3, 350000, 100, 33],
    ['CCC', 'Course on Computer Concepts', 3, 250000, 100, 33],
    ['PGDCA', 'Post Graduate Diploma in Computer Applications', 12, 1200000, 100, 33],
    ['DTP', 'Desktop Publishing & Graphic Designing', 6, 450000, 100, 33],
    ['HARDWARE', 'Diploma in Computer Hardware & Networking (CHN)', 6, 550000, 100, 33],
    ['YOGA', 'Diploma in Yoga & Naturopathy Education', 12, 750000, 100, 33],
    ['FASHION', 'Diploma in Fashion Designing & Garment Fabrication', 12, 800000, 100, 33],
  ];
  const insCourse = db.prepare('INSERT OR IGNORE INTO courses(code,name,duration_months,fee_paise,total_marks,pass_marks,subjects,active) VALUES(?,?,?,?,?,?,\'[]\',1)');
  coursesData.forEach(c => insCourse.run(...c));
  const defaultCourse = db.prepare("SELECT id FROM courses WHERE code='DCA'").get() || db.prepare('SELECT id FROM courses LIMIT 1').get();

  // 3. Regional State Coordinator
  const coordEmail = 'coord@pescouncil.in';
  let coord = db.prepare('SELECT id FROM users WHERE email=?').get(coordEmail);
  if (!coord) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,state,status,created_at) VALUES(?,?,'coordinator',?,'Uttar Pradesh','active',?)")
      .run(coordEmail, 'Vikram Singh (State Coordinator)', await argon2.hash('Coord#12345678'), Date.now());
    coord = { id: r.lastInsertRowid };
    console.log(`Created Coordinator: ${coordEmail}`);
  }

  // 4. Franchise Centre 1 (Navya Computer Institute, Varanasi)
  const owner1Email = 'owner@navya.test';
  let owner1 = db.prepare('SELECT id FROM users WHERE email=?').get(owner1Email);
  if (!owner1) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES(?,?,'centre_owner',?,'active',?)")
      .run(owner1Email, 'Ravi Verma (Centre Director)', await argon2.hash('OwnerPass#12345'), Date.now());
    owner1 = { id: r.lastInsertRowid };
  }
  let centre1 = db.prepare('SELECT id FROM centres WHERE slug=?').get('navya');
  if (!centre1) {
    const r = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,coordinator_id,state,district,address,pin,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)")
      .run('PESC00001', 'Navya Computer Institute', 'navya', owner1.id, coord.id, 'Uttar Pradesh', 'Varanasi', 'B-12, Lanka Road, Near BHU Gate, Varanasi', '221005', Date.now());
    centre1 = { id: r.lastInsertRowid };
    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(centre1.id, owner1.id);

    // Initial centre wallet balance: ₹50,000.00
    db.prepare("INSERT OR REPLACE INTO wallets(centre_id,balance_paise) VALUES(?,?)").run(centre1.id, 5000000);
    console.log(`Created Centre: Navya Computer Institute (PESC00001)`);
  }

  // Assign courses to centre 1
  const allCourses = db.prepare('SELECT id FROM courses').all();
  const insCC = db.prepare('INSERT OR IGNORE INTO centre_courses(centre_id,course_id) VALUES(?,?)');
  allCourses.forEach(c => insCC.run(centre1.id, c.id));

  // 5. Franchise Centre 2 (Apex Skill Academy, Farrukhabad)
  const owner2Email = 'director@apexskills.com';
  let owner2 = db.prepare('SELECT id FROM users WHERE email=?').get(owner2Email);
  if (!owner2) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES(?,?,'centre_owner',?,'active',?)")
      .run(owner2Email, 'Rajesh Kumar Sharma', await argon2.hash('OwnerPass#12345'), Date.now());
    owner2 = { id: r.lastInsertRowid };
  }
  let centre2 = db.prepare('SELECT id FROM centres WHERE slug=?').get('apexskills');
  if (!centre2) {
    const r = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,coordinator_id,state,district,address,pin,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)")
      .run('PESC00002', 'Apex Skill & Computer Academy', 'apexskills', owner2.id, coord.id, 'Uttar Pradesh', 'Farrukhabad', 'Station Road, Kaimganj, Farrukhabad', '209502', Date.now());
    centre2 = { id: r.lastInsertRowid };
    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(centre2.id, owner2.id);
    db.prepare("INSERT OR REPLACE INTO wallets(centre_id,balance_paise) VALUES(?,?)").run(centre2.id, 2500000);
  }
  allCourses.forEach(c => insCC.run(centre2.id, c.id));

  // Ensure wallets exist for all centres
  const allCentres = db.prepare('SELECT id FROM centres').all();
  for (const c of allCentres) {
    if (!db.prepare('SELECT 1 FROM wallets WHERE centre_id=?').get(c.id)) {
      db.prepare('INSERT OR REPLACE INTO wallets(centre_id,balance_paise) VALUES(?,?)').run(c.id, 5000000);
    }
  }

  // 6. Pending Franchise Application (For Admin to test 1-click Review & Approve)
  const appNo = 'PESC-APP-2026-000002';
  if (!db.prepare('SELECT id FROM franchise_applications WHERE app_no=?').get(appNo)) {
    db.prepare(`INSERT INTO franchise_applications(app_no,owner_name,centre_name,mobile,email,address,state,district,pin,slug,status,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,'Submitted',?)`)
      .run(appNo, 'Suresh Chandra Gupta', 'National Institute of IT & Skills', '9838123456', 'suresh@niitskills.org', 'Civil Lines, Gorakhpur', 'Uttar Pradesh', 'Gorakhpur', '273001', 'niit-gorakhpur', Date.now());
    console.log(`Created sample pending franchise application: ${appNo}`);
  }

  // 7. Sample Student (Rahul Sharma)
  const studentEmail = 'rahul@student.pescouncil.in';
  let studentUser = db.prepare('SELECT id FROM users WHERE email=?').get(studentEmail);
  if (!studentUser) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?,'student',?,?,'active',?)")
      .run(studentEmail, 'Rahul Sharma', await argon2.hash('Student@12345'), centre1.id, Date.now());
    studentUser = { id: r.lastInsertRowid };
  }
  let student = db.prepare('SELECT id FROM students WHERE student_code=?').get('PESC00001-2026-00001');
  if (!student) {
    const r = db.prepare(`INSERT INTO students(student_code,centre_id,user_id,name,father_name,mobile,email,dob,course_id,session,status,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,'active',?)`)
      .run('PESC00001-2026-00001', centre1.id, studentUser.id, 'Rahul Sharma', 'Anand Kumar Sharma', '9876543210', studentEmail, '2002-05-15', defaultCourse.id, '2026-27', Date.now());
    student = { id: r.lastInsertRowid };
    console.log('Created Student: Rahul Sharma (Roll No: 2026101)');
  }

  // 8. Approved Marksheet with subjects
  let mrk = db.prepare('SELECT id FROM marksheets WHERE marksheet_no=?').get('PESC/MRK/2026/000001');
  if (!mrk) {
    const subjects = JSON.stringify([
      { code: 'DCA101', name: 'Computer Fundamentals & OS', max_theory: 70, obt_theory: 62, max_practical: 30, obt_practical: 28, total_max: 100, total_obt: 90, pass_marks: 33, result: 'PASS' },
      { code: 'DCA102', name: 'MS Office & Data Entry', max_theory: 70, obt_theory: 58, max_practical: 30, obt_practical: 27, total_max: 100, total_obt: 85, pass_marks: 33, result: 'PASS' },
      { code: 'DCA103', name: 'Database Management (DBMS)', max_theory: 70, obt_theory: 60, max_practical: 30, obt_practical: 29, total_max: 100, total_obt: 89, pass_marks: 33, result: 'PASS' },
      { code: 'DCA104', name: 'Internet & Web Technologies', max_theory: 70, obt_theory: 63, max_practical: 30, obt_practical: 27, total_max: 100, total_obt: 90, pass_marks: 33, result: 'PASS' }
    ]);
    db.prepare(`INSERT INTO marksheets(marksheet_no,token,student_id,centre_id,course_id,exam_session,roll_no,subjects,total_max,total_obtained,percentage,grade,result,status,issue_date,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'Approved',?,?)`)
      .run('PESC/MRK/2026/000001', 'sample_mrk_token_123456789', student.id, centre1.id, defaultCourse.id, 'Annual 2026', '2026101', subjects, 400, 354, 88.5, 'A+', 'PASS', Date.now(), Date.now());
    console.log('Created sample marksheet: PESC/MRK/2026/000001');
  }

  // 9. Valid Verifiable Certificate
  let cert = db.prepare('SELECT id FROM certificates WHERE cert_no=?').get('PESC/2026/000001');
  if (!cert) {
    db.prepare(`INSERT INTO certificates(cert_no,token,student_id,centre_id,course_id,status,issued_at,created_at)
      VALUES(?,?,?,?,?,'Valid',?,?)`)
      .run('PESC/2026/000001', 'sample_cert_token_123456789', student.id, centre1.id, defaultCourse.id, Date.now(), Date.now());
    console.log('Created sample certificate: PESC/2026/000001');
  }

  // 10. Official Council Notices
  const defaultNotices = [
    ['Session 2026-27 Affiliation Window Open', 'Affiliation', 'All India computer centres, coaching academies, and vocational institutes can now apply for autonomous affiliation with 50% special subsidy.', 'all', '#apply', 1],
    ['Mandatory Online QR Code Verification Activated', 'Examination', 'All certificates and statements of marks issued from 2026 onwards feature cryptographically secured QR codes verifiable across India.', 'all', '#verify', 1],
    ['Annual Vocational Examination 2026 Guidelines', 'Academic', 'Centre directors must complete candidate marks entries within 14 days of exam completion to ensure fast-track marksheet dispatch.', 'centres', '#courses', 0]
  ];
  const insNotice = db.prepare('INSERT OR IGNORE INTO notices(title,category,content,target,link,pinned,active,created_at) VALUES(?,?,?,?,?,?,1,?)');
  for (const n of defaultNotices) {
    if (!db.prepare('SELECT 1 FROM notices WHERE title=?').get(n[0])) {
      insNotice.run(n[0], n[1], n[2], n[3], n[4], n[5], Date.now());
    }
  }

  // 11. Ensure each active centre has 10 enrolled students with credentials, marksheets, and certificates
  const studentNames = [
    { name: 'Ananya Sharma', father: 'Sunil Sharma', dob: '2003-04-12' },
    { name: 'Rohan Gupta', father: 'Manoj Gupta', dob: '2002-09-18' },
    { name: 'Pooja Verma', father: 'Ramesh Verma', dob: '2001-11-25' },
    { name: 'Amitabh Mishra', father: 'Santosh Mishra', dob: '2000-03-30' },
    { name: 'Kavita Yadav', father: 'Devendra Yadav', dob: '2003-07-14' },
    { name: 'Saurabh Pandey', father: 'Hari Shankar Pandey', dob: '2002-01-20' },
    { name: 'Neha Srivastava', father: 'Pradeep Srivastava', dob: '2001-08-05' },
    { name: 'Vikas Maurya', father: 'Ram Dulare Maurya', dob: '2002-12-10' },
    { name: 'Divya Chauhan', father: 'Rakesh Chauhan', dob: '2003-05-22' },
    { name: 'Alok Tiwari', father: 'Brijesh Tiwari', dob: '2000-10-15' },
  ];

  const studentHash = await argon2.hash('Student@123');

  for (const c of allCentres) {
    const existing = db.prepare('SELECT id, student_code FROM students WHERE centre_id=?').all(c.id);
    const needed = 10 - existing.length;
    if (needed > 0) {
      const coursesList = db.prepare('SELECT id, code, name FROM courses').all();
      for (let i = 0; i < needed; i++) {
        const item = studentNames[i % studentNames.length];
        const studentIndex = existing.length + i + 1;
        const codeNum = String(studentIndex).padStart(5, '0');
        const sCode = `${c.centre_code || 'PESC' + String(c.id).padStart(5, '0')}-2026-${codeNum}`;
        const email = `student${c.id}_${studentIndex}@student.pescouncil.in`;
        const phone = `98${String(c.id).padStart(2, '0')}${String(studentIndex).padStart(2, '0')}1234`.slice(0, 10);
        const selCourse = coursesList[i % coursesList.length];

        // Insert user
        let user = db.prepare('SELECT id FROM users WHERE email=?').get(email);
        if (!user) {
          const uRes = db.prepare("INSERT INTO users(email,name,role,password_hash,mobile,centre_id,status,created_at) VALUES(?,?, 'student', ?, ?, ?, 'active', ?)")
            .run(email, item.name, studentHash, phone, c.id, Date.now() - (studentIndex * 86400000));
          user = { id: uRes.lastInsertRowid };
        }

        // Insert student
        const sRes = db.prepare(`INSERT INTO students(student_code,centre_id,user_id,name,father_name,mobile,email,dob,course_id,session,initial_password,status,created_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,'Student@123','active',?)`)
          .run(sCode, c.id, user.id, item.name, item.father, phone, email, item.dob, selCourse.id, '2026-27', Date.now() - (studentIndex * 86400000));
        const newStudentId = sRes.lastInsertRowid;

        // Create Marks & Marksheet
        const rollNo = `2026${c.id}${String(studentIndex).padStart(3, '0')}`;
        const mrkNo = `PESC/MRK/2026/${String(c.id).padStart(3, '0')}${codeNum}`;
        const mrkToken = crypto.randomBytes(16).toString('hex');
        const subjects = JSON.stringify([
          { code: `${selCourse.code}-101`, name: 'Core Foundations & Technology Theory', max_theory: 70, obt_theory: 58 + (i % 10), max_practical: 30, obt_practical: 26 + (i % 4), total_max: 100, total_obt: 84 + (i % 12), pass_marks: 33, result: 'PASS' },
          { code: `${selCourse.code}-102`, name: 'Applied Laboratory & Practical Execution', max_theory: 70, obt_theory: 55 + (i % 12), max_practical: 30, obt_practical: 27 + (i % 3), total_max: 100, total_obt: 82 + (i % 13), pass_marks: 33, result: 'PASS' },
          { code: `${selCourse.code}-103`, name: 'Professional Documentation & Case Study', max_theory: 70, obt_theory: 60 + (i % 8), max_practical: 30, obt_practical: 28 + (i % 2), total_max: 100, total_obt: 88 + (i % 10), pass_marks: 33, result: 'PASS' },
          { code: `${selCourse.code}-104`, name: 'Comprehensive Project & Viva-Voce', max_theory: 70, obt_theory: 62 + (i % 7), max_practical: 30, obt_practical: 29, total_max: 100, total_obt: 91 + (i % 8), pass_marks: 33, result: 'PASS' },
        ]);
        const totalObtained = 330 + (i * 5);
        const percentage = +(totalObtained / 4).toFixed(1);

        db.prepare(`INSERT INTO marksheets(marksheet_no,token,student_id,centre_id,course_id,exam_session,roll_no,subjects,total_max,total_obtained,percentage,grade,result,status,issue_date,created_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,'PASS','Approved',?,?)`)
          .run(mrkNo, mrkToken, newStudentId, c.id, selCourse.id, 'Session 2026', rollNo, subjects, 400, totalObtained, percentage, percentage >= 85 ? 'A+' : 'A', Date.now(), Date.now());

        // Create Valid Certificate
        const certNo = `PESC/2026/${String(c.id).padStart(3, '0')}${codeNum}`;
        const certToken = crypto.randomBytes(16).toString('hex');
        db.prepare(`INSERT INTO certificates(cert_no,token,student_id,centre_id,course_id,status,issued_at,created_at)
          VALUES(?,?,?,?,?,'Valid',?,?)`)
          .run(certNo, certToken, newStudentId, c.id, selCourse.id, Date.now(), Date.now());
      }
    }
  }

  console.log('✅ PESC database seeded with 10 students per centre and complete council data!');
})();
