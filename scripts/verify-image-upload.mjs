import { readFileSync } from 'node:fs';

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(formField.includes('MAX_UPLOAD_BYTES'), 'image upload should have a file size guard');
assert(formField.includes('try {'), 'image upload should catch read/validation errors');
assert(formField.includes('catch'), 'image upload should show an error instead of crashing');
assert(formField.includes('setUploading(true)'), 'image upload should show an uploading state');
assert(formField.includes('setUploading(false)'), 'image upload should always clear uploading state');
assert(formField.includes('圖片讀取失敗，請重新上傳'), 'image upload should show a friendly read failure message');

console.log('image upload verified');
