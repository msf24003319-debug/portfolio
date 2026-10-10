export function validateFeedback(formData) {
  const name = String(formData.get('name') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const rating = Number(formData.get('rating'));
  if (name.length < 1 || name.length > 80) return { error: 'Please enter your name (up to 80 characters).' };
  if (message.length < 10 || message.length > 1500) return { error: 'Please write between 10 and 1,500 characters of feedback.' };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: 'Please choose a rating from 1 to 5.' };
  return { data: { name, message, rating } };
}
