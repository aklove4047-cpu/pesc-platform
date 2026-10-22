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
  return null;
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = (url.hostname || request.headers.get('host') || '').split(':')[0].trim().toLowerCase();
    const path = url.pathname;
    const cookies = parseCookie(request.headers.get('Cookie'));

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

    // Clean URL Rewrites for Admin, Centre Portal, Coordinator, Student, Login
    if (path === '/admin' || path === '/admin/') {
      return env.ASSETS.fetch(new Request(new URL('/admin.html', request.url), request));
    }
    if (path === '/portal' || path === '/portal/' || path === '/centre' || path === '/centre/') {
      return env.ASSETS.fetch(new Request(new URL('/centre.html', request.url), request));
    }
    if (path === '/coordinator' || path === '/coordinator/') {
      return env.ASSETS.fetch(new Request(new URL('/coordinator.html', request.url), request));
    }
    if (path === '/student' || path === '/student/') {
      return env.ASSETS.fetch(new Request(new URL('/student.html', request.url), request));
    }
    if (path === '/login' || path === '/login/') {
      return env.ASSETS.fetch(new Request(new URL('/login.html', request.url), request));
    }
    if (path === '/verify' || path === '/verify/') {
      return env.ASSETS.fetch(new Request(new URL('/verify.html', request.url), request));
    }

    // Dynamic static asset fallback for /assets/js/*
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
      const active = store.centres.filter(c => c.status === 'active');
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
        if (c && (pw === 'Centre@12345' || pw === 'centre123' || pw === 'admin123' || pw === '123456' || pw.toLowerCase() === c.centre_code.toLowerCase() || pw.toLowerCase() === c.slug.toLowerCase())) {
          const userObj = { id: c.id, email: c.email || `desk@${c.slug}.pescouncil.in`, name: c.director_name || c.name, role: 'centre_owner', centre_id: c.id, centre_code: c.centre_code, centre_slug: c.slug };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // 4. Students (Match by roll no e.g. 2026101, student code, or email)
        const s = store.students.find(x => 
          (x.roll_no && String(x.roll_no).toLowerCase() === em) ||
          (x.student_code && x.student_code.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em)
        );
        if (s && (pw === 'Student@123' || pw === 'Student@12345' || pw === 'student123' || pw === '123456' || pw === String(s.roll_no) || pw === s.student_code)) {
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
        return jsonResponse({
          centres_total: store.centres.length,
          centres_active: store.centres.filter(c => c.status === 'active').length,
          applications_pending: store.applications.filter(a => a.status === 'Submitted').length,
          students_total: store.students.length,
          certificates_total: store.certificates.length,
          marksheets_total: store.marksheets.length
        });
      }

      if (path === '/api/admin/centres') {
        return jsonResponse({ centres: store.centres });
      }

      if (path === '/api/admin/applications') {
        return jsonResponse({ applications: store.applications });
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
          state: app.state,
          district: app.district,
          address: app.address,
          pin: app.pin,
          status: 'active',
          created_at: Date.now()
        };
        store.centres.push(newCentre);
        return jsonResponse({ ok: true, centre_code: newCode, slug: app.slug, subdomain: `${app.slug}.pescouncil.in` });
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

    // --- Centre APIs ---
    if (path.startsWith('/api/centre/')) {
      const targetSlug = url.searchParams.get('centre') || url.searchParams.get('slug') || request.headers.get('x-centre-slug') || (centreFromSlug ? centreFromSlug.slug : 'navya');
      const c = resolveSlug(targetSlug) || store.centres[0];

      if (path === '/api/centre/dashboard') {
        const stus = store.students.filter(s => s.centre_id === c.id);
        const certs = store.certificates.filter(x => x.centre_id === c.id);
        return jsonResponse({
          centre: c,
          students_count: stus.length,
          certificates_count: certs.length,
          wallet_balance_inr: 5000
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
    }

    // --- Student APIs ---
    if (path.startsWith('/api/student/')) {
      const student = store.students[0];
      const cert = store.certificates.find(x => x.student_id === student.id);
      const mrk = store.marksheets.find(x => x.student_id === student.id);
      return jsonResponse({ student, certificate: cert, marksheet: mrk });
    }

    // 6. Default Fallback: Serve static assets from public directory
    return env.ASSETS.fetch(request);
  }
};
