const db = require('../src/db');
const fs = require('fs');
const path = require('path');

const centres = db.prepare("SELECT slug, centre_code, name FROM centres WHERE status='active' ORDER BY id ASC").all();
const dateStr = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pescouncil.in/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pescouncil.in/portal</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

for (const c of centres) {
  xml += `  <url>
    <loc>https://${c.slug}.pescouncil.in/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;
  if (!c.slug.endsWith('computer')) {
    xml += `  <url>
    <loc>https://${c.slug}computer.pescouncil.in/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;
  }
}
xml += `</urlset>\n`;


const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log('Generated:', sitemapPath);

const robots = `User-agent: *
Allow: /

Sitemap: https://pescouncil.in/sitemap.xml
`;
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
fs.writeFileSync(robotsPath, robots, 'utf8');
console.log('Generated:', robotsPath);
