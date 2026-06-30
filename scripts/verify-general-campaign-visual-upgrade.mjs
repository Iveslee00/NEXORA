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
const css = read('lib/export/cssGenerator.ts');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:general-campaign-visual-upgrade"', 'package.json should expose verify:general-campaign-visual-upgrade'],
  [heroPreview, 'heroGlassShell', 'KV preview should include glass shell treatment'],
  [heroPreview, 'heroDepthLayer', 'KV preview should include depth layer treatment'],
  [heroCarouselPreview, 'carouselGlassTrack', 'KV carousel preview should include glass track treatment'],
  [titlePreview, 'titleHaloLayer', 'Title preview should include halo layer treatment'],
  [faqPreview, 'faqSignalLine', 'FAQ preview should include signal line treatment'],
  [logoPreview, 'logoGlassFrame', 'Logo wall preview should include glass frame treatment'],
  [productGridPreview, 'campaignProductSignal', 'Product grid preview should include campaign product signal'],
  [productCarouselPreview, 'carouselProductSignal', 'Product carousel preview should include carousel product signal'],
  [bannerProductsPreview, 'bannerCommerceFrame', 'Banner + products preview should include commerce frame treatment'],
  [productBannerPreview, 'singleProductGlassPanel', 'Single product preview should include glass panel treatment'],
  [heroExporter, 'cb-hero__depth-layer', 'KV exporter should output depth layer element'],
  [heroExporter, 'cb-hero__glass-shell', 'KV exporter should output glass shell element'],
  [heroCarouselExporter, 'cb-kv__glass-track', 'KV carousel exporter should output glass track element'],
  [css, '.cb-hero__depth-layer', 'Export CSS should style KV depth layer'],
  [css, '.cb-hero__glass-shell', 'Export CSS should style KV glass shell'],
  [css, '.cb-kv__glass-track', 'Export CSS should style KV carousel glass track'],
  [css, '.cb-title-block__halo', 'Export CSS should style title halo'],
  [css, '.cb-product-card__signal', 'Export CSS should style campaign product signals'],
  [css, '.cb-banner-products__frame', 'Export CSS should style banner commerce frame'],
  [css, '.cb-product-banner__glass-panel', 'Export CSS should style single product glass panel'],
  [css, '.cb-logo-wall__frame', 'Export CSS should style logo wall glass frame'],
  [css, '.cb-faq__signal', 'Export CSS should style FAQ signal line'],
  [css, 'box-shadow: inset 0 1px 0 rgba(255,255,255,0.16)', 'Export CSS should include safe glass depth without blurring banner images'],
  [sprintSpec, 'Status：完成第一階段。General / Campaign 模組已補強視覺層次', 'Sprint spec should mark BQ-011 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

const unsafeOverlayPatterns = [
  [/\.cb-hero__glass-shell\s*\{[^}]*backdrop-filter/s, 'KV glass shell must not blur the banner image'],
  [/\.cb-kv__glass-track\s*\{[^}]*backdrop-filter/s, 'KV carousel glass track must not blur the banner image'],
  [/\.cb-product-banner__glass-panel\s*\{[^}]*backdrop-filter/s, 'Single product image glass panel must not blur the product image'],
];

for (const [pattern, message] of unsafeOverlayPatterns) {
  if (pattern.test(css)) {
    throw new Error(message);
  }
}

console.log('General and Campaign visual upgrade verification passed.');
