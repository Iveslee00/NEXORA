import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const heroPreview = read('modules/preview/HeroPreview.tsx');
const heroCarouselPreview = read('modules/preview/HeroCarouselPreview.tsx');
const titlePreview = read('modules/preview/TitlePreview.tsx');
const faqPreview = read('modules/preview/FaqPreview.tsx');
const logoPreview = read('modules/preview/LogoWallPreview.tsx');
const productGridPreview = read('modules/preview/ProductGridPreview.tsx');
const productCarouselPreview = read('modules/preview/ProductCarouselPreview.tsx');
const bannerProductsPreview = read('modules/preview/BannerProductsPreview.tsx');
const productBannerPreview = read('modules/preview/ProductBannerPreview.tsx');
const heroExporter = read('modules/exporters/heroExporter.ts');
const heroCarouselExporter = read('modules/exporters/heroCarouselExporter.ts');
const productGridExporter = read('modules/exporters/productGridExporter.ts');
const productCarouselExporter = read('modules/exporters/productCarouselExporter.ts');
const bannerProductsExporter = read('modules/exporters/bannerProductsExporter.ts');
const css = read('lib/export/cssGenerator.ts');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:general-campaign-visual-upgrade"', 'package.json should expose verify:general-campaign-visual-upgrade'],
  [heroPreview, 'heroDepthLayer', 'KV preview should include depth layer treatment'],
  [titlePreview, 'titleHaloLayer', 'Title preview should include halo layer treatment'],
  [faqPreview, 'faqSignalLine', 'FAQ preview should include signal line treatment'],
  [heroExporter, 'cb-hero__depth-layer', 'KV exporter should output depth layer element'],
  [css, '.cb-hero__depth-layer', 'Export CSS should style KV depth layer'],
  [css, '.cb-title-block__halo', 'Export CSS should style title halo'],
  [css, '.cb-faq__signal', 'Export CSS should style FAQ signal line'],
  [sprintSpec, 'Status：完成第一階段。General / Campaign 模組已補強視覺層次', 'Sprint spec should mark BQ-011 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

for (const [source, message] of [
  [css, 'Export CSS must not include product card signal line'],
  [productGridExporter, 'Product grid export must not output product card signal line'],
  [productCarouselExporter, 'Product carousel export must not output product card signal line'],
  [bannerProductsExporter, 'Banner products export must not output product card signal line'],
]) {
  if (source.includes('cb-product-card__signal')) {
    throw new Error(message);
  }
}

const unsafeOverlayPatterns = [
  [/cb-hero__glass-shell/, 'KV export must not place a glass frame over the image'],
  [/cb-kv__glass-track/, 'KV carousel export must not place a glass track over the image'],
  [/cb-product-banner__glass-panel/, 'Single product export must not place a glass panel over the image'],
  [/cb-banner-products__frame/, 'Banner products export must not place a glass frame over the image'],
  [/cb-logo-wall__frame/, 'Logo wall export must not place a glass frame over logo images'],
  [/singleProductGlassPanel/, 'Single product preview must not place a glass panel over the image'],
  [/bannerCommerceFrame/, 'Banner products preview must not place a glass frame over the image'],
  [/logoGlassFrame/, 'Logo wall preview must not place a glass frame over logo images'],
];

for (const [pattern, message] of unsafeOverlayPatterns) {
  if (
    pattern.test(css) ||
    pattern.test(heroExporter) ||
    pattern.test(heroCarouselExporter) ||
    pattern.test(productBannerPreview) ||
    pattern.test(bannerProductsPreview) ||
    pattern.test(logoPreview)
  ) {
    throw new Error(message);
  }
}

console.log('General and Campaign visual upgrade verification passed.');
