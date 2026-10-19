const V = $('#view');
const ask = (msg) => { const r = prompt(msg); return r && r.trim() ? r.trim() : null; };

const views = {
  async Dashboard() {
    const s = await api('/api/admin/stats');
    V.innerHTML = `
      <h2>Executive Dashboard</h2>
      <div class="grid">
        <div class="stat"><span>Active Centres</span><b>${s.centres.active}</b></div>
        <div class="stat"><span>Suspended</span><b>${s.centres.suspended}</b></div>
        <div class="stat"><span>Provisioning Failed</span><b>${s.centres.failed}</b></div>
        <div class="stat"><span>Applications Pending</span><b>${s.applications_pending}</b></div>
        <div class="stat"><span>Enrolled Students</span><b>${s.students}</b></div>
        <div class="stat"><span>Certificates Pending</span><b>${s.certificates.pending}</b></div>
        <div class="stat"><span>Certificates Valid</span><b>${s.certificates.valid}</b></div>
        <div class="stat"><span>Council Wallet Balances</span><b>${inr(s.wallet_total_paise)}</b></div>
      </div>
    `;
  },

  async Applications() {
    const { applications } = await api('/api/admin/applications');
    V.innerHTML = '<h2>Franchise Applications Management</h2>' + table([
      ['No.', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.app_no)}</b>`],
      ['Applicant', (r) => `<b>${esc(r.owner_name)}</b><br><span class="muted">${esc(r.email)} · ${esc(r.mobile)}</span>`],
      ['Centre & Subdomain', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.slug)}.pescouncil.in · ${esc(r.district)}</span>`],
      ['Status', (r) => badge(r.status)],
      ['Provisioning Status', (r) => r.job_id ? `${badge(r.job_status)}${r.job_error ? `<br><span class="muted">${esc(r.job_error)}</span>` : ''}<br>` + (r.log || []).map((l) => `<span class="muted">${l.ok ? '✓' : '✗'} ${esc(l.step)}: ${esc(l.detail)}</span>`).join('<br>') : '—'],
      ['Actions', (r) => `
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          ${['Submitted', 'Under Review', 'Documents Required'].includes(r.status) ? `
            <button class="btn sm" data-a="approve" data-id="${r.id}">Approve &amp; Provision</button>
            <button class="btn sm alt" data-a="review" data-id="${r.id}">Review</button>
            <button class="btn sm alt" data-a="docs" data-id="${r.id}">Docs Needed</button>
            <button class="btn sm danger" data-a="reject" data-id="${r.id}">Reject</button>
          ` : r.job_status === 'failed' ? `<button class="btn sm gold" data-a="approve" data-id="${r.id}">Retry Provisioning</button>` : '—'}
        </div>
      `],
    ], applications, 'No franchise applications yet.');
  },

  async Centres() {
    const [{ centres }, { courses }, { coordinators }] = await Promise.all([
      api('/api/admin/centres'),
      api('/api/admin/courses'),
      api('/api/admin/coordinators'),
    ]);
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
        <div>
          <h2>Affiliated Centres Management</h2>
          <p class="muted">Manage accredited computer centres, assign vocational courses, and appoint regional coordinators</p>
        </div>
      </div>
      ${table([
        ['Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.centre_code)}</b>`],
        ['Centre Name', (r) => `<b>${esc(r.name)}</b>`],
        ['Subdomain', (r) => `<a href="http://${esc(r.slug)}.localhost:3000" target="_blank" class="muted" style="text-decoration:underline;">${esc(r.slug)}</a>`],
        ['Location', (r) => `${esc(r.district)}, ${esc(r.state)}`],
        ['Students', (r) => `<b>${r.students}</b>`],
        ['Status', (r) => badge(r.status)],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${r.status === 'active' ? `<button class="btn sm danger" data-a="suspend" data-id="${r.id}">Suspend</button>` : r.status === 'suspended' ? `<button class="btn sm" data-a="unsuspend" data-id="${r.id}">Activate</button>` : ''}
            <button class="btn sm alt" data-a="courses" data-id="${r.id}">Assign Courses</button>
            ${coordinators.length ? `<button class="btn sm alt" data-a="coord" data-id="${r.id}">Coordinator</button>` : ''}
          </div>
        `],
      ], centres)}

      <h3 style="margin-top:28px;">⚡ Quick Onboard Centre (Offline Affiliation / Direct MOU)</h3>
      <p class="muted" style="margin-bottom:12px;">Instantly provision an active centre, create the owner account, assign courses, and pre-fund council wallet.</p>
      <form id="centreDirectForm" class="row">
        <div><label>Centre Name *</label><input name="name" required maxlength="150" placeholder="e.g. Modern Skill Academy"></div>
        <div><label>Owner / Director Name *</label><input name="owner_name" required maxlength="100" placeholder="e.g. Sunil Kumar"></div>
        <div><label>Owner Email ID *</label><input name="email" type="email" required placeholder="sunil@modernskill.in"></div>
        <div><label>Mobile Number *</label><input name="mobile" required placeholder="9876543210"></div>
        <div><label>State *</label><input name="state" required value="Uttar Pradesh"></div>
        <div><label>District *</label><input name="district" required placeholder="e.g. Lucknow"></div>
        <div><label>Requested Subdomain *</label><input name="slug" required placeholder="e.g. modernskill"></div>
        <div><label>Initial Wallet Credit (₹)</label><input name="initial_credit_rupees" type="number" min="0" value="10000"></div>
        <div><label>Temporary Password</label><input name="password" value="Centre@12345"></div>
        <div style="align-self:end;"><button class="btn gold">⚡ Create &amp; Activate Centre</button></div>
      </form>
    `;
    V._courses = courses;
    V._coords = coordinators;
  },

  async Courses() {
    const { courses } = await api('/api/admin/courses');
    V.innerHTML = `
      <h2>Affiliated Courses Catalog</h2>
      ${table([
        ['ID', (r) => r.id],
        ['Course Code', (r) => `<b style="font-family:monospace;">${esc(r.code)}</b>`],
        ['Course Title', (r) => `<b>${esc(r.name)}</b>`],
        ['Duration', (r) => `${r.duration_months} Months`],
        ['Course Fee', (r) => inr(r.fee_paise)],
      ], courses)}

      <h3 style="margin-top:28px;">Add New Skill Course</h3>
      <form id="cf" class="row">
        <div><label>Course Code (e.g. DCA, PGDCA) *</label><input name="code" required maxlength="20"></div>
        <div><label>Course Name *</label><input name="name" required maxlength="120"></div>
        <div><label>Duration in Months *</label><input name="duration_months" type="number" min="1" required></div>
        <div><label>Course Fee (₹) *</label><input name="fee_rupees" type="number" min="0" required></div>
        <div style="align-self:end;"><button class="btn">Create Course</button></div>
      </form>
    `;
  },

  async Marksheets() {
    const data = await api('/api/marksheets/pending');
    const list = data.marksheets;

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2>Marksheet Approvals Queue</h2>
          <p class="muted">Review examination scores entered by centres and authorize official statements of marks</p>
        </div>
        <span class="badge ${list.length ? 'Pending' : 'Approved'}">${list.length} Pending</span>
      </div>

      ${table([
        ['Candidate', (r) => `<b>${esc(r.student_name)}</b><br><span class="muted">${esc(r.student_code)} · Roll: ${esc(r.roll_no)}</span>`],
        ['Course & Centre', (r) => `<b>${esc(r.course_name)}</b><br><span class="muted">${esc(r.centre_name)} (${esc(r.centre_code)})</span>`],
        ['Score', (r) => `<b>${r.total_obtained} / ${r.total_max}</b> (${r.percentage}%)`],
        ['Grade', (r) => `<b>${esc(r.grade)}</b>`],
        ['Result', (r) => badge(r.result)],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px;">
            <button class="btn sm" data-a="mapprove" data-id="${r.id}">Approve</button>
            <button class="btn sm danger" data-a="mreject" data-id="${r.id}">Reject</button>
          </div>
        `],
      ], list, 'No marksheets pending council approval.')}
    `;
  },

  async Certificates() {
    const { certificates } = await api('/api/certificates/pending');
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2>Pending Certificates Queue</h2>
          <p class="muted">Authorize course completion certificates and generate unguessable verification QR tokens</p>
        </div>
        <span class="badge ${certificates.length ? 'Pending' : 'Approved'}">${certificates.length} Pending</span>
      </div>

      ${table([
        ['Candidate', (r) => `<b>${esc(r.student_name)}</b><br><span class="muted">${esc(r.student_code)}</span>`],
        ['Course', (r) => esc(r.course_name)],
        ['Centre', (r) => `${esc(r.centre_name)} (${esc(r.centre_code)})`],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px;">
            <button class="btn sm" data-a="capprove" data-id="${r.id}">Approve &amp; Issue</button>
            <button class="btn sm danger" data-a="creject" data-id="${r.id}">Reject</button>
          </div>
        `],
      ], certificates, 'No pending certificates.')}
    `;
  },

  async Coordinators() {
    const { coordinators } = await api('/api/admin/coordinators');
    V.innerHTML = `
      <h2>Regional Coordinators</h2>
      ${table([
        ['Name', (r) => `<b>${esc(r.name)}</b>`],
        ['Email', (r) => esc(r.email)],
        ['Jurisdiction State', (r) => esc(r.state || 'All')],
        ['Status', (r) => badge(r.status)],
      ], coordinators)}

      <h3 style="margin-top:28px;">Appoint New Regional Coordinator</h3>
      <p class="muted" style="margin-bottom:12px;">Coordinators receive a secure one-time setup activation link via email.</p>
      <form id="kf" class="row">
        <div><label>Full Name *</label><input name="name" required maxlength="100"></div>
        <div><label>Email Address *</label><input name="email" type="email" required></div>
        <div><label>Assigned State *</label><input name="state" required value="Uttar Pradesh"></div>
        <div style="align-self:end;"><button class="btn">Send Setup Invitation</button></div>
      </form>
    `;
  },

  async Reports() {
    V.innerHTML = `
      <h2>Central Council Reports & CSV Exports</h2>
      <p class="muted">Download Excel-compatible CSV exports and view analytics across all centres, courses, and operations</p>

      <div class="grid" style="margin-top:20px;">
        <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
          <h3 style="margin-bottom:6px;">Student Admissions</h3>
          <p class="muted" style="margin-bottom:14px;">Complete student registration and enrollment database</p>
          <div style="display:flex; gap:8px;">
            <button class="btn sm" id="btnAdminAdm">View Report</button>
            <a href="/api/reports/admissions?format=csv" class="btn sm alt">📥 Download CSV</a>
          </div>
        </div>

        <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
          <h3 style="margin-bottom:6px;">Marksheets & Academic Results</h3>
          <p class="muted" style="margin-bottom:14px;">Evaluations, pass percentages, grades, and divisions</p>
          <div style="display:flex; gap:8px;">
            <button class="btn sm" id="btnAdminMrk">View Report</button>
            <a href="/api/reports/marksheets?format=csv" class="btn sm alt">📥 Download CSV</a>
          </div>
        </div>

        <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
          <h3 style="margin-bottom:6px;">Certificates Issued</h3>
          <p class="muted" style="margin-bottom:14px;">Valid and issued certificate registry</p>
          <div style="display:flex; gap:8px;">
            <button class="btn sm" id="btnAdminCert">View Report</button>
            <a href="/api/reports/certificates?format=csv" class="btn sm alt">📥 Download CSV</a>
          </div>
        </div>

        <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
          <h3 style="margin-bottom:6px;">Centres Growth & Performance</h3>
          <p class="muted" style="margin-bottom:14px;">Centre student counts, valid certificates, wallet balances</p>
          <div style="display:flex; gap:8px;">
            <button class="btn sm" id="btnAdminCent">View Report</button>
            <a href="/api/reports/centres?format=csv" class="btn sm alt">📥 Download CSV</a>
          </div>
        </div>

        <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
          <h3 style="margin-bottom:6px;">Financial & Wallet Ledger</h3>
          <p class="muted" style="margin-bottom:14px;">Recharges, deductions, balance history, and revenue</p>
          <div style="display:flex; gap:8px;">
            <button class="btn sm" id="btnAdminFin">View Report</button>
            <a href="/api/reports/financials?format=csv" class="btn sm alt">📥 Download CSV</a>
          </div>
        </div>
      </div>

      <div id="adminRepBox" style="margin-top:24px;"></div>
    `;

    $('#btnAdminAdm').onclick = async () => {
      const d = await api('/api/reports/admissions');
      $('#adminRepBox').innerHTML = `
        <h3>Admissions Report (${d.count} records)</h3>
        ${table([
          ['Code', (r) => esc(r.student_code)],
          ['Name', (r) => esc(r.name)],
          ['Course', (r) => esc(r.course_name)],
          ['Centre', (r) => `${esc(r.centre_name)} (${esc(r.centre_code)})`],
          ['Admission Date', (r) => date(r.created_at)],
          ['Status', (r) => badge(r.status)],
        ], d.admissions)}
      `;
    };

    $('#btnAdminMrk').onclick = async () => {
      const d = await api('/api/reports/marksheets');
      $('#adminRepBox').innerHTML = `
        <h3>Marksheets Report (${d.count} records)</h3>
        ${table([
          ['Marksheet No', (r) => esc(r.marksheet_no || 'Pending')],
          ['Candidate', (r) => `${esc(r.student_name)} (${esc(r.student_code)})`],
          ['Centre', (r) => esc(r.centre_name)],
          ['Course', (r) => esc(r.course_name)],
          ['Score', (r) => `${r.total_obtained}/${r.total_max} (${r.percentage}%)`],
          ['Grade', (r) => esc(r.grade)],
          ['Result', (r) => badge(r.result)],
          ['Status', (r) => badge(r.status)],
        ], d.marksheets)}
      `;
    };

    $('#btnAdminCert').onclick = async () => {
      const d = await api('/api/reports/certificates');
      $('#adminRepBox').innerHTML = `
        <h3>Certificates Report (${d.count} records)</h3>
        ${table([
          ['Cert No', (r) => esc(r.cert_no || 'Pending')],
          ['Candidate', (r) => `${esc(r.student_name)} (${esc(r.student_code)})`],
          ['Centre', (r) => esc(r.centre_name)],
          ['Course', (r) => esc(r.course_name)],
          ['Date', (r) => date(r.issued_at || r.created_at)],
          ['Status', (r) => badge(r.status)],
        ], d.certificates)}
      `;
    };

    $('#btnAdminCent').onclick = async () => {
      const d = await api('/api/reports/centres');
      $('#adminRepBox').innerHTML = `
        <h3>Centres Directory & Metrics (${d.count} records)</h3>
        ${table([
          ['Code', (r) => esc(r.centre_code)],
          ['Centre Name', (r) => esc(r.name)],
          ['Owner', (r) => `${esc(r.owner_name)} (${esc(r.owner_mobile)})`],
          ['Students', (r) => r.total_students],
          ['Certificates', (r) => r.valid_certs],
          ['Marksheets', (r) => r.approved_marksheets],
          ['Wallet Balance', (r) => inr(r.wallet_paise)],
          ['Status', (r) => badge(r.status)],
        ], d.centres)}
      `;
    };

    $('#btnAdminFin').onclick = async () => {
      const d = await api('/api/reports/financials');
      $('#adminRepBox').innerHTML = `
        <h3>Financial Ledger Transactions (${d.count} records)</h3>
        ${table([
          ['Centre', (r) => `${esc(r.centre_name)} (${esc(r.centre_code)})`],
          ['Type', (r) => `<span class="badge ${r.kind === 'credit' ? 'Valid' : 'Revoked'}">${r.kind.toUpperCase()}</span>`],
          ['Amount', (r) => inr(r.amount_paise)],
          ['Balance After', (r) => inr(r.balance_after)],
          ['Reference', (r) => `<span style="font-family:monospace; font-size:0.8rem;">${esc(r.reference)}</span>`],
          ['Date', (r) => date(r.created_at)],
        ], d.transactions)}
      `;
    };
  },

  async Students() {
    const [{ students }, { centres }, { courses }] = await Promise.all([
      api('/api/admin/students'),
      api('/api/admin/centres'),
      api('/api/admin/courses'),
    ]);
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
        <div>
          <h2>All India Enrolled Candidates</h2>
          <p class="muted">Central student registry across all affiliated franchise centres</p>
        </div>
        <span class="badge active">${students.length} Total Enrolled</span>
      </div>
      ${table([
        ['Student Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
        ['Candidate Name', (r) => `<b>${esc(r.name)}</b><br><span class="muted">Father: ${esc(r.father_name || '—')}</span>`],
        ['Course', (r) => `<b>${esc(r.course_code || '')}</b> - ${esc(r.course_name)}`],
        ['Affiliated Centre', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.centre_code)}</span>`],
        ['Contact', (r) => `${esc(r.mobile || '—')}<br><span class="muted">${esc(r.email || '—')}</span>`],
        ['Status', (r) => badge(r.status)],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn sm gold" data-a="c_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}">📜 Direct Issue Cert</button>
            <button class="btn sm gold" data-a="m_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}">📊 Direct Issue Marksheet</button>
            ${r.user_id ? `<button class="btn sm alt" data-a="resetpw" data-id="${r.user_id}" data-name="${esc(r.name)}">Reset Pass</button>` : ''}
            <a href="/student" target="_blank" class="btn sm" style="text-decoration:none;">Student View</a>
          </div>
        `],
      ], students, 'No students registered across centres yet.')}

      <h3 style="margin-top:28px;">➕ Direct Candidate Enrolment (Head Office Admission)</h3>
      <p class="muted" style="margin-bottom:12px;">Enrol a student directly into any affiliated centre with immediate portal access.</p>
      <form id="studentDirectForm" class="row">
        <div>
          <label>Select Affiliated Centre *</label>
          <select name="centre_id" required>
            ${centres.map(c => `<option value="${c.id}">${esc(c.name)} (${esc(c.centre_code)}) - ${esc(c.district)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Select Vocational Course *</label>
          <select name="course_id" required>
            ${courses.map(co => `<option value="${co.id}">${esc(co.code)} - ${esc(co.name)} (${co.duration_months} M)</option>`).join('')}
          </select>
        </div>
        <div><label>Candidate Full Name *</label><input name="name" required maxlength="100" placeholder="e.g. Priya Sharma"></div>
        <div><label>Father's Name</label><input name="father_name" maxlength="100" placeholder="e.g. Ramesh Sharma"></div>
        <div><label>Mobile Number</label><input name="mobile" placeholder="9876543210"></div>
        <div><label>Email Address</label><input name="email" type="email" placeholder="priya@example.com"></div>
        <div><label>Date of Birth</label><input name="dob" type="date"></div>
        <div><label>Academic Session</label><input name="session" value="2026-27"></div>
        <div><label>Portal Password</label><input name="password" value="Student@123"></div>
        <div style="align-self:end;"><button class="btn gold">Enrol Student</button></div>
      </form>
    `;
  },

  async Notices() {
    const { notices } = await api('/api/admin/notices');
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
        <div>
          <h2>Council Notice Board & Announcements</h2>
          <p class="muted">Publish official circulars, examination schedules, and affiliation updates to website ticker and portals</p>
        </div>
      </div>
      ${table([
        ['Category', (r) => `<span class="badge ${r.pinned ? 'Valid' : 'Pending'}">${esc(r.category)}</span>`],
        ['Title & Content', (r) => `<b>${esc(r.title)}</b><br><span class="muted">${esc(r.content)}</span>${r.link ? `<br><a href="${esc(r.link)}" target="_blank" style="color:#2563eb; font-size:0.8rem;">🔗 ${esc(r.link)}</a>` : ''}`],
        ['Audience', (r) => `<span style="text-transform:capitalize;">${esc(r.target)}</span>`],
        ['Pinned', (r) => r.pinned ? '📌 Yes' : 'No'],
        ['Status', (r) => r.active ? `<span class="badge Valid">Active</span>` : `<span class="badge Rejected">Hidden</span>`],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px;">
            <button class="btn sm alt" data-a="notice_toggle" data-id="${r.id}">${r.active ? 'Hide' : 'Activate'}</button>
            <button class="btn sm danger" data-a="notice_del" data-id="${r.id}">Delete</button>
          </div>
        `],
      ], notices, 'No circulars or notices published yet.')}

      <h3 style="margin-top:28px;">📢 Publish New Council Notice / Announcement</h3>
      <form id="noticeForm" class="row">
        <div><label>Notice Headline / Title *</label><input name="title" required maxlength="200" placeholder="e.g. Schedule for Annual Vocational Exams 2026"></div>
        <div>
          <label>Category *</label>
          <select name="category" required>
            <option value="General">General Notice</option>
            <option value="Affiliation">Franchise & Affiliation</option>
            <option value="Examination">Examination & Results</option>
            <option value="Academic">Academic Curriculum</option>
            <option value="Event">Council Event / Seminar</option>
          </select>
        </div>
        <div>
          <label>Target Audience *</label>
          <select name="target" required>
            <option value="all">Everyone (Website Ticker + All Portals)</option>
            <option value="public">Public Website Only</option>
            <option value="centres">Affiliated Centres Only</option>
            <option value="students">Students Only</option>
          </select>
        </div>
        <div><label>Action Link (Optional)</label><input name="link" placeholder="e.g. #apply or #verify"></div>
        <div style="display:flex; align-items:center; gap:8px; margin-top:24px;">
          <label style="cursor:pointer; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" name="pinned" value="1" style="width:auto;"> Pin to top of Notice Board
          </label>
        </div>
        <div style="grid-column: span 2;"><label>Full Announcement Details *</label><textarea name="content" rows="3" required placeholder="Enter the official notification circular text here…"></textarea></div>
        <div style="align-self:end;"><button class="btn gold">📢 Publish Announcement</button></div>
      </form>
    `;
  },

  async Wallets() {
    const { wallets } = await api('/api/admin/wallets');
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
        <div>
          <h2>Centre Digital Wallets & Financial Balances</h2>
          <p class="muted">Directly credit and monitor centre digital wallets for course affiliations & certificate issuance</p>
        </div>
      </div>
      ${table([
        ['Code', (r) => `<b style="font-family:monospace;">${esc(r.centre_code)}</b>`],
        ['Centre Name', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.district)}, ${esc(r.state)}</span>`],
        ['Wallet Balance', (r) => `<b style="font-size:1.15rem; color:#15803d;">${inr(r.balance_paise)}</b>`],
        ['Status', (r) => badge(r.centre_status)],
        ['Actions', (r) => `
          <button class="btn sm gold" data-a="wallet_adj" data-id="${r.centre_id}" data-name="${esc(r.centre_name)}">⚡ Add / Credit Balance</button>
        `],
      ], wallets, 'No centre wallets found.')}
    `;
  },

  async Audit() {
    const { logs } = await api('/api/admin/audit?size=50');
    V.innerHTML = '<h2>Security Audit Log</h2>' + table([
      ['When', (r) => new Date(r.at).toLocaleString('en-IN')],
      ['User', (r) => r.user_id ?? '—'],
      ['Role', (r) => esc(r.role)],
      ['Action', (r) => esc(r.action)],
      ['Entity', (r) => esc(`${r.entity || ''} ${r.entity_id || ''}`)],
      ['Result', (r) => esc(r.result)],
      ['Reason', (r) => esc(r.reason)],
    ], logs);
  },
};

let current = 'Dashboard';
const show = (n) => {
  current = n;
  return guard(() => views[n]());
};

V.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const id = b.dataset.id;
  const a = b.dataset.a;

  guard(async () => {
    const post = (p, body = {}) => api(p, { method: 'POST', body });
    if (a === 'approve') {
      const r = await api(`/api/admin/applications/${id}/approve`, { method: 'POST' }).catch((x) => {
        if (x.data && x.data.step) throw new Error(`Failed at ${x.data.step}: ${x.data.error}`);
        throw x;
      });
      toast('Centre provisioned successfully!');
    } else if (a === 'review') {
      await post(`/api/admin/applications/${id}/status`, { status: 'Under Review' });
    } else if (a === 'docs') {
      const r = ask('What documents are needed?');
      if (!r) return;
      await post(`/api/admin/applications/${id}/status`, { status: 'Documents Required', reason: r });
    } else if (a === 'reject') {
      const r = ask('Rejection reason (shown to applicant)');
      if (!r) return;
      await post(`/api/admin/applications/${id}/status`, { status: 'Rejected', reason: r });
    } else if (a === 'suspend' || a === 'unsuspend') {
      const r = ask('Reason (audited)');
      if (!r) return;
      await post(`/api/admin/centres/${id}/${a === 'suspend' ? 'suspend' : 'activate'}`, { reason: r });
    } else if (a === 'courses') {
      const ids = ask('Course IDs, comma separated:\n' + V._courses.map((c) => `${c.id} = ${c.code} (${c.name})`).join('\n'));
      if (ids === null) return;
      await post(`/api/admin/centres/${id}/courses`, { course_ids: ids.split(',').map((x) => +x.trim()) });
    } else if (a === 'coord') {
      const c = ask('Coordinator ID:\n' + V._coords.map((c) => `${c.id} = ${c.name} (${c.state || 'All'})`).join('\n'));
      if (!c) return;
      await post(`/api/admin/centres/${id}/coordinator`, { coordinator_id: +c });
    } else if (a === 'capprove') {
      await post(`/api/certificates/${id}/decision`, { decision: 'approve' });
      toast('Certificate issued!');
    } else if (a === 'creject') {
      const r = ask('Rejection reason');
      if (!r) return;
      await post(`/api/certificates/${id}/decision`, { decision: 'reject', reason: r });
    } else if (a === 'mapprove') {
      await post(`/api/marksheets/${id}/decision`, { decision: 'approve' });
      toast('Marksheet approved and issued!');
    } else if (a === 'mreject') {
      const r = ask('Rejection reason');
      if (!r) return;
      await post(`/api/marksheets/${id}/decision`, { decision: 'reject', reason: r });
    } else if (a === 'wallet_adj') {
      const amt = ask(`Enter amount in Rupees (₹) to credit to ${b.dataset.name}:`);
      if (!amt || isNaN(amt) || +amt <= 0) return;
      const note = ask('Enter note/reason (e.g. Offline Payment / Promotion credit):') || 'Head Office Balance Credit';
      await post(`/api/admin/wallets/${id}/adjust`, { kind: 'credit', amount_rupees: +amt, reason: note });
      toast(`Successfully credited ₹${amt} to centre wallet!`);
    } else if (a === 'resetpw') {
      const np = ask(`Enter new password for ${b.dataset.name} (minimum 6 characters):`) || 'Pesc#2026';
      await post(`/api/admin/users/${id}/reset-password`, { password: np });
      toast(`Password updated to: ${np}`);
    } else if (a === 'c_direct_issue') {
      if (!confirm(`Issue official verified certificate immediately for candidate ${b.dataset.name}?`)) return;
      const res = await post('/api/admin/certificates/direct-issue', { student_id: +id });
      toast(`Certificate issued: ${res.cert_no}!`);
    } else if (a === 'm_direct_issue') {
      const obt = ask(`Enter total marks obtained (out of 400) for candidate ${b.dataset.name}:`) || '340';
      if (isNaN(obt) || +obt <= 0 || +obt > 400) return alert('Invalid score. Must be 1 to 400.');
      const res = await post('/api/admin/marksheets/direct-issue', { student_id: +id, total_max: 400, total_obtained: +obt });
      toast(`Marksheet issued: ${res.marksheet_no} (${res.percentage}% Grade ${res.grade})!`);
    } else if (a === 'notice_toggle') {
      await post(`/api/admin/notices/${id}/toggle`);
      toast('Notice status updated!');
    } else if (a === 'notice_del') {
      if (!confirm('Are you sure you want to permanently delete this announcement?')) return;
      await api(`/api/admin/notices/${id}`, { method: 'DELETE' });
      toast('Notice deleted!');
    }
    toast('Action completed');
    await views[current]();
  });
});

V.addEventListener('submit', (e) => {
  e.preventDefault();
  guard(async () => {
    if (e.target.id === 'cf') await api('/api/admin/courses', { method: 'POST', body: form(e.target) });
    if (e.target.id === 'kf') await api('/api/admin/coordinators', { method: 'POST', body: form(e.target) });
    if (e.target.id === 'centreDirectForm') {
      const r = await api('/api/admin/centres/direct-create', { method: 'POST', body: form(e.target) });
      toast(`Centre ${r.centreCode} created successfully! Subdomain: ${r.slug}`);
    }
    if (e.target.id === 'studentDirectForm') {
      const r = await api('/api/admin/students/direct-enroll', { method: 'POST', body: form(e.target) });
      toast(`Student enrolled successfully! Code: ${r.studentCode}`);
    }
    if (e.target.id === 'noticeForm') {
      await api('/api/admin/notices', { method: 'POST', body: form(e.target) });
      toast('Announcement published successfully!');
    }
    toast('Saved successfully!');
    await views[current]();
  });
});

(async () => {
  const me = await needRole(['super_admin', 'admin']);
  if (!me) return;
  $('#who').textContent = me.user.name;
  $('#out').onclick = async (e) => {
    e.preventDefault();
    await api('/api/auth/logout', { method: 'POST' });
    location = '/login';
  };
  const names = Object.keys(views);
  tabs($('#tabs'), names, show);
})();
