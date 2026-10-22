const fs = require('fs');
const path = require('path');

const srcHtmlPath = path.join(__dirname, '..', 'public', 'centre-site.html');
const destJsPath = path.join(__dirname, '..', 'src', 'centre_site_template.js');

const html = fs.readFileSync(srcHtmlPath, 'utf8');
const jsContent = `export default ${JSON.stringify(html)};\n`;

fs.writeFileSync(destJsPath, jsContent, 'utf8');
console.log('Successfully compiled centre-site.html to src/centre_site_template.js, size:', jsContent.length, 'bytes');
