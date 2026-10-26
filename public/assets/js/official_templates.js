// Official Document Templates (Admission Form, Certificate, Marksheet, Student ID Card)
// Designed to exactly match user-provided reference images (NO Ashok Stambh - Council & ISO accreditations only)

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

  // Base64 / SVG Badges & Seals
  const SEALS = {
    councilSeal: '/assets/img/seal_council_head.svg',
    councilSign: '/assets/img/sign_council_head.svg',
    coordinatorSeal: '/assets/img/seal_coordinator.svg',
    coordinatorSign: '/assets/img/sign_coordinator.svg',
    centreSeal: '/assets/img/seal_centre_director.svg',
    centreSign: '/assets/img/sign_centre_director.svg',
  };

  // Badges Bar (ISO, NITI Aayog NGO Darpan, IAF, MSME, PESC) - NO Ashok Stambh
  function renderAccreditationBadgesHtml() {
    return `
      <div style="display:flex; justify-content:center; align-items:center; gap:16px; margin-top:14px; padding-top:10px; border-top:1.5px solid #cbd5e1; flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #0369a1; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.6rem; color:#0369a1; background:#f0f9ff;">ISO</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">9001:2015</div>
        </div>
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #047857; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.55rem; color:#047857; background:#ecfdf5;">NITI</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">Aayog</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:4px 8px; border:1.5px solid #b45309; border-radius:4px; font-weight:900; font-size:0.55rem; color:#b45309; background:#fffbeb;">NGO DARPAN</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">Govt. of India</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:4px 10px; border:1.5px solid #1e3a8a; border-radius:4px; font-weight:900; font-size:0.55rem; color:#1e3a8a; background:#eff6ff;">IAF MEMBER</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">Accredited</div>
        </div>
        <div style="text-align:center;">
          <div style="padding:4px 8px; border:1.5px solid #7c2d12; border-radius:4px; font-weight:900; font-size:0.55rem; color:#7c2d12; background:#fef2f2;">MSME</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">Govt. of India</div>
        </div>
        <div style="text-align:center;">
          <div style="width:36px; height:36px; border:1.5px solid #d4af37; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.58rem; color:#854d0e; background:#fefce8;">PESC</div>
          <div style="font-size:0.5rem; font-weight:800; color:#475569; margin-top:2px;">Autonomous</div>
        </div>
      </div>
    `;
  }

  // 1. ADMISSION FORM TEMPLATE (Image 2 - media_1793022501809.jpg)
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

    // Quals
    const quals = s.academic_qualifications || {};
    const q10 = quals.tenth || quals['10th'] || { board: 'State Board / CBSE', year: '2020', marks: '420/500', pct: '84.0%' };
    const q12 = quals.twelfth || quals['12th'] || { board: 'State Board / UP Board', year: '2022', marks: '395/500', pct: '79.0%' };
    const qGrad = quals.graduation || { board: 'University', year: '2025', marks: '1150/1500', pct: '76.6%' };

    // Seals & Signatures
    const centreSeal = c.seal_url || SEALS.centreSeal;
    const centreSign = c.signature_url || SEALS.centreSign;
    const coordSeal = c.coordinator_seal_url || SEALS.coordinatorSeal;
    const coordSign = c.coordinator_signature_url || SEALS.coordinatorSign;
    const councilSeal = SEALS.councilSeal;
    const councilSign = SEALS.councilSign;

    return `
      <div class="official-admission-form printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #072a60; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${c.logo_url ? `<img src="${c.logo_url}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilSeal}" style="width:100%; height:100%; object-fit:contain;">`}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:2rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(centreHindi)}
              </div>
              <div style="font-size:1.3rem; font-weight:900; color:#072a60; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
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
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15);">
                <img src="${councilSeal}" style="width:42px; height:42px;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#072a60; margin-top:3px;">NITI Aayog</div>
              <div style="font-size:0.52rem; font-weight:800; color:#475569;">NGO DARPAN</div>
              <div style="font-size:0.5rem; color:#64748b;">Registered Org.</div>
            </div>
          </div>

          <!-- Banner Bar -->
          <div style="background:linear-gradient(135deg, #072a60 0%, #0c4a6e 50%, #072a60 100%); color:#ffffff; text-align:center; font-weight:900; font-size:1.05rem; padding:6px 12px; border-radius:4px; letter-spacing:1.5px; margin:6px 0 8px; border:1.5px solid #d4af37; text-transform:uppercase;">
            ADMISSION FORM / ADMISSION APPLICATION FORM
          </div>

          <!-- Metadata Line -->
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:8px; border-bottom:1.5px solid #072a60; padding-bottom:4px;">
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
            <!-- Left Info -->
            <div style="flex:1;">
              <!-- Section Ribbon: PERSONAL DETAILS -->
              <div style="background:#072a60; color:#ffffff; text-align:center; font-size:0.75rem; font-weight:900; letter-spacing:1.5px; padding:3px 24px; border-radius:12px; margin:4px 0 8px; display:inline-block; border:1.5px solid #d4af37;">
                PERSONAL DETAILS
              </div>

              <div style="font-size:0.84rem; line-height:1.75; color:#0f172a;">
                <div>
                  Full Name (In Block Letters): <b style="font-size:0.95rem; color:#072a60; text-transform:uppercase; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.name || '')}</b>
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
              <div style="width:105px; height:130px; border:2px solid #072a60; border-radius:4px; overflow:hidden; background:#f8fafc; margin:0 auto; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                ${photoHtml}
              </div>
              <div style="font-size:0.58rem; font-weight:800; color:#072a60; margin-top:3px; letter-spacing:0.5px;">PESC VERIFIED</div>
            </div>
          </div>

          <!-- Section Ribbon: COURSE DETAILS -->
          <div style="text-align:center; margin:8px 0 6px;">
            <div style="background:#072a60; color:#ffffff; font-size:0.75rem; font-weight:900; letter-spacing:1.5px; padding:3px 24px; border-radius:12px; display:inline-block; border:1.5px solid #d4af37;">
              COURSE DETAILS
            </div>
          </div>
          <div style="font-size:0.84rem; line-height:1.75; color:#0f172a;">
            <div>Course Applied For: <b style="font-size:1rem; color:#072a60; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(s.course_name || s.course || 'Vocational Diploma Course')}</b></div>
            <div style="display:flex; gap:16px;">
              <span>Course Duration: [✓] ${esc(durationStr)}</span>
              <span>&nbsp; [ ] Other</span>
            </div>
            <div>Study Centre Name: <b style="color:#0f172a; border-bottom:1px solid #94a3b8; padding:0 8px;">${esc(c.name || centreEnglish)} (${esc(centreCode)})</b></div>
          </div>

          <!-- Section Ribbon: CONTACT & COMMUNICATION DETAILS -->
          <div style="text-align:center; margin:8px 0 6px;">
            <div style="background:#072a60; color:#ffffff; font-size:0.75rem; font-weight:900; letter-spacing:1.5px; padding:3px 24px; border-radius:12px; display:inline-block; border:1.5px solid #d4af37;">
              CONTACT &amp; COMMUNICATION DETAILS
            </div>
          </div>
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

          <!-- Section Ribbon: EDUCATIONAL QUALIFICATION -->
          <div style="text-align:center; margin:8px 0 6px;">
            <div style="background:#072a60; color:#ffffff; font-size:0.75rem; font-weight:900; letter-spacing:1.5px; padding:3px 24px; border-radius:12px; display:inline-block; border:1.5px solid #d4af37;">
              EDUCATIONAL QUALIFICATION
            </div>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:center; border:1.5px solid #072a60; margin-bottom:8px;">
            <thead>
              <tr style="background:#072a60; color:#ffffff; font-weight:900;">
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

          <!-- Declaration -->
          <div style="text-align:center; margin:8px 0 4px;">
            <div style="background:#072a60; color:#ffffff; font-size:0.75rem; font-weight:900; letter-spacing:1.5px; padding:3px 24px; border-radius:12px; display:inline-block; border:1.5px solid #d4af37;">
              DECLARATION BY THE APPLICANT
            </div>
          </div>
          <div style="font-size:0.74rem; color:#334155; line-height:1.45; text-align:justify; margin-bottom:12px;">
            I hereby declare that all the information provided above is true and correct to the best of my knowledge, and I understand that any false statement may lead to the rejection of my application.
          </div>

          <!-- 3 Stamps & Signatures Row (Applicant, Centre/Coordinator, Council) -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px; padding:0 8px;">
            <!-- Left: Applicant -->
            <div style="text-align:center; width:180px;">
              <div style="height:48px; display:flex; align-items:flex-end; justify-content:center;">
                <div style="font-family:'Brush Script MT', cursive; font-size:1.4rem; color:#072a60;">${esc(s.name || 'Applicant')}</div>
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.78rem; font-weight:800; color:#0f172a;">
                Signature of Applicant
              </div>
            </div>

            <!-- Middle: Authorised Signatory / Coordinator -->
            <div style="text-align:center; width:220px;">
              <div style="height:65px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:64px; height:64px; position:absolute; opacity:0.85; filter:drop-shadow(0 1px 3px rgba(0,0,0,0.15));">
                <img src="${coordSign}" style="width:85px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.78rem; font-weight:800; color:#0f172a;">
                Authorised Signatory / Coordinator
              </div>
            </div>

            <!-- Right: Signature of Council -->
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

          <!-- Bottom Badges Strip -->
          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // 2. CERTIFICATE OF COMPLETION TEMPLATE (Image 3 - media_1793022505568.jpg)
  function renderCertificateHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const certNo = data.certNo || s.cert_no || `PESC-CERT-2026-${String(s.id || '0007').padStart(4, '0')}`;
    const regNoCouncil = data.regNoCouncil || 'TRUST/2025/5/IV/299';
    const studentRegNo = s.student_code || `PESC-26-${String(s.id || '00008').padStart(5, '0')}`;
    const rollNo = s.roll_no || `Pesc-${String(s.id || '00008').padStart(5, '0')}`;
    const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const centreHindi = c.hindi_name || c.name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी';
    const centreEnglish = (c.name || 'PREETI INSTITUTE OF TECHNOLOGY').toUpperCase();
    const courseName = s.course_name || s.course || 'Nursery Teacher Training';
    const percentage = data.percentage || s.percentage || '74.57';
    const grade = data.grade || s.grade || 'A';
    const duration = data.duration || (s.duration_months ? `${Math.round(s.duration_months/12) || 1} Year` : '1 Year');
    const examVenue = data.examVenue || c.address || `${c.district || 'Shahgarh'}, Uttar Pradesh`;
    const fromDate = data.fromDate || '01-09-2025';
    const toDate = data.toDate || '12-09-2026';

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:25px; font-size:0.6rem; font-weight:800; color:#64748b;">PHOTO</div>`;

    // Seals & Signatures
    const centreSeal = c.seal_url || SEALS.centreSeal;
    const centreSign = c.signature_url || SEALS.centreSign;
    const coordSeal = c.coordinator_seal_url || SEALS.coordinatorSeal;
    const coordSign = c.coordinator_signature_url || SEALS.coordinatorSign;
    const councilSeal = SEALS.councilSeal;
    const councilSign = SEALS.councilSign;

    return `
      <div class="official-certificate printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #072a60; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${c.logo_url ? `<img src="${c.logo_url}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilSeal}" style="width:100%; height:100%; object-fit:contain;">`}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:2rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(centreHindi)}
              </div>
              <div style="font-size:1.3rem; font-weight:900; color:#072a60; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
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
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15);">
                <img src="${councilSeal}" style="width:42px; height:42px;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#072a60; margin-top:3px;">NITI Aayog</div>
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
            <!-- Right: Photo & Ref No -->
            <div style="display:flex; gap:16px; align-items:flex-start;">
              <div style="text-align:right;">
                <div>Ref No.: <span style="font-family:monospace;">${esc(certNo)}</span></div>
                <div>Date of Issue : <span style="border-bottom:1px solid #0f172a; padding:0 6px;">${esc(issueDate)}</span></div>
              </div>
              <div style="width:82px; height:98px; border:2px solid #072a60; border-radius:4px; overflow:hidden; background:#f8fafc; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                ${photoHtml}
              </div>
            </div>
          </div>

          <!-- Golden 3D Ribbon Banner: CERTIFICATE OF COMPLETION -->
          <div style="text-align:center; margin:4px 0 14px;">
            <div style="display:inline-block; position:relative; background:linear-gradient(135deg, #d4af37 0%, #fef08a 40%, #b45309 100%); padding:8px 50px 10px; border-radius:6px; box-shadow:0 6px 18px rgba(180,83,9,0.3); border:2px solid #854d0e;">
              <div style="font-size:1.85rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Georgia', serif; letter-spacing:3px; line-height:1;">
                CERTIFICATE
              </div>
              <div style="font-size:0.85rem; font-weight:900; color:#072a60; letter-spacing:2px; text-transform:uppercase; margin-top:3px;">
                OF COMPLETION
              </div>
            </div>
          </div>

          <!-- Certificate Body -->
          <div style="text-align:center; font-size:0.92rem; color:#0f172a; line-height:2.2; margin:10px auto;">
            <div style="font-weight:800; color:#072a60; letter-spacing:1px; font-size:0.95rem;">THIS IS TO CERTIFY THAT</div>
            <div style="font-size:1.05rem;">
              MR. / MRS. &nbsp;<span style="font-family:'Brush Script MT', 'Dancing Script', cursive; font-size:2rem; font-weight:900; color:#072a60; border-bottom:1.5px solid #334155; padding:0 30px; display:inline-block;">${esc(s.name || 'Candidate Name')}</span>
            </div>
            <div>
              S/O / D/O / W/O : &nbsp;<span style="font-weight:800; border-bottom:1.5px solid #334155; padding:0 24px;">${esc(s.father_name || 'Shri Ram')}</span>
            </div>
            <div>
              MOTHER'S NAME : &nbsp;<span style="font-weight:800; border-bottom:1.5px solid #334155; padding:0 24px;">${esc(s.mother_name || 'Smt. Geeta')}</span>
            </div>
            <div style="font-size:0.78rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px;">
              HAS SUCCESSFULLY CLEARED THE ASSESSMENT IN THE JOB ROLE / COURSE
            </div>
            <div style="font-size:1.55rem; font-weight:900; color:#072a60; font-family:'Georgia', serif; margin:2px 0;">
              ${esc(courseName)}
            </div>
            <div>
              WITH &nbsp;<b style="border-bottom:1.5px solid #334155; padding:0 12px; font-size:1.05rem; color:#072a60;">${esc(percentage)}</b> % MARKS HELD IN &nbsp;<span style="border-bottom:1.5px solid #334155; padding:0 16px;">${esc(examVenue)}</span>
            </div>
            <div>
              WITH GRADE &nbsp;<b style="border-bottom:1.5px solid #334155; padding:0 16px; font-size:1.15rem; color:#15803d;">${esc(grade)}</b> &nbsp; FROM OUR AUTHORIZED STUDY CENTRE
            </div>
            <div style="font-size:1.3rem; font-weight:900; color:#072a60; text-transform:uppercase; margin:4px 0;">
              ${esc(c.name || centreEnglish)}
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
            <!-- 1. Head Office -->
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${councilSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Head Office
              </div>
            </div>

            <!-- 2. Center Head -->
            <div style="text-align:center; width:170px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${centreSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${centreSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp of<br>Center / Centre Head
              </div>
            </div>

            <!-- 3. Coordinator -->
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${coordSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Coordinator
              </div>
            </div>

            <!-- 4. QR Code -->
            <div style="text-align:center; width:100px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fcertificate%2F${encodeURIComponent(studentRegNo)}" style="width:65px; height:65px; display:block; margin:0 auto; border:1px solid #072a60; padding:2px; background:#fff;">
              <div style="font-size:0.56rem; font-weight:800; color:#072a60; margin-top:3px; line-height:1.2;">
                Verify Certificate<br>Scan QR Code
              </div>
            </div>
          </div>

          <!-- Bottom Badges Strip -->
          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // 3. MARKSHEET / STATEMENT OF MARKS TEMPLATE (Image 4 - media_1793022512184.jpg)
  function renderMarksheetHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const mrkNo = data.mrkNo || s.marksheet_no || `PESC-MARKS-2026-${String(s.id || '0007').padStart(4, '0')}`;
    const studentRegNo = s.student_code || `PESC-26-${String(s.id || '00008').padStart(5, '0')}`;
    const rollNo = s.roll_no || `Pesc-${String(s.id || '00008').padStart(5, '0')}`;
    const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const centreHindi = c.hindi_name || c.name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी';
    const centreEnglish = (c.name || 'PREETI INSTITUTE OF TECHNOLOGY').toUpperCase();
    const courseName = s.course_name || s.course || 'Nursery Teacher Training';
    const duration = data.duration || (s.duration_months ? `${Math.round(s.duration_months/12) || 1} Year` : '1 Year');

    const photoUrl = s.photo_url || s.photo || '';
    const photoHtml = photoUrl ? 
      `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover; display:block;">` :
      `<div style="padding-top:25px; font-size:0.6rem; font-weight:800; color:#64748b;">PHOTO</div>`;

    // Subjects list
    const subjects = data.subjects || [
      { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
      { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
      { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-04', name: 'Practical', max: 100, min: 40, obt: 85, grade: 'A+' },
      { code: 'NTT-05', name: 'Viva-Voce', max: 100, min: 40, obt: 78, grade: 'A+' },
      { code: 'NTT-06', name: 'Internal Assessment', max: 100, min: 40, obt: 80, grade: 'A+' }
    ];

    const maxTotal = subjects.reduce((sum, sub) => sum + (+sub.max || 100), 0);
    const obtTotal = subjects.reduce((sum, sub) => sum + (+sub.obt || 0), 0);
    const percentage = maxTotal > 0 ? ((obtTotal / maxTotal) * 100).toFixed(2) : '74.57';
    const finalGrade = percentage >= 85 ? 'A+' : percentage >= 70 ? 'A' : percentage >= 60 ? 'B+' : 'B';
    const resultText = percentage >= 60 ? 'PASSED IN FIRST DIVISION' : 'PASSED IN SECOND DIVISION';

    // Seals & Signatures
    const centreSeal = c.seal_url || SEALS.centreSeal;
    const centreSign = c.signature_url || SEALS.centreSign;
    const coordSeal = c.coordinator_seal_url || SEALS.coordinatorSeal;
    const coordSign = c.coordinator_signature_url || SEALS.coordinatorSign;
    const councilSeal = SEALS.councilSeal;
    const councilSign = SEALS.councilSign;

    return `
      <div class="official-marksheet printable-area" style="width:100%; max-width:820px; margin:0 auto; background:#ffffff; border:8px solid #072a60; outline:3px solid #d4af37; outline-offset:-5px; padding:22px 26px; box-sizing:border-box; font-family:'Inter', Arial, sans-serif; color:#0f172a; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.12);">
        
        <!-- Watermark Background -->
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
          <img src="${councilSeal}" style="width:400px; height:400px;">
        </div>

        <div style="position:relative; z-index:1;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:8px;">
            <!-- Left: Centre Logo -->
            <div style="width:85px; height:85px; border-radius:50%; border:2px solid #d4af37; padding:2px; background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              ${c.logo_url ? `<img src="${c.logo_url}" style="width:100%; height:100%; object-fit:contain;">` : `<img src="${councilSeal}" style="width:100%; height:100%; object-fit:contain;">`}
            </div>

            <!-- Center: Names and Accreditations -->
            <div style="text-align:center; flex:1;">
              <div style="font-size:2rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.15; margin:0;">
                ${esc(centreHindi)}
              </div>
              <div style="font-size:1.3rem; font-weight:900; color:#072a60; letter-spacing:0.5px; text-transform:uppercase; margin-top:2px;">
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
              <div style="width:52px; height:52px; margin:0 auto; border-radius:50%; border:1.5px solid #047857; display:flex; align-items:center; justify-content:center; background:#ecfdf5; box-shadow:0 2px 6px rgba(4,120,87,0.15);">
                <img src="${councilSeal}" style="width:42px; height:42px;">
              </div>
              <div style="font-size:0.62rem; font-weight:900; color:#072a60; margin-top:3px;">NITI Aayog</div>
              <div style="font-size:0.52rem; font-weight:800; color:#475569;">NGO DARPAN</div>
              <div style="font-size:0.5rem; color:#64748b;">Registered Org.</div>
            </div>
          </div>

          <!-- Reference & Date Line -->
          <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:800; color:#0f172a; margin:6px 0 10px; line-height:1.7;">
            <div>
              <div>Student Reg. No.: <span style="font-family:monospace; color:#0284c7;">${esc(studentRegNo)}</span></div>
              <div>Roll Number : <span style="font-family:monospace;">${esc(rollNo)}</span></div>
              <div>MR. /MRS. : <b style="font-size:0.95rem; color:#072a60;">${esc(s.name || 'Candidate Name')}</b></div>
            </div>
            <!-- Right: Photo & Ref No -->
            <div style="display:flex; gap:16px; align-items:flex-start;">
              <div style="text-align:right;">
                <div>Ref No.: <span style="font-family:monospace;">${esc(mrkNo)}</span></div>
                <div>Date of Issue : <span style="border-bottom:1px solid #0f172a; padding:0 6px;">${esc(issueDate)}</span></div>
              </div>
              <div style="width:82px; height:98px; border:2px solid #072a60; border-radius:4px; overflow:hidden; background:#f8fafc; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                ${photoHtml}
              </div>
            </div>
          </div>

          <!-- Golden 3D Ribbon Banner: MARKSHEET / STATEMENT OF MARKS -->
          <div style="text-align:center; margin:2px 0 10px;">
            <div style="display:inline-block; position:relative; background:linear-gradient(135deg, #d4af37 0%, #fef08a 40%, #b45309 100%); padding:6px 60px 8px; border-radius:6px; box-shadow:0 6px 18px rgba(180,83,9,0.3); border:2px solid #854d0e;">
              <div style="font-size:1.9rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Georgia', serif; letter-spacing:3px; line-height:1;">
                MARKSHEET
              </div>
              <div style="font-size:0.85rem; font-weight:900; color:#072a60; letter-spacing:2px; text-transform:uppercase; margin-top:2px;">
                STATEMENT OF MARKS
              </div>
            </div>
          </div>

          <!-- Candidate Details & Course Line -->
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.86rem; font-weight:800; color:#0f172a; margin-bottom:8px; line-height:1.6;">
            <div>
              <div>S/O / D/O / W/O : <span>${esc(s.father_name || 'Shri Ram')}</span></div>
              <div>MOTHER'S NAME : <span>${esc(s.mother_name || 'Smt. Geeta')}</span></div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:1.15rem; font-weight:900; color:#072a60;">${esc(courseName)}</div>
              <div style="font-size:0.82rem; color:#475569;">Duration : ${esc(duration)}</div>
            </div>
          </div>

          <!-- Marks Table (Exact Image 4) -->
          <table style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:center; border:2px solid #072a60; margin-bottom:6px;">
            <thead>
              <tr style="background:#072a60; color:#ffffff; font-weight:900;">
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
                  <td style="padding:6px 6px; border:1px solid #cbd5e1; font-weight:900; color:#072a60;">${esc(sub.obt)}</td>
                  <td style="padding:6px 6px; border:1px solid #cbd5e1; font-weight:900; color:#15803d;">${esc(sub.grade)}</td>
                </tr>
              `).join('')}
              <!-- Grand Total Row -->
              <tr style="background:#072a60; color:#ffffff; font-weight:900; font-size:0.92rem;">
                <td colspan="2" style="padding:7px 12px; border:1px solid #072a60; text-align:right; letter-spacing:1px;">GRAND TOTAL:</td>
                <td style="padding:7px 6px; border:1px solid #072a60;">${maxTotal}</td>
                <td style="padding:7px 6px; border:1px solid #072a60;">-</td>
                <td style="padding:7px 6px; border:1px solid #072a60; color:#fde047;">${obtTotal}</td>
                <td style="padding:7px 6px; border:1px solid #072a60; color:#86efac;">${finalGrade}</td>
              </tr>
            </tbody>
          </table>

          <!-- Percentage & Grade Summary Bar -->
          <div style="display:flex; justify-content:space-around; align-items:center; font-size:0.92rem; font-weight:900; color:#072a60; border:1.5px solid #072a60; padding:5px 12px; background:#f0f9ff; margin:6px 0;">
            <div>PERCENTAGE : <span style="color:#0369a1;">${percentage}%</span></div>
            <div>GRADE: <span style="color:#15803d;">${finalGrade}</span></div>
          </div>

          <!-- Result Line -->
          <div style="text-align:center; font-size:1.05rem; font-weight:900; color:#047857; letter-spacing:1px; margin:4px 0 10px;">
            RESULT : ${resultText}
          </div>

          <!-- Bottom Row: 3 Stamps + QR Code -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px; padding:0 6px;">
            <!-- 1. Head Office -->
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${councilSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${councilSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Head Office
              </div>
            </div>

            <!-- 2. Center Head -->
            <div style="text-align:center; width:170px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${centreSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${centreSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp of<br>Center / Centre Head
              </div>
            </div>

            <!-- 3. Coordinator -->
            <div style="text-align:center; width:160px;">
              <div style="height:62px; position:relative; display:flex; align-items:center; justify-content:center;">
                <img src="${coordSeal}" style="width:60px; height:60px; position:absolute; opacity:0.85;">
                <img src="${coordSign}" style="width:80px; position:relative; z-index:2;">
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:4px; font-size:0.72rem; font-weight:800; color:#0f172a;">
                Signature &amp; Stamp<br>of Coordinator
              </div>
            </div>

            <!-- 4. QR Code -->
            <div style="text-align:center; width:100px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fmarksheet%2F${encodeURIComponent(studentRegNo)}" style="width:65px; height:65px; display:block; margin:0 auto; border:1px solid #072a60; padding:2px; background:#fff;">
              <div style="font-size:0.56rem; font-weight:800; color:#072a60; margin-top:3px; line-height:1.2;">
                Verify Certificate<br>Scan QR Code
              </div>
            </div>
          </div>

          <!-- Bottom Badges Strip -->
          ${renderAccreditationBadgesHtml()}
        </div>
      </div>
    `;
  }

  // 4. STUDENT I-CARD TEMPLATE (Image 1 - media_1793022486550.jpg)
  function renderStudentIdCardHtml(data) {
    const s = data.student || {};
    const c = data.centre || {};
    const name = s.name || 'Candidate Name';
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

    // Seals & Signatures
    const centreSign = c.signature_url || SEALS.centreSign;
    const councilSeal = SEALS.councilSeal;
    const councilSign = SEALS.councilSign;

    return `
      <div class="official-id-card-wrap" style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap; font-family:'Inter', Arial, sans-serif;">
        <!-- FRONT SIDE -->
        <div class="id-card-front printable-area" style="width:320px; border-radius:16px; overflow:hidden; border:4px solid #072a60; outline:2px solid #d4af37; background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.18); position:relative; box-sizing:border-box;">
          
          <!-- Lanyard Slot Cutout -->
          <div style="width:48px; height:12px; background:#e2e8f0; border-radius:6px; margin:8px auto 4px; border:1px solid #94a3b8;"></div>

          <!-- Top Header -->
          <div style="padding:4px 10px 6px; text-align:center;">
            <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
              <img src="${councilSeal}" style="width:38px; height:38px; flex-shrink:0;">
              <div>
                <div style="font-size:0.95rem; font-weight:900; color:#072a60; font-family:'Rozha One', 'Tiro Devanagari Hindi', serif; line-height:1.1;">
                  ${esc(centreHindi)}
                </div>
                <div style="font-size:0.65rem; font-weight:900; color:#072a60; text-transform:uppercase; letter-spacing:0.3px;">
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
            <div style="display:inline-block; background:linear-gradient(135deg, #072a60 0%, #0369a1 100%); color:#ffffff; padding:4px 28px; border-radius:18px; border:1.5px solid #d4af37; box-shadow:0 3px 8px rgba(7,42,96,0.3);">
              <div style="font-size:0.92rem; font-weight:900; letter-spacing:1px;">STUDENT I-CARD</div>
            </div>
            <div style="font-size:0.6rem; font-weight:800; color:#072a60; margin-top:2px;">VALID UPTO: <b>${esc(validUpto)}</b></div>
          </div>

          <!-- Photo with Golden Border -->
          <div style="width:96px; height:116px; border:2.5px solid #d4af37; border-radius:6px; overflow:hidden; background:#f8fafc; margin:0 auto 8px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
            ${photoHtml}
          </div>

          <!-- Candidate Details -->
          <div style="font-size:0.74rem; font-weight:800; color:#0f172a; line-height:1.6; padding:0 16px;">
            <div>STUDENT NAME: <b style="color:#072a60; font-size:0.8rem;">${esc(name)}</b></div>
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
          <div style="background:#072a60; color:#ffffff; text-align:center; font-size:0.65rem; font-weight:900; padding:4px 6px; text-transform:uppercase; letter-spacing:0.5px;">
            ${esc(centreEnglish)}
          </div>
        </div>

        <!-- BACK SIDE -->
        <div class="id-card-back printable-area" style="width:320px; border-radius:16px; overflow:hidden; border:4px solid #072a60; outline:2px solid #d4af37; background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.18); position:relative; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
          <!-- Lanyard Slot Cutout -->
          <div style="width:48px; height:12px; background:#e2e8f0; border-radius:6px; margin:8px auto 4px; border:1px solid #94a3b8;"></div>

          <div style="padding:10px 18px 4px;">
            <div style="text-align:center; font-size:0.9rem; font-weight:900; color:#072a60; border-bottom:1.5px solid #072a60; padding-bottom:4px; margin-bottom:8px;">
              RULES &amp; REGULATIONS
            </div>
            <ol style="font-size:0.68rem; color:#334155; line-height:1.5; padding-left:14px; margin:0 0 12px;">
              <li>This card is non-transferable and must be carried at all times.</li>
              <li>Loss of this card must be reported immediately to the centre.</li>
              <li>Returns to: <b>${esc(centreEnglish)}</b>, ${esc(c.district || 'Azamgarh')}.</li>
            </ol>

            <div style="font-size:0.72rem; color:#0f172a; line-height:1.5;">
              <b>Contact:</b><br>
              Website: ${esc(c.slug ? `https://${c.slug}.pescouncil.in` : 'https://pescouncil.in')}<br>
              Email: ${esc(c.email || 'info@pescouncil.in')}
            </div>
          </div>

          <div style="text-align:center; padding-bottom:8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fpescouncil.in%2Fverify%2Fstudent%2F${encodeURIComponent(regNo)}" style="width:75px; height:75px; border:1px solid #072a60; padding:2px; background:#fff; display:block; margin:0 auto;">
            <div style="font-size:0.62rem; font-weight:800; color:#072a60; margin-top:3px;">Verify Card</div>
          </div>

          <!-- Bottom Badges Strip -->
          <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:4px 6px;">
            ${renderAccreditationBadgesHtml()}
          </div>
        </div>
      </div>
    `;
  }

  // Export to window / global
  global.OfficialTemplates = {
    renderAdmissionFormHtml,
    renderCertificateHtml,
    renderMarksheetHtml,
    renderStudentIdCardHtml,
    renderAccreditationBadgesHtml
  };

})(typeof window !== 'undefined' ? window : globalThis);
