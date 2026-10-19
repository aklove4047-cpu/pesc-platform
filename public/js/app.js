const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = (paise) => '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const date = (ms) => ms ? new Date(ms).toLocaleDateString('en-IN') : '';
async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(path, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  let d = {}; try { d = await r.json(); } catch {}
  if (!r.ok) { const e = new Error(d.error || `Error ${r.status}`); e.status = r.status; e.data = d; throw e; }
  return d;
}
function toast(msg, ok = true) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.className = ok ? '' : 'err'; t.style.display = 'block'; clearTimeout(t._t); t._t = setTimeout(() => (t.style.display = 'none'), 3500);
}
const form = (f) => Object.fromEntries(new FormData(f).entries());
const badge = (s) => `<span class="badge ${esc(s)}">${esc(s)}</span>`;
function table(cols, rows, empty = 'Nothing here yet') {
  if (!rows.length) return `<p class="muted">${esc(empty)}</p>`;
  return `<div class="wrap"><table><thead><tr>${cols.map((c) => `<th>${esc(c[0])}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
async function needRole(roles) {
  try { const d = await api('/api/auth/me'); if (!roles.includes(d.user.role)) { location = '/login'; return null; } return d; } catch { location = '/login'; return null; }
}
async function guard(fn) { try { return await fn(); } catch (e) { toast(e.message, false); } }
function tabs(el, names, onPick) {
  el.innerHTML = names.map((n, i) => `<button data-tab="${esc(n)}" class="${i ? '' : 'on'}">${esc(n)}</button>`).join('');
  el.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; $$('button', el).forEach((x) => x.classList.toggle('on', x === b)); onPick(b.dataset.tab); });
  onPick(names[0]);
}
