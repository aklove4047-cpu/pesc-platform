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

          <div style="border: 3px solid #d4af37; border-radius:14px; padding:36px; text-align:center; background: radial-gradient(circle, #ffffff 60%, #fefce8 100%); box-shadow:var(--shadow-md);">
            <h3 style="color:#0a2a5e; letter-spacing:1px; font-size:1.5rem; margin:0 0 6px;">PURVANCHAL EDUCATION & SKILL COUNCIL</h3>
            <p class="muted" style="margin-bottom:20px; font-weight:600;">Autonomous Body for Skill & Vocational Training</p>
            <h1 style="color:#0a2a5e; font-size:2rem; margin:16px 0;">Certificate of Competency & Completion</h1>
            <p style="font-size:1.15rem; color:#475569; margin:12px 0;">This is to certify that candidate <b>${esc(me.user.name)}</b> has successfully qualified the prescribed curriculum for</p>
            <h2 style="color:#0a2a5e; font-size:1.8rem; margin:14px 0;">"${esc(c.course_name)}"</h2>
            <p class="muted" style="font-size:1.05rem;">Conducted through accredited study centre <b>${esc(c.centre_name)}</b></p>
            <div style="margin-top:32px; display:flex; justify-content:space-around; font-size:0.95rem; color:#475569; border-top:1px dashed #cbd5e1; padding-top:18px;">
              <div>Certificate No: <b style="color:var(--navy); font-family:monospace;">${esc(c.cert_no || 'Processing')}</b></div>
              <div>Issue Date: <b>${date(c.issued_at) || 'Pending'}</b></div>
              <div>Digital Token: <code style="color:#16a34a;">${esc(c.token ? c.token.slice(0, 10) + '…' : '—')}</code></div>
            </div>
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
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
            <div>
              <h2>Digital Student Identity Card</h2>
              <p class="muted">Official identity credential issued by Purvanchal Education & Skill Council</p>
            </div>
            <button onclick="window.print()" class="btn alt">🖨️ Print ID Card</button>
          </div>

          <div class="id-card-preview" style="max-width:440px; margin:0 auto; box-shadow:var(--shadow-lg);">
            <div class="id-card-header">
              <h4>PURVANCHAL EDUCATION & SKILL COUNCIL</h4>
              <p>STUDENT IDENTITY CARD</p>
            </div>
            <div class="id-card-body">
              <div class="id-photo" style="font-size:3rem;">🎓</div>
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
