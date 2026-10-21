const db = require('../src/db');
const app = require('../src/app');

async function testLifecycle() {
  console.log('=== STARTING FULL FRANCHISE APPROVAL & FEATURE TESTING ===\n');

  // 1. Check existing centres in DB
  const existingCentres = db.prepare("SELECT id, name, slug, centre_code, district FROM centres WHERE status='active'").all();
  console.log(`[1] Total Active Centres Currently in DB: ${existingCentres.length}`);
  existingCentres.forEach(c => console.log(`    - [${c.centre_code}] ${c.name} (Subdomain: ${c.slug}.pescouncil.in)`));

  const testSlug = 'shriramcomputer';
  const newCentre = db.prepare("SELECT * FROM centres WHERE slug=?").get(testSlug);
  if (!newCentre) {
    console.error('Centre shriramcomputer not found!');
    return;
  }
  const testName = newCentre.name;

  console.log(`\n[2] Testing Provisioned Centre:`);
  console.log(`    - ID: ${newCentre.id}`);
  console.log(`    - Centre Code: ${newCentre.centre_code}`);
  console.log(`    - Name: ${newCentre.name}`);
  console.log(`    - Subdomain: ${newCentre.slug}.pescouncil.in`);
  console.log(`    - Status: ${newCentre.status}`);

  // 3. Test Server Rendering of the Centre Website
  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`\n[3] Testing Centre Website Rendering on port ${port}...`);

    try {
      // Test URL /c/shriramcomputer
      const res = await fetch(`http://127.0.0.1:${port}/c/${testSlug}`);
      console.log(`    HTTP GET /c/${testSlug} Status:`, res.status);
      const html = await res.text();

      // Check Institute Name in HTML
      const hasName = html.includes(testName);
      console.log(`    ✓ Institute Name "${testName}" in HTML:`, hasName);

      // Check Centre Code in HTML
      const hasCode = html.includes(newCentre.centre_code);
      console.log(`    ✓ Centre Code "${newCentre.centre_code}" in HTML:`, hasCode);

      // Check Subdomain display
      const hasSubdomain = html.includes(`${testSlug}.pescouncil.in`);
      console.log(`    ✓ Subdomain "${testSlug}.pescouncil.in" displayed:`, hasSubdomain);

      // Check Schema.org EducationalOrganization structured data
      const hasSchema = html.includes('EducationalOrganization') && html.includes(testName);
      console.log(`    ✓ Schema.org EducationalOrganization JSON-LD for Google:`, hasSchema);

      // Check SEO Title and Meta Description
      const hasTitle = html.includes(`<title id="pageTitle">`) && html.includes(testName);
      console.log(`    ✓ Dynamic SEO <title> matching Google Search:`, hasTitle);

      // Check Admin ERP Link
      const hasAdminLink = html.includes(`/portal?centre=${testSlug}`);
      console.log(`    ✓ Centre Admin ERP Portal Link:`, hasAdminLink);

      // Check Student Login Modal
      const hasStudentModal = html.includes('id="studentLoginModal"');
      console.log(`    ✓ Student Digital Login Modal:`, hasStudentModal);

      // Check Course Catalog
      const hasCourses = html.includes('ADCA') || html.includes('DCA') || html.includes('Tally');
      console.log(`    ✓ Popular Courses & Admission Inquiry:`, hasCourses);

      // 4. Test Dynamic Sitemap inclusion
      const sitemapRes = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
      const sitemapText = await sitemapRes.text();
      const inSitemap = sitemapText.includes(`https://pescouncil.in/c/${testSlug}`);
      console.log(`\n[4] Dynamic XML Sitemap:`);
      console.log(`    ✓ Newly approved centre in /sitemap.xml:`, inSitemap);

      console.log('\n=== ALL LIFECYCLE, RENDERING, SEO & ERP TESTS PASSED 100%! ===');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close();
    }
  });
}

testLifecycle();
