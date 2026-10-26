const fs = require('fs');

let centreJs = fs.readFileSync('public/assets/js/centre.js', 'utf8');

// 1. Locate updateCertPreview function
const certStart = centreJs.indexOf('async function updateCertPreview()');
const certEnd = centreJs.indexOf('// Marksheet Preview', certStart);

if (certStart !== -1 && certEnd !== -1) {
  let certFunc = centreJs.substring(certStart, certEnd);
  // Find where innerHTML is assigned
  const assignIdx = certFunc.indexOf("$('#certPreviewContainer').innerHTML = `");
  if (assignIdx !== -1) {
    const newCertAssign = `$('#certPreviewContainer').innerHTML = \`
    \${draftBanner}
    <div class="no-print" style="margin-bottom:12px; display:flex; justify-content:flex-end; gap:10px;">
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff;" onclick="window.print()">🖨️ Print Certificate (A4)</button>
    </div>
    \${window.OfficialTemplates ? window.OfficialTemplates.renderCertificateHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: { name: cName, centre_code: cCode, address: cAddress, hindi_name: (currentCentre && currentCentre.hindi_name) || cName, logo_url: (currentCentre && currentCentre.logo_url) || null, seal_url: (currentCentre && currentCentre.seal_url) || null },
      certNo: refNo,
      issueDate: issueDate,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Certificate Template...</p>'}
  \`;
}
`;
    certFunc = certFunc.substring(0, assignIdx) + newCertAssign;
    centreJs = centreJs.substring(0, certStart) + certFunc + centreJs.substring(certEnd);
    console.log('Successfully patched updateCertPreview!');
  }
}

// 2. Locate updateMrkPreview function
const mrkStart = centreJs.indexOf('async function updateMrkPreview()');
const mrkEnd = centreJs.indexOf('window.changeMarksheetLayout = function', mrkStart);

if (mrkStart !== -1 && mrkEnd !== -1) {
  let mrkFunc = centreJs.substring(mrkStart, mrkEnd);
  const assignIdx = mrkFunc.indexOf("$('#mrkPreviewContainer').innerHTML = `");
  if (assignIdx !== -1) {
    const newMrkAssign = `
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
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff;" onclick="window.print()">🖨️ Print Marksheet (A4)</button>
    </div>
    \${window.OfficialTemplates ? window.OfficialTemplates.renderMarksheetHtml({
      student: { id: studentId, name, father_name: father, mother_name: mother, student_code: code, roll_no: code, course_name: course, photo_url: photo },
      centre: { name: cName, centre_code: cCode, address: cAddress, hindi_name: (currentCentre && currentCentre.hindi_name) || cName, logo_url: (currentCentre && currentCentre.logo_url) || null, seal_url: (currentCentre && currentCentre.seal_url) || null },
      mrkNo: refNo,
      issueDate: issueDate,
      subjects: customSubjects,
      duration: isSemester ? '6 Months' : '1 Year'
    }) : '<p>Loading Marksheet Template...</p>'}
  \`;
}
`;
    mrkFunc = mrkFunc.substring(0, assignIdx) + newMrkAssign;
    centreJs = centreJs.substring(0, mrkStart) + mrkFunc + centreJs.substring(mrkEnd);
    console.log('Successfully patched updateMrkPreview!');
  }
}

// 3. Update idCardPreview in updateIdCardPreview
const idCardStart = centreJs.indexOf('function updateIdCardPreview()');
const idCardEnd = centreJs.indexOf('async function quickViewStudent', idCardStart);
if (idCardStart !== -1 && idCardEnd !== -1) {
  let idFunc = centreJs.substring(idCardStart, idCardEnd);
  const idAssign = idFunc.indexOf("$('#idCardPreview').innerHTML = `");
  if (idAssign !== -1) {
    const newIdAssign = `$('#idCardPreview').innerHTML = window.OfficialTemplates ? window.OfficialTemplates.renderStudentIdCardHtml({
      student: { name, roll_no: code, student_code: code, course_name: course, father_name: father, mobile, photo_url: photo },
      centre: currentCentre || { name: cName, centre_code: 'PESC00001' },
      validUpto: 'SEP 2027'
    }) : '<p>Loading ID Card...</p>';
}
`;
    idFunc = idFunc.substring(0, idAssign) + newIdAssign;
    centreJs = centreJs.substring(0, idCardStart) + idFunc + centreJs.substring(idCardEnd);
    console.log('Successfully patched updateIdCardPreview!');
  }
}

fs.writeFileSync('public/assets/js/centre.js', centreJs, 'utf8');
fs.writeFileSync('public/js/centre.js', centreJs, 'utf8');
console.log('Finished updating centre.js!');
