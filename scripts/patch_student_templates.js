const fs = require('fs');

let s = fs.readFileSync('public/assets/js/student.js', 'utf8');

// 1. Patch 'My Marksheet'
const mrkStart = s.indexOf("'My Marksheet': async () => {");
const mrkEnd = s.indexOf("'My Certificate': async () => {", mrkStart);

if (mrkStart !== -1 && mrkEnd !== -1) {
  const newMrk = `'My Marksheet': async () => {
      const data = await api('/api/student/marksheets');
      const list = data.marksheets;

      if (!list || !list.length) {
        viewEl.innerHTML = \`
          <div class="card" style="text-align:center; padding:40px 20px;">
            <div style="font-size:3rem; margin-bottom:12px;">📊</div>
            <h3>No Marksheet Issued Yet</h3>
            <p class="muted">Your examination marksheet has not been issued yet by your centre.</p>
          </div>
        \`;
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

      viewEl.innerHTML = \`
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
            <div>
              <h2 style="margin:0 0 4px; color:#064e3b;">Official Statement of Marks</h2>
              <p class="muted" style="margin:0;">Marksheet No: <b style="color:var(--navy); font-family:monospace;">\${esc(m.marksheet_no || 'PESC-MARKS-2026-0007')}</b></p>
            </div>
            <button onclick="window.print()" class="btn gold">🖨️ Print Marksheet (A4)</button>
          </div>

          \${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
            student: stuObj,
            centre: centreObj,
            mrkNo: m.marksheet_no || 'PESC-MARKS-2026-0007',
            issueDate: '04-10-2026'
          }) : '<p>Loading template...</p>'}
        </div>
      \`;
    },

    `;
  s = s.substring(0, mrkStart) + newMrk + s.substring(mrkEnd);
  console.log('Successfully patched My Marksheet');
}

// 2. Patch 'My Certificate'
const certStart = s.indexOf("'My Certificate': async () => {");
const certEnd = s.indexOf("'Fee Receipt': async () => {", certStart);

if (certStart !== -1 && certEnd !== -1) {
  const newCert = `'My Certificate': async () => {
      const data = await api('/api/student/certificates');
      const list = data.certificates;

      if (!list || !list.length) {
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
        father_name: c.father_name || me.user.father_name || 'Shri Ram',
        mother_name: c.mother_name || me.user.mother_name || 'Smt. Geeta',
        student_code: c.student_code || me.user.student_code || 'PESC-26-00008',
        roll_no: c.roll_no || me.user.roll_no || 'PESC-00008',
        course_name: c.course_name || me.user.course_name || 'Nursery Teacher Training',
        photo_url: me.user.photo || me.user.photo_url || c.student_photo || ''
      };
      const centreObj = {
        name: c.centre_name || c.institute_name || 'PREETI INSTITUTE OF TECHNOLOGY',
        centre_code: c.centre_code || 'PESC00001',
        address: c.centre_address || c.institute_address || 'Village and post shahgarh district Azamgarh',
        hindi_name: c.hindi_name || c.centre_name || 'प्रीति इंस्टीट्यूट ऑफ टेक्नोलॉजी'
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
            issueDate: '04-10-2026'
          }) : '<p>Loading template...</p>'}
        </div>
      \`;
    },

    `;
  s = s.substring(0, certStart) + newCert + s.substring(certEnd);
  console.log('Successfully patched My Certificate');
}

fs.writeFileSync('public/assets/js/student.js', s, 'utf8');
fs.writeFileSync('public/js/student.js', s, 'utf8');
console.log('All student.js patches written!');
