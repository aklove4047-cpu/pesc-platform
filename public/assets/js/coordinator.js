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

  // ─── shared marksheet subjects modal ─────────────────────────────────────
  let _pendingMarksheets = [];
  let _pendingCertificates = [];

  // ─── IMAGE TO BASE64 HELPER ──────────────────────────────────────────────
  function imgToBase64(file) {
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });
  }

  // ─── IMAGE UPLOADER WIDGET ───────────────────────────────────────────────
  function buildImageUploader(id, label, currentUrl, helpText) {
    return `
      <div class="upload-box" style="margin-bottom:18px;">
        <label style="font-weight:600; font-size:0.9rem; display:block; margin-bottom:8px; color:#1e293b;">${label}</label>
        ${currentUrl ? `<img id="prev_${id}" src="${esc(currentUrl)}" style="max-height:90px; border-radius:8px; margin-bottom:8px; display:block; border:2px solid #e2e8f0;" onerror="this.style.display='none'">` : `<div id="prev_${id}" style="display:none;"></div>`}
        <input type="file" id="file_${id}" accept="image/*" style="display:none;">
        <input type="hidden" id="url_${id}" value="${currentUrl ? esc(currentUrl) : ''}">
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button type="button" class="btn sm alt" onclick="$('#file_${id}').click()">📤 Choose Image</button>
          ${currentUrl ? `<button type="button" class="btn sm danger" onclick="$('#url_${id}').value=''; $('#prev_${id}').style.display='none'; toast('Removed');">✕ Remove</button>` : ''}
          <span class="muted" style="font-size:0.78rem;">${helpText || 'PNG/JPG, max 2MB'}</span>
        </div>
        <div id="uploading_${id}" style="display:none; font-size:0.82rem; color:#2563eb; margin-top:6px;">⏳ Processing…</div>
      </div>
    `;
  }

  function bindImageUploader(id) {
    const fileInput = $(`#file_${id}`);
    if (!fileInput) return;
    fileInput.onchange = async () => {
      const f = fileInput.files[0];
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) { toast('Image must be under 2MB'); return; }
      $(`#uploading_${id}`).style.display = 'block';
      const b64 = await imgToBase64(f);
      $(`#url_${id}`).value = b64;
      const prev = $(`#prev_${id}`);
      if (prev) { prev.src = b64; prev.style.display = 'block'; }
      $(`#uploading_${id}`).style.display = 'none';
      toast('Image loaded ✓');
    };
  }

  // ─── TABS ────────────────────────────────────────────────────────────────
  const R = {

    // ════════════════════════════════════════════════════════
    //  1. DASHBOARD
    // ════════════════════════════════════════════════════════
    Dashboard: async () => {
      const data = await api('/api/coordinator/dashboard');
      const st = data.stats;
      const co = data.coordinator;

      viewEl.innerHTML = `
        <!-- Coordinator Identity Card -->
        <div class="card" style="margin-bottom:24px; background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%); color:#fff; border:none;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="position:relative;">
                ${co.photo_url
                  ? `<img src="${esc(co.photo_url)}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.5);" onerror="this.outerHTML='<div style=\'width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:2rem;\'>👤</div>'">`
                  : `<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:2rem;">👤</div>`
                }
              </div>
              <div>
                <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:2px; opacity:0.8; margin-bottom:4px;">Regional Coordinator</div>
                <h2 style="margin:0 0 4px; font-size:1.6rem; color:#fff;">${esc(co.name)}</h2>
                <p style="margin:0; opacity:0.85; font-size:0.9rem;">${esc(co.email)} ${co.mobile ? `· 📞 ${esc(co.mobile)}` : ''}</p>
                <p style="margin:4px 0 0; opacity:0.75; font-size:0.85rem;">Jurisdiction: <b style="color:#fde047;">${esc(co.state || 'All Assigned Territories')}</b></p>
              </div>
            </div>
            <div style="text-align:right;">
              ${co.seal_url ? `<img src="${esc(co.seal_url)}" style="height:60px;opacity:0.9;" onerror="this.style.display='none'" title="Office Mohar">` : ''}
              ${co.signature_url ? `<img src="${esc(co.signature_url)}" style="height:40px;opacity:0.9;margin-top:6px;display:block;margin-left:auto;" onerror="this.style.display='none'" title="Signature">` : ''}
              ${!co.seal_url && !co.signature_url ? `<button class="btn sm" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;" onclick="R_Profile()">⚙️ Setup Profile</button>` : ''}
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid" style="margin-bottom:24px;">
          <div class="stat" style="border-left:4px solid #2563eb; cursor:pointer;" onclick="switchTab('Assigned Centres')">
            <span>Assigned Centres</span>
            <b style="font-size:2rem;">${st.centres_total}</b>
            <p class="muted">${st.centres_active} active centres</p>
          </div>
          <div class="stat" style="border-left:4px solid #16a34a; cursor:pointer;" onclick="switchTab('Students Registry')">
            <span>Enrolled Students</span>
            <b style="font-size:2rem; color:#16a34a;">${st.students_total}</b>
            <p class="muted">Active registrations</p>
          </div>
          <div class="stat" style="border-left:4px solid #d97706; cursor:pointer;" onclick="switchTab('Marksheet Approvals')">
            <span style="color:#b45309;">Pending Marksheets</span>
            <b style="font-size:2rem; color:#d97706;">${st.marksheets_pending}</b>
            <p class="muted">${st.marksheets_approved} already approved</p>
          </div>
          <div class="stat" style="border-left:4px solid #dc2626; cursor:pointer;" onclick="switchTab('Certificate Approvals')">
            <span style="color:#dc2626;">Pending Certificates</span>
            <b style="font-size:2rem; color:#dc2626;">${st.certificates_pending}</b>
            <p class="muted">${st.certificates_valid} certificates issued</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 style="margin:0 0 16px;">Quick Actions</h3>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn" onclick="switchTab('Marksheet Approvals')" ${st.marksheets_pending > 0 ? '' : 'style="opacity:0.6;"'}>
              📋 Review Marksheets ${st.marksheets_pending > 0 ? `<span class="badge Pending" style="font-size:0.7rem;padding:2px 6px;">${st.marksheets_pending}</span>` : ''}
            </button>
            <button class="btn" onclick="switchTab('Certificate Approvals')" ${st.certificates_pending > 0 ? '' : 'style="opacity:0.6;"'}>
              🏅 Approve Certificates ${st.certificates_pending > 0 ? `<span class="badge Pending" style="font-size:0.7rem;padding:2px 6px;">${st.certificates_pending}</span>` : ''}
            </button>
            <button class="btn alt" onclick="switchTab('Assigned Centres')">🏫 View Centres</button>
            <button class="btn alt" onclick="switchTab('Students Registry')">👨‍🎓 Students</button>
            <button class="btn alt" onclick="R_Profile()">⚙️ My Profile</button>
          </div>
        </div>
      `;

      // expose for onclick
      window.switchTab = (name) => {
        const btn = Array.from(tabsEl.querySelectorAll('button')).find(b => b.textContent.trim() === name);
        if (btn) btn.click();
      };
      window.R_Profile = () => {
        const btn = Array.from(tabsEl.querySelectorAll('button')).find(b => b.textContent.trim() === 'My Profile');
        if (btn) btn.click();
      };
    },

    // ════════════════════════════════════════════════════════
    //  2. ASSIGNED CENTRES (with expandable detail)
    // ════════════════════════════════════════════════════════
    'Assigned Centres': async () => {
      const data = await api('/api/coordinator/centres');
      const centres = data.centres;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
            <div>
              <h2 style="margin:0 0 4px;">Centres Under Your Jurisdiction</h2>
              <p class="muted">Total ${centres.length} franchise institutes assigned</p>
            </div>
          </div>

          <div id="centreCards">
            ${centres.length === 0
              ? `<div style="text-align:center;padding:48px;color:#94a3b8;"><div style="font-size:3rem;">🏫</div><p>No centres assigned to your account.</p></div>`
              : centres.map(c => `
                <div class="centre-card" style="border:1px solid #e2e8f0;border-radius:12px;margin-bottom:16px;overflow:hidden;transition:box-shadow 0.2s;" id="cc_${c.id}">
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;background:#f8fafc;" onclick="toggleCentreDetail(${c.id})">
                    <div style="display:flex;align-items:center;gap:14px;">
                      <div style="background:#dbeafe;border-radius:10px;padding:10px;font-size:1.4rem;">🏫</div>
                      <div>
                        <div style="font-weight:700;font-size:1rem;">${esc(c.name)}</div>
                        <div class="muted" style="font-size:0.82rem;">${esc(c.centre_code)} · ${esc(c.district)}, ${esc(c.state)}</div>
                      </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                      <span style="font-size:0.78rem;color:#64748b;">👨‍🎓 ${c.students_count || 0} students</span>
                      <span style="font-size:0.78rem;color:#16a34a;">✅ ${c.certs_count || 0} certs</span>
                      ${(c.certs_pending || 0) > 0 ? `<span style="font-size:0.78rem;color:#dc2626;">⏳ ${c.certs_pending} pending</span>` : ''}
                      ${badge(c.status)}
                      <span style="color:#94a3b8;font-size:1.1rem;" id="arrow_${c.id}">▼</span>
                    </div>
                  </div>
                  <div id="detail_${c.id}" style="display:none;padding:20px;border-top:1px solid #e2e8f0;">
                    <div style="color:#94a3b8;text-align:center;padding:20px;">Loading...</div>
                  </div>
                </div>
              `).join('')
            }
          </div>
        </div>
        <div id="modalBox"></div>
      `;

      window.toggleCentreDetail = async (id) => {
        const box = $(`#detail_${id}`);
        const arrow = $(`#arrow_${id}`);
        if (box.style.display !== 'none') {
          box.style.display = 'none';
          arrow.textContent = '▼';
          return;
        }
        box.style.display = 'block';
        arrow.textContent = '▲';
        if (box.dataset.loaded) return;
        box.dataset.loaded = '1';
        const d = await api(`/api/coordinator/centres/${id}`);
        const c = d.centre;
        box.innerHTML = `
          <div class="grid" style="margin-bottom:16px;">
            <div class="stat" style="padding:12px;"><span>Director</span><b>${esc(c.owner_name || 'N/A')}</b><p class="muted">${esc(c.owner_email || '')} · ${esc(c.owner_mobile || '')}</p></div>
            <div class="stat" style="padding:12px;"><span>Address</span><b style="font-size:0.9rem;">${esc(c.address || 'N/A')}</b><p class="muted">PIN: ${esc(c.pin || 'N/A')}</p></div>
            <div class="stat" style="padding:12px;"><span>Assets</span>
              <div style="display:flex;gap:8px;margin-top:4px;">
                ${c.seal_url ? `<img src="${esc(c.seal_url)}" style="height:40px;border-radius:6px;" title="Seal" onerror="this.style.display='none'">` : '<span class="muted">No seal</span>'}
                ${c.signature_url ? `<img src="${esc(c.signature_url)}" style="height:30px;" title="Sign" onerror="this.style.display='none'">` : ''}
                ${c.director_photo ? `<img src="${esc(c.director_photo)}" style="height:40px;border-radius:50%;" title="Director" onerror="this.style.display='none'">` : ''}
              </div>
            </div>
          </div>

          <!-- Students mini table -->
          <h4 style="margin:0 0 10px;">Recent Students (${d.students.length})</h4>
          ${d.students.length === 0
            ? `<p class="muted">No students enrolled yet.</p>`
            : `<div class="wrap">${table([
                ['Code', r => `<b style="font-family:monospace;">${esc(r.student_code)}</b>`],
                ['Name', r => esc(r.name)],
                ['Course', r => esc(r.course_name)],
                ['Status', r => badge(r.status)],
              ], d.students.slice(0, 8), 'None')}</div>`
          }

          <!-- Pending marksheets -->
          ${d.marksheets.filter(m => m.status === 'Pending').length > 0 ? `
          <h4 style="margin:16px 0 10px; color:#d97706;">⏳ Pending Marksheets (${d.marksheets.filter(m => m.status === 'Pending').length})</h4>
          <div class="wrap">${table([
            ['Student', r => `${esc(r.student_name)} <span class="muted">(${esc(r.student_code)})</span>`],
            ['Course', r => esc(r.course_name)],
            ['Score', r => `${r.total_obtained}/${r.total_max} (${r.percentage}%) - ${esc(r.grade)}`],
            ['Action', r => `<div style="display:flex;gap:6px;"><button class="btn sm" onclick="quickApproveMrk(${r.id})">Approve</button><button class="btn sm danger" onclick="quickRejectMrk(${r.id})">Reject</button></div>`],
          ], d.marksheets.filter(m => m.status === 'Pending'), 'None')}</div>
          ` : ''}

          <!-- Pending certificates -->
          ${d.certificates.filter(c => c.status === 'Pending').length > 0 ? `
          <h4 style="margin:16px 0 10px; color:#dc2626;">⏳ Pending Certificates (${d.certificates.filter(c => c.status === 'Pending').length})</h4>
          <div class="wrap">${table([
            ['Student', r => `${esc(r.student_name)} <span class="muted">(${esc(r.student_code)})</span>`],
            ['Course', r => esc(r.course_name)],
            ['Action', r => `<div style="display:flex;gap:6px;"><button class="btn sm" onclick="quickApproveCert(${r.id})">Approve</button><button class="btn sm danger" onclick="quickRejectCert(${r.id})">Reject</button></div>`],
          ], d.certificates.filter(c => c.status === 'Pending'), 'None')}</div>
          ` : ''}
        `;
      };

      window.quickApproveMrk = (id) => {
        if (!confirm('Approve this marksheet?')) return;
        guard(async () => {
          const res = await api(`/api/marksheets/${id}/decision`, { method: 'POST', body: { decision: 'approve' } });
          toast(`✅ Marksheet Approved! No: ${res.marksheet_no}`);
          // reload the card detail
          document.querySelectorAll('[id^="detail_"]').forEach(d => { d.dataset.loaded = ''; d.style.display = 'none'; });
          document.querySelectorAll('[id^="arrow_"]').forEach(a => a.textContent = '▼');
        });
      };
      window.quickRejectMrk = (id) => {
        const reason = prompt('Rejection reason:');
        if (!reason) return;
        guard(async () => {
          await api(`/api/marksheets/${id}/decision`, { method: 'POST', body: { decision: 'reject', reason } });
          toast('Marksheet rejected.');
          document.querySelectorAll('[id^="detail_"]').forEach(d => { d.dataset.loaded = ''; d.style.display = 'none'; });
          document.querySelectorAll('[id^="arrow_"]').forEach(a => a.textContent = '▼');
        });
      };
      window.quickApproveCert = (id) => {
        if (!confirm('Approve and issue Certificate?')) return;
        guard(async () => {
          const res = await api(`/api/certificates/${id}/decision`, { method: 'POST', body: { decision: 'approve' } });
          toast(`✅ Certificate Issued! No: ${res.cert_no}`);
          document.querySelectorAll('[id^="detail_"]').forEach(d => { d.dataset.loaded = ''; d.style.display = 'none'; });
          document.querySelectorAll('[id^="arrow_"]').forEach(a => a.textContent = '▼');
        });
      };
      window.quickRejectCert = (id) => {
        const reason = prompt('Rejection reason:');
        if (!reason) return;
        guard(async () => {
          await api(`/api/certificates/${id}/decision`, { method: 'POST', body: { decision: 'reject', reason } });
          toast('Certificate rejected.');
          document.querySelectorAll('[id^="detail_"]').forEach(d => { d.dataset.loaded = ''; d.style.display = 'none'; });
          document.querySelectorAll('[id^="arrow_"]').forEach(a => a.textContent = '▼');
        });
      };
    },

    // ════════════════════════════════════════════════════════
    //  3. STUDENTS REGISTRY
    // ════════════════════════════════════════════════════════
    'Students Registry': async () => {
      let searchQ = '';

      const loadStudents = async () => {
        const url = searchQ ? `/api/coordinator/students?q=${encodeURIComponent(searchQ)}&size=100` : '/api/coordinator/students?size=100';
        const data = await api(url);
        const list = data.students;
        $('#studTable').innerHTML = table([
          ['Code', r => `<b style="font-family:monospace; color:#1e40af;">${esc(r.student_code)}</b>`],
          ['Student', r => `<b>${esc(r.name)}</b><br><span class="muted">${esc(r.father_name || '')}</span>`],
          ['Contact', r => `${esc(r.mobile || '')}<br><span class="muted">${esc(r.email || '')}</span>`],
          ['Course', r => esc(r.course_name)],
          ['Centre', r => `${esc(r.centre_name)}<br><span class="muted">${esc(r.centre_code)}</span>`],
          ['Session', r => esc(r.session || '')],
          ['Status', r => badge(r.status)],
        ], list, 'No students found matching your search.');
      };

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
            <div>
              <h2 style="margin:0 0 4px;">Students Registry</h2>
              <p class="muted">All students across your assigned centres</p>
            </div>
            <div style="display:flex; gap:8px;">
              <input id="searchSt" class="inp" placeholder="Search name, code, mobile…" style="width:260px;" value="${esc(searchQ)}">
              <button class="btn" id="btnSearch">Search</button>
            </div>
          </div>
          <div id="studTable">Loading…</div>
        </div>
      `;

      await loadStudents();

      $('#btnSearch').onclick = async () => {
        searchQ = $('#searchSt').value.trim();
        await loadStudents();
      };
      $('#searchSt').onkeydown = (e) => { if (e.key === 'Enter') $('#btnSearch').click(); };
    },

    // ════════════════════════════════════════════════════════
    //  4. MARKSHEET APPROVALS (Enhanced)
    // ════════════════════════════════════════════════════════
    'Marksheet Approvals': async () => {
      const data = await api('/api/marksheets/pending');
      _pendingMarksheets = data.marksheets;
      const list = _pendingMarksheets;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
            <div>
              <h2 style="margin:0 0 4px;">Pending Marksheets Queue</h2>
              <p class="muted">Review exam scores submitted by centres and approve for official certification</p>
            </div>
            <span class="badge ${list.length ? 'Pending' : 'Approved'}" style="font-size:0.9rem;padding:6px 14px;">${list.length} Pending</span>
          </div>

          <div id="mlist">
            ${list.length === 0
              ? `<div style="text-align:center;padding:48px;color:#94a3b8;"><div style="font-size:3rem;">✅</div><p>All clear! No marksheets pending approval.</p></div>`
              : `<div class="wrap">${table([
                  ['Candidate', r => `<b>${esc(r.student_name)}</b><br><span class="muted">Code: ${esc(r.student_code)} · Roll: ${esc(r.roll_no)}</span>`],
                  ['Course & Centre', r => `<b>${esc(r.course_name)}</b><br><span class="muted">${esc(r.centre_name)} (${esc(r.centre_code)})</span>`],
                  ['Score', r => `<b style="color:#1e40af;">${r.total_obtained} / ${r.total_max}</b><br><span class="muted">${r.percentage}% · <b>${esc(r.grade)}</b></span>`],
                  ['Result', r => badge(r.result)],
                  ['Actions', r => `
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                      <button class="btn sm gold" data-act="view" data-id="${r.id}">📋 View Marks</button>
                      <button class="btn sm" data-act="app-mrk" data-id="${r.id}">✅ Approve</button>
                      <button class="btn sm danger" data-act="rej-mrk" data-id="${r.id}">✕ Reject</button>
                    </div>
                  `],
                ], list, '')}</div>`
            }
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
          if (!confirm('Approve this marksheet? This will issue an official marksheet number and QR verification token.')) return;
          guard(async () => {
            const res = await api(`/api/marksheets/${id}/decision`, { method: 'POST', body: { decision: 'approve' } });
            toast(`✅ Marksheet Approved! Number: ${res.marksheet_no}`);
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
          const m = list.find(x => String(x.id) === String(id));
          if (!m) return;
          const subjects = m.subjects || [];
          $('#modalBox').innerHTML = `
            <div class="modal-overlay">
              <div class="modal-content" style="max-width:680px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                  <h3 style="margin:0;">📋 Marks Breakdown: ${esc(m.student_name)}</h3>
                  <button class="btn sm alt" onclick="$('#modalBox').innerHTML=''">✕ Close</button>
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:16px;">
                  <p class="muted" style="margin:0;">Course: <b>${esc(m.course_name)}</b> · Session: <b>${esc(m.exam_session)}</b> · Centre: <b>${esc(m.centre_name)}</b></p>
                </div>
                ${subjects.length > 0 ? `
                <div class="wrap" style="margin:16px 0;">
                  <table>
                    <thead><tr><th>Subject</th><th>Max Th.</th><th>Max Pr.</th><th>Obt Th.</th><th>Obt Pr.</th><th>Total</th></tr></thead>
                    <tbody>
                      ${subjects.map(s => `
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
                ` : '<p class="muted">No subject breakdown available.</p>'}
                <div style="display:flex;justify-content:space-between;align-items:center;background:#f1f5f9;padding:14px;border-radius:8px;">
                  <div>Percentage: <b>${m.percentage}%</b> · Grade: <b>${esc(m.grade)}</b> · Result: ${badge(m.result)}</div>
                  <div style="display:flex;gap:8px;">
                    <button class="btn sm" onclick="$('#modalBox').innerHTML=''; $('button[data-act=app-mrk][data-id=\\'${m.id}\\']').click();">✅ Approve</button>
                    <button class="btn sm danger" onclick="$('#modalBox').innerHTML=''; $('button[data-act=rej-mrk][data-id=\\'${m.id}\\']').click();">✕ Reject</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      };
    },

    // ════════════════════════════════════════════════════════
    //  5. CERTIFICATE APPROVALS (Enhanced)
    // ════════════════════════════════════════════════════════
    'Certificate Approvals': async () => {
      const data = await api('/api/certificates/pending');
      _pendingCertificates = data.certificates;
      const list = _pendingCertificates;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
            <div>
              <h2 style="margin:0 0 4px;">Pending Certificates Queue</h2>
              <p class="muted">Authorize course completion certificates for verified students</p>
            </div>
            <span class="badge ${list.length ? 'Pending' : 'Approved'}" style="font-size:0.9rem;padding:6px 14px;">${list.length} Pending</span>
          </div>

          <div id="clist">
            ${list.length === 0
              ? `<div style="text-align:center;padding:48px;color:#94a3b8;"><div style="font-size:3rem;">🏅</div><p>No certificates pending approval. All clear!</p></div>`
              : `<div class="wrap">${table([
                  ['Candidate', r => `<b>${esc(r.student_name)}</b><br><span class="muted">Code: ${esc(r.student_code)}</span>`],
                  ['Course', r => `<b>${esc(r.course_name)}</b>`],
                  ['Centre', r => `${esc(r.centre_name)}<br><span class="muted">(${esc(r.centre_code)})</span>`],
                  ['Applied On', r => date(r.created_at)],
                  ['Actions', r => `
                    <div style="display:flex;gap:6px;">
                      <button class="btn sm" data-act="app-cert" data-id="${r.id}">🏅 Approve</button>
                      <button class="btn sm danger" data-act="rej-cert" data-id="${r.id}">✕ Reject</button>
                    </div>
                  `],
                ], list, '')}</div>`
            }
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
            toast(`🏅 Certificate Issued! Number: ${res.cert_no}`);
            R['Certificate Approvals']();
          });
        } else if (act === 'rej-cert') {
          const reason = prompt('Please enter reason for rejection:');
          if (!reason) return;
          guard(async () => {
            await api(`/api/certificates/${id}/decision`, { method: 'POST', body: { decision: 'reject', reason } });
            toast('Certificate application rejected.');
            R['Certificate Approvals']();
          });
        }
      };
    },

    // ════════════════════════════════════════════════════════
    //  6. REPORTS & CSV EXPORT
    // ════════════════════════════════════════════════════════
    'Reports & Export': async () => {
      viewEl.innerHTML = `
        <div class="card">
          <h2 style="margin:0 0 6px;">Territory Reports & CSV Export</h2>
          <p class="muted" style="margin-bottom:20px;">Generate comprehensive reports for assigned centres</p>

          <div class="grid">
            <div class="stat" style="background:#fff;border:1px solid #e2e8f0;">
              <h3 style="margin:0 0 6px;">👨‍🎓 Student Admissions</h3>
              <p class="muted" style="margin-bottom:14px;">Detailed registry of all student admissions</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn sm" id="btnViewAdm">View Report</button>
                <a href="/api/reports/admissions?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>
            <div class="stat" style="background:#fff;border:1px solid #e2e8f0;">
              <h3 style="margin:0 0 6px;">📋 Marksheets & Results</h3>
              <p class="muted" style="margin-bottom:14px;">Academic evaluation and performance records</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn sm" id="btnViewMrk">View Report</button>
                <a href="/api/reports/marksheets?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>
            <div class="stat" style="background:#fff;border:1px solid #e2e8f0;">
              <h3 style="margin:0 0 6px;">🏅 Certificates Issued</h3>
              <p class="muted" style="margin-bottom:14px;">Council completion certificates tracking</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn sm" id="btnViewCert">View Report</button>
                <a href="/api/reports/certificates?format=csv" class="btn sm alt">📥 Download CSV</a>
              </div>
            </div>
            <div class="stat" style="background:#fff;border:1px solid #e2e8f0;">
              <h3 style="margin:0 0 6px;">🏫 Centres Directory</h3>
              <p class="muted" style="margin-bottom:14px;">Franchise centres performance metrics</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
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
        $('#repData').innerHTML = `<h3 style="margin:0 0 12px;">Admissions Report (${d.count} records)</h3>
          ${table([
            ['Code', r => esc(r.student_code)],
            ['Name', r => esc(r.name)],
            ['Course', r => esc(r.course_name)],
            ['Centre', r => esc(r.centre_name)],
            ['Session', r => esc(r.session)],
            ['Admission Date', r => date(r.created_at)],
            ['Status', r => badge(r.status)],
          ], d.admissions)}`;
      };

      $('#btnViewMrk').onclick = async () => {
        const d = await api('/api/reports/marksheets');
        $('#repData').innerHTML = `<h3 style="margin:0 0 12px;">Marksheets Report (${d.count} records)</h3>
          ${table([
            ['Marksheet No', r => esc(r.marksheet_no || 'Pending')],
            ['Candidate', r => `${esc(r.student_name)} (${esc(r.student_code)})`],
            ['Course', r => esc(r.course_name)],
            ['Score', r => `${r.total_obtained} / ${r.total_max} (${r.percentage}%)`],
            ['Grade', r => esc(r.grade)],
            ['Result', r => badge(r.result)],
            ['Status', r => badge(r.status)],
          ], d.marksheets)}`;
      };

      $('#btnViewCert').onclick = async () => {
        const d = await api('/api/reports/certificates');
        $('#repData').innerHTML = `<h3 style="margin:0 0 12px;">Certificates Report (${d.count} records)</h3>
          ${table([
            ['Cert No', r => esc(r.cert_no || 'Pending')],
            ['Candidate', r => `${esc(r.student_name)} (${esc(r.student_code)})`],
            ['Course', r => esc(r.course_name)],
            ['Centre', r => esc(r.centre_name)],
            ['Date', r => date(r.issued_at || r.created_at)],
            ['Status', r => badge(r.status)],
          ], d.certificates)}`;
      };

      $('#btnViewCent').onclick = async () => {
        const d = await api('/api/reports/centres');
        $('#repData').innerHTML = `<h3 style="margin:0 0 12px;">Centres Report (${d.count} records)</h3>
          ${table([
            ['Code', r => esc(r.centre_code)],
            ['Centre Name', r => esc(r.name)],
            ['Location', r => `${esc(r.district)}, ${esc(r.state)}`],
            ['Students', r => r.total_students],
            ['Certificates', r => r.valid_certs],
            ['Marksheets', r => r.approved_marksheets],
            ['Status', r => badge(r.status)],
          ], d.centres)}`;
      };
    },

    // ════════════════════════════════════════════════════════
    //  7. MY PROFILE (Photo, Mohar, Signature, Password)
    // ════════════════════════════════════════════════════════
    'My Profile': async () => {
      const data = await api('/api/coordinator/profile');
      const p = data.profile || {};

      viewEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:1000px;">

          <!-- Profile Card -->
          <div class="card" style="grid-column:1/-1;">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap;">
              <div style="position:relative;">
                ${p.photo_url
                  ? `<img id="photoPreview" src="${esc(p.photo_url)}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #2563eb;" onerror="this.outerHTML='<div id=\\'photoPreview\\' style=\\'width:100px;height:100px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:3rem;\\'>👤</div>'">`
                  : `<div id="photoPreview" style="width:100px;height:100px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:3rem;">👤</div>`
                }
              </div>
              <div>
                <h2 style="margin:0 0 4px;">${esc(p.name || 'Coordinator')}</h2>
                <p class="muted" style="margin:0;">${esc(p.email || '')} · ${esc(p.state || 'Regional Office')}</p>
                <p class="muted" style="margin:4px 0 0;">Role: <b>Coordinator</b></p>
              </div>
            </div>
          </div>

          <!-- Personal Info -->
          <div class="card">
            <h3 style="margin:0 0 18px;">👤 Personal Information</h3>
            <form id="profileForm">
              <div style="margin-bottom:14px;">
                <label class="label">Full Name</label>
                <input class="inp" id="pName" value="${esc(p.name || '')}" placeholder="Your full name">
              </div>
              <div style="margin-bottom:14px;">
                <label class="label">Email Address</label>
                <input class="inp" id="pEmail" type="email" value="${esc(p.email || '')}" placeholder="email@example.com">
              </div>
              <div style="margin-bottom:14px;">
                <label class="label">Mobile Number</label>
                <input class="inp" id="pMobile" value="${esc(p.mobile || '')}" placeholder="+91 XXXXXXXXXX">
              </div>
              <div style="margin-bottom:18px;">
                <label class="label">State / Jurisdiction</label>
                <input class="inp" id="pState" value="${esc(p.state || '')}" placeholder="e.g. Uttar Pradesh">
              </div>
              <button class="btn" type="submit" id="btnSaveProfile">💾 Save Profile</button>
            </form>
          </div>

          <!-- Photo & Assets -->
          <div class="card">
            <h3 style="margin:0 0 18px;">📷 Photo & Official Assets</h3>

            <div style="margin-bottom:20px;">
              <label class="label">Your Photo (for certificates/marksheets)</label>
              <div style="display:flex;align-items:center;gap:12px;margin-top:8px;flex-wrap:wrap;">
                <div id="photoBox" style="width:80px;height:80px;border-radius:50%;background:#f1f5f9;border:2px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                  ${p.photo_url ? `<img src="${esc(p.photo_url)}" style="width:100%;height:100%;object-fit:cover;" id="photoImg" onerror="this.style.display='none'">` : '<span style="font-size:2rem;">👤</span>'}
                </div>
                <div>
                  <input type="file" id="filePhoto" accept="image/*" style="display:none;">
                  <input type="hidden" id="urlPhoto" value="${esc(p.photo_url || '')}">
                  <button type="button" class="btn sm alt" onclick="$('#filePhoto').click()">📤 Upload Photo</button>
                  <p class="muted" style="font-size:0.78rem;margin:4px 0 0;">PNG/JPG, max 2MB, will show on documents</p>
                </div>
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <label class="label">Office Mohar (Official Seal)</label>
              <div style="margin-top:8px;">
                <div id="moharBox" style="height:70px;background:#f8fafc;border:2px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px;">
                  ${p.seal_url ? `<img src="${esc(p.seal_url)}" style="max-height:65px;" id="moharImg" onerror="this.style.display='none'">` : '<span class="muted" style="font-size:0.85rem;">No seal uploaded</span>'}
                </div>
                <input type="file" id="fileMohar" accept="image/*" style="display:none;">
                <input type="hidden" id="urlMohar" value="${esc(p.seal_url || '')}">
                <button type="button" class="btn sm alt" onclick="$('#fileMohar').click()">📤 Upload Mohar</button>
                <p class="muted" style="font-size:0.78rem;margin:4px 0 0;">Round seal/stamp image — will appear on documents</p>
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <label class="label">Signature (Hastaakshar)</label>
              <div style="margin-top:8px;">
                <div id="signBox" style="height:60px;background:#f8fafc;border:2px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px;">
                  ${p.signature_url ? `<img src="${esc(p.signature_url)}" style="max-height:55px;" id="signImg" onerror="this.style.display='none'">` : '<span class="muted" style="font-size:0.85rem;">No signature uploaded</span>'}
                </div>
                <input type="file" id="fileSign" accept="image/*" style="display:none;">
                <input type="hidden" id="urlSign" value="${esc(p.signature_url || '')}">
                <button type="button" class="btn sm alt" onclick="$('#fileSign').click()">📤 Upload Signature</button>
                <p class="muted" style="font-size:0.78rem;margin:4px 0 0;">Signature image — will appear on certificates</p>
              </div>
            </div>

            <button class="btn" id="btnSaveAssets">💾 Save Photo & Assets</button>
          </div>

          <!-- Change Password -->
          <div class="card" style="grid-column:1/-1;">
            <h3 style="margin:0 0 18px;">🔒 Change Password</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;max-width:700px;">
              <div>
                <label class="label">New Password</label>
                <input class="inp" id="newPw" type="password" placeholder="Min 6 characters">
              </div>
              <div>
                <label class="label">Confirm Password</label>
                <input class="inp" id="confPw" type="password" placeholder="Repeat password">
              </div>
              <div style="display:flex;align-items:flex-end;">
                <button class="btn" id="btnChgPw">🔑 Change Password</button>
              </div>
            </div>
          </div>

        </div>
      `;

      // ── file upload bindings ──────────────────────────────
      const bindFile = (fileId, urlId, previewId, isCircle) => {
        const fi = $(`#${fileId}`);
        if (!fi) return;
        fi.onchange = async () => {
          const f = fi.files[0];
          if (!f) return;
          if (f.size > 2 * 1024 * 1024) { toast('Image must be under 2MB'); return; }
          const b64 = await imgToBase64(f);
          $(`#${urlId}`).value = b64;
          const box = $(`#${previewId}`);
          if (box) {
            box.innerHTML = `<img src="${b64}" style="width:100%;height:100%;object-fit:${isCircle ? 'cover' : 'contain'};">`;
          }
          // also update the header preview
          if (fileId === 'filePhoto') {
            const pv = $('#photoPreview');
            if (pv) pv.innerHTML = `<img src="${b64}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">`;
          }
          toast('Image loaded ✓');
        };
      };

      bindFile('filePhoto', 'urlPhoto', 'photoBox', true);
      bindFile('fileMohar', 'urlMohar', 'moharBox', false);
      bindFile('fileSign', 'urlSign', 'signBox', false);

      // ── save profile form ─────────────────────────────────
      $('#profileForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = $('#btnSaveProfile');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        await guard(async () => {
          await api('/api/coordinator/profile', {
            method: 'POST',
            body: {
              name: $('#pName').value.trim(),
              email: $('#pEmail').value.trim(),
              mobile: $('#pMobile').value.trim(),
              state: $('#pState').value.trim(),
            },
          });
          toast('✅ Profile saved successfully!');
          // Update nav display
          $('#who').textContent = ($('#pName').value.trim() || me.user.name) + ' (COORDINATOR)';
        });
        btn.disabled = false;
        btn.textContent = '💾 Save Profile';
      };

      // ── save assets button ────────────────────────────────
      $('#btnSaveAssets').onclick = async () => {
        const btn = $('#btnSaveAssets');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        await guard(async () => {
          const photo_url = $('#urlPhoto').value || null;
          const seal_url = $('#urlMohar').value || null;
          const signature_url = $('#urlSign').value || null;
          await api('/api/coordinator/profile', {
            method: 'POST',
            body: { photo_url, seal_url, signature_url },
          });
          toast('✅ Photo, Mohar & Signature saved!');
        });
        btn.disabled = false;
        btn.textContent = '💾 Save Photo & Assets';
      };

      // ── change password ───────────────────────────────────
      $('#btnChgPw').onclick = async () => {
        const np = $('#newPw').value;
        const cp = $('#confPw').value;
        if (!np || np.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
        if (np !== cp) { toast('Passwords do not match', 'error'); return; }
        await guard(async () => {
          await api('/api/coordinator/change-password', { method: 'POST', body: { new_password: np } });
          toast('🔑 Password changed successfully!');
          $('#newPw').value = '';
          $('#confPw').value = '';
        });
      };
    },
  };

  tabs(tabsEl, Object.keys(R), (k) => R[k]());
});
