# PESC Platform – PRD v2.0
**Purvanchal Education & Skill Council – Multi-Centre ERP, Wallet & Certificate Verification**

## 1. Goals
1. Ek hi platform se saare affiliated centres ka admission, fees, exam, certificate aur marksheet manage karna.
2. Prepaid wallet se fee-deduction – bina balance ke koi certificate/marksheet issue nahi hoga.
3. Har certificate par 3-stage seal + QR, jo `/verify` par instantly verify ho.
4. Har centre ko apni public website: `<slug>.pescouncil.in`.

**Non-goals (v1):** online payment gateway (wallet top-up admin manually karta hai), mobile app.

## 2. Roles & Permissions
| Role | Route | Permissions |
|---|---|---|
| SUPER_ADMIN (Head Office) | /admin | Centres approve/suspend, wallet credit/debit, fee policy, courses, head-office seal |
| COORDINATOR | /coordinator | Apne region ke centres verify, certificate par coordinator seal approve |
| CENTRE_ADMIN | /portal | Apne centre ka ERP (17 modules), sirf apna data |
| PUBLIC | /verify, *.pescouncil.in | Read-only verification, centre site, enquiry form |

Rule: **har query `centre_id` se scoped** (multi-tenant isolation).

## 3. Fee Policy (Head Office-configurable)
Admission ₹35 · Certificate ₹200 · Marksheet ₹150 — `fee_policy` table me, hardcode nahi.

## 4. Core Flows
- **Wallet debit (atomic):** transaction start → balance check → ledger row (DEBIT) → balance update → document issue → commit. Fail hone par pura rollback; negative balance kabhi nahi.
- **Certificate:** Student `COMPLETED` ho → centre "Issue" → ₹200 debit → unique `cert_no` + `verify_token` → 3 seals attach → QR = `https://pescouncil.in/verify/<token>`.
- **Verify:** token lookup → certificate details + status (VALID / REVOKED). Revoke sirf Head Office kar sakta hai.

## 5. Data Model
`centres`(id, slug, name, director, region_id, status, wallet_balance) · `users`(id, role, centre_id, email, pass_hash) · `students`(id, centre_id, roll_no, student_code, name, course_id, status) · `courses` · `fee_policy`(item, amount) · `wallet_ledger`(id, centre_id, type CREDIT/DEBIT, amount, reason, ref, balance_after, created_at) · `certificates`(id, student_id, cert_no, verify_token, status, issued_at) · `marksheets` · `enquiries` · `tickets`.

## 6. 17 ERP Modules – Priority
- **P0 (MVP):** Add Student, My Students, Wallet & Ledger, Certificate, Marksheet, QR Verify, Centre site, Seal upload
- **P1:** Fees collection, ID card, Admit card, Courses, Support tickets
- **P2:** Online exam, Notes, Staff, Website CMS, Semester certificate, Affiliation certificate

## 7. Security
bcrypt passwords · JWT in httpOnly cookie · rate-limit on /verify & login · role middleware · audit log for every wallet/certificate action · input validation · daily SQLite backup.

## 8. Non-Functional
500 centres / 50,000 students · SQLite (WAL mode) · verify page < 1s · free/self-hostable (Node.js + Express + SQLite, Cloudflare free tier).

## 9. Acceptance Criteria
- Balance < fee → issue block, clear error (HTTP 402).
- Do simultaneous issue requests → wallet kabhi negative nahi (Atomic lock / WAL transaction).
- Centre A, Centre B ka data nahi dekh sakta (Multi-tenant isolation).
- Revoked certificate `/verify` par "REVOKED" dikhaye.

## 10. Roadmap
M1: auth + centres + wallet · M2: students + certificate + verify · M3: marksheet + ID/admit card · M4: exam, CMS, tickets.
