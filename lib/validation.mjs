function text(value, name, max, optional = false) {
  if (typeof value !== 'string') throw new Error(`${name} must be text.`);
  const result = value.trim();
  if ((!optional && !result) || result.length > max) throw new Error(`${name} is required and must be at most ${max} characters.`);
  return result;
}
export function safeLink(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function validateProject(input) {
  const linkInput = text(input.link ?? '', 'Link', 2048, true);
  const link = safeLink(linkInput);
  if (linkInput && !link) throw new Error('Use a valid http:// or https:// project link.');
  const raw = text(input.tech_stack, 'Tech stack', 1000);
  const tech_stack = [...new Set(raw.split(',').map((tag) => tag.trim()).filter(Boolean))];
  if (!tech_stack.length || tech_stack.length > 20 || tech_stack.some((tag) => tag.length > 60)) throw new Error('Use 1–20 technology tags, up to 60 characters each.');
  return { title: text(input.title, 'Title', 120), description: text(input.description, 'Description', 3000), tech_stack, link };
}
export function validateExperience(input) {
  const rawOrder = String(input.order_id ?? '').trim();
  const order_id = Number(rawOrder);
  if (!rawOrder || !Number.isInteger(order_id) || order_id < 0 || order_id > 10000) throw new Error('Display order must be an integer between 0 and 10000.');
  return { role: text(input.role, 'Role', 120), company: text(input.company, 'Company', 120), duration: text(input.duration, 'Duration', 100), description: text(input.description, 'Description', 3000), order_id };
}
