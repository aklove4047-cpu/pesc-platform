const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
const { HttpError, now, str, audit, next: counter } = require('../lib');

router.use(requireRole('student'));

// Helper to get student record for current logged-in user
function getStudent(req) {
  const u = req.user;
  const s = db.prepare(`
    SELECT s.*,
      c.name AS centre_name, c.centre_code, c.district AS centre_district, c.state AS centre_state, c.address AS centre_address,
      co.name AS course_name, co.code AS course_code, co.duration_months, co.fee_paise, co.total_marks,
      cu.name AS incharge_name, cu.mobile AS incharge_mobile, cu.email AS incharge_email
    FROM students s
    JOIN centres c ON c.id=s.centre_id
    JOIN courses co ON co.id=s.course_id
    LEFT JOIN users cu ON cu.id=c.owner_user_id
    WHERE s.user_id=? OR s.email=?
  `).get(u.id, u.email);

  if (!s) throw new HttpError(404, 'Student record not found for this account');
  return s;
}

// Student Profile & Academic Overview
router.get('/profile', (req, res) => {
  const s = getStudent(req);
  s.photo = s.photo_url || s.photo || null;
  res.json({ student: s });
});

// Student Marksheets (supports both /marksheets and /marksheet)
const handleMarksheets = (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT m.id, m.marksheet_no, m.token, m.roll_no, m.exam_session,
      m.total_max, m.total_obtained, m.percentage, m.grade, m.result,
      m.status, m.issue_date, m.created_at, m.subjects,
      co.name AS course_name, c.name AS centre_name
    FROM marksheets m
    JOIN courses co ON co.id=m.course_id
    JOIN centres c ON c.id=m.centre_id
    WHERE m.student_id=?
    ORDER BY m.id DESC
  `).all(s.id);

  for (const r of rows) {
    try { r.subjects = JSON.parse(r.subjects); } catch { r.subjects = []; }
  }
  res.json({ marksheets: rows, marksheet: rows[0] || null });
};
router.get('/marksheets', handleMarksheets);
router.get('/marksheet', handleMarksheets);

// Student Certificates (supports both /certificates and /certificate)
const handleCertificates = (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT cert.id, cert.cert_no, cert.token, cert.status, cert.issued_at, cert.created_at,
      co.name AS course_name, c.name AS centre_name
    FROM certificates cert
    JOIN courses co ON co.id=cert.course_id
    JOIN centres c ON c.id=cert.centre_id
    WHERE cert.student_id=?
    ORDER BY cert.id DESC
  `).all(s.id);

  res.json({ certificates: rows, certificate: rows[0] || null });
};
router.get('/certificates', handleCertificates);
router.get('/certificate', handleCertificates);

// Student Digital ID Card data
router.get('/id-card', (req, res) => {
  const s = getStudent(req);
  res.json({
    id_card: {
      student_code: s.student_code,
      name: s.name,
      father_name: s.father_name,
      dob: s.dob,
      course_name: s.course_name,
      course_code: s.course_code,
      duration_months: s.duration_months,
      centre_name: s.centre_name,
      centre_code: s.centre_code,
      centre_address: s.centre_address || `${s.centre_district}, ${s.centre_state}`,
      incharge_name: s.incharge_name,
      incharge_mobile: s.incharge_mobile,
      session: s.session,
      status: s.status,
      issued_on: new Date(s.created_at).toLocaleDateString('en-IN'),
      valid_until: s.session || `${new Date(s.created_at).getFullYear() + 2}`,
    },
  });
});

// Student Course Curriculum & Syllabus
router.get('/syllabus', (req, res) => {
  const s = getStudent(req);
  const code = (s.course_code || '').toUpperCase();

  // Comprehensive module definitions customized to course
  const syllabi = {
    ADCA: {
      title: 'Advanced Diploma in Computer Applications (ADCA)',
      duration: '12 Months (Full Time / Hybrid)',
      total_hours: 360,
      modules: [
        { code: 'ADCA-01', name: 'Information Technology & Computer Fundamentals', theory: 30, practical: 20, topics: ['Computer Hardware Architecture, Memory & Cache', 'Number Systems, Binary Arithmetic & Logic Gates', 'Windows 11 OS, Device Drivers, Control Panel', 'Linux Shell Basics and File System Management'] },
        { code: 'ADCA-02', name: 'Advanced Office Automation & Documentation', theory: 30, practical: 50, topics: ['MS Word: Advanced Typography, Mail Merge, Macros', 'MS Excel: Financial Functions, VLOOKUP, XLOOKUP, Pivot Tables', 'MS PowerPoint: Master Slides, Motion Animation, Audio/Video', 'MS Access: Database Schema, SQL Queries & Reports'] },
        { code: 'ADCA-03', name: 'Computerized Accounting with Tally ERP 9 / Prime & GST', theory: 35, practical: 65, topics: ['Accounting Principles, Vouchers & Ledgers', 'Inventory Control, Stock Groups & Cost Categories', 'GST Invoicing, E-Way Bill, CGST/SGST/IGST Reconciliation', 'TDS, Payroll Management & Balance Sheet Generation'] },
        { code: 'ADCA-04', name: 'Graphic Designing & Desktop Publishing (DTP)', theory: 25, practical: 45, topics: ['CorelDraw: Vector Graphics, Logo & Brochure Layouts', 'Adobe Photoshop: Image Retouching, Layers, Masking, Color Grading', 'PageMaker / InDesign: Book Typesetting & Print Production'] },
        { code: 'ADCA-05', name: 'Web Designing Fundamentals & Cyber Security', theory: 20, practical: 40, topics: ['HTML5 Semantic Layouts, CSS3 Flexbox & Grid', 'JavaScript Fundamentals & DOM Manipulation', 'Cyber Ethics, Information Security, Safe Net Banking'] },
        { code: 'ADCA-06', name: 'Industrial Capstone Project & Viva-Voce', theory: 10, practical: 50, topics: ['Comprehensive Live Project Implementation', 'Lab Practical Examination & External Viva-Voce'] },
      ],
    },
    DCA: {
      title: 'Diploma in Computer Applications (DCA)',
      duration: '6 Months (2 Semesters)',
      total_hours: 180,
      modules: [
        { code: 'DCA-01', name: 'Computer Fundamentals & Operating Systems', theory: 25, practical: 20, topics: ['Evolution of Computers, CPU, RAM/ROM, Storage Devices', 'Operating Systems: Windows & Linux GUI Navigation', 'Utilities, Anti-Virus, Disk Defrag & File Archiving'] },
        { code: 'DCA-02', name: 'Office Productivity Tools (Word, Excel & PowerPoint)', theory: 30, practical: 45, topics: ['MS Word: Document Formatting, Tables & Graphics', 'MS Excel: Formulas, Charts, Sorting & Data Filters', 'MS PowerPoint: Interactive Presentations & Slide Shows'] },
        { code: 'DCA-03', name: 'Database Management with MS Access', theory: 20, practical: 25, topics: ['Relational Database Concepts, Tables & Primary Keys', 'Forms, Queries, Criteria & Report Generation'] },
        { code: 'DCA-04', name: 'Internet Applications & Electronic Communication', theory: 15, practical: 25, topics: ['Web Browsers, Search Operators & Digital Bookmarking', 'Email Etiquette, Cloud Storage (Drive/OneDrive)', 'Practical Project & Comprehensive Viva-Voce'] },
      ],
    },
    CCC: {
      title: 'Course on Computer Concepts (CCC)',
      duration: '3 Months (80 Hours)',
      total_hours: 80,
      modules: [
        { code: 'CCC-01', name: 'Introduction to Computer & GUI Operating System', theory: 10, practical: 15, topics: ['Hardware, Software, Input/Output Units', 'Desktop, Taskbar, File Explorer, System Settings'] },
        { code: 'CCC-02', name: 'Word Processing & Electronic Spreadsheets', theory: 15, practical: 20, topics: ['Creating, Editing, Formatting & Printing Documents', 'Cells, Formulas (SUM, AVERAGE, IF), Worksheets & Charts'] },
        { code: 'CCC-03', name: 'Digital Presentations & Communications', theory: 10, practical: 15, topics: ['Creating Slides, Custom Animations & Transitions', 'Internet Services, Protocols, Email & Messaging Apps'] },
        { code: 'CCC-04', name: 'Digital Financial Services, Cyber Security & AI Basics', theory: 10, practical: 10, topics: ['UPI, Net Banking, AEPS, USSD, Digital Wallets', 'Cyber Safety, Phishing Awareness, Two-Factor Authentication'] },
      ],
    },
    TALLY: {
      title: 'Certificate in Computerized Financial Accounting with GST',
      duration: '3 Months (Professional Certificate)',
      total_hours: 90,
      modules: [
        { code: 'TLY-01', name: 'Accounting Fundamentals & Company Setup', theory: 15, practical: 20, topics: ['Double Entry Bookkeeping Principles', 'Company Creation, Chart of Accounts & Groups'] },
        { code: 'TLY-02', name: 'Voucher Entries & Inventory Management', theory: 15, practical: 25, topics: ['Payment, Receipt, Contra, Journal, Sales & Purchase Vouchers', 'Stock Items, Units of Measure, Godown Transfer & Reorder Levels'] },
        { code: 'TLY-03', name: 'Goods & Services Tax (GST) Compliance', theory: 20, practical: 35, topics: ['GST Configuration, Tax Rates, HSN/SAC Codes', 'GSTR-1, GSTR-3B Computation & Tax Liability Register'] },
        { code: 'TLY-04', name: 'Financial Statements, Auditing & Banking', theory: 10, practical: 15, topics: ['Bank Reconciliation Statement (BRS)', 'Trial Balance, Profit & Loss A/C, Balance Sheet Finalization'] },
      ],
    },
  };

  const matched = syllabi[code] || syllabi['DCA'];
  res.json({
    course_name: s.course_name,
    course_code: s.course_code,
    duration_months: s.duration_months,
    syllabus: matched,
  });
});

// Student Examination Admit Card / Hall Ticket
router.get('/admit-card', (req, res) => {
  const s = getStudent(req);

  // Check if student has roll_no from marksheets or generate standard roll
  const mrk = db.prepare('SELECT roll_no, exam_session FROM marksheets WHERE student_id=?').get(s.id);
  const rollNo = (mrk && mrk.roll_no) ? mrk.roll_no : `R${String(new Date(s.created_at).getFullYear()).slice(-2)}${String(s.centre_id).padStart(3, '0')}${String(s.id).padStart(4, '0')}`;
  const examSession = (mrk && mrk.exam_session) ? mrk.exam_session : (s.session || 'Annual Session 2026');

  // Exam schedule based on enrolled course
  const papers = [
    { paper_code: 'TH-01', subject: `${s.course_name} (Paper I - Theory Examination)`, exam_date: '15th of Session Month', timing: '10:00 AM – 01:00 PM', max_marks: 100 },
    { paper_code: 'PR-02', subject: `${s.course_name} (Paper II - Practical & Lab Test)`, exam_date: '16th of Session Month', timing: '02:00 PM – 05:00 PM', max_marks: 100 },
    { paper_code: 'VV-03', subject: 'Comprehensive Viva-Voce & Project Evaluation', exam_date: '17th of Session Month', timing: '10:00 AM – 01:00 PM', max_marks: 50 },
  ];

  res.json({
    admit_card: {
      roll_no: rollNo,
      enrollment_no: s.student_code,
      student_name: s.name,
      father_name: s.father_name || 'N/A',
      dob: s.dob || 'On Record',
      gender: 'Regular',
      course_name: s.course_name,
      course_code: s.course_code,
      exam_session: examSession,
      centre_name: s.centre_name,
      centre_code: s.centre_code,
      exam_venue: `${s.centre_name}, ${s.centre_address || `${s.centre_district}, ${s.centre_state}`}`,
      incharge_name: s.incharge_name || 'Centre Superintendent',
      incharge_mobile: s.incharge_mobile || 'Affiliated Centre Desk',
      papers,
      instructions: [
        'Candidate must carry this printed Admit Card along with an original Photo Identity Proof (Aadhaar Card / Voter ID) to the examination hall.',
        'Candidates are required to report at the examination venue at least 30 minutes prior to the commencement of each test.',
        'Electronic gadgets, mobile phones, smartwatches, and unauthorized printed materials are strictly prohibited in the examination hall.',
        'Practical examination files and project work reports must be submitted to the Centre Superintendent on the day of practical test.',
        'This Admit Card is valid only for the candidate whose photograph and enrollment details are registered with Purvanchal Education & Skill Council.',
      ],
    },
  });
});

// Student Official Fee & Admission Receipt
router.get('/fee-receipt', (req, res) => {
  const s = getStudent(req);
  const totalFeeRupees = Math.round((s.fee_paise || 500000) / 100);
  const regFee = 500;
  const examFee = 500;
  const tuitionFee = Math.max(0, totalFeeRupees - regFee - examFee);

  res.json({
    receipt: {
      receipt_no: `PESC-REC-${new Date(s.created_at).getFullYear()}-${String(s.id).padStart(5, '0')}`,
      transaction_ref: `TXN-ADM-${String(s.centre_code)}-${String(s.id).padStart(4, '0')}`,
      date: new Date(s.created_at).toLocaleDateString('en-IN'),
      student_code: s.student_code,
      student_name: s.name,
      father_name: s.father_name || 'N/A',
      mobile: s.mobile || 'On Record',
      email: s.email || 'On Record',
      course_name: s.course_name,
      course_code: s.course_code,
      duration_months: s.duration_months,
      centre_name: s.centre_name,
      centre_code: s.centre_code,
      centre_address: s.centre_address || `${s.centre_district}, ${s.centre_state}`,
      incharge_name: s.incharge_name || 'Centre Director',
      breakup: [
        { item: 'Council Registration & Verification Fee', amount: regFee },
        { item: 'Course Tuition, Study Material & Practical Lab Fee', amount: tuitionFee },
        { item: 'Council Examination & Marksheet Assessment Fee', amount: examFee },
      ],
      total_amount: totalFeeRupees,
      amount_paid: totalFeeRupees,
      balance_due: 0,
      payment_status: 'PAID & CONFIRMED (स्वीकृत)',
      payment_mode: 'Affiliated Centre Direct Enrolment',
    },
  });
});

// Student Support Tickets to Centre
router.get('/tickets', (req, res) => {
  const s = getStudent(req);
  const rows = db.prepare(`
    SELECT t.id, t.ticket_no, t.subject, t.category, t.priority, t.status, t.created_at
    FROM tickets t
    WHERE t.centre_id=? AND t.user_id=?
    ORDER BY t.id DESC LIMIT 50
  `).all(s.centre_id, req.user.id);

  res.json({ tickets: rows });
});

router.post('/tickets', (req, res) => {
  const s = getStudent(req);
  const subject = str(req.body.subject, 150);
  const body = str(req.body.body, 2000);
  const category = str(req.body.category, 40) || 'student_query';
  if (!subject || !body) throw new HttpError(400, 'Subject and message are required');

  const no = `STU-TKT-${String(counter('ticket')).padStart(6, '0')}`;
  db.transaction(() => {
    const r = db.prepare('INSERT INTO tickets(ticket_no,centre_id,user_id,category,priority,subject,created_at) VALUES(?,?,?,?,?,?,?)')
      .run(no, s.centre_id, req.user.id, category, 'normal', subject, now());
    db.prepare('INSERT INTO ticket_messages(ticket_id,user_id,body,at) VALUES(?,?,?,?)')
      .run(r.lastInsertRowid, req.user.id, body, now());
  })();

  audit(req, 'student.ticket', 'ticket', no);
  res.status(201).json({ ticket_no: no });
});

module.exports = router;
