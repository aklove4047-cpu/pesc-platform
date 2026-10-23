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
      ['Applicant & Photo', (r) => `
        <div style="display:flex; align-items:center; gap:8px;">
          ${r.director_photo || r.photo_url ? `<img src="${r.director_photo || r.photo_url}" style="width:36px; height:44px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1; flex-shrink:0;" alt="Photo">` : ''}
          <div>
            <b>${esc(r.owner_name)}</b><br>
            <span class="muted">${esc(r.email)} · ${esc(r.mobile)}</span>
          </div>
        </div>
      `],
      ['Centre & Portal Website', (r) => `<b>${esc(r.centre_name)}</b><br><a href="https://${r.slug === 'navya' ? 'navyacomputer' : esc(r.slug)}.pescouncil.in" target="_blank" style="color:#047857; font-weight:700; text-decoration:none;">${r.slug === 'navya' ? 'navyacomputer' : esc(r.slug)}.pescouncil.in ↗</a> · <span class="muted">${esc(r.district)}</span>`],
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
        ['Centre & Director', (r) => `
          <div style="display:flex; align-items:center; gap:8px;">
            ${r.director_photo || r.photo_url ? `<img src="${r.director_photo || r.photo_url}" style="width:36px; height:44px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1; flex-shrink:0;" alt="Director Photo">` : ''}
            <div>
              <b>${esc(r.name)}</b><br>
              <span class="muted" style="font-size:0.75rem;">Director: ${esc(r.director_name || '—')}</span>
            </div>
          </div>
        `],
        ['Login ID & Password', (r) => `
          <div style="font-size:0.83rem; line-height:1.5;">
            <div><b>ID:</b> <code style="font-weight:700; color:#064e3b; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0;">${esc(r.centre_code)}</code></div>
            <div><b>Pass:</b> <code style="font-weight:700; color:#b91c1c; background:#fef2f2; padding:2px 6px; border-radius:4px; border:1px solid #fecaca;">${esc(r.login_password || 'owner123')}</code></div>
            <button type="button" class="btn sm" onclick="navigator.clipboard.writeText('Centre ID: ${r.centre_code}\\nPassword: ${r.login_password || 'owner123'}\\nPortal: https://${r.slug}.pescouncil.in/portal'); alert('✓ Centre credentials copied to clipboard!');" style="padding:2px 8px; font-size:0.72rem; margin-top:3px; background:#e2e8f0; color:#0f172a; cursor:pointer; border:1px solid #cbd5e1;">📋 Copy ID &amp; Pass</button>
          </div>
        `],
        ['Official Portal', (r) => {
          const pSub = r.slug === 'navya' ? 'navyacomputer.pescouncil.in' : `${r.slug}.pescouncil.in`;
          return `<a href="https://${pSub}" target="_blank" style="color:#047857; font-family:monospace; font-weight:700; text-decoration:none;">${pSub} ↗</a>`;
        }],
        ['Location', (r) => `${esc(r.district)}, ${esc(r.state)}`],
        ['Students', (r) => `<button class="btn sm" data-a="view_centre_students" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="Manage this centre's students">👥 ${r.students} Students</button>`],
        ['Status', (r) => r.status === 'terminated' ? '<span class="badge" style="background:#fee2e2; color:#991b1b; font-weight:800; border:1px solid #f87171;">🔴 TERMINATED</span>' : badge(r.status)],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn sm" data-a="view_centre_creds" data-id="${r.id}" data-code="${esc(r.centre_code)}" data-name="${esc(r.name)}" data-slug="${esc(r.slug)}" data-pass="${esc(r.login_password || 'owner123')}" style="background:#047857; color:#fff; font-weight:700;" title="View &amp; Manage Login Credentials">🔑 ID &amp; Pass</button>
            <button class="btn sm" data-a="view_affiliation_cert" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.centre_code)}" style="background:#ca8a04; color:#fff; font-weight:700;" title="View Official Affiliation Certificate">📜 Affiliation Cert</button>
            <button class="btn sm" data-a="edit_affiliation_cert" data-id="${r.id}" style="background:#0284c7; color:#fff; font-weight:700;" title="Edit Certificate &amp; Centre Details">✏️ Edit Certificate</button>
            ${r.status === 'active' 
              ? `<button class="btn sm danger" data-a="terminate_franchise" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.centre_code)}" style="background:#dc2626; color:#fff; font-weight:700;" title="Terminate Centre Franchise">❌ Terminate Franchise</button>` 
              : `<button class="btn sm" data-a="activate_franchise" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.centre_code)}" style="background:#16a34a; color:#fff; font-weight:700;" title="Reactivate Centre Franchise">✅ Reactivate</button>`}
            <button class="btn sm alt" data-a="courses" data-id="${r.id}">Courses</button>
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
        <div><label>Portal Website Name (e.g. yourname.pescouncil.in) *</label><input name="slug" required placeholder="e.g. modernskill"></div>
        <div><label>Initial Wallet Credit (₹)</label><input name="initial_credit_rupees" type="number" min="0" value="10000"></div>
        <div><label>Temporary Password</label><input name="password" value="Centre@12345"></div>
        <div style="align-self:end;"><button class="btn gold">⚡ Create &amp; Activate Centre</button></div>
      </form>
    `;
    V._courses = courses;
    V._coords = coordinators;
    V._centres = centres;
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
        ['Total Marks', (r) => r.total_marks || 100],
        ['Course Fee', (r) => inr(r.fee_paise)],
        ['Status', (r) => r.active ? `<span class="badge Valid">Active</span>` : `<span class="badge Rejected">Inactive</span>`],
        ['Actions', (r) => `
          <button class="btn sm alt" data-a="edit_course" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.code)}" data-dur="${r.duration_months}" data-fee="${Math.round(r.fee_paise/100)}" data-marks="${r.total_marks || 100}" data-active="${r.active}">✏️ Edit</button>
        `],
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
      <h2>Regional Coordinators &amp; State Appointments</h2>
      <p class="muted" style="margin-bottom:16px;">Appoint regional coordinators, issue official appointment certificates, and monitor territorial accreditations</p>
      ${table([
        ['Coordinator', (r) => `
          <div style="display:flex; align-items:center; gap:10px;">
            ${r.photo_url ? `<img src="${esc(r.photo_url)}" style="width:36px; height:44px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1; flex-shrink:0;">` : `<div style="width:36px; height:44px; background:#e0f2fe; border-radius:4px; display:grid; place-items:center;">👔</div>`}
            <div>
              <b>${esc(r.name)}</b><br>
              <span class="muted">${esc(r.email)} ${r.mobile ? `· ${esc(r.mobile)}` : ''}</span>
            </div>
          </div>
        `],
        ['Jurisdiction State', (r) => `<b style="color:#0a2a5e;">${esc(r.state || 'All State')}</b>`],
        ['Certificate No', (r) => `<span style="font-family:monospace; font-weight:700; color:#b45309;">${esc(r.cert_no || 'Issued')}</span>`],
        ['Status', (r) => badge(r.status || 'Active')],
        ['Actions', (r) => `
          <button class="btn sm gold" data-a="view_coord_cert" data-id="${r.id}" data-name="${esc(r.name)}" style="display:inline-flex; align-items:center; gap:4px;">
            📜 View Certificate
          </button>
        `],
      ], coordinators)}

      <h3 style="margin-top:28px;">Appoint New Regional Coordinator</h3>
      <p class="muted" style="margin-bottom:12px;">Upon appointing a new coordinator, an official appointment certificate is automatically issued and a setup link is sent to their email.</p>
      <form id="kf" class="row">
        <div><label>Full Name *</label><input name="name" required maxlength="100" placeholder="e.g. Vikram Singh"></div>
        <div><label>Email Address *</label><input name="email" type="email" required placeholder="coord@pescouncil.in"></div>
        <div><label>Assigned State *</label><input name="state" required value="Uttar Pradesh"></div>
        <div style="align-self:end;"><button class="btn gold">Appoint Coordinator &amp; Issue Certificate</button></div>
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
    const filterCid = V._activeCentreFilter || '';
    const [{ students }, { centres }, { courses }] = await Promise.all([
      api('/api/admin/students' + (filterCid ? `?centre_id=${filterCid}` : '')),
      api('/api/admin/centres'),
      api('/api/admin/courses'),
    ]);

    V._centres = centres;
    V._courses = courses;
    const activeCentre = centres.find(c => c.id == filterCid);

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2>${activeCentre ? `Candidates for: ${esc(activeCentre.name)}` : 'All India Enrolled Candidates'}</h2>
          <p class="muted">${activeCentre ? `Managing ${students.length} students enrolled in ${esc(activeCentre.name)} (${esc(activeCentre.centre_code)})` : 'Central student registry across all affiliated franchise centres'}</p>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; background:#f1f5f9; padding:6px 12px; border-radius:8px; border:1px solid #cbd5e1;">
            <b style="font-size:0.85rem; color:#475569;">🏢 Filter by Centre:</b>
            <select id="studentCentreFilter" style="padding:4px 8px; border-radius:6px; border:1px solid #94a3b8; font-size:0.88rem; background:#fff;">
              <option value="">All Centres (National Directory)</option>
              ${centres.map(c => `<option value="${c.id}" ${filterCid == c.id ? 'selected' : ''}>${esc(c.name)} (${esc(c.centre_code)}) - ${c.students || 0} Students</option>`).join('')}
            </select>
          </div>
          <span class="badge active">${students.length} Students</span>
        </div>
      </div>
      ${table([
        ['Student Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
        ['Candidate Name', (r) => `<b>${esc(r.name)}</b><br><span class="muted">Father: ${esc(r.father_name || '—')}</span>`],
        ['Course', (r) => `<b>${esc(r.course_code || '')}</b> - ${esc(r.course_name)}`],
        ['Affiliated Centre', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.centre_code)}</span>`],
        ['Contact', (r) => `${esc(r.mobile || '—')}<br><span class="muted">${esc(r.email || '—')}</span>`],
        ['Status', (r) => badge(r.status)],
        ['Actions', (r) => `
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            <button class="btn sm alt" data-a="edit_student" data-id="${r.id}" title="Edit Student Profile">✏️ Edit</button>
            <button class="btn sm" data-a="view_student_creds" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="View Student Login ID and Password">🔑 ID/Pass</button>
            <button class="btn sm gold" data-a="c_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Certificate">📜 Cert</button>
            <button class="btn sm gold" data-a="m_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Marksheet">📊 Marksheet</button>
            <button class="btn sm danger" data-a="del_student" data-id="${r.id}" data-name="${esc(r.name)}" title="Delete Student">🗑️</button>
          </div>
        `],
      ], students, filterCid ? `No students found for ${activeCentre ? activeCentre.name : 'this centre'}.` : 'No students registered across centres yet.')}

      <h3 style="margin-top:28px;">➕ Direct Candidate Enrolment (Head Office Admission)</h3>
      <p class="muted" style="margin-bottom:12px;">Enrol a student directly into any affiliated centre with immediate portal access.</p>
      <form id="studentDirectForm" class="row">
        <div>
          <label>Select Affiliated Centre *</label>
          <select name="centre_id" required>
            ${centres.map(c => `<option value="${c.id}" ${filterCid == c.id ? 'selected' : ''}>${esc(c.name)} (${esc(c.centre_code)}) - ${esc(c.district)}</option>`).join('')}
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

    const cSel = $('#studentCentreFilter');
    if (cSel) {
      cSel.onchange = (e) => {
        V._activeCentreFilter = e.target.value;
        views.Students();
      };
    }
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

function showModal(title, bodyHtml, onSave, maxWidth = '640px') {
  let m = document.getElementById('adminModalOverlay');
  if (!m) {
    m = document.createElement('div');
    m.id = 'adminModalOverlay';
    m.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.65); z-index:9999; display:grid; place-items:center; padding:16px; overflow-y:auto; backdrop-filter:blur(3px);';
    document.body.appendChild(m);
  }
  m.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:${maxWidth}; width:100%; box-shadow:var(--shadow-lg); border:1px solid #cbd5e1; overflow:hidden;">
      <div style="background:var(--navy); color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:1.15rem; color:#fff;">${title}</h3>
        <button id="modalCloseBtn" type="button" style="background:none; border:none; color:#fff; font-size:1.4rem; cursor:pointer; line-height:1;">&times;</button>
      </div>
      <div style="padding:20px; max-height:calc(88vh - 80px); overflow-y:auto;">
        ${bodyHtml}
      </div>
    </div>
  `;
  m.style.display = 'grid';
  document.getElementById('modalCloseBtn').onclick = () => { m.style.display = 'none'; };
  const f = m.querySelector('form');
  if (f && onSave) {
    f.onsubmit = async (e) => {
      e.preventDefault();
      await onSave(new FormData(f));
      m.style.display = 'none';
    };
  }
}

async function showAffiliationCertModal(cId) {
  const res = await api(`/api/admin/centres/${cId}/affiliation-cert`);
  const cert = res.certificate || {};

  showModal(`📜 Affiliation Certificate - ${cert.centre_code}`, `
    <div style="background:#f8fafc; padding:20px; text-align:center;">
      <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <button type="button" onclick="showEditAffiliationCertModal(${cId})" class="btn sm" style="font-weight:700; background:#0284c7; color:#fff; border:none; cursor:pointer; padding:7px 14px; border-radius:6px;">✏️ Edit Certificate Details</button>
        <button type="button" onclick="window.print()" class="btn gold sm" style="font-weight:700; padding:7px 14px;">🖨️ Print Official Certificate</button>
      </div>
      <div style="border: 6px double #d4af37; outline: 2px solid #b45309; outline-offset: 4px; border-radius: 12px; padding: 32px 36px; background: radial-gradient(circle, #ffffff 60%, #fffdf0 100%); position:relative; box-shadow:0 10px 25px rgba(212,175,55,0.15); text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #d4af37; padding-bottom: 14px; margin-bottom: 18px;">
          <div style="text-align:left;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Govt. Recognized Autonomy</span>
            <div style="font-size:0.8rem; color:#0a2a5e; font-weight:700;">ISO 9001:2015 Certified</div>
          </div>
          <div style="text-align:center;">
            <div style="width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#fde047; font-size:1.8rem; font-weight:900; display:grid; place-items:center; margin:0 auto 4px; border:2px solid #d4af37;">P</div>
            <h2 style="margin:0; font-size:1.35rem; color:#0a2a5e; letter-spacing:0.5px; font-weight:800;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
            <div style="font-size:0.9rem; color:#b45309; font-weight:700;">पूर्वांचल शिक्षा एवं कौशल परिषद</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">ATC Accredit No.</span>
            <div style="font-size:0.85rem; color:#b45309; font-family:monospace; font-weight:800;">${esc(cert.cert_no)}</div>
          </div>
        </div>

        <h1 style="color:#0a2a5e; font-size:1.7rem; margin:14px 0 4px; text-transform:uppercase; letter-spacing:1px; font-family:serif;">Certificate of Affiliation</h1>
        <div style="font-size:0.92rem; color:#78350f; font-weight:600; margin-bottom:16px;">(सम्बद्धता एवं मान्यता प्रमाण पत्र)</div>

        <p style="font-size:1rem; color:#475569; line-height:1.6; margin:0 auto 14px; max-width:720px;">
          This is to officially certify that the educational institution named below has met the council's academic infrastructure, faculty, and operational standards and is hereby granted official status as an <b>Authorized Training Centre (ATC)</b>:
        </p>

        <div style="margin:16px 0; padding:16px 20px; background:#f0fdf4; border:2px solid #86efac; border-radius:8px; display:inline-block; min-width:70%;">
          <div style="display:flex; align-items:center; justify-content:center; gap:20px; text-align:left; flex-wrap:wrap;">
            ${cert.director_photo ? `
              <div style="text-align:center; flex-shrink:0;">
                <img src="${cert.director_photo}" style="width:85px; height:105px; object-fit:cover; border:2px solid #b45309; border-radius:6px; box-shadow:0 3px 8px rgba(0,0,0,0.12); display:block; margin:0 auto 4px;" alt="Director Photo">
                <div style="font-size:0.7rem; color:#78350f; font-weight:700; text-transform:uppercase;">Director Photo</div>
              </div>
            ` : `
              <div style="width:85px; height:105px; border:2px dashed #94a3b8; border-radius:6px; display:grid; place-items:center; background:#f8fafc; color:#94a3b8; font-size:0.72rem; text-align:center; padding:4px; flex-shrink:0;">
                No Photo<br><span style="font-size:0.65rem; color:#0284c7;">(Click Edit)</span>
              </div>
            `}
            <div style="flex:1; min-width:240px;">
              <h2 style="margin:0; font-size:1.45rem; color:#064e3b; font-weight:800; letter-spacing:0.5px;">${esc(cert.name)}</h2>
              <div style="font-size:0.95rem; color:#0f172a; margin-top:4px; font-weight:600;">Director / Incharge: <span style="color:#0a2a5e;">${esc(cert.director_name)}</span></div>
              <div style="font-size:0.86rem; color:#475569; margin-top:2px;">Address: ${esc(cert.address)}</div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:16px; margin:14px 0; flex-wrap:wrap;">
          <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 14px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#92400e; font-weight:700;">Centre Code:</span> <b style="font-family:monospace; color:#78350f; font-size:1rem;">${esc(cert.centre_code)}</b>
          </div>
          <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 14px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#92400e; font-weight:700;">Affiliation Period:</span> <b style="color:#78350f;">${esc(cert.session)}</b>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 14px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#166534; font-weight:700;">Status:</span> <b style="color:#15803d; text-transform:uppercase;">✓ ${esc(cert.status)}</b>
          </div>
        </div>

        <p style="font-size:0.85rem; color:#64748b; margin:10px auto; max-width:700px; line-height:1.5;">
          Authorized to conduct national vocational training, skill certifications, and examinations for courses: <b>${esc(cert.authorized_courses)}</b>.
        </p>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:20px; margin-top:20px; font-size:0.82rem; color:#475569;">
          <div style="text-align:center;">
            <div style="font-weight:700; color:#0a2a5e;">Verified Online</div>
            <div style="font-size:0.75rem; color:#64748b; font-family:monospace;">pescouncil.in/verify</div>
            <div style="border-bottom:1.5px solid #334155; width:130px; margin:6px auto 3px;"></div>
            <span>Council Verification Desk</span>
          </div>
          <div style="text-align:center;">
            <div style="width:60px; height:60px; border-radius:50%; border:2px double #d4af37; margin:0 auto 3px; display:grid; place-items:center; background:#fefce8; color:#b45309; font-weight:900; font-size:0.65rem;">COUNCIL<br>SEAL</div>
            <span style="font-weight:700; color:#78350f;">Official Seal of PESC</span>
          </div>
          <div style="text-align:center;">
            <div style="font-weight:700; color:#0a2a5e;">Authorized Signatory</div>
            <div style="font-size:0.75rem; color:#64748b;">PES Council, Head Office</div>
            <div style="border-bottom:1.5px solid #334155; width:150px; margin:6px auto 3px;"></div>
            <span>Director General / Registrar</span>
          </div>
        </div>
      </div>
    </div>
  `, null, '800px');
}

async function showEditAffiliationCertModal(cId) {
  const res = await api(`/api/admin/centres/${cId}/affiliation-cert`);
  const cert = res.certificate || {};

  showModal(`✏️ Edit Centre & Affiliation Certificate - ${cert.centre_code}`, `
    <form id="editAffiliationCertForm" style="display:flex; flex-direction:column; gap:14px;">
      <div style="background:#fefce8; border:1px solid #fef08a; padding:10px 14px; border-radius:8px; font-size:0.84rem; color:#854d0e; line-height:1.5;">
        💡 Change certificate details below. Changes save live to Council records, updating both the official Affiliation Certificate and Centre records immediately.
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Affiliation Certificate No. *</label>
          <input name="cert_no" required value="${esc(cert.cert_no || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-family:monospace; font-weight:700;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Centre Code</label>
          <input name="centre_code" readonly value="${esc(cert.centre_code || '')}" style="width:100%; padding:8px 10px; border:1px solid #e2e8f0; background:#f8fafc; border-radius:6px; font-family:monospace; font-weight:700; color:#64748b;">
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Centre / Institute Name *</label>
        <input name="name" required value="${esc(cert.name || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Director / Incharge Name *</label>
          <input name="director_name" required value="${esc(cert.director_name || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Franchise Status *</label>
          <select name="status" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            <option value="active" ${cert.status === 'active' ? 'selected' : ''}>Active (मान्यता प्राप्त)</option>
            <option value="terminated" ${cert.status === 'terminated' ? 'selected' : ''}>Terminated (निरस्त)</option>
            <option value="suspended" ${cert.status === 'suspended' ? 'selected' : ''}>Suspended (निलंबित)</option>
          </select>
        </div>
      </div>

      <!-- Director Photo Upload & Preview -->
      <div style="background:#f0f9ff; border:1.5px dashed #0284c7; border-radius:8px; padding:12px;">
        <label style="font-size:0.84rem; font-weight:700; color:#0369a1; display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <span>📸 Director Passport Photo (Certificate पर लगेगी)</span>
          <span style="font-size:0.75rem; color:#64748b; font-weight:normal;">Live Update</span>
        </label>
        <div style="display:flex; align-items:center; gap:14px;">
          <div id="editCertPhotoPreview" style="width:72px; height:90px; border:1.5px solid #cbd5e1; border-radius:6px; background:#fff; display:grid; place-items:center; overflow:hidden; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            ${cert.director_photo ? `<img src="${cert.director_photo}" style="width:100%; height:100%; object-fit:cover;" alt="Photo">` : `<span style="font-size:0.7rem; color:#94a3b8; text-align:center;">No Photo</span>`}
          </div>
          <div style="flex:1;">
            <input type="file" id="editCertPhotoFile" accept="image/*" style="font-size:0.8rem; width:100%; margin-bottom:6px; border:1px solid #cbd5e1; border-radius:6px; padding:4px; background:#fff;">
            <input type="text" name="director_photo" id="editCertPhotoBase64" value="${esc(cert.director_photo || '')}" placeholder="Or paste Photo Image URL / Data URI" style="font-size:0.78rem; width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px;">
            <div style="font-size:0.73rem; color:#64748b; margin-top:3px;">Upload new photo or paste URL. Photo will immediately appear on certificate.</div>
          </div>
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Centre Physical Address *</label>
        <input name="address" required value="${esc(cert.address || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">District *</label>
          <input name="district" required value="${esc(cert.district || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">State *</label>
          <input name="state" required value="${esc(cert.state || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">PIN Code</label>
          <input name="pin" value="${esc(cert.pin || '221001')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Phone / Mobile</label>
          <input name="phone" value="${esc(cert.phone || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Email Address</label>
          <input name="email" type="email" value="${esc(cert.email || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Affiliation Issue Date *</label>
          <input name="issue_date" required value="${esc(cert.issue_date || '01 April 2026')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
        <div>
          <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Validity (Valid Thru) *</label>
          <input name="valid_thru" required value="${esc(cert.valid_thru || '31 March 2029')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Affiliation Session / Period *</label>
        <input name="session" required value="${esc(cert.session || '2026 - 2029 (3 Academic Years)')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
      </div>

      <div>
        <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Authorized Courses (Comma separated)</label>
        <textarea name="authorized_courses" rows="2" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">${esc(cert.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Web & Software Development, Python, Graphic Design, Hardware & Networking')}</textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
        <button type="button" class="btn alt" onclick="document.getElementById('adminModalOverlay').style.display='none'">Cancel</button>
        <button type="submit" class="btn" style="background:#0284c7; font-weight:800; padding:10px 20px;">💾 Save Certificate &amp; Centre Changes</button>
      </div>
    </form>
  `, async (formData) => {
    const data = Object.fromEntries(formData.entries());
    const res = await api(`/api/admin/centres/${cId}/affiliation-cert`, {
      method: 'PUT',
      body: data
    });
    toast(`✓ Affiliation Certificate for ${data.name} updated successfully!`);
    await showAffiliationCertModal(cId);
    if (current === 'Centres') {
      views.Centres();
    }
  }, '680px');

  // Attach photo upload handler inside modal
  setTimeout(() => {
    const pFile = document.getElementById('editCertPhotoFile');
    const pBase64 = document.getElementById('editCertPhotoBase64');
    const pPrev = document.getElementById('editCertPhotoPreview');
    if (pFile) {
      pFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            pBase64.value = dataUrl;
            pPrev.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Photo">`;
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    if (pBase64) {
      pBase64.addEventListener('input', () => {
        const val = pBase64.value.trim();
        if (val) {
          pPrev.innerHTML = `<img src="${val}" style="width:100%; height:100%; object-fit:cover;" alt="Photo" onerror="this.parentElement.innerHTML='<span style=\\'font-size:0.7rem; color:#ef4444;\\'>Invalid</span>'">`;
        }
      });
    }
  }, 60);
}

V.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const id = b.dataset.id;
  const a = b.dataset.a;

  guard(async () => {
    const post = (p, body = {}) => api(p, { method: 'POST', body });
    if (a === 'view_centre_students') {
      V._activeCentreFilter = id;
      current = 'Students';
      document.querySelectorAll('#tabs button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === 'Students');
      });
      await views.Students();
      return;
    } else if (a === 'edit_centre') {
      const { centre: c } = await api(`/api/admin/centres/${id}`);
      showModal(`✏️ Edit Centre: ${c.name} (${c.centre_code})`, `
        <form id="editCentreModalForm">
          <div class="row">
            <div><label>Centre Name *</label><input name="name" value="${esc(c.name)}" required></div>
            <div><label>Director / Owner Name</label><input name="owner_name" value="${esc(c.owner_name || '')}"></div>
            <div><label>Mobile Number</label><input name="owner_mobile" value="${esc(c.owner_mobile || '')}"></div>
            <div><label>Email ID</label><input name="owner_email" type="email" value="${esc(c.owner_email || '')}"></div>
            <div><label>State</label><input name="state" value="${esc(c.state || '')}"></div>
            <div><label>District</label><input name="district" value="${esc(c.district || '')}"></div>
            <div style="grid-column: span 2;"><label>Full Address</label><input name="address" value="${esc(c.address || '')}"></div>
            <div><label>PIN Code</label><input name="pin" value="${esc(c.pin || '')}"></div>
            <div>
              <label>Centre Status</label>
              <select name="status">
                <option value="active" ${c.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="suspended" ${c.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                <option value="deactivated" ${c.status === 'deactivated' ? 'selected' : ''}>Deactivated</option>
              </select>
            </div>
          </div>
          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn alt" onclick="document.getElementById('adminModalOverlay').style.display='none'">Cancel</button>
            <button type="submit" class="btn gold">Save Centre Details</button>
          </div>
        </form>
      `, async (formData) => {
        const payload = Object.fromEntries(formData.entries());
        await api(`/api/admin/centres/${id}`, { method: 'PUT', body: payload });
        toast('Centre updated successfully!');
        await views.Centres();
      });
      return;
    } else if (a === 'edit_student') {
      const [{ student: s }, { centres }, { courses }] = await Promise.all([
        api(`/api/admin/students/${id}`),
        api('/api/admin/centres'),
        api('/api/admin/courses'),
      ]);
      showModal(`✏️ Edit Student Profile: ${s.name} (${s.student_code})`, `
        <form id="editStudentModalForm">
          <div class="row">
            <div><label>Candidate Full Name *</label><input name="name" value="${esc(s.name)}" required></div>
            <div><label>Father's Name</label><input name="father_name" value="${esc(s.father_name || '')}"></div>
            <div><label>Mobile Number</label><input name="mobile" value="${esc(s.mobile || '')}"></div>
            <div><label>Email Address</label><input name="email" type="email" value="${esc(s.email || '')}"></div>
            <div><label>Date of Birth</label><input name="dob" type="date" value="${esc(s.dob || '')}"></div>
            <div><label>Academic Session</label><input name="session" value="${esc(s.session || '2026-27')}"></div>
            <div>
              <label>Assigned Centre *</label>
              <select name="centre_id" required>
                ${centres.map(c => `<option value="${c.id}" ${c.id === s.centre_id ? 'selected' : ''}>${esc(c.name)} (${esc(c.centre_code)})</option>`).join('')}
              </select>
            </div>
            <div>
              <label>Enrolled Course *</label>
              <select name="course_id" required>
                ${courses.map(co => `<option value="${co.id}" ${co.id === s.course_id ? 'selected' : ''}>${esc(co.code)} - ${esc(co.name)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select name="status">
                <option value="active" ${s.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${s.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                <option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
          </div>
          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn alt" onclick="document.getElementById('adminModalOverlay').style.display='none'">Cancel</button>
            <button type="submit" class="btn gold">Save Student Profile</button>
          </div>
        </form>
      `, async (formData) => {
        const payload = Object.fromEntries(formData.entries());
        await api(`/api/admin/students/${id}`, { method: 'PUT', body: payload });
        toast('Student profile updated successfully!');
        await views.Students();
      });
      return;
    } else if (a === 'view_student_creds') {
      const { credentials: c } = await api(`/api/admin/students/${id}/credentials`);
      showModal(`🔑 Student Login Credentials: ${c.name}`, `
        <div style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px; background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="font-size:2.2rem;">🎓</div>
            <div>
              <h3 style="margin:0; color:var(--navy);">${esc(c.name)}</h3>
              <p class="muted" style="margin:2px 0;">Course: <b>${esc(c.course_name)}</b> · Centre: <b>${esc(c.centre_name)} (${esc(c.centre_code)})</b></p>
            </div>
          </div>

          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; margin-bottom:16px;">
            <h4 style="margin:0 0 10px; color:#166534;">📋 Current Student Credentials</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.92rem;">
              <div><b>Login ID / Student Code:</b><br><code style="font-size:1.05rem; background:#fff; padding:3px 8px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block; margin-top:3px; color:var(--navy); font-weight:bold;">${esc(c.student_code)}</code></div>
              <div><b>Login Email:</b><br><code style="font-size:0.95rem; background:#fff; padding:3px 8px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block; margin-top:3px;">${esc(c.email)}</code></div>
              <div><b>Registered Mobile:</b><br><span style="color:#334155;">${esc(c.mobile || '—')}</span></div>
              <div><b>Login Password:</b><br><code style="font-size:1.1rem; background:#fef08a; padding:3px 8px; border-radius:4px; border:1px solid #fde047; display:inline-block; margin-top:3px; color:#854d0e; font-weight:bold;">${esc(c.password)}</code></div>
            </div>
            <div style="margin-top:14px;">
              <button type="button" class="btn sm" id="btnCopyCreds" style="background:#16a34a; color:#fff;">📋 Copy Login Message for WhatsApp/SMS</button>
            </div>
          </div>

          <form id="resetStudentPassForm" style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#fff;">
            <h4 style="margin:0 0 10px; color:var(--navy);">⚡ Change / Set New Password</h4>
            <div style="display:flex; gap:10px; align-items:flex-end;">
              <div style="flex:1;">
                <label>New Password (min 6 characters)</label>
                <input name="password" id="newStudentPassInput" required minlength="6" value="Student@123" placeholder="Enter new password">
              </div>
              <button type="button" class="btn sm alt" id="btnGenPass" style="margin-bottom:2px;">🎲 Generate</button>
              <button type="submit" class="btn sm gold" style="margin-bottom:2px;">Update Password</button>
            </div>
          </form>
        </div>
      `, async () => {});

      const shareText = `*Purvanchal Education & Skill Council (PESC)*\n` +
        `🎓 *Student Portal Login Details*\n` +
        `• *Candidate Name:* ${c.name}\n` +
        `• *Student Code / ID:* ${c.student_code}\n` +
        `• *Login Password:* ${c.password}\n` +
        `• *Centre:* ${c.centre_name} (${c.centre_code})\n` +
        `• *Student Portal URL:* ${c.portal_url || window.location.origin + '/student'}`;

      const btnCopy = document.getElementById('btnCopyCreds');
      if (btnCopy) {
        btnCopy.onclick = () => {
          navigator.clipboard.writeText(shareText).then(() => {
            toast('Credentials copied! Ready to paste on WhatsApp/SMS.');
          }).catch(() => {
            prompt('Copy credentials:', shareText);
          });
        };
      }

      const btnGen = document.getElementById('btnGenPass');
      if (btnGen) {
        btnGen.onclick = () => {
          const pass = 'Pesc#' + Math.floor(1000 + Math.random() * 9000);
          const inp = document.getElementById('newStudentPassInput');
          if (inp) inp.value = pass;
        };
      }

      const pf = document.getElementById('resetStudentPassForm');
      if (pf) {
        pf.onsubmit = async (e) => {
          e.preventDefault();
          const newPass = document.getElementById('newStudentPassInput').value.trim();
          if (!newPass || newPass.length < 6) return alert('Password must be at least 6 characters');
          await api(`/api/admin/students/${id}/set-password`, { method: 'POST', body: { password: newPass } });
          toast(`Password updated successfully to: ${newPass}`);
          document.getElementById('adminModalOverlay').style.display = 'none';
          await views.Students();
        };
      }
      return;
    } else if (a === 'del_student') {
      if (!confirm(`Are you sure you want to permanently delete candidate ${b.dataset.name}? This will remove all their records.`)) return;
      await api(`/api/admin/students/${id}`, { method: 'DELETE' });
      toast('Student deleted successfully!');
      await views.Students();
      return;
    } else if (a === 'edit_course') {
      const d = b.dataset;
      showModal(`✏️ Edit Course: ${d.code} - ${d.name}`, `
        <form id="editCourseModalForm">
          <div class="row">
            <div><label>Course Code *</label><input name="code" value="${esc(d.code)}" required></div>
            <div><label>Course Title *</label><input name="name" value="${esc(d.name)}" required></div>
            <div><label>Duration (Months) *</label><input name="duration_months" type="number" min="1" value="${d.dur}" required></div>
            <div><label>Course Fee (₹) *</label><input name="fee_rupees" type="number" min="0" value="${d.fee}" required></div>
            <div><label>Total Examination Marks</label><input name="total_marks" type="number" min="1" value="${d.marks || 100}"></div>
            <div>
              <label>Status</label>
              <select name="active">
                <option value="1" ${d.active === '1' ? 'selected' : ''}>Active</option>
                <option value="0" ${d.active === '0' ? 'selected' : ''}>Inactive / Archived</option>
              </select>
            </div>
          </div>
          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn alt" onclick="document.getElementById('adminModalOverlay').style.display='none'">Cancel</button>
            <button type="submit" class="btn gold">Save Course Details</button>
          </div>
        </form>
      `, async (formData) => {
        const payload = Object.fromEntries(formData.entries());
        payload.active = payload.active === '1';
        await api(`/api/admin/courses/${id}`, { method: 'PUT', body: payload });
        toast('Course updated successfully!');
        await views.Courses();
      });
      return;
    } else if (a === 'view_centre_creds') {
      const d = b.dataset;
      const shareText = `*Purvanchal Education & Skill Council (PESC)*\n` +
        `🏢 *Franchise Centre ERP Login Credentials*\n` +
        `• *Centre Name:* ${d.name}\n` +
        `• *Centre Code / Login ID:* ${d.code}\n` +
        `• *Password:* ${d.pass || 'owner123'}\n` +
        `• *Website:* https://${d.slug}.pescouncil.in\n` +
        `• *ERP Portal URL:* https://${d.slug}.pescouncil.in/portal`;

      showModal(`🔑 Centre Login Credentials: ${d.code}`, `
        <div style="margin-bottom:16px;">
          <div style="background:#f0fdf4; border:1.5px solid #a7f3d0; padding:16px; border-radius:10px; margin-bottom:16px;">
            <h4 style="margin:0 0 10px; color:#064e3b; font-size:1.15rem;">🏢 ${esc(d.name)}</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.9rem;">
              <div><b>Centre Code / Login ID:</b><br><code style="font-size:1.1rem; color:#064e3b; font-weight:800; background:#fff; padding:3px 8px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block; margin-top:3px;">${esc(d.code)}</code></div>
              <div><b>Login Password:</b><br><code style="font-size:1.1rem; color:#b91c1c; font-weight:800; background:#fef2f2; padding:3px 8px; border-radius:4px; border:1px solid #fecaca; display:inline-block; margin-top:3px;">${esc(d.pass || 'owner123')}</code></div>
              <div style="grid-column:span 2;"><b>Portal Address:</b><br><a href="https://${d.slug}.pescouncil.in/portal" target="_blank" style="color:#0284c7; font-weight:700;">https://${d.slug}.pescouncil.in/portal ↗</a></div>
            </div>
            <div style="margin-top:14px;">
              <button type="button" class="btn sm" id="btnCopyCentreCreds" style="background:#16a34a; color:#fff; font-weight:700;">📋 Copy for WhatsApp / SMS</button>
            </div>
          </div>

          <form id="resetCentrePassForm" style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#fff;">
            <h4 style="margin:0 0 10px; color:var(--navy);">⚡ Change / Set New Password for Centre</h4>
            <div style="display:flex; gap:10px; align-items:flex-end;">
              <div style="flex:1;">
                <label>New Password (min 6 characters)</label>
                <input name="password" id="newCentrePassInput" required minlength="6" value="${esc(d.pass || 'owner123')}" placeholder="Enter new password">
              </div>
              <button type="submit" class="btn sm gold" style="margin-bottom:2px;">Update Password</button>
            </div>
          </form>
        </div>
      `, async () => {});

      const btnCopy = document.getElementById('btnCopyCentreCreds');
      if (btnCopy) {
        btnCopy.onclick = () => {
          navigator.clipboard.writeText(shareText).then(() => {
            toast('Credentials copied! Ready to paste on WhatsApp/SMS.');
          });
        };
      }

      const pf = document.getElementById('resetCentrePassForm');
      if (pf) {
        pf.onsubmit = async (e) => {
          e.preventDefault();
          const newPass = document.getElementById('newCentrePassInput').value.trim();
          if (!newPass || newPass.length < 6) return alert('Password must be at least 6 characters');
          await api(`/api/admin/centres/${id}/set-password`, { method: 'POST', body: { password: newPass } });
          toast(`Password updated successfully to: ${newPass}`);
          document.getElementById('adminModalOverlay').style.display = 'none';
          await views.Centres();
        };
      }
      return;
    } else if (a === 'approve') {
      const r = await api(`/api/admin/applications/${id}/approve`, { method: 'POST' }).catch((x) => {
        if (x.data && x.data.step) throw new Error(`Failed at ${x.data.step}: ${x.data.error}`);
        throw x;
      });

      const credsText = `🎉 *Franchise Centre Approved & Provisioned!*\n\n` +
        `• Centre Name: ${r.centre_name || 'Authorized Training Centre'}\n` +
        `• Centre Code / Login ID: ${r.centre_code}\n` +
        `• Login Password: ${r.password || 'owner123'}\n` +
        `• Portal Website: https://${r.slug}.pescouncil.in\n` +
        `• ERP Login URL: https://${r.slug}.pescouncil.in/portal`;

      showModal(`🎉 Franchise Approved: ${r.centre_code}`, `
        <div style="padding:10px 0;">
          <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:10px; padding:16px; margin-bottom:16px;">
            <h4 style="margin:0 0 8px; color:#064e3b; font-size:1.15rem;">✓ Centre Successfully Provisioned &amp; Approved!</h4>
            <div style="background:#e0f2fe; border:1px solid #7dd3fc; border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:0.86rem; color:#0369a1; line-height:1.4;">
              ✉️ <b>Official Email Sent:</b> Login ID, Password &amp; Subdomain credentials have been sent from <b>admin@pescouncil.in</b> to <b>${esc(r.email_to || 'Franchise Director')}</b>!
            </div>
            <p style="margin:0 0 12px; font-size:0.88rem; color:#047857;">Share these login credentials with the Franchise Director:</p>
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <tr><td style="padding:6px 0; color:#64748b; width:45%;">Centre Code / Login ID:</td><td style="padding:6px 0;"><code style="font-size:1.15rem; color:#064e3b; font-weight:800; background:#fff; padding:2px 8px; border:1px solid #bbf7d0; border-radius:4px;">${r.centre_code}</code></td></tr>
              <tr><td style="padding:6px 0; color:#64748b;">Login Password:</td><td style="padding:6px 0;"><code style="font-size:1.15rem; color:#b91c1c; font-weight:800; background:#fef2f2; padding:2px 8px; border:1px solid #fecaca; border-radius:4px;">${r.password || 'owner123'}</code></td></tr>
              <tr><td style="padding:6px 0; color:#64748b;">Subdomain Portal:</td><td style="padding:6px 0;"><a href="https://${r.slug}.pescouncil.in" target="_blank" style="color:#0284c7; font-weight:700;">https://${r.slug}.pescouncil.in ↗</a></td></tr>
              <tr><td style="padding:6px 0; color:#64748b;">Email Delivered To:</td><td style="padding:6px 0; color:#0369a1; font-weight:bold;">${esc(r.email_to || 'Registered Email')}</td></tr>
            </table>
          </div>
          <div style="display:flex; justify-content:space-between; gap:10px;">
            <button type="button" class="btn sm" id="btnApproveCopyCreds" style="background:#16a34a; color:#fff; font-weight:700;">📋 Copy for WhatsApp</button>
            <button type="button" class="btn sm gold" onclick="document.getElementById('adminModalOverlay').style.display='none'">Done</button>
          </div>
        </div>
      `, async () => {});

      setTimeout(() => {
        const btn = document.getElementById('btnApproveCopyCreds');
        if (btn) btn.onclick = () => {
          navigator.clipboard.writeText(credsText).then(() => toast('Credentials copied to clipboard!'));
        };
      }, 100);

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
    } else if (a === 'terminate_franchise') {
      const cName = b.dataset.name || 'this centre';
      const cCode = b.dataset.code || '';
      if (!confirm(`⚠️ WARNING: क्या आप सच में सेंटर '${cName}' (${cCode}) की फ्रैंचाइज़ी समाप्त (Terminate) करना चाहते हैं?\n\n- इस सेंटर का ERP/Portal लॉगिन तुरंत ब्लॉक हो जाएगा।\n- मुख्य वेबसाइट (pescouncil.in) से यह सेंटर तुरंत हट जाएगा।`)) return;
      const r = ask('Termination Reason (कारण दर्ज करें):') || 'Terminated by Council Administration';
      await post(`/api/admin/centres/${id}/terminate`, { reason: r });
      toast(`✓ Franchise for '${cName}' (${cCode}) has been terminated.`);
    } else if (a === 'activate_franchise') {
      const cName = b.dataset.name || 'this centre';
      const cCode = b.dataset.code || '';
      if (!confirm(`क्या आप सेंटर '${cName}' (${cCode}) की फ्रैंचाइज़ी पुनः चालू (Reactivate) करना चाहते हैं?`)) return;
      await post(`/api/admin/centres/${id}/activate`, { reason: 'Reactivated by Admin' });
      toast(`✓ Franchise for '${cName}' (${cCode}) reactivated successfully.`);
    } else if (a === 'view_affiliation_cert') {
      showAffiliationCertModal(id);
    } else if (a === 'edit_affiliation_cert' || a === 'edit_centre') {
      showEditAffiliationCertModal(id);
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
    } else if (a === 'view_coord_cert') {
      const { certificate } = await api(`/api/admin/coordinators/${id}/cert`);
      showAdminCoordCertModal(certificate);
      return;
    }
    toast('Action completed');
    await views[current]();
  });
});

function showAdminCoordCertModal(cert) {
  const existing = $('#coordCertModal');
  if (existing) existing.remove();

  const issueDateStr = cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '01 April 2026';
  const validUntilStr = cert.valid_until ? new Date(cert.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '31 March 2029';
  const verifyUrl = cert.verification_url || `https://pescouncil.in/verify/coordinator/${cert.token || 'valid'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(verifyUrl)}`;

  const modal = document.createElement('div');
  modal.id = 'coordCertModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto;';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:980px; width:100%; max-height:92vh; overflow-y:auto; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.3); position:relative;">
      <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <div>
          <h3 style="margin:0; color:#0f172a;">Regional Coordinator Appointment Certificate</h3>
          <span class="muted" style="font-size:0.85rem;">Official credential for ${esc(cert.name)} · ${esc(cert.state || 'All State')}</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn gold sm" onclick="window.print()">🖨️ Print / Save PDF</button>
          <button class="btn sm danger" onclick="$('#coordCertModal').remove()">✕ Close</button>
        </div>
      </div>

      <div id="printCertArea" style="border: 8px double #d4af37; outline: 3px solid #b45309; outline-offset: 6px; border-radius: 14px; padding: 36px 44px; background: radial-gradient(circle, #ffffff 50%, #fffdf2 100%); position:relative; box-shadow:0 12px 36px rgba(212,175,55,0.18); text-align:center; color:#1e293b;">
        <!-- Watermark -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.035; pointer-events:none; font-size:24rem; font-weight:900; color:#0a2a5e;">P</div>

        <!-- Top Emblem & Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #d4af37; padding-bottom: 16px; margin-bottom: 22px;">
          <div style="text-align:left;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Govt. Recognized Autonomy</span>
            <div style="font-size:0.85rem; color:#0a2a5e; font-weight:700;">ISO 9001:2015 Certified</div>
            <div style="font-size:0.75rem; color:#64748b;">NITI Aayog Registered</div>
          </div>
          <div style="text-align:center;">
            <div style="width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#fde047; font-size:2.2rem; font-weight:900; display:grid; place-items:center; margin:0 auto 6px; border:3px solid #d4af37; box-shadow:0 4px 12px rgba(0,0,0,0.15);">P</div>
            <h2 style="margin:0; font-size:1.6rem; color:#0a2a5e; letter-spacing:0.5px; font-weight:800; text-transform:uppercase;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
            <div style="font-size:1.05rem; color:#b45309; font-weight:700; margin-top:2px;">पूर्वांचल शिक्षा एवं कौशल परिषद</div>
            <div style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:2px; letter-spacing:0.3px;">Autonomous National Council for Vocational &amp; Technical Education</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Certificate No.</span>
            <div style="font-size:0.95rem; color:#b45309; font-family:monospace; font-weight:800;">${esc(cert.cert_no || 'PESC/COORD/2026/0001')}</div>
            <div style="margin-top:4px;">
              <span class="badge active" style="font-size:0.75rem; background:#15803d; color:#fff; padding:3px 8px; border-radius:4px; font-weight:700;">✓ AUTHORIZED MANDATE</span>
            </div>
          </div>
        </div>

        <!-- Certificate Title -->
        <h1 style="color:#0a2a5e; font-size:2rem; margin:12px 0 4px; text-transform:uppercase; letter-spacing:1px; font-family:serif; font-weight:800;">
          Regional Coordinator Appointment Certificate
        </h1>
        <div style="font-size:1.15rem; color:#78350f; font-weight:700; margin-bottom:20px;">
          (क्षेत्रीय / राज्य समन्वयक नियुक्ति प्रमाण पत्र)
        </div>

        <!-- Preamble -->
        <p style="font-size:1.05rem; color:#334155; line-height:1.7; margin:0 auto 16px; max-width:820px;">
          By virtue of the powers vested in the Central Governing Board of <b>Purvanchal Education &amp; Skill Council</b>, this is to officially proclaim that having met all institutional standards and executive criteria:
        </p>

        <!-- Coordinator Details Box -->
        <div style="margin:16px auto; padding:18px 24px; background:#f0fdf4; border:2px solid #86efac; border-radius:12px; display:inline-block; width:88%; box-sizing:border-box;">
          <div style="display:flex; align-items:center; justify-content:center; gap:24px; text-align:left; flex-wrap:wrap;">
            <div style="text-align:center; flex-shrink:0;">
              ${cert.photo_url
                ? `<img src="${esc(cert.photo_url)}" style="width:96px; height:116px; object-fit:cover; border:2px solid #b45309; border-radius:6px; box-shadow:0 3px 8px rgba(0,0,0,0.12); display:block; margin:0 auto 4px;" alt="Coordinator Photo">`
                : `<div style="width:96px; height:116px; background:#dbeafe; border:2px solid #93c5fd; border-radius:6px; display:grid; place-items:center; font-size:3rem; margin:0 auto 4px;">👔</div>`
              }
              <div style="font-size:0.7rem; color:#78350f; font-weight:700; text-transform:uppercase;">Appointee</div>
            </div>
            <div style="flex:1; min-width:240px;">
              <h2 style="margin:0; font-size:1.85rem; color:#064e3b; font-weight:800;">${esc(cert.name)}</h2>
              <div style="font-size:1.15rem; color:#0f172a; margin-top:6px; font-weight:700;">
                Designation: <span style="color:#0a2a5e;">Regional / State Coordinator (समन्वयक)</span>
              </div>
              <div style="font-size:1rem; color:#1e293b; margin-top:4px;">
                Jurisdiction Territory: <b style="color:#b45309;">${esc(cert.state || 'All Assigned Territories')}</b>
              </div>
              <div style="font-size:0.88rem; color:#64748b; margin-top:4px;">
                Contact: ${esc(cert.email)} ${cert.mobile ? `· 📞 ${esc(cert.mobile)}` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Mandate Authority Text -->
        <p style="font-size:0.98rem; color:#334155; line-height:1.7; margin:16px auto; max-width:820px; text-align:justify;">
          The designated coordinator is officially authorized and mandated to oversee authorized training centre accreditations, supervise academic examinations, verify candidate credentials, coordinate student enrolments, and represent the council in academic and promotional engagements across the assigned jurisdiction.
        </p>

        <!-- Meta Grid -->
        <div style="display:flex; justify-content:center; gap:16px; margin:16px 0; flex-wrap:wrap;">
          <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 18px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#92400e; font-weight:700;">Issue Date:</span> <b style="color:#78350f;">${issueDateStr}</b>
          </div>
          <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 18px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#92400e; font-weight:700;">Tenure / Validity:</span> <b style="color:#78350f;">${validUntilStr}</b>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 18px; border-radius:6px; font-size:0.88rem;">
            <span style="color:#166534; font-weight:700;">Council Registry:</span> <b style="color:#15803d;">Active &amp; Verified</b>
          </div>
        </div>

        <!-- Footer Signatures & QR Code -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1.5px dashed #cbd5e1; padding-top:20px; margin-top:22px; font-size:0.88rem; color:#475569;">
          <!-- Left: QR Code -->
          <div style="text-align:center;">
            <img src="${qrCodeUrl}" style="width:85px; height:85px; border:2px solid #cbd5e1; border-radius:6px; display:block; margin:0 auto 4px;" alt="QR Code">
            <div style="font-size:0.75rem; color:#64748b; font-weight:700;">Scan to Verify</div>
            <div style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">pescouncil.in/verify</div>
          </div>

          <!-- Center: Council Mohar & Hologram -->
          <div style="text-align:center;">
            ${cert.seal_url
              ? `<img src="${esc(cert.seal_url)}" style="height:70px; display:block; margin:0 auto 4px;" alt="Regional Mohar">`
              : `<div style="width:70px; height:70px; border-radius:50%; border:2px double #d4af37; margin:0 auto 4px; display:grid; place-items:center; background:#fefce8; color:#b45309; font-weight:900; font-size:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                   CENTRAL<br>SEAL
                 </div>`
            }
            <span style="font-weight:700; color:#78350f; font-size:0.8rem;">Official Council Seal</span>
          </div>

          <!-- Right: Central Director Sign & Coordinator Sign -->
          <div style="text-align:center;">
            <div style="min-height:40px; display:flex; align-items:center; justify-content:center;">
              ${cert.signature_url
                ? `<img src="${esc(cert.signature_url)}" style="height:38px; display:block; margin:0 auto 2px;" alt="Signature">`
                : `<span style="font-family:'Brush Script MT',cursive; font-size:1.6rem; color:#0a2a5e;">Dr. R. K. Sharma</span>`
              }
            </div>
            <div style="border-bottom:1.5px solid #334155; width:170px; margin:4px auto 4px;"></div>
            <div style="font-weight:700; color:#0a2a5e;">Director General / Registrar</div>
            <div style="font-size:0.78rem; color:#64748b;">Purvanchal Education &amp; Skill Council</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

V.addEventListener('submit', (e) => {
  e.preventDefault();
  guard(async () => {
    if (e.target.id === 'cf') await api('/api/admin/courses', { method: 'POST', body: form(e.target) });
    if (e.target.id === 'kf') {
      const r = await api('/api/admin/coordinators', { method: 'POST', body: form(e.target) });
      toast(`Regional coordinator appointed successfully! Certificate: ${r.cert_no || 'Issued'}`);
    }
    if (e.target.id === 'centreDirectForm') {
      const r = await api('/api/admin/centres/direct-create', { method: 'POST', body: form(e.target) });
      toast(`Centre ${r.centreCode} created successfully! Live Portal: https://${r.slug}.pescouncil.in`);
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
