import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const types = read('types/modules.ts');
const previewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const registry = read('lib/modules/moduleRegistry.ts');
const css = read('lib/export/cssGenerator.ts');

const moduleTypeBlock = types.match(/export type ModuleType =([\s\S]*?);/);
assert(moduleTypeBlock, 'ModuleType union should be readable');
const moduleTypes = [...moduleTypeBlock[1].matchAll(/\|\s*'([^']+)'/g)].map((match) => match[1]);

const contracts = {
  'title': { exporter: 'modules/exporters/titleExporter.ts', root: 'cb-title-block' },
  'hero': { exporter: 'modules/exporters/heroExporter.ts', root: 'cb-hero' },
  'split-section': { exporter: 'modules/exporters/splitSectionExporter.ts', root: 'cb-split' },
  'product-grid': { exporter: 'modules/exporters/productGridExporter.ts', root: 'cb-products' },
  'banner-products': { exporter: 'modules/exporters/bannerProductsExporter.ts', root: 'cb-banner-products' },
  'product-banner': { exporter: 'modules/exporters/productBannerExporter.ts', root: 'cb-product-banner' },
  'product-carousel': { exporter: 'modules/exporters/productCarouselExporter.ts', root: 'cb-carousel' },
  'logo-wall': { exporter: 'modules/exporters/logoWallExporter.ts', root: 'cb-logo-wall' },
  'cta': { exporter: 'modules/exporters/ctaExporter.ts', root: 'cb-cta' },
  'faq': { exporter: 'modules/exporters/faqExporter.ts', root: 'cb-faq' },
  'sticky-sidebar': { exporter: 'modules/exporters/stickySidebarExporter.ts', root: 'cb-sticky-sidebar' },
  'article-text': { exporter: 'modules/exporters/articleTextExporter.ts', root: 'cb-article-text' },
  'article-image': { exporter: 'modules/exporters/articleImageExporter.ts', root: 'cb-article-image' },
  'hero-carousel': { exporter: 'modules/exporters/heroCarouselExporter.ts', root: 'cb-kv' },
  'bank-promo': { exporter: 'modules/exporters/bankPromoExporter.ts', root: 'cb-bank-promo' },
  'anchor-nav': { exporter: 'modules/exporters/anchorNavExporter.ts', root: 'cb-anchor-nav' },
  'product-features': { exporter: 'modules/exporters/productFeaturesExporter.ts', root: 'cb-product-features' },
  'product-showcase': { exporter: 'modules/exporters/productShowcaseExporter.ts', root: 'cb-product-showcase' },
  'product-scenes': { exporter: 'modules/exporters/productScenesExporter.ts', root: 'cb-product-scenes' },
  'product-info': { exporter: 'modules/exporters/productInfoExporter.ts', root: 'cb-product-info' },
  'product-benefits': { exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-benefits' },
  'product-steps': { exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-steps' },
  'product-comparison': { exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-comparison' },
  'product-proof': { exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-proof' },
  'product-purchase': { exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-purchase' },
};

assert(previewRenderer.includes('SharedModuleView'), 'Preview renderer should route all modules through SharedModuleView');
assert(!/import\s+\{[^}]*Preview[^}]*\}\s+from\s+'\.\//.test(previewRenderer), 'Preview renderer should not import per-module preview components');

for (const type of moduleTypes) {
  const contract = contracts[type];
  assert(contract, `Missing module export parity contract for ${type}`);

  const exporter = read(contract.exporter);
  const rootSelector = `.${contract.root}`;

  assert(previewRenderer.includes(`'${type}'`), `Preview renderer missing ${type}`);
  assert(registry.includes(`'${type}'`), `Module registry missing ${type}`);
  assert(exporter.includes(contract.root), `Exporter for ${type} should output root class ${contract.root}`);
  assert(css.includes(rootSelector), `Export CSS for ${type} should include root selector ${rootSelector}`);
}

const productFeaturesExporter = read(contracts['product-features'].exporter);
assert(
  productFeaturesExporter.includes('cb-product-features__content'),
  'Product features exporter should wrap title and text in .cb-product-features__content to match preview DOM'
);
assert(
  productFeaturesExporter.indexOf('cb-product-features__icon') < productFeaturesExporter.indexOf('cb-product-features__content'),
  'Product features exporter should render icon before content wrapper'
);
assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__item') &&
    css.includes('grid-template-columns: 52px 1fr'),
  'Product features icon-text CSS should use icon + content columns'
);
assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__icon') &&
    css.includes('margin-bottom: 0'),
  'Product features icon-text CSS should remove icon bottom margin'
);
assert(css.includes('.cb-product-features__content'), 'Product features CSS should include content wrapper scope');

const heroCssStart = css.indexOf('.cb-hero {');
const splitCssStart = css.indexOf('/* ------------------------------------------------------------\n   5. SPLIT CONTENT MODULE');
assert(heroCssStart >= 0 && splitCssStart > heroCssStart, 'Hero export CSS block should be readable');
const heroCss = css.slice(heroCssStart, splitCssStart);
assert(!heroCss.includes('.cb-hero__media::after'), 'KV export CSS should not reintroduce a media overlay pseudo-element');
assert(!/rgba\(0,\s*0,\s*0,\s*0\.[3-9]\)/.test(heroCss), 'KV export CSS should not include a dark black overlay');

assert(
  css.includes('.cb-product-showcase--split .cb-product-showcase__content') &&
    css.includes('padding: 36px 38px') &&
    css.includes('border-radius: 32px'),
  'Product showcase split export should use a padded rounded text card'
);
assert(
  css.includes('.cb-product-showcase--spacious .cb-product-showcase__media { width: min(680px, 100%)'),
  'Product showcase spacious export should constrain image width'
);

const productAdvancedExporter = read(contracts['product-purchase'].exporter);
assert(
  productAdvancedExporter.includes('const visibleProducts = data.products.slice(0, 4);'),
  'Product purchase exporter should render up to four purchase cards'
);
assert(
  css.includes('.cb-product-purchase--bundle .cb-product-purchase__grid { grid-template-columns: repeat(4'),
  'Product purchase bundle export CSS should use four desktop columns'
);

const genericClassRegex = /(^|\n)\s*\.(title|image|button|container)\b/;
assert(!genericClassRegex.test(css), 'Export CSS should not define generic .title/.image/.button/.container classes');

console.log('Module export parity verified for all modules.');
