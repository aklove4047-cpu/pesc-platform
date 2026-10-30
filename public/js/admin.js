const V = $('#view');
const ask = (msg) => { const r = prompt(msg); return r && r.trim() ? r.trim() : null; };

function imgToBase64(file) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });
}

// Official PESC Council Header Builder matching User's Exact Specification
function renderOfficialCouncilHeader(opts = {}) {
  const studentCode = opts.studentCode || 'PESC-26-00008';
  const rollNo = opts.rollNo || studentCode;
  const refNo = opts.refNo || 'PESC-CERT-2026-0007';
  const issueDate = opts.issueDate || '04-10-2026';
  const uid = Math.random().toString(36).substring(2, 7);

  return `
    <!-- Top Hindi Title: Bada, Bold & Majestic Hindi Font (Extra Large for Print & PDF) -->
    <div style="text-align:center; margin-bottom:8px;">
      <div class="council-hindi-title" style="font-size:3rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Yatra One', 'Noto Serif Devanagari', 'Martel', serif; letter-spacing:1.5px; line-height:1.15; text-shadow:0 1px 3px rgba(10,42,94,0.18);">
        पूर्वांचल शिक्षा एवं कौशल परिषद
      </div>
    </div>

    <!-- Council Circular Seal (Bada Logo) + 4-Line Official Accreditation Block -->
    <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin:6px 0 10px;">
      <!-- Circular Council Seal SVG (Increased size to 110x110, sharp vector graphics) -->
      <div style="flex-shrink:0;">
        <svg class="council-seal-svg" width="110" height="110" viewBox="0 0 100 100" style="display:block; filter:drop-shadow(0 2px 5px rgba(7,42,96,0.2));">
          <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#047857" stroke-width="3.2"/>
          <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#d4af37" stroke-width="1.8"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#072a60" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
          <path id="txtArcTop_${uid}" d="M 18 50 A 32 32 0 1 1 82 50" fill="none" stroke="none"/>
          <text font-size="5.2" font-weight="900" fill="#047857" font-family="'Segoe UI', Arial, sans-serif" letter-spacing="0.5">
            <textPath href="#txtArcTop_${uid}" startOffset="50%" text-anchor="middle">PURVANCHAL EDUCATION &amp; SKILL</textPath>
          </text>
          <!-- Flaming Torch of Knowledge & Skills -->
          <path d="M47 23 Q50 15 53 23 Q55 29 50 32 Q45 29 47 23 Z" fill="#dc2626"/>
          <path d="M48 25 Q50 18 52 25 Q53 29 50 30 Q47 29 48 25 Z" fill="#fbbf24"/>
          <polygon points="48,32 52,32 51,39 49,39" fill="#b45309"/>
          <!-- Sun Rays -->
          <path d="M40 32 L35 29 M60 32 L65 29 M37 38 L31 38 M63 38 L69 38" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/>
          <!-- Open Book -->
          <path d="M50 53 Q35 45 24 50 L24 63 Q35 58 50 66 Q65 58 76 63 L76 50 Q65 45 50 53 Z" fill="#ffffff" stroke="#0a2a5e" stroke-width="1.8"/>
          <path d="M50 53 L50 66" stroke="#0a2a5e" stroke-width="1.8"/>
          <path d="M29 54 Q37 51 45 55 M29 58 Q37 55 45 59 M55 55 Q63 51 71 54 M55 59 Q63 55 71 58" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
          <circle cx="50" cy="70" r="2.5" fill="#047857"/>
          <rect x="20" y="75" width="60" height="16" rx="3.5" fill="#072a60" stroke="#d4af37" stroke-width="1.2"/>
          <text x="50" y="86.5" fill="#ffffff" font-size="10.5" font-weight="900" font-family="'Inter', Arial, sans-serif" text-anchor="middle" letter-spacing="2.5">PESC</text>
        </svg>
      </div>

      <!-- 4-Line Official Accreditation Block (Bold & Dignified) -->
      <div style="text-align:center;">
        <div class="council-english-title" style="font-size:1.45rem; font-weight:900; color:#047857; letter-spacing:0.8px; line-height:1.2; text-transform:uppercase;">
          PURVANCHAL EDUCATION AND SKILL COUNCIL
        </div>
        <div style="font-size:0.95rem; font-weight:900; color:#000000; letter-spacing:0.5px; text-transform:uppercase; margin-top:3px;">
          RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
        </div>
        <div style="font-size:0.78rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.3px;">
          REGISTERED UNDER INDIAN TRUST ACT &nbsp;||&nbsp; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
        </div>
        <div style="font-size:0.76rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.3px;">
          AN ISO 9001:2015 CERTIFIED COUNCIL &nbsp;||&nbsp; MSME REGISTERED ORGANISATION
        </div>
      </div>
    </div>

    <!-- Double Line Divider ======================================== -->
    <div style="border-top:3.5px double #072a60; margin:6px 0 10px; width:100%;"></div>

    <!-- Official Header Details Box (Place of Issue & Main Head Office removed from top, only in footer) -->
    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.84rem; font-weight:800; color:#000000; text-align:left; line-height:1.55; margin-bottom:12px; background:rgba(248,250,252,0.92); padding:8px 14px; border-radius:6px; border:1.5px solid #cbd5e1;">
      <div>
        <div><b>REGD. NO. (COUNCIL):</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">TRUST/2025/5/IV/299</span></div>
        <div><b>Student Reg. No:</b> <span style="font-family:monospace; font-weight:900; color:#064e3b;">${esc(studentCode)}</span></div>
        <div><b>Roll Number:</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">${esc(rollNo)}</span></div>
      </div>
      <div style="text-align:right;">
        <div><b>Ref No:</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">${esc(refNo)}</span></div>
        <div><b>Date of Issue (तिथि):</b> <span style="font-weight:900; color:#047857;">${esc(issueDate)}</span></div>
        <div><b>Council Scheme:</b> <span style="font-weight:900; color:#b45309;">Autonomous National Board</span></div>
      </div>
    </div>
  `;
}

// Global Council Authorities Loader for Head Office Admin Console
window._councilAuthorities = null;
window.ensureAuthoritiesLoaded = async function(force = false) {
  if (force || !window._councilAuthorities || !window._councilAuthorities.head_office || !window._councilAuthorities.head_office.seal_url) {
    try {
      const res = await api('/api/admin/authorities');
      if (res && res.authorities) {
        window._councilAuthorities = res.authorities;
      }
    } catch (_) {
      try {
        const pub = await api('/api/public/authorities');
        if (pub && pub.authorities) window._councilAuthorities = pub.authorities;
        else {
          const s = await api('/api/public/settings');
          if (s && s.authorities) window._councilAuthorities = s.authorities;
        }
      } catch (e) {}
    }
  }
  return window._councilAuthorities;
};

function renderOfficialCouncilFooter(opts = {}) {
  const auth = opts.authorities || (typeof window !== 'undefined' && window._councilAuthorities) || {};
  const ho = auth.head_office || {};
  const coord = auth.coordinator || {};
  const c = opts.centre || auth.centre || {};

  const directorName = opts.directorName || c.director_name || 'Authorized Signatory';
  const centreCode = opts.centreCode || c.centre_code || 'PESC00001';
  const centreSlug = opts.centreSlug || c.slug || (opts.centreCode ? opts.centreCode.toLowerCase() : 'main');
  const token = opts.token || '';
  const bId = Math.random().toString(36).substring(2, 7);

  const councilSeal = opts.councilSeal || opts.hoSeal || ho.seal_url || '/assets/img/seal_council_head.svg';
  const councilSign = opts.councilSign || opts.hoSign || ho.signature_url || '/assets/img/sign_council_head.svg';
  const headOfficeName = opts.headOfficeName || ho.name || 'Executive Director & Controller of Examinations';

  const coordSeal = opts.coordSeal || opts.coordinatorSeal || coord.seal_url || '/assets/img/seal_coordinator.svg';
  const coordSign = opts.coordSign || opts.coordinatorSign || coord.signature_url || '/assets/img/sign_coordinator.svg';
  const coordName = opts.coordName || coord.name || 'Er. V. K. Maurya';

  const centreSeal = opts.centreSeal || c.seal_url || '/assets/img/seal_centre_director.svg';
  const centreSign = opts.centreSign || c.signature_url || '/assets/img/sign_centre_director.svg';

  const councilVerifyUrl = token ? `https://pescouncil.in/verify/${encodeURIComponent(token)}` : 'https://pescouncil.in/verify';
  const centreVerifyUrl = token ? `https://${centreSlug}.pescouncil.in/verify/${encodeURIComponent(token)}` : `https://${centreSlug}.pescouncil.in/verify`;

  return `
    <!-- 3-Tier Official Authority Signatures Row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:24px; padding:0 10px; text-align:center; gap:12px;">
      <!-- Left: Council Head Sign & Official Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:200px;">
        <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
          <img src="${councilSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;" alt="Council Seal">
          <img src="${councilSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;" alt="Council Sign">
        </div>
        <div style="font-size:0.84rem; font-weight:800; color:#072a60; margin:4px 0 1px;">
          ${esc(headOfficeName)}
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Council Head / Controller Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(अध्यक्ष / परीक्षा नियंत्रक)</span>
        </span>
      </div>

      <!-- Center: Regional Coordinator Mohar & Sign -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:200px;">
        <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
          <img src="${coordSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;" alt="Coordinator Seal">
          <img src="${coordSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;" alt="Coordinator Sign">
        </div>
        <div style="font-size:0.84rem; font-weight:800; color:#6b21a8; margin:4px 0 1px;">
          ${esc(coordName)}
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Coordinator Sign &amp; Mohar<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(क्षेत्रीय समन्वयक मुहर)</span>
        </span>
      </div>

      <!-- Right: Authorized Centre Director Sign & Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:200px;">
        <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
          <img src="${centreSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;" alt="Centre Seal">
          <img src="${centreSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;" alt="Centre Sign">
        </div>
        <div style="font-size:0.84rem; font-weight:800; color:#064e3b; margin:4px 0 1px;">
          ${esc(directorName)}
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Centre Director Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(${esc(centreCode)} निदेशक साइन)</span>
        </span>
      </div>
    </div>

    <!-- Dual Portal Online Verification Box (Both Websites Displayed) -->
    <div style="margin-top:20px; background:linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%); border:1.8px solid #0284c7; border-radius:8px; padding:10px 14px; text-align:center;">
      <div style="font-size:0.82rem; font-weight:900; color:#0369a1; text-transform:uppercase; letter-spacing:0.5px;">
        🌐 DUAL-PORTAL ONLINE AUTHENTICITY VERIFICATION (द्वैध पोर्टल ऑनलाइन सत्यापन)
      </div>
      <div style="font-size:0.81rem; font-weight:700; color:#0f172a; margin-top:5px; display:flex; justify-content:center; gap:20px; flex-wrap:wrap;">
        <span>🏛️ <b>Council National Portal:</b> <a href="${councilVerifyUrl}" target="_blank" style="color:#072a60; font-weight:900; text-decoration:underline;">pescouncil.in/verify</a></span>
        <span>🏫 <b>Authorized Centre Portal:</b> <a href="${centreVerifyUrl}" target="_blank" style="color:#047857; font-weight:900; text-decoration:underline;">${centreSlug}.pescouncil.in/verify</a></span>
      </div>
      <div style="font-size:0.73rem; font-weight:700; color:#475569; margin-top:4px;">
        Scan the QR code at top-left or enter the registration/token on either portal to verify official council records.
      </div>
    </div>

    <!-- Official Head Office, Place of Issue & Contact Bar (Sirf Neeche Hi Saare Address) -->
    <div style="margin-top:16px; border-top:2px solid #072a60; padding-top:8px; text-align:center; background:rgba(248,250,252,0.85); border-radius:6px; padding:10px 14px; margin-bottom:12px; border:1px solid #cbd5e1;">
      <div style="font-size:0.86rem; font-weight:900; color:#072a60; letter-spacing:0.3px; margin-bottom:3px;">
        🏛️ <b>MAIN HEAD OFFICE:</b> ${esc(ho.address || 'Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001, India')}
      </div>
      <div style="font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:4px; display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <span>📞 <b>Helpline:</b> ${esc(ho.mobile || '+91 91290 85551')}</span>
        <span>✉️ <b>Email:</b> ${esc(ho.email || 'info@pescouncil.in')}</span>
        <span>🌐 <b>Website:</b> <a href="${esc(ho.website || 'https://pescouncil.in')}" target="_blank" style="color:#072a60; font-weight:900; text-decoration:underline;">${esc((ho.website || 'https://pescouncil.in').replace(/^https?:\/\//, ''))}</a></span>
      </div>
      <div style="font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
        📍 <b>PLACE OF ISSUE:</b> Central Examination Board &amp; Regional Council Office, Uttar Pradesh
      </div>
      <div style="font-size:0.74rem; font-weight:700; color:#475569;">
        Official Recognized Autonomous Certification &bull; Validated under Indian Trust Act (Regd. No: TRUST/2025/5/IV/299)
      </div>
    </div>

    <!-- Authentic Government & International Accreditation Logos / Insignia Badges -->
    <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; padding:6px 0;">
      <!-- 1. ISO 9001:2015 Quality Management Certified Badge -->
      <div title="ISO 9001:2015 Certified Organization">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <defs>
            <linearGradient id="isoG_${bId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#072a60"/>
              <stop offset="100%" stop-color="#0c4a9e"/>
            </linearGradient>
            <linearGradient id="goldG_${bId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d4af37"/>
              <stop offset="50%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <circle cx="60" cy="50" r="46" fill="url(#isoG_${bId})" stroke="url(#goldG_${bId})" stroke-width="3"/>
          <circle cx="60" cy="50" r="41" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="60" y="24" fill="#fde047" font-size="7" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="1">★ ★ ★ ★ ★</text>
          <rect x="36" y="29" width="48" height="20" rx="3" fill="#ffffff"/>
          <text x="60" y="44" fill="#072a60" font-size="14" font-weight="900" font-family="'Arial Black', Impact, sans-serif" text-anchor="middle" letter-spacing="1.5">ISO</text>
          <text x="60" y="60" fill="#fde047" font-size="9.5" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">9001:2015</text>
          <text x="60" y="72" fill="#ffffff" font-size="6.2" font-weight="800" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.8">CERTIFIED</text>
          <text x="60" y="81" fill="#cbd5e1" font-size="4.8" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">QUALITY ASSURED</text>
        </svg>
      </div>

      <!-- 2. NITI Aayog (NGO DARPAN, Government of India) Official Badge -->
      <div title="NITI Aayog (NGO DARPAN) Registered Organization, Govt. of India">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <defs>
            <linearGradient id="nitiShield_${bId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#f8fafc"/>
            </linearGradient>
          </defs>
          <path d="M 15 15 L 105 15 Q 105 55 60 92 Q 15 55 15 15 Z" fill="url(#nitiShield_${bId})" stroke="#047857" stroke-width="2.5"/>
          <rect x="18" y="17" width="84" height="4" fill="#ff9933"/>
          <rect x="18" y="21" width="84" height="4" fill="#ffffff"/>
          <rect x="18" y="25" width="84" height="4" fill="#138808"/>
          <circle cx="60" cy="41" r="10" fill="none" stroke="#000088" stroke-width="1.2"/>
          <circle cx="60" cy="41" r="2.5" fill="#000088"/>
          <path d="M 60 31 L 60 51 M 50 41 L 70 41 M 53 34 L 67 48 M 53 48 L 67 34" stroke="#000088" stroke-width="0.8"/>
          <text x="60" y="60" fill="#072a60" font-size="9" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">NITI Aayog</text>
          <text x="60" y="70" fill="#047857" font-size="7.5" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">NGO-DARPAN</text>
          <text x="60" y="80" fill="#b45309" font-size="5.5" font-weight="800" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">GOVT. OF INDIA</text>
        </svg>
      </div>

      <!-- 3. MSME (Ministry of Micro, Small & Medium Enterprises, Govt. of India) -->
      <div title="MSME Registered Organization, Govt. of India">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <rect x="8" y="8" width="104" height="84" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <g transform="translate(60, 36) scale(0.95)">
            <circle cx="-13" cy="0" r="14" fill="none" stroke="#1e40af" stroke-width="4.5" stroke-dasharray="5,2.5"/>
            <circle cx="-13" cy="0" r="7" fill="#1e40af"/>
            <circle cx="13" cy="0" r="14" fill="none" stroke="#ea580c" stroke-width="4.5" stroke-dasharray="5,2.5"/>
            <circle cx="13" cy="0" r="7" fill="#ea580c"/>
            <path d="M 0 12 Q 0 -6 12 -10 Q 6 4 0 12 Z" fill="#16a34a"/>
          </g>
          <text x="60" y="66" fill="#0f172a" font-size="12" font-weight="900" font-family="'Arial Black', Impact, sans-serif" text-anchor="middle" letter-spacing="1">MSME</text>
          <text x="60" y="76" fill="#ea580c" font-size="6" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.3">सूक्ष्म, लघु एवं मध्यम उद्यम</text>
          <text x="60" y="85" fill="#1e40af" font-size="5.2" font-weight="800" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.4">GOVERNMENT OF INDIA</text>
        </svg>
      </div>

      <!-- 4. IAF (International Accreditation Forum) Official Emblem -->
      <div title="IAF Accredited Certification Body">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <circle cx="60" cy="50" r="46" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
          <ellipse cx="60" cy="50" rx="38" ry="38" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
          <ellipse cx="60" cy="50" rx="20" ry="38" fill="none" stroke="#0284c7" stroke-width="1.2"/>
          <line x1="22" y1="50" x2="98" y2="50" stroke="#0284c7" stroke-width="1.2"/>
          <line x1="26" y1="34" x2="94" y2="34" stroke="#38bdf8" stroke-width="0.8"/>
          <line x1="26" y1="66" x2="94" y2="66" stroke="#38bdf8" stroke-width="0.8"/>
          <ellipse cx="60" cy="50" rx="30" ry="17" fill="#0369a1" stroke="#ffffff" stroke-width="2"/>
          <text x="60" y="56" fill="#ffffff" font-size="16" font-weight="900" font-family="'Arial Black', Impact, sans-serif" text-anchor="middle" letter-spacing="1.5">IAF</text>
          <text x="60" y="78" fill="#0369a1" font-size="5.2" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.3">ACCREDITED</text>
          <text x="60" y="86" fill="#64748b" font-size="4.2" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">MLA MEMBER</text>
        </svg>
      </div>

      <!-- 5. Purvanchal Shiksha Parishad (Registered Trust Seal) -->
      <div title="Purvanchal Shiksha Parishad Registered Indian Trust">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <circle cx="60" cy="50" r="46" fill="#ffffff" stroke="#831843" stroke-width="3"/>
          <circle cx="60" cy="50" r="41" fill="#fff1f2" stroke="#d4af37" stroke-width="1.5"/>
          <path d="M 50 42 Q 60 38 70 42 L 70 54 Q 60 50 50 54 Z" fill="#ffffff" stroke="#831843" stroke-width="1.2"/>
          <path d="M 50 42 Q 40 38 30 42 L 30 54 Q 40 50 50 54 Z" fill="#ffffff" stroke="#831843" stroke-width="1.2"/>
          <circle cx="50" cy="34" r="4" fill="#f59e0b"/>
          <text x="60" y="24" fill="#831843" font-size="5.8" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">PURVANCHAL</text>
          <text x="60" y="65" fill="#831843" font-size="7.5" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.4">SHIKSHA PARISHAD</text>
          <rect x="25" y="70" width="70" height="12" rx="3" fill="#831843"/>
          <text x="60" y="78.5" fill="#ffffff" font-size="5.2" font-weight="800" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.4">REGD. TRUST U.P.</text>
          <text x="60" y="89" fill="#71717a" font-size="4.5" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">GOVT. REGD 2025</text>
        </svg>
      </div>

      <!-- 6. PESC Council (Autonomous National Board Crest) -->
      <div title="Purvanchal Education & Skill Council Autonomous National Board">
        <svg width="74" height="66" viewBox="0 0 120 100" style="display:inline-block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <circle cx="60" cy="50" r="46" fill="#ffffff" stroke="#047857" stroke-width="3"/>
          <circle cx="60" cy="50" r="41" fill="#f0fdf4" stroke="#d4af37" stroke-width="1.5"/>
          <path d="M 28 50 Q 26 28 60 22 Q 94 28 92 50 Q 94 72 60 78 Q 26 72 28 50 Z" fill="none" stroke="#047857" stroke-width="1" stroke-dasharray="3,2"/>
          <polygon points="60,26 84,36 84,54 60,72 36,54 36,36" fill="#072a60" stroke="#d4af37" stroke-width="1.5"/>
          <text x="60" y="52" fill="#fde047" font-size="12.5" font-weight="900" font-family="'Arial Black', Impact, sans-serif" text-anchor="middle" letter-spacing="1">PESC</text>
          <text x="60" y="62" fill="#ffffff" font-size="5" font-weight="900" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">COUNCIL</text>
          <rect x="22" y="76" width="76" height="12" rx="3" fill="#047857"/>
          <text x="60" y="84.5" fill="#ffffff" font-size="5" font-weight="800" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" letter-spacing="0.4">AUTONOMOUS BOARD</text>
        </svg>
      </div>
    </div>
  `;
}

// Platform Data Wipe Handler
window.handleResetPlatformData = async function() {
  const conf = confirm('⚠️ WARNING: Are you sure you want to delete ALL franchises, ALL students, and ALL coordinators?\\n\\nThis will wipe all test/demo data completely clean so you can add everything fresh.\\n\\nOnly the Super Admin login and Council settings will be retained.\\n\\nClick OK to confirm data wipe.');
  if (!conf) return;
  const conf2 = prompt('Type "RESET" to confirm permanent wipe:');
  if (conf2 !== 'RESET') {
    toast('Wipe cancelled', false);
    return;
  }
  try {
    const res = await api('/api/admin/reset-platform-data', { method: 'POST' });
    alert('✅ ' + (res.message || 'All franchises, students, and coordinators have been wiped completely!'));
    window.location.reload();
  } catch (err) {
    alert('Error: ' + (err.message || err));
  }
};

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
            <div style="margin-bottom:14px;">
              <label class="label" style="font-weight:700; color:#334155; margin-bottom:5px; display:block;">Official Council Website (वेबसाइट)</label>
              <input class="inp" id="pWebsite" value="${esc(p.website || 'https://pescouncil.in')}" placeholder="https://pescouncil.in" style="width:100%;">
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

          <!-- Council Official Logo (Separate from Seal) -->
          <div style="margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <label class="label" style="font-weight:700; color:#334155;">Council / Head Office Official Logo (प्रतीक चिन्ह / मुख्य लोगो)</label>
            <p class="muted" style="font-size:0.78rem; margin:2px 0 8px;">Yeh logo documents ke header aur NITI Aayog ke paas display hoga (Round seal se alag hai)</p>
            <div style="display:flex; align-items:center; gap:14px; margin-top:8px; flex-wrap:wrap;">
              <div id="adminLogoBox" style="width:75px; height:75px; border-radius:10px; background:#f8fafc; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                ${p.logo_url ? `<img src="${esc(p.logo_url)}" style="max-width:100%; max-height:100%; object-fit:contain;" id="adminLogoImg">` : '<img src="/assets/img/logo_council.svg" style="max-width:65px; max-height:65px; object-fit:contain;" id="adminLogoImg">'}
              </div>
              <div style="flex:1; min-width:220px;">
                <input type="file" id="adminFileLogo" accept="image/*" style="display:none;">
                <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
                  <button type="button" class="btn sm alt" onclick="$('#adminFileLogo').click()">📤 Upload Logo File</button>
                  <span class="muted" style="font-size:0.78rem;">या URL पेस्ट करें:</span>
                </div>
                <input class="inp" id="adminUrlLogo" value="${esc(p.logo_url || '')}" placeholder="https://... ya logo image file upload karein" style="width:100%; font-size:0.85rem; padding:6px 10px;">
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
    bindAdminFile('adminFileLogo', 'adminUrlLogo', 'adminLogoBox', false);
    bindAdminFile('adminFileMohar', 'adminUrlMohar', 'adminMoharBox', false);
    bindAdminFile('adminFileSign', 'adminUrlSign', 'adminSignBox', false);
    bindAdminFile('adminFileChairSign', 'adminUrlChairSign', 'adminChairSignBox', false);

    // Live URL preview for Council Logo
    const urlLogoInp = $('#adminUrlLogo');
    if (urlLogoInp) {
      urlLogoInp.oninput = () => {
        const v = urlLogoInp.value.trim();
        const box = $('#adminLogoBox');
        if (box) {
          box.innerHTML = v ? `<img src="${v}" style="max-width:100%;max-height:100%;object-fit:contain;" onerror="this.outerHTML='<span style=\\'font-size:2rem;\\'>🏛️</span>'">` : '<img src="/assets/img/logo_council.svg" style="max-width:65px;max-height:65px;object-fit:contain;">';
        }
      };
    }

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
        const website = $('#pWebsite') ? $('#pWebsite').value.trim() : 'https://pescouncil.in';
        await api('/api/admin/profile', {
          method: 'POST',
          body: { name, email, mobile, designation, head_office, state, website }
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
        const logo_url = $('#adminUrlLogo') ? ($('#adminUrlLogo').value.trim() || null) : null;
        const seal_url = $('#adminUrlMohar').value || null;
        const signature_url = $('#adminUrlSign').value || null;
        const chairman_signature_url = $('#adminUrlChairSign').value || null;
        await api('/api/admin/profile', {
          method: 'POST',
          body: { photo_url, logo_url, seal_url, signature_url, chairman_signature_url }
        });
        await window.ensureAuthoritiesLoaded(true);
        toast('✅ Photo, Logo, Seals & Signatures saved successfully!');
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
      ['Centre & Portal Website', (r) => `<b>${esc(r.centre_name)}</b><br><a href="https://${r.slug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management' : esc(r.slug)}.pescouncil.in" target="_blank" style="color:#047857; font-weight:700; text-decoration:none;">${r.slug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management' : esc(r.slug)}.pescouncil.in ↗</a> · <span class="muted">${esc(r.district)}</span>`],
      ['Regional Coordinator', (r) => r.coordinator_name ? `<b style="color:#0284c7;">👔 ${esc(r.coordinator_name)}</b>` : `<span class="muted">Direct Head Office</span>`],
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
        <div>
          <button class="btn sm danger" onclick="handleResetPlatformData()" style="font-weight:800; background:#dc2626; color:#fff; border-radius:6px; padding:8px 16px;" title="Wipe all centres, students, and coordinators clean">🗑️ Reset All Franchises, Students &amp; Coordinators</button>
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
          const pSub = r.slug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management.pescouncil.in' : `${r.slug}.pescouncil.in`;
          return `<a href="https://${pSub}" target="_blank" style="color:#047857; font-family:monospace; font-weight:700; text-decoration:none;">${pSub} ↗</a>`;
        }],
        ['Location', (r) => `${esc(r.district)}, ${esc(r.state)}`],
        ['Regional Coordinator', (r) => r.coordinator_name ? `<b style="color:#0284c7; font-size:0.85rem;">👔 ${esc(r.coordinator_name)}</b>` : `<span class="muted" style="font-size:0.82rem;">Direct Head Office</span>`],
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
        <div>
          <label>Regional Coordinator</label>
          <select name="coordinator_id" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; background:#fff;">
            <option value="">-- Direct Council Head Office --</option>
            ${coordinators.map(c => `<option value="${c.id}">👔 ${esc(c.name)} (${esc(c.state || '')})</option>`).join('')}
          </select>
        </div>
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
    const [{ marksheets: issuedList }, { marksheets: pendingList }, { students }, { centres }, { courses }] = await Promise.all([
      api('/api/admin/marksheets'),
      api('/api/marksheets/pending'),
      api('/api/admin/students'),
      api('/api/admin/centres'),
      api('/api/admin/courses'),
    ]);
    window._currentStudents = students;
    window._adminCentres = centres;
    window._adminCourses = courses;
    window._adminMarksheets = issuedList;

    const list = issuedList || [];
    const pending = pendingList || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2>🎓 Examination &amp; Marksheet Issuance Console</h2>
          <p class="muted">Authorize accredited statements of marks, evaluate semester &amp; yearly performance, and print official council marksheets</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <span class="badge active">${list.length} Issued Marksheets</span>
          ${pending.length ? `<span class="badge Pending">${pending.length} Pending Approvals</span>` : ''}
          <button type="button" class="btn gold" onclick="openAdminMarksheetIssueModal()" style="font-weight:800; display:inline-flex; align-items:center; gap:6px;">
            ➕ Issue New Marksheet &amp; Certificate
          </button>
        </div>
      </div>

      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:16px 20px; margin-bottom:20px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
        <h4 style="margin:0 0 10px; color:#0a2a5e;">⚡ Quick Candidate Evaluation &amp; Issue:</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)) 120px; gap:12px; align-items:end;">
          <div>
            <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Filter by Centre:</label>
            <select id="quickMarksheetCentreFilter" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.88rem;">
              <option value="">All Centres</option>
              ${centres.map(c => `<option value="${c.id}">${esc(c.name)} (${esc(c.centre_code)})</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:4px;">Select Candidate:</label>
            <select id="quickMarksheetStudentSelect" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.88rem; font-weight:600;">
              <option value="">-- Choose Student --</option>
              ${students.map(s => `<option value="${s.id}" data-cid="${s.centre_id}">${esc(s.name)} · ${esc(s.student_code)} (${esc(s.course_name || s.course_code || 'Course')})</option>`).join('')}
            </select>
          </div>
          <button type="button" class="btn gold" id="btnLaunchQuickMarksheet" style="height:38px; font-weight:800;">
            🚀 Evaluate &amp; Issue
          </button>
        </div>
      </div>

      <h3 style="margin:24px 0 12px; color:#0a2a5e;">Issued Marksheets Registry (${list.length})</h3>
      ${table([
        ['Marksheet No', (r) => `<b style="font-family:monospace; color:#0a2a5e;">${esc(r.marksheet_no || 'PESC/MRK/2026/0001')}</b><br><span class="muted">${esc(r.evaluation_type === 'semester' ? 'Semester-Wise' : 'Annual-Wise')} · ${esc(r.term || 'Annual')}</span>`],
        ['Candidate', (r) => {
          const stu = students.find(s => s.id === r.student_id) || { name: r.student_name || 'Candidate', student_code: r.roll_no };
          return `<b>${esc(stu.name)}</b><br><span class="muted">Roll: <b>${esc(r.roll_no || stu.student_code)}</b></span>`;
        }],
        ['Course & Centre', (r) => {
          const ce = centres.find(c => c.id === r.centre_id) || { name: 'Council Centre', centre_code: 'PESC0001' };
          const co = courses.find(c => c.id === r.course_id) || { name: 'Diploma Course' };
          return `<b>${esc(co.name)}</b><br><span class="muted">${esc(ce.name)} (${esc(ce.centre_code)})</span>`;
        }],
        ['Marks Score', (r) => `<b>${r.total_obtained} / ${r.total_max}</b><br><span style="color:#16a34a; font-weight:800;">${r.percentage}% (${esc(r.grade || 'A')})</span>`],
        ['Result', (r) => badge(r.result || 'PASS')],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px;">
            <button class="btn sm gold" data-a="view_official_mrk" data-id="${r.id}" style="display:inline-flex; align-items:center; gap:4px;">
              👁️ View &amp; Print
            </button>
            <button type="button" class="btn sm alt" onclick="openAdminEditMarksheetModal(${r.id})" style="display:inline-flex; align-items:center; gap:4px; font-weight:700;">
              ✏️ Edit
            </button>
          </div>
        `],
      ], list, 'No marksheets issued yet. Use the button above to issue your first marksheet.')}

      ${pending.length ? `
        <h3 style="margin-top:32px; color:#b45309;">Centre-Submitted Marksheet Approval Queue (${pending.length})</h3>
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
        ], pending)}
      ` : ''}
    `;

    const cFilter = $('#quickMarksheetCentreFilter');
    const sSelect = $('#quickMarksheetStudentSelect');
    if (cFilter && sSelect) {
      cFilter.onchange = (e) => {
        const cid = e.target.value;
        const filtered = cid ? students.filter(s => s.centre_id == cid) : students;
        sSelect.innerHTML = `<option value="">-- Choose Student (${filtered.length}) --</option>` +
          filtered.map(s => `<option value="${s.id}">${esc(s.name)} · ${esc(s.student_code)} (${esc(s.course_name || s.course_code || 'Course')})</option>`).join('');
      };
    }

    const btnLaunch = $('#btnLaunchQuickMarksheet');
    if (btnLaunch && sSelect) {
      btnLaunch.onclick = () => {
        const sid = +sSelect.value;
        if (!sid) return alert('Please select a candidate first!');
        const s = students.find(x => x.id === sid);
        openAdminMarksheetIssueModal(sid, s ? s.name : '');
      };
    }
  },

  async Certificates() {
    const [{ certificates: issuedList }, { certificates: pendingList }, { students }, { centres }, { courses }] = await Promise.all([
      api('/api/admin/certificates'),
      api('/api/certificates/pending'),
      api('/api/admin/students'),
      api('/api/admin/centres'),
      api('/api/admin/courses'),
    ]);
    window._currentStudents = students;
    window._adminCentres = centres;
    window._adminCourses = courses;
    window._adminCertificates = issuedList;

    const list = issuedList || [];
    const pending = pendingList || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2>📜 National Council Passing Certificates Registry</h2>
          <p class="muted">Issue cryptographically verifiable Council passing certificates with golden hologram, official seal &amp; QR verification</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <span class="badge active">${list.length} Valid Certificates</span>
          ${pending.length ? `<span class="badge Pending">${pending.length} Pending</span>` : ''}
          <button type="button" class="btn gold" onclick="openAdminCertificateIssueModal()" style="font-weight:800; display:inline-flex; align-items:center; gap:6px;">
            ➕ Issue Passing Certificate
          </button>
        </div>
      </div>

      <h3 style="margin:20px 0 12px; color:#0a2a5e;">Issued Certificates Registry (${list.length})</h3>
      ${table([
        ['Certificate No', (r) => `<b style="font-family:monospace; color:#064e3b; font-size:0.95rem;">${esc(r.cert_no || 'PESC/2026/0001')}</b><br><span class="muted">${esc(r.evaluation_type === 'semester' ? 'Semester Completion' : 'Course Completion')} · ${esc(r.term || 'Annual')}</span>`],
        ['Candidate', (r) => {
          const stu = students.find(s => s.id === r.student_id) || { name: r.student_name || 'Candidate', student_code: 'PESC001' };
          return `<b>${esc(stu.name)}</b><br><span class="muted">Reg. No: <b>${esc(stu.student_code)}</b></span>`;
        }],
        ['Course & Centre', (r) => {
          const ce = centres.find(c => c.id === r.centre_id) || { name: 'Council Centre', centre_code: 'PESC0001' };
          const co = courses.find(c => c.id === r.course_id) || { name: 'Diploma Course' };
          return `<b>${esc(co.name)}</b><br><span class="muted">${esc(ce.name)} (${esc(ce.centre_code)})</span>`;
        }],
        ['Issue Date', (r) => date(r.issued_at || r.created_at)],
        ['Status', (r) => badge(r.status || 'Valid')],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px;">
            <button class="btn sm gold" data-a="view_official_cert" data-id="${r.id}" style="display:inline-flex; align-items:center; gap:4px;">
              📜 View &amp; Print
            </button>
            <button type="button" class="btn sm alt" onclick="openAdminEditCertModal(${r.id})" style="display:inline-flex; align-items:center; gap:4px; font-weight:700;">
              ✏️ Edit
            </button>
            <a href="/verify/${r.token || ''}" target="_blank" class="btn sm alt" title="Open Public Verification Link">
              🔍 Verify
            </a>
          </div>
        `],
      ], list, 'No certificates issued yet. Issue your first certificate using the button above.')}

      ${pending.length ? `
        <h3 style="margin-top:32px; color:#b45309;">Pending Certificate Applications Queue (${pending.length})</h3>
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
        ], pending)}
      ` : ''}
    `;
  },

  async Coordinators() {
    const { coordinators } = await api('/api/admin/coordinators');
    V._coords = coordinators;
    V.innerHTML = `
      <h2>Regional Coordinators &amp; State Appointments</h2>
      <p class="muted" style="margin-bottom:16px;">Appoint regional coordinators, record full residential &amp; jurisdiction credentials, issue official appointment certificates, and monitor territorial accreditations</p>
      ${table([
        ['Coordinator', (r) => `
          <div style="display:flex; align-items:center; gap:10px;">
            ${r.photo_url ? `<img src="${esc(r.photo_url)}" style="width:38px; height:46px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1; flex-shrink:0;">` : `<div style="width:38px; height:46px; background:#e0f2fe; border-radius:4px; display:grid; place-items:center;">👔</div>`}
            <div>
              <b>${esc(r.name)}</b><br>
              <span class="muted">${esc(r.email)} · 📞 ${esc(r.mobile || '—')}</span>
            </div>
          </div>
        `],
        ['Full Address &amp; District', (r) => `
          <div style="font-size:0.86rem;">
            <b>${esc(r.address || 'Regional Headquarters')}</b><br>
            <span class="muted">${esc(r.district || '')}${r.district ? ', ' : ''}${esc(r.state || 'Uttar Pradesh')} - ${esc(r.pin || '221001')}</span>
          </div>
        `],
        ['Qualification & Jurisdiction', (r) => `
          <div style="font-size:0.86rem;">
            <b style="color:#0a2a5e;">${esc(r.qualification || 'Post Graduate')}</b><br>
            <span class="muted">${esc(r.territory || r.state || 'All State')}</span>
          </div>
        `],
        ['Assigned Jurisdiction', (r) => `<b style="color:#b45309;">${esc(r.territory || r.state || 'All State')}</b>`],
        ['Affiliated Centres', (r) => {
          const cnt = r.centres_count !== undefined ? r.centres_count : (r.centres ? r.centres.length : 0);
          return `
            <div style="text-align:center;">
              <span class="badge ${cnt > 0 ? 'blue' : ''}" style="font-weight:800; font-size:0.85rem; padding:3px 8px;">
                ${cnt} ${cnt === 1 ? 'Centre' : 'Centres'}
              </span>
              <div style="margin-top:6px;">
                <button type="button" class="btn sm" data-a="view_coord_centres" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff; font-weight:700; font-size:0.75rem; padding:3px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:4px; cursor:pointer;" title="Click to view all centres affiliated under this coordinator">
                  🏢 View Centres (${cnt})
                </button>
              </div>
            </div>
          `;
        }],
        ['Certificate No', (r) => `<span style="font-family:monospace; font-weight:700; color:#064e3b;">${esc(r.cert_no || 'Issued')}</span>`],
        ['Credentials (ID & Pass)', (r) => `
          <div style="font-size:0.84rem; line-height:1.4;">
            <div><b>ID:</b> <code style="font-weight:700; color:#064e3b; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0;">${esc(r.email || r.mobile)}</code></div>
            <div><b>Pass:</b> <code style="font-weight:700; color:#b91c1c; background:#fef2f2; padding:2px 6px; border-radius:4px; border:1px solid #fecaca;">${esc(r.password || r.password_plain || 'Coord@123')}</code></div>
            <button type="button" class="btn sm" onclick="navigator.clipboard.writeText('Coordinator ID: ${r.email || r.mobile}\\nPassword: ${r.password || r.password_plain || 'Coord@123'}\\nPortal: https://pescouncil.in/coordinator'); alert('✓ Coordinator credentials copied to clipboard!');" style="padding:2px 8px; font-size:0.72rem; margin-top:3px; background:#e2e8f0; color:#0f172a; cursor:pointer; border:1px solid #cbd5e1;">📋 Copy ID &amp; Pass</button>
          </div>
        `],
        ['Status', (r) => badge(r.status || 'Active')],
        ['Actions', (r) => `
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn sm gold" data-a="view_coord_cert" data-id="${r.id}" data-name="${esc(r.name)}" style="display:inline-flex; align-items:center; gap:4px;">
              📜 View Certificate
            </button>
            <button class="btn sm" data-a="view_coord_creds" data-id="${r.id}" data-name="${esc(r.name)}" data-email="${esc(r.email)}" data-mobile="${esc(r.mobile || '')}" data-pass="${esc(r.password || r.password_plain || 'Coord@123')}" style="background:#047857; color:#fff; font-weight:700;" title="View &amp; Manage Login Credentials">🔑 ID &amp; Pass</button>
            <button type="button" class="btn sm danger" data-a="del_coord" data-id="${r.id}" data-name="${esc(r.name)}" title="Delete Coordinator" style="display:inline-flex; align-items:center; gap:4px; font-weight:700; background:#dc2626; color:#fff;">🗑️ Delete</button>
          </div>
        `],
      ], coordinators)}

      <h3 style="margin-top:28px; color:#0a2a5e;">➕ Appoint New Regional Coordinator (Full Details Required)</h3>
      <p class="muted" style="margin-bottom:14px;">All details including full street address, district, state, PIN, mobile, passport photo and qualification are required for statutory appointment credentials.</p>
      
      <form id="kf" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:22px; box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom:14px;">
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Coordinator Full Name *</label><input name="name" required maxlength="100" placeholder="e.g. Vikram Singh" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Mobile Number * (10 Digits)</label><input name="mobile" required maxlength="15" placeholder="e.g. 9415012345" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Email Address *</label><input name="email" type="email" required placeholder="coord@pescouncil.in" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:14px; margin-bottom:14px;">
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Full Residential / Office Address *</label><input name="address" required placeholder="House/Shop No., Street, Landmark, Village/Locality" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">District *</label><input name="district" required placeholder="e.g. Gorakhpur" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">State *</label><input name="state" required value="Uttar Pradesh" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">PIN Code *</label><input name="pin" required maxlength="10" placeholder="273001" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
        </div>

        <!-- Coordinator Passport Photo Upload -->
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px; background:#f8fafc; padding:12px; border-radius:8px; border:1px dashed #cbd5e1;">
          <div id="coordPhotoPreviewBox" style="width:64px; height:80px; border-radius:6px; background:#ffffff; border:2px solid #0284c7; display:grid; place-items:center; overflow:hidden; flex-shrink:0;">
            <span style="font-size:1.8rem;">👔</span>
          </div>
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Coordinator Passport Photo (पासपोर्ट फोटो)</label>
            <span class="muted" style="font-size:0.78rem; display:block; margin-bottom:6px;">Upload official passport photo for appointment certificate and regional identity credentials.</span>
            <input type="file" id="coordPhotoFileInput" accept="image/*" style="font-size:0.82rem; border:1px solid #cbd5e1; border-radius:6px; padding:4px 8px; background:#fff;">
            <input type="hidden" name="photo_url" id="coordPhotoUrlInput" value="">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 2fr; gap:14px; margin-bottom:18px;">
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Highest Qualification *</label><input name="qualification" required placeholder="e.g. MCA / M.Tech / B.Ed" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Assigned Jurisdiction / Territory Details *</label><input name="territory" required placeholder="e.g. Eastern UP Zone (Gorakhpur, Varanasi, Azamgarh, Mau)" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;"></div>
        </div>

        <div style="display:flex; justify-content:flex-end;">
          <button class="btn gold" style="font-weight:800; padding:10px 24px; font-size:0.95rem;">
            📜 Appoint Coordinator &amp; Issue Official Certificate
          </button>
        </div>
      </form>
    `;

    const coordFileInput = document.getElementById('coordPhotoFileInput');
    if (coordFileInput) {
      coordFileInput.onchange = () => {
        const file = coordFileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const b64 = ev.target.result;
          const urlInput = document.getElementById('coordPhotoUrlInput');
          const previewBox = document.getElementById('coordPhotoPreviewBox');
          if (urlInput) urlInput.value = b64;
          if (previewBox) previewBox.innerHTML = `<img src="${b64}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      };
    }
  },

  async Website_CMS() {
    const res = await api('/api/admin/site-settings');
    const s = res.settings || {};

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2>🌐 Website Logo &amp; Content Management (CMS)</h2>
          <p class="muted">Upload and update the Council website logo, customize ticker announcements, and toggle website sections on or off</p>
        </div>
        <a href="/" target="_blank" class="btn alt" style="display:inline-flex; align-items:center; gap:6px;">
          👁️ Preview Live Website
        </a>
      </div>

      <form id="websiteCmsForm" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1100px;">
        <!-- Card 1: Logo & Branding -->
        <div class="card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="margin:0 0 16px; color:#0a2a5e; display:flex; align-items:center; gap:8px;">
            🖼️ Website Logo &amp; Header Titles
          </h3>

          <div style="display:flex; align-items:center; gap:20px; margin-bottom:18px; background:#f8fafc; padding:14px; border-radius:8px; border:1px dashed #cbd5e1;">
            <div id="cmsLogoPreviewBox" style="width:90px; height:90px; border-radius:10px; background:#ffffff; border:2px solid #0284c7; display:grid; place-items:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex-shrink:0;">
              ${s.logo_url
                ? `<img src="${esc(s.logo_url)}" style="width:100%; height:100%; object-fit:contain;" alt="Logo">`
                : `<span style="font-size:2.4rem;">🏛️</span>`
              }
            </div>
            <div>
              <b style="font-size:0.9rem; color:#0f172a; display:block; margin-bottom:4px;">Upload Council Logo (परिषद लोगो):</b>
              <span class="muted" style="font-size:0.78rem; display:block; margin-bottom:8px;">Upload high-res PNG/JPG or enter custom image URL. Automatically replaces logo across website header and footer.</span>
              <input type="file" id="cmsLogoFileInput" accept="image/*" style="font-size:0.82rem; border:1px solid #cbd5e1; border-radius:6px; padding:4px 8px; background:#fff;">
              <input type="hidden" name="logo_url" id="cmsLogoUrlInput" value="${esc(s.logo_url || '')}">
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Council Domain / Brand Title *</label>
            <input name="council_title" value="${esc(s.council_title || 'pescouncil.in')}" required style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Hindi Title / Subtitle *</label>
            <input name="hindi_title" value="${esc(s.hindi_title || 'पूर्वांचल शिक्षा एवं कौशल परिषद')}" required style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700; color:#0a48a3;">
          </div>
        </div>

        <!-- Card 2: Notice Bar / Ticker Settings -->
        <div class="card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="margin:0 0 16px; color:#0a2a5e; display:flex; align-items:center; gap:8px;">
            📢 Public Megaphone Notice Banner
          </h3>

          <div style="margin-bottom:16px;">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:700; color:#0f172a;">
              <input type="checkbox" name="show_notice" ${s.show_notice !== false ? 'checked' : ''} style="width:18px; height:18px;">
              <span>Enable Notice Megaphone Bar on Website (वेबसाइट पर नोटिस बार दिखाएं)</span>
            </label>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Notice Ticker Text (One line per bullet):</label>
            <textarea name="notice_text" rows="5" style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.88rem; line-height:1.5;">${esc(s.notice_text || '• Admissions open for DCA / PGDCA session 2026-27\n• Last date to apply 30 November 2026\n• For queries contact: info@pescouncil.in | +91 542-1234567')}</textarea>
            <small class="muted">Lines will be displayed with bullet points inside the prominent blue notice card.</small>
          </div>
        </div>

        <!-- Card 3: Section Visibility Handles (Full Width) -->
        <div class="card" style="grid-column:1 / -1; background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="margin:0 0 8px; color:#0a2a5e; display:flex; align-items:center; gap:8px;">
            🎛️ Website Section Visibility Handles (क्या दिखाना है क्या हटाना है)
          </h3>
          <p class="muted" style="margin-bottom:18px;">Easily switch sections on or off on the public website with these toggles.</p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
            <!-- Toggle 1: Verify Section -->
            <label style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
              <input type="checkbox" name="show_verify" ${s.show_verify !== false ? 'checked' : ''} style="width:20px; height:20px; margin-top:2px;">
              <div>
                <b style="font-size:0.95rem; color:#0f172a; display:block;">🛡️ Verification Section &amp; QR Scanner</b>
                <span class="muted" style="font-size:0.8rem;">Public certificate and roll number search box</span>
              </div>
            </label>

            <!-- Toggle 2: Coordinators Row -->
            <label style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
              <input type="checkbox" name="show_coordinators" ${s.show_coordinators !== false ? 'checked' : ''} style="width:20px; height:20px; margin-top:2px;">
              <div>
                <b style="font-size:0.95rem; color:#0f172a; display:block;">👔 Verified Regional Coordinators Showcase</b>
                <span class="muted" style="font-size:0.8rem;">Coordinator photo cards and appointment verification</span>
              </div>
            </label>

            <!-- Toggle 3: Affiliated Centres Grid -->
            <label style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
              <input type="checkbox" name="show_centres" ${s.show_centres !== false ? 'checked' : ''} style="width:20px; height:20px; margin-top:2px;">
              <div>
                <b style="font-size:0.95rem; color:#0f172a; display:block;">🏛️ Affiliated Study Centres Grid</b>
                <span class="muted" style="font-size:0.8rem;">Recognized computer centres with photos &amp; codes</span>
              </div>
            </label>

            <!-- Toggle 4: Enrolled Students Directory -->
            <label style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
              <input type="checkbox" name="show_students" ${s.show_students !== false ? 'checked' : ''} style="width:20px; height:20px; margin-top:2px;">
              <div>
                <b style="font-size:0.95rem; color:#0f172a; display:block;">🎓 Enrolled Students &amp; Star Ratings</b>
                <span class="muted" style="font-size:0.8rem;">Candidate testimonials &amp; diploma awards</span>
              </div>
            </label>

            <!-- Toggle 5: Franchise Application Button -->
            <label style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
              <input type="checkbox" name="show_franchise_btn" ${s.show_franchise_btn !== false ? 'checked' : ''} style="width:20px; height:20px; margin-top:2px;">
              <div>
                <b style="font-size:0.95rem; color:#0f172a; display:block;">🏢 Franchise / Centre Application CTA</b>
                <span class="muted" style="font-size:0.8rem;">Allow academies to apply online for centre affiliation</span>
              </div>
            </label>
          </div>

          <div style="margin-top:22px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn gold" style="font-weight:800; font-size:1rem; padding:12px 28px; box-shadow:0 4px 15px rgba(212,175,55,0.4);">
              💾 Save Website Settings &amp; Section Visibility
            </button>
          </div>
        </div>
      </form>
    `;

    // File to base64 binder for logo
    const fileInput = $('#cmsLogoFileInput');
    const logoUrlInput = $('#cmsLogoUrlInput');
    const previewBox = $('#cmsLogoPreviewBox');
    if (fileInput && logoUrlInput && previewBox) {
      fileInput.onchange = async () => {
        if (!fileInput.files || !fileInput.files[0]) return;
        const b64 = await imgToBase64(fileInput.files[0]);
        logoUrlInput.value = b64;
        previewBox.innerHTML = `<img src="${b64}" style="width:100%; height:100%; object-fit:contain;" alt="Logo">`;
        toast('New logo loaded! Click Save to apply.');
      };
    }

    // Save Form Handler
    const cmsForm = $('#websiteCmsForm');
    if (cmsForm) {
      cmsForm.onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(cmsForm);
        const payload = {
          logo_url: fd.get('logo_url'),
          council_title: fd.get('council_title'),
          hindi_title: fd.get('hindi_title'),
          notice_text: fd.get('notice_text'),
          show_notice: fd.get('show_notice') === 'on',
          show_verify: fd.get('show_verify') === 'on',
          show_coordinators: fd.get('show_coordinators') === 'on',
          show_centres: fd.get('show_centres') === 'on',
          show_students: fd.get('show_students') === 'on',
          show_franchise_btn: fd.get('show_franchise_btn') === 'on',
        };

        const res = await api('/api/admin/site-settings', {
          method: 'POST',
          body: payload
        });

        toast('Website settings saved & updated live!');
      };
    }
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
    window._adminStudentsTab = window._adminStudentsTab || 'active';
    const filterCid = V._activeCentreFilter || '';
    const [{ students }, { centres }, { courses }, mrkRes, certRes] = await Promise.all([
      api('/api/admin/students' + (filterCid ? `?centre_id=${filterCid}` : '')),
      api('/api/admin/centres'),
      api('/api/admin/courses'),
      api('/api/admin/marksheets').catch(() => ({ marksheets: [] })),
      api('/api/admin/certificates').catch(() => ({ certificates: [] }))
    ]);

    const marksheets = mrkRes.marksheets || [];
    const certificates = certRes.certificates || [];

    // Enrich with cert/mrk IDs
    students.forEach(s => {
      if (!s.certificate_id) {
        const c = certificates.find(x => x.student_id === s.id);
        if (c) {
          s.certificate_id = c.id;
          s.cert_no = c.cert_no;
          s.has_certificate = true;
          s.is_passout = true;
        }
      }
      if (!s.marksheet_id) {
        const m = marksheets.find(x => x.student_id === s.id);
        if (m) {
          s.marksheet_id = m.id;
          s.marksheet_no = m.marksheet_no;
          s.has_marksheet = true;
          s.is_passout = true;
        }
      }
    });

    V._centres = centres;
    V._courses = courses;
    window._currentStudents = students;
    const activeCentre = centres.find(c => c.id == filterCid);

    const activeList = students.filter(s => !s.is_passout && s.status !== 'passout' && s.status !== 'completed');
    const passoutList = students.filter(s => s.is_passout || s.status === 'passout' || s.status === 'completed');
    const isPassoutTab = window._adminStudentsTab === 'passout';

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2>${isPassoutTab ? '🎓 Passout Candidates (पासआउट छात्र सूची)' : (activeCentre ? `Enrolled Candidates: ${esc(activeCentre.name)}` : '📋 Active / Enrolled Candidates (नामांकित छात्र)')}</h2>
          <p class="muted">${isPassoutTab ? `Listing ${passoutList.length} graduated candidates with 1-click certificate & marksheet verification` : (activeCentre ? `Managing ${activeList.length} active students enrolled in ${esc(activeCentre.name)}` : 'Central candidate directory across all affiliated franchise centres')}</p>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; background:#f1f5f9; padding:6px 12px; border-radius:8px; border:1px solid #cbd5e1;">
            <b style="font-size:0.85rem; color:#475569;">🏢 Filter by Centre:</b>
            <select id="studentCentreFilter" style="padding:4px 8px; border-radius:6px; border:1px solid #94a3b8; font-size:0.88rem; background:#fff;">
              <option value="">All Centres (National Directory)</option>
              ${centres.map(c => `<option value="${c.id}" ${filterCid == c.id ? 'selected' : ''}>${esc(c.name)} (${esc(c.centre_code)}) - ${c.students || 0} Students</option>`).join('')}
            </select>
          </div>
          <span class="badge active">${students.length} Total</span>
          <button type="button" class="btn sm danger" id="btnClearAllStudents" style="background:#dc2626; color:#fff; font-weight:700; border:none; padding:6px 14px; border-radius:6px; cursor:pointer;" title="Clear all enrolled students">🗑️ Clear All Students</button>
        </div>
      </div>

      <!-- Two Separate Tabs: Active / Enrolled vs Passout Candidates -->
      <div style="display:flex; gap:10px; margin-bottom:18px; border-bottom:2.5px solid #cbd5e1; padding-bottom:8px;">
        <button type="button" class="btn ${!isPassoutTab ? 'gold' : 'alt'} sm" id="tabBtnActiveStudents" style="font-weight:800; font-size:0.95rem; padding:8px 20px; border-radius:8px; cursor:pointer;">
          📋 Active / Enrolled Candidates (${activeList.length})
        </button>
        <button type="button" class="btn ${isPassoutTab ? 'gold' : 'alt'} sm" id="tabBtnPassoutStudents" style="font-weight:800; font-size:0.95rem; padding:8px 20px; border-radius:8px; cursor:pointer;">
          🎓 Passout Candidates (${passoutList.length})
        </button>
      </div>

      ${isPassoutTab ? table([
        ['Student Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b><br><span class="muted">Roll: <b>${esc(r.roll_no || r.student_code)}</b></span>`],
        ['Candidate Name', (r) => `<b>${esc(r.name)}</b><br><span class="muted">Father: ${esc(r.father_name || '—')}</span>`],
        ['Course', (r) => `<b>${esc(r.course_code || '')}</b> - ${esc(r.course_name)}`],
        ['Affiliated Centre', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.centre_code)}</span>`],
        ['Credentials', (r) => `
          <div>
            ${r.certificate_id ? `<span style="color:#047857; font-weight:700; font-size:0.8rem;">📜 Cert: ${esc(r.cert_no || 'Issued')}</span>` : '<span class="muted" style="font-size:0.8rem;">No Cert</span>'}<br>
            ${r.marksheet_id ? `<span style="color:#0284c7; font-weight:700; font-size:0.8rem;">📊 Mrk: ${esc(r.marksheet_no || 'Issued')}</span>` : '<span class="muted" style="font-size:0.8rem;">No Mrk</span>'}
          </div>
        `],
        ['Status', (r) => `<span class="badge Approved" style="background:#ecfdf5; color:#047857; border:1px solid #86efac; font-weight:800;">PASSOUT</span>`],
        ['Actions', (r) => `
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${r.certificate_id ? `<button type="button" class="btn sm gold" onclick="showAdminOfficialCertModal({ id: ${r.certificate_id} })" title="View & Print Official Passing Certificate">📜 View Cert</button>` : `<button class="btn sm gold" data-a="c_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Certificate">➕ Cert</button>`}
            ${r.marksheet_id ? `<button type="button" class="btn sm gold" onclick="showAdminOfficialMarksheetModal({ id: ${r.marksheet_id} })" title="View & Print Official Marksheet">📊 View Mrk</button>` : `<button class="btn sm gold" data-a="m_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Marksheet">➕ Mrk</button>`}
            <button type="button" class="btn sm alt" data-a="edit_student" data-id="${r.id}" title="Edit Student Particulars">✏️ Edit</button>
            <button type="button" class="btn sm" data-a="view_student_creds" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="View Credentials">🔑 ID/Pass</button>
            <button type="button" class="btn sm" style="background:#64748b; color:#fff;" onclick="toggleStudentStatus(${r.id}, 'active')" title="Move Back to Active Enrolled List">📋 Revert Active</button>
            <button type="button" class="btn sm danger" onclick="window.confirmDeleteStudent(${r.id}, '${esc(r.name)}', '${esc(r.student_code)}')" title="Delete Student Record" style="background:#dc2626; color:#fff; font-weight:700;">🗑️ Delete</button>
          </div>
        `]
      ], passoutList, filterCid ? `No passout students found for this centre.` : 'No passout students found yet.') : table([
        ['Student Code', (r) => `<b style="font-family:monospace; color:var(--navy);">${esc(r.student_code)}</b>`],
        ['Candidate Name', (r) => `<b>${esc(r.name)}</b><br><span class="muted">Father: ${esc(r.father_name || '—')}</span>`],
        ['Course', (r) => `<b>${esc(r.course_code || '')}</b> - ${esc(r.course_name)}`],
        ['Affiliated Centre', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted">${esc(r.centre_code)}</span>`],
        ['Contact', (r) => `${esc(r.mobile || '—')}<br><span class="muted">${esc(r.email || '—')}</span>`],
        ['Status', (r) => badge(r.status || 'Active')],
        ['Actions', (r) => `
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            <button type="button" class="btn sm alt" data-a="edit_student" data-id="${r.id}" title="Edit Student Profile">✏️ Edit</button>
            <button type="button" class="btn sm" data-a="view_student_creds" data-id="${r.id}" data-name="${esc(r.name)}" style="background:#0284c7; color:#fff;" title="View Student Login ID and Password">🔑 ID/Pass</button>
            <button type="button" class="btn sm gold" data-a="c_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Certificate">📜 Cert</button>
            <button type="button" class="btn sm gold" data-a="m_direct_issue" data-id="${r.id}" data-name="${esc(r.name)}" title="Issue Marksheet">📊 Marksheet</button>
            <button type="button" class="btn sm" style="background:#059669; color:#fff;" onclick="toggleStudentStatus(${r.id}, 'passout')" title="Mark Student as Passed Out">🎓 Passout</button>
            <button type="button" class="btn sm danger" onclick="window.confirmDeleteStudent(${r.id}, '${esc(r.name)}', '${esc(r.student_code)}')" title="Delete Student" style="background:#dc2626; color:#fff; font-weight:700;">🗑️ Delete</button>
          </div>
        `],
      ], activeList, filterCid ? `No active enrolled candidates found for ${activeCentre ? activeCentre.name : 'this centre'}.` : 'No active enrolled candidates registered across centres.')}

      ${!isPassoutTab ? `
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
      ` : ''}
    `;

    const btnActTab = $('#tabBtnActiveStudents');
    if (btnActTab) {
      btnActTab.onclick = () => {
        window._adminStudentsTab = 'active';
        views.Students();
      };
    }
    const btnPassTab = $('#tabBtnPassoutStudents');
    if (btnPassTab) {
      btnPassTab.onclick = () => {
        window._adminStudentsTab = 'passout';
        views.Students();
      };
    }

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
    const [{ wallets = [] }, { requests = [] }, paymentRes = {}] = await Promise.all([
      api('/api/admin/wallets').catch(() => ({ wallets: [] })),
      api('/api/admin/wallet-topups').catch(() => ({ requests: [] })),
      api('/api/admin/headoffice-payment-settings').catch(() => ({ settings: {} }))
    ]);
    const settings = paymentRes.settings || {};

    const pendingRequests = requests.filter(r => String(r.status || '').toLowerCase() === 'pending');
    const totalPendingPaise = pendingRequests.reduce((sum, r) => sum + (r.amount_paise || (r.amount_rupees ? r.amount_rupees * 100 : 0) || 0), 0);
    const totalWalletsPaise = wallets.reduce((sum, w) => sum + (w.balance_paise || (w.balance ? w.balance * 100 : 0) || 0), 0);

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0 0 4px; display:flex; align-items:center; gap:10px;">
            💳 Franchise Wallet &amp; Monetization Control
            ${pendingRequests.length > 0 ? `<span style="background:#ef4444; color:#fff; font-size:0.8rem; font-weight:800; padding:2px 10px; border-radius:12px; animation:pulse 2s infinite;">${pendingRequests.length} PENDING APPROVAL</span>` : ''}
          </h2>
          <p class="muted" style="margin:0;">Manage offline UPI top-up requests from centres, 1-click approvals, and monitor franchise digital wallet reserves</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn gold" data-a="edit_headoffice_payment" style="font-weight:700;">⚙️ Configure Payment QR &amp; WhatsApp</button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid" style="grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:24px;">
        <div class="stat" style="background:#fff; border-left:4px solid #ef4444; padding:16px; border-radius:10px; box-shadow:var(--shadow-sm);">
          <span style="font-size:0.85rem; color:#64748b; font-weight:700; text-transform:uppercase;">Pending Top-Up Requests</span>
          <b style="font-size:1.6rem; color:#ef4444;">${pendingRequests.length} <small style="font-size:0.9rem; font-weight:600;">(₹${(totalPendingPaise / 100).toLocaleString('en-IN')})</small></b>
        </div>
        <div class="stat" style="background:#fff; border-left:4px solid #16a34a; padding:16px; border-radius:10px; box-shadow:var(--shadow-sm);">
          <span style="font-size:0.85rem; color:#64748b; font-weight:700; text-transform:uppercase;">Total Franchise Reserves</span>
          <b style="font-size:1.6rem; color:#16a34a;">${inr(totalWalletsPaise)}</b>
        </div>
        <div class="stat" style="background:#fff; border-left:4px solid #2563eb; padding:16px; border-radius:10px; box-shadow:var(--shadow-sm);">
          <span style="font-size:0.85rem; color:#64748b; font-weight:700; text-transform:uppercase;">Active Centre Wallets</span>
          <b style="font-size:1.6rem; color:#2563eb;">${wallets.length}</b>
        </div>
        <div class="stat" style="background:#fff; border-left:4px solid #d4af37; padding:16px; border-radius:10px; box-shadow:var(--shadow-sm);">
          <span style="font-size:0.85rem; color:#64748b; font-weight:700; text-transform:uppercase;">Head Office UPI</span>
          <b style="font-size:1.15rem; color:#072a60; font-family:monospace;">${esc(settings.upi_id || 'pesc@upi')}</b>
        </div>
      </div>

      <!-- Section 1: Pending Offline Top-Up Requests (WhatsApp / UTR) -->
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:20px; margin-bottom:24px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
          <div>
            <h3 style="margin:0 0 4px; color:#0f172a; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              ⚡ Incoming Offline Top-Up Queue (Pending Approval)
            </h3>
            <p style="margin:0; font-size:0.85rem; color:#64748b;">
              Franchise centres make UPI/bank transfers and submit UTR + notify via WhatsApp. Review UTR and approve to credit their wallet instantly.
            </p>
          </div>
          <span style="font-size:0.85rem; font-weight:700; color:${pendingRequests.length > 0 ? '#ef4444' : '#16a34a'};">
            ${pendingRequests.length} pending requests
          </span>
        </div>

        ${pendingRequests.length === 0 ? `
          <div style="text-align:center; padding:32px 16px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
            <div style="font-size:2.4rem; margin-bottom:8px;">✅</div>
            <b style="color:#0f172a;">All top-up requests have been reviewed and processed!</b>
            <p style="color:#64748b; font-size:0.85rem; margin:4px 0 0;">New wallet top-up requests submitted by centres via UPI/WhatsApp will appear here.</p>
          </div>
        ` : `
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <thead>
                <tr style="background:#f1f5f9; text-align:left; border-bottom:2px solid #cbd5e1;">
                  <th style="padding:10px 12px;">Requested At</th>
                  <th style="padding:10px 12px;">Centre</th>
                  <th style="padding:10px 12px;">Amount</th>
                  <th style="padding:10px 12px;">Payment Mode</th>
                  <th style="padding:10px 12px;">UTR / Ref No</th>
                  <th style="padding:10px 12px;">Centre Notes</th>
                  <th style="padding:10px 12px; text-align:right;">Head Office Action</th>
                </tr>
              </thead>
              <tbody>
                ${pendingRequests.map(r => `
                  <tr style="border-bottom:1px solid #e2e8f0; background:#fffdf5;">
                    <td style="padding:10px 12px; font-size:0.82rem; color:#64748b; white-space:nowrap;">
                      ${new Date(r.created_at).toLocaleString('en-IN')}<br>
                      <small style="font-family:monospace; color:#94a3b8;">REQ-#${r.id}</small>
                    </td>
                    <td style="padding:10px 12px;">
                      <b style="color:#072a60;">${esc(r.centre_name)}</b><br>
                      <span style="font-family:monospace; font-size:0.8rem; background:#e2e8f0; padding:1px 6px; border-radius:4px;">${esc(r.centre_code)}</span>
                      <small style="color:#64748b; display:block; margin-top:2px;">📍 ${esc(r.district || '')}, ${esc(r.state || '')} · 📞 ${esc(r.contact_phone || 'N/A')}</small>
                    </td>
                    <td style="padding:10px 12px; white-space:nowrap;">
                      <b style="font-size:1.15rem; color:#15803d;">₹${(r.amount_rupees !== undefined ? r.amount_rupees : (r.amount_paise ? r.amount_paise / 100 : 0)).toLocaleString('en-IN')}</b>
                    </td>
                    <td style="padding:10px 12px;">
                      <span style="display:inline-block; padding:3px 8px; border-radius:6px; background:#eff6ff; color:#1d4ed8; font-weight:700; font-size:0.8rem; text-transform:uppercase;">
                        ${esc(r.payment_mode)}
                      </span>
                    </td>
                    <td style="padding:10px 12px;">
                      <b style="font-family:monospace; font-size:0.95rem; background:#f1f5f9; padding:3px 8px; border-radius:4px; border:1px solid #cbd5e1; color:#0f172a; letter-spacing:0.5px;">
                        ${esc(r.utr_number || 'N/A')}
                      </b>
                    </td>
                    <td style="padding:10px 12px; font-size:0.85rem; color:#475569;">
                      ${esc(r.notes || '—')}
                    </td>
                    <td style="padding:10px 12px; text-align:right; white-space:nowrap;">
                      <button class="btn sm success" data-a="approve_topup" data-id="${r.id}" data-name="${esc(r.centre_name)}" data-amount="${(r.amount_rupees !== undefined ? r.amount_rupees : (r.amount_paise ? r.amount_paise / 100 : 0))}" style="font-weight:800; padding:7px 14px; margin-right:6px; background:#16a34a; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                        ✅ Approve &amp; Credit
                      </button>
                      <button class="btn sm danger" data-a="reject_topup" data-id="${r.id}" data-name="${esc(r.centre_name)}" style="font-weight:700; padding:7px 12px; background:#ef4444; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Section 2: All Franchise Wallets & Direct Manual Balance Adjustment -->
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:20px; margin-bottom:24px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="margin:0 0 4px; color:#0f172a; font-size:1.2rem;">🏛️ Franchise Digital Wallets Directory</h3>
            <p style="margin:0; font-size:0.85rem; color:#64748b;">Live wallet balances. Centres consume balance for Admission Forms (₹35), Marksheet Issuance (₹150), and Certificate Issuance (₹200).</p>
          </div>
        </div>

        ${table([
          ['Code', (r) => `<b style="font-family:monospace; font-size:0.95rem; color:#072a60;">${esc(r.centre_code)}</b>`],
          ['Centre Name', (r) => `<b>${esc(r.centre_name)}</b><br><span class="muted" style="font-size:0.8rem;">📍 ${esc(r.district || '')}, ${esc(r.state || '')}</span>`],
          ['Wallet Balance', (r) => `<b style="font-size:1.15rem; color:#15803d;">${inr(r.balance_paise)}</b>`],
          ['Status', (r) => badge(r.centre_status)],
          ['Actions', (r) => `
            <button class="btn sm gold" data-a="wallet_adj" data-id="${r.centre_id}" data-name="${esc(r.centre_name)}" style="font-weight:700; padding:6px 14px;">
              ⚡ Manual Balance Adjustment
            </button>
          `],
        ], wallets, 'No centre wallets found.')}
      </div>

      <!-- Section 3: Processed Top-Up History Log -->
      ${requests.filter(r => r.status !== 'pending').length > 0 ? `
        <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:20px; box-shadow:var(--shadow-sm);">
          <h3 style="margin:0 0 12px; color:#0f172a; font-size:1.1rem;">📜 Recent Top-Up Approvals &amp; Rejection History</h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
              <thead>
                <tr style="background:#f8fafc; text-align:left; border-bottom:2px solid #e2e8f0;">
                  <th style="padding:8px 10px;">Processed On</th>
                  <th style="padding:8px 10px;">Centre</th>
                  <th style="padding:8px 10px;">Amount</th>
                  <th style="padding:8px 10px;">UTR / Mode</th>
                  <th style="padding:8px 10px;">Status</th>
                  <th style="padding:8px 10px;">Notes / Rejection Reason</th>
                </tr>
              </thead>
              <tbody>
                ${requests.filter(r => String(r.status || '').toLowerCase() !== 'pending').slice(0, 25).map(r => {
                  const reqAmt = (r.amount_rupees !== undefined ? r.amount_rupees : (r.amount_paise ? r.amount_paise / 100 : 0));
                  const isApproved = String(r.status || '').toLowerCase() === 'approved';
                  return `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:8px 10px; color:#64748b;">${r.reviewed_at ? new Date(r.reviewed_at).toLocaleString('en-IN') : new Date(r.created_at).toLocaleString('en-IN')}</td>
                    <td style="padding:8px 10px;"><b>${esc(r.centre_name)}</b> (${esc(r.centre_code)})</td>
                    <td style="padding:8px 10px; font-weight:700; color:#15803d;">₹${reqAmt.toLocaleString('en-IN')}</td>
                    <td style="padding:8px 10px; font-family:monospace;">${esc(r.payment_mode)} / ${esc(r.utr_number || '—')}</td>
                    <td style="padding:8px 10px;">
                      <span style="padding:2px 8px; border-radius:4px; font-weight:800; font-size:0.75rem; text-transform:uppercase; ${isApproved ? 'background:#dcfce7; color:#166534;' : 'background:#fee2e2; color:#991b1b;'}">
                        ${isApproved ? '✓ APPROVED & CREDITED' : '✗ REJECTED'}
                      </span>
                    </td>
                    <td style="padding:8px 10px; color:#64748b;">${esc(r.rejection_reason || r.notes || '—')}</td>
                  </tr>
                `;}).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
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

function showHeadOfficePaymentSettingsModal(s) {
  showModal('⚙️ Configure Head Office UPI, QR & WhatsApp Gateway', `
    <form id="headofficePayForm" style="display:grid; gap:14px;">
      <p style="color:#64748b; font-size:0.9rem; margin:0;">
        These details will be shown to franchise centres when they request wallet top-up and scan the QR code to pay fees.
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <label>
          <span style="font-weight:700; font-size:0.85rem;">Head Office UPI ID:</span>
          <input type="text" name="upi_id" value="${esc(s.upi_id || 'pesc@upi')}" required style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
        </label>
        <label>
          <span style="font-weight:700; font-size:0.85rem;">Account Payee / Merchant Name:</span>
          <input type="text" name="upi_name" value="${esc(s.upi_name || 'Purvanchal Education and Skill Council')}" required style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
        </label>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <label>
          <span style="font-weight:700; font-size:0.85rem;">Head Office WhatsApp Number (with country code):</span>
          <input type="text" name="whatsapp_number" value="${esc(s.whatsapp_number || '919415200000')}" placeholder="e.g. 919415200000" required style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
          <small style="color:#64748b;">Centres will send automated top-up messages to this number</small>
        </label>
        <label>
          <span style="font-weight:700; font-size:0.85rem;">QR Code Image URL (optional):</span>
          <input type="text" name="qr_code_image" value="${esc(s.qr_code_image || '')}" placeholder="https://... or data:image/..." style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
        </label>
      </div>
      <div style="border-top:1px solid #e2e8f0; padding-top:10px;">
        <h4 style="margin:0 0 8px; font-size:0.95rem; color:#071a33;">Bank Account Details (for NEFT / IMPS / RTGS)</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
          <label>
            <span style="font-weight:700; font-size:0.82rem;">Bank Name:</span>
            <input type="text" name="bank_name" value="${esc(s.bank_name || 'State Bank of India')}" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
          </label>
          <label>
            <span style="font-weight:700; font-size:0.82rem;">Account Number:</span>
            <input type="text" name="account_number" value="${esc(s.account_number || '')}" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
          </label>
          <label>
            <span style="font-weight:700; font-size:0.82rem;">IFSC Code:</span>
            <input type="text" name="ifsc_code" value="${esc(s.ifsc_code || '')}" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:4px;">
          </label>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
        <button type="submit" class="btn gold" style="font-weight:800; padding:10px 20px;">💾 Save Payment Settings</button>
      </div>
    </form>
  `, async (fd) => {
    const payload = {
      upi_id: fd.get('upi_id'),
      upi_name: fd.get('upi_name'),
      whatsapp_number: fd.get('whatsapp_number'),
      qr_code_image: fd.get('qr_code_image'),
      bank_name: fd.get('bank_name'),
      account_number: fd.get('account_number'),
      ifsc_code: fd.get('ifsc_code')
    };
    await api('/api/admin/headoffice-payment-settings', {
      method: 'PUT',
      body: payload
    });
    toast('✅ Head Office payment settings updated successfully!');
    await views.Wallets();
  }, '700px');
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
  await window.ensureAuthoritiesLoaded(true);
  const res = await api(`/api/admin/centres/${cId}/affiliation-cert`);
  const cert = res.certificate || {};

  showModal(`📜 Affiliation Certificate - ${cert.centre_code}`, `
    <div style="background:#f8fafc; padding:16px; text-align:center;">
      <div class="no-print" style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <button type="button" onclick="showEditAffiliationCertModal(${cId})" class="btn sm" style="font-weight:700; background:#0284c7; color:#fff; border:none; cursor:pointer; padding:7px 14px; border-radius:6px;">✏️ Edit Certificate Details</button>
        <button type="button" onclick="window.print()" class="btn gold sm" style="font-weight:700; padding:7px 14px;">🖨️ Print Official Certificate</button>
      </div>
      <div id="printCertArea">
        ${window.OfficialTemplates && window.OfficialTemplates.renderAffiliationCertificateHtml ? window.OfficialTemplates.renderAffiliationCertificateHtml({ certificate: cert, authorities: window._councilAuthorities }) : 'Loading Certificate...'}
      </div>
    </div>
  `, null, '920px');
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
window.confirmDeleteStudent = async function(id, name, code) {
  const conf = confirm(`⚠️ स्थायी विलोपन (Permanent Delete Student):\n\nक्या आप छात्र "${name}" (${code || id}) को पोर्टल से हमेशा के लिए हटाना चाहते हैं?\n\nयह छात्र, इसकी समस्त अंकतालिका, प्रमाणपत्र एवं लॉगिन क्रेडेंशियल हमेशा के लिए डिलीट हो जाएंगे।\n\nडिलीट करने के लिए 'OK' पर क्लिक करें।`);
  if (!conf) return;
  try {
    await api(`/api/admin/students/${id}`, { method: 'DELETE' });
    toast(`छात्र "${name}" को सफलतापूर्वक हमेशा के लिए डिलीट कर दिया गया!`);
    const overlay = document.getElementById('adminModalOverlay');
    if (overlay) overlay.style.display = 'none';
    if (typeof views !== 'undefined' && typeof views.Students === 'function') {
      await views.Students();
    }
  } catch (err) {
    alert('Error deleting student: ' + (err.message || err));
  }
};

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
          <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <button type="button" class="btn danger" style="background:#dc2626; color:#fff; font-weight:700;" onclick="window.confirmDeleteStudent(${id}, '${esc(s.name)}', '${esc(s.student_code)}')">🗑️ Delete Student (स्थायी रूप से हटाएं)</button>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn alt" onclick="document.getElementById('adminModalOverlay').style.display='none'">Cancel</button>
              <button type="submit" class="btn gold">Save Student Profile</button>
            </div>
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
            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <button type="button" class="btn sm" id="btnCopyCreds" style="background:#16a34a; color:#fff;">📋 Copy Login Message for WhatsApp/SMS</button>
              <button type="button" class="btn sm danger" style="background:#dc2626; color:#fff; font-weight:700;" onclick="window.confirmDeleteStudent(${id}, '${esc(c.name)}', '${esc(c.student_code)}')">🗑️ Delete Student</button>
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
      await window.confirmDeleteStudent(id, b.dataset.name, b.dataset.code || id);
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
    } else if (a === 'view_coord_creds') {
      const d = b.dataset;
      const shareText = `*Purvanchal Education & Skill Council (PESC)*\n` +
        `👔 *Regional Coordinator Login Credentials*\n` +
        `• *Coordinator Name:* ${d.name}\n` +
        `• *Login ID (Email):* ${d.email}\n` +
        `• *Mobile:* ${d.mobile || '—'}\n` +
        `• *Password:* ${d.pass || 'Coord@123'}\n` +
        `• *Coordinator Portal:* https://pescouncil.in/coordinator`;

      showModal(`🔑 Coordinator Login Credentials: ${d.name}`, `
        <div style="margin-bottom:16px;">
          <div style="background:#f0fdf4; border:1.5px solid #a7f3d0; padding:16px; border-radius:10px; margin-bottom:16px;">
            <h4 style="margin:0 0 10px; color:#064e3b; font-size:1.15rem;">👔 ${esc(d.name)}</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.9rem;">
              <div><b>Login ID (Email):</b><br><code style="font-size:1rem; color:#064e3b; font-weight:800; background:#fff; padding:3px 8px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block; margin-top:3px;">${esc(d.email)}</code></div>
              <div><b>Login Password:</b><br><code style="font-size:1rem; color:#b91c1c; font-weight:800; background:#fef2f2; padding:3px 8px; border-radius:4px; border:1px solid #fecaca; display:inline-block; margin-top:3px;">${esc(d.pass || 'Coord@123')}</code></div>
              <div style="grid-column:span 2;"><b>Coordinator Portal:</b><br><a href="https://pescouncil.in/coordinator" target="_blank" style="color:#0284c7; font-weight:700;">https://pescouncil.in/coordinator ↗</a></div>
            </div>
            <div style="margin-top:14px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              <button type="button" class="btn sm" id="btnCopyCoordCreds" style="background:#16a34a; color:#fff; font-weight:700;">📋 Copy for WhatsApp / SMS</button>
              <button type="button" class="btn sm danger" id="btnModalDelCoord" style="background:#dc2626; color:#fff; font-weight:700;">🗑️ Delete Coordinator</button>
            </div>
          </div>

          <form id="resetCoordPassForm" style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#fff;">
            <h4 style="margin:0 0 10px; color:var(--navy);">⚡ Change / Set New Password for Coordinator</h4>
            <div style="display:flex; gap:10px; align-items:flex-end;">
              <div style="flex:1;">
                <label>New Password (min 6 characters)</label>
                <input name="password" id="newCoordPassInput" required minlength="6" value="${esc(d.pass || 'Coord@123')}" placeholder="Enter new password">
              </div>
              <button type="submit" class="btn sm gold" style="margin-bottom:2px;">Update Password</button>
            </div>
          </form>
        </div>
      `, async () => {});

      const btnCopy = document.getElementById('btnCopyCoordCreds');
      if (btnCopy) {
        btnCopy.onclick = () => {
          navigator.clipboard.writeText(shareText).then(() => {
            toast('Credentials copied! Ready to paste on WhatsApp/SMS.');
          });
        };
      }

      const btnModalDel = document.getElementById('btnModalDelCoord');
      if (btnModalDel) {
        btnModalDel.onclick = async () => {
          if (!confirm(`⚠️ WARNING: क्या आप सच में रीजनल कोऑर्डिनेटर '${d.name}' को डिलीट (Delete) करना चाहते हैं?\n\n- कोऑर्डिनेटर का खाता और पोर्टल लॉगिन तुरंत समाप्त हो जाएगा।\n- आवंटित केंद्रों से यह कोऑर्डिनेटर हट जाएगा।\n\nClick OK to confirm deletion.`)) return;
          await api(`/api/admin/coordinators/${id}`, { method: 'DELETE' });
          toast(`✓ Regional Coordinator '${d.name}' deleted successfully!`);
          document.getElementById('adminModalOverlay').style.display = 'none';
          await views.Coordinators();
        };
      }

      const pf = document.getElementById('resetCoordPassForm');
      if (pf) {
        pf.onsubmit = async (e) => {
          e.preventDefault();
          const newPass = document.getElementById('newCoordPassInput').value.trim();
          if (!newPass || newPass.length < 6) return alert('Password must be at least 6 characters');
          await api(`/api/admin/coordinators/${id}/set-password`, { method: 'POST', body: { password: newPass } });
          toast(`Coordinator password updated successfully to: ${newPass}`);
          document.getElementById('adminModalOverlay').style.display = 'none';
          await views.Coordinators();
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
      await post(`/api/certificates/${id}/decision`, { decision: 'approve', role: 'super_admin' });
      toast('✅ Certificate approved with Council Head Seal!');
    } else if (a === 'creject') {
      const r = ask('Rejection reason');
      if (!r) return;
      await post(`/api/certificates/${id}/decision`, { decision: 'reject', role: 'super_admin', reason: r });
    } else if (a === 'mapprove') {
      await post(`/api/marksheets/${id}/decision`, { decision: 'approve', role: 'super_admin' });
      toast('✅ Marksheet approved with Council Head Seal!');
    } else if (a === 'mreject') {
      const r = ask('Rejection reason');
      if (!r) return;
      await post(`/api/marksheets/${id}/decision`, { decision: 'reject', role: 'super_admin', reason: r });
    } else if (a === 'wallet_adj') {
      const amt = ask(`Enter amount in Rupees (₹) to credit to ${b.dataset.name}:`);
      if (!amt || isNaN(amt) || +amt <= 0) return;
      const note = ask('Enter note/reason (e.g. Offline Payment / Promotion credit):') || 'Head Office Balance Credit';
      await post(`/api/admin/wallets/${id}/adjust`, { kind: 'credit', amount_rupees: +amt, reason: note });
      toast(`Successfully credited ₹${amt} to centre wallet!`);
      show('Wallets');
      return;
    } else if (a === 'approve_topup') {
      const topupAmt = b.dataset.amount || '0';
      const cName = b.dataset.name || 'Centre';
      if (!confirm(`Are you sure you want to approve this offline top-up and credit ₹${topupAmt} directly to ${cName}'s wallet?`)) return;
      await api(`/api/admin/wallet-topups/${id}/approve`, { method: 'POST', body: {} });
      toast(`✅ Approved! ₹${topupAmt} successfully credited to ${cName}'s wallet.`);
      await views.Wallets();
      return;
    } else if (a === 'reject_topup') {
      const r = ask('Enter reason for rejecting this top-up request:') || 'UTR verification failed or payment not received';
      if (!r) return;
      await api(`/api/admin/wallet-topups/${id}/reject`, { method: 'POST', body: { reason: r } });
      toast('Top-up request rejected.');
      await views.Wallets();
      return;
    } else if (a === 'edit_headoffice_payment') {
      const { settings } = await api('/api/admin/headoffice-payment-settings');
      showHeadOfficePaymentSettingsModal(settings || {});
      return;
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
    } else if (a === 'view_coord_centres') {
      const coordName = b.dataset.name || 'Regional Coordinator';
      const coordId = +id;
      const coord = (V._coords || []).find(x => x.id === coordId);
      let centres = coord && coord.centres ? coord.centres : null;
      if (!centres) {
        try {
          const res = await api(`/api/admin/coordinators/${coordId}/centres`);
          centres = res.centres || [];
        } catch (_) {
          centres = [];
        }
      }
      showCoordinatorCentresModal(coordName, centres);
      return;
    } else if (a === 'view_coord_cert') {
      const { certificate } = await api(`/api/admin/coordinators/${id}/cert`);
      showAdminCoordCertModal(certificate);
      return;
    } else if (a === 'del_coord') {
      const cName = b.dataset.name || 'this coordinator';
      if (!confirm(`⚠️ WARNING: क्या आप सच में रीजनल कोऑर्डिनेटर '${cName}' को डिलीट (Delete) करना चाहते हैं?\n\n- कोऑर्डिनेटर का खाता और पोर्टल लॉगिन तुरंत समाप्त हो जाएगा।\n- आवंटित केंद्रों से यह कोऑर्डिनेटर हट जाएगा।\n\nClick OK to confirm deletion.`)) return;
      await api(`/api/admin/coordinators/${id}`, { method: 'DELETE' });
      toast(`✓ Regional Coordinator '${cName}' deleted successfully!`);
      await views.Coordinators();
      return;
    } else if (a === 'view_official_mrk') {
      let mrk = (window._adminMarksheets || []).find(x => x.id === +id);
      if (!mrk) {
        const res = await api('/api/admin/marksheets');
        mrk = (res.marksheets || []).find(x => x.id === +id) || { id: +id };
      }
      showAdminOfficialMarksheetModal(mrk);
      return;
    } else if (a === 'view_official_cert') {
      let cert = (window._adminCertificates || []).find(x => x.id === +id);
      if (!cert) {
        const res = await api('/api/admin/certificates');
        cert = (res.certificates || []).find(x => x.id === +id) || { id: +id };
      }
      showAdminOfficialCertModal(cert);
      return;
    }
    toast('Action completed');
    await views[current]();
  });
});

function showAdminCoordCertModal(cert) {
  const existing = $('#coordCertModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'coordCertModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto;';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:940px; width:100%; max-height:92vh; overflow-y:auto; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.3); position:relative;">
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
      <div id="printCertArea">
        ${window.OfficialTemplates && window.OfficialTemplates.renderCoordinatorAppointmentCertificateHtml ? window.OfficialTemplates.renderCoordinatorAppointmentCertificateHtml({ certificate: cert }) : 'Loading Certificate...'}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showCoordinatorCentresModal(coordName, centres) {
  const existing = document.getElementById('coordCentresModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'coordCentresModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;';

  const rowsHtml = (!centres || centres.length === 0) ? `
    <div style="text-align:center; padding:44px 20px; color:#64748b;">
      <div style="font-size:3.2rem; margin-bottom:10px;">🏫</div>
      <h3 style="font-size:1.15rem; margin:0 0 6px; color:#1e293b;">इस रीजनल कोऑर्डिनेटर के अंतर्गत कोई सेंटर संबद्ध नहीं है</h3>
      <p style="font-size:0.86rem; margin:0; color:#64748b;">No centres are currently affiliated under ${esc(coordName)}.</p>
    </div>
  ` : `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1; color:#1e293b;">
            <th style="padding:11px 14px;">Centre Code</th>
            <th style="padding:11px 14px;">Centre / Institute Name</th>
            <th style="padding:11px 14px;">Director &amp; Contacts</th>
            <th style="padding:11px 14px;">District / State</th>
            <th style="padding:11px 14px;">Affiliation Cert No</th>
            <th style="padding:11px 14px; text-align:center;">Status</th>
            <th style="padding:11px 14px; text-align:center;">Live Portal</th>
          </tr>
        </thead>
        <tbody>
          ${centres.map(c => `
            <tr style="border-bottom:1px solid #e2e8f0; transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
              <td style="padding:11px 14px; white-space:nowrap;">
                <code style="font-weight:800; color:#064e3b; background:#f0fdf4; padding:3px 8px; border-radius:4px; border:1px solid #bbf7d0; font-size:0.9rem;">${esc(c.centre_code)}</code>
              </td>
              <td style="padding:11px 14px;">
                <b style="color:#0f172a; font-size:0.95rem;">${esc(c.name)}</b>
                ${c.address ? `<div class="muted" style="font-size:0.78rem; margin-top:2px;">📍 ${esc(c.address)}</div>` : ''}
              </td>
              <td style="padding:11px 14px;">
                <div style="font-weight:700; color:#0a2a5e;">${esc(c.director_name || 'Centre Director')}</div>
                <div class="muted" style="font-size:0.78rem; line-height:1.4;">
                  📞 ${esc(c.phone || c.mobile || '—')}<br>
                  ✉️ ${esc(c.email || '—')}
                </div>
              </td>
              <td style="padding:11px 14px; white-space:nowrap;">
                <b>${esc(c.district || '')}</b><br>
                <span class="muted" style="font-size:0.8rem;">${esc(c.state || 'Uttar Pradesh')}</span>
              </td>
              <td style="padding:11px 14px; font-family:monospace; font-weight:700; color:#0369a1; font-size:0.84rem; white-space:nowrap;">
                ${esc(c.affiliation_cert_no || ('PESC/ATC/2026/' + c.centre_code))}
              </td>
              <td style="padding:11px 14px; text-align:center; white-space:nowrap;">
                <span class="badge ${c.status === 'active' ? 'Valid' : 'Pending'}">${esc(c.status || 'Active')}</span>
              </td>
              <td style="padding:11px 14px; text-align:center; white-space:nowrap;">
                <a href="https://${c.slug}.pescouncil.in" target="_blank" style="color:#0284c7; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:3px;">
                  ${esc(c.slug)} ↗
                </a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:1000px; max-width:96vw; max-height:88vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35);">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:18px 24px; background:linear-gradient(135deg, #071a33, #0a2a5e); color:#fff; border-bottom:3px solid #d4af37;">
        <div>
          <h3 style="margin:0; font-size:1.25rem; color:#fde047;">🏢 Affiliated Centres – Regional Coordinator: ${esc(coordName)}</h3>
          <p style="margin:4px 0 0; font-size:0.85rem; color:#cbd5e1;">Total <b>${(centres || []).length}</b> affiliated institute centre${(centres || []).length === 1 ? '' : 's'} under this coordinator's jurisdiction</p>
        </div>
        <button type="button" onclick="document.getElementById('coordCentresModal').remove()" style="background:none; border:none; color:#fde047; font-size:1.8rem; cursor:pointer; line-height:1; padding:0 6px;">✕</button>
      </div>
      <div style="padding:22px; overflow-y:auto; flex:1;">
        ${rowsHtml}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 22px; background:#f8fafc; border-top:1px solid #e2e8f0;">
        <span class="muted" style="font-size:0.82rem;">Council Head Office Master Jurisdiction Control</span>
        <button type="button" class="btn alt" onclick="document.getElementById('coordCentresModal').remove()">Close</button>
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

  let courseSubs = [];
  try {
    courseSubs = typeof (course && course.subjects) === 'string' ? JSON.parse(course.subjects || '[]') : ((course && course.subjects) || (res && res.subjects) || []);
  } catch (_) { courseSubs = []; }

  if (!Object.keys(curData.yearly).length) {
    if (Array.isArray(courseSubs) && courseSubs.length > 0) {
      curData.yearly = {
        'Annual Examination': courseSubs.map((s, idx) => ({
          code: (typeof s === 'object' && s.code) ? s.code : `${cCode}-Y${101 + idx}`,
          name: (typeof s === 'object' && s.name) ? s.name : String(s),
          theory: (typeof s === 'object' && (s.theory || s.max_theory)) ? (+s.theory || +s.max_theory) : 45,
          practical: (typeof s === 'object' && (s.practical || s.max_practical)) ? (+s.practical || +s.max_practical) : 45,
          max_marks: (typeof s === 'object' && (s.max_marks || s.total_max)) ? (+s.max_marks || +s.total_max) : 100
        }))
      };
    } else {
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

        let allSubs = [];
        const termsArr = Object.values(curData[activeEval] || curData.yearly || {});
        termsArr.forEach(arr => {
          if (Array.isArray(arr)) {
            arr.forEach(s => {
              if (s && s.name && !allSubs.some(x => x.name === s.name)) {
                allSubs.push({
                  code: s.code || `${cCode}-${allSubs.length + 1}`,
                  name: s.name,
                  max_theory: +s.theory || 70,
                  max_practical: +s.practical || 30,
                  total_max: +s.max_marks || 100
                });
              }
            });
          }
        });

        try {
          await api(`/api/admin/courses/${courseId}/curriculum`, {
            method: 'POST',
            body: {
              curriculum: curData,
              subjects: allSubs,
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

// Official Marksheet View & Print Modal matching Exact Specification
async function showAdminOfficialMarksheetModal(mrk) {
  const existing = document.getElementById('officialMarksheetModal');
  if (existing) existing.remove();

  await window.ensureAuthoritiesLoaded(true);

  let m = mrk;
  if (!m.subjects || !m.student_name) {
    try {
      const res = await api('/api/admin/marksheets');
      const found = (res.marksheets || []).find(x => x.id === mrk.id);
      if (found) m = found;
    } catch (_) {}
  }

  let subs = [];
  try {
    subs = typeof m.subjects === 'string' ? JSON.parse(m.subjects || '[]') : (m.subjects || []);
  } catch (_) { subs = []; }

  const studentCode = m.student_code || m.roll_no || 'PESC-26-00008';
  const rollNo = m.roll_no || studentCode;
  const marksheetNo = m.marksheet_no || `PESC/MRK/2026/${String(m.id || 1).padStart(4, '0')}`;
  const issueDateStr = m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '04-10-2026';

  const modal = document.createElement('div');
  modal.id = 'officialMarksheetModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto;';
  
  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:940px; width:100%; max-height:94vh; overflow-y:auto; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.35);">
      <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e;">Official Statement of Marks (अंक तालिका)</h3>
          <span class="muted" style="font-size:0.85rem;">Document: <b>${esc(marksheetNo)}</b> · Candidate: <b>${esc(m.student_name || 'Candidate')}</b></span>
        </div>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn sm" style="background:#d97706; color:#fff; font-weight:800;" onclick="openAdminEditMarksheetModal(${m.id})">✏️ Edit Marksheet &amp; Marks</button>
          <button type="button" class="btn gold sm" onclick="window.print()" style="font-weight:800;">🖨️ Print / Save PDF</button>
          <button type="button" class="btn danger sm" onclick="document.getElementById('officialMarksheetModal').remove()">✕ Close</button>
        </div>
      </div>

      <!-- Marksheet Printable Page Container with Exact Council Framing -->
      <div id="printOfficialMarksheetArea" style="background:#ffffff; border:6px double #000000; outline:2px solid #000000; outline-offset:4px; padding:28px 36px; color:#000000; font-family:'Segoe UI', Arial, sans-serif; position:relative; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.04; pointer-events:none; font-size:20rem; font-weight:900; color:#0a2a5e;">
          PESC
        </div>

        <!-- Prominent Top Centre Header: Centre Name at Top as required by Client -->
        <div style="text-align:center; margin-bottom:14px; padding:16px 20px 12px; background:linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%); border:3px solid #047857; border-radius:10px; box-shadow:0 3px 12px rgba(4,120,87,0.12);">
          <div style="font-size:0.8rem; font-weight:900; color:#15803d; letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">
            ★ AUTHORISED STUDY CENTRE &amp; EXAMINATION CENTRE ★
          </div>
          <div style="font-size:2.2rem; font-weight:900; color:#064e3b; font-family:'Outfit', Arial, sans-serif; letter-spacing:1px; line-height:1.2; text-transform:uppercase;">
            ${esc(m.centre_name || 'ARYAVART INSTITUTE OF TECHNOLOGY & MANAGEMENT')}
          </div>
          <div style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-top:4px;">
            CENTRE CODE: <span style="font-family:monospace; color:#065f46; font-weight:900; background:#dcfce7; padding:2px 10px; border-radius:4px; border:1px solid #86efac;">${esc(m.centre_code || 'PESC00001')}</span>
            &nbsp;·&nbsp; CAMPUS: <span>${esc(m.centre_address || (m.district ? `${m.district}, ${m.state}` : 'Uttar Pradesh, India'))}</span>
          </div>
          <div style="font-size:0.78rem; font-weight:800; color:#047857; letter-spacing:0.8px; text-transform:uppercase; margin-top:5px; border-top:1px dashed #cbd5e1; padding-top:4px;">
            CONDUCTED UNDER THE AEGIS OF PURVANCHAL EDUCATION AND SKILL COUNCIL (GOVT. REGD. TRUST/2025/5/IV/299)
          </div>
        </div>

        <!-- Registration & Document Details Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.84rem; font-weight:800; color:#000000; text-align:left; line-height:1.55; margin-bottom:12px; background:rgba(248,250,252,0.92); padding:8px 14px; border-radius:6px; border:1.5px solid #cbd5e1;">
          <div>
            <div><b>REGD. NO. (COUNCIL):</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">TRUST/2025/5/IV/299</span></div>
            <div><b>Student Reg. No:</b> <span style="font-family:monospace; font-weight:900; color:#064e3b;">${esc(studentCode)}</span></div>
            <div><b>Roll Number:</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">${esc(rollNo)}</span></div>
          </div>
          <div style="text-align:right;">
            <div><b>Document Ref No:</b> <span style="font-family:monospace; font-weight:900; color:#072a60;">${esc(marksheetNo)}</span></div>
            <div><b>Date of Issue (तिथि):</b> <span style="font-weight:900; color:#047857;">${esc(issueDateStr)}</span></div>
            <div><b>Board Scheme:</b> <span style="font-weight:900; color:#b45309;">Autonomous National Board</span></div>
          </div>
        </div>

        <!-- Marksheet Title Box -->
        <div style="text-align:center; margin:10px 0 14px;">
          <div style="display:inline-block; border:2px solid #000000; padding:4px 24px; background:#f8fafc; font-weight:900; font-size:1.15rem; letter-spacing:1px; text-transform:uppercase;">
            STATEMENT OF MARKS / अंक तालिका
          </div>
          <div style="font-size:0.88rem; font-weight:800; color:#000000; margin-top:4px;">
            ${esc(m.term || 'ANNUAL EXAMINATION')} (${esc(m.evaluation_type === 'semester' ? 'SEMESTER SYSTEM' : 'ANNUAL SCHEME')})
          </div>
        </div>

        <!-- Candidate & Course Details Grid -->
        <div style="border:1.5px solid #000000; padding:10px 14px; margin-bottom:14px; font-size:0.86rem; line-height:1.6; background:#fff;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px;">
            <div><b>Candidate's Name (परीक्षार्थी का नाम):</b> <span style="text-transform:uppercase; font-weight:900;">${esc(m.student_name || 'Candidate')}</span></div>
            <div><b>Father's / Husband's Name:</b> <span style="text-transform:uppercase; font-weight:800;">${esc(m.father_name || 'Guardian')}</span></div>
            <div><b>Course Name (पाठ्यक्रम):</b> <span style="font-weight:900; color:#0a2a5e;">${esc(m.course_name || 'Diploma Course')}</span></div>
            <div><b>Session / Batch:</b> <span style="font-weight:800;">${esc(m.exam_session || '2026-27')}</span></div>
            <div style="grid-column:1 / -1;"><b>Study / Examination Centre:</b> <span style="font-weight:800;">${esc(m.centre_name || 'Accredited Study Centre')} (${esc(m.centre_code || 'PESC001')})</span></div>
          </div>
        </div>

        <!-- Marks Table -->
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem; margin-bottom:14px; border:1.5px solid #000000; text-align:center;">
          <thead>
            <tr style="background:#f1f5f9; border-bottom:1.5px solid #000000; font-weight:900;">
              <th rowspan="2" style="border:1px solid #000000; padding:6px 4px; width:45px;">PAPER CODE</th>
              <th rowspan="2" style="border:1px solid #000000; padding:6px 8px; text-align:left;">SUBJECT / MODULE TITLE</th>
              <th colspan="2" style="border:1px solid #000000; padding:4px;">THEORY</th>
              <th colspan="2" style="border:1px solid #000000; padding:4px;">PRACTICAL</th>
              <th colspan="2" style="border:1px solid #000000; padding:4px;">TOTAL</th>
              <th rowspan="2" style="border:1px solid #000000; padding:6px 4px; width:65px;">RESULT</th>
            </tr>
            <tr style="background:#f8fafc; border-bottom:1.5px solid #000000; font-size:0.75rem;">
              <th style="border:1px solid #000000; padding:4px; width:55px;">MAX</th>
              <th style="border:1px solid #000000; padding:4px; width:55px;">OBT</th>
              <th style="border:1px solid #000000; padding:4px; width:55px;">MAX</th>
              <th style="border:1px solid #000000; padding:4px; width:55px;">OBT</th>
              <th style="border:1px solid #000000; padding:4px; width:55px;">MAX</th>
              <th style="border:1px solid #000000; padding:4px; width:55px;">OBT</th>
            </tr>
          </thead>
          <tbody>
            ${subs.map((sub, idx) => {
              const thMax = sub.max_theory !== undefined ? sub.max_theory : 70;
              const thObt = sub.obt_theory !== undefined ? sub.obt_theory : 58;
              const prMax = sub.max_practical !== undefined ? sub.max_practical : 30;
              const prObt = sub.obt_practical !== undefined ? sub.obt_practical : 26;
              const totMax = sub.total_max !== undefined ? sub.total_max : (thMax + prMax);
              const totObt = sub.total_obt !== undefined ? sub.total_obt : (thObt + prObt);
              const isPass = totObt >= Math.round(totMax * 0.33);

              return `
                <tr style="border-bottom:1px solid #000000;">
                  <td style="border:1px solid #000000; padding:5px 4px; font-family:monospace; font-weight:800;">${esc(sub.code || `SUB0${idx+1}`)}</td>
                  <td style="border:1px solid #000000; padding:5px 8px; text-align:left; font-weight:700;">${esc(sub.name || 'Subject')}</td>
                  <td style="border:1px solid #000000; padding:5px 4px;">${thMax}</td>
                  <td style="border:1px solid #000000; padding:5px 4px; font-weight:800;">${thObt}</td>
                  <td style="border:1px solid #000000; padding:5px 4px;">${prMax}</td>
                  <td style="border:1px solid #000000; padding:5px 4px; font-weight:800;">${prObt}</td>
                  <td style="border:1px solid #000000; padding:5px 4px; font-weight:800;">${totMax}</td>
                  <td style="border:1px solid #000000; padding:5px 4px; font-weight:900; color:#0a2a5e;">${totObt}</td>
                  <td style="border:1px solid #000000; padding:5px 4px; font-weight:900; color:${isPass ? '#15803d' : '#b91c1c'};">${isPass ? 'PASS' : 'FAIL'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f1f5f9; font-weight:900; border-top:1.5px solid #000000; font-size:0.85rem;">
              <td colspan="6" style="border:1px solid #000000; padding:8px 12px; text-align:right;">GRAND TOTAL (पूर्णांक एवं प्राप्तांक):</td>
              <td style="border:1px solid #000000; padding:8px 4px;">${m.total_max || 100}</td>
              <td style="border:1px solid #000000; padding:8px 4px; color:#0a2a5e; font-size:0.95rem;">${m.total_obtained || 84}</td>
              <td style="border:1px solid #000000; padding:8px 4px; color:#15803d;">${m.result || 'PASS'}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Result Summary Box -->
        <div style="border:1.5px solid #000000; padding:8px 14px; margin-bottom:12px; display:flex; justify-content:space-around; align-items:center; font-size:0.9rem; font-weight:900; background:#f8fafc;">
          <div>PERCENTAGE: <span style="color:#047857; font-size:1.05rem;">${m.percentage || 84}%</span></div>
          <div>GRADE: <span style="color:#0a2a5e; font-size:1.05rem;">${esc(m.grade || 'A+')}</span></div>
          <div>FINAL RESULT: <span style="color:#15803d; font-size:1.05rem;">${esc(m.result === 'PASS' ? 'PASSED / FIRST DIVISION' : (m.result || 'PASSED'))}</span></div>
        </div>

        <!-- Official Council Footer -->
        ${renderOfficialCouncilFooter({
          centreCode: m.centre_code || 'PESC001',
          directorName: m.centre_owner || 'Study Centre Director',
          qrUrl: `https://pescouncil.in/verify`,
          authorities: window._councilAuthorities
        })}

      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Official Certificate View & Print Modal matching Exact Specification
async function showAdminOfficialCertModal(cert) {
  const existing = document.getElementById('officialCertModal');
  if (existing) existing.remove();

  await window.ensureAuthoritiesLoaded(true);

  let c = cert;
  if (!c.student_name || !c.course_name) {
    try {
      const res = await api('/api/admin/certificates');
      const found = (res.certificates || []).find(x => x.id === cert.id);
      if (found) c = found;
    } catch (_) {}
  }

  const studentCode = c.student_code || c.roll_no || 'PESC-26-00008';
  const rollNo = c.roll_no || studentCode;
  const certNo = c.cert_no || `PESC/CERT/2026/${String(c.id || 1).padStart(4, '0')}`;
  const issueDateStr = c.issued_at || c.created_at ? new Date(c.issued_at || c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '04-10-2026';
  const verifyUrl = `https://pescouncil.in/verify/${c.token || ''}`;

  const modal = document.createElement('div');
  modal.id = 'officialCertModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto;';

  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:960px; width:100%; max-height:94vh; overflow-y:auto; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.35);">
      <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e;">Official Passing Certificate (प्रमाण-पत्र)</h3>
          <span class="muted" style="font-size:0.85rem;">Certificate No: <b>${esc(certNo)}</b> · Candidate: <b>${esc(c.student_name || 'Candidate')}</b></span>
        </div>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn sm" style="background:#d97706; color:#fff; font-weight:800;" onclick="openAdminEditCertModal(${c.id})">✏️ Edit Certificate</button>
          <button type="button" class="btn gold sm" onclick="window.print()" style="font-weight:800;">🖨️ Print / Save PDF</button>
          <a href="${verifyUrl}" target="_blank" class="btn alt sm" style="font-weight:700;">🔍 Public Verification</a>
          <button type="button" class="btn danger sm" onclick="document.getElementById('officialCertModal').remove()">✕ Close</button>
        </div>
      </div>

      <!-- Certificate Printable Container with Elegant Council Borders -->
      <div id="printOfficialCertArea" style="background:#ffffff; border:8px double #d4af37; outline:3px solid #0a2a5e; outline-offset:6px; border-radius:8px; padding:36px 44px; color:#000000; font-family:'Segoe UI', Arial, sans-serif; position:relative; box-shadow:0 12px 36px rgba(212,175,55,0.18); text-align:center;">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.04; pointer-events:none; font-size:24rem; font-weight:900; color:#0a2a5e;">
          PESC
        </div>

        <!-- Official Council Header (Exact 6-Line Text Specification) -->
        ${renderOfficialCouncilHeader({
          studentCode: studentCode,
          rollNo: rollNo,
          refNo: certNo,
          issueDate: issueDateStr
        })}

        <!-- Certificate Title Heading -->
        <div style="margin:16px 0 20px;">
          <div style="font-size:2.2rem; font-weight:900; color:#0a2a5e; font-family:'Times New Roman', Times, serif; letter-spacing:1.5px; text-transform:uppercase;">
            DIPLOMA / PASSING CERTIFICATE
          </div>
          <div style="font-size:1.25rem; font-weight:800; color:#b45309; margin-top:2px;">
            (प्रमाण-पत्र)
          </div>
        </div>

        <!-- Body Citation Text -->
        <div style="font-size:1.08rem; line-height:2.0; color:#0f172a; max-width:820px; margin:0 auto 20px; text-align:center;">
          This is to certify that &nbsp;<b style="font-size:1.35rem; color:#0a2a5e; border-bottom:2px solid #d4af37; padding:0 8px;">${esc(c.student_name || 'Candidate')}</b><br>
          Son / Daughter / Wife of &nbsp;<b style="font-size:1.15rem; color:#0f172a; border-bottom:1px solid #94a3b8; padding:0 6px;">${esc(c.father_name || 'Guardian')}</b><br>
          Enrolment / Reg. No: <b style="font-family:monospace; color:#047857;">${esc(studentCode)}</b> &nbsp;&nbsp;|&nbsp;&nbsp; Roll No: <b style="font-family:monospace; color:#047857;">${esc(rollNo)}</b><br>
          having successfully completed the prescribed curriculum and passed the examination for
          <div style="margin:10px 0;">
            <span style="font-size:1.45rem; font-weight:900; color:#047857; background:#f0fdf4; border:1.5px solid #86efac; border-radius:6px; padding:6px 20px; display:inline-block; letter-spacing:0.5px;">
              ${esc(c.course_name || 'Vocational Diploma Program')}
            </span>
          </div>
          with Grade <b style="color:#0a2a5e; font-size:1.25rem;">${esc(c.grade || 'A+')}</b> in <b style="color:#0f172a;">${esc(c.term || 'Annual Examination')}</b> from Authorized Study Centre
          <div style="font-weight:800; color:#0a2a5e; margin-top:4px;">
            ${esc(c.centre_name || 'Recognized Council Centre')} (${esc(c.centre_code || 'PESC001')})
          </div>
        </div>

        <!-- Official Council Footer -->
        ${renderOfficialCouncilFooter({
          centreCode: c.centre_code || 'PESC001',
          directorName: c.centre_owner || 'Study Centre Director',
          qrUrl: verifyUrl,
          authorities: window._councilAuthorities
        })}

      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Administrative Marksheet & Subject Marks Editor Modal (Seals & Signatures Permanently Locked)
window.openAdminEditMarksheetModal = async function(marksheetId) {
  const existing = document.getElementById('adminEditMarksheetModal');
  if (existing) existing.remove();

  let mrk = null;
  try {
    const res = await api('/api/admin/marksheets');
    mrk = (res.marksheets || []).find(x => x.id === marksheetId || x.student_id === marksheetId);
  } catch (_) {}

  if (!mrk) {
    toast('Marksheet not found', false);
    return;
  }

  let subs = [];
  try {
    subs = typeof mrk.subjects === 'string' ? JSON.parse(mrk.subjects || '[]') : (mrk.subjects || []);
  } catch (_) { subs = []; }

  if (!subs.length) {
    subs = [
      { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_theory: 45, obt_theory: 37, max_practical: 45, obt_practical: 39 },
      { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_theory: 44, obt_theory: 36, max_practical: 46, obt_practical: 40 },
      { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_theory: 43, obt_theory: 35, max_practical: 47, obt_practical: 40 },
      { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_theory: 44, obt_theory: 36, max_practical: 46, obt_practical: 40 },
      { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_theory: 45, obt_theory: 37, max_practical: 45, obt_practical: 39 },
      { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_theory: 46, obt_theory: 38, max_practical: 46, obt_practical: 40 }
    ];
  }

  const modal = document.createElement('div');
  modal.id = 'adminEditMarksheetModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:16px; overflow-y:auto;';

  modal.innerHTML = `
    <div style="background:#ffffff; border-radius:14px; max-width:880px; width:100%; max-height:92vh; overflow-y:auto; padding:24px; box-shadow:0 25px 60px rgba(0,0,0,0.4);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1.5px solid #e2e8f0; padding-bottom:10px;">
        <div>
          <h3 style="margin:0; color:#072a60; font-size:1.35rem;">✏️ Edit Marksheet Details &amp; Subject Marks</h3>
          <span class="muted" style="font-size:0.85rem;">Document: <b>${esc(mrk.marksheet_no || 'PESC/MRK')}</b> &bull; Candidate: <b>${esc(mrk.student_name)}</b></span>
        </div>
        <button type="button" class="btn danger sm" onclick="document.getElementById('adminEditMarksheetModal').remove()">✕ Close</button>
      </div>

      <!-- Security Notice: Signatures & Seals Locked -->
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:10px 14px; margin-bottom:16px; font-size:0.86rem; color:#14532d; display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.4rem;">🔒</span>
        <div>
          <b>Official Council Security Guard:</b> Signatures and Official Seals are permanently locked to verified credentials and cannot be edited in documents. All student particulars and subject marks can be updated below.
        </div>
      </div>

      <form id="adminEditMrkForm">
        <!-- Header & Authority Customization Box -->
        <div style="background:#f8fafc; border:1.5px solid #0284c7; border-radius:10px; padding:14px; margin-bottom:16px;">
          <h4 style="margin:0 0 10px; color:#072a60; font-size:0.95rem; display:flex; align-items:center; gap:8px;">
            🏛️ Authority Header &amp; Scheme Settings (शीर्षक व योजना चयन)
          </h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px;">
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Header Authority (शीर्षक किसके नाम से रहेगा) *</label>
              <select name="header_type" id="adminMrkHeaderType" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
                <option value="council" ${mrk.header_type !== 'centre' ? 'selected' : ''}>Council Header (परिषद के नाम से - Purvanchal Education &amp; Skill Council)</option>
                <option value="centre" ${mrk.header_type === 'centre' ? 'selected' : ''}>Centre Header (सेंटर / संस्थान के नाम से)</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Examination Scheme (परीक्षा योजना / प्रकार) *</label>
              <select name="scheme" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
                <option value="annual" ${mrk.scheme === 'annual' || (!mrk.scheme && mrk.evaluation_type !== 'semester') ? 'selected' : ''}>Annual Scheme (Singhal / वार्षिक)</option>
                <option value="single_semester" ${mrk.scheme === 'single_semester' || (!mrk.scheme && mrk.evaluation_type === 'semester') ? 'selected' : ''}>Single Semester (एकल सेमेस्टर)</option>
                <option value="double_semester" ${mrk.scheme === 'double_semester' ? 'selected' : ''}>Double Semester (दोहरा सेमेस्टर)</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Main Header Title (मुख्य नाम) *</label>
              <input name="header_title" id="adminMrkHeaderTitle" value="${esc(mrk.header_title || 'Purvanchal Education & Skill Council')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Hindi Header Title (हिंदी नाम) *</label>
              <input name="header_hindi" id="adminMrkHeaderHindi" value="${esc(mrk.header_hindi || 'पूर्वांचल एजुकेशन एंड स्किल काउंसिल')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
            </div>
            <div style="grid-column:1 / -1;">
              <label style="font-size:0.82rem; font-weight:700;">Subtitle / Authority Subheading</label>
              <input name="header_subtitle" id="adminMrkHeaderSubtitle" value="${esc(mrk.header_subtitle || 'An Autonomous Body Established Under The Aegis Of Govt. Act / Registered Under Section 8 Of MCA, Govt. Of India')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre English Name (संस्थान का नाम - English)</label>
              <input name="centre_name" value="${esc(mrk.centre_name || '')}" placeholder="e.g. Aryavart Institute of Technology" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre Hindi Name (संस्थान का नाम - हिंदी)</label>
              <input name="centre_name_hi" value="${esc(mrk.centre_name_hi || '')}" placeholder="उदा. आर्यावर्त इंस्टिट्यूट ऑफ़ टेक्नोलॉजी" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Council Address (परिषद कार्यालय पता)</label>
              <input name="council_address" value="${esc(mrk.council_address || 'Head Office: Gorakhpur / Varanasi, Uttar Pradesh - 273001')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre Office Address (संस्थान केंद्र पता)</label>
              <input name="centre_address" value="${esc(mrk.centre_address || '')}" placeholder="Authorized Study & Exam Centre Address" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Candidate's Name (परीक्षार्थी का नाम) *</label>
            <input name="student_name" value="${esc(mrk.student_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Father's / Husband's Name *</label>
            <input name="father_name" value="${esc(mrk.father_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Mother's Name</label>
            <input name="mother_name" value="${esc(mrk.mother_name || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Roll Number *</label>
            <input name="roll_no" value="${esc(mrk.roll_no || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Student Reg. Code</label>
            <input name="student_code" value="${esc(mrk.student_code || mrk.roll_no || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Course Name *</label>
            <input name="course_name" value="${esc(mrk.course_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Academic Session / Batch</label>
            <input name="exam_session" value="${esc(mrk.exam_session || '2026-27')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Term / Scheme</label>
            <input name="term" value="${esc(mrk.term || 'Annual Examination')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Evaluation Type</label>
            <select name="evaluation_type" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
              <option value="annual" ${mrk.evaluation_type !== 'semester' ? 'selected' : ''}>Annual Scheme (वार्षिक)</option>
              <option value="semester" ${mrk.evaluation_type === 'semester' ? 'selected' : ''}>Semester System (सेमेस्टर)</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Document Ref / Marksheet No</label>
            <input name="marksheet_no" value="${esc(mrk.marksheet_no || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Date of Issue</label>
            <input name="issue_date" value="${esc(mrk.issue_date || mrk.issued_at || new Date().toISOString().slice(0,10))}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Final Result Text</label>
            <input name="result" id="mrkEditResult" value="${esc(mrk.result || 'PASS')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-weight:700;">
          </div>
        </div>

        <h4 style="margin:16px 0 8px; color:#072a60;">📚 Subject Marks &amp; Papers:</h4>
        <div style="overflow-x:auto; margin-bottom:16px;">
          <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:center; border:1px solid #cbd5e1;">
            <thead>
              <tr style="background:#f1f5f9; font-weight:800;">
                <th style="padding:6px; border:1px solid #cbd5e1; width:15%;">Code</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:40%; text-align:left;">Subject Title</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:11%;">Th Max</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:11%;">Th Obt</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:11%;">Pr Max</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:11%;">Pr Obt</th>
              </tr>
            </thead>
            <tbody id="mrkEditSubsBody">
              ${subs.map((s, idx) => `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input class="sub-code" value="${esc(s.code || `SUB0${idx+1}`)}" style="width:100%; padding:4px; font-family:monospace; border:1px solid #cbd5e1; border-radius:4px; text-align:center;"></td>
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input class="sub-name" value="${esc(s.name || `Subject ${idx+1}`)}" style="width:100%; padding:4px; border:1px solid #cbd5e1; border-radius:4px;"></td>
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" class="sub-th-max" value="${s.max_theory !== undefined ? s.max_theory : 50}" style="width:100%; padding:4px; text-align:center; border:1px solid #cbd5e1; border-radius:4px;"></td>
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" class="sub-th-obt" value="${s.obt_theory !== undefined ? s.obt_theory : 38}" style="width:100%; padding:4px; text-align:center; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;"></td>
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" class="sub-pr-max" value="${s.max_practical !== undefined ? s.max_practical : 50}" style="width:100%; padding:4px; text-align:center; border:1px solid #cbd5e1; border-radius:4px;"></td>
                  <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" class="sub-pr-obt" value="${s.obt_practical !== undefined ? s.obt_practical : 40}" style="width:100%; padding:4px; text-align:center; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Calculated Summary Box -->
        <div style="background:#f8fafc; border:1.5px solid #0284c7; border-radius:8px; padding:10px 16px; margin-bottom:18px; display:flex; justify-content:space-around; align-items:center; font-size:0.92rem; font-weight:800;">
          <div>Grand Max: <span id="lblGrandMax" style="color:#0f172a;">--</span></div>
          <div>Grand Obt: <span id="lblGrandObt" style="color:#0284c7;">--</span></div>
          <div>Percentage: <span id="lblPct" style="color:#16a34a;">--%</span></div>
          <div>Grade: <span id="lblGrade" style="color:#7c3aed;">--</span></div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn alt" onclick="document.getElementById('adminEditMarksheetModal').remove()">Cancel</button>
          <button type="submit" class="btn gold" style="font-weight:800; padding:10px 24px;">💾 Save Changes &amp; Update Marksheet</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const calcScore = () => {
    let totMax = 0, totObt = 0;
    modal.querySelectorAll('#mrkEditSubsBody tr').forEach(tr => {
      const thM = +tr.querySelector('.sub-th-max').value || 0;
      const thO = +tr.querySelector('.sub-th-obt').value || 0;
      const prM = +tr.querySelector('.sub-pr-max').value || 0;
      const prO = +tr.querySelector('.sub-pr-obt').value || 0;
      totMax += (thM + prM);
      totObt += (thO + prO);
    });
    const pct = totMax > 0 ? Math.round((totObt / totMax) * 1000) / 10 : 0;
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'D';
    modal.querySelector('#lblGrandMax').textContent = totMax;
    modal.querySelector('#lblGrandObt').textContent = totObt;
    modal.querySelector('#lblPct').textContent = pct + '%';
    modal.querySelector('#lblGrade').textContent = grade;
    return { totMax, totObt, pct, grade };
  };

  modal.querySelectorAll('#mrkEditSubsBody input').forEach(inp => inp.oninput = calcScore);
  calcScore();

  modal.querySelector('#adminEditMrkForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { totMax, totObt, pct, grade } = calcScore();

    const subsPayload = [];
    modal.querySelectorAll('#mrkEditSubsBody tr').forEach(tr => {
      const code = tr.querySelector('.sub-code').value.trim();
      const name = tr.querySelector('.sub-name').value.trim();
      const max_theory = +tr.querySelector('.sub-th-max').value || 0;
      const obt_theory = +tr.querySelector('.sub-th-obt').value || 0;
      const max_practical = +tr.querySelector('.sub-pr-max').value || 0;
      const obt_practical = +tr.querySelector('.sub-pr-obt').value || 0;
      subsPayload.push({
        code,
        name,
        max_theory,
        obt_theory,
        max_practical,
        obt_practical,
        total_max: max_theory + max_practical,
        total_obt: obt_theory + obt_practical
      });
    });

    const payload = {
      header_type: fd.get('header_type'),
      header_title: fd.get('header_title'),
      header_hindi: fd.get('header_hindi'),
      header_subtitle: fd.get('header_subtitle'),
      scheme: fd.get('scheme'),
      centre_name: fd.get('centre_name'),
      centre_name_hi: fd.get('centre_name_hi'),
      council_address: fd.get('council_address'),
      centre_address: fd.get('centre_address'),
      student_name: fd.get('student_name'),
      father_name: fd.get('father_name'),
      mother_name: fd.get('mother_name'),
      roll_no: fd.get('roll_no'),
      student_code: fd.get('student_code'),
      course_name: fd.get('course_name'),
      exam_session: fd.get('exam_session'),
      term: fd.get('term'),
      evaluation_type: fd.get('evaluation_type'),
      marksheet_no: fd.get('marksheet_no'),
      issue_date: fd.get('issue_date'),
      result: fd.get('result') || 'PASS',
      total_max: totMax,
      total_obtained: totObt,
      percentage: pct,
      grade: grade,
      subjects: subsPayload
    };

    try {
      const res = await api(`/api/admin/marksheets/${mrk.id}/edit`, {
        method: 'POST',
        body: payload
      });
      toast('Marksheet and marks updated successfully!');
      modal.remove();
      if (res && res.marksheet) {
        showAdminOfficialMarksheetModal(res.marksheet);
      }
    } catch (err) {
      alert('Error updating marksheet: ' + err.message);
    }
  };
};

// Administrative Certificate Editor Modal (Seals & Signatures Permanently Locked)
window.openAdminEditCertModal = async function(certId) {
  const existing = document.getElementById('adminEditCertModal');
  if (existing) existing.remove();

  let cert = null;
  try {
    const res = await api('/api/admin/certificates');
    cert = (res.certificates || []).find(x => x.id === certId || x.student_id === certId);
  } catch (_) {}

  if (!cert) {
    toast('Certificate not found', false);
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'adminEditCertModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:16px; overflow-y:auto;';

  modal.innerHTML = `
    <div style="background:#ffffff; border-radius:14px; max-width:760px; width:100%; max-height:92vh; overflow-y:auto; padding:24px; box-shadow:0 25px 60px rgba(0,0,0,0.4);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1.5px solid #e2e8f0; padding-bottom:10px;">
        <div>
          <h3 style="margin:0; color:#072a60; font-size:1.35rem;">✏️ Edit Certificate Details</h3>
          <span class="muted" style="font-size:0.85rem;">Certificate No: <b>${esc(cert.cert_no || 'PESC/CERT')}</b> &bull; Candidate: <b>${esc(cert.student_name)}</b></span>
        </div>
        <button type="button" class="btn danger sm" onclick="document.getElementById('adminEditCertModal').remove()">✕ Close</button>
      </div>

      <!-- Security Notice -->
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:10px 14px; margin-bottom:16px; font-size:0.86rem; color:#14532d; display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.4rem;">🔒</span>
        <div>
          <b>Official Council Security Guard:</b> Council seals, coordinator stamps, and signatures are permanently locked to authenticated records. All student particulars and certificate fields can be updated below.
        </div>
      </div>

      <form id="adminEditCertForm">
        <!-- Header & Authority Customization Box -->
        <div style="background:#f8fafc; border:1.5px solid #0284c7; border-radius:10px; padding:14px; margin-bottom:16px;">
          <h4 style="margin:0 0 10px; color:#072a60; font-size:0.95rem; display:flex; align-items:center; gap:8px;">
            🏛️ Authority Header &amp; Scheme Settings (शीर्षक व योजना चयन)
          </h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px;">
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Header Authority (शीर्षक किसके नाम से रहेगा) *</label>
              <select name="header_type" id="adminCertHeaderType" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
                <option value="council" ${cert.header_type !== 'centre' ? 'selected' : ''}>Council Header (परिषद के नाम से - Purvanchal Education &amp; Skill Council)</option>
                <option value="centre" ${cert.header_type === 'centre' ? 'selected' : ''}>Centre Header (सेंटर / संस्थान के नाम से)</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Examination Scheme (परीक्षा योजना / प्रकार) *</label>
              <select name="scheme" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
                <option value="annual" ${cert.scheme === 'annual' || (!cert.scheme && cert.evaluation_type !== 'semester') ? 'selected' : ''}>Annual Scheme (Singhal / वार्षिक)</option>
                <option value="single_semester" ${cert.scheme === 'single_semester' || (!cert.scheme && cert.evaluation_type === 'semester') ? 'selected' : ''}>Single Semester (एकल सेमेस्टर)</option>
                <option value="double_semester" ${cert.scheme === 'double_semester' ? 'selected' : ''}>Double Semester (दोहरा सेमेस्टर)</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Main Header Title (मुख्य नाम) *</label>
              <input name="header_title" id="adminCertHeaderTitle" value="${esc(cert.header_title || 'Purvanchal Education & Skill Council')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Hindi Header Title (हिंदी नाम) *</label>
              <input name="header_hindi" id="adminCertHeaderHindi" value="${esc(cert.header_hindi || 'पूर्वांचल एजुकेशन एंड स्किल काउंसिल')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
            </div>
            <div style="grid-column:1 / -1;">
              <label style="font-size:0.82rem; font-weight:700;">Subtitle / Authority Subheading</label>
              <input name="header_subtitle" id="adminCertHeaderSubtitle" value="${esc(cert.header_subtitle || 'An Autonomous Body Established Under The Aegis Of Govt. Act / Registered Under Section 8 Of MCA, Govt. Of India')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre English Name (संस्थान का नाम - English)</label>
              <input name="centre_name" value="${esc(cert.centre_name || '')}" placeholder="e.g. Aryavart Institute of Technology" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre Hindi Name (संस्थान का नाम - हिंदी)</label>
              <input name="centre_name_hi" value="${esc(cert.centre_name_hi || '')}" placeholder="उदा. आर्यावर्त इंस्टिट्यूट ऑफ़ टेक्नोलॉजी" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Council Address (परिषद कार्यालय पता)</label>
              <input name="council_address" value="${esc(cert.council_address || 'Head Office: Gorakhpur / Varanasi, Uttar Pradesh - 273001')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700;">Centre Office Address (संस्थान केंद्र पता)</label>
              <input name="centre_address" value="${esc(cert.centre_address || '')}" placeholder="Authorized Study & Exam Centre Address" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Candidate Name (परीक्षार्थी का नाम) *</label>
            <input name="student_name" value="${esc(cert.student_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Father's / Husband's Name *</label>
            <input name="father_name" value="${esc(cert.father_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Mother's Name</label>
            <input name="mother_name" value="${esc(cert.mother_name || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Roll Number *</label>
            <input name="roll_no" value="${esc(cert.roll_no || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Student Reg. Code</label>
            <input name="student_code" value="${esc(cert.student_code || cert.roll_no || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Course Name *</label>
            <input name="course_name" value="${esc(cert.course_name || '')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Session / Batch</label>
            <input name="exam_session" value="${esc(cert.exam_session || '2026-27')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Term / Scheme</label>
            <input name="term" value="${esc(cert.term || 'Annual Examination')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Grade</label>
            <input name="grade" value="${esc(cert.grade || 'A+')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-weight:700;">
          </div>
          <div>
            <label style="font-size:0.82rem; font-weight:700;">Certificate Ref No</label>
            <input name="cert_no" value="${esc(cert.cert_no || '')}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; font-family:monospace;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="font-size:0.82rem; font-weight:700;">Date of Issue</label>
            <input name="issue_date" value="${esc(cert.issued_at || cert.issue_date || new Date().toISOString().slice(0,10))}" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn alt" onclick="document.getElementById('adminEditCertModal').remove()">Cancel</button>
          <button type="submit" class="btn gold" style="font-weight:800; padding:10px 24px;">💾 Save Changes &amp; Update Certificate</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#adminEditCertForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      header_type: fd.get('header_type'),
      header_title: fd.get('header_title'),
      header_hindi: fd.get('header_hindi'),
      header_subtitle: fd.get('header_subtitle'),
      scheme: fd.get('scheme'),
      centre_name: fd.get('centre_name'),
      centre_name_hi: fd.get('centre_name_hi'),
      council_address: fd.get('council_address'),
      centre_address: fd.get('centre_address'),
      student_name: fd.get('student_name'),
      father_name: fd.get('father_name'),
      mother_name: fd.get('mother_name'),
      roll_no: fd.get('roll_no'),
      student_code: fd.get('student_code'),
      course_name: fd.get('course_name'),
      exam_session: fd.get('exam_session'),
      term: fd.get('term'),
      grade: fd.get('grade'),
      cert_no: fd.get('cert_no'),
      issue_date: fd.get('issue_date')
    };

    try {
      const res = await api(`/api/admin/certificates/${cert.id}/edit`, {
        method: 'POST',
        body: payload
      });
      toast('Certificate updated successfully!');
      modal.remove();
      if (res && res.certificate) {
        showAdminOfficialCertModal(res.certificate);
      }
    } catch (err) {
      alert('Error updating certificate: ' + err.message);
    }
  };
};

// Global Student Status Toggle Handler
window.toggleStudentStatus = async function(studentId, newStatus) {
  try {
    await api(`/api/admin/students/${studentId}/toggle-status`, {
      method: 'POST',
      body: { status: newStatus }
    });
    toast(`Student moved to ${newStatus === 'passout' ? 'Passout' : 'Active'} list successfully!`);
    await views.Students();
  } catch (err) {
    alert('Error updating student status: ' + err.message);
  }
};

// Redesigned Strategic Examination & Marksheet Issuance Console with Simultaneous Certificate Issuance
async function openAdminMarksheetIssueModal(studentId, studentName) {
  const existing = document.getElementById('marksheetDirectModal');
  if (existing) existing.remove();

  if (!window._currentStudents || !window._currentStudents.length) {
    const res = await api('/api/admin/students');
    window._currentStudents = res.students || [];
  }
  if (!window._adminCourses || !window._adminCourses.length) {
    const cr = await api('/api/admin/courses');
    window._adminCourses = cr.courses || [];
  }
  if (!window._adminCentres || !window._adminCentres.length) {
    const cn = await api('/api/admin/centres');
    window._adminCentres = cn.centres || [];
  }

  let s = (window._currentStudents || []).find(x => x.id === studentId);
  if (!s && studentId) {
    s = { id: studentId, name: studentName, course_name: 'DCA', student_code: 'PESC0001' };
  }

  const modal = document.createElement('div');
  modal.id = 'marksheetDirectModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; overflow-y:auto; backdrop-filter:blur(3px);';
  
  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:860px; width:100%; padding:26px; box-shadow:0 25px 50px rgba(0,0,0,0.3); max-height:92vh; overflow-y:auto; border:2px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:14px; margin-bottom:18px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e; font-size:1.35rem; display:flex; align-items:center; gap:8px;">
            🎓 Examination Evaluation &amp; Certification Console
          </h3>
          <span class="muted" style="font-size:0.86rem;">Official Examination Marksheet and Passing Certificate issuance with curriculum automation</span>
        </div>
        <button type="button" onclick="document.getElementById('marksheetDirectModal').remove()" style="background:none; border:none; font-size:1.8rem; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <form id="marksheetDirectForm">
        <!-- Candidate Picker (if not preselected) -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:18px;">
          <label style="font-weight:800; font-size:0.9rem; color:#0f172a; display:block; margin-bottom:8px;">1. Select Candidate (परीक्षार्थी चुनें) *</label>
          <select id="modalStudentSelect" name="student_id" required style="width:100%; padding:9px 12px; border:1.5px solid #0284c7; border-radius:6px; font-weight:700; font-size:0.92rem; background:#fff;">
            ${(window._currentStudents || []).map(stu => `
              <option value="${stu.id}" ${s && s.id === stu.id ? 'selected' : ''}>
                ${esc(stu.name)} · Roll/Code: ${esc(stu.student_code)} (${esc(stu.course_name || 'Course')}) · Centre: ${esc(stu.centre_code || '')}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Evaluation Scheme & Term Selector -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:18px;">
          <label style="font-weight:800; font-size:0.9rem; color:#0f172a; display:block; margin-bottom:10px;">2. Examination Evaluation Pattern (मूल्यांकन योजना) *</label>
          <div style="display:flex; gap:26px; flex-wrap:wrap; margin-bottom:14px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:#064e3b;">
              <input type="radio" name="evaluation_type" value="yearly" checked onchange="window.updateAdminModalCurriculum()">
              📅 Annual / Yearly Examination (वार्षिक परीक्षा)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:#0284c7;">
              <input type="radio" name="evaluation_type" value="semester" onchange="window.updateAdminModalCurriculum()">
              📚 Semester-wise Examination (सेमेस्टर आधारित परीक्षा)
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Examination Term / Stage *</label>
              <select name="term" id="adminModalTermSelect" onchange="window.updateAdminModalCurriculum()" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;">
                <option value="Annual">Annual Examination (वार्षिक परीक्षा)</option>
                <option value="1st Year">1st Year (प्रथम वर्ष)</option>
                <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
                <option value="Final Year">Final Year (अंतिम वर्ष)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Academic Exam Session *</label>
              <input name="exam_session" value="${esc(s ? s.session || '2026-27' : '2026-27')}" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
            </div>
          </div>
        </div>

        <!-- Subjects & Marks Dynamic Table -->
        <div style="margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="margin:0; color:#0a2a5e;">3. Subject Curriculum &amp; Examination Marks Entry:</h4>
            <span class="muted" style="font-size:0.8rem;">Auto-populated from Course Curriculum</span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.86rem; border:1.5px solid #cbd5e1;">
              <thead>
                <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1; color:#334155;">
                  <th style="padding:8px; text-align:left;">Subject Title (विषय)</th>
                  <th style="padding:8px; text-align:center; width:80px;">Max Th.</th>
                  <th style="padding:8px; text-align:center; width:90px;">Obt Th.</th>
                  <th style="padding:8px; text-align:center; width:80px;">Max Pr.</th>
                  <th style="padding:8px; text-align:center; width:90px;">Obt Pr.</th>
                  <th style="padding:8px; text-align:center; width:90px;">Total</th>
                </tr>
              </thead>
              <tbody id="adminDirectSubjectsTbody">
                <!-- Rendered dynamically -->
              </tbody>
              <tfoot>
                <tr style="background:#ecfdf5; font-weight:800; border-top:2px solid #a7f3d0; font-size:0.92rem;">
                  <td style="padding:10px 12px;">Grand Evaluation Score:</td>
                  <td colspan="4" style="padding:10px 12px; text-align:right;" id="adminGrandTotalDisplay">Total: 0 / 0 (0%)</td>
                  <td style="padding:10px 12px; text-align:center; color:#16a34a;" id="adminGradeDisplay">Grade: A+</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Simultaneous Issue Strategic Feature -->
        <div style="background:#fefce8; border:2px solid #fde047; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
          <label style="display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
            <input type="checkbox" name="issue_cert_also" id="chkIssueCertAlso" checked style="width:20px; height:20px; margin-top:2px;">
            <div>
              <b style="color:#854d0e; font-size:0.98rem; display:block;">📜 Simultaneously Issue National Passing Certificate (एक साथ पासिंग सर्टिफिकेट भी जारी करें)</b>
              <span style="font-size:0.84rem; color:#713f12; line-height:1.4; display:block; margin-top:2px;">
                Checking this box will automatically generate and issue the cryptographically verified Passing Certificate with Golden Seal, QR code &amp; permanent online verification in 1 click!
              </span>
            </div>
          </label>
        </div>

        <!-- Footer Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
          <button type="button" class="btn alt" onclick="document.getElementById('marksheetDirectModal').remove()">Cancel</button>
          
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn alt" id="btnPreviewMarksheet" style="font-weight:700; border:1px solid #0a2a5e; color:#0a2a5e;">
              👁️ Official Live Preview
            </button>
            <button type="submit" class="btn gold" style="font-weight:800; padding:10px 24px; font-size:0.98rem; box-shadow:0 4px 14px rgba(212,175,55,0.4);">
              ⚡ Authorize &amp; Issue Marksheet + Certificate
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  let activeSubjects = [];

  window.updateAdminModalCurriculum = () => {
    const sId = +document.getElementById('modalStudentSelect')?.value;
    const curStu = (window._currentStudents || []).find(x => x.id === sId) || (window._currentStudents || [])[0];
    if (!curStu) return;

    const co = (window._adminCourses || []).find(c => c.id === curStu.course_id) || window._adminCourses[0] || {};
    const evalType = document.querySelector('input[name="evaluation_type"]:checked')?.value || 'yearly';
    const termSelect = document.getElementById('adminModalTermSelect');

    let curData = {};
    try {
      curData = typeof co.curriculum === 'string' ? JSON.parse(co.curriculum || '{}') : (co.curriculum || {});
    } catch (_) {}

    if (evalType === 'semester') {
      const semTerms = Object.keys(curData.semester || {});
      const termsList = semTerms.length ? semTerms : ['Semester 1', 'Semester 2'];
      termSelect.innerHTML = termsList.map(t => `<option value="${t}">${t}</option>`).join('');
    } else {
      const yrTerms = Object.keys(curData.yearly || {});
      const termsList = yrTerms.length ? yrTerms : ['Annual', '1st Year', '2nd Year'];
      termSelect.innerHTML = termsList.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    const currentTerm = termSelect.value;
    let subs = [];
    if (evalType === 'semester' && curData.semester && curData.semester[currentTerm]) {
      subs = curData.semester[currentTerm];
    } else if (evalType === 'yearly' && curData.yearly && curData.yearly[currentTerm]) {
      subs = curData.yearly[currentTerm];
    } else {
      try {
        subs = typeof co.subjects === 'string' ? JSON.parse(co.subjects || '[]') : (co.subjects || []);
      } catch (_) {}
    }

    if (!subs || !subs.length) {
      subs = [
        { code: 'TH01', name: 'Information Technology Core Concepts', max_theory: 70, max_practical: 30, total_max: 100 },
        { code: 'TH02', name: 'Software Applications & Productive Tools', max_theory: 70, max_practical: 30, total_max: 100 },
        { code: 'PR01', name: 'Practical Assessment & Viva Voce', max_theory: 50, max_practical: 50, total_max: 100 }
      ];
    }

    activeSubjects = subs;
    const tbody = document.getElementById('adminDirectSubjectsTbody');
    if (!tbody) return;

    tbody.innerHTML = subs.map((sub, idx) => {
      const sCode = sub.code || `SUB${idx+1}`;
      const sName = sub.name || sub;
      const thMax = sub.theory || sub.max_theory || 70;
      const prMax = sub.practical || sub.max_practical || 30;
      const thObt = Math.round(thMax * 0.82);
      const prObt = Math.round(prMax * 0.86);

      return `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:8px 10px;">
            <b>${esc(sName)}</b>
            <span style="font-family:monospace; color:#0284c7; font-size:0.8rem; display:block;">Code: ${esc(sCode)}</span>
            <input type="hidden" name="sub_code_${idx}" value="${esc(sCode)}">
            <input type="hidden" name="sub_name_${idx}" value="${esc(sName)}">
          </td>
          <td style="padding:8px; text-align:center;">
            <input type="number" name="sub_max_th_${idx}" value="${thMax}" style="width:55px; text-align:center; padding:4px;" readonly>
          </td>
          <td style="padding:8px; text-align:center;">
            <input type="number" name="sub_obt_th_${idx}" value="${thObt}" min="0" max="${thMax}" style="width:60px; text-align:center; padding:4px; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;" onchange="window.recalcAdminTotal()" required>
          </td>
          <td style="padding:8px; text-align:center;">
            <input type="number" name="sub_max_pr_${idx}" value="${prMax}" style="width:55px; text-align:center; padding:4px;" readonly>
          </td>
          <td style="padding:8px; text-align:center;">
            <input type="number" name="sub_obt_pr_${idx}" value="${prObt}" min="0" max="${prMax}" style="width:60px; text-align:center; padding:4px; font-weight:700; border:1px solid #cbd5e1; border-radius:4px;" onchange="window.recalcAdminTotal()" required>
          </td>
          <td style="padding:8px; text-align:center; font-weight:800; color:#0a2a5e;" id="sub_tot_preview_${idx}">
            ${thObt + prObt}
          </td>
        </tr>
      `;
    }).join('');

    window.recalcAdminTotal();
  };

  window.recalcAdminTotal = () => {
    let totMax = 0, totObt = 0;
    activeSubjects.forEach((_, idx) => {
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
    if (disp) disp.textContent = `Total: ${totObt} / ${totMax} (${pct}%)`;
    const grd = document.getElementById('adminGradeDisplay');
    if (grd) grd.textContent = `Grade: ${grade}`;
  };

  const studentSelect = document.getElementById('modalStudentSelect');
  if (studentSelect) {
    studentSelect.onchange = () => window.updateAdminModalCurriculum();
  }

  // Initialize curriculum
  window.updateAdminModalCurriculum();

  // Preview Button Handler
  const btnPrev = document.getElementById('btnPreviewMarksheet');
  if (btnPrev) {
    btnPrev.onclick = () => {
      const sId = +document.getElementById('modalStudentSelect')?.value;
      const curStu = (window._currentStudents || []).find(x => x.id === sId) || {};
      const fd = new FormData(document.getElementById('marksheetDirectForm'));
      const evalType = fd.get('evaluation_type') || 'yearly';
      const term = fd.get('term') || 'Annual';
      const examSession = fd.get('exam_session') || '2026-27';

      let totMax = 0, totObt = 0;
      const previewSubs = activeSubjects.map((sub, idx) => {
        const thMax = +fd.get(`sub_max_th_${idx}`) || 70;
        const thObt = +fd.get(`sub_obt_th_${idx}`) || 0;
        const prMax = +fd.get(`sub_max_pr_${idx}`) || 30;
        const prObt = +fd.get(`sub_obt_pr_${idx}`) || 0;
        totMax += (thMax + prMax);
        totObt += (thObt + prObt);
        return {
          code: fd.get(`sub_code_${idx}`) || `SUB${idx+1}`,
          name: fd.get(`sub_name_${idx}`) || sub.name,
          max_theory: thMax,
          obt_theory: thObt,
          max_practical: prMax,
          obt_practical: prObt,
          total_max: thMax + prMax,
          total_obt: thObt + prObt
        };
      });

      const pct = totMax > 0 ? Math.round((totObt / totMax) * 1000) / 10 : 0;
      const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C';

      showAdminOfficialMarksheetModal({
        student_id: sId,
        student_name: curStu.name || 'Candidate',
        father_name: curStu.father_name || 'Guardian',
        student_code: curStu.student_code || 'PESC001',
        roll_no: curStu.student_code || 'PESC001',
        course_name: curStu.course_name || 'Diploma Course',
        centre_name: curStu.centre_name || 'Study Centre',
        centre_code: curStu.centre_code || 'PESC001',
        term,
        evaluation_type: evalType,
        exam_session: examSession,
        subjects: previewSubs,
        total_max: totMax,
        total_obtained: totObt,
        percentage: pct,
        grade,
        result: 'PASS'
      });
    };
  }

  // Form Submit Handler
  const formEl = document.getElementById('marksheetDirectForm');
  if (formEl) {
    formEl.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formEl);
      const sId = +fd.get('student_id');
      const evaluationType = fd.get('evaluation_type') || 'yearly';
      const term = fd.get('term') || 'Annual';
      const examSession = fd.get('exam_session') || '2026-27';
      const alsoCert = document.getElementById('chkIssueCertAlso')?.checked;

      let totalMax = 0, totalObtained = 0;
      const subjectsPayload = activeSubjects.map((sub, idx) => {
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

      // 1. Issue Marksheet
      const resM = await api('/api/admin/marksheets/direct-issue', {
        method: 'POST',
        body: {
          student_id: sId,
          evaluation_type: evaluationType,
          term: term,
          exam_session: examSession,
          subjects: subjectsPayload,
          total_max: totalMax,
          total_obtained: totalObtained
        }
      });

      // 2. If simultaneously checked, also issue Certificate
      let certMsg = '';
      if (alsoCert) {
        try {
          const resC = await api('/api/admin/certificates/direct-issue', {
            method: 'POST',
            body: {
              student_id: sId,
              evaluation_type: evaluationType,
              term: term
            }
          });
          certMsg = ` & Certificate (${resC.cert_no})`;
        } catch (cErr) {
          console.warn('Certificate auto-issue notice:', cErr);
        }
      }

      toast(`Official Marksheet (${resM.marksheet_no})${certMsg} successfully issued!`);
      document.getElementById('marksheetDirectModal').remove();
      
      if (typeof current !== 'undefined' && views[current]) {
        await views[current]();
      } else {
        await views.Marksheets();
      }
    };
  }
}

// Standalone Certificate Direct Issuance Modal
async function openAdminCertificateIssueModal(studentId, studentName) {
  const existing = document.getElementById('certDirectModal');
  if (existing) existing.remove();

  if (!window._currentStudents || !window._currentStudents.length) {
    const res = await api('/api/admin/students');
    window._currentStudents = res.students || [];
  }

  let s = (window._currentStudents || []).find(x => x.id === studentId);
  if (!s && studentId) {
    s = { id: studentId, name: studentName, course_name: 'DCA', student_code: 'PESC0001' };
  }

  const modal = document.createElement('div');
  modal.id = 'certDirectModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; backdrop-filter:blur(3px);';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:620px; width:100%; padding:26px; box-shadow:0 25px 50px rgba(0,0,0,0.3); border:2px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:18px;">
        <div>
          <h3 style="margin:0; color:#0a2a5e;">📜 Issue Official Passing Certificate</h3>
          <span class="muted" style="font-size:0.85rem;">Verifiable National Council Certificate issuance</span>
        </div>
        <button type="button" onclick="document.getElementById('certDirectModal').remove()" style="background:none; border:none; font-size:1.8rem; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <form id="certDirectForm">
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:16px;">
          <label style="font-weight:700; display:block; margin-bottom:6px;">Select Candidate *</label>
          <select name="student_id" required style="width:100%; padding:8px 10px; border:1.5px solid #0284c7; border-radius:6px; font-weight:700;">
            ${(window._currentStudents || []).map(stu => `
              <option value="${stu.id}" ${s && s.id === stu.id ? 'selected' : ''}>
                ${esc(stu.name)} · ${esc(stu.student_code)} (${esc(stu.course_name || 'Course')})
              </option>
            `).join('')}
          </select>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-weight:700; display:block; margin-bottom:8px;">Certificate Evaluation Pattern *</label>
          <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:#064e3b;">
              <input type="radio" name="evaluation_type" value="yearly" checked onchange="document.getElementById('adminCertTerm').value='Annual Examination / Course Completion'">
              📅 Yearly / Annual Certificate (वार्षिक प्रमाणपत्र)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:#0284c7;">
              <input type="radio" name="evaluation_type" value="semester" onchange="document.getElementById('adminCertTerm').value='Semester 1'">
              📚 Semester-wise Certificate (सेमेस्टर आधारित प्रमाणपत्र)
            </label>
          </div>
        </div>

        <div style="margin-bottom:18px;">
          <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination Stage *</label>
          <input name="term" id="adminCertTerm" value="Annual Examination / Course Completion" required style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
          <button type="button" class="btn alt" onclick="document.getElementById('certDirectModal').remove()">Cancel</button>
          <button type="submit" class="btn gold" style="font-weight:800; padding:10px 22px;">⚡ Issue Official Certificate</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('certDirectForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sId = +fd.get('student_id');
    const evaluationType = fd.get('evaluation_type') || 'yearly';
    const term = fd.get('term') || 'Annual Examination';

    const res = await api('/api/admin/certificates/direct-issue', {
      method: 'POST',
      body: {
        student_id: sId,
        evaluation_type: evaluationType,
        term: term
      }
    });

    toast(`Official Certificate issued: ${res.cert_no} [${term}]!`);
    document.getElementById('certDirectModal').remove();
    if (typeof current !== 'undefined' && views[current]) {
      await views[current]();
    } else {
      await views.Certificates();
    }
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
