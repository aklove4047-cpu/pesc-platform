const fs = require('fs');

const adminJs = fs.readFileSync('public/js/admin.js', 'utf8');
const workerJs = fs.readFileSync('src/worker.js', 'utf8');

// Find all api(...) calls
const apiRegex = /api\s*\(\s*[`'"]([^`'"]+)[`'"]/g;
let match;
const endpoints = new Set();
while ((match = apiRegex.exec(adminJs)) !== null) {
  let ep = match[1].split('?')[0];
  ep = ep.replace(/\$\{[^}]+\}/g, ':id');
  endpoints.add(ep);
}

console.log('Total unique endpoints called in admin.js:', endpoints.size);
const missing = [];

for (const ep of Array.from(endpoints).sort()) {
  let found = workerJs.includes(ep);
  if (!found && ep.includes(':id')) {
    // Generate sample concrete path e.g. /api/admin/courses/1/curriculum
    const samplePath = ep.replace(/:id/g, '1');
    // Check if worker has code matching samplePath
    const unescapedWorker = workerJs.replace(/\\\//g, '/');
    const segs = ep.split(':id');
    found = unescapedWorker.includes(segs[0]) && (segs[1] ? unescapedWorker.includes(segs[1].replace(/^\//, '')) : true);
  }

  console.log(`${found ? '✅' : '❌'} ${ep}`);
  if (!found) missing.push(ep);
}

console.log('\nMissing Endpoints in worker.js:', missing);
