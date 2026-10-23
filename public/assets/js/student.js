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
            <!-- Top Accreditations & Run By Bar -->
            <div style="border-bottom:2px solid #b45309; padding-bottom:10px; margin-bottom:14px; text-align:center;">
              <div style="font-size:1.15rem; font-weight:900; color:#0a2a5e; letter-spacing:0.5px; line-height:1.2; margin-bottom:2px;">
                पूर्वांचल एजुकेशन एंड स्किल काउंसिल &nbsp;|&nbsp; PURVANCHAL EDUCATION AND SKILL COUNCIL
              </div>
              <div style="font-size:0.88rem; font-weight:800; color:#b45309; letter-spacing:0.6px; text-transform:uppercase; margin-bottom:3px;">
                RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
              </div>
              <div style="font-size:0.75rem; color:#1e293b; font-weight:700; line-height:1.4; margin-bottom:2px; max-width:850px; margin-left:auto; margin-right:auto;">
                REGISTERED UNDER INDIAN TRUST ACT &nbsp;||&nbsp; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
              </div>
              <div style="font-size:0.74rem; color:#334155; font-weight:700; line-height:1.4; margin-bottom:2px;">
                AN ISO 9001:2015 CERTIFIED COUNCIL &nbsp;||&nbsp; MSME REGISTERED ORGANISATION
              </div>
              <div style="font-size:0.74rem; font-weight:800; color:#0284c7; margin-top:2px;">
                🌐 <a href="https://pescouncil.in" target="_blank" style="color:#0284c7; text-decoration:none;">https://pescouncil.in</a>
              </div>
            </div>

            <!-- Institute & Director Top Header Row -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5px solid #d4af37; padding-bottom:10px; margin-bottom:14px; gap:12px; text-align:left;">
              <!-- Left: Institute Info & Centre Code -->
              <div style="flex:1; max-width:280px;">
                <span style="display:inline-block; background:#064e3b; color:#ffffff; font-size:0.66rem; font-weight:800; padding:2px 7px; border-radius:4px; margin-bottom:3px; letter-spacing:0.5px;">AUTHORIZED TRAINING CENTRE</span>
                <div style="font-size:1.05rem; font-weight:900; color:#064e3b; line-height:1.2; margin-bottom:2px;">${esc(cName)}</div>
                <div style="font-size:0.82rem; font-weight:800; color:#b45309;">Centre Code: <span style="font-family:monospace;">${esc(cCode)}</span></div>
                <div style="font-size:0.73rem; color:#475569; line-height:1.3; margin-top:2px;">📍 ${esc(cAddress)}</div>
              </div>

              <!-- Center: Council Crest & Title -->
              <div style="flex:1; text-align:center;">
                <div style="display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, #0a2a5e, #064e3b); color:#d4af37; font-weight:900; font-size:1.4rem; box-shadow:0 2px 6px rgba(0,0,0,0.15); margin-bottom:3px; border:2px solid #d4af37;">P</div>
                <div style="font-size:1.15rem; font-weight:900; color:#0a2a5e; letter-spacing:0.5px; line-height:1.2;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</div>
                <div style="font-size:0.82rem; font-weight:800; color:#b45309; letter-spacing:1px; text-transform:uppercase; margin-top:2px;">OFFICIAL STATEMENT OF MARKS</div>
              </div>

              <!-- Right: Director Photo & Validity -->
              <div style="display:flex; align-items:flex-start; gap:10px; max-width:260px; text-align:right;">
                <div style="flex:1;">
                  <span style="display:inline-block; font-size:0.68rem; font-weight:700; color:#64748b; text-transform:uppercase;">Director In-charge</span>
                  <div style="font-size:0.88rem; font-weight:800; color:#0f172a; margin-top:1px;">${esc(directorName)}</div>
                  <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-top:4px;">
                    <span style="display:inline-block; background:#ecfdf5; border:1px solid #a7f3d0; padding:2px 6px; border-radius:4px;">Validity: ${esc(validityText)}</span>
                  </div>
                </div>
                <div style="width:58px; height:72px; flex-shrink:0; border:2px solid #d4af37; border-radius:6px; overflow:hidden; background:#f8fafc; box-shadow:0 2px 5px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center;">
                  ${directorPhotoHtml}
                </div>
              </div>
            </div>

            <!-- Student Metadata Box -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.86rem; margin-bottom:12px; background:#f8fafc; padding:10px 14px; border-radius:6px; text-align:left; border:1px solid #e2e8f0;">
              <div>Candidate Name: <b>${esc(me.user.name)}</b></div>
              <div>Roll No / Student Code: <b style="font-family:monospace; color:#0a2a5e;">${esc(m.roll_no || me.user.student_code || me.user.email)}</b></div>
              <div>Father's Name: <b>${esc(m.father_name || me.user.father_name || 'N/A')}</b></div>
              <div>Course: <b style="color:#064e3b;">${esc(m.course_name || 'Diploma in Computer Application')}</b></div>
            </div>

            ${subjectsHtml}

            <!-- Bottom 3 Official Mohar & Signatures -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:20px; padding-top:14px; border-top:1.5px dashed #cbd5e1; text-align:center;">
              <!-- 1. Centre Director Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2px dashed #047857; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#047857; font-size:0.56rem; font-weight:800; text-transform:uppercase; transform:rotate(-4deg); background:rgba(4,120,87,0.04); box-shadow:inset 0 0 4px rgba(4,120,87,0.12);">
                  <span style="font-size:0.52rem;">★ MOHAR ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">${esc(cCode)}</span>
                  <span style="font-size:0.48rem;">CENTRE SEAL</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#064e3b; margin:6px 0 2px; line-height:1;">${esc(directorName)}</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:160px;">Centre Director Mohar &amp; Sign</span>
              </div>

              <!-- 2. Coordinator Office Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2px dashed #0284c7; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0284c7; font-size:0.56rem; font-weight:800; text-transform:uppercase; transform:rotate(3deg); background:rgba(2,132,199,0.04); box-shadow:inset 0 0 4px rgba(2,132,199,0.12);">
                  <span style="font-size:0.52rem;">★ REGIONAL ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">COORDINATOR</span>
                  <span style="font-size:0.48rem;">STATE OFFICE</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#0369a1; margin:6px 0 2px; line-height:1;">Dr. Rajesh Verma</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:170px;">Coordinator Office Mohar &amp; Sign</span>
              </div>

              <!-- 3. Head Office Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2.5px solid #d4af37; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#b45309; font-size:0.56rem; font-weight:800; text-transform:uppercase; background:radial-gradient(circle, #fefce8, #fef3c7); box-shadow:0 0 6px rgba(212,175,55,0.4);">
                  <span style="font-size:0.52rem;">★ PESC ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">HEAD OFFICE</span>
                  <span style="font-size:0.48rem;">NEW DELHI</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#b45309; margin:6px 0 2px; line-height:1;">Prof. S. N. Mishra</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:160px;">Head Office Mohar &amp; Sign</span>
              </div>
            </div>
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
            <!-- Top Accreditations & Run By Bar -->
            <div style="border-bottom:2px solid #b45309; padding-bottom:10px; margin-bottom:14px; text-align:center;">
              <div style="font-size:1.15rem; font-weight:900; color:#0a2a5e; letter-spacing:0.5px; line-height:1.2; margin-bottom:2px;">
                पूर्वांचल एजुकेशन एंड स्किल काउंसिल &nbsp;|&nbsp; PURVANCHAL EDUCATION AND SKILL COUNCIL
              </div>
              <div style="font-size:0.88rem; font-weight:800; color:#b45309; letter-spacing:0.6px; text-transform:uppercase; margin-bottom:3px;">
                RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
              </div>
              <div style="font-size:0.75rem; color:#1e293b; font-weight:700; line-height:1.4; margin-bottom:2px; max-width:850px; margin-left:auto; margin-right:auto;">
                REGISTERED UNDER INDIAN TRUST ACT &nbsp;||&nbsp; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
              </div>
              <div style="font-size:0.74rem; color:#334155; font-weight:700; line-height:1.4; margin-bottom:2px;">
                AN ISO 9001:2015 CERTIFIED COUNCIL &nbsp;||&nbsp; MSME REGISTERED ORGANISATION
              </div>
              <div style="font-size:0.74rem; font-weight:800; color:#0284c7; margin-top:2px;">
                🌐 <a href="https://pescouncil.in" target="_blank" style="color:#0284c7; text-decoration:none;">https://pescouncil.in</a>
              </div>
            </div>

            <!-- Institute & Director Top Header Row -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5px solid #d4af37; padding-bottom:10px; margin-bottom:14px; gap:12px; text-align:left;">
              <!-- Left: Institute Info & Centre Code -->
              <div style="flex:1; max-width:280px;">
                <span style="display:inline-block; background:#064e3b; color:#ffffff; font-size:0.66rem; font-weight:800; padding:2px 7px; border-radius:4px; margin-bottom:3px; letter-spacing:0.5px;">AUTHORIZED TRAINING CENTRE</span>
                <div style="font-size:1.05rem; font-weight:900; color:#064e3b; line-height:1.2; margin-bottom:2px;">${esc(cName)}</div>
                <div style="font-size:0.82rem; font-weight:800; color:#b45309;">Centre Code: <span style="font-family:monospace;">${esc(cCode)}</span></div>
                <div style="font-size:0.73rem; color:#475569; line-height:1.3; margin-top:2px;">📍 ${esc(cAddress)}</div>
              </div>

              <!-- Center: Council Crest & Title -->
              <div style="flex:1; text-align:center;">
                <div style="display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, #0a2a5e, #064e3b); color:#d4af37; font-weight:900; font-size:1.4rem; box-shadow:0 2px 6px rgba(0,0,0,0.15); margin-bottom:3px; border:2px solid #d4af37;">P</div>
                <div style="font-size:1.15rem; font-weight:900; color:#0a2a5e; letter-spacing:0.5px; line-height:1.2;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</div>
                <div style="font-size:0.72rem; font-weight:700; color:#b45309; letter-spacing:1px; text-transform:uppercase; margin-top:2px;">Central Autonomous Skill Development Board</div>
              </div>

              <!-- Right: Director Photo & Validity -->
              <div style="display:flex; align-items:flex-start; gap:10px; max-width:260px; text-align:right;">
                <div style="flex:1;">
                  <span style="display:inline-block; font-size:0.68rem; font-weight:700; color:#64748b; text-transform:uppercase;">Director In-charge</span>
                  <div style="font-size:0.88rem; font-weight:800; color:#0f172a; margin-top:1px;">${esc(directorName)}</div>
                  <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-top:4px;">
                    <span style="display:inline-block; background:#ecfdf5; border:1px solid #a7f3d0; padding:2px 6px; border-radius:4px;">Validity: ${esc(validityText)}</span>
                  </div>
                </div>
                <div style="width:58px; height:72px; flex-shrink:0; border:2px solid #d4af37; border-radius:6px; overflow:hidden; background:#f8fafc; box-shadow:0 2px 5px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center;">
                  ${directorPhotoHtml}
                </div>
              </div>
            </div>

            <!-- Certificate Body -->
            <div style="margin:16px 0 6px; font-size:1.25rem; font-family:serif; font-style:italic; color:#0f172a;">Statement of Skill Proficiency &amp; Completion</div>
            <div style="font-size:0.9rem; color:#475569; margin-bottom:12px;">This is to officially certify that</div>

            <div style="font-size:1.85rem; font-weight:900; color:#064e3b; text-decoration:underline; text-decoration-color:#d4af37; margin-bottom:6px; letter-spacing:0.5px;">
              ${esc(me.user.name)}
            </div>

            <div style="font-size:0.92rem; color:#334155; margin-bottom:14px;">
              Registration / Student Code: <b style="font-family:monospace; color:#0a2a5e;">${esc(me.user.student_code || me.user.roll_no || c.student_code || 'PESC-STU')}</b>
            </div>

            <div style="font-size:0.94rem; color:#334155; line-height:1.6; max-width:700px; margin:0 auto 18px;">
              has successfully completed the prescribed curriculum and passed the examination for the professional program:
              <div style="font-size:1.35rem; font-weight:800; margin:6px 0; color:#0a2a5e;">"${esc(c.course_name || 'Diploma in Computer Application')}"</div>
              with <b>Grade A+ (Exemplary Performance)</b> conducted under council national quality standards.
            </div>

            <div style="display:flex; justify-content:center; gap:24px; font-size:0.8rem; color:#64748b; margin-bottom:12px;">
              <div>Certificate No: <b style="color:var(--navy); font-family:monospace;">${esc(c.cert_no || 'PESC/2026/000001')}</b></div>
              <div>Issue Date: <b>${date(c.issued_at) || '01 Apr 2026'}</b></div>
              <div>Digital Token: <code style="color:#16a34a; font-weight:700;">${esc(c.token ? c.token.slice(0, 14) + '…' : 'PESC-TOKEN')}</code></div>
            </div>

            <!-- Bottom 3 Official Mohar & Signatures -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:20px; padding-top:14px; border-top:1.5px dashed #cbd5e1; text-align:center;">
              <!-- 1. Centre Director Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2px dashed #047857; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#047857; font-size:0.56rem; font-weight:800; text-transform:uppercase; transform:rotate(-4deg); background:rgba(4,120,87,0.04); box-shadow:inset 0 0 4px rgba(4,120,87,0.12);">
                  <span style="font-size:0.52rem;">★ MOHAR ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">${esc(cCode)}</span>
                  <span style="font-size:0.48rem;">CENTRE SEAL</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#064e3b; margin:6px 0 2px; line-height:1;">${esc(directorName)}</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:160px;">Centre Director Mohar &amp; Sign</span>
              </div>

              <!-- 2. Coordinator Office Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2px dashed #0284c7; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0284c7; font-size:0.56rem; font-weight:800; text-transform:uppercase; transform:rotate(3deg); background:rgba(2,132,199,0.04); box-shadow:inset 0 0 4px rgba(2,132,199,0.12);">
                  <span style="font-size:0.52rem;">★ REGIONAL ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">COORDINATOR</span>
                  <span style="font-size:0.48rem;">STATE OFFICE</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#0369a1; margin:6px 0 2px; line-height:1;">Dr. Rajesh Verma</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:170px;">Coordinator Office Mohar &amp; Sign</span>
              </div>

              <!-- 3. Head Office Mohar Sign -->
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="width:68px; height:68px; border:2.5px solid #d4af37; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#b45309; font-size:0.56rem; font-weight:800; text-transform:uppercase; background:radial-gradient(circle, #fefce8, #fef3c7); box-shadow:0 0 6px rgba(212,175,55,0.4);">
                  <span style="font-size:0.52rem;">★ PESC ★</span>
                  <span style="font-size:0.58rem; font-weight:900;">HEAD OFFICE</span>
                  <span style="font-size:0.48rem;">NEW DELHI</span>
                </div>
                <div style="font-family:cursive; font-size:1.15rem; color:#b45309; margin:6px 0 2px; line-height:1;">Prof. S. N. Mishra</div>
                <span style="font-size:0.75rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; display:block; padding-top:3px; width:100%; max-width:160px;">Head Office Mohar &amp; Sign</span>
              </div>
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
