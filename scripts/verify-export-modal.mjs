import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const exportModal = readFileSync('components/editor/ExportModal.tsx', 'utf8');
const packageGenerator = readFileSync('lib/export/packageGenerator.ts', 'utf8');

assert(
  exportModal.includes('const codePanelClass ='),
  'Export modal should centralize code panel styling'
);
assert(
  exportModal.includes('const codePreClass ='),
  'Export modal should centralize code pre styling'
);
assert(
  exportModal.includes("import { stripDataImageUrlsForPaste } from '@/lib/export/pasteCodeSanitizer';"),
  'Export modal should sanitize uploaded images for paste-code output'
);
assert(
  exportModal.includes('const pasteHtml = stripDataImageUrlsForPaste(code.html);'),
  'Paste-code HTML should strip uploaded image data URLs'
);
assert(
  exportModal.includes('const pasteCss = stripDataImageUrlsForPaste(code.css);'),
  'Paste-code CSS should strip uploaded image data URLs'
);
assert(
  exportModal.includes('const campaignParts = splitCampaignCode(pasteHtml);'),
  'Campaign paste-code tabs should use sanitized HTML'
);
assert(
  exportModal.includes('const cssCode = `<style>\\n${pasteCss}\\n</style>`;'),
  'Campaign paste-code CSS should use sanitized CSS'
);
assert(
  exportModal.includes('generateCampaignPackage(code.html, code.css)'),
  'ZIP export should still receive original code so uploaded images can become images/ files'
);
assert(
  packageGenerator.includes('const path = `images/image-'),
  'ZIP export should rewrite uploaded images into the images folder'
);
assert(
  exportModal.includes('whitespace-pre-wrap'),
  'Export code previews should preserve indentation while wrapping long lines'
);
assert(
  exportModal.includes('break-all'),
  'Export code previews should break long base64/data URL strings'
);
assert(
  !exportModal.includes('whitespace-pre overflow-x-auto'),
  'Export code previews should not rely on horizontal scrolling for long uploaded image URLs'
);

console.log('export modal verified');
