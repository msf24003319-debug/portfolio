import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImageFile, MAX_IMAGE_BYTES, imageUploadError } from '../lib/project-images.mjs';

test('supported image files use a safe extension and accept the size limit', () => {
  for (const [type, extension] of [['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/gif', 'gif']]) {
    assert.equal(validateImageFile({ type, size: MAX_IMAGE_BYTES }), extension);
  }
});

test('storage errors distinguish missing setup, denied access, limits, and other failures', () => {
  assert.match(imageUploadError({ message: 'Bucket not found', statusCode: '404' }), /project_image_uploads.sql/);
  assert.match(imageUploadError({ message: 'new row violates row-level security policy', statusCode: '403' }), /sign out and sign back in/);
  assert.match(imageUploadError({ message: 'Payload too large', statusCode: '413' }), /5 MB/);
  assert.equal(imageUploadError({ message: 'Network request failed' }), 'Image upload failed: Network request failed');
});

test('unsupported types, empty images, and oversized uploads are rejected', () => {
  for (const file of [null, { type: 'image/svg+xml', size: 20 }, { type: 'text/plain', size: 20 }, { type: 'image/png', size: 0 }, { type: 'image/png', size: MAX_IMAGE_BYTES + 1 }]) {
    assert.throws(() => validateImageFile(file));
  }
});
