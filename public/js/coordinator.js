guard(async () => {
  const me = await needRole(['coordinator', 'super_admin', 'admin']);
  if (!me) return;

  $('#who').textContent = me.user.name + ` (${me.user.role.toUpperCase()})`;
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
      const data = await api('/api/coordinator/dashboard');
      const st = data.stats;
      const co = data.coordinator;

      viewEl.innerHTML = `
        <div class="card" style="margin-bottom:20px; border-left: 5px solid #2563eb;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge active">REGIONAL COORDINATOR</span>
              <h2 style="margin: 8px 0 4px; font-size:1.8rem;">Officer: ${esc(co.name)}</h2>
              <p class="muted">Email: ${esc(co.email)} · Assigned Jurisdiction: <b style="color:var(--navy);">${esc(co.state || 'All Assigned Territories')}</b></p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#64748b;">Council Authority</span>
              <h4 style="margin:2px 0; color:var(--navy);">Regional Administration Division</h4>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="stat">
            <span>Assigned Centres</span>
            <b>${st.centres_total}</b>
            <p class="muted">${st.centres_active} active centres in territory</p>
          </div>
          <div class="stat">
            <span>Enrolled Students</span>
            <b>${st.students_total}</b>
            <p class="muted">Active student registrations</p>
          </div>
          <div class="stat" style="border-color:#fde68a;">
            <span style="color:#b45309;">Pending Marksheets</span>
            <b style="color:#b45309;">${st.marksheets_pending}</b>
            <p class="muted">Awaiting evaluation approval</p>
          </div>
          <div class="stat" style="border-color:#fed7aa;">
            <span style="color:#c2410c;">Pending Certificates</span>
            <b style="color:#c2410c;">${st.certificates_pending}</b>
            <p class="muted">Awaiting council issue approval</p>
          </div>
        </div>
      `;
    },

    'Assigned Centres': async () => {
      const data = await api('/api/coordinator/centres');
      const centres = data.centres;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h2>Centres Under Your Jurisdiction</h2>
              <p class="muted">Total ${centres.length} affiliated franchise institutes assigned to you</p>
            </div>
          </div>
          ${table([
            ['Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.centre_code)}</b>`],
            ['Centre Name', (r) => `<b>${esc(r.name)}</b><br><span class="muted">${esc(r.district)}, ${esc(r.state)}</span>`],
            ['Owner Details', (r) => `${esc(r.owner_name || 'N/A')}<br><span class="muted">${esc(r.owner_mobile || '')} · ${esc(r.owner_email || '')}</span>`],
            ['Students', (r) => `<b>${r.students_count || 0}</b>`],
            ['Marksheets', (r) => `${r.marksheets_count || 0}`],
            ['Certificates', (r) => `${r.certs_count || 0}`],
            ['Status', (r) => badge(r.status)],
          ], centres, 'No centres assigned to your account yet.')}
        </div>
      `;
    },

    'Marksheet Approvals': async () => {
      const data = await api('/api/marksheets/pending');
      const list = data.marksheets;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h2>Pending Marksheets Queue</h2>
              <p class="muted">Review examination scores submitted by centres and approve for official certification</p>
            </div>
            <span class="badge ${list.length ? 'Pending' : 'Approved'}">${list.length} Pending</span>
          </div>

          <div id="mlist">
            ${table([
              ['Candidate', (r) => `<b>${esc(r.student_name)}</b><br><span class="muted">Code: ${esc(r.student_code)} · Roll: ${esc(r.roll_no)}</span>`],
              ['Course & Centre', (r) => `<b>${esc(r.course_name)}</b><br><span class="muted">${esc(r.centre_name)} (${esc(r.centre_code)})</span>`],
              ['Score', (r) => `<b>${r.total_obtained} / ${r.total_max}</b><br><span class="muted">${r.percentage}% (${esc(r.grade)})</span>`],
              ['Result', (r) => badge(r.result)],
              ['Actions', (r) => `
                <div style="display:flex; gap:6px;">
                  <button class="btn sm gold" data-act="view" data-id="${r.id}">View Marks</button>
                  <button class="btn sm" data-act="app-mrk" data-id="${r.id}">Approve</button>
                  <button class="btn sm danger" data-act="rej-mrk" data-id="${r.id}">Reject</button>
                </div>
              `],
            ], list, 'No marksheets awaiting approval. All clear!')}
          </div>
        </div>
        <div id="modalBox"></div>
      `;

      $('#mlist').onclick = (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;
        const id = btn.dataset.id;
        const act = btn.dataset.act;

        if (act === 'app-mrk') {
          if (!confirm('Approve this marksheet? It will issue an official marksheet number and unguessable QR verification token.')) return;
          guard(async () => {
            const res = await api(`/api/marksheets/${id}/decision`, { method: 'POST', body: { decision: 'approve' } });
            toast(`Marksheet Approved! Number: ${res.marksheet_no}`);
            R['Marksheet Approvals']();
          });
        } else if (act === 'rej-mrk') {
          const reason = prompt('Please enter reason for rejecting this marksheet:');
          if (!reason) return;
          guard(async () => {
            await api(`/api/marksheets/${id}/decision`, { method: 'POST', body: { decision: 'reject', reason } });
            toast('Marksheet rejected.');
            R['Marksheet Approvals']();
          });
        } else if (act === 'view') {
          const m = list.find((x) => String(x.id) === String(id));
          if (!m) return;
          const subjects = m.subjects || [];
          $('#modalBox').innerHTML = `
            <div class="modal-overlay">
              <div class="modal-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                  <h3>Marks Breakdown: ${esc(m.student_name)}</h3>
                  <button class="btn sm alt" onclick="$('#modalBox').innerHTML=''">✕ Close</button>
                </div>
                <p class="muted">Course: <b>${esc(m.course_name)}</b> · Session: <b>${esc(m.exam_session)}</b></p>
                <div class="wrap" style="margin:16px 0;">
                  <table>
                    <thead>
                      <tr><th>Subject</th><th>Max Th</th><th>Max Pr</th><th>Obt Th</th><th>Obt Pr</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                      ${subjects.map((s) => `
                        <tr>
                          <td>${esc(s.name)}</td>
                          <td>${s.max_theory}</td>
                          <td>${s.max_practical}</td>
                          <td>${s.obt_theory}</td>
                          <td>${s.obt_practical}</td>
                          <td><b>${s.total_obt}</b></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:12px; border-radius:8px;">
                  <div>Percentage: <b>${m.percentage}%</b> · Grade: <b>${esc(m.grade)}</b> · Result: ${badge(m.result)}</div>
                  <div style="display:flex; gap:8px;">
                    <button class="btn sm" onclick="$('#modalBox').innerHTML=''; $('button[data-act=app-mrk][data-id=\\'${m.id}\\']').click();">Approve</button>
                    <button class="btn sm danger" onclick="$('#modalBox').innerHTML=''; $('button[data-act=rej-mrk][data-id=\\'${m.id}\\']').click();">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      };
    },

    'Certificate Approvals': async () => {
      const data = await api('/api/certificates/pending');
      const list = data.certificates;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h2>Pending Certificates Queue</h2>
              <p class="muted">Authorize course completion certificates for verified students</p>
            </div>
            <span class="badge ${list.length ? 'Pending' : 'Approved'}">${list.length} Pending</span>
          </div>

          <div id="clist">
            ${table([
              ['Candidate', (r) => `<b>${esc(r.student_name)}</b><br><span class="muted">Code: ${esc(r.student_code)}</span>`],
              ['Course', (r) => `<b>${esc(r.course_name)}</b>`],
              ['Centre', (r) => `${esc(r.centre_name)} (${esc(r.centre_code)})`],
              ['Application Date', (r) => date(r.created_at)],
              ['Actions', (r) => `
                <div style="display:flex; gap:6px;">
                  <button class="btn sm" data-act="app-cert" data-id="${r.id}">Approve</button>
                  <button class="btn sm danger" data-act="rej-cert" data-id="${r.id}">Reject</button>
                </div>
              `],
            ], list, 'No certificates awaiting approval.')}
          </div>
        </div>
      `;

      $('#clist').onclick = (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;
        const id = btn.dataset.id;
        const act = btn.dataset.act;

        if (act === 'app-cert') {
          if (!confirm('Approve and issue official Certificate?')) return;
          guard(async () => {
            const res = await api(`/api/certificates/${id}/decision`, { method: 'POST', body: { decision: 'approve' } });
            toast(`Certificate Issued! Number: ${res.cert_no}`);
            R['Certificate Approvals']();
          });
        } else if (act === 'rej-cert') {
          const reason = prompt('Please enter reason for rejecting this certificate:');
          if (!reason) return;
          guard(async () => {
            await api(`/api/certificates/${id}/decision`, { method: 'POST', body: { decision: 'reject', reason } });
            toast('Certificate application rejected.');
            R['Certificate Approvals']();
          });
        }
      };
    },

    'Reports & CSV Export': async () => {
      viewEl.innerHTML = `
        <div class="card">
          <h2>Territory Reports & CSV Data Export</h2>
          <p class="muted">Generate comprehensive reports for assigned centres and export directly to Microsoft Excel / CSV</p>

          <div class="grid" style="margin-top:20px;">
            <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
              <h3 style="margin-bottom:6px;">Student Admissions</h3>
              <p class="muted" style="margin-bottom:14px;">Detailed registry of all student admissions in your centres</p>
              <div style="display:flex; gap:8px;">
                <button class="btn sm" id="btnViewAdm">View Report</button>
                <a href="/api/reports/admissions?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>

            <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
              <h3 style="margin-bottom:6px;">Marksheets & Results</h3>
              <p class="muted" style="margin-bottom:14px;">Academic evaluation and performance records</p>
              <div style="display:flex; gap:8px;">
                <button class="btn sm" id="btnViewMrk">View Report</button>
                <a href="/api/reports/marksheets?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>

            <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
              <h3 style="margin-bottom:6px;">Certificates Issued</h3>
              <p class="muted" style="margin-bottom:14px;">Council completion certificates tracking</p>
              <div style="display:flex; gap:8px;">
                <button class="btn sm" id="btnViewCert">View Report</button>
                <a href="/api/reports/certificates?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>

            <div class="stat" style="background:#fff; border:1px solid #cbd5e1;">
              <h3 style="margin-bottom:6px;">Centres Directory</h3>
              <p class="muted" style="margin-bottom:14px;">Franchise centres performance metrics</p>
              <div style="display:flex; gap:8px;">
                <button class="btn sm" id="btnViewCent">View Report</button>
                <a href="/api/reports/centres?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>
          </div>

          <div id="repData" style="margin-top:24px;"></div>
        </div>
      `;

      $('#btnViewAdm').onclick = async () => {
        const d = await api('/api/reports/admissions');
        $('#repData').innerHTML = `
          <h3>Admissions Report (${d.count} records)</h3>
          ${table([
            ['Code', (r) => esc(r.student_code)],
            ['Name', (r) => esc(r.name)],
            ['Course', (r) => esc(r.course_name)],
            ['Centre', (r) => esc(r.centre_name)],
            ['Session', (r) => esc(r.session)],
            ['Admission Date', (r) => date(r.created_at)],
            ['Status', (r) => badge(r.status)],
          ], d.admissions)}
        `;
      };

      $('#btnViewMrk').onclick = async () => {
        const d = await api('/api/reports/marksheets');
        $('#repData').innerHTML = `
          <h3>Marksheets Report (${d.count} records)</h3>
          ${table([
            ['Marksheet No', (r) => esc(r.marksheet_no || 'Pending')],
            ['Candidate', (r) => `${esc(r.student_name)} (${esc(r.student_code)})`],
            ['Course', (r) => esc(r.course_name)],
            ['Score', (r) => `${r.total_obtained} / ${r.total_max} (${r.percentage}%)`],
            ['Grade', (r) => esc(r.grade)],
            ['Result', (r) => badge(r.result)],
            ['Status', (r) => badge(r.status)],
          ], d.marksheets)}
        `;
      };

      $('#btnViewCert').onclick = async () => {
        const d = await api('/api/reports/certificates');
        $('#repData').innerHTML = `
          <h3>Certificates Report (${d.count} records)</h3>
          ${table([
            ['Cert No', (r) => esc(r.cert_no || 'Pending')],
            ['Candidate', (r) => `${esc(r.student_name)} (${esc(r.student_code)})`],
            ['Course', (r) => esc(r.course_name)],
            ['Centre', (r) => esc(r.centre_name)],
            ['Date', (r) => date(r.issued_at || r.created_at)],
            ['Status', (r) => badge(r.status)],
          ], d.certificates)}
        `;
      };

      $('#btnViewCent').onclick = async () => {
        const d = await api('/api/reports/centres');
        $('#repData').innerHTML = `
          <h3>Centres Report (${d.count} records)</h3>
          ${table([
            ['Code', (r) => esc(r.centre_code)],
            ['Centre Name', (r) => esc(r.name)],
            ['Location', (r) => `${esc(r.district)}, ${esc(r.state)}`],
            ['Students', (r) => r.total_students],
            ['Certificates', (r) => r.valid_certs],
            ['Marksheets', (r) => r.approved_marksheets],
            ['Status', (r) => badge(r.status)],
          ], d.centres)}
        `;
      };
    },
  };

  tabs(tabsEl, Object.keys(R), (k) => R[k]());
});
