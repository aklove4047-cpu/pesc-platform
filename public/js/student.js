// Official PESC Council Header & Footer Builders matching User's Exact Specification
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

function renderOfficialCouncilFooter(opts = {}) {
  const auth = opts.authorities || (typeof window !== 'undefined' && window._councilAuthorities) || {};
  const ho = auth.head_office || {};
  const directorName = opts.directorName || 'Authorized Signatory';
  const centreCode = opts.centreCode || 'PESC00001';
  const centreSlug = opts.centreSlug || (opts.centreCode ? opts.centreCode.toLowerCase() : 'main');
  const token = opts.token || '';
  const bId = Math.random().toString(36).substring(2, 7);

  const councilVerifyUrl = token ? `https://pescouncil.in/verify/${encodeURIComponent(token)}` : 'https://pescouncil.in/verify';
  const centreVerifyUrl = token ? `https://${centreSlug}.pescouncil.in/verify/${encodeURIComponent(token)}` : `https://${centreSlug}.pescouncil.in/verify`;

  return `
    <!-- 3-Tier Official Authority Signatures Row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:24px; padding:0 10px; text-align:center; gap:12px;">
      <!-- Left: Council Head Sign & Official Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:68px; height:68px; border:2px dashed #072a60; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#072a60; font-size:0.48rem; font-weight:900; background:rgba(7,42,96,0.04); transform:rotate(-4deg); box-shadow:inset 0 0 4px rgba(7,42,96,0.12);">
          <span style="font-size:0.42rem;">★ PURVANCHAL ★</span>
          <span style="font-size:0.56rem; font-weight:900; color:#072a60;">COUNCIL HEAD</span>
          <span style="font-size:0.46rem; color:#b45309;">OFFICIAL SEAL</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#072a60; margin:4px 0 1px; font-weight:700;">
          S. N. Mishra
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Council Head Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(अध्यक्ष / हेड साइन)</span>
        </span>
      </div>

      <!-- Center: Regional Coordinator Mohar & Sign -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:68px; height:68px; border:2px dashed #7e22ce; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#7e22ce; font-size:0.46rem; font-weight:900; background:rgba(126,34,206,0.04); transform:rotate(3deg); box-shadow:inset 0 0 4px rgba(126,34,206,0.12);">
          <span style="font-size:0.42rem;">★ REGIONAL ★</span>
          <span style="font-size:0.54rem; font-weight:900; color:#6b21a8;">COORDINATOR</span>
          <span style="font-size:0.44rem; color:#581c87;">MOHAR &amp; SEAL</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#6b21a8; margin:4px 0 1px; font-weight:700;">
          Er. V. K. Maurya
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Coordinator Sign &amp; Mohar<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(क्षेत्रीय समन्वयक मुहर)</span>
        </span>
      </div>

      <!-- Right: Authorized Centre Director Sign & Seal -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; max-width:180px;">
        <div style="width:68px; height:68px; border:2px dashed #047857; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#047857; font-size:0.46rem; font-weight:900; background:rgba(4,120,87,0.04); transform:rotate(-3deg); box-shadow:inset 0 0 4px rgba(4,120,87,0.12);">
          <span style="font-size:0.42rem;">★ STUDY CENTRE ★</span>
          <span style="font-size:0.54rem; font-weight:900; color:#064e3b;">DIRECTOR SEAL</span>
          <span style="font-size:0.44rem; color:#047857;">(${esc(centreCode)})</span>
        </div>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.35rem; color:#064e3b; margin:4px 0 1px; font-weight:700;">
          ${esc(directorName)}
        </div>
        <span style="font-size:0.75rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
          Centre Director Sign<br><span style="font-size:0.68rem; font-weight:700; color:#475569;">(संस्थान निदेशक साइन)</span>
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

// Comprehensive Accredited Course Curriculum: Yearly-Wise & Semester-Wise Distinct Subjects
const COURSE_CURRICULUM_DATA = {
  DCA: {
    name: 'Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '1st Year': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '2nd Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Final Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DCA-S101', name: 'Computer Fundamentals & OS (Windows/Linux)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S102', name: 'Office Automation Tools (MS Word & PowerPoint)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S103', name: 'Electronic Spreadsheets & Data Analysis (MS Excel)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S104', name: 'Practical Lab - I & IT Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DCA-S201', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S202', name: 'Database Management Systems (MS Access / SQL)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S203', name: 'Web Fundamentals, HTML, CSS & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S204', name: 'Software Project Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'DCA-S301', name: 'Advanced Database Architecture & SQL Reports', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S302', name: 'Desktop Publishing & Graphics Fundamentals', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S303', name: 'Business Accounting & Statutory Payroll', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S304', name: 'Applied Laboratory Work - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'DCA-S401', name: 'Web Application Design & Client Scripting', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S402', name: 'IT Infrastructure & Network Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S403', name: 'Major Project Implementation & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  ADCA: {
    name: 'Advanced Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'ADCA-Y101', name: 'Computer Fundamentals & Programming in C/Python', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Advanced MS Office Suite & Database Systems', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Web Designing Fundamentals (HTML5, CSS3, JS)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Graphic Designing (CorelDraw, Photoshop)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y106', name: 'Software Project Implementation & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'ADCA-Y101', name: 'IT Concepts, Computer Organization & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Complete Office Suite & Advanced Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & Taxation', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Programming Principles & C / Python Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Lab Practical - Year 1 & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '2nd Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ],
      'Final Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'ADCA-S101', name: 'Computer Fundamentals & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S102', name: 'Office Automation Suite (Word, Excel, PowerPoint)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S103', name: 'Problem Solving & Programming Logic in C', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-S104', name: 'Computer Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'ADCA-S201', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S202', name: 'Relational Database Systems & MS Access', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S203', name: 'Python Programming Fundamentals', max_marks: 100, theory: 46, practical: 46 },
        { code: 'ADCA-S204', name: 'Programming Lab - II & Project Viva', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'ADCA-S301', name: 'Web Designing (HTML5, CSS3, JavaScript)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S302', name: 'Graphic Designing (CorelDraw & Adobe Photoshop)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S303', name: 'Desktop Publishing & Pre-press Typography', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S304', name: 'Multimedia Design Lab - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'ADCA-S401', name: 'Advanced Web Applications & Backend API Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S402', name: 'Hardware Networking, LAN Setup & Cyber Security', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S403', name: 'Capstone Software Project Implementation', max_marks: 100, theory: 47, practical: 47 },
        { code: 'ADCA-S404', name: 'Comprehensive Grand Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  TALLY: {
    name: 'Tally with GST',
    yearly: {
      'Annual Examination': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'TAL-S101', name: 'Principles of Accounting & Double Entry System', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-S102', name: 'Tally Prime Environment, Masters & Ledger Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-S103', name: 'Inventory & Stock Valuation in Tally Prime', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S104', name: 'Practical Accounting Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'TAL-S201', name: 'Goods & Services Tax (GST) Invoicing & Returns', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-S202', name: 'Payroll Administration, PF, ESI & TDS Compliance', max_marks: 100, theory: 44, practical: 45 },
        { code: 'TAL-S203', name: 'Banking Reconciliation & Financial Statements', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S204', name: 'Commercial Accounting Project & Audit Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  CCC: {
    name: 'Course on Computer Concepts',
    yearly: {
      'Annual Examination': [
        { code: 'CCC-Y101', name: 'Introduction to Computer & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-Y102', name: 'Word Processing & Electronic Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-Y103', name: 'Presentation Systems & Internet / Web Technologies', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-Y104', name: 'Digital Financial Services & Cyber Security Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-Y105', name: 'Practical Lab Assessment & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CCC-S101', name: 'Digital Literacy, GUI & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-S102', name: 'Word Processing Fundamentals & Document Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-S103', name: 'Basic Computer Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CCC-S201', name: 'Electronic Spreadsheets & Visual Presentations', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-S202', name: 'Internet Services, Digital Banking & Cyber Safety', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-S203', name: 'Digital Skills Project & Practical Assessment', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  PGDCA: {
    name: 'Post Graduate Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'PGD-Y101', name: 'Fundamentals of IT & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y102', name: 'Object Oriented Programming (C++ & Java/Python)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-Y103', name: 'Relational Database Management Systems (SQL Server)', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-Y104', name: 'Web Application Development & Network Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-Y105', name: 'Software Engineering & System Architecture', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y106', name: 'Capstone Project Development & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'PGD-S101', name: 'IT Infrastructure & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-S102', name: 'Data Structures & Programming Logic in C/Python', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-S103', name: 'Relational Database Management Systems & SQL', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S104', name: 'Advanced Software Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'PGD-S201', name: 'Object Oriented Programming with Java', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-S202', name: 'Full-Stack Web Development & Cloud Architecture', max_marks: 100, theory: 44, practical: 45 },
        { code: 'PGD-S203', name: 'Cyber Security, Cryptography & Information Ethics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S204', name: 'Enterprise Capstone Project & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  DTP: {
    name: 'Desktop Publishing & Graphic Designing',
    yearly: {
      'Annual Examination': [
        { code: 'DTP-Y101', name: 'Design Principles & Page Layout Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-Y102', name: 'Adobe Photoshop & Digital Image Processing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-Y103', name: 'CorelDraw & Vector Illustration Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-Y104', name: 'Adobe InDesign & Pre-press Printing Technology', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DTP-Y105', name: 'Professional Printing Portfolio & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DTP-S101', name: 'Digital Typography & Graphic Layout Basics', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-S102', name: 'Adobe Photoshop Creative Suite & Photo Editing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-S103', name: 'Raster Graphics Design Lab - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DTP-S201', name: 'CorelDraw Vector Art, Banner & Logo Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-S202', name: 'Adobe InDesign & Book Publication Pre-Press', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DTP-S203', name: 'Print Production Technology & Exhibition Portfolio', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  NTT: {
    name: 'Nursery Teacher Training',
    yearly: {
      'Annual Examination': [
        { code: 'NTT-Y101', name: 'Child Psychology & Child Development', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-Y102', name: 'Early Childhood Care & Education (ECCE)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'NTT-Y103', name: 'Pre-School Organization, Health & Nutrition', max_marks: 100, theory: 45, practical: 46 },
        { code: 'NTT-Y104', name: 'Educational Rhymes, Story Telling & Music', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-Y105', name: 'Teaching Learning Materials (TLM) & Arts Crafts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-Y106', name: 'Micro-Teaching Practical & Classroom Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'NTT-S101', name: 'Child Development & Psychology Fundamentals', max_marks: 100, theory: 45, practical: 45 },
        { code: 'NTT-S102', name: 'Nutrition, Health & Hygiene for Pre-Primary', max_marks: 100, theory: 44, practical: 46 },
        { code: 'NTT-S103', name: 'Early Education Curriculum & Rhyme Workshop', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-S104', name: 'Practical Activity Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'NTT-S201', name: 'Modern Teaching Methods (Montessori & Play-Way)', max_marks: 100, theory: 45, practical: 46 },
        { code: 'NTT-S202', name: 'School Administration & Community Engagement', max_marks: 100, theory: 44, practical: 45 },
        { code: 'NTT-S203', name: 'TLM Creation, Creative Crafts & Exhibition', max_marks: 100, theory: 46, practical: 45 },
        { code: 'NTT-S204', name: 'School Internship & Teaching Demonstration Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  HARDWARE: {
    name: 'Diploma in Computer Hardware & Networking',
    yearly: {
      'Annual Examination': [
        { code: 'CHN-Y101', name: 'Computer Hardware Architecture & Components', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-Y102', name: 'OS Installation, BIOS & Device Configuration', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-Y103', name: 'Computer Networks, Cabling & IP Addressing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-Y104', name: 'Network Devices, Routers & Cyber Defense', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CHN-Y105', name: 'Hardware Lab Practical & Diagnostic Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CHN-S101', name: 'PC Assembly, Power Supply & Storage Maintenance', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-S102', name: 'BIOS Setup, Drivers & OS Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-S103', name: 'Hardware Assembly Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CHN-S201', name: 'Local Area Networks (LAN) & Network Devices', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-S202', name: 'Wireless Routers, WiFi & Internet Gateways', max_marks: 100, theory: 44, practical: 45 },
        { code: 'CHN-S203', name: 'Network Troubleshooting & Field Project Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  YOGA: {
    name: 'Diploma in Yoga & Naturopathy Education',
    yearly: {
      'Annual Examination': [
        { code: 'YOG-Y101', name: 'Foundations of Yoga Philosophy & History', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-Y102', name: 'Human Anatomy & Physiology for Yoga', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-Y103', name: 'Principles of Naturopathy & Diet Therapy', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-Y104', name: 'Yogic Asanas, Pranayama & Shatkarma Techniques', max_marks: 100, theory: 46, practical: 45 },
        { code: 'YOG-Y105', name: 'Practical Asana Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'YOG-S101', name: 'Classical Yoga Texts & Principles of Health', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-S102', name: 'Basic Anatomy, Respiratory System & Postures', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-S103', name: 'Practical Yoga Sadhana - I (Sukshma Vyayama)', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'YOG-S201', name: 'Naturopathy, Hydrotherapy & Natural Healing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-S202', name: 'Pranayama, Meditation & Stress Management', max_marks: 100, theory: 44, practical: 45 },
        { code: 'YOG-S203', name: 'Therapeutic Yoga Practice & Clinical Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  FASHION: {
    name: 'Diploma in Fashion Designing & Garment Fabrication',
    yearly: {
      'Annual Examination': [
        { code: 'FAS-Y101', name: 'Fundamentals of Fashion Design & Illustration', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-Y102', name: 'Textile Science, Fabric Selection & Fiber Analysis', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-Y103', name: 'Pattern Making, Grading & Garment Construction', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-Y104', name: 'Computer Aided Fashion Design (CAD) & Merchandising', max_marks: 100, theory: 46, practical: 45 },
        { code: 'FAS-Y105', name: 'Garment Collection Exhibition & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'FAS-S101', name: 'Fashion Sketching & Design Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-S102', name: 'Basic Textile Studies & Sewing Techniques', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-S103', name: 'Pattern Drafting Workshop - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'FAS-S201', name: 'Advanced Garment Fabrication & Draping', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-S202', name: 'Digital Fashion CAD & Apparel Marketing', max_marks: 100, theory: 44, practical: 45 },
        { code: 'FAS-S203', name: 'Final Garment Collection & Portfolio Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  }
};

function getCourseCurriculumSubjects(courseNameOrCode, evalPattern, termName) {
  const norm = String(courseNameOrCode || '').toUpperCase();
  const pattern = (evalPattern === 'semester') ? 'semester' : 'yearly';
  const term = String(termName || (pattern === 'semester' ? 'Semester 1' : 'Annual Examination')).trim();

  let key = Object.keys(COURSE_CURRICULUM_DATA).find(k => norm === k || norm.includes(k) || (COURSE_CURRICULUM_DATA[k].name && norm.includes(COURSE_CURRICULUM_DATA[k].name.toUpperCase())));
  if (!key) {
    if (norm.includes('NURSERY') || norm.includes('NTT') || norm.includes('TEACHER')) key = 'NTT';
    else if (norm.includes('ADVANCED') || norm.includes('ADCA')) key = 'ADCA';
    else if (norm.includes('DCA')) key = 'DCA';
    else if (norm.includes('TALLY')) key = 'TALLY';
    else if (norm.includes('CCC')) key = 'CCC';
    else if (norm.includes('PGDCA')) key = 'PGDCA';
    else if (norm.includes('DTP') || norm.includes('PUBLISHING')) key = 'DTP';
    else if (norm.includes('HARDWARE') || norm.includes('NETWORKING')) key = 'HARDWARE';
    else if (norm.includes('YOGA')) key = 'YOGA';
    else if (norm.includes('FASHION')) key = 'FASHION';
  }

  if (key && COURSE_CURRICULUM_DATA[key]) {
    const courseObj = COURSE_CURRICULUM_DATA[key];
    const patObj = courseObj[pattern] || {};

    if (patObj[term]) return patObj[term];

    if (pattern === 'semester') {
      if (term.includes('2') || term.toLowerCase().includes('second')) return patObj['Semester 2'] || Object.values(patObj)[1] || patObj['Semester 1'];
      if (term.includes('3') || term.toLowerCase().includes('third')) return patObj['Semester 3'] || Object.values(patObj)[2] || patObj['Semester 1'];
      if (term.includes('4') || term.toLowerCase().includes('fourth')) return patObj['Semester 4'] || Object.values(patObj)[3] || patObj['Semester 1'];
      return patObj['Semester 1'] || Object.values(patObj)[0];
    } else {
      if (term.includes('2nd') || term.toLowerCase().includes('second')) return patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('Final') || term.toLowerCase().includes('final')) return patObj['Final Year'] || patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('1st') || term.toLowerCase().includes('first')) return patObj['1st Year'] || patObj['Annual Examination'];
      return patObj['Annual Examination'] || Object.values(patObj)[0];
    }
  }

  const cLabel = courseNameOrCode || 'Vocational';
  if (pattern === 'semester') {
    const semNum = term.match(/\d+/) ? term.match(/\d+/)[0] : '1';
    return [
      { code: `SEM${semNum}-01`, name: `${cLabel} Theory & Fundamentals (Sem-${semNum})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `SEM${semNum}-02`, name: `${cLabel} Systems, Tools & Methodology (Sem-${semNum})`, max_marks: 100, theory: 44, practical: 46 },
      { code: `SEM${semNum}-03`, name: `${cLabel} Applied Practical Workshop - ${semNum}`, max_marks: 100, theory: 46, practical: 45 },
      { code: `SEM${semNum}-04`, name: `${cLabel} Term Assessment & Viva-Voce (Sem-${semNum})`, max_marks: 100, theory: 47, practical: 47 },
    ];
  } else {
    const yearLabel = term.includes('1') ? 'Year 1' : term.includes('2') ? 'Year 2' : 'Annual';
    return [
      { code: `Y-${yearLabel}-01`, name: `${cLabel} Core Foundations & Theory (${yearLabel})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `Y-${yearLabel}-02`, name: `${cLabel} Applied Technology & Software Operations`, max_marks: 100, theory: 44, practical: 46 },
      { code: `Y-${yearLabel}-03`, name: `${cLabel} Industry Standards & Professional Practice`, max_marks: 100, theory: 45, practical: 46 },
      { code: `Y-${yearLabel}-04`, name: `${cLabel} Comprehensive Lab Practical Assessment`, max_marks: 100, theory: 46, practical: 45 },
      { code: `Y-${yearLabel}-05`, name: `${cLabel} Project Demonstration & Viva-Voce`, max_marks: 100, theory: 48, practical: 48 },
    ];
  }
}

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
      window._currentStudent = s;
      window._currentStudentPhoto = s.photo || s.photo_url || (me.user && (me.user.photo || me.user.photo_url)) || '';
      const mrkData = await api('/api/student/marksheets').catch(() => ({ marksheets: [] }));
      const certData = await api('/api/student/certificates').catch(() => ({ certificates: [] }));
      const idcData = await api('/api/student/id-card').catch(() => ({ id_card: {} }));
      const idc = idcData.id_card || {};

      const hasMrk = mrkData.marksheets && mrkData.marksheets.length > 0;
      const hasCert = certData.certificates && certData.certificates.length > 0;

      viewEl.innerHTML = `
        <!-- Top Student Welcome Header Banner -->
        <div class="card" style="margin-bottom:20px; border-left: 6px solid var(--gold); background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #f8fafc 100%); box-shadow:0 6px 20px rgba(0,0,0,0.06);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:72px; height:72px; border-radius:12px; background:linear-gradient(135deg, #0a2a5e, #1e3a8a); color:#fff; display:grid; place-items:center; font-size:2.4rem; border:2px solid var(--gold); box-shadow:0 4px 12px rgba(10,42,94,0.25); flex-shrink:0;">
                🎓
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="badge ${s.status || 'active'}" style="font-size:0.78rem; font-weight:800;">${(s.status || 'ACTIVE').toUpperCase()} STUDENT</span>
                  <span style="font-size:0.8rem; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:700;">Session ${esc(s.session || '2026-27')}</span>
                </div>
                <h2 style="margin: 4px 0 2px; font-size:1.85rem; color:var(--navy); font-weight:900;">${esc(s.name)}</h2>
                <div style="display:flex; gap:14px; flex-wrap:wrap; font-size:0.88rem; color:#475569; margin-top:4px;">
                  <span>Roll No: <b style="color:#0a2a5e; font-family:monospace; font-size:1.02rem;">${esc(s.roll_no || s.student_code)}</b></span>
                  <span>•</span>
                  <span>Enrollment: <code style="color:#064e3b; font-weight:800; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${esc(s.student_code)}</code></span>
                </div>
              </div>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Affiliated Study Centre</span>
              <h4 style="margin:2px 0; color:var(--navy); font-size:1.15rem; font-weight:800;">${esc(s.centre_name)}</h4>
              <p style="font-size:0.82rem; color:#475569; margin:0;">Centre Code: <b style="color:#0a2a5e;">${esc(s.centre_code)}</b> · ${esc(s.centre_district)}, ${esc(s.centre_state)}</p>
              <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
                <button type="button" class="btn sm" onclick="tabsEl.querySelectorAll('button')[6]?.click()" style="background:var(--navy); color:#fff; font-weight:700; font-size:0.82rem; padding:6px 14px; border-radius:6px; cursor:pointer;">🪪 Digital ID Card</button>
                <button type="button" class="btn sm" onclick="tabsEl.querySelectorAll('button')[2]?.click()" style="background:#047857; color:#fff; font-weight:700; font-size:0.82rem; padding:6px 14px; border-radius:6px; cursor:pointer;">🎫 Admit Card</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Shortcuts Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div onclick="tabsEl.querySelectorAll('button')[6]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">🪪</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Digital ID Card</b>
            <span style="font-size:0.75rem; color:#64748b;">View &amp; Print PVC Card</span>
          </div>

          <div onclick="tabsEl.querySelectorAll('button')[2]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">🎫</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Admit Card</b>
            <span style="font-size:0.75rem; color:#64748b;">Examination Hall Ticket</span>
          </div>

          <div onclick="tabsEl.querySelectorAll('button')[3]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">📊</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Official Marksheet</b>
            <span style="font-size:0.75rem; color:#64748b;">${hasMrk ? 'Grade ' + mrkData.marksheets[0].grade : 'Marks Statement'}</span>
          </div>

          <div onclick="tabsEl.querySelectorAll('button')[4]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">📜</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Council Certificate</b>
            <span style="font-size:0.75rem; color:#64748b;">${hasCert ? 'Awarded' : 'Award Credential'}</span>
          </div>

          <div onclick="tabsEl.querySelectorAll('button')[1]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">📚</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Course Syllabus</b>
            <span style="font-size:0.75rem; color:#64748b;">Subjects &amp; Modules</span>
          </div>

          <div onclick="tabsEl.querySelectorAll('button')[5]?.click()" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
            <div style="font-size:2rem; margin-bottom:6px;">🧾</div>
            <b style="color:var(--navy); font-size:0.95rem; display:block;">Fee Receipt</b>
            <span style="font-size:0.75rem; color:#64748b;">Payment Status</span>
          </div>
        </div>

        <!-- Academic Journey Progress Tracker -->
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin:0 0 14px; font-size:1.15rem; color:var(--navy);">Academic Progression Milestone</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
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
                <span style="color:#16a34a; font-weight:bold;">✓ Issued</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">Exam Session ${esc(s.session || '2026')}</p>
            </div>

            <div style="background:${hasMrk ? '#f0fdf4' : '#fffbeb'}; border:1px solid ${hasMrk ? '#bbf7d0' : '#fde68a'}; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:${hasMrk ? '#166534' : '#854d0e'}; font-size:0.9rem;">4. Marksheet</b>
                <span style="font-weight:bold; color:${hasMrk ? '#16a34a' : '#d97706'};">${hasMrk ? '✓ ' + mrkData.marksheets[0].result : '✓ In Record'}</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">${hasMrk ? mrkData.marksheets[0].percentage + '% Marks' : 'Terminal Evaluation'}</p>
            </div>

            <div style="background:${hasCert ? '#f0fdf4' : '#f8fafc'}; border:1px solid ${hasCert ? '#bbf7d0' : '#cbd5e1'}; padding:12px; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:${hasCert ? '#166534' : '#475569'}; font-size:0.9rem;">5. Certificate</b>
                <span style="font-weight:bold; color:${hasCert ? '#16a34a' : '#64748b'};">${hasCert ? '✓ Awarded' : '✓ Verified'}</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:4px 0 0;">${hasCert ? esc(certData.certificates[0].cert_no) : 'Authorized Council Award'}</p>
            </div>
          </div>
        </div>

        <!-- Student Digital ID Card Quick Display -->
        <div class="card" style="margin-bottom:20px; border:2px solid #0a2a5e; border-radius:14px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <span class="badge active">🪪 STUDENT IDENTITY CARD</span>
              <h3 style="margin:4px 0 0; color:var(--navy);">Official Institutional Identity Card (पहचान पत्र)</h3>
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="showStudentSelfUploadPhotoModal()" class="btn sm" style="background:#7c3aed; color:#fff; font-weight:700;">📷 Upload Photo</button>
              <button onclick="tabsEl.querySelectorAll('button')[6]?.click()" class="btn gold sm" style="font-weight:800; padding:8px 18px;">🖨️ Open Full Dual-Sided Card</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
            <!-- Front Card Preview -->
            <div style="background:#ffffff; border:2px solid #0a2a5e; border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,0.08);">
              <div style="background:linear-gradient(135deg, #0a2a5e 0%, #1e3a8a 100%); color:#ffffff; padding:10px 14px; text-align:center; border-bottom:3px solid #d4af37;">
                <div style="font-size:0.9rem; font-weight:800; letter-spacing:0.5px; text-transform:uppercase;">${esc(s.centre_name)}</div>
                <div style="font-size:0.65rem; color:#fde047; font-weight:700;">PURVANCHAL EDUCATION &amp; SKILL COUNCIL</div>
              </div>
              <div style="padding:14px; display:flex; gap:12px; align-items:center;">
                <div style="width:72px; height:88px; background:#f1f5f9; border-radius:6px; border:1.5px solid #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
                  ${(s.photo || s.photo_url || me.user.photo || me.user.photo_url) ? `<img src="${esc(s.photo || s.photo_url || me.user.photo || me.user.photo_url)}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:2.2rem;">🎓</span>`}
                </div>
                <div style="font-size:0.8rem; line-height:1.5; flex:1;">
                  <div style="font-size:1rem; font-weight:800; color:#0a2a5e;">${esc(s.name)}</div>
                  <div>Roll No: <b style="font-family:monospace; color:#064e3b;">${esc(s.roll_no || s.student_code)}</b></div>
                  <div>Code: <code style="font-size:0.75rem;">${esc(s.student_code)}</code></div>
                  <div>Course: <b style="color:#0a2a5e;">${esc(s.course_name)}</b></div>
                  <div>Session: <b>${esc(s.session || '2026-27')}</b></div>
                </div>
              </div>
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding:6px 14px; display:flex; justify-content:space-between; align-items:center; font-size:0.7rem;">
                <span>Centre Code: <b>${esc(s.centre_code)}</b></span>
                <span style="color:#15803d; font-weight:bold;">✓ PESC VERIFIED</span>
              </div>
            </div>

            <!-- Back Card Preview -->
            <div style="background:#ffffff; border:2px solid #0a2a5e; border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,0.08); display:flex; flex-direction:column; justify-content:space-between;">
              <div style="background:#f1f5f9; border-bottom:1px solid #cbd5e1; padding:8px 12px; text-align:center;">
                <span style="font-size:0.75rem; font-weight:800; color:#0a2a5e;">STUDY CENTRE DIRECTORY &amp; VERIFICATION</span>
              </div>
              <div style="padding:12px; font-size:0.76rem; color:#475569; line-height:1.5;">
                <div><b style="color:#0a2a5e;">Institution:</b> ${esc(s.centre_name)} (${esc(s.centre_code)})</div>
                <div><b style="color:#0a2a5e;">Campus:</b> ${esc(s.centre_address || `${s.centre_district}, ${s.centre_state}`)}</div>
                <div><b style="color:#0a2a5e;">Help Desk:</b> ${esc(s.incharge_mobile || '+91 7380435797')}</div>
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:4px; padding:4px 8px; margin-top:8px; font-size:0.7rem; color:#166534;">
                  Online Verification Link: <b>https://pescouncil.in/verify</b>
                </div>
              </div>
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding:6px 14px; display:flex; justify-content:space-between; align-items:center; font-size:0.7rem;">
                <span style="font-family:monospace; letter-spacing:1.5px;">||| | |||| | ||| ||</span>
                <span style="font-weight:700; color:#0a2a5e;">Director Sign [Certified]</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Academic & Centre Profiles -->
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px; flex-wrap:wrap;">
          <div class="card">
            <h3 style="margin:0 0 12px; color:var(--navy); font-size:1.15rem;">Academic Information &amp; Candidate Profile</h3>
            <div class="row">
              <div><label>Full Name</label><input value="${esc(s.name)}" readonly></div>
              <div><label>Father's Name</label><input value="${esc(s.father_name || 'N/A')}" readonly></div>
              <div><label>Mobile Number</label><input value="${esc(s.mobile || 'N/A')}" readonly></div>
              <div><label>Email ID</label><input value="${esc(s.email || 'N/A')}" readonly></div>
              <div><label>Date of Birth</label><input value="${esc(s.dob || 'N/A')}" readonly></div>
              <div><label>Admission Date</label><input value="${date(s.created_at) || '15/07/2026'}" readonly></div>
            </div>
          </div>

          <div class="card" style="border:1px solid #cbd5e1; background:#f8fafc;">
            <h3 style="color:var(--navy); font-size:1.1rem; margin:0 0 12px;">🏫 Your Study Centre</h3>
            <div style="font-size:0.9rem; line-height:1.6;">
              <p style="margin:0 0 6px;"><b>Centre Name:</b><br><span style="color:var(--navy); font-weight:700;">${esc(s.centre_name)}</span></p>
              <p style="margin:0 0 6px;"><b>Centre Code:</b> <code style="color:var(--navy);">${esc(s.centre_code)}</code></p>
              <p style="margin:0 0 6px;"><b>Director / Incharge:</b> ${esc(s.incharge_name || 'Centre Director')}</p>
              <p style="margin:0 0 6px;"><b>Helpline Contact:</b> <a href="tel:${esc(s.incharge_mobile || '')}" style="color:#0284c7; font-weight:600;">${esc(s.incharge_mobile || '+91 7380435797')}</a></p>
              <p style="margin:0 0 6px;"><b>Support Email:</b> ${esc(s.incharge_email || 'desk@pescouncil.in')}</p>
              <p style="margin:0;"><b>Campus Address:</b><br><span class="muted">${esc(s.centre_address || `${s.centre_district}, ${s.centre_state}`)}</span></p>
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
              <div style="width:120px; height:140px; border:2px dashed #94a3b8; border-radius:8px; margin:0 auto; display:grid; place-items:center; background:#f1f5f9; overflow:hidden;">
                ${(ac.photo || ac.photo_url || me.user.photo || me.user.photo_url) ? `<img src="${esc(ac.photo || ac.photo_url || me.user.photo || me.user.photo_url)}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="font-size:2.8rem;">🎓</div>`}
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

      if (!list || !list.length) {
        viewEl.innerHTML = `
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">📊</div>
            <h3>No Marksheet Issued Yet</h3>
            <p class="muted">Your examination marksheet has not been issued yet by your centre.</p>
          </div>
        `;
        return;
      }

      const m = list[0];
      const stuObj = {
        id: me.user.id || m.student_id,
        name: me.user.name,
        father_name: m.father_name || me.user.father_name || 'Shri Ram',
        mother_name: m.mother_name || me.user.mother_name || 'Smt. Geeta',
        student_code: m.student_code || me.user.student_code || me.user.roll_no || 'PESC-26-00008',
        roll_no: m.roll_no || me.user.roll_no || me.user.student_code || 'PESC-00008',
        course_name: m.course_name || me.user.course_name || 'Nursery Teacher Training',
        photo_url: me.user.photo || me.user.photo_url || m.student_photo || ''
      };
      const centreObj = {
        name: m.centre_name || 'PREETI INSTITUTE OF TECHNOLOGY',
        centre_code: m.centre_code || 'PESC00001',
        address: m.centre_address || 'Village and post shahgarh district Azamgarh',
        hindi_name: m.hindi_name || m.centre_name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी'
      };

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Statement of Marks</h2>
              <p class="muted" style="margin:0;">Marksheet No: <b style="color:var(--navy); font-family:monospace;">${esc(m.marksheet_no || 'PESC-MARKS-2026-0007')}</b></p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Marksheet (A4)</button>
          </div>

          ${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
            student: stuObj,
            centre: centreObj,
            mrkNo: m.marksheet_no || 'PESC-MARKS-2026-0007',
            issueDate: m.issue_date ? new Date(m.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '04-10-2026',
            subjects: m.subjects,
            scheme: m.evaluation_type === 'semester' ? 'single_semester' : 'annual',
            term: m.term || 'Annual Examination'
          }) : '<p>Loading template...</p>'}
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
      const sPhotoCert = me.user.photo || me.user.photo_url || c.student_photo || '';
      const studentPhotoCertHtml = sPhotoCert
        ? `<img src="${esc(sPhotoCert)}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`
        : `<div style="text-align:center; padding:4px;"><div style="font-size:1.6rem;">👤</div><span style="font-size:0.55rem; font-weight:700; color:#64748b; display:block; line-height:1;">Student Photo</span></div>`;

      viewEl.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Certificate of Completion</h2>
              <p class="muted" style="margin:0;">Status: ${badge(c.status)} · Certificate No: <b style="color:var(--navy); font-family:monospace;">${esc(c.cert_no || 'Processing')}</b></p>
            </div>
            <div style="display:flex; gap:10px;">
              <a href="/verify/${c.token}" target="_blank" class="btn alt">🔍 Public Verification Page</a>
              <button onclick="window.print()" class="btn gold">🖨️ Print Certificate</button>
            </div>
          </div>

          <!-- Official Standardized Certificate Container -->
          <div class="printable-area" style="background:#ffffff; border:12px double #d4af37; padding:32px 36px; border-radius:10px; box-shadow:0 8px 30px rgba(0,0,0,0.08); text-align:center; position:relative;">
            ${renderOfficialCouncilHeader({
              studentCode: me.user.student_code || me.user.roll_no || c.student_code || 'PESC-26-00008',
              rollNo: me.user.roll_no || me.user.student_code || c.student_code || 'PESC-00008',
              refNo: c.cert_no || 'PESC-CERT-2026-0007',
              issueDate: date(c.issued_at) || '04-10-2026',
              issuePlace: cAddress || 'Regional Council Office, Shahgarh, Azamgarh UP',
              headOffice: 'Shahgarh, Azamgarh UP 276001'
            })}

            <!-- Top Section: QR Code on Left, Ribbon in Center, Student Photo on Right -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin:10px 0 16px; gap:12px;">
              <div style="border:2px solid #072a60; padding:6px; border-radius:6px; background:#ffffff; box-shadow:0 2px 8px rgba(7,42,96,0.12); text-align:center; flex-shrink:0;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=https%3A%2F%2Fpescouncil.in%2Fverify%2F${encodeURIComponent(c.token || c.student_code || 'PESC')}" alt="Verification QR" style="width:82px; height:82px; display:block;">
                <div style="font-size:0.56rem; font-weight:900; color:#072a60; text-transform:uppercase; margin-top:3px; letter-spacing:0.5px;">SCAN TO VERIFY</div>
              </div>

              <!-- Center: Ribbon Title -->
              <div style="flex:1; text-align:center; padding:0 6px;">
                <div style="display:inline-block; background:linear-gradient(135deg, #065f46, #047857); color:#ffffff; font-size:1.55rem; font-weight:900; letter-spacing:3px; padding:6px 40px; border-radius:6px; box-shadow:0 3px 8px rgba(4,120,87,0.3); border:2px solid #d4af37;">
                  CERTIFICATE
                </div>
                <div style="font-size:0.75rem; font-weight:800; color:#064e3b; letter-spacing:1px; margin-top:4px;">
                  ANNUAL VOCATIONAL &amp; TECHNICAL EVALUATION
                </div>
              </div>

              <!-- Right: Student Photo -->
              <div style="border:2px solid #072a60; padding:3px; border-radius:6px; background:#ffffff; box-shadow:0 2px 8px rgba(7,42,96,0.12); flex-shrink:0; text-align:center;">
                <div style="width:76px; height:92px; border-radius:4px; overflow:hidden; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
                  ${studentPhotoCertHtml}
                </div>
                <div style="font-size:0.52rem; font-weight:900; color:#072a60; margin-top:2px; letter-spacing:0.3px;">PESC VERIFIED</div>
              </div>
            </div>

            <!-- Official Certificate Body Text -->
            <div style="font-size:0.92rem; color:#000000; font-weight:700; line-height:2.2; text-align:center; margin:18px auto 14px; max-width:740px;">
              THIS IS TO CERTIFY THAT MR. / MRS. <span style="font-size:1.28rem; font-weight:900; color:#0a2a5e; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.name)}</span><br>
              S/O / D/O / W/O <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.father_name || 'N/A')}</span> &nbsp;&nbsp;&nbsp;&nbsp;
              MOTHERS NAME <span style="font-size:1.05rem; font-weight:900; color:#000000; border-bottom:1.5px solid #64748b; padding:0 10px;">${esc(me.user.mother_name || 'N/A')}</span> HAS SUCCESSFULLY CLEARED THE<br>
              ASSESSMENT IN THE JOB ROLE / COURSE <span style="font-size:1.2rem; font-weight:900; color:#064e3b; border-bottom:1.5px solid #64748b; padding:0 8px;">"${esc(c.course_name || 'Diploma in Computer Application')}"</span><br>
              <span style="font-size:1.05rem; font-weight:900; color:#047857; border-bottom:1.5px solid #64748b; padding:0 6px;">78.50 %</span> HELD IN <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">${esc(cAddress)}</span><br>
              WITH GRADE <span style="font-size:1.15rem; font-weight:900; color:#16a34a; border-bottom:1.5px solid #64748b; padding:0 8px;">A+</span> FROM OUR AUTHORIZED STUDY CENTRE<br>
              <div style="font-size:1.28rem; font-weight:900; color:#0a2a5e; margin:6px 0; letter-spacing:0.5px;">${esc(cName)} (${esc(cCode)})</div>
              HE / SHE HAS BEEN AWARDED WITH THE CERTIFICATE / DIPLOMA OF SAID JOB ROLE /<br>
              COURSE DURATION <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">1 Year</span>
              FROM <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">01-09-2025</span> TO <span style="font-weight:900; border-bottom:1.5px solid #64748b; padding:0 8px;">12-09-2026</span>
            </div>

            ${renderOfficialCouncilFooter({
              directorName: directorName,
              centreCode: cCode
            })}
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
                  <div style="width:84px; height:104px; background:#f1f5f9; border-radius:8px; border:2px solid #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
                    ${(idc.photo || idc.photo_url || me.user.photo || me.user.photo_url) ? `<img src="${esc(idc.photo || idc.photo_url || me.user.photo || me.user.photo_url)}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:2.6rem;">🎓</span>`}
                    <div style="position:absolute; bottom:-4px; right:-4px; width:22px; height:22px; background:#16a34a; color:#fff; border-radius:50%; display:grid; place-items:center; font-size:0.75rem; font-weight:bold; border:2px solid #fff;">✓</div>
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

window.showStudentSelfUploadPhotoModal = function() {
  const existing = document.getElementById('studentSelfPhotoModal');
  if (existing) existing.remove();

  const currentPhoto = window._currentStudentPhoto || (window._currentStudent && (window._currentStudent.photo || window._currentStudent.photo_url)) || '';

  const modal = document.createElement('div');
  modal.id = 'studentSelfPhotoModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(5px);padding:16px;';
  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:26px 28px;max-width:440px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1.5px solid #e2e8f0;font-family:sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:42px;height:42px;border-radius:10px;background:#ede9fe;color:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">📷</div>
          <div>
            <h3 style="margin:0;font-size:1.15rem;color:#0f172a;font-weight:800;">Upload Passport Photo</h3>
            <p style="margin:2px 0 0;font-size:0.8rem;color:#64748b;">Marksheet, Certificate &amp; ID Card Photo</p>
          </div>
        </div>
        <button type="button" id="btnCloseSelfPhotoModal" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:20px;">
        <div id="selfModalPhotoPreview" style="width:110px;height:130px;margin:0 auto 12px;border:2px dashed #cbd5e1;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f8fafc;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          ${currentPhoto ? `<img src="${esc(currentPhoto)}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:3rem;color:#94a3b8;">👤</span>`}
        </div>
        <label class="btn sm" style="background:#0284c7;color:#fff;cursor:pointer;display:inline-block;padding:8px 18px;font-weight:700;border-radius:6px;">
          📁 Choose Photo File (फोटो चुनें)
          <input type="file" id="selfModalPhotoFileInput" accept="image/*" style="display:none;">
        </label>
        <p style="margin:8px 0 0;font-size:0.75rem;color:#64748b;">Passport size photo (JPG, PNG, WEBP) max 2MB.<br>Yahi photo aapke Marksheet, Certificate aur ID Card par print hogi.</p>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button type="button" id="btnCancelSelfPhotoModal" class="btn alt sm">Cancel</button>
        <button type="button" id="btnSaveSelfStudentPhoto" class="btn sm" style="background:#16a34a;color:#fff;font-weight:800;padding:8px 24px;border-radius:6px;box-shadow:0 2px 6px rgba(22,163,74,0.3);">💾 Save &amp; Update Photo</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let selectedBase64 = currentPhoto;

  modal.querySelector('#btnCloseSelfPhotoModal').onclick = () => modal.remove();
  modal.querySelector('#btnCancelSelfPhotoModal').onclick = () => modal.remove();

  modal.querySelector('#selfModalPhotoFileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size should be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      selectedBase64 = ev.target.result;
      modal.querySelector('#selfModalPhotoPreview').innerHTML = `<img src="${selectedBase64}" style="width:100%;height:100%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  };

  modal.querySelector('#btnSaveSelfStudentPhoto').onclick = async () => {
    if (!selectedBase64) {
      alert('Please choose an image file first');
      return;
    }
    const btn = modal.querySelector('#btnSaveSelfStudentPhoto');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    try {
      await api('/api/student/upload-photo', {
        method: 'POST',
        body: { photo: selectedBase64 }
      });
      window._currentStudentPhoto = selectedBase64;
      toast('✅ Photo uploaded and updated successfully!');
      modal.remove();
      setTimeout(() => location.reload(), 600);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '💾 Save & Update Photo';
      alert('Failed to upload photo: ' + (err.message || err));
    }
  };
};

