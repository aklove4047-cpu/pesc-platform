// Official Document Templates (Admission Form, Certificate, Marksheet, Student ID Card)
// Pixel-accurate recreation of User-Provided Reference Images (Without Ashok Stambh)

(function(global) {
  'use strict';

  function esc(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Official Seals & Signatures
  const SEALS = {
    councilLogo: '/assets/img/logo_council.svg',
    councilSeal: '/assets/img/seal_council_head.svg',
    councilSign: '/assets/img/sign_council_head.svg',
    coordinatorSeal: '/assets/img/seal_coordinator.svg',
    coordinatorSign: '/assets/img/sign_coordinator.svg',
    centreSeal: '/assets/img/seal_centre_director.svg',
    centreSign: '/assets/img/sign_centre_director.svg',
  };

  function cleanUrl(val) {
    if (!val || typeof val !== 'string') return '';
    val = val.trim();
    const m = val.match(/src=["']([^"']+)["']/i);
    if (m) val = m[1].trim();
    val = val.replace(/^["']|["']$/g, '').trim();
    if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/') || val.startsWith('/')) {
      return val;
    }
    return '';
  }

  function resolveSeals(data, c) {
    const auth = (data && data.authorities) || (c && c.authorities) || (typeof window !== 'undefined' && window._councilAuthorities) || {};
    const hoAuth = auth.head_office || (data && data.head_office) || (c && c.head_office) || {};
    const coordAuth = auth.coordinator || (data && data.coordinator) || (c && c.coordinator) || {};
    const centreAuth = auth.centre || (data && data.centre) || (c && c.centre) || {};

    const isCustom = (url) => {
      const u = cleanUrl(url);
      if (!u) return false;
      return !u.includes('seal_coordinator.svg') && !u.includes('sign_coordinator.svg') && !u.includes('seal_council_head.svg') && !u.includes('sign_council_head.svg') && !u.includes('logo_council.svg');
    };

    // Centre Assets
    const centreSeal = cleanUrl((c && c.seal_url) || centreAuth.seal_url || (data && data.centreSeal)) || SEALS.centreSeal;
    const centreSign = cleanUrl((c && c.signature_url) || centreAuth.signature_url || (data && data.centreSign)) || SEALS.centreSign;
    const centreLogo = cleanUrl((c && c.logo_url) || centreAuth.logo_url || (data && data.centreLogo));

    // Coordinator Assets (Priority to live coordinator user uploaded assets)
    let coordSeal = '';
    if (isCustom(coordAuth.seal_url)) coordSeal = cleanUrl(coordAuth.seal_url);
    else if (isCustom(c && c.coordinator_seal_url)) coordSeal = cleanUrl(c.coordinator_seal_url);
    else coordSeal = cleanUrl(coordAuth.seal_url) || cleanUrl(c && c.coordinator_seal_url) || cleanUrl(data && data.coordSeal) || SEALS.coordinatorSeal;

    let coordSign = '';
    if (isCustom(coordAuth.signature_url)) coordSign = cleanUrl(coordAuth.signature_url);
    else if (isCustom(c && c.coordinator_signature_url)) coordSign = cleanUrl(c.coordinator_signature_url);
    else coordSign = cleanUrl(coordAuth.signature_url) || cleanUrl(c && c.coordinator_signature_url) || cleanUrl(data && data.coordSign) || SEALS.coordinatorSign;

    // Council / Head Office Assets (Strictly isolated from centre's uploaded logo)
    const councilLogo = cleanUrl(
      (data && (data.council_logo_url || data.councilLogo)) ||
      (hoAuth && hoAuth.logo_url) ||
      (data && data.head_office && data.head_office.logo_url) ||
      (c && c.head_office && c.head_office.logo_url) ||
      (c && (c.council_logo_url || c.council_logo)) ||
      (typeof window !== 'undefined' && window._councilAuthorities && window._councilAuthorities.head_office && window._councilAuthorities.head_office.logo_url) ||
      SEALS.councilLogo
    ) || '/assets/img/logo_council.svg';
    const councilSeal = cleanUrl((data && (data.council_seal_url || data.councilSeal)) || (c && (c.council_seal_url || c.councilSeal)) || hoAuth.seal_url || (data && data.head_office && data.head_office.seal_url) || (c && c.head_office && c.head_office.seal_url) || SEALS.councilSeal) || '/assets/img/seal_council_head.svg';
    const councilSign = cleanUrl((data && (data.council_signature_url || data.councilSign)) || (c && (c.council_signature_url || c.councilSign)) || hoAuth.signature_url || (data && data.head_office && data.head_office.signature_url) || (c && c.head_office && c.head_office.signature_url) || SEALS.councilSign) || '/assets/img/sign_council_head.svg';
    const chairmanSign = cleanUrl(hoAuth.chairman_signature_url || councilSign);

    const hoName = hoAuth.name || 'Executive Director & Controller of Examinations';
    const coordName = coordAuth.name || (c && c.coordinator_name) || 'Regional Coordinator';
    const directorName = (c && (c.director_name || c.name)) || centreAuth.director_name || 'Centre Director';

    return { centreSeal, centreSign, centreLogo, coordSeal, coordSign, councilLogo, councilSeal, councilSign, chairmanSign, hoName, coordName, directorName };
  }

  // Helper to ensure Hindi and English institute names are cleanly distinct (no duplicate English)
  function resolveCentreNames(c, data) {
    const rawEng = (data && data.centre_name) || (c && c.name) || 'PURVANCHAL EDUCATION CENTRE';
    const centreEnglish = String(rawEng).trim().toUpperCase();
    let rawHi = (data && data.centre_name_hi) || (c && c.hindi_name) || '';
    let centreHindi = String(rawHi).trim();
    if (!centreHindi || centreHindi.toUpperCase() === centreEnglish) {
      centreHindi = 'प्रशिक्षण एवं कौशल संस्थान';
    }
    return { centreEnglish, centreHindi };
  }

  // 1. Accreditations Badge Strip + Official Dual Address Footer (Council Head Office + Centre Office)
  function renderAccreditationBadgesHtml(councilAddress, centreAddress) {
    const hoAddr = councilAddress || 'Purvanchal Education & Skill Council, Main Road, Shahgarh, Azamgarh, Uttar Pradesh - 276139 | Helpline: info@pescouncil.in | Web: pescouncil.in';
    const cAddr = centreAddress || '';
    return `
      <!-- Dual Address Official Footer -->
      <div style="margin-top:14px; padding:7px 12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-size:0.68rem; line-height:1.4; color:#334155; text-align:left;">
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div style="flex:1; min-width:240px;">
            <b style="color:#08244c; display:flex; align-items:center; gap:4px;">🏛️ Head Office Address:</b>
            <span>${esc(hoAddr)}</span>
          </div>
          ${cAddr ? `
          <div style="flex:1; min-width:240px; border-left:1px dashed #cbd5e1; padding-left:12px;">
            <b style="color:#047857; display:flex; align-items:center; gap:4px;">🏫 Study Centre Office:</b>
            <span>${esc(cAddr)}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div style="display:flex; justify-content:center; align-items:center; gap:14px; margin-top:8px; padding-top:6px; border-top:1px solid #e2e8f0; flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #0369a1; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.58rem; color:#0369a1; background:#f0f9ff;">ISO</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:1px;">9001:2015</div>
        </div>
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #047857; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.55rem; color:#047857; background:#ecfdf5;">NITI</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:1px;">Aayog</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:3px 8px; border:1.5px solid #b45309; border-radius:4px; font-weight:900; font-size:0.52rem; color:#b45309; background:#fffbeb;">NGO DARPAN</div>
          <div style="font-size:0.48rem; font-weight:800; color:#475569; margin-top:1px;">Govt. of India</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:3px 8px; border:1.5px solid #1e3a8a; border-radius:4px; font-weight:900; font-size:0.52rem; color:#1e3a8a; background:#eff6ff;">IAF MEMBER</div>
          <div style="font-size:0.48rem; font-weight:800; color:#475569; margin-top:1px;">Accredited</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:3px 8px; border:1.5px solid #7c2d12; border-radius:4px; font-weight:900; font-size:0.52rem; color:#7c2d12; background:#fef2f2;">MSME</div>
          <div style="font-size:0.48rem; font-weight:800; color:#475569; margin-top:1px;">Govt. of India</div>
        </div>
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #d4af37; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.55rem; color:#854d0e; background:#fefce8;">PESC</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:1px;">Autonomous</div>
        </div>
      </div>
    `;
  }

  // 2. Section Header Ribbon for Admission Form
  function renderAdmissionRibbon(title) {
    return `
      <div style="text-align:center; margin:8px 0 6px;">
        <svg viewBox="0 0 320 28" width="300" height="28" style="display:inline-block; max-width:100%;">
          <polygon points="14,0 306,0 320,14 306,28 14,28 0,14" fill="#08244c" stroke="#d4af37" stroke-width="1.5"/>
          <text x="160" y="19" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">${esc(title)}</text>
        </svg>
      </div>
    `;
  }

  // 3. Golden 3D Ribbon Banner for Marksheet and Certificate
  function render3DGoldRibbon(mainTitle, subTitle) {
    return `
      <div style="text-align:center; margin:4px auto 10px; max-width:480px; width:100%;">
        <svg viewBox="0 0 500 70" width="100%" height="70" style="display:block; margin:0 auto;">
          <defs>
            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#b45309"/>
              <stop offset="12%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="88%" stop-color="#fef08a"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <!-- Left Tail -->
          <polygon points="45,26 0,16 22,42 0,68 45,58" fill="#92400e" stroke="#78350f" stroke-width="1.5"/>
          <polygon points="45,26 45,58 75,58" fill="#78350f"/>
          <!-- Right Tail -->
          <polygon points="455,26 500,16 478,42 500,68 455,58" fill="#92400e" stroke="#78350f" stroke-width="1.5"/>
          <polygon points="455,26 455,58 425,58" fill="#78350f"/>
          <!-- Main Body -->
          <rect x="50" y="12" width="400" height="48" rx="6" fill="url(#goldRibbonGrad)" stroke="#78350f" stroke-width="2"/>
          <text x="250" y="36" font-family="'Rozha One', 'Georgia', serif" font-size="22" font-weight="900" fill="#08244c" text-anchor="middle" letter-spacing="3">${esc(mainTitle)}</text>
          <text x="250" y="51" font-family="'Inter', sans-serif" font-size="10.5" font-weight="900" fill="#08244c" text-anchor="middle" letter-spacing="2">${esc(subTitle)}</text>
        </svg>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 1: ADMISSION FORM (media_1793022501809.jpg)
  // =========================================================================
  function renderAdmissionFormHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const formNo = data.formNo || `PIT-ADM-2026-${String(s.id || '0001').padStart(4, '0')}`;
    const regNo = data.regNo || 'TRUST/2025/5/IV/299';
    const subDate = data.submissionDate || new Date(s.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const centreHindi = c.hindi_name || c.name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी';
    const centreEnglish = (c.name || 'PREETI INSTITUTE OF TECHNOLOGY').toUpperCase();
    const centreCode = c.centre_code || 'PESC00001';

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:35px; font-size:0.65rem; font-weight:800; color:#64748b; line-height:1.3; text-transform:uppercase;">PASTE<br>PHOTOGRAPH<br>HERE</div>`;

    const isMale = !s.gender || s.gender.toLowerCase() === 'male';
    const isFemale = s.gender && s.gender.toLowerCase() === 'female';
    const cat = s.category || 'Gen';
    const durationStr = s.duration_months ? `${Math.round(s.duration_months/12) || 1} Year` : '1 Year';

    const quals = s.academic_qualifications || {};
    const q10 = quals.tenth || quals['10th'] || { board: 'State Board / CBSE', year: '2020', marks: '420/500', pct: '84.0%' };
    const q12 = quals.twelfth || quals['12th'] || { board: 'State Board / UP Board', year: '2022', marks: '395/500', pct: '79.0%' };
    const qGrad = quals.graduation || { board: 'University', year: '2025', marks: '1150/1500', pct: '76.6%' };

    const { centreSeal, centreSign, centreLogo, coordSeal, coordSign, councilLogo, councilSeal, councilSign, chairmanSign, hoName, coordName, directorName } = resolveSeals(data, c);

    return `
      <div class="official-admission-form printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #08244c; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${centreLogo ? `<img src="${centreLogo}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilLogo}" style="width:100%; height:100%; object-fit:contain;">`}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:2rem; font-weight:900; color:#08244c; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(centreHindi)}
              </div>
              <div style="font-size:1.3rem; font-weight:900; color:#08244c; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
                ${esc(centreEnglish)}
              </div>
              <div style="display:inline-block; background:#fef08a; color:#854d0e; font-size:0.68rem; font-weight:800; padding:2px 14px; border-radius:12px; border:1px solid #fde047; text-transform:uppercase; margin:3px 0; letter-spacing:0.5px;">
                RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
              </div>
              <div style="font-size:0.65rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.3px;">
                RECOGNIZED BY GOVERNMENT OF INDIA | AN ISO 9001:2015 CERTIFIED CENTRE
              </div>
            </div>

            <!-- Right: Accreditation Badge (NO Ashok Stambh) -->
            <div style="width:85px; text-align:center; flex-shrink:0;">
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15); overflow:hidden;">
                <img src="${councilLogo}" style="width:36px; height:36px; object-fit:contain;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#08244c; margin-top:3px;">NITI Aayog</div>
              <div style="font-size:0.52rem; font-weight:800; color:#475569;">NGO DARPAN</div>
              <div style="font-size:0.5rem; color:#64748b;">Registered Org.</div>
            </div>
          </div>

          <!-- Banner Bar -->
          <div style="background:linear-gradient(135deg, #08244c 0%, #0c4a6e 50%, #08244c 100%); color:#ffffff; text-align:center; font-weight:900; font-size:1.05rem; padding:6px 12px; border-radius:4px; letter-spacing:1.5px; margin:6px 0 8px; border:1.5px solid #d4af37; text-transform:uppercase;">
            ADMISSION FORM / ADMISSION APPLICATION FORM
          </div>

          <!-- Metadata Line -->
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:8px; border-bottom:1.5px solid #08244c; padding-bottom:4px;">
            <div>
              <span>Form No: <b>${esc(formNo)}</b></span>
              <span style="margin-left:14px;">Reg. No. (Council): <b>${esc(regNo)}</b></span>
            </div>
            <div>
              Date of Submission: <span style="border-bottom:1px solid #0f172a; padding:0 8px;">${esc(subDate)}</span>
            </div>
          </div>

          <!-- Main Layout: Left Details + Right Photo -->
          <div style="display:flex; gap:16px; align-items:flex-start;">
            <div style="flex:1;">
              ${renderAdmissionRibbon('PERSONAL DETAILS')}
              <div style="font-size:0.84rem; line-height:1.75; color:#0f172a;">
                <div>
                  Full Name (In Block Letters): <b style="font-size:0.95rem; color:#08244c; text-transform:uppercase; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.name || '')}</b>
                </div>
                <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
                  <span>Gender: [${isMale ? '✓' : '&nbsp;'}] Male &nbsp; [${isFemale ? '✓' : '&nbsp;'}] Female</span>
                  <span>| &nbsp; Date of Birth: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(s.dob || 'DD/MM/YYYY')}</b></span>
                </div>
                <div>
                  Father's/Husband's Name: <b style="border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.father_name || 'N/A')}</b>
                </div>
                <div>
                  Mother's Name: <b style="border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.mother_name || 'N/A')}</b>
                </div>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                  <span>Category: [${cat==='Gen'?'✓':'&nbsp;'}] Gen &nbsp; [${cat==='OBC'?'✓':'&nbsp;'}] OBC &nbsp; [${cat==='SC'?'✓':'&nbsp;'}] SC &nbsp; [${cat==='ST'?'✓':'&nbsp;'}] ST</span>
                  <span>| &nbsp; Blood Group: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(s.blood_group || 'O+')}</b></span>
                </div>
              </div>
            </div>

            <!-- Right: Photo Box -->
            <div style="width:110px; flex-shrink:0; text-align:center;">
              <div style="width:105px; height:130px; border:2px solid #08244c; border-radius:4px; overflow:hidden; background:#f8fafc; margin:0 auto; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                ${photoHtml}
              </div>
              <div style="font-size:0.58rem; font-weight:800; color:#08244c; margin-top:3px; letter-spacing:0.5px;">PESC VERIFIED</div>
            </div>
          </div>

          <!-- Section: COURSE DETAILS -->
          ${renderAdmissionRibbon('COURSE DETAILS')}
          <div style="font-size:0.84rem; line-height:1.75; color:#0f172a;">
            <div>Course Applied For: <b style="font-size:1rem; color:#08244c; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.course_name || s.course || 'Nursery Teacher Training')}</b></div>
            <div style="display:flex; gap:16px;">
              <span>Course Duration: [✓] ${esc(durationStr)}</span>
              <span>&nbsp; [ ] Other</span>
            </div>
            <div>Study Centre Name: <b style="color:#0f172a; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(c.name || centreEnglish)} (${esc(centreCode)})</b></div>
          </div>

          <!-- Section: CONTACT & COMMUNICATION DETAILS -->
          ${renderAdmissionRibbon('CONTACT & COMMUNICATION DETAILS')}
          <div style="font-size:0.84rem; line-height:1.75; color:#0f172a;">
            <div>Permanent Address: <span style="border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.address || s.local_address || 'Village & Post Shahgarh, Azamgarh, Uttar Pradesh')}</span></div>
            <div style="display:flex; gap:14px; flex-wrap:wrap;">
              <span>City/Village: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(s.village || c.district || 'Shahgarh')}</b></span>
              <span>District: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(c.district || 'Azamgarh')}</b></span>
              <span>State: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(c.state || 'Uttar Pradesh')}</b></span>
              <span>PIN: <b style="border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(s.pin || c.pin || '276001')}</b></span>
            </div>
            <div style="display:flex; gap:20px; flex-wrap:wrap;">
              <span>Mobile No.: <b style="border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.mobile || s.student_whatsapp || '+91 98765 43210')}</b></span>
              <span>Email ID: <span style="border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.email || 'candidate@student.pescouncil.in')}</span></span>
            </div>
          </div>

          <!-- Section: EDUCATIONAL QUALIFICATION -->
          ${renderAdmissionRibbon('EDUCATIONAL QUALIFICATION')}
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:center; border:1.5px solid #08244c; margin-bottom:8px;">
            <thead>
              <tr style="background:#08244c; color:#ffffff; font-weight:900;">
                <th style="padding:5px 6px; border:1px solid #cbd5e1; width:22%;">Exam Passed</th>
                <th style="padding:5px 6px; border:1px solid #cbd5e1; width:34%;">Board/University</th>
                <th style="padding:5px 6px; border:1px solid #cbd5e1; width:16%;">Passing Year</th>
                <th style="padding:5px 6px; border:1px solid #cbd5e1; width:14%;">Marks Obt.</th>
                <th style="padding:5px 6px; border:1px solid #cbd5e1; width:14%;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">High School (10<sup>th</sup>)</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q10.board || 'State Board / CBSE')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q10.year || '2020')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q10.marks || '420/500')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">${esc(q10.pct || '84.0%')}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">Intermediate (12<sup>th</sup>)</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q12.board || 'State Board / UP Board')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q12.year || '2022')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(q12.marks || '395/500')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">${esc(q12.pct || '79.0%')}</td>
              </tr>
              <tr>
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">Graduation</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(qGrad.board || 'VBSPU / University')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(qGrad.year || '2025')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">${esc(qGrad.marks || '1150/1500')}</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">${esc(qGrad.pct || '76.6%')}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:5px 6px; border:1px solid #94a3b8; font-weight:700;">Others</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">-</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">-</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">-</td>
                <td style="padding:5px 6px; border:1px solid #94a3b8;">-</td>
              </tr>
            </tbody>
          </table>

          <!-- Section: DECLARATION BY THE APPLICANT -->
          ${renderAdmissionRibbon('DECLARATION BY THE APPLICANT')}
          <div style="font-size:0.74rem; color:#334155; line-height:1.45; text-align:justify; margin-bottom:12px;">
            I hereby declare that all the information provided above is true and correct to the best of my knowledge, and I understand that any false statement may lead to the rejection of my application.
          </div>

          <!-- 3 Stamps & Signatures Row (Applicant, Centre/Coordinator, Council) -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px; padding:0 8px;">
            <div style="text-align:center; width:180px;">
              <div style="height:48px; display:flex; align-items:flex-end; justify-content:center;">
                <div style="font-family:'Brush Script MT', cursive; font-size:1.4rem; color:#08244c;">${esc(s.name || 'Applicant')}</div>
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.78rem; font-weight:800; color:#0f172a;">
                Signature of Applicant
              </div>
            </div>

            <div style="text-align:center; width:220px;">
              <div style="height:65px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:64px; height:64px; position:absolute; opacity:0.85; filter:drop-shadow(0 1px 3px rgba(0,0,0,0.15));">
                <img src="${coordSign}" style="width:85px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.78rem; font-weight:800; color:#0f172a;">
                Authorised Signatory / Coordinator
              </div>
            </div>

            <div style="text-align:center; width:200px;">
              <div style="height:65px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:64px; height:64px; position:absolute; opacity:0.85; filter:drop-shadow(0 1px 3px rgba(0,0,0,0.15));">
                <img src="${councilSign}" style="width:85px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.78rem; font-weight:800; color:#0f172a;">
                Signature of Council
              </div>
            </div>
          </div>

          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 2: CERTIFICATE OF COMPLETION (media_1793022505568.jpg)
  // =========================================================================
  function renderCertificateHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const certNo = data.certNo || s.cert_no || `PESC-CERT-2026-${String(s.id || '0007').padStart(4, '0')}`;
    const regNoCouncil = data.regNoCouncil || 'TRUST/2025/5/IV/299';
    const studentRegNo = s.student_code || `PESC-26-${String(s.id || '00008').padStart(5, '0')}`;
    const rollNo = s.roll_no || `Pesc-${String(s.id || '00008').padStart(5, '0')}`;
    const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const { centreEnglish, centreHindi } = resolveCentreNames(c, data);
    const centreCode = c.centre_code || 'PESC00001';
    const courseName = s.course_name || s.course || 'Nursery Teacher Training';
    const percentage = data.percentage || s.percentage || '74.57';
    const grade = data.grade || s.grade || 'A';
    const duration = data.duration || (s.duration_months ? `${Math.round(s.duration_months/12) || 1} Year` : '1 Year');
    const examVenue = data.examVenue || c.address || `${c.district || 'Shahgarh'}, Uttar Pradesh`;
    const fromDate = data.fromDate || '01-09-2025';
    const toDate = data.toDate || '12-09-2026';

    const headerType = String(data.header_type || (data.headerMode || (data.format === 'council' ? 'council' : 'centre'))).toLowerCase();
    const isCouncilHeader = (headerType === 'council' || data.format === 'council' || data.design_format === 'council');

    const displayHindi = (data.header_hindi || '').trim() || (isCouncilHeader ? 'पूर्वांचल शिक्षा एवं कौशल परिषद' : centreHindi);
    const displayEnglish = (data.header_title || '').trim() || (isCouncilHeader ? 'PURVANCHAL EDUCATION & SKILL COUNCIL' : centreEnglish);
    const displaySubtitle = (data.header_subtitle || '').trim() || (isCouncilHeader 
      ? 'AUTONOMOUS NATIONAL COUNCIL FOR VOCATIONAL & TECHNICAL EDUCATION' 
      : 'RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD');
    const subTagline = isCouncilHeader 
      ? `RUN UNDER TRUST ACT REG. GOVT. OF INDIA | AN ISO 9001:2015 CERTIFIED COUNCIL<div style="font-size:0.75rem; font-weight:800; color:#047857; margin-top:3px;">Authorised Training Centre: <u>${esc(centreEnglish)}</u> (${esc(centreHindi)}) &bull; Centre Code: <b>${esc(centreCode)}</b></div>`
      : `RECOGNIZED BY GOVERNMENT OF INDIA | AN ISO 9001:2015 CERTIFIED CENTRE &bull; Centre Code: ${esc(centreCode)}`;

    const scheme = String(data.scheme || (data.evaluation_type === 'semester' ? 'single_semester' : (data.term && data.term.toLowerCase().includes('semester') ? 'single_semester' : 'annual'))).toLowerCase();
    let certMainTitle = 'CERTIFICATE';
    let certSubTitle = 'OF COMPLETION';
    let certHindiBadge = '(प्रमाण पत्र)';
    if (scheme === 'single_semester' || scheme.includes('single')) {
      certMainTitle = 'CERTIFICATE';
      certSubTitle = 'OF PROFICIENCY (SEMESTER)';
      certHindiBadge = '(एकल सेमेस्टर योग्यता प्रमाण पत्र)';
    } else if (scheme === 'double_semester' || scheme.includes('double') || scheme.includes('dual')) {
      certMainTitle = 'DIPLOMA';
      certSubTitle = 'CERTIFICATE (TWO SEMESTERS)';
      certHindiBadge = '(द्वि-सेमेस्टर डिप्लोमा प्रमाण पत्र)';
    } else {
      certMainTitle = 'CERTIFICATE';
      certSubTitle = 'OF DIPLOMA / COMPLETION';
      certHindiBadge = '(वार्षिक डिप्लोमा / प्रमाण पत्र)';
    }

    const councilAddress = data.council_address || 'Purvanchal Education & Skill Council, Main Road, Shahgarh, Azamgarh, Uttar Pradesh - 276139 | Helpline: info@pescouncil.in | Web: pescouncil.in';
    const centreAddress = data.centre_address || (c.address ? `${c.address}, ${c.district || ''}, ${c.state || ''} - ${c.pin || ''}` : `${c.district || 'Azamgarh'}, ${c.state || 'Uttar Pradesh'}`);

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:25px; font-size:0.6rem; font-weight:800; color:#64748b;">PHOTO</div>`;

    const { centreSeal, centreSign, centreLogo, coordSeal, coordSign, councilLogo, councilSeal, councilSign, chairmanSign, hoName, coordName, directorName } = resolveSeals(data, c);

    return `
      <div class="official-certificate printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #08244c; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo or Council Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${isCouncilHeader 
                ? `<img src="${councilLogo}" style="width:100%; height:100%; object-fit:contain;">`
                : (centreLogo ? `<img src="${centreLogo}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilLogo}" style="width:100%; height:100%; object-fit:contain;">`)}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:1.85rem; font-weight:900; color:#08244c; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(displayHindi)}
              </div>
              <div style="font-size:1.25rem; font-weight:900; color:#08244c; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
                ${esc(displayEnglish)}
              </div>
              <div style="display:inline-block; background:#fef08a; color:#854d0e; font-size:0.68rem; font-weight:800; padding:2px 14px; border-radius:12px; border:1px solid #fde047; text-transform:uppercase; margin:3px 0; letter-spacing:0.5px;">
                ${esc(displaySubtitle)}
              </div>
              <div style="font-size:0.65rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.3px;">
                ${subTagline}
              </div>
            </div>

            <!-- Right: Accreditation Badge (NO Ashok Stambh) -->
            <div style="width:85px; text-align:center; flex-shrink:0;">
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15); overflow:hidden;">
                <img src="${councilLogo}" style="width:36px; height:36px; object-fit:contain;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#08244c; margin-top:3px;">NITI Aayog</div>
              <div style="font-size:0.52rem; font-weight:800; color:#475569;">NGO DARPAN</div>
              <div style="font-size:0.5rem; color:#64748b;">Registered Org.</div>
            </div>
          </div>

          <!-- Reference & Date Line -->
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:800; color:#0f172a; margin:8px 0 12px; line-height:1.6;">
            <div>
              <div>REGD. NO. (COUNCIL): <span style="font-family:monospace;">${esc(regNoCouncil)}</span></div>
              <div>Student Reg. No.: <span style="font-family:monospace; color:#0284c7;">${esc(studentRegNo)}</span></div>
              <div>Roll Number: <span style="font-family:monospace;">${esc(rollNo)}</span></div>
            </div>
            <div style="display:flex; gap:16px; align-items:flex-start;">
              <div style="text-align:right;">
                <div>Ref No.: <span style="font-family:monospace;">${esc(certNo)}</span></div>
                <div>Date of Issue: <span style="border-bottom:1px solid #0f172a; padding:0 6px;">${esc(issueDate)}</span></div>
              </div>
              <div style="width:82px; height:98px; border:2px solid #08244c; border-radius:4px; overflow:hidden; background:#f8fafc; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                ${photoHtml}
              </div>
            </div>
          </div>

          <!-- 3D Golden Ribbon: CERTIFICATE -->
          ${render3DGoldRibbon(certMainTitle, certSubTitle)}
          <div style="text-align:center; font-size:0.85rem; color:#854d0e; font-weight:800; margin:-4px 0 10px;">
            ${certHindiBadge}
          </div>

          <!-- Certificate Body -->
          <div style="text-align:center; font-size:0.92rem; color:#0f172a; line-height:2.2; margin:10px auto;">
            <div style="font-weight:800; color:#08244c; letter-spacing:1px; font-size:0.95rem;">THIS IS TO CERTIFY THAT</div>
            <div style="font-size:1.05rem;">
              MR. / MRS. &nbsp;<span style="font-family:'Brush Script MT', 'Dancing Script', cursive; font-size:2.1rem; font-weight:900; color:#08244c; border-bottom:1.5px solid #334155; padding:0 30px; display:inline-block;">${esc(s.name || 'Preeti')}</span>
            </div>
            <div>
              S/O / D/O / W/O : &nbsp;<span style="font-weight:800; border-bottom:1.5px solid #334155; padding:0 24px;">${esc(s.father_name || 'Ram')}</span>
            </div>
            <div>
              MOTHER'S NAME : &nbsp;<span style="font-weight:800; border-bottom:1.5px solid #334155; padding:0 24px;">${esc(s.mother_name || 'Geeta')}</span>
            </div>
            <div style="font-size:0.78rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px;">
              HAS SUCCESSFULLY CLEARED THE ASSESSMENT IN THE JOB ROLE / COURSE
            </div>
            <div style="font-size:1.55rem; font-weight:900; color:#08244c; font-family:'Georgia', serif; margin:2px 0;">
              ${esc(courseName)}
            </div>
            <div>
              WITH &nbsp;<b style="border-bottom:1.5px solid #334155; padding:0 12px; font-size:1.05rem; color:#08244c;">${esc(percentage)}</b> % MARKS HELD IN &nbsp;<span style="border-bottom:1.5px solid #334155; padding:0 16px;">${esc(examVenue)}</span>
            </div>
            <div>
              WITH GRADE &nbsp;<b style="border-bottom:1.5px solid #334155; padding:0 16px; font-size:1.15rem; color:#15803d;">${esc(grade)}</b> &nbsp; FROM OUR AUTHORIZED STUDY CENTRE
            </div>
            <div style="font-size:1.3rem; font-weight:900; color:#08244c; text-transform:uppercase; margin:4px 0;">
              ${esc(centreEnglish)}
            </div>
            <div style="font-size:0.75rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.4px;">
              HE / SHE HAS BEEN AWARDED WITH THE CERTIFICATE / DIPLOMA OF SAID JOB ROLE / COURSE
            </div>
            <div style="font-weight:800;">
              COURSE DURATION : &nbsp;<span style="border-bottom:1.5px solid #334155; padding:0 16px;">${esc(duration)}</span>
            </div>
            <div style="font-size:0.86rem;">
              FROM &nbsp;<span style="border-bottom:1.5px solid #334155; padding:0 12px; font-weight:700;">${esc(fromDate)}</span> &nbsp;&nbsp; TO &nbsp;&nbsp; <span style="border-bottom:1.5px solid #334155; padding:0 12px; font-weight:700;">${esc(toDate)}</span>
            </div>
          </div>

          <!-- Bottom Row: 3 Stamps + QR Code -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:14px; padding:0 6px;">
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${councilSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Head Office
              </div>
            </div>

            <div style="text-align:center; width:170px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${centreSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${centreSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp of<br>Center / Centre Head
              </div>
            </div>

            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${coordSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Coordinator
              </div>
            </div>

            <div style="text-align:center; width:100px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fcertificate%2F${encodeURIComponent(studentRegNo)}" style="width:65px; height:65px; display:block; margin:0 auto; border:1px solid #08244c; padding:2px; background:#fff;">
              <div style="font-size:0.56rem; font-weight:800; color:#08244c; margin-top:3px; line-height:1.2;">
                Verify Certificate<br>Scan QR Code
              </div>
            </div>
          </div>

          ${renderAccreditationBadgesHtml(councilAddress, centreAddress)}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 3: MARKSHEET / STATEMENT OF MARKS (media_1793022512184.jpg)
  // =========================================================================
  function renderMarksheetHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const mrkNo = data.mrkNo || s.marksheet_no || `PESC-MARKS-2026-${String(s.id || '0007').padStart(4, '0')}`;
    const studentRegNo = s.student_code || `PESC-26-${String(s.id || '00008').padStart(5, '0')}`;
    const rollNo = s.roll_no || `Pesc-${String(s.id || '00008').padStart(5, '0')}`;
    const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const { centreEnglish, centreHindi } = resolveCentreNames(c, data);
    const centreCode = c.centre_code || 'PESC00001';
    const courseName = s.course_name || s.course || 'Nursery Teacher Training';
    const duration = data.duration || (s.duration_months ? `${Math.round(s.duration_months/12) || 1} Year` : '1 Year');

    const headerType = String(data.header_type || (data.headerMode || (data.format === 'council' ? 'council' : 'centre'))).toLowerCase();
    const isCouncilHeader = (headerType === 'council' || data.format === 'council' || data.design_format === 'council');

    const displayHindi = (data.header_hindi || '').trim() || (isCouncilHeader ? 'पूर्वांचल शिक्षा एवं कौशल परिषद' : centreHindi);
    const displayEnglish = (data.header_title || '').trim() || (isCouncilHeader ? 'PURVANCHAL EDUCATION & SKILL COUNCIL' : centreEnglish);
    const displaySubtitle = (data.header_subtitle || '').trim() || (isCouncilHeader 
      ? 'AUTONOMOUS NATIONAL COUNCIL FOR VOCATIONAL & TECHNICAL EDUCATION' 
      : 'RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD');
    const subTagline = isCouncilHeader 
      ? `RUN UNDER TRUST ACT REG. GOVT. OF INDIA | AN ISO 9001:2015 CERTIFIED COUNCIL<div style="font-size:0.75rem; font-weight:800; color:#047857; margin-top:3px;">Authorised Training Centre: <u>${esc(centreEnglish)}</u> (${esc(centreHindi)}) &bull; Centre Code: <b>${esc(centreCode)}</b></div>`
      : `RECOGNIZED BY GOVERNMENT OF INDIA | AN ISO 9001:2015 CERTIFIED CENTRE &bull; Centre Code: ${esc(centreCode)}`;

    const scheme = String(data.scheme || (data.evaluation_type === 'semester' ? 'single_semester' : (data.term && data.term.toLowerCase().includes('semester') ? 'single_semester' : 'annual'))).toLowerCase();
    let mrkMainTitle = 'MARKSHEET';
    let mrkSubTitle = 'STATEMENT OF MARKS';
    let mrkHindiBadge = '(अंक तालिका)';
    if (scheme === 'single_semester' || scheme.includes('single')) {
      mrkMainTitle = 'MARKSHEET';
      mrkSubTitle = 'SINGLE SEMESTER EXAMINATION';
      mrkHindiBadge = '(एकल सेमेस्टर अंक तालिका)';
    } else if (scheme === 'double_semester' || scheme.includes('double') || scheme.includes('dual')) {
      mrkMainTitle = 'MARKSHEET';
      mrkSubTitle = 'DUAL SEMESTER (SEMESTER I & II COMBINED)';
      mrkHindiBadge = '(द्वि-सेमेस्टर संयुक्त अंक तालिका)';
    } else {
      mrkMainTitle = 'MARKSHEET';
      mrkSubTitle = 'STATEMENT OF MARKS (ANNUAL)';
      mrkHindiBadge = '(वार्षिक अंक तालिका)';
    }

    const councilAddress = data.council_address || 'Purvanchal Education & Skill Council, Main Road, Shahgarh, Azamgarh, Uttar Pradesh - 276139 | Helpline: info@pescouncil.in | Web: pescouncil.in';
    const centreAddress = data.centre_address || (c.address ? `${c.address}, ${c.district || ''}, ${c.state || ''} - ${c.pin || ''}` : `${c.district || 'Azamgarh'}, ${c.state || 'Uttar Pradesh'}`);

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:25px; font-size:0.6rem; font-weight:800; color:#64748b;">PHOTO</div>`;

    let rawSubjects = data.subjects;
    if (typeof rawSubjects === 'string') {
      try { rawSubjects = JSON.parse(rawSubjects); } catch (_) { rawSubjects = null; }
    }
    if (!Array.isArray(rawSubjects) || rawSubjects.length === 0) {
      const cUpper = String(courseName || '').toUpperCase();
      if (cUpper.includes('ADCA')) {
        rawSubjects = [
          { code: 'ADCA-01', name: 'Information Technology & Operating Systems', max: 100, min: 40, obt: 82, grade: 'A+' },
          { code: 'ADCA-02', name: 'Office Automation & Advanced Excel', max: 100, min: 40, obt: 79, grade: 'A' },
          { code: 'ADCA-03', name: 'Financial Accounting & Tally Prime GST', max: 100, min: 40, obt: 88, grade: 'A+' },
          { code: 'ADCA-04', name: 'DTP, Photoshop & Graphic Designing', max: 100, min: 40, obt: 76, grade: 'A' },
          { code: 'ADCA-05', name: 'Web Designing Concepts & Internet', max: 100, min: 40, obt: 84, grade: 'A+' },
          { code: 'ADCA-06', name: 'Practical Assessment & Lab Project', max: 100, min: 40, obt: 90, grade: 'A+' }
        ];
      } else if (cUpper.includes('DCA')) {
        rawSubjects = [
          { code: 'DCA-01', name: 'Information Technology & MS Windows', max: 100, min: 40, obt: 80, grade: 'A' },
          { code: 'DCA-02', name: 'Office Automation (Word, Excel, PowerPoint)', max: 100, min: 40, obt: 75, grade: 'A' },
          { code: 'DCA-03', name: 'Financial Accounting with Tally', max: 100, min: 40, obt: 83, grade: 'A+' },
          { code: 'DCA-04', name: 'Internet Applications & Cyber Ethics', max: 100, min: 40, obt: 78, grade: 'A' },
          { code: 'DCA-05', name: 'Practical Lab Work & Viva', max: 100, min: 40, obt: 86, grade: 'A+' }
        ];
      } else if (cUpper.includes('PGDCA')) {
        rawSubjects = [
          { code: 'PGDCA-01', name: 'Fundamentals of Computer & IT', max: 100, min: 40, obt: 81, grade: 'A' },
          { code: 'PGDCA-02', name: 'Programming Concepts & C/C++', max: 100, min: 40, obt: 77, grade: 'A' },
          { code: 'PGDCA-03', name: 'Database Management Systems (RDBMS)', max: 100, min: 40, obt: 85, grade: 'A+' },
          { code: 'PGDCA-04', name: 'Web Technologies & Scripting', max: 100, min: 40, obt: 82, grade: 'A+' },
          { code: 'PGDCA-05', name: 'Software Engineering & Project', max: 100, min: 40, obt: 89, grade: 'A+' }
        ];
      } else if (cUpper.includes('YOGA')) {
        rawSubjects = [
          { code: 'DY-01', name: 'Foundations and History of Yoga', max: 100, min: 40, obt: 84, grade: 'A+' },
          { code: 'DY-02', name: 'Anatomy and Physiology for Yogic Practice', max: 100, min: 40, obt: 78, grade: 'A' },
          { code: 'DY-03', name: 'Patanjali Yoga Sutras & Philosophy', max: 100, min: 40, obt: 80, grade: 'A' },
          { code: 'DY-04', name: 'Yogic Diet & Naturopathy', max: 100, min: 40, obt: 86, grade: 'A+' },
          { code: 'DY-05', name: 'Practical Asana, Pranayama & Viva', max: 100, min: 40, obt: 91, grade: 'A+' }
        ];
      } else {
        rawSubjects = [
          { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
          { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
          { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 83, grade: 'A+' },
          { code: 'NTT-04', name: 'Arts & Craft', max: 100, min: 40, obt: 85, grade: 'A+' },
          { code: 'NTT-05', name: 'Lesson Plan', max: 100, min: 40, obt: 75, grade: 'A' },
          { code: 'NTT-06', name: 'Practical & Assignment', max: 100, min: 40, obt: 89, grade: 'A+' }
        ];
      }
    }

    const subjects = rawSubjects.map((sub, idx) => {
      if (!sub || typeof sub !== 'object') {
        return { code: `SUB-0${idx+1}`, name: String(sub || `Subject ${idx+1}`), max: 100, min: 40, obt: 75, grade: 'A' };
      }
      const code = sub.code || sub.subject_code || sub.paper_code || `SUB-0${idx+1}`;
      const name = sub.name || sub.subject_name || sub.paper_name || `Subject ${idx+1}`;
      
      let max = sub.max !== undefined ? +sub.max : undefined;
      if (max === undefined && sub.max_marks !== undefined) max = +sub.max_marks;
      if (max === undefined && sub.total_max !== undefined) max = +sub.total_max;
      if (max === undefined && (sub.max_theory !== undefined || sub.max_practical !== undefined)) {
        max = (+sub.max_theory || 0) + (+sub.max_practical || 0);
      }
      if (max === undefined || isNaN(max) || max <= 0) max = 100;

      let obt = sub.obt !== undefined ? +sub.obt : undefined;
      if (obt === undefined && sub.marks_obtained !== undefined) obt = +sub.marks_obtained;
      if (obt === undefined && sub.marks !== undefined) obt = +sub.marks;
      if (obt === undefined && (sub.obt_theory !== undefined || sub.obt_practical !== undefined)) {
        obt = (+sub.obt_theory || 0) + (+sub.obt_practical || 0);
      }
      if (obt === undefined && (sub.theory !== undefined || sub.practical !== undefined)) {
        obt = (+sub.theory || 0) + (+sub.practical || 0);
      }
      if (obt === undefined || isNaN(obt)) obt = Math.round(max * 0.76);

      let min = sub.min !== undefined ? +sub.min : undefined;
      if (min === undefined && sub.min_marks !== undefined) min = +sub.min_marks;
      if (min === undefined || isNaN(min)) min = Math.round(max * 0.33);

      let grade = sub.grade || sub.letter_grade;
      if (!grade) {
        const pct = max > 0 ? (obt / max) * 100 : 0;
        grade = pct >= 85 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : 'D';
      }

      return { code, name, max, min, obt, grade };
    });

    const maxTotal = subjects.reduce((sum, sub) => sum + (+sub.max || 100), 0);
    const obtTotal = subjects.reduce((sum, sub) => sum + (+sub.obt || 0), 0);
    const percentage = maxTotal > 0 ? ((obtTotal / maxTotal) * 100).toFixed(2) : '74.57';
    const finalGrade = percentage >= 85 ? 'A+' : percentage >= 70 ? 'A' : percentage >= 60 ? 'B+' : 'B';
    const resultText = percentage >= 60 ? 'PASSED IN FIRST DIVISION' : 'PASSED IN SECOND DIVISION';

    const { centreSeal, centreSign, centreLogo, coordSeal, coordSign, councilLogo, councilSeal, councilSign, chairmanSign, hoName, coordName, directorName } = resolveSeals(data, c);

    return `
      <div class="official-marksheet printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #08244c; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo or Council Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${isCouncilHeader 
                ? `<img src="${councilLogo}" style="width:100%; height:100%; object-fit:contain;">`
                : (centreLogo ? `<img src="${centreLogo}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilLogo}" style="width:100%; height:100%; object-fit:contain;">`)}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:1.85rem; font-weight:900; color:#08244c; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(displayHindi)}
              </div>
              <div style="font-size:1.25rem; font-weight:900; color:#08244c; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
                ${esc(displayEnglish)}
              </div>
              <div style="display:inline-block; background:#fef08a; color:#854d0e; font-size:0.68rem; font-weight:800; padding:2px 14px; border-radius:12px; border:1px solid #fde047; text-transform:uppercase; margin:3px 0; letter-spacing:0.5px;">
                ${esc(displaySubtitle)}
              </div>
              <div style="font-size:0.65rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.3px;">
                ${subTagline}
              </div>
            </div>

            <!-- Right: Accreditation Badge (NO Ashok Stambh) -->
            <div style="width:85px; text-align:center; flex-shrink:0;">
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15); overflow:hidden;">
                <img src="${councilLogo}" style="width:36px; height:36px; object-fit:contain;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#08244c; margin-top:3px;">NITI Aayog</div>
              <div style="font-size:0.52rem; font-weight:800; color:#475569;">NGO DARPAN</div>
              <div style="font-size:0.5rem; color:#64748b;">Registered Org.</div>
            </div>
          </div>

          <!-- Reference & Date Line -->
          <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:800; color:#0f172a; margin:6px 0 10px; line-height:1.7;">
            <div>
              <div>Student Reg. No.: <span style="font-family:monospace; color:#0284c7;">${esc(studentRegNo)}</span></div>
              <div>Roll Number : <span style="font-family:monospace;">${esc(rollNo)}</span></div>
              <div>MR. /MRS. : <b style="font-size:0.95rem; color:#08244c;">${esc(s.name || 'Preeti')}</b></div>
            </div>
            <div style="display:flex; gap:16px; align-items:flex-start;">
              <div style="text-align:right;">
                <div>Ref No.: <span style="font-family:monospace;">${esc(mrkNo)}</span></div>
                <div>Date of Issue : <span style="border-bottom:1px solid #0f172a; padding:0 6px;">${esc(issueDate)}</span></div>
              </div>
              <div style="width:82px; height:98px; border:2px solid #08244c; border-radius:4px; overflow:hidden; background:#f8fafc; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                ${photoHtml}
              </div>
            </div>
          </div>

          <!-- 3D Golden Ribbon: MARKSHEET -->
          ${render3DGoldRibbon(mrkMainTitle, mrkSubTitle)}
          <div style="text-align:center; font-size:0.85rem; color:#854d0e; font-weight:800; margin:-4px 0 10px;">
            ${mrkHindiBadge}
          </div>

          <!-- Candidate Details & Course Line -->
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.86rem; font-weight:800; color:#0f172a; margin-bottom:8px; line-height:1.6;">
            <div>
              <div>S/O / D/O / W/O : <span>${esc(s.father_name || 'Ram')}</span></div>
              <div>MOTHER'S NAME : <span>${esc(s.mother_name || 'Geeta')}</span></div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:1.15rem; font-weight:900; color:#08244c;">${esc(courseName)}</div>
              <div style="font-size:0.82rem; color:#475569;">Duration : ${esc(duration)}</div>
            </div>
          </div>

          <!-- Marks Table -->
          <table style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:center; border:2px solid #08244c; margin-bottom:6px;">
            <thead>
              <tr style="background:#08244c; color:#ffffff; font-weight:900;">
                <th style="padding:7px 6px; border:1px solid #cbd5e1; width:22%;">Paper Code /<br>Subject Code</th>
                <th style="padding:7px 8px; border:1px solid #cbd5e1; width:38%; text-align:left;">Subject Name</th>
                <th style="padding:7px 6px; border:1px solid #cbd5e1; width:10%;">Max<br>Marks</th>
                <th style="padding:7px 6px; border:1px solid #cbd5e1; width:10%;">Min<br>Marks</th>
                <th style="padding:7px 6px; border:1px solid #cbd5e1; width:10%;">Marks<br>Obtained</th>
                <th style="padding:7px 6px; border:1px solid #cbd5e1; width:10%;">Grade</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map((sub, idx) => `
                <tr style="background:${idx % 2 === 1 ? '#f8fafc' : '#ffffff'};">
                  <td style="padding:6px 6px; border:1px solid #cbd5e1; font-weight:800; font-family:monospace;">${esc(sub.code)}</td>
                  <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:left; font-weight:700;">${esc(sub.name)}</td>
                  <td style="padding:6px 6px; border:1px solid #cbd5e1;">${esc(sub.max)}</td>
                  <td style="padding:6px 6px; border:1px solid #cbd5e1;">${esc(sub.min)}</td>
                  <td style="padding:6px 6px; border:1px solid #cbd5e1; font-weight:900; color:#08244c;">${esc(sub.obt)}</td>
                  <td style="padding:6px 6px; border:1px solid #cbd5e1; font-weight:900; color:#15803d;">${esc(sub.grade)}</td>
                </tr>
              `).join('')}
              <tr style="background:#08244c; color:#ffffff; font-weight:900; font-size:0.92rem;">
                <td colspan="2" style="padding:7px 12px; border:1px solid #08244c; text-align:right; letter-spacing:1px;">GRAND TOTAL:</td>
                <td style="padding:7px 6px; border:1px solid #08244c;">${maxTotal}</td>
                <td style="padding:7px 6px; border:1px solid #08244c;">-</td>
                <td style="padding:7px 6px; border:1px solid #08244c; color:#fde047;">${obtTotal}</td>
                <td style="padding:7px 6px; border:1px solid #08244c; color:#86efac;">${finalGrade}</td>
              </tr>
            </tbody>
          </table>

          <!-- Percentage & Grade Summary Bar -->
          <div style="display:flex; justify-content:space-around; align-items:center; font-size:0.92rem; font-weight:900; color:#08244c; border:1.5px solid #08244c; padding:5px 12px; background:#f0f9ff; margin:6px 0;">
            <div>PERCENTAGE : <span style="color:#0369a1;">${percentage}%</span></div>
            <div>GRADE: <span style="color:#15803d;">${finalGrade}</span></div>
          </div>

          <!-- Result Line -->
          <div style="text-align:center; font-size:1.05rem; font-weight:900; color:#047857; letter-spacing:1px; margin:4px 0 10px;">
            RESULT : ${resultText}
          </div>

          <!-- Bottom Row: 3 Stamps + QR Code -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px; padding:0 6px;">
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${councilSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Head Office
              </div>
            </div>

            <div style="text-align:center; width:170px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${centreSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${centreSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp of<br>Center / Centre Head
              </div>
            </div>

            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${coordSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Coordinator
              </div>
            </div>

            <div style="text-align:center; width:100px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fmarksheet%2F${encodeURIComponent(studentRegNo)}" style="width:65px; height:65px; display:block; margin:0 auto; border:1px solid #08244c; padding:2px; background:#fff;">
              <div style="font-size:0.56rem; font-weight:800; color:#08244c; margin-top:3px; line-height:1.2;">
                Verify Certificate<br>Scan QR Code
              </div>
            </div>
          </div>

          ${renderAccreditationBadgesHtml(councilAddress, centreAddress)}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 4: STUDENT I-CARD (media_1793022486550.jpg)
  // =========================================================================
  function renderStudentIdCardHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const name = s.name || 'Preeti';
    const rollNo = s.roll_no || `Pesc-${String(s.id || '00008').padStart(5, '0')}`;
    const courseName = s.course_name || s.course || 'Nursery Teacher Training';
    const regNo = s.student_code || `PIT-26-${String(s.id || '0008').padStart(4, '0')}`;
    const bloodGroup = s.blood_group || 'O+';
    const validUpto = data.validUpto || 'SEP 2026';

    const centreHindi = c.hindi_name || c.name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी';
    const centreEnglish = (c.name || 'PREETI INSTITUTE OF TECHNOLOGY').toUpperCase();

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:35px; font-size:0.7rem; font-weight:800; color:#64748b;">PHOTO</div>`;

    const { centreSign, centreLogo, councilLogo, councilSeal, councilSign } = resolveSeals(data, c);

    return `
      <div class="official-id-card-wrap" style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap; font-family:'Inter', Arial, sans-serif;">
        <!-- FRONT SIDE -->
        <div class="id-card-front printable-area" style="width:320px; border-radius:16px; overflow:hidden; border:4px solid #08244c; outline:2px solid #d4af37; background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.18); position:relative; box-sizing:border-box;">
          
          <!-- Lanyard Slot Cutout -->
          <div style="width:48px; height:12px; background:#e2e8f0; border-radius:6px; margin:8px auto 4px; border:1px solid #94a3b8;"></div>

          <!-- Top Header -->
          <div style="padding:4px 10px 6px; text-align:center;">
            <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
              <img src="${centreLogo || councilLogo}" style="width:38px; height:38px; flex-shrink:0; object-fit:contain;">
              <div>
                <div style="font-size:0.95rem; font-weight:900; color:#08244c; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.1;">
                  ${esc(centreHindi)}
                </div>
                <div style="font-size:0.65rem; font-weight:900; color:#08244c; text-transform:uppercase; letter-spacing:0.3px;">
                  ${esc(centreEnglish)}
                </div>
              </div>
            </div>
            <div style="font-size:0.48rem; font-weight:800; color:#475569; text-transform:uppercase; margin-top:2px;">
              RECOGNIZED BY GOVERNMENT OF INDIA | AN ISO 9001:2015 CERTIFIED CENTRE
            </div>
          </div>

          <!-- Golden Ribbon Banner: STUDENT I-CARD -->
          <div style="text-align:center; margin:2px 0 6px;">
            <div style="display:inline-block; background:linear-gradient(135deg, #08244c 0%, #0369a1 100%); color:#ffffff; padding:4px 28px; border-radius:18px; border:1.5px solid #d4af37; box-shadow:0 3px 8px rgba(7,42,96,0.3);">
              <div style="font-size:0.92rem; font-weight:900; letter-spacing:1px;">STUDENT I-CARD</div>
            </div>
            <div style="font-size:0.6rem; font-weight:800; color:#08244c; margin-top:2px;">VALID UPTO: <b>${esc(validUpto)}</b></div>
          </div>

          <!-- Photo with Golden Border -->
          <div style="width:96px; height:116px; border:2.5px solid #d4af37; border-radius:6px; overflow:hidden; background:#f8fafc; margin:0 auto 8px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
            ${photoHtml}
          </div>

          <!-- Candidate Details -->
          <div style="font-size:0.74rem; font-weight:800; color:#0f172a; line-height:1.6; padding:0 16px;">
            <div>STUDENT NAME: <b style="color:#08244c; font-size:0.8rem;">${esc(name)}</b></div>
            <div>ROLL NO: <span style="font-family:monospace; color:#0284c7;">${esc(rollNo)}</span></div>
            <div>COURSE : <b style="color:#047857;">${esc(courseName)}</b></div>
            <div>REG. NO : <span style="font-family:monospace;">${esc(regNo)}</span></div>
            <div>BLOOD GROUP: <b>${esc(bloodGroup)}</b></div>
          </div>

          <!-- Signatures & Stamp -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; padding:6px 14px 4px; margin-top:4px;">
            <div style="text-align:center; width:95px;">
              <img src="${centreSign}" style="width:50px; height:24px; display:block; margin:0 auto;">
              <div style="border-top:1px solid #0f172a; font-size:0.5rem; font-weight:800; padding-top:2px;">
                Signature &amp; Stamp of<br>Center / Centre Head
              </div>
            </div>
            <div style="width:40px; text-align:center;">
              <img src="${councilSeal}" style="width:36px; height:36px; opacity:0.9;">
            </div>
            <div style="text-align:center; width:95px;">
              <img src="${councilSign}" style="width:50px; height:24px; display:block; margin:0 auto;">
              <div style="border-top:1px solid #0f172a; font-size:0.5rem; font-weight:800; padding-top:2px;">
                Signature of Council
              </div>
            </div>
          </div>

          <!-- Bottom Navy Brand Bar -->
          <div style="background:#08244c; color:#ffffff; text-align:center; font-size:0.65rem; font-weight:900; padding:4px 6px; text-transform:uppercase; letter-spacing:0.5px;">
            ${esc(centreEnglish)}
          </div>
        </div>

        <!-- BACK SIDE -->
        <div class="id-card-back printable-area" style="width:320px; border-radius:16px; overflow:hidden; border:4px solid #08244c; outline:2px solid #d4af37; background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.18); position:relative; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="width:48px; height:12px; background:#e2e8f0; border-radius:6px; margin:8px auto 4px; border:1px solid #94a3b8;"></div>

          <div style="padding:10px 18px 4px;">
            <div style="text-align:center; font-size:0.9rem; font-weight:900; color:#08244c; border-bottom:1.5px solid #08244c; padding-bottom:4px; margin-bottom:8px;">
              RULES &amp; REGULATIONS
            </div>
            <ol style="font-size:0.68rem; color:#334155; line-height:1.5; padding-left:14px; margin:0 0 12px;">
              <li>This card is non-transferable and must be carried at all times.</li>
              <li>Loss of this card must be reported immediately to the centre.</li>
              <li>Returns to: <b>${esc(centreEnglish)}</b>, ${esc(c.district || 'Azamgarh')}.</li>
            </ol>

            <div style="font-size:0.72rem; color:#0f172a; line-height:1.5;">
              <b>Contact:</b><br>
              Website: ${esc(c.slug ? `https://${c.slug}.pescouncil.in` : 'https://pitcouncil.com')}<br>
              Email: ${esc(c.email || 'info@pitcouncil.com')}
            </div>
          </div>

          <div style="text-align:center; padding-bottom:8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fstudent%2F${encodeURIComponent(regNo)}" style="width:75px; height:75px; border:1px solid #08244c; padding:2px; background:#fff; display:block; margin:0 auto;">
            <div style="font-size:0.62rem; font-weight:800; color:#08244c; margin-top:3px;">Verify Card</div>
          </div>

          <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:4px 6px;">
            ${renderAccreditationBadgesHtml()}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 5: AFFILIATION CERTIFICATE (Authorized Training Centre)
  // =========================================================================
  function renderAffiliationCertificateHtml(data) {
    const cert = data.certificate || data.cert || data || {};
    const { centreEnglish, centreHindi } = resolveCentreNames(cert, cert);
    const certNo = cert.cert_no || cert.affiliation_cert_no || `PESC-AFF-2026-${cert.centre_code || '0001'}`;
    const centreCode = cert.centre_code || 'PESC00001';
    const directorName = cert.director_name || 'Centre Director';
    const directorPhoto = cert.director_photo || cert.photo_url || '';
    const address = cert.address || `${cert.district || 'Azamgarh'}, ${cert.state || 'Uttar Pradesh'}`;
    const session = cert.session || cert.affiliation_session || '2026 - 2029 (3 Academic Years)';
    const status = cert.status || 'Active';
    const authorizedCourses = cert.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Nursery Teacher Training (NTT), Web Development, Graphic Design, Hardware & Networking';

    const authObj = data.authorities || cert.authorities || (typeof window !== 'undefined' && window._councilAuthorities) || {};
    const { councilSeal, councilSign, coordSeal, coordSign, councilLogo } = resolveSeals({ ...cert, authorities: authObj }, cert);
    const coordName = cert.coordinator_name || 'Regional Coordinator';
    const coordTerritory = cert.coordinator_territory || cert.state || 'Uttar Pradesh';

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https%3A%2F%2Fpescouncil.in%2Fverify%3Fcode%3D${encodeURIComponent(centreCode)}`;

    return `
      <div class="official-affiliation-certificate printable-area" style="width:100%; max-width:860px; margin:0 auto; background:#ffffff; border:8px double #08244c; outline:3px solid #d4af37; outline-offset:-5px; padding:26px 30px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 12px 36px rgba(0,0,0,0.15);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:420px; height:420px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:14px; margin-bottom:14px;">
            <div style="text-align:left;">
              <span style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Govt. Recognized Autonomy</span>
              <div style="font-size:0.85rem; color:#08244c; font-weight:900;">ISO 9001:2015 Certified</div>
              <div style="font-size:0.75rem; color:#047857; font-weight:800;">NITI Aayog Registered</div>
            </div>
            
            <div style="text-align:center;">
              <div style="width:62px; height:62px; margin:0 auto 4px; display:flex; align-items:center; justify-content:center;">
                <img src="${councilLogo || '/assets/img/logo_council.svg'}" style="width:60px; height:60px; object-fit:contain;">
              </div>
              <h2 style="margin:0; font-size:1.45rem; color:#08244c; letter-spacing:0.5px; font-weight:900; text-transform:uppercase;">
                PURVANCHAL EDUCATION &amp; SKILL COUNCIL
              </h2>
              <div style="font-size:1.05rem; color:#854d0e; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; font-weight:900; margin-top:2px;">
                पूर्वांचल शिक्षा एवं कौशल परिषद
              </div>
              <div style="font-size:0.75rem; color:#475569; font-weight:700; margin-top:2px;">
                Autonomous National Council for Vocational &amp; Technical Education
              </div>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">ATC Accredit No.</span>
              <div style="font-size:0.92rem; color:#854d0e; font-family:monospace; font-weight:900;">${esc(certNo)}</div>
              <div style="margin-top:4px;">
                <span style="background:#15803d; color:#ffffff; font-size:0.72rem; padding:3px 8px; border-radius:4px; font-weight:800;">✓ AUTHORIZED MANDATE</span>
              </div>
            </div>
          </div>

          <!-- 3D Golden Ribbon: CERTIFICATE OF AFFILIATION -->
          ${render3DGoldRibbon('CERTIFICATE', 'OF AFFILIATION')}
          <div style="text-align:center; font-size:0.95rem; color:#854d0e; font-weight:800; margin:4px 0 14px;">
            (सम्बद्धता एवं मान्यता प्रमाण पत्र)
          </div>

          <!-- Preamble -->
          <p style="font-size:0.92rem; color:#334155; line-height:1.6; margin:0 auto 14px; text-align:center; max-width:760px;">
            This is to officially certify that the educational institution named below has met the council's academic infrastructure, faculty, and operational standards and is hereby granted official status as an <b>Authorized Training Centre (ATC)</b>:
          </p>

          <!-- Centre Details Box -->
          <div style="margin:14px auto; padding:16px 20px; background:#f0fdf4; border:2px solid #86efac; border-radius:12px; display:flex; align-items:center; gap:20px; box-shadow:0 3px 10px rgba(0,0,0,0.04);">
            <div style="width:95px; height:118px; border:2.5px solid #d4af37; border-radius:6px; overflow:hidden; background:#ffffff; flex-shrink:0; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.12);">
              ${directorPhoto ? `<img src="${directorPhoto}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="font-size:0.68rem; font-weight:800; color:#64748b; text-align:center; padding:4px;">DIRECTOR<br>PHOTO</div>`}
            </div>
            <div style="flex:1;">
              <div style="font-size:1.45rem; font-weight:900; color:#08244c; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.2;">
                ${esc(centreHindi)}
              </div>
              <div style="font-size:1.15rem; font-weight:900; color:#064e3b; text-transform:uppercase; letter-spacing:0.5px; margin-top:2px;">
                ${esc(centreEnglish)}
              </div>
              <div style="font-size:0.86rem; color:#0f172a; margin-top:4px;">
                <b>Director / Incharge:</b> <span style="color:#08244c; font-weight:800;">${esc(directorName)}</span>
              </div>
              <div style="font-size:0.82rem; color:#475569; margin-top:2px; line-height:1.4;">
                <b>Centre Address:</b> ${esc(address)}
              </div>
            </div>
          </div>

          <!-- Meta Grid -->
          <div style="display:flex; justify-content:center; gap:14px; margin:14px 0; flex-wrap:wrap;">
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#92400e; font-weight:800;">Centre Code:</span> <b style="font-family:monospace; color:#78350f; font-size:0.95rem;">${esc(centreCode)}</b>
            </div>
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#92400e; font-weight:800;">Affiliation Period:</span> <b style="color:#78350f;">${esc(session)}</b>
            </div>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#166534; font-weight:800;">Status:</span> <b style="color:#15803d; text-transform:uppercase;">✓ ${esc(status)}</b>
            </div>
          </div>

          <!-- Authorized Courses -->
          <p style="font-size:0.82rem; color:#475569; text-align:center; margin:10px auto; max-width:760px; line-height:1.5;">
            Authorized to conduct national vocational training, skill certifications, and examinations for accredited courses:<br>
            <b style="color:#08244c;">${esc(authorizedCourses)}</b>.
          </p>

          <!-- Bottom Row: Regional Coordinator + Council Seal/QR + Head Office Signatory -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1.5px dashed #cbd5e1; padding-top:16px; margin-top:16px; font-size:0.78rem;">
            <!-- Left: Regional Coordinator -->
            <div style="text-align:center; width:220px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${coordSign}" style="width:85px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-weight:800; color:#08244c;">
                Signature &amp; Stamp<br>Regional Coordinator (${esc(coordTerritory)})
              </div>
            </div>

            <!-- Center: Council Seal & Verification QR -->
            <div style="text-align:center; width:180px;">
              <img src="${qrUrl}" style="width:62px; height:62px; border:1px solid #08244c; padding:2px; background:#fff; display:block; margin:0 auto 4px;">
              <div style="font-size:0.68rem; font-weight:800; color:#08244c;">
                Scan to Verify Online<br><span style="color:#64748b; font-family:monospace;">pescouncil.in/verify</span>
              </div>
            </div>

            <!-- Right: Head Office Director General / Registrar -->
            <div style="text-align:center; width:220px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${councilSign}" style="width:85px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-weight:800; color:#08244c;">
                Director General / Controller<br>Purvanchal Education &amp; Skill Council
              </div>
            </div>
          </div>

          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TEMPLATE 6: REGIONAL COORDINATOR APPOINTMENT CERTIFICATE
  // =========================================================================
  function renderCoordinatorAppointmentCertificateHtml(data) {
    const cert = data.certificate || data.cert || data || {};
    const name = cert.name || 'Ayush';
    const certNo = cert.cert_no || `PESC/COORD/2026/${String(cert.id || '0001').padStart(4, '0')}`;
    const territory = cert.territory || cert.state || 'All Assigned Territories';
    const qualification = cert.qualification || 'Higher Academic / Professional';
    const aadharNo = cert.aadhar_no || 'Verified on Record';
    const mobile = cert.mobile || '—';
    const address = cert.address ? `${cert.address}, ${cert.district || ''}, ${cert.state || ''} - ${cert.pin || ''}` : (cert.state || 'Uttar Pradesh, India');
    const photoUrl = cert.photo_url || '';
    const issueDateStr = cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '01 April 2026';
    const validUntilStr = cert.valid_until ? new Date(cert.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '31 March 2029';

    // Must be Head Office Seal and Head Office Director General Signature (NOT Coordinator's own signature)
    const { councilSeal, councilSign, councilLogo } = resolveSeals(cert, cert);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fcoordinator%2F${encodeURIComponent(cert.token || 'valid')}`;

    return `
      <div class="official-coord-certificate printable-area" style="width:100%; max-width:860px; margin:0 auto; background:#ffffff; border:8px double #d4af37; outline:3px solid #08244c; outline-offset:-5px; padding:26px 32px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 12px 36px rgba(0,0,0,0.15);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:420px; height:420px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:14px; margin-bottom:14px;">
            <div style="text-align:left;">
              <span style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Govt. Recognized Autonomy</span>
              <div style="font-size:0.85rem; color:#08244c; font-weight:900;">ISO 9001:2015 Certified</div>
              <div style="font-size:0.75rem; color:#047857; font-weight:800;">NITI Aayog Registered</div>
            </div>
            
            <div style="text-align:center;">
              <div style="width:62px; height:62px; margin:0 auto 4px; display:flex; align-items:center; justify-content:center;">
                <img src="${councilLogo || '/assets/img/logo_council.svg'}" style="width:60px; height:60px; object-fit:contain;">
              </div>
              <h2 style="margin:0; font-size:1.45rem; color:#08244c; letter-spacing:0.5px; font-weight:900; text-transform:uppercase;">
                PURVANCHAL EDUCATION &amp; SKILL COUNCIL
              </h2>
              <div style="font-size:1.05rem; color:#854d0e; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; font-weight:900; margin-top:2px;">
                पूर्वांचल शिक्षा एवं कौशल परिषद
              </div>
              <div style="font-size:0.75rem; color:#475569; font-weight:700; margin-top:2px;">
                Autonomous National Council for Vocational &amp; Technical Education
              </div>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Certificate No.</span>
              <div style="font-size:0.92rem; color:#854d0e; font-family:monospace; font-weight:900;">${esc(certNo)}</div>
              <div style="margin-top:4px;">
                <span style="background:#15803d; color:#ffffff; font-size:0.72rem; padding:3px 8px; border-radius:4px; font-weight:800;">✓ AUTHORIZED MANDATE</span>
              </div>
            </div>
          </div>

          <!-- 3D Golden Ribbon: REGIONAL COORDINATOR APPOINTMENT CERTIFICATE -->
          ${render3DGoldRibbon('REGIONAL COORDINATOR', 'APPOINTMENT CERTIFICATE')}
          <div style="text-align:center; font-size:0.95rem; color:#854d0e; font-weight:800; margin:4px 0 14px;">
            (क्षेत्रीय / राज्य समन्वयक नियुक्ति प्रमाण पत्र)
          </div>

          <!-- Preamble -->
          <p style="font-size:0.92rem; color:#334155; line-height:1.6; margin:0 auto 14px; text-align:center; max-width:760px;">
            By virtue of the powers vested in the Central Governing Board of <b>Purvanchal Education &amp; Skill Council</b>, this is to officially proclaim that having met all institutional standards and executive criteria:
          </p>

          <!-- Coordinator Profile Box -->
          <div style="margin:14px auto; padding:18px 22px; background:#f0fdf4; border:2px solid #86efac; border-radius:12px; display:flex; align-items:flex-start; gap:20px; box-shadow:0 3px 10px rgba(0,0,0,0.04);">
            <div style="width:105px; height:125px; border:2.5px solid #d4af37; border-radius:6px; overflow:hidden; background:#ffffff; flex-shrink:0; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.12);">
              ${photoUrl ? `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="font-size:3rem;">👔</div>`}
            </div>
            <div style="flex:1;">
              <h2 style="margin:0; font-size:1.6rem; color:#064e3b; font-weight:900;">${esc(name)}</h2>
              <div style="font-size:0.98rem; color:#08244c; font-weight:800; margin-top:2px;">
                Designation: Regional / State Coordinator (क्षेत्रीय / राज्य समन्वयक)
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 14px; margin-top:10px; font-size:0.84rem; color:#1e293b;">
                <div><b>Assigned Territory:</b> <span style="color:#b45309; font-weight:800;">${esc(territory)}</span></div>
                <div><b>Qualification:</b> <span style="font-weight:700;">${esc(qualification)}</span></div>
                <div><b>Official Contact:</b> <span style="font-weight:700;">${esc(mobile)}</span></div>
                <div style="grid-column:1 / -1; margin-top:2px;">
                  <b>Official Residential / Office Address:</b><br>
                  <span style="color:#334155; line-height:1.4;">${esc(address)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Authority Mandate -->
          <p style="font-size:0.84rem; color:#475569; text-align:justify; margin:12px auto; max-width:760px; line-height:1.5;">
            The designated coordinator is officially authorized and mandated to oversee authorized training centre accreditations, supervise academic examinations, verify candidate credentials, coordinate student enrolments, and represent the council in academic and promotional engagements across the assigned jurisdiction.
          </p>

          <!-- Meta Grid -->
          <div style="display:flex; justify-content:center; gap:14px; margin:14px 0; flex-wrap:wrap;">
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#92400e; font-weight:800;">Issue Date:</span> <b style="color:#78350f;">${issueDateStr}</b>
            </div>
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#92400e; font-weight:800;">Tenure / Validity:</span> <b style="color:#78350f;">${validUntilStr}</b>
            </div>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 16px; border-radius:8px; font-size:0.85rem;">
              <span style="color:#166534; font-weight:800;">Council Registry:</span> <b style="color:#15803d;">Active &amp; Verified</b>
            </div>
          </div>

          <!-- Bottom Signatures: Head Office Authority ONLY -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1.5px dashed #cbd5e1; padding-top:18px; margin-top:18px; font-size:0.82rem;">
            <!-- Left: QR Code -->
            <div style="text-align:center; width:180px;">
              <img src="${qrUrl}" style="width:70px; height:70px; border:1px solid #08244c; padding:2px; background:#fff; display:block; margin:0 auto 4px;">
              <div style="font-size:0.7rem; font-weight:800; color:#08244c;">
                Scan to Verify Mandate<br><span style="color:#64748b; font-family:monospace;">pescouncil.in/verify</span>
              </div>
            </div>

            <!-- Center: Head Office Council Mohar (Central Seal) -->
            <div style="text-align:center; width:200px;">
              <div style="height:65px; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:65px; height:65px; object-fit:contain;">
              </div>
              <div style="font-weight:800; color:#854d0e; margin-top:4px;">
                Official Central Council Seal
              </div>
            </div>

            <!-- Right: Head Office Director General / Registrar Signature -->
            <div style="text-align:center; width:230px;">
              <div style="height:65px; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSign}" style="width:95px; object-fit:contain;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-weight:800; color:#08244c;">
                Director General / Registrar<br>Purvanchal Education &amp; Skill Council
              </div>
            </div>
          </div>

          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // Export
  global.OfficialTemplates = {
    renderAdmissionFormHtml,
    renderCertificateHtml,
    renderMarksheetHtml,
    renderStudentIdCardHtml,
    renderAffiliationCertificateHtml,
    renderCoordinatorAppointmentCertificateHtml,
    renderAccreditationBadgesHtml
  };

})(typeof window !== 'undefined' ? window : globalThis);
