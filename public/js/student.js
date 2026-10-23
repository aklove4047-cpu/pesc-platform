// Official PESC Council Header & Footer Builders matching User's Certificate format exactly
function renderOfficialCouncilHeader(opts = {}) {
  const studentCode = opts.studentCode || 'PESC-26-00008';
  const rollNo = opts.rollNo || studentCode;
  const refNo = opts.refNo || 'PESC-CERT-2026-0007';
  const issueDate = opts.issueDate || '04-10-2026';
  const uid = Math.random().toString(36).substring(2, 7);

  return `
    <!-- Top Hindi Title (Prominent Royal Blue) -->
    <div style="text-align:center; margin-bottom:4px;">
      <div style="font-size:1.65rem; font-weight:900; color:#0a48a3; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; letter-spacing:0.5px; line-height:1.2;">
        पूर्वांचल एजुकेशन एंड स्किल काउंसिल
      </div>
    </div>

    <!-- Council Circular Seal + 5-Line Official Accreditation Block -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px; margin:4px 0 6px;">
      <!-- Circular Council Seal SVG -->
      <div style="flex-shrink:0;">
        <svg width="84" height="84" viewBox="0 0 100 100" style="display:block;">
          <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#047857" stroke-width="3"/>
          <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#d4af37" stroke-width="1.5"/>
          <path id="txtArcTop_${uid}" d="M 20 50 A 30 30 0 1 1 80 50" fill="none" stroke="none"/>
          <text font-size="5.2" font-weight="900" fill="#047857" font-family="'Segoe UI', Arial, sans-serif">
            <textPath href="#txtArcTop_${uid}" startOffset="50%" text-anchor="middle">PURVANCHAL EDUCATION &amp; SKILL</textPath>
          </text>
          <path d="M47 24 Q50 17 53 24 Q55 30 50 33 Q45 30 47 24 Z" fill="#ef4444"/>
          <path d="M48 26 Q50 20 52 26 Q53 30 50 31 Q47 30 48 26 Z" fill="#fbbf24"/>
          <polygon points="48,33 52,33 51,40 49,40" fill="#b45309"/>
          <path d="M40 33 L36 30 M60 33 L64 30 M37 39 L32 39 M63 39 L68 39" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M50 54 Q36 46 25 51 L25 64 Q36 59 50 67 Q64 59 75 64 L75 51 Q64 46 50 54 Z" fill="#ffffff" stroke="#0a2a5e" stroke-width="1.6"/>
          <path d="M50 54 L50 67" stroke="#0a2a5e" stroke-width="1.6"/>
          <path d="M30 55 Q38 52 46 56 M30 59 Q38 56 46 60 M54 56 Q62 52 70 55 M54 60 Q62 56 70 59" stroke="#94a3b8" stroke-width="0.8" fill="none"/>
          <circle cx="50" cy="71" r="2.5" fill="#047857"/>
          <rect x="24" y="76" width="52" height="15" rx="3" fill="#0a2a5e" stroke="#d4af37" stroke-width="1"/>
          <text x="50" y="87" fill="#ffffff" font-size="9" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="1.5">PESC</text>
        </svg>
      </div>

      <!-- 5-Line Official Accreditation Block -->
      <div style="text-align:center;">
        <div style="font-size:1.24rem; font-weight:900; color:#047857; letter-spacing:0.5px; line-height:1.2; text-transform:uppercase;">
          PURVANCHAL EDUCATION AND SKILL COUNCIL
        </div>
        <div style="font-size:0.86rem; font-weight:900; color:#000000; letter-spacing:0.4px; text-transform:uppercase; margin-top:2px;">
          RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
        </div>
        <div style="font-size:0.72rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.2px;">
          REGISTERED UNDER INDIAN TRUST ACT &nbsp;||&nbsp; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
        </div>
        <div style="font-size:0.71rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.2px;">
          AN ISO 9001:2015 CERTIFIED COUNCIL &nbsp;||&nbsp; MSME REGISTERED ORGANISATION
        </div>
        <div style="font-size:0.76rem; font-weight:900; color:#000000; margin-top:2px;">
          <a href="https://pescouncil.in" target="_blank" style="color:#000000; text-decoration:none;">https://pescouncil.in</a>
        </div>
      </div>
    </div>

    <!-- Double Line Divider matching ======================================== -->
    <div style="border-top:3.5px double #000000; margin:6px 0 8px; width:100%;"></div>

    <!-- Two-Column Official Header Metadata -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; font-size:0.82rem; font-weight:900; color:#000000; text-align:left; line-height:1.45; margin-bottom:10px;">
      <div>
        <div>REGD. NO. (COUNCIL): <span style="font-family:monospace; font-weight:900;">TRUST/2025/5/IV/299</span></div>
        <div>Student Reg. No: <span style="font-family:monospace; font-weight:900;">${esc(studentCode)}</span></div>
        <div>Roll Number: <span style="font-family:monospace; font-weight:900;">${esc(rollNo)}</span></div>
      </div>
      <div style="text-align:right;">
        <div>Ref No: <span style="font-family:monospace; font-weight:900;">${esc(refNo)}</span></div>
        <div>Date of Issue: <span style="font-weight:900;">${esc(issueDate)}</span></div>
      </div>
    </div>
  `;
}

function renderOfficialCouncilFooter(opts = {}) {
  const directorName = opts.directorName || 'Authorized Signatory';

  return `
    <!-- Signatures and QR Code Row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:22px; padding:0 12px; text-align:center;">
      <!-- Left: Authorized Council Sign with Stamp -->
      <div style="display:flex; flex-direction:column; align-items:center; width:150px;">
        <div style="width:64px; height:64px; border:2px dashed #0a2a5e; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0a2a5e; font-size:0.5rem; font-weight:900; background:rgba(10,42,94,0.03); transform:rotate(-5deg);">
          <span>★ PESC ★</span>
          <span style="font-size:0.56rem;">COUNCIL</span>
          <span>SEAL</span>
        </div>
        <div style="font-family:cursive; font-size:1.05rem; color:#0a2a5e; margin:4px 0 1px;">S. N. Mishra</div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.5px solid #000000; display:block; padding-top:2px; width:100%;">Authorized Sign</span>
      </div>

      <!-- Center: QR Code for Verification -->
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="width:68px; height:68px; border:1px solid #cbd5e1; border-radius:4px; padding:3px; background:#ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="#ffffff"/>
            <rect x="10" y="10" width="28" height="28" fill="#000000"/>
            <rect x="15" y="15" width="18" height="18" fill="#ffffff"/>
            <rect x="20" y="20" width="8" height="8" fill="#000000"/>
            <rect x="62" y="10" width="28" height="28" fill="#000000"/>
            <rect x="67" y="15" width="18" height="18" fill="#ffffff"/>
            <rect x="72" y="20" width="8" height="8" fill="#000000"/>
            <rect x="10" y="62" width="28" height="28" fill="#000000"/>
            <rect x="15" y="67" width="18" height="18" fill="#ffffff"/>
            <rect x="20" y="72" width="8" height="8" fill="#000000"/>
            <rect x="44" y="10" width="8" height="8" fill="#000000"/>
            <rect x="44" y="24" width="8" height="14" fill="#000000"/>
            <rect x="10" y="44" width="14" height="8" fill="#000000"/>
            <rect x="30" y="44" width="8" height="8" fill="#000000"/>
            <rect x="44" y="44" width="12" height="12" fill="#000000"/>
            <rect x="62" y="44" width="8" height="14" fill="#000000"/>
            <rect x="76" y="44" width="14" height="8" fill="#000000"/>
            <rect x="44" y="62" width="8" height="14" fill="#000000"/>
            <rect x="62" y="62" width="14" height="8" fill="#000000"/>
            <rect x="80" y="62" width="10" height="10" fill="#000000"/>
            <rect x="62" y="76" width="10" height="14" fill="#000000"/>
            <rect x="78" y="78" width="12" height="12" fill="#000000"/>
            <rect x="44" y="82" width="12" height="8" fill="#000000"/>
          </svg>
        </div>
        <span style="font-size:0.6rem; font-weight:800; color:#475569; margin-top:2px;">Scan to Verify</span>
      </div>

      <!-- Right: Director Sign -->
      <div style="display:flex; flex-direction:column; align-items:center; width:150px;">
        <div style="height:48px; display:flex; align-items:flex-end; justify-content:center;">
          <div style="font-family:cursive; font-size:1.15rem; color:#064e3b;">${esc(directorName)}</div>
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.5px solid #000000; display:block; padding-top:2px; width:100%;">Director Sign</span>
      </div>
    </div>

    <!-- Official Contact Line -->
    <div style="margin-top:18px; border-top:1.5px solid #000000; padding-top:6px; text-align:center;">
      <div style="font-size:0.84rem; font-weight:900; color:#000000; letter-spacing:0.3px; margin-bottom:8px;">
        | 7380435797 | mauryachotu385@gmail.com | Head Office Shahgarh, Azamgarh UP 276001
      </div>

      <!-- Accreditation Badges Row -->
      <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; padding:2px 0;">
        <div style="border:1.5px solid #0a2a5e; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.48rem; font-weight:900; color:#0a2a5e; line-height:1.05;">
          <span>CERTIFIED</span>
          <span style="font-size:0.58rem; color:#ef4444;">ISO</span>
          <span>9001:2015</span>
        </div>
        <div style="border:1.5px solid #064e3b; border-radius:4px; padding:2px 6px; font-size:0.52rem; font-weight:900; color:#064e3b; text-align:center; line-height:1.1;">
          <div style="font-size:0.6rem; color:#b45309;">NITI Aayog</div>
          <div>NGO DARPAN</div>
        </div>
        <div style="border:1.5px solid #0369a1; border-radius:12px; padding:2px 8px; font-size:0.55rem; font-weight:900; color:#0369a1; text-align:center;">
          IAF ACCREDITED
        </div>
        <div style="border:1.5px solid #b45309; border-radius:4px; padding:2px 6px; font-size:0.52rem; font-weight:900; color:#b45309; text-align:center; line-height:1.1;">
          <div style="font-size:0.6rem; color:#000000;">MSME</div>
          <div>Govt. of India</div>
        </div>
        <div style="border:1.5px solid #0a2a5e; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.46rem; font-weight:900; color:#0a2a5e; line-height:1;">
          <span>PURVANCHAL</span>
          <span style="font-size:0.52rem; color:#d4af37;">SHIKSHA</span>
          <span>PARISHAD</span>
        </div>
        <div style="border:1.5px solid #047857; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.5rem; font-weight:900; color:#047857; line-height:1;">
          <span>PESC</span>
          <span style="font-size:0.46rem; color:#0a2a5e;">COUNCIL</span>
        </div>
      </div>
    </div>
  `;
// Comprehensive Accredited Course Curriculum: Yearly-Wise & Semester-Wise Distinct Subjects
const COURSE_CURRICULUM_DATA = {
  DCA: {
    name: 'Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '1st Year': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '2nd Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Final Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DCA-S101', name: 'Computer Fundamentals & OS (Windows/Linux)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S102', name: 'Office Automation Tools (MS Word & PowerPoint)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S103', name: 'Electronic Spreadsheets & Data Analysis (MS Excel)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S104', name: 'Practical Lab - I & IT Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DCA-S201', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S202', name: 'Database Management Systems (MS Access / SQL)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S203', name: 'Web Fundamentals, HTML, CSS & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S204', name: 'Software Project Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'DCA-S301', name: 'Advanced Database Architecture & SQL Reports', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S302', name: 'Desktop Publishing & Graphics Fundamentals', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S303', name: 'Business Accounting & Statutory Payroll', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S304', name: 'Applied Laboratory Work - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'DCA-S401', name: 'Web Application Design & Client Scripting', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S402', name: 'IT Infrastructure & Network Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S403', name: 'Major Project Implementation & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  ADCA: {
    name: 'Advanced Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'ADCA-Y101', name: 'Computer Fundamentals & Programming in C/Python', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Advanced MS Office Suite & Database Systems', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Web Designing Fundamentals (HTML5, CSS3, JS)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Graphic Designing (CorelDraw, Photoshop)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y106', name: 'Software Project Implementation & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'ADCA-Y101', name: 'IT Concepts, Computer Organization & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Complete Office Suite & Advanced Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & Taxation', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Programming Principles & C / Python Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Lab Practical - Year 1 & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '2nd Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ],
      'Final Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'ADCA-S101', name: 'Computer Fundamentals & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S102', name: 'Office Automation Suite (Word, Excel, PowerPoint)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S103', name: 'Problem Solving & Programming Logic in C', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-S104', name: 'Computer Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'ADCA-S201', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S202', name: 'Relational Database Systems & MS Access', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S203', name: 'Python Programming Fundamentals', max_marks: 100, theory: 46, practical: 46 },
        { code: 'ADCA-S204', name: 'Programming Lab - II & Project Viva', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'ADCA-S301', name: 'Web Designing (HTML5, CSS3, JavaScript)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S302', name: 'Graphic Designing (CorelDraw & Adobe Photoshop)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S303', name: 'Desktop Publishing & Pre-press Typography', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S304', name: 'Multimedia Design Lab - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'ADCA-S401', name: 'Advanced Web Applications & Backend API Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S402', name: 'Hardware Networking, LAN Setup & Cyber Security', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S403', name: 'Capstone Software Project Implementation', max_marks: 100, theory: 47, practical: 47 },
        { code: 'ADCA-S404', name: 'Comprehensive Grand Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  TALLY: {
    name: 'Tally with GST',
    yearly: {
      'Annual Examination': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'TAL-S101', name: 'Principles of Accounting & Double Entry System', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-S102', name: 'Tally Prime Environment, Masters & Ledger Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-S103', name: 'Inventory & Stock Valuation in Tally Prime', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S104', name: 'Practical Accounting Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'TAL-S201', name: 'Goods & Services Tax (GST) Invoicing & Returns', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-S202', name: 'Payroll Administration, PF, ESI & TDS Compliance', max_marks: 100, theory: 44, practical: 45 },
        { code: 'TAL-S203', name: 'Banking Reconciliation & Financial Statements', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S204', name: 'Commercial Accounting Project & Audit Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  CCC: {
    name: 'Course on Computer Concepts',
    yearly: {
      'Annual Examination': [
        { code: 'CCC-Y101', name: 'Introduction to Computer & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-Y102', name: 'Word Processing & Electronic Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-Y103', name: 'Presentation Systems & Internet / Web Technologies', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-Y104', name: 'Digital Financial Services & Cyber Security Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-Y105', name: 'Practical Lab Assessment & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CCC-S101', name: 'Digital Literacy, GUI & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-S102', name: 'Word Processing Fundamentals & Document Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-S103', name: 'Basic Computer Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CCC-S201', name: 'Electronic Spreadsheets & Visual Presentations', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-S202', name: 'Internet Services, Digital Banking & Cyber Safety', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-S203', name: 'Digital Skills Project & Practical Assessment', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  PGDCA: {
    name: 'Post Graduate Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'PGD-Y101', name: 'Fundamentals of IT & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y102', name: 'Object Oriented Programming (C++ & Java/Python)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-Y103', name: 'Relational Database Management Systems (SQL Server)', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-Y104', name: 'Web Application Development & Network Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-Y105', name: 'Software Engineering & System Architecture', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y106', name: 'Capstone Project Development & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'PGD-S101', name: 'IT Infrastructure & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-S102', name: 'Data Structures & Programming Logic in C/Python', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-S103', name: 'Relational Database Management Systems & SQL', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S104', name: 'Advanced Software Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'PGD-S201', name: 'Object Oriented Programming with Java', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-S202', name: 'Full-Stack Web Development & Cloud Architecture', max_marks: 100, theory: 44, practical: 45 },
        { code: 'PGD-S203', name: 'Cyber Security, Cryptography & Information Ethics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S204', name: 'Enterprise Capstone Project & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  DTP: {
    name: 'Desktop Publishing & Graphic Designing',
    yearly: {
      'Annual Examination': [
        { code: 'DTP-Y101', name: 'Design Principles & Page Layout Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-Y102', name: 'Adobe Photoshop & Digital Image Processing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-Y103', name: 'CorelDraw & Vector Illustration Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-Y104', name: 'Adobe InDesign & Pre-press Printing Technology', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DTP-Y105', name: 'Professional Printing Portfolio & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DTP-S101', name: 'Digital Typography & Graphic Layout Basics', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-S102', name: 'Adobe Photoshop Creative Suite & Photo Editing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-S103', name: 'Raster Graphics Design Lab - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DTP-S201', name: 'CorelDraw Vector Art, Banner & Logo Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-S202', name: 'Adobe InDesign & Book Publication Pre-Press', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DTP-S203', name: 'Print Production Technology & Exhibition Portfolio', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  NTT: {
    name: 'Nursery Teacher Training',
    yearly: {
      'Annual Examination': [
        { code: 'NTT-Y101', name: 'Child Psychology & Child Development', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-Y102', name: 'Early Childhood Care & Education (ECCE)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'NTT-Y103', name: 'Pre-School Organization, Health & Nutrition', max_marks: 100, theory: 45, practical: 46 },
        { code: 'NTT-Y104', name: 'Educational Rhymes, Story Telling & Music', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-Y105', name: 'Teaching Learning Materials (TLM) & Arts Crafts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-Y106', name: 'Micro-Teaching Practical & Classroom Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'NTT-S101', name: 'Child Development & Psychology Fundamentals', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-S102', name: 'Nutrition, Health & Hygiene for Pre-Primary', max_marks: 100, theory: 44, practical: 46 },
        { code: 'NTT-S103', name: 'Early Education Curriculum & Rhyme Workshop', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-S104', name: 'Practical Activity Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'NTT-S201', name: 'Modern Teaching Methods (Montessori & Play-Way)', max_marks: 100, theory: 45, practical: 46 },
        { code: 'NTT-S202', name: 'School Administration & Community Engagement', max_marks: 100, theory: 44, practical: 45 },
        { code: 'NTT-S203', name: 'TLM Creation, Creative Crafts & Exhibition', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-S204', name: 'School Internship & Teaching Demonstration Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  HARDWARE: {
    name: 'Diploma in Computer Hardware & Networking',
    yearly: {
      'Annual Examination': [
        { code: 'CHN-Y101', name: 'Computer Hardware Architecture & Components', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-Y102', name: 'OS Installation, BIOS & Device Configuration', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-Y103', name: 'Computer Networks, Cabling & IP Addressing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-Y104', name: 'Network Devices, Routers & Cyber Defense', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CHN-Y105', name: 'Hardware Lab Practical & Diagnostic Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CHN-S101', name: 'PC Assembly, Power Supply & Storage Maintenance', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-S102', name: 'BIOS Setup, Drivers & OS Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-S103', name: 'Hardware Assembly Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CHN-S201', name: 'Local Area Networks (LAN) & Network Devices', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-S202', name: 'Wireless Routers, WiFi & Internet Gateways', max_marks: 100, theory: 44, practical: 45 },
        { code: 'CHN-S203', name: 'Network Troubleshooting & Field Project Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  YOGA: {
    name: 'Diploma in Yoga & Naturopathy Education',
    yearly: {
      'Annual Examination': [
        { code: 'YOG-Y101', name: 'Foundations of Yoga Philosophy & History', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-Y102', name: 'Human Anatomy & Physiology for Yoga', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-Y103', name: 'Principles of Naturopathy & Diet Therapy', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-Y104', name: 'Yogic Asanas, Pranayama & Shatkarma Techniques', max_marks: 100, theory: 46, practical: 45 },
        { code: 'YOG-Y105', name: 'Practical Asana Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'YOG-S101', name: 'Classical Yoga Texts & Principles of Health', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-S102', name: 'Basic Anatomy, Respiratory System & Postures', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-S103', name: 'Practical Yoga Sadhana - I (Sukshma Vyayama)', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'YOG-S201', name: 'Naturopathy, Hydrotherapy & Natural Healing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-S202', name: 'Pranayama, Meditation & Stress Management', max_marks: 100, theory: 44, practical: 45 },
        { code: 'YOG-S203', name: 'Therapeutic Yoga Practice & Clinical Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  FASHION: {
    name: 'Diploma in Fashion Designing & Garment Fabrication',
    yearly: {
      'Annual Examination': [
        { code: 'FAS-Y101', name: 'Fundamentals of Fashion Design & Illustration', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-Y102', name: 'Textile Science, Fabric Selection & Fiber Analysis', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-Y103', name: 'Pattern Making, Grading & Garment Construction', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-Y104', name: 'Computer Aided Fashion Design (CAD) & Merchandising', max_marks: 100, theory: 46, practical: 45 },
        { code: 'FAS-Y105', name: 'Garment Collection Exhibition & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'FAS-S101', name: 'Fashion Sketching & Design Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-S102', name: 'Basic Textile Studies & Sewing Techniques', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-S103', name: 'Pattern Drafting Workshop - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'FAS-S201', name: 'Advanced Garment Fabrication & Draping', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-S202', name: 'Digital Fashion CAD & Apparel Marketing', max_marks: 100, theory: 44, practical: 45 },
        { code: 'FAS-S203', name: 'Final Garment Collection & Portfolio Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  }
};

function getCourseCurriculumSubjects(courseNameOrCode, evalPattern, termName) {
  const norm = String(courseNameOrCode || '').toUpperCase();
  const pattern = (evalPattern === 'semester') ? 'semester' : 'yearly';
  const term = String(termName || (pattern === 'semester' ? 'Semester 1' : 'Annual Examination')).trim();

  let key = Object.keys(COURSE_CURRICULUM_DATA).find(k => norm === k || norm.includes(k) || (COURSE_CURRICULUM_DATA[k].name && norm.includes(COURSE_CURRICULUM_DATA[k].name.toUpperCase())));
  if (!key) {
    if (norm.includes('NURSERY') || norm.includes('NTT') || norm.includes('TEACHER')) key = 'NTT';
    else if (norm.includes('ADVANCED') || norm.includes('ADCA')) key = 'ADCA';
    else if (norm.includes('DCA')) key = 'DCA';
    else if (norm.includes('TALLY')) key = 'TALLY';
    else if (norm.includes('CCC')) key = 'CCC';
    else if (norm.includes('PGDCA')) key = 'PGDCA';
    else if (norm.includes('DTP') || norm.includes('PUBLISHING')) key = 'DTP';
    else if (norm.includes('HARDWARE') || norm.includes('NETWORKING')) key = 'HARDWARE';
    else if (norm.includes('YOGA')) key = 'YOGA';
    else if (norm.includes('FASHION')) key = 'FASHION';
  }

  if (key && COURSE_CURRICULUM_DATA[key]) {
    const courseObj = COURSE_CURRICULUM_DATA[key];
    const patObj = courseObj[pattern] || {};

    if (patObj[term]) return patObj[term];

    if (pattern === 'semester') {
      if (term.includes('2') || term.toLowerCase().includes('second')) return patObj['Semester 2'] || Object.values(patObj)[1] || patObj['Semester 1'];
      if (term.includes('3') || term.toLowerCase().includes('third')) return patObj['Semester 3'] || Object.values(patObj)[2] || patObj['Semester 1'];
      if (term.includes('4') || term.toLowerCase().includes('fourth')) return patObj['Semester 4'] || Object.values(patObj)[3] || patObj['Semester 1'];
      return patObj['Semester 1'] || Object.values(patObj)[0];
    } else {
      if (term.includes('2nd') || term.toLowerCase().includes('second')) return patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('Final') || term.toLowerCase().includes('final')) return patObj['Final Year'] || patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('1st') || term.toLowerCase().includes('first')) return patObj['1st Year'] || patObj['Annual Examination'];
      return patObj['Annual Examination'] || Object.values(patObj)[0];
    }
  }

  const cLabel = courseNameOrCode || 'Vocational';
  if (pattern === 'semester') {
    const semNum = term.match(/\d+/) ? term.match(/\d+/)[0] : '1';
    return [
      { code: `SEM${semNum}-01`, name: `${cLabel} Theory & Fundamentals (Sem-${semNum})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `SEM${semNum}-02`, name: `${cLabel} Systems, Tools & Methodology (Sem-${semNum})`, max_marks: 100, theory: 44, practical: 46 },
      { code: `SEM${semNum}-03`, name: `${cLabel} Applied Practical Workshop - ${semNum}`, max_marks: 100, theory: 46, practical: 45 },
      { code: `SEM${semNum}-04`, name: `${cLabel} Term Assessment & Viva-Voce (Sem-${semNum})`, max_marks: 100, theory: 47, practical: 47 },
    ];
  } else {
    const yearLabel = term.includes('1') ? 'Year 1' : term.includes('2') ? 'Year 2' : 'Annual';
    return [
      { code: `Y-${yearLabel}-01`, name: `${cLabel} Core Foundations & Theory (${yearLabel})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `Y-${yearLabel}-02`, name: `${cLabel} Applied Technology & Software Operations`, max_marks: 100, theory: 44, practical: 46 },
      { code: `Y-${yearLabel}-03`, name: `${cLabel} Industry Standards & Professional Practice`, max_marks: 100, theory: 45, practical: 46 },
      { code: `Y-${yearLabel}-04`, name: `${cLabel} Comprehensive Lab Practical Assessment`, max_marks: 100, theory: 46, practical: 45 },
      { code: `Y-${yearLabel}-05`, name: `${cLabel} Project Demonstration & Viva-Voce`, max_marks: 100, theory: 48, practical: 48 },
    ];
  }
}

guard(async () => {
  const me = await needRole(['student']);
  if (!me) return;

  $('#who').textContent = me.user.name + ` (${me.user.email})`;
  $('#out').onclick = (e) => {
    e.preventDefault();
    guard(async () => {
      await api('/api/auth/logout', { method: 'POST' });
      location = '/login';
    });
  };

  const tabsEl = $('#tabs');
  const viewEl = $('#view');

  const R = {
    Dashboard: async () => {
      const data = await api('/api/student/profile');
      const s = data.student;
      const mrkData = await api('/api/student/marksheets');
      const certData = await api('/api/student/certificates');

      const hasMrk = mrkData.marksheets && mrkData.marksheets.length > 0;
      const hasCert = certData.certificates && certData.certificates.length > 0;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px; border-left: 5px solid #d4af37; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge ${s.status}">${s.status.toUpperCase()}</span>
              <h2 style="margin: 8px 0 4px; font-size:1.8rem; color:var(--navy);">Welcome, ${esc(s.name)}!</h2>
              <p class="muted" style="margin:0;">Enrollment / Student Code: <b style="color:var(--navy); font-family:monospace; font-size:1.1rem; background:#f1f5f9; padding:2px 8px; border-radius:4px; border:1px solid #cbd5e1;">${esc(s.student_code)}</b></p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#64748b;">Affiliated Study Centre</span>
              <h4 style="margin:2px 0; color:var(--navy);">${esc(s.centre_name)} (${esc(s.centre_code)})</h4>
              <p style="font-size:0.8rem; color:#64748b; margin:0;">${esc(s.centre_district)}, ${esc(s.centre_state)}</p>
              <button type="button" class="btn gold sm" onclick="document.querySelectorAll('.tabs button')[5]?.click() || R['Digital ID Card']()" style="font-weight:700; margin-top:6px; font-size:0.75rem;">🪪 View / Print Centre ID Card</button>
            </div>
          </div>
        </div>

        <!-- Academic Journey Progress Tracker -->
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-bottom:14px; font-size:1.1rem;">Academic Progression Milestone</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:10px;">
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:#166534; font-size:0.9rem;">1. Admission</b>
                <span style="color:#16a34a; font-weight:bold;">✓ Confirmed</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">Enrolled in ${esc(s.course_code)}</p>
            </div>

            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:#166534; font-size:0.9rem;">2. Curriculum</b>
                <span style="color:#16a34a; font-weight:bold;">✓ Active</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">${s.duration_months} Months Training</p>
            </div>

            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:#166534; font-size:0.9rem;">3. Hall Ticket</b>
                <span style="color:#16a34a; font-weight:bold;">✓ Ready</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">Exam Session ${esc(s.session || '2026')}</p>
            </div>

            <div style="background:${hasMrk ? '#f0fdf4' : '#fffbeb'}; border:1px solid ${hasMrk ? '#bbf7d0' : '#fde68a'}; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:${hasMrk ? '#166534' : '#854d0e'}; font-size:0.9rem;">4. Marksheet</b>
                <span style="font-weight:bold; color:${hasMrk ? '#16a34a' : '#d97706'};">${hasMrk ? '✓ ' + mrkData.marksheets[0].result : '⏳ In Progress'}</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">${hasMrk ? mrkData.marksheets[0].percentage + '% Marks' : 'Pending Evaluation'}</p>
            </div>

            <div style="background:${hasCert ? '#f0fdf4' : '#f8fafc'}; border:1px solid ${hasCert ? '#bbf7d0' : '#cbd5e1'}; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:${hasCert ? '#166534' : '#475569'}; font-size:0.9rem;">5. Certificate</b>
                <span style="font-weight:bold; color:${hasCert ? '#16a34a' : '#64748b'};">${hasCert ? '✓ Awarded' : '⏳ Awaiting'}</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">${hasCert ? esc(certData.certificates[0].cert_no) : 'Final Clearance'}</p>
            </div>
          </div>
        </div>

        <div class="grid" style="margin-bottom:20px;">
          <div class="stat">
            <span>Enrolled Course</span>
            <b style="font-size:1.3rem;">${esc(s.course_name)}</b>
            <p class="muted" style="margin-top:6px;">Duration: ${s.duration_months} Months · Session: ${esc(s.session || '2026')}</p>
          </div>
          <div class="stat">
            <span>Marksheet Status</span>
            <b style="font-size:1.3rem;">${hasMrk ? mrkData.marksheets[0].result + ' (' + mrkData.marksheets[0].grade + ')' : 'In Progress'}</b>
            <p class="muted" style="margin-top:6px;">${hasMrk ? 'Percentage: ' + mrkData.marksheets[0].percentage + '%' : 'Awaiting examination marks'}</p>
          </div>
          <div class="stat">
            <span>Certificate Status</span>
            <b style="font-size:1.3rem;">${hasCert ? certData.certificates[0].status : 'Pending'}</b>
            <p class="muted" style="margin-top:6px;">${hasCert && certData.certificates[0].cert_no ? certData.certificates[0].cert_no : 'Issued upon course completion'}</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px; flex-wrap:wrap;">
          <div class="card">
            <h3>Academic Information & Candidate Profile</h3>
            <div class="row" style="margin-top:14px;">
              <div><label>Full Name</label><input value="${esc(s.name)}" readonly></div>
              <div><label>Father's Name</label><input value="${esc(s.father_name || 'N/A')}" readonly></div>
              <div><label>Mobile Number</label><input value="${esc(s.mobile || 'N/A')}" readonly></div>
              <div><label>Email ID</label><input value="${esc(s.email || 'N/A')}" readonly></div>
              <div><label>Date of Birth</label><input value="${esc(s.dob || 'N/A')}" readonly></div>
              <div><label>Admission Date</label><input value="${date(s.created_at)}" readonly></div>
            </div>
          </div>

          <div class="card" style="border:1px solid #cbd5e1; background:#f8fafc;">
            <h3 style="color:var(--navy); font-size:1.1rem; margin-bottom:12px;">🏫 Your Study Centre</h3>
            <div style="font-size:0.9rem; line-height:1.6;">
              <p style="margin:0 0 6px;"><b>Centre Name:</b><br><span style="color:var(--navy); font-weight:600;">${esc(s.centre_name)}</span></p>
              <p style="margin:0 0 6px;"><b>Centre Code:</b> <code style="color:var(--navy);">${esc(s.centre_code)}</code></p>
              <p style="margin:0 0 6px;"><b>Incharge / Director:</b> ${esc(s.incharge_name || 'Centre Director')}</p>
              <p style="margin:0 0 6px;"><b>Support Contact:</b> <a href="tel:${esc(s.incharge_mobile || '')}" style="color:#0284c7;">${esc(s.incharge_mobile || 'Contact Centre Desk')}</a></p>
              <p style="margin:0 0 6px;"><b>Support Email:</b> ${esc(s.incharge_email || 'desk@pescouncil.in')}</p>
              <p style="margin:0;"><b>Centre Address:</b><br><span class="muted">${esc(s.centre_address || `${s.centre_district}, ${s.centre_state}`)}</span></p>
            </div>
          </div>
        </div>
      `;
    },

    'Syllabus & Curriculum': async () => {
      const data = await api('/api/student/syllabus');
      const syl = data.syllabus;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge active">${esc(data.course_code)}</span>
              <h2 style="margin:8px 0 4px;">${esc(syl.title)}</h2>
              <p class="muted">Duration: <b>${syl.duration}</b> · Instructional Volume: <b>${syl.total_hours} Hours</b></p>
            </div>
            <button onclick="window.print()" class="btn alt">🖨️ Print Syllabus</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          ${syl.modules.map((m, idx) => `
            <div class="card" style="border-left: 4px solid var(--navy);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                <h3 style="margin:0; font-size:1.15rem; color:var(--navy);">${idx + 1}. [${esc(m.code)}] ${esc(m.name)}</h3>
                <div style="display:flex; gap:8px;">
                  <span class="badge" style="background:#e0f2fe; color:#0369a1;">Theory: ${m.theory} Hrs</span>
                  <span class="badge" style="background:#f0fdf4; color:#15803d;">Practical: ${m.practical} Hrs</span>
                </div>
              </div>
              <ul style="margin:0; padding-left:20px; line-height:1.8; color:#334155; font-size:0.95rem;">
                ${m.topics.map(t => `<li>${esc(t)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="card" style="margin-top:20px; background:#f8fafc; border:1px solid #cbd5e1;">
          <h4 style="margin:0 0 8px; color:var(--navy);">Assessment & Examination Structure</h4>
          <p class="muted" style="margin:0; line-height:1.6; font-size:0.9rem;">
            Evaluation comprises continuous internal assessment by the affiliated centre (40%) and national council terminal examination (60%). Practical lab assessment and project submission are mandatory for marksheet and certificate clearance.
          </p>
        </div>
      `;
    },

    'Admit Card / Hall Ticket': async () => {
      const data = await api('/api/student/admit-card');
      const ac = data.admit_card;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h2>Examination Admit Card / Hall Ticket</h2>
              <p class="muted">Official entrance credential for Council Examination Session: <b>${esc(ac.exam_session)}</b></p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Official Admit Card</button>
          </div>
        </div>

        <div class="card" style="border:2px solid var(--navy); border-radius:12px; padding:24px; background:#fff; box-shadow:var(--shadow-md);">
          <!-- Header -->
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid var(--navy); padding-bottom:14px; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:55px; height:55px; border-radius:50%; background:var(--navy); color:#fde047; font-size:1.8rem; font-weight:bold; display:grid; place-items:center; border:2px solid #d4af37;">P</div>
              <div>
                <h3 style="margin:0; color:var(--navy); letter-spacing:0.5px; font-size:1.3rem;">PURVANCHAL EDUCATION & SKILL COUNCIL</h3>
                <p style="margin:2px 0 0; font-size:0.85rem; color:#64748b; font-weight:600;">Autonomous National Council for Vocational & Skill Education</p>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge Valid" style="font-size:0.85rem;">ADMIT CARD 2026</span>
              <p style="margin:4px 0 0; font-family:monospace; font-weight:bold; color:var(--navy); font-size:1rem;">ROLL NO: ${esc(ac.roll_no)}</p>
            </div>
          </div>

          <!-- Student & Exam Details -->
          <div style="display:grid; grid-template-columns:3fr 1fr; gap:20px; margin-bottom:20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.92rem;">
              <div><b>Candidate Name:</b><br><span style="font-size:1.05rem; color:var(--navy); font-weight:bold;">${esc(ac.student_name)}</span></div>
              <div><b>Father's Name:</b><br>${esc(ac.father_name)}</div>
              <div><b>Enrollment Number:</b><br><code style="font-size:0.95rem; font-weight:bold;">${esc(ac.enrollment_no)}</code></div>
              <div><b>Course:</b><br><b>${esc(ac.course_code)}</b> - ${esc(ac.course_name)}</div>
              <div><b>Date of Birth:</b><br>${esc(ac.dob)}</div>
              <div><b>Candidate Category:</b><br>${esc(ac.gender)} / Affiliated Centre</div>
              <div style="grid-column:span 2; background:#f8fafc; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0;">
                <b>Examination Centre & Venue:</b><br>
                <span style="color:var(--navy); font-weight:600;">${esc(ac.exam_venue)}</span>
                <span class="muted" style="display:block; font-size:0.8rem;">Center Code: ${esc(ac.centre_code)}</span>
              </div>
            </div>

            <!-- Candidate Photo Box -->
            <div style="text-align:center;">
              <div style="width:120px; height:140px; border:2px dashed #94a3b8; border-radius:8px; margin:0 auto; display:grid; place-items:center; background:#f1f5f9;">
                <div style="font-size:2.8rem;">🎓</div>
              </div>
              <span style="font-size:0.75rem; color:#64748b; margin-top:4px; display:block;">Verified Digital Photo</span>
            </div>
          </div>

          <!-- Papers Schedule Table -->
          <h4 style="margin:0 0 10px; color:var(--navy);">Examination Schedule & Papers</h4>
          <div class="wrap" style="margin-bottom:20px;">
            <table>
              <thead>
                <tr>
                  <th>Paper Code</th>
                  <th>Subject Title</th>
                  <th>Scheduled Date</th>
                  <th>Shift Timings</th>
                  <th>Max Marks</th>
                </tr>
              </thead>
              <tbody>
                ${ac.papers.map(p => `
                  <tr>
                    <td><b style="font-family:monospace;">${esc(p.paper_code)}</b></td>
                    <td><b>${esc(p.subject)}</b></td>
                    <td>${esc(p.exam_date)}</td>
                    <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${esc(p.timing)}</span></td>
                    <td>${p.max_marks}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Instructions -->
          <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 16px; margin-bottom:20px; font-size:0.82rem; color:#78350f;">
            <b style="display:block; margin-bottom:6px; font-size:0.88rem;">Important Examination Rules & Instructions:</b>
            <ol style="margin:0; padding-left:18px; line-height:1.6;">
              ${ac.instructions.map(ins => `<li>${esc(ins)}</li>`).join('')}
            </ol>
          </div>

          <!-- Signatures -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #94a3b8; padding-top:24px; font-size:0.85rem; color:#475569;">
            <div style="text-align:center;">
              <div style="border-bottom:1px solid #334155; width:150px; margin-bottom:4px;"></div>
              <span>Candidate Signature</span>
            </div>
            <div style="text-align:center;">
              <div style="font-weight:bold; color:var(--navy); margin-bottom:2px;">[Verified Online]</div>
              <div style="border-bottom:1px solid #334155; width:160px; margin-bottom:4px;"></div>
              <span>Centre Superintendent Stamp</span>
            </div>
            <div style="text-align:center;">
              <div style="font-weight:bold; color:#d4af37; font-size:1.1rem; margin-bottom:2px;">PESC Seal</div>
              <div style="border-bottom:1px solid #334155; width:170px; margin-bottom:4px;"></div>
              <span>Controller of Examinations, PESC</span>
            </div>
          </div>
        </div>
      `;
    },

    'My Marksheet': async () => {
      const data = await api('/api/student/marksheets');
      const list = data.marksheets;

      if (!list.length) {
        viewEl.innerHTML = `
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">📄</div>
            <h3>No Marksheet Issued Yet</h3>
            <p class="muted">Your marksheet will appear here once your training centre uploads examination marks and it is verified by the council.</p>
          </div>
        `;
        return;
      }

      const m = list[0];
      let subjects = m.subjects || [];
      if (typeof subjects === 'string') {
        try { subjects = JSON.parse(subjects); } catch(e) { subjects = []; }
      }
      if (!subjects || !subjects.length) {
        subjects = getCourseCurriculumSubjects(m.course_name || m.course_code, m.evaluation_type, m.term);
      }

      let subjectsHtml = '';
      if (subjects.length) {
        subjectsHtml = `
          <div class="wrap" style="margin: 20px 0;">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Subject / Module</th>
                  <th>Max Theory</th>
                  <th>Max Practical</th>
                  <th>Max Total</th>
                  <th>Obt Theory</th>
                  <th>Obt Practical</th>
                  <th>Total Marks</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                ${subjects.map((sub, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><b>${esc(sub.name)}</b></td>
                    <td>${sub.max_theory}</td>
                    <td>${sub.max_practical}</td>
                    <td>${sub.total_max}</td>
                    <td>${sub.obt_theory}</td>
                    <td>${sub.obt_practical}</td>
                    <td><b style="color:var(--navy); font-size:1.05rem;">${sub.total_obt}</b></td>
                    <td>${badge(sub.result)}</td>
                  </tr>
                `).join('')}
                <tr style="background:#f1f5f9; font-weight:bold;">
                  <td colspan="4" style="text-align:right;">GRAND TOTAL:</td>
                  <td>${m.total_max}</td>
                  <td colspan="2"></td>
                  <td style="color:var(--navy); font-size:1.1rem;">${m.total_obtained}</td>
                  <td>${badge(m.result)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }

      const cName = m.institute_name || m.centre_name || 'Authorized Training Centre';
      const cCode = m.centre_code || 'PESC00001';
      const cAddress = m.institute_address || 'City Campus, Main Road';
      const directorName = m.director_name || 'Dr. Ramesh Kumar';
      const directorPhoto = m.director_photo || '';
      const validityText = m.validity || 'Lifetime Recognition / Session 2026-27';

      const directorPhotoHtml = directorPhoto
        ? `<img src="${esc(directorPhoto)}" alt="Director Photo" style="width:100%; height:100%; object-fit:cover;">`
        : `<div style="text-align:center; padding:2px;"><div style="font-size:1.4rem;">👤</div><span style="font-size:0.5rem; font-weight:700; color:#64748b; display:block; line-height:1;">Director Photo</span></div>`;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Statement of Marks</h2>
              <p class="muted" style="margin:0;">Marksheet No: <b style="color:var(--navy); font-family:monospace;">${esc(m.marksheet_no || 'PESC-MRK-2026-001')}</b> · Exam Session: <b>${esc(m.exam_session || '2026-27')}</b></p>
            </div>
            <div style="display:flex; gap:10px;">
              <button onclick="window.print()" class="btn gold">🖨️ Print Official Marksheet</button>
            </div>
          </div>

          <!-- Official Standardized Marksheet Container -->
          <div class="printable-area" style="background:#ffffff; border:10px double #d4af37; padding:28px 32px; border-radius:10px; box-shadow:0 6px 24px rgba(0,0,0,0.06); text-align:center; position:relative;">
            ${renderOfficialCouncilHeader({
              studentCode: m.student_code || me.user.student_code || me.user.roll_no || 'PESC-26-00008',
              rollNo: m.roll_no || me.user.roll_no || me.user.student_code || 'PESC-00008',
              refNo: m.marksheet_no || 'PESC-MRK-2026-0007',
              issueDate: date(m.issue_date || m.created_at) || '04-10-2026'
            })}

            <!-- Marksheet Ribbon Title -->
            <div style="text-align:center; margin:10px 0 14px;">
              <div style="display:inline-block; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#ffffff; font-size:1.45rem; font-weight:900; letter-spacing:2px; padding:6px 36px; border-radius:6px; box-shadow:0 3px 8px rgba(10,42,94,0.3); border:2px solid #d4af37;">
                STATEMENT OF MARKS
              </div>
              <div style="font-size:0.75rem; font-weight:800; color:#0a2a5e; letter-spacing:1px; margin-top:4px;">
                OFFICIAL EVALUATION ASSESSMENT · SESSION ${esc(m.exam_session || '2026-27')}
              </div>
            </div>

            <!-- Candidate & Study Centre Info Box -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 16px; font-size:0.86rem; margin-bottom:14px; background:#f8fafc; padding:10px 14px; border-radius:6px; text-align:left; border:1px solid #cbd5e1;">
              <div>Candidate Name: <b style="color:#0f172a; font-size:0.95rem;">${esc(me.user.name)}</b></div>
              <div>Authorized Study Centre: <b style="color:#0a2a5e;">${esc(cName)} (${esc(cCode)})</b></div>
              <div>Father's Name: <b style="color:#0f172a;">${esc(m.father_name || me.user.father_name || 'N/A')}</b></div>
              <div>Examination Centre: <b style="color:#0f172a;">${esc(cAddress)}</b></div>
              <div>Course: <b style="color:#064e3b; font-size:0.95rem;">${esc(m.course_name || 'Diploma in Computer Application')}</b></div>
              <div>Evaluation Scheme: <b style="color:#0369a1;">ANNUAL / CONSOLIDATED EVALUATION</b></div>
            </div>

            ${subjectsHtml}

            ${renderOfficialCouncilFooter({
              directorName: directorName,
              centreCode: cCode
            })}
          </div>
        </div>
      `;
    },

    'My Certificate': async () => {
      const data = await api('/api/student/certificates');
      const list = data.certificates;

      if (!list.length) {
        viewEl.innerHTML = `
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">🎓</div>
            <h3>No Certificate Requested Yet</h3>
            <p class="muted">Once you complete your course and examinations, your centre will apply for your Council Certificate.</p>
          </div>
        `;
        return;
      }

      const c = list[0];
      const cName = c.institute_name || c.centre_name || 'Authorized Training Centre';
      const cCode = c.centre_code || 'PESC00001';
      const cAddress = c.institute_address || 'City Campus, Main Road';
      const directorName = c.director_name || 'Dr. Ramesh Kumar';
      const directorPhoto = c.director_photo || '';
      const validityText = c.validity || 'Lifetime Recognition / Session 2026-27';

      const directorPhotoHtml = directorPhoto
        ? `<img src="${esc(directorPhoto)}" alt="Director Photo" style="width:100%; height:100%; object-fit:cover;">`
        : `<div style="text-align:center; padding:2px;"><div style="font-size:1.4rem;">👤</div><span style="font-size:0.5rem; font-weight:700; color:#64748b; display:block; line-height:1;">Director Photo</span></div>`;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Course Completion Certificate</h2>
              <p class="muted" style="margin:0;">Status: ${badge(c.status)} · Certificate No: <b style="color:var(--navy); font-family:monospace;">${esc(c.cert_no || 'Processing')}</b></p>
            </div>
            <div style="display:flex; gap:10px;">
              <a href="/verify/${c.token}" target="_blank" class="btn alt">🔍 Public Verification Page</a>
              <button onclick="window.print()" class="btn gold">🖨️ Print Certificate</button>
            </div>
          </div>

          <!-- Official Standardized Certificate Container -->
          <div class="printable-area" style="background:#ffffff; border:12px double #d4af37; padding:32px 36px; border-radius:10px; box-shadow:0 8px 30px rgba(0,0,0,0.08); text-align:center; position:relative;">
            ${renderOfficialCouncilHeader({
              studentCode: me.user.student_code || me.user.roll_no || c.student_code || 'PESC-26-00008',
              rollNo: me.user.roll_no || me.user.student_code || c.student_code || 'PESC-00008',
              refNo: c.cert_no || 'PESC-CERT-2026-0007',
              issueDate: date(c.issued_at) || '04-10-2026'
            })}

            <!-- Certificate Title Ribbon & Student Photo -->
            <div style="position:relative; margin:10px 0 16px;">
              <!-- Student Photo on Right -->
              <div style="position:absolute; right:10px; top:0; width:76px; height:92px; border:2px solid #0a2a5e; border-radius:4px; overflow:hidden; background:#f8fafc; box-shadow:0 2px 6px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center;">
                <div style="text-align:center; padding:4px;"><div style="font-size:1.6rem;">👤</div><span style="font-size:0.55rem; font-weight:700; color:#64748b; display:block; line-height:1;">Student Photo</span></div>
              </div>

              <!-- Centered Ribbon Title -->
              <div style="text-align:center; max-width:440px; margin:0 auto; padding-right:50px;">
                <div style="display:inline-block; background:linear-gradient(135deg, #065f46, #047857); color:#ffffff; font-size:1.55rem; font-weight:900; letter-spacing:3px; padding:6px 40px; border-radius:6px; box-shadow:0 3px 8px rgba(4,120,87,0.3); border:2px solid #d4af37;">
                  CERTIFICATE
                </div>
                <div style="font-size:0.75rem; font-weight:800; color:#064e3b; letter-spacing:1px; margin-top:4px;">
                  ANNUAL VOCATIONAL &amp; TECHNICAL EVALUATION
                </div>
              </div>
            </div>

            <!-- Official Certificate Body Text -->
            <div style="font-size:0.92rem; color:#000000; font-weight:700; line-height:2.2; text-align:center; margin:18px auto 14px; max-width:740px;">
              THIS IS TO CERTIFY THAT MR. / MRS. <span style="font-size:1.28rem; font-weight:900; color:#0a2a5e; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.name)}</span><br>
              S/O / D/O / W/O <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.father_name || 'N/A')}</span> &nbsp;&nbsp;&nbsp;&nbsp;
              MOTHERS NAME <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.mother_name || 'N/A')}</span> HAS SUCCESSFULLY CLEARED THE<br>
              ASSESSMENT IN THE JOB ROLE / COURSE <span style="font-size:1.2rem; font-weight:900; color:#064e3b; border-bottom:1.5px solid #64748b; padding:0 8px;">"${esc(c.course_name || 'Diploma in Computer Application')}"</span><br>
              <span style="font-size:1.05rem; font-weight:900; color:#047857; border-bottom:1.5px solid #64748b; padding:0 6px;">78.50 %</span> HELD IN <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">${esc(cAddress)}</span><br>
              WITH GRADE <span style="font-size:1.15rem; font-weight:900; color:#16a34a; border-bottom:1.5px solid #64748b; padding:0 8px;">A+</span> FROM OUR AUTHORIZED STUDY CENTRE<br>
              <div style="font-size:1.28rem; font-weight:900; color:#0a2a5e; margin:6px 0; letter-spacing:0.5px;">${esc(cName)} (${esc(cCode)})</div>
              HE / SHE HAS BEEN AWARDED WITH THE CERTIFICATE / DIPLOMA OF SAID JOB ROLE /<br>
              COURSE DURATION <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">1 Year</span>
              FROM <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">01-09-2025</span> TO <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">12-09-2026</span>
            </div>

            ${renderOfficialCouncilFooter({
              directorName: directorName,
              centreCode: cCode
            })}
          </div>
        </div>
      `;
    },

    'Fee & Admission Receipt': async () => {
      const data = await api('/api/student/fee-receipt');
      const r = data.receipt;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h2>Fee Voucher & Admission Receipt</h2>
              <p class="muted">Official institutional fee voucher issued by ${esc(r.centre_name)}</p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Fee Receipt</button>
          </div>
        </div>

        <div class="card" style="border:1px solid #cbd5e1; border-radius:12px; padding:24px; background:#fff; box-shadow:var(--shadow-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0a2a5e; padding-bottom:16px; margin-bottom:20px;">
            <div>
              <h3 style="margin:0; color:#0a2a5e; font-size:1.3rem;">PURVANCHAL EDUCATION & SKILL COUNCIL</h3>
              <p class="muted" style="margin:2px 0 0; font-size:0.85rem;">Affiliated Study Centre: <b>${esc(r.centre_name)} (${esc(r.centre_code)})</b></p>
              <p class="muted" style="margin:0; font-size:0.8rem;">Address: ${esc(r.centre_address)}</p>
            </div>
            <div style="text-align:right;">
              <span class="badge Valid" style="font-size:0.9rem;">FEE RECEIPT</span>
              <p style="margin:4px 0 0; font-family:monospace; font-size:0.95rem; font-weight:bold; color:#0a2a5e;">${esc(r.receipt_no)}</p>
              <p class="muted" style="margin:0; font-size:0.8rem;">Date: ${esc(r.date)}</p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; font-size:0.92rem; background:#f8fafc; padding:14px; border-radius:8px; border:1px solid #e2e8f0;">
            <div><b>Student Name:</b> ${esc(r.student_name)}</div>
            <div><b>Father's Name:</b> ${esc(r.father_name)}</div>
            <div><b>Enrollment Code:</b> <code style="font-weight:bold;">${esc(r.student_code)}</code></div>
            <div><b>Course Enrolled:</b> <b>${esc(r.course_code)}</b> - ${esc(r.course_name)}</div>
            <div><b>Payment Mode:</b> ${esc(r.payment_mode)}</div>
            <div><b>Transaction Reference:</b> <code style="font-size:0.85rem;">${esc(r.transaction_ref)}</code></div>
          </div>

          <div class="wrap" style="margin-bottom:20px;">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Fee Head Description</th>
                  <th style="text-align:right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                ${r.breakup.map((b, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><b>${esc(b.item)}</b></td>
                    <td style="text-align:right;">₹${b.amount.toLocaleString('en-IN')}.00</td>
                  </tr>
                `).join('')}
                <tr style="background:#f1f5f9; font-weight:bold; font-size:1.05rem;">
                  <td colspan="2" style="text-align:right;">TOTAL AMOUNT PAID:</td>
                  <td style="text-align:right; color:#16a34a;">₹${r.total_amount.toLocaleString('en-IN')}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; background:#f0fdf4; border:1px solid #bbf7d0; padding:12px 16px; border-radius:8px; margin-bottom:24px;">
            <div>
              <b style="color:#166534;">Payment Status: ${esc(r.payment_status)}</b>
              <p style="margin:2px 0 0; font-size:0.82rem; color:#475569;">Balance Outstanding: ₹${r.balance_due}.00 (NIL)</p>
            </div>
            <span class="badge Valid" style="font-size:1rem; padding:6px 16px;">PAID IN FULL</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:20px; font-size:0.85rem; color:#475569;">
            <div>
              <span>Terms: Fees once paid is subject to council academic regulations.</span>
            </div>
            <div style="text-align:center;">
              <div style="font-weight:bold; color:var(--navy); margin-bottom:4px;">${esc(r.incharge_name)}</div>
              <div style="border-bottom:1px solid #334155; width:160px; margin-bottom:4px;"></div>
              <span>Authorized Centre Signatory</span>
            </div>
          </div>
        </div>
      `;
    },

    'Digital ID Card': async () => {
      const data = await api('/api/student/id-card');
      const idc = data.id_card;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge active" style="font-size:0.8rem;">✓ OFFICIAL INSTITUTIONAL CREDENTIAL</span>
              <h2 style="margin:6px 0 2px;">Student Identity Card (छात्र पहचान पत्र)</h2>
              <p class="muted" style="margin:0;">Official student identity card issued by <b>${esc(idc.centre_name)}</b> under affiliation of PES Council</p>
            </div>
            <button onclick="window.print()" class="btn gold" style="font-weight:700;">🖨️ Print Student ID Card (Both Sides)</button>
          </div>
        </div>

        <!-- Dual Sided ID Card Display -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:24px; max-width:860px; margin:0 auto 30px;">
          
          <!-- SIDE 1: FRONT OF ID CARD -->
          <div>
            <div style="text-align:center; font-weight:700; color:#64748b; margin-bottom:8px; font-size:0.85rem;">SIDE 1: FRONT</div>
            <div style="background:#ffffff; border:2px solid #0a2a5e; border-radius:14px; overflow:hidden; box-shadow:0 12px 24px rgba(0,0,0,0.12); font-family:inherit;">
              
              <!-- Header with Centre Name -->
              <div style="background:linear-gradient(135deg, #0a2a5e 0%, #1e3a8a 100%); color:#ffffff; padding:12px 14px; text-align:center; border-bottom:3px solid #d4af37;">
                <div style="font-size:0.95rem; font-weight:800; letter-spacing:0.5px; text-transform:uppercase;">${esc(idc.centre_name)}</div>
                <div style="font-size:0.7rem; color:#fde047; font-weight:600; margin-top:2px;">AFFILIATED TO PURVANCHAL EDUCATION &amp; SKILL COUNCIL</div>
                <div style="background:#ffffff; color:#0a2a5e; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:999px; display:inline-block; margin-top:4px; letter-spacing:0.5px;">STUDENT IDENTITY CARD · 2026-27</div>
              </div>

              <!-- Body with Photo & Details -->
              <div style="padding:16px 14px; display:flex; gap:14px; align-items:center;">
                <!-- Student Photo Box -->
                <div style="text-align:center;">
                  <div style="width:84px; height:104px; background:#f1f5f9; border-radius:8px; border:2px solid #cbd5e1; display:flex; align-items:center; justify-content:center; font-size:2.6rem; position:relative; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
                    🎓
                    <div style="position:absolute; bottom:-6px; right:-6px; width:22px; height:22px; background:#16a34a; color:#fff; border-radius:50%; display:grid; place-items:center; font-size:0.75rem; font-weight:bold; border:2px solid #fff;">✓</div>
                  </div>
                  <span style="font-size:0.65rem; color:#64748b; font-weight:700; margin-top:4px; display:block;">Verified</span>
                </div>

                <!-- Info Grid -->
                <div style="font-size:0.82rem; line-height:1.5; flex:1;">
                  <div style="font-size:1.05rem; font-weight:800; color:#0a2a5e; margin-bottom:2px;">${esc(idc.name)}</div>
                  <div>Roll No: <b style="font-family:monospace; color:#064e3b; font-size:0.95rem;">${esc(idc.roll_no)}</b></div>
                  <div>Enrollment: <code style="font-family:monospace; font-size:0.8rem; color:#475569;">${esc(idc.student_code)}</code></div>
                  <div>Course: <b style="color:#0a2a5e;">${esc(idc.course_name)}</b></div>
                  <div>Father: ${esc(idc.father_name)}</div>
                  <div>DOB: ${esc(idc.dob)}</div>
                </div>
              </div>

              <!-- Footer with Sign & Validity -->
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding:8px 14px; display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:#475569;">
                <div>
                  <span style="color:#64748b;">Centre Code:</span> <b>${esc(idc.centre_code)}</b><br>
                  <span style="color:#64748b;">Valid Session:</span> <b>${esc(idc.session || '2026-27')}</b>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.68rem; color:#064e3b; font-weight:bold;">[Digitally Certified]</div>
                  <div style="font-weight:700; color:#0a2a5e;">Centre Director Sign</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SIDE 2: BACK OF ID CARD -->
          <div>
            <div style="text-align:center; font-weight:700; color:#64748b; margin-bottom:8px; font-size:0.85rem;">SIDE 2: BACK</div>
            <div style="background:#ffffff; border:2px solid #0a2a5e; border-radius:14px; overflow:hidden; box-shadow:0 12px 24px rgba(0,0,0,0.12); font-family:inherit; min-height:230px; display:flex; flex-direction:column; justify-content:space-between;">
              
              <!-- Back Header -->
              <div style="background:#f1f5f9; border-bottom:1px solid #cbd5e1; padding:8px 12px; text-align:center;">
                <span style="font-size:0.75rem; font-weight:800; color:#0a2a5e; letter-spacing:0.5px;">STUDY CENTRE DIRECTORY &amp; RULES</span>
              </div>

              <!-- Back Content -->
              <div style="padding:14px; font-size:0.75rem; color:#475569; line-height:1.5;">
                <div style="margin-bottom:8px;">
                  <b style="color:#0a2a5e;">Authorized Centre:</b><br>
                  ${esc(idc.centre_name)} (${esc(idc.centre_code)})
                </div>
                <div style="margin-bottom:8px;">
                  <b style="color:#0a2a5e;">Campus Address:</b><br>
                  ${esc(idc.centre_address)}
                </div>
                <div style="margin-bottom:8px;">
                  <b style="color:#0a2a5e;">Helpline / Contact:</b> ${esc(idc.centre_phone)}
                </div>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:6px 8px; margin-top:6px; font-size:0.7rem; color:#64748b;">
                  • This card is institutional property issued under accreditation of PESC.<br>
                  • Online digital verification: <b>pescouncil.in/verify</b>
                </div>
              </div>

              <!-- Back Footer Barcode -->
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding:8px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-family:monospace; font-size:1.1rem; letter-spacing:2px; color:#334155;">||| | |||| | ||| ||||| | |||</div>
                <span style="font-size:0.7rem; color:#15803d; font-weight:800;">✓ PESC VERIFIED</span>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    'Helpdesk & Support': async () => {
      const data = await api('/api/student/tickets');
      const tickets = data.tickets;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
          <h3>Raise a Query to Training Centre</h3>
          <p class="muted">Have questions about your classes, examinations, marksheets, or certificates? Submit a request here.</p>
          <form id="stf" style="margin-top:16px;">
            <div class="row">
              <div>
                <label>Category</label>
                <select name="category">
                  <option value="examination">Examination & Marksheet</option>
                  <option value="certificate">Certificate Inquiry</option>
                  <option value="course_content">Class / Study Material</option>
                  <option value="general">General Support</option>
                </select>
              </div>
              <div>
                <label>Subject</label>
                <input name="subject" required maxlength="150" placeholder="e.g. Inquiring about exam schedule">
              </div>
            </div>
            <label>Message / Details</label>
            <textarea name="body" rows="3" required maxlength="2000" placeholder="Type your query clearly…"></textarea>
            <br>
            <button class="btn" style="margin-top:10px;">Submit Query</button>
          </form>
        </div>

        <div class="card">
          <h3>Your Queries & Ticket History</h3>
          <div style="margin-top:12px;">
            ${table([
              ['Ticket No', (r) => `<b>${esc(r.ticket_no)}</b>`],
              ['Category', (r) => esc(r.category)],
              ['Subject', (r) => esc(r.subject)],
              ['Date', (r) => date(r.created_at)],
              ['Status', (r) => badge(r.status)],
            ], tickets, 'No queries submitted yet.')}
          </div>
        </div>
      `;

      $('#stf').onsubmit = (e) => {
        e.preventDefault();
        guard(async () => {
          const body = form(e.target);
          const res = await api('/api/student/tickets', { method: 'POST', body });
          toast(`Query submitted successfully! Reference: ${res.ticket_no}`);
          R['Helpdesk & Support']();
        });
      };
    },
  };

  tabs(tabsEl, Object.keys(R), (k) => R[k]());
});
