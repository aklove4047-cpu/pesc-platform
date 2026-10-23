// Certificate decisions (admin / coordinator-in-scope), PDF download (centre-scoped).
const router = require('express').Router();
const PDFDocument = require('pdfkit');
const QR = require('qrcode');
const db = require('../db');
const cfg = require('../config');
const { requireRole, requireAuth } = require('../auth');
const { HttpError, now, rand, str, h, audit, next: counter, nextCertificateNo } = require('../lib');

const SEL = `SELECT c.*, s.name AS student_name, s.student_code, co.name AS course_name, ce.name AS centre_name, ce.centre_code, ce.coordinator_id
  FROM certificates c JOIN students s ON s.id=c.student_id JOIN courses co ON co.id=c.course_id JOIN centres ce ON ce.id=c.centre_id`;

router.get('/pending', requireRole('super_admin', 'admin', 'coordinator'), (req, res) => {
  const co = req.user.role === 'coordinator';
  res.json({ certificates: db.prepare(`${SEL} WHERE c.status='Pending' ${co ? 'AND ce.coordinator_id=?' : ''} ORDER BY c.id LIMIT 100`).all(...(co ? [req.user.id] : [])) });
});

router.post('/:id/decision', requireRole('super_admin', 'admin', 'coordinator'), (req, res) => {
  const d = str(req.body.decision, 10), reason = str(req.body.reason, 300);
  if (!['approve', 'reject', 'revoke'].includes(d)) throw new HttpError(400, 'Invalid decision');
  if (d !== 'approve' && !reason) throw new HttpError(400, 'Reason is required');
  if (d === 'revoke' && req.user.role === 'coordinator') throw new HttpError(403, 'Only admin can revoke');
  const out = db.transaction(() => {
    const c = db.prepare(`${SEL} WHERE c.id=?`).get(+req.params.id);
    if (!c) throw new HttpError(404, 'Not found');
    if (req.user.role === 'coordinator' && c.coordinator_id !== req.user.id) throw new HttpError(404, 'Not found'); // out of scope
    if (d === 'revoke') {
      if (c.status !== 'Valid') throw new HttpError(409, 'Only valid certificates can be revoked');
      db.prepare("UPDATE certificates SET status='Revoked', reason=?, decided_by=? WHERE id=?").run(reason, req.user.id, c.id);
    } else {
      if (c.status !== 'Pending') throw new HttpError(409, `Certificate is already ${c.status}`);
      if (d === 'reject') db.prepare("UPDATE certificates SET status='Rejected', reason=?, decided_by=? WHERE id=?").run(reason, req.user.id, c.id);
      else {
        const no = nextCertificateNo();
        db.prepare("UPDATE certificates SET status='Valid', cert_no=?, token=?, issued_at=?, decided_by=? WHERE id=?").run(no, rand(24), now(), req.user.id, c.id);
      }
    }
    audit(req, 'certificate.' + d, 'certificate', c.id, 'ok', reason || null);
    return db.prepare('SELECT id,status,cert_no FROM certificates WHERE id=?').get(c.id);
  })();
  res.json(out);
});

router.get('/:id/pdf', requireAuth, h(async (req, res) => {
  const u = req.user;
  const c = db.prepare(`${SEL} WHERE c.id=?`).get(+req.params.id);
  const allowed = c && (['super_admin', 'admin'].includes(u.role) || (['centre_owner', 'centre_staff'].includes(u.role) && u.centre_id === c.centre_id));
  if (!allowed) throw new HttpError(404, 'Not found');
  if (c.status !== 'Valid') throw new HttpError(409, 'Certificate is not valid');
  const qr = await QR.toBuffer(`${cfg.PUBLIC_URL}/verify/${c.token}`, { margin: 1, width: 240 });
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `inline; filename="certificate-${c.id}.pdf"`);
  doc.pipe(res);
  const W = doc.page.width, H = doc.page.height;
  const isSem = c.evaluation_type === 'semester';
  const certTitle = isSem ? 'Certificate of Semester Completion' : 'Certificate of Course Completion';
  const termDesc = isSem ? `has completed ${c.term || 'Semester'} for the course` : 'has completed the course';
  doc.rect(20, 20, W - 40, H - 40).lineWidth(4).stroke('#0a2a5e');
  doc.fillColor('#0a2a5e').fontSize(26).text('Purvanchal Education & Skill Council', 0, 70, { align: 'center' });
  doc.fontSize(34).text(certTitle, 0, 120, { align: 'center' });
  doc.fillColor('#333').fontSize(16).text('This is to certify that', 0, 190, { align: 'center' });
  doc.fillColor('#0a2a5e').fontSize(30).text(c.student_name, 0, 220, { align: 'center' });
  doc.fillColor('#333').fontSize(16).text(`${termDesc} "${c.course_name}" at ${c.centre_name}`, 60, 275, { align: 'center', width: W - 120 });
  doc.fontSize(12).text(`Certificate No: ${c.cert_no} | Pattern: ${isSem ? (c.term || 'Semester') : 'Annual'}`, 60, H - 150).text(`Issue date: ${new Date(c.issued_at).toISOString().slice(0, 10)}`, 60, H - 130);
  doc.fontSize(9).fillColor('#666').text('Scan the QR code or visit the verification page to check this certificate.', 60, H - 100, { width: 420 });
  doc.image(qr, W - 190, H - 190, { width: 110 });
  doc.end();
}));
module.exports = router;
