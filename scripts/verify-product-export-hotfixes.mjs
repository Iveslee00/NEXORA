import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const css = read('lib/export/cssGenerator.ts');
const pkg = JSON.parse(read('package.json'));
const heroPreview = read('modules/preview/HeroPreview.tsx');
const carouselPreview = read('modules/preview/HeroCarouselPreview.tsx');
const showcasePreview = read('modules/preview/ProductShowcasePreview.tsx');
const showcaseForm = read('modules/forms/ProductShowcaseForm.tsx');
const showcaseExporter = read('modules/exporters/productShowcaseExporter.ts');
const advancedExporter = read('modules/exporters/productAdvancedExporter.ts');
const productTypes = read('types/modules.ts');
const productThemes = read('lib/productBuilder/productThemes.ts');

assert(
  pkg.scripts['verify:product-export-hotfixes'] === 'node --no-warnings scripts/verify-product-export-hotfixes.mjs',
  'package.json should expose verify:product-export-hotfixes'
);

assert(!/\.cb-hero::after\s*\{[\s\S]*?linear-gradient\(90deg,\s*rgba\(15,23,42/.test(css), 'Export KV should not add a black gradient overlay');
assert(!/\.cb-kv__slide:not\(\.cb-kv__slide--image-only\)::after\s*\{/.test(css), 'Export KV carousel should not add a black gradient overlay');
assert(!/linear-gradient\(90deg,\s*rgba\(15,23,42,0\.(46|48)/.test(heroPreview), 'KV preview should not add desktop black gradient over image');
assert(!/linear-gradient\(90deg,\s*rgba\(15,23,42,0\.(46|48)/.test(carouselPreview), 'KV carousel preview should not add desktop black gradient over image');

assert(!/ProductShowcaseStyle = 'full-bleed'/.test(productTypes), 'Product showcase type should remove full-bleed style');
assert(!showcaseForm.includes('滿版形象'), 'Product showcase form should remove full-screen image style');
assert(!/showcaseStyle:\s*'full-bleed'/.test(productThemes), 'Product builder themes should not generate full-bleed showcase style');
assert(showcasePreview.includes('normalizeProductShowcaseStyle'), 'Product showcase preview should normalize old full-bleed data');
assert(showcaseExporter.includes('normalizeProductShowcaseStyle'), 'Product showcase exporter should normalize old full-bleed data');

assert(
  /\.cb-product-showcase--split \.cb-product-showcase__content\s*\{[\s\S]*padding:\s*36px 38px;[\s\S]*border-radius:\s*32px;[\s\S]*background:\s*rgba\(255,255,255,0\.84\)/.test(css),
  'Split showcase text panel should have premium spacing, radius, and surface'
);
assert(
  css.includes('.cb-product-showcase--spacious .cb-product-showcase__media { width: min(680px, 100%); margin-left: auto; margin-right: auto; }'),
  'Spacious showcase media should be constrained instead of filling the whole section'
);

assert(
  advancedExporter.includes('const visibleProducts = data.products.slice(0, 4);'),
  'Bundle purchase export should match preview by limiting to four products'
);
assert(
  css.includes('.cb-product-purchase--bundle .cb-product-purchase__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: stretch; }'),
  'Bundle purchase export should use a stable four-card grid'
);
assert(
  /\.cb-product-purchase__button\s*\{[^}]*background:\s*\$\{btnColor\};[^}]*color:\s*\$\{btnTextColor\};/s.test(css),
  'Product purchase buttons should use global button color and button text color'
);
assert(
  !/\.cb-product-purchase__button\s*\{[^}]*background:\s*#ffffff;[^}]*color:\s*#0f172a;/s.test(css),
  'Product purchase buttons must not be hard-coded as white buttons'
);
assert(
  css.includes('.cb-page a.cb-product-purchase__card { color: #0f172a; }') &&
    css.includes('.cb-product-purchase__name { display: block; margin-bottom: 8px; font-size: 1rem; font-weight: 850; color: #0f172a; line-height: 1.35; }') &&
    css.includes('.cb-product-purchase__brand { display: block; margin-bottom: 4px; font-size: 12px; font-weight: 750; color: #64748b; }') &&
    css.includes('.cb-product-purchase__price { display: block; font-weight: 900; color: #ef4444; }'),
  'Product purchase cards should use fixed product-card text colors instead of inheriting section colors'
);

assert(css.includes('.cb-product-features__item {') && css.includes('min-width: 0;'), 'Product feature export cards should prevent grid overflow');
assert(css.includes('.cb-product-features--icon-text .cb-product-features__item {') && css.includes('border-radius: 24px;'), 'Icon-text product features should not export as oversized pills');
assert(
  /@media \(max-width: 768px\)[\s\S]*\.cb-product-features--icon-text \.cb-product-features__item\s*\{[\s\S]*grid-template-columns:\s*44px 1fr;/.test(css),
  'Mobile product features should keep icon-text layout controlled'
);

console.log('Product export hotfixes verified.');
