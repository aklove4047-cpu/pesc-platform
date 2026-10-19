# PESC Multi-Site Institute & Franchise Management — Phase 1 core

Node.js + Express + SQLite (free, self-hostable). Implements the PRD's core vertical slice with real DB-backed APIs and tests.

## Run
```bash
cp .env.example .env        # edit values (set SEED_ADMIN_PASSWORD, PAYMENT_WEBHOOK_SECRET)
npm install
set -a; . ./.env; set +a    # load env (or use your process manager's env support)
npm run seed                # creates super admin + sample courses
npm start                   # http://localhost:3000
npm test                    # 7 integration tests
```
Local multi-tenant test: `BASE_DOMAIN=localhost`, then open `http://navya.localhost:3000` (Chrome/Firefox resolve *.localhost).

## Flow
1. Public form `/#apply` → application (`PESC-APP-YYYY-NNNNNN`), duplicate/reserved/slug checks.
2. `/admin` → **Approve & provision** → job runs steps: owner → centre (unique `PESCnnnnn`) → settings+wallet → tenant/DNS/HTTPS health checks → activate → one-time setup link (48h, hashed in DB, never a plain password).
3. A failed step stops the job, centre becomes `provisioning_failed`; click **Retry** to resume (completed steps are skipped, no duplicates).
4. Owner opens setup link → sets password → logs in on `slug.BASE_DOMAIN` → centre panel.
5. Admin assigns courses to centre → centre adds students → applies certificate → admin/coordinator approves → number + unguessable QR token + PDF → public `/verify/<token>`.

## Production (wildcard subdomains)
- DNS: `A *.pescouncil.in -> server IP` (+ apex).
- HTTPS: wildcard certificate (DNS-01). Example Caddy (with your DNS provider plugin):
  ```
  pescouncil.in, *.pescouncil.in { tls { dns <provider> {env.DNS_TOKEN} }  reverse_proxy 127.0.0.1:3000 }
  ```
- `.env`: `NODE_ENV=production`, `BASE_DOMAIN=pescouncil.in`, `PUBLIC_URL=https://pescouncil.in`, `PROVISION_CHECK_DNS=true`, `PROVISION_CHECK_HTTPS=true`.
- Run with systemd/pm2. cPanel "Setup Node.js App" works only if your host supports wildcard subdomains + wildcard SSL; otherwise use a VPS.
- Backups: `sqlite3 data/pesc.db ".backup 'backup.db'"` via cron; copy off-server; test restore regularly.
- Capacity: SQLite (WAL) is fine for a single server; the 500 centres / 50,000 students target must still be load-tested. Schema is portable to PostgreSQL if you outgrow it.

## PRD coverage
| Done and tested | Not built yet (Phase 2) |
|---|---|
| Roles + server-side authz, Argon2id, lockout, rate limits, origin check, audit log | MFA, SMS/WhatsApp (adapter hooks only; email = console/SMTP) |
| Franchise apply/review/approve/reject + provisioning/retry | Document upload (franchise_documents, student_documents, S3 storage) |
| Wildcard tenant routing, reserved names, 404/suspended pages | Student panel + student logins, attendance, assignments, ID cards |
| Centre panel: students, courses, certificates, wallet, tickets | Marksheets/semester results, seal & signature approval |
| Certificates: approve/reject/revoke, number, QR token, PDF, public verify | Certificate expiry/renewal/reissue UI, roll-number search |
| Wallet ledger + HMAC-verified idempotent payment webhook | Real gateway adapter (order creation), refunds, commissions, invoices |
| Admin dashboard, coordinators, courses, audit view | Coordinator panel beyond certificate approval; reports/CSV export; notices; library |

`/api/centre/wallet/recharge` returns `gateway: "unconfigured"` until you add a gateway adapter — nothing claims payments work without it. Certificate PDF uses Helvetica (no Hindi glyphs); embed a Devanagari TTF in `routes/certificates.js` for Hindi names. Legal recognition/issuing authority of certificates is for PESC to verify; templates here don't imply it.
