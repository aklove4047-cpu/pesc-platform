// Public Index Script - Interactive Verification, Course Filters, FAQ Accordion, Centre Search & Application

// Certificate Verification Handler
const showCertVerify = (d) => {
  if (!d || d.status === 'Not Found') {
    return `<div style="padding:18px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; margin-top:16px;">
      <span class="badge Rejected">NOT FOUND</span>
      <p class="muted" style="margin-top:8px; font-size:0.92rem;">No valid certificate found matching this number or token. Please check for typographical errors or contact your affiliated training centre.</p>
    </div>`;
  }
  return `
    <div class="verify-result-box" style="margin-top:18px;">
      <div class="verify-seal-watermark">PESC</div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="badge ${d.status}">${d.status} CERTIFICATE</span>
        <b style="font-family:monospace; color:var(--navy); font-size:1.05rem;">${esc(d.certificate_no)}</b>
      </div>
      <div style="margin-top:14px; font-size:0.95rem;">
        <p style="font-size:1.2rem; color:var(--navy); margin-bottom:6px;"><b>Candidate Name:</b> ${esc(d.holder)}</p>
        <p style="margin-bottom:4px;"><b>Course Completed:</b> <b>${esc(d.course)}</b></p>
        <p style="margin-bottom:4px;"><b>Affiliated Training Centre:</b> ${esc(d.centre)}</p>
        <p class="muted" style="margin-top:8px;">Issued Date: <b>${esc(d.issued_on)}</b> · Authenticated via PESC National Academic Ledger</p>
      </div>
      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:14px;">
        <span style="font-size:0.8rem; color:#16a34a; font-weight:bold;">✓ Cryptographically Validated Credential</span>
        <button type="button" class="btn sm alt" onclick="window.print()">🖨️ Print Verification Slip</button>
      </div>
    </div>
  `;
};

// Marksheet Verification Handler
const showMrkVerify = (d) => {
  if (!d || d.status === 'Not Found') {
    return `<div style="padding:18px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; margin-top:16px;">
      <span class="badge Rejected">NOT FOUND</span>
      <p class="muted" style="margin-top:8px; font-size:0.92rem;">No valid marksheet found matching this number, roll number, or student code.</p>
    </div>`;
  }
  return `
    <div class="verify-result-box" style="margin-top:18px;">
      <div class="verify-seal-watermark">PESC</div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="badge ${d.status}">${d.status} MARKSHEET</span>
        <b style="font-family:monospace; color:var(--navy); font-size:1.05rem;">${esc(d.marksheet_no)}</b>
      </div>
      <div style="margin-top:14px; font-size:0.95rem;">
        <p style="font-size:1.2rem; color:var(--navy); margin-bottom:6px;"><b>Candidate Name:</b> ${esc(d.holder)} (Roll No: <b>${esc(d.roll_no || d.student_code)}</b>)</p>
        <p style="margin-bottom:4px;"><b>Course:</b> <b>${esc(d.course)}</b> · Session: <b>${esc(d.session)}</b></p>
        <p style="margin-bottom:10px;"><b>Affiliated Centre:</b> ${esc(d.centre)} (${esc(d.centre_code)})</p>
        <div style="display:flex; gap:16px; background:#f8fafc; padding:12px 16px; border-radius:8px; flex-wrap:wrap; border:1px solid #e2e8f0;">
          <div>Total Score: <b>${d.total_obtained} / ${d.total_max}</b></div>
          <div>Percentage: <b style="color:var(--navy);">${d.percentage}%</b></div>
          <div>Grade: <b>${esc(d.grade)}</b></div>
          <div>Result: ${badge(d.result)}</div>
        </div>
        <p class="muted" style="margin-top:10px;">Issued Date: <b>${esc(d.issued_on)}</b> · Authenticated via PESC Central Academic Ledger</p>
      </div>
      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:14px;">
        <span style="font-size:0.8rem; color:#16a34a; font-weight:bold;">✓ Tamper-Proof Digital Evaluation</span>
        <button type="button" class="btn sm alt" onclick="window.print()">🖨️ Print Verification Slip</button>
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

// Subdomain Slug Check
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
        ? `<span style="color:#16a34a; font-weight:700;">✓ Subdomain "${val}.pescouncil.in" is available</span>`
        : `<span style="color:#dc2626; font-weight:700;">✗ ${d.reason}</span>`;
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
        <div style="background:#dcfce7; border:1px solid #86efac; border-radius:12px; padding:22px; margin-top:18px;">
          <h3 style="color:#15803d; margin-bottom:8px;">✅ Franchise Application Successfully Submitted!</h3>
          <p style="font-size:1.15rem; color:#14532d; margin-bottom:8px;">Your Official Application Number is: <b style="font-family:monospace; background:#fff; padding:3px 8px; border-radius:4px;">${esc(d.application_no)}</b></p>
          <p class="muted">Please save this application number. You can track your affiliation review and subdomain provisioning progress anytime using the status tracker below.</p>
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
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:18px; margin-top:16px;">
          <p style="font-size:1.1rem; color:var(--navy); margin-bottom:6px;"><b>Centre Name:</b> ${esc(d.centre_name)} (Requested subdomain: <code>${esc(d.slug)}.pescouncil.in</code>)</p>
          <p style="margin-bottom:6px;"><b>Application Status:</b> ${badge(d.status)}</p>
          ${d.decision_reason ? `<p class="muted" style="margin-top:6px;"><b>Council Committee Remark:</b> ${esc(d.decision_reason)}</p>` : ''}
        </div>
      `;
    });
  };
}

// Global cached datasets for courses and centres
let allCourses = [];
let allCentres = [];

// Render Courses with Category & Search Filtering
function renderCourses(list) {
  const courseEl = $('#courseList');
  if (!courseEl) return;
  if (!list.length) {
    courseEl.innerHTML = '<p class="muted" style="grid-column:1/-1; text-align:center; padding:30px;">No courses found matching your search criteria.</p>';
    return;
  }
  courseEl.innerHTML = list.map((c) => `
    <div class="course-card">
      <div>
        <span class="course-badge">${esc(c.code)}</span>
        <h3 style="margin-bottom:8px;">${esc(c.name)}</h3>
        <p class="muted" style="font-size:0.86rem; line-height:1.5; margin-bottom:12px;">Nationally recognized curriculum with hands-on practical lab training, official marksheet, and verifiable credential.</p>
      </div>
      <div class="course-meta">
        <span>⏱️ Duration: <b>${c.duration_months} Months</b></span>
        <span>📜 Assessment: <b>${c.total_marks || 100} Marks</b></span>
      </div>
    </div>
  `).join('');
}

// Render Centres with Search Filtering
function renderCentres(list) {
  const cl = $('#cl');
  if (!cl) return;
  cl.innerHTML = table([
    ['Accredited Centre Name', (r) => `<b>${esc(r.name)}</b>`],
    ['District', (r) => esc(r.district)],
    ['State', (r) => esc(r.state)],
    ['Official Subdomain Portal', (r) => `<a href="/portal" class="muted" style="text-decoration:underline; font-weight:600; color:var(--navy);">${esc(r.slug)}.pescouncil.in</a>`],
  ], list, 'No affiliated centres match your search criteria');
}

// Initial Data Fetching
guard(async () => {
  // 1. Fetch Courses
  try {
    const cData = await api('/api/public/courses');
    allCourses = cData.courses || [];
    renderCourses(allCourses);
  } catch (_) {}

  // 2. Fetch Centres
  try {
    const d = await api('/api/public/centres');
    allCentres = d.centres || [];
    renderCentres(allCentres);
  } catch (_) {}

  // 3. Fetch Notices & News Ticker
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
            <h4 style="color:var(--navy); font-size:1.1rem; margin-bottom:6px;">${esc(n.title)}</h4>
            <p class="muted" style="font-size:0.9rem; line-height:1.6;">${esc(n.content)}</p>
            ${n.link ? `<div style="margin-top:10px;"><a href="${esc(n.link)}" class="btn sm" style="text-decoration:none;">View Circular / Proceed →</a></div>` : ''}
          </div>
        `).join('');
      }
    }
  } catch (_) {}
});

// Interactive Course Search & Category Filters
const courseSearch = $('#courseSearchInput');
let activeCategory = 'all';

function filterCourses() {
  const query = (courseSearch ? courseSearch.value.toLowerCase().trim() : '');
  const filtered = allCourses.filter(c => {
    const code = (c.code || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    const matchesQuery = !query || code.includes(query) || name.includes(query);

    let matchesCat = true;
    if (activeCategory === 'it') matchesCat = code.includes('dca') || code.includes('ccc') || code.includes('pgdca');
    else if (activeCategory === 'accounting') matchesCat = code.includes('tally') || name.includes('accounting') || name.includes('gst');
    else if (activeCategory === 'design') matchesCat = code.includes('dtp') || name.includes('graphic') || name.includes('publishing');
    else if (activeCategory === 'vocational') matchesCat = code.includes('yoga') || code.includes('fashion') || code.includes('hardware');

    return matchesQuery && matchesCat;
  });
  renderCourses(filtered);
}

if (courseSearch) {
  courseSearch.oninput = filterCourses;
}

const pillContainer = $('#courseFilterPills');
if (pillContainer) {
  pillContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    pillContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat || 'all';
    filterCourses();
  });
}

// Centre Search Filtering
const centreSearch = $('#centreSearchInput');
if (centreSearch) {
  centreSearch.oninput = (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = allCentres.filter(c => {
      return (c.name || '').toLowerCase().includes(q) ||
        (c.district || '').toLowerCase().includes(q) ||
        (c.state || '').toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q);
    });
    renderCentres(filtered);
  };
}

// Interactive FAQ Accordion Toggle
const faqList = document.querySelector('.faq-list');
if (faqList) {
  faqList.addEventListener('click', (e) => {
    const header = e.target.closest('.faq-question');
    if (!header) return;
    const item = header.parentElement;
    item.classList.toggle('open');
  });
}

// Mobile Navigation Toggle
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
