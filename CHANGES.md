# Changes in this pass
**Security**
- Seed no longer falls back to the public default admin password in production; demo accounts (known passwords) are not created in production.
- `render.yaml`: removed hardcoded admin password (`sync: false`).
- `npm audit`: 2 high vulnerabilities fixed (body-parser via audit fix, nodemailer 10.2.1). Now 0.

**Bugs**
- Express did not serve `/css`, `/js`, `/img` although every HTML page links to them (404 on Hostinger/Node). Now mounted (cached 7 days in production).

**SEO / honesty**
- Removed fabricated `aggregateRating` (4.9 / 168 reviews) and hardcoded Varanasi coordinates from every centre's JSON-LD (Google can penalise fake review markup); PESC is no longer marked `GovernmentOrganization`.

**Features**
- Automatic wallet fees (admission ₹35, certificate ₹200, marksheet ₹150), configurable by Head Office via `/api/admin/fees`; atomic with the request, 402 + rollback when balance is short, idempotent ledger references.
- Auto-refund of the exact amount when a certificate/marksheet request is rejected.
- `/api/centre/fees` (affordability per fee) and `low_balance` flag on `/api/centre/wallet`.
- Fixed: centre wallet showed a fake ₹5,000 balance when no wallet row existed; now ₹0.

**Docs**: README status table updated to match what is actually built.

**Verified**: 12/12 tests pass (new fee test covers charge, refund, 402 rollback, admin fee change); static paths and production seed checked live.

**Not changed (your call):** duplicate asset folders (`public/js` = `public/assets/js`, etc., ~13 MB of duplicated images); unminified 250 KB JS files; marketing copy such as "Government-recognized" and placeholder phone numbers in the centre-site template — confirm these are true before publishing.
