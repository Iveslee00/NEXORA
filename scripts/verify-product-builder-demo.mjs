import fs from 'node:fs';

const requiredFiles = [
  'lib/productBuilder/productPageBuilder.ts',
  'components/editor/ProductBuildModal.tsx',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing product builder demo file: ${file}`);
  }
}

const builder = fs.readFileSync('lib/productBuilder/productPageBuilder.ts', 'utf8');
const modal = fs.readFileSync('components/editor/ProductBuildModal.tsx', 'utf8');
const page = fs.readFileSync('app/page.tsx', 'utf8');
const library = fs.readFileSync('components/editor/ModuleLibrary.tsx', 'utf8');

[
  'createProductLandingModules',
  'cleanFresh',
  'product-banner',
  'split-section',
  'article-text',
  'faq',
  'product-grid',
  'anchor-nav',
  '水氧潔淨',
  '清潔用品',
].forEach((token) => {
  if (!builder.includes(token) && !modal.includes(token)) {
    throw new Error(`Product builder demo missing token: ${token}`);
  }
});

if (!page.includes('ProductBuildModal') || !page.includes('handleCreateFromProduct')) {
  throw new Error('Editor page does not wire the product builder modal.');
}

if (!library.includes('Product') || !library.includes('商品頁')) {
  throw new Error('Module library does not include the product page category.');
}

console.log('Product builder demo verification passed.');
