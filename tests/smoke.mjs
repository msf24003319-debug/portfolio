// Run against the local production server before setting Supabase credentials.
import assert from 'node:assert/strict';
const origin = process.env.SMOKE_ORIGIN ?? 'http://127.0.0.1:3000';
const home = await fetch(origin);
assert.equal(home.status, 200);
const html = await home.text();
assert.ok(html.includes('Saba Rasheed'));
// The homepage introduces Saba; full section content belongs to its own route.
for (const value of ['HiFlow Mobile Application', 'Master of Computer Science', 'sabarasheed458@gmail.com']) assert.ok(!html.includes(value), `Content still on home: ${value}`);
const routes = [
  ['/projects', ['HiFlow Mobile Application', 'RAG Document Uploader', 'Cassava Leaf Disease']],
  ['/experience', ['Mobile App Developer', 'HiFlow App', 'Full Stack Developer']],
  ['/skills', ['Frontend development', 'Mobile development', 'Backend development', 'Databases &amp; platforms', 'AI &amp; intelligent applications', 'Computer vision']],
  ['/education', ['Master of Computer Science', 'University of Education', 'COMSATS']],
  ['/contact', ['sabarasheed458@gmail.com', 'github.com/saba054', 'anayanex.com', 'lionforexacademy.com']],
];
for (const [path, values] of routes) {
  assert.ok(html.includes(`href="${path}"`), `Missing navigation: ${path}`);
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const page = await response.text();
  for (const value of values) assert.ok(page.includes(value), `Missing ${value} on ${path}`);
  const activeLink = (page.match(/<a\b[^>]*>/g) ?? []).find((tag) => tag.includes(`href="${path}"`) && tag.includes('aria-current="page"'));
  assert.ok(activeLink, `Missing active navigation on ${path}`);
  assert.equal((page.match(/<main\b/g) ?? []).length, 1, `Expected one main landmark on ${path}`);
  if (path === '/skills') {
    assert.equal((page.match(/<section class="stack-section /g) ?? []).length, 1, 'Only the selected stack should render');
    assert.ok(page.includes('id="stack-frontend"'), 'Frontend should be selected initially');
    assert.equal((page.match(/aria-pressed="true"/g) ?? []).length, 1, 'Exactly one stack filter should be selected');
    assert.equal((page.match(/aria-pressed="false"/g) ?? []).length, 6, 'All plus the other five stack filters should be available');
    assert.ok(page.includes('>All</button>'), 'All stacks filter should be available');
  }
}
assert.ok(html.includes('Content preview'), 'This smoke check requires unconfigured preview mode.');
assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
const admin = await fetch(`${origin}/admin`, { redirect:'manual' });
assert.equal(admin.status, 307);
assert.equal(new URL(admin.headers.get('location'), origin).pathname, '/admin/login');
assert.ok(admin.headers.get('cache-control').includes('no-store'));
const login = await fetch(`${origin}/admin/login`);
assert.equal(login.status, 200);
const loginHtml = await login.text();
assert.ok(loginHtml.includes('type="password"'));
assert.ok(loginHtml.includes('disabled=""'));
const cv = await fetch(`${origin}/api/cv`);
assert.equal(cv.status, 200);
assert.equal(cv.headers.get('content-type'), 'application/pdf');
assert.ok(cv.headers.get('content-disposition').includes('Saba-Rasheed-CV.pdf'));
const pdf = Buffer.from(await cv.arrayBuffer()).toString('ascii');
assert.ok(pdf.startsWith('%PDF-1.4'));
assert.ok(pdf.endsWith('%%EOF'));
assert.ok(pdf.includes('(Saba Rasheed)'));
assert.ok(pdf.includes('HiFlow Mobile Application'));
const xrefOffset = Number(pdf.match(/startxref\n(\d+)/)[1]);
assert.equal(pdf.slice(xrefOffset, xrefOffset + 4), 'xref');
const offsets = pdf.slice(xrefOffset).split('\n').slice(3).filter((line) => /^\d{10} 00000 n/.test(line));
offsets.forEach((line, index) => assert.ok(pdf.slice(Number(line.slice(0, 10))).startsWith(`${index + 1} 0 obj`), 'Invalid PDF object offset'));
console.log('PASS: six public pages, content separation, active navigation, security headers, admin redirect, disabled login, and valid PDF offsets.');
