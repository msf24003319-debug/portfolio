export const PROJECT_IMAGE_BUCKET = 'project-images';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export function validateImageFile(file) {
  if (!file || !Object.hasOwn(IMAGE_TYPES, file.type)) throw new Error('Choose a JPG, PNG, WebP, or GIF image.');
  if (!Number.isInteger(file.size) || file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error('Choose an image between 1 byte and 5 MB.');
  return IMAGE_TYPES[file.type];
}

export function imageUploadError(error) {
  const message = String(error?.message ?? 'Unknown storage error');
  const code = String(error?.statusCode ?? error?.status ?? '');
  if (/bucket.*not found|bucket.*does not exist/i.test(message)) {
    return 'Image storage is not set up. Run supabase/migrations/20261007_project_image_uploads.sql in your Supabase SQL editor, then retry.';
  }
  if (code === '401' || code === '403' || /row.level security|unauthorized|permission denied|invalid.*jwt|jwt.*expired/i.test(message)) {
    return 'Image upload permission denied. Apply the image storage migration, then sign out and sign back in with your portfolio admin account.';
  }
  if (code === '413' || /size|too large|mime|content.type/i.test(message)) {
    return 'Image rejected by Storage. Use a JPG, PNG, WebP, or GIF up to 5 MB and check the project-images bucket file restrictions.';
  }
  return `Image upload failed: ${message}`;
}
