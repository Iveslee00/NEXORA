import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const packageJson = JSON.parse(read('package.json'));
const types = read('types/modules.ts');
const registry = read('lib/modules/moduleRegistry.ts');
const previewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const css = read('lib/export/cssGenerator.ts');
const exporterSource = fs
  .readdirSync('modules/exporters')
  .filter((file) => file.endsWith('.ts'))
  .map((file) => read(`modules/exporters/${file}`))
  .join('\n');
const moduleStandard = read('docs/module-development-standard.md');
const architectureDoc = read('docs/module-rendering-export-architecture.md');

const typeMatch = types.match(/export type ModuleType =([\s\S]*?);/);
assert(typeMatch, 'ModuleType union should be readable');

const moduleTypes = [...typeMatch[1].matchAll(/\|\s*'([^']+)'/g)].map((match) => match[1]);

const rootClassByType = {
  'title': 'cb-title-block',
  'hero': 'cb-hero',
  'split-section': 'cb-split',
  'product-grid': 'cb-products',
  'banner-products': 'cb-banner-products',
  'product-banner': 'cb-product-banner',
  'product-carousel': 'cb-carousel',
  'logo-wall': 'cb-logo-wall',
  'cta': 'cb-cta',
  'faq': 'cb-faq',
  'sticky-sidebar': 'cb-sticky-sidebar',
  'article-text': 'cb-article-text',
  'article-image': 'cb-article-image',
  'hero-carousel': 'cb-kv',
  'bank-promo': 'cb-bank-promo',
  'anchor-nav': 'cb-anchor-nav',
  'product-features': 'cb-product-features',
  'product-showcase': 'cb-product-showcase',
  'product-scenes': 'cb-product-scenes',
  'product-info': 'cb-product-info',
  'product-benefits': 'cb-product-benefits',
  'product-steps': 'cb-product-steps',
  'product-comparison': 'cb-product-comparison',
  'product-proof': 'cb-product-proof',
  'product-purchase': 'cb-product-purchase',
};

assert(
  packageJson.scripts['verify:full-module-export-stability'] ===
    'node --no-warnings scripts/verify-full-module-export-stability.mjs',
  'package.json should expose verify:full-module-export-stability'
);
assert(
  packageJson.scripts['verify:module-export-parity'] ===
    'node --no-warnings scripts/verify-module-export-parity.mjs',
  'package.json should expose verify:module-export-parity'
);

for (const type of moduleTypes) {
  assert(rootClassByType[type], `Missing root class mapping for module type: ${type}`);
  assert(registry.includes(`'${type}'`), `moduleRegistry missing module type: ${type}`);
  assert(previewRenderer.includes(`'${type}'`), `previewRegistry missing module type: ${type}`);

  const rootClass = rootClassByType[type];
  assert(exporterSource.includes(rootClass), `Exporter output missing root class ${rootClass} for ${type}`);
  assert(css.includes(`.${rootClass}`), `Export CSS missing root scope .${rootClass} for ${type}`);
}

const builderOnlyClasses = [
  'builder-canvas',
  'module-wrapper',
  'selected',
  'drag-handle',
  'resize-handle',
  'editor-toolbar',
];
for (const className of builderOnlyClasses) {
  assert(!css.includes(`.${className}`), `Export CSS should not include builder-only class .${className}`);
  assert(!exporterSource.includes(className), `Export HTML should not include builder-only class ${className}`);
}

const genericClassRegex = /(^|\n)\s*\.(title|image|button|container)\b/;
assert(!genericClassRegex.test(css), 'Export CSS should not define generic .title/.image/.button/.container classes');

const mobileCss = css.slice(css.indexOf('@media (max-width: 768px)'));
const mobileRequiredTypes = [
  'hero',
  'split-section',
  'product-grid',
  'banner-products',
  'product-banner',
  'product-carousel',
  'logo-wall',
  'article-image',
  'hero-carousel',
  'bank-promo',
  'product-features',
  'product-showcase',
  'product-scenes',
  'product-info',
  'product-benefits',
  'product-steps',
  'product-comparison',
  'product-proof',
  'product-purchase',
];
for (const type of mobileRequiredTypes) {
  const rootClass = rootClassByType[type];
  assert(mobileCss.includes(rootClass), `Mobile export CSS should include ${rootClass}`);
}

const parityRules = [
  ['cb-product-features__content', 'Product features export should wrap title/text content like preview'],
  ['.cb-product-features--icon-text .cb-product-features__icon { margin-bottom: 0; }', 'Product feature icon-text export should remove icon bottom margin'],
  ['cb-product-purchase--bundle .cb-product-purchase__grid { grid-template-columns: repeat(4', 'Bundle purchase should export four-column desktop grid'],
  ['data.products.slice(0, 4)', 'Bundle purchase exporter should match preview visible item count'],
  ['cb-product-comparison__cell::before', 'Product comparison should expose mobile column labels'],
  ['cb-product-showcase--spacious .cb-product-showcase__media { width: min(', 'Spacious showcase image should be constrained'],
  ['cb-product-showcase--split .cb-product-showcase__content', 'Split showcase should have a styled text card'],
  ['cb-product-features--cards .cb-product-features__item', 'Product feature card style should differ from grid style'],
];
for (const [needle, message] of parityRules) {
  assert((css + exporterSource).includes(needle), message);
}

assert(
  moduleStandard.includes('npm run verify:full-module-export-stability'),
  'Module development standard should list the full module verifier'
);
assert(
  architectureDoc.includes('verify:full-module-export-stability'),
  'Rendering architecture doc should mention the full module verifier'
);

console.log('Full module export stability verified.');
