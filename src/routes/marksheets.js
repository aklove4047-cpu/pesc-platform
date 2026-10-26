const router = require('express').Router();
const fees = require('../fees');
const PDFDocument = require('pdfkit');
const QR = require('qrcode');
const db = require('../db');
const cfg = require('../config');
const { requireRole, requireAuth } = require('../auth');
const { HttpError, now, rand, str, h, audit, next: counter, nextMarksheetNo } = require('../lib');

const SEL = `SELECT m.*, s.name AS student_name, s.student_code, s.father_name, s.dob,
  co.name AS course_name, co.code AS course_code, co.duration_months,
  ce.name AS centre_name, ce.centre_code, ce.coordinator_id, ce.district AS centre_district, ce.state AS centre_state, ce.address AS centre_address
  FROM marksheets m
  JOIN students s ON s.id=m.student_id
  JOIN courses co ON co.id=m.course_id
  JOIN centres ce ON ce.id=m.centre_id`;

// Calculate grade & division
function computeGrade(pct) {
  if (pct >= 85) return { grade: 'A+', division: 'First Division with Distinction' };
  if (pct >= 75) return { grade: 'A', division: 'First Division' };
  if (pct >= 60) return { grade: 'B', division: 'First Division' };
  if (pct >= 50) return { grade: 'C', division: 'Second Division' };
  if (pct >= 33) return { grade: 'D', division: 'Pass Division' };
  return { grade: 'F', division: 'Failed' };
}

// Get pending marksheets for admin or coordinator
router.get('/pending', requireRole('super_admin', 'admin', 'coordinator'), (req, res) => {
  const isCo = req.user.role === 'coordinator';
  const rows = db.prepare(`${SEL} WHERE m.status='Pending' ${isCo ? 'AND ce.coordinator_id=?' : ''} ORDER BY m.id DESC LIMIT 100`)
    .all(...(isCo ? [req.user.id] : []));
  for (const r of rows) {
    try { r.subjects = JSON.parse(r.subjects); } catch { r.subjects = []; }
  }
  res.json({ marksheets: rows });
});

// Create/Submit a marksheet request (centre role)
const submitMarksheet = (req, res) => {
  const cid = req.user.centre_id;
  const sid = +req.body.student_id;
  const examSession = str(req.body.exam_session, 40) || '2026';
  const rollNo = str(req.body.roll_no, 40);
  const evaluationType = req.body.evaluation_type === 'semester' ? 'semester' : 'yearly';
  const term = str(req.body.term, 50) || (evaluationType === 'semester' ? 'Semester 1' : 'Annual');

  const student = db.prepare('SELECT s.*, c.name AS course_name FROM students s JOIN courses c ON c.id=s.course_id WHERE s.id=? AND s.centre_id=?').get(sid, cid);
  if (!student) throw new HttpError(404, 'Student not found in this centre');

  const subjectsInput = Array.isArray(req.body.subjects) ? req.body.subjects : [];
  if (!subjectsInput.length) throw new HttpError(400, 'At least one subject is required');

  let totalMax = 0;
  let totalObtained = 0;
  let hasFail = false;

  const sanitizedSubjects = subjectsInput.map((sub, idx) => {
    const code = str(sub.code, 20) || `SUB${idx + 1}`;
    const name = str(sub.name, 100) || `Subject ${idx + 1}`;
    const maxTheory = Math.max(0, +sub.max_theory || 70);
    const obtTheory = Math.max(0, Math.min(maxTheory, +sub.obt_theory || 0));
    const maxPractical = Math.max(0, +sub.max_practical || 30);
    const obtPractical = Math.max(0, Math.min(maxPractical, +sub.obt_practical || 0));
    const subMax = maxTheory + maxPractical;
    const subObt = obtTheory + obtPractical;
    const passMarks = Math.round(subMax * 0.33);

    totalMax += subMax;
    totalObtained += subObt;
    if (subObt < passMarks) hasFail = true;

    return {
      code,
      name,
      max_theory: maxTheory,
      obt_theory: obtTheory,
      max_practical: maxPractical,
      obt_practical: obtPractical,
      pass_marks: passMarks,
      total_max: subMax,
      total_obt: subObt,
      result: subObt >= passMarks ? 'PASS' : 'FAIL',
    };
  });

  if (totalMax <= 0) throw new HttpError(400, 'Total maximum marks must be greater than 0');
  const percentage = Math.round((totalObtained / totalMax) * 10000) / 100;
  const { grade } = computeGrade(percentage);
  const result = hasFail || percentage < 33 ? 'FAIL' : 'PASS';

  const rowId = db.transaction(() => {
    const newId = db.prepare(`
      INSERT INTO marksheets(
        student_id, centre_id, course_id, exam_session, roll_no,
        subjects, total_max, total_obtained, percentage, grade, result,
        status, requested_by, evaluation_type, term, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)
    `).run(
      student.id, cid, student.course_id, examSession, rollNo || student.student_code,
      JSON.stringify(sanitizedSubjects), totalMax, totalObtained, percentage, grade, result,
      req.user.id, evaluationType, term, now()
    ).lastInsertRowid;
    fees.charge(cid, 'marksheet', newId, req.user.id);
    return newId;
  })();

  audit(req, 'marksheet.submit', 'marksheet', rowId);
  res.status(201).json({ id: rowId, total_max: totalMax, total_obtained: totalObtained, percentage, grade, result, evaluation_type: evaluationType, term });
};

router.post('/submit', requireRole('centre_owner', 'centre_staff'), submitMarksheet);
router.post('/', requireRole('centre_owner', 'centre_staff'), submitMarksheet);

// Decision on marksheet (admin or coordinator)
router.post('/:id/decision', requireRole('super_admin', 'admin', 'coordinator'), (req, res) => {
  const d = str(req.body.decision, 10);
  const reason = str(req.body.reason, 300);
  if (!['approve', 'reject', 'revoke'].includes(d)) throw new HttpError(400, 'Invalid decision');
  if (d !== 'approve' && !reason) throw new HttpError(400, 'Reason is required');
  if (d === 'revoke' && req.user.role === 'coordinator') throw new HttpError(403, 'Only admin can revoke marksheets');

  const out = db.transaction(() => {
    const m = db.prepare(`${SEL} WHERE m.id=?`).get(+req.params.id);
    if (!m) throw new HttpError(404, 'Marksheet not found');
    if (req.user.role === 'coordinator' && m.coordinator_id !== req.user.id) {
      throw new HttpError(404, 'Marksheet out of scope');
    }

    if (d === 'revoke') {
      if (m.status !== 'Approved') throw new HttpError(409, 'Only approved marksheets can be revoked');
      db.prepare("UPDATE marksheets SET status='Revoked', reason=?, decided_by=? WHERE id=?").run(reason, req.user.id, m.id);
    } else {
      if (m.status !== 'Pending') throw new HttpError(409, `Marksheet is already ${m.status}`);
      if (d === 'reject') {
        db.prepare("UPDATE marksheets SET status='Rejected', reason=?, decided_by=? WHERE id=?").run(reason, req.user.id, m.id);
        fees.refund(m.centre_id, 'marksheet', m.id, req.user.id);
      } else {
        const no = nextMarksheetNo();
        db.prepare("UPDATE marksheets SET status='Approved', marksheet_no=?, token=?, issue_date=?, decided_by=? WHERE id=?")
          .run(no, rand(24), now(), req.user.id, m.id);
      }
    }
    audit(req, 'marksheet.' + d, 'marksheet', m.id, 'ok', reason || null);
    return db.prepare('SELECT id, status, marksheet_no FROM marksheets WHERE id=?').get(m.id);
  })();

  res.json(out);
});

// Get marksheet details
router.get('/:id', requireAuth, (req, res) => {
  const m = db.prepare(`${SEL} WHERE m.id=?`).get(+req.params.id);
  if (!m) throw new HttpError(404, 'Marksheet not found');

  const u = req.user;
  const allowed = ['super_admin', 'admin'].includes(u.role)
    || (u.role === 'coordinator' && m.coordinator_id === u.id)
    || (['centre_owner', 'centre_staff'].includes(u.role) && u.centre_id === m.centre_id)
    || (u.role === 'student' && (u.email === m.student_id || u.id === m.requested_by));

  if (!allowed && u.role === 'student') {
    const st = db.prepare('SELECT id FROM students WHERE (user_id=? OR email=?) AND id=?').get(u.id, u.email, m.student_id);
    if (!st) throw new HttpError(403, 'Access denied');
  } else if (!allowed) {
    throw new HttpError(403, 'Access denied');
  }

  try { m.subjects = JSON.parse(m.subjects); } catch { m.subjects = []; }
  res.json({ marksheet: m });
});

// Generate Marksheet PDF
router.get('/:id/pdf', requireAuth, h(async (req, res) => {
  const m = db.prepare(`${SEL} WHERE m.id=?`).get(+req.params.id);
  if (!m) throw new HttpError(404, 'Marksheet not found');

  const u = req.user;
  const isStudent = u.role === 'student' && db.prepare('SELECT 1 FROM students WHERE (user_id=? OR email=?) AND id=?').get(u.id, u.email, m.student_id);
  const allowed = ['super_admin', 'admin'].includes(u.role)
    || (u.role === 'coordinator' && m.coordinator_id === u.id)
    || (['centre_owner', 'centre_staff'].includes(u.role) && u.centre_id === m.centre_id)
    || isStudent;

  if (!allowed) throw new HttpError(403, 'Access denied');
  if (m.status !== 'Approved') throw new HttpError(409, 'Marksheet is not approved yet');

  let subjects = [];
  try { subjects = JSON.parse(m.subjects); } catch { subjects = []; }

  const qr = await QR.toBuffer(`${cfg.PUBLIC_URL}/verify/marksheet/${m.token}`, { margin: 1, width: 220 });
  const doc = new PDFDocument({ size: 'A4', layout: 'portrait', margin: 30 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="marksheet-${m.marksheet_no.replace(/\//g, '-')}.pdf"`);
  doc.pipe(res);

  const W = doc.page.width;
  const H = doc.page.height;

  // Double border
  doc.rect(15, 15, W - 30, H - 30).lineWidth(2).stroke('#0a2a5e');
  doc.rect(19, 19, W - 38, H - 38).lineWidth(0.8).stroke('#d4af37');

  // Header Banner - Centre Name on Top
  doc.rect(20, 20, W - 40, 92).fill('#064e3b');
  doc.fillColor('#fcd34d').fontSize(8.5).font('Helvetica-Bold')
    .text('★ AUTHORIZED VOCATIONAL & TECHNICAL STUDY CENTRE ★', 20, 25, { align: 'center', width: W - 40 });
  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
    .text((m.centre_name || 'AUTHORIZED STUDY CENTRE').toUpperCase(), 20, 37, { align: 'center', width: W - 40 });
  doc.fontSize(8.5).font('Helvetica-Bold')
    .fillColor('#a7f3d0')
    .text(`ACCREDITED CENTRE CODE: ${m.centre_code || 'PESC00001'}  ||  ${m.centre_address || `${m.centre_district || 'Regional'}, ${m.centre_state || 'U.P.'}`}`, 20, 56, { align: 'center', width: W - 40 });
  doc.fontSize(8).font('Helvetica-Bold')
    .fillColor('#fef08a')
    .text('UNDER THE AEGIS OF PURVANCHAL EDUCATION AND SKILL COUNCIL (PESC)', 20, 70, { align: 'center', width: W - 40 });
  doc.fontSize(7).font('Helvetica')
    .fillColor('#e0e7ff')
    .text('REGISTERED UNDER INDIAN TRUST ACT  ||  NITI AAYOG (NGO DARPAN), GOVT. OF INDIA  ||  ISO 9001:2015 CERTIFIED', 20, 82, { align: 'center', width: W - 40 })
    .text('REGD. NO. (COUNCIL): TRUST/2025/5/IV/299  ||  https://pescouncil.in', 20, 93, { align: 'center', width: W - 40 });

  // Document Title Bar
  const isSem = m.evaluation_type === 'semester';
  const mrkTitle = isSem ? 'SEMESTER EXAMINATION STATEMENT OF MARKS' : 'ANNUAL EXAMINATION STATEMENT OF MARKS';
  doc.rect(40, 105, W - 80, 24).fill(isSem ? '#e0f2fe' : '#f1f5f9');
  doc.rect(40, 105, W - 80, 24).lineWidth(1).stroke(isSem ? '#0284c7' : '#cbd5e1');
  doc.fillColor(isSem ? '#0369a1' : '#0a2a5e').fontSize(12).font('Helvetica-Bold')
    .text(mrkTitle, 40, 111, { align: 'center', width: W - 80 });

  // Candidate Information Box
  let y = 140;
  doc.rect(30, y, W - 60, 95).lineWidth(0.8).stroke('#cbd5e1');
  doc.fillColor('#f8fafc').rect(31, y + 1, W - 62, 93).fill();

  doc.fillColor('#1e293b').fontSize(9).font('Helvetica');
  const leftX = 40;
  const midX = W / 2 + 10;

  doc.font('Helvetica-Bold').text('Candidate Name:', leftX, y + 10)
    .font('Helvetica').text(m.student_name, leftX + 90, y + 10);
  doc.font('Helvetica-Bold').text("Father's Name:", leftX, y + 26)
    .font('Helvetica').text(m.father_name || 'N/A', leftX + 90, y + 26);
  doc.font('Helvetica-Bold').text('Enrollment No:', leftX, y + 42)
    .font('Helvetica').text(m.student_code, leftX + 90, y + 42);
  doc.font('Helvetica-Bold').text('Roll Number:', leftX, y + 58)
    .font('Helvetica').text(m.roll_no || m.student_code, leftX + 90, y + 58);
  doc.font('Helvetica-Bold').text(isSem ? 'Semester / Term:' : 'Exam Session:', leftX, y + 74)
    .font('Helvetica').text(isSem ? `${m.term || 'Semester 1'} (${m.exam_session})` : `${m.term || 'Annual'} (${m.exam_session})`, leftX + 90, y + 74);

  doc.font('Helvetica-Bold').text('Marksheet No:', midX, y + 10)
    .font('Helvetica').fillColor('#0a2a5e').text(m.marksheet_no, midX + 85, y + 10).fillColor('#1e293b');
  doc.font('Helvetica-Bold').text('Course Name:', midX, y + 26)
    .font('Helvetica').text(`${m.course_name} (${m.duration_months} Months)`, midX + 85, y + 26, { width: 170 });
  doc.font('Helvetica-Bold').text('Centre Code:', midX, y + 58)
    .font('Helvetica').text(m.centre_code, midX + 85, y + 58);
  doc.font('Helvetica-Bold').text('Centre Name:', midX, y + 74)
    .font('Helvetica').text(m.centre_name, midX + 85, y + 74, { width: 170 });

  // Subjects Table
  y = 248;
  const tableX = 30;
  const tableW = W - 60;
  const colW = [35, 185, 55, 55, 55, 55, 55, 40]; // Total = 535 approx

  // Table Header
  doc.rect(tableX, y, tableW, 24).fill('#0a2a5e');
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
  doc.text('S.N.', tableX + 5, y + 7);
  doc.text('Subject / Module Name', tableX + 40, y + 7);
  doc.text('Max Th.', tableX + 225, y + 7, { align: 'center', width: 50 });
  doc.text('Max Pr.', tableX + 280, y + 7, { align: 'center', width: 50 });
  doc.text('Total', tableX + 335, y + 7, { align: 'center', width: 50 });
  doc.text('Obt Th.', tableX + 390, y + 7, { align: 'center', width: 50 });
  doc.text('Obt Pr.', tableX + 445, y + 7, { align: 'center', width: 50 });
  doc.text('Total', tableX + 500, y + 7, { align: 'center', width: 35 });

  y += 24;
  doc.font('Helvetica').fontSize(8).fillColor('#1e293b');

  subjects.forEach((sub, i) => {
    const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.rect(tableX, y, tableW, 20).fill(rowBg);
    doc.rect(tableX, y, tableW, 20).lineWidth(0.5).stroke('#e2e8f0');

    doc.fillColor('#334155');
    doc.text(String(i + 1), tableX + 5, y + 6);
    doc.text(sub.name, tableX + 40, y + 6, { width: 180 });
    doc.text(String(sub.max_theory), tableX + 225, y + 6, { align: 'center', width: 50 });
    doc.text(String(sub.max_practical), tableX + 280, y + 6, { align: 'center', width: 50 });
    doc.text(String(sub.total_max), tableX + 335, y + 6, { align: 'center', width: 50 });
    doc.text(String(sub.obt_theory), tableX + 390, y + 6, { align: 'center', width: 50 });
    doc.text(String(sub.obt_practical), tableX + 445, y + 6, { align: 'center', width: 50 });
    doc.font('Helvetica-Bold').fillColor('#0a2a5e')
      .text(String(sub.total_obt), tableX + 500, y + 6, { align: 'center', width: 35 })
      .font('Helvetica').fillColor('#334155');
    y += 20;
  });

  // Grand Total Row
  doc.rect(tableX, y, tableW, 24).fill('#e2e8f0');
  doc.rect(tableX, y, tableW, 24).lineWidth(1).stroke('#94a3b8');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#0a2a5e');
  doc.text('GRAND TOTAL', tableX + 40, y + 7);
  doc.text(String(m.total_max), tableX + 335, y + 7, { align: 'center', width: 50 });
  doc.text(String(m.total_obtained), tableX + 500, y + 7, { align: 'center', width: 35 });
  y += 32;

  // Result Summary Box
  const { division } = computeGrade(m.percentage);
  doc.rect(tableX, y, tableW, 55).lineWidth(1).stroke('#cbd5e1');
  doc.rect(tableX, y, tableW, 55).fill('#f8fafc');

  doc.fillColor('#0a2a5e').fontSize(10).font('Helvetica-Bold');
  doc.text(`Percentage: ${m.percentage}%`, tableX + 20, y + 12);
  doc.text(`Grade: ${m.grade}`, tableX + 200, y + 12);
  doc.fillColor(m.result === 'PASS' ? '#15803d' : '#b91c1c')
    .text(`Result: ${m.result}`, tableX + 350, y + 12);

  doc.fillColor('#475569').fontSize(9).font('Helvetica');
  doc.text(`Division: ${division}`, tableX + 20, y + 32);
  doc.text(`Issue Date: ${new Date(m.issue_date || m.created_at).toLocaleDateString('en-IN')}`, tableX + 200, y + 32);
  y += 65;

  // Grading scale guide
  doc.fontSize(7).fillColor('#64748b')
    .text('Grading Scale: A+ (>=85% Distinction), A (75-84%), B (60-74% First Div), C (50-59% Second Div), D (33-49% Pass), F (<33% Fail)', tableX, y);
  y += 20;

  // QR Code and Signatures Footer
  const footerY = H - 150;
  doc.image(qr, tableX + 15, footerY, { width: 85 });
  doc.fontSize(7).fillColor('#64748b')
    .text('Scan QR code to verify', tableX + 15, footerY + 90, { width: 85, align: 'center' });

  // Seal badge
  doc.circle(W / 2, footerY + 45, 36).lineWidth(1.5).stroke('#d4af37');
  doc.circle(W / 2, footerY + 45, 33).lineWidth(0.5).stroke('#0a2a5e');
  doc.fontSize(7).font('Helvetica-Bold').fillColor('#0a2a5e')
    .text('PURVANCHAL', W / 2 - 30, footerY + 28, { align: 'center', width: 60 })
    .text('COUNCIL SEAL', W / 2 - 30, footerY + 40, { align: 'center', width: 60 })
    .text('OFFICIAL', W / 2 - 30, footerY + 52, { align: 'center', width: 60 });

  // Dual Signatures: Left = Centre Superintendent, Right = Controller of Examinations
  doc.moveTo(tableX + 130, footerY + 60).lineTo(tableX + 260, footerY + 60).lineWidth(0.8).stroke('#334155');
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#064e3b')
    .text('Centre Superintendent / Director', tableX + 120, footerY + 65, { align: 'center', width: 150 });
  doc.fontSize(7).font('Helvetica').fillColor('#64748b')
    .text(`(${m.centre_code || 'Study Centre'})`, tableX + 120, footerY + 77, { align: 'center', width: 150 });

  doc.moveTo(W - 170, footerY + 60).lineTo(W - 40, footerY + 60).lineWidth(0.8).stroke('#334155');
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0a2a5e')
    .text('Controller of Examinations', W - 180, footerY + 65, { align: 'center', width: 150 });
  doc.fontSize(7).font('Helvetica').fillColor('#64748b')
    .text('(Central Board, PESC)', W - 180, footerY + 77, { align: 'center', width: 150 });
  // Official contact footer bar
  doc.moveTo(20, H - 28).lineTo(W - 20, H - 28).lineWidth(0.8).stroke('#cbd5e1');
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#0a2a5e')
    .text('Main Head Office: Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001', 20, H - 22, { align: 'center', width: W - 40 });

  doc.end();
}));

module.exports = router;
