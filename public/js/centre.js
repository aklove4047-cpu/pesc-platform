// Purvanchal Education & Skill Council (PESC)
// Authorized Franchise Centre ERP & Management Suite - 17 Modules Complete Implementation

const V = $('#view');
const pathMatch = location.pathname.match(/\/c\/([a-z0-9-]+)/i);
const urlParams = new URLSearchParams(location.search);
const currentSlug = (pathMatch && pathMatch[1]) || urlParams.get('slug') || urlParams.get('centre') || 'navya';

// Intercept all /api/centre requests to ensure slug & header are always provided
const origFetch = window.fetch;
window.fetch = function(url, init = {}) {
  if (typeof url === 'string' && url.startsWith('/api/centre')) {
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
        <button class="btn gold" onclick="switchModule('AddStudent')">➕ Add New Student Admission</button>
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

  // 2. Add Student
  async AddStudent() {
    const cData = await api('/api/centre/courses');
    const courses = cData.courses || [];

    V.innerHTML = `
      <div style="max-width:850px; margin:0 auto; background:#ffffff; border-radius:14px; padding:28px; border:1px solid #e2e8f0; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="border-bottom:1px solid #f1f5f9; padding-bottom:14px; margin-bottom:20px;">
          <h2 style="margin:0 0 6px; color:#064e3b; font-size:1.5rem;">2. Add New Student Admission</h2>
          <p class="muted" style="margin:0;">Register candidate, select course, assign tuition fees, and set default portal login credentials</p>
        </div>

        <form id="addStudentForm" class="row">
          <div style="grid-column: span 2;">
            <label>Student Full Name *</label>
            <input name="name" required placeholder="e.g. Rahul Sharma" style="font-size:1rem; font-weight:600;">
          </div>

          <div>
            <label>Father's / Guardian Name</label>
            <input name="father_name" placeholder="e.g. Ramesh Sharma">
          </div>

          <div>
            <label>Candidate Mobile Number *</label>
            <input name="mobile" pattern="[6-9][0-9]{9}" required placeholder="10-digit mobile number">
          </div>

          <div>
            <label>Candidate Email</label>
            <input name="email" type="email" placeholder="e.g. rahul@example.com">
          </div>

          <div>
            <label>Date of Birth</label>
            <input name="dob" type="date">
          </div>

          <div>
            <label>Enrolled Course *</label>
            <select name="course_id" id="addStudentCourseSelect" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              <option value="">Select a course…</option>
              ${courses.map(co => `<option value="${co.id}" data-fee="${co.selling_price_paise ? Math.round(co.selling_price_paise/100) : 12000}">${esc(co.code)} – ${esc(co.name)} (${co.duration_months} Mos)</option>`).join('')}
            </select>
          </div>

          <div>
            <label>Academic Session</label>
            <input name="session" value="2026-27">
          </div>

          <div>
            <label>Total Course Fee to Charge (₹)</label>
            <input name="fee_total" id="addFeeTotal" type="number" value="12000" style="font-weight:700; color:#064e3b;">
          </div>

          <div>
            <label>Initial Fee Deposited (Jama) (₹)</label>
            <input name="fee_paid" type="number" value="5000" style="font-weight:700; color:#16a34a;">
          </div>

          <div style="grid-column: span 2;">
            <label>Candidate Passport Photo URL / Upload</label>
            <input name="photo_url" placeholder="https://... (or leave blank for default avatar)">
          </div>

          <div style="grid-column: span 2; background:#f0fdf4; border:1px solid #a7f3d0; border-radius:8px; padding:12px 16px; margin-top:8px;">
            <span style="font-weight:700; color:#064e3b;">🔑 Portal Access Notice:</span>
            <p style="margin:4px 0 0; font-size:0.85rem; color:#065f46;">
              Default Student Password will be generated as: <b>Student@123</b>. The candidate can log in using their generated Roll Number.
            </p>
          </div>

          <div style="grid-column: span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
            <button type="button" class="btn alt" onclick="switchModule('MyStudents')">Cancel</button>
            <button type="submit" class="btn gold" style="padding:12px 28px; font-weight:700;">Complete Admission &amp; Register →</button>
          </div>
        </form>
        <div id="addStudentResult" style="margin-top:16px;"></div>
      </div>
    `;

    $('#addStudentCourseSelect').onchange = (e) => {
      const opt = e.target.selectedOptions[0];
      if (opt && opt.dataset.fee) {
        $('#addFeeTotal').value = opt.dataset.fee;
      }
    };

    $('#addStudentForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        payload.course_id = +payload.course_id;
        payload.fee_total = +payload.fee_total || 12000;
        payload.fee_paid = +payload.fee_paid || 0;
        const res = await api('/api/centre/students', { method: 'POST', body: payload });
        $('#addStudentResult').innerHTML = `
          <div style="background:#dcfce7; border:1px solid #86efac; border-radius:10px; padding:18px; margin-top:14px;">
            <h4 style="color:#15803d; margin:0 0 6px;">✅ Student Admission Completed!</h4>
            <p style="margin:0 0 6px; font-size:0.95rem;">Assigned Student Code: <b style="font-family:monospace; background:#fff; padding:2px 8px; border-radius:4px;">${res.student_code}</b></p>
            <p style="margin:0; font-size:0.88rem; color:#166534;">Student can sign in on the Student Login portal with password: <b>${res.initial_password}</b></p>
          </div>
        `;
        toast('Candidate admitted successfully!');
        e.target.reset();
      });
    };
  },

  // 3. My Courses
  async MyCourses() {
    const data = await api('/api/centre/courses');
    const courses = data.courses || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">3. My Courses &amp; Selling Fees</h2>
        <p class="muted" style="margin:0;">Apna Selling Price khud set karega, System Fees change nahi hoti</p>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${courses.map(co => {
          const sysFee = Math.round((co.system_fee_paise || 50000) / 100);
          const sellFee = Math.round((co.selling_price_paise || 800000) / 100);
          const margin = sellFee - sysFee;
          return `
            <div class="card" style="border-top: 4px solid var(--c-green-emerald); padding:20px; background:#fff;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <span class="badge active" style="font-family:monospace; font-weight:800;">${esc(co.code)}</span>
                <span style="font-size:0.8rem; color:#64748b;">⏱️ ${co.duration_months} Months</span>
              </div>
              <h3 style="margin:0 0 10px; font-size:1.2rem; color:#0f172a;">${esc(co.name)}</h3>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span class="muted">Council System Fee (Fixed):</span>
                  <b style="color:#0f172a;">₹${sysFee.toLocaleString('en-IN')}</b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span class="muted">Your Profit Margin:</span>
                  <b style="color:#16a34a;">₹${margin.toLocaleString('en-IN')}</b>
                </div>
              </div>

              <div style="margin-bottom:12px;">
                <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Institute Selling Price (₹):</label>
                <div style="display:flex; gap:8px;">
                  <input type="number" id="priceInput_${co.id}" value="${sellFee}" style="padding:6px 10px; font-weight:700; width:100%; border:1px solid #cbd5e1; border-radius:6px;">
                  <button class="btn sm gold" onclick="saveCoursePrice(${co.id})" style="white-space:nowrap;">💾 Save</button>
                </div>
              </div>

              <span style="font-size:0.78rem; color:#64748b;">👥 Active Enrolled: <b>${co.enrolled_count || 0} Students</b></span>
            </div>
          `;
        }).join('')}
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
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">5. Certificate Printing (3 Print Formats)</h2>
        <p class="muted" style="margin:0;">Option 1: Council Only | Option 2: Institute Only | Option 3: Both Dual Collaboration</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; margin-bottom:24px;">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Enrolled Candidate:</label>
            <select id="certStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Certificate Layout Format:</label>
            <div style="display:flex; gap:8px;">
              <button class="btn gold sm active" id="btnFmtCouncil" onclick="setCertFormat('council')">Option 1: Council Only</button>
              <button class="btn alt sm" id="btnFmtInstitute" onclick="setCertFormat('institute')">Option 2: Institute Only</button>
              <button class="btn alt sm" id="btnFmtDual" onclick="setCertFormat('dual')">Option 3: Both Dual</button>
            </div>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#064e3b; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print Certificate</button>
          </div>
        </div>

        <!-- High-Res Printable Certificate Frame -->
        <div id="certPreviewContainer" class="printable-area" style="background:#ffffff; border:12px double #d4af37; padding:40px; border-radius:10px; max-width:880px; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.08); text-align:center; position:relative;">
          <!-- Dynamically filled by updateCertPreview() -->
        </div>
      </div>
    `;

    $('#certStudentSelect').onchange = updateCertPreview;
    updateCertPreview();
  },

  // 6. Marksheet Printing (Single + Semester wise)
  async MarksheetPrinting() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">6. Marksheet Printing (Single + Semester-Wise)</h2>
        <p class="muted" style="margin:0;">Print Consolidated Single Marksheet OR Detailed Semester-Wise Marksheet</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Candidate:</label>
            <select id="mrkStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Format:</label>
            <div style="display:flex; gap:8px;">
              <button class="btn gold sm active" id="btnMrkSingle" onclick="setMrkFormat('single')">Single Consolidated</button>
              <button class="btn alt sm" id="btnMrkSemester" onclick="setMrkFormat('semester')">Semester-Wise</button>
            </div>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#064e3b; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print Marksheet</button>
          </div>
        </div>

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
        <div class="card" style="background:#ffffff; border-radius:14px; padding:28px; border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 16px; color:#064e3b; font-size:1.25rem;">🏢 Centre Accreditation &amp; Address Details</h3>

          <form id="centreProfileForm" class="row">
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
      </div>
    `;

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
        await api('/api/centre/settings', { method: 'PUT', body: payload });
        toast('Centre profile updated successfully!');
        initCentreHeader();
      });
    };
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
  return table([
    ['Code', (r) => `<b style="font-family:monospace; color:#0f172a;">${esc(r.student_code)}</b>`],
    ['Candidate Name', (r) => `<b>${esc(r.name)}</b>`],
    ['Course', (r) => esc(r.course)],
    ['Total Fees', (r) => `₹${(r.fee_total || 12000).toLocaleString('en-IN')}`],
    ['Paid', (r) => `<span style="color:#16a34a; font-weight:700;">₹${(r.fee_paid || 0).toLocaleString('en-IN')}</span>`],
    ['Pending', (r) => {
      const pend = Math.max(0, (r.fee_total || 12000) - (r.fee_paid || 0));
      return `<span style="color:${pend > 0 ? '#ea580c' : '#16a34a'}; font-weight:700;">₹${pend.toLocaleString('en-IN')}</span>`;
    }],
    ['Actions', (r) => `
      <div style="display:flex; gap:4px; flex-wrap:wrap;">
        <button class="btn sm" style="background:#0284c7; color:#fff;" onclick="quickViewStudent(${r.id})">👁️ View</button>
        <button class="btn sm alt" onclick="printReceipt(${r.id})">🧾 Receipt</button>
        <button class="btn sm gold" onclick="switchModule('CertificatePrinting')">🎓 Cert</button>
      </div>
    `]
  ], students);
}

// Certificate Preview Renderers
let certFormat = 'council';
function setCertFormat(fmt) {
  certFormat = fmt;
  $('#btnFmtCouncil').className = fmt === 'council' ? 'btn gold sm active' : 'btn alt sm';
  $('#btnFmtInstitute').className = fmt === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  $('#btnFmtDual').className = fmt === 'dual' ? 'btn gold sm active' : 'btn alt sm';
  updateCertPreview();
}

function updateCertPreview() {
  const sel = $('#certStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const father = opt.dataset.father;
  const code = opt.dataset.code;
  const course = opt.dataset.course;
  const cName = currentCentre ? currentCentre.name : 'Authorized Training Centre';
  const cDistrict = currentCentre ? currentCentre.district : 'Uttar Pradesh';

  let headerHtml = '';
  if (certFormat === 'council') {
    headerHtml = `
      <div style="font-size:0.9rem; font-weight:800; color:#d4af37; letter-spacing:1px; margin-bottom:4px;">NATIONAL AUTONOMOUS EDUCATION &amp; VOCATIONAL SKILL COUNCIL</div>
      <h1 style="font-size:2rem; color:#064e3b; margin:0 0 4px; font-weight:900;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h1>
      <span style="font-size:0.8rem; color:#64748b;">Regd. Under Indian Public Trust Act 1882 · ISO 9001:2015 Certified · Govt. of India NGO Darpan</span>
    `;
  } else if (certFormat === 'institute') {
    headerHtml = `
      <div style="font-size:0.9rem; font-weight:800; color:#047857; letter-spacing:1px; margin-bottom:4px;">AUTHORIZED TRAINING ACADEMY</div>
      <h1 style="font-size:2.1rem; color:#064e3b; margin:0 0 4px; font-weight:900;">${esc(cName).toUpperCase()}</h1>
      <span style="font-size:0.85rem; color:#64748b;">${esc(cDistrict)} · Affiliated Franchise Centre of PES Council</span>
    `;
  } else {
    headerHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:12px; margin-bottom:12px;">
        <div style="text-align:left;">
          <b style="color:#064e3b; font-size:1.1rem; display:block;">PES COUNCIL (NATIONAL BODY)</b>
          <span style="font-size:0.75rem; color:#64748b;">ISO 9001:2015 Accredited</span>
        </div>
        <div style="font-size:1.5rem;">🤝</div>
        <div style="text-align:right;">
          <b style="color:#047857; font-size:1.1rem; display:block;">${esc(cName)}</b>
          <span style="font-size:0.75rem; color:#64748b;">Authorized Training Academy</span>
        </div>
      </div>
      <span style="font-size:0.85rem; font-weight:700; color:#d4af37; letter-spacing:1px;">JOINT VOCATIONAL SKILL CERTIFICATION</span>
    `;
  }

  $('#certPreviewContainer').innerHTML = `
    ${headerHtml}
    <div style="margin:24px 0 10px; font-size:1.3rem; font-family:serif; font-style:italic; color:#0f172a;">Statement of Skill Proficiency &amp; Completion</div>
    <div style="font-size:0.92rem; color:#475569; margin-bottom:18px;">This is to officially certify that</div>
    
    <div style="font-size:1.8rem; font-weight:900; color:#064e3b; text-decoration:underline; text-decoration-color:#d4af37; margin-bottom:8px;">
      ${esc(name)}
    </div>
    
    <div style="font-size:0.95rem; color:#334155; margin-bottom:16px;">
      Son/Daughter of <b>${esc(father)}</b> · Registration No: <b style="font-family:monospace;">${esc(code)}</b>
    </div>

    <div style="font-size:0.95rem; color:#334155; line-height:1.6; max-width:680px; margin:0 auto 24px;">
      has successfully completed the prescribed curriculum and passed the examination for the professional program:
      <div style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:8px 0;">${esc(course)}</div>
      with <b>Grade A+ (Exemplary Performance)</b> conducted under council quality standards.
    </div>

    <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:20px; margin-top:20px;">
      <div style="text-align:center;">
        <span style="display:block; font-size:0.8rem; color:#64748b;">Date of Issue: ${new Date().toLocaleDateString('en-IN')}</span>
        <span style="font-size:0.8rem; color:#64748b; font-family:monospace;">QR: PESC-VRF-2026</span>
      </div>
      <div style="text-align:center;">
        <div style="font-size:1.4rem;">🔴</div>
        <span style="font-size:0.75rem; font-weight:700; color:#64748b;">Official Mohar / Seal</span>
      </div>
      <div style="text-align:center;">
        <div style="font-family:cursive; font-size:1.1rem; color:#064e3b; margin-bottom:4px;">Dr. R. K. Sharma</div>
        <span style="font-size:0.78rem; font-weight:700; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:2px;">Director / In-charge</span>
      </div>
    </div>
  `;
}

// Marksheet Preview
let mrkFormat = 'single';
function setMrkFormat(fmt) {
  mrkFormat = fmt;
  $('#btnMrkSingle').className = fmt === 'single' ? 'btn gold sm active' : 'btn alt sm';
  $('#btnMrkSemester').className = fmt === 'semester' ? 'btn gold sm active' : 'btn alt sm';
  updateMrkPreview();
}

function updateMrkPreview() {
  const sel = $('#mrkStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const father = opt.dataset.father;
  const code = opt.dataset.code;
  const course = opt.dataset.course;

  let tableContent = '';
  if (mrkFormat === 'single') {
    tableContent = `
      <table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.88rem;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #cbd5e1; padding:8px;">Subject / Module</th>
            <th style="border:1px solid #cbd5e1; padding:8px;">Max Marks</th>
            <th style="border:1px solid #cbd5e1; padding:8px;">Theory</th>
            <th style="border:1px solid #cbd5e1; padding:8px;">Practical</th>
            <th style="border:1px solid #cbd5e1; padding:8px;">Total Obtained</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border:1px solid #cbd5e1; padding:8px;">Computer Concepts &amp; Operating Systems</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">42</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">44</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center; font-weight:bold;">86</td></tr>
          <tr><td style="border:1px solid #cbd5e1; padding:8px;">Office Automation &amp; Productivity Tools</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">40</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">45</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center; font-weight:bold;">85</td></tr>
          <tr><td style="border:1px solid #cbd5e1; padding:8px;">Financial Accounting &amp; Tally Prime GST</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">44</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">46</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center; font-weight:bold;">90</td></tr>
          <tr><td style="border:1px solid #cbd5e1; padding:8px;">Desktop Publishing &amp; Graphics</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">41</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">43</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center; font-weight:bold;">84</td></tr>
          <tr><td style="border:1px solid #cbd5e1; padding:8px;">Lab Project Assignment &amp; Viva Voce</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">43</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">47</td><td style="border:1px solid #cbd5e1; padding:8px; text-align:center; font-weight:bold;">90</td></tr>
        </tbody>
        <tfoot>
          <tr style="background:#ecfdf5; font-weight:bold;">
            <td style="border:1px solid #cbd5e1; padding:8px;">Grand Total:</td>
            <td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">500</td>
            <td colspan="2" style="border:1px solid #cbd5e1; padding:8px; text-align:center;">Percentage: 87.0%</td>
            <td style="border:1px solid #cbd5e1; padding:8px; text-align:center; color:#16a34a; font-size:1.05rem;">435 (PASS)</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else {
    tableContent = `
      <div style="font-weight:700; color:#064e3b; margin:12px 0 6px;">SEMESTER - I EVALUATION:</div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:0.84rem;">
        <tr style="background:#f8fafc;"><th style="border:1px solid #cbd5e1; padding:6px;">Paper</th><th style="border:1px solid #cbd5e1; padding:6px;">Max</th><th style="border:1px solid #cbd5e1; padding:6px;">Obtained</th><th style="border:1px solid #cbd5e1; padding:6px;">Grade</th></tr>
        <tr><td style="border:1px solid #cbd5e1; padding:6px;">IT Fundamentals &amp; MS Windows</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">88</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center; color:#16a34a; font-weight:bold;">A+</td></tr>
        <tr><td style="border:1px solid #cbd5e1; padding:6px;">MS Word, Excel, PowerPoint &amp; Access</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">85</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center; color:#16a34a; font-weight:bold;">A+</td></tr>
      </table>

      <div style="font-weight:700; color:#064e3b; margin:12px 0 6px;">SEMESTER - II EVALUATION:</div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:0.84rem;">
        <tr style="background:#f8fafc;"><th style="border:1px solid #cbd5e1; padding:6px;">Paper</th><th style="border:1px solid #cbd5e1; padding:6px;">Max</th><th style="border:1px solid #cbd5e1; padding:6px;">Obtained</th><th style="border:1px solid #cbd5e1; padding:6px;">Grade</th></tr>
        <tr><td style="border:1px solid #cbd5e1; padding:6px;">Tally Prime with Advanced GST</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">92</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center; color:#16a34a; font-weight:bold;">O</td></tr>
        <tr><td style="border:1px solid #cbd5e1; padding:6px;">Desktop Publishing (Photoshop &amp; Corel)</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">100</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">86</td><td style="border:1px solid #cbd5e1; padding:6px; text-align:center; color:#16a34a; font-weight:bold;">A+</td></tr>
      </table>
    `;
  }

  $('#mrkPreviewContainer').innerHTML = `
    <div style="text-align:center; border-bottom:2px solid #0f172a; padding-bottom:10px; margin-bottom:14px;">
      <h2 style="margin:0 0 4px; color:#064e3b;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
      <div style="font-size:0.88rem; font-weight:bold; color:#d4af37;">OFFICIAL STATEMENT OF MARKS · SESSION 2026-27</div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.88rem; margin-bottom:14px; background:#f8fafc; padding:10px; border-radius:6px;">
      <div>Candidate Name: <b>${esc(name)}</b></div>
      <div>Roll No / Student Code: <b style="font-family:monospace;">${esc(code)}</b></div>
      <div>Father's Name: <b>${esc(father)}</b></div>
      <div>Course: <b>${esc(course)}</b></div>
    </div>

    ${tableContent}

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:10px; border-top:1px dashed #cbd5e1; font-size:0.82rem;">
      <span>Result: <b style="color:#16a34a;">PASSED WITH DISTINCTION</b></span>
      <span>QR Verified: <b style="font-family:monospace;">PESC-MRK-2026-OK</b></span>
      <span>Controller of Examinations</span>
    </div>
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

  $('#semCertPreview').innerHTML = `
    <h1 style="color:#064e3b; margin:0 0 6px;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h1>
    <span style="font-size:0.88rem; font-weight:700; color:#d4af37; letter-spacing:1px;">CUMULATIVE SEMESTER DIPLOMA CERTIFICATE</span>

    <p style="margin:20px 0 10px; font-size:1.1rem;">This diploma is awarded to</p>
    <div style="font-size:2rem; font-weight:900; color:#064e3b; text-decoration:underline;">${esc(name)}</div>
    <div style="font-size:0.9rem; color:#64748b; margin-top:4px;">Roll Number: <b>${esc(code)}</b></div>

    <p style="margin:16px 0; font-size:0.95rem;">for successfully completing all terms of <b>${esc(course)}</b> with semester scores:</p>

    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; max-width:600px; margin:0 auto 24px; font-size:0.9rem;">
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.8rem;">Semester - I</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.8rem;">Semester - II</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; padding:10px; border-radius:8px;">
        <span style="color:#064e3b; display:block; font-size:0.8rem;">Overall Result</span>
        <b style="color:#064e3b; font-size:1.2rem;">DISTINCTION</b>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:flex-end; padding-top:20px; border-top:1px dashed #cbd5e1;">
      <span>Verified Online: pescouncil.in</span>
      <span>Authorized Academic Signatory</span>
    </div>
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

// Course Selling Price update
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
    const activeCentre = allCentresList.find(c => c.id === cData.active_id) || allCentresList[0];
    currentCentre = activeCentre;

    if (activeCentre) {
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
        guard(async () => {
          await api('/api/centre/switch-centre', {
            method: 'POST',
            body: { centre_id: cid }
          });
          toast('Switched to centre workspace!');
          window.location.reload();
        });
      };
    }
  } catch (err) {
    console.error('Error init centre header:', err);
  }
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
        await api('/api/auth/login', {
          method: 'POST',
          body: { email: ident, password }
        });

        notice.innerHTML = `<div style="background:#dcfce7; color:#15803d; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✓ Centre Login successful! Opening ERP Portal…</div>`;
        toast('Centre Login successful!');

        setTimeout(async () => {
          showErpLayout();
          renderSidebar();
          initStudentLoginModal();
          initSignOutButton();
          await initCentreHeader();
          switchModule('MyStudents');
        }, 600);
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
