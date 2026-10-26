const fs = require('fs');

let centreJs = fs.readFileSync('public/assets/js/centre.js', 'utf8');

// 1. Update showAdmissionFormModal
const oldModalBody = /modal\.innerHTML = `[\s\S]*?<!-- Printable A4 Admission Document Container[\s\S]*?modal\.style\.display = 'flex';/m;

const newModalBody = `modal.innerHTML = \`
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
        \${window.OfficialTemplates ? window.OfficialTemplates.renderAdmissionFormHtml({ student: stu, centre: centre }) : '<p>Loading template...</p>'}
      </div>
    </div>
  \`;

  modal.style.display = 'flex';`;

if (centreJs.match(oldModalBody)) {
  centreJs = centreJs.replace(oldModalBody, newModalBody);
  console.log('Patched showAdmissionFormModal in centre.js');
}

// 2. Update updateCertPreview container rendering
const certRenderOld = /\$('#certPreviewContainer')\.innerHTML = `[\s\S]*?<!-- Royal Certificate Frame with Double Gold[\s\S]*?\${renderOfficialCouncilFooter\(\{[\s\S]*?\}\)\s*\}\s*<\/div>\s*`;/m;

const certRenderNew = `$('#certPreviewContainer').innerHTML = \`
    \${draftBanner}
    \${window.OfficialTemplates ? window.OfficialTemplates.renderCertificateHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: { name: cName, centre_code: cCode, address: cAddress, hindi_name: (currentCentre && currentCentre.hindi_name) || cName, logo_url: (currentCentre && currentCentre.logo_url) || null, seal_url: (currentCentre && currentCentre.seal_url) || null },
      certNo: refNo,
      issueDate: issueDate,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Certificate Template...</p>'}
  \`;`;

if (centreJs.match(certRenderOld)) {
  centreJs = centreJs.replace(certRenderOld, certRenderNew);
  console.log('Patched certPreviewContainer in centre.js');
}

// 3. Update updateMrkPreview container rendering with Marks Edit support
const mrkRenderOld = /\$('#mrkPreviewContainer')\.innerHTML = `[\s\S]*?\${renderOfficialCouncilHeader\(\{[\s\S]*?\${tableContent}[\s\S]*?\${renderOfficialCouncilFooter\(\{[\s\S]*?\}\)\s*\}\s*`;/m;

const mrkRenderNew = `
  const customSubjects = window._customMarksheetData && window._customMarksheetData[studentId] ? window._customMarksheetData[studentId] : [
    { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
    { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
    { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 85, grade: 'A+' },
    { code: 'NTT-04', name: 'Practical Assessment', max: 100, min: 40, obt: 85, grade: 'A+' },
    { code: 'NTT-05', name: 'Viva-Voce Exam', max: 100, min: 40, obt: 78, grade: 'A+' },
    { code: 'NTT-06', name: 'Internal Project', max: 100, min: 40, obt: 80, grade: 'A+' }
  ];

  $('#mrkPreviewContainer').innerHTML = \`
    \${draftBanner}
    <div class="no-print" style="margin-bottom:12px; display:flex; justify-content:flex-end; gap:10px;">
      <button type="button" class="btn sm gold" onclick="openMarksEditModal(\${studentId})">✏️ Edit Marks / Subjects</button>
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff;" onclick="window.print()">🖨️ Print Marksheet</button>
    </div>
    \${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: { name: cName, centre_code: cCode, address: cAddress, hindi_name: (currentCentre && currentCentre.hindi_name) || cName, logo_url: (currentCentre && currentCentre.logo_url) || null, seal_url: (currentCentre && currentCentre.seal_url) || null },
      mrkNo: refNo,
      issueDate: issueDate,
      subjects: customSubjects,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Marksheet Template...</p>'}
  \`;`;

if (centreJs.match(mrkRenderOld)) {
  centreJs = centreJs.replace(mrkRenderOld, mrkRenderNew);
  console.log('Patched mrkPreviewContainer in centre.js');
}

// 4. Update updateIdCardPreview
const idCardOld = /\$('#idCardPreview')\.innerHTML = `[\s\S]*?Director Sign[\s\S]*?<\/div>\s*`;/m;
const idCardNew = `$('#idCardPreview').innerHTML = window.OfficialTemplates ? window.OfficialTemplates.renderStudentIdCardHtml({
      student: { name, roll_no: code, student_code: code, course_name: course, father_name: father, mobile, photo_url: photo },
      centre: currentCentre || { name: cName, centre_code: 'PESC00001' },
      validUpto: 'SEP 2027'
    }) : '<p>Loading ID Card...</p>';`;

if (centreJs.match(idCardOld)) {
  centreJs = centreJs.replace(idCardOld, idCardNew);
  console.log('Patched idCardPreview in centre.js');
}

// 5. Add Marks Edit Modal functions
if (!centreJs.includes('openMarksEditModal')) {
  centreJs += `
// Global Marks Edit Modal Handler
window._customMarksheetData = {};
window.openMarksEditModal = function(studentId) {
  const currentSubs = window._customMarksheetData[studentId] || [
    { code: 'NTT-01', name: 'Child Psychology', max: 100, min: 40, obt: 78, grade: 'A' },
    { code: 'NTT-02', name: 'School Organization', max: 100, min: 40, obt: 72, grade: 'B+' },
    { code: 'NTT-03', name: 'Methods of Teaching', max: 100, min: 40, obt: 85, grade: 'A+' },
    { code: 'NTT-04', name: 'Practical Assessment', max: 100, min: 40, obt: 85, grade: 'A+' },
    { code: 'NTT-05', name: 'Viva-Voce Exam', max: 100, min: 40, obt: 78, grade: 'A+' },
    { code: 'NTT-06', name: 'Internal Project', max: 100, min: 40, obt: 80, grade: 'A+' }
  ];

  let modal = document.getElementById('marksEditModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'marksEditModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); display:flex; align-items:center; justify-content:center; z-index:99999; padding:20px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = \`
    <div style="background:#fff; max-width:650px; width:100%; border-radius:12px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
      <h3 style="color:#072a60; margin:0 0 16px;">✏️ Edit Examination Marks &amp; Subjects</h3>
      <form id="marksEditForm" onsubmit="saveCustomMarks(event, \${studentId})">
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
            \${currentSubs.map((s, i) => \`
              <tr>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="text" name="code_\${i}" value="\${s.code}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="text" name="name_\${i}" value="\${s.name}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" name="max_\${i}" value="\${s.max}" style="width:100%; padding:4px;"></td>
                <td style="padding:4px; border:1px solid #cbd5e1;"><input type="number" name="obt_\${i}" value="\${s.obt}" style="width:100%; padding:4px;"></td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn alt sm" onclick="document.getElementById('marksEditModal').style.display='none'">Cancel</button>
          <button type="submit" class="btn gold sm">💾 Save &amp; Update Marksheet</button>
        </div>
      </form>
    </div>
  \`;
  modal.style.display = 'flex';
};

window.saveCustomMarks = function(e, studentId) {
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
  document.getElementById('marksEditModal').style.display = 'none';
  if (typeof updateMrkPreview === 'function') updateMrkPreview();
  if (typeof toast === 'function') toast('✅ Marks updated successfully!');
};
`;
}

fs.writeFileSync('public/assets/js/centre.js', centreJs, 'utf8');
fs.writeFileSync('public/js/centre.js', centreJs, 'utf8');
console.log('Successfully patched public/assets/js/centre.js and public/js/centre.js!');
