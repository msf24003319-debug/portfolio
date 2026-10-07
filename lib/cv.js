import 'server-only';
import { skillGroups } from '@/lib/content';

// Small text-only PDF writer. All offsets use byte counts, not JS string lengths.
// ASCII normalization avoids unsupported glyphs in PDF's built-in Helvetica font.
function ascii(value) { return String(value).replace(/[–—→]/g, '-').replace(/[^\x20-\x7e]/g, ' '); }
function escapePdf(value) { return ascii(value).replace(/([\\()])/g, '\\$1'); }
function wrap(value, width = 88) {
  const words = ascii(value).split(/\s+/);
  const result = []; let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width && line) { result.push(line); line = ''; }
    // Hard-wrap long tokens (e.g. URLs) so content stays inside the page margins.
    if (word.length > width) { if (line) result.push(line); line = ''; for (let i = 0; i < word.length; i += width) result.push(word.slice(i, i + width)); }
    else line = (line + ' ' + word).trim();
  }
  if (line) result.push(line);
  return result;
}
export function buildCv({ projects, experience }) {
  const lines = [];
  const add = (value, size = 10, bold = false) => wrap(value, size > 14 ? 45 : 88).forEach((text) => lines.push({ text, size, bold }));
  const space = () => lines.push({ text: '', size: 8 });
  add('Saba Rasheed', 24, true);
  add('Full Stack Developer | Mobile App & AI Enthusiast', 11);
  add('sabarasheed458@gmail.com | github.com/saba054');
  add('anayanex.com | lionforexacademy.com'); space();
  add('EXPERIENCE', 13, true);
  for (const item of experience) { space(); add(`${item.role} | ${item.company}`, 11, true); add(item.duration); add(item.description); }
  space(); add('PROJECTS', 13, true);
  for (const item of projects) { space(); add(item.title, 11, true); add(item.description); add((item.tech_stack ?? []).join(', ')); if (item.link) add(item.link); }
  space(); add('SKILLS', 13, true);
  for (const group of skillGroups) add(`${group.name}: ${group.skills.join(', ')}`);
  space(); add('EDUCATION', 13, true);
  add('Master of Computer Science | University of Education | 2026');
  add('BS Computer Science | COMSATS | 2024');

  const pages = []; let commands = []; let y = 790;
  for (const line of lines) {
    const height = line.size + 6;
    if (y - height < 48) { pages.push(commands.join('\n')); commands = []; y = 790; }
    if (line.text) commands.push(`BT /${line.bold ? 'F2' : 'F1'} ${line.size} Tf 48 ${y} Td (${escapePdf(line.text)}) Tj ET`);
    y -= height;
  }
  pages.push(commands.join('\n'));
  const objects = [null, '', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
  const kids = [];
  for (const stream of pages) {
    const pageId = objects.length; const streamId = pageId + 1; kids.push(`${pageId} 0 R`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  }
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  for (let id = 1; id < objects.length; id++) { offsets[id] = Buffer.byteLength(pdf); pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`; }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
