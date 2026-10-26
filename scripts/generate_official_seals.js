const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'assets', 'img');

// 1. Council Head Seal (Royal Blue Official Seal)
const sealCouncilHeadSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <!-- Circular Path for Outer Text -->
    <path id="headArcTop" d="M 28 100 A 72 72 0 1 1 172 100" fill="none"/>
    <path id="headArcBottom" d="M 172 100 A 72 72 0 0 1 28 100" fill="none"/>
  </defs>
  <!-- Outer Ring with slight ink texture -->
  <circle cx="100" cy="100" r="95" fill="none" stroke="#072a60" stroke-width="4.5" stroke-dasharray="1000" opacity="0.95"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#072a60" stroke-width="1.8"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#072a60" stroke-width="1" stroke-dasharray="3,2"/>
  
  <!-- Outer Text -->
  <text font-family="'Inter', Arial, sans-serif" font-size="10.5" font-weight="900" fill="#072a60" letter-spacing="1.2">
    <textPath href="#headArcTop" startOffset="50%" text-anchor="middle">
      PURVANCHAL EDUCATION &amp; SKILL COUNCIL
    </textPath>
  </text>
  <text font-family="'Inter', Arial, sans-serif" font-size="9" font-weight="800" fill="#072a60" letter-spacing="1">
    <textPath href="#headArcBottom" startOffset="50%" text-anchor="middle">
      ★ SHAHGARH, AZAMGARH U.P. ★
    </textPath>
  </text>

  <!-- Inner Circle -->
  <circle cx="100" cy="100" r="60" fill="#072a60" fill-opacity="0.04" stroke="#072a60" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="#072a60" stroke-width="1" stroke-dasharray="2,2"/>
  
  <!-- Center Emblem -->
  <!-- Star -->
  <text x="100" y="65" font-family="'Inter', Arial, sans-serif" font-size="11" font-weight="900" fill="#b45309" text-anchor="middle">★ ★ ★</text>
  <!-- Emblem torch / book icon -->
  <path d="M96 74 Q100 68 104 74 Q106 79 100 82 Q94 79 96 74 Z" fill="#dc2626"/>
  <path d="M85 92 Q100 86 115 92 L115 102 Q100 96 85 102 Z" fill="#ffffff" stroke="#072a60" stroke-width="2"/>
  <line x1="100" y1="87" x2="100" y2="101" stroke="#072a60" stroke-width="2"/>
  
  <!-- Text inside center -->
  <text x="100" y="118" font-family="'Inter', Arial, sans-serif" font-size="12" font-weight="900" fill="#072a60" text-anchor="middle" letter-spacing="2">PESC</text>
  <text x="100" y="132" font-family="'Inter', Arial, sans-serif" font-size="7.5" font-weight="800" fill="#072a60" text-anchor="middle" letter-spacing="1">OFFICIAL SEAL</text>
  <text x="100" y="144" font-family="'Inter', Arial, sans-serif" font-size="6.5" font-weight="700" fill="#475569" text-anchor="middle">HEAD OFFICE</text>
</svg>`;

// 2. Regional Coordinator Seal (Purple Zonal Mohar)
const sealCoordinatorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <path id="coordArcTop" d="M 28 100 A 72 72 0 1 1 172 100" fill="none"/>
    <path id="coordArcBottom" d="M 172 100 A 72 72 0 0 1 28 100" fill="none"/>
  </defs>
  <circle cx="100" cy="100" r="95" fill="none" stroke="#6b21a8" stroke-width="4.5" opacity="0.95"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#6b21a8" stroke-width="1.8"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#6b21a8" stroke-width="1" stroke-dasharray="3,2"/>

  <text font-family="'Inter', Arial, sans-serif" font-size="10.5" font-weight="900" fill="#6b21a8" letter-spacing="1">
    <textPath href="#coordArcTop" startOffset="50%" text-anchor="middle">
      REGIONAL COORDINATOR U.P. ZONE
    </textPath>
  </text>
  <text font-family="'Inter', Arial, sans-serif" font-size="8.8" font-weight="800" fill="#6b21a8" letter-spacing="1">
    <textPath href="#coordArcBottom" startOffset="50%" text-anchor="middle">
      ★ PURVANCHAL EDUCATION COUNCIL ★
    </textPath>
  </text>

  <circle cx="100" cy="100" r="60" fill="#6b21a8" fill-opacity="0.04" stroke="#6b21a8" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="#6b21a8" stroke-width="1" stroke-dasharray="2,2"/>

  <text x="100" y="65" font-family="'Inter', Arial, sans-serif" font-size="10" font-weight="900" fill="#b45309" text-anchor="middle">★ ★ ★</text>
  <text x="100" y="82" font-family="'Inter', Arial, sans-serif" font-size="11" font-weight="900" fill="#6b21a8" text-anchor="middle">Er. V. K. Maurya</text>
  <text x="100" y="96" font-family="'Inter', Arial, sans-serif" font-size="8" font-weight="800" fill="#475569" text-anchor="middle">ZONAL CONTROLLER</text>
  
  <rect x="52" y="104" width="96" height="18" rx="4" fill="#6b21a8"/>
  <text x="100" y="117" font-family="'Inter', Arial, sans-serif" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">PESCOORD/001</text>
  
  <text x="100" y="136" font-family="'Inter', Arial, sans-serif" font-size="7.5" font-weight="800" fill="#6b21a8" text-anchor="middle">VERIFIED &amp; APPROVED</text>
  <text x="100" y="146" font-family="'Inter', Arial, sans-serif" font-size="6.5" font-weight="700" fill="#581c87" text-anchor="middle">VARANASI DIVISION</text>
</svg>`;

// 3. Centre Director Seal (Forest Green Institute Stamp)
const sealCentreDirectorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <path id="centreArcTop" d="M 28 100 A 72 72 0 1 1 172 100" fill="none"/>
    <path id="centreArcBottom" d="M 172 100 A 72 72 0 0 1 28 100" fill="none"/>
  </defs>
  <circle cx="100" cy="100" r="95" fill="none" stroke="#047857" stroke-width="4.5" opacity="0.95"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#047857" stroke-width="1.8"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#047857" stroke-width="1" stroke-dasharray="3,2"/>

  <text font-family="'Inter', Arial, sans-serif" font-size="9.5" font-weight="900" fill="#047857" letter-spacing="0.8">
    <textPath href="#centreArcTop" startOffset="50%" text-anchor="middle">
      ARYAVART INST. OF TECH. &amp; MGMT.
    </textPath>
  </text>
  <text font-family="'Inter', Arial, sans-serif" font-size="8.8" font-weight="800" fill="#047857" letter-spacing="1">
    <textPath href="#centreArcBottom" startOffset="50%" text-anchor="middle">
      ★ VARANASI (U.P.) - 221002 ★
    </textPath>
  </text>

  <circle cx="100" cy="100" r="60" fill="#047857" fill-opacity="0.04" stroke="#047857" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="#047857" stroke-width="1" stroke-dasharray="2,2"/>

  <text x="100" y="65" font-family="'Inter', Arial, sans-serif" font-size="10" font-weight="900" fill="#b45309" text-anchor="middle">★ ★ ★</text>
  <text x="100" y="82" font-family="'Inter', Arial, sans-serif" font-size="11" font-weight="900" fill="#064e3b" text-anchor="middle">CENTRE CODE</text>
  
  <rect x="52" y="88" width="96" height="18" rx="4" fill="#047857"/>
  <text x="100" y="101" font-family="'Inter', Arial, sans-serif" font-size="9.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.2">PESC00001</text>
  
  <text x="100" y="122" font-family="'Inter', Arial, sans-serif" font-size="8" font-weight="800" fill="#064e3b" text-anchor="middle">DIRECTOR / PRINCIPAL</text>
  <text x="100" y="134" font-family="'Inter', Arial, sans-serif" font-size="7" font-weight="800" fill="#047857" text-anchor="middle">AUTHORIZED SIGNATORY</text>
  <text x="100" y="145" font-family="'Inter', Arial, sans-serif" font-size="6.5" font-weight="700" fill="#065f46" text-anchor="middle">AFFILIATED BY PESC</text>
</svg>`;

// 4. Official "APPROVED & VERIFIED" Stamp (Green rectangular stamp)
const stampVerifiedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 90" width="260" height="90">
  <!-- Outer double border with stamp angle -->
  <rect x="4" y="4" width="252" height="82" rx="8" fill="none" stroke="#15803d" stroke-width="3.5" opacity="0.95"/>
  <rect x="9" y="9" width="242" height="72" rx="5" fill="#f0fdf4" fill-opacity="0.85" stroke="#15803d" stroke-width="1.5" stroke-dasharray="4,2"/>
  
  <text x="130" y="27" font-family="'Inter', Arial, sans-serif" font-size="9" font-weight="800" fill="#166534" text-anchor="middle" letter-spacing="1.2">
    PURVANCHAL EDUCATION &amp; SKILL COUNCIL
  </text>
  
  <line x1="20" y1="33" x2="240" y2="33" stroke="#15803d" stroke-width="1.5"/>
  
  <text x="130" y="52" font-family="'Inter', Arial, sans-serif" font-size="16" font-weight="900" fill="#15803d" text-anchor="middle" letter-spacing="1.5">
    ✓ APPROVED &amp; VERIFIED
  </text>
  
  <line x1="20" y1="58" x2="240" y2="58" stroke="#15803d" stroke-width="1.5"/>
  
  <text x="130" y="72" font-family="'Inter', Arial, sans-serif" font-size="8" font-weight="800" fill="#166534" text-anchor="middle" letter-spacing="0.8">
    AUTHENTICATED &bull; ISO 9001:2015 &bull; CENTRAL REGISTRY
  </text>
</svg>`;

// 5. Signatures (Realistic Cursive Signatures in SVG)
// A. Council Head Sign (S. N. Mishra)
const signCouncilHeadSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70" width="200" height="70">
  <path d="M 25 45 C 32 20, 40 15, 48 30 C 52 38, 55 52, 62 35 C 68 22, 75 18, 80 32 C 84 42, 90 48, 98 32 C 105 20, 115 15, 125 35 C 130 45, 140 28, 150 30 C 158 32, 168 25, 178 35" 
        fill="none" stroke="#072a60" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Characteristic loop & underline -->
  <path d="M 30 54 Q 100 62 175 48 M 140 54 L 180 50" 
        fill="none" stroke="#072a60" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="185" cy="48" r="2" fill="#072a60"/>
  <text x="32" y="65" font-family="'Segoe UI', sans-serif" font-size="7" font-weight="700" fill="#64748b">S. N. Mishra (Secy./Head)</text>
</svg>`;

// B. Regional Coordinator Sign (Er. V. K. Maurya)
const signCoordinatorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70" width="200" height="70">
  <path d="M 20 48 C 28 22, 38 18, 44 38 C 48 50, 52 32, 60 25 C 68 18, 72 40, 80 44 C 92 48, 95 24, 108 28 C 118 32, 124 50, 138 32 C 146 22, 158 20, 172 38" 
        fill="none" stroke="#6b21a8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 35 56 Q 110 60 176 46" 
        fill="none" stroke="#6b21a8" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="182" cy="46" r="2" fill="#6b21a8"/>
  <text x="35" y="65" font-family="'Segoe UI', sans-serif" font-size="7" font-weight="700" fill="#64748b">Er. V. K. Maurya (Coord.)</text>
</svg>`;

// C. Centre Director Sign (Dr. Ramesh Kumar)
const signCentreDirectorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70" width="200" height="70">
  <path d="M 22 42 C 30 18, 42 16, 48 35 C 52 48, 58 36, 68 28 C 76 22, 82 42, 92 44 C 102 46, 110 26, 122 30 C 132 34, 142 50, 154 34 C 162 24, 170 28, 178 36" 
        fill="none" stroke="#047857" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 28 54 Q 105 58 175 48" 
        fill="none" stroke="#047857" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="180" cy="48" r="2" fill="#047857"/>
  <text x="28" y="65" font-family="'Segoe UI', sans-serif" font-size="7" font-weight="700" fill="#64748b">Dr. Ramesh Kumar (Dir.)</text>
</svg>`;

fs.writeFileSync(path.join(imgDir, 'seal_council_head.svg'), sealCouncilHeadSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'seal_coordinator.svg'), sealCoordinatorSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'seal_centre_director.svg'), sealCentreDirectorSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'stamp_verified.svg'), stampVerifiedSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'sign_council_head.svg'), signCouncilHeadSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'sign_coordinator.svg'), signCoordinatorSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'sign_centre_director.svg'), signCentreDirectorSvg, 'utf8');

console.log('Successfully generated all official seals and signatures in public/assets/img/');
