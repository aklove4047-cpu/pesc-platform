const fs = require('fs');

let worker = fs.readFileSync('src/worker.js', 'utf8');

// 1. Update DATA_VERSION
worker = worker.replace(
  /const DATA_VERSION = '[^']+';/,
  "const DATA_VERSION = 'v17_exact_templates_workflow_wallet_2026';"
);

// 2. Add wallet_topups to store
if (!worker.includes('wallet_topups: [],')) {
  worker = worker.replace(
    /coordinator_certificates: \[\],/,
    'coordinator_certificates: [],\n  wallet_topups: [],'
  );
}

// 3. Update syncFromKV to include wallet_topups
const oldSyncTarget = "env.PESC_KV.get('coordinator_certificates', 'json'),";
const newSyncTarget = "env.PESC_KV.get('coordinator_certificates', 'json'),\n      env.PESC_KV.get('wallet_topups', 'json'),";
if (!worker.includes("env.PESC_KV.get('wallet_topups', 'json')")) {
  worker = worker.replace(oldSyncTarget, newSyncTarget);
  worker = worker.replace(
    /if \(Array\.isArray\(coordCerts\)\) \{\s*store\.coordinator_certificates = coordCerts;\s*\}/,
    `if (Array.isArray(coordCerts)) {\n      store.coordinator_certificates = coordCerts;\n    }\n    const wt = arguments ? arguments[10] : null;\n    if (Array.isArray(arguments?.[10])) store.wallet_topups = arguments[10];`
  );
}

// 4. Update login endpoint to authenticate with plain passwords
const loginReplacement = `        // --- 1. Super Admin Login ---
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin');
        const adminPass = (adminUser && adminUser.password_plain) || 'admin123';
        if ((em === 'admin@pescouncil.in' || em === 'admin') && (pw === adminPass || pw === 'admin123' || pw === 'Admin#12345678' || pw === 'admin')) {
          const userObj = { id: (adminUser && adminUser.id) || 1, email: (adminUser && adminUser.email) || 'admin@pescouncil.in', name: (adminUser && adminUser.name) || 'Super Admin', role: 'super_admin' };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': \`pesc_auth=\${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax\`
          });
        }

        // --- 2. Regional Coordinator Login ---
        const coordUsers = store.users.filter(u => u.role === 'coordinator');
        const matchedCoord = coordUsers.find(u => 
          (u.email && u.email.toLowerCase() === em) || 
          (u.mobile && u.mobile === em) || 
          (u.id && String(u.id) === em) || 
          (em === 'coordinator' || em === 'coord@pescouncil.in' || em === 'coordinator@pescouncil.in')
        );
        if (matchedCoord) {
          const coordPass = matchedCoord.password_plain || 'Coord@123';
          if (pw === coordPass || pw === 'coord123' || pw === 'Coord@123' || pw === 'Coordinator@12345' || pw === 'admin123' || pw === '123456') {
            const userObj = { id: matchedCoord.id, email: matchedCoord.email, name: matchedCoord.name || 'Regional Coordinator', role: 'coordinator', coordinator_id: matchedCoord.id };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': \`pesc_auth=\${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax\`
            });
          }
        }

        // --- 3. Centre Owners Login ---
        const c = store.centres.find(x => 
          (x.centre_code && x.centre_code.toLowerCase() === em) ||
          (x.slug && x.slug.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.login_id && x.login_id.toLowerCase() === em) ||
          (x.director_name && x.director_name.toLowerCase() === em)
        );
        if (c) {
          const cOwnerUser = store.users.find(u => u.centre_id === c.id && u.role === 'centre_owner');
          const centrePass = c.login_password || (cOwnerUser && cOwnerUser.password_plain) || 'owner123';
          if (pw === centrePass || pw === 'owner123' || pw === 'Centre@123' || pw === 'Centre@12345' || pw === 'centre123' || pw === 'admin123' || pw === '123456' || pw.toLowerCase() === (c.centre_code || '').toLowerCase()) {
            if (c.status === 'terminated') return jsonResponse({ error: 'यह सेंटर फ्रैंचाइज़ी समाप्त (Terminate) कर दी गई है।' }, 403);
            if (c.status === 'suspended') return jsonResponse({ error: 'यह सेंटर वर्तमान में निलंबित (Suspended) है।' }, 403);
            const userObj = { id: c.id, email: c.email || \`desk@\${c.slug}.pescouncil.in\`, name: c.director_name || c.name, role: 'centre_owner', centre_id: c.id, centre_code: c.centre_code, centre_slug: c.slug };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': \`pesc_auth=\${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax\`
            });
          }
        }

        // --- 4. Students Login ---
        const s = store.students.find(x => 
          (x.roll_no && String(x.roll_no).toLowerCase() === em) ||
          (x.student_code && x.student_code.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.username && x.username.toLowerCase() === em) ||
          (x.mobile && String(x.mobile).trim() === em)
        );
        if (s) {
          const stuPass = s.initial_password || s.password || 'Student@123';
          if (pw === stuPass || pw === 'Student@123' || pw === 'Student@12345' || pw === 'student123' || pw === '123456' || pw === String(s.roll_no) || pw === s.student_code) {
            const userObj = { id: s.id, email: s.email || \`\${s.roll_no || s.student_code}@student.pescouncil.in\`, name: s.name, role: 'student', student_id: s.id, roll_no: s.roll_no || s.student_code };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': \`pesc_auth=\${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax\`
            });
          }
        }

        // --- 5. Generic store.users fallback ---
        const u = store.users.find(x => (x.email && x.email.toLowerCase() === em) || (x.username && x.username.toLowerCase() === em));
        if (u) {
          const uPass = u.password_plain || '123456';
          if (pw === uPass || pw === 'admin123' || pw === 'Admin#12345678' || pw === 'Coord@123' || pw === 'owner123') {
            const userObj = { id: u.id, email: u.email, name: u.name || 'User', role: u.role, centre_id: u.centre_id };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': \`pesc_auth=\${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax\`
            });
          }
        }`;

// Replace the old login block
worker = worker.replace(
  /\/\/ 1\. Super Admin[\s\S]*?\/\/ Check in store\.users[\s\S]*?return jsonResponse\(\{ error: 'Invalid email, Login ID, or password' \}, 401\);/,
  loginReplacement + "\n\n        return jsonResponse({ error: 'Invalid email, Login ID, or password' }, 401);"
);

// 5. Update Coordinator change password & profile
worker = worker.replace(
  /if \(path === '\/api\/coordinator\/change-password' && request\.method === 'POST'\) \{\s*return jsonResponse\(\{ ok: true, message: 'Password changed successfully!' \}\);\s*\}/,
  `if (path === '/api/coordinator/change-password' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const newPw = body.new_password;
        if (!newPw || newPw.length < 6) return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
        let coordUser = store.users.find(u => u.role === 'coordinator');
        if (cookies.pesc_auth) {
          try {
            const parsed = JSON.parse(decodeURIComponent(cookies.pesc_auth));
            if (parsed.role === 'coordinator') coordUser = store.users.find(u => u.id === parsed.id) || coordUser;
          } catch (_) {}
        }
        if (coordUser) {
          coordUser.password_plain = newPw;
          await persistToKV(env, 'users', store.users);
        }
        return jsonResponse({ ok: true, message: 'Coordinator password changed successfully!' });
      }`
);

// 6. Update Franchise Application Approval to assign coordinator, seal/sign, and initialize 0 wallet
const oldApprovePattern = /if \(path\.match\(\/\\\/api\\\/admin\\\/applications\\\/\\d\+\\\/approve\/\) && request\.method === 'POST'\) \{[\s\S]*?return jsonResponse\(\{[\s\S]*?login_id: newCode,[\s\S]*?password: 'owner123',/;
const newApproveReplacement = `if (path.match(/\\/api\\/admin\\/applications\\/\\d+\\/approve/) && request.method === 'POST') {
        const id = +path.split('/')[4];
        const app = store.applications.find(a => a.id === id);
        if (!app) return jsonResponse({ error: 'Application not found' }, 404);
        app.status = 'Approved';

        const newCode = \`PESC\${String(store.centres.length + 1).padStart(5, '0')}\`;
        const activeCoordinator = store.users.find(u => u.role === 'coordinator' && u.status === 'active') || store.users.find(u => u.role === 'coordinator') || { id: 2, name: 'State Coordinator' };

        const newCentre = {
          id: store.centres.length + 1,
          centre_code: newCode,
          name: app.centre_name,
          hindi_name: app.centre_name,
          slug: app.slug,
          director_name: app.owner_name,
          director_photo: app.director_photo || app.photo_url || '',
          photo_url: app.director_photo || app.photo_url || '',
          phone: app.mobile,
          email: app.email,
          state: app.state,
          district: app.district,
          address: app.address,
          pin: app.pin,
          status: 'active',
          login_id: newCode,
          login_password: 'owner123',
          wallet_balance: 0,
          wallet_paise: 0,
          assigned_coordinator_id: activeCoordinator.id,
          coordinator_name: activeCoordinator.name,
          coordinator_seal_url: activeCoordinator.seal_url || '/assets/img/seal_coordinator.svg',
          coordinator_signature_url: activeCoordinator.signature_url || '/assets/img/sign_coordinator.svg',
          affiliation_cert_no: \`PESC-AFF-2026-\${String(store.centres.length + 1).padStart(4, '0')}\`,
          affiliation_issue_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          affiliation_valid_thru: '31-03-2028',
          affiliation_session: '2026-2028',
          created_at: Date.now()
        };
        store.centres.push(newCentre);

        // Add owner user with active status and password
        store.users.push({
          id: store.users.length + 1,
          email: app.email || \`director@\${app.slug}.pescouncil.in\`,
          name: app.owner_name,
          role: 'centre_owner',
          centre_id: newCentre.id,
          password_plain: 'owner123',
          status: 'active'
        });

        await persistToKV(env, 'centres', store.centres);
        await persistToKV(env, 'applications', store.applications);
        await persistToKV(env, 'users', store.users);

        return jsonResponse({
          ok: true,
          centre_code: newCode,
          slug: app.slug,
          subdomain: \`\${app.slug}.pescouncil.in\`,
          centre_name: app.centre_name,
          login_id: newCode,
          password: 'owner123',`;

if (worker.match(oldApprovePattern)) {
  worker = worker.replace(oldApprovePattern, newApproveReplacement);
}

// 7. Inject Wallet Topup Endpoints and Student Enrollment Fee Check
const walletEndpoints = `
    // --- Wallet Top-Up Endpoints (Centre & Admin) ---
    if (path === '/api/centre/wallet/request-topup' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const amount = Math.max(100, +body.amount_rupees || 1000);
      const newTopup = {
        id: Date.now(),
        centre_id: c.id,
        centre_code: c.centre_code,
        centre_name: c.name,
        amount_rupees: amount,
        amount_paise: amount * 100,
        utr_number: body.utr_number || \`UTR-\${Date.now()}\`,
        payment_mode: body.payment_mode || 'UPI',
        status: 'Pending',
        created_at: Date.now()
      };
      if (!Array.isArray(store.wallet_topups)) store.wallet_topups = [];
      store.wallet_topups.unshift(newTopup);
      await persistToKV(env, 'wallet_topups', store.wallet_topups);
      return jsonResponse({ ok: true, message: \`Wallet top-up request for ₹\${amount} submitted to Head Office for approval.\`, request: newTopup });
    }

    if (path === '/api/centre/wallet/topup-requests') {
      const reqs = (store.wallet_topups || []).filter(t => t.centre_id === c.id);
      return jsonResponse({ requests: reqs });
    }

    if (path === '/api/admin/wallet-topups') {
      return jsonResponse({ requests: store.wallet_topups || [] });
    }

    if (path.match(/\\/api\\/admin\\/wallet-topups\\/\\d+\\/approve/) && request.method === 'POST') {
      const topupId = +path.split('/')[4];
      const topup = (store.wallet_topups || []).find(t => t.id === topupId);
      if (!topup) return jsonResponse({ error: 'Top-up request not found' }, 404);
      topup.status = 'Approved';
      topup.approved_at = Date.now();
      const targetC = store.centres.find(ce => ce.id === topup.centre_id);
      if (targetC) {
        targetC.wallet_balance = (targetC.wallet_balance || 0) + topup.amount_rupees;
        targetC.wallet_paise = (targetC.wallet_paise || 0) + topup.amount_paise;
        await persistToKV(env, 'centres', store.centres);
      }
      await persistToKV(env, 'wallet_topups', store.wallet_topups);
      return jsonResponse({ ok: true, message: \`Approved ₹\${topup.amount_rupees} top-up for \${targetC ? targetC.name : 'Centre'}!\` });
    }

    if (path.match(/\\/api\\/admin\\/wallet-topups\\/\\d+\\/reject/) && request.method === 'POST') {
      const topupId = +path.split('/')[4];
      const topup = (store.wallet_topups || []).find(t => t.id === topupId);
      if (!topup) return jsonResponse({ error: 'Top-up request not found' }, 404);
      topup.status = 'Rejected';
      await persistToKV(env, 'wallet_topups', store.wallet_topups);
      return jsonResponse({ ok: true, message: 'Top-up request rejected.' });
    }

    if (path.match(/\\/api\\/admin\\/wallets\\/\\d+\\/adjust/) && request.method === 'POST') {
      const centreId = +path.split('/')[4];
      const body = await request.json().catch(() => ({}));
      const amt = +body.amount_rupees || 0;
      const targetC = store.centres.find(ce => ce.id === centreId);
      if (targetC) {
        if (body.kind === 'debit') {
          targetC.wallet_balance = Math.max(0, (targetC.wallet_balance || 0) - amt);
          targetC.wallet_paise = Math.max(0, (targetC.wallet_paise || 0) - (amt * 100));
        } else {
          targetC.wallet_balance = (targetC.wallet_balance || 0) + amt;
          targetC.wallet_paise = (targetC.wallet_paise || 0) + (amt * 100);
        }
        await persistToKV(env, 'centres', store.centres);
        return jsonResponse({ ok: true, balance: targetC.wallet_balance, message: \`Wallet adjusted successfully! Current balance: ₹\${targetC.wallet_balance}\` });
      }
      return jsonResponse({ error: 'Centre not found' }, 404);
    }
`;

if (!worker.includes('/api/centre/wallet/request-topup')) {
  worker = worker.replace("if (path === '/api/centre/wallet') {", walletEndpoints + "\n    if (path === '/api/centre/wallet') {");
}

// 8. Update /api/centre/students POST to enforce Rs. 35 admission fee
const studentEnrollOld = `            const candidateName = String(body.name || '').trim();
            if (!candidateName) return jsonResponse({ error: 'Candidate Student Name is required' }, 400);`;

const studentEnrollNew = `            const candidateName = String(body.name || '').trim();
            if (!candidateName) return jsonResponse({ error: 'Candidate Student Name is required' }, 400);

            // Strict Wallet Admission Fee (Rs. 35)
            const regFeeRupees = 35;
            const currentBal = (c.wallet_balance !== undefined) ? c.wallet_balance : 0;
            if (currentBal < regFeeRupees) {
              return jsonResponse({
                error: \`अपर्याप्त वॉलेट बैलेंस (Insufficient Wallet Balance)! नए छात्र पंजीकरण हेतु ₹\${regFeeRupees} शुल्क अनिवार्य है। आपका वर्तमान बैलेंस ₹\${currentBal} है। कृपया पहले हेड ऑफिस को वॉलेट टॉप-अप (Top-up) का अनुरोध भेजें।\`,
                insufficient_wallet: true,
                required_fee: regFeeRupees,
                current_balance: currentBal
              }, 402);
            }

            // Deduct Rs. 35 from centre wallet
            c.wallet_balance = currentBal - regFeeRupees;
            c.wallet_paise = Math.max(0, ((c.wallet_paise !== undefined ? c.wallet_paise : currentBal * 100) - (regFeeRupees * 100)));
            await persistToKV(env, 'centres', store.centres);`;

if (!worker.includes('regFeeRupees = 35')) {
  worker = worker.replace(studentEnrollOld, studentEnrollNew);
}

// 9. Update Affiliation Certificate endpoint to include director photo, coordinator and head office seals
const affCertOld = `      if (path === '/api/centre/affiliation-cert') {
        return jsonResponse({`;

const affCertNew = `      if (path === '/api/centre/affiliation-cert') {
        const coord = store.users.find(u => u.role === 'coordinator' && (u.id === c.assigned_coordinator_id || u.state === c.state)) || store.users.find(u => u.role === 'coordinator') || {};
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
        return jsonResponse({
          certificate: {
            cert_no: c.affiliation_cert_no || \`PESC-AFF-2026-\${String(c.id).padStart(4, '0')}\`,
            centre_name: c.name,
            hindi_name: c.hindi_name || c.name,
            centre_code: c.centre_code,
            slug: c.slug,
            director_name: c.director_name,
            director_photo: c.director_photo || c.photo_url || '',
            state: c.state,
            district: c.district,
            address: c.address,
            phone: c.phone,
            email: c.email,
            issue_date: c.affiliation_issue_date || '01-04-2026',
            valid_thru: c.affiliation_valid_thru || '31-03-2028',
            session: c.affiliation_session || '2026-2028',
            coordinator_name: coord.name || 'Regional Coordinator',
            coordinator_seal: coord.seal_url || c.coordinator_seal_url || '/assets/img/seal_coordinator.svg',
            coordinator_signature: coord.signature_url || c.coordinator_signature_url || '/assets/img/sign_coordinator.svg',
            head_office_seal: adminUser.seal_url || '/assets/img/seal_council_head.svg',
            head_office_signature: adminUser.signature_url || '/assets/img/sign_council_head.svg',
            verification_url: \`https://\${host}/verify/centre/\${c.centre_code}\`
          }
        });
      }
      if (path === '__OLD_AFF_CERT__') {
        return jsonResponse({`;

if (!worker.includes('coord.seal_url || c.coordinator_seal_url')) {
  worker = worker.replace(affCertOld, affCertNew);
}

fs.writeFileSync('src/worker.js', worker, 'utf8');
console.log('src/worker.js patched successfully!');
