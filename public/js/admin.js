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
    V.innerHTML = '<h2>Affiliated Centres Management</h2>' + table([
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
    ], centres);
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
