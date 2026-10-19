// Public Index Script - Certificate & Marksheet Verification, Courses, Application

// Certificate Verification Handler
const showCertVerify = (d) => {
  if (!d || d.status === 'Not Found') {
    return `<div style="padding:16px; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; margin-top:14px;"><span class="badge Rejected">NOT FOUND</span><p class="muted" style="margin-top:6px;">No valid certificate found matching this number. Please check the spelling or contact your centre.</p></div>`;
  }
  return `
    <div class="verify-result-box" style="margin-top:16px;">
      <div class="print-slip-header" style="display:none;">
        <h2 style="margin:0; font-family:'Outfit', sans-serif;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
        <p style="margin:2px 0; font-size:10pt; color:#475569;">Central Autonomous Council for Vocational &amp; Technical Training · ISO 9001:2015 Certified</p>
        <p style="margin:6px 0 0; font-weight:bold; font-size:11pt; text-decoration:underline;">OFFICIAL DIGITAL CREDENTIAL VERIFICATION SLIP</p>
      </div>
      <div class="verify-seal-watermark">PESC</div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="badge ${d.status}">${d.status} CERTIFICATE</span>
        <b style="font-family:monospace; color:var(--navy);">${esc(d.certificate_no)}</b>
      </div>
      <div style="margin-top:12px;">
        <p style="font-size:1.1rem; color:var(--navy); margin-bottom:4px;"><b>Candidate Name:</b> ${esc(d.holder)}</p>
        <p style="margin-bottom:4px;"><b>Course Completed:</b> ${esc(d.course)}</p>
        <p style="margin-bottom:4px;"><b>Affiliated Training Centre:</b> ${esc(d.centre)}</p>
        <p class="muted">Issued Date: <b>${esc(d.issued_on)}</b> · Authenticated via PESC Central Registry</p>
      </div>
      <div class="print-seal-box" style="display:none;">
        <div>
          <span style="font-size:8pt; color:#64748b;">Verification Ref: ${esc(d.certificate_no)}</span><br>
          <span style="font-size:8pt; color:#64748b;">Validation Date: ${new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div style="text-align:right;">
          <b style="font-size:9pt; text-transform:uppercase;">Controller of Examinations</b><br>
          <span style="font-size:7pt; color:#64748b;">PESC Council Central Office</span>
        </div>
      </div>
      <div style="margin-top:14px; text-align:right;">
        <button type="button" class="btn sm alt" onclick="window.print()">🖨️ Print Official Verification Slip</button>
      </div>
    </div>
  `;
};

// Marksheet Verification Handler
const showMrkVerify = (d) => {
  if (!d || d.status === 'Not Found') {
    return `<div style="padding:16px; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; margin-top:14px;"><span class="badge Rejected">NOT FOUND</span><p class="muted" style="margin-top:6px;">No valid marksheet found matching this number or roll number.</p></div>`;
  }
  return `
    <div class="verify-result-box" style="margin-top:16px;">
      <div class="print-slip-header" style="display:none;">
        <h2 style="margin:0; font-family:'Outfit', sans-serif;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</h2>
        <p style="margin:2px 0; font-size:10pt; color:#475569;">Central Autonomous Council for Vocational &amp; Technical Training · ISO 9001:2015 Certified</p>
        <p style="margin:6px 0 0; font-weight:bold; font-size:11pt; text-decoration:underline;">OFFICIAL STATEMENT OF MARKS VERIFICATION SLIP</p>
      </div>
      <div class="verify-seal-watermark">PESC</div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="badge ${d.status}">${d.status} MARKSHEET</span>
        <b style="font-family:monospace; color:var(--navy);">${esc(d.marksheet_no)}</b>
      </div>
      <div style="margin-top:12px;">
        <p style="font-size:1.1rem; color:var(--navy); margin-bottom:4px;"><b>Candidate Name:</b> ${esc(d.holder)} (Roll: ${esc(d.roll_no || d.student_code)})</p>
        <p style="margin-bottom:4px;"><b>Course:</b> ${esc(d.course)} · Session: <b>${esc(d.session)}</b></p>
        <p style="margin-bottom:8px;"><b>Affiliated Centre:</b> ${esc(d.centre)} (${esc(d.centre_code)})</p>
        <div style="display:flex; gap:14px; background:#f8fafc; padding:10px 14px; border-radius:8px; flex-wrap:wrap;">
          <div>Score: <b>${d.total_obtained}/${d.total_max}</b></div>
          <div>Percentage: <b>${d.percentage}%</b></div>
          <div>Grade: <b>${esc(d.grade)}</b></div>
          <div>Result: ${badge(d.result)}</div>
        </div>
        <p class="muted" style="margin-top:8px;">Issued On: <b>${esc(d.issued_on)}</b> · Authenticated via PESC Central Academic Ledger</p>
      </div>
      <div class="print-seal-box" style="display:none;">
        <div>
          <span style="font-size:8pt; color:#64748b;">Verification Ref: ${esc(d.marksheet_no)}</span><br>
          <span style="font-size:8pt; color:#64748b;">Validation Date: ${new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div style="text-align:right;">
          <b style="font-size:9pt; text-transform:uppercase;">Controller of Examinations</b><br>
          <span style="font-size:7pt; color:#64748b;">PESC Council Central Office</span>
        </div>
      </div>
      <div style="margin-top:14px; text-align:right;">
        <button type="button" class="btn sm alt" onclick="window.print()">🖨️ Print Official Verification Slip</button>
      </div>
    </div>
  `;
};

// Certificate Form Submit
const vfForm = $('#vf');
if (vfForm) {
  vfForm.onsubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const q = encodeURIComponent(form(e.target).cert_no);
      const res = await api('/api/public/verify?cert_no=' + q);
      $('#vr').innerHTML = showCertVerify(res);
    });
  };
}

// Marksheet Form Submit
const mfForm = $('#mf');
if (mfForm) {
  mfForm.onsubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const q = encodeURIComponent(form(e.target).mrk_query);
      const res = await api('/api/public/verify-marksheet?marksheet_no=' + q + '&roll_no=' + q);
      $('#mr').innerHTML = showMrkVerify(res);
    });
  };
}

// Verification Tabs Toggle
const tabCertBtn = $('#tabCertBtn');
const tabMrkBtn = $('#tabMrkBtn');
const certTabContent = $('#certTabContent');
const mrkTabContent = $('#mrkTabContent');

if (tabCertBtn && tabMrkBtn) {
  tabCertBtn.onclick = () => {
    tabCertBtn.classList.add('on');
    tabMrkBtn.classList.remove('on');
    certTabContent.classList.remove('hide');
    mrkTabContent.classList.add('hide');
  };
  tabMrkBtn.onclick = () => {
    tabMrkBtn.classList.add('on');
    tabCertBtn.classList.remove('on');
    mrkTabContent.classList.remove('hide');
    certTabContent.classList.add('hide');
  };
}



// Slug Check
let st;
const slugInput = $('#slug');
if (slugInput) {
  slugInput.oninput = (e) => {
    clearTimeout(st);
    st = setTimeout(() => guard(async () => {
      const val = e.target.value.toLowerCase().trim();
      if (!val) {
        $('#slugmsg').textContent = '';
        return;
      }
      const d = await api('/api/public/slug-check?slug=' + encodeURIComponent(val));
      $('#slugmsg').innerHTML = d.available
        ? `<span style="color:#16a34a; font-weight:600;">✓ Subdomain "${val}.pescouncil.in" is available</span>`
        : `<span style="color:#dc2626; font-weight:600;">✗ ${d.reason}</span>`;
    }), 400);
  };
}

// Franchise Application Submit
const afForm = $('#af');
if (afForm) {
  afForm.onsubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const b = form(e.target);
      b.terms = !!b.terms;
      b.slug = b.slug.toLowerCase().trim();
      const d = await api('/api/public/apply', { method: 'POST', body: b });
      $('#ar').innerHTML = `
        <div style="background:#dcfce7; border:1px solid #86efac; border-radius:12px; padding:20px; margin-top:16px;">
          <h3 style="color:#15803d; margin-bottom:8px;">✅ Application Successfully Submitted!</h3>
          <p style="font-size:1.1rem; color:#14532d; margin-bottom:6px;">Your Application Number is: <b>${esc(d.application_no)}</b></p>
          <p class="muted">Please note down this application number and registered mobile number to check review status anytime.</p>
        </div>
      `;
      e.target.reset();
      $('#slugmsg').textContent = '';
    });
  };
}

// Check Application Status
const sfForm = $('#sf');
if (sfForm) {
  sfForm.onsubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const f = form(e.target);
      const d = await api(`/api/public/application/${encodeURIComponent(f.no)}?mobile=${encodeURIComponent(f.mobile)}`);
      $('#sr').innerHTML = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-top:14px;">
          <p style="font-size:1.1rem; color:var(--navy); margin-bottom:4px;"><b>Centre:</b> ${esc(d.centre_name)} (Requested subdomain: ${esc(d.slug)})</p>
          <p style="margin-bottom:4px;"><b>Application Status:</b> ${badge(d.status)}</p>
          ${d.decision_reason ? `<p class="muted" style="margin-top:6px;"><b>Council Remark:</b> ${esc(d.decision_reason)}</p>` : ''}
        </div>
      `;
    });
  };
}

// Load Popular Courses & Centres on page load
guard(async () => {
  // Courses
  try {
    const cData = await api('/api/public/courses');
    const cList = cData.courses || [];
    const courseEl = $('#courseList');
    if (courseEl) {
      if (!cList.length) {
        courseEl.innerHTML = '<p class="muted">No courses listed at the moment.</p>';
      } else {
        courseEl.innerHTML = cList.map((c) => `
          <div class="course-card">
            <div>
              <span class="course-badge">${esc(c.code)}</span>
              <h3>${esc(c.name)}</h3>
              <p class="muted" style="font-size:0.85rem; line-height:1.4;">Certified training program with hands-on computer skills, official marksheets, and recognized certification.</p>
            </div>
            <div class="course-meta">
              <span>⏱️ Duration: <b>${c.duration_months} Months</b></span>
              <span>📜 Evaluation: <b>${c.total_marks || 100} Marks</b></span>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (_) {}

  // Centres
  try {
    const d = await api('/api/public/centres');
    const cl = $('#cl');
    if (cl) {
      cl.innerHTML = table([
        ['Centre Name', (r) => `<b>${esc(r.name)}</b>`],
        ['District', (r) => esc(r.district)],
        ['State', (r) => esc(r.state)],
        ['Web Portal', (r) => `<a href="/portal" class="muted" style="text-decoration:underline;">${esc(r.slug)}.pescouncil.in</a>`],
      ], d.centres, 'No centres registered yet');
    }
  } catch (_) {}

  // Official Council Notices & News Ticker
  try {
    const nData = await api('/api/public/notices');
    const nList = nData.notices || [];
    const tickerEl = $('#tickerContent');
    if (tickerEl && nList.length) {
      tickerEl.innerHTML = nList.map(n => `<span>• <b>${esc(n.category)}:</b> ${esc(n.title)}</span>`).join(' &nbsp; | &nbsp; ');
    }
    const nbEl = $('#noticeBoardList');
    if (nbEl) {
      if (!nList.length) {
        nbEl.innerHTML = '<p class="muted">No official circulars at the moment.</p>';
      } else {
        nbEl.innerHTML = nList.map(n => `
          <div class="notice-card ${n.pinned ? 'pinned' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
              <span class="badge ${n.pinned ? 'Valid' : 'Pending'}">${n.pinned ? '📌 ' : ''}${esc(n.category)}</span>
              <span class="muted" style="font-size:0.8rem;">${new Date(n.created_at).toLocaleDateString('en-IN')}</span>
            </div>
            <h4 style="color:var(--navy); font-size:1.05rem; margin-bottom:6px;">${esc(n.title)}</h4>
            <p class="muted" style="font-size:0.88rem; line-height:1.5;">${esc(n.content)}</p>
            ${n.link ? `<div style="margin-top:8px;"><a href="${esc(n.link)}" class="btn sm" style="text-decoration:none;">View Details / Action →</a></div>` : ''}
          </div>
        `).join('');
      }
    }
  } catch (_) {}
});

// Mobile navigation toggle
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
if (navToggle && navLinks) {
  navToggle.onclick = () => {
    navLinks.classList.toggle('open');
  };
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') navLinks.classList.remove('open');
  });
}

