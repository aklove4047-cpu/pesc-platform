import test from 'node:test';
import assert from 'node:assert/strict';
import centreSiteTemplate from '../src/centre_site_template.js';

test('Centre Site Template Interactivity & Integrity Audit', (t) => {
  // 1. Must NOT load /assets/js/app.js to prevent global scope collisions
  assert.equal(centreSiteTemplate.includes('/assets/js/app.js'), false, 'Template must not include /assets/js/app.js');

  // 2. Must NOT declare const $ in global scope
  assert.equal(centreSiteTemplate.includes('const $ ='), false, 'Template must not declare global const $');

  // 3. Must expose critical interactive handlers on window
  assert.ok(centreSiteTemplate.includes('window.openApplyWithCourse'), 'Exposes window.openApplyWithCourse');
  assert.ok(centreSiteTemplate.includes('window.searchPublicCourses'), 'Exposes window.searchPublicCourses');
  assert.ok(centreSiteTemplate.includes('window.openStudentModal'), 'Exposes window.openStudentModal');
  assert.ok(centreSiteTemplate.includes('window.openCentreModal'), 'Exposes window.openCentreModal');
  assert.ok(centreSiteTemplate.includes('window.openAdmissionModal'), 'Exposes window.openAdmissionModal');
  assert.ok(centreSiteTemplate.includes('window.closeAllModals'), 'Exposes window.closeAllModals');
  assert.ok(centreSiteTemplate.includes('window.printAdmissionFormFromPay'), 'Exposes window.printAdmissionFormFromPay');
  assert.ok(centreSiteTemplate.includes('window.goToHeroSlide'), 'Exposes window.goToHeroSlide');

  // 4. Must have document click event delegation
  assert.ok(centreSiteTemplate.includes("document.addEventListener('click'"), 'Has document click delegation');
  assert.ok(centreSiteTemplate.includes('#btnStudentLogin'), 'Delegates student login click');
  assert.ok(centreSiteTemplate.includes('#btnCentreAdmin'), 'Delegates centre admin click');
  assert.ok(centreSiteTemplate.includes('#btnOpenApply'), 'Delegates apply click');
  assert.ok(centreSiteTemplate.includes('.c-btn-enroll'), 'Delegates course card click');

  // 5. Must have contrast fixes in CSS
  assert.ok(centreSiteTemplate.includes('.c-hero-left h2, .c-hero-left h2 * {\n      color: #ffffff !important;'), 'Hero heading has high contrast white text');
  assert.ok(centreSiteTemplate.includes('.c-pay-section h3, .c-pay-section h3 * {\n      color: #ffffff !important;'), 'Pay section heading has high contrast white text');

  // 6. Mobile nav toggle must be hidden on desktop
  assert.ok(centreSiteTemplate.includes('.c-nav-toggle {\n      display: none !important;'), 'Mobile nav toggle is hidden on desktop');

  // 7. Double search icon is resolved
  assert.equal(centreSiteTemplate.includes('placeholder="🔍 Search'), false, 'No double search icon in placeholder');

  // 8. No empty src on modalPayQrImg
  assert.equal(centreSiteTemplate.includes('id="modalPayQrImg" src=""'), false, 'No empty src attribute on modal QR img');
});
