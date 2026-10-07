import test from 'node:test';
import assert from 'node:assert/strict';
import { safeLink, validateProject, validateExperience } from '../lib/validation.mjs';
const project = { title: ' App ', description: ' Useful app ', tech_stack: 'React, Supabase, React', link: 'https://example.com' };
test('project input is trimmed and tags deduplicated', () => {
  assert.deepEqual(validateProject(project), { title:'App', description:'Useful app', tech_stack:['React','Supabase'], link:'https://example.com/' });
});
test('unsafe URL schemes and embedded credentials are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//example.com', 'https://name:password@example.com']) {
    assert.equal(safeLink(url), null);
    assert.throws(() => validateProject({ ...project, link: url }));
  }
});
test('optional link is allowed; empty and oversized required fields are rejected', () => {
  assert.equal(validateProject({ ...project, link:'' }).link, null);
  assert.throws(() => validateProject({ ...project, title:' ' }));
  assert.throws(() => validateProject({ ...project, description:'x'.repeat(3001) }));
  assert.throws(() => validateProject({ ...project, tech_stack:',' }));
  assert.throws(() => validateProject({ ...project, tech_stack:'x'.repeat(61) }));
});
test('experience order rejects empty, fractional, negative, and out of range values', () => {
  const exp = { role:'Developer', company:'Company', duration:'2026', description:'Built apps', order_id:'0' };
  assert.equal(validateExperience(exp).order_id, 0);
  for (const order_id of ['', '1.5', '-1', '10001', 'NaN']) assert.throws(() => validateExperience({ ...exp, order_id }));
});
