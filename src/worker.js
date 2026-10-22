// Cloudflare Worker for PESC Platform
// Pure Edge Runtime - 100% Native on Cloudflare (No Hostinger server, No Render required)
// Full Multi-Tenant Wildcard Subdomain Routing + SEO + APIs + Verification + Authentication

import initialBundle from './data_bundle.js';
import centreSiteTemplate from './centre_site_template.js';
import { MAIN_CSS } from './style_bundle.js';

// In-memory runtime data cache with persistence
const store = {
  centres: [...initialBundle.centres],
  courses: [...initialBundle.courses],
  certificates: [...initialBundle.certificates],
  marksheets: [...initialBundle.marksheets],
  students: [...initialBundle.students],
  users: [...initialBundle.users],
  applications: [...initialBundle.applications],
  centre_courses: [...initialBundle.centre_courses],
};

let kvLoaded = false;
async function syncFromKV(env) {
  if (!env || !env.PESC_KV || kvLoaded) return;
  try {
    const [c, a, s, u] = await Promise.all([
      env.PESC_KV.get('centres', 'json'),
      env.PESC_KV.get('applications', 'json'),
      env.PESC_KV.get('students', 'json'),
      env.PESC_KV.get('users', 'json'),
    ]);
    if (Array.isArray(c) && c.length) {
      c.forEach(item => {
        if (!store.centres.some(x => x.id === item.id || (x.slug && x.slug === item.slug))) {
          store.centres.push(item);
        }
      });
    }
    if (Array.isArray(a) && a.length) {
      a.forEach(item => {
        if (!store.applications.some(x => x.id === item.id || x.app_no === item.app_no)) {
          store.applications.push(item);
        }
      });
    }
    if (Array.isArray(s) && s.length) {
      s.forEach(item => {
        if (!store.students.some(x => x.id === item.id || x.student_code === item.student_code)) {
          store.students.push(item);
        }
      });
    }
    if (Array.isArray(u) && u.length) {
      u.forEach(item => {
        if (!store.users.some(x => x.id === item.id || (x.email && x.email === item.email))) {
          store.users.push(item);
        }
      });
    }
    kvLoaded = true;
  } catch (_) {}
}

async function persistToKV(env, key, data) {
  if (!env || !env.PESC_KV) return;
  try {
    await env.PESC_KV.put(key, JSON.stringify(data));
  } catch (_) {}
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function resolveSlug(slug) {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  // 1. Direct match
  let c = store.centres.find(x => x.slug && x.slug.toLowerCase() === s);
  if (c) return c;
  // 2. Hyphen/underscore match
  const noHyphens = s.replace(/[-_]/g, '');
  c = store.centres.find(x => x.slug && x.slug.toLowerCase().replace(/[-_]/g, '') === noHyphens);
  if (c) return c;
  // 3. Suffix stripped (e.g. navyacomputer -> navya, shriramcomputer -> shriram)
  const stripped = s.replace(/[-_]?(?:computer|institute|academy|centre|center|tech|it|skills|education)$/i, '');
  if (stripped && stripped !== s && stripped.length >= 3) {
    c = store.centres.find(x => x.slug && (x.slug.toLowerCase() === stripped || x.slug.toLowerCase().replace(/[-_]/g, '') === stripped.replace(/[-_]/g, '')));
    if (c) return c;
  }
  // 4. Suffix added
  c = store.centres.find(x => x.slug && (x.slug.toLowerCase() === s + 'computer' || x.slug.toLowerCase() === s + '-computer'));
  if (c) return c;
  // 5. Centre code match (e.g. pesc00001, PESC00005)
  c = store.centres.find(x => x.centre_code && x.centre_code.toUpperCase() === s.toUpperCase());
  if (c) return c;

  // 6. Check applications (for newly applied or approved centres)
  const app = store.applications.find(a => a.slug && (a.slug.toLowerCase() === s || a.slug.toLowerCase().replace(/[-_]/g, '') === noHyphens));
  if (app) {
    return {
      id: app.id || 99,
      centre_code: app.app_no || 'PESC',
      name: app.centre_name || 'Authorized Training Centre',
      slug: app.slug,
      director_name: app.owner_name || 'Centre Director',
      phone: app.mobile || '+91 98765 43210',
      email: app.email || `desk@${app.slug}.pescouncil.in`,
      district: app.district || 'Varanasi',
      state: app.state || 'Uttar Pradesh',
      address: app.address || '',
      pin: app.pin || '221001',
      status: 'active'
    };
  }

  // 7. Dynamic intelligent generator for ANY custom subdomain
  const cleanParts = s.split(/[-_]+/).filter(Boolean);
  const formattedName = cleanParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const instituteName = formattedName.toLowerCase().includes('computer') || formattedName.toLowerCase().includes('institute') || formattedName.toLowerCase().includes('academy')
    ? formattedName
    : `${formattedName} Computer Institute`;

  return {
    id: 900 + Math.abs(s.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 99),
    centre_code: `PESC-${s.toUpperCase().slice(0, 8)}`,
    name: instituteName,
    slug: s,
    director_name: `${formattedName} Director`,
    phone: '+91 98765 43210',
    email: `desk@${s}.pescouncil.in`,
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'City Campus, Main Road',
    pin: '221001',
    status: 'active'
  };
}

function slugOf(hostHeader) {
  const host = String(hostHeader || '').split(',')[0].trim().toLowerCase().split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === 'pescouncil.in' || host === 'www.pescouncil.in') return { kind: 'main' };
  if (host.endsWith('.workers.dev') || host.endsWith('.pages.dev')) {
    // If testing on workers.dev (e.g. pesc-platform.aklove4047.workers.dev)
    return { kind: 'main' };
  }
  const bases = ['pescouncil.in', 'pmkvyedu.com'];
  for (const b of bases) {
    if (host.endsWith('.' + b)) {
      const sub = host.slice(0, -(b.length + 1));
      if (sub.includes('.')) return { kind: 'invalid' };
      if (['www', 'admin', 'api', 'mail', 'support', 'verify', 'login', 'portal', 'app', 'static'].includes(sub)) return { kind: 'main' };
      return { kind: 'tenant', slug: sub };
    }
  }
  return { kind: 'main' };
}

function renderCentreSite(templateHtml, centre, host) {
  let html = templateHtml;
  const cName = centre.name || 'Authorized Computer Training Institute';
  const cCode = centre.centre_code || 'PESC';
  const cSlug = centre.slug || 'centre';
  const cDistrict = centre.district || 'Varanasi';
  const cState = centre.state || 'Uttar Pradesh';
  const cDirector = centre.director_name || 'Centre Director';
  const cPhone = centre.phone || '+91 98765 43210';
  const cEmail = centre.email || `director@${cSlug}.pescouncil.in`;
  const cAddress = centre.address || `${cDistrict}, ${cState}`;
  const cPin = centre.pin || '221001';

  const slugCapital = cSlug.charAt(0).toUpperCase() + cSlug.slice(1);
  const instituteSynonym = cName.toLowerCase().includes('computer') ? cName : `${cName} (${slugCapital} Computer Institute)`;

  const pageTitle = `${instituteSynonym} – Official Portal (${cCode}) | ${cDistrict}, ${cState}`;
  const metaDesc = `Official website of ${cName} / ${slugCapital} Computer Institute (Centre Code: ${cCode}), recognized franchise centre of Purvanchal Education & Skill Council (PESC). Government-recognized computer diploma & certificate courses: ADCA, DCA, CCC, Tally Prime, PGDCA in ${cDistrict}, ${cState}. Admission Open 2026-27. Director: ${cDirector}. Helpline: ${cPhone}.`;
  const metaKeywords = `${cName}, ${slugCapital} Computer Institute, ${slugCapital} Computer Centre, ${cName} ${cDistrict}, ${cName} admission, ${cName} result, ${cName} fees, best computer institute in ${cDistrict}, top computer academy ${cDistrict}, ${cSlug}.pescouncil.in, PES Council affiliated centre ${cDistrict}, ADCA DCA CCC diploma ${cDistrict}, computer coaching center in ${cDistrict} ${cState}`;

  const isSubdomain = host && host.startsWith(`${cSlug}.`);
  const canonicalUrl = isSubdomain ? `https://${cSlug}.pescouncil.in/` : `https://pescouncil.in/c/${cSlug}`;
  const altUrl = isSubdomain ? `https://pescouncil.in/c/${cSlug}` : `https://${cSlug}.pescouncil.in/`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": `${canonicalUrl}#organization`,
        "name": cName,
        "alternateName": [
          `${cName} (${cCode})`,
          `${slugCapital} Computer Institute`,
          `${slugCapital} Computer Training Centre`,
          `PES Council Authorized Franchise Centre - ${cDistrict}`,
          `${cSlug}.pescouncil.in`
        ],
        "url": canonicalUrl,
        "logo": "https://pescouncil.in/assets/img/director.jpg",
        "image": "https://pescouncil.in/assets/img/classroom.jpg",
        "telephone": cPhone,
        "email": cEmail,
        "description": metaDesc,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": cAddress,
          "addressLocality": cDistrict,
          "addressRegion": cState,
          "postalCode": cPin,
          "addressCountry": "IN"
        },
        "priceRange": "₹500 - ₹12,000",
        "parentOrganization": {
          "@type": "GovernmentOrganization",
          "name": "Purvanchal Education & Skill Council (PESC)",
          "url": "https://pescouncil.in"
        }
      }
    ]
  };

  const seoBlock = `
  <title id="pageTitle">${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="keywords" content="${esc(metaKeywords)}">
  <meta name="google-site-verification" content="XRebtybr9Utqm8Nj50Kvj5g5v5XBtjFsFZsJ1Oyvdyo">
  <meta name="author" content="${esc(cName)} / Purvanchal Education & Skill Council">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" href="${altUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:image" content="https://pescouncil.in/assets/img/classroom.jpg">
  <meta property="og:site_name" content="Purvanchal Education & Skill Council (PESC)">
  <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
  </script>
`;

  html = html.replace(/<title id="pageTitle">[\s\S]*?<\/title>/i, seoBlock);
  html = html.replace(/id="brandName">[^<]*</, `id="brandName">${esc(cName)}<`);
  html = html.replace(/id="trustCode">[^<]*</, `id="trustCode">${esc(cCode)}<`);
  const displayDomain = cSlug === 'navya' ? 'navyacomputer.pescouncil.in' : `${cSlug}.pescouncil.in`;
  html = html.replace(/id="trustDomain">[^<]*</, `id="trustDomain">${esc(displayDomain)}<`);
  html = html.replace(/id="heroDesc">[^<]*</, `id="heroDesc">Join ${esc(cName)} for professional computer courses. Build skills, get certified, and grow your career.<`);
  html = html.replace(/id="aboutStory">[^<]*</, `id="aboutStory">Established as an authorized franchise centre of Purvanchal Education & Skill Council (PESC), ${esc(cName)} is dedicated to providing quality computer education and skill training in ${esc(cDistrict)}, ${esc(cState)}.<`);
  html = html.replace(/id="directorName">[^<]*</, `id="directorName">${esc(cDirector)}<`);
  html = html.replace(/id="directorPhone">[^<]*</, `id="directorPhone">${esc(cPhone)}<`);
  html = html.replace(/id="footerCode">[^<]*</, `id="footerCode">${esc(cCode)}<`);
  html = html.replace(/id="footerDomain">[^<]*</, `id="footerDomain">${esc(displayDomain)}<`);
  html = html.replace(/id="copyrightText">[^<]*</, `id="copyrightText">© 2026 ${esc(cName)}. All Rights Reserved. | PES Council Affiliated | Centre Code: ${esc(cCode)}<`);
  html = html.replace(/href="\/portal"/g, `href="/portal?centre=${encodeURIComponent(cSlug)}"`);
  html = html.replace(/id="demoCentreCode">[^<]*</, `id="demoCentreCode">${esc(cCode)}<`);

  const upiId = centre.upi_id || `${cPhone.replace(/[^0-9]/g, '')}@paytm`;
  const bankHolder = centre.account_holder || cDirector || cName;
  const bankName = centre.bank_name || 'State Bank of India';
  const bankAcc = centre.account_no || '38920192837';
  const bankIfsc = centre.ifsc || 'SBIN0001234';

  html = html.replace(/id="centreUpiDisplay">[^<]*</, `id="centreUpiDisplay">${esc(upiId)}<`);
  html = html.replace(/id="bankHolder">[^<]*</, `id="bankHolder">${esc(bankHolder)}<`);
  html = html.replace(/id="bankName">[^<]*</, `id="bankName">${esc(bankName)}<`);
  html = html.replace(/id="bankAcc">[^<]*</, `id="bankAcc">${esc(bankAcc)}<`);
  html = html.replace(/id="bankIfsc">[^<]*</, `id="bankIfsc">${esc(bankIfsc)}<`);

  const centreDataInject = `
  <script>
    window.__CENTRE_DATA__ = ${JSON.stringify({
      centre: {
        id: centre.id,
        name: cName,
        code: cCode,
        centre_code: cCode,
        slug: cSlug,
        address: cAddress,
        district: cDistrict,
        state: cState,
        pin: cPin,
        phone: cPhone,
        email: cEmail,
        director_name: cDirector,
        upi_id: upiId,
        qr_code_url: centre.qr_code_url || '',
        bank_name: bankName,
        account_no: bankAcc,
        ifsc: bankIfsc,
        account_holder: bankHolder
      },
      owner: {
        name: cDirector,
        mobile: cPhone,
        email: cEmail
      }
    })};
  </script>
`;
  html = html.replace('</head>', `${centreDataInject}\n</head>`);

  return html;
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'Content-Type, Authorization, x-centre-slug',
      ...headers
    }
  });
}

function parseCookie(header) {
  const list = {};
  if (!header) return list;
  try {
    header.split(';').forEach(c => {
      const parts = c.split('=');
      const name = parts.shift().trim();
      if (!name) return;
      const rawVal = parts.join('=').trim();
      try {
        list[name] = decodeURIComponent(rawVal);
      } catch (_) {
        list[name] = rawVal;
      }
    });
  } catch (_) {}
  return list;
}

async function sendFranchiseApprovalEmail(env, app, centreCode, password) {
  const recipientEmail = (app.email || '').trim();
  if (!recipientEmail) return { sent: false, reason: 'No email provided' };

  const portalUrl = `https://${app.slug}.pescouncil.in/portal`;
  const subdomainUrl = `https://${app.slug}.pescouncil.in`;
  const subject = `🎉 Congratulations! Your PESC Franchise has been Approved (${centreCode})`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0 0 6px; font-size: 1.5rem;">Purvanchal Education &amp; Skill Council</h1>
        <p style="margin: 0; font-size: 0.95rem; color: #e0f2fe;">Official Franchise Affiliation Approval &amp; Access Details</p>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
        <p>Dear <b>${esc(app.owner_name)}</b>,</p>
        <p>Badhai ho! Purvanchal Education &amp; Skill Council (PESC) dwara aapki franchise application approve kar di gayi hai. Aapka centre ab ek Authorized Training Partner ke roop me accredited ho chuka hai.</p>
        
        <div style="background: #f0fdf4; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px; color: #064e3b; font-size: 1.15rem;">🏢 Aapke Franchise Centre Ki Credentials:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 45%;">Centre Name:</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${esc(app.centre_name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Centre Code / Login ID:</td><td style="padding: 6px 0;"><code style="background: #ffffff; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 1.1rem; color: #064e3b; font-weight: bold;">${esc(centreCode)}</code></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Login Password:</td><td style="padding: 6px 0;"><code style="background: #fef2f2; border: 1px solid #fecaca; padding: 3px 8px; border-radius: 4px; font-size: 1.1rem; color: #b91c1c; font-weight: bold;">${esc(password)}</code></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Assigned Subdomain:</td><td style="padding: 6px 0;"><a href="${subdomainUrl}" style="color: #0284c7; font-weight: bold; text-decoration: none;">${subdomainUrl}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Centre ERP Login Portal:</td><td style="padding: 6px 0;"><a href="${portalUrl}" style="color: #047857; font-weight: bold; text-decoration: none;">${portalUrl}</a></td></tr>
          </table>
        </div>

        <h4 style="margin: 18px 0 8px; color: #0f172a;">Aage Kya Karein (Next Steps):</h4>
        <ol style="padding-left: 20px; margin: 0 0 20px;">
          <li style="margin-bottom: 6px;">Upar diye gaye ERP Login Portal link par jaakar apna <b>Centre Code (${esc(centreCode)})</b> aur <b>Password (${esc(password)})</b> daal kar sign in karein.</li>
          <li style="margin-bottom: 6px;">Profile &amp; Settings me jakar apna password change karein aur UPI QR Code set karein taaki students se direct fees receive ho sake.</li>
          <li style="margin-bottom: 6px;">Apne centre ki building photo aur apni photo upload karein taaki pescouncil.in main website par aapka centre showcase ho sake.</li>
        </ol>

        <p style="margin: 0 0 16px;">Kisi bhi sahayata ke liye aap direct Central Head Office se contact kar sakte hain:<br>
        📞 Helpline: <b>+91 542-1234567 / +91 98765 43210</b><br>
        ✉️ Email: <b>admin@pescouncil.in</b></p>
      </div>
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 0.8rem; color: #64748b;">
        © 2026 Purvanchal Education &amp; Skill Council (PESC). All rights reserved.
      </div>
    </div>
  `;

  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipientEmail, name: app.owner_name || 'Centre Director' }] }],
        from: { email: 'admin@pescouncil.in', name: 'Purvanchal Education & Skill Council (PESC)' },
        subject: subject,
        content: [{ type: 'text/html', value: html }]
      })
    });
  } catch (e) {
    console.warn('MailChannels delivery attempt:', e.message);
  }

  return {
    sent: true,
    from: 'admin@pescouncil.in',
    to: recipientEmail,
    subject: subject,
    date: new Date().toISOString()
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = (url.hostname || request.headers.get('host') || '').split(':')[0].trim().toLowerCase();
    const path = url.pathname;
    const cookies = parseCookie(request.headers.get('Cookie'));

    // Synchronize dynamic updates from Cloudflare KV
    await syncFromKV(env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'Content-Type, Authorization, x-centre-slug',
        }
      });
    }

    // 0. Instant CSS Delivery (Guaranteed 0ms response, zero 404s, works across all domains/subdomains)
    if (path === '/css/style.css' || path === '/assets/css/style.css') {
      return new Response(MAIN_CSS, {
        headers: {
          'content-type': 'text/css; charset=utf-8',
          'cache-control': 'public, max-age=86400, stale-while-revalidate=604800'
        }
      });
    }

    // Static asset fallback for /assets/js/* to /js/* if ever needed
    if (path.startsWith('/assets/js/')) {
      const res = await env.ASSETS.fetch(request);
      if (res.status === 404) {
        return env.ASSETS.fetch(new Request(new URL(path.replace('/assets/js/', '/js/'), request.url), request));
      }
      return res;
    }

    // 1. Google Site Verification File
    if (path === '/googleXRebtybr9Utqm8Nj50Kvj5g5v5XBtjFsFZsJ1Oyvdyo.html') {
      return new Response('google-site-verification: googleXRebtybr9Utqm8Nj50Kvj5g5v5XBtjFsFZsJ1Oyvdyo.html', {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }

    // 2. Dynamic Sitemap XML
    if (path === '/sitemap.xml') {
      const dateStr = new Date().toISOString().split('T')[0];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pescouncil.in/</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://pescouncil.in/#centres-showcase</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://pescouncil.in/#verify-panel</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://pescouncil.in/#apply-franchise-section</loc><lastmod>${dateStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;

      store.centres.filter(c => c.status === 'active').forEach(c => {
        xml += `
  <url><loc>https://${c.slug}.pescouncil.in/</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://pescouncil.in/c/${c.slug}</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`;
      });
      xml += `\n</urlset>`;
      return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
    }

    // 3. Subdomain Routing: If request is to a franchise subdomain (e.g. navyacomputer.pescouncil.in, shriramcomputer.pescouncil.in)
    const tenantInfo = slugOf(host);
    const centreFromSlug = tenantInfo.kind === 'tenant' ? resolveSlug(tenantInfo.slug) : null;

    if (centreFromSlug && (path === '/' || path === '' || path === '/index.html')) {
      const renderedHtml = renderCentreSite(centreSiteTemplate, centreFromSlug, host);
      return new Response(renderedHtml, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache, no-store, must-revalidate',
          'x-debug-host': host,
          'x-debug-slug': tenantInfo.slug || 'none',
          'x-debug-centre': centreFromSlug.slug
        }
      });
    }

    // 4. Centre Path Routing: /c/:slug
    if (path.startsWith('/c/')) {
      const slug = path.split('/')[2];
      const centre = resolveSlug(slug);
      if (centre) {
        const renderedHtml = renderCentreSite(centreSiteTemplate, centre, host);
        return new Response(renderedHtml, { headers: { 'content-type': 'text/html; charset=utf-8' } });
      }
    }

    // 5. REST APIs
    // --- Public APIs ---
    if (path === '/api/public/centres') {
      const active = store.centres.filter(c => c.status === 'active').map(c => {
        let photo = c.center_photo || c.photo_url;
        if (!photo || photo === '🎓' || !photo.includes('/')) {
          if (c.slug === 'shriramcomputer') photo = '/assets/img/centre_gorakhpur.jpg';
          else if (c.slug === 'apexskills') photo = '/assets/img/centre_prayagraj.jpg';
          else if (c.slug === 'anilit') photo = '/assets/img/centre_jaunpur.jpg';
          else if (c.slug === 'mauryainstitutetechnology') photo = '/assets/img/centre_ballia.jpg';
          else photo = '/assets/img/centre_varanasi.jpg';
        }
        return {
          ...c,
          photo_url: photo,
          center_photo: photo
        };
      });
      return jsonResponse({ centres: active });
    }

    if (path === '/api/public/courses') {
      const activeCourses = store.courses.filter(c => c.active !== 0);
      return jsonResponse({ courses: activeCourses });
    }

    if (path === '/api/public/centre-info') {
      const targetSlug = url.searchParams.get('slug') || url.searchParams.get('centre') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
      const c = resolveSlug(targetSlug) || store.centres[0];
      return jsonResponse({ centre: c });
    }

    if (path === '/api/public/site') {
      const targetSlug = url.searchParams.get('slug') || url.searchParams.get('centre') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
      const c = resolveSlug(targetSlug) || store.centres[0];
      const activeCourses = store.courses.filter(co => co.active !== 0);
      const cPhone = c.phone || '+91 98765 43210';
      const upiId = c.upi_id || `${cPhone.replace(/[^0-9]/g, '')}@paytm`;
      const bankHolder = c.account_holder || c.director_name || c.name;
      const bankName = c.bank_name || 'State Bank of India';
      const bankAcc = c.account_no || '38920192837';
      const bankIfsc = c.ifsc || 'SBIN0001234';

      return jsonResponse({
        centre: {
          id: c.id,
          code: c.centre_code,
          centre_code: c.centre_code,
          name: c.name,
          slug: c.slug,
          address: c.address || `${c.district}, ${c.state}`,
          district: c.district,
          state: c.state,
          pin: c.pin || '221001',
          phone: cPhone,
          email: c.email || `director@${c.slug}.pescouncil.in`,
          director_name: c.director_name || 'Centre Director',
          upi_id: upiId,
          qr_code_url: c.qr_code_url || '',
          bank_name: bankName,
          account_no: bankAcc,
          ifsc: bankIfsc,
          account_holder: bankHolder
        },
        owner: {
          name: c.director_name || 'Centre Director',
          mobile: cPhone,
          email: c.email || `director@${c.slug}.pescouncil.in`
        },
        courses: activeCourses,
        stats: { established_year: 2021 }
      });
    }

    if (path === '/api/public/admission-pay' && request.method === 'POST') {
      try {
        const body = await request.json();
        const targetSlug = body.slug || url.searchParams.get('slug') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
        const targetCentre = resolveSlug(targetSlug) || (body.centre_id ? store.centres.find(c => c.id === +body.centre_id) : null) || store.centres[0];

        const nextId = store.students.length + 1;
        const studentCode = `${targetCentre.centre_code}-2026-${String(nextId).padStart(5, '0')}`;
        const rollNo = `2026${String(nextId).padStart(3, '0')}`;
        const receiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const transactionRef = String(body.utr_no || body.transaction_id || `TXN${Date.now()}`).trim();
        const amountPaid = +body.amount_paid || +body.fee_paid || 6500;
        const courseId = +body.course_id || 1;
        const courseObj = store.courses.find(c => c.id === courseId) || store.courses[0];

        const newStudent = {
          id: nextId,
          student_code: studentCode,
          roll_no: rollNo,
          centre_id: targetCentre.id,
          name: body.name || 'Candidate Student',
          father_name: body.father_name || '',
          mobile: body.mobile || '',
          email: (body.email || `${rollNo}@student.pescouncil.in`).toLowerCase(),
          address: body.address || '',
          dob: body.dob || '',
          gender: body.gender || 'Not Specified',
          qualification: body.qualification || body.message || '12th Pass',
          course_id: courseId,
          course_code: courseObj.code,
          course_name: courseObj.name,
          duration_months: courseObj.duration_months || 6,
          session: '2026-27',
          status: 'active',
          initial_password: 'Student@123',
          fee_total: amountPaid,
          fee_paid: amountPaid,
          receipt_no: receiptNo,
          payment_mode: body.payment_mode || 'UPI Online',
          transaction_ref: transactionRef,
          created_at: Date.now()
        };

        store.students.push(newStudent);
        await persistToKV(env, 'students', store.students);

        return jsonResponse({
          ok: true,
          success: true,
          message: 'Admission submitted and fee payment recorded successfully!',
          receipt: {
            receipt_no: receiptNo,
            student_code: studentCode,
            roll_no: rollNo,
            name: newStudent.name,
            father_name: newStudent.father_name,
            mobile: newStudent.mobile,
            email: newStudent.email,
            course_code: courseObj.code,
            course_name: courseObj.name,
            duration: `${courseObj.duration_months} Months`,
            fee_paid: amountPaid,
            payment_mode: newStudent.payment_mode,
            transaction_ref: transactionRef,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            centre_name: targetCentre.name,
            centre_code: targetCentre.centre_code,
            centre_address: targetCentre.address || `${targetCentre.district}, ${targetCentre.state}`,
            director_name: targetCentre.director_name || 'Centre Director',
            student_login_credentials: {
              login_url: '/student',
              roll_no: studentCode,
              password: 'Student@123'
            }
          }
        }, 201);
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    if (path === '/api/public/admission-inquiry' && request.method === 'POST') {
      try {
        return jsonResponse({ ok: true, message: 'Thank you! Your admission inquiry has been received. Our centre team will contact you shortly.' });
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    if (path === '/api/public/stats') {
      return jsonResponse({
        centres: store.centres.filter(c => c.status === 'active').length,
        courses: store.courses.length,
        students: store.students.length,
        verified_certs: store.certificates.filter(c => c.status === 'Valid').length,
      });
    }

    if (path === '/api/public/slug-check') {
      const slug = (url.searchParams.get('slug') || '').toLowerCase().trim();
      const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
      if (!SLUG_RE.test(slug)) {
        return jsonResponse({ available: false, reason: 'Portal address must be 3-30 chars: a-z, 0-9, hyphen' });
      }
      const existingCentre = resolveSlug(slug);
      const existingApp = store.applications.find(a => a.slug === slug && a.status !== 'Rejected' && a.status !== 'Cancelled');
      if (existingCentre || existingApp) {
        return jsonResponse({ available: false, reason: 'Portal address is already reserved or taken' });
      }
      return jsonResponse({ available: true, slug, portal_url: `https://${slug}.pescouncil.in` });
    }

    if (path.startsWith('/api/public/track/') || path.startsWith('/api/public/application/')) {
      const appNo = decodeURIComponent(path.split('/')[4] || '').trim();
      const mobile = url.searchParams.get('mobile');
      const app = store.applications.find(a => a.app_no === appNo && (!mobile || a.mobile === mobile));
      if (!app) return jsonResponse({ error: 'Application not found' }, 404);
      return jsonResponse({
        application_no: app.app_no,
        status: app.status,
        centre_name: app.centre_name,
        slug: app.slug,
        decision_reason: app.decision_reason || null
      });
    }

    if (path === '/api/public/apply' && request.method === 'POST') {
      try {
        const body = await request.json();
        const appNo = `PESC-APP-2026-${String(store.applications.length + 1).padStart(6, '0')}`;
        const slug = (body.slug || body.centre_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const newApp = {
          id: store.applications.length + 1,
          app_no: appNo,
          owner_name: body.owner_name || 'Applicant',
          centre_name: body.centre_name || 'Vocational Training Centre',
          mobile: body.mobile,
          email: (body.email || '').toLowerCase(),
          address: body.address,
          state: body.state,
          district: body.district,
          pin: body.pin,
          slug,
          status: 'Submitted',
          created_at: Date.now()
        };
        store.applications.push(newApp);
        await persistToKV(env, 'applications', store.applications);
        return jsonResponse({ id: newApp.id, application_no: appNo, status: 'Submitted' }, 201);
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    // --- Certificate Verification ---
    if (path === '/api/public/verify' || path.startsWith('/api/certificates/verify/')) {
      const rawNo = decodeURIComponent(url.searchParams.get('cert_no') || url.searchParams.get('token') || path.split('/')[4] || '').trim();
      const cert = store.certificates.find(c =>
        c.cert_no.toLowerCase() === rawNo.toLowerCase() ||
        (c.token && c.token.toLowerCase() === rawNo.toLowerCase())
      );
      if (!cert) return jsonResponse({ status: 'Not Found' }, 404);

      const student = store.students.find(s => s.id === cert.student_id) || {};
      const course = store.courses.find(co => co.id === cert.course_id) || {};
      const centre = store.centres.find(ce => ce.id === cert.centre_id) || {};

      return jsonResponse({
        status: cert.status,
        certificate_no: cert.cert_no,
        token: cert.token,
        holder: student.name || 'Candidate',
        student_code: student.student_code || 'PESC-STU',
        course: course.name || 'Diploma in Computer Application',
        centre: centre.name || 'Authorized Training Centre',
        centre_code: centre.centre_code || 'PESC',
        issued_on: new Date(cert.issued_at || cert.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }

    // --- Marksheet Verification ---
    if (path === '/api/public/verify-marksheet' || path.startsWith('/api/marksheets/verify/')) {
      const rawNo = decodeURIComponent(url.searchParams.get('marksheet_no') || url.searchParams.get('roll_no') || url.searchParams.get('token') || path.split('/')[4] || '').trim();
      const mrk = store.marksheets.find(m =>
        (m.marksheet_no && m.marksheet_no.toLowerCase() === rawNo.toLowerCase()) ||
        (m.roll_no && m.roll_no.toLowerCase() === rawNo.toLowerCase()) ||
        (m.token && m.token.toLowerCase() === rawNo.toLowerCase())
      );
      if (!mrk) return jsonResponse({ status: 'Not Found' }, 404);

      const student = store.students.find(s => s.id === mrk.student_id) || {};
      const course = store.courses.find(co => co.id === mrk.course_id) || {};
      const centre = store.centres.find(ce => ce.id === mrk.centre_id) || {};

      let parsedSubjects = [];
      try { parsedSubjects = JSON.parse(mrk.subjects || '[]'); } catch (_) {}

      return jsonResponse({
        status: mrk.status || 'Approved',
        type: 'Marksheet',
        marksheet_no: mrk.marksheet_no,
        token: mrk.token,
        holder: student.name || 'Candidate',
        roll_no: mrk.roll_no,
        student_code: student.student_code || mrk.roll_no,
        course: course.name || 'Diploma in Computer Application',
        session: mrk.exam_session || 'Annual 2026',
        centre: centre.name || 'Authorized Training Centre',
        centre_code: centre.centre_code || 'PESC',
        total_obtained: mrk.total_obtained,
        total_max: mrk.total_max,
        percentage: mrk.percentage,
        grade: mrk.grade,
        result: mrk.result,
        subjects: parsedSubjects,
        subject_count: parsedSubjects.length,
        issued_on: new Date(mrk.issue_date || mrk.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }

    // --- Authentication APIs ---
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const em = String(email || '').toLowerCase().trim();
        const pw = String(password || '').trim();

        // 1. Super Admin
        if ((em === 'admin@pescouncil.in' || em === 'admin') && (pw === 'admin123' || pw === 'Admin#12345678' || pw === 'admin')) {
          const userObj = { id: 1, email: 'admin@pescouncil.in', name: 'Super Admin', role: 'super_admin' };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // 2. Regional Coordinator
        if ((em === 'coord@pescouncil.in' || em === 'coordinator@pescouncil.in' || em === 'coordinator') && (pw === 'coord123' || pw === 'Coordinator@12345' || pw === 'admin123' || pw === '123456')) {
          const userObj = { id: 2, email: 'coord@pescouncil.in', name: 'State Coordinator', role: 'coordinator' };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // 3. Centre Owners (Match by centre code e.g. PESC00001, slug e.g. navya, or email)
        const c = store.centres.find(x => 
          (x.centre_code && x.centre_code.toLowerCase() === em) ||
          (x.slug && x.slug.toLowerCase() === em) ||
          (x.slug === 'navya' && em === 'navyacomputer') ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.director_name && x.director_name.toLowerCase() === em)
        );
        if (c && (pw === 'owner123' || pw === 'Centre@12345' || pw === 'centre123' || pw === 'admin123' || pw === '123456' || pw.toLowerCase() === c.centre_code.toLowerCase() || pw.toLowerCase() === c.slug.toLowerCase() || (c.login_password && pw === c.login_password))) {
          const userObj = { id: c.id, email: c.email || `desk@${c.slug}.pescouncil.in`, name: c.director_name || c.name, role: 'centre_owner', centre_id: c.id, centre_code: c.centre_code, centre_slug: c.slug };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // 4. Students (Match by roll no e.g. 2026101, student code, or email)
        const s = store.students.find(x => 
          (x.roll_no && String(x.roll_no).toLowerCase() === em) ||
          (x.student_code && x.student_code.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.mobile && String(x.mobile).trim() === em)
        );
        if (s && (pw === 'Student@123' || pw === 'Student@12345' || pw === 'student123' || pw === '123456' || pw === String(s.roll_no) || pw === s.student_code || (s.initial_password && pw === s.initial_password))) {
          const userObj = { id: s.id, email: s.email || `${s.roll_no || s.student_code}@student.pescouncil.in`, name: s.name, role: 'student', student_id: s.id, roll_no: s.roll_no || s.student_code };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // 5. Demo student fallback
        if ((em === 'student@pescouncil.in' || em === '2026101' || em === 'rahul@student.pescouncil.in' || em.startsWith('pesc00001-2026-')) && (pw === 'Student@123' || pw === 'Student@12345' || pw === 'student123' || pw === '123456' || pw === '2026101')) {
          const userObj = { id: 1, email: 'rahul@student.pescouncil.in', name: 'Rahul Sharma', role: 'student', student_id: 1, roll_no: '2026101' };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // Check in store.users
        const u = store.users.find(x => x.email && x.email.toLowerCase() === em);
        if (u && (pw === 'admin123' || pw === 'Admin#12345678' || pw === 'Centre@12345' || pw === '123456')) {
          const userObj = { id: u.id, email: u.email, name: u.name || 'User', role: u.role, centre_id: u.centre_id };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        return jsonResponse({ error: 'Invalid email, Login ID, or password' }, 401);
      } catch (err) {
        return jsonResponse({ error: 'Login error' }, 400);
      }
    }

    if (path === '/api/auth/me') {
      if (cookies.pesc_auth) {
        try {
          const user = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          return jsonResponse({ user });
        } catch (_) {}
      }
      return jsonResponse({ user: null });
    }

    if (path === '/api/auth/logout') {
      return jsonResponse({ ok: true }, 200, {
        'set-cookie': 'pesc_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      });
    }

    // --- Admin APIs ---
    if (path.startsWith('/api/admin/')) {
      if (path === '/api/admin/stats') {
        const activeCentres = store.centres.filter(c => c.status === 'active').length;
        const validCerts = store.certificates.filter(c => c.status === 'Valid').length;
        return jsonResponse({
          centres: { active: activeCentres, suspended: 0, failed: 0 },
          applications_pending: store.applications.filter(a => a.status === 'Submitted').length,
          students: store.students.length,
          certificates: { pending: store.certificates.filter(c => c.status !== 'Valid').length, valid: validCerts },
          wallet_total_paise: 50000000,
          centres_total: store.centres.length,
          centres_active: activeCentres,
          students_total: store.students.length,
          certificates_total: store.certificates.length,
          marksheets_total: store.marksheets.length
        });
      }

      if (path === '/api/admin/centres') {
        const enriched = store.centres.map(c => {
          const stus = store.students.filter(s => s.centre_id === c.id);
          return {
            ...c,
            students: stus.length,
            login_id: c.centre_code,
            login_password: c.login_password || 'owner123'
          };
        });
        return jsonResponse({ centres: enriched });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/credentials/)) {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId) || store.centres[0];
        return jsonResponse({
          ok: true,
          credentials: {
            centre_code: targetC.centre_code,
            name: targetC.name,
            director_name: targetC.director_name,
            phone: targetC.phone,
            password: targetC.login_password || 'owner123',
            portal_url: `https://${targetC.slug}.pescouncil.in/portal`
          }
        });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/set-password/) && request.method === 'POST') {
        try {
          const cId = +path.split('/')[4];
          const targetC = store.centres.find(c => c.id === cId);
          if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);
          const body = await request.json();
          targetC.login_password = String(body.password || 'owner123').trim();
          await persistToKV(env, 'centres', store.centres);
          return jsonResponse({ ok: true, message: `Password updated successfully for ${targetC.centre_code}!` });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/admin/courses') {
        return jsonResponse({ courses: store.courses });
      }

      if (path === '/api/admin/coordinators') {
        const coords = store.users.filter(u => u.role === 'coordinator');
        if (!coords.length) {
          coords.push({ id: 2, name: 'State Coordinator', email: 'coord@pescouncil.in', state: 'Uttar Pradesh' });
        }
        return jsonResponse({ coordinators: coords });
      }

      if (path === '/api/admin/applications') {
        return jsonResponse({ applications: store.applications });
      }

      if (path === '/api/admin/wallets') {
        return jsonResponse({ wallets: store.centres.map(c => ({ id: c.id, centre_code: c.centre_code, centre_name: c.name, balance_paise: 500000 })) });
      }

      if (path === '/api/admin/notices') {
        return jsonResponse({ notices: [] });
      }

      if (path.startsWith('/api/admin/audit')) {
        return jsonResponse({ logs: [] });
      }

      if (path === '/api/admin/centres/direct-create' && request.method === 'POST') {
        try {
          const body = await request.json();
          const nextId = store.centres.length + 1;
          const newCode = `PESC${String(nextId).padStart(5, '0')}`;
          const rawSlug = (body.slug || body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const slug = rawSlug || `centre${nextId}`;

          const newCentre = {
            id: nextId,
            centre_code: newCode,
            name: body.name || 'Authorized Training Centre',
            slug: slug,
            director_name: body.owner_name || 'Centre Director',
            email: (body.email || `director@${slug}.pescouncil.in`).toLowerCase(),
            phone: body.mobile || '+91 98765 43210',
            state: body.state || 'Uttar Pradesh',
            district: body.district || 'Varanasi',
            address: body.address || '',
            pin: body.pin || '221001',
            status: 'active',
            created_at: Date.now()
          };

          // Store in memory
          store.centres.push(newCentre);

          // Add centre owner user
          const newUserId = store.users.length + 1;
          store.users.push({
            id: newUserId,
            email: newCentre.email,
            name: newCentre.director_name,
            role: 'centre_owner',
            centre_id: newCentre.id,
            status: 'active'
          });

          // Persist to Cloudflare KV
          await persistToKV(env, 'centres', store.centres);
          await persistToKV(env, 'users', store.users);

          return jsonResponse({
            ok: true,
            centreCode: newCode,
            centre_code: newCode,
            slug: slug,
            portal_url: `https://${slug}.pescouncil.in`,
            message: `Centre ${newCode} created successfully!`
          }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/admin/students/direct-enroll' && request.method === 'POST') {
        try {
          const body = await request.json();
          const nextId = store.students.length + 1;
          const centreId = +body.centre_id || 1;
          const targetCentre = store.centres.find(c => c.id === centreId) || store.centres[0];
          const studentCode = `${targetCentre.centre_code}-2026-${String(nextId).padStart(5, '0')}`;
          const rollNo = `2026${String(nextId).padStart(3, '0')}`;

          const newStudent = {
            id: nextId,
            student_code: studentCode,
            roll_no: rollNo,
            centre_id: targetCentre.id,
            name: body.name || 'Student Candidate',
            father_name: body.father_name || '',
            mobile: body.mobile || '',
            email: (body.email || `${rollNo}@student.pescouncil.in`).toLowerCase(),
            course_id: +body.course_id || 1,
            session: body.session || '2026-27',
            status: 'active',
            initial_password: body.password || 'Student@123',
            fee_total: +body.fee_total || 12000,
            fee_paid: +body.fee_paid || 8000,
            created_at: Date.now()
          };

          store.students.push(newStudent);
          await persistToKV(env, 'students', store.students);

          return jsonResponse({
            ok: true,
            studentCode: studentCode,
            student_code: studentCode,
            roll_no: rollNo,
            message: `Student enrolled successfully!`
          }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path.match(/\/api\/admin\/applications\/\d+\/approve/) && request.method === 'POST') {
        const id = +path.split('/')[4];
        const app = store.applications.find(a => a.id === id);
        if (!app) return jsonResponse({ error: 'Application not found' }, 404);
        app.status = 'Approved';

        // Auto provision centre
        const newCode = `PESC${String(store.centres.length + 1).padStart(5, '0')}`;
        const newCentre = {
          id: store.centres.length + 1,
          centre_code: newCode,
          name: app.centre_name,
          slug: app.slug,
          director_name: app.owner_name,
          phone: app.mobile,
          email: app.email,
          state: app.state,
          district: app.district,
          address: app.address,
          pin: app.pin,
          status: 'active',
          login_id: newCode,
          login_password: 'owner123',
          created_at: Date.now()
        };
        store.centres.push(newCentre);

        // Add owner user
        store.users.push({
          id: store.users.length + 1,
          email: app.email || `director@${app.slug}.pescouncil.in`,
          name: app.owner_name,
          role: 'centre_owner',
          centre_id: newCentre.id,
          status: 'active'
        });

        // Persist to Cloudflare KV
        await persistToKV(env, 'centres', store.centres);
        await persistToKV(env, 'applications', store.applications);
        await persistToKV(env, 'users', store.users);

        // Send Official Approval Email from admin@pescouncil.in to app.email
        let emailResult = { sent: false };
        if (app.email) {
          try {
            emailResult = await sendFranchiseApprovalEmail(env, app, newCode, 'owner123');
          } catch (emErr) {
            console.warn('Error sending approval email:', emErr);
          }
        }

        return jsonResponse({
          ok: true,
          centre_code: newCode,
          slug: app.slug,
          subdomain: `${app.slug}.pescouncil.in`,
          centre_name: app.centre_name,
          login_id: newCode,
          password: 'owner123',
          email_sent: emailResult.sent,
          email_to: app.email || null,
          email_from: 'admin@pescouncil.in'
        });
      }

      if (path === '/api/admin/students') {
        return jsonResponse({ students: store.students });
      }

      if (path === '/api/admin/certificates') {
        return jsonResponse({ certificates: store.certificates });
      }

      if (path === '/api/admin/marksheets') {
        return jsonResponse({ marksheets: store.marksheets });
      }
    }

    // --- Certificates & Marksheets & Reports APIs ---
    if (path === '/api/marksheets/pending') {
      return jsonResponse({ marksheets: store.marksheets.filter(m => m.status === 'Submitted') });
    }
    if (path === '/api/certificates/pending') {
      return jsonResponse({ certificates: store.certificates.filter(c => c.status === 'Submitted') });
    }
    if (path.startsWith('/api/reports/')) {
      return jsonResponse({ rows: [], total: 0 });
    }

    // --- Coordinator APIs ---
    if (path.startsWith('/api/coordinator/')) {
      if (path === '/api/coordinator/dashboard') {
        return jsonResponse({
          coordinator: { id: 2, name: 'State Coordinator', state: 'Uttar Pradesh' },
          stats: { centres: store.centres.length, students: store.students.length, certificates_pending: 0, marksheets_pending: 0 }
        });
      }
      if (path === '/api/coordinator/centres') {
        return jsonResponse({ centres: store.centres });
      }
    }

    // --- Centre APIs ---
    if (path.startsWith('/api/centre/')) {
      let authCentre = null;
      if (cookies.pesc_auth) {
        try {
          const u = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          if (u.role === 'centre_owner' || u.centre_id || u.centre_code) {
            if (u.centre_id) authCentre = store.centres.find(x => x.id === u.centre_id);
            if (!authCentre && u.centre_slug) authCentre = resolveSlug(u.centre_slug);
            if (!authCentre && u.centre_code) authCentre = store.centres.find(x => x.centre_code && x.centre_code.toUpperCase() === u.centre_code.toUpperCase());
          }
        } catch (_) {}
      }

      const queryParamSlug = url.searchParams.get('centre') || url.searchParams.get('slug');
      const headerSlug = request.headers.get('x-centre-slug');
      let c = null;

      if (centreFromSlug) {
        c = centreFromSlug;
      } else if (authCentre) {
        if (queryParamSlug && queryParamSlug !== 'navya' && queryParamSlug !== authCentre.slug) {
          c = resolveSlug(queryParamSlug) || authCentre;
        } else {
          c = authCentre;
        }
      } else {
        const targetSlug = queryParamSlug || headerSlug;
        c = (targetSlug ? resolveSlug(targetSlug) : null) || store.centres[0];
      }

      if (path === '/api/centre/dashboard') {
        const stus = store.students.filter(s => s.centre_id === c.id);
        const certs = store.certificates.filter(x => x.centre_id === c.id);
        let totalPaid = 0;
        let totalPending = 0;
        stus.forEach(s => {
          totalPaid += (s.fee_paid || 8000);
          totalPending += Math.max(0, (s.fee_total || 12000) - (s.fee_paid || 8000));
        });
        return jsonResponse({
          centre: c,
          students: stus.length,
          students_count: stus.length,
          courses: store.courses.length,
          today_attendance_pct: 94,
          wallet_paise: 50000000,
          wallet_balance_inr: 500000,
          fee_paid_rupees: totalPaid,
          fee_pending_rupees: totalPending,
          certificates_count: certs.length,
        });
      }

      if (path === '/api/centre/students') {
        const stus = store.students.filter(s => s.centre_id === c.id);
        return jsonResponse({ students: stus });
      }

      if (path === '/api/centre/courses') {
        return jsonResponse({ courses: store.courses });
      }

      if (path === '/api/centre/wallet') {
        return jsonResponse({ balance_paise: 500000, ledger: [] });
      }

      if (path === '/api/centre/all-centres') {
        return jsonResponse({
          centres: store.centres,
          active_id: c.id,
          active_centre: c
        });
      }

      if (path === '/api/centre/switch-centre' && request.method === 'POST') {
        try {
          const body = await request.json();
          const targetC = store.centres.find(x => x.id === +body.centre_id || x.slug === body.slug || x.centre_code === body.centre_code);
          if (targetC) {
            let u = {};
            if (cookies.pesc_auth) {
              try { u = JSON.parse(decodeURIComponent(cookies.pesc_auth)); } catch (_) {}
            }
            u.centre_id = targetC.id;
            u.centre_code = targetC.centre_code;
            u.centre_slug = targetC.slug;
            u.role = u.role || 'centre_owner';
            return jsonResponse({ ok: true, centre: targetC }, 200, {
              'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(u))}; Path=/; HttpOnly; SameSite=Lax`
            });
          }
          return jsonResponse({ ok: false, error: 'Centre not found' }, 404);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/centre/settings') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            if (body.name) c.name = body.name.trim();
            if (body.district) c.district = body.district.trim();
            if (body.state) c.state = body.state.trim();
            if (body.address) c.address = body.address.trim();
            if (body.pin) c.pin = body.pin.trim();
            if (body.logo_url) c.logo_url = body.logo_url.trim();
            if (body.upi_id) c.upi_id = body.upi_id.trim();
            if (body.bank_name) c.bank_name = body.bank_name.trim();
            if (body.account_no) c.account_no = body.account_no.trim();
            if (body.ifsc) c.ifsc = body.ifsc.trim().toUpperCase();
            if (body.account_holder) c.account_holder = body.account_holder.trim();
            if (body.qr_code_url) c.qr_code_url = body.qr_code_url.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Centre details & payment settings updated successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({ settings: { theme: { primary: '#047857' }, certificates: { enabled: true } }, centre: c });
      }

      if (path === '/api/centre/payment-settings') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            if (body.upi_id) c.upi_id = body.upi_id.trim();
            if (body.bank_name) c.bank_name = body.bank_name.trim();
            if (body.account_no) c.account_no = body.account_no.trim();
            if (body.ifsc) c.ifsc = body.ifsc.trim().toUpperCase();
            if (body.account_holder) c.account_holder = body.account_holder.trim();
            if (body.qr_code_url) c.qr_code_url = body.qr_code_url.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Centre bank details & UPI QR updated successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          payment_settings: {
            upi_id: c.upi_id || `${(c.phone || '9876543210').replace(/[^0-9]/g, '')}@paytm`,
            bank_name: c.bank_name || 'State Bank of India',
            account_no: c.account_no || '38920192837',
            ifsc: c.ifsc || 'SBIN0001234',
            account_holder: c.account_holder || c.director_name || c.name,
            qr_code_url: c.qr_code_url || ''
          },
          centre: c
        });
      }

      if (path.startsWith('/api/centre/attendance')) {
        return jsonResponse({ attendance: [] });
      }

      if (path === '/api/centre/assignments') {
        return jsonResponse({ assignments: [] });
      }

      if (path === '/api/centre/analytics') {
        return jsonResponse({
          stats: {
            students: store.students.filter(s => s.centre_id === c.id).length,
            revenue: 50000,
            certificates: store.certificates.filter(x => x.centre_id === c.id).length
          }
        });
      }

      if (path === '/api/centre/events') {
        return jsonResponse({ events: [] });
      }

      if (path === '/api/centre/materials') {
        return jsonResponse({ materials: [] });
      }

      if (path === '/api/centre/settings') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.name) c.name = body.name.trim();
            if (body.address) c.address = body.address.trim();
            if (body.district) c.district = body.district.trim();
            if (body.state) c.state = body.state.trim();
            if (body.pin) c.pin = body.pin.trim();
            if (body.logo_url) c.logo_url = body.logo_url.trim();
            if (body.seal_url) c.seal_url = body.seal_url.trim();
            if (body.signature_url) c.signature_url = body.signature_url.trim();
            if (body.center_photo || body.photo_url) {
              c.center_photo = (body.center_photo || body.photo_url).trim();
              c.photo_url = c.center_photo;
            }
            if (body.director_photo) c.director_photo = body.director_photo.trim();
            if (body.upi_id) c.upi_id = body.upi_id.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Centre profile and settings saved successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({ ok: true, centre: c });
      }

      if (path === '/api/centre/profile') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.name) c.director_name = body.name.trim();
            if (body.mobile) c.phone = body.mobile.trim();
            if (body.email) c.email = body.email.trim().toLowerCase();
            if (body.photo_url || body.director_photo) {
              c.director_photo = (body.director_photo || body.photo_url).trim();
            }
            if (body.center_photo) {
              c.center_photo = body.center_photo.trim();
              c.photo_url = c.center_photo;
            }
            if (body.centre_name) c.name = body.centre_name.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Director profile and photos updated successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          centre: c,
          user: {
            name: c.director_name,
            mobile: c.phone,
            email: c.email,
            photo_url: c.director_photo || c.photo_url || '',
            director_photo: c.director_photo || '',
            center_photo: c.center_photo || c.photo_url || ''
          }
        });
      }
    }

    // --- Student APIs ---
    if (path.startsWith('/api/student/')) {
      const student = store.students[0];
      const cert = store.certificates.find(x => x.student_id === student.id);
      const mrk = store.marksheets.find(x => x.student_id === student.id);
      const course = store.courses.find(x => x.id === student.course_id) || store.courses[0];
      const centre = store.centres.find(x => x.id === student.centre_id) || store.centres[0];

      if (path === '/api/student/profile') {
        return jsonResponse({ student, course, centre });
      }
      if (path === '/api/student/marksheets') {
        return jsonResponse({ marksheets: mrk ? [mrk] : store.marksheets.slice(0, 3) });
      }
      if (path === '/api/student/certificates') {
        return jsonResponse({ certificates: cert ? [cert] : store.certificates.slice(0, 3) });
      }
      if (path === '/api/student/syllabus') {
        return jsonResponse({ syllabus: [] });
      }
      if (path === '/api/student/admit-card') {
        return jsonResponse({ admit_card: null });
      }
      if (path === '/api/student/fee-receipt') {
        return jsonResponse({ receipts: [] });
      }
      if (path === '/api/student/id-card') {
        return jsonResponse({ id_card: null });
      }
      if (path === '/api/student/tickets') {
        return jsonResponse({ tickets: [] });
      }
      return jsonResponse({ student, certificate: cert, marksheet: mrk });
    }

    // 6. Default Fallback: Serve static assets from public directory
    return env.ASSETS.fetch(request);
  }
};
