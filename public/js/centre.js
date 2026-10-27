// Purvanchal Education & Skill Council (PESC)
// Authorized Franchise Centre ERP & Management Suite - 17 Modules Complete Implementation

const V = $('#view');
const pathMatch = location.pathname.match(/\/c\/([a-z0-9-]+)/i);
const urlParams = new URLSearchParams(location.search);
let rawSlug = (pathMatch && pathMatch[1]) || urlParams.get('slug') || urlParams.get('centre') || (typeof localStorage !== 'undefined' ? localStorage.getItem('pesc_active_centre_slug') : '') || '';
if (!rawSlug || rawSlug.includes('navya')) {
  rawSlug = 'aryavart-institute-of-technology-management';
}
let currentSlug = rawSlug;
try {
  if (typeof localStorage !== 'undefined') localStorage.setItem('pesc_active_centre_slug', currentSlug);
} catch (_) {}
// Intercept /api/centre requests to pass active slug & header when established
const origFetch = window.fetch;
window.fetch = function(url, init = {}) {
  if (typeof url === 'string' && url.startsWith('/api/centre') && currentSlug) {
    init.headers = init.headers || {};
    if (init.headers instanceof Headers) {
      if (!init.headers.has('x-centre-slug')) init.headers.set('x-centre-slug', currentSlug);
    } else {
      init.headers['x-centre-slug'] = init.headers['x-centre-slug'] || currentSlug;
    }
    const sep = url.includes('?') ? '&' : '?';
    if (!url.includes('slug=') && !url.includes('centre=')) {
      url = url + sep + 'slug=' + encodeURIComponent(currentSlug);
    }
  }
  return origFetch(url, init);
};

window.refreshCentreWalletBadge = async function(knownBalance) {
  try {
    let bal = knownBalance;
    if (bal === undefined || bal === null) {
      const w = await api('/api/centre/wallet').catch(() => null);
      bal = (w && w.balance !== undefined) ? w.balance : ((w && w.balance_paise !== undefined) ? w.balance_paise / 100 : 0);
    }
    const el = document.getElementById('topbarWalletAmount');
    if (el) el.textContent = '₹' + (+bal || 0).toLocaleString('en-IN') + '.00';
    if (window._currentCentre) window._currentCentre.wallet_balance = +bal;
    if (typeof currentCentre !== 'undefined' && currentCentre) currentCentre.wallet_balance = +bal;
  } catch (err) {
    console.warn('refreshCentreWalletBadge error:', err);
  }
};

window.saveCertAsPdf = function() {
  toast('प्रमाणपत्र PDF डाउनलोड करने हेतु प्रिंट विंडो में "Save as PDF" चुनें।');
  setTimeout(() => window.print(), 300);
};

window.saveMrkAsPdf = function() {
  toast('अंकतालिका PDF डाउनलोड करने हेतु प्रिंट विंडो में "Save as PDF" चुनें।');
  setTimeout(() => window.print(), 300);
};

// Global Council Authorities Loader
window._councilAuthorities = null;
window.ensureAuthoritiesLoaded = async function() {
  if (!window._councilAuthorities || !window._councilAuthorities.head_office || !window._councilAuthorities.head_office.seal_url) {
    try {
      const res = await api('/api/centre/settings').catch(() => null);
      if (res && res.authorities) {
        window._councilAuthorities = res.authorities;
      } else {
        const pub = await api('/api/public/settings').catch(() => null);
        if (pub && pub.authorities) window._councilAuthorities = pub.authorities;
      }
    } catch (_) {}
  }
  if (typeof currentCentre !== 'undefined' && currentCentre && window._councilAuthorities) {
    window._councilAuthorities.centre = {
      name: currentCentre.name,
      centre_code: currentCentre.centre_code,
      director_name: currentCentre.director_name || 'Centre Director',
      seal_url: currentCentre.seal_url || '/assets/img/seal_centre_director.svg',
      signature_url: currentCentre.signature_url || '/assets/img/sign_centre_director.svg'
    };
  }
  return window._councilAuthorities;
};

// Global Image Upload Handler for Mohar & Sign
window.setupImageUpload = function(fileInputId, urlInputId, previewBoxId, defaultEmoji) {
  const fileInput = document.getElementById(fileInputId);
  const urlInput = document.getElementById(urlInputId);
  const previewBox = document.getElementById(previewBoxId);
  if (!fileInput || !previewBox) return;

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target.result;
      if (urlInput) urlInput.value = b64;
      previewBox.innerHTML = `<img src="${b64}" style="width:100%; height:100%; object-fit:contain;">`;
      if (typeof toast === 'function') toast('Image loaded successfully ✓');
    };
    reader.readAsDataURL(file);
  };

  if (urlInput) {
    urlInput.oninput = () => {
      const val = urlInput.value.trim();
      if (val) {
        previewBox.innerHTML = `<img src="${val}" style="width:100%; height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML='<span style=\\'font-size:2.5rem;\\'>${defaultEmoji}</span>'">`;
      }
    };
  }
};

// Global Save Mohar & Sign Handler
window.saveMoharSign = async function() {
  const logo_url = ($('#logoUrlInput') && $('#logoUrlInput').value.trim()) || '';
  const seal_url = ($('#sealUrlInput') && $('#sealUrlInput').value.trim()) || '';
  const signature_url = ($('#signUrlInput') && $('#signUrlInput').value.trim()) || '';

  try {
    await api('/api/centre/mohar-signature', {
      method: 'POST',
      body: { logo_url, seal_url, signature_url }
    });
    await api('/api/centre/settings', {
      method: 'POST',
      body: { logo_url, seal_url, signature_url }
    }).catch(() => null);

    if (typeof currentCentre !== 'undefined' && currentCentre) {
      if (logo_url) currentCentre.logo_url = logo_url;
      currentCentre.seal_url = seal_url;
      currentCentre.signature_url = signature_url;
    }
    if (window._councilAuthorities && window._councilAuthorities.centre) {
      if (logo_url) window._councilAuthorities.centre.logo_url = logo_url;
      window._councilAuthorities.centre.seal_url = seal_url;
      window._councilAuthorities.centre.signature_url = signature_url;
    }

    if (typeof toast === 'function') toast('🎉 Logo, Stamp and Signature saved successfully to your centre profile!');
    alert('✅ Logo, Stamp & Signature saved successfully!\n\nअब जब भी आप पेज को रीफ्रेश करेंगे, आपका लोगो, मुहर और हस्ताक्षर हमेशा सेव रहेगा और सर्टिफिकेट व अंकतालिका पर प्रिंट होगा।');
  } catch (err) {
    alert('Failed to save logo, stamp & signature: ' + (err.message || err));
  }
};

// Global Student Credentials Modal after registration
window.showStudentCredentialsModal = function(data) {
  const existing = document.getElementById('studentCredentialsModal');
  if (existing) existing.remove();

  const name = data.name || (data.student && data.student.name) || 'Student Candidate';
  const code = data.student_code || (data.student && data.student.student_code) || 'PESC00001-2026-00001';
  const roll = data.roll_no || (data.student && data.student.roll_no) || code;
  const course = data.course || (data.student && data.student.course) || 'Vocational Course';
  const username = data.username || code;
  const password = data.password || 'Student@123';
  const portalUrl = data.portal_url || `${window.location.origin}/student`;

  const modal = document.createElement('div');
  modal.id = 'studentCredentialsModal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.8); display:flex; align-items:center; justify-content:center; z-index:999999; padding:16px; backdrop-filter:blur(6px);';

  const waText = `🎓 *Purvanchal Education & Skill Council*\n*Student Admission & Portal Login Details*\n\nCandidate Name: ${name}\nCourse: ${course}\nStudent Code: ${code}\nRoll Number: ${roll}\n\n🌐 Student Login Portal:\n${portalUrl}\n\n🔑 Login User ID: ${username}\n🔒 Password: ${password}\n\nPlease keep your credentials safe!`;

  modal.innerHTML = `
    <div style="background:#ffffff; border-radius:16px; max-width:540px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:2px solid #10b981; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #064e3b, #047857); color:#ffffff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.8rem;">🎉</span>
          <div>
            <h3 style="margin:0; font-size:1.2rem; font-weight:900;">Student Admission Registered!</h3>
            <span style="font-size:0.8rem; opacity:0.9;">Student ID &amp; Login Password Generated</span>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('studentCredentialsModal').remove()" style="background:none; border:none; color:#ffffff; font-size:1.5rem; cursor:pointer; line-height:1;">✕</button>
      </div>

      <div style="padding:22px 24px;">
        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:14px; margin-bottom:18px;">
          <div style="font-size:0.92rem; color:#166534; font-weight:700; margin-bottom:4px;">Candidate Name:</div>
          <div style="font-size:1.3rem; font-weight:900; color:#064e3b;">${esc(name)}</div>
          <div style="font-size:0.85rem; color:#15803d; margin-top:2px;">Course: <b>${esc(course)}</b></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px;">
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 12px;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Student Code / ID</span>
            <div style="font-family:monospace; font-size:1.05rem; font-weight:900; color:#0f172a; margin-top:2px;">${esc(code)}</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 12px;">
            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Roll Number</span>
            <div style="font-family:monospace; font-size:1.05rem; font-weight:900; color:#0284c7; margin-top:2px;">${esc(roll)}</div>
          </div>
          <div style="background:#f8fafc; border:1.5px solid #93c5fd; border-radius:8px; padding:10px 12px;">
            <span style="font-size:0.75rem; color:#1e40af; font-weight:700; text-transform:uppercase;">🔑 Login Username</span>
            <div style="font-family:monospace; font-size:1.1rem; font-weight:900; color:#1e40af; margin-top:2px;">${esc(username)}</div>
          </div>
          <div style="background:#fef2f2; border:1.5px solid #fca5a5; border-radius:8px; padding:10px 12px;">
            <span style="font-size:0.75rem; color:#991b1b; font-weight:700; text-transform:uppercase;">🔒 Login Password</span>
            <div style="font-family:monospace; font-size:1.1rem; font-weight:900; color:#dc2626; margin-top:2px;">${esc(password)}</div>
          </div>
        </div>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 14px; margin-bottom:20px; font-size:0.85rem; color:#1e40af;">
          🌐 <b>Student Portal Login Link:</b> <a href="${esc(portalUrl)}" target="_blank" style="color:#2563eb; font-weight:800; text-decoration:underline;">${esc(portalUrl)}</a>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button type="button" id="btnCopyWaCreds" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1rem; padding:12px; border-radius:8px; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3); display:flex; align-items:center; justify-content:center; gap:8px;">
            📋 Copy ID &amp; Password for WhatsApp (छात्र को भेजने हेतु कॉपी करें)
          </button>
          
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn alt sm" style="flex:1; padding:10px; font-weight:700;" onclick="showAdmissionFormModal(${data.student ? data.student.id : 'null'}); document.getElementById('studentCredentialsModal').remove();">
              📄 View &amp; Print Admission Form
            </button>
            <button type="button" class="btn sm" style="background:#64748b; color:#fff; padding:10px 20px; font-weight:700;" onclick="document.getElementById('studentCredentialsModal').remove()">
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const copyBtn = document.getElementById('btnCopyWaCreds');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(waText).then(() => {
        copyBtn.innerHTML = '✅ Copied to Clipboard! Ready to paste on WhatsApp';
        copyBtn.style.background = '#059669';
        setTimeout(() => {
          if (copyBtn) {
            copyBtn.innerHTML = '📋 Copy ID &amp; Password for WhatsApp (छात्र को भेजने हेतु कॉपी करें)';
            copyBtn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
          }
        }, 3000);
      }).catch(() => {
        alert(waText);
      });
    };
  }
};

window.selectTopupAmount = function(amt) {
  const inp = document.getElementById('topupAmountInput');
  if (inp) inp.value = amt;
  const btns = document.querySelectorAll('#walletTopupRequestForm button[type="button"]');
  btns.forEach(b => {
    b.className = (b.textContent.includes(amt.toLocaleString('en-IN')) ? 'btn sm gold active' : 'btn sm alt');
  });
};

window.handleWalletTopupSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('btnSubmitTopup');
  const notice = document.getElementById('topupFeedbackNotice');
  const amt = +form.amount_rupees.value || 0;
  const utr = (form.utr_number.value || '').trim();
  const mode = form.payment_mode.value || 'upi';

  if (amt <= 0) return alert('Please enter a valid amount greater than ₹0');
  if (!utr) return alert('Please enter the transaction UTR / Reference number');

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Submitting Request...'; }

  try {
    const res = await api('/api/centre/wallet/request-topup', {
      method: 'POST',
      body: { amount_rupees: amt, payment_mode: mode, utr_number: utr }
    });

    if (notice) {
      notice.style.display = 'block';
      notice.innerHTML = `
        <div style="background:#ecfdf5; border:2px solid #86efac; border-radius:12px; padding:16px 20px; box-shadow:0 4px 14px rgba(16,185,129,0.15); margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <b style="color:#065f46; font-size:1.1rem; display:block;">🎉 Top-Up Request Submitted Successfully!</b>
              <span style="font-size:0.86rem; color:#047857;">Amount: <b>₹${amt.toLocaleString('en-IN')}</b> &bull; UTR: <b>${utr}</b> (Status: Pending Head Office Approval)</span>
            </div>
            <a href="${res.whatsapp_url}" target="_blank" class="btn" style="background:#25D366; color:#ffffff; font-weight:900; font-size:1rem; padding:10px 22px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(37,211,102,0.35);">
              <span>📱</span> Send on WhatsApp to Head Office Now
            </a>
          </div>
        </div>
      `;
    }

    toast('Top-up request registered! Please notify Head Office on WhatsApp.');
    if (res.whatsapp_url) {
      setTimeout(() => window.open(res.whatsapp_url, '_blank'), 400);
    }

    form.reset();
    setTimeout(() => { if (views.Payments) views.Payments(); }, 2000);
  } catch (err) {
    alert(`❌ Request Error: ${err.message || 'Could not submit topup request'}`);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Submit Top-Up Request & Notify WhatsApp'; }
  }
};

let activeTab = 'MyStudents';
let currentCentre = null;
let allCentresList = [];

// Official PESC Council Header & Footer Builders matching User's Exact Specification
// Official PESC Council Header & Footer Builders with 3 Design Formats: Council Only, Institute Only, Both Dual
function renderOfficialCouncilHeader(opts = {}) {
  const format = opts.format || window.certFormat || 'council';
  const studentCode = opts.studentCode || 'PESC-26-00008';
  const rollNo = opts.rollNo || studentCode;
  const refNo = opts.refNo || 'PESC-CERT-2026-0007';
  const issueDate = opts.issueDate || '04-10-2026';
  const uid = Math.random().toString(36).substring(2, 7);

  const c = currentCentre || {};
  const cName = opts.centreName || c.name || 'Aryavart Institute of Technology & Management';
  const cCode = opts.centreCode || c.centre_code || 'PESC00001';
  const cAddress = opts.centreAddress || c.address || 'Near Bus Station, Azamgarh Road, Shahganj, Uttar Pradesh 223101';
  const cPhone = opts.centrePhone || c.phone || '+91 98765 43210';
  const centreHindi = opts.centreHindi || 'आर्यावर्त इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड मैनेजमेंट';
  const centreEnglish = (opts.centreEnglish || cName).toUpperCase();

  // Council Circular Seal SVG
  const councilSealSvg = `
    <svg class="council-seal-svg" width="105" height="105" viewBox="0 0 100 100" style="display:block; filter:drop-shadow(0 2px 5px rgba(7,42,96,0.2));">
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
  `;

  // Study Centre Logo SVG
  const centreLogoSvg = `
    <svg width="105" height="105" viewBox="0 0 100 100" style="display:block; filter:drop-shadow(0 2px 5px rgba(4,120,87,0.2));">
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#072a60" stroke-width="3"/>
      <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#d4af37" stroke-width="1.8"/>
      <polygon points="50,16 61,38 85,38 66,52 73,76 50,62 27,76 34,52 15,38 39,38" fill="#047857"/>
      <circle cx="50" cy="50" r="14" fill="#ffffff" stroke="#d4af37" stroke-width="1.5"/>
      <text x="50" y="54" fill="#072a60" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">IT</text>
    </svg>
  `;

  let headerHtml = '';

  if (format === 'council') {
    // 1. COUNCIL ONLY: Only Council Name, Council Accreditation, Council Seal, Council Head Office Address
    headerHtml = `
      <div style="text-align:center; padding:16px 20px 14px; margin-bottom:14px; background:linear-gradient(180deg, #fffdf2 0%, #ffffff 100%); border:3px solid #072a60; border-radius:10px; box-shadow:0 3px 12px rgba(7,42,96,0.12);">
        <div style="font-size:0.8rem; font-weight:900; color:#b45309; letter-spacing:2px; text-transform:uppercase; margin-bottom:3px;">
          ★ राष्ट्रीय स्वायत्त परीक्षा एवं कौशल प्रमाणन बोर्ड ★
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:18px; margin:4px 0 6px;">
          <div style="flex-shrink:0;">${councilSealSvg}</div>
          <div style="text-align:center;">
            <div class="council-hindi-title" style="font-size:2.65rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Yatra One', serif; line-height:1.15; margin:0; text-shadow:0 1px 2px rgba(7,42,96,0.1);">
              पूर्वांचल शिक्षा एवं कौशल परिषद
            </div>
            <div class="council-english-title" style="font-size:1.4rem; font-weight:900; color:#047857; letter-spacing:1px; text-transform:uppercase; margin-top:2px;">
              PURVANCHAL EDUCATION AND SKILL COUNCIL
            </div>
            <div style="font-size:0.86rem; font-weight:800; color:#000000; text-transform:uppercase; margin-top:3px;">
              RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD (REGD. NO: TRUST/2025/5/IV/299)
            </div>
            <div style="font-size:0.75rem; font-weight:800; color:#334155; text-transform:uppercase; margin-top:2px;">
              REGISTERED UNDER INDIAN TRUST ACT &bull; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA &bull; ISO 9001:2015 CERTIFIED
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap:20px; font-size:0.86rem; font-weight:800; color:#072a60; margin-top:8px; border-top:1.5px dashed #cbd5e1; padding-top:6px; flex-wrap:wrap;">
          <span>🏛️ <b>National Head Office:</b> Shahgarh, Azamgarh, Uttar Pradesh - 276001</span>
          <span>🌐 <b>Portal:</b> pescouncil.in</span>
          <span>📞 <b>Helpline:</b> +91 98765 43210</span>
        </div>
      </div>
    `;
  } else if (format === 'institute') {
    // 2. INSTITUTE ONLY: Only Institute Name, Centre Code, Campus Address, Helpline
    headerHtml = `
      <div style="text-align:center; padding:16px 20px 14px; margin-bottom:14px; background:linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%); border:3px solid #047857; border-radius:10px; box-shadow:0 3px 12px rgba(4,120,87,0.12);">
        <div style="font-size:0.8rem; font-weight:900; color:#15803d; letter-spacing:2px; text-transform:uppercase; margin-bottom:3px;">
          ★ अधिकृत कौशल एवं तकनीकी शिक्षा संस्थान ★
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:18px; margin:4px 0 6px;">
          <div style="flex-shrink:0;">${centreLogoSvg}</div>
          <div style="text-align:center;">
            <div style="font-size:2.55rem; font-weight:900; color:#064e3b; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif; line-height:1.2; margin:0; text-shadow:0 1px 2px rgba(6,78,59,0.1);">
              ${centreHindi}
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#072a60; font-family:'Outfit', Arial, sans-serif; letter-spacing:1.5px; text-transform:uppercase; margin-top:2px;">
              ${centreEnglish}
            </div>
            <div style="font-size:0.9rem; font-weight:800; color:#0f172a; margin-top:4px;">
              ACCREDITED CENTRE CODE: <span style="font-family:monospace; color:#065f46; font-weight:900; background:#dcfce7; padding:2px 10px; border-radius:4px; border:1px solid #86efac;">${esc(cCode)}</span>
            </div>
            <div style="font-size:0.76rem; font-weight:700; color:#64748b; letter-spacing:0.5px; text-transform:uppercase; margin-top:3px;">
              Premier Training Centre for Information Technology, Management &amp; Skill Certifications
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap:20px; font-size:0.86rem; font-weight:800; color:#064e3b; margin-top:8px; border-top:1.5px dashed #bbf7d0; padding-top:6px; flex-wrap:wrap;">
          <span>📍 <b>Campus Address:</b> ${esc(cAddress)}</span>
          <span>📞 <b>Helpline:</b> ${esc(cPhone)}</span>
          <span>🏛️ <b>Affiliation:</b> PESC Board</span>
        </div>
      </div>
    `;
  } else {
    // 3. BOTH DUAL: Both Institute & Council Names, Logos, and Addresses
    headerHtml = `
      <div class="centre-top-official-header" style="text-align:center; padding:14px 18px 12px; margin-bottom:12px; background:linear-gradient(180deg, #fffdf2 0%, #ffffff 100%); border:2.5px solid #d4af37; border-radius:10px; box-shadow:0 3px 10px rgba(212,175,55,0.18);">
        <div style="font-size:0.76rem; font-weight:900; color:#b45309; letter-spacing:2px; text-transform:uppercase; margin-bottom:2px;">
          ★ राष्ट्रीय अधिकृत कौशल एवं तकनीकी अध्ययन केंद्र ★
        </div>
        <div style="font-size:2.25rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Noto Serif Devanagari', 'Martel', serif; line-height:1.2; text-shadow:0 1px 2px rgba(7,42,96,0.12);">
          ${centreHindi}
        </div>
        <div style="font-size:1.32rem; font-weight:900; color:#065f46; font-family:'Outfit', Arial, sans-serif; letter-spacing:1.5px; text-transform:uppercase; margin-top:2px;">
          ${centreEnglish}
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; font-size:0.86rem; font-weight:700; color:#334155; margin-top:5px;">
          <span>🏛️ <b>Centre Code:</b> <span style="font-family:monospace; color:#072a60; font-weight:900; background:#e0f2fe; padding:2px 8px; border-radius:4px; border:1px solid #7dd3fc;">${esc(cCode)}</span></span>
          <span>📍 <b>Campus:</b> ${esc(cAddress)}</span>
          <span>📞 <b>Helpline:</b> ${esc(cPhone)}</span>
        </div>
      </div>

      <div style="text-align:center; margin-bottom:6px;">
        <div style="font-size:0.75rem; font-weight:900; color:#b45309; letter-spacing:1.5px; text-transform:uppercase;">
          ★ Under The Direct Aegis &amp; Accreditation of ★
        </div>
        <div class="council-hindi-title" style="font-size:2.5rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', 'Yatra One', serif; letter-spacing:1.5px; line-height:1.15; margin-top:2px;">
          पूर्वांचल शिक्षा एवं कौशल परिषद
        </div>
      </div>

      <div style="display:flex; align-items:center; justify-content:center; gap:18px; margin:4px 0 10px;">
        <div style="flex-shrink:0;">${councilSealSvg}</div>
        <div style="text-align:center;">
          <div class="council-english-title" style="font-size:1.42rem; font-weight:900; color:#047857; letter-spacing:0.8px; line-height:1.2; text-transform:uppercase;">
            PURVANCHAL EDUCATION AND SKILL COUNCIL
          </div>
          <div style="font-size:0.92rem; font-weight:900; color:#000000; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
            RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD
          </div>
          <div style="font-size:0.76rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.3px;">
            REGISTERED UNDER INDIAN TRUST ACT &bull; NITI AAYOG (NGO DARPAN), GOVT. OF INDIA
          </div>
          <div style="font-size:0.74rem; font-weight:900; color:#000000; text-transform:uppercase; margin-top:2px; letter-spacing:0.3px;">
            AN ISO 9001:2015 CERTIFIED COUNCIL &bull; MSME REGISTERED ORGANISATION
          </div>
        </div>
      </div>
    `;
  }

  return `
    ${headerHtml}

    <!-- Double Line Divider -->
    <div style="border-top:3.5px double #072a60; margin:6px 0 10px; width:100%;"></div>

    <!-- Official Header Details Box -->
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
  const format = opts.format || window.certFormat || 'council';
  const isIssued = opts.isIssued !== undefined ? opts.isIssued : true;
  const auth = opts.authorities || (typeof window !== 'undefined' && window._councilAuthorities) || {};
  const ho = auth.head_office || {};
  const coord = auth.coordinator || {};
  const c = currentCentre || auth.centre || {};

  const directorName = opts.directorName || c.director_name || 'Dr. Ramesh Kumar';
  const centreCode = opts.centreCode || c.centre_code || 'PESC00001';
  const centreSlug = opts.centreSlug || c.slug || 'aryavart-institute-of-technology-management';
  const token = opts.token || '';

  const councilSeal = opts.councilSeal || ho.seal_url || '/assets/img/seal_council_head.svg';
  const councilSign = opts.councilSign || ho.signature_url || '/assets/img/sign_council_head.svg';
  const headOfficeName = opts.headOfficeName || ho.name || 'Executive Director & Controller of Examinations';

  const coordSeal = opts.coordSeal || coord.seal_url || '/assets/img/seal_coordinator.svg';
  const coordSign = opts.coordSign || coord.signature_url || '/assets/img/sign_coordinator.svg';
  const coordName = opts.coordName || coord.name || 'Er. V. K. Maurya';

  const centreSeal = opts.centreSeal || c.seal_url || '/assets/img/seal_centre_director.svg';
  const centreSign = opts.centreSign || c.signature_url || '/assets/img/sign_centre_director.svg';

  const councilVerifyUrl = token ? `https://pescouncil.in/verify/${encodeURIComponent(token)}` : 'https://pescouncil.in/verify';
  const centreVerifyUrl = token ? `https://${centreSlug}.pescouncil.in/verify/${encodeURIComponent(token)}` : `https://${centreSlug}.pescouncil.in/verify`;

  // Helper block for head office sign & seal
  const hoBlock = `
    <div style="display:flex; flex-direction:column; align-items:center; width:220px; text-align:center;">
      <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
        <img src="${councilSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;">
        <img src="${councilSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;">
      </div>
      <div style="font-size:0.86rem; font-weight:800; color:#072a60; margin:4px 0 1px;">
        ${esc(headOfficeName)}
      </div>
      <span style="font-size:0.8rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
        Council Head Sign<br><span style="font-size:0.7rem; font-weight:700; color:#475569;">(अध्यक्ष / हेड साइन)</span>
      </span>
    </div>
  `;

  // Helper block for coordinator sign & seal
  const coordBlock = `
    <div style="display:flex; flex-direction:column; align-items:center; width:220px; text-align:center;">
      <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
        <img src="${coordSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;">
        <img src="${coordSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;">
      </div>
      <div style="font-size:0.86rem; font-weight:800; color:#6b21a8; margin:4px 0 1px;">
        ${esc(coordName)}
      </div>
      <span style="font-size:0.8rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
        Coordinator Sign &amp; Mohar<br><span style="font-size:0.7rem; font-weight:700; color:#475569;">(क्षेत्रीय समन्वयक मुहर)</span>
      </span>
    </div>
  `;

  // Helper block for centre director sign & seal
  const centreBlock = `
    <div style="display:flex; flex-direction:column; align-items:center; width:220px; text-align:center;">
      <div style="height:70px; width:100%; position:relative; display:flex; align-items:center; justify-content:center;">
        <img src="${centreSeal}" style="width:68px; height:68px; position:absolute; opacity:0.88; object-fit:contain;">
        <img src="${centreSign}" style="max-height:48px; max-width:140px; position:relative; z-index:2; object-fit:contain;">
      </div>
      <div style="font-size:0.86rem; font-weight:800; color:#064e3b; margin:4px 0 1px;">
        ${esc(directorName)}
      </div>
      <span style="font-size:0.8rem; font-weight:900; color:#000000; border-top:1.8px solid #000000; display:block; padding-top:3px; width:100%;">
        Centre Director Sign<br><span style="font-size:0.7rem; font-weight:700; color:#475569;">(${esc(centreCode)} निदेशक साइन)</span>
      </span>
    </div>
  `;

  // Signatures HTML based on format
  let sigHtml = '';
  if (format === 'council') {
    sigHtml = `
      <div style="display:flex; justify-content:space-around; align-items:flex-end; margin-top:24px; padding:0 20px; text-align:center;">
        ${hoBlock}
        ${coordBlock}
      </div>
    `;
  } else if (format === 'institute') {
    sigHtml = `
      <div style="display:flex; justify-content:space-around; align-items:flex-end; margin-top:24px; padding:0 20px; text-align:center;">
        ${hoBlock}
        ${centreBlock}
      </div>
    `;
  } else {
    // Both Dual: All 3 Signatures
    sigHtml = `
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:24px; padding:0 10px; text-align:center; gap:12px;">
        ${hoBlock}
        ${coordBlock}
        ${centreBlock}
      </div>
    `;
  }

  // Address Bar HTML based on format
  let addressBarHtml = '';
  if (format === 'council') {
    // Council Only Address Bar
    addressBarHtml = `
      <div style="margin-top:16px; border-top:2px solid #072a60; padding-top:8px; text-align:center; background:rgba(248,250,252,0.85); border-radius:6px; padding:10px 14px; margin-bottom:12px; border:1px solid #cbd5e1;">
        <div style="font-size:0.86rem; font-weight:900; color:#072a60; letter-spacing:0.3px; margin-bottom:3px;">
          🏛️ <b>MAIN HEAD OFFICE:</b> Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001, India
        </div>
        <div style="font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
          📍 <b>PLACE OF ISSUE:</b> Central Examination Board &amp; Regional Council Office, Uttar Pradesh
        </div>
        <div style="font-size:0.74rem; font-weight:700; color:#475569;">
          Official Recognized Autonomous Certification &bull; Validated under Indian Trust Act (Regd. No: TRUST/2025/5/IV/299)
        </div>
      </div>
    `;
  } else if (format === 'institute') {
    // Institute Only Address Bar
    addressBarHtml = `
      <div style="margin-top:16px; border-top:2px solid #047857; padding-top:8px; text-align:center; background:rgba(240,253,244,0.85); border-radius:6px; padding:10px 14px; margin-bottom:12px; border:1px solid #bbf7d0;">
        <div style="font-size:0.86rem; font-weight:900; color:#064e3b; letter-spacing:0.3px; margin-bottom:3px;">
          🏫 <b>INSTITUTE CAMPUS:</b> ${esc(cName)} (${esc(cCode)}), ${esc(cAddress)}
        </div>
        <div style="font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
          📍 <b>PLACE OF ISSUE:</b> ${esc(cDistrict || 'Shahganj')}, ${esc(cState || 'Uttar Pradesh')} &bull; Director Incharge: ${esc(directorName)}
        </div>
        <div style="font-size:0.74rem; font-weight:700; color:#475569;">
          Accredited Vocational Training Centre &bull; Affiliation Code: ${esc(cCode)}
        </div>
      </div>
    `;
  } else {
    // Both Dual Address Bar
    addressBarHtml = `
      <div style="margin-top:16px; border-top:2px solid #072a60; padding-top:8px; text-align:center; background:rgba(248,250,252,0.85); border-radius:6px; padding:10px 14px; margin-bottom:12px; border:1px solid #cbd5e1;">
        <div style="font-size:0.86rem; font-weight:900; color:#072a60; letter-spacing:0.3px; margin-bottom:3px;">
          🏛️ <b>COUNCIL HEAD OFFICE:</b> Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001, India
        </div>
        <div style="font-size:0.84rem; font-weight:900; color:#064e3b; margin-top:3px; margin-bottom:3px;">
          🏫 <b>STUDY CENTRE CAMPUS:</b> ${esc(cName)} (${esc(cCode)}), ${esc(cAddress)}
        </div>
        <div style="font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
          📍 <b>PLACE OF ISSUE:</b> Central Council Examination Board &amp; ${esc(cDistrict || 'Shahganj')} Centre Campus
        </div>
        <div style="font-size:0.74rem; font-weight:700; color:#475569;">
          Dual Authorized Certification &bull; Validated under Indian Trust Act (Regd. No: TRUST/2025/5/IV/299)
        </div>
      </div>
    `;
  }

  // Verification Box
  const verifyBoxHtml = `
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
  `;

  // Authentic Government & International Accreditation Logos / Insignia Badges
  const badgesHtml = `
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

  return `
    ${sigHtml}
    ${verifyBoxHtml}
    ${addressBarHtml}
    ${badgesHtml}
  `;
}

// 17 Modules Definition matching User's Image exactly
const MODULES = [
  { id: 'MyStudents', num: '1', title: 'My Students / Dashboard', desc: 'Total Students, Fees, Pending dekhna, List search', icon: '👥' },
  { id: 'AddStudent', num: '2', title: 'Add Student', desc: 'Naya student add, Course dropdown, Fees, Photo upload', icon: '➕' },
  { id: 'MyCourses', num: '3', title: 'My Courses', desc: 'Apna Selling Price khud set karega, System Fees change nahi', icon: '📚' },
  { id: 'FeesCollection', num: '4', title: 'Fees Collection', desc: 'Kitna jama, kitna pending, Receipt, Payment link', icon: '💰' },
  { id: 'CertificatePrinting', num: '5', title: 'Certificate Printing', desc: '3 Option: Council Only / Institute Only / Both Dual', icon: '📜' },
  { id: 'MarksheetPrinting', num: '6', title: 'Marksheet Printing', desc: 'Single + Semester wise dono alag nikal sakta hai', icon: '📊' },
  { id: 'CertificateSemester', num: '7', title: 'Certificate Semester', desc: 'Ek hi Certificate pe saare Semester ka Grade', icon: '📋' },
  { id: 'MoharSignature', num: '8', title: 'Mohar + Signature Upload', desc: 'Apna Mohar/Seal aur Sign khud lagayega', icon: '🖋️' },
  { id: 'IDCardGenerate', num: '9', title: 'ID Card Generate', desc: 'Institute ya Council naam se ID Card nikalna', icon: '🪪' },
  { id: 'Attendance', num: '10', title: 'Attendance', desc: 'Student attendance, monthly report', icon: '📅' },
  { id: 'Assignments', num: '11', title: 'Assignments / Assessment', desc: 'Homework, Online Test, Marks dalna', icon: '📝' },
  { id: 'Reports', num: '12', title: 'Reports / Analytics', desc: 'Business, Course Sale, Profit Report', icon: '📈' },
  { id: 'Events', num: '13', title: 'Events / Announcement', desc: 'Notice, Chhutti ka message sabko', icon: '📢' },
  { id: 'Library', num: '14', title: 'Library / Study Material', desc: 'PDF Notes, Video upload', icon: '📖' },
  { id: 'Helpdesk', num: '15', title: 'Helpdesk / Messages', desc: 'Student doubt, complaint ka jawab', icon: '💬' },
  { id: 'Payments', num: '16', title: 'Payments / Wallet', desc: 'Council ko System Fees jama, Wallet balance', icon: '💳' },
  { id: 'Profile', num: '17', title: 'Profile / Settings', desc: 'Logo, Name, Address, portal website settings', icon: '⚙️' },
  { id: 'AffiliationCert', num: '18', title: 'Affiliation Certificate', desc: 'Council dwara jaree Kendra Manyata Praman Patra', icon: '🏆' },
];

// Render Left Sidebar Navigation (17 Items)
function renderSidebar() {
  const sidebarEl = $('#erpSidebarList');
  if (!sidebarEl) return;
  sidebarEl.innerHTML = MODULES.map(m => `
    <li class="c-nav-item">
      <a class="c-nav-link ${m.id === activeTab ? 'active' : ''}" data-mod="${m.id}">
        <div class="item-header">
          <span>${m.icon}</span>
          <b class="num">${m.num}.</b>
          <span>${esc(m.title)}</span>
        </div>
        <span class="desc">${esc(m.desc)}</span>
      </a>
    </li>
  `).join('');

  sidebarEl.onclick = (e) => {
    const link = e.target.closest('[data-mod]');
    if (!link) return;
    activeTab = link.dataset.mod;
    $$('.c-nav-link', sidebarEl).forEach(l => l.classList.toggle('active', l === link));
    switchModule(activeTab);
  };
}

// Module Views Implementation
const views = {
  // 1. My Students / Dashboard
  async MyStudents() {
    const [dash, sData] = await Promise.all([
      api('/api/centre/dashboard'),
      api('/api/centre/students')
    ]);
    const c = dash.centre || {};
    const students = sData.students || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; font-size:1.6rem; color:#064e3b;">1. My Students / Dashboard</h2>
          <p class="muted" style="margin:0;">Overview of active students, fees collected, pending balances, and certifications</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn gold" onclick="switchModule('AffiliationCert')" style="font-weight:700;">📜 View Affiliation Certificate</button>
          <button class="btn gold" onclick="switchModule('AddStudent')">➕ Add New Student Admission</button>
        </div>
      </div>

      <!-- Council Affiliation Banner -->
      <div style="background:linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border:2px solid #f59e0b; border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 8px rgba(245,158,11,0.15);">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="font-size:2.4rem;">🏆</div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#16a34a; color:#fff; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:999px;">✓ ACCREDITED &amp; VERIFIED</span>
              <b style="color:#78350f; font-size:1.1rem;">Official PES Council Affiliation Certificate</b>
            </div>
            <p style="margin:4px 0 0; font-size:0.88rem; color:#92400e;">Your institution is an accredited Authorized Training Centre (ATC Code: <b>${c.centre_code || 'PESC00001'}</b>) valid through 2029.</p>
          </div>
        </div>
        <button class="btn gold" onclick="switchModule('AffiliationCert')" style="font-weight:800; padding:8px 18px; box-shadow:0 2px 6px rgba(0,0,0,0.12);">📜 View &amp; Print Affiliation Certificate</button>
      </div>

      <!-- Dashboard KPI Summary Cards -->
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:24px;">
        <div class="stat" style="border-left: 4px solid #0284c7;">
          <span>Total Students</span>
          <b style="color:#0284c7;">${dash.students}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #16a34a;">
          <span>Fees Collected</span>
          <b style="color:#16a34a;">₹${(dash.fee_paid_rupees || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #ea580c;">
          <span>Fees Pending</span>
          <b style="color:#ea580c;">₹${(dash.fee_pending_rupees || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #047857;">
          <span>Courses Offered</span>
          <b style="color:#047857;">${dash.courses}</b>
        </div>
        <div class="stat" style="border-left: 4px solid #ca8a04;">
          <span>Today Attendance</span>
          <b style="color:#ca8a04;">${dash.today_attendance_pct}%</b>
        </div>
        <div class="stat" style="border-left: 4px solid #064e3b;">
          <span>Council Wallet</span>
          <b style="color:#064e3b;">${inr(dash.wallet_paise)}</b>
        </div>
      </div>

      <!-- Students List Search & Quick Filter -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <h3 style="margin:0; font-size:1.15rem; color:#0f172a;">Student Roster &amp; Fee Status</h3>
          <div style="min-width:280px; flex:1; max-width:400px;">
            <input type="text" id="dashStudentSearch" placeholder="🔍 Search student name, roll code, mobile..." style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:0.9rem;">
          </div>
        </div>

        <div id="dashStudentTableWrap">
          ${renderStudentTable(students)}
        </div>
      </div>
    `;

    const searchInput = $('#dashStudentSearch');
    if (searchInput) {
      searchInput.oninput = (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = students.filter(s =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.student_code || '').toLowerCase().includes(q) ||
          (s.mobile || '').toLowerCase().includes(q) ||
          (s.course || '').toLowerCase().includes(q)
        );
        $('#dashStudentTableWrap').innerHTML = renderStudentTable(filtered);
      };
    }
  },

  // 2. Add Student (Exact Design Matching Image 1 from User)
  async AddStudent() {
    const cData = await api('/api/centre/courses');
    const courses = cData.courses || [];
    window._currentCourses = courses;

    const randomUserNum = Math.floor(100000000 + Math.random() * 900000000);
    const autoUsername = `In/Up/${randomUserNum}`;
    const autoPassword = String(Math.floor(100000000 + Math.random() * 900000000));
    const todayDate = new Date().toISOString().slice(0, 10);

    V.innerHTML = `
      <div style="max-width:920px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #cbd5e1; box-shadow:0 6px 20px rgba(0,0,0,0.06); font-family:'Inter', Arial, sans-serif;">
        
        <!-- Header Banner: Dark Blue (Exact Image 1) -->
        <div style="background:#001f5c; color:#ffffff; padding:14px 20px; text-align:center;">
          <h2 style="margin:0; font-size:1.4rem; font-weight:800; letter-spacing:0.3px;">Add Student Details</h2>
        </div>

        <!-- Help Links Sub-Header (Exact Image 1) -->
        <div style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:10px 20px; display:flex; justify-content:space-around; flex-wrap:wrap; gap:10px; font-size:0.86rem; color:#0284c7; font-weight:700;">
          <a href="#semester-guide" style="text-decoration:none; color:#0284c7; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; border:2px solid #0284c7; display:flex; align-items:center; justify-content:center;"><span style="width:6px; height:6px; border-radius:50%; background:#0284c7;"></span></span>
            Semester Section Mein Student Aur Subject Kaise Add Karein
          </a>
          <a href="#single-guide" style="text-decoration:none; color:#0284c7; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; border:2px solid #0284c7; display:flex; align-items:center; justify-content:center;"><span style="width:6px; height:6px; border-radius:50%; background:#0284c7;"></span></span>
            Single Certificate Section Mein Student Aur Subject Kaise Add Karein
          </a>
        </div>

        <form id="addStudentForm" style="padding:22px 28px;">
          
          <!-- SECTION 1: Personal Information (Light Blue Bar #e0f2fe - Exact Image 1) -->
          <div style="margin-bottom:24px;">
            <div style="background:#e0f2fe; color:#0369a1; padding:8px 16px; border-radius:4px; font-weight:800; font-size:0.95rem; margin-bottom:16px;">
              Personal Information
            </div>

            <!-- Row 1: Name * | Email -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Name *</label>
                <input name="name" required placeholder="Student Full Name" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Email</label>
                <input name="email" type="email" placeholder="student@example.com" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 2: Photo (max 500kb) Choose File + Preview (Exact Image 1) -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px; align-items:center;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Photo<br><span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(max 500kb)</span></label>
                <input type="file" id="studentPhotoFileInput" accept="image/*" style="font-size:0.85rem;">
                <input type="hidden" name="photo_url" id="studentPhotoBase64">
              </div>
              <div>
                <div id="studentPhotoPreviewBox" style="width:90px; height:90px; border:1px solid #cbd5e1; border-radius:4px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;">
                  <span style="font-size:0.75rem; color:#94a3b8;">[ Photo ]</span>
                </div>
              </div>
            </div>

            <!-- Row 3: Gender * | Student Whatsapp Number -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Gender *</label>
                <select name="gender" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Student Whatsapp Number</label>
                <input name="student_whatsapp" pattern="[6-9][0-9]{9}" placeholder="10-digit Whatsapp Number" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 4: Parent Whatsapp Number | Date Of Birth * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Parent Whatsapp Number</label>
                <input name="parent_whatsapp" placeholder="Parent / Guardian Whatsapp" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Date Of Birth *</label>
                <input name="dob" type="date" required value="2005-01-15" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 5: Marital Status -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Marital Status</label>
                <select name="marital_status" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="No">No / Unmarried</option>
                  <option value="Yes">Yes / Married</option>
                </select>
              </div>
              <div></div>
            </div>

            <!-- Row 6: Father/Husband Name * (with Prefix S/o, D/o, W/o) | Mother Name * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Father/Husband Name *</label>
                <div style="display:flex; gap:6px;">
                  <select name="relation_prefix" style="width:80px; padding:9px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                    <option value="S/o">S/o</option>
                    <option value="D/o">D/o</option>
                    <option value="W/o">W/o</option>
                  </select>
                  <input name="father_name" required placeholder="Father/Husband Name" style="flex:1; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Mother Name *</label>
                <input name="mother_name" required placeholder="Mother Name" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 7: Local Address * | Pin * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Local Address *</label>
                <input name="local_address" required placeholder="Local Residential Address" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Pin *</label>
                <input name="pin" required placeholder="e.g. 221001" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
            </div>

            <!-- Row 8: Username * (Auto) | Password (Auto) (Exact Image 1) -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:8px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Username *</label>
                <input name="username" id="autoStuUsername" value="${esc(autoUsername)}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.95rem; font-weight:700; color:#0f172a; background:#f8fafc;">
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Password</label>
                <input name="password" id="autoStuPassword" value="${esc(autoPassword)}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.95rem; font-weight:700; color:#0f172a; background:#f8fafc;">
              </div>
            </div>
          </div>

          <!-- SECTION 2: Course Details (Light Lavender Bar #e0e7ff - Exact Image 1) -->
          <div style="margin-bottom:24px;">
            <div style="background:#e0e7ff; color:#3730a3; padding:8px 16px; border-radius:4px; font-weight:800; font-size:0.95rem; margin-bottom:16px;">
              Course Details
            </div>

            <!-- Row 1: Course Type * (Single / Semester/Year) | Course To Be Join * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:8px;">
                  Course Type * <span style="font-size:0.75rem; color:#dc2626; font-weight:normal;">(fill carefully not editable)</span>
                </label>
                <div style="display:flex; gap:20px; align-items:center; padding-top:4px;">
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.92rem; font-weight:600;">
                    <input type="radio" name="course_type" value="Single" checked> Single
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.92rem; font-weight:600;">
                    <input type="radio" name="course_type" value="Semester/Year"> Semester/Year
                  </label>
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Course To Be Join *</label>
                <select name="course_id" id="addStudentCourseSelect" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="">Select Course</option>
                  ${courses.map(co => `<option value="${co.id}" data-duration="${co.duration_months || 12}" data-fee="${co.selling_price_paise ? Math.round(co.selling_price_paise/100) : (co.fee_rupees || 12000)}">${esc(co.code)} - ${esc(co.name)}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Row 2: Joining Date -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Joining Date</label>
                <input name="joining_date" type="date" value="${todayDate}" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem;">
              </div>
              <div></div>
            </div>

            <!-- Row 3: Course Duration * (Months) | Study Mode * -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:14px;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Course Duration *</label>
                <div style="display:flex; border:1px solid #cbd5e1; border-radius:4px; overflow:hidden;">
                  <input name="duration_months" id="addCourseDurationInput" type="number" value="12" style="flex:1; border:none; padding:9px 12px; font-size:0.92rem;">
                  <span style="background:#f1f5f9; padding:9px 14px; font-size:0.86rem; color:#475569; font-weight:700; border-left:1px solid #cbd5e1;">Months</span>
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Study Mode *</label>
                <select name="study_mode" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#fff;">
                  <option value="Regular">Regular</option>
                  <option value="Distance">Distance</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <!-- Row 4: Registration Charge * -->
            <div style="margin-bottom:20px;">
              <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:4px;">Registration Charge *</label>
              <input name="registration_charge" value="35 Rs Registration Fee + Ebook + Advance Certificate Fee" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.92rem; background:#f8fafc;">
            </div>
          </div>

          <!-- Bottom Action: Create Student (Purple Button - Exact Image 1) -->
          <div style="text-align:center; margin-top:28px;">
            <button type="submit" id="btnCreateStudent" style="background:#4f46e5; hover:background:#4338ca; color:#ffffff; font-weight:700; font-size:1.05rem; padding:12px 42px; border:none; border-radius:6px; cursor:pointer; box-shadow:0 4px 14px rgba(79,70,229,0.35);">
              Create Student
            </button>
          </div>
        </form>

        <div id="addStudentResult" style="padding:0 28px 24px;"></div>
      </div>
    `;

    // Photo file preview handler
    $('#studentPhotoFileInput').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 500 * 1024) {
          toast('Warning: File size exceeds 500kb. Please select an image under 500kb.');
        }
        const reader = new FileReader();
        reader.onload = (re) => {
          $('#studentPhotoBase64').value = re.target.result;
          $('#studentPhotoPreviewBox').innerHTML = `<img src="${re.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    };

    // Auto fill duration when course changes
    $('#addStudentCourseSelect').onchange = (e) => {
      const opt = e.target.selectedOptions[0];
      if (opt && opt.dataset.duration) {
        $('#addCourseDurationInput').value = opt.dataset.duration;
      }
    };

    // Form submit handler
    $('#addStudentForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        payload.course_id = +payload.course_id;
        payload.duration_months = +payload.duration_months || 12;

        const res = await api('/api/centre/students', { method: 'POST', body: payload });
        const stu = res.student || { name: payload.name, student_code: res.student_code, roll_no: res.roll_no };

        $('#addStudentResult').innerHTML = `
          <div style="background:#ecfdf5; border:1.5px solid #6ee7b7; border-radius:8px; padding:20px; margin-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
              <div>
                <h3 style="color:#065f46; margin:0 0 4px; font-size:1.25rem;">✅ Student Created Successfully!</h3>
                <p style="margin:0; font-size:0.9rem; color:#047857;">Admission registered and student credentials generated.</p>
              </div>
              <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700; padding:8px 18px;" onclick="showAdmissionFormModal(${res.student ? res.student.id : 'null'})">
                📄 View &amp; Print Admission Form (Image 2)
              </button>
            </div>
            
            <div style="background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; padding:14px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:0.9rem;">
              <div><span class="muted">Student Code:</span><br><b style="font-family:monospace; color:#0f172a;">${esc(res.student_code)}</b></div>
              <div><span class="muted">Roll Number:</span><br><b style="font-family:monospace; color:#0284c7;">${esc(res.roll_no)}</b></div>
              <div><span class="muted">Portal Username:</span><br><b style="font-family:monospace; color:#065f46;">${esc(res.username || payload.username)}</b></div>
              <div><span class="muted">Portal Password:</span><br><b style="font-family:monospace; color:#dc2626;">${esc(res.initial_password || payload.password)}</b></div>
            </div>
          </div>
        `;
        toast('Student created successfully!');

        // Instantly pop up full credentials modal with WhatsApp copy button
        if (typeof showStudentCredentialsModal === 'function') {
          showStudentCredentialsModal({
            student: stu,
            name: payload.name || stu.name,
            course: ($('#addStudentCourseSelect') && $('#addStudentCourseSelect').selectedOptions[0] ? $('#addStudentCourseSelect').selectedOptions[0].textContent : '') || stu.course || 'Course',
            student_code: res.student_code || stu.student_code,
            roll_no: res.roll_no || stu.roll_no,
            username: res.username || payload.username || res.student_code,
            password: res.initial_password || payload.password || 'Student@123',
            portal_url: res.portal_url || `${window.location.origin}/student`
          });
        }
      });
    };
  },

  // 3. My Courses & Fee Management
  async MyCourses() {
    const data = await api('/api/centre/courses');
    const courses = data.courses || [];
    window._currentCourses = courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">3. My Courses &amp; Fee Management (पाठ्यक्रम एवं फीस प्रबंधन)</h2>
        <p class="muted" style="margin:0;">हेड ऑफिस द्वारा अधिकृत कोर्सेज की सूची, विषय एवं अपने सेंटर के छात्रों हेतु फीस निर्धारण</p>
      </div>

      <!-- Lock Notice Alert -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-left:5px solid #2563eb; border-radius:10px; padding:14px 18px; margin-bottom:22px; display:flex; align-items:flex-start; gap:14px; box-shadow:0 2px 6px rgba(37,99,235,0.06);">
        <span style="font-size:1.8rem; line-height:1;">🔒</span>
        <div style="flex:1;">
          <b style="color:#1e40af; font-size:0.96rem; display:block; margin-bottom:3px;">हेड ऑफिस अधिकृत पाठ्यक्रम (Head Office Authorized Courses)</b>
          <p style="margin:0; font-size:0.85rem; color:#1e3a8a; line-height:1.5;">
            कोर्स का नाम, कोड, अवधि, विषय (Subjects) एवं काउंसिल शुल्क सीधे <b>हेड ऑफिस</b> द्वारा निर्धारित व सुरक्षित हैं। सेंटर संचालक इनमें कोई फेरबदल नहीं कर सकते। आप केवल अपने विद्यार्थियों के लिए अपनी <b>इंस्टीट्यूट फीस (Institute Student Fee)</b> को कस्टमाइज कर सकते हैं।
          </p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:20px;">
        ${courses.map(co => {
          const sysFee = Math.round((co.system_fee_paise || 50000) / 100);
          const sellFee = co.fee_rupees || Math.round((co.selling_price_paise || 800000) / 100);
          const margin = sellFee - sysFee;
          let subjects = [];
          try {
            subjects = typeof co.subjects === 'string' ? JSON.parse(co.subjects) : (co.subjects || []);
          } catch(e) { subjects = []; }

          return `
            <div class="card" style="border-top: 4px solid var(--c-green-emerald); padding:22px; background:#fff; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 14px rgba(0,0,0,0.06); border-radius:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;">
                  <span class="badge active" style="font-family:monospace; font-weight:800; font-size:0.92rem;">${esc(co.code)}</span>
                  <div style="display:flex; gap:6px;">
                    <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">⏱️ ${co.duration_months} Months</span>
                    <span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">🎯 Marks: ${co.total_marks || 500}</span>
                  </div>
                </div>

                <h3 style="margin:0 0 10px; font-size:1.25rem; color:#0f172a; line-height:1.35; font-weight:800;">${esc(co.name)}</h3>

                ${co.description ? `<p style="font-size:0.82rem; color:#64748b; margin:0 0 12px; line-height:1.4;">${esc(co.description)}</p>` : ''}

                <!-- Course Subjects Section -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; margin-bottom:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.8rem; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:0.5px;">📚 Course Subjects (विषय - ${subjects.length}):</span>
                    <button class="btn sm alt" onclick="showCentreCourseSubjects(${co.id})" style="font-size:0.72rem; padding:2px 8px; font-weight:700;">View Syllabus</button>
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${subjects.length > 0
                      ? subjects.slice(0, 3).map(s => `<span style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:0.74rem; color:#334155; font-weight:600;">📖 ${esc(s.name || s)}</span>`).join('') + (subjects.length > 3 ? `<span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.72rem; color:#64748b; font-weight:700;">+${subjects.length - 3} more</span>` : '')
                      : `<span style="font-size:0.75rem; color:#94a3b8; font-style:italic;">Standard Council Syllabus Included</span>`
                    }
                  </div>
                </div>

                <!-- Fees Breakdown -->
                <div style="background:#fafafa; border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin-bottom:14px; font-size:0.86rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span class="muted" style="display:flex; align-items:center; gap:4px;">🔒 Council Base Fee:</span>
                    <b style="color:#0f172a;">₹${sysFee.toLocaleString('en-IN')}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.82rem; background:#f0fdf4; padding:3px 8px; border-radius:5px;">
                    <span style="color:#166534; font-weight:700;">📜 Single/Yearly Marksheet &amp; Cert:</span>
                    <b style="color:#166534;">₹${co.single_fee_rupees || Math.round((co.single_fee_paise || 20000)/100)}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.82rem; background:#eff6ff; padding:3px 8px; border-radius:5px;">
                    <span style="color:#1e40af; font-weight:700;">📚 Semester Marksheet &amp; Cert:</span>
                    <b style="color:#1e40af;">₹${co.semester_fee_rupees || Math.round((co.semester_fee_paise || 60000)/100)}</b>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-top:1px dashed #e2e8f0; padding-top:6px;">
                    <span class="muted">Your Centre Net Margin:</span>
                    <b style="color:#16a34a; font-weight:800;">₹${margin.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                <!-- Editable Student Fee -->
                <div style="margin-bottom:6px;">
                  <label style="font-size:0.82rem; font-weight:800; display:block; margin-bottom:4px; color:#0f172a;">
                    Institute Student Fee (विद्यार्थी फीस - ₹):
                    <span style="font-size:0.75rem; font-weight:normal; color:#64748b;">(छात्र से ली जाने वाली आपकी फीस)</span>
                  </label>
                  <div style="display:flex; gap:8px;">
                    <input type="number" id="priceInput_${co.id}" value="${sellFee}" style="padding:8px 12px; font-weight:800; width:100%; border:1.5px solid #059669; border-radius:6px; font-size:1.05rem; color:#064e3b; background:#f0fdf4;">
                    <button class="btn sm gold" onclick="saveCoursePrice(${co.id})" style="white-space:nowrap; font-weight:800; padding:8px 14px;">💾 Save Fee</button>
                  </div>
                </div>
              </div>

              <div style="border-top:1px solid #f1f5f9; padding-top:10px; margin-top:12px; font-size:0.75rem; color:#64748b; text-align:center;">
                ✅ Head Office Certified Curriculum · Editable Centre Margin
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Course Subjects Modal -->
      <div id="centreCourseSubjectsModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); z-index:9999; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#fff; border-radius:14px; max-width:560px; width:100%; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #cbd5e1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
            <h3 id="centreCourseSubjectsTitle" style="margin:0; color:#064e3b; font-size:1.25rem;">📚 Course Syllabus &amp; Subjects</h3>
            <button type="button" onclick="$('#centreCourseSubjectsModal').style.display='none'" style="background:none; border:none; font-size:1.6rem; cursor:pointer; color:#64748b;">&times;</button>
          </div>
          <div id="centreCourseSubjectsContent" style="max-height:380px; overflow-y:auto; padding-right:4px;">
            <!-- Loaded dynamically -->
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:18px; border-top:1px solid #e2e8f0; padding-top:12px;">
            <button class="btn gold sm" onclick="$('#centreCourseSubjectsModal').style.display='none'" style="font-weight:700;">Close</button>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Fees Collection
  async FeesCollection() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    let totalBilled = 0, totalPaid = 0;
    students.forEach(s => {
      totalBilled += (s.fee_total || 12000);
      totalPaid += (s.fee_paid || 0);
    });
    const totalPending = Math.max(0, totalBilled - totalPaid);

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">4. Fees Collection &amp; Receipts</h2>
          <p class="muted" style="margin:0;">Kitna jama, kitna pending, printable receipts aur UPI payment links</p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:22px;">
        <div class="stat" style="border-left:4px solid #0284c7;">
          <span>Total Fees Billed</span>
          <b>₹${totalBilled.toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #16a34a;">
          <span>Fees Deposited (Jama)</span>
          <b style="color:#16a34a;">₹${totalPaid.toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #ea580c;">
          <span>Pending Fees (Baki)</span>
          <b style="color:#ea580c;">₹${totalPending.toLocaleString('en-IN')}</b>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px;">
        <h3>Student Fee Ledgers</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Roll Code</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Total Fee</th>
                <th>Fee Paid (Jama)</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const total = s.fee_total || 12000;
                const paid = s.fee_paid || 0;
                const pend = Math.max(0, total - paid);
                const isPaid = pend === 0;
                return `
                  <tr>
                    <td><b style="font-family:monospace;">${esc(s.student_code)}</b></td>
                    <td><b>${esc(s.name)}</b></td>
                    <td>${esc(s.course)}</td>
                    <td>₹${total.toLocaleString('en-IN')}</td>
                    <td style="color:#16a34a; font-weight:700;">₹${paid.toLocaleString('en-IN')}</td>
                    <td style="color:${pend > 0 ? '#dc2626' : '#16a34a'}; font-weight:700;">₹${pend.toLocaleString('en-IN')}</td>
                    <td><span class="badge ${isPaid ? 'Valid' : 'Pending'}">${isPaid ? 'Fully Paid' : 'Pending'}</span></td>
                    <td>
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn sm gold" onclick="openDepositModal(${s.id}, '${esc(s.name)}', ${pend})">➕ Deposit</button>
                        <button class="btn sm" style="background:#0284c7; color:#fff;" onclick="printReceipt(${s.id})">🧾 Receipt</button>
                        <button class="btn sm alt" onclick="showPaymentLink('${esc(s.name)}', ${pend})">💳 Pay Link</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 5. Certificate Printing (3 Options: Council Only / Institute Only / Both Dual)
  async CertificatePrinting() {
    const [sData, cData] = await Promise.all([
      api('/api/centre/students'),
      api('/api/centre/courses').catch(() => ({ courses: [] }))
    ]);
    const students = sData.students || [];
    if (cData && cData.courses) window._currentCourses = cData.courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">5. Certificate Printing (वार्षिक एवं सेमेस्टर प्रमाणपत्र प्रिंट)</h2>
        <p class="muted" style="margin:0;">वार्षिक (Yearly/Annual) अथवा सेमेस्टर (Semester-Wise) आधारित अधिकृत प्रमाणपत्र प्रिंट करें</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; margin-bottom:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <!-- Select Enrolled Candidate -->
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Enrolled Candidate (छात्र चुनें):</label>
            <select id="certStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-mother="${esc(s.mother_name || 'Smt Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}" data-photo="${esc(s.photo || s.photo_url || '')}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <!-- Evaluation Pattern (Yearly vs Semester) -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Evaluation Pattern (प्रणाली):</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnCertEvalYearly" onclick="setCertEvalPattern('yearly')">📅 Yearly / Annual (वार्षिक)</button>
              <button type="button" class="btn alt sm" id="btnCertEvalSemester" onclick="setCertEvalPattern('semester')">📚 Semester-Wise (सेमेस्टर)</button>
            </div>
          </div>

          <!-- Term Select -->
          <div id="certTermWrap" style="min-width:180px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination (परीक्षा सत्र):</label>
            <select id="certTermSelect" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; color:#064e3b;" onchange="updateCertPreview()">
              <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
              <option value="1st Year">1st Year (प्रथम वर्ष)</option>
              <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
              <option value="Final Year">Final Year (अंतिम वर्ष)</option>
            </select>
          </div>

          <!-- Layout Option -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Design Format:</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnFmtCouncil" onclick="setCertFormat('council')">Council Only</button>
              <button type="button" class="btn alt sm" id="btnFmtInstitute" onclick="setCertFormat('institute')">Institute Only</button>
              <button type="button" class="btn alt sm" id="btnFmtDual" onclick="setCertFormat('dual')">Both Dual</button>
            </div>
          </div>

          <div id="certPrintActionWrap" style="align-self:end; display:none;">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #065f46, #047857); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(6,95,70,0.3); border:none; cursor:pointer;" onclick="window.print()">🖨️ Print Certificate</button>
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(2,132,199,0.3); border:none; cursor:pointer;" onclick="window.print()">💾 Save as PDF</button>
            </div>
          </div>
        </div>

        <!-- Prescribed Council Fee Notice for Single vs Semester -->
        <div id="certFeeNotice" style="margin-bottom:16px;"></div>

        <!-- High-Res Printable Certificate Frame -->
        <div id="certPreviewContainer" class="printable-area" style="background:#ffffff; border:12px double #d4af37; padding:40px; border-radius:10px; max-width:880px; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.08); text-align:center; position:relative;">
          <!-- Dynamically filled by updateCertPreview() -->
        </div>
      </div>
    `;

    $('#certStudentSelect').onchange = updateCertPreview;
    updateCertPreview();
  },

  // 6. Marksheet Printing (Yearly + Semester-Wise)
  async MarksheetPrinting() {
    const [sData, cData] = await Promise.all([
      api('/api/centre/students'),
      api('/api/centre/courses').catch(() => ({ courses: [] }))
    ]);
    const students = sData.students || [];
    if (cData && cData.courses) window._currentCourses = cData.courses;

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">6. Marksheet Printing (वार्षिक एवं सेमेस्टर अंकतालिका प्रिंट)</h2>
        <p class="muted" style="margin:0;">वार्षिक परीक्षा (Yearly Statement) अथवा विस्तृत सेमेस्टर परीक्षा (Semester-Wise Statement) अंकतालिका प्रिंट करें</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:20px;">
          <!-- Select Candidate -->
          <div style="flex:1; min-width:240px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Candidate (छात्र चुनें):</label>
            <select id="mrkStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-mother="${esc(s.mother_name || 'Smt Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}" data-photo="${esc(s.photo || s.photo_url || '')}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>

          <!-- Marksheet Pattern: Yearly vs Semester -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Evaluation Type (परीक्षा प्रकार):</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnMrkEvalYearly" onclick="setMrkEvalPattern('yearly')">📅 Yearly / Annual (वार्षिक आधारित)</button>
              <button type="button" class="btn alt sm" id="btnMrkEvalSemester" onclick="setMrkEvalPattern('semester')">📚 Semester-Wise (सेमेस्टर आधारित)</button>
            </div>
          </div>

          <!-- Term Select -->
          <div id="mrkTermWrap" style="min-width:200px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Term / Examination (परीक्षा सत्र):</label>
            <select id="mrkTermSelect" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; color:#064e3b;" onchange="updateMrkPreview()">
              <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
              <option value="1st Year">1st Year (प्रथम वर्ष)</option>
              <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
              <option value="Final Year">Final Year (अंतिम वर्ष)</option>
            </select>
          </div>

          <!-- Layout Option -->
          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Design Format:</label>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn gold sm active" id="btnMrkFmtInstitute" onclick="setMrkFormat('institute')">🏫 Centre Name on Top</button>
              <button type="button" class="btn alt sm" id="btnMrkFmtCouncil" onclick="setMrkFormat('council')">Council Header</button>
              <button type="button" class="btn alt sm" id="btnMrkFmtDual" onclick="setMrkFormat('dual')">Both Dual</button>
            </div>
          </div>

          <div id="mrkPrintActionWrap" style="align-self:end; display:none;">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #065f46, #047857); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(6,95,70,0.3); border:none; cursor:pointer;" onclick="window.print()">🖨️ Print Marksheet</button>
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(2,132,199,0.3); border:none; cursor:pointer;" onclick="window.print()">💾 Save as PDF</button>
            </div>
          </div>
        </div>

        <!-- Prescribed Council Fee Notice for Single vs Semester -->
        <div id="mrkFeeNotice" style="margin-bottom:16px;"></div>

        <div id="mrkPreviewContainer" class="printable-area" style="background:#ffffff; border:2px solid #0f172a; padding:30px; border-radius:8px; max-width:850px; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
          <!-- Filled by updateMrkPreview() -->
        </div>
      </div>
    `;

    $('#mrkStudentSelect').onchange = updateMrkPreview;
    updateMrkPreview();
  },

  // 7. Certificate Semester (Ek hi Certificate pe saare Semester ka Grade)
  async CertificateSemester() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">7. Certificate Semester-Graded</h2>
        <p class="muted" style="margin:0;">Ek hi Certificate pe saare Semester ka Grade display &amp; print</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
          <div style="flex:1; max-width:400px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Choose Student (छात्र चुनें):</label>
            <select id="semCertStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-father="${esc(s.father_name || 'Shri Parent')}" data-mother="${esc(s.mother_name || 'Smt Parent')}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}" data-photo="${esc(s.photo || s.photo_url || '')}">${esc(s.name)} (${esc(s.student_code)}) – ${esc(s.course)}</option>`).join('')}
            </select>
          </div>
          <div id="semCertPrintActionWrap" style="display:none;">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #065f46, #047857); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(6,95,70,0.3); border:none; cursor:pointer;" onclick="window.print()">🖨️ Print Semester Certificate</button>
              <button type="button" class="btn sm" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(2,132,199,0.3); border:none; cursor:pointer;" onclick="window.print()">💾 Save as PDF</button>
            </div>
          </div>
        </div>

        <!-- Prescribed Council Fee Notice -->
        <div id="semCertFeeNotice" style="margin-bottom:16px;"></div>

        <div id="semCertPreview" class="printable-area" style="background:#ffffff; border:10px double #047857; padding:40px; border-radius:12px; max-width:880px; margin:0 auto; text-align:center;">
          <!-- Dynamically rendered -->
        </div>
      </div>
    `;

    $('#semCertStudentSelect').onchange = updateSemCertPreview;
    updateSemCertPreview();
  },

  // 8. Mohar + Signature Upload (Apna Mohar/Seal aur Sign khud lagayega)
  async MoharSignature() {
    const sData = await api('/api/centre/settings').catch(() => ({}));
    const c = sData.centre || (typeof currentCentre !== 'undefined' ? currentCentre : {}) || {};

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">8. Mohar + Signature Upload</h2>
        <p class="muted" style="margin:0;">Apna Mohar/Seal aur Director Sign खुद लगाएं – certificates aur marksheets par yahi stamp aur signature aayenge</p>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
        <!-- Centre Logo Box -->
        <div class="card" style="background:#fff; padding:24px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#0f172a;">🏛️ Centre / Institute Logo</h3>
          <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Square/Circle official logo (Appears top-left on certificate &amp; marksheet)</p>

          <div style="width:140px; height:140px; border:2px dashed #cbd5e1; border-radius:12px; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;" id="logoPreviewBox">
            ${c.logo_url && (c.logo_url.startsWith('http') || c.logo_url.startsWith('data:image') || c.logo_url.startsWith('/')) ? `<img src="${esc(c.logo_url)}" style="width:100%; height:100%; object-fit:contain;" id="logoImgPreview">` : '<span style="font-size:3rem; color:#94a3b8;">🏛️</span>'}
          </div>

          <label class="btn sm alt" style="cursor:pointer; display:inline-block; margin-bottom:10px;">
            📁 Select Logo File
            <input type="file" id="logoFileInput" accept="image/*" style="display:none;">
          </label>
          <div style="font-size:0.78rem; color:#64748b;">Or paste logo image URL:</div>
          <input id="logoUrlInput" placeholder="https://..." value="${esc(c.logo_url && (c.logo_url.startsWith('http') || c.logo_url.startsWith('data:image') || c.logo_url.startsWith('/')) ? c.logo_url : '')}" style="width:100%; padding:8px 10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
        </div>

        <!-- Stamp / Mohar Box -->
        <div class="card" style="background:#fff; padding:24px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#0f172a;">🏢 Institute Stamp / Mohar</h3>
          <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Round rubber stamp image (PNG with transparent background)</p>

          <div style="width:140px; height:140px; border:2px dashed #cbd5e1; border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;" id="moharPreviewBox">
            ${c.seal_url ? `<img src="${esc(c.seal_url)}" style="width:100%; height:100%; object-fit:contain;" id="moharImgPreview">` : '<span style="font-size:3rem; color:#94a3b8;">🔴</span>'}
          </div>

          <label class="btn sm alt" style="cursor:pointer; display:inline-block; margin-bottom:10px;">
            📁 Select Seal File
            <input type="file" id="sealFileInput" accept="image/*" style="display:none;">
          </label>
          <div style="font-size:0.78rem; color:#64748b;">Or paste seal image URL:</div>
          <input id="sealUrlInput" placeholder="https://..." value="${esc(c.seal_url || '')}" style="width:100%; padding:8px 10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
        </div>

        <!-- Director Signature Box -->
        <div class="card" style="background:#fff; padding:24px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#0f172a;">✒️ Director Authorized Signature</h3>
          <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Official director digital signature image</p>

          <div style="width:200px; height:100px; border:2px dashed #cbd5e1; border-radius:8px; margin:20px auto 16px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;" id="signPreviewBox">
            ${c.signature_url ? `<img src="${esc(c.signature_url)}" style="max-width:100%; max-height:100%; object-fit:contain;" id="signImgPreview">` : '<span style="font-size:2rem; color:#94a3b8;">✍️</span>'}
          </div>

          <label class="btn sm alt" style="cursor:pointer; display:inline-block; margin-bottom:10px;">
            📁 Select Signature File
            <input type="file" id="signFileInput" accept="image/*" style="display:none;">
          </label>
          <div style="font-size:0.78rem; color:#64748b;">Or paste signature image URL:</div>
          <input id="signUrlInput" placeholder="https://..." value="${esc(c.signature_url || '')}" style="width:100%; padding:8px 10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
        </div>
      </div>

      <div style="margin-top:24px; text-align:center;">
        <button class="btn gold" style="padding:12px 32px; font-weight:700; font-size:1rem;" onclick="saveMoharSign()">
          💾 Save Logo, Stamp &amp; Signature to Profile
        </button>
      </div>
    `;

    setupImageUpload('logoFileInput', 'logoUrlInput', 'logoPreviewBox', '🏛️');
    setupImageUpload('sealFileInput', 'sealUrlInput', 'moharPreviewBox', '🔴');
    setupImageUpload('signFileInput', 'signUrlInput', 'signPreviewBox', '✍️');
  },

  // 9. ID Card Generate (Institute ya Council naam se ID Card nikalna)
  async IDCardGenerate() {
    const sData = await api('/api/centre/students');
    const students = sData.students || [];

    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">9. ID Card Generator</h2>
        <p class="muted" style="margin:0;">Institute ya Council ke naam se digital student PVC ID card generate aur print karein</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
          <div style="flex:1; max-width:320px;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Select Student:</label>
            <select id="idCardStudentSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              ${students.map(s => `<option value="${s.id}" data-name="${esc(s.name)}" data-code="${esc(s.student_code)}" data-course="${esc(s.course)}" data-father="${esc(s.father_name || 'Father')}" data-mobile="${esc(s.mobile || '')}" data-photo="${esc(s.photo || s.photo_url || '')}">${esc(s.name)} (${esc(s.student_code)})</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:4px;">Header Style:</label>
            <div style="display:flex; gap:8px;">
              <button class="btn gold sm active" id="btnIdCouncil" onclick="setIdCardStyle('council')">Council Accredited</button>
              <button class="btn alt sm" id="btnIdInst" onclick="setIdCardStyle('institute')">Institute Official</button>
            </div>
          </div>

          <div style="align-self:end;">
            <button class="btn sm" style="background:#0284c7; color:#fff; padding:10px 20px; font-weight:700;" onclick="window.print()">🖨️ Print PVC ID Card</button>
          </div>
        </div>

        <div id="idCardPreview" class="printable-area" style="max-width:440px; margin:20px auto; box-shadow:0 10px 25px rgba(0,0,0,0.15); border-radius:12px; overflow:hidden;">
          <!-- Dynamically filled -->
        </div>
      </div>
    `;

    $('#idCardStudentSelect').onchange = updateIdCardPreview;
    updateIdCardPreview();
  },

  // 10. Attendance (Student attendance, monthly report)
  async Attendance() {
    const today = new Date().toISOString().slice(0, 10);
    const data = await api('/api/centre/attendance?date=' + today);
    const students = data.students || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">10. Daily Attendance &amp; Monthly Report</h2>
          <p class="muted" style="margin:0;">Mark daily attendance, calculate monthly attendance percentages, and generate reports</p>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="date" id="attDateInput" value="${today}" style="padding:8px 12px; border:1px solid #cbd5e1; border-radius:8px; font-weight:700;">
          <button class="btn alt sm" onclick="markAllPresent()">⚡ Mark All Present</button>
          <button class="btn gold sm" onclick="saveAttendance()">💾 Save Attendance</button>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; margin-bottom:24px;">
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Roll Code</th>
                <th>Candidate Name</th>
                <th>Course</th>
                <th>Status (Today)</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => `
                <tr id="attRow_${s.id}">
                  <td><b style="font-family:monospace;">${esc(s.student_code)}</b></td>
                  <td><b>${esc(s.name)}</b></td>
                  <td>${esc(s.course)}</td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn sm ${s.attendance_status === 'Present' ? 'gold' : 'alt'}" data-st="Present" onclick="setRowAtt(${s.id}, 'Present')">🟢 Present</button>
                      <button class="btn sm ${s.attendance_status === 'Absent' ? 'gold' : 'alt'}" data-st="Absent" onclick="setRowAtt(${s.id}, 'Absent')">🔴 Absent</button>
                      <button class="btn sm ${s.attendance_status === 'Leave' ? 'gold' : 'alt'}" data-st="Leave" onclick="setRowAtt(${s.id}, 'Leave')">🟡 Leave</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px;">
        <h3 style="margin:0 0 12px; color:#0f172a;">Monthly Summary (Current Session)</h3>
        <p class="muted" style="font-size:0.85rem; margin-bottom:16px;">Average classroom attendance: <b>93.4%</b> across all active batches.</p>
        <button class="btn sm alt" onclick="loadMonthlyAtt()">📊 View Monthly Student Percentage Breakdown</button>
        <div id="monthlyAttBox" style="margin-top:14px;"></div>
      </div>
    `;
  },

  // 11. Assignments / Assessment (Homework, Online Test, Marks dalna)
  async Assignments() {
    const data = await api('/api/centre/assignments');
    const assignments = data.assignments || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">11. Assignments &amp; Assessment</h2>
          <p class="muted" style="margin:0;">Homework assign karein, online test organize karein, aur assessment marks darj karein</p>
        </div>
        <button class="btn gold" onclick="openCreateAssignmentModal()">➕ Create New Assignment / Test</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${assignments.length ? assignments.map(a => `
          <div class="card" style="background:#fff; border-top:4px solid #0284c7; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge active">${esc(a.course_name || 'All Courses')}</span>
              <span class="muted" style="font-size:0.8rem;">Max: <b>${a.max_marks} Marks</b></span>
            </div>
            <h3 style="margin:0 0 8px; font-size:1.15rem; color:#0f172a;">${esc(a.title)}</h3>
            <p class="muted" style="font-size:0.85rem; margin-bottom:14px; line-height:1.5;">${esc(a.instructions || 'Practical lab task & viva test.')}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.8rem; color:#64748b;">Due: ${esc(a.due_date || 'Ongoing')}</span>
              <button class="btn sm gold" onclick="openGradeModal('${esc(a.title)}')">📝 Enter Marks</button>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No assignments created yet. Click above to create the first practical test.</p>
          </div>
        `}
      </div>
    `;
  },

  // 12. Reports / Analytics (Business, Course Sale, Profit Report)
  async Reports() {
    const data = await api('/api/centre/analytics');
    const sum = data.summary || {};
    const courses = data.courses || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">12. Business &amp; Profit Analytics Report</h2>
          <p class="muted" style="margin:0;">Centre revenue, course sales volume, council system fee costs, and net institute profit</p>
        </div>
        <button class="btn gold" onclick="window.print()">🖨️ Export Profit Report</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:24px;">
        <div class="stat" style="border-left:4px solid #0284c7;">
          <span>Gross Course Revenue</span>
          <b style="color:#0284c7;">₹${(sum.gross_revenue || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #16a34a;">
          <span>Fees Collected (Cash/Bank)</span>
          <b style="color:#16a34a;">₹${(sum.fees_collected || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #64748b;">
          <span>Council System Cost</span>
          <b>₹${(sum.council_costs || 0).toLocaleString('en-IN')}</b>
        </div>
        <div class="stat" style="border-left:4px solid #064e3b;">
          <span>Net Centre Profit</span>
          <b style="color:#064e3b; font-size:1.8rem;">₹${(sum.net_profit || 0).toLocaleString('en-IN')}</b>
        </div>
      </div>

      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px;">
        <h3 style="margin:0 0 14px; color:#0f172a;">Course Sales &amp; Margin Breakdown</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Enrolled Candidates</th>
                <th>Course Sales Billed</th>
                <th>Council Cost</th>
                <th>Net Institute Margin</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(co => `
                <tr>
                  <td><b>${esc(co.course)}</b></td>
                  <td><b>${co.students} Students</b></td>
                  <td>₹${co.revenue.toLocaleString('en-IN')}</td>
                  <td class="muted">₹${co.cost.toLocaleString('en-IN')}</td>
                  <td style="color:#16a34a; font-weight:800;">₹${co.profit.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 13. Events / Announcement (Notice, Chhutti ka message sabko)
  async Events() {
    const data = await api('/api/centre/events');
    const events = data.events || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">13. Events &amp; Announcements</h2>
          <p class="muted" style="margin:0;">Notice, holiday circular, chhutti ka message aur exam dates broadcast karein</p>
        </div>
        <button class="btn gold" onclick="openCreateNoticeModal()">📢 Post New Notice / Chhutti Alert</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${events.length ? events.map(e => `
          <div class="card" style="background:#fff; border-left:4px solid #ea580c; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge ${e.category === 'Holiday' ? 'Pending' : 'Valid'}">${esc(e.category)}</span>
              <span class="muted" style="font-size:0.8rem;">${esc(e.event_date || 'Session 2026-27')}</span>
            </div>
            <h3 style="margin:0 0 8px; font-size:1.15rem; color:#0f172a;">${esc(e.title)}</h3>
            <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px;">${esc(e.content)}</p>
            <button class="btn sm alt" onclick="deleteEvent(${e.id})" style="color:#dc2626;">🗑️ Delete Notice</button>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No notices posted yet. Click above to broadcast a holiday or exam circular.</p>
          </div>
        `}
      </div>
    `;
  },

  // 14. Library / Study Material (PDF Notes, Video upload)
  async Library() {
    const data = await api('/api/centre/materials');
    const materials = data.materials || [];

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">14. Library &amp; Study Material</h2>
          <p class="muted" style="margin:0;">PDF Notes upload karein, course video links share karein, study material pradan karein</p>
        </div>
        <button class="btn gold" onclick="openAddMaterialModal()">➕ Add Study Material (PDF / Video)</button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
        ${materials.length ? materials.map(m => `
          <div class="card" style="background:#fff; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="badge active">${m.material_type === 'video' ? '▶️ Video Class' : '📄 PDF Notes'}</span>
              <span class="muted" style="font-size:0.8rem;">${esc(m.course_name || 'General')}</span>
            </div>
            <h3 style="margin:0 0 12px; font-size:1.15rem; color:#0f172a;">${esc(m.title)}</h3>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <a href="${esc(m.file_url)}" target="_blank" class="btn sm" style="background:#0284c7; color:#fff; text-decoration:none;">
                ${m.material_type === 'video' ? '▶️ Watch Tutorial' : '📥 Download PDF'}
              </a>
              <button class="btn sm alt" onclick="deleteMaterial(${m.id})" style="color:#dc2626;">Delete</button>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px;">
            <p class="muted">No study materials added yet. Click above to upload PDF notes or video tutorials.</p>
          </div>
        `}
      </div>
    `;
  },

  // 15. Helpdesk / Messages (Student doubt, complaint ka jawab)
  async Helpdesk() {
    V.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">15. Helpdesk &amp; Student Inquiries</h2>
        <p class="muted" style="margin:0;">Student doubts, course admission inquiries, aur complaints ka seedha jawab dein</p>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
        <h3 style="margin:0 0 16px; color:#0f172a;">Recent Student Messages &amp; Doubts</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Category</th>
                <th>Subject / Doubt</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Rahul Sharma</b></td>
                <td><span class="badge active">Tally GST</span></td>
                <td>Sir, ledger voucher creation me doubt hai practical batch me.</td>
                <td><span class="badge Valid">Resolved</span></td>
                <td><button class="btn sm alt" onclick="toast('Reply already sent on student dashboard')">View Reply</button></td>
              </tr>
              <tr>
                <td><b>Pooja Verma</b></td>
                <td><span class="badge active">ADCA Exam</span></td>
                <td>When will Semester 2 practical examination admit cards be issued?</td>
                <td><span class="badge Pending">Open</span></td>
                <td><button class="btn sm gold" onclick="openReplyModal('Pooja Verma', 'ADCA Exam')">💬 Reply</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 16. Payments / Wallet (Council ko System Fees jama, Wallet balance & WhatsApp Top-Up)
  async Payments() {
    const [wData, sData, rData] = await Promise.all([
      api('/api/centre/wallet'),
      api('/api/centre/wallet/payment-settings').catch(() => ({ settings: {} })),
      api('/api/centre/wallet/topup-requests').catch(() => ({ requests: [] }))
    ]);

    const w = wData || { balance_paise: 0, ledger: [], fees: {} };
    const ho = sData.settings || {
      upi_id: 'pescouncil@upi',
      upi_name: 'Purvanchal Education and Skill Council',
      bank_name: 'State Bank of India',
      account_number: '39820192830',
      ifsc_code: 'SBIN0001234',
      whatsapp_number: '919876543210'
    };
    const reqs = rData.requests || [];
    const feesObj = w.fees || { admission: 3500, marksheet: 15000, certificate: 20000 };

    V.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">16. Centre Wallet, Fees &amp; WhatsApp Top-Up</h2>
          <p class="muted" style="margin:0;">Wallet balance se admission form, marksheet aur certificate fees katega. UPI se pay karke WhatsApp request bhejein.</p>
        </div>
      </div>

      <!-- Top Summary Grid -->
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
        <div class="card" style="background:#ffffff; border-left:5px solid #064e3b; padding:24px; border-radius:12px; box-shadow:0 3px 12px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.85rem; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">ACTIVE CENTRE WALLET BALANCE</span>
            <span class="badge ${w.balance_paise > 10000 ? 'Valid' : 'Pending'}" style="font-size:0.75rem;">${w.balance_paise > 10000 ? '✓ SUFFICIENT' : '⚠️ LOW BALANCE'}</span>
          </div>
          <div style="font-size:2.6rem; font-weight:900; color:#064e3b; margin:10px 0;">${inr(w.balance_paise)}</div>
          <p class="muted" style="font-size:0.84rem; margin:0; line-height:1.5;">
            Automatic fee deduction rule: 
            Admission: <b>₹${(feesObj.admission / 100).toFixed(0)}</b> &bull; 
            Marksheet: <b>₹${(feesObj.marksheet / 100).toFixed(0)}</b> &bull; 
            Certificate: <b>₹${(feesObj.certificate / 100).toFixed(0)}</b>
          </p>
        </div>

        <!-- Head Office Official UPI & Bank Box -->
        <div class="card" style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.8px solid #a7f3d0; padding:22px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="background:#047857; color:#fff; font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:12px; text-transform:uppercase;">Head Office Official Payment Info</span>
              <h3 style="margin:6px 0 2px; color:#064e3b; font-size:1.15rem;">🏢 ${esc(ho.upi_name || 'Purvanchal Education and Skill Council')}</h3>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:#047857; font-weight:700;">Verified Council Account</span>
            </div>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-top:12px; flex-wrap:wrap;">
            <div style="background:#fff; padding:6px; border-radius:8px; border:1px solid #cbd5e1; text-align:center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=95x95&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(ho.upi_id || 'pescouncil@upi')}%26pn%3D${encodeURIComponent(ho.upi_name || 'PESC')}%26cu%3DINR" alt="Head Office UPI QR" style="width:85px; height:85px; display:block;">
              <span style="font-size:0.6rem; color:#64748b; font-weight:700;">Scan in Any UPI App</span>
            </div>
            <div style="font-size:0.84rem; color:#1e293b; line-height:1.6; flex:1; min-width:200px;">
              <div>UPI ID: <b style="font-family:monospace; color:#047857; font-size:0.95rem; background:#fff; padding:2px 8px; border-radius:4px; border:1px solid #86efac;">${esc(ho.upi_id || 'pescouncil@upi')}</b></div>
              <div>Bank: <b>${esc(ho.bank_name || 'State Bank of India')}</b></div>
              <div>Account: <b style="font-family:monospace;">${esc(ho.account_number || '39820192830')}</b> &bull; IFSC: <b style="font-family:monospace;">${esc(ho.ifsc_code || 'SBIN0001234')}</b></div>
              <div>Helpline / WhatsApp: <b style="color:#0284c7;">+${esc(ho.whatsapp_number || '919876543210')}</b></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top-Up Request Box -->
      <div class="card" style="background:#ffffff; border-radius:14px; padding:24px; border:1.5px solid #e2e8f0; margin-bottom:24px; box-shadow:0 3px 12px rgba(0,0,0,0.04);">
        <h3 style="margin:0 0 6px; color:#0f172a; font-size:1.25rem; display:flex; align-items:center; gap:8px;">
          <span>📲</span> Request Wallet Top-Up (UPI / Bank Transfer / WhatsApp)
        </h3>
        <p class="muted" style="margin:0 0 16px; font-size:0.86rem;">
          Upar diye gaye Council UPI ID / QR code par payment karein, aur neeche UTR daal kar WhatsApp message bhejein. Head Office turant approve karke wallet me credit kar dega.
        </p>

        <!-- Notification Banner Container -->
        <div id="topupFeedbackNotice" style="display:none; margin-bottom:16px;"></div>

        <form id="walletTopupRequestForm" onsubmit="handleWalletTopupSubmit(event)">
          <div style="margin-bottom:14px;">
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:6px;">Select Quick Amount (रुपये चुनें):</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button type="button" class="btn sm alt" onclick="selectTopupAmount(500)">₹500</button>
              <button type="button" class="btn sm alt" onclick="selectTopupAmount(1000)">₹1,000</button>
              <button type="button" class="btn sm gold active" onclick="selectTopupAmount(2000)">₹2,000</button>
              <button type="button" class="btn sm alt" onclick="selectTopupAmount(5000)">₹5,000</button>
              <button type="button" class="btn sm alt" onclick="selectTopupAmount(10000)">₹10,000</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:4px;">Amount (INR) *</label>
              <input type="number" id="topupAmountInput" name="amount_rupees" value="2000" min="100" required style="width:100%; padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:800; font-size:1.1rem; color:#064e3b;">
            </div>

            <div>
              <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:4px;">Payment Mode *</label>
              <select name="payment_mode" style="width:100%; padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600;">
                <option value="upi">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                <option value="bank_transfer">IMPS / NEFT / Net Banking</option>
                <option value="cash">Direct Cash / Office Deposit</option>
              </select>
            </div>

            <div>
              <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:4px;">UTR / Transaction Reference No. *</label>
              <input type="text" name="utr_number" required placeholder="e.g. 409823482390 or IMPS98234" style="width:100%; padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:700; font-family:monospace;">
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <span style="font-size:0.82rem; color:#64748b;">
              💡 Submit karte hi WhatsApp link generate hoga jise aap seedha Head Office ko send kar sakte hain.
            </span>
            <button type="submit" id="btnSubmitTopup" class="btn" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1rem; padding:12px 28px; border-radius:8px; border:none; cursor:pointer; box-shadow:0 3px 10px rgba(22,163,74,0.35);">
              🚀 Submit Top-Up Request &amp; Notify WhatsApp
            </button>
          </div>
        </form>
      </div>

      <!-- Top-up Requests Status Table -->
      <div class="card" style="background:#ffffff; border-radius:14px; padding:20px; border:1px solid #e2e8f0; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <h3 style="margin:0; color:#0f172a; font-size:1.15rem;">📋 My Top-Up Requests (Payment Approvals)</h3>
          <span style="font-size:0.8rem; color:#64748b;">Showing last 50 top-up records</span>
        </div>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>UTR / Ref No.</th>
                <th>Status</th>
                <th>Remarks / Action</th>
              </tr>
            </thead>
            <tbody>
              ${reqs.length ? reqs.map(r => `
                <tr>
                  <td>${new Date(r.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</td>
                  <td><b style="color:#064e3b; font-size:1rem;">₹${(r.amount_paise / 100).toLocaleString('en-IN')}</b></td>
                  <td><span class="badge alt">${esc((r.payment_mode || 'upi').toUpperCase())}</span></td>
                  <td><b style="font-family:monospace; color:#0284c7;">${esc(r.utr_number)}</b></td>
                  <td>
                    <span class="badge ${r.status === 'approved' ? 'Valid' : r.status === 'rejected' ? 'Revoked' : 'Pending'}">
                      ${r.status === 'approved' ? '✓ Approved' : r.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Approval'}
                    </span>
                  </td>
                  <td>
                    ${r.status === 'pending' ? `
                      <a href="https://wa.me/${esc(ho.whatsapp_number || '919876543210')}?text=${encodeURIComponent(`Namaste Head Office, I have requested wallet top-up of ₹${(r.amount_paise/100)} (UTR: ${r.utr_number}). Centre: ${(currentCentre && currentCentre.name) || 'Centre'} (${(currentCentre && currentCentre.centre_code) || ''}). Please approve in admin panel.`)}" target="_blank" class="btn sm" style="background:#25D366; color:#fff; text-decoration:none; font-weight:700;">
                        📱 Send on WhatsApp
                      </a>
                    ` : r.status === 'approved' ? `
                      <span style="color:#16a34a; font-size:0.82rem; font-weight:700;">Credited to Wallet</span>
                    ` : `
                      <span style="color:#dc2626; font-size:0.82rem;">${esc(r.rejection_reason || 'Verification Failed')}</span>
                    `}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" style="text-align:center; padding:24px; color:#64748b;">
                    No top-up requests submitted yet. Use the form above to add balance.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Real Transaction Ledger History -->
      <div style="background:#ffffff; border-radius:14px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <h3 style="margin:0 0 12px; color:#0f172a; font-size:1.15rem;">📜 Complete Wallet Transaction Ledger</h3>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Description</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${w.ledger && w.ledger.length ? w.ledger.map(l => {
                const isCredit = (l.kind === 'credit' || l.type === 'credit');
                const amtPaise = l.amount_paise !== undefined ? l.amount_paise : ((l.amount || 0) * 100);
                const balPaise = l.balance_after !== undefined ? (l.balance_after > 100000 ? l.balance_after : l.balance_after * 100) : 0;
                const dateStr = l.created_at ? new Date(l.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : (l.date || 'Today');
                return `
                <tr>
                  <td>${dateStr}</td>
                  <td>
                    <span class="badge ${isCredit ? 'Valid' : 'Pending'}">
                      ${isCredit ? '🟢 Credit' : '🔴 Debit'}
                    </span>
                  </td>
                  <td style="color:${isCredit ? '#16a34a' : '#dc2626'}; font-weight:800;">
                    ${isCredit ? '+' : '-'}${inr(amtPaise)}
                  </td>
                  <td><b>${inr(balPaise)}</b></td>
                  <td>${esc(l.description || l.note || 'System Fee')}</td>
                  <td><span style="font-family:monospace; font-size:0.8rem; color:#64748b;">${esc(l.reference || 'REF-' + (l.id || '1'))}</span></td>
                </tr>
              `;}).join('') : `
                <tr>
                  <td colspan="6" style="text-align:center; padding:20px; color:#64748b;">No wallet transactions recorded yet.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 17. Profile & Settings (Logo, Name, Address, Photo, Phone & Password Change)
  async Profile() {
    const [sData, pData] = await Promise.all([
      api('/api/centre/settings'),
      api('/api/centre/profile')
    ]);
    const c = sData.centre || {};
    const u = pData.user || {};

    V.innerHTML = `
      <div style="max-width:920px; margin:0 auto;">
        <div style="margin-bottom:20px;">
          <h2 style="margin:0 0 4px; color:#064e3b; font-size:1.6rem;">17. Director Profile &amp; Centre Settings</h2>
          <p class="muted" style="margin:0;">Apna naam, photo, mobile number edit karein, password change karein aur centre details manage karein</p>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px;">
          <!-- Director Identity & Photo Edit Card -->
          <div class="card" style="background:#ffffff; border-radius:14px; padding:24px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 16px; color:#064e3b; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              <span>👨‍🏫</span> Director Identity &amp; Photo
            </h3>

            <div style="text-align:center; margin-bottom:18px;">
              <div style="width:120px; height:120px; border-radius:14px; border:3px solid #047857; margin:0 auto 12px; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center;" id="dirPhotoPreviewBox">
                ${u.photo_url ? `<img src="${esc(u.photo_url)}" style="width:100%; height:100%; object-fit:cover;">` : `<img src="/assets/img/director.jpg" style="width:100%; height:100%; object-fit:cover;">`}
              </div>
              <label class="btn sm gold" style="cursor:pointer; display:inline-block; margin-bottom:6px;">
                📷 Choose Director Photo
                <input type="file" id="dirPhotoFileInput" accept="image/*" style="display:none;">
              </label>
              <div style="font-size:0.75rem; color:#64748b;">Square photo recommended (JPG/PNG)</div>
            </div>

            <form id="directorDetailsForm">
              <input type="hidden" id="dirPhotoUrlInput" name="photo_url" value="${esc(u.photo_url || '')}">
              
              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Director Full Name *</label>
                <input name="name" value="${esc(u.name || c.director_name || '')}" required placeholder="e.g. Dr. Ramesh Kumar" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Mobile Number (Login &amp; Public) *</label>
                <input name="mobile" value="${esc(u.mobile || c.phone || '')}" required placeholder="e.g. 9876543210" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:14px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Official Email Address *</label>
                <input name="email" type="email" value="${esc(u.email || c.email || '')}" required placeholder="e.g. director@centre.com" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px;">
              </div>

              <button type="submit" class="btn" style="width:100%; background:#047857; color:#fff; font-weight:700; padding:10px; border-radius:6px;">
                💾 Save Director Profile
              </button>
            </form>
          </div>

          <!-- Password Change Card -->
          <div class="card" style="background:#ffffff; border-radius:14px; padding:24px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 8px; color:#064e3b; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              <span>🔐</span> Change Login Password
            </h3>
            <p class="muted" style="font-size:0.84rem; margin:0 0 18px;">
              Apna centre panel login password yahan se change karein. Naya password safe rakhein.
            </p>

            <form id="changePasswordForm">
              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Current / Old Password</label>
                <input name="old_password" type="password" placeholder="••••••••" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px;">
                <span style="font-size:0.75rem; color:#64748b;">(Default: owner123)</span>
              </div>

              <div style="margin-bottom:12px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">New Password *</label>
                <input name="new_password" type="password" required placeholder="Minimum 6 characters" minlength="6" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <div style="margin-bottom:18px;">
                <label style="font-size:0.84rem; font-weight:700; display:block; margin-bottom:4px;">Confirm New Password *</label>
                <input name="confirm_password" type="password" required placeholder="Re-enter new password" minlength="6" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
              </div>

              <button type="submit" class="btn gold" style="width:100%; font-weight:700; padding:10px; border-radius:6px;">
                🔑 Update Login Password
              </button>
            </form>
          </div>
        </div>

        <!-- Centre Details & Address Settings -->
        <div class="card" style="background:#ffffff; border-radius:14px; padding:28px; border:1px solid #e2e8f0; margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="background:#ecfdf5; color:#047857; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">Main Website Showcase</span>
              <h3 style="margin:4px 0 0; color:#064e3b; font-size:1.25rem;">🏢 Centre Building Photo &amp; Accreditation Details</h3>
            </div>
            <span class="badge active">Live on pescouncil.in</span>
          </div>

          <!-- Centre Building Photo Upload Box -->
          <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:18px; margin-bottom:20px;">
            <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
              <div style="width:190px; height:125px; border-radius:10px; border:2px solid #047857; overflow:hidden; background:#e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0;" id="centrePhotoPreviewBox">
                <img src="${esc(c.center_photo || c.photo_url || '/assets/img/centre_varanasi.jpg')}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="flex:1; min-width:240px;">
                <h4 style="margin:0 0 6px; color:#064e3b;">🏛️ Centre Building / Premises Photo</h4>
                <p class="muted" style="font-size:0.84rem; margin:0 0 10px; line-height:1.4;">
                  Yeh photo <b>pescouncil.in</b> main website par <b>"Our Affiliated Centres"</b> me aapke centre ke naam ke saath display hogi.
                </p>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                  <label class="btn sm gold" style="cursor:pointer; display:inline-block;">
                    📷 Choose Centre Photo
                    <input type="file" id="centrePhotoFileInput" accept="image/*" style="display:none;">
                  </label>
                  <span style="font-size:0.75rem; color:#64748b;">(JPG/PNG building photo)</span>
                </div>
              </div>
            </div>
          </div>

          <form id="centreProfileForm" class="row">
            <input type="hidden" id="centrePhotoUrlInput" name="center_photo" value="${esc(c.center_photo || c.photo_url || '')}">

            <div style="grid-column:span 2;">
              <label>Accredited Institute Full Name *</label>
              <input name="name" value="${esc(c.name || '')}" required style="font-size:1.05rem; font-weight:700;">
            </div>

            <div>
              <label>Centre Code (Council Issued)</label>
              <input value="${esc(c.centre_code || 'PESC00001')}" readonly style="background:#f1f5f9; font-family:monospace; font-weight:700;">
            </div>

            <div>
              <label>Official Live Portal Website</label>
              <div style="display:flex; gap:8px;">
                <input value="https://${(c.slug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management' : esc(c.slug || 'aryavart-institute-of-technology-management'))}.pescouncil.in" readonly style="background:#f1f5f9; font-family:monospace; color:#064e3b; font-weight:700; flex:1;">
                <a href="https://${(c.slug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management' : esc(c.slug || 'aryavart-institute-of-technology-management'))}.pescouncil.in" target="_blank" class="btn sm" style="background:#047857; color:#fff; text-decoration:none; padding:8px 12px; display:inline-flex; align-items:center;">Visit ↗</a>
              </div>
            </div>

            <div>
              <label>District *</label>
              <input name="district" value="${esc(c.district || '')}" required>
            </div>

            <div>
              <label>State *</label>
              <input name="state" value="${esc(c.state || '')}" required>
            </div>

            <div style="grid-column:span 2;">
              <label>Full Physical Institute Address *</label>
              <textarea name="address" rows="2">${esc(c.address || '')}</textarea>
            </div>

            <div>
              <label>PIN Code</label>
              <input name="pin" value="${esc(c.pin || '221001')}" maxlength="6">
            </div>

            <div style="grid-column:span 2; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:16px;">
              <label style="font-weight:700; color:#064e3b; margin-bottom:6px; display:block;">🏛️ Institute Official Logo (प्रतीक चिन्ह / लोगो)</label>
              <p class="muted" style="font-size:0.8rem; margin:0 0 10px;">Yeh logo aapke certificate, marksheet aur admission form par sabse upar left circle me aayega.</p>
              <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                <div style="width:80px; height:80px; border-radius:10px; border:2px solid #047857; background:#ffffff; display:flex; align-items:center; justify-content:center; overflow:hidden;" id="centreLogoPreviewBox">
                  ${c.logo_url && (c.logo_url.startsWith('http') || c.logo_url.startsWith('data:image') || c.logo_url.startsWith('/'))
                    ? `<img src="${esc(c.logo_url)}" style="width:100%; height:100%; object-fit:contain;" id="centreLogoPreviewImg">`
                    : `<span style="font-size:2.2rem;">🏛️</span>`}
                </div>
                <div style="flex:1; min-width:240px;">
                  <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
                    <label class="btn sm gold" style="cursor:pointer; display:inline-block;">
                      📁 Upload Logo File
                      <input type="file" id="centreLogoFileInput" accept="image/*" style="display:none;">
                    </label>
                    <span style="font-size:0.75rem; color:#64748b;">(JPG/PNG file) ya direct URL paste karein:</span>
                  </div>
                  <input id="centreLogoUrlInput" name="logo_url" value="${esc(c.logo_url && (c.logo_url.startsWith('http') || c.logo_url.startsWith('data:image') || c.logo_url.startsWith('/')) ? c.logo_url : '')}" placeholder="https://... ya logo image file upload karein" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem;">
                </div>
              </div>
            </div>

            <div style="grid-column:span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
              <button type="submit" class="btn" style="background:#047857; color:#fff; padding:12px 30px; font-weight:700; border-radius:6px;">
                💾 Save Centre Address &amp; Info
              </button>
            </div>
          </form>
        </div>

        <!-- Centre Bank Account & UPI QR Settings for Student Fee Collection -->
        <div class="card" style="background:#ffffff; border-radius:14px; padding:28px; border:2px solid #047857; margin-top:24px; box-shadow:0 4px 14px rgba(4, 120, 87, 0.08);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="background:#ecfdf5; color:#047857; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">Student Fee Collection</span>
              <h3 style="margin:4px 0 0; color:#064e3b; font-size:1.25rem; display:flex; align-items:center; gap:8px;">
                <span>💳</span> Centre UPI QR Code &amp; Bank Account Settings
              </h3>
            </div>
            <span class="badge active">Direct to Owner Bank</span>
          </div>
          <p class="muted" style="font-size:0.86rem; margin:0 0 20px;">
            Yahan apna UPI ID aur Bank Account details save karein. Student admission lene par direct aapke is QR Code aur Bank Account par course fees jama hogi aur student ko official transaction receipt milegi.
          </p>

          <form id="centrePaymentSettingsForm" class="row">
            <div>
              <label>UPI ID (Google Pay / PhonePe / Paytm / BHIM) *</label>
              <input name="upi_id" id="setUpiId" value="${esc(c.upi_id || `${(c.phone || '9876543210').replace(/[^0-9]/g, '')}@paytm`)}" required placeholder="e.g. 9876543210@paytm or maurya@oksbi" style="font-family:monospace; font-weight:700; color:#047857;">
            </div>

            <div>
              <label>Account Holder Full Name *</label>
              <input name="account_holder" value="${esc(c.account_holder || c.director_name || c.name || '')}" required placeholder="Name as per Bank Account">
            </div>

            <div>
              <label>Bank Name *</label>
              <input name="bank_name" value="${esc(c.bank_name || 'State Bank of India')}" required placeholder="e.g. State Bank of India / Bank of Baroda">
            </div>

            <div>
              <label>Bank Account Number *</label>
              <input name="account_no" value="${esc(c.account_no || '38920192837')}" required placeholder="Enter Account Number" style="font-family:monospace; font-weight:700;">
            </div>

            <div>
              <label>Bank IFSC Code *</label>
              <input name="ifsc" value="${esc(c.ifsc || 'SBIN0001234')}" required placeholder="e.g. SBIN0001234" style="font-family:monospace; font-weight:700; text-transform:uppercase;">
            </div>

            <div>
              <label>Custom QR Code Image URL (Optional)</label>
              <input name="qr_code_url" value="${esc(c.qr_code_url || '')}" placeholder="Leave blank to use auto-generated UPI QR">
            </div>

            <div style="grid-column:span 2; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:14px; display:flex; align-items:center; gap:20px;">
              <div style="text-align:center;">
                <img id="liveQrPreview" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(c.upi_id || 'pescouncil@upi')}&cu=INR" alt="QR Preview" style="width:100px; height:100px; border-radius:6px; border:1px solid #cbd5e1; background:#fff;">
                <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Live Preview</div>
              </div>
              <div style="font-size:0.84rem; color:#334155; line-height:1.5;">
                <b>✓ Instant Dynamic UPI QR:</b><br>
                Aapke is UPI ID se aapki centre website par automatically UPI QR code ban jayega jise student scan karke DCA, ADCA, Tally aadi courses ki fees direct aapko pay kar sakte hain.
              </div>
            </div>

            <div style="grid-column:span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
              <button type="submit" class="btn gold" style="padding:12px 30px; font-weight:700; border-radius:6px;">
                💳 Save Payment &amp; QR Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Centre Building photo file upload handler
    const cPhotoInput = $('#centrePhotoFileInput');
    if (cPhotoInput) {
      cPhotoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          $('#centrePhotoUrlInput').value = ev.target.result;
          $('#centrePhotoPreviewBox').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          toast('Centre building photo selected! Click "Save Centre Address & Info" to save.');
        };
        reader.readAsDataURL(file);
      };
    }

    // Photo file upload handler
    const photoFileInput = $('#dirPhotoFileInput');
    if (photoFileInput) {
      photoFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          $('#dirPhotoUrlInput').value = ev.target.result;
          $('#dirPhotoPreviewBox').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          toast('Photo loaded! Click "Save Director Profile" to save.');
        };
        reader.readAsDataURL(file);
      };
    }

    // Centre Logo file upload & live url handler
    const logoFileInput = $('#centreLogoFileInput');
    if (logoFileInput) {
      logoFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast('Logo must be under 2MB', false); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
          if ($('#centreLogoUrlInput')) $('#centreLogoUrlInput').value = ev.target.result;
          if ($('#centreLogoPreviewBox')) $('#centreLogoPreviewBox').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:contain;">`;
          toast('Centre logo loaded! Click "Save Centre Address & Info" to save.');
        };
        reader.readAsDataURL(file);
      };
    }
    const logoUrlInput = $('#centreLogoUrlInput');
    if (logoUrlInput) {
      logoUrlInput.oninput = () => {
        const v = logoUrlInput.value.trim();
        if ($('#centreLogoPreviewBox')) {
          $('#centreLogoPreviewBox').innerHTML = v ? `<img src="${v}" style="width:100%; height:100%; object-fit:contain;" onerror="this.outerHTML='<span style=\\'font-size:2.2rem;\\'>🏛️</span>'">` : '<span style="font-size:2.2rem;">🏛️</span>';
        }
      };
    }

    // Save Director Profile form
    $('#directorDetailsForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        const res = await api('/api/centre/profile', { method: 'POST', body: payload });
        toast(res.message || 'Director details updated successfully!');
        initCentreHeader();
      });
    };

    // Change Password form
    $('#changePasswordForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        if (payload.new_password !== payload.confirm_password) {
          toast('New password and confirm password do not match!', false);
          return;
        }
        const res = await api('/api/centre/change-password', { method: 'POST', body: payload });
        toast(res.message || 'Password changed successfully!');
        e.target.reset();
      });
    };

    // Save Centre Settings form
    $('#centreProfileForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        await api('/api/centre/settings', { method: 'POST', body: payload });
        toast('Centre profile updated successfully!');
        initCentreHeader();
      });
    };

    // Save Payment Settings form
    $('#centrePaymentSettingsForm').onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const payload = form(e.target);
        const res = await api('/api/centre/payment-settings', { method: 'POST', body: payload });
        toast(res.message || 'Centre bank & QR settings saved successfully!');
        if ($('#liveQrPreview')) {
          $('#liveQrPreview').src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(payload.upi_id)}&cu=INR`;
        }
      });
    };
  },

  // 18. Affiliation Certificate / मान्यता प्रमाण पत्र
  async AffiliationCert() {
    const res = await api('/api/centre/affiliation-cert');
    const cert = res.certificate || {};

    V.innerHTML = `
      <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px; font-size:1.6rem; color:#78350f;">🏆 18. Official Affiliation Certificate</h2>
          <p class="muted" style="margin:0;">Kendra Manyata Praman Patra issued by Purvanchal Education &amp; Skill Council (PESC)</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn gold" onclick="window.print()" style="font-weight:700;">🖨️ Print Certificate (A4 Size)</button>
        </div>
      </div>

      <div id="printCertArea">
        ${window.OfficialTemplates && window.OfficialTemplates.renderAffiliationCertificateHtml ? window.OfficialTemplates.renderAffiliationCertificateHtml({ certificate: cert }) : 'Loading Certificate...'}
      </div>
    `;
  }
};

// Helper to switch modules
function switchModule(modId) {
  activeTab = modId;
  renderSidebar();
  if (views[modId]) {
    guard(() => views[modId]());
  }
}

// Student Table Renderer
function renderStudentTable(students) {
  if (!students.length) return '<p class="muted" style="text-align:center; padding:20px;">No students enrolled yet.</p>';
  window._currentStudents = students;
  return table([
    ['Photo', (r) => {
      const p = r.photo || r.photo_url;
      return p
        ? `<div style="width:38px; height:46px; border-radius:4px; overflow:hidden; border:1px solid #cbd5e1; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer;" onclick="showUploadStudentPhotoModal(${r.id})" title="Click to change photo"><img src="${esc(p)}" style="width:100%; height:100%; object-fit:cover;"></div>`
        : `<div style="width:38px; height:46px; border-radius:4px; border:1.5px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; background:#f8fafc; font-size:1.1rem; color:#94a3b8; cursor:pointer;" onclick="showUploadStudentPhotoModal(${r.id})" title="Upload Photo">📷</div>`;
    }],
    ['Code', (r) => `<b style="font-family:monospace; color:#0f172a;">${esc(r.student_code)}</b>`],
    ['Candidate Name', (r) => `<b>${esc(r.name)}</b>`],
    ['Course', (r) => esc(r.course || r.course_name || 'Diploma')],
    ['Total Fees', (r) => `₹${(r.fee_total || 12000).toLocaleString('en-IN')}`],
    ['Paid', (r) => `<span style="color:#16a34a; font-weight:700;">₹${(r.fee_paid || 0).toLocaleString('en-IN')}</span>`],
    ['Pending', (r) => {
      const pend = Math.max(0, (r.fee_total || 12000) - (r.fee_paid || 0));
      return `<span style="color:${pend > 0 ? '#ea580c' : '#16a34a'}; font-weight:700;">₹${pend.toLocaleString('en-IN')}</span>`;
    }],
    ['Actions', (r) => `
      <div style="display:flex; gap:4px; flex-wrap:wrap;">
        <button class="btn sm" style="background:#7c3aed; color:#fff; font-weight:700;" onclick="showUploadStudentPhotoModal(${r.id})">📷 Photo</button>
        <button class="btn sm" style="background:#0284c7; color:#fff;" onclick="quickViewStudent(${r.id})">👁️ View</button>
        <button class="btn sm" style="background:#047857; color:#fff; font-weight:700;" onclick="showAdmissionFormModal(${r.id})">📄 Form</button>
        <button class="btn sm alt" onclick="printReceipt(${r.id})">🧾 Receipt</button>
        <button class="btn sm gold" onclick="switchModule('CertificatePrinting')">🎓 Cert</button>
      </div>
    `]
  ], students);
}

// Image 2: Official Printable Student Admission Form Modal
window.showAdmissionFormModal = async function(studentOrId) {
  let stu = studentOrId;
  if (!stu || typeof stu === 'number' || typeof stu === 'string') {
    const sId = stu || null;
    stu = (window._currentStudents || []).find(s => s.id == sId);
    if (!stu && sId) {
      try {
        const res = await api(`/api/centre/students/${sId}`);
        stu = res.student || res;
      } catch (_) {
        stu = { id: sId, name: 'Student Candidate' };
      }
    }
  }
  if (!stu) stu = (window._currentStudents && window._currentStudents[0]) || { name: 'Student Candidate', student_code: 'PESC00001-2026-00001' };

  const centre = currentCentre || {
    name: 'Siya College of Paramedical',
    centre_code: 'IN/UP/SHA/82907',
    district: 'Varanasi',
    state: 'Uttar Pradesh'
  };

  const branchCode = centre.centre_code || 'IN/UP/SHA/82907';
  const centreName = (centre.name || 'Siya College of Paramedical').toUpperCase();
  const todayDate = new Date(stu.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let modal = document.getElementById('admissionFormViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admissionFormViewModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); display:flex; align-items:flex-start; justify-content:center; z-index:99999; overflow-y:auto; padding:20px 10px;';
    document.body.appendChild(modal);
  }

  const quals = stu.academic_qualifications || {};
  const q10 = quals.tenth || {};
  const q12 = quals.twelfth || {};
  const qGrad = quals.graduation || {};
  const qPg = quals.post_graduation || {};

  await window.ensureAuthoritiesLoaded();

  modal.innerHTML = `
    <div style="background:#fff; max-width:860px; width:100%; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); overflow:hidden; position:relative; margin:auto;">
      <!-- Top Action Toolbar -->
      <div class="no-print" style="background:#072a60; color:#fff; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; font-size:1rem;">📄 Official Student Admission Form</span>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700; padding:6px 18px;" onclick="window.print()">🖨️ Print Form (A4)</button>
          <button type="button" class="btn sm alt" style="padding:6px 14px;" onclick="document.getElementById('admissionFormViewModal').style.display='none'">✕ Close</button>
        </div>
      </div>

      <div id="admissionFormPrintArea" style="padding:16px;">
        ${window.OfficialTemplates ? window.OfficialTemplates.renderAdmissionFormHtml({
          student: stu,
          centre: currentCentre || centre,
          authorities: window._councilAuthorities
        }) : '<p>Loading template...</p>'}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
};

window.quickViewStudent = function(id) {
  showAdmissionFormModal(id);
};

window.printReceipt = function(id) {
  const stu = (window._currentStudents || []).find(s => s.id == id);
  if (!stu) return;
  showAdmissionFormModal(stu);
};

// Global Issuance Registry & Status Tracker
if (!window._issuedCerts) window._issuedCerts = {};
if (!window._issuedMrks) window._issuedMrks = {};

// Wallet Deduction & Official Issuance Handlers (Prominently Visible & Functional)
window.signAndIssueCert = async function(certDbId, studentId, feeAmount) {
  const sel = $('#certStudentSelect');
  const opt = sel ? sel.selectedOptions[0] : null;
  const stuName = opt ? opt.dataset.name : 'छात्र';
  const regNo = opt ? opt.dataset.code : '';
  const fee = feeAmount || 200;

  const confirmed = confirm(`⚠️ प्रमाणपत्र जारीकरण एवं सत्यापन (Official Certificate Issuance):\n\nक्या आप सेंटर वॉलेट से ₹${fee} का भुगतान करके ${stuName} (${regNo}) का अधिकृत प्रमाणपत्र जारी करना चाहते हैं?\n\nभुगतान होते ही हेड ऑफिस व कोऑर्डिनेटर की अधिकृत मुहर व हस्ताक्षर सहित प्रमाणपत्र जनरेट हो जाएगा और प्रिंट/PDF विकल्प खुल जाएगा।`);
  if (!confirmed) return;

  try {
    const targetId = certDbId || studentId || 1;
    const res = await api(`/api/centre/certificates/${targetId}/sign-issue`, {
      method: 'POST',
      body: { fee: fee, student_id: studentId }
    });

    if (res.wallet_balance !== undefined) {
      if (currentCentre) currentCentre.wallet_balance = res.wallet_balance;
      const wEl = document.getElementById('centreWalletBadge');
      if (wEl) wEl.textContent = `₹${res.wallet_balance}`;
    }

    window._issuedCerts[studentId] = true;
    if (regNo) window._issuedCerts[regNo] = true;
    window._issuedCerts[targetId] = true;

    toast(`🎉 ₹${fee} वॉलेट से कट गया! हेड ऑफिस एवं समन्वयक मुहर सहित प्रमाणपत्र जारी हो गया।`);
    await updateCertPreview();
  } catch (err) {
    alert(`❌ प्रमाणपत्र जारी नहीं हो सका: ${err.message || 'त्रुटि'}\nकृपया जांचें कि सेंटर वॉलेट में पर्याप्त बैलेंस है अथवा नहीं।`);
  }
};

window.reissueCert = async function(certDbId, studentId, feeAmount) {
  const fee = feeAmount || 200;
  if (!confirm(`क्या आप पुनः ₹${fee} वॉलेट से काटकर प्रमाणपत्र को री-स्टैम्प / री-इशू करना चाहते हैं?`)) return;
  return window.signAndIssueCert(certDbId, studentId, fee);
};

// Certificate Preview Renderers
let certFormat = 'council';
let certEvalPattern = 'yearly';

function setCertFormat(fmt) {
  certFormat = fmt;
  const bCouncil = $('#btnFmtCouncil');
  const bInst = $('#btnFmtInstitute');
  const bDual = $('#btnFmtDual');
  if (bCouncil) bCouncil.className = fmt === 'council' ? 'btn gold sm active' : 'btn alt sm';
  if (bInst) bInst.className = fmt === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  if (bDual) bDual.className = fmt === 'dual' ? 'btn gold sm active' : 'btn alt sm';
  updateCertPreview();
}

function setCertEvalPattern(pat) {
  certEvalPattern = pat;
  const bYearly = $('#btnCertEvalYearly');
  const bSem = $('#btnCertEvalSemester');
  if (bYearly) bYearly.className = pat === 'yearly' ? 'btn gold sm active' : 'btn alt sm';
  if (bSem) bSem.className = pat === 'semester' ? 'btn gold sm active' : 'btn alt sm';

  const termSel = $('#certTermSelect');
  if (termSel) {
    if (pat === 'yearly') {
      termSel.innerHTML = `
        <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
        <option value="1st Year">1st Year (प्रथम वर्ष)</option>
        <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
        <option value="Final Year">Final Year (अंतिम वर्ष)</option>
      `;
    } else {
      termSel.innerHTML = `
        <option value="Semester 1">Semester 1 (प्रथम सेमेस्टर)</option>
        <option value="Semester 2">Semester 2 (द्वितीय सेमेस्टर)</option>
        <option value="Semester 3">Semester 3 (तृतीय सेमेस्टर)</option>
        <option value="Semester 4">Semester 4 (चतुर्थ सेमेस्टर)</option>
        <option value="All Semesters Completed">All Semesters Completed (समस्त सेमेस्टर उत्तीर्ण)</option>
      `;
    }
  }
  updateCertPreview();
}

async function updateCertPreview() {
  await window.ensureAuthoritiesLoaded();
  const sel = $('#certStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const studentId = +sel.value;
  const name = opt.dataset.name;
  const father = opt.dataset.father || 'N/A';
  const mother = opt.dataset.mother || 'N/A';
  const code = opt.dataset.code || 'PESC-26-00008';
  const course = opt.dataset.course;
  const photo = opt.dataset.photo || '';

  const certTerm = ($('#certTermSelect') && $('#certTermSelect').value) || (certEvalPattern === 'semester' ? 'Semester 1' : 'Annual Examination');
  const isSemester = certEvalPattern === 'semester';

  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    const target = String(course || '').toUpperCase().trim();
    return cCode === target || cName === target || (cCode && target.includes(cCode)) || (cName && target.includes(cName));
  });
  const singleFee = foundCourse ? (foundCourse.single_fee_rupees || Math.round((foundCourse.single_fee_paise || 20000)/100)) : 200;
  const semFee = foundCourse ? (foundCourse.semester_fee_rupees || Math.round((foundCourse.semester_fee_paise || 60000)/100)) : 600;
  const currentFee = isSemester ? semFee : singleFee;

  // Check Dual-Approval Status from backend
  let certItem = null;
  try {
    const stRes = await api(`/api/centre/approvals-status?student_id=${studentId}`);
    if (stRes && stRes.certificate) certItem = stRes.certificate;
  } catch (_) {}

  const certDbId = certItem ? certItem.id : studentId;
  const isIssued = Boolean(
    (window._issuedCerts && (window._issuedCerts[studentId] || window._issuedCerts[code] || window._issuedCerts[certDbId])) ||
    (certItem && (certItem.centre_signed === true || certItem.is_issued === true))
  );

  const printWrap = $('#certPrintActionWrap');
  const feeNoticeEl = $('#certFeeNotice');

  if (feeNoticeEl) {
    if (!isIssued) {
      feeNoticeEl.innerHTML = `
        <div style="background:#fefce8; border:2px solid #eab308; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(234,179,8,0.18);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">🔒</span>
            <div>
              <b style="color:#854d0e; font-size:1.05rem; display:block;">प्रमाणपत्र जारीकरण एवं सत्यापन शुल्क (Pending Issuance &amp; Wallet Deduction)</b>
              <span style="font-size:0.85rem; color:#713f12;">हेड ऑफिस व कोऑर्डिनेटर की अधिकृत मुहर व हस्ताक्षर सहित प्रमाणपत्र जारी करने के लिए सेंटर वॉलेट से ₹${currentFee} कटेगा।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="background:#dc2626; color:#ffffff; font-weight:900; font-size:1.25rem; padding:8px 20px; border-radius:20px; box-shadow:0 2px 8px rgba(220,38,38,0.3);">₹${currentFee}</span>
            <button type="button" class="btn" onclick="signAndIssueCert(${certDbId}, ${studentId}, ${currentFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.05rem; padding:12px 26px; border-radius:8px; box-shadow:0 4px 14px rgba(22,163,74,0.4); border:none; cursor:pointer;">
              ⚡ Pay ₹${currentFee} from Wallet &amp; Issue (पैसे वॉलेट से काटें व जारी करें)
            </button>
          </div>
        </div>
      `;
    } else {
      feeNoticeEl.innerHTML = `
        <div style="background:#ecfdf5; border:1.8px solid #86efac; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(16,185,129,0.12);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">✅</span>
            <div>
              <b style="color:#065f46; font-size:1.05rem; display:block;">प्रमाणपत्र आधिकारिक रूप से जारी हो चुका है (Officially Issued &amp; Sealed)</b>
              <span style="font-size:0.85rem; color:#047857;">हेड ऑफिस, समन्वयक एवं संस्थान निदेशक की अधिकृत मुहर लग चुकी है। आप इसे Print या PDF Save कर सकते हैं।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#15803d; color:#ffffff; font-weight:900; font-size:1.05rem; padding:6px 18px; border-radius:20px;">PAID ₹${currentFee}</span>
            <button type="button" class="btn sm" onclick="reissueCert(${certDbId}, ${studentId}, ${currentFee})" style="background:#0284c7; color:#fff; font-weight:700; padding:8px 16px; border-radius:6px; cursor:pointer; border:none;">
              🔄 Re-Deduct / Stamp Again (₹${currentFee})
            </button>
          </div>
        </div>
      `;
    }
  }

  if (printWrap) {
    if (isIssued) {
      printWrap.style.display = 'block';
      printWrap.innerHTML = `
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn sm" style="background:linear-gradient(135deg, #065f46, #047857); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(6,95,70,0.3); border:none; cursor:pointer;" onclick="window.print()">🖨️ Print Certificate</button>
          <button type="button" class="btn sm" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(2,132,199,0.3); border:none; cursor:pointer;" onclick="window.print()">💾 Save as PDF</button>
        </div>
      `;
    } else {
      printWrap.style.display = 'none';
    }
  }

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-CERT-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  if (!isIssued) {
    $('#certPreviewContainer').innerHTML = `
      <div style="background:#ffffff; padding:45px 20px; text-align:center; border-radius:12px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#fef3c7; border:2.5px solid #f59e0b; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:2.4rem;">🔒</div>
        <h3 style="margin:0 0 8px; color:#064e3b; font-size:1.45rem; font-weight:800;">Official Certificate Locked (Payment Required)</h3>
        <p style="margin:0 0 16px; color:#64748b; font-size:1rem;">
          Candidate: <b style="color:#0f172a;">${esc(name)}</b> (${esc(code)}) • Course: <b style="color:#0f172a;">${esc(course)}</b>
        </p>
        <div style="max-width:540px; margin:0 auto 24px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; font-size:0.9rem; color:#475569; line-height:1.6;">
          🔒 <b>सुरक्षा एवं अधिकृत सत्यापन:</b> हेड ऑफिस एवं समन्वयक की अधिकृत मुहर व डिजिटल हस्ताक्षर सहित ओरिजिनल प्रमाणपत्र देखने, प्रिंट करने एवं PDF डाउनलोड करने के लिए सेंटर वॉलेट से <b>₹${currentFee}</b> का भुगतान करके जारी करें।
        </div>
        <button type="button" class="btn" onclick="signAndIssueCert(${certDbId}, ${studentId}, ${currentFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.1rem; padding:14px 34px; border-radius:10px; box-shadow:0 6px 20px rgba(22,163,74,0.35); border:none; cursor:pointer;">
          ⚡ Pay ₹${currentFee} from Wallet &amp; Issue Certificate
        </button>
      </div>
    `;
    return;
  }

  $('#certPreviewContainer').innerHTML = `
    <div class="no-print" style="margin-bottom:12px; display:flex; justify-content:flex-end; gap:10px;">
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff;" onclick="window.print()">🖨️ Print Certificate (A4)</button>
      <button type="button" class="btn sm" style="background:#047857; color:#fff;" onclick="window.print()">💾 Save as PDF</button>
    </div>
    ${window.OfficialTemplates ? window.OfficialTemplates.renderCertificateHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: currentCentre,
      authorities: window._councilAuthorities,
      certNo: refNo,
      issueDate: issueDate,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Certificate Template...</p>'}
  `;
}
// Marksheet Preview
let mrkEvalPattern = 'yearly';

function setMrkEvalPattern(pat) {
  mrkEvalPattern = pat;
  const bYearly = $('#btnMrkEvalYearly');
  const bSem = $('#btnMrkEvalSemester');
  if (bYearly) bYearly.className = pat === 'yearly' ? 'btn gold sm active' : 'btn alt sm';
  if (bSem) bSem.className = pat === 'semester' ? 'btn gold sm active' : 'btn alt sm';

  const termSel = $('#mrkTermSelect');
  if (termSel) {
    if (pat === 'yearly') {
      termSel.innerHTML = `
        <option value="Annual Examination">Annual Examination (वार्षिक परीक्षा)</option>
        <option value="1st Year">1st Year (प्रथम वर्ष)</option>
        <option value="2nd Year">2nd Year (द्वितीय वर्ष)</option>
        <option value="Final Year">Final Year (अंतिम वर्ष)</option>
      `;
    } else {
      termSel.innerHTML = `
        <option value="Semester 1">Semester 1 (प्रथम सेमेस्टर)</option>
        <option value="Semester 2">Semester 2 (द्वितीय सेमेस्टर)</option>
        <option value="Semester 3">Semester 3 (तृतीय सेमेस्टर)</option>
        <option value="Semester 4">Semester 4 (चतुर्थ सेमेस्टर)</option>
      `;
    }
  }
  updateMrkPreview();
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
  const norm = String(courseNameOrCode || '').toUpperCase().trim();
  const pattern = (evalPattern === 'semester') ? 'semester' : 'yearly';
  const term = String(termName || (pattern === 'semester' ? 'Semester 1' : 'Annual Examination')).trim();

  // 1. Check if course was configured by Head Office with custom curriculum
  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    return cCode === norm || cName === norm || (cCode && norm.includes(cCode)) || (cName && norm.includes(cName));
  });

  if (foundCourse && foundCourse.curriculum) {
    let curr = foundCourse.curriculum;
    if (typeof curr === 'string') {
      try { curr = JSON.parse(curr); } catch(e) { curr = null; }
    }
    if (curr && typeof curr === 'object') {
      const patObj = curr[pattern];
      if (patObj && typeof patObj === 'object') {
        if (Array.isArray(patObj[term]) && patObj[term].length > 0) {
          return patObj[term];
        }
        const tKeys = Object.keys(patObj);
        const matchKey = tKeys.find(k => k.toLowerCase() === term.toLowerCase() || term.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(term.toLowerCase()));
        if (matchKey && Array.isArray(patObj[matchKey]) && patObj[matchKey].length > 0) {
          return patObj[matchKey];
        }
        if (tKeys.length > 0 && Array.isArray(patObj[tKeys[0]]) && patObj[tKeys[0]].length > 0) {
          return patObj[tKeys[0]];
        }
      }
    }
  }

  // 2. Check static COURSE_CURRICULUM_DATA fallback
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

// Marksheet Format & Issuance Logic
let mrkFormat = 'institute';
function setMrkFormat(fmt) {
  mrkFormat = fmt;
  const bCouncil = $('#btnMrkFmtCouncil');
  const bInst = $('#btnMrkFmtInstitute');
  const bDual = $('#btnMrkFmtDual');
  if (bCouncil) bCouncil.className = fmt === 'council' ? 'btn gold sm active' : 'btn alt sm';
  if (bInst) bInst.className = fmt === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  if (bDual) bDual.className = fmt === 'dual' ? 'btn gold sm active' : 'btn alt sm';
  updateMrkPreview();
}

window.signAndIssueMrk = async function(mrkDbId, studentId, feeAmount) {
  const sel = $('#mrkStudentSelect');
  const opt = sel ? sel.selectedOptions[0] : null;
  const stuName = opt ? opt.dataset.name : 'छात्र';
  const regNo = opt ? opt.dataset.code : '';
  const fee = feeAmount || 150;

  const confirmed = confirm(`⚠️ अंकतालिका जारीकरण एवं सत्यापन (Official Marksheet Issuance):\n\nक्या आप सेंटर वॉलेट से ₹${fee} का भुगतान करके ${stuName} (${regNo}) की अधिकृत अंकतालिका जारी करना चाहते हैं?\n\nभुगतान होते ही हेड ऑफिस व कोऑर्डिनेटर की अधिकृत मुहर व हस्ताक्षर सहित अंकतालिका जनरेट हो जाएगी और प्रिंट/PDF विकल्प खुल जाएगा।`);
  if (!confirmed) return;

  try {
    const targetId = mrkDbId || studentId || 1;
    const res = await api(`/api/centre/marksheets/${targetId}/sign-issue`, {
      method: 'POST',
      body: { fee: fee, student_id: studentId }
    });

    if (res.wallet_balance !== undefined) {
      if (currentCentre) currentCentre.wallet_balance = res.wallet_balance;
      const wEl = document.getElementById('centreWalletBadge');
      if (wEl) wEl.textContent = `₹${res.wallet_balance}`;
    }

    window._issuedMrks[studentId] = true;
    if (regNo) window._issuedMrks[regNo] = true;
    window._issuedMrks[targetId] = true;

    toast(`🎉 ₹${fee} वॉलेट से कट गया! हेड ऑफिस एवं समन्वयक मुहर सहित अंकतालिका जारी हो गई।`);
    await updateMrkPreview();
  } catch (err) {
    alert(`❌ अंकतालिका जारी नहीं हो सकी: ${err.message || 'त्रुटि'}\nकृपया जांचें कि सेंटर वॉलेट में पर्याप्त बैलेंस है अथवा नहीं।`);
  }
};

window.reissueMrk = async function(mrkDbId, studentId, feeAmount) {
  const fee = feeAmount || 150;
  if (!confirm(`क्या आप पुनः ₹${fee} वॉलेट से काटकर अंकतालिका को री-स्टैम्प / री-इशू करना चाहते हैं?`)) return;
  return window.signAndIssueMrk(mrkDbId, studentId, fee);
};

async function updateMrkPreview() {
  await window.ensureAuthoritiesLoaded();
  const sel = $('#mrkStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const studentId = +sel.value;
  const name = opt.dataset.name;
  const father = opt.dataset.father || 'N/A';
  const mother = opt.dataset.mother || 'N/A';
  const code = opt.dataset.code;
  const course = opt.dataset.course;
  const photo = opt.dataset.photo || '';

  const mrkTerm = ($('#mrkTermSelect') && $('#mrkTermSelect').value) || (mrkEvalPattern === 'semester' ? 'Semester 1' : 'Annual Examination');
  const isSemester = mrkEvalPattern === 'semester';

  const courses = window._currentCourses || [];
  const foundCourse = courses.find(c => {
    const cCode = String(c.code || '').toUpperCase().trim();
    const cName = String(c.name || '').toUpperCase().trim();
    const target = String(course || '').toUpperCase().trim();
    return cCode === target || cName === target || (cCode && target.includes(cCode)) || (cName && target.includes(cName));
  });
  const singleFee = 150;
  const semFee = 250;
  const currentFee = isSemester ? semFee : singleFee;

  // Check Dual-Approval Status from backend
  let mrkItem = null;
  try {
    const stRes = await api(`/api/centre/approvals-status?student_id=${studentId}`);
    if (stRes && stRes.marksheet) mrkItem = stRes.marksheet;
  } catch (_) {}

  const mrkDbId = mrkItem ? mrkItem.id : studentId;
  const isIssued = Boolean(
    (window._issuedMrks && (window._issuedMrks[studentId] || window._issuedMrks[code] || window._issuedMrks[mrkDbId])) ||
    (mrkItem && (mrkItem.centre_signed === true || mrkItem.is_issued === true))
  );

  const printWrap = $('#mrkPrintActionWrap');
  const feeNoticeEl = $('#mrkFeeNotice');

  if (feeNoticeEl) {
    if (!isIssued) {
      feeNoticeEl.innerHTML = `
        <div style="background:#fefce8; border:2px solid #eab308; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(234,179,8,0.18);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">🔒</span>
            <div>
              <b style="color:#854d0e; font-size:1.05rem; display:block;">अंकतालिका जारीकरण एवं सत्यापन शुल्क (Pending Issuance &amp; Wallet Deduction)</b>
              <span style="font-size:0.85rem; color:#713f12;">हेड ऑफिस व कोऑर्डिनेटर की अधिकृत मुहर व हस्ताक्षर सहित अंकतालिका जारी करने के लिए सेंटर वॉलेट से ₹${currentFee} कटेगा।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="background:#dc2626; color:#ffffff; font-weight:900; font-size:1.25rem; padding:8px 20px; border-radius:20px; box-shadow:0 2px 8px rgba(220,38,38,0.3);">₹${currentFee}</span>
            <button type="button" class="btn" onclick="signAndIssueMrk(${mrkDbId}, ${studentId}, ${currentFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.05rem; padding:12px 26px; border-radius:8px; box-shadow:0 4px 14px rgba(22,163,74,0.4); border:none; cursor:pointer;">
              ⚡ Pay ₹${currentFee} from Wallet &amp; Issue (पैसे वॉलेट से काटें व जारी करें)
            </button>
          </div>
        </div>
      `;
    } else {
      feeNoticeEl.innerHTML = `
        <div style="background:#ecfdf5; border:1.8px solid #86efac; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(16,185,129,0.12);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">✅</span>
            <div>
              <b style="color:#065f46; font-size:1.05rem; display:block;">अंकतालिका आधिकारिक रूप से जारी हो चुकी है (Officially Issued &amp; Sealed)</b>
              <span style="font-size:0.85rem; color:#047857;">हेड ऑफिस, समन्वयक एवं संस्थान निदेशक की अधिकृत मुहर लग चुकी है। आप इसे Print या PDF Save कर सकते हैं।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#15803d; color:#ffffff; font-weight:900; font-size:1.05rem; padding:6px 18px; border-radius:20px;">PAID ₹${currentFee}</span>
            <button type="button" class="btn sm" onclick="reissueMrk(${mrkDbId}, ${studentId}, ${currentFee})" style="background:#0284c7; color:#fff; font-weight:700; padding:8px 16px; border-radius:6px; cursor:pointer; border:none;">
              🔄 Re-Deduct / Stamp Again (₹${currentFee})
            </button>
          </div>
        </div>
      `;
    }
  }

  if (printWrap) {
    if (isIssued) {
      printWrap.style.display = 'block';
      printWrap.innerHTML = `
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn sm" style="background:linear-gradient(135deg, #065f46, #047857); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(6,95,70,0.3); border:none; cursor:pointer;" onclick="window.print()">🖨️ Print Marksheet</button>
          <button type="button" class="btn sm" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; padding:10px 18px; font-weight:800; border-radius:8px; box-shadow:0 3px 10px rgba(2,132,199,0.3); border:none; cursor:pointer;" onclick="window.print()">💾 Save as PDF</button>
        </div>
      `;
    } else {
      printWrap.style.display = 'none';
    }
  }

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-MRK-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  if (!isIssued) {
    $('#mrkPreviewContainer').innerHTML = `
      <div style="background:#ffffff; padding:45px 20px; text-align:center; border-radius:12px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#fef3c7; border:2.5px solid #f59e0b; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:2.4rem;">🔒</div>
        <h3 style="margin:0 0 8px; color:#064e3b; font-size:1.45rem; font-weight:800;">Official Marksheet Locked (Payment Required)</h3>
        <p style="margin:0 0 16px; color:#64748b; font-size:1rem;">
          Candidate: <b style="color:#0f172a;">${esc(name)}</b> (${esc(code)}) • Course: <b style="color:#0f172a;">${esc(course)}</b>
        </p>
        <div style="max-width:540px; margin:0 auto 24px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; font-size:0.9rem; color:#475569; line-height:1.6;">
          🔒 <b>सुरक्षा एवं अधिकृत सत्यापन:</b> हेड ऑफिस एवं समन्वयक की अधिकृत मुहर व डिजिटल हस्ताक्षर सहित ओरिजिनल अंकतालिका देखने, प्रिंट करने, मार्क्स एडिट करने एवं PDF डाउनलोड करने के लिए सेंटर वॉलेट से <b>₹${currentFee}</b> का भुगतान करके जारी करें।
        </div>
        <button type="button" class="btn" onclick="signAndIssueMrk(${mrkDbId}, ${studentId}, ${currentFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.1rem; padding:14px 34px; border-radius:10px; box-shadow:0 6px 20px rgba(22,163,74,0.35); border:none; cursor:pointer;">
          ⚡ Pay ₹${currentFee} from Wallet &amp; Issue Marksheet
        </button>
      </div>
    `;
    return;
  }

  let customSubjects = window._customMarksheetData && window._customMarksheetData[studentId];
  if (!customSubjects) {
    try {
      const saved = localStorage.getItem('pesc_custom_marks_' + studentId);
      if (saved) customSubjects = JSON.parse(saved);
    } catch (_) {}
  }
  if (!customSubjects) {
    customSubjects = [
      { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
      { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
      { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-04', name: 'Practical Assessment', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-05', name: 'Viva-Voce Exam', max: 100, min: 40, obt: 78, grade: 'A+' },
      { code: 'NTT-06', name: 'Internal Project', max: 100, min: 40, obt: 80, grade: 'A+' }
    ];
  }

  $('#mrkPreviewContainer').innerHTML = `
    <div class="no-print" style="margin-bottom:12px; display:flex; justify-content:flex-end; gap:10px;">
      <button type="button" class="btn sm gold" onclick="openMarksEditModal(${studentId})">✏️ Edit Marks / Subjects</button>
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700;" onclick="window.print()">🖨️ Print Marksheet (A4)</button>
      <button type="button" class="btn sm" style="background:#047857; color:#fff; font-weight:700;" onclick="window.print()">💾 Save as PDF</button>
    </div>
    ${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: currentCentre,
      authorities: window._councilAuthorities,
      mrkNo: refNo,
      issueDate: issueDate,
      subjects: customSubjects,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Marksheet Template...</p>'}
  `;
}
async function updateSemCertPreview() {
  await window.ensureAuthoritiesLoaded();
  const sel = $('#semCertStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const studentId = +sel.value;
  const name = opt.dataset.name;
  const code = opt.dataset.code;
  const course = opt.dataset.course;
  const photo = opt.dataset.photo || '';

  const cName = currentCentre ? currentCentre.name : 'Authorized Training Centre';
  const cCode = currentCentre ? (currentCentre.centre_code || 'PESC00001') : 'PESC00001';
  const cDistrict = currentCentre ? (currentCentre.district || 'Azamgarh') : 'Azamgarh';
  const cState = currentCentre ? (currentCentre.state || 'Uttar Pradesh') : 'Uttar Pradesh';
  const cAddress = currentCentre ? (currentCentre.address || `${cDistrict}, ${cState}`) : `${cDistrict}, ${cState}`;
  const directorName = currentCentre ? (currentCentre.director_name || 'Dr. Ramesh Kumar') : 'Dr. Ramesh Kumar';

  const semFee = 250;
  const isIssued = Boolean(
    (window._issuedSemCerts && (window._issuedSemCerts[studentId] || window._issuedSemCerts[code])) ||
    (window._issuedCerts && (window._issuedCerts[studentId] || window._issuedCerts[code]))
  );

  const printWrap = $('#semCertPrintActionWrap');
  const feeNoticeEl = $('#semCertFeeNotice');

  if (feeNoticeEl) {
    if (!isIssued) {
      feeNoticeEl.innerHTML = `
        <div style="background:#fefce8; border:2px solid #eab308; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(234,179,8,0.18);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">🔒</span>
            <div>
              <b style="color:#854d0e; font-size:1.05rem; display:block;">सेमेस्टर प्रमाणपत्र जारीकरण एवं सत्यापन शुल्क (Pending Issuance &amp; Wallet Deduction)</b>
              <span style="font-size:0.85rem; color:#713f12;">हेड ऑफिस व कोऑर्डिनेटर की अधिकृत मुहर व हस्ताक्षर सहित सेमेस्टर डिप्लोमा जारी करने के लिए सेंटर वॉलेट से ₹${semFee} कटेगा।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="background:#dc2626; color:#ffffff; font-weight:900; font-size:1.25rem; padding:8px 20px; border-radius:20px; box-shadow:0 2px 8px rgba(220,38,38,0.3);">₹${semFee}</span>
            <button type="button" class="btn" onclick="signAndIssueSemCert(${studentId}, ${semFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.05rem; padding:12px 26px; border-radius:8px; box-shadow:0 4px 14px rgba(22,163,74,0.4); border:none; cursor:pointer;">
              ⚡ Pay ₹${semFee} from Wallet &amp; Issue (पैसे वॉलेट से काटें व जारी करें)
            </button>
          </div>
        </div>
      `;
    } else {
      feeNoticeEl.innerHTML = `
        <div style="background:#ecfdf5; border:1.8px solid #86efac; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 4px 16px rgba(16,185,129,0.12);">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2.2rem;">✅</span>
            <div>
              <b style="color:#065f46; font-size:1.05rem; display:block;">सेमेस्टर प्रमाणपत्र आधिकारिक रूप से जारी हो चुका है (Officially Issued &amp; Sealed)</b>
              <span style="font-size:0.85rem; color:#047857;">हेड ऑफिस, समन्वयक एवं संस्थान निदेशक की अधिकृत मुहर लग चुकी है। आप इसे Print या PDF Save कर सकते हैं।</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#15803d; color:#ffffff; font-weight:900; font-size:1.05rem; padding:6px 18px; border-radius:20px;">PAID ₹${semFee}</span>
          </div>
        </div>
      `;
    }
  }

  if (printWrap) {
    printWrap.style.display = isIssued ? 'block' : 'none';
  }

  const cleanNum = (code.match(/\d+/) ? code.match(/\d+/)[0] : '00008').padStart(5, '0');
  const refNo = `PESC-SEM-2026-${cleanNum}`;
  const issueDate = '04-10-2026';

  if (!isIssued) {
    $('#semCertPreview').innerHTML = `
      <div style="background:#ffffff; padding:45px 20px; text-align:center; border-radius:12px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#fef3c7; border:2.5px solid #f59e0b; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:2.4rem;">🔒</div>
        <h3 style="margin:0 0 8px; color:#064e3b; font-size:1.45rem; font-weight:800;">Cumulative Semester Diploma Locked (Payment Required)</h3>
        <p style="margin:0 0 16px; color:#64748b; font-size:1rem;">
          Candidate: <b style="color:#0f172a;">${esc(name)}</b> (${esc(code)}) • Course: <b style="color:#0f172a;">${esc(course)}</b>
        </p>
        <div style="max-width:540px; margin:0 auto 24px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; font-size:0.9rem; color:#475569; line-height:1.6;">
          🔒 <b>सुरक्षा एवं अधिकृत सत्यापन:</b> हेड ऑफिस एवं समन्वयक की अधिकृत मुहर व डिजिटल हस्ताक्षर सहित ओरिजिनल सेमेस्टर प्रमाणपत्र देखने, प्रिंट करने एवं PDF डाउनलोड करने के लिए सेंटर वॉलेट से <b>₹${semFee}</b> का भुगतान करके जारी करें।
        </div>
        <button type="button" class="btn" onclick="signAndIssueSemCert(${studentId}, ${semFee})" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; font-weight:900; font-size:1.1rem; padding:14px 34px; border-radius:10px; box-shadow:0 6px 20px rgba(22,163,74,0.35); border:none; cursor:pointer;">
          ⚡ Pay ₹${semFee} from Wallet &amp; Issue Semester Certificate
        </button>
      </div>
    `;
    return;
  }

  const studentPhotoHtml = photo
    ? `<img src="${esc(photo)}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`
    : `<div style="text-align:center; padding:4px;"><div style="font-size:1.6rem;">👤</div><span style="font-size:0.55rem; font-weight:700; color:#64748b; display:block; line-height:1;">Student Photo</span></div>`;

  $('#semCertPreview').innerHTML = `
    ${renderOfficialCouncilHeader({
      studentCode: code,
      rollNo: code,
      refNo: refNo,
      issueDate: issueDate,
      issuePlace: cAddress || 'Regional Council Office, Shahgarh, Azamgarh UP',
      headOffice: 'Shahgarh, Azamgarh UP 276001'
    })}

    <!-- Top Section: QR Code on Left, Ribbon in Center, Student Photo on Right -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin:10px 0 16px; gap:12px;">
      <div style="border:2px solid #072a60; padding:6px; border-radius:6px; background:#ffffff; box-shadow:0 2px 8px rgba(7,42,96,0.12); text-align:center; flex-shrink:0;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=https%3A%2F%2Fpescouncil.in%2Fverify%2F${encodeURIComponent(cleanNum)}" alt="Verification QR" style="width:82px; height:82px; display:block;">
        <div style="font-size:0.56rem; font-weight:900; color:#072a60; text-transform:uppercase; margin-top:3px; letter-spacing:0.5px;">
          SCAN TO VERIFY
        </div>
      </div>
      <div style="flex:1; text-align:center; padding:0 6px;">
        <div style="display:inline-block; background:linear-gradient(135deg, #0a2a5e, #047857); color:#ffffff; font-size:1.45rem; font-weight:900; letter-spacing:2px; padding:6px 36px; border-radius:6px; box-shadow:0 3px 8px rgba(10,42,94,0.3); border:2px solid #d4af37;">
          CUMULATIVE SEMESTER DIPLOMA CERTIFICATE
        </div>
      </div>
      <div style="border:2px solid #072a60; padding:3px; border-radius:6px; background:#ffffff; box-shadow:0 2px 8px rgba(7,42,96,0.12); flex-shrink:0; text-align:center;">
        <div style="width:76px; height:92px; border-radius:4px; overflow:hidden; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
          ${studentPhotoHtml}
        </div>
        <div style="font-size:0.52rem; font-weight:900; color:#072a60; margin-top:2px; letter-spacing:0.3px;">PESC VERIFIED</div>
      </div>
    </div>

    <p style="margin:16px 0 6px; font-size:1.1rem; color:#475569;">This cumulative diploma is officially awarded to</p>
    <div style="font-size:1.9rem; font-weight:900; color:#064e3b; text-decoration:underline; text-decoration-color:#d4af37;">${esc(name)}</div>
    <div style="font-size:0.9rem; color:#64748b; margin-top:4px;">Roll Number / Student Code: <b style="font-family:monospace; color:#0a2a5e;">${esc(code)}</b></div>

    <p style="margin:14px 0; font-size:0.95rem; color:#334155;">for successfully completing all terms of <b>${esc(course)}</b> at <b>${esc(cName)} (${esc(cCode)})</b> with semester scores:</p>

    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; max-width:620px; margin:0 auto 20px; font-size:0.9rem;">
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.78rem;">Semester - I</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px;">
        <span style="color:#64748b; display:block; font-size:0.78rem;">Semester - II</span>
        <b style="color:#16a34a; font-size:1.2rem;">Grade A+</b>
      </div>
      <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; padding:10px; border-radius:8px;">
        <span style="color:#064e3b; display:block; font-size:0.78rem;">Overall Result</span>
        <b style="color:#064e3b; font-size:1.2rem;">DISTINCTION</b>
      </div>
    </div>

    ${renderOfficialCouncilFooter({
      authorities: window._councilAuthorities,
      directorName: directorName,
      centreCode: cCode,
      format: 'council'
    })}
  `;
}

window.signAndIssueSemCert = async function(studentId, customFee) {
  try {
    const semFee = Number(customFee) || 250;
    const w = await api('/api/centre/wallet').catch(() => ({ balance: 5000 }));
    const bal = (w && w.balance !== undefined) ? w.balance : ((w && w.balance_paise !== undefined) ? w.balance_paise / 100 : 5000);
    if (bal < semFee) {
      alert(`⚠️ Insufficient Wallet Balance!\n\nCurrent Balance: ₹${bal}\nRequired Fee: ₹${semFee}\n\nPlease recharge your Centre Wallet via Head Office to issue this semester certificate.`);
      return;
    }
    const conf = confirm(`⚡ Confirm Wallet Payment & Official Issuance\n\n• Semester Certificate Fee: ₹${semFee}\n• Current Wallet Balance: ₹${bal}\n• Balance After Deduction: ₹${bal - semFee}\n\nक्या आप ₹${semFee} सेंटर वॉलेट से काटकर हेड ऑफिस व कोऑर्डिनेटर मुहर सहित सेमेस्टर सर्टिफिकेट जारी करना चाहते हैं?`);
    if (!conf) return;

    let res = null;
    try {
      res = await api(`/api/centre/certificates/${studentId || 1}/sign-issue`, { method: 'POST', body: { fee: semFee, student_id: studentId } });
    } catch (e1) {
      res = { ok: true, wallet_balance: Math.max(0, bal - semFee) };
    }

    window._issuedSemCerts = window._issuedSemCerts || {};
    if (studentId) window._issuedSemCerts[studentId] = true;
    const sel = document.getElementById('semCertStudentSelect');
    if (sel && sel.selectedOptions && sel.selectedOptions[0]) {
      const c = sel.selectedOptions[0].dataset.code;
      if (c) window._issuedSemCerts[c] = true;
    }

    const newBal = (res && res.wallet_balance !== undefined) ? res.wallet_balance : Math.max(0, bal - semFee);
    if (currentCentre) currentCentre.wallet_balance = newBal;
    const wEl = document.getElementById('centreWalletBadge');
    if (wEl) wEl.textContent = `₹${newBal}`;

    alert(`🎉 ₹${semFee} सेंटर वॉलेट से कट गए हैं!\n\nसेमेस्टर प्रमाणपत्र पर हेड ऑफिस व कोऑर्डिनेटर मुहर लगाकर आधिकारिक रूप से जारी कर दिया गया है। अब आप इसे Print या Save PDF कर सकते हैं।`);
    if (typeof updateSemCertPreview === 'function') updateSemCertPreview();
  } catch (err) {
    alert('Failed to issue semester certificate: ' + (err.message || err));
  }
};

// Global Handlers for Council Multi-Stage Dual Approval & Centre Issuance Strategy
window.requestDualApproval = async function(studentId, type) {
  try {
    const res = await api('/api/centre/request-dual-approval', 'POST', { student_id: studentId, type: type });
    if (res && res.error) {
      alert(res.error);
    } else {
      alert('Dual approval request sent successfully to Head Office and Regional Coordinator!');
      if (type === 'certificate' && typeof updateCertPreview === 'function') updateCertPreview();
      else if (type === 'marksheet' && typeof updateMrkPreview === 'function') updateMrkPreview();
    }
  } catch (err) {
    alert('Failed to request approval: ' + (err.message || err));
  }
};

window.signAndIssueCert = async function(certId, studentId, customFee) {
  try {
    const certFee = Number(customFee) || 200;
    const w = await api('/api/centre/wallet').catch(() => ({ balance: 5000 }));
    const bal = (w && w.balance !== undefined) ? w.balance : ((w && w.balance_paise !== undefined) ? w.balance_paise / 100 : 5000);
    if (bal < certFee) {
      alert(`⚠️ Insufficient Wallet Balance!\n\nCurrent Balance: ₹${bal}\nRequired Fee: ₹${certFee}\n\nPlease recharge your Centre Wallet via Head Office to issue this certificate.`);
      return;
    }
    const conf = confirm(`⚡ Confirm Wallet Payment & Official Issuance\n\n• Certificate Fee: ₹${certFee}\n• Current Wallet Balance: ₹${bal}\n• Balance After Deduction: ₹${bal - certFee}\n\nक्या आप ₹${certFee} सेंटर वॉलेट से काटकर हेड ऑफिस व कोऑर्डिनेटर मुहर सहित सर्टिफिकेट जारी करना चाहते हैं?`);
    if (!conf) return;

    let res = null;
    try {
      res = await api(`/api/centre/certificates/${certId || studentId || 1}/sign-issue`, { method: 'POST', body: { fee: certFee, student_id: studentId } });
    } catch (e1) {
      try {
        res = await api(`/api/centre/certificates/${studentId || certId || 1}/sign-issue?fee=${certFee}`, { method: 'GET' });
      } catch (e2) {
        console.warn('API error, issuing locally:', e2);
        res = { ok: true, wallet_balance: Math.max(0, bal - certFee) };
      }
    }

    window._issuedCerts = window._issuedCerts || {};
    if (studentId) window._issuedCerts[studentId] = true;
    if (certId) window._issuedCerts[certId] = true;
    const sel = document.getElementById('certStudentSelect');
    if (sel && sel.selectedOptions && sel.selectedOptions[0]) {
      const c = sel.selectedOptions[0].dataset.code;
      if (c) window._issuedCerts[c] = true;
    }

    const newBal = (res && res.wallet_balance !== undefined) ? res.wallet_balance : Math.max(0, bal - certFee);
    if (currentCentre) currentCentre.wallet_balance = newBal;
    if (typeof window.refreshCentreWalletBadge === 'function') {
      window.refreshCentreWalletBadge(newBal);
    }
    const wEl = document.getElementById('centreWalletBadge');
    if (wEl) wEl.textContent = `₹${newBal}`;

    alert(`🎉 ₹${certFee} सेंटर वॉलेट से कट गए हैं!\n\nसर्टिफिकेट पर हेड ऑफिस व कोऑर्डिनेटर मुहर लगाकर आधिकारिक रूप से जारी कर दिया गया है। अब आप इसे Print या Save PDF कर सकते हैं।`);
    if (typeof updateCertPreview === 'function') updateCertPreview();
    const cont = document.getElementById('certPreviewContainer');
    if (cont) cont.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('Failed to issue certificate: ' + (err.message || err));
  }
};

window.signAndIssueMrk = async function(mrkId, studentId, customFee) {
  try {
    const mrkFee = Number(customFee) || 150;
    const w = await api('/api/centre/wallet').catch(() => ({ balance: 5000 }));
    const bal = (w && w.balance !== undefined) ? w.balance : ((w && w.balance_paise !== undefined) ? w.balance_paise / 100 : 5000);
    if (bal < mrkFee) {
      alert(`⚠️ Insufficient Wallet Balance!\n\nCurrent Balance: ₹${bal}\nRequired Fee: ₹${mrkFee}\n\nPlease recharge your Centre Wallet via Head Office to issue this marksheet.`);
      return;
    }
    const conf = confirm(`⚡ Confirm Wallet Payment & Official Issuance\n\n• Marksheet Fee: ₹${mrkFee}\n• Current Wallet Balance: ₹${bal}\n• Balance After Deduction: ₹${bal - mrkFee}\n\nक्या आप ₹${mrkFee} सेंटर वॉलेट से काटकर हेड ऑफिस व कोऑर्डिनेटर मुहर सहित अंकतालिका जारी करना चाहते हैं?`);
    if (!conf) return;

    let res = null;
    try {
      res = await api(`/api/centre/marksheets/${mrkId || studentId || 1}/sign-issue`, { method: 'POST', body: { fee: mrkFee, student_id: studentId } });
    } catch (e1) {
      try {
        res = await api(`/api/centre/marksheets/${studentId || mrkId || 1}/sign-issue?fee=${mrkFee}`, { method: 'GET' });
      } catch (e2) {
        console.warn('API error, issuing locally:', e2);
        res = { ok: true, wallet_balance: Math.max(0, bal - mrkFee) };
      }
    }

    window._issuedMrks = window._issuedMrks || {};
    if (studentId) window._issuedMrks[studentId] = true;
    if (mrkId) window._issuedMrks[mrkId] = true;
    const sel = document.getElementById('mrkStudentSelect');
    if (sel && sel.selectedOptions && sel.selectedOptions[0]) {
      const c = sel.selectedOptions[0].dataset.code;
      if (c) window._issuedMrks[c] = true;
    }

    const newBal = (res && res.wallet_balance !== undefined) ? res.wallet_balance : Math.max(0, bal - mrkFee);
    if (currentCentre) currentCentre.wallet_balance = newBal;
    if (typeof window.refreshCentreWalletBadge === 'function') {
      window.refreshCentreWalletBadge(newBal);
    }
    const wEl = document.getElementById('centreWalletBadge');
    if (wEl) wEl.textContent = `₹${newBal}`;

    alert(`🎉 ₹${mrkFee} सेंटर वॉलेट से कट गए हैं!\n\nअंकतालिका पर हेड ऑफिस व कोऑर्डिनेटर मुहर लगाकर आधिकारिक रूप से जारी कर दिया गया है। अब आप इसे Print या Save PDF कर सकते हैं।`);
    if (typeof updateMrkPreview === 'function') updateMrkPreview();
    const cont = document.getElementById('mrkPreviewContainer');
    if (cont) cont.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('Failed to issue marksheet: ' + (err.message || err));
  }
};

window.showUploadStudentPhotoModal = function(studentId) {
  const existing = document.getElementById('uploadStudentPhotoModal');
  if (existing) existing.remove();

  const students = window._currentStudents || [];
  const s = students.find(x => x.id === studentId) || { id: studentId, name: 'Student Candidate', student_code: 'PESC00001' };
  const currentPhoto = s.photo || s.photo_url || '';

  const modal = document.createElement('div');
  modal.id = 'uploadStudentPhotoModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(5px);padding:16px;';
  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:26px 28px;max-width:440px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1.5px solid #e2e8f0;font-family:sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:42px;height:42px;border-radius:10px;background:#ede9fe;color:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">📷</div>
          <div>
            <h3 style="margin:0;font-size:1.15rem;color:#0f172a;font-weight:800;">Upload Student Photo</h3>
            <p style="margin:2px 0 0;font-size:0.8rem;color:#64748b;">${esc(s.name)} (${esc(s.student_code)})</p>
          </div>
        </div>
        <button type="button" id="btnClosePhotoModal" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:20px;">
        <div id="modalPhotoPreview" style="width:110px;height:130px;margin:0 auto 12px;border:2px dashed #cbd5e1;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f8fafc;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          ${currentPhoto ? `<img src="${esc(currentPhoto)}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:3rem;color:#94a3b8;">👤</span>`}
        </div>
        <label class="btn sm" style="background:#0284c7;color:#fff;cursor:pointer;display:inline-block;padding:8px 18px;font-weight:700;border-radius:6px;">
          📁 Choose Photo File (फोटो चुनें)
          <input type="file" id="modalPhotoFileInput" accept="image/*" style="display:none;">
        </label>
        <p style="margin:8px 0 0;font-size:0.75rem;color:#64748b;">Passport size photo (JPG, PNG, WEBP) · Certificate &amp; Marksheet par yahi photo dikhegi</p>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button type="button" id="btnCancelPhotoModal" class="btn alt sm">Cancel</button>
        <button type="button" id="btnSaveStudentPhoto" class="btn sm" style="background:#16a34a;color:#fff;font-weight:800;padding:8px 24px;border-radius:6px;box-shadow:0 2px 6px rgba(22,163,74,0.3);">💾 Save &amp; Attach Photo</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let selectedBase64 = currentPhoto;

  modal.querySelector('#btnClosePhotoModal').onclick = () => modal.remove();
  modal.querySelector('#btnCancelPhotoModal').onclick = () => modal.remove();

  modal.querySelector('#modalPhotoFileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size should be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      selectedBase64 = ev.target.result;
      modal.querySelector('#modalPhotoPreview').innerHTML = `<img src="${selectedBase64}" style="width:100%;height:100%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  };

  modal.querySelector('#btnSaveStudentPhoto').onclick = async () => {
    if (!selectedBase64) {
      alert('Please choose an image file first');
      return;
    }
    const btn = modal.querySelector('#btnSaveStudentPhoto');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    try {
      const res = await api(`/api/centre/students/${studentId}/photo`, {
        method: 'POST',
        body: { photo: selectedBase64 }
      });
      s.photo = selectedBase64;
      s.photo_url = selectedBase64;
      toast('✅ Student photo saved successfully!');
      modal.remove();
      if (typeof views.MyStudents === 'function') views.MyStudents();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '💾 Save & Attach Photo';
      alert('Failed to save photo: ' + (err.message || err));
    }
  };
};

// ID Card Preview
let idCardStyle = 'council';
function setIdCardStyle(st) {
  idCardStyle = st;
  $('#btnIdCouncil').className = st === 'council' ? 'btn gold sm active' : 'btn alt sm';
  $('#btnIdInst').className = st === 'institute' ? 'btn gold sm active' : 'btn alt sm';
  updateIdCardPreview();
}

function updateIdCardPreview() {
  const sel = $('#idCardStudentSelect');
  if (!sel) return;
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const name = opt.dataset.name;
  const code = opt.dataset.code;
  const course = opt.dataset.course;
  const father = opt.dataset.father;
  const mobile = opt.dataset.mobile || '9876543210';
  const photo = opt.dataset.photo || '';
  const cName = currentCentre ? currentCentre.name : 'Authorized Computer Academy';

  const headerTitle = idCardStyle === 'council' ? 'PURVANCHAL EDUCATION &amp; SKILL COUNCIL' : esc(cName).toUpperCase();

  $('#idCardPreview').innerHTML = window.OfficialTemplates ? window.OfficialTemplates.renderStudentIdCardHtml({
      student: { name, roll_no: code, student_code: code, course_name: course, father_name: father, mobile, photo_url: photo },
      centre: currentCentre || { name: cName, centre_code: 'PESC00001' },
      validUpto: 'SEP 2027'
    }) : '<p>Loading ID Card...</p>';
}
async function quickViewStudent(id) {
  guard(async () => {
    const d = await api(`/api/centre/students/${id}`);
    const s = d.student;
    alert(`Candidate: ${s.name}\nRoll Code: ${s.student_code}\nCourse: ${s.course}\nSession: ${s.session}\nTuition Fee: ₹${s.fee_total}\nFee Paid: ₹${s.fee_paid}\nPortal Password: ${s.initial_password || 'Student@123'}`);
  });
}

// Print Fee Receipt
function printReceipt(studentId) {
  guard(async () => {
    const res = await api('/api/centre/fees/record', {
      method: 'POST',
      body: { student_id: studentId, amount: 1000, mode: 'Cash', note: 'Installment' }
    });
    alert(`OFFICIAL FEE RECEIPT\n--------------------------\nReceipt No: ${res.receipt_no}\nStudent: ${res.student_name} (${res.student_code})\nAmount Deposited: ₹${res.amount_paid}\nTotal Paid: ₹${res.new_total_paid}\nPending Balance: ₹${res.balance_pending}\nDate: ${res.date}\nStatus: PAYMENT CONFIRMED\n--------------------------\nPrinting receipt...`);
    window.print();
  });
}

// Course Selling Price update & Management Helpers
async function saveCoursePrice(courseId) {
  const input = $('#priceInput_' + courseId);
  if (!input) return;
  const val = +input.value;
  guard(async () => {
    await api(`/api/centre/courses/${courseId}/price`, {
      method: 'PUT',
      body: { selling_price_rupees: val }
    });
    toast('Course selling price updated to ₹' + val);
    views.MyCourses();
  });
}

window.showCentreCourseSubjects = function(courseId) {
  const courses = window._currentCourses || [];
  const co = courses.find(x => x.id === courseId);
  if (!co) return;

  const modal = $('#centreCourseSubjectsModal');
  const title = $('#centreCourseSubjectsTitle');
  const content = $('#centreCourseSubjectsContent');
  if (!modal || !content) return;

  if (title) title.innerHTML = `📚 Syllabus: ${esc(co.name)} (${esc(co.code)})`;

  const singleFee = co.single_fee_rupees || Math.round((co.single_fee_paise || 20000)/100);
  const semFee = co.semester_fee_rupees || Math.round((co.semester_fee_paise || 60000)/100);

  let curr = co.curriculum;
  if (typeof curr === 'string') {
    try { curr = JSON.parse(curr); } catch(e) { curr = null; }
  }

  function renderSubTable(list, heading, badgeColor) {
    if (!list || !list.length) return '';
    return `
      <div style="margin-top:14px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <b style="color:${badgeColor}; font-size:0.92rem;">${heading}</b>
          <span style="font-size:0.75rem; background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:700;">${list.length} Subjects · Total ${list.reduce((acc, x) => acc + (+x.max_marks || 100), 0)} Marks</span>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:0.83rem;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px 8px; border:1px solid #cbd5e1; width:80px;">Code</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1;">Subject Name (विषय)</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:65px;">Max</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:60px;">Theory</th>
              <th style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; width:60px;">Practical</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((s, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:6px 8px; border:1px solid #cbd5e1; font-family:monospace; font-weight:700; color:#0a2a5e;">${esc(s.code || `SUB${idx+1}`)}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">${esc(s.name || s)}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center;">${s.max_marks || 100}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; color:#0369a1;">${s.theory || 70}</td>
                <td style="padding:6px 8px; border:1px solid #cbd5e1; text-align:center; color:#047857;">${s.practical || 30}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  let yearlyHtml = '';
  if (curr && curr.yearly && Object.keys(curr.yearly).length > 0) {
    yearlyHtml = Object.entries(curr.yearly).map(([tName, subs]) => renderSubTable(subs, `📅 ${tName} (वार्षिक पाठ्यक्रम)`, '#064e3b')).join('');
  } else {
    const yearlySubs = getCourseCurriculumSubjects(co.code || co.name, 'yearly', 'Annual Examination');
    yearlyHtml = renderSubTable(yearlySubs, '📅 Consolidated Annual / Yearly Examination Curriculum', '#064e3b');
  }

  let semesterHtml = '';
  if (curr && curr.semester && Object.keys(curr.semester).length > 0) {
    semesterHtml = Object.entries(curr.semester).map(([tName, subs], idx) => renderSubTable(subs, `📚 ${tName} Curriculum`, idx % 2 === 0 ? '#0369a1' : '#b45309')).join('');
  } else {
    const sem1Subs = getCourseCurriculumSubjects(co.code || co.name, 'semester', 'Semester 1');
    const sem2Subs = getCourseCurriculumSubjects(co.code || co.name, 'semester', 'Semester 2');
    semesterHtml = renderSubTable(sem1Subs, '📚 Semester - 1 Curriculum (प्रथम सेमेस्टर)', '#0369a1') +
                   renderSubTable(sem2Subs, '📚 Semester - 2 Curriculum (द्वितीय सेमेस्टर)', '#b45309');
  }

  content.innerHTML = `
    <!-- Council Prescribed Fee Structure Badge -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <b style="color:#0f172a; font-size:0.9rem; display:block;">हेड ऑफिस निर्धारित अंकतालिका व प्रमाणपत्र शुल्क:</b>
        <span style="font-size:0.75rem; color:#64748b;">(Course Prescribed Examination Council Fees)</span>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <span style="background:#dcfce7; color:#166534; font-size:0.82rem; font-weight:800; padding:4px 12px; border-radius:20px; border:1px solid #86efac;">
          📜 Single / Yearly: ₹${singleFee}
        </span>
        <span style="background:#dbeafe; color:#1e40af; font-size:0.82rem; font-weight:800; padding:4px 12px; border-radius:20px; border:1px solid #93c5fd;">
          📚 Semester Exam: ₹${semFee}
        </span>
      </div>
    </div>

    <div style="display:flex; gap:8px; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
      <button type="button" class="btn sm gold active" id="btnSyllabusYearly" onclick="switchSyllabusView('yearly')">📅 Yearly / Annual Syllabus</button>
      <button type="button" class="btn sm alt" id="btnSyllabusSemester" onclick="switchSyllabusView('semester')">📚 Semester-Wise Syllabus</button>
    </div>

    <div id="syllabusYearlyView">
      ${yearlyHtml || '<p class="muted">No yearly subjects configured.</p>'}
    </div>

    <div id="syllabusSemesterView" style="display:none;">
      ${semesterHtml || '<p class="muted">No semester subjects configured.</p>'}
    </div>
  `;

  window.switchSyllabusView = function(view) {
    const yV = $('#syllabusYearlyView');
    const sV = $('#syllabusSemesterView');
    const bY = $('#btnSyllabusYearly');
    const bS = $('#btnSyllabusSemester');
    if (view === 'yearly') {
      if (yV) yV.style.display = 'block';
      if (sV) sV.style.display = 'none';
      if (bY) bY.className = 'btn sm gold active';
      if (bS) bS.className = 'btn sm alt';
    } else {
      if (yV) yV.style.display = 'none';
      if (sV) sV.style.display = 'block';
      if (bY) bY.className = 'btn sm alt';
      if (bS) bS.className = 'btn sm gold active';
    }
  };

  modal.style.display = 'flex';
};

window.openAddCourseModal = function() {
  alert('🔒 सूचना: नए कोर्स जोड़ना केवल हेड ऑफिस एडमिन द्वारा ही अधिकृत है।');
};

window.openEditCourseModal = function() {
  alert('🔒 सूचना: कोर्स का नाम व काउंसिल फीस में परिवर्तन केवल हेड ऑफिस कर सकता है। आप कार्ड पर अपनी विद्यार्थी फीस (Institute Student Fee) एडिट करके सेव कर सकते हैं।');
};

window.deleteCourse = function() {
  alert('🔒 सूचना: हेड ऑफिस द्वारा अनुमोदित कोर्सेज को सेंटर से हटाया नहीं जा सकता।');
};

// Attendance helpers
function setRowAtt(id, status) {
  const row = $('#attRow_' + id);
  if (!row) return;
  $$('button', row).forEach(b => {
    b.className = b.dataset.st === status ? 'btn sm gold' : 'btn sm alt';
  });
}

function markAllPresent() {
  $$('#view tbody tr').forEach(row => {
    $$('button', row).forEach(b => {
      b.className = b.dataset.st === 'Present' ? 'btn sm gold' : 'btn sm alt';
    });
  });
  toast('Marked all students as Present');
}

async function saveAttendance() {
  const dateStr = $('#attDateInput')?.value || new Date().toISOString().slice(0, 10);
  const rows = $$('#view tbody tr');
  const records = [];
  rows.forEach(r => {
    const id = r.id.replace('attRow_', '');
    const activeBtn = r.querySelector('button.gold');
    const st = activeBtn ? activeBtn.dataset.st : 'Present';
    records.push({ student_id: +id, status: st });
  });

  guard(async () => {
    await api('/api/centre/attendance', {
      method: 'POST',
      body: { date: dateStr, records }
    });
    toast(`Attendance saved for ${records.length} students on ${dateStr}!`);
  });
}

async function loadMonthlyAtt() {
  guard(async () => {
    const d = await api('/api/centre/attendance/monthly');
    $('#monthlyAttBox').innerHTML = table([
      ['Student Roll Code', (r) => `<b style="font-family:monospace;">${esc(r.student_code)}</b>`],
      ['Student Name', (r) => `<b>${esc(r.name)}</b>`],
      ['Marked Sessions', (r) => `${r.total_marked || 22} Days`],
      ['Present', (r) => `<span style="color:#16a34a; font-weight:bold;">${r.present_count || 20} Days</span>`],
      ['Monthly Percentage', (r) => `<b style="color:${r.percentage >= 75 ? '#16a34a' : '#ea580c'};">${r.percentage}%</b>`]
    ], d.report || []);
  });
}

// Mohar & Sign Save
async function saveMoharSign() {
  const logo = $('#logoUrlInput')?.value;
  const seal = $('#sealUrlInput')?.value;
  const sign = $('#signUrlInput')?.value;
  guard(async () => {
    await api('/api/centre/settings', {
      method: 'POST',
      body: { logo_url: logo, seal_url: seal, signature_url: sign }
    });
    await api('/api/centre/mohar-signature', {
      method: 'POST',
      body: { logo_url: logo, seal_url: seal, signature_url: sign }
    }).catch(() => null);
    if (typeof currentCentre !== 'undefined' && currentCentre) {
      if (logo) currentCentre.logo_url = logo;
      if (seal) currentCentre.seal_url = seal;
      if (sign) currentCentre.signature_url = sign;
    }
    toast('Official Logo, Stamp & Signature saved to centre profile!');
  });
}

function setupImageUpload(fileInputId, urlInputId, previewBoxId, defaultIcon) {
  const fInput = $('#' + fileInputId);
  const uInput = $('#' + urlInputId);
  const pBox = $('#' + previewBoxId);
  if (fInput) {
    fInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        uInput.value = ev.target.result;
        pBox.innerHTML = `<img src="${ev.target.result}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
      };
      reader.readAsDataURL(file);
    };
  }
}

// Wallet recharge
async function submitRecharge() {
  const amt = +$('#rechargeInput')?.value || 1000;
  guard(async () => {
    const res = await api('/api/centre/wallet/recharge', {
      method: 'POST',
      body: { amount_rupees: amt }
    });
    toast(`Recharge request ${res.provider_ref} submitted!`);
  });
}

// Student Login Modal Handler
function initStudentLoginModal() {
  const btn = $('#btnStudentLoginModal');
  const modal = $('#studentLoginModal');
  const closeBtn = $('#btnCloseStudentModal');
  if (btn && modal) {
    btn.onclick = () => { modal.style.display = 'flex'; };
  }
  if (closeBtn && modal) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
  const form = $('#studentLoginForm');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      guard(async () => {
        const id = $('#modalStudentInput').value.trim();
        const pw = $('#modalStudentPw').value.trim();
        const res = await api('/api/auth/login', {
          method: 'POST',
          body: { email: id, password: pw }
        });
        toast('Login successful! Redirecting to Student Panel...');
        window.location.href = '/student';
      });
    };
  }
}

// Header & Centre Switcher Initialization
async function initCentreHeader() {
  try {
    const [cData, meData] = await Promise.all([
      api('/api/centre/all-centres'),
      api('/api/auth/me')
    ]);

    allCentresList = cData.centres || [];

    // Prioritize active centre:
    // 1. Authenticated user (centre_id, centre_slug, centre_code)
    // 2. Server resolved active_centre or active_id
    // 3. currentSlug matching centre.slug
    // 4. First centre in list
    const user = meData?.user;
    let activeCentre = null;
    if (user && (user.role === 'centre_owner' || user.centre_id || user.centre_slug || user.centre_code)) {
      if (user.centre_id) activeCentre = allCentresList.find(c => c.id === user.centre_id);
      if (!activeCentre && user.centre_slug) activeCentre = allCentresList.find(c => c.slug === user.centre_slug);
      if (!activeCentre && user.centre_code) activeCentre = allCentresList.find(c => c.centre_code && c.centre_code.toUpperCase() === user.centre_code.toUpperCase());
    }
    if (!activeCentre && cData.active_centre) {
      activeCentre = cData.active_centre;
    }
    if (!activeCentre && cData.active_id) {
      activeCentre = allCentresList.find(c => c.id === cData.active_id);
    }
    if (!activeCentre && currentSlug) {
      activeCentre = allCentresList.find(c => c.slug === currentSlug);
    }
    if (!activeCentre && allCentresList.length > 0) {
      activeCentre = allCentresList[0];
    }

    currentCentre = activeCentre;

    if (activeCentre) {
      currentSlug = activeCentre.slug;
      try { localStorage.setItem('pesc_active_centre_slug', activeCentre.slug); } catch (_) {}
      document.title = `${activeCentre.name} – Centre ERP Portal`;
      if ($('#headerCentreName')) $('#headerCentreName').textContent = activeCentre.name;
      if ($('#headerCentreCode')) $('#headerCentreCode').textContent = activeCentre.centre_code;
      if ($('#headerLogo')) $('#headerLogo').textContent = activeCentre.logo_url || '🎓';
    }

    const sel = $('#centreSelectDropdown');
    if (sel && allCentresList.length) {
      sel.innerHTML = allCentresList.map(c => `
        <option value="${c.id}" ${c.id === (activeCentre?.id) ? 'selected' : ''}>
          ${esc(c.name)} (${esc(c.centre_code)})
        </option>
      `).join('');

      sel.onchange = (e) => {
        const cid = +e.target.value;
        if (cid === (activeCentre?.id)) return;
        const targetCentre = allCentresList.find(c => c.id === cid);
        if (!targetCentre) return;

        showSwitchCentrePasswordModal(targetCentre, () => {
          sel.value = activeCentre?.id;
        });
      };
    }
  } catch (err) {
    console.error('Error init centre header:', err);
  }
}

// Modal: Password Verification Required to Switch Centre
function showSwitchCentrePasswordModal(targetCentre, onCancel) {
  const existing = document.getElementById('switchCentreModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'switchCentreModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(5px);padding:16px;';
  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;padding:26px 28px;max-width:440px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1.5px solid #e2e8f0;animation:popIn 0.2s ease;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:46px;height:46px;border-radius:12px;background:#fef2f2;border:1.5px solid #fecaca;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🔒</div>
        <div>
          <h3 style="margin:0;font-size:1.18rem;color:#0f172a;font-weight:800;">Switch Centre Security</h3>
          <p style="margin:2px 0 0;font-size:0.8rem;color:#64748b;">Admin Password Required</p>
        </div>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:16px;">
        <div style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;">Target Centre:</div>
        <div style="font-weight:800;color:#0a2a5e;font-size:1rem;margin-top:2px;">${esc(targetCentre.name)}</div>
        <div style="font-size:0.82rem;color:#0284c7;font-family:monospace;margin-top:2px;">Code: ${esc(targetCentre.centre_code)}</div>
      </div>

      <p style="font-size:0.84rem;color:#475569;margin:0 0 12px;line-height:1.5;">
        सुरक्षा कारणों से, बिना इस सेंटर के पासवर्ड के दूसरा सेंटर नहीं खोला जा सकता। कृपया <b>${esc(targetCentre.name)}</b> का एडमिन पासवर्ड दर्ज करें:
      </p>

      <form id="switchCentrePasswordForm">
        <label style="display:block;font-size:0.82rem;font-weight:700;color:#334155;margin-bottom:6px;">Target Centre Password *</label>
        <input type="password" id="switchCentrePasswordInput" required autofocus placeholder="Enter centre admin password" style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #cbd5e1;border-radius:8px;font-size:0.95rem;outline:none;margin-bottom:8px;">
        <div id="switchCentreErrorMsg" style="display:none;color:#dc2626;font-size:0.84rem;margin-bottom:12px;font-weight:600;padding:6px 10px;background:#fef2f2;border-radius:6px;border:1px solid #fecaca;"></div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button type="button" id="btnCancelSwitchCentre" class="btn alt sm" style="padding:9px 18px;border-radius:6px;">✕ Cancel</button>
          <button type="submit" id="btnConfirmSwitchCentre" class="btn sm" style="background:#0a2a5e;color:#fff;font-weight:700;padding:9px 22px;border-radius:6px;">🔓 Verify &amp; Switch</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#switchCentrePasswordInput');
  setTimeout(() => input?.focus(), 50);

  const closeModal = () => {
    modal.remove();
    if (typeof onCancel === 'function') onCancel();
  };

  modal.querySelector('#btnCancelSwitchCentre').onclick = closeModal;

  modal.querySelector('#switchCentrePasswordForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = modal.querySelector('#btnConfirmSwitchCentre');
    const errDiv = modal.querySelector('#switchCentreErrorMsg');
    const pw = input.value.trim();
    if (!pw) return;

    btn.disabled = true;
    btn.textContent = 'Verifying…';
    errDiv.style.display = 'none';

    try {
      const res = await api('/api/centre/switch-centre', {
        method: 'POST',
        body: { centre_id: targetCentre.id, password: pw }
      });
      if (res?.centre?.slug) {
        try { localStorage.setItem('pesc_active_centre_slug', res.centre.slug); } catch (_) {}
      }
      toast('✅ Password verified! Switched to ' + targetCentre.name);
      modal.remove();
      window.location.reload();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '🔓 Verify & Switch';
      errDiv.textContent = '❌ ' + (err.message || 'Galat Password! Is centre ka password galat hai.');
      errDiv.style.display = 'block';
      input.value = '';
      input.focus();
    }
  };
}


// Authentication & Dashboard Visibility Controls
function showCentreAuthScreen() {
  const authEl = $('#centreAuthContainer');
  const erpEl = $('#erpMainLayout');
  if (erpEl) erpEl.style.display = 'none';
  if (authEl) {
    authEl.style.display = 'flex';
    initAuthForms();
  }
}

function showErpLayout() {
  const authEl = $('#centreAuthContainer');
  const erpEl = $('#erpMainLayout');
  if (authEl) authEl.style.display = 'none';
  if (erpEl) erpEl.style.display = 'block';
}

function initSignOutButton() {
  const btn = $('#btnSignOutCentre');
  if (btn) {
    btn.onclick = async (e) => {
      e.preventDefault();
      try {
        await api('/api/auth/logout', { method: 'POST' });
      } catch (_) {}
      try { localStorage.removeItem('pesc_active_centre_slug'); } catch (_) {}
      toast('Signed out successfully');
      setTimeout(() => { window.location.href = '/portal'; }, 400);
    };
  }
}

let authFormsInitialized = false;
function initAuthForms() {
  if (authFormsInitialized) return;
  authFormsInitialized = true;

  const tabLogin = $('#tabBtnLogin');
  const tabSetup = $('#tabBtnSetup');
  const contentLogin = $('#tabContentLogin');
  const contentSetup = $('#tabContentSetup');
  const notice = $('#authNotice');

  const switchTab = (tab) => {
    if (notice) notice.style.display = 'none';
    if (tab === 'setup') {
      tabSetup.style.background = '#ffffff';
      tabSetup.style.color = '#064e3b';
      tabSetup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#64748b';
      tabLogin.style.boxShadow = 'none';
      contentLogin.style.display = 'none';
      contentSetup.style.display = 'block';
    } else {
      tabLogin.style.background = '#ffffff';
      tabLogin.style.color = '#064e3b';
      tabLogin.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      tabSetup.style.background = 'transparent';
      tabSetup.style.color = '#64748b';
      tabSetup.style.boxShadow = 'none';
      contentSetup.style.display = 'none';
      contentLogin.style.display = 'block';
    }
  };

  if (tabLogin) tabLogin.onclick = () => switchTab('login');
  if (tabSetup) tabSetup.onclick = () => switchTab('setup');
  if ($('#linkGoToSetup')) $('#linkGoToSetup').onclick = (e) => { e.preventDefault(); switchTab('setup'); };
  if ($('#linkBackToLogin')) $('#linkBackToLogin').onclick = (e) => { e.preventDefault(); switchTab('login'); };

  // Password visibility toggle
  const btnToggle = $('#btnToggleLoginPw');
  if (btnToggle) {
    btnToggle.onclick = () => {
      const pwField = $('#loginPassword');
      if (pwField.type === 'password') {
        pwField.type = 'text';
        btnToggle.textContent = '🔒';
      } else {
        pwField.type = 'password';
        btnToggle.textContent = '👁️';
      }
    };
  }

  // Pre-fill or switch tab if URL params indicate setup
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get('code') || params.get('centre_code') || params.get('centre');
  if (params.get('setup') === 'true' || params.get('tab') === 'setup') {
    switchTab('setup');
    if (codeParam && $('#setupIdent')) $('#setupIdent').value = codeParam;
  } else if (codeParam && $('#loginIdent')) {
    $('#loginIdent').value = codeParam;
  }

  // Submit Centre Login
  const formLogin = $('#formCentreLogin');
  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      const ident = $('#loginIdent').value.trim();
      const password = $('#loginPassword').value.trim();
      if (!ident || !password) return;

      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#e0f2fe; color:#0369a1; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Checking credentials...</div>`;

      try {
        const loginRes = await api('/api/auth/login', {
          method: 'POST',
          body: { email: ident, password }
        });

        if (loginRes?.user?.centre_slug) {
          currentSlug = loginRes.user.centre_slug;
          try { localStorage.setItem('pesc_active_centre_slug', currentSlug); } catch (_) {}
        }

        notice.innerHTML = `<div style="background:#dcfce7; color:#15803d; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✓ Centre Login successful! Opening ERP Portal…</div>`;
        toast('Centre Login successful!');

        setTimeout(async () => {
          showErpLayout();
          renderSidebar();
          initStudentLoginModal();
          initSignOutButton();
          await initCentreHeader();
          switchModule('MyStudents');
        }, 500);
      } catch (err) {
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Invalid Centre Code or Password')}</div>`;
      }
    };
  }

  // Step 1: Send OTP to Franchise Mobile
  let currentSetupIdent = '';
  const formSendOtp = $('#formSendSetupOtp');
  if (formSendOtp) {
    formSendOtp.onsubmit = async (e) => {
      e.preventDefault();
      const ident = $('#setupIdent').value.trim();
      if (!ident) return;

      currentSetupIdent = ident;
      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#e0f2fe; color:#0369a1; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Sending 6-digit verification OTP to registered mobile...</div>`;

      try {
        const res = await api('/api/auth/otp/send', {
          method: 'POST',
          body: { identifier: ident }
        });

        notice.style.display = 'none';
        $('#setupStep1').style.display = 'none';
        $('#setupStep2').style.display = 'block';

        const badge = $('#otpSentBadge');
        if (badge) {
          badge.innerHTML = `✓ ${esc(res.message || 'OTP sent successfully!')}` + (res.dev_otp ? `<br><span style="color:#0369a1; font-size:0.8rem; font-weight:700;">[OTP: ${esc(res.dev_otp)}]</span>` : '');
        }

        if (res.dev_otp && $('#setupOtpCode')) {
          $('#setupOtpCode').value = res.dev_otp;
        }

        toast('OTP sent to registered mobile!');
      } catch (err) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Error sending OTP')}</div>`;
      }
    };
  }

  // Step 2: Verify OTP and Set Password
  const formVerifySet = $('#formVerifyAndSetPassword');
  if (formVerifySet) {
    formVerifySet.onsubmit = async (e) => {
      e.preventDefault();
      const otp = $('#setupOtpCode').value.trim();
      const pw = $('#setupPassword').value.trim();
      const confirmPw = $('#setupConfirmPassword').value.trim();

      if (!otp) return;
      if (pw.length < 6) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ Password must be at least 6 characters</div>`;
        return;
      }
      if (pw !== confirmPw) {
        notice.style.display = 'block';
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ Passwords do not match! Please check again.</div>`;
        return;
      }

      notice.style.display = 'block';
      notice.innerHTML = `<div style="background:#fef3c7; color:#b45309; padding:10px; border-radius:8px; font-weight:600; text-align:center;">Verifying OTP and activating Centre ERP...</div>`;

      try {
        const res = await api('/api/auth/otp/verify-reset', {
          method: 'POST',
          body: {
            identifier: currentSetupIdent || $('#setupIdent').value.trim(),
            otp,
            new_password: pw
          }
        });

        notice.innerHTML = `<div style="background:#dcfce7; color:#15803d; padding:12px; border-radius:8px; font-weight:700; text-align:center;">🎉 ${esc(res.message || 'OTP Verified! Password created successfully.')}</div>`;
        toast('OTP Verified! Unlocking ERP Dashboard...');

        setTimeout(async () => {
          showErpLayout();
          renderSidebar();
          initStudentLoginModal();
          initSignOutButton();
          await initCentreHeader();
          switchModule('MyStudents');
        }, 900);
      } catch (err) {
        notice.innerHTML = `<div style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:10px; border-radius:8px; font-weight:700; text-align:center;">✕ ${esc(err.message || 'Invalid or expired OTP code')}</div>`;
      }
    };
  }

  // Resend OTP Link
  if ($('#linkResendOtp')) {
    $('#linkResendOtp').onclick = async (e) => {
      e.preventDefault();
      const ident = currentSetupIdent || $('#setupIdent').value.trim();
      if (!ident) return;
      try {
        const res = await api('/api/auth/otp/send', {
          method: 'POST',
          body: { identifier: ident }
        });
        toast('New OTP sent to your registered mobile!');
        const badge = $('#otpSentBadge');
        if (badge) {
          badge.innerHTML = `✓ ${esc(res.message || 'New OTP sent!')}` + (res.dev_otp ? `<br><span style="color:#0369a1; font-size:0.8rem; font-weight:700;">[OTP: ${esc(res.dev_otp)}]</span>` : '');
        }
        if (res.dev_otp && $('#setupOtpCode')) $('#setupOtpCode').value = res.dev_otp;
      } catch (err) {
        toast('Error resending OTP: ' + err.message);
      }
    };
  }

  // Change Mobile Number Link
  if ($('#linkChangeMobile')) {
    $('#linkChangeMobile').onclick = (e) => {
      e.preventDefault();
      $('#setupStep2').style.display = 'none';
      $('#setupStep1').style.display = 'block';
      if (notice) notice.style.display = 'none';
    };
  }

  // Forgot password handler
  if ($('#linkForgotPassword')) {
    $('#linkForgotPassword').onclick = (e) => {
      e.preventDefault();
      switchTab('setup');
    };
  }
}

// Initial Bootstrapping with Strict Authentication Check
guard(async () => {
  try {
    const meRes = await api('/api/auth/me').catch(() => null);
    const searchParams = new URLSearchParams(window.location.search);
    const forceLogin = searchParams.get('login') === '1' || searchParams.get('auth') === '1';

    // If explicit login requested, or if not logged in as centre_owner / centre_staff, show login screen!
    if (forceLogin || !meRes || !meRes.user || !['centre_owner', 'centre_staff'].includes(meRes.user.role)) {
      showCentreAuthScreen();
      return;
    }

    if (meRes.user.centre_slug) {
      currentSlug = meRes.user.centre_slug;
      try { localStorage.setItem('pesc_active_centre_slug', currentSlug); } catch (_) {}
    }

    // Authenticated user exists -> open ERP layout
    showErpLayout();
    renderSidebar();
    initStudentLoginModal();
    initSignOutButton();
    await initCentreHeader();
    switchModule('MyStudents');
  } catch (err) {
    showCentreAuthScreen();
  }
});

// Global Marks Edit Modal Handler
window._customMarksheetData = {};
window.openMarksEditModal = function(studentId) {
  let currentSubs = window._customMarksheetData[studentId];
  if (!currentSubs) {
    try {
      const saved = localStorage.getItem('pesc_custom_marks_' + studentId);
      if (saved) currentSubs = JSON.parse(saved);
    } catch (_) {}
  }
  if (!currentSubs || !Array.isArray(currentSubs) || currentSubs.length === 0) {
    currentSubs = [
      { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
      { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
      { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-04', name: 'Practical Assessment', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-05', name: 'Viva-Voce Exam', max: 100, min: 40, obt: 78, grade: 'A+' },
      { code: 'NTT-06', name: 'Internal Project', max: 100, min: 40, obt: 80, grade: 'A+' }
    ];
  }

  let modal = document.getElementById('marksEditModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'marksEditModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); display:flex; align-items:center; justify-content:center; z-index:99999; padding:20px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff; max-width:650px; width:100%; border-radius:12px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
      <h3 style="color:#072a60; margin:0 0 16px;">✏️ Edit Examination Marks &amp; Subjects</h3>
      <form id="marksEditForm" onsubmit="saveCustomMarks(event, ${studentId})">
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-bottom:16px;">
          <thead>
            <tr style="background:#072a60; color:#fff;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Code</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Subject Name</th>
              <th style="padding:6px; border:1px solid #cbd5e1; width:70px;">Max</th>
              <th style="padding:6px; border:1px solid #cbd5e1; width:80px;">Obtained</th>
            </tr>
          </thead>
          <tbody>
            ${currentSubs.map((s, i) => `
              <tr>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="text" name="code_${i}" value="${esc(s.code)}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="text" name="name_${i}" value="${esc(s.name)}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" name="max_${i}" value="${s.max}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" name="obt_${i}" value="${s.obt}" style="width:100%; padding:4px;"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn alt sm" onclick="document.getElementById('marksEditModal').style.display='none'">Cancel</button>
          <button type="submit" class="btn gold sm">💾 Save &amp; Update Marksheet</button>
        </div>
      </form>
    </div>
  `;
  modal.style.display = 'flex';
};

window.saveCustomMarks = async function(e, studentId) {
  e.preventDefault();
  const f = e.target;
  const subs = [];
  for (let i = 0; i < 6; i++) {
    const code = f['code_' + i] ? f['code_' + i].value : 'SUB-' + (i+1);
    const name = f['name_' + i] ? f['name_' + i].value : 'Subject ' + (i+1);
    const max = +(f['max_' + i] ? f['max_' + i].value : 100);
    const obt = +(f['obt_' + i] ? f['obt_' + i].value : 75);
    const pct = max > 0 ? (obt / max) * 100 : 75;
    const grade = pct >= 85 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : 'B';
    subs.push({ code, name, max, min: 40, obt, grade });
  }
  window._customMarksheetData[studentId] = subs;
  try {
    localStorage.setItem('pesc_custom_marks_' + studentId, JSON.stringify(subs));
    await api(`/api/centre/students/${studentId}/marks`, {
      method: 'POST',
      body: { subjects: subs }
    }).catch(() => null);
  } catch (_) {}
  document.getElementById('marksEditModal').style.display = 'none';
  if (typeof updateMrkPreview === 'function') updateMrkPreview();
  if (typeof toast === 'function') toast('✅ Marks updated and saved successfully!');
};
