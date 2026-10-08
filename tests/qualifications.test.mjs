import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEducation, validateCertificate } from '../lib/validation.mjs';

const education = { degree: ' BS Computer Science ', institution: ' University ', duration: '2024', order_id: '0' };
const certificate = { title: ' Cloud Developer ', issuer: ' Provider ', duration: '2026', order_id: '1' };

test('education trims fields, allows optional description, and parses order', () => {
  assert.deepEqual(validateEducation(education), { degree: 'BS Computer Science', institution: 'University', duration: '2024', description: '', order_id: 0 });
});

test('certificates allow empty credential links and reject unsafe links', () => {
  assert.equal(validateCertificate(certificate).link, null);
  assert.equal(validateCertificate({ ...certificate, link: ' https://example.com/credential ' }).link, 'https://example.com/credential');
  for (const link of ['javascript:alert(1)', '//example.com', 'https://user:password@example.com']) assert.throws(() => validateCertificate({ ...certificate, link }));
});

test('qualifications reject missing fields, oversized text, and invalid orders', () => {
  assert.throws(() => validateEducation({ ...education, degree: ' ' }));
  assert.throws(() => validateCertificate({ ...certificate, issuer: '' }));
  assert.throws(() => validateEducation({ ...education, institution: 'x'.repeat(121) }));
  for (const order_id of ['', '-1', '1.5', '10001']) {
    assert.throws(() => validateEducation({ ...education, order_id }));
    assert.throws(() => validateCertificate({ ...certificate, order_id }));
  }
});
