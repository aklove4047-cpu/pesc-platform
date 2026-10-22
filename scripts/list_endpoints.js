const fs = require('fs');

['admin.js', 'centre.js', 'coordinator.js', 'student.js'].forEach(file => {
  const code = fs.readFileSync('public/assets/js/' + file, 'utf8');
  const matches = [...code.matchAll(/api\(['"`]([^'"`]+)['"`]/g)].map(m => m[1]);
  console.log('=== ' + file + ' ===');
  console.log([...new Set(matches)]);
});
