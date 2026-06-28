import { readFileSync } from 'node:fs';

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(formField.includes('MAX_UPLOAD_BYTES = 25 * 1024 * 1024'), 'image upload should allow practical commercial image files up to 25MB');
assert(formField.includes('try {'), 'image upload should catch read/validation errors');
assert(formField.includes('catch'), 'image upload should show an error instead of crashing');
assert(formField.includes('setUploading(true)'), 'image upload should show an uploading state');
assert(formField.includes('setUploading(false)'), 'image upload should always clear uploading state');
assert(formField.includes('圖片讀取失敗，請重新上傳'), 'image upload should show a friendly read failure message');
assert(formField.includes('圖片暫存失敗'), 'image upload should distinguish local storage failures from read failures');
assert(formField.includes('storeLocalImage(file, size)'), 'image upload should still write successful uploads to IndexedDB local image storage');

console.log('image upload verified');
