const fs = require('fs');
let c = fs.readFileSync('public/assets/js/centre.js', 'utf8');

const mrkStart = c.indexOf('async function updateMrkPreview()');
const mrkEnd = c.indexOf('function updateSemCertPreview()', mrkStart);

if (mrkStart !== -1 && mrkEnd !== -1) {
  let f = c.substring(mrkStart, mrkEnd);
  const assignIdx = f.indexOf("$('#mrkPreviewContainer').innerHTML = `");
  if (assignIdx !== -1) {
    const newAssign = `  const customSubjects = window._customMarksheetData && window._customMarksheetData[studentId] ? window._customMarksheetData[studentId] : [
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
      <button type="button" class="btn sm" style="background:#0284c7; color:#fff; font-weight:700;" onclick="window.print()">🖨️ Print Marksheet (A4)</button>
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
    f = f.substring(0, assignIdx) + newAssign;
    c = c.substring(0, mrkStart) + f + c.substring(mrkEnd);
    fs.writeFileSync('public/assets/js/centre.js', c);
    fs.writeFileSync('public/js/centre.js', c);
    console.log('Successfully patched updateMrkPreview!');
  } else {
    console.log('Assign index not found in updateMrkPreview');
  }
} else {
  console.log('mrkStart or mrkEnd not found');
}
