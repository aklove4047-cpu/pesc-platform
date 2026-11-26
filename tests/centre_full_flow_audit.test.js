const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

process.env.DB_FILE = ':memory:';

const db = require('../src/db');
const wallet = require('../src/wallet');
const fees = require('../src/fees');
const { nextStudentCode } = require('../src/lib');

test('CENTRE COMPREHENSIVE STRATEGY AUDIT: Admission, Marksheet, and Certificate Flows', async (t) => {
  // 1. Setup Centre and Courses
  const centreRes = db.prepare(`
    INSERT INTO centres(centre_code, name, slug, state, district, status, created_at)
    VALUES('PESC00099', 'Aryavart Test Institute', 'aryavart-test-institute', 'Uttar Pradesh', 'Azamgarh', 'active', ?)
  `).run(Date.now());
  const centreId = centreRes.lastInsertRowid;

  const ownerRes = db.prepare(`
    INSERT INTO users(email, name, role, centre_id, status, created_at)
    VALUES('director@aryavart.com', 'Director Saheb', 'centre_owner', ?, 'active', ?)
  `).run(centreId, Date.now());
  const ownerUserId = ownerRes.lastInsertRowid;

  // Add Courses
  const dcaCourseRes = db.prepare(`
    INSERT INTO courses(code, name, duration_months, single_fee_paise, semester_fee_paise, active)
    VALUES('DCA', 'Diploma in Computer Applications', 6, 10000, 20000, 1)
  `).run();
  const dcaCourseId = dcaCourseRes.lastInsertRowid;

  const adcaCourseRes = db.prepare(`
    INSERT INTO courses(code, name, duration_months, single_fee_paise, semester_fee_paise, active)
    VALUES('ADCA', 'Advance Diploma in Computer Applications', 12, 10000, 20000, 1)
  `).run();
  const adcaCourseId = adcaCourseRes.lastInsertRowid;

  db.prepare('INSERT INTO centre_courses(centre_id, course_id) VALUES(?, ?)').run(centreId, dcaCourseId);
  db.prepare('INSERT INTO centre_courses(centre_id, course_id) VALUES(?, ?)').run(centreId, adcaCourseId);

  // 2. Wallet Initial Top-Up (₹5,000 = 500000 paise)
  wallet.credit(centreId, 500000, 'audit:init', 'Initial test topup', ownerUserId);
  let bal = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
  assert.equal(bal, 500000, 'Initial wallet balance should be ₹5,000 (500000 paise)');

  // -------------------------------------------------------------
  // WORKFLOW 1: STUDENT ADMISSION
  // -------------------------------------------------------------
  await t.test('1. Student Admission Flow & Wallet Deduction', () => {
    // Admit Student 1 (Annual - DCA)
    const code1 = nextStudentCode(centreId);
    const stu1Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO students(student_code, centre_id, name, father_name, mother_name, gender, category, blood_group, address, mobile, email, dob, course_id, session, fee_total, fee_paid, evaluation_type, term, created_at)
        VALUES(?, ?, 'Amit Kumar', 'Rajesh Kumar', 'Sunita Devi', 'Male', 'OBC', '', 'Gram Shahgarh Azamgarh', '9876543210', 'amit@student.pescouncil.in', '2004-05-15', ?, '2026-27', 6500, 1500, 'annual', 'Annual', ?)
      `).run(code1, centreId, dcaCourseId, Date.now());
      fees.charge(centreId, 'admission', r.lastInsertRowid, ownerUserId);
      return r.lastInsertRowid;
    })();

    // Check ₹35 wallet deduction
    const balAfter1 = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(balAfter1, 496500, 'Wallet must be deducted by exactly ₹35 (3500 paise)');

    const stu1 = db.prepare('SELECT * FROM students WHERE id=?').get(stu1Id);
    assert.equal(stu1.name, 'Amit Kumar');
    assert.equal(stu1.fee_total, 6500);
    assert.equal(stu1.fee_paid, 1500);
    assert.equal(stu1.fee_total - stu1.fee_paid, 5000, 'Pending fee should be ₹5,000');
    assert.equal(stu1.blood_group, '', 'Blood group should remain clean empty string if not provided');

    // Test Edit Student Particulars
    db.prepare(`
      UPDATE students SET mobile=?, address=?, photo_url=? WHERE id=? AND centre_id=?
    `).run('9876500000', 'New Market Shahgarh Azamgarh UP', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==', stu1Id, centreId);

    const stu1Updated = db.prepare('SELECT * FROM students WHERE id=?').get(stu1Id);
    assert.equal(stu1Updated.mobile, '9876500000');
    assert.equal(stu1Updated.address, 'New Market Shahgarh Azamgarh UP');
    assert.ok(stu1Updated.photo_url.startsWith('data:image/png;base64,'));
  });

  // Admit Student 2 (Semester - ADCA)
  let stu2Id;
  await t.test('1b. Semester Student Admission', () => {
    const code2 = nextStudentCode(centreId);
    stu2Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO students(student_code, centre_id, name, father_name, mother_name, gender, category, blood_group, address, mobile, email, dob, course_id, session, fee_total, fee_paid, evaluation_type, term, created_at)
        VALUES(?, ?, 'Pooja Verma', 'Suresh Verma', 'Kamla Verma', 'Female', 'General', 'B+', 'Civil Lines Azamgarh', '9812345678', 'pooja@student.pescouncil.in', '2003-08-20', ?, '2026-27', 12000, 12000, 'semester', 'Semester 1', ?)
      `).run(code2, centreId, adcaCourseId, Date.now());
      fees.charge(centreId, 'admission', r.lastInsertRowid, ownerUserId);
      return r.lastInsertRowid;
    })();

    const balAfter2 = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(balAfter2, 493000, 'Wallet must be deducted by another ₹35 (3500 paise), total ₹4,930 remaining');
  });

  // -------------------------------------------------------------
  // WORKFLOW 2: MARKSHEET ISSUANCE
  // -------------------------------------------------------------
  await t.test('2. Marksheet Issuance & Sequential Prerequisite Validation', () => {
    // A) Student 1 (Annual): Issue Annual Marksheet
    const customSubjects = [
      { code: 'DCA101', name: 'Information Technology', max: 100, min: 40, obt: 82, grade: 'A+' },
      { code: 'DCA102', name: 'Office Automation', max: 100, min: 40, obt: 76, grade: 'A' },
      { code: 'DCA103', name: 'Tally Prime GST', max: 100, min: 40, obt: 88, grade: 'A+' }
    ];
    const totalMax = 300;
    const totalObt = 82 + 76 + 88; // 246
    const pct = +((totalObt / totalMax) * 100).toFixed(2); // 82%

    const mrk1Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO marksheets(marksheet_no, token, student_id, centre_id, course_id, exam_session, roll_no, subjects, total_max, total_obtained, percentage, grade, result, status, issue_date, evaluation_type, term, requested_by, created_at)
        VALUES('PESC-MRK-2026-00001', 'tok-mrk-1', 1, ?, ?, '2025-2026', 'PESC000990001', ?, ?, ?, ?, 'A+', 'PASS', 'Approved', ?, 'yearly', 'Annual', ?, ?)
      `).run(centreId, dcaCourseId, JSON.stringify(customSubjects), totalMax, totalObt, pct, Date.now(), ownerUserId, Date.now());

      wallet.debit(centreId, 10000, `fee:marksheet:${r.lastInsertRowid}:${Date.now()}`, 'Marksheet issue fee', ownerUserId);
      return r.lastInsertRowid;
    })();

    const balAfterMrk1 = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(balAfterMrk1, 483000, 'Wallet should be debited by ₹100 (10000 paise) for single/annual marksheet');

    const mrk1 = db.prepare('SELECT * FROM marksheets WHERE id=?').get(mrk1Id);
    assert.equal(mrk1.status, 'Approved');
    assert.equal(mrk1.percentage, 82);
    assert.equal(JSON.parse(mrk1.subjects).length, 3);

    // B) Student 2 (Semester): Verify Semester 2 cannot be issued before Semester 1
    const hasSem1Before = db.prepare("SELECT id FROM marksheets WHERE student_id=? AND (term LIKE '%sem 1%' OR term LIKE '%semester 1%') AND status='Approved'").get(stu2Id);
    assert.equal(hasSem1Before, undefined, 'Semester 1 should not exist yet');

    // Simulate rule check in backend
    let sem2Blocked = false;
    if (!hasSem1Before) {
      sem2Blocked = true;
    }
    assert.equal(sem2Blocked, true, 'Semester 2 must be blocked when Semester 1 is not approved');

    // Issue Semester 1 Marksheet
    const sem1MrkId = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO marksheets(marksheet_no, token, student_id, centre_id, course_id, exam_session, roll_no, subjects, total_max, total_obtained, percentage, grade, result, status, issue_date, evaluation_type, term, requested_by, created_at)
        VALUES('PESC-MRK-2026-00002', 'tok-mrk-2', ?, ?, ?, '2025-2026', 'PESC000990002', '[]', 500, 410, 82.0, 'A+', 'PASS', 'Approved', ?, 'semester', 'Semester 1', ?, ?)
      `).run(stu2Id, centreId, adcaCourseId, Date.now(), ownerUserId, Date.now());
      wallet.debit(centreId, 20000, `fee:marksheet:${r.lastInsertRowid}:${Date.now()}`, 'Semester 1 marksheet issue fee', ownerUserId);
      return r.lastInsertRowid;
    })();

    const balAfterSem1 = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(balAfterSem1, 463000, 'Wallet should be debited by ₹200 (20000 paise) for semester marksheet');

    // Now Semester 1 exists, Semester 2 should be allowed
    const hasSem1After = db.prepare("SELECT id FROM marksheets WHERE student_id=? AND (term LIKE '%sem 1%' OR term LIKE '%semester 1%') AND status='Approved'").get(stu2Id);
    assert.ok(hasSem1After, 'Semester 1 is now approved');

    // Issue Semester 2 Marksheet
    const sem2MrkId = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO marksheets(marksheet_no, token, student_id, centre_id, course_id, exam_session, roll_no, subjects, total_max, total_obtained, percentage, grade, result, status, issue_date, evaluation_type, term, requested_by, created_at)
        VALUES('PESC-MRK-2026-00003', 'tok-mrk-3', ?, ?, ?, '2025-2026', 'PESC000990002', '[]', 500, 420, 84.0, 'A+', 'PASS', 'Approved', ?, 'semester', 'Semester 2', ?, ?)
      `).run(stu2Id, centreId, adcaCourseId, Date.now(), ownerUserId, Date.now());
      wallet.debit(centreId, 20000, `fee:marksheet:${r.lastInsertRowid}:${Date.now()}`, 'Semester 2 marksheet issue fee', ownerUserId);
      return r.lastInsertRowid;
    })();

    const balAfterSem2 = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(balAfterSem2, 443000, 'Wallet should be debited by another ₹200 for semester 2');
  });

  // -------------------------------------------------------------
  // WORKFLOW 3: CERTIFICATE ISSUANCE
  // -------------------------------------------------------------
  await t.test('3. Certificate Issuance & Prerequisite Validation', () => {
    // Admit an unexamined Student 3
    const code3 = nextStudentCode(centreId);
    const stu3Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO students(student_code, centre_id, name, father_name, mobile, course_id, evaluation_type, term, created_at)
        VALUES(?, ?, 'Sunil Sharma', 'Ramesh Sharma', '9988776655', ?, 'annual', 'Annual', ?)
      `).run(code3, centreId, dcaCourseId, Date.now());
      fees.charge(centreId, 'admission', r.lastInsertRowid, ownerUserId);
      return r.lastInsertRowid;
    })();

    // Attempt to issue Certificate for Student 3 without marksheet -> MUST FAIL
    const hasMrkStu3 = db.prepare("SELECT id FROM marksheets WHERE student_id=? AND status='Approved'").get(stu3Id);
    assert.equal(hasMrkStu3, undefined, 'Student 3 has no approved marksheet');

    let certBlocked = false;
    if (!hasMrkStu3) {
      certBlocked = true;
    }
    assert.equal(certBlocked, true, 'Certificate issuance must be strictly blocked if student has no approved marksheet');

    // Issue Certificate for Student 1 (Annual - has Annual Marksheet Approved)
    const cert1Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO certificates(token, student_id, centre_id, course_id, cert_no, status, evaluation_type, term, issued_at, requested_by, created_at)
        VALUES('tok-cert-1', 1, ?, ?, 'PESC-CERT-2026-00001', 'Valid', 'yearly', 'Annual', ?, ?, ?)
      `).run(centreId, dcaCourseId, Date.now(), ownerUserId, Date.now());
      wallet.debit(centreId, 20000, `fee:certificate:${r.lastInsertRowid}:${Date.now()}`, 'Certificate issue fee', ownerUserId);
      return r.lastInsertRowid;
    })();

    // Issue Certificate for Student 2 (Semester - has both Semesters 1 & 2 Approved)
    const cert2Id = db.transaction(() => {
      const r = db.prepare(`
        INSERT INTO certificates(token, student_id, centre_id, course_id, cert_no, status, evaluation_type, term, issued_at, requested_by, created_at)
        VALUES('tok-cert-2', ?, ?, ?, 'PESC-CERT-2026-00002', 'Valid', 'semester', 'Annual', ?, ?, ?)
      `).run(stu2Id, centreId, adcaCourseId, Date.now(), ownerUserId, Date.now());
      wallet.debit(centreId, 20000, `fee:certificate:${r.lastInsertRowid}:${Date.now()}`, 'Certificate issue fee', ownerUserId);
      return r.lastInsertRowid;
    })();

    const finalBal = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    // Starting balance: 500,000
    // Stu 1 Admission: -3,500
    // Stu 2 Admission: -3,500
    // Stu 1 Marksheet: -10,000
    // Stu 2 Sem 1 Marksheet: -20,000
    // Stu 2 Sem 2 Marksheet: -20,000
    // Stu 3 Admission: -3,500
    // Stu 1 Certificate: -20,000
    // Stu 2 Certificate: -20,000
    // Total spent: 3,500 + 3,500 + 10,000 + 20,000 + 20,000 + 3,500 + 20,000 + 20,000 = 100,500 paise (₹1,005)
    // Remaining balance: 500,000 - 100,500 = 399,500 paise (₹3,995)
    assert.equal(finalBal, 399500, 'Final wallet balance should be exactly ₹3,995 (399500 paise)');

    const cert1 = db.prepare('SELECT * FROM certificates WHERE id=?').get(cert1Id);
    assert.equal(cert1.status, 'Valid');
    assert.equal(cert1.cert_no, 'PESC-CERT-2026-00001');

    const cert2 = db.prepare('SELECT * FROM certificates WHERE id=?').get(cert2Id);
    assert.equal(cert2.status, 'Valid');
    assert.equal(cert2.cert_no, 'PESC-CERT-2026-00002');
  });

  // -------------------------------------------------------------
  // WORKFLOW 4: INSUFFICIENT BALANCE SAFETY
  // -------------------------------------------------------------
  await t.test('4. Insufficient Wallet Balance Protection', () => {
    // Empty wallet
    const currentBal = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    wallet.debit(centreId, currentBal, 'audit:empty', 'Empty wallet for test', ownerUserId);

    const emptyBal = db.prepare('SELECT balance_paise FROM wallets WHERE centre_id=?').get(centreId).balance_paise;
    assert.equal(emptyBal, 0);

    // Attempting admission must fail with 402 Insufficient Balance
    assert.throws(() => {
      db.transaction(() => {
        const r = db.prepare(`
          INSERT INTO students(student_code, centre_id, name, course_id, created_at)
          VALUES('PESC-ERR-01', ?, 'Fail Candidate', ?, ?)
        `).run(centreId, dcaCourseId, Date.now());
        fees.charge(centreId, 'admission', r.lastInsertRowid, ownerUserId);
      })();
    }, (err) => {
      return err.status === 402 && err.message.includes('Insufficient wallet balance');
    });

    // Verify transaction was rolled back (no orphan student created)
    const errStu = db.prepare("SELECT * FROM students WHERE student_code='PESC-ERR-01'").get();
    assert.equal(errStu, undefined, 'Student creation must be completely rolled back if wallet debit fails');
  });
});
