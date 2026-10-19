const V = $('#view');
let current = 'Dashboard';

const views = {
  async Dashboard() {
    const d = await api('/api/centre/dashboard');
    $('#cn').textContent = d.centre.name;
    V.innerHTML = `
      <h2>Dashboard</h2>
      <div class="grid">
        <div class="stat"><span>Students</span><b>${d.students}</b></div>
        <div class="stat"><span>Courses</span><b>${d.courses}</b></div>
        <div class="stat"><span>Marksheets Pending</span><b>${d.marksheets_pending || 0}</b></div>
        <div class="stat"><span>Marksheets Approved</span><b>${d.marksheets_approved || 0}</b></div>
        <div class="stat"><span>Certificates Pending</span><b>${d.certificates_pending}</b></div>
        <div class="stat"><span>Certificates Issued</span><b>${d.certificates_valid}</b></div>
        <div class="stat"><span>Wallet Balance</span><b>${inr(d.wallet_paise)}</b></div>
      </div>
    `;
  },

  async Students() {
    const [{ students }, { courses }] = await Promise.all([api('/api/centre/students'), api('/api/centre/courses')]);
    V.innerHTML = `
      <h2>Students Registry</h2>
      ${table([
        ['Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
        ['Name', (r) => `<b>${esc(r.name)}</b>`],
        ['Mobile', (r) => esc(r.mobile || 'N/A')],
        ['Course', (r) => esc(r.course)],
        ['Status', (r) => badge(r.status)],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn sm alt" data-a="account" data-id="${r.id}" title="Setup student portal access">🔑 Login Access</button>
            <button class="btn sm" data-a="marksheet-prep" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.student_code)}" title="Submit marks for this student">📝 Marksheet</button>
            <button class="btn sm alt" data-a="apply" data-id="${r.id}">🎓 Certificate</button>
          </div>
        `]
      ], students)}

      <h3 style="margin-top:28px;">Add New Student Admission</h3>
      ${courses.length ? `
        <form id="sf" class="row">
          <div><label>Student Full Name *</label><input name="name" required maxlength="100"></div>
          <div><label>Father's Name</label><input name="father_name" maxlength="100"></div>
          <div><label>Mobile (10 digits)</label><input name="mobile" pattern="[6-9][0-9]{9}"></div>
          <div><label>Email ID</label><input name="email" type="email"></div>
          <div><label>Date of Birth</label><input name="dob" type="date"></div>
          <div><label>Session (e.g. 2026-27)</label><input name="session" placeholder="2026-27"></div>
          <div>
            <label>Select Course *</label>
            <select name="course_id" required>
              ${courses.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}
            </select>
          </div>
          <div style="align-self:end;"><button class="btn">Register Student</button></div>
        </form>
      ` : '<p class="muted">No courses assigned yet. Contact PESC admin to assign courses to your centre.</p>'}
      <div id="modalBox"></div>
    `;
  },

  async Marksheets() {
    const [{ marksheets }, { students }] = await Promise.all([
      api('/api/centre/marksheets'),
      api('/api/centre/students'),
    ]);

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <h2>Marksheets & Results Management</h2>
          <p class="muted">Enter examination scores and generate council statement of marks</p>
        </div>
        <button class="btn gold" id="btnNewMrk">➕ Enter Examination Marks</button>
      </div>

      ${table([
        ['Marksheet No', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.marksheet_no || 'Pending Approval')}</b>`],
        ['Student', (r) => `<b>${esc(r.student)}</b><br><span class="muted">${esc(r.student_code)} · Roll: ${esc(r.roll_no)}</span>`],
        ['Course', (r) => esc(r.course)],
        ['Session', (r) => esc(r.exam_session)],
        ['Score', (r) => `<b>${r.total_obtained} / ${r.total_max}</b> (${r.percentage}%)`],
        ['Grade', (r) => `<b>${esc(r.grade)}</b>`],
        ['Result', (r) => badge(r.result)],
        ['Status', (r) => badge(r.status) + (r.reason ? `<br><span class="muted">${esc(r.reason)}</span>` : '')],
        ['PDF', (r) => r.status === 'Approved' ? `<a class="btn sm gold" target="_blank" href="/api/marksheets/${r.id}/pdf">📥 PDF</a>` : ''],
      ], marksheets, 'No marksheets submitted yet.')}

      <div id="mrkModal"></div>
    `;

    $('#btnNewMrk').onclick = () => openMarksheetModal(students);
  },

  async Certificates() {
    const { certificates } = await api('/api/centre/certificates');
    V.innerHTML = `
      <h2>Certificates Management</h2>
      ${table([
        ['Student', (r) => esc(r.student)],
        ['Course', (r) => esc(r.course)],
        ['Certificate No', (r) => esc(r.cert_no || 'Pending Approval')],
        ['Status', (r) => badge(r.status) + (r.reason ? `<br><span class="muted">${esc(r.reason)}</span>` : '')],
        ['Download', (r) => r.status === 'Valid' ? `<a class="btn sm" target="_blank" rel="noopener" href="/api/certificates/${r.id}/pdf">📥 Certificate PDF</a>` : '']
      ], certificates, 'No certificate applications yet.')}
    `;
  },

  async Wallet() {
    const w = await api('/api/centre/wallet');
    V.innerHTML = `
      <h2>Wallet Management</h2>
      <div class="stat" style="max-width:320px; margin-bottom:20px;">
        <span>Current Balance</span>
        <b>${inr(w.balance_paise)}</b>
      </div>
      <form id="wf" class="row">
        <div>
          <label>Recharge Amount (₹100 – ₹1,00,000)</label>
          <input name="amount_rupees" type="number" min="100" max="100000" required placeholder="500">
        </div>
        <div style="align-self:end"><button class="btn">Create Recharge Order</button></div>
      </form>
      <div id="wr" class="muted" style="margin-top:10px;"></div>
      <h3 style="margin-top:28px;">Transaction Ledger</h3>
      ${table([
        ['Date', (r) => date(r.created_at)],
        ['Type', (r) => `<span class="badge ${r.kind === 'credit' ? 'Valid' : 'Revoked'}">${r.kind.toUpperCase()}</span>`],
        ['Amount', (r) => inr(r.amount_paise)],
        ['Balance After', (r) => inr(r.balance_after)],
        ['Description', (r) => esc(r.description)],
        ['Reference', (r) => `<span style="font-family:monospace; font-size:0.8rem;">${esc(r.reference)}</span>`]
      ], w.ledger, 'No transactions yet.')}
    `;
  },

  async Helpdesk() {
    const { tickets } = await api('/api/centre/tickets');
    V.innerHTML = `
      <h2>Centre Support & Helpdesk</h2>
      ${table([
        ['Ticket No', (r) => `<b>${esc(r.ticket_no)}</b>`],
        ['Subject', (r) => esc(r.subject)],
        ['Priority', (r) => esc(r.priority)],
        ['Status', (r) => badge(r.status)]
      ], tickets, 'No support tickets opened.')}

      <h3 style="margin-top:24px;">Submit New Ticket to Council</h3>
      <form id="tf">
        <div class="row">
          <div><label>Subject</label><input name="subject" required maxlength="150"></div>
          <div>
            <label>Priority</label>
            <select name="priority">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <label>Detailed Message</label>
        <textarea name="body" rows="3" required maxlength="2000"></textarea>
        <br>
        <button class="btn" style="margin-top:10px;">Submit Ticket</button>
      </form>
    `;
  },
};

function openMarksheetModal(students, preselectedStudentId = null) {
  const box = $('#mrkModal') || $('#modalBox');
  if (!box) return;

  const defaultSubs = [
    { name: 'Computer Fundamentals & OS', max_th: 70, max_pr: 30 },
    { name: 'Office Productivity Suite', max_th: 70, max_pr: 30 },
    { name: 'Database Management Concepts', max_th: 70, max_pr: 30 },
    { name: 'Internet & Web Technologies', max_th: 70, max_pr: 30 },
  ];

  box.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content" style="max-width:720px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>Enter Student Examination Marks</h3>
          <button class="btn sm alt" onclick="this.closest('.modal-overlay').remove()">✕ Cancel</button>
        </div>
        <form id="mrkForm">
          <div class="row">
            <div>
              <label>Select Student *</label>
              <select name="student_id" required>
                ${students.map((s) => `
                  <option value="${s.id}" ${preselectedStudentId == s.id ? 'selected' : ''}>
                    ${esc(s.name)} (${esc(s.student_code)}) - ${esc(s.course)}
                  </option>
                `).join('')}
              </select>
            </div>
            <div>
              <label>Roll Number (optional)</label>
              <input name="roll_no" placeholder="e.g. 20260101">
            </div>
            <div>
              <label>Exam Session *</label>
              <input name="exam_session" value="2026" required>
            </div>
          </div>

          <h4 style="margin:16px 0 8px;">Subject-wise Marks Evaluation</h4>
          <div class="wrap" style="margin-bottom:12px;">
            <table id="subTable">
              <thead>
                <tr>
                  <th>Subject / Module Name</th>
                  <th style="width:90px;">Max Th.</th>
                  <th style="width:90px;">Obt Th.</th>
                  <th style="width:90px;">Max Pr.</th>
                  <th style="width:90px;">Obt Pr.</th>
                </tr>
              </thead>
              <tbody>
                ${defaultSubs.map((s, idx) => `
                  <tr>
                    <td><input name="sub_name_${idx}" value="${esc(s.name)}" required></td>
                    <td><input name="sub_max_th_${idx}" type="number" value="${s.max_th}" required min="0"></td>
                    <td><input name="sub_obt_th_${idx}" type="number" value="55" required min="0"></td>
                    <td><input name="sub_max_pr_${idx}" type="number" value="${s.max_pr}" required min="0"></td>
                    <td><input name="sub_obt_pr_${idx}" type="number" value="25" required min="0"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
            <button type="button" class="btn alt" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button class="btn gold">Submit Marksheet For Council Approval</button>
          </div>
        </form>
      </div>
    </div>
  `;

  $('#mrkForm').onsubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const f = form(e.target);
      const subjects = [];
      for (let i = 0; i < defaultSubs.length; i++) {
        subjects.push({
          name: f[`sub_name_${i}`],
          max_theory: +f[`sub_max_th_${i}`],
          obt_theory: +f[`sub_obt_th_${i}`],
          max_practical: +f[`sub_max_pr_${i}`],
          obt_practical: +f[`sub_obt_pr_${i}`],
        });
      }

      const res = await api('/api/marksheets/submit', {
        method: 'POST',
        body: {
          student_id: +f.student_id,
          roll_no: f.roll_no,
          exam_session: f.exam_session,
          subjects,
        },
      });

      toast(`Marksheet submitted! Score: ${res.total_obtained}/${res.total_max} (${res.percentage}%) Grade: ${res.grade}`);
      document.querySelector('.modal-overlay')?.remove();
      if (views[current]) views[current]();
    });
  };
}

V.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-a]');
  if (!btn) return;
  const act = btn.dataset.a;
  const id = btn.dataset.id;

  if (act === 'apply') {
    guard(async () => {
      await api('/api/centre/certificates', { method: 'POST', body: { student_id: +id } });
      toast('Certificate request sent to Council for approval');
    });
  } else if (act === 'account') {
    guard(async () => {
      const res = await api(`/api/centre/students/${id}/account`, { method: 'POST', body: {} });
      alert(`Student Portal Credentials Created!\n\nLogin Username: ${res.login_id} (or ${res.email})\nDefault Password: ${res.default_password}\n\nStudent can now log in at /login to view their Marksheets, Certificates, and Digital ID card!`);
    });
  } else if (act === 'marksheet-prep') {
    guard(async () => {
      const { students } = await api('/api/centre/students');
      openMarksheetModal(students, id);
    });
  }
});

V.addEventListener('submit', (e) => {
  e.preventDefault();
  guard(async () => {
    const f = form(e.target);
    if (e.target.id === 'sf') {
      f.course_id = +f.course_id;
      await api('/api/centre/students', { method: 'POST', body: f });
      toast('Student registered successfully!');
    }
    if (e.target.id === 'wf') {
      const d = await api('/api/centre/wallet/recharge', { method: 'POST', body: f });
      $('#wr').textContent = `Order ${d.provider_ref} created for ${inr(d.amount_paise)}. Payment gateway adapter pending.`;
      return;
    }
    if (e.target.id === 'tf') {
      const d = await api('/api/centre/tickets', { method: 'POST', body: f });
      toast('Support ticket submitted: ' + d.ticket_no);
    }
    await views[current]();
  });
});

(async () => {
  const me = await needRole(['centre_owner', 'centre_staff']);
  if (!me) return;
  $('#who').textContent = me.user.name;
  $('#out').onclick = async (e) => {
    e.preventDefault();
    await api('/api/auth/logout', { method: 'POST' });
    location = '/login';
  };
  tabs($('#tabs'), Object.keys(views), (n) => {
    current = n;
    guard(() => views[n]());
  });
})();
