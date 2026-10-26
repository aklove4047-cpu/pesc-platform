const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
let code = fs.readFileSync(workerPath, 'utf8');

const target = `    // Known direct HTML pages - serve directly from ASSETS
    if (['/centre', '/portal', '/admin', '/coordinator', '/student', '/verify', '/login', '/setup'].includes(path)) {
      return env.ASSETS.fetch(request);
    }`;

const replacement = `    // Known direct HTML pages - serve directly from ASSETS
    if (['/centre', '/portal', '/admin', '/coordinator', '/student', '/verify', '/login', '/setup'].includes(path)) {
      return env.ASSETS.fetch(request);
    }

    // Friendly section aliases for homepage (zero 404s)
    if (path === '/courses' || path === '/courses/') return Response.redirect(\`https://\${host}/#centres-section\`, 302);
    if (path === '/events' || path === '/events/' || path === '/gallery' || path === '/gallery/') return Response.redirect(\`https://\${host}/#events-section\`, 302);
    if (path === '/about' || path === '/about/' || path === '/contact' || path === '/contact/') return Response.redirect(\`https://\${host}/#\`, 302);
    if (path === '/franchise' || path === '/franchise/' || path === '/apply' || path === '/apply/') return Response.redirect(\`https://\${host}/#\`, 302);`;

code = code.replace(target, replacement);

fs.writeFileSync(workerPath, code, 'utf8');
console.log('✅ Added friendly section redirects in worker.js.');
