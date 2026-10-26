const fs = require('fs');
const files = ['portal.html', 'centre.html', 'admin.html', 'student.html', 'coordinator.html'];
for (const f of files) {
  const p = 'public/' + f;
  if (!fs.existsSync(p)) continue;
  let h = fs.readFileSync(p, 'utf8');
  if (!h.includes('official_templates.js')) {
    h = h.replace(/<script src="[^"]*app\.js"><\/script>/, '<script src="/assets/js/official_templates.js"></script>\n  $&');
    fs.writeFileSync(p, h, 'utf8');
    console.log('Added official_templates.js to', f);
  } else {
    console.log('Already present in', f);
  }
}
