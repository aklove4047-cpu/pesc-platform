const fs = require('fs');

let s = fs.readFileSync('public/assets/js/student.js', 'utf8');

// 1. Update Marksheet in student.js
const mrkStart = s.indexOf("'Official Marksheet': async () => {");
const mrkEnd = s.indexOf("'My Certificate': async () => {", mrkStart);

if (mrkStart !== -1 && mrkEnd !== -1) {
  const newMrkBlock = `'Official Marksheet': async () => {
      const data = await api('/api/student/marksheets');
      const list = data.marksheets;

      if (!list.length) {
        viewEl.innerHTML = \`
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">📊</div>
            <h3>No Marksheet Available Yet</h3>
            <p class="muted">Your examination marksheet has not been issued yet by your centre.</p>
          </div>
        \`;
        return;
      }

      const m = list[0];
      const stuObj = {
        id: me.user.id || m.student_id,
        name: me.user.name,
        father_name: m.father_name || me.user.father_name || 'N/A',
        mother_name: m.mother_name || me.user.mother_name || 'N/A',
        student_code: m.student_code || me.user.student_code || me.user.roll_no || 'PESC-26-00008',
        roll_no: m.roll_no || me.user.roll_no || me.user.student_code || 'PESC-00008',
        course_name: m.course_name || me.user.course_name || 'Vocational Diploma',
        photo_url: me.user.photo || me.user.photo_url || m.student_photo || ''
      };
      const centreObj = {
        name: m.centre_name || 'Authorized Training Centre',
        centre_code: m.centre_code || 'PESC00001',
        address: m.centre_address || 'Regional Centre',
        hindi_name: m.centre_name || 'अधिकृत प्रशिक्षण केंद्र'
      };

      viewEl.innerHTML = \`
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Statement of Marks</h2>
              <p class="muted" style="margin:0;">Marksheet No: <b style="color:var(--navy); font-family:monospace;">\${esc(m.marksheet_no || 'PESC-MARKS-2026-0007')}</b></p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Official Marksheet (A4)</button>
          </div>

          \${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
            student: stuObj,
            centre: centreObj,
            mrkNo: m.marksheet_no || 'PESC-MARKS-2026-0007',
            issueDate: date(m.issue_date || m.created_at) || '04-10-2026'
          }) : '<p>Loading template...</p>'}
        </div>
      \`;
    },

    `;
  s = s.substring(0, mrkStart) + newMrkBlock + s.substring(mrkEnd);
  console.log('Successfully patched Official Marksheet in student.js');
}

// 2. Update Certificate in student.js
const certStart = s.indexOf("'My Certificate': async () => {");
const certEnd = s.indexOf("'Fee Receipt': async () => {", certStart);

if (certStart !== -1 && certEnd !== -1) {
  const newCertBlock = `'My Certificate': async () => {
      const data = await api('/api/student/certificates');
      const list = data.certificates;

      if (!list.length) {
        viewEl.innerHTML = \`
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">🎓</div>
            <h3>No Certificate Available Yet</h3>
            <p class="muted">Your certificate will appear here once officially approved and issued by Head Office and Centre.</p>
          </div>
        \`;
        return;
      }

      const c = list[0];
      const stuObj = {
        id: me.user.id || c.student_id,
        name: me.user.name,
        father_name: c.father_name || me.user.father_name || 'N/A',
        mother_name: c.mother_name || me.user.mother_name || 'N/A',
        student_code: c.student_code || me.user.student_code || 'PESC-26-00008',
        roll_no: c.roll_no || me.user.roll_no || 'PESC-00008',
        course_name: c.course_name || me.user.course_name || 'Vocational Diploma',
        photo_url: me.user.photo || me.user.photo_url || c.student_photo || ''
      };
      const centreObj = {
        name: c.centre_name || c.institute_name || 'Authorized Training Centre',
        centre_code: c.centre_code || 'PESC00001',
        address: c.centre_address || c.institute_address || 'Regional Centre',
        hindi_name: c.centre_name || c.institute_name || 'अधिकृत प्रशिक्षण केंद्र'
      };

      viewEl.innerHTML = \`
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Certificate of Completion</h2>
              <p class="muted" style="margin:0;">Certificate No: <b style="color:var(--navy); font-family:monospace;">\${esc(c.certificate_no || c.cert_no || 'PESC-CERT-2026-0007')}</b></p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Certificate (A4)</button>
          </div>

          \${window.OfficialTemplates ? window.OfficialTemplates.renderCertificateHtml({
            student: stuObj,
            centre: centreObj,
            certNo: c.certificate_no || c.cert_no || 'PESC-CERT-2026-0007',
            issueDate: date(c.issue_date || c.created_at) || '04-10-2026'
          }) : '<p>Loading template...</p>'}
        </div>
      \`;
    },

    `;
  s = s.substring(0, certStart) + newCertBlock + s.substring(certEnd);
  console.log('Successfully patched My Certificate in student.js');
}

// 3. Update Digital ID Card in student.js
const idcStart = s.indexOf("'Digital ID Card': async () => {");
const idcEnd = s.indexOf("'Support Tickets': async () => {", idcStart);

if (idcStart !== -1 && idcEnd !== -1) {
  const newIdcBlock = `'Digital ID Card': async () => {
      const data = await api('/api/student/id-card');
      const idc = data.id_card;

      viewEl.innerHTML = \`
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span class="badge active" style="font-size:0.8rem;">✓ OFFICIAL INSTITUTIONAL CREDENTIAL</span>
              <h2 style="margin:6px 0 2px;">Student Identity Card (छात्र पहचान पत्र)</h2>
              <p class="muted" style="margin:0;">Official student identity card issued by <b>\${esc(idc.centre_name)}</b> under affiliation of PES Council</p>
            </div>
            <button onclick="window.print()" class="btn gold" style="font-weight:700;">🖨️ Print Student ID Card (Both Sides)</button>
          </div>
        </div>

        \${window.OfficialTemplates ? window.OfficialTemplates.renderStudentIdCardHtml({
          student: {
            name: idc.name || me.user.name,
            roll_no: idc.roll_no || me.user.roll_no,
            student_code: idc.student_code || me.user.student_code,
            course_name: idc.course_name,
            father_name: idc.father_name,
            blood_group: idc.blood_group || 'O+',
            photo_url: me.user.photo || me.user.photo_url || ''
          },
          centre: {
            name: idc.centre_name,
            centre_code: idc.centre_code,
            district: idc.centre_address
          },
          validUpto: idc.valid_until || 'SEP 2027'
        }) : '<p>Loading ID Card...</p>'}
      \`;
    },

    `;
  s = s.substring(0, idcStart) + newIdcBlock + s.substring(idcEnd);
  console.log('Successfully patched Digital ID Card in student.js');
}

// 4. Add Admission Form Tab to Student Portal
if (!s.includes("'Admission Form': async () => {")) {
  s = s.replace(
    "'Official Marksheet': async () => {",
    `'Admission Form': async () => {
      const p = await api('/api/student/profile');
      const stu = p.student || me.user;
      const c = p.centre || { name: stu.centre_name || 'Authorized Study Centre', centre_code: stu.centre_code || 'PESC00001' };

      viewEl.innerHTML = \`
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Admission Form</h2>
              <p class="muted" style="margin:0;">Enrolled Candidate Admission Record</p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Admission Form (A4)</button>
          </div>
        </div>
        \${window.OfficialTemplates ? window.OfficialTemplates.renderAdmissionFormHtml({ student: stu, centre: c }) : '<p>Loading template...</p>'}
      \`;
    },

    'Official Marksheet': async () => {`
  );
  console.log('Added Admission Form tab to student.js');
}

fs.writeFileSync('public/assets/js/student.js', s, 'utf8');
fs.writeFileSync('public/js/student.js', s, 'utf8');
console.log('Successfully updated student.js in public/assets/js and public/js!');
