const db = require('./db');
const argon2 = require('./hash');

(async () => {
  const coordHash = await argon2.hash('Coord#12345678');
  const ownerHash = await argon2.hash('OwnerPass#12345');
  const studentHash = await argon2.hash('Student@12345');

  // Courses
  let course = db.prepare('SELECT id FROM courses LIMIT 1').get();
  if (!course) {
    db.prepare('INSERT INTO courses(code,name,duration_months,fee_paise) VALUES(?,?,?,?)').run('DCA','Diploma in Computer Applications',12,600000);
    course = db.prepare('SELECT id FROM courses LIMIT 1').get();
  }

  // Coordinator
  let coord = db.prepare('SELECT id FROM users WHERE email=?').get('coord@pescouncil.in');
  if (!coord) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,state,status,created_at) VALUES(?,?,'coordinator',?,'Uttar Pradesh','active',?)")
      .run('coord@pescouncil.in', 'Vikram Singh', coordHash, Date.now());
    coord = { id: r.lastInsertRowid };
  }

  // Centre Owner
  let owner = db.prepare('SELECT id FROM users WHERE email=?').get('director@aryavart.ac.in');
  if (!owner) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,status,created_at) VALUES(?,?,'centre_owner',?,'active',?)")
      .run('director@aryavart.ac.in', 'Ravi Verma', ownerHash, Date.now());
    owner = { id: r.lastInsertRowid };
  }

  // Centre
  let centre = db.prepare('SELECT id FROM centres WHERE slug=?').get('aryavart-institute-of-technology-management');
  if (!centre) {
    const r = db.prepare("INSERT INTO centres(centre_code,name,slug,owner_user_id,coordinator_id,state,district,status,created_at) VALUES(?,?,?,?,?,?,?,'active',?)")
      .run('PESC00001', 'Aryavart Institute of Technology & Management', 'aryavart-institute-of-technology-management', owner.id, coord.id, 'Uttar Pradesh', 'Varanasi', Date.now());
    centre = { id: r.lastInsertRowid };
    db.prepare('UPDATE users SET centre_id=? WHERE id=?').run(centre.id, owner.id);
  }

  // Assign course to centre
  db.prepare('INSERT OR IGNORE INTO centre_courses(centre_id,course_id) VALUES(?,?)').run(centre.id, course.id);

  // Student User
  let studentUser = db.prepare('SELECT id FROM users WHERE email=?').get('rahul@student.pescouncil.in');
  if (!studentUser) {
    const r = db.prepare("INSERT INTO users(email,name,role,password_hash,centre_id,status,created_at) VALUES(?,?,'student',?,?,'active',?)")
      .run('rahul@student.pescouncil.in', 'Rahul Sharma', studentHash, centre.id, Date.now());
    studentUser = { id: r.lastInsertRowid };
  }

  // Student Record
  let student = db.prepare('SELECT id FROM students WHERE student_code=?').get('PESC00001-2026-00001');
  if (!student) {
    const r = db.prepare("INSERT INTO students(student_code,centre_id,user_id,name,father_name,mobile,email,dob,course_id,session,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,'active',?)")
      .run('PESC00001-2026-00001', centre.id, studentUser.id, 'Rahul Sharma', 'Anand Sharma', '9876543210', 'rahul@student.pescouncil.in', '2002-05-15', course.id, '2026-27', Date.now());
    student = { id: r.lastInsertRowid };
  }

  // Marksheet
  let mrk = db.prepare('SELECT id FROM marksheets WHERE marksheet_no=?').get('PESC/MRK/2026/000001');
  if (!mrk) {
    const subjects = JSON.stringify([
      { code: 'DCA101', name: 'Computer Fundamentals & OS', max_theory: 70, obt_theory: 62, max_practical: 30, obt_practical: 28, total_max: 100, total_obt: 90, pass_marks: 33, result: 'PASS' },
      { code: 'DCA102', name: 'MS Office & Data Entry', max_theory: 70, obt_theory: 58, max_practical: 30, obt_practical: 27, total_max: 100, total_obt: 85, pass_marks: 33, result: 'PASS' },
      { code: 'DCA103', name: 'Database Management', max_theory: 70, obt_theory: 60, max_practical: 30, obt_practical: 29, total_max: 100, total_obt: 89, pass_marks: 33, result: 'PASS' },
      { code: 'DCA104', name: 'Internet & Web Technologies', max_theory: 70, obt_theory: 63, max_practical: 30, obt_practical: 27, total_max: 100, total_obt: 90, pass_marks: 33, result: 'PASS' }
    ]);
    db.prepare("INSERT INTO marksheets(marksheet_no,token,student_id,centre_id,course_id,exam_session,roll_no,subjects,total_max,total_obtained,percentage,grade,result,status,issue_date,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'Approved',?,?)")
      .run('PESC/MRK/2026/000001', 'sample_mrk_token_123456789', student.id, centre.id, course.id, 'Annual 2026', '2026101', subjects, 400, 354, 88.5, 'A+', 'PASS', Date.now(), Date.now());
  }

  // Certificate
  let cert = db.prepare('SELECT id FROM certificates WHERE cert_no=?').get('PESC/2026/000001');
  if (!cert) {
    db.prepare("INSERT INTO certificates(cert_no,token,student_id,centre_id,course_id,status,issued_at,created_at) VALUES(?,?,?,?,?,'Valid',?,?)")
      .run('PESC/2026/000001', 'sample_cert_token_123456789', student.id, centre.id, course.id, Date.now(), Date.now());
  }

  console.log('Sample demo data seeded successfully!');
})();
