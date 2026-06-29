import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const builder = read('lib/productBuilder/productPageBuilder.ts');
const showcasePreview = read('modules/preview/ProductShowcasePreview.tsx');
const featuresPreview = read('modules/preview/ProductFeaturesPreview.tsx');
const advancedPreview = read('modules/preview/ProductAdvancedPreview.tsx');
const showcaseExporter = read('modules/exporters/productShowcaseExporter.ts');
const featuresExporter = read('modules/exporters/productFeaturesExporter.ts');
const advancedExporter = read('modules/exporters/productAdvancedExporter.ts');
const css = read('lib/export/cssGenerator.ts');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:product-page-visual-upgrade"', 'package.json should expose verify:product-page-visual-upgrade'],
  [builder, 'conversionIntent', 'Quick Builder output should include conversion-oriented copy'],
  [builder, 'visualHook', 'Quick Builder output should include visual hook copy'],
  [builder, 'proofHook', 'Quick Builder output should include proof hook copy'],
  [showcasePreview, 'floatingGlassBadge', 'Product showcase preview should include floating glass badge'],
  [showcasePreview, 'ambientPanel', 'Product showcase preview should include ambient panel'],
  [featuresPreview, 'featureIndexBadge', 'Product features preview should include index badge treatment'],
  [featuresPreview, 'featureTextureLayer', 'Product features preview should include texture layer'],
  [advancedPreview, 'benefitSignalBar', 'Benefits preview should include signal bar'],
  [advancedPreview, 'purchaseGlowFrame', 'Purchase preview should include glow frame'],
  [showcaseExporter, 'cb-product-showcase__floating-badge', 'Showcase exporter should output floating badge element'],
  [showcaseExporter, 'cb-product-showcase__ambient-panel', 'Showcase exporter should output ambient panel element'],
  [featuresExporter, 'cb-product-features__index', 'Features exporter should output feature index'],
  [advancedExporter, 'cb-product-benefits__signal', 'Benefits exporter should output signal bar'],
  [advancedExporter, 'cb-product-purchase__glow', 'Purchase exporter should output glow layer'],
  [css, '.cb-product-showcase__floating-badge', 'Export CSS should style floating showcase badge'],
  [css, '.cb-product-showcase__ambient-panel', 'Export CSS should style showcase ambient panel'],
  [css, '.cb-product-features__index', 'Export CSS should style feature index badges'],
  [css, '.cb-product-benefits__signal', 'Export CSS should style benefit signal bars'],
  [css, '.cb-product-purchase__glow', 'Export CSS should style purchase glow layer'],
  [css, 'backdrop-filter: blur(18px) saturate(1.2)', 'Export CSS should use liquid glass depth on product modules'],
  [sprintSpec, 'Status：完成第一階段。快速建立輸出與商品頁模組已補強視覺層次', 'Sprint spec should mark BQ-008/BQ-010 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Product page visual upgrade verification passed.');
