// Purvanchal Education & Skill Council (PESC)
// Authorized Franchise Centre ERP & Management Suite - 17 Modules Complete Implementation

const V = $('#view');
const pathMatch = location.pathname.match(/\/c\/([a-z0-9-]+)/i);
const urlParams = new URLSearchParams(location.search);
let currentSlug = (pathMatch && pathMatch[1]) || urlParams.get('slug') || urlParams.get('centre') || (typeof localStorage !== 'undefined' ? localStorage.getItem('pesc_active_centre_slug') : '') || '';

// Intercept /api/centre requests to pass active slug & header when established
const origFetch = window.fetch;
window.fetch = function(url, init = {}) {
  if (typeof url === 'string' && url.startsWith('/api/centre') && currentSlug) {
    init.headers = init.headers || {};
    if (init.headers instanceof Headers) {
      if (!init.headers.has('x-centre-slug')) init.headers.set('x-centre-slug', currentSlug);
    } else {
      init.headers['x-centre-slug'] = init.headers['x-centre-slug'] || currentSlug;
    }
    const sep = url.includes('?') ? '&' : '?';
    if (!url.includes('slug=') && !url.includes('centre=')) {
      url = url + sep + 'slug=' + encodeURIComponent(currentSlug);
    }
  }
  return origFetch(url, init);
};

let activeTab = 'MyStudents';
let currentCentre = null;
let allCentresList = [];

// Official PESC Council Header & Footer Builders matching User's Exact Specification
function renderOfficialCouncilHeader(opts = {}) {
  const studentCode = opts.studentCode || 'PESC-26-00008';
  const rollNo = opts.rollNo || studentCode;
  const refNo = opts.refNo || 'PESC-CERT-2026-0007';
  const issueDate = opts.issueDate || '04-10-2026';
  const uid = Math.random().toString(36).substring(2, 7);

  return `
    <!-- Top Hindi Title: Bada & Stylish Hindi Font -->
    <div style="text-align:center; margin-bottom:6px;">
      <div style="font-size:2.25rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Yatra One', 'Noto Serif Devanagari', 'Martel', serif; letter-spacing:1px; line-height:1.2; text-shadow:0 1px 2px rgba(10,42,94,0.12);">
        पूर्वांचल शिक्षा एवं कौशल परिषद
      </div>
    </div>

    <!-- Council Circular Seal + 4-Line Official Accreditation Block (Website link removed) -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px; margin:4px 0 8px;">
      <!-- Circular Council Seal SVG with intricate gold/emerald rings -->
      <div style="flex-shrink:0;">
        <svg width="86" height="86" viewBox="0 0 100 100" style="display:block;">
          <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#047857" stroke-width="3"/>
          <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#d4af37" stroke-width="1.6"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#072a60" stroke-width="0.7" stroke-dasharray="1.5,1.5"/>
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
          <rect x="22" y="76" width="56" height="15" rx="3" fill="#072a60" stroke="#d4af37" stroke-width="1"/>
          <text x="50" y="87" fill="#ffffff" font-size="9.5" font-weight="900" font-family="'Inter', Arial, sans-serif" text-anchor="middle" letter-spacing="2">PESC</text>
        </svg>
      </div>

      <!-- 4-Line Official Accreditation Block (Authentic National Registry) -->
      <div style="text-align:center;">
        <div style="font-size:1.24rem; font-weight:900; color:#047857; letter-spacing:0.5px; line-height:1.2; text-transform:uppercase;">
          PURVANCHAL EDUCATION AND SKILL COUNCIL
        </div>
        <div style="font-size:0.86rem; font-weight:900; color:#000000; letter-spacing:0.4px; text-transform:uppercase; margin-top:3px;">
          RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
        </div>
        <div style="font-size:0.72rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.2px;">
          REGISTERED UNDER INDIAN TRUST ACT &nbsp;||&nbsp; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
        </div>
        <div style="font-size:0.71rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.2px;">
          AN ISO 9001:2015 CERTIFIED COUNCIL &nbsp;||&nbsp; MSME REGISTERED ORGANISATION
        </div>
      </div>
    </div>

    <!-- Double Line Divider matching ======================================== -->
    <div style="border-top:3.5px double #072a60; margin:6px 0 8px; width:100%;"></div>

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
  const centreCode = opts.centreCode || 'PESC00001';
  const centreSlug = opts.centreSlug || (opts.centreCode ? opts.centreCode.toLowerCase() : 'main');
  const token = opts.token || '';

  const councilVerifyUrl = token ? `https://pescouncil.in/verify/${encodeURIComponent(token)}` : 'https://pescouncil.in/verify';
  const centreVerifyUrl = token ? `https://${centreSlug}.pescouncil.in/verify/${encodeURIComponent(token)}` : `https://${centreSlug}.pescouncil.in/verify`;

  return `
    <!-- 3-Tier Official Authority Signatures Row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:24px; padding:0 10px; text-align:center; gap:12px;">
      <!-- Left: Council Head Sign & Official Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:66px; height:66px; border:2px dashed #072a60; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#072a60; font-size:0.48rem; font-weight:900; background:rgba(7,42,96,0.04); transform:rotate(-4deg); box-shadow:inset 0 0 4px rgba(7,42,96,0.12);">
          <span style="font-size:0.42rem;">★ PURVANCHAL ★</span>
          <span style="font-size:0.56rem; font-weight:900; color:#072a60;">COUNCIL HEAD</span>
          <span style="font-size:0.46rem; color:#b45309;">OFFICIAL SEAL</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#072a60; margin:4px 0 1px; font-weight:700;">
          S. N. Mishra
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Council Head Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(अध्यक्ष / हेड साइन)</span>
        </span>
      </div>

      <!-- Center: Regional Coordinator Mohar & Sign -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:66px; height:66px; border:2px dashed #7e22ce; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#7e22ce; font-size:0.46rem; font-weight:900; background:rgba(126,34,206,0.04); transform:rotate(3deg); box-shadow:inset 0 0 4px rgba(126,34,206,0.12);">
          <span style="font-size:0.42rem;">★ REGIONAL ★</span>
          <span style="font-size:0.54rem; font-weight:900; color:#6b21a8;">COORDINATOR</span>
          <span style="font-size:0.44rem; color:#581c87;">MOHAR &amp; SEAL</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#6b21a8; margin:4px 0 1px; font-weight:700;">
          Er. V. K. Maurya
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Coordinator Sign &amp; Mohar<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(क्षेत्रीय समन्वयक मुहर)</span>
        </span>
      </div>

      <!-- Right: Authorized Centre Director Sign & Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:66px; height:66px; border:2px dashed #047857; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#047857; font-size:0.46rem; font-weight:900; background:rgba(4,120,87,0.04); transform:rotate(-3deg); box-shadow:inset 0 0 4px rgba(4,120,87,0.12);">
          <span style="font-size:0.42rem;">★ STUDY CENTRE ★</span>
          <span style="font-size:0.54rem; font-weight:900; color:#064e3b;">DIRECTOR SEAL</span>
          <span style="font-size:0.44rem; color:#047857;">(${esc(centreCode)})</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#064e3b; margin:4px 0 1px; font-weight:700;">
          ${esc(directorName)}
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Centre Director Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(संस्थान निदेशक साइन)</span>
        </span>
      </div>
    </div>

    <!-- Dual Portal Online Verification Box (Both Websites Displayed) -->
    <div style="margin-top:20px; background:linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%); border:1.8px solid #0284c7; border-radius:8px; padding:10px 14px; text-align:center;">
      <div style="font-size:0.82rem; font-weight:900; color:#0369a1; text-transform:uppercase; letter-spacing:0.5px;">
        🌐 DUAL-PORTAL ONLINE AUTHENTICITY VERIFICATION (द्वैध पोर्टल ऑनलाइन सत्यापन)
      </div>
      <div style="font-size:0.81rem; font-weight:700; color:#0f172a; margin-top:5px; display:flex; justify-content:center; gap:20px; flex-wrap:wrap;">
        <span>🏛️ <b>Council National Portal:</b> <a href="${councilVerifyUrl}" target="_blank" style="color:#072a60; font-weight:900; text-decoration:underline;">pescouncil.in/verify</a></span>
        <span>🏫 <b>Authorized Centre Portal:</b> <a href="${centreVerifyUrl}" target="_blank" style="color:#047857; font-weight:900; text-decoration:underline;">${centreSlug}.pescouncil.in/verify</a></span>
      </div>
      <div style="font-size:0.73rem; font-weight:700; color:#475569; margin-top:4px;">
        Scan the QR code at top-left or enter the registration/token on either portal to verify official council records.
      </div>
    </div>

    <!-- Official Helpline & Address Bar -->
    <div style="margin-top:16px; border-top:1.5px solid #072a60; padding-top:6px; text-align:center;">
      <div style="font-size:0.82rem; font-weight:900; color:#000000; letter-spacing:0.3px; margin-bottom:8px;">
        | Helpline: 7380435797 | Email: mauryachotu385@gmail.com | Head Office Shahgarh, Azamgarh UP 276001
      </div>

      <!-- Accreditation Badges Row -->
      <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; padding:2px 0;">
        <div style="border:1.5px solid #072a60; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.48rem; font-weight:900; color:#072a60; line-height:1.05;">
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
        <div style="border:1.5px solid #072a60; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.46rem; font-weight:900; color:#072a60; line-height:1;">
          <span>PURVANCHAL</span>
          <span style="font-size:0.52rem; color:#d4af37;">SHIKSHA</span>
          <span>PARISHAD</span>
        </div>
        <div style="border:1.5px solid #047857; border-radius:50%; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.5rem; font-weight:900; color:#047857; line-height:1;">
          <span>PESC</span>
          <span style="font-size:0.46rem; color:#072a60;">COUNCIL</span>
        </div>
      </div>
    </div>
  `;
}

// 17 Modules Definition matching User's Image exactly
const MODULES = [
  { id: 'MyStudents', num: '1', title: 'My Students / Dashboard', desc: 'Total Students, Fees, Pending dekhna, List search', icon: '👥' },
  { id: 'AddStudent', num: '2', title: 'Add Student', desc: 'Naya student add, Course dropdown, Fees, Photo upload', icon: '➕' },
  { id: 'MyCourses', num: '3', title: 'My Courses', desc: 'Apna Selling Price khud set karega, System Fees change nahi', icon: '📚' },
  { id: 'FeesCollection', num: '4', title: 'Fees Collection', desc: 'Kitna jama, kitna pending, Receipt, Payment link', icon: '💰' },
  { id: 'CertificatePrinting', num: '5', title: 'Certificate Printing', desc: '3 Option: Council Only / Institute Only / Both Dual', icon: '📜' },
  { id: 'MarksheetPrinting', num: '6', title: 'Marksheet Printing', desc: 'Single + Semester wise dono alag nikal sakta hai', icon: '📊' },
  { id: 'CertificateSemester', num: '7', title: 'Certificate Semester', desc: 'Ek hi Certificate pe saare Semester ka Grade', icon: '📋' },
  { id: 'MoharSignature', num: '8', title: 'Mohar + Signature Upload', desc: 'Apna Mohar/Seal aur Sign khud lagayega', icon: '🖋️' },
  { id: 'IDCardGenerate', num: '9', title: 'ID Card Generate', desc: 'Institute ya Council naam se ID Card nikalna', icon: '🪪' },
  { id: 'Attendance', num: '10', title: 'Attendance', desc: 'Student attendance, monthly report', icon: '📅' },
  { id: 'Assignments', num: '11', title: 'Assignments / Assessment', desc: 'Homework, Online Test, Marks dalna', icon: '📝' },
  { id: 'Reports', num: '12', title: 'Reports / Analytics', desc: 'Business, Course Sale, Profit Report', icon: '📈' },
  { id: 'Events', num: '13', title: 'Events / Announcement', desc: 'Notice, Chhutti ka message sabko', icon: '📢' },
  { id: 'Library', num: '14', title: 'Library / Study Material', desc: 'PDF Notes, Video upload', icon: '📖' },
  { id: 'Helpdesk', num: '15', title: 'Helpdesk / Messages', desc: 'Student doubt, complaint ka jawab', icon: '💬' },
  { id: 'Payments', num: '16', title: 'Payments / Wallet', desc: 'Council ko System Fees jama, Wallet balance', icon: '💳' },
  { id: 'Profile', num: '17', title: 'Profile / Settings', desc: 'Logo, Name, Address, portal website settings', icon: '⚙️' },
  { id: 'AffiliationCert', num: '18', title: 'Affiliation Certificate', desc: 'Council dwara jaree Kendra Manyata Praman Patra', icon: '🏆' },
];

// Render Left Sidebar Navigation (17 Items)
function renderSidebar() {
  const sidebarEl = $('#erpSidebarList');
  if (!sidebarEl) return;
  sidebarEl.innerHTML = MODULES.map(m => `
    <li class="c-nav-item">
      <a class="c-nav-link ${m.id === activeTab ? 'active' : ''}" data-mod="${m.id}">
        <div class="item-header">
          <span>${m.icon}</span>
          <b class="num">${m.num}.</b>
          <span>${esc(m.title)}</span>
        </div>
        <span class="desc">${esc(m.desc)}</span>
      </a>
    </li>
  `).join('');

  sidebarEl.onclick = (e) => {
    const link = e.target.closest('[data-mod]');
    if (!link) return;
    activeTab = link.dataset.mod;
    $$('.c-nav-link', sidebarEl).forEach(l => l.classList.toggle('active', l === link));
    switchModule(activeTab);
  };
}

// Module Views Implementation
const views = {
  // 1. My Students / Dashboard
  async MyStudents() {
    const [dash, sData] = await Promise.all([
      api('/api/centre/dashboard'),
      api('/api/centre/students')
    ]);
    const c = dash.centre || {};
    const students = sData.students || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; font-size:1.6rem; color:#064e3b;">1. My Students / Dashboard</h2>
          <p class="muted" style="margin:0;">Overview of active students, fees collected, pending balances, and certifications</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn gold" onclick="switchModule('AffiliationCert')" style="font-weight:700;">📜 View Affiliation Certificate</button>
          <button class="btn gold" onclick="switchModule('AddStudent')">➕ Add New Student Admission</button>
        </div>
      </div>

      <!-- Council Affiliation Banner -->
      <div style="background:linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border:2px solid #f59e0b; border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 8px rgba(245,158,11,0.15);">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="font-size:2.4rem;">🏆</div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#16a34a; color:#fff; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:999px;">✓ ACCREDITED &amp; VERIFIED</span>
              <b style="color:#78350f; font-size:1.1rem;">Official PES Council Affiliation Certificate</b>
            </div>
            <p style="margin:4px 0 0; font-size:0.88rem; color:#92400e;">Your institution is an accredited Authorized Training Centre (ATC Code: <b>${c.centre_code || 'PESC00001'}</b>) valid through 2029.</p>
          </div>
        </div>
        <button class="btn gold" onclick="switchModule('AffiliationCert')" style="font-weight:800; padding:8px 18px; box-shadow:0 2px 6px rgba(0,0,0,0.12);">📜 View &amp; Print Affiliation Certificate</button>
      </div>

      <!-- Dashboard KPI Summary Cards -->
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:24px;">
        <div class="stat" style="border-left: 4px solid #0284c7;">
          <span>Total Students</span>
          <b style="color:#0284c7;">${dash.students}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #16a34a;">
          <span>Fees Collected</span>
          <b style="color:#16a34a;">₹${(dash.fee_paid_rupees || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #ea580c;">
          <span>Fees Pending</span>
          <b style="color:#ea580c;">₹${(dash.fee_pending_rupees || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #047857;">
          <span>Courses Offered</span>
          <b style="color:#047857;">${dash.courses}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #ca8a04;">
          <span>Today Attendance</span>
          <b style="color:#ca8a04;">${dash.today_attendance_pct}%</b>
        </div>
        <div class="stat" style="border-left: 4px solid #064e3b;">
          <span>Council Wallet</span>
          <b style="color:#064e3b;">${inr(dash.wallet_paise)}</b>
        </div>
      </div>

      <!-- Students List Search & Quick Filter -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <h3 style="margin:0; font-size:1.15rem; color:#0f172a;">Student Roster &amp; Fee Status</h3>
          <div style="min-width:280px; flex:1; max-width:400px;">
            <input type="text" id="dashStudentSearch" placeholder="🔍 Search student name, roll code, mobile..." style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:0.9rem;">
          </div>
        </div>

        <div id="dashStudentTableWrap">
          ${renderStudentTable(students)}
        </div>
      </div>
    `;

    const searchInput = $('#dashStudentSearch');
    if (searchInput) {
      searchInput.oninput = (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = students.filter(s =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.student_code || '').toLowerCase().includes(q) ||
          (s.mobile || '').toLowerCase().includes(q) ||
          (s.course || '').toLowerCase().includes(q)
        );
        $('#dashStudentTableWrap').innerHTML = renderStudentTable(filtered);
      };
    }
  },

  // 2. Add Student (Exact Design Matching Image 1 from User)
  async AddStudent() {
    const cData = await api('/api/centre/courses');
    const courses = cData.courses || [];
    window._currentCourses = courses;

    const randomUserNum = Math.floor(100000000 + Math.random() * 900000000);
    const autoUsername = `In/Up/${randomUserNum}`;
    const autoPassword = String(Math.floor(100000000 + Math.random() * 900000000));
    const todayDate = new Date().toISOString().slice(0, 10);

    V.innerHTML = `
      <div style="max-width:920px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #cbd5e1; box-shadow:0 6px 20px rgba(0,0,0,0.06); font-family:'Inter', Arial, sans-serif;">
        
        <!-- Header Banner: Dark Blue (Exact Image 1) -->
        <div style="background:#001f5c; color:#ffffff; padding:14px 20px; text-align:center;">
          <h2 style="margin:0; font-size:1.4rem; font-weight:800; letter-spacing:0.3px;">Add Student Details</h2>
        </div>

        <!-- Help Links Sub-Header (Exact Image 1) -->
        <div style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:10px 20px; display:flex; justify-content:space-around; flex-wrap:wrap; gap:10px; font-size:0.86rem; color:#0284c7; font-weight:700;">
          <a href="#semester-guide" style="text-decoration:none; color:#0284c7; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; border:2px solid #0284c7; display:flex; align-items:center; justify-content:center;"><span style="width:6px; height:6px; border-radius:50%; background:#0284c7;"></span></span>
            Semester Section Mein Student Aur Subject Kaise Add Karein
          </a>
          <a href="#single-guide" style="text-decoration:none; color:#0284c7; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; border:2px solid #0284c7; display:flex; align-items:center; justify-content:center;"><span style="width:6px; height:6px; border-radius:50%; background:#0284c7;"></span></span>
            Single Certificate Section Mein Student Aur Subject Kaise Add Karein
          </a>
        </div>

        <form id="addStudentForm" style="padding:22px 28px;">
          
          <!-- SECTION 1: Personal Information (Light Blue Bar #e0f2fe - Exact Image 1) -->
          <div style="margin-bottom:24px;">
            <div style="background:#e0f2fe; color:#0369a1; padding:8px 16px; border-radius:4px; font-weight:800; font-size:0.95rem; margin-bottom:16px;">
              Personal Information
            </div>

            <!-- Row 1: Name * | Email -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Name *</label>
                <input name="name" required placeholder="Student Full Name" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Email</label>
                <input name="email" type="email" placeholder="student@example.com" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 2: Photo (max 500kb) Choose File + Preview (Exact Image 1) -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px; align-items:center;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Photo<br><span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(max 500kb)</span></label>
                <input type="file" id="studentPhotoFileInput" accept="image/*" style="font-size:0.85rem;">
                <input type="hidden" name="photo_url" id="studentPhotoBase64">
              </div>
              <div>
                <div id="studentPhotoPreviewBox" style="width:90px; height:90px; border:1px solid #cbd5e1; border-radius:4px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;">
                  <span style="font-size:0.75rem; color:#94a3b8;">[ Photo ]</span>
                </div>
              </div>
            </div>

            <!-- Row 3: Gender * | Student Whatsapp Number -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Gender *</label>
                <select name="gender" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Student Whatsapp Number</label>
                <input name="student_whatsapp" pattern="[6-9][0-9]{9}" placeholder="10-digit Whatsapp Number" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 4: Parent Whatsapp Number | Date Of Birth * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Parent Whatsapp Number</label>
                <input name="parent_whatsapp" placeholder="Parent / Guardian Whatsapp" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Date Of Birth *</label>
                <input name="dob" type="date" required value="2005-01-15" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 5: Marital Status -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Marital Status</label>
                <select name="marital_status" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="No">No / Unmarried</option>
                  <option value="Yes">Yes / Married</option>
                </select>
              </div>
              <div></div>
            </div>

            <!-- Row 6: Father/Husband Name * (with Prefix S/o, D/o, W/o) | Mother Name * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Father/Husband Name *</label>
                <div style="display:flex; gap:6px;">
                  <select name="relation_prefix" style="width:80px; padding:9px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                    <option value="S/o">S/o</option>
                    <option value="D/o">D/o</option>
                    <option value="W/o">W/o</option>
                  </select>
                  <input name="father_name" required placeholder="Father/Husband Name" style="flex:1; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Mother Name *</label>
                <input name="mother_name" required placeholder="Mother Name" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 7: Local Address * | Pin * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Local Address *</label>
                <input name="local_address" required placeholder="Local Residential Address" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Pin *</label>
                <input name="pin" required placeholder="e.g. 221001" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 8: Username * (Auto) | Password (Auto) (Exact Image 1) -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:8px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Username *</label>
                <input name="username" id="autoStuUsername" value="${esc(autoUsername)}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.95rem; font-weight:700; color:#0f172a; background:#f8fafc;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Password</label>
                <input name="password" id="autoStuPassword" value="${esc(autoPassword)}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.95rem; font-weight:700; color:#0f172a; background:#f8fafc;">
              </div>
            </div>
          </div>

          <!-- SECTION 2: Course Details (Light Lavender Bar #e0e7ff - Exact Image 1) -->
          <div style="margin-bottom:24px;">
            <div style="background:#e0e7ff; color:#3730a3; padding:8px 16px; border-radius:4px; font-weight:800; font-size:0.95rem; margin-bottom:16px;">
              Course Details
            </div>

            <!-- Row 1: Course Type * (Single / Semester/Year) | Course To Be Join * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:8px;">
                  Course Type * <span style="font-size:0.75rem; color:#dc2626; font-weight:normal;">(fill carefully not editable)</span>
                </label>
                <div style="display:flex; gap:20px; align-items:center; padding-top:4px;">
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.92rem; font-weight:600;">
                    <input type="radio" name="course_type" value="Single" checked> Single
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.92rem; font-weight:600;">
                    <input type="radio" name="course_type" value="Semester/Year"> Semester/Year
                  </label>
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Course To Be Join *</label>
                <select name="course_id" id="addStudentCourseSelect" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="">Select Course</option>
                  ${courses.map(co => `<option value="${co.id}" data-duration="${co.duration_months || 12}" data-fee="${co.selling_price_paise ? Math.round(co.selling_price_paise/100) : (co.fee_rupees || 12000)}">${esc(co.code)} - ${esc(co.name)}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Row 2: Joining Date -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Joining Date</label>
                <input name="joining_date" type="date" value="${todayDate}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div></div>
            </div>

            <!-- Row 3: Course Duration * (Months) | Study Mode * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Course Duration *</label>
                <div style="display:flex; border:1px solid #cbd5e1; border-radius:4px; overflow:hidden;">
                  <input name="duration_months" id="addCourseDurationInput" type="number" value="12" style="flex:1; border:none; padding:9px 12px; font-size:0.92rem;">
                  <span style="background:#f1f5f9; padding:9px 14px; font-size:0.86rem; color:#475569; font-weight:700; border-left:1px solid #cbd5e1;">Months</span>
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Study Mode *</label>
                <select name="study_mode" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="Regular">Regular</option>
                  <option value="Distance">Distance</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <!-- Row 4: Registration Charge * -->
            <div style="margin-bottom:20px;">
              <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Registration Charge *</label>
              <input name="registration_charge" value="35 Rs Registration Fee + Ebook + Advance Certificate Fee" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#f8fafc;">
            </div>
          </div>

          <!-- Bottom Action: Create Student (Purple Button - Exact Image 1) -->
          <div style="text-align:center; margin-top:28px;">
            <button type="submit" id="btnCreateStudent" style="background:#4f46e5; hover:background:#4338ca; color:#ffffff; font-weight:700; font-size:1.05rem; padding:12px 42px; border:none; border-radius:6px; cursor:pointer; box-shadow:0 4px 14px rgba(79,70,229,0.35);">
              Create Student
            </button>
          </div>
        </form>

        <div id="addStudentResult" style="padding:0 28px 24px;"></div>
      </div>
    `;

    // Photo file preview handler
    $('#studentPhotoFileInput').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 500 * 1024) {
          toast('Warning: File size exceeds 500kb. Please select an image under 500kb.');
        }
        const reader = new FileReader();
        reader.onload = (re) => {
          $('#studentPhotoBase64').value = re.target.result;
          $('#studentPhotoPreviewBox').innerHTML = `<img src="${re.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    };

    // Auto fill duration when course changes
    $('#addStudentCourseSelect').onchange = (e) => {
      const opt = e.target.selectedOptions[0];
      if (opt && opt.dataset.duration) {
        $('#addCourseDurationInput').value = opt.dataset.duration;
      }
    };

    // Form submit handler
    $('#addStudentForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        payload.course_id = +payload.course_id;
        payload.duration_months = +payload.duration_months || 12;

        const res = await api('/api/centre/students', { method: 'POST', body: payload });
        const stu = res.student || { name: payload.name, student_code: res.student_code, roll_no: res.roll_no };

        $('#addStudentResult').innerHTML = `
          <div style="background:#ecfdf5; border:1.5px solid #6ee7b7; border-radius:8px; padding:20px; margin-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
              <div>
                <h3 style="color:#065f46; margin:0 0 4px; font-size:1.25rem;">✅ Student Created Successfully!</h3>
                <p style="margin:0; font-size:0.9rem; color:#047857;">Admission registered and student credentials generated.</p>
              </div>
              <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700; padding:8px 18px;" onclick="showAdmissionFormModal(${res.student ? res.student.id : 'null'})">
                📄 View &amp; Print Admission Form (Image 2)
              </button>
            </div>
            
            <div style="background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; padding:14px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:0.9rem;">
              <div><span class="muted">Student Code:</span><br><b style="font-family:monospace; color:#0f172a;">${esc(res.student_code)}</b></div>
              <div><span class="muted">Roll Number:</span><br><b style="font-family:monospace; color:#0284c7;">${esc(res.roll_no)}</b></div>
              <div><span class="muted">Portal Username:</span><br><b style="font-family:monospace; color:#065f46;">${esc(res.username || payload.username)}</b></div>
              <div><span class="muted">Portal Password:</span><br><b style="font-family:monospace; color:#dc2626;">${esc(res.initial_password || payload.password)}</b></div>
            </div>
          </div>
        `;
        toast('Student created successfully!');
      });
    };
  },

  // 3. My Courses & Fee Management
  async MyCourses() {
    const data = await api('/api/centre/courses');
    const courses = data.courses || [];
    window._currentCourses = courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">3. My Courses &amp; Fee Management (पाठ्यक्रम एवं फीस प्रबंधन)</h2>
        <p class="muted" style="margin:0;">हेड ऑफिस द्वारा अधिकृत कोर्सेज की सूची, विषय एवं अपने सेंटर के छात्रों हेतु फीस निर्धारण</p>
      </div>

      <!-- Lock Notice Alert -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-left:5px solid #2563eb; border-radius:10px; padding:14px 18px; margin-bottom:22px; display:flex; align-items:flex-start; gap:14px; box-shadow:0 2px 6px rgba(37,99,235,0.06);">
        <span style="font-size:1.8rem; line-height:1;">🔒</span>
        <div style="flex:1;">
          <b style="color:#1e40af; font-size:0.96rem; display:block; margin-bottom:3px;">हेड ऑफिस अधिकृत पाठ्यक्रम (Head Office Authorized Courses)</b>
          <p style="margin:0; font-size:0.85rem; color:#1e3a8a; line-height:1.5;">
            कोर्स का नाम, कोड, अवधि, विषय (Subjects) एवं काउंसिल शुल्क सीधे <b>हेड ऑफिस</b> द्वारा निर्धारित व सुरक्षित हैं। सेंटर संचालक इनमें कोई फेरबदल नहीं कर सकते। आप केवल अपने विद्यार्थियों के लिए अपनी <b>इंस्टीट्यूट फीस (Institute Student Fee)</b> को कस्टमाइज कर सकते हैं।
          </p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:20px;">
        ${courses.map(co => {
          const sysFee = Math.round((co.system_fee_paise || 50000) / 100);
          const sellFee = co.fee_rupees || Math.round((co.selling_price_paise || 800000) / 100);
          const margin = sellFee - sysFee;
          let subjects = [];
          try {
            subjects = typeof co.subjects === 'string' ? JSON.parse(co.subjects) : (co.subjects || []);
          } catch(e) { subjects = []; }

          return `
            <div class="card" style="border-top: 4px solid var(--c-green-emerald); padding:22px; background:#fff; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 14px rgba(0,0,0,0.06); border-radius:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;">
                  <span class="badge active" style="font-family:monospace; font-weight:800; font-size:0.92rem;">${esc(co.code)}</span>
                  <div style="display:flex; gap:6px;">
                    <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">⏱️ ${co.duration_months} Months</span>
                    <span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">🎯 Marks: ${co.total_marks || 500}</span>
                  </div>
                </div>

                <h3 style="margin:0 0 10px; font-size:1.25rem; color:#0f172a; line-height:1.35; font-weight:800;">${esc(co.name)}</h3>

                ${co.description ? `<p style="font-size:0.82rem; color:#64748b; margin:0 0 12px; line-height:1.4;">${esc(co.description)}</p>` : ''}

                <!-- Course Subjects Section -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; margin-bottom:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.8rem; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:0.5px;">📚 Course Subjects (विषय - ${subjects.length}):</span>
                    <button class="btn sm alt" onclick="showCentreCourseSubjects(${co.id})" style="font-size:0.72rem; padding:2px 8px; font-weight:700;">View Syllabus</button>
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${subjects.length > 0
                      ? subjects.slice(0, 3).map(s => `<span style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:0.74rem; color:#334155; font-weight:600;">📖 ${esc(s.name || s)}</span>`).join('') + (subjects.length > 3 ? `<span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.72rem; color:#64748b; font-weight:700;">+${subjects.length - 3} more</span>` : '')
                      : `<span style="font-size:0.75rem; color:#94a3b8; font-style:italic;">Standard Council Syllabus Included</span>`
                    }
                  </div>
                </div>

                <!-- Fees Breakdown -->
                <div style="background:#fafafa; border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin-bottom:14px; font-size:0.86rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span class="muted" style="display:flex; align-items:center; gap:4px;">🔒 Council Base Fee:</span>
                    <b style="color:#0f172a;">₹${sysFee.toLocaleString('en-IN')}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.82rem; background:#f0fdf4; padding:3px 8px; border-radius:5px;">
                    <span style="color:#166534; font-weight:700;">📜 Single/Yearly Marksheet &amp; Cert:</span>
                    <b style="color:#166534;">₹${co.single_fee_rupees || Math.round((co.single_fee_paise || 20000)/100)}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.82rem; background:#eff6ff; padding:3px 8px; border-radius:5px;">
                    <span style="color:#1e40af; font-weight:700;">📚 Semester Marksheet &amp; Cert:</span>
                    <b style="color:#1e40af;">₹${co.semester_fee_rupees || Math.round((co.semester_fee_paise || 60000)/100)}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-top:1px dashed #e2e8f0; padding-top:6px;">
                    <span class="muted">Your Centre Net Margin:</span>
                    <b style="color:#16a34a; font-weight:800;">₹${margin.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                <!-- Editable Student Fee -->
                <div style="margin-bottom:6px;">
                  <label style="font-size:0.82rem; font-weight:800; display:block; margin-bottom:4px; color:#0f172a;">
                    Institute Student Fee (विद्यार्थी फीस - ₹):
                    <span style="font-size:0.75rem; font-weight:normal; color:#64748b;">(छात्र से ली जाने वाली आपकी फीस)</span>
                  </label>
                  <div style="display:flex; gap:8px;">
                    <input type="number" id="priceInput_${co.id}" value="${sellFee}" style="padding:8px 12px; font-weight:800; width:100%; border:1.5px solid #059669; border-radius:6px; font-size:1.05rem; color:#064e3b; background:#f0fdf4;">
                    <button class="btn sm gold" onclick="saveCoursePrice(${co.id})" style="white-space:nowrap; font-weight:800; padding:8px 14px;">💾 Save Fee</button>
                  </div>
                </div>
              </div>

              <div style="border-top:1px solid #f1f5f9; padding-top:10px; margin-top:12px; font-size:0.75rem; color:#64748b; text-align:center;">
                ✅ Head Office Certified Curriculum · Editable Centre Margin
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Course Subjects Modal -->
      <div id="centreCourseSubjectsModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); z-index:9999; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#fff; border-radius:14px; max-width:560px; width:100%; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #cbd5e1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
            <h3 id="centreCourseSubjectsTitle" style="margin:0; color:#064e3b; font-size:1.25rem;">📚 Course Syllabus &amp; Subjects</h3>
            <button type="button" onclick="$('#centreCourseSubjectsModal').style.display='none'" style="background:none; border:none; font-size:1.6rem; cursor:pointer; color:#64748b;">&times;</button>
          </div>
          <div id="centreCourseSubjectsContent" style="max-height:380px; overflow-y:auto; padding-right:4px;">
            <!-- Loaded dynamically -->
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:18px; border-top:1px solid #e2e8f0; padding-top:12px;">
            <button class="btn gold sm" onclick="$('#centreCourseSubjectsModal').style.display='none'" style="font-weight:700;">Close</button>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Fees Collection
  async FeesCollection() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    let totalBilled = 0, totalPaid = 0;
    students.forEach(s => {
      totalBilled += (s.fee_total || 12000);
      totalPaid += (s.fee_paid || 0);
    });
    const totalPending = Math.max(0, totalBilled - totalPaid);

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">4. Fees Collection &amp; Receipts</h2>
          <p class="muted" style="margin:0;">Kitna jama, kitna pending, printable receipts aur UPI payment links</p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:22px;">
        <div class="stat" style="border-left:4px solid #0284c7;">
          <span>Total Fees Billed</span>
          <b>₹${totalBilled.toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #16a34a;">
          <span>Fees Deposited (Jama)</span>
          <b style="color:#16a34a;">₹${totalPaid.toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #ea580c;">
          <span>Pending Fees (Baki)</span>
          <b style="color:#ea580c;">₹${totalPending.toLocaleString('en-IN')}</b>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px;">
        <h3>Student Fee Ledgers</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Roll Code</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Total Fee</th>
                <th>Fee Paid (Jama)</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const total = s.fee_total || 12000;
                const paid = s.fee_paid || 0;
                const pend = Math.max(0, total - paid);
                const isPaid = pend === 0;
                return `
                  <tr>
                    <td><b style="font-family:monospace;">${esc(s.student_code)}</b></td>
                    <td><b>${esc(s.name)}</b></td>
                    <td>${esc(s.course)}</td>
                    <td>₹${total.toLocaleString('en-IN')}</td>
                    <td style="color:#16a34a; font-weight:700;">₹${paid.toLocaleString('en-IN')}</td>
                    <td style="color:${pend > 0 ? '#dc2626' : '#16a34a'}; font-weight:700;">₹${pend.toLocaleString('en-IN')}</td>
                    <td><span class="badge ${isPaid ? 'Valid' : 'Pending'}">${isPaid ? 'Fully Paid' : 'Pending'}</span></td>
                    <td>
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn sm gold" onclick="openDepositModal(${s.id}, '${esc(s.name)}', ${pend})">➕ Deposit</button>
                        <button class="btn sm" style="background:#0284c7; color:#fff;" onclick="printReceipt(${s.id})">🧾 Receipt</button>
                        <button class="btn sm alt" onclick="showPaymentLink('${esc(s.name)}', ${pend})">💳 Pay Link</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 5. Certificate Printing (3 Options: Council Only / Institute Only / Both Dual)
  async CertificatePrinting() {
    const [sData, cData] = await Promise.all([
      api('/api/centre/students'),
      api('/api/centre/courses').catch(() => ({ courses: [] }))
    ]);
    const students = sData.students || [];
    if (cData && cData.courses) window._currentCourses = cData.courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">5. Certificate Printing (वार्षिक एवं सेमेस्टर प्रमाणपत्र प्रिंट)</h2>
        <p class="muted" style="margin:0;">वार्षिक (Yearly/Annual) अथवा सेमेस्टर (Semester-Wise) आधारित अधिकृत प्रमाणपत्र प्रिंट करें</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; margin-bottom:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <!-- Select Enrolled Candidate -->
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Enrolled Candidate (छात्र चुनें):</label>
            <select id="certStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <!-- Evaluation Pattern (Yearly vs Semester) -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Evaluation Pattern (प्रणाली):</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnCertEvalYearly" onclick="setCertEvalPattern('yearly')">📅 Yearly / Annual (वार्षिक)</button>
              <button type="button" class="btn alt sm" id="btnCertEvalSemester" onclick="setCertEvalPattern('semester')">📚 Semester-Wise (सेमेस्टर)</button>
            </div>
          </div>

          <!-- Term Select -->
          <div id="certTermWrap" style="min-width:180px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination (परीक्षा सत्र):</label>
            <select id="certTermSelect" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; color:#064e3b;" onchange="updateCertPreview()">
              <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
              <option value="1st Year">1st Year (प्रथम वर्ष)</option>
              <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
              <option value="Final Year">Final Year (अंतिम वर्ष)</option>
            </select>
          </div>

          <!-- Layout Option -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Design Format:</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnFmtCouncil" onclick="setCertFormat('council')">Council Only</button>
              <button type="button" class="btn alt sm" id="btnFmtInstitute" onclick="setCertFormat('institute')">Institute Only</button>
              <button type="button" class="btn alt sm" id="btnFmtDual" onclick="setCertFormat('dual')">Both Dual</button>
            </div>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#064e3b; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print Certificate</button>
          </div>
        </div>

        <!-- Prescribed Council Fee Notice for Single vs Semester -->
        <div id="certFeeNotice" style="margin-bottom:16px;"></div>

        <!-- High-Res Printable Certificate Frame -->
        <div id="certPreviewContainer" class="printable-area" style="background:#ffffff; border:12px double #d4af37; padding:40px; border-radius:10px; max-width:880px; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.08); text-align:center; position:relative;">
          <!-- Dynamically filled by updateCertPreview() -->
        </div>
      </div>
    `;

    $('#certStudentSelect').onchange = updateCertPreview;
    updateCertPreview();
  },

  // 6. Marksheet Printing (Yearly + Semester-Wise)
  async MarksheetPrinting() {
    const [sData, cData] = await Promise.all([
      api('/api/centre/students'),
      api('/api/centre/courses').catch(() => ({ courses: [] }))
    ]);
    const students = sData.students || [];
    if (cData && cData.courses) window._currentCourses = cData.courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">6. Marksheet Printing (वार्षिक एवं सेमेस्टर अंकतालिका प्रिंट)</h2>
        <p class="muted" style="margin:0;">वार्षिक परीक्षा (Yearly Statement) अथवा विस्तृत सेमेस्टर परीक्षा (Semester-Wise Statement) अंकतालिका प्रिंट करें</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <!-- Select Candidate -->
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Candidate (छात्र चुनें):</label>
            <select id="mrkStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <!-- Marksheet Pattern: Yearly vs Semester -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Evaluation Type (परीक्षा प्रकार):</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnMrkEvalYearly" onclick="setMrkEvalPattern('yearly')">📅 Yearly / Annual (वार्षिक आधारित)</button>
              <button type="button" class="btn alt sm" id="btnMrkEvalSemester" onclick="setMrkEvalPattern('semester')">📚 Semester-Wise (सेमेस्टर आधारित)</button>
            </div>
          </div>

          <!-- Term Select -->
          <div id="mrkTermWrap" style="min-width:200px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination (परीक्षा सत्र):</label>
            <select id="mrkTermSelect" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; color:#064e3b;" onchange="updateMrkPreview()">
              <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
              <option value="1st Year">1st Year (प्रथम वर्ष)</option>
              <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
              <option value="Final Year">Final Year (अंतिम वर्ष)</option>
            </select>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#064e3b; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print Marksheet</button>
          </div>
        </div>

        <!-- Prescribed Council Fee Notice for Single vs Semester -->
        <div id="mrkFeeNotice" style="margin-bottom:16px;"></div>

        <div id="mrkPreviewContainer" class="printable-area" style="background:#ffffff; border:2px solid #0f172a; padding:30px; border-radius:8px; max-width:850px; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
          <!-- Filled by updateMrkPreview() -->
        </div>
      </div>
    `;

    $('#mrkStudentSelect').onchange = updateMrkPreview;
    updateMrkPreview();
  },

  // 7. Certificate Semester (Ek hi Certificate pe saare Semester ka Grade)
  async CertificateSemester() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">7. Certificate Semester-Graded</h2>
        <p class="muted" style="margin:0;">Ek hi Certificate pe saare Semester ka Grade display &amp; print</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
          <div style="flex:1; max-width:360px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Choose Student:</label>
            <select id="semCertStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}">${esc(s.name)} (${esc(s.student_code)})</option>`).join('')}
            </select>
          </div>
          <button class="btn gold" onclick="window.print()">🖨️ Print Semester Certificate</button>
        </div>

        <div id="semCertPreview" class="printable-area" style="background:#ffffff; border:10px double #047857; padding:40px; border-radius:12px; max-width:880px; margin:0 auto; text-align:center;">
          <!-- Dynamically rendered -->
        </div>
      </div>
    `;

    $('#semCertStudentSelect').onchange = updateSemCertPreview;
    updateSemCertPreview();
  },

  // 8. Mohar + Signature Upload (Apna Mohar/Seal aur Sign khud lagayega)
  async MoharSignature() {
    const sData = await api('/api/centre/settings');
    const c = sData.centre || {};

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">8. Mohar + Signature Upload</h2>
        <p class="muted" style="margin:0;">Apna Mohar/Seal aur Director Sign khud lagayein – certificates aur marksheets par stamp hoga</p>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap:24px;">
        <!-- Stamp / Mohar Box -->
        <div class="card" style="background:#fff; padding:24px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#0f172a;">🏢 Institute Stamp / Mohar</h3>
          <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Round rubber stamp image (PNG with transparent background)</p>

          <div style="width:140px; height:140px; border:2px dashed #cbd5e1; border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;" id="moharPreviewBox">
            <span style="font-size:3rem; color:#94a3b8;">🔴</span>
          </div>

          <label class="btn sm alt" style="cursor:pointer; display:inline-block; margin-bottom:10px;">
            📁 Select Seal File
            <input type="file" id="sealFileInput" accept="image/*" style="display:none;">
          </label>
          <div style="font-size:0.78rem; color:#64748b;">Or paste seal image URL:</div>
          <input id="sealUrlInput" placeholder="https://..." value="${esc(c.seal_url || '')}" style="width:100%; padding:8px 10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
        </div>

        <!-- Director Signature Box -->
        <div class="card" style="background:#fff; padding:24px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#0f172a;">✒️ Director Authorized Signature</h3>
          <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Official director digital signature image</p>

          <div style="width:200px; height:100px; border:2px dashed #cbd5e1; border-radius:8px; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;" id="signPreviewBox">
            <span style="font-size:2rem; color:#94a3b8;">✍️</span>
          </div>

          <label class="btn sm alt" style="cursor:pointer; display:inline-block; margin-bottom:10px;">
            📁 Select Signature File
            <input type="file" id="signFileInput" accept="image/*" style="display:none;">
          </label>
          <div style="font-size:0.78rem; color:#64748b;">Or paste signature image URL:</div>
          <input id="signUrlInput" placeholder="https://..." value="${esc(c.signature_url || '')}" style="width:100%; padding:8px 10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
        </div>
      </div>

      <div style="margin-top:24px; text-align:center;">
        <button class="btn gold" style="padding:12px 32px; font-weight:700; font-size:1rem;" onclick="saveMoharSign()">
          💾 Save Stamp &amp; Signature to Profile
        </button>
      </div>
    `;

    setupImageUpload('sealFileInput', 'sealUrlInput', 'moharPreviewBox', '🔴');
    setupImageUpload('signFileInput', 'signUrlInput', 'signPreviewBox', '✍️');
  },

  // 9. ID Card Generate (Institute ya Council naam se ID Card nikalna)
  async IDCardGenerate() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">9. ID Card Generator</h2>
        <p class="muted" style="margin:0;">Institute ya Council ke naam se digital student PVC ID card generate aur print karein</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
          <div style="flex:1; max-width:320px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Student:</label>
            <select id="idCardStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}" data-father="${esc(s.father_name || 'Father')}" data-mobile="${esc(s.mobile || '')}">${esc(s.name)} (${esc(s.student_code)})</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Header Style:</label>
            <div style="display:flex; gap:8px;">
              <button class="btn gold sm active" id="btnIdCouncil" onclick="setIdCardStyle('council')">Council Accredited</button>
              <button class="btn alt sm" id="btnIdInst" onclick="setIdCardStyle('institute')">Institute Official</button>
            </div>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#0284c7; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print PVC ID Card</button>
          </div>
        </div>

        <div id="idCardPreview" class="printable-area" style="max-width:440px; margin:20px auto; box-shadow:0 10px 25px rgba(0,0,0,0.15); border-radius:12px; overflow:hidden;">
          <!-- Dynamically filled -->
        </div>
      </div>
    `;

    $('#idCardStudentSelect').onchange = updateIdCardPreview;
    updateIdCardPreview();
  },

  // 10. Attendance (Student attendance, monthly report)
  async Attendance() {
    const today = new Date().toISOString().slice(0, 10);
    const data = await api('/api/centre/attendance?date=' + today);
    const students = data.students || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">10. Daily Attendance &amp; Monthly Report</h2>
          <p class="muted" style="margin:0;">Mark daily attendance, calculate monthly attendance percentages, and generate reports</p>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="date" id="attDateInput" value="${today}" style="padding:8px 12px; border:1px solid #cbd5e1; border-radius:8px; font-weight:700;">
          <button class="btn alt sm" onclick="markAllPresent()">⚡ Mark All Present</button>
          <button class="btn gold sm" onclick="saveAttendance()">💾 Save Attendance</button>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; margin-bottom:24px;">
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Roll Code</th>
                <th>Candidate Name</th>
                <th>Course</th>
                <th>Status (Today)</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => `
                <tr id="attRow_${s.id}">
                  <td><b style="font-family:monospace;">${esc(s.student_code)}</b></td>
                  <td><b>${esc(s.name)}</b></td>
                  <td>${esc(s.course)}</td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn sm ${s.attendance_status === 'Present' ? 'gold' : 'alt'}" data-st="Present" onclick="setRowAtt(${s.id}, 'Present')">🟢 Present</button>
                      <button class="btn sm ${s.attendance_status === 'Absent' ? 'gold' : 'alt'}" data-st="Absent" onclick="setRowAtt(${s.id}, 'Absent')">🔴 Absent</button>
                      <button class="btn sm ${s.attendance_status === 'Leave' ? 'gold' : 'alt'}" data-st="Leave" onclick="setRowAtt(${s.id}, 'Leave')">🟡 Leave</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px;">
        <h3 style="margin:0 0 12px; color:#0f172a;">Monthly Summary (Current Session)</h3>
        <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Average classroom attendance: <b>93.4%</b> across all active batches.</p>
        <button class="btn sm alt" onclick="loadMonthlyAtt()">📊 View Monthly Student Percentage Breakdown</button>
        <div id="monthlyAttBox" style="margin-top:14px;"></div>
      </div>
    `;
  },

  // 11. Assignments / Assessment (Homework, Online Test, Marks dalna)
  async Assignments() {
    const data = await api('/api/centre/assignments');
    const assignments = data.assignments || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">11. Assignments &amp; Assessment</h2>
          <p class="muted" style="margin:0;">Homework assign karein, online test organize karein, aur assessment marks darj karein</p>
        </div>
        <button class="btn gold" onclick="openCreateAssignmentModal()">➕ Create New Assignment / Test</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${assignments.length ? assignments.map(a => `
          <div class="card" style="background:#fff; border-top:4px solid #0284c7; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge active">${esc(a.course_name || 'All Courses')}</span>
              <span class="muted" style="font-size:0.8rem;">Max: <b>${a.max_marks} Marks</b></span>
            </div>
            <h3 style="margin:0 0 8px; font-size:1.15rem; color:#0f172a;">${esc(a.title)}</h3>
            <p class="muted" style="font-size:0.85rem; margin-bottom:14px; line-height:1.5;">${esc(a.instructions || 'Practical lab task & viva test.')}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.8rem; color:#64748b;">Due: ${esc(a.due_date || 'Ongoing')}</span>
              <button class="btn sm gold" onclick="openGradeModal('${esc(a.title)}')">📝 Enter Marks</button>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No assignments created yet. Click above to create the first practical test.</p>
          </div>
        `}
      </div>
    `;
  },

  // 12. Reports / Analytics (Business, Course Sale, Profit Report)
  async Reports() {
    const data = await api('/api/centre/analytics');
    const sum = data.summary || {};
    const courses = data.courses || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">12. Business &amp; Profit Analytics Report</h2>
          <p class="muted" style="margin:0;">Centre revenue, course sales volume, council system fee costs, and net institute profit</p>
        </div>
        <button class="btn gold" onclick="window.print()">🖨️ Export Profit Report</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:24px;">
        <div class="stat" style="border-left:4px solid #0284c7;">
          <span>Gross Course Revenue</span>
          <b style="color:#0284c7;">₹${(sum.gross_revenue || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #16a34a;">
          <span>Fees Collected (Cash/Bank)</span>
          <b style="color:#16a34a;">₹${(sum.fees_collected || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #64748b;">
          <span>Council System Cost</span>
          <b>₹${(sum.council_costs || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #064e3b;">
          <span>Net Centre Profit</span>
          <b style="color:#064e3b; font-size:1.8rem;">₹${(sum.net_profit || 0).toLocaleString('en-IN')}</b>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px;">
        <h3 style="margin:0 0 14px; color:#0f172a;">Course Sales &amp; Margin Breakdown</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Enrolled Candidates</th>
                <th>Course Sales Billed</th>
                <th>Council Cost</th>
                <th>Net Institute Margin</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(co => `
                <tr>
                  <td><b>${esc(co.course)}</b></td>
                  <td><b>${co.students} Students</b></td>
                  <td>₹${co.revenue.toLocaleString('en-IN')}</td>
                  <td class="muted">₹${co.cost.toLocaleString('en-IN')}</td>
                  <td style="color:#16a34a; font-weight:800;">₹${co.profit.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 13. Events / Announcement (Notice, Chhutti ka message sabko)
  async Events() {
    const data = await api('/api/centre/events');
    const events = data.events || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">13. Events &amp; Announcements</h2>
          <p class="muted" style="margin:0;">Notice, holiday circular, chhutti ka message aur exam dates broadcast karein</p>
        </div>
        <button class="btn gold" onclick="openCreateNoticeModal()">📢 Post New Notice / Chhutti Alert</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${events.length ? events.map(e => `
          <div class="card" style="background:#fff; border-left:4px solid #ea580c; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge ${e.category === 'Holiday' ? 'Pending' : 'Valid'}">${esc(e.category)}</span>
              <span class="muted" style="font-size:0.8rem;">${esc(e.event_date || 'Session 2026-27')}</span>
            </div>
            <h3 style="margin:0 0 8px; font-size:1.15rem; color:#0f172a;">${esc(e.title)}</h3>
            <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px;">${esc(e.content)}</p>
            <button class="btn sm alt" onclick="deleteEvent(${e.id})" style="color:#dc2626;">🗑️ Delete Notice</button>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No notices posted yet. Click above to broadcast a holiday or exam circular.</p>
          </div>
        `}
      </div>
    `;
  },

  // 14. Library / Study Material (PDF Notes, Video upload)
  async Library() {
    const data = await api('/api/centre/materials');
    const materials = data.materials || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">14. Library &amp; Study Material</h2>
          <p class="muted" style="margin:0;">PDF Notes upload karein, course video links share karein, study material pradan karein</p>
        </div>
        <button class="btn gold" onclick="openAddMaterialModal()">➕ Add Study Material (PDF / Video)</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${materials.length ? materials.map(m => `
          <div class="card" style="background:#fff; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge active">${m.material_type === 'video' ? '▶️ Video Class' : '📄 PDF Notes'}</span>
              <span class="muted" style="font-size:0.8rem;">${esc(m.course_name || 'General')}</span>
            </div>
            <h3 style="margin:0 0 12px; font-size:1.15rem; color:#0f172a;">${esc(m.title)}</h3>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <a href="${esc(m.file_url)}" target="_blank" class="btn sm" style="background:#0284c7; color:#fff; text-decoration:none;">
                ${m.material_type === 'video' ? '▶️ Watch Tutorial' : '📥 Download PDF'}
              </a>
              <button class="btn sm alt" onclick="deleteMaterial(${m.id})" style="color:#dc2626;">Delete</button>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No study materials added yet. Click above to upload PDF notes or video tutorials.</p>
          </div>
        `}
      </div>
    `;
  },

  // 15. Helpdesk / Messages (Student doubt, complaint ka jawab)
  async Helpdesk() {
    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">15. Helpdesk &amp; Student Inquiries</h2>
        <p class="muted" style="margin:0;">Student doubts, course admission inquiries, aur complaints ka seedha jawab dein</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <h3 style="margin:0 0 16px; color:#0f172a;">Recent Student Messages &amp; Doubts</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Category</th>
                <th>Subject / Doubt</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Rahul Sharma</b></td>
                <td><span class="badge active">Tally GST</span></td>
                <td>Sir, ledger voucher creation me doubt hai practical batch me.</td>
                <td><span class="badge Valid">Resolved</span></td>
                <td><button class="btn sm alt" onclick="toast('Reply already sent on student dashboard')">View Reply</button></td>
              </tr>
              <tr>
                <td><b>Pooja Verma</b></td>
                <td><span class="badge active">ADCA Exam</span></td>
                <td>When will Semester 2 practical examination admit cards be issued?</td>
                <td><span class="badge Pending">Open</span></td>
                <td><button class="btn sm gold" onclick="openReplyModal('Pooja Verma', 'ADCA Exam')">💬 Reply</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 16. Payments / Wallet (Council ko System Fees jama, Wallet balance)
  async Payments() {
    const w = await api('/api/centre/wallet');

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">16. Council Wallet &amp; System Fees</h2>
          <p class="muted" style="margin:0;">Purvanchal Council wallet balance, marksheets deduction ledger, aur recharge</p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
        <div class="card" style="background:#fff; border-left:4px solid #064e3b; padding:24px;">
          <span style="font-size:0.85rem; color:#64748b; font-weight:700;">ACTIVE COUNCIL WALLET BALANCE</span>
          <div style="font-size:2.4rem; font-weight:800; color:#064e3b; margin:10px 0;">${inr(w.balance_paise)}</div>
          <p class="muted" style="font-size:0.85rem; margin:0;">Used automatically when certificates and marksheets are ordered from central council.</p>
        </div>

        <div class="card" style="background:#fff; padding:24px;">
          <h3 style="margin:0 0 10px; color:#0f172a;">⚡ Instant Wallet Recharge</h3>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <input type="number" id="rechargeInput" value="5000" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-weight:700; width:100%;">
            <button class="btn gold" onclick="submitRecharge()" style="white-space:nowrap;">Recharge Now</button>
          </div>
          <span style="font-size:0.78rem; color:#64748b;">Instant credit via UPI / NetBanking gateway adapter</span>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px;">
        <h3 style="margin:0 0 14px; color:#0f172a;">Transaction Ledger History</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${new Date().toLocaleDateString('en-IN')}</td>
                <td><span class="badge Valid">Credit</span></td>
                <td style="color:#16a34a; font-weight:700;">+₹5,000.00</td>
                <td>Pre-loaded Gold Affiliation Council Wallet Credit</td>
                <td style="font-family:monospace;">WAL-INIT-2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 17. Profile & Settings (Logo, Name, Address, Photo, Phone & Password Change)
  async Profile() {
    const [sData, pData] = await Promise.all([
      api('/api/centre/settings'),
      api('/api/centre/profile')
    ]);
    const c = sData.centre || {};
    const u = pData.user || {};

    V.innerHTML = `
      <div style="max-width:920px; margin:0 auto;">
        <div style="margin-bottom:20px;">
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">17. Director Profile &amp; Centre Settings</h2>
          <p class="muted" style="margin:0;">Apna naam, photo, mobile number edit karein, password change karein aur centre details manage karein</p>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px;">
          <!-- Director Identity & Photo Edit Card -->
          <div class="card" style="background:#ffffff; border-radius:14px; padding:24px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 16px; color:#064e3b; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              <span>👨‍🏫</span> Director Identity &amp; Photo
            </h3>

            <div style="text-align:center; margin-bottom:18px;">
              <div style="width:120px; height:120px; border-radius:14px; border:3px solid #047857; margin:0 auto 12px; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center;" id="dirPhotoPreviewBox">
                ${u.photo_url ? `<img src="${esc(u.photo_url)}" style="width:100%; height:100%; object-fit:cover;">` : `<img src="/assets/img/director.jpg" style="width:100%; height:100%; object-fit:cover;">`}
              </div>
              <label class="btn sm gold" style="cursor:pointer; display:inline-block; margin-bottom:6px;">
                📷 Choose Director Photo
                <input type="file" id="dirPhotoFileInput" accept="image/*" style="display:none;">
              </label>
              <div style="font-size:0.75rem; color:#64748b;">Square photo recommended (JPG/PNG)</div>
            </div>

            <form id="directorDetailsForm">
              <input type="hidden" id="dirPhotoUrlInput" name="photo_url" value="${esc(u.photo_url || '')}">
              
              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Director Full Name *</label>
                <input name="name" value="${esc(u.name || c.director_name || '')}" required placeholder="e.g. Dr. Ramesh Kumar" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Mobile Number (Login &amp; Public) *</label>
                <input name="mobile" value="${esc(u.mobile || c.phone || '')}" required placeholder="e.g. 9876543210" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:14px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Official Email Address *</label>
                <input name="email" type="email" value="${esc(u.email || c.email || '')}" required placeholder="e.g. director@centre.com" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px;">
              </div>

              <button type="submit" class="btn" style="width:100%; background:#047857; color:#fff; font-weight:700; padding:10px; border-radius:6px;">
                💾 Save Director Profile
              </button>
            </form>
          </div>

          <!-- Password Change Card -->
          <div class="card" style="background:#ffffff; border-radius:14px; padding:24px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 8px; color:#064e3b; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              <span>🔐</span> Change Login Password
            </h3>
            <p class="muted" style="font-size:0.84rem; margin:0 0 18px;">
              Apna centre panel login password yahan se change karein. Naya password safe rakhein.
            </p>

            <form id="changePasswordForm">
              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Current / Old Password</label>
                <input name="old_password" type="password" placeholder="••••••••" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px;">
                <span style="font-size:0.75rem; color:#64748b;">(Default: owner123)</span>
              </div>

              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">New Password *</label>
                <input name="new_password" type="password" required placeholder="Minimum 6 characters" minlength="6" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:18px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Confirm New Password *</label>
                <input name="confirm_password" type="password" required placeholder="Re-enter new password" minlength="6" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <button type="submit" class="btn gold" style="width:100%; font-weight:700; padding:10px; border-radius:6px;">
                🔑 Update Login Password
              </button>
            </form>
          </div>
        </div>

        <!-- Centre Details & Address Settings -->
        <div class="card" style="background:#ffffff; border-radius:14px; padding:28px; border:1px solid #e2e8f0; margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="background:#ecfdf5; color:#047857; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">Main Website Showcase</span>
              <h3 style="margin:4px 0 0; color:#064e3b; font-size:1.25rem;">🏢 Centre Building Photo &amp; Accreditation Details</h3>
            </div>
            <span class="badge active">Live on pescouncil.in</span>
          </div>

          <!-- Centre Building Photo Upload Box -->
          <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:18px; margin-bottom:20px;">
            <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
              <div style="width:190px; height:125px; border-radius:10px; border:2px solid #047857; overflow:hidden; background:#e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0;" id="centrePhotoPreviewBox">
                <img src="${esc(c.center_photo || c.photo_url || '/assets/img/centre_varanasi.jpg')}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="flex:1; min-width:240px;">
                <h4 style="margin:0 0 6px; color:#064e3b;">🏛️ Centre Building / Premises Photo</h4>
                <p class="muted" style="font-size:0.84rem; margin:0 0 10px; line-height:1.4;">
                  Yeh photo <b>pescouncil.in</b> main website par <b>"Our Affiliated Centres"</b> me aapke centre ke naam ke saath display hogi.
                </p>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                  <label class="btn sm gold" style="cursor:pointer; display:inline-block;">
                    📷 Choose Centre Photo
                    <input type="file" id="centrePhotoFileInput" accept="image/*" style="display:none;">
                  </label>
                  <span style="font-size:0.75rem; color:#64748b;">(JPG/PNG building photo)</span>
                </div>
              </div>
            </div>
          </div>

          <form id="centreProfileForm" class="row">
            <input type="hidden" id="centrePhotoUrlInput" name="center_photo" value="${esc(c.center_photo || c.photo_url || '')}">

            <div style="grid-column:span 2;">
              <label>Accredited Institute Full Name *</label>
              <input name="name" value="${esc(c.name || '')}" required style="font-size:1.05rem; font-weight:700;">
            </div>

            <div>
              <label>Centre Code (Council Issued)</label>
              <input value="${esc(c.centre_code || 'PESC00001')}" readonly style="background:#f1f5f9; font-family:monospace; font-weight:700;">
            </div>

            <div>
              <label>Official Live Portal Website</label>
              <div style="display:flex; gap:8px;">
                <input value="https://${(c.slug === 'navya' ? 'navyacomputer' : esc(c.slug || 'navya'))}.pescouncil.in" readonly style="background:#f1f5f9; font-family:monospace; color:#064e3b; font-weight:700; flex:1;">
                <a href="https://${(c.slug === 'navya' ? 'navyacomputer' : esc(c.slug || 'navya'))}.pescouncil.in" target="_blank" class="btn sm" style="background:#047857; color:#fff; text-decoration:none; padding:8px 12px; display:inline-flex; align-items:center;">Visit ↗</a>
              </div>
            </div>

            <div>
              <label>District *</label>
              <input name="district" value="${esc(c.district || '')}" required>
            </div>

            <div>
              <label>State *</label>
              <input name="state" value="${esc(c.state || '')}" required>
            </div>

            <div style="grid-column:span 2;">
              <label>Full Physical Institute Address *</label>
              <textarea name="address" rows="2">${esc(c.address || '')}</textarea>
            </div>

            <div>
              <label>PIN Code</label>
              <input name="pin" value="${esc(c.pin || '221001')}" maxlength="6">
            </div>

            <div>
              <label>Institute Logo Emoji / URL</label>
              <input name="logo_url" value="${esc(c.logo_url || '🎓')}">
            </div>

            <div style="grid-column:span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
              <button type="submit" class="btn" style="background:#047857; color:#fff; padding:12px 30px; font-weight:700; border-radius:6px;">
                💾 Save Centre Address &amp; Info
              </button>
            </div>
          </form>
        </div>

        <!-- Centre Bank Account & UPI QR Settings for Student Fee Collection -->
        <div class="card" style="background:#ffffff; border-radius:14px; padding:28px; border:2px solid #047857; margin-top:24px; box-shadow:0 4px 14px rgba(4, 120, 87, 0.08);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="background:#ecfdf5; color:#047857; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">Student Fee Collection</span>
              <h3 style="margin:4px 0 0; color:#064e3b; font-size:1.25rem; display:flex; align-items:center; gap:8px;">
                <span>💳</span> Centre UPI QR Code &amp; Bank Account Settings
              </h3>
            </div>
            <span class="badge active">Direct to Owner Bank</span>
          </div>
          <p class="muted" style="font-size:0.86rem; margin:0 0 20px;">
            Yahan apna UPI ID aur Bank Account details save karein. Student admission lene par direct aapke is QR Code aur Bank Account par course fees jama hogi aur student ko official transaction receipt milegi.
          </p>

          <form id="centrePaymentSettingsForm" class="row">
            <div>
              <label>UPI ID (Google Pay / PhonePe / Paytm / BHIM) *</label>
              <input name="upi_id" id="setUpiId" value="${esc(c.upi_id || `${(c.phone || '9876543210').replace(/[^0-9]/g, '')}@paytm`)}" required placeholder="e.g. 9876543210@paytm or maurya@oksbi" style="font-family:monospace; font-weight:700; color:#047857;">
            </div>

            <div>
              <label>Account Holder Full Name *</label>
              <input name="account_holder" value="${esc(c.account_holder || c.director_name || c.name || '')}" required placeholder="Name as per Bank Account">
            </div>

            <div>
              <label>Bank Name *</label>
              <input name="bank_name" value="${esc(c.bank_name || 'State Bank of India')}" required placeholder="e.g. State Bank of India / Bank of Baroda">
            </div>

            <div>
              <label>Bank Account Number *</label>
              <input name="account_no" value="${esc(c.account_no || '38920192837')}" required placeholder="Enter Account Number" style="font-family:monospace; font-weight:700;">
            </div>

            <div>
              <label>Bank IFSC Code *</label>
              <input name="ifsc" value="${esc(c.ifsc || 'SBIN0001234')}" required placeholder="e.g. SBIN0001234" style="font-family:monospace; font-weight:700; text-transform:uppercase;">
            </div>

            <div>
              <label>Custom QR Code Image URL (Optional)</label>
              <input name="qr_code_url" value="${esc(c.qr_code_url || '')}" placeholder="Leave blank to use auto-generated UPI QR">
            </div>

            <div style="grid-column:span 2; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:center; gap:20px;">
              <div style="text-align:center;">
                <img id="liveQrPreview" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(c.upi_id || 'pescouncil@upi')}&cu=INR" alt="QR Preview" style="width:100px; height:100px; border-radius:6px; border:1px solid #cbd5e1; background:#fff;">
                <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Live Preview</div>
              </div>
              <div style="font-size:0.84rem; color:#334155; line-height:1.5;">
                <b>✓ Instant Dynamic UPI QR:</b><br>
                Aapke is UPI ID se aapki centre website par automatically UPI QR code ban jayega jise student scan karke DCA, ADCA, Tally aadi courses ki fees direct aapko pay kar sakte hain.
              </div>
            </div>

            <div style="grid-column:span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
              <button type="submit" class="btn gold" style="padding:12px 30px; font-weight:700; border-radius:6px;">
                💳 Save Payment &amp; QR Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Centre Building photo file upload handler
    const cPhotoInput = $('#centrePhotoFileInput');
    if (cPhotoInput) {
      cPhotoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          $('#centrePhotoUrlInput').value = ev.target.result;
          $('#centrePhotoPreviewBox').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          toast('Centre building photo selected! Click "Save Centre Address & Info" to save.');
        };
        reader.readAsDataURL(file);
      };
    }

    // Photo file upload handler
    const photoFileInput = $('#dirPhotoFileInput');
    if (photoFileInput) {
      photoFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          $('#dirPhotoUrlInput').value = ev.target.result;
          $('#dirPhotoPreviewBox').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          toast('Photo loaded! Click "Save Director Profile" to save.');
        };
        reader.readAsDataURL(file);
      };
    }

    // Save Director Profile form
    $('#directorDetailsForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        const res = await api('/api/centre/profile', { method: 'POST', body: payload });
        toast(res.message || 'Director details updated successfully!');
        initCentreHeader();
      });
    };

    // Change Password form
    $('#changePasswordForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        if (payload.new_password !== payload.confirm_password) {
          toast('New password and confirm password do not match!', false);
          return;
        }
        const res = await api('/api/centre/change-password', { method: 'POST', body: payload });
        toast(res.message || 'Password changed successfully!');
        e.target.reset();
      });
    };

    // Save Centre Settings form
    $('#centreProfileForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        await api('/api/centre/settings', { method: 'POST', body: payload });
        toast('Centre profile updated successfully!');
        initCentreHeader();
      });
    };

    // Save Payment Settings form
    $('#centrePaymentSettingsForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        const res = await api('/api/centre/payment-settings', { method: 'POST', body: payload });
        toast(res.message || 'Centre bank & QR settings saved successfully!');
        if ($('#liveQrPreview')) {
          $('#liveQrPreview').src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(payload.upi_id)}&cu=INR`;
        }
      });
    };
  },

  // 18. Affiliation Certificate / मान्यता प्रमाण पत्र
  async AffiliationCert() {
    const res = await api('/api/centre/affiliation-cert');
    const cert = res.certificate || {};

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; font-size:1.6rem; color:#78350f;">🏆 18. Official Affiliation Certificate</h2>
          <p class="muted" style="margin:0;">Kendra Manyata Praman Patra issued by Purvanchal Education &amp; Skill Council (PESC)</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn gold" onclick="window.print()" style="font-weight:700;">🖨️ Print Certificate (A4 Size)</button>
        </div>
      </div>

      <div class="card" style="padding:40px 30px; background:#f8fafc; border:1px solid #cbd5e1; box-shadow:var(--shadow-md);">
        <!-- Royal Ornamental Certificate Frame -->
        <div style="border: 8px double #d4af37; outline: 3px solid #b45309; outline-offset: 6px; border-radius: 14px; padding: 40px 48px; background: radial-gradient(circle, #ffffff 50%, #fffdf0 100%); position:relative; box-shadow:0 12px 30px rgba(212,175,55,0.2); text-align:center;">
          
          <!-- Watermark -->
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.04; pointer-events:none; font-size:20rem; font-weight:900; color:#0a2a5e;">P</div>

          <!-- Top Emblem & Council Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #d4af37; padding-bottom: 18px; margin-bottom: 24px;">
            <div style="text-align:left;">
              <span style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Govt. Recognized Autonomy</span>
              <div style="font-size:0.85rem; color:#0a2a5e; font-weight:700;">ISO 9001:2015 Certified</div>
              <div style="font-size:0.75rem; color:#64748b;">NITI Aayog Registered</div>
            </div>
            <div style="text-align:center;">
              <div style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#fde047; font-size:2.2rem; font-weight:900; display:grid; place-items:center; margin:0 auto 6px; border:3px solid #d4af37; box-shadow:0 4px 12px rgba(0,0,0,0.15);">P</div>
              <h2 style="margin:0; font-size:1.6rem; color:#0a2a5e; letter-spacing:0.5px; font-weight:800;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
              <div style="font-size:1.05rem; color:#b45309; font-weight:700; margin-top:2px;">पूर्वांचल शिक्षा एवं कौशल परिषद</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.78rem; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">ATC Accredit No.</span>
              <div style="font-size:0.95rem; color:#b45309; font-family:monospace; font-weight:800;">${esc(cert.cert_no)}</div>
              <div style="margin-top:4px;">
                <span class="badge active" style="font-size:0.75rem;">✓ AUTHORIZED</span>
              </div>
            </div>
          </div>

          <!-- Title -->
          <h1 style="color:#0a2a5e; font-size:2.2rem; margin:16px 0 6px; text-transform:uppercase; letter-spacing:1px; font-family:serif;">Certificate of Affiliation</h1>
          <div style="font-size:1.1rem; color:#78350f; font-weight:600; margin-bottom:24px;">(सम्बद्धता एवं संस्था मान्यता प्रमाण पत्र)</div>

          <!-- Body Description -->
          <p style="font-size:1.1rem; color:#475569; line-height:1.8; margin:0 auto 20px; max-width:800px;">
            This is to officially certify that the educational institution named below has met the council's academic infrastructure, faculty, and operational standards and is hereby granted official status as an <b>Authorized Training Centre (ATC)</b> of Purvanchal Education &amp; Skill Council:
          </p>

          <div style="margin:20px 0; padding:18px 24px; background:#f0fdf4; border:2px solid #86efac; border-radius:10px; display:inline-block; min-width:70%;">
            <div style="display:flex; align-items:center; justify-content:center; gap:24px; text-align:left; flex-wrap:wrap;">
              ${cert.director_photo ? `
                <div style="text-align:center; flex-shrink:0;">
                  <img src="${cert.director_photo}" style="width:90px; height:110px; object-fit:cover; border:2px solid #b45309; border-radius:6px; box-shadow:0 3px 8px rgba(0,0,0,0.12); display:block; margin:0 auto 4px;" alt="Director Photo">
                  <div style="font-size:0.7rem; color:#78350f; font-weight:700; text-transform:uppercase;">Director Photo</div>
                </div>
              ` : ''}
              <div style="flex:1; min-width:240px;">
                <h2 style="margin:0; font-size:1.85rem; color:#064e3b; font-weight:800; letter-spacing:0.5px;">${esc(cert.name)}</h2>
                <div style="font-size:1.1rem; color:#0f172a; margin-top:6px; font-weight:600;">Director / Incharge: <span style="color:#0a2a5e;">${esc(cert.director_name)}</span></div>
                <div style="font-size:0.95rem; color:#475569; margin-top:4px;">Address: ${esc(cert.address)}</div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:20px; margin:20px 0; flex-wrap:wrap;">
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:8px 20px; border-radius:8px; font-size:0.95rem;">
              <span style="color:#92400e; font-weight:700;">Centre Code:</span> <b style="font-family:monospace; color:#78350f; font-size:1.15rem;">${esc(cert.centre_code)}</b>
            </div>
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:8px 20px; border-radius:8px; font-size:0.95rem;">
              <span style="color:#92400e; font-weight:700;">Affiliation Period:</span> <b style="color:#78350f;">${esc(cert.session)}</b>
            </div>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:8px 20px; border-radius:8px; font-size:0.95rem;">
              <span style="color:#166534; font-weight:700;">Status:</span> <b style="color:#15803d; text-transform:uppercase;">✓ ${esc(cert.status)}</b>
            </div>
          </div>

          <p style="font-size:0.95rem; color:#64748b; margin:16px auto; max-width:760px; line-height:1.6;">
            Authorized to conduct national vocational training, skill certifications, computer applications, and examinations for programs including: <b>${esc(cert.authorized_courses)}</b>.
          </p>

          <!-- Footer Signatures & Seal -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:28px; margin-top:28px; font-size:0.9rem; color:#475569;">
            <div style="text-align:center;">
              <div style="font-weight:700; color:#0a2a5e;">Verified Online</div>
              <div style="font-size:0.8rem; color:#64748b; font-family:monospace;">pescouncil.in/verify</div>
              <div style="border-bottom:1.5px solid #334155; width:150px; margin:8px auto 4px;"></div>
              <span>Council Verification Desk</span>
            </div>

            <div style="text-align:center;">
              <div style="width:75px; height:75px; border-radius:50%; border:2px double #d4af37; margin:0 auto 4px; display:grid; place-items:center; background:#fefce8; color:#b45309; font-weight:900; font-size:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                COUNCIL<br>SEAL
              </div>
              <span style="font-weight:700; color:#78350f;">Official Seal of PESC</span>
            </div>

            <div style="text-align:center;">
              <div style="font-weight:700; color:#0a2a5e;">Authorized Signatory</div>
              <div style="font-size:0.8rem; color:#64748b;">PES Council, Head Office</div>
              <div style="border-bottom:1.5px solid #334155; width:170px; margin:8px auto 4px;"></div>
              <span>Director General / Registrar</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// Helper to switch modules
function switchModule(modId) {
  activeTab = modId;
  renderSidebar();
  if (views[modId]) {
    guard(() => views[modId]());
  }
}

// Student Table Renderer
function renderStudentTable(students) {
  if (!students.length) return '<p class="muted" style="text-align:center; padding:20px;">No students enrolled yet.</p>';
  window._currentStudents = students;
  return table([
    ['Code', (r) => `<b style="font-family:monospace; color:#0f172a;">${esc(r.student_code)}</b>`],
    ['Candidate Name', (r) => `<b>${esc(r.name)}</b>`],
    ['Course', (r) => esc(r.course || r.course_name || 'Diploma')],
    ['Total Fees', (r) => `₹${(r.fee_total || 12000).toLocaleString('en-IN')}`],
    ['Paid', (r) => `<span style="color:#16a34a; font-weight:700;">₹${(r.fee_paid || 0).toLocaleString('en-IN')}</span>`],
    ['Pending', (r) => {
      const pend = Math.max(0, (r.fee_total || 12000) - (r.fee_paid || 0));
      return `<span style="color:${pend > 0 ? '#ea580c' : '#16a34a'}; font-weight:700;">₹${pend.toLocaleString('en-IN')}</span>`;
    }],
    ['Actions', (r) => `
      <div style="display:flex; gap:4px; flex-wrap:wrap;">
        <button class="btn sm" style="background:#0284c7; color:#fff;" onclick="quickViewStudent(${r.id})">👁️ View</button>
        <button class="btn sm" style="background:#047857; color:#fff; font-weight:700;" onclick="showAdmissionFormModal(${r.id})">📄 Admission Form</button>
        <button class="btn sm alt" onclick="printReceipt(${r.id})">🧾 Receipt</button>
        <button class="btn sm gold" onclick="switchModule('CertificatePrinting')">🎓 Cert</button>
      </div>
    `]
  ], students);
}

// Image 2: Official Printable Student Admission Form Modal
window.showAdmissionFormModal = async function(studentOrId) {
  let stu = studentOrId;
  if (!stu || typeof stu === 'number' || typeof stu === 'string') {
    const sId = stu || null;
    stu = (window._currentStudents || []).find(s => s.id == sId);
    if (!stu && sId) {
      try {
        const res = await api(`/api/centre/students/${sId}`);
        stu = res.student || res;
      } catch (_) {
        stu = { id: sId, name: 'Student Candidate' };
      }
    }
  }
  if (!stu) stu = (window._currentStudents && window._currentStudents[0]) || { name: 'Student Candidate', student_code: 'PESC00001-2026-00001' };

  const centre = currentCentre || {
    name: 'Siya College of Paramedical',
    centre_code: 'IN/UP/SHA/82907',
    district: 'Varanasi',
    state: 'Uttar Pradesh'
  };

  const branchCode = centre.centre_code || 'IN/UP/SHA/82907';
  const centreName = (centre.name || 'Siya College of Paramedical').toUpperCase();
  const todayDate = new Date(stu.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let modal = document.getElementById('admissionFormViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admissionFormViewModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); display:flex; align-items:flex-start; justify-content:center; z-index:99999; overflow-y:auto; padding:20px 10px;';
    document.body.appendChild(modal);
  }

  const quals = stu.academic_qualifications || {};
  const q10 = quals.tenth || {};
  const q12 = quals.twelfth || {};
  const qGrad = quals.graduation || {};
  const qPg = quals.post_graduation || {};

  modal.innerHTML = `
    <div style="background:#fff; max-width:820px; width:100%; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); overflow:hidden; position:relative; margin:auto;">
      <!-- Top Action Toolbar (Hidden in Print) -->
      <div class="no-print" style="background:#0f172a; color:#fff; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; font-size:0.95rem;">📄 Official Student Admission Form (Image 2)</span>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700; padding:6px 16px;" onclick="window.print()">🖨️ Print Form (A4)</button>
          <button type="button" class="btn sm alt" style="padding:6px 14px;" onclick="document.getElementById('admissionFormViewModal').style.display='none'">✕ Close</button>
        </div>
      </div>

      <!-- Printable A4 Admission Document Container (Exact Image 2) -->
      <div id="admissionFormPrintArea" style="padding:32px 36px; background:#fff; font-family:'Inter', Arial, sans-serif; color:#0f172a; line-height:1.45; position:relative;">
        
        <!-- Document Header (Exact Image 2) -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <!-- Left Logo -->
          <div style="width:75px; height:75px; border-radius:50%; border:2px solid #0284c7; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#f0f9ff; overflow:hidden;">
            ${centre.logo_url || centre.seal_url ? `<img src="${centre.logo_url || centre.seal_url}" style="width:100%; height:100%; object-fit:contain;">` : `<span style="font-size:2.2rem;">🎓</span>`}
          </div>

          <!-- Center Details -->
          <div style="text-align:center; flex:1; padding:0 12px;">
            <div style="font-size:0.75rem; font-weight:800; color:#334155; letter-spacing:0.5px; text-align:right;">BRANCH CODE: <span style="font-family:monospace; color:#0284c7;">${esc(branchCode)}</span></div>
            <h1 style="color:#0284c7; font-size:1.6rem; font-weight:900; margin:2px 0; text-transform:uppercase; letter-spacing:-0.3px;">${esc(centreName)}</h1>
            <div style="font-size:0.72rem; font-weight:700; color:#1e293b; letter-spacing:0.2px;">ACCREDITED TO THE BRIGHT FUTURE &amp; GOVT. OF INDIA &amp; ISO 9001:2015</div>
            <div style="font-size:0.68rem; color:#475569; margin-top:2px;">ISO 29990:2010 CERTIFIED ORGANIZATION , Reg.No: U85100UP2025PTC221451</div>
          </div>

          <!-- Right Date -->
          <div style="font-size:0.8rem; font-weight:800; color:#0f172a; white-space:nowrap; padding-top:4px;">
            DATE: <span style="border-bottom:1px solid #0f172a; padding:0 8px;">${esc(todayDate)}</span>
          </div>
        </div>

        <!-- Pill Title Banner (Exact Image 2) -->
        <div style="text-align:center; margin:14px 0 16px;">
          <div style="background:#0284c7; color:#ffffff; font-weight:900; font-size:1.15rem; padding:6px 40px; border-radius:30px; display:inline-block; letter-spacing:1px; box-shadow:0 3px 10px rgba(2,132,199,0.35);">
            ADMISSION FORM
          </div>
        </div>

        <!-- Form Rows (Exact Underline Fields from Image 2) -->
        <div style="font-size:0.86rem; color:#0f172a;">
          <!-- 1. Student Name -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end;">
            <b style="white-space:nowrap;">1. NAME OF THE STUDENT:&nbsp;<span style="font-size:0.75rem; color:#475569;">(IN THE CAPITAL LETTERS)</span>&nbsp;</b>
            <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; font-size:0.95rem; color:#0369a1; text-transform:uppercase;">${esc(stu.name || '')}</span>
          </div>

          <!-- 2. Date of Birth -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end;">
            <b style="white-space:nowrap;">2. DATE OF BIRTH:&nbsp;</b>
            <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px;">${esc(stu.dob || '')}</span>
          </div>

          <!-- 3. Father's Name & Occupation -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end; gap:16px;">
            <div style="flex:3; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">3. FATHER'S NAME:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; text-transform:uppercase;">${esc(stu.father_name || '')}</span>
            </div>
            <div style="flex:2; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">OCCUPATION:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:600; padding-left:8px;">${esc(stu.father_occupation || 'Business / Private')}</span>
            </div>
          </div>

          <!-- 4. Mother's Name & Occupation -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end; gap:16px;">
            <div style="flex:3; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">4. MOTHER'S NAME:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; text-transform:uppercase;">${esc(stu.mother_name || '')}</span>
            </div>
            <div style="flex:2; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">OCCUPATION:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:600; padding-left:8px;">${esc(stu.mother_occupation || 'Homemaker')}</span>
            </div>
          </div>

          <!-- 5. Mobile & Whatsapp -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end; gap:16px;">
            <div style="flex:1; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">5. MOBILE NO.:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; font-family:monospace;">${esc(stu.mobile || stu.student_whatsapp || '')}</span>
            </div>
            <div style="flex:1; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">Whatsapp No.:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; font-family:monospace;">${esc(stu.student_whatsapp || stu.parent_whatsapp || stu.mobile || '')}</span>
            </div>
          </div>

          <!-- 6. Email ID -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end;">
            <b style="white-space:nowrap;">6. EMAIL ID:&nbsp;</b>
            <span style="flex:1; border-bottom:1px dashed #334155; font-weight:600; padding-left:8px; color:#0369a1;">${esc(stu.email || '')}</span>
          </div>

          <!-- 7. Aadhar No & APAAR ID -->
          <div style="margin-bottom:12px; display:flex; align-items:flex-end; gap:16px;">
            <div style="flex:1; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">7. AADHAR NO:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; font-family:monospace;">${esc(stu.aadhar_no || '•••• •••• ••••')}</span>
            </div>
            <div style="flex:1; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">APAR ID:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px; font-family:monospace;">${esc(stu.apaar_id || 'APAR-2026-9281')}</span>
            </div>
          </div>

          <!-- 8. Course Name & Duration -->
          <div style="margin-bottom:14px; display:flex; align-items:flex-end; gap:16px;">
            <div style="flex:2; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">8. COURSE NAME:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:800; padding-left:8px; color:#0284c7;">${esc(stu.course || stu.course_name || 'Diploma Course')}</span>
            </div>
            <div style="flex:1; display:flex; align-items:flex-end;">
              <b style="white-space:nowrap;">DURATION:&nbsp;</b>
              <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:8px;">${esc(stu.duration_months ? stu.duration_months + ' Months' : '12 Months')}</span>
            </div>
          </div>

          <!-- 9. Academic Qualification Table (Exact Image 2) -->
          <div style="margin-bottom:16px;">
            <b style="display:block; margin-bottom:6px;">9. ACADEMIC QUALIFICATION:</b>
            <table style="width:100%; border-collapse:collapse; text-align:center; font-size:0.8rem; border:1px solid #334155;">
              <thead>
                <tr style="background:#f8fafc; font-weight:800; border-bottom:1px solid #334155;">
                  <th style="border:1px solid #334155; padding:6px 4px; width:22%;">EXAMINATION PASSED</th>
                  <th style="border:1px solid #334155; padding:6px 4px; width:34%;">SCHOOL/ COLLEGE</th>
                  <th style="border:1px solid #334155; padding:6px 4px; width:24%;">BOARD/ UNIVERSITY</th>
                  <th style="border:1px solid #334155; padding:6px 4px; width:20%;">YEAR OF PASSING</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid #334155; padding:6px; font-weight:700; text-align:left; padding-left:10px;">10th</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q10.school || 'Government High School')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q10.board || 'UP Board')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q10.year || '2020')}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #334155; padding:6px; font-weight:700; text-align:left; padding-left:10px;">12th</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q12.school || 'Inter College')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q12.board || 'UP Board')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(q12.year || '2022')}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #334155; padding:6px; font-weight:700; text-align:left; padding-left:10px;">Graduation</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qGrad.school || '')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qGrad.board || '')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qGrad.year || '')}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #334155; padding:6px; font-weight:700; text-align:left; padding-left:10px;">Post Graduation</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qPg.school || '')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qPg.board || '')}</td>
                  <td style="border:1px solid #334155; padding:6px;">${esc(qPg.year || '')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Emergency Contact Information (Exact Image 2) -->
          <div style="margin-bottom:14px;">
            <b style="font-size:0.8rem; letter-spacing:0.3px; color:#1e293b; display:block; text-align:center; margin-bottom:8px;">EMERGENCY CONTACT INFORMATION</b>
            <div style="display:flex; justify-content:space-between; gap:12px; font-size:0.82rem;">
              <div style="flex:1; display:flex; align-items:flex-end;">
                <b>NAME:&nbsp;</b>
                <span style="flex:1; border-bottom:1px dashed #334155; font-weight:600; padding-left:4px;">${esc(stu.emergency_name || stu.father_name || '')}</span>
              </div>
              <div style="flex:1; display:flex; align-items:flex-end;">
                <b>RELATION:&nbsp;</b>
                <span style="flex:1; border-bottom:1px dashed #334155; font-weight:600; padding-left:4px;">${esc(stu.emergency_relation || 'Father / Guardian')}</span>
              </div>
              <div style="flex:1; display:flex; align-items:flex-end;">
                <b>CONTACT NO:&nbsp;</b>
                <span style="flex:1; border-bottom:1px dashed #334155; font-weight:700; padding-left:4px; font-family:monospace;">${esc(stu.emergency_contact || stu.parent_whatsapp || stu.mobile || '')}</span>
              </div>
            </div>
          </div>

          <!-- Declaration Section (घोषणा) (Exact Image 2) -->
          <div style="text-align:center; margin-top:14px; font-size:0.75rem; color:#334155; line-height:1.4;">
            <b style="color:#0f172a;">Declaration Section (घोषणा)</b><br>
            I hereby declare that the information provided above is true and correct to the best of my knowledge.<br>
            I agree to abide by the rules and regulations of the institute.
          </div>

          <!-- Signatures (Exact Image 2) -->
          <div style="display:flex; justify-content:space-between; margin-top:36px; padding:0 14px;">
            <div style="text-align:center; width:220px;">
              <div style="border-top:1px dashed #334155; margin-bottom:6px;"></div>
              <b style="font-size:0.78rem;">(STUDENT SIGNATURE)</b>
            </div>
            <div style="text-align:center; width:220px;">
              <div style="border-top:1px dashed #334155; margin-bottom:6px;"></div>
              <b style="font-size:0.78rem;">(AUTHORISED SIGNATURE)</b>
            </div>
          </div>

          <!-- Cyan Bottom Banner with 5 Gold Stars (Exact Image 2) -->
          <div style="background:#0284c7; height:24px; margin-top:18px; display:flex; align-items:center; justify-content:center; color:#facc15; font-size:1.15rem; letter-spacing:6px;">
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
};

window.quickViewStudent = function(id) {
  showAdmissionFormModal(id);
};

window.printReceipt = function(id) {
  const stu = (window._currentStudents || []).find(s => s.id == id);
  if (!stu) return;
  showAdmissionFormModal(stu);
};

// Certificate Preview Renderers
let certFormat = 'council';
let certEvalPattern = 'yearly';

function setCertFormat(fmt) {
  certFormat = fmt;
  const bCouncil = $('#btnFmtCouncil');
  const bInst = $('#btnFmtInstitute');
  const bDual = $('#btnFmtDual');
  if (bCouncil) bCouncil.className = fmt === 'council' ? 'btn gold sm active' : 'btn alt sm';
  if (bInst) bInst.className = fmt === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  if (bDual) bDual.className = fmt === 'dual' ? 'btn gold sm active' : 'btn alt sm';
  updateCertPreview();
}

function setCertEvalPattern(pat) {
  certEvalPattern = pat;
  const bYearly = $('#btnCertEvalYearly');
  const bSem = $('#btnCertEvalSemester');
  if (bYearly) bYearly.className = pat === 'yearly' ? 'btn gold sm active' : 'btn alt sm';
  if (bSem) bSem.className = pat === 'semester' ? 'btn gold sm active' : 'btn alt sm';

  const termSel = $('#certTermSelect');
  if (termSel) {
    if (pat === 'yearly') {
      termSel.innerHTML = `
        <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
        <option value="1st Year">1st Year (प्रथम वर्ष)</option>
        <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
        <option value="Final Year">Final Year (अंतिम वर्ष)</option>
      `;
    } else {
      termSel.innerHTML = `
        <option value="Semester 1">Semester 1 (प्रथम सेमेस्टर)</option>
        <option value="Semester 2">Semester 2 (द्वितीय सेमेस्टर)</option>
        <option value="Semester 3">Semester 3 (तृतीय सेमेस्टर)</option>
        <option value="Semester 4">Semester 4 (चतुर्थ सेमेस्टर)</option>
        <option value="All Semesters Completed">All Semesters Completed (समस्त सेमेस्टर उत्तीर्ण)</option>
      `;
    }
  }
  updateCertPreview();
}

function updateCertPreview() {
  const sel = $('#certStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const father = opt.dataset.father || 'N/A';
  const mother = opt.dataset.mother || 'N/A';
  const code = opt.dataset.code || 'PESC-26-00008';
  const course = opt.dataset.course;
  const photo = opt.dataset.photo || '';

  const certTerm = ($('#certTermSelect') && $('#certTermSelect').value) || (certEvalPattern === 'semester' ? 'Semester 1' : 'Annual Examination');
  const isSemester = certEvalPattern === 'semester';

  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    const target = String(course || '').toUpperCase().trim();
    return cCode === target || cName === target || (cCode && target.includes(cCode)) || (cName && target.includes(cName));
  });
  const singleFee = foundCourse ? (foundCourse.single_fee_rupees || Math.round((foundCourse.single_fee_paise || 20000)/100)) : 200;
  const semFee = foundCourse ? (foundCourse.semester_fee_rupees || Math.round((foundCourse.semester_fee_paise || 60000)/100)) : 600;
  const currentFee = isSemester ? semFee : singleFee;

  const feeNoticeEl = $('#certFeeNotice');
  if (feeNoticeEl) {
    feeNoticeEl.innerHTML = `
      <div style="background:${isSemester ? '#eff6ff' : '#f0fdf4'}; border:1px solid ${isSemester ? '#bfdbfe' : '#bbf7d0'}; border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">${isSemester ? '📚' : '📜'}</span>
          <div>
            <b style="color:${isSemester ? '#1e40af' : '#166534'}; font-size:0.95rem; display:block;">
              ${isSemester ? 'Semester Certificate Fee (सेमेस्टर प्रमाणपत्र शुल्क)' : 'Single / Annual Certificate Fee (वार्षिक/सिंगल प्रमाणपत्र शुल्क)'}
            </b>
            <span style="font-size:0.78rem; color:#64748b;">Council Prescribed Fee for ${esc(course || 'Course')}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="background:${isSemester ? '#1d4ed8' : '#15803d'}; color:#ffffff; font-weight:800; font-size:1.15rem; padding:4px 16px; border-radius:20px; letter-spacing:0.5px; display:inline-block;">
            ₹${currentFee}
          </span>
        </div>
      </div>
    `;
  }

  const cName = currentCentre ? currentCentre.name : 'Authorized Training Centre';
  const cCode = currentCentre ? (currentCentre.centre_code || 'PESC00001') : 'PESC00001';
  const cDistrict = currentCentre ? (currentCentre.district || 'Azamgarh') : 'Azamgarh';
  const cState = currentCentre ? (currentCentre.state || 'Uttar Pradesh') : 'Uttar Pradesh';
  const cAddress = currentCentre ? (currentCentre.address || `${cDistrict}, ${cState}`) : `${cDistrict}, ${cState}`;
  const directorName = currentCentre ? (currentCentre.director_name || 'Dr. Ramesh Kumar') : 'Dr. Ramesh Kumar';

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-CERT-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  const studentPhotoHtml = photo
    ? `<img src="${esc(photo)}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`
    : `<div style="text-align:center; padding:4px;"><div style="font-size:1.6rem;">👤</div><span style="font-size:0.55rem; font-weight:700; color:#64748b; display:block; line-height:1;">Student Photo</span></div>`;

  $('#certPreviewContainer').innerHTML = `
    ${renderOfficialCouncilHeader({
      studentCode: code,
      rollNo: code,
      refNo: refNo,
      issueDate: issueDate
    })}

    <!-- Certificate Title Ribbon & Student Photo -->
    <div style="position:relative; margin:10px 0 16px;">
      <!-- Student Photo on Right -->
      <div style="position:absolute; right:10px; top:0; width:76px; height:92px; border:2px solid #0a2a5e; border-radius:4px; overflow:hidden; background:#f8fafc; box-shadow:0 2px 6px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center;">
        ${studentPhotoHtml}
      </div>

      <!-- Centered Ribbon Title -->
      <div style="text-align:center; max-width:440px; margin:0 auto; padding-right:50px;">
        <div style="display:inline-block; background:linear-gradient(135deg, #065f46, #047857); color:#ffffff; font-size:1.55rem; font-weight:900; letter-spacing:3px; padding:6px 40px; border-radius:6px; box-shadow:0 3px 8px rgba(4,120,87,0.3); border:2px solid #d4af37;">
          CERTIFICATE
        </div>
        <div style="font-size:0.75rem; font-weight:800; color:#064e3b; letter-spacing:1px; margin-top:4px;">
          ${isSemester ? 'SEMESTER EXAMINATION EVALUATION' : 'ANNUAL EXAMINATION EVALUATION'}
        </div>
      </div>
    </div>

    <!-- Official Certificate Body Text -->
    <div style="font-size:0.92rem; color:#000000; font-weight:700; line-height:2.2; text-align:center; margin:18px auto 14px; max-width:740px;">
      THIS IS TO CERTIFY THAT MR. / MRS. <span style="font-size:1.28rem; font-weight:900; color:#0a2a5e; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(name)}</span><br>
      S/O / D/O / W/O <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(father)}</span> &nbsp;&nbsp;&nbsp;&nbsp;
      MOTHERS NAME <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(mother)}</span> HAS SUCCESSFULLY CLEARED THE<br>
      ASSESSMENT IN THE JOB ROLE / COURSE <span style="font-size:1.2rem; font-weight:900; color:#064e3b; border-bottom:1.5px solid #64748b; padding:0 8px;">${esc(course)}</span><br>
      <span style="font-size:1.05rem; font-weight:900; color:#047857; border-bottom:1.5px solid #64748b; padding:0 6px;">78.50 %</span> HELD IN <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">${esc(cAddress)}</span><br>
      WITH GRADE <span style="font-size:1.15rem; font-weight:900; color:#16a34a; border-bottom:1.5px solid #64748b; padding:0 8px;">A</span> FROM OUR AUTHORIZED STUDY CENTRE<br>
      <div style="font-size:1.28rem; font-weight:900; color:#0a2a5e; margin:6px 0; letter-spacing:0.5px;">${esc(cName)} (CODE: ${esc(cCode)})</div>
      HE / SHE HAS BEEN AWARDED WITH THE CERTIFICATE / DIPLOMA OF SAID JOB ROLE /<br>
      COURSE DURATION <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">1 Year</span>
      FROM <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">01-09-2025</span> TO <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">12-09-2026</span>
    </div>

    ${renderOfficialCouncilFooter({
      directorName: directorName,
      centreCode: cCode
    })}
  `;
}

// Marksheet Preview
let mrkEvalPattern = 'yearly';

function setMrkEvalPattern(pat) {
  mrkEvalPattern = pat;
  const bYearly = $('#btnMrkEvalYearly');
  const bSem = $('#btnMrkEvalSemester');
  if (bYearly) bYearly.className = pat === 'yearly' ? 'btn gold sm active' : 'btn alt sm';
  if (bSem) bSem.className = pat === 'semester' ? 'btn gold sm active' : 'btn alt sm';

  const termSel = $('#mrkTermSelect');
  if (termSel) {
    if (pat === 'yearly') {
      termSel.innerHTML = `
        <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
        <option value="1st Year">1st Year (प्रथम वर्ष)</option>
        <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
        <option value="Final Year">Final Year (अंतिम वर्ष)</option>
      `;
    } else {
      termSel.innerHTML = `
        <option value="Semester 1">Semester 1 (प्रथम सेमेस्टर)</option>
        <option value="Semester 2">Semester 2 (द्वितीय सेमेस्टर)</option>
        <option value="Semester 3">Semester 3 (तृतीय सेमेस्टर)</option>
        <option value="Semester 4">Semester 4 (चतुर्थ सेमेस्टर)</option>
      `;
    }
  }
  updateMrkPreview();
}

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
  const norm = String(courseNameOrCode || '').toUpperCase().trim();
  const pattern = (evalPattern === 'semester') ? 'semester' : 'yearly';
  const term = String(termName || (pattern === 'semester' ? 'Semester 1' : 'Annual Examination')).trim();

  // 1. Check if course was configured by Head Office with custom curriculum
  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    return cCode === norm || cName === norm || (cCode && norm.includes(cCode)) || (cName && norm.includes(cName));
  });

  if (foundCourse && foundCourse.curriculum) {
    let curr = foundCourse.curriculum;
    if (typeof curr === 'string') {
      try { curr = JSON.parse(curr); } catch(e) { curr = null; }
    }
    if (curr && typeof curr === 'object') {
      const patObj = curr[pattern];
      if (patObj && typeof patObj === 'object') {
        if (Array.isArray(patObj[term]) && patObj[term].length > 0) {
          return patObj[term];
        }
        const tKeys = Object.keys(patObj);
        const matchKey = tKeys.find(k => k.toLowerCase() === term.toLowerCase() || term.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(term.toLowerCase()));
        if (matchKey && Array.isArray(patObj[matchKey]) && patObj[matchKey].length > 0) {
          return patObj[matchKey];
        }
        if (tKeys.length > 0 && Array.isArray(patObj[tKeys[0]]) && patObj[tKeys[0]].length > 0) {
          return patObj[tKeys[0]];
        }
      }
    }
  }

  // 2. Check static COURSE_CURRICULUM_DATA fallback
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

// Backward compatibility alias for single/semester buttons if needed
function setMrkFormat(fmt) {
  setMrkEvalPattern(fmt === 'single' ? 'yearly' : 'semester');
}

function updateMrkPreview() {
  const sel = $('#mrkStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const father = opt.dataset.father || 'N/A';
  const code = opt.dataset.code;
  const course = opt.dataset.course;

  const mrkTerm = ($('#mrkTermSelect') && $('#mrkTermSelect').value) || (mrkEvalPattern === 'semester' ? 'Semester 1' : 'Annual Examination');
  const isSemester = mrkEvalPattern === 'semester';

  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    const target = String(course || '').toUpperCase().trim();
    return cCode === target || cName === target || (cCode && target.includes(cCode)) || (cName && target.includes(cName));
  });
  const singleFee = foundCourse ? (foundCourse.single_fee_rupees || Math.round((foundCourse.single_fee_paise || 20000)/100)) : 200;
  const semFee = foundCourse ? (foundCourse.semester_fee_rupees || Math.round((foundCourse.semester_fee_paise || 60000)/100)) : 600;
  const currentFee = isSemester ? semFee : singleFee;

  const feeNoticeEl = $('#mrkFeeNotice');
  if (feeNoticeEl) {
    feeNoticeEl.innerHTML = `
      <div style="background:${isSemester ? '#eff6ff' : '#f0fdf4'}; border:1px solid ${isSemester ? '#bfdbfe' : '#bbf7d0'}; border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">${isSemester ? '📚' : '📜'}</span>
          <div>
            <b style="color:${isSemester ? '#1e40af' : '#166534'}; font-size:0.95rem; display:block;">
              ${isSemester ? 'Semester Marksheet Fee (सेमेस्टर अंकतालिका शुल्क)' : 'Single / Annual Marksheet Fee (वार्षिक/सिंगल अंकतालिका शुल्क)'}
            </b>
            <span style="font-size:0.78rem; color:#64748b;">Council Prescribed Fee for ${esc(course || 'Course')}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="background:${isSemester ? '#1d4ed8' : '#15803d'}; color:#ffffff; font-weight:800; font-size:1.15rem; padding:4px 16px; border-radius:20px; letter-spacing:0.5px; display:inline-block;">
            ₹${currentFee}
          </span>
        </div>
      </div>
    `;
  }

  const cName = currentCentre ? currentCentre.name : 'Authorized Training Centre';
  const cCode = currentCentre ? (currentCentre.centre_code || 'PESC00001') : 'PESC00001';
  const cDistrict = currentCentre ? (currentCentre.district || 'Varanasi') : 'Varanasi';
  const cState = currentCentre ? (currentCentre.state || 'Uttar Pradesh') : 'Uttar Pradesh';
  const cAddress = currentCentre ? (currentCentre.address || `${cDistrict}, ${cState} - ${currentCentre.pin || '221001'}`) : `${cDistrict}, ${cState}`;
  const directorName = currentCentre ? (currentCentre.director_name || 'Dr. Ramesh Kumar') : 'Dr. Ramesh Kumar';
  const directorPhoto = currentCentre ? (currentCentre.director_photo || currentCentre.photo_url || '') : '';
  const validityText = 'Lifetime Recognition / Session 2026-27';

  const directorPhotoHtml = directorPhoto
    ? `<img src="${esc(directorPhoto)}" alt="Director Photo" style="width:100%; height:100%; object-fit:cover;">`
    : `<div style="text-align:center; padding:2px;"><div style="font-size:1.4rem;">👤</div><span style="font-size:0.5rem; font-weight:700; color:#64748b; display:block; line-height:1;">Director Photo</span></div>`;

  // Retrieve distinct subjects for Yearly-Wise vs Semester-Wise evaluation
  const subjects = getCourseCurriculumSubjects(course, mrkEvalPattern, mrkTerm);

  let totalMax = 0, totalObt = 0;
  const rows = subjects.map((s, idx) => {
    const sMax = +s.max_marks || 100;
    const th = +s.theory || Math.min(48, Math.round(sMax * 0.44));
    const pr = +s.practical || Math.min(48, Math.round(sMax * 0.45));
    const obt = th + pr;
    totalMax += sMax;
    totalObt += obt;
    const grade = obt >= (sMax * 0.85) ? 'A+' : obt >= (sMax * 0.75) ? 'A' : obt >= (sMax * 0.6) ? 'B' : 'C';

    return `
      <tr>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; font-weight:600; text-align:left;">${esc(s.name || s)}</td>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; text-align:center;">${sMax}</td>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; text-align:center; color:#0369a1;">${th}</td>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; text-align:center; color:#047857;">${pr}</td>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; text-align:center; font-weight:800; color:#0f172a;">${obt}</td>
        <td style="border:1px solid #cbd5e1; padding:7px 10px; text-align:center; font-weight:800; color:#16a34a;">${grade}</td>
      </tr>
    `;
  }).join('');

  const pct = Math.round((totalObt / (totalMax || 1)) * 1000) / 10;
  const finalGrade = pct >= 85 ? 'Grade A+ (Exemplary)' : pct >= 75 ? 'Grade A (Distinction)' : pct >= 60 ? 'Grade B (First Class)' : 'Grade C (Pass)';

  const tableContent = `
    <div style="font-weight:800; color:${isSemester ? '#0369a1' : '#064e3b'}; margin:10px 0 6px; text-align:left; font-size:0.95rem; text-transform:uppercase;">
      ${isSemester ? '📚 ' + esc(mrkTerm).toUpperCase() + ' EVALUATION ASSESSMENT:' : '📅 ' + esc(mrkTerm).toUpperCase() + ' CONSOLIDATED STATEMENT:'}
    </div>
    <table style="width:100%; border-collapse:collapse; margin:10px 0 16px; font-size:0.88rem;">
      <thead>
        <tr style="background:${isSemester ? '#f0f9ff' : '#f1f5f9'};">
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:left;">Subject / Module Title</th>
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Max Marks</th>
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Theory</th>
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Practical</th>
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Total Obtained</th>
          <th style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Grade</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="background:#ecfdf5; font-weight:bold;">
          <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:left;">Grand Total:</td>
          <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">${totalMax}</td>
          <td colspan="2" style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">Percentage: <b>${pct}%</b></td>
          <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center; color:#16a34a; font-size:1.05rem;">${totalObt}</td>
          <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center; color:#16a34a; font-size:0.85rem;">${finalGrade}</td>
        </tr>
      </tfoot>
    </table>
  `;

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-MRK-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  $('#mrkPreviewContainer').innerHTML = `
    ${renderOfficialCouncilHeader({
      studentCode: code,
      rollNo: code,
      refNo: refNo,
      issueDate: issueDate
    })}

    <!-- Marksheet Ribbon Title -->
    <div style="text-align:center; margin:10px 0 14px;">
      <div style="display:inline-block; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#ffffff; font-size:1.45rem; font-weight:900; letter-spacing:2px; padding:6px 36px; border-radius:6px; box-shadow:0 3px 8px rgba(10,42,94,0.3); border:2px solid #d4af37;">
        STATEMENT OF MARKS
      </div>
      <div style="font-size:0.75rem; font-weight:800; color:#0a2a5e; letter-spacing:1px; margin-top:4px;">
        ${isSemester ? 'SEMESTER EXAMINATION EVALUATION: ' + esc(mrkTerm).toUpperCase() : 'ANNUAL EXAMINATION EVALUATION: ' + esc(mrkTerm).toUpperCase()}
      </div>
    </div>

    <!-- Candidate & Study Centre Info Box -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 16px; font-size:0.86rem; margin-bottom:14px; background:#f8fafc; padding:10px 14px; border-radius:6px; text-align:left; border:1px solid #cbd5e1;">
      <div>Candidate Name: <b style="color:#0f172a; font-size:0.95rem;">${esc(name)}</b></div>
      <div>Authorized Study Centre: <b style="color:#0a2a5e;">${esc(cName)} (${esc(cCode)})</b></div>
      <div>Father's Name: <b style="color:#0f172a;">${esc(father)}</b></div>
      <div>Examination Centre: <b style="color:#0f172a;">${esc(cAddress)}</b></div>
      <div>Course: <b style="color:#064e3b; font-size:0.95rem;">${esc(course)}</b></div>
      <div>Evaluation Scheme: <b style="color:${isSemester ? '#0369a1' : '#b45309'};">${isSemester ? '📚 Semester-Wise (' + esc(mrkTerm) + ')' : '📅 Yearly / Annual (' + esc(mrkTerm) + ')'}</b></div>
    </div>

    ${tableContent}

    ${renderOfficialCouncilFooter({
      directorName: directorName,
      centreCode: cCode
    })}
  `;
}

// Semester Graded Certificate
function updateSemCertPreview() {
  const sel = $('#semCertStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const code = opt.dataset.code;
  const course = opt.dataset.course;

  const cName = currentCentre ? currentCentre.name : 'Authorized Training Centre';
  const cCode = currentCentre ? (currentCentre.centre_code || 'PESC00001') : 'PESC00001';
  const cDistrict = currentCentre ? (currentCentre.district || 'Varanasi') : 'Varanasi';
  const cState = currentCentre ? (currentCentre.state || 'Uttar Pradesh') : 'Uttar Pradesh';
  const cAddress = currentCentre ? (currentCentre.address || `${cDistrict}, ${cState} - ${currentCentre.pin || '221001'}`) : `${cDistrict}, ${cState}`;
  const directorName = currentCentre ? (currentCentre.director_name || 'Dr. Ramesh Kumar') : 'Dr. Ramesh Kumar';
  const directorPhoto = currentCentre ? (currentCentre.director_photo || currentCentre.photo_url || '') : '';
  const validityText = 'Lifetime Recognition / Session 2026-27';

  const directorPhotoHtml = directorPhoto
    ? `<img src="${esc(directorPhoto)}" alt="Director Photo" style="width:100%; height:100%; object-fit:cover;">`
    : `<div style="text-align:center; padding:2px;"><div style="font-size:1.4rem;">👤</div><span style="font-size:0.5rem; font-weight:700; color:#64748b; display:block; line-height:1;">Director Photo</span></div>`;

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-SEM-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  $('#semCertPreview').innerHTML = `
    ${renderOfficialCouncilHeader({
      studentCode: code,
      rollNo: code,
      refNo: refNo,
      issueDate: issueDate
    })}

    <!-- Certificate Title Ribbon -->
    <div style="text-align:center; margin:10px 0 16px;">
      <div style="display:inline-block; background:linear-gradient(135deg, #0a2a5e, #047857); color:#ffffff; font-size:1.45rem; font-weight:900; letter-spacing:2px; padding:6px 36px; border-radius:6px; box-shadow:0 3px 8px rgba(10,42,94,0.3); border:2px solid #d4af37;">
        CUMULATIVE SEMESTER DIPLOMA CERTIFICATE
      </div>
    </div>

    <p style="margin:16px 0 6px; font-size:1.1rem; color:#475569;">This cumulative diploma is officially awarded to</p>
    <div style="font-size:1.9rem; font-weight:900; color:#064e3b; text-decoration:underline; text-decoration-color:#d4af37;">${esc(name)}</div>
    <div style="font-size:0.9rem; color:#64748b; margin-top:4px;">Roll Number / Student Code: <b style="font-family:monospace; color:#0a2a5e;">${esc(code)}</b></div>

    <p style="margin:14px 0; font-size:0.95rem; color:#334155;">for successfully completing all terms of <b>${esc(course)}</b> at <b>${esc(cName)} (${esc(cCode)})</b> with semester scores:</p>

    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; max-width:620px; margin:0 auto 20px; font-size:0.9rem;">
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.78rem;">Semester - I</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.78rem;">Semester - II</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; padding:10px; border-radius:8px;">
        <span style="color:#064e3b; display:block; font-size:0.78rem;">Overall Result</span>
        <b style="color:#064e3b; font-size:1.2rem;">DISTINCTION</b>
      </div>
    </div>

    ${renderOfficialCouncilFooter({
      directorName: directorName,
      centreCode: cCode
    })}
  `;
}

// ID Card Preview
let idCardStyle = 'council';
function setIdCardStyle(st) {
  idCardStyle = st;
  $('#btnIdCouncil').className = st === 'council' ? 'btn gold sm active' : 'btn alt sm';
  $('#btnIdInst').className = st === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  updateIdCardPreview();
}

function updateIdCardPreview() {
  const sel = $('#idCardStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const code = opt.dataset.code;
  const course = opt.dataset.course;
  const father = opt.dataset.father;
  const mobile = opt.dataset.mobile || '9876543210';
  const cName = currentCentre ? currentCentre.name : 'Authorized Computer Academy';

  const headerTitle = idCardStyle === 'council' ? 'PURVANCHAL EDUCATION &amp; SKILL COUNCIL' : esc(cName).toUpperCase();

  $('#idCardPreview').innerHTML = `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; font-family:sans-serif;">
      <div style="background:${idCardStyle === 'council' ? '#064e3b' : '#0284c7'}; color:#ffffff; padding:10px; text-align:center;">
        <div style="font-size:0.75rem; font-weight:800; letter-spacing:0.5px;">${headerTitle}</div>
        <div style="font-size:0.65rem; color:#fde047;">STUDENT IDENTITY CARD · 2026-27</div>
      </div>
      <div style="padding:14px; display:flex; gap:12px; align-items:center;">
        <div style="width:72px; height:84px; background:#e2e8f0; border-radius:6px; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; font-size:2rem;">
          👤
        </div>
        <div style="font-size:0.8rem; line-height:1.5;">
          <div style="font-size:0.95rem; font-weight:800; color:#0f172a;">${esc(name)}</div>
          <div>Roll No: <b style="font-family:monospace; color:#064e3b;">${esc(code)}</b></div>
          <div>Course: <b>${esc(course)}</b></div>
          <div>Father: ${esc(father)}</div>
          <div>Phone: ${esc(mobile)}</div>
        </div>
      </div>
      <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding:6px 12px; display:flex; justify-content:space-between; align-items:center; font-size:0.68rem; color:#64748b;">
        <span>Valid Till: Dec 2027</span>
        <span style="font-family:monospace;">||| | |||| | |||</span>
        <span>Director Sign</span>
      </div>
    </div>
  `;
}

// Quick View Student Modal
async function quickViewStudent(id) {
  guard(async () => {
    const d = await api(`/api/centre/students/${id}`);
    const s = d.student;
    alert(`Candidate: ${s.name}\nRoll Code: ${s.student_code}\nCourse: ${s.course}\nSession: ${s.session}\nTuition Fee: ₹${s.fee_total}\nFee Paid: ₹${s.fee_paid}\nPortal Password: ${s.initial_password || 'Student@123'}`);
  });
}

// Print Fee Receipt
function printReceipt(studentId) {
  guard(async () => {
    const res = await api('/api/centre/fees/record', {
      method: 'POST',
      body: { student_id: studentId, amount: 1000, mode: 'Cash', note: 'Installment' }
    });
    alert(`OFFICIAL FEE RECEIPT\n--------------------------\nReceipt No: ${res.receipt_no}\nStudent: ${res.student_name} (${res.student_code})\nAmount Deposited: ₹${res.amount_paid}\nTotal Paid: ₹${res.new_total_paid}\nPending Balance: ₹${res.balance_pending}\nDate: ${res.date}\nStatus: PAYMENT CONFIRMED\n--------------------------\nPrinting receipt...`);
    window.print();
  });
}

// Course Selling Price update & Management Helpers
async function saveCoursePrice(courseId) {
  const input = $('#priceInput_' + courseId);
  if (!input) return;
  const val = +input.value;
  guard(async () => {
    await api(`/api/centre/courses/${courseId}/price`, {
      method: 'PUT',
      body: { selling_price_rupees: val }
    });
    toast('Course selling price updated to ₹' + val);
    views.MyCourses();
  });
}

window.showCentreCourseSubjects = function(courseId) {
  const courses = window._currentCourses || [];
  const co = courses.find(x => x.id === courseId);
  if (!co) return;

  const modal = $('#centreCourseSubjectsModal');
  const title = $('#centreCourseSubjectsTitle');
  const content = $('#centreCourseSubjectsContent');
  if (!modal || !content) return;

  if (title) title.innerHTML = `📚 Syllabus: ${esc(co.name)} (${esc(co.code)})`;

  const singleFee = co.single_fee_rupees || Math.round((co.single_fee_paise || 20000)/100);
  const semFee = co.semester_fee_rupees || Math.round((co.semester_fee_paise || 60000)/100);

  let curr = co.curriculum;
  if (typeof curr === 'string') {
    try { curr = JSON.parse(curr); } catch(e) { curr = null; }
  }

  function renderSubTable(list, heading, badgeColor) {
    if (!list || !list.length) return '';
    return `
      <div style="margin-top:14px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <b style="color:${badgeColor}; font-size:0.92rem;">${heading}</b>
          <span style="font-size:0.75rem; background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:700;">${list.length} Subjects · Total ${list.reduce((acc, x) => acc + (+x.max_marks || 100), 0)} Marks</span>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:0.83rem;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px 8px; border:1px solid #cbd5e1; width:80px;">Code</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1;">Subject Name (विषय)</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:65px;">Max</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:60px;">Theory</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:60px;">Practical</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((s, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:6px 8px; border:1px solid #cbd5e1; font-family:monospace; font-weight:700; color:#0a2a5e;">${esc(s.code || `SUB${idx+1}`)}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">${esc(s.name || s)}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center;">${s.max_marks || 100}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; color:#0369a1;">${s.theory || 70}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; color:#047857;">${s.practical || 30}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  let yearlyHtml = '';
  if (curr && curr.yearly && Object.keys(curr.yearly).length > 0) {
    yearlyHtml = Object.entries(curr.yearly).map(([tName, subs]) => renderSubTable(subs, `📅 ${tName} (वार्षिक पाठ्यक्रम)`, '#064e3b')).join('');
  } else {
    const yearlySubs = getCourseCurriculumSubjects(co.code || co.name, 'yearly', 'Annual Examination');
    yearlyHtml = renderSubTable(yearlySubs, '📅 Consolidated Annual / Yearly Examination Curriculum', '#064e3b');
  }

  let semesterHtml = '';
  if (curr && curr.semester && Object.keys(curr.semester).length > 0) {
    semesterHtml = Object.entries(curr.semester).map(([tName, subs], idx) => renderSubTable(subs, `📚 ${tName} Curriculum`, idx % 2 === 0 ? '#0369a1' : '#b45309')).join('');
  } else {
    const sem1Subs = getCourseCurriculumSubjects(co.code || co.name, 'semester', 'Semester 1');
    const sem2Subs = getCourseCurriculumSubjects(co.code || co.name, 'semester', 'Semester 2');
    semesterHtml = renderSubTable(sem1Subs, '📚 Semester - 1 Curriculum (प्रथम सेमेस्टर)', '#0369a1') +
                   renderSubTable(sem2Subs, '📚 Semester - 2 Curriculum (द्वितीय सेमेस्टर)', '#b45309');
  }

  content.innerHTML = `
    <!-- Council Prescribed Fee Structure Badge -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <b style="color:#0f172a; font-size:0.9rem; display:block;">हेड ऑफिस निर्धारित अंकतालिका व प्रमाणपत्र शुल्क:</b>
        <span style="font-size:0.75rem; color:#64748b;">(Course Prescribed Examination Council Fees)</span>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <span style="background:#dcfce7; color:#166534; font-size:0.82rem; font-weight:800; padding:4px 12px; border-radius:20px; border:1px solid #86efac;">
          📜 Single / Yearly: ₹${singleFee}
        </span>
        <span style="background:#dbeafe; color:#1e40af; font-size:0.82rem; font-weight:800; padding:4px 12px; border-radius:20px; border:1px solid #93c5fd;">
          📚 Semester Exam: ₹${semFee}
        </span>
      </div>
    </div>

    <div style="display:flex; gap:8px; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
      <button type="button" class="btn sm gold active" id="btnSyllabusYearly" onclick="switchSyllabusView('yearly')">📅 Yearly / Annual Syllabus</button>
      <button type="button" class="btn sm alt" id="btnSyllabusSemester" onclick="switchSyllabusView('semester')">📚 Semester-Wise Syllabus</button>
    </div>

    <div id="syllabusYearlyView">
      ${yearlyHtml || '<p class="muted">No yearly subjects configured.</p>'}
    </div>

    <div id="syllabusSemesterView" style="display:none;">
      ${semesterHtml || '<p class="muted">No semester subjects configured.</p>'}
    </div>
  `;

  window.switchSyllabusView = function(view) {
    const yV = $('#syllabusYearlyView');
    const sV = $('#syllabusSemesterView');
    const bY = $('#btnSyllabusYearly');
    const bS = $('#btnSyllabusSemester');
    if (view === 'yearly') {
      if (yV) yV.style.display = 'block';
      if (sV) sV.style.display = 'none';
      if (bY) bY.className = 'btn sm gold active';
      if (bS) bS.className = 'btn sm alt';
    } else {
      if (yV) yV.style.display = 'none';
      if (sV) sV.style.display = 'block';
      if (bY) bY.className = 'btn sm alt';
      if (bS) bS.className = 'btn sm gold active';
    }
  };

  modal.style.display = 'flex';
};

window.openAddCourseModal = function() {
  alert('🔒 सूचना: नए कोर्स जोड़ना केवल हेड ऑफिस एडमिन द्वारा ही अधिकृत है।');
};

window.openEditCourseModal = function() {
  alert('🔒 सूचना: कोर्स का नाम व काउंसिल फीस में परिवर्तन केवल हेड ऑफिस कर सकता है। आप कार्ड पर अपनी विद्यार्थी फीस (Institute Student Fee) एडिट करके सेव कर सकते हैं।');
};

window.deleteCourse = function() {
  alert('🔒 सूचना: हेड ऑफिस द्वारा अनुमोदित कोर्सेज को सेंटर से हटाया नहीं जा सकता।');
};

// Attendance helpers
function setRowAtt(id, status) {
  const row = $('#attRow_' + id);
  if (!row) return;
  $$('button', row).forEach(b => {
    b.className = b.dataset.st === status ? 'btn sm gold' : 'btn sm alt';
  });
}

function markAllPresent() {
  $$('#view tbody tr').forEach(row => {
    $$('button', row).forEach(b => {
      b.className = b.dataset.st === 'Present' ? 'btn sm gold' : 'btn sm alt';
    });
  });
  toast('Marked all students as Present');
}

async function saveAttendance() {
  const dateStr = $('#attDateInput')?.value || new Date().toISOString().slice(0, 10);
  const rows = $$('#view tbody tr');
  const records = [];
  rows.forEach(r => {
    const id = r.id.replace('attRow_', '');
    const activeBtn = r.querySelector('button.gold');
    const st = activeBtn ? activeBtn.dataset.st : 'Present';
    records.push({ student_id: +id, status: st });
  });

  guard(async () => {
    await api('/api/centre/attendance', {
      method: 'POST',
      body: { date: dateStr, records }
    });
    toast(`Attendance saved for ${records.length} students on ${dateStr}!`);
  });
}

async function loadMonthlyAtt() {
  guard(async () => {
    const d = await api('/api/centre/attendance/monthly');
    $('#monthlyAttBox').innerHTML = table([
      ['Student Roll Code', (r) => `<b style="font-family:monospace;">${esc(r.student_code)}</b>`],
      ['Student Name', (r) => `<b>${esc(r.name)}</b>`],
      ['Marked Sessions', (r) => `${r.total_marked || 22} Days`],
      ['Present', (r) => `<span style="color:#16a34a; font-weight:bold;">${r.present_count || 20} Days</span>`],
      ['Monthly Percentage', (r) => `<b style="color:${r.percentage >= 75 ? '#16a34a' : '#ea580c'};">${r.percentage}%</b>`]
    ], d.report || []);
  });
}

// Mohar & Sign Save
async function saveMoharSign() {
  const seal = $('#sealUrlInput')?.value;
  const sign = $('#signUrlInput')?.value;
  guard(async () => {
    await api('/api/centre/settings', {
      method: 'PUT',
      body: { seal_url: seal, signature_url: sign }
    });
    toast('Official Stamp & Signature saved to centre profile!');
  });
}

function setupImageUpload(fileInputId, urlInputId, previewBoxId, defaultIcon) {
  const fInput = $('#' + fileInputId);
  const uInput = $('#' + urlInputId);
  const pBox = $('#' + previewBoxId);
  if (fInput) {
    fInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        uInput.value = ev.target.result;
        pBox.innerHTML = `<img src="${ev.target.result}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
      };
      reader.readAsDataURL(file);
    };
  }
}

// Wallet recharge
async function submitRecharge() {
  const amt = +$('#rechargeInput')?.value || 1000;
  guard(async () => {
    const res = await api('/api/centre/wallet/recharge', {
      method: 'POST',
      body: { amount_rupees: amt }
    });
    toast(`Recharge request ${res.provider_ref} submitted!`);
  });
}

// Student Login Modal Handler
function initStudentLoginModal() {
  const btn = $('#btnStudentLoginModal');
  const modal = $('#studentLoginModal');
  const closeBtn = $('#btnCloseStudentModal');
  if (btn && modal) {
    btn.onclick = () => { modal.style.display = 'flex'; };
  }
  if (closeBtn && modal) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
  const form = $('#studentLoginForm');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const id = $('#modalStudentInput').value.trim();
        const pw = $('#modalStudentPw').value.trim();
        const res = await api('/api/auth/login', {
          method: 'POST',
          body: { email: id, password: pw }
        });
        toast('Login successful! Redirecting to Student Panel...');
        window.location.href = '/student';
      });
    };
  }
}

// Header & Centre Switcher Initialization
async function initCentreHeader() {
  try {
    const [cData, meData] = await Promise.all([
      api('/api/centre/all-centres'),
      api('/api/auth/me')
    ]);

    allCentresList = cData.centres || [];

    // Prioritize active centre:
    // 1. Authenticated user (centre_id, centre_slug, centre_code)
    // 2. Server resolved active_centre or active_id
    // 3. currentSlug matching centre.slug
    // 4. First centre in list
    const user = meData?.user;
    let activeCentre = null;
    if (user && (user.role === 'centre_owner' || user.centre_id || user.centre_slug || user.centre_code)) {
      if (user.centre_id) activeCentre = allCentresList.find(c => c.id === user.centre_id);
      if (!activeCentre && user.centre_slug) activeCentre = allCentresList.find(c => c.slug === user.centre_slug);
      if (!activeCentre && user.centre_code) activeCentre = allCentresList.find(c => c.centre_code && c.centre_code.toUpperCase() === user.centre_code.toUpperCase());
    }
    if (!activeCentre && cData.active_centre) {
      activeCentre = cData.active_centre;
    }
    if (!activeCentre && cData.active_id) {
      activeCentre = allCentresList.find(c => c.id === cData.active_id);
    }
    if (!activeCentre && currentSlug) {
      activeCentre = allCentresList.find(c => c.slug === currentSlug);
    }
    if (!activeCentre && allCentresList.length > 0) {
      activeCentre = allCentresList[0];
    }

    currentCentre = activeCentre;

    if (activeCentre) {
      currentSlug = activeCentre.slug;
      try { localStorage.setItem('pesc_active_centre_slug', activeCentre.slug); } catch (_) {}
      document.title = `${activeCentre.name} – Centre ERP Portal`;
      if ($('#headerCentreName')) $('#headerCentreName').textContent = activeCentre.name;
      if ($('#headerCentreCode')) $('#headerCentreCode').textContent = activeCentre.centre_code;
      if ($('#headerLogo')) $('#headerLogo').textContent = activeCentre.logo_url || '🎓';
    }

    const sel = $('#centreSelectDropdown');
    if (sel && allCentresList.length) {
      sel.innerHTML = allCentresList.map(c => `
        <option value="${c.id}" ${c.id === (activeCentre?.id) ? 'selected' : ''}>
          ${esc(c.name)} (${esc(c.centre_code)})
        </option>
      `).join('');

      sel.onchange = (e) => {
        const cid = +e.target.value;
        if (cid === (activeCentre?.id)) return;
        const targetCentre = allCentresList.find(c => c.id === cid);
        if (!targetCentre) return;

        showSwitchCentrePasswordModal(targetCentre, () => {
          sel.value = activeCentre?.id;
        });
      };
    }
  } catch (err) {
    console.error('Error init centre header:', err);
  }
}

// Modal: Password Verification Required to Switch Centre
function showSwitchCentrePasswordModal(targetCentre, onCancel) {
  const existing = document.getElementById('switchCentreModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'switchCentreModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(5px);padding:16px;';
  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:26px 28px;max-width:440px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1.5px solid #e2e8f0;animation:popIn 0.2s ease;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:46px;height:46px;border-radius:12px;background:#fef2f2;border:1.5px solid #fecaca;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🔒</div>
        <div>
          <h3 style="margin:0;font-size:1.18rem;color:#0f172a;font-weight:800;">Switch Centre Security</h3>
          <p style="margin:2px 0 0;font-size:0.8rem;color:#64748b;">Admin Password Required</p>
        </div>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:16px;">
        <div style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;">Target Centre:</div>
        <div style="font-weight:800;color:#0a2a5e;font-size:1rem;margin-top:2px;">${esc(targetCentre.name)}</div>
        <div style="font-size:0.82rem;color:#0284c7;font-family:monospace;margin-top:2px;">Code: ${esc(targetCentre.centre_code)}</div>
      </div>

      <p style="font-size:0.84rem;color:#475569;margin:0 0 12px;line-height:1.5;">
        सुरक्षा कारणों से, बिना इस सेंटर के पासवर्ड के दूसरा सेंटर नहीं खोला जा सकता। कृपया <b>${esc(targetCentre.name)}</b> का एडमिन पासवर्ड दर्ज करें:
      </p>

      <form id="switchCentrePasswordForm">
        <label style="display:block;font-size:0.82rem;font-weight:700;color:#334155;margin-bottom:6px;">Target Centre Password *</label>
        <input type="password" id="switchCentrePasswordInput" required autofocus placeholder="Enter centre admin password" style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #cbd5e1;border-radius:8px;font-size:0.95rem;outline:none;margin-bottom:8px;">
        <div id="switchCentreErrorMsg" style="display:none;color:#dc2626;font-size:0.84rem;margin-bottom:12px;font-weight:600;padding:6px 10px;background:#fef2f2;border-radius:6px;border:1px solid #fecaca;"></div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button type="button" id="btnCancelSwitchCentre" class="btn alt sm" style="padding:9px 18px;border-radius:6px;">✕ Cancel</button>
          <button type="submit" id="btnConfirmSwitchCentre" class="btn sm" style="background:#0a2a5e;color:#fff;font-weight:700;padding:9px 22px;border-radius:6px;">🔓 Verify &amp; Switch</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#switchCentrePasswordInput');
  setTimeout(() => input?.focus(), 50);

  const closeModal = () => {
    modal.remove();
    if (typeof onCancel === 'function') onCancel();
  };

  modal.querySelector('#btnCancelSwitchCentre').onclick = closeModal;

  modal.querySelector('#switchCentrePasswordForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = modal.querySelector('#btnConfirmSwitchCentre');
    const errDiv = modal.querySelector('#switchCentreErrorMsg');
    const pw = input.value.trim();
    if (!pw) return;

    btn.disabled = true;
    btn.textContent = 'Verifying…';
    errDiv.style.display = 'none';

    try {
      const res = await api('/api/centre/switch-centre', {
        method: 'POST',
        body: { centre_id: targetCentre.id, password: pw }
      });
      if (res?.centre?.slug) {
        try { localStorage.setItem('pesc_active_centre_slug', res.centre.slug); } catch (_) {}
      }
      toast('✅ Password verified! Switched to ' + targetCentre.name);
      modal.remove();
      window.location.reload();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '🔓 Verify & Switch';
      errDiv.textContent = '❌ ' + (err.message || 'Galat Password! Is centre ka password galat hai.');
      errDiv.style.display = 'block';
      input.value = '';
      input.focus();
    }
  };
}


// Authentication & Dashboard Visibility Controls
function showCentreAuthScreen() {
  const authEl = $('#centreAuthContainer');
  const erpEl = $('#erpMainLayout');
  if (erpEl) erpEl.style.display = 'none';
  if (authEl) {
    authEl.style.display = 'flex';
    initAuthForms();
  }
}

function showErpLayout() {
  const authEl = $('#centreAuthContainer');
  const erpEl = $('#erpMainLayout');
  if (authEl) authEl.style.display = 'none';
  if (erpEl) erpEl.style.display = 'block';
}

function initSignOutButton() {
  const btn = $('#btnSignOutCentre');
  if (btn) {
    btn.onclick = async (e) => {
      e.preventDefault();
      try {
        await api('/api/auth/logout', { method: 'POST' });
      } catch (_) {}
      try { localStorage.removeItem('pesc_active_centre_slug'); } catch (_) {}
      toast('Signed out successfully');
      setTimeout(() => { window.location.href = '/portal'; }, 400);
    };
  }
}

let authFormsInitialized = false;
function initAuthForms() {
  if (authFormsInitialized) return;
  authFormsInitialized = true;

  const tabLogin = $('#tabBtnLogin');
  const tabSetup = $('#tabBtnSetup');
  const contentLogin = $('#tabContentLogin');
  const contentSetup = $('#tabContentSetup');
  const notice = $('#authNotice');

  const switchTab = (tab) => {
    if (notice) notice.style.display = 'none';
    if (tab === 'setup') {
      tabSetup.style.background = '#ffffff';
      tabSetup.style.color = '#064e3b';
      tabSetup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#64748b';
      tabLogin.style.boxShadow = 'none';
      contentLogin.style.display = 'none';
      contentSetup.style.display = 'block';
    } else {
      tabLogin.style.background = '#ffffff';
      tabLogin.style.color = '#064e3b';
      tabLogin.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      tabSetup.style.background = 'transparent';
      tabSetup.style.color = '#64748b';
      tabSetup.style.boxShadow = 'none';
      contentSetup.style.display = 'none';
      contentLogin.style.display = 'block';
    }
  };

  if (tabLogin) tabLogin.onclick = () => switchTab('login');
  if (tabSetup) tabSetup.onclick = () => switchTab('setup');
  if ($('#linkGoToSetup')) $('#linkGoToSetup').onclick = (e) => { e.preventDefault(); switchTab('setup'); };
  if ($('#linkBackToLogin')) $('#linkBackToLogin').onclick = (e) => { e.preventDefault(); switchTab('login'); };

  // Password visibility toggle
  const btnToggle = $('#btnToggleLoginPw');
  if (btnToggle) {
    btnToggle.onclick = () => {
      const pwField = $('#loginPassword');
      if (pwField.type === 'password') {
        pwField.type = 'text';
        btnToggle.textContent = '🔒';
      } else {
        pwField.type = 'password';
        btnToggle.textContent = '👁️';
      }
    };
  }

  // Pre-fill or switch tab if URL params indicate setup
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get('code') || params.get('centre_code') || params.get('centre');
  if (params.get('setup') === 'true' || params.get('tab') === 'setup') {
    switchTab('setup');
    if (codeParam && $('#setupIdent')) $('#setupIdent').value = codeParam;
  } else if (codeParam && $('#loginIdent')) {
    $('#loginIdent').value = codeParam;
  }

  // Submit Centre Login
  const formLogin = $('#formCentreLogin');
  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      const ident = $('#loginIdent').value.trim();
      const password = $('#loginPassword').value.trim();
      if (!ident || !password) return;

      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#e0f2fe; color:#0369a1; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Checking credentials...</div>`;

      try {
        const loginRes = await api('/api/auth/login', {
          method: 'POST',
          body: { email: ident, password }
        });

        if (loginRes?.user?.centre_slug) {
          currentSlug = loginRes.user.centre_slug;
          try { localStorage.setItem('pesc_active_centre_slug', currentSlug); } catch (_) {}
        }

        notice.innerHTML = `<div style="background:#dcfce7; color:#15803d; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✓ Centre Login successful! Opening ERP Portal…</div>`;
        toast('Centre Login successful!');

        setTimeout(async () => {
          showErpLayout();
          renderSidebar();
          initStudentLoginModal();
          initSignOutButton();
          await initCentreHeader();
          switchModule('MyStudents');
        }, 500);
      } catch (err) {
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Invalid Centre Code or Password')}</div>`;
      }
    };
  }

  // Step 1: Send OTP to Franchise Mobile
  let currentSetupIdent = '';
  const formSendOtp = $('#formSendSetupOtp');
  if (formSendOtp) {
    formSendOtp.onsubmit = async (e) => {
      e.preventDefault();
      const ident = $('#setupIdent').value.trim();
      if (!ident) return;

      currentSetupIdent = ident;
      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#e0f2fe; color:#0369a1; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Sending 6-digit verification OTP to registered mobile...</div>`;

      try {
        const res = await api('/api/auth/otp/send', {
          method: 'POST',
          body: { identifier: ident }
        });

        notice.style.display = 'none';
        $('#setupStep1').style.display = 'none';
        $('#setupStep2').style.display = 'block';

        const badge = $('#otpSentBadge');
        if (badge) {
          badge.innerHTML = `✓ ${esc(res.message || 'OTP sent successfully!')}` + (res.dev_otp ? `<br><span style="color:#0369a1; font-size:0.8rem; font-weight:700;">[OTP: ${esc(res.dev_otp)}]</span>` : '');
        }

        if (res.dev_otp && $('#setupOtpCode')) {
          $('#setupOtpCode').value = res.dev_otp;
        }

        toast('OTP sent to registered mobile!');
      } catch (err) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Error sending OTP')}</div>`;
      }
    };
  }

  // Step 2: Verify OTP and Set Password
  const formVerifySet = $('#formVerifyAndSetPassword');
  if (formVerifySet) {
    formVerifySet.onsubmit = async (e) => {
      e.preventDefault();
      const otp = $('#setupOtpCode').value.trim();
      const pw = $('#setupPassword').value.trim();
      const confirmPw = $('#setupConfirmPassword').value.trim();

      if (!otp) return;
      if (pw.length < 6) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ Password must be at least 6 characters</div>`;
        return;
      }
      if (pw !== confirmPw) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ Passwords do not match! Please check again.</div>`;
        return;
      }

      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#fef3c7; color:#b45309; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Verifying OTP and activating Centre ERP...</div>`;

      try {
        const res = await api('/api/auth/otp/verify-reset', {
          method: 'POST',
          body: {
            identifier: currentSetupIdent || $('#setupIdent').value.trim(),
            otp,
            new_password: pw
          }
        });

        notice.innerHTML = `<div style="background:#dcfce7; color:#15803d; padding:12px; border-radius:8px; font-weight:700; text-align:center;">🎉 ${esc(res.message || 'OTP Verified! Password created successfully.')}</div>`;
        toast('OTP Verified! Unlocking ERP Dashboard...');

        setTimeout(async () => {
          showErpLayout();
          renderSidebar();
          initStudentLoginModal();
          initSignOutButton();
          await initCentreHeader();
          switchModule('MyStudents');
        }, 900);
      } catch (err) {
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Invalid or expired OTP code')}</div>`;
      }
    };
  }

  // Resend OTP Link
  if ($('#linkResendOtp')) {
    $('#linkResendOtp').onclick = async (e) => {
      e.preventDefault();
      const ident = currentSetupIdent || $('#setupIdent').value.trim();
      if (!ident) return;
      try {
        const res = await api('/api/auth/otp/send', {
          method: 'POST',
          body: { identifier: ident }
        });
        toast('New OTP sent to your registered mobile!');
        const badge = $('#otpSentBadge');
        if (badge) {
          badge.innerHTML = `✓ ${esc(res.message || 'New OTP sent!')}` + (res.dev_otp ? `<br><span style="color:#0369a1; font-size:0.8rem; font-weight:700;">[OTP: ${esc(res.dev_otp)}]</span>` : '');
        }
        if (res.dev_otp && $('#setupOtpCode')) $('#setupOtpCode').value = res.dev_otp;
      } catch (err) {
        toast('Error resending OTP: ' + err.message);
      }
    };
  }

  // Change Mobile Number Link
  if ($('#linkChangeMobile')) {
    $('#linkChangeMobile').onclick = (e) => {
      e.preventDefault();
      $('#setupStep2').style.display = 'none';
      $('#setupStep1').style.display = 'block';
      if (notice) notice.style.display = 'none';
    };
  }

  // Forgot password handler
  if ($('#linkForgotPassword')) {
    $('#linkForgotPassword').onclick = (e) => {
      e.preventDefault();
      switchTab('setup');
    };
  }
}

// Initial Bootstrapping with Strict Authentication Check
guard(async () => {
  try {
    const meRes = await api('/api/auth/me').catch(() => null);
    if (!meRes || !meRes.user || !['centre_owner', 'centre_staff', 'super_admin', 'admin', 'coordinator'].includes(meRes.user.role)) {
      showCentreAuthScreen();
      return;
    }

    if (meRes.user.centre_slug) {
      currentSlug = meRes.user.centre_slug;
      try { localStorage.setItem('pesc_active_centre_slug', currentSlug); } catch (_) {}
    }

    // Authenticated user exists -> open ERP layout
    showErpLayout();
    renderSidebar();
    initStudentLoginModal();
    initSignOutButton();
    await initCentreHeader();
    switchModule('MyStudents');
  } catch (err) {
    showCentreAuthScreen();
  }
});
