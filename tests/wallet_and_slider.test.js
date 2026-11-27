import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Centre Site Template Hero Slider Dimensions & Clarity', () => {
  const template = fs.readFileSync('src/centre_site_template.js', 'utf8');

  // Verify Hero Wrap has expanded grid ratio and min-height 520px
  assert.ok(template.includes('grid-template-columns: 1fr 1.2fr;'), 'Hero wrap should allocate wide column for photo slider');
  assert.ok(template.includes('min-height: 520px;'), 'Hero wrap should be at least 520px tall');

  // Verify Hero Right slider container has large min-height and styling
  assert.ok(template.includes('min-height: 480px;'), 'Hero right slider should have min-height 480px');
  assert.ok(template.includes('border-radius: 16px;'), 'Hero right slider should have rounded corners');
  assert.ok(template.includes('box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);'), 'Hero right slider should have depth shadow');

  // Verify Hero Fade gradient is subtle so photos are clear and not dark green mud
  assert.ok(template.includes('rgba(6, 78, 59, 0.25) 0%, transparent 20%'), 'Hero fade overlay should be subtle and transparent');

  // Verify Mobile Hero Right slider has min-height 380px (not 260px)
  assert.ok(template.includes('.c-hero-right { height: 380px; min-height: 380px;'), 'Mobile hero right slider should have min-height 380px');
});

test('Centre Admin Panel Slider Code has querySelectorAll fix ($$)', () => {
  const centreJs = fs.readFileSync('public/js/centre.js', 'utf8');

  // Must use $$('.banner-slide-row', V)
  assert.ok(centreJs.includes("const slideRows = $$('.banner-slide-row', V);"), 'Must use $$ for banner slide rows');
  assert.ok(centreJs.includes("$$('.banner-slide-url-input', V)"), 'Must use $$ for banner slide url inputs');
  assert.ok(centreJs.includes("$$('.chk-popular-course', V)"), 'Must use $$ for popular course checkboxes');
});

test('Admin UI Wallet Adjustment Modal and Centre Actions', () => {
  const adminJs = fs.readFileSync('public/js/admin.js', 'utf8');

  // Verify openWalletAdjustModal exists and supports credit, debit, set
  assert.ok(adminJs.includes('function openWalletAdjustModal('), 'openWalletAdjustModal must be defined');
  assert.ok(adminJs.includes('value="credit"'), 'Modal must have credit option');
  assert.ok(adminJs.includes('value="debit"'), 'Modal must have debit option');
  assert.ok(adminJs.includes('value="set"'), 'Modal must have set exact option');
  assert.ok(adminJs.includes('adjNewBalance'), 'Modal must display dynamic new balance preview');

  // Verify views.Centres has Wallet Balance column and Wallet action button
  assert.ok(adminJs.includes("['Wallet Balance', (r) =>"), 'Centres table must display Wallet Balance column');
  assert.ok(adminJs.includes('title="Adjust Wallet Balance (कम / ज्यादा करें)"'), 'Centres table must have Wallet adjust button');

  // Verify views.Wallets has updated adjust button
  assert.ok(adminJs.includes('💳 Wallet (कम / ज्यादा / सेट)'), 'Wallets view must have updated adjust button');
});

test('Cloudflare Worker supports kind: credit, debit, set and persists to KV', () => {
  const worker = fs.readFileSync('src/worker.js', 'utf8');

  assert.ok(worker.includes("else if (k === 'set')"), 'Worker must support kind: set');
  assert.ok(worker.includes("targetC.wallet_balance = Math.max(0, amt);"), 'Worker set must set exact balance');
  assert.ok(worker.includes("await persistToKV(env, 'centres', store.centres);"), 'Worker adjust must persist centres to KV');
  assert.ok(worker.includes("wallet_balance: c.wallet_balance !== undefined"), 'Enriched centres must include wallet_balance');
});
