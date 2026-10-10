import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFeedback } from '../lib/feedback-validation.mjs';

function feedback(values = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: ' Customer ', message: ' Great work on our website! ', rating: '5', ...values })) data.set(key, value);
  return data;
}
test('feedback validates and trims public fields without accepting extra columns', () => {
  assert.deepEqual(validateFeedback(feedback({ id: 'fake', created_at: 'fake' })), { data: { name: 'Customer', message: 'Great work on our website!', rating: 5 } });
});
test('feedback rejects blank, oversized, and invalid input', () => {
  for (const values of [{ name: ' ' }, { name: 'a'.repeat(81) }, { message: 'short' }, { message: 'a'.repeat(1501) }, { rating: '' }, { rating: '6' }, { rating: '2.5' }, { rating: 'invalid' }]) {
    assert.ok(validateFeedback(feedback(values)).error);
  }
  assert.ok(validateFeedback(new FormData()).error);
});
