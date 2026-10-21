const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const filesToSync = [
  'src/server.js',
  'src/seed.js',
  'src/routes/centre.js',
  'src/routes/auth.js',
  'src/routes/public.js',
  'src/app.js',
  'src/db.js',
  'public/centre.html',
  'public/centre-site.html',
  'public/js/centre.js',
  'public/index.html',
  'public/js/index.js'
];

const syncItems = [];

for (const relPath of filesToSync) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    syncItems.push({
      path: relPath.replace(/\\/g, '/'),
      isBinary: false,
      content: content
    });
  }
}

// Add images
const imgFiles = ['public/assets/img/classroom.jpg', 'public/assets/img/director.jpg'];
for (const relPath of imgFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    syncItems.push({
      path: relPath.replace(/\\/g, '/'),
      isBinary: true,
      content: fs.readFileSync(fullPath).toString('base64')
    });
  }
}

// Also add pesc.db as base64
const dbPath = path.join(rootDir, 'data', 'pesc.db');
if (fs.existsSync(dbPath)) {
  syncItems.push({
    path: 'data/pesc.db',
    isBinary: true,
    content: fs.readFileSync(dbPath).toString('base64')
  });
}

fs.writeFileSync(path.join(rootDir, 'scripts', 'sync_payload.json'), JSON.stringify(syncItems));
console.log('Sync payload generated with', syncItems.length, 'files');
