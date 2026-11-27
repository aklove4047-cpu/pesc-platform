const assert = require('assert');
require('../public/assets/js/official_templates.js');

const dummyStudent = {
  id: 10,
  name: 'Rahul Maurya',
  student_code: 'PESC00001-2026-00010',
  roll_no: '2026010',
  course_name: 'DCA',
  admission_date: '2026-01-15'
};

const dummyCentre = {
  id: 1,
  name: 'Shree Krishna Institute of IT',
  hindi_name: 'श्री कृष्णा इंस्टीट्यूट ऑफ आईटी',
  centre_code: 'PESC00001',
  district: 'Azamgarh',
  state: 'Uttar Pradesh'
};

// Test 1: Marksheet defaults to Centre / Institute name on top
const mrkHtml = global.OfficialTemplates.renderMarksheetHtml({
  student: dummyStudent,
  centre: dummyCentre
});

console.log('--- Checking Marksheet Title ---');
console.log('Includes Shree Krishna English?', mrkHtml.includes('SHREE KRISHNA INSTITUTE OF IT'));
console.log('Includes Shree Krishna Hindi?', mrkHtml.includes('श्री कृष्णा इंस्टीट्यूट ऑफ आईटी'));
console.log('Includes Centre Logo Emblem?', mrkHtml.includes('🏫') && mrkHtml.includes('CENTRE LOGO'));

assert(mrkHtml.includes('SHREE KRISHNA INSTITUTE OF IT'), 'Marksheet must default to Centre English name on top');
assert(mrkHtml.includes('श्री कृष्णा इंस्टीट्यूट ऑफ आईटी'), 'Marksheet must default to Centre Hindi name on top');
assert(mrkHtml.includes('🏫'), 'Marksheet must display Centre Logo emblem');

// Test 2: Custom centre logo
const mrkWithLogo = global.OfficialTemplates.renderMarksheetHtml({
  student: dummyStudent,
  centre: { ...dummyCentre, logo_url: 'https://example.com/logo.png' }
});
assert(mrkWithLogo.includes('https://example.com/logo.png'), 'Must display uploaded centre logo');

console.log('All Marksheet and Certificate Template Tests PASSED! 🎉');
