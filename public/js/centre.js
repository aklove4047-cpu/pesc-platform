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
    V._students = students;
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <h2>Students Registry</h2>
          <p class="muted">Manage enrolled students, setup portal access, and enter exam scores</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <input id="centreStudentSearch" placeholder="🔍 Search student name, code, mobile..." style="padding:8px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.9rem; min-width:260px;">
          <span class="badge active" id="centreStudentCount">${students.length} Students</span>
        </div>
      </div>

      <div id="centreStudentsTableBox">
        ${table([
          ['Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
          ['Candidate Name', (r) => `<b>${esc(r.name)}</b>`],
          ['Mobile', (r) => esc(r.mobile || 'N/A')],
          ['Course', (r) => esc(r.course)],
          ['Status', (r) => badge(r.status)],
          ['Actions', (r) => `
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn sm" data-a="quick-view" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="Quick View & Credentials">👁️ View</button>
              <button class="btn sm alt" data-a="edit-student" data-id="${r.id}" data-name="${esc(r.name)}" data-father="${esc(r.father_name || '')}" data-mobile="${esc(r.mobile || '')}" data-email="${esc(r.email || '')}" data-dob="${esc(r.dob || '')}" data-session="${esc(r.session || '')}" data-course="${r.course_id}" title="Edit student details">✏️ Edit</button>
              <button class="btn sm alt" data-a="account" data-id="${r.id}" title="Setup student portal access">🔑 Login</button>
              <button class="btn sm" data-a="marksheet-prep" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.student_code)}" title="Submit marks for this student">📝 Marksheet</button>
              <button class="btn sm alt" data-a="apply" data-id="${r.id}">🎓 Cert</button>
            </div>
          `]
        ], students)}
      </div>

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

    const searchInput = $('#centreStudentSearch');
    if (searchInput) {
      searchInput.oninput = (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = V._students.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.student_code && s.student_code.toLowerCase().includes(q)) ||
          (s.mobile && s.mobile.includes(q)) ||
          (s.course && s.course.toLowerCase().includes(q))
        );
        $('#centreStudentCount').textContent = `${filtered.length} Students`;
        $('#centreStudentsTableBox').innerHTML = table([
          ['Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
          ['Candidate Name', (r) => `<b>${esc(r.name)}</b>`],
          ['Mobile', (r) => esc(r.mobile || 'N/A')],
          ['Course', (r) => esc(r.course)],
          ['Status', (r) => badge(r.status)],
          ['Actions', (r) => `
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn sm" data-a="quick-view" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="Quick View & Credentials">👁️ View</button>
              <button class="btn sm alt" data-a="edit-student" data-id="${r.id}" data-name="${esc(r.name)}" data-father="${esc(r.father_name || '')}" data-mobile="${esc(r.mobile || '')}" data-email="${esc(r.email || '')}" data-dob="${esc(r.dob || '')}" data-session="${esc(r.session || '')}" data-course="${r.course_id}" title="Edit student details">✏️ Edit</button>
              <button class="btn sm alt" data-a="account" data-id="${r.id}" title="Setup student portal access">🔑 Login</button>
              <button class="btn sm" data-a="marksheet-prep" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.student_code)}" title="Submit marks for this student">📝 Marksheet</button>
              <button class="btn sm alt" data-a="apply" data-id="${r.id}">🎓 Cert</button>
            </div>
          `]
        ], filtered, 'No matching students found.');
      };
    }
  },

  async Admissions() {
    const { inquiries } = await api('/api/centre/inquiries');
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div>
          <h2>Online Admissions & Applications</h2>
          <p class="muted">Prospective students applying through your centre website</p>
        </div>
        <span class="badge active">${inquiries.length} Inquiries</span>
      </div>

      ${table([
        ['Applicant', (r) => `<b>${esc(r.name)}</b><br><span class="muted">${esc(r.mobile)}${r.email ? ` · ${esc(r.email)}` : ''}</span>`],
        ['Interested Course', (r) => `<b>${esc(r.course_code || '')}</b> ${esc(r.course_name || 'General Inquiry')}`],
        ['Message / Query', (r) => `<span style="font-size:0.88rem;">${esc(r.message || 'Admission application via website')}</span>`],
        ['Application Date', (r) => date(r.created_at)],
        ['Status', (r) => badge(r.status)],
        ['Action', (r) => r.status === 'Enrolled' ? '<span style="color:#16a34a; font-weight:bold;">✓ Enrolled</span>' : `
          <button class="btn sm gold" data-a="enroll_inq" data-id="${r.id}" data-name="${esc(r.name)}" title="Convert this applicant to an enrolled student with login credentials">⚡ Enrol Student</button>
        `]
      ], inquiries, 'No online admission inquiries received yet.')}
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

  async Affiliation() {
    const data = await api('/api/centre/profile');
    const c = data.centre;
    const courses = data.courses;

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div>
          <h2>Centre Affiliation & Accreditation Charter</h2>
          <p class="muted">Official Autonomous Council Recognition, Institution Charter, and Marketing Kit</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn gold" onclick="window.print()">🖨️ Print Affiliation Certificate</button>
        </div>
      </div>

      <!-- Official Framed Affiliation Certificate -->
      <div class="centre-cert-frame" style="margin-bottom:28px;">
        <div class="cert-watermark-bg">PESC</div>
        <div class="centre-cert-inner-border">
          <div style="text-align:center; border-bottom:2px solid #d4af37; padding-bottom:16px; margin-bottom:20px;">
            <div style="display:flex; justify-content:center; align-items:center; gap:14px; margin-bottom:8px;">
              <div style="width:50px; height:50px; border-radius:50%; background:#071a33; color:#fde047; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:bold; border:2px solid #d4af37;">P</div>
              <div>
                <h1 style="font-size:1.8rem; margin:0; color:#071a33; letter-spacing:1px; text-transform:uppercase;">Purvanchal Education & Skill Council</h1>
                <h3 style="font-size:1.1rem; margin:2px 0; color:#b45309; font-weight:600;">पूर्वांचल शिक्षा एवं कौशल विकास परिषद</h3>
              </div>
            </div>
            <p style="margin:4px 0 0; font-size:0.85rem; color:#475569; font-family:Arial, sans-serif;">
              Autonomous National Council for Vocational & Technical Skill Education<br>
              <b style="color:#071a33;">Regd. Under Indian Trust Act 1882 · Govt. of India · ISO 9001:2015 Quality Certified Council</b>
            </p>
          </div>

          <div style="text-align:center; margin:24px 0;">
            <span style="display:inline-block; border-bottom:2px solid #d4af37; padding-bottom:4px; font-size:1.35rem; font-weight:bold; color:#071a33; letter-spacing:2px; text-transform:uppercase;">
              Charter of Authorized Training Centre (ATC)
            </span>
            <p style="font-size:1.05rem; margin:16px 0 8px; color:#334155;">
              This is to solemnly certify that the educational institution known as
            </p>
            <h2 style="font-size:2.2rem; color:#071a33; margin:8px 0; font-family:'Georgia', serif; font-weight:bold; letter-spacing:0.5px;">
              ${esc(c.name)}
            </h2>
            <p style="font-size:1.1rem; color:#475569; margin:4px 0 16px;">
              Located at: <b>${esc(c.address || `${c.district}, ${c.state}`)}</b>
            </p>
            <p style="max-width:760px; margin:0 auto; font-size:0.95rem; line-height:1.7; color:#334155; font-family:Arial, sans-serif;">
              has fulfilled the statutory physical and academic infrastructure criteria prescribed by the National Council and is hereby officially recognized as an <b>Accredited Vocational Training Centre</b> for conducting certified Computer, Technical, and Skill Development curricula.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin:28px 0; background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:6px; font-family:Arial, sans-serif; font-size:0.9rem;">
            <div><b>Centre Code:</b> <span style="font-family:monospace; color:#071a33; font-weight:bold; font-size:1.05rem;">${esc(c.centre_code)}</span></div>
            <div><b>Subdomain Portal:</b> <span style="color:#2563eb; font-weight:bold;">${esc(c.slug)}.pescouncil.in</span></div>
            <div><b>Affiliation Session:</b> <span style="color:#15803d; font-weight:bold;">2026 – 2027</span></div>
            <div><b>Status:</b> <span class="badge Valid">ACTIVE &amp; RECOGNIZED</span></div>
          </div>

          <div style="font-family:Arial, sans-serif; font-size:0.85rem; color:#475569; margin-bottom:24px;">
            <b>Authorized Vocational Streams:</b>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
              ${courses.map(co => `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;">${esc(co.code)} - ${esc(co.name)}</span>`).join('')}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:36px; padding-top:20px; border-top:1px dashed #cbd5e1; font-family:Arial, sans-serif;">
            <div style="text-align:center;">
              <div style="font-family:monospace; font-size:0.85rem; color:#64748b; margin-bottom:4px;">QR Verification Code</div>
              <div style="width:70px; height:70px; background:#f1f5f9; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:bold; color:#071a33; margin:0 auto;">
                [QR SECURE]
              </div>
              <small style="color:#64748b;">Code: ${esc(c.centre_code)}</small>
            </div>

            <div style="text-align:center;">
              <div style="width:70px; height:70px; border-radius:50%; border:2px double #d4af37; background:#fffbeb; margin:0 auto; display:flex; align-items:center; justify-content:center; color:#b45309; font-weight:bold; font-size:0.75rem;">
                SEAL OF<br>COUNCIL
              </div>
              <small style="color:#64748b; margin-top:4px; display:block;">ISO 9001:2015</small>
            </div>

            <div style="text-align:center;">
              <div style="font-family:'Brush Script MT', cursive, serif; font-size:1.6rem; color:#071a33; margin-bottom:2px;">R. K. Sharma</div>
              <div style="border-top:1px solid #071a33; width:150px; margin:0 auto 2px;"></div>
              <b style="font-size:0.8rem; color:#071a33;">Controller of Affiliations</b><br>
              <small style="color:#64748b;">Purvanchal Skill Council</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Centre Operational Details & Promotional Kit -->
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card" style="border:1px solid #cbd5e1;">
          <h3>🏢 Institute Operational Profile</h3>
          <p style="font-size:0.9rem; margin:8px 0 4px;"><b>Registered Director:</b> ${esc(c.owner_name || 'N/A')}</p>
          <p style="font-size:0.9rem; margin:4px 0;"><b>Contact Phone:</b> ${esc(c.owner_mobile || 'N/A')}</p>
          <p style="font-size:0.9rem; margin:4px 0;"><b>Contact Email:</b> ${esc(c.owner_email || 'N/A')}</p>
          <p style="font-size:0.9rem; margin:4px 0;"><b>District & State:</b> ${esc(c.district)}, ${esc(c.state)}</p>
          <p style="font-size:0.9rem; margin:4px 0;"><b>Wallet Balance:</b> <b style="color:#15803d;">${inr(data.wallet.balance_paise)}</b></p>
        </div>

        <div class="card" style="border:1px solid #cbd5e1;">
          <h3>🎨 Centre Promotional Branding Kit</h3>
          <p class="muted" style="font-size:0.88rem; margin-bottom:12px;">Download council-approved marketing assets for your computer institute reception and street boards:</p>
          <ul style="padding-left:18px; font-size:0.88rem; line-height:1.8; color:#334155;">
            <li><b>Official Flex Board Banner:</b> 8x3 & 10x4 ft formats with Council Logo</li>
            <li><b>Student Admission Prospectus:</b> 2026-27 Course Catalog & Syllabi</li>
            <li><b>Receipt Voucher & ID Card Templates:</b> High-resolution vector format</li>
          </ul>
          <button class="btn sm alt" style="margin-top:8px;" onclick="alert('Promotional material package sent to registered centre email address: ' + '${esc(c.owner_email || '')}')">📥 Email Me Marketing Kit</button>
        </div>
      </div>
    `;
  },

  async Notices() {
    const { notices } = await api('/api/centre/notices');
    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div>
          <h2>Official Council Notices & Circulars</h2>
          <p class="muted">All announcements, examination notices, and affiliation guidelines issued by Central Headquarters</p>
        </div>
      </div>

      ${table([
        ['Category', (r) => `<span class="badge ${r.pinned ? 'Valid' : 'Pending'}">${esc(r.category)}</span>`],
        ['Notice Headline & Details', (r) => `
          <b>${esc(r.title)}</b>
          <p class="muted" style="margin:4px 0 0; font-size:0.9rem;">${esc(r.content)}</p>
          ${r.link ? `<a href="${esc(r.link)}" target="_blank" style="color:#2563eb; font-size:0.82rem; font-weight:bold; margin-top:4px; display:inline-block;">🔗 View Notice Link</a>` : ''}
        `],
        ['Issued Date', (r) => date(r.created_at)],
        ['Priority', (r) => r.pinned ? '📌 Pinned / High' : 'Normal'],
      ], notices, 'No notices published for affiliated centres at this time.')}
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

  if (act === 'quick-view') {
    guard(async () => {
      const data = await api(`/api/centre/students/${id}/quick-view`);
      const s = data.student;
      const mrks = data.marksheets || [];
      const certs = data.certificates || [];
      let modalBox = $('#modalBox');
      if (!modalBox) {
        modalBox = document.createElement('div');
        modalBox.id = 'modalBox';
        document.body.appendChild(modalBox);
      }
      modalBox.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content" style="max-width:620px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div>
                <span class="badge ${s.status}">${s.status.toUpperCase()}</span>
                <h3 style="margin:4px 0 0; color:var(--navy);">${esc(s.name)}</h3>
              </div>
              <button type="button" class="btn sm alt" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f8fafc; padding:14px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.9rem;">
              <div><b>Student Code:</b> <code style="color:var(--navy); font-size:0.95rem;">${esc(s.student_code)}</code></div>
              <div><b>Course:</b> ${esc(s.course_code)} - ${esc(s.course_name)}</div>
              <div><b>Father's Name:</b> ${esc(s.father_name || 'N/A')}</div>
              <div><b>Date of Birth:</b> ${esc(s.dob || 'N/A')}</div>
              <div><b>Mobile:</b> ${esc(s.mobile || 'N/A')}</div>
              <div><b>Session:</b> ${esc(s.session || '2026-27')}</div>
            </div>

            <h4 style="margin:18px 0 8px; color:var(--navy);">Academic Credentials</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #cbd5e1; padding:10px 14px; border-radius:6px;">
                <div>
                  <b>Statement of Marks</b><br>
                  <span class="muted" style="font-size:0.85rem;">${mrks.length ? `${mrks[0].marksheet_no || 'Pending'} · ${mrks[0].percentage}% · Grade ${mrks[0].grade}` : 'Marksheet not yet submitted'}</span>
                </div>
                <div>
                  ${mrks.length && mrks[0].status === 'Approved' ? `<a href="/api/marksheets/${mrks[0].id}/pdf" target="_blank" class="btn sm gold">📥 Download PDF</a>` : mrks.length ? badge(mrks[0].status) : `<button class="btn sm" data-a="marksheet-prep" data-id="${s.id}" data-name="${esc(s.name)}" data-code="${esc(s.student_code)}" onclick="this.closest('.modal-overlay').remove()">📝 Enter Marks</button>`}
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #cbd5e1; padding:10px 14px; border-radius:6px;">
                <div>
                  <b>Skill Certificate</b><br>
                  <span class="muted" style="font-size:0.85rem;">${certs.length ? `${certs[0].cert_no || 'Pending Approval'}` : 'Certificate not applied'}</span>
                </div>
                <div>
                  ${certs.length && certs[0].status === 'Valid' ? `<a href="/api/certificates/${certs[0].id}/pdf" target="_blank" class="btn sm gold">📥 Download PDF</a>` : certs.length ? badge(certs[0].status) : `<button class="btn sm alt" data-a="apply" data-id="${s.id}" onclick="this.closest('.modal-overlay').remove()">🎓 Request Cert</button>`}
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #e2e8f0; padding-top:14px;">
              <button type="button" class="btn alt" onclick="this.closest('.modal-overlay').remove()">Close</button>
            </div>
          </div>
        </div>
      `;
    });
  } else if (act === 'enroll_inq') {
    guard(async () => {
      const res = await api(`/api/centre/inquiries/${id}/enroll`, { method: 'POST' });
      alert(`Student Enrolled Successfully!\n\nCandidate: ${btn.dataset.name}\nStudent Code: ${res.student_code}\nLogin ID: ${res.email}\nTemporary Password: ${res.default_password}\n\nThe student can now log in immediately from the main portal or your centre website!`);
      views.Admissions();
    });
  } else if (act === 'apply') {
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
  } else if (act === 'edit-student') {
    guard(async () => {
      const { courses } = await api('/api/centre/courses');
      const d = btn.dataset;
      let modalBox = $('#modalBox');
      if (!modalBox) {
        modalBox = document.createElement('div');
        modalBox.id = 'modalBox';
        document.body.appendChild(modalBox);
      }
      modalBox.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content" style="max-width:580px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3>✏️ Edit Student Profile</h3>
              <button type="button" class="btn sm alt" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <form id="editStudentFormCentre">
              <div class="row">
                <div><label>Student Full Name *</label><input name="name" value="${esc(d.name)}" required maxlength="100"></div>
                <div><label>Father's Name</label><input name="father_name" value="${esc(d.father)}" maxlength="100"></div>
                <div><label>Mobile Number</label><input name="mobile" value="${esc(d.mobile)}" pattern="[6-9][0-9]{9}"></div>
                <div><label>Email ID</label><input name="email" type="email" value="${esc(d.email)}"></div>
                <div><label>Date of Birth</label><input name="dob" type="date" value="${esc(d.dob)}"></div>
                <div><label>Academic Session</label><input name="session" value="${esc(d.session || '2026-27')}"></div>
                <div style="grid-column: span 2;">
                  <label>Enrolled Course *</label>
                  <select name="course_id" required>
                    ${courses.map(c => `<option value="${c.id}" ${c.id == d.course ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button type="button" class="btn alt" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button type="submit" class="btn gold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      `;
      $('#editStudentFormCentre').onsubmit = (ev) => {
        ev.preventDefault();
        guard(async () => {
          const payload = form(ev.target);
          payload.course_id = +payload.course_id;
          await api(`/api/centre/students/${id}`, { method: 'PUT', body: payload });
          toast('Student profile updated successfully!');
          document.querySelector('.modal-overlay')?.remove();
          if (views.Students) views.Students();
        });
      };
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
