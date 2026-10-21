async function test() {
  const res = await fetch('https://pescouncil.in/c/navya');
  const html = await res.text();
  console.log('Status of /c/navya:', res.status);
  console.log('HTML length:', html.length);
  
  // Extract CSS, JS, Image links
  const regex = /(?:src|href)="(\/[^"#?]+)/g;
  let m;
  const assets = new Set();
  while ((m = regex.exec(html)) !== null) {
    if (m[1].startsWith('/assets/') || m[1].startsWith('/css/') || m[1].startsWith('/js/')) {
      assets.add(m[1]);
    }
  }
  for (const a of assets) {
    try {
      const r = await fetch('https://pescouncil.in' + a);
      console.log(a, '=>', r.status);
    } catch(e) {
      console.log(a, '=> ERROR:', e.message);
    }
  }

  // Also check public API used by centre page
  const apiRes = await fetch('https://pescouncil.in/api/public/site');
  console.log('/api/public/site =>', apiRes.status);
  const centresRes = await fetch('https://pescouncil.in/api/public/centres');
  console.log('/api/public/centres =>', centresRes.status);
}

test();
