const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('public/index.html', 'utf8');
const regex = /href=["']([^"']+)["']/g;
let m;
const links = [];
while ((m = regex.exec(html)) !== null) {
  links.push(m[1]);
}

console.log('Total links in index.html:', links.length);
links.forEach(l => console.log(l));
