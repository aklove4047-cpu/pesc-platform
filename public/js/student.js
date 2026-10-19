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

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px; border-left: 5px solid #d4af37;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge ${s.status}">${s.status.toUpperCase()}</span>
              <h2 style="margin: 8px 0 4px; font-size:1.8rem;">Welcome, ${esc(s.name)}!</h2>
              <p class="muted">Enrollment / Student Code: <b style="color:var(--navy); font-family:monospace; font-size:1.05rem;">${esc(s.student_code)}</b></p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#64748b;">Affiliated Training Centre</span>
              <h4 style="margin:2px 0; color:var(--navy);">${esc(s.centre_name)} (${esc(s.centre_code)})</h4>
              <p style="font-size:0.8rem; color:#64748b;">${esc(s.centre_district)}, ${esc(s.centre_state)}</p>
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
            <b style="font-size:1.3rem;">${mrkData.marksheets.length ? mrkData.marksheets[0].result + ' (' + mrkData.marksheets[0].grade + ')' : 'In Progress'}</b>
            <p class="muted" style="margin-top:6px;">${mrkData.marksheets.length ? 'Percentage: ' + mrkData.marksheets[0].percentage + '%' : 'Awaiting examination marks'}</p>
          </div>
          <div class="stat">
            <span>Certificate Status</span>
            <b style="font-size:1.3rem;">${certData.certificates.length ? certData.certificates[0].status : 'Pending'}</b>
            <p class="muted" style="margin-top:6px;">${certData.certificates.length && certData.certificates[0].cert_no ? certData.certificates[0].cert_no : 'Issued upon course completion'}</p>
          </div>
        </div>

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
      const subjects = m.subjects || [];

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
                    <td><b style="color:var(--navy);">${sub.total_obt}</b></td>
                    <td>${badge(sub.result)}</td>
                  </tr>
                `).join('')}
                <tr style="background:#f1f5f9; font-weight:bold;">
                  <td colspan="4" style="text-align:right;">GRAND TOTAL:</td>
                  <td>${m.total_max}</td>
                  <td colspan="2"></td>
                  <td style="color:var(--navy); font-size:1.05rem;">${m.total_obtained}</td>
                  <td>${badge(m.result)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2>Statement of Marks</h2>
              <p class="muted">Marksheet No: <b style="color:var(--navy);">${esc(m.marksheet_no || 'Pending Approval')}</b> · Exam Session: ${esc(m.exam_session)}</p>
            </div>
            ${m.status === 'Approved' ? `
              <a href="/api/marksheets/${m.id}/pdf" target="_blank" class="btn gold">
                📥 Download Official Marksheet (PDF)
              </a>
            ` : `<span class="badge ${m.status}">${m.status}</span>`}
          </div>

          <div class="grid" style="margin-bottom:16px;">
            <div class="stat"><span>Total Marks</span><b>${m.total_obtained} / ${m.total_max}</b></div>
            <div class="stat"><span>Percentage</span><b>${m.percentage}%</b></div>
            <div class="stat"><span>Grade</span><b>${esc(m.grade)}</b></div>
            <div class="stat"><span>Result</span><b>${badge(m.result)}</b></div>
          </div>

          ${subjectsHtml}

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; font-size:0.85rem; color:#64748b;">
            💡 <b>Verification Note:</b> This official statement of marks is certified by Purvanchal Education & Skill Council. An online QR code is embedded in the PDF for instant digital validation.
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
      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
            <div>
              <h2>Course Completion Certificate</h2>
              <p class="muted">Status: ${badge(c.status)}</p>
            </div>
            ${c.status === 'Valid' ? `
              <div style="display:flex; gap:10px;">
                <a href="/verify/${c.token}" target="_blank" class="btn alt">🔍 Public Verification Page</a>
                <a href="/api/certificates/${c.id}/pdf" target="_blank" class="btn gold">📥 Download Certificate (PDF)</a>
              </div>
            ` : ''}
          </div>

          <div style="border: 2px solid #d4af37; border-radius:14px; padding:30px; text-align:center; background: radial-gradient(circle, #ffffff 60%, #fefce8 100%);">
            <h3 style="color:#0a2a5e; letter-spacing:1px; font-size:1.4rem;">PURVANCHAL EDUCATION & SKILL COUNCIL</h3>
            <p class="muted" style="margin-bottom:24px;">National Skill Education & Training Council</p>
            <h1 style="color:#0a2a5e; font-size:1.8rem; margin:16px 0;">Certificate of Course Completion</h1>
            <p style="font-size:1.1rem; color:#475569; margin:12px 0;">This is to certify that <b>${esc(me.user.name)}</b> has successfully completed the course</p>
            <h2 style="color:#0a2a5e; font-size:1.6rem; margin:12px 0;">"${esc(c.course_name)}"</h2>
            <p class="muted">at <b>${esc(c.centre_name)}</b></p>
            <div style="margin-top:30px; display:flex; justify-content:space-around; font-size:0.9rem; color:#64748b; border-top:1px dashed #cbd5e1; padding-top:16px;">
              <div>Certificate No: <b>${esc(c.cert_no || 'Processing')}</b></div>
              <div>Issue Date: <b>${date(c.issued_at) || 'Pending'}</b></div>
            </div>
          </div>
        </div>
      `;
    },

    'Digital ID Card': async () => {
      const data = await api('/api/student/id-card');
      const idc = data.id_card;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
            <div>
              <h2>Digital Student Identity Card</h2>
              <p class="muted">Official identity credential issued by Purvanchal Education & Skill Council</p>
            </div>
            <button onclick="window.print()" class="btn alt">🖨️ Print ID Card</button>
          </div>

          <div class="id-card-preview">
            <div class="id-card-header">
              <h4>PURVANCHAL EDUCATION & SKILL COUNCIL</h4>
              <p>STUDENT IDENTITY CARD</p>
            </div>
            <div class="id-card-body">
              <div class="id-photo">🎓</div>
              <div class="id-info">
                <p><b>Name:</b> ${esc(idc.name)}</p>
                <p><b>Roll / Code:</b> ${esc(idc.student_code)}</p>
                <p><b>Father's Name:</b> ${esc(idc.father_name || 'N/A')}</p>
                <p><b>Course:</b> ${esc(idc.course_name)}</p>
                <p><b>Centre:</b> ${esc(idc.centre_name)}</p>
              </div>
            </div>
            <div class="id-card-footer">
              <span>Code: <b>${esc(idc.centre_code)}</b></span>
              <span>Valid Session: <b>${esc(idc.valid_until)}</b></span>
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
