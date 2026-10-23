const V = $('#view');
const ask = (msg) => { const r = prompt(msg); return r && r.trim() ? r.trim() : null; };

function imgToBase64(file) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });
}

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

  async Profile() {
    const res = await api('/api/admin/profile');
    const p = res.profile || {};

    V.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:22px; max-width:1100px;">

        <!-- Executive Authority Header Card -->
        <div class="card" style="grid-column:1/-1; background:linear-gradient(135deg, #071a33 0%, #0d284f 50%, #153e77 100%); color:#ffffff; border:1.5px solid rgba(212,175,55,0.5); box-shadow:0 10px 30px rgba(0,0,0,0.25); border-radius:14px; padding:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
            <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
              <div style="position:relative;">
                ${p.photo_url
                  ? `<img id="adminPhotoPreview" src="${esc(p.photo_url)}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; border:3px solid #fde047; box-shadow:0 4px 15px rgba(0,0,0,0.4);" onerror="this.outerHTML='<div id=\\'adminPhotoPreview\\' style=\\'width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:3.5rem;border:3px solid #fde047;\\'>🏛️</div>'">`
                  : `<div id="adminPhotoPreview" style="width:110px; height:110px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:3.5rem; border:3px solid #fde047;">🏛️</div>`
                }
                <div style="position:absolute; bottom:0; right:0; background:#d4af37; color:#071a33; border-radius:50%; width:30px; height:30px; display:grid; place-items:center; font-size:0.9rem; font-weight:900; border:2px solid #071a33;">★</div>
              </div>
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(212,175,55,0.2); border:1px solid rgba(212,175,55,0.5); padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:800; color:#fde047; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                  🛡️ National Executive Council Authority · Code: ${esc(p.badge_id || 'PESC-HQ-001')}
                </div>
                <h2 style="margin:0 0 6px; color:#ffffff; font-size:1.6rem; font-weight:800;">${esc(p.name || 'Head Office Administrator')}</h2>
                <p style="margin:0 0 4px; color:#cbd5e1; font-size:0.95rem;">
                  <b>${esc(p.designation || 'Executive Director & Controller of Examinations')}</b>
                </p>
                <p style="margin:0; color:#94a3b8; font-size:0.85rem;">
                  ✉️ ${esc(p.email || 'admin@pescouncil.in')} · 📞 ${esc(p.mobile || '+91 94152 00000')} · 📍 ${esc(p.head_office || 'Purvanchal Education & Skill Council, Head Office, UP')}
                </p>
              </div>
            </div>
            <div>
              <button type="button" id="btnOpenIdCardModal" class="btn" style="background:linear-gradient(135deg, #d4af37 0%, #f59e0b 100%); color:#071a33; font-weight:800; border:1px solid #fef08a; padding:12px 22px; border-radius:10px; box-shadow:0 4px 15px rgba(212,175,55,0.4); cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                🪪 View &amp; Print Authority ID Card
              </button>
            </div>
          </div>
        </div>

        <!-- Personal & Administrative Details -->
        <div class="card" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <h3 style="margin:0 0 18px; color:var(--navy); display:flex; align-items:center; gap:8px; font-size:1.15rem;">
            👤 Administrative Information
          </h3>
          <form id="adminProfileForm">
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Full Name / Officer In-Charge</label>
              <input class="inp" id="pName" value="${esc(p.name || '')}" placeholder="Full name of Admin / Director" required style="width:100%;">
            </div>
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Official Email Address</label>
              <input class="inp" id="pEmail" type="email" value="${esc(p.email || '')}" placeholder="admin@pescouncil.in" required style="width:100%;">
            </div>
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Direct Mobile / Helpline Number</label>
              <input class="inp" id="pMobile" value="${esc(p.mobile || '')}" placeholder="+91 94152 00000" style="width:100%;">
            </div>
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Executive Designation</label>
              <input class="inp" id="pDesignation" value="${esc(p.designation || 'Executive Director & Controller of Examinations')}" placeholder="e.g. Executive Director & Controller of Examinations" style="width:100%;">
            </div>
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Head Office Jurisdiction &amp; Address</label>
              <input class="inp" id="pOffice" value="${esc(p.head_office || 'Purvanchal Education & Skill Council, Head Office, Gorakhpur / Lucknow, UP')}" placeholder="Council National Secretariat Address" style="width:100%;">
            </div>
            <div style="margin-bottom:18px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">State / Territory Jurisdiction</label>
              <input class="inp" id="pState" value="${esc(p.state || 'National Headquarters (India)')}" placeholder="e.g. National Headquarters (India)" style="width:100%;">
            </div>
            <button class="btn" type="submit" id="btnSaveAdminProfile" style="background:#0a2a5e; color:#fff; font-weight:700; padding:10px 20px; border-radius:8px;">
              💾 Save Administrative Profile
            </button>
          </form>
        </div>

        <!-- Photo & Official Council Assets -->
        <div class="card" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <h3 style="margin:0 0 18px; color:var(--navy); display:flex; align-items:center; gap:8px; font-size:1.15rem;">
            🏛️ Official Seals, Mohar &amp; Digital Signatures
          </h3>

          <!-- Photo -->
          <div style="margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <label class="label" style="font-weight:700; color:#334155;">Executive Officer Photo (for ID Card &amp; Council Portal)</label>
            <div style="display:flex; align-items:center; gap:14px; margin-top:8px; flex-wrap:wrap;">
              <div id="adminPhotoBox" style="width:75px; height:75px; border-radius:50%; background:#f8fafc; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                ${p.photo_url ? `<img src="${esc(p.photo_url)}" style="width:100%; height:100%; object-fit:cover;" id="adminPhotoImg">` : '<span style="font-size:2rem;">👤</span>'}
              </div>
              <div>
                <input type="file" id="adminFilePhoto" accept="image/*" style="display:none;">
                <input type="hidden" id="adminUrlPhoto" value="${esc(p.photo_url || '')}">
                <button type="button" class="btn sm alt" onclick="$('#adminFilePhoto').click()">📤 Upload Photo</button>
                <p class="muted" style="font-size:0.78rem; margin:4px 0 0;">PNG/JPG, max 2MB. Appears on Head Office ID Badge.</p>
              </div>
            </div>
          </div>

          <!-- Council Mohar -->
          <div style="margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <label class="label" style="font-weight:700; color:#334155;">Council Round Mohar (Official Seal)</label>
            <div style="margin-top:8px;">
              <div id="adminMoharBox" style="height:70px; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:8px;">
                ${p.seal_url ? `<img src="${esc(p.seal_url)}" style="max-height:65px;" id="adminMoharImg">` : '<span class="muted" style="font-size:0.85rem;">No council seal uploaded (Default council stamp will be used)</span>'}
              </div>
              <input type="file" id="adminFileMohar" accept="image/*" style="display:none;">
              <input type="hidden" id="adminUrlMohar" value="${esc(p.seal_url || '')}">
              <button type="button" class="btn sm alt" onclick="$('#adminFileMohar').click()">📤 Upload Council Seal</button>
              <p class="muted" style="font-size:0.78rem; margin:4px 0 0;">Round Council stamp for student marksheets &amp; certificates.</p>
            </div>
          </div>

          <!-- Controller Signature -->
          <div style="margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <label class="label" style="font-weight:700; color:#334155;">Controller of Examinations Signature (Hastaakshar)</label>
            <div style="margin-top:8px;">
              <div id="adminSignBox" style="height:60px; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:8px;">
                ${p.signature_url ? `<img src="${esc(p.signature_url)}" style="max-height:55px;" id="adminSignImg">` : '<span class="muted" style="font-size:0.85rem;">No controller signature uploaded</span>'}
              </div>
              <input type="file" id="adminFileSign" accept="image/*" style="display:none;">
              <input type="hidden" id="adminUrlSign" value="${esc(p.signature_url || '')}">
              <button type="button" class="btn sm alt" onclick="$('#adminFileSign').click()">📤 Upload Signature</button>
              <p class="muted" style="font-size:0.78rem; margin:4px 0 0;">Official signature printed on student marksheets &amp; credentials.</p>
            </div>
          </div>

          <!-- Chairman / Registrar Signature -->
          <div style="margin-bottom:20px;">
            <label class="label" style="font-weight:700; color:#334155;">Chairman / Registrar Signature</label>
            <div style="margin-top:8px;">
              <div id="adminChairSignBox" style="height:60px; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:8px;">
                ${p.chairman_signature_url ? `<img src="${esc(p.chairman_signature_url)}" style="max-height:55px;" id="adminChairSignImg">` : '<span class="muted" style="font-size:0.85rem;">No chairman signature uploaded</span>'}
              </div>
              <input type="file" id="adminFileChairSign" accept="image/*" style="display:none;">
              <input type="hidden" id="adminUrlChairSign" value="${esc(p.chairman_signature_url || '')}">
              <button type="button" class="btn sm alt" onclick="$('#adminFileChairSign').click()">📤 Upload Chairman Signature</button>
              <p class="muted" style="font-size:0.78rem; margin:4px 0 0;">Printed on centre affiliation decrees &amp; council diplomas.</p>
            </div>
          </div>

          <button class="btn" id="btnSaveAdminAssets" style="background:#0a2a5e; color:#fff; font-weight:700; padding:10px 20px; border-radius:8px;">
            💾 Save Photo, Seals &amp; Signatures
          </button>
        </div>

        <!-- Change Password Card -->
        <div class="card" style="grid-column:1/-1; background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <h3 style="margin:0 0 16px; color:var(--navy); display:flex; align-items:center; gap:8px; font-size:1.15rem;">
            🔒 Security &amp; Admin Password
          </h3>
          <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:16px; max-width:760px; align-items:flex-end;">
            <div>
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">New Password</label>
              <input class="inp" id="adminNewPw" type="password" placeholder="At least 6 characters" style="width:100%;">
            </div>
            <div>
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Confirm Password</label>
              <input class="inp" id="adminConfPw" type="password" placeholder="Repeat new password" style="width:100%;">
            </div>
            <div>
              <button class="btn" id="btnAdminChgPw" style="background:#047857; color:#fff; font-weight:700; padding:10px 20px; border-radius:8px; white-space:nowrap;">
                🔑 Update Password
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    // Bind Image File Uploaders
    const bindAdminFile = (fileId, urlId, previewId, isCircle) => {
      const fi = $(`#${fileId}`);
      if (!fi) return;
      fi.onchange = async () => {
        const f = fi.files[0];
        if (!f) return;
        if (f.size > 2 * 1024 * 1024) { toast('Image must be under 2MB', false); return; }
        const b64 = await imgToBase64(f);
        const urlInp = $(`#${urlId}`);
        if (urlInp) urlInp.value = b64;
        const box = $(`#${previewId}`);
        if (box) {
          box.innerHTML = `<img src="${b64}" style="width:100%;height:100%;object-fit:${isCircle ? 'cover' : 'contain'};">`;
        }
        if (fileId === 'adminFilePhoto') {
          const pv = $('#adminPhotoPreview');
          if (pv) pv.innerHTML = `<img src="${b64}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid #fde047;">`;
        }
        toast('Image loaded successfully ✓');
      };
    };

    bindAdminFile('adminFilePhoto', 'adminUrlPhoto', 'adminPhotoBox', true);
    bindAdminFile('adminFileMohar', 'adminUrlMohar', 'adminMoharBox', false);
    bindAdminFile('adminFileSign', 'adminUrlSign', 'adminSignBox', false);
    bindAdminFile('adminFileChairSign', 'adminUrlChairSign', 'adminChairSignBox', false);

    // Save Profile Form
    $('#adminProfileForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = $('#btnSaveAdminProfile');
      btn.disabled = true;
      btn.textContent = 'Saving…';
      await guard(async () => {
        const name = $('#pName').value.trim();
        const email = $('#pEmail').value.trim();
        const mobile = $('#pMobile').value.trim();
        const designation = $('#pDesignation').value.trim();
        const head_office = $('#pOffice').value.trim();
        const state = $('#pState').value.trim();
        await api('/api/admin/profile', {
          method: 'POST',
          body: { name, email, mobile, designation, head_office, state }
        });
        toast('✅ Admin Profile updated successfully!');
        if ($('#who')) $('#who').textContent = name || 'Super Admin';
      });
      btn.disabled = false;
      btn.textContent = '💾 Save Administrative Profile';
    };

    // Save Assets
    $('#btnSaveAdminAssets').onclick = async () => {
      const btn = $('#btnSaveAdminAssets');
      btn.disabled = true;
      btn.textContent = 'Saving…';
      await guard(async () => {
        const photo_url = $('#adminUrlPhoto').value || null;
        const seal_url = $('#adminUrlMohar').value || null;
        const signature_url = $('#adminUrlSign').value || null;
        const chairman_signature_url = $('#adminUrlChairSign').value || null;
        await api('/api/admin/profile', {
          method: 'POST',
          body: { photo_url, seal_url, signature_url, chairman_signature_url }
        });
        toast('✅ Photo, Seals & Signatures saved successfully!');
      });
      btn.disabled = false;
      btn.textContent = '💾 Save Photo, Seals & Signatures';
    };

    // Change Password
    $('#btnAdminChgPw').onclick = async () => {
      const np = $('#adminNewPw').value;
      const cp = $('#adminConfPw').value;
      if (!np || np.length < 6) { toast('Password must be at least 6 characters', false); return; }
      if (np !== cp) { toast('Passwords do not match', false); return; }
      await guard(async () => {
        await api('/api/admin/change-password', {
          method: 'POST',
          body: { new_password: np }
        });
        toast('🔑 Admin password updated successfully!');
        $('#adminNewPw').value = '';
        $('#adminConfPw').value = '';
      });
    };

    // View ID Card Modal
    $('#btnOpenIdCardModal').onclick = () => {
      showAdminIdCardModal(p);
    };
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
    window._adminCourses = courses;
    V.innerHTML = `
      <h2>Affiliated Courses Catalog &amp; Curriculum Management</h2>
      <p class="muted">Manage accredited vocational courses, configure distinct yearly &amp; semester curriculum subjects, and set official examination/certificate fees</p>
      ${table([
        ['ID', (r) => r.id],
        ['Course Code', (r) => `<b style="font-family:monospace; color:var(--navy); font-size:0.95rem;">${esc(r.code)}</b>`],
        ['Course Title', (r) => `<b>${esc(r.name)}</b>`],
        ['Duration', (r) => `${r.duration_months} Months`],
        ['Single / Yearly Fee', (r) => {
          const sFee = r.single_fee_rupees || Math.round((r.single_fee_paise || 20000)/100);
          return `
            <div style="display:flex; align-items:center; gap:6px;">
              <b style="color:#064e3b; font-size:1.05rem;">₹${sFee}</b>
              <button type="button" class="btn sm alt" data-a="quick_edit_fee" data-id="${r.id}" data-type="single" data-code="${esc(r.code)}" data-val="${sFee}" style="padding:2px 7px; font-size:0.75rem; font-weight:800; border-radius:4px; cursor:pointer;" title="Change Single / Yearly Fee">✏️ Edit</button>
            </div>
            <span class="muted" style="font-size:0.75rem;">Per Cert/Marksheet</span>
          `;
        }],
        ['Semester Fee', (r) => {
          const semFee = r.semester_fee_rupees || Math.round((r.semester_fee_paise || 60000)/100);
          return `
            <div style="display:flex; align-items:center; gap:6px;">
              <b style="color:#0284c7; font-size:1.05rem;">₹${semFee}</b>
              <button type="button" class="btn sm alt" data-a="quick_edit_fee" data-id="${r.id}" data-type="semester" data-code="${esc(r.code)}" data-val="${semFee}" style="padding:2px 7px; font-size:0.75rem; font-weight:800; border-radius:4px; cursor:pointer;" title="Change Semester Fee">✏️ Edit</button>
            </div>
            <span class="muted" style="font-size:0.75rem;">Per Semester Exam</span>
          `;
        }],
        ['Yearly & Semester Subjects', (r) => `
          <button type="button" class="btn sm" data-a="edit_curriculum" data-id="${r.id}" style="background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#fde047; border:1px solid #d4af37; font-weight:700; font-size:0.8rem; padding:6px 12px; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" onclick="window.openCourseCurriculumEditor && window.openCourseCurriculumEditor(${r.id})">
            📚 Edit Subjects (Year &amp; Sem)
          </button>
        `],
        ['Status', (r) => r.active ? `<span class="badge Valid">Active</span>` : `<span class="badge Rejected">Inactive</span>`],
        ['Actions', (r) => `
          <button class="btn sm alt" data-a="edit_course" data-id="${r.id}" data-name="${esc(r.name)}" data-code="${esc(r.code)}" data-dur="${r.duration_months}" data-fee="${Math.round(r.fee_paise/100)}" data-single-fee="${r.single_fee_rupees || Math.round((r.single_fee_paise||20000)/100)}" data-sem-fee="${r.semester_fee_rupees || Math.round((r.semester_fee_paise||60000)/100)}" data-marks="${r.total_marks || 100}" data-active="${r.active}">✏️ Edit Course &amp; Fees</button>
        `],
      ], courses)}

      <h3 style="margin-top:28px;">Add New Skill Course</h3>
      <form id="cf" class="row">
        <div><label>Course Code (e.g. DCA, PGDCA) *</label><input name="code" required maxlength="20"></div>
        <div><label>Course Name *</label><input name="name" required maxlength="120"></div>
        <div><label>Duration in Months *</label><input name="duration_months" type="number" min="1" required></div>
        <div><label>Course Training Fee (₹) *</label><input name="fee_rupees" type="number" min="0" required></div>
        <div><label>Single / Yearly Exam Fee (₹) *</label><input name="single_fee_rupees" type="number" min="0" value="200" required></div>
        <div><label>Semester Exam Fee (₹) *</label><input name="semester_fee_rupees" type="number" min="0" value="600" required></div>
        <div><label>Total Marks *</label><input name="total_marks" type="number" min="50" value="100" required></div>
        <div style="grid-column: 1 / -1; width:100%;">
          <label style="font-weight:700; display:block; margin-bottom:4px;">Initial Subjects (Optional) – Enter subjects separated by comma or new lines:</label>
          <textarea name="subjects_text" rows="2" placeholder="e.g. IT Fundamentals, Office Automation, Project Viva" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:0.9rem;"></textarea>
          <small class="muted">After creating the course, you can configure detailed semester-wise and yearly-wise subjects using the 'Edit Subjects' button.</small>
        </div>
        <div style="align-self:end;"><button class="btn gold" style="font-weight:700;">➕ Create Course</button></div>
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
          <button type="button" class="btn sm danger" id="btnClearAllStudents" style="background:#dc2626; color:#fff; font-weight:700; border:none; padding:6px 14px; border-radius:6px; cursor:pointer;" title="Clear all enrolled students">🗑️ Clear All Students</button>
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
    const btnClear = $('#btnClearAllStudents');
    if (btnClear) {
      btnClear.onclick = async () => {
        if (!confirm('Are you sure you want to permanently delete ALL students, marksheets, and certificates across centres?')) return;
        await api('/api/admin/students/clear-all', { method: 'POST' });
        toast('All students, marksheets, and certificates cleared successfully!');
        await views.Students();
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

function showAdminIdCardModal(p) {
  showModal('🪪 Head Office Executive Authority Card', `
    <div style="background:#f8fafc; padding:20px; text-align:center;">
      <div style="margin-bottom:14px; display:flex; justify-content:flex-end;">
        <button type="button" onclick="window.print()" class="btn gold sm" style="font-weight:700; padding:8px 18px;">🖨️ Print ID Card</button>
      </div>
      <div id="adminPrintableCard" style="max-width:440px; margin:0 auto; background:linear-gradient(135deg, #071a33 0%, #0d284f 55%, #153e77 100%); color:#ffffff; border-radius:14px; border:2.5px solid #d4af37; padding:22px; box-shadow:0 10px 30px rgba(0,0,0,0.35); text-align:left; position:relative; overflow:hidden;">
        <!-- Council Seal Background Watermark -->
        <div style="position:absolute; right:-20px; bottom:-20px; font-size:12rem; opacity:0.06; pointer-events:none; font-weight:900; color:#d4af37;">P</div>

        <!-- Top Header -->
        <div style="display:flex; align-items:center; gap:12px; border-bottom:1.5px solid rgba(212,175,55,0.4); padding-bottom:12px; margin-bottom:16px;">
          <div style="width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg, #d4af37, #f59e0b); color:#071a33; font-size:1.5rem; font-weight:900; display:grid; place-items:center; border:2px solid #ffffff; flex-shrink:0;">P</div>
          <div>
            <div style="font-size:0.95rem; font-weight:900; color:#ffffff; letter-spacing:0.5px; line-height:1.2;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</div>
            <div style="font-size:0.75rem; color:#fde047; font-weight:700;">पूर्वांचल शिक्षा एवं कौशल परिषद · HEAD OFFICE AUTHORITY</div>
          </div>
        </div>

        <!-- Body with Photo & Details -->
        <div style="display:flex; gap:16px; margin-bottom:14px; align-items:center;">
          <div style="width:90px; height:110px; border-radius:8px; border:2px solid #d4af37; background:rgba(255,255,255,0.1); overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
            ${p.photo_url ? `<img src="${esc(p.photo_url)}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:3rem;">👤</span>'}
          </div>
          <div style="flex:1;">
            <div style="font-size:1.15rem; font-weight:800; color:#ffffff; margin-bottom:2px;">${esc(p.name || 'Head Office Administrator')}</div>
            <div style="font-size:0.82rem; font-weight:700; color:#fde047; margin-bottom:6px;">${esc(p.designation || 'Executive Director & Controller of Examinations')}</div>
            <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">
              <div><b>ID:</b> <span style="font-family:monospace; color:#fef08a;">${esc(p.badge_id || 'PESC-HQ-001')}</span></div>
              <div><b>Role:</b> Central Governing Authority</div>
              <div><b>Validity:</b> Permanent / Authorized</div>
              <div><b>Mobile:</b> ${esc(p.mobile || '+91 94152 00000')}</div>
            </div>
          </div>
        </div>

        <!-- Footer with Verification QR & Mohar -->
        <div style="border-top:1.5px solid rgba(212,175,55,0.4); padding-top:10px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div style="font-size:0.68rem; color:#94a3b8; max-width:240px;">
            <div>Govt. Regd. | NITI Aayog Verified | ISO 9001:2015</div>
            <div style="color:#cbd5e1; margin-top:2px;">Official Head Office: Gorakhpur / Lucknow, UP</div>
          </div>
          <div style="text-align:right;">
            ${p.signature_url ? `<img src="${esc(p.signature_url)}" style="max-height:32px; display:block; margin:0 0 2px auto;">` : '<div style="font-family:cursive; font-size:0.85rem; color:#fde047;">Authorized Signatory</div>'}
            <div style="font-size:0.68rem; color:#d4af37; font-weight:700;">Controller of Examinations</div>
          </div>
        </div>

      </div>
    </div>
  `, null, '520px');
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
    } else if (a === 'edit_curriculum') {
      await openCourseCurriculumEditor(+id);
      return;
    } else if (a === 'quick_edit_fee') {
      const type = b.dataset.type;
      const isSingle = type === 'single';
      const label = isSingle ? 'Single / Yearly Marksheet & Certificate Fee' : 'Semester Examination Marksheet Fee';
      const curVal = b.dataset.val || (isSingle ? '200' : '600');
      const inputVal = prompt(`Enter new official ${label} (₹) for ${b.dataset.code || 'this course'}:`, curVal);
      if (inputVal !== null && inputVal.trim() !== '') {
        const num = +inputVal.trim();
        if (isNaN(num) || num < 0) {
          alert('Kripya valid fee number enter karein!');
          return;
        }
        const payload = isSingle ? { single_fee_rupees: num } : { semester_fee_rupees: num };
        await api(`/api/admin/courses/${id}`, { method: 'PUT', body: payload });
        toast(`✅ Course ${isSingle ? 'Single/Yearly' : 'Semester'} fee updated to ₹${num}!`);
        await views.Courses();
      }
      return;
    } else if (a === 'edit_course') {
      const d = b.dataset;
      const targetCourse = (window._adminCourses || []).find(x => x.id === +id) || {};
      let subs = [];
      try { subs = typeof targetCourse.subjects === 'string' ? JSON.parse(targetCourse.subjects || '[]') : (targetCourse.subjects || []); } catch (_) {}
      const subLines = subs.map(s => s.name || s).join('\n');

      showModal(`✏️ Edit Course: ${d.code} - ${d.name}`, `
        <form id="editCourseModalForm">
          <div class="row">
            <div><label>Course Code *</label><input name="code" value="${esc(d.code)}" required></div>
            <div><label>Course Title *</label><input name="name" value="${esc(d.name)}" required></div>
            <div><label>Duration (Months) *</label><input name="duration_months" type="number" min="1" value="${d.dur}" required></div>
            <div><label>Course Training Fee (₹) *</label><input name="fee_rupees" type="number" min="0" value="${d.fee}" required></div>
            <div>
              <label style="color:#064e3b; font-weight:800;">📜 Single / Yearly Exam Fee (₹) *</label>
              <input name="single_fee_rupees" type="number" min="0" value="${d.singleFee || 200}" required style="border:1.5px solid #059669; font-weight:800; color:#064e3b;">
            </div>
            <div>
              <label style="color:#0284c7; font-weight:800;">📚 Semester Exam Fee (₹) *</label>
              <input name="semester_fee_rupees" type="number" min="0" value="${d.semFee || 600}" required style="border:1.5px solid #0284c7; font-weight:800; color:#0284c7;">
            </div>
            <div><label>Total Examination Marks</label><input name="total_marks" type="number" min="1" value="${d.marks || 100}"></div>
            <div>
              <label>Status</label>
              <select name="active">
                <option value="1" ${d.active === '1' ? 'selected' : ''}>Active</option>
                <option value="0" ${d.active === '0' ? 'selected' : ''}>Inactive / Archived</option>
              </select>
            </div>
            <div style="grid-column: 1 / -1; width:100%;">
              <label style="font-weight:700; display:block; margin-bottom:4px;">Course Subjects (पाठ्यक्रम के विषय) – One subject per line:</label>
              <textarea name="subjects_text" rows="4" placeholder="Enter subjects one per line..." style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:0.9rem;">${esc(subLines)}</textarea>
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
        payload.single_fee_rupees = +payload.single_fee_rupees || 200;
        payload.semester_fee_rupees = +payload.semester_fee_rupees || 600;
        if (payload.subjects_text !== undefined) {
          const lines = String(payload.subjects_text || '').split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
          payload.subjects = lines.map((sName, idx) => ({
            code: `${payload.code || 'SUB'}${idx + 1}`,
            name: sName,
            max_theory: 70,
            max_practical: 30,
            total_max: 100
          }));
          delete payload.subjects_text;
        }
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
      await openAdminCertificateIssueModal(+id, b.dataset.name);
      return;
    } else if (a === 'm_direct_issue') {
      await openAdminMarksheetIssueModal(+id, b.dataset.name);
      return;
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

async function openCourseCurriculumEditor(courseId) {
  const existing = document.getElementById('curriculumEditorModal');
  if (existing) existing.remove();

  let course = (window._adminCourses || []).find(x => x.id === courseId);
  let res = null;
  try {
    res = await api(`/api/admin/courses/${courseId}/curriculum`);
  } catch (_) {}

  const cCode = (res && res.code) || (course ? course.code : 'COURSE');
  const cName = (res && res.name) || (course ? course.name : 'Vocational Course');
  let singleFee = res ? res.single_fee_rupees : Math.round(((course && course.single_fee_paise) || 20000) / 100);
  let semFee = res ? res.semester_fee_rupees : Math.round(((course && course.semester_fee_paise) || 60000) / 100);

  let curData = (res && res.curriculum) || {};
  if (typeof curData === 'string') {
    try { curData = JSON.parse(curData); } catch (_) { curData = {}; }
  }
  if (!curData.yearly) curData.yearly = {};
  if (!curData.semester) curData.semester = {};

  if (!Object.keys(curData.yearly).length) {
    curData.yearly = {
      'Annual Examination': [
        { code: `${cCode}-Y101`, name: 'Theory & Core Fundamentals', theory: 45, practical: 45, max_marks: 100 },
        { code: `${cCode}-Y102`, name: 'Applied Professional Skills & Technology', theory: 44, practical: 46, max_marks: 100 },
        { code: `${cCode}-Y103`, name: 'Industry Practicum & Viva-Voce', theory: 48, practical: 48, max_marks: 100 }
      ],
      '1st Year': [
        { code: `${cCode}-Y101`, name: 'Theory & Core Fundamentals', theory: 45, practical: 45, max_marks: 100 },
        { code: `${cCode}-Y102`, name: 'Applied Professional Skills & Technology', theory: 44, practical: 46, max_marks: 100 }
      ],
      '2nd Year': [
        { code: `${cCode}-Y201`, name: 'Advanced Applications & Specialization', theory: 45, practical: 45, max_marks: 100 },
        { code: `${cCode}-Y202`, name: 'Comprehensive Project & Grand Viva', theory: 48, practical: 48, max_marks: 100 }
      ]
    };
  }
  if (!Object.keys(curData.semester).length) {
    curData.semester = {
      'Semester 1': [
        { code: `${cCode}-S101`, name: 'Subject 1: Fundamentals & Theory', theory: 45, practical: 45, max_marks: 100 },
        { code: `${cCode}-S102`, name: 'Subject 2: Applied Laboratory Work & Viva', theory: 46, practical: 46, max_marks: 100 }
      ],
      'Semester 2': [
        { code: `${cCode}-S201`, name: 'Subject 1: Advanced Topics & Software', theory: 45, practical: 45, max_marks: 100 },
        { code: `${cCode}-S202`, name: 'Subject 2: Project Workshop & Defense', theory: 48, practical: 48, max_marks: 100 }
      ]
    };
  }

  let activeEval = 'semester';
  let activeTerm = Object.keys(curData.semester)[0] || 'Semester 1';

  const modal = document.createElement('div');
  modal.id = 'curriculumEditorModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; backdrop-filter:blur(4px);';
  document.body.appendChild(modal);

  function renderView() {
    const termObj = curData[activeEval] || {};
    const terms = Object.keys(termObj);
    if (!termObj[activeTerm] && terms.length) {
      activeTerm = terms[0];
    }
    const currentSubjects = termObj[activeTerm] || [];

    modal.innerHTML = `
      <div style="background:#ffffff; border-radius:14px; max-width:900px; width:100%; box-shadow:0 25px 50px rgba(0,0,0,0.25); max-height:92vh; display:flex; flex-direction:column; overflow:hidden; border:2px solid #cbd5e1;">
        <!-- Modal Header -->
        <div style="background:linear-gradient(135deg, #071a33, #0a2a5e); color:#ffffff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #d4af37;">
          <div>
            <h3 style="margin:0; font-size:1.3rem; color:#fde047;">📚 Course Curriculum &amp; Examination Subjects Editor</h3>
            <span style="font-size:0.88rem; color:#cbd5e1;">Course: <b>${esc(cCode)}</b> - <b>${esc(cName)}</b> (Head Office Master Control)</span>
          </div>
          <button type="button" onclick="document.getElementById('curriculumEditorModal').remove()" style="background:none; border:none; color:#fde047; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Body Area -->
        <div style="padding:22px; overflow-y:auto; flex:1;">
          <!-- 1. Examination Fee Configuration Row -->
          <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div>
              <b style="color:#0a2a5e; font-size:1rem; display:block; margin-bottom:2px;">💰 Council Examination &amp; Certificate Fees Structure:</b>
              <span class="muted" style="font-size:0.82rem;">Set official fees for Single (Annual) vs Semester marksheets &amp; certificates</span>
            </div>
            <div style="display:flex; gap:18px; align-items:center; flex-wrap:wrap;">
              <div style="background:#ffffff; border:1px solid #94a3b8; border-radius:8px; padding:6px 12px; display:flex; align-items:center; gap:8px;">
                <label style="font-size:0.82rem; font-weight:700; color:#064e3b; margin:0;">📅 Single / Yearly Fee:</label>
                <span style="font-weight:700; color:#064e3b;">₹</span>
                <input id="curSingleFeeInput" type="number" min="0" value="${singleFee}" style="width:85px; padding:4px 6px; font-weight:800; font-size:0.95rem; border:1px solid #cbd5e1; border-radius:4px; text-align:right;">
              </div>
              <div style="background:#ffffff; border:1px solid #94a3b8; border-radius:8px; padding:6px 12px; display:flex; align-items:center; gap:8px;">
                <label style="font-size:0.82rem; font-weight:700; color:#0369a1; margin:0;">📚 Semester Fee:</label>
                <span style="font-weight:700; color:#0369a1;">₹</span>
                <input id="curSemFeeInput" type="number" min="0" value="${semFee}" style="width:85px; padding:4px 6px; font-weight:800; font-size:0.95rem; border:1px solid #cbd5e1; border-radius:4px; text-align:right;">
              </div>
              <button type="button" id="btnQuickSaveFees" class="btn sm gold" style="font-weight:800; padding:7px 14px; cursor:pointer;" title="Click to update Single & Semester fee directly">💾 Save Fees (₹)</button>
            </div>
          </div>

          <!-- 2. Main Evaluation Pattern Toggle (Semester vs Yearly) -->
          <div style="display:flex; gap:12px; margin-bottom:18px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">
            <button type="button" id="tabEvalSemester" class="btn sm" style="font-weight:800; padding:10px 22px; font-size:0.95rem; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px; ${activeEval === 'semester' ? 'background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:2px solid #0369a1; box-shadow:0 4px 12px rgba(2,132,199,0.3);' : 'background:#ffffff; color:#475569; border:1px solid #cbd5e1;'}">
              📚 Semester-Wise Curriculum (सेमेस्टर विषय)
            </button>
            <button type="button" id="tabEvalYearly" class="btn sm" style="font-weight:800; padding:10px 22px; font-size:0.95rem; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px; ${activeEval === 'yearly' ? 'background:linear-gradient(135deg, #059669, #047857); color:#ffffff; border:2px solid #047857; box-shadow:0 4px 12px rgba(5,150,105,0.3);' : 'background:#ffffff; color:#475569; border:1px solid #cbd5e1;'}">
              📅 Yearly / Annual Curriculum (वार्षिक विषय)
            </button>
          </div>

          <!-- 3. Term Tabs Selector (e.g. Semester 1, Semester 2, etc.) -->
          <div style="background:#f1f5f9; padding:10px 14px; border-radius:10px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
              <span style="font-weight:700; font-size:0.85rem; color:#475569; margin-right:4px;">Select Term / Stage:</span>
              ${terms.map(t => {
                const subCount = (curData[activeEval][t] || []).length;
                const isSelected = t === activeTerm;
                return `
                  <button type="button" class="btn sm term-pill" data-term="${esc(t)}" style="padding:6px 14px; border-radius:6px; font-weight:700; font-size:0.85rem; cursor:pointer; ${isSelected ? 'background:#0a2a5e; color:#ffffff; border:1px solid #0a2a5e;' : 'background:#ffffff; color:#334155; border:1px solid #cbd5e1;'}">
                    ${esc(t)} <span style="background:${isSelected ? '#d4af37' : '#e2e8f0'}; color:${isSelected ? '#071a33' : '#475569'}; border-radius:10px; padding:1px 7px; font-size:0.75rem; margin-left:4px;">${subCount}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <button type="button" id="btnAddTermBtn" class="btn sm alt" style="font-weight:700; border:1px dashed #0284c7; color:#0284c7; background:#ffffff;">
              ➕ Add ${activeEval === 'semester' ? 'Semester' : 'Year / Term'}
            </button>
          </div>

          <!-- 4. Table of Current Subjects for Active Term -->
          <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:10px; padding:16px 20px; margin-bottom:22px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
              <div>
                <h4 style="margin:0; color:#0a2a5e; font-size:1.1rem;">
                  Subjects for <span style="color:#0284c7;">${esc(activeTerm)}</span> (${currentSubjects.length} विषय)
                </h4>
                <span class="muted" style="font-size:0.8rem;">Yahi subjects student ke ${activeTerm} marksheet aur certificate me print honge</span>
              </div>
              <button type="button" id="btnToggleBulk" class="btn sm alt" style="font-size:0.8rem;">📝 Batch Add via Text</button>
            </div>

            <!-- Optional Bulk Text Paste Area -->
            <div id="bulkTextWrap" style="display:none; background:#f8fafc; border:1px dashed #94a3b8; border-radius:8px; padding:12px; margin-bottom:16px;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Paste Multiple Subjects (one subject title per line):</label>
              <textarea id="bulkSubjectsText" rows="3" placeholder="Subject Name 1&#10;Subject Name 2&#10;Subject Name 3" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 10px; font-size:0.88rem; box-sizing:border-box;"></textarea>
              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                <button type="button" id="btnApplyBulk" class="btn sm gold" style="font-weight:700;">Add Pasted Subjects</button>
              </div>
            </div>

            ${currentSubjects.length ? `
              <table style="width:100%; border-collapse:collapse; font-size:0.88rem; margin-bottom:14px;">
                <thead>
                  <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; color:#475569;">
                    <th style="padding:8px 10px; text-align:left; width:35px;">#</th>
                    <th style="padding:8px 10px; text-align:left; width:120px;">Code</th>
                    <th style="padding:8px 10px; text-align:left;">Subject Title (विषय नाम)</th>
                    <th style="padding:8px 10px; text-align:center; width:90px;">Max Th.</th>
                    <th style="padding:8px 10px; text-align:center; width:90px;">Max Pr.</th>
                    <th style="padding:8px 10px; text-align:center; width:90px;">Total</th>
                    <th style="padding:8px 10px; text-align:center; width:60px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${currentSubjects.map((s, idx) => {
                    const sCode = s.code || `SUB${idx+1}`;
                    const sName = s.name || s;
                    const th = +s.theory || 50;
                    const pr = +s.practical || 50;
                    const tot = +s.max_marks || (th + pr);
                    return `
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:8px 10px; color:#64748b; font-weight:700;">${idx + 1}</td>
                        <td style="padding:8px 10px;">
                          <input class="sub-edit-code" data-idx="${idx}" value="${esc(sCode)}" style="width:100%; padding:4px 6px; font-family:monospace; font-weight:700; color:#0369a1; border:1px solid #cbd5e1; border-radius:4px; font-size:0.85rem;">
                        </td>
                        <td style="padding:8px 10px;">
                          <input class="sub-edit-name" data-idx="${idx}" value="${esc(sName)}" style="width:100%; padding:4px 8px; font-weight:600; border:1px solid #cbd5e1; border-radius:4px; font-size:0.88rem;">
                        </td>
                        <td style="padding:8px 10px; text-align:center;">
                          <input class="sub-edit-th" data-idx="${idx}" type="number" min="0" value="${th}" style="width:65px; text-align:center; padding:4px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600; color:#0369a1;">
                        </td>
                        <td style="padding:8px 10px; text-align:center;">
                          <input class="sub-edit-pr" data-idx="${idx}" type="number" min="0" value="${pr}" style="width:65px; text-align:center; padding:4px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600; color:#047857;">
                        </td>
                        <td style="padding:8px 10px; text-align:center; font-weight:800; color:#0a2a5e;">
                          ${tot}
                        </td>
                        <td style="padding:8px 10px; text-align:center;">
                          <button type="button" class="btn-del-sub" data-idx="${idx}" style="background:none; border:none; cursor:pointer; font-size:1.1rem;" title="Delete Subject">🗑️</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : `
              <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:24px; text-align:center; color:#64748b; margin-bottom:14px;">
                Abhi <b>${esc(activeTerm)}</b> me koi subject add nahi hai. Niche form se subject add karein.
              </div>
            `}

            <!-- Add Single Subject Row Form -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 16px;">
              <b style="font-size:0.85rem; color:#0a2a5e; display:block; margin-bottom:8px;">➕ Add Single Subject to ${esc(activeTerm)}:</b>
              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <div style="width:130px;">
                  <input id="newSubCodeInput" placeholder="Code (e.g. S${currentSubjects.length + 1})" value="${cCode}-${activeEval === 'semester' ? 'S' + (activeTerm.match(/\d+/) ? activeTerm.match(/\d+/)[0] : '1') : 'Y1'}0${currentSubjects.length + 1}" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-family:monospace; font-weight:700; font-size:0.85rem;">
                </div>
                <div style="flex:1; min-width:220px;">
                  <input id="newSubNameInput" placeholder="Subject Name (e.g. Relational Database & SQL)" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.88rem; font-weight:600;">
                </div>
                <div style="width:85px;">
                  <input id="newSubThInput" type="number" min="0" value="50" placeholder="Theory" title="Theory Max Marks" style="width:100%; padding:6px 6px; text-align:center; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
                </div>
                <div style="width:85px;">
                  <input id="newSubPrInput" type="number" min="0" value="50" placeholder="Practical" title="Practical Max Marks" style="width:100%; padding:6px 6px; text-align:center; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
                </div>
                <div>
                  <button type="button" id="btnAddSingleSubBtn" class="btn gold sm" style="font-weight:700; padding:7px 16px;">➕ Add Subject</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div style="background:#f8fafc; border-top:1.5px solid #cbd5e1; padding:14px 24px; display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="btn alt sm" onclick="document.getElementById('curriculumEditorModal').remove()">Cancel / Close</button>
          <div style="display:flex; gap:12px; align-items:center;">
            <span id="saveStatusNote" class="muted" style="font-size:0.82rem;"></span>
            <button type="button" id="btnSaveCurriculumAll" class="btn gold" style="font-weight:800; padding:10px 24px; font-size:0.95rem; box-shadow:0 4px 14px rgba(212,175,55,0.4);">
              💾 Save All Curriculum &amp; Fees (सुरक्षित करें)
            </button>
          </div>
        </div>
      </div>
    `;

    const tabSem = modal.querySelector('#tabEvalSemester');
    if (tabSem) {
      tabSem.onclick = () => {
        syncEditedInputs();
        activeEval = 'semester';
        renderView();
      };
    }

    const tabYr = modal.querySelector('#tabEvalYearly');
    if (tabYr) {
      tabYr.onclick = () => {
        syncEditedInputs();
        activeEval = 'yearly';
        renderView();
      };
    }

    modal.querySelectorAll('.term-pill').forEach(btn => {
      btn.onclick = () => {
        syncEditedInputs();
        activeTerm = btn.dataset.term;
        renderView();
      };
    });

    const btnAddTerm = modal.querySelector('#btnAddTermBtn');
    if (btnAddTerm) {
      btnAddTerm.onclick = () => {
        syncEditedInputs();
        const count = Object.keys(curData[activeEval] || {}).length + 1;
        const defaultName = activeEval === 'semester' ? `Semester ${count}` : `${count}nd Year`;
        const termName = prompt(`Enter new ${activeEval === 'semester' ? 'semester' : 'term'} name:`, defaultName);
        if (termName && termName.trim()) {
          const cleanT = termName.trim();
          if (!curData[activeEval]) curData[activeEval] = {};
          if (!curData[activeEval][cleanT]) {
            curData[activeEval][cleanT] = [];
          }
          activeTerm = cleanT;
          renderView();
        }
      };
    }

    const btnTogBulk = modal.querySelector('#btnToggleBulk');
    if (btnTogBulk) {
      btnTogBulk.onclick = () => {
        const wrap = modal.querySelector('#bulkTextWrap');
        if (wrap) wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
      };
    }

    const btnAppBulk = modal.querySelector('#btnApplyBulk');
    if (btnAppBulk) {
      btnAppBulk.onclick = () => {
        syncEditedInputs();
        const txtEl = modal.querySelector('#bulkSubjectsText');
        if (!txtEl) return;
        const lines = txtEl.value.split('\n').map(l => l.trim()).filter(Boolean);
        if (!lines.length) return;
        if (!curData[activeEval]) curData[activeEval] = {};
        if (!curData[activeEval][activeTerm]) curData[activeEval][activeTerm] = [];
        lines.forEach((line) => {
          const currentCount = curData[activeEval][activeTerm].length;
          curData[activeEval][activeTerm].push({
            code: `${cCode}-${activeEval === 'semester' ? 'S' : 'Y'}${currentCount + 1}`,
            name: line,
            theory: 50,
            practical: 50,
            max_marks: 100
          });
        });
        renderView();
      };
    }

    const btnAddSub = modal.querySelector('#btnAddSingleSubBtn');
    if (btnAddSub) {
      btnAddSub.onclick = () => {
        syncEditedInputs();
        const nameEl = modal.querySelector('#newSubNameInput');
        const codeEl = modal.querySelector('#newSubCodeInput');
        const thEl = modal.querySelector('#newSubThInput');
        const prEl = modal.querySelector('#newSubPrInput');
        const name = (nameEl && nameEl.value.trim()) || '';
        if (!name) {
          alert('Kripya subject ka naam enter karein!');
          return;
        }
        if (!curData[activeEval]) curData[activeEval] = {};
        if (!curData[activeEval][activeTerm]) curData[activeEval][activeTerm] = [];
        const code = (codeEl && codeEl.value.trim()) || `SUB${curData[activeEval][activeTerm].length + 1}`;
        const th = (thEl && +thEl.value) || 50;
        const pr = (prEl && +prEl.value) || 50;
        const tot = th + pr;

        curData[activeEval][activeTerm].push({
          code,
          name,
          theory: th,
          practical: pr,
          max_marks: tot
        });
        renderView();
      };
    }

    modal.querySelectorAll('.btn-del-sub').forEach(btn => {
      btn.onclick = () => {
        syncEditedInputs();
        const idx = +btn.dataset.idx;
        if (curData[activeEval] && curData[activeEval][activeTerm]) {
          curData[activeEval][activeTerm].splice(idx, 1);
        }
        renderView();
      };
    });

    const btnQuickSave = modal.querySelector('#btnQuickSaveFees');
    if (btnQuickSave) {
      btnQuickSave.onclick = async () => {
        const sFeeInput = modal.querySelector('#curSingleFeeInput');
        const semFeeInput = modal.querySelector('#curSemFeeInput');
        const sFee = (sFeeInput && +sFeeInput.value) || 200;
        const semFeeVal = (semFeeInput && +semFeeInput.value) || 600;
        btnQuickSave.disabled = true;
        btnQuickSave.textContent = 'Saving...';
        try {
          await api(`/api/admin/courses/${courseId}`, {
            method: 'PUT',
            body: { single_fee_rupees: sFee, semester_fee_rupees: semFeeVal }
          });
          toast(`✅ Fees saved: Single ₹${sFee} / Semester ₹${semFeeVal}!`);
          singleFee = sFee;
          semFee = semFeeVal;
          if (typeof views !== 'undefined' && views.Courses) await views.Courses();
        } catch (err) {
          alert('Fee update failed: ' + (err.message || err));
        } finally {
          btnQuickSave.disabled = false;
          btnQuickSave.textContent = '💾 Save Fees (₹)';
        }
      };
    }

    const saveAllBtn = modal.querySelector('#btnSaveCurriculumAll');
    if (saveAllBtn) {
      saveAllBtn.onclick = async () => {
        syncEditedInputs();
        saveAllBtn.disabled = true;
        saveAllBtn.textContent = 'Saving…';

        const sFeeInput = modal.querySelector('#curSingleFeeInput');
        const semFeeInput = modal.querySelector('#curSemFeeInput');
        const sFee = (sFeeInput && +sFeeInput.value) || 200;
        const semFeeVal = (semFeeInput && +semFeeInput.value) || 600;

        try {
          await api(`/api/admin/courses/${courseId}/curriculum`, {
            method: 'POST',
            body: {
              curriculum: curData,
              single_fee_rupees: sFee,
              semester_fee_rupees: semFeeVal
            }
          });
          toast(`Curriculum & exam fees saved successfully for ${cCode}!`);
          modal.remove();
          if (typeof views !== 'undefined' && views.Courses) {
            await views.Courses();
          }
        } catch (err) {
          alert('Save failed: ' + (err.message || err));
          saveAllBtn.disabled = false;
          saveAllBtn.textContent = '💾 Save All Curriculum & Fees';
        }
      };
    }
  }

  function syncEditedInputs() {
    const sFeeInput = modal.querySelector('#curSingleFeeInput');
    if (sFeeInput) singleFee = +sFeeInput.value || singleFee;
    const semFeeInput = modal.querySelector('#curSemFeeInput');
    if (semFeeInput) semFee = +semFeeInput.value || semFee;

    const termSubs = (curData[activeEval] && curData[activeEval][activeTerm]) || [];
    modal.querySelectorAll('.sub-edit-code').forEach(el => {
      const idx = +el.dataset.idx;
      if (termSubs[idx]) termSubs[idx].code = el.value.trim();
    });
    modal.querySelectorAll('.sub-edit-name').forEach(el => {
      const idx = +el.dataset.idx;
      if (termSubs[idx]) termSubs[idx].name = el.value.trim();
    });
    modal.querySelectorAll('.sub-edit-th').forEach(el => {
      const idx = +el.dataset.idx;
      if (termSubs[idx]) {
        termSubs[idx].theory = +el.value || 0;
        termSubs[idx].max_marks = termSubs[idx].theory + (+termSubs[idx].practical || 0);
      }
    });
    modal.querySelectorAll('.sub-edit-pr').forEach(el => {
      const idx = +el.dataset.idx;
      if (termSubs[idx]) {
        termSubs[idx].practical = +el.value || 0;
        termSubs[idx].max_marks = (+termSubs[idx].theory || 0) + termSubs[idx].practical;
      }
    });
  }

  renderView();
}

window.openCourseCurriculumEditor = openCourseCurriculumEditor;

// Backward compatibility alias
function showCourseSubjectsModal(courseId) {
  openCourseCurriculumEditor(courseId);
}
window.showCourseSubjectsModal = showCourseSubjectsModal;

async function openAdminMarksheetIssueModal(studentId, studentName) {
  const existing = document.getElementById('marksheetDirectModal');
  if (existing) existing.remove();

  let s = (window._currentStudents || []).find(x => x.id === studentId);
  if (!s) {
    const res = await api('/api/admin/students');
    s = (res.students || []).find(x => x.id === studentId) || { id: studentId, name: studentName, course_name: 'DCA', student_code: 'PESC0001' };
  }

  if (!window._adminCourses) {
    const cr = await api('/api/admin/courses');
    window._adminCourses = cr.courses || [];
  }
  const co = (window._adminCourses || []).find(c => c.id === s.course_id) || window._adminCourses[0] || {};
  let subs = [];
  try { subs = typeof co.subjects === 'string' ? JSON.parse(co.subjects || '[]') : (co.subjects || []); } catch (_) {}
  if (!subs.length) {
    subs = [
      { code: 'TH01', name: 'Information Technology Core Concepts', max_theory: 70, max_practical: 30, total_max: 100 },
      { code: 'TH02', name: 'Software Applications & Productive Tools', max_theory: 70, max_practical: 30, total_max: 100 },
      { code: 'PR01', name: 'Practical Assessment & Viva Voce', max_theory: 50, max_practical: 50, total_max: 100 }
    ];
  }

  const modal = document.createElement('div');
  modal.id = 'marksheetDirectModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto;';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:12px; max-width:760px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.25); max-height:92vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e;">📊 Issue Official Marksheet: ${esc(s.name)}</h3>
          <span class="muted" style="font-size:0.85rem;">Enrolment: <b>${esc(s.student_code)}</b> · Course: <b>${esc(co.name || s.course_name)}</b></span>
        </div>
        <button type="button" onclick="document.getElementById('marksheetDirectModal').remove()" style="background:none; border:none; font-size:1.6rem; cursor:pointer;">&times;</button>
      </div>

      <form id="marksheetDirectForm">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:18px;">
          <label style="font-weight:700; display:block; margin-bottom:8px; color:#0f172a;">Evaluation System (मूल्यांकन प्रणाली) *</label>
          <div style="display:flex; gap:24px; flex-wrap:wrap; margin-bottom:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600;">
              <input type="radio" name="evaluation_type" value="yearly" checked onchange="toggleAdminPatternTerms('yearly')">
              📅 Yearly / Annual (वार्षिक परीक्षा आधारित अंकपत्र)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600;">
              <input type="radio" name="evaluation_type" value="semester" onchange="toggleAdminPatternTerms('semester')">
              📚 Semester-wise (सेमेस्टर आधारित परीक्षा अंकपत्र)
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div>
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination Stage *</label>
              <select name="term" id="adminTermSelect" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
                <option value="Annual">Annual Examination (वार्षिक परीक्षा)</option>
                <option value="1st Year">1st Year (प्रथम वर्ष)</option>
                <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
                <option value="Final Year">Final Year (अंतिम वर्ष)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Exam Session *</label>
              <input name="exam_session" value="${esc(s.session || '2026-27')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
          </div>
        </div>

        <h4 style="margin:16px 0 8px; color:#0a2a5e;">Course Subjects &amp; Marks Entry:</h4>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-bottom:16px;">
            <thead>
              <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
                <th style="padding:6px 8px; text-align:left;">Subject Title</th>
                <th style="padding:6px 8px; text-align:center;">Max Th.</th>
                <th style="padding:6px 8px; text-align:center;">Obt Th.</th>
                <th style="padding:6px 8px; text-align:center;">Max Pr.</th>
                <th style="padding:6px 8px; text-align:center;">Obt Pr.</th>
                <th style="padding:6px 8px; text-align:center;">Total</th>
              </tr>
            </thead>
            <tbody id="adminDirectSubjectsTbody">
              ${subs.map((sub, idx) => `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:6px 8px;">
                    <b>${esc(sub.name)}</b>
                    <input type="hidden" name="sub_code_${idx}" value="${esc(sub.code || `SUB${idx+1}`)}">
                    <input type="hidden" name="sub_name_${idx}" value="${esc(sub.name)}">
                  </td>
                  <td style="padding:6px 8px; text-align:center;">
                    <input type="number" name="sub_max_th_${idx}" value="${sub.max_theory || 70}" style="width:50px; text-align:center; padding:4px;" readonly>
                  </td>
                  <td style="padding:6px 8px; text-align:center;">
                    <input type="number" name="sub_obt_th_${idx}" value="58" min="0" max="${sub.max_theory || 70}" style="width:55px; text-align:center; padding:4px; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;" onchange="recalcAdminTotal()" required>
                  </td>
                  <td style="padding:6px 8px; text-align:center;">
                    <input type="number" name="sub_max_pr_${idx}" value="${sub.max_practical || 30}" style="width:50px; text-align:center; padding:4px;" readonly>
                  </td>
                  <td style="padding:6px 8px; text-align:center;">
                    <input type="number" name="sub_obt_pr_${idx}" value="26" min="0" max="${sub.max_practical || 30}" style="width:55px; text-align:center; padding:4px; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;" onchange="recalcAdminTotal()" required>
                  </td>
                  <td style="padding:6px 8px; text-align:center; font-weight:800; color:#0a2a5e;" id="sub_tot_preview_${idx}">
                    84
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background:#ecfdf5; font-weight:800; border-top:2px solid #a7f3d0;">
                <td style="padding:8px;">Total Score:</td>
                <td colspan="4" style="padding:8px; text-align:right;" id="adminGrandTotalDisplay">Grand Total: 0 / 0 (0%)</td>
                <td style="padding:8px; text-align:center; color:#16a34a;" id="adminGradeDisplay">Grade: A+</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
          <button type="button" class="btn alt" onclick="document.getElementById('marksheetDirectModal').remove()">Cancel</button>
          <button type="submit" class="btn gold" style="font-weight:700;">Authorize &amp; Issue Marksheet</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  window.toggleAdminPatternTerms = (pattern) => {
    const sel = document.getElementById('adminTermSelect');
    if (!sel) return;
    if (pattern === 'semester') {
      sel.innerHTML = `
        <option value="Semester 1">Semester 1 (1st Sem / प्रथम सेमेस्टर)</option>
        <option value="Semester 2">Semester 2 (2nd Sem / द्वितीय सेमेस्टर)</option>
        <option value="Semester 3">Semester 3 (3rd Sem / तृतीय सेमेस्टर)</option>
        <option value="Semester 4">Semester 4 (4th Sem / चतुर्थ सेमेस्टर)</option>
      `;
    } else {
      sel.innerHTML = `
        <option value="Annual">Annual Examination (वार्षिक परीक्षा)</option>
        <option value="1st Year">1st Year (प्रथम वर्ष)</option>
        <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
        <option value="Final Year">Final Year (अंतिम वर्ष)</option>
      `;
    }
  };

  window.recalcAdminTotal = () => {
    let totMax = 0, totObt = 0;
    subs.forEach((sub, idx) => {
      const maxTh = +document.querySelector(`input[name="sub_max_th_${idx}"]`)?.value || 70;
      const obtTh = +document.querySelector(`input[name="sub_obt_th_${idx}"]`)?.value || 0;
      const maxPr = +document.querySelector(`input[name="sub_max_pr_${idx}"]`)?.value || 30;
      const obtPr = +document.querySelector(`input[name="sub_obt_pr_${idx}"]`)?.value || 0;
      const subTot = obtTh + obtPr;
      const rowTotEl = document.getElementById(`sub_tot_preview_${idx}`);
      if (rowTotEl) rowTotEl.textContent = subTot;
      totMax += (maxTh + maxPr);
      totObt += subTot;
    });
    const pct = totMax > 0 ? Math.round((totObt / totMax) * 1000) / 10 : 0;
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C';
    const disp = document.getElementById('adminGrandTotalDisplay');
    if (disp) disp.textContent = `Grand Total: ${totObt} / ${totMax} (${pct}%)`;
    const grd = document.getElementById('adminGradeDisplay');
    if (grd) grd.textContent = `Grade: ${grade}`;
  };

  recalcAdminTotal();

  document.getElementById('marksheetDirectForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const evaluationType = fd.get('evaluation_type') || 'yearly';
    const term = fd.get('term') || 'Annual';
    const examSession = fd.get('exam_session') || '2026-27';

    let totalMax = 0, totalObtained = 0;
    const subjectsPayload = subs.map((sub, idx) => {
      const maxTh = +fd.get(`sub_max_th_${idx}`) || 70;
      const obtTh = +fd.get(`sub_obt_th_${idx}`) || 0;
      const maxPr = +fd.get(`sub_max_pr_${idx}`) || 30;
      const obtPr = +fd.get(`sub_obt_pr_${idx}`) || 0;
      const sMax = maxTh + maxPr;
      const sObt = obtTh + obtPr;
      totalMax += sMax;
      totalObtained += sObt;
      return {
        code: fd.get(`sub_code_${idx}`) || `SUB${idx+1}`,
        name: fd.get(`sub_name_${idx}`) || sub.name,
        max_theory: maxTh,
        obt_theory: obtTh,
        max_practical: maxPr,
        obt_practical: obtPr,
        total_max: sMax,
        total_obt: sObt,
        result: sObt >= Math.round(sMax * 0.33) ? 'PASS' : 'FAIL'
      };
    });

    const res = await post('/api/admin/marksheets/direct-issue', {
      student_id: studentId,
      evaluation_type: evaluationType,
      term: term,
      exam_session: examSession,
      subjects: subjectsPayload,
      total_max: totalMax,
      total_obtained: totalObtained
    });

    toast(`Official Marksheet issued: ${res.marksheet_no} (${res.percentage}% Grade ${res.grade}) [${term}]!`);
    document.getElementById('marksheetDirectModal').remove();
    await views.Students();
  };
}

async function openAdminCertificateIssueModal(studentId, studentName) {
  const existing = document.getElementById('certDirectModal');
  if (existing) existing.remove();

  let s = (window._currentStudents || []).find(x => x.id === studentId);
  if (!s) {
    const res = await api('/api/admin/students');
    s = (res.students || []).find(x => x.id === studentId) || { id: studentId, name: studentName, course_name: 'DCA', student_code: 'PESC0001' };
  }

  const modal = document.createElement('div');
  modal.id = 'certDirectModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:12px; max-width:560px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.25);">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e;">📜 Issue Official Certificate: ${esc(s.name)}</h3>
          <span class="muted" style="font-size:0.85rem;">Candidate: <b>${esc(s.student_code)}</b></span>
        </div>
        <button type="button" onclick="document.getElementById('certDirectModal').remove()" style="background:none; border:none; font-size:1.6rem; cursor:pointer;">&times;</button>
      </div>

      <form id="certDirectForm">
        <div style="margin-bottom:16px;">
          <label style="font-weight:700; display:block; margin-bottom:8px;">Certificate Evaluation Pattern *</label>
          <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600;">
              <input type="radio" name="evaluation_type" value="yearly" checked onchange="document.getElementById('adminCertTerm').value='Annual Examination / Course Completion'">
              📅 Yearly / Annual Certificate (वार्षिक प्रमाणपत्र)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600;">
              <input type="radio" name="evaluation_type" value="semester" onchange="document.getElementById('adminCertTerm').value='Semester 1'">
              📚 Semester-wise Certificate (सेमेस्टर आधारित प्रमाणपत्र)
            </label>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination Stage *</label>
          <input name="term" id="adminCertTerm" value="Annual Examination / Course Completion" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
          <button type="button" class="btn alt" onclick="document.getElementById('certDirectModal').remove()">Cancel</button>
          <button type="submit" class="btn gold" style="font-weight:700;">Issue Official Certificate</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('certDirectForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const evaluationType = fd.get('evaluation_type') || 'yearly';
    const term = fd.get('term') || 'Annual Examination';

    const res = await post('/api/admin/certificates/direct-issue', {
      student_id: studentId,
      evaluation_type: evaluationType,
      term: term
    });

    toast(`Official Certificate issued: ${res.cert_no} [${term}]!`);
    document.getElementById('certDirectModal').remove();
    await views.Students();
  };
}

V.addEventListener('submit', (e) => {
  e.preventDefault();
  guard(async () => {
    if (e.target.id === 'cf') {
      const data = form(e.target);
      if (data.subjects_text) {
        const lines = String(data.subjects_text || '').split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        data.subjects = lines.map((sName, idx) => ({
          code: `${data.code || 'SUB'}${idx + 1}`,
          name: sName,
          max_theory: 70,
          max_practical: 30,
          total_max: 100
        }));
        delete data.subjects_text;
      }
      await api('/api/admin/courses', { method: 'POST', body: data });
    }
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
  const whoEl = $('#who');
  if (whoEl) {
    whoEl.textContent = me.user.name;
    whoEl.style.cursor = 'pointer';
    whoEl.title = 'Click to open Admin Profile';
    whoEl.onclick = (e) => {
      e.preventDefault();
      const btn = $(`button[data-tab="Profile"]`, $('#tabs'));
      if (btn) btn.click();
      else show('Profile');
    };
  }
  $('#out').onclick = async (e) => {
    e.preventDefault();
    await api('/api/auth/logout', { method: 'POST' });
    location = '/login';
  };
  const names = Object.keys(views);
  tabs($('#tabs'), names, show);
})();
