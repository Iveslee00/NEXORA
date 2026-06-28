import fs from 'node:fs';

const storePath = 'lib/assets/localImageStore.ts';
const previewPath = 'modules/preview/PreviewImage.tsx';
const formPath = 'components/ui/FormField.tsx';
const packagePath = 'lib/export/packageGenerator.ts';
const exportPath = 'components/editor/ExportModal.tsx';
const sanitizerPath = 'lib/export/pasteCodeSanitizer.ts';

for (const file of [storePath, previewPath, formPath, packagePath, exportPath, sanitizerPath]) {
  if (!fs.existsSync(file)) throw new Error(`Missing file for local image storage: ${file}`);
}

const store = fs.readFileSync(storePath, 'utf8');
const preview = fs.readFileSync(previewPath, 'utf8');
const form = fs.readFileSync(formPath, 'utf8');
const pack = fs.readFileSync(packagePath, 'utf8');
const exportModal = fs.readFileSync(exportPath, 'utf8');
const sanitizer = fs.readFileSync(sanitizerPath, 'utf8');

[
  'local-image://',
  'storeLocalImage',
  'getLocalImage',
  'resolveLocalImageUrl',
  'indexedDB',
].forEach((token) => {
  if (!store.includes(token)) throw new Error(`localImageStore missing token: ${token}`);
});

if (!form.includes('storeLocalImage') || !form.includes('isLocalImageRef')) {
  throw new Error('ImageField should store uploads as local-image references.');
}

if (!preview.includes('resolveLocalImageUrl')) {
  throw new Error('PreviewImage should resolve local-image references for display.');
}

if (!preview.includes('const canRenderImage =') || !preview.includes('!isLocal')) {
  throw new Error('PreviewImage should not render raw local-image references before resolution.');
}

if (!pack.includes('rewriteLocalImages') || !pack.includes('getLocalImage')) {
  throw new Error('ZIP package generator should rewrite local images into images/.');
}

if (!exportModal.includes('await generateCampaignPackage')) {
  throw new Error('Export modal should await async package generation.');
}

if (!sanitizer.includes('localImageUrlPattern')) {
  throw new Error('Paste sanitizer should strip local-image references for CMS paste code.');
}

console.log('Local image store verification passed.');
