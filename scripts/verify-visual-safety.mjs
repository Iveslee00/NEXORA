import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const css = read('lib/export/cssGenerator.ts');
const heroExporter = read('modules/exporters/heroExporter.ts');
const heroCarouselExporter = read('modules/exporters/heroCarouselExporter.ts');
const productShowcaseExporter = read('modules/exporters/productShowcaseExporter.ts');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const requiredTokens = [
  [packageJson, '"verify:visual-safety"', 'package.json should expose verify:visual-safety'],
  [css, '.cb-hero__content', 'Hero content layer should be present'],
  [css, '.cb-kv__text', 'KV carousel text layer should be present'],
  [css, '.cb-banner-products__banner-overlay', 'Banner products text overlay should be present'],
  [css, '.cb-product-showcase__content', 'Product showcase content layer should be present'],
  [css, '.cb-product-scenes--full-bleed .cb-product-scenes__content', 'Product scenes full-bleed content layer should be present'],
  [sprintSpec, 'Hotfix：大面積覆蓋圖片的玻璃層不得使用 `backdrop-filter`', 'Sprint spec should document no large blur overlays'],
  [sprintSpec, 'Hotfix：商品展示 / 大圖展示的重疊版型，文字卡層級必須高於圖片媒體層', 'Sprint spec should document media/content layer safety'],
];

for (const [source, token, message] of requiredTokens) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

const unsafeLargeBlurPatterns = [
  [/\.cb-hero__glass-shell\s*\{[^}]*backdrop-filter/s, 'KV glass shell must not blur the banner image'],
  [/\.cb-kv__glass-track\s*\{[^}]*backdrop-filter/s, 'KV carousel glass track must not blur the banner image'],
  [/\.cb-product-banner__glass-panel\s*\{[^}]*backdrop-filter/s, 'Single product image glass panel must not blur the product image'],
  [/\.cb-product-showcase__ambient-panel\s*\{[^}]*backdrop-filter/s, 'Product showcase ambient panel must not blur the product image'],
  [/\.cb-banner-products__frame\s*\{[^}]*backdrop-filter/s, 'Banner products frame must not blur the banner image'],
  [/\.cb-logo-wall__frame\s*\{[^}]*backdrop-filter/s, 'Logo wall frame must not blur logos'],
];

for (const [pattern, message] of unsafeLargeBlurPatterns) {
  if (pattern.test(css)) {
    throw new Error(message);
  }
}

const imageGlassOverlayTokens = [
  [heroExporter, 'cb-hero__glass-shell', 'KV export must not place a glass frame over the image'],
  [heroCarouselExporter, 'cb-kv__glass-track', 'KV carousel export must not place a glass track over the image'],
  [productShowcaseExporter, 'cb-product-showcase__ambient-panel', 'Product showcase export must not place an ambient glass panel over the image'],
  [productShowcaseExporter, 'cb-product-showcase__floating-badge', 'Product showcase export must not place a glass badge over the image'],
  [css, '.cb-hero__glass-shell', 'Export CSS must not include KV image glass frame styles'],
  [css, '.cb-kv__glass-track', 'Export CSS must not include KV carousel image glass track styles'],
  [css, '.cb-product-showcase__ambient-panel', 'Export CSS must not include product showcase image glass panel styles'],
  [css, '.cb-product-showcase__floating-badge', 'Export CSS must not include product showcase image glass badge styles'],
];

for (const [source, token, message] of imageGlassOverlayTokens) {
  if (source.includes(token)) {
    throw new Error(message);
  }
}

const requiredLayerRules = [
  [/\.cb-hero__content\s*\{[^}]*z-index:\s*4\b/s, 'Hero content must render above hero media'],
  [/\.cb-kv__text\s*\{[^}]*z-index:\s*2\b/s, 'KV carousel text must render above carousel image overlay'],
  [/\.cb-banner-products__banner-overlay\s*\{[^}]*z-index:\s*1\b/s, 'Banner products copy overlay must render above banner image'],
  [/\.cb-product-showcase__media\s*\{[^}]*z-index:\s*1\b/s, 'Product showcase media must stay behind overlapping text card'],
  [/\.cb-product-showcase__content\s*\{[^}]*z-index:\s*4\b/s, 'Product showcase content must render above media'],
  [/\.cb-product-showcase--luxury \.cb-product-showcase__content\s*\{[^}]*z-index:\s*5\b/s, 'Luxury showcase content must render above media'],
  [/\.cb-product-scenes--full-bleed \.cb-product-scenes__content\s*\{[^}]*z-index:\s*2\b/s, 'Full-bleed product scene content must render above scene image'],
];

for (const [pattern, message] of requiredLayerRules) {
  if (!pattern.test(css)) {
    throw new Error(message);
  }
}

console.log('Visual safety verification passed.');
