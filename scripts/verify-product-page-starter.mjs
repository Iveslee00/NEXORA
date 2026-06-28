import fs from 'node:fs';

const builderPath = 'lib/productBuilder/productPageBuilder.ts';
const themePath = 'lib/productBuilder/productThemes.ts';
const modalPath = 'components/editor/ProductBuildModal.tsx';
const placeholderPath = 'modules/preview/PreviewImage.tsx';
const showcasePath = 'modules/preview/ProductShowcasePreview.tsx';
const featuresPath = 'modules/preview/ProductFeaturesPreview.tsx';
const docsPath = 'docs/product-page-starter-spec.md';

for (const file of [builderPath, themePath, modalPath, placeholderPath, showcasePath, featuresPath, docsPath]) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing Product Page Starter file: ${file}`);
  }
}

const builder = fs.readFileSync(builderPath, 'utf8');
const themes = fs.readFileSync(themePath, 'utf8');
const modal = fs.readFileSync(modalPath, 'utf8');
const placeholder = fs.readFileSync(placeholderPath, 'utf8');
const showcase = fs.readFileSync(showcasePath, 'utf8');
const features = fs.readFileSync(featuresPath, 'utf8');
const spec = fs.readFileSync(docsPath, 'utf8');

[
  'ProductIndustry',
  'ProductGoal',
  'ProductPageTheme',
  'ProductPageLength',
  'buildProductPageModules',
  'resolveProductPageRecipe',
  "'cleaning'",
  "'beauty'",
  "'ecommerce'",
  "'sales'",
  "'launch'",
  "'comparison'",
  "'scenario'",
  "'freshClean'",
  "'luxury'",
  "'promo'",
  "'minimalCommerce'",
  "'quick'",
  "'standard'",
  "'complete'",
].forEach((token) => {
  if (!builder.includes(token) && !themes.includes(token)) {
    throw new Error(`Product Page Starter builder missing token: ${token}`);
  }
});

[
  'ProductThemePreset',
  'productThemePresets',
  'themeVisuals',
  'placeholderTone',
  'cardShadow',
  'sectionBackground',
  'ctaBackground',
].forEach((token) => {
  if (!themes.includes(token)) {
    throw new Error(`Product Page Starter theme preset missing token: ${token}`);
  }
});

if (builder.includes('const themePresets: Record<ProductPageTheme')) {
  throw new Error('Product theme presets should live in productThemes.ts, not productPageBuilder.ts.');
}

[
  '產業 / 線別',
  '商品頁目的',
  '視覺主題',
  '頁面長度',
  '清潔用品',
  '美妝保養',
  '電商綜合',
  '爆品銷售',
  '新品上市',
  '比較說服',
  '情境導購',
].forEach((token) => {
  if (!modal.includes(token)) {
    throw new Error(`Product Page Starter modal missing token: ${token}`);
  }
});

[
  'industry + goal + theme + length = page recipe',
  'Product Page Starter 不應該為每個視覺變體新增模組',
].forEach((token) => {
  if (!spec.includes(token)) {
    throw new Error(`Product Page Starter spec missing token: ${token}`);
  }
});

[
  'recipePreview',
  '即將產生的頁面結構',
  'modules.map',
  'moduleLabels',
  '預估產生',
  'industrySwitchPolicy',
  '套用該產業範例文案',
  '保留價格、CTA 與圖片',
  'missingRequiredHints',
  '缺少商品主圖或背景圖',
  '缺少 CTA 連結',
  '資料已足夠，可建立商品頁',
].forEach((token) => {
  if (!modal.includes(token)) {
    throw new Error(`Product Page Starter modal missing recipe preview token: ${token}`);
  }
});

if (modal.includes('disabled={missingRequiredHints.length > 0}')) {
  throw new Error('Product Page Starter should warn about missing fields without blocking creation.');
}

[
  'themeVisuals',
  'promoRibbon',
  'luxuryFrame',
  'commerceGrid',
  'freshGlow',
].forEach((token) => {
  if (!builder.includes(token) && !showcase.includes(token) && !features.includes(token)) {
    throw new Error(`Product Page Starter visual differentiation missing token: ${token}`);
  }
});

[
  'variant?:',
  'product',
  'scene',
  'hero',
  '商品主圖',
  '設計稿預覽',
].forEach((token) => {
  if (!placeholder.includes(token)) {
    throw new Error(`Product Page Starter placeholder missing token: ${token}`);
  }
});

if (builder.includes("export type ProductPageTheme = 'cleanFresh';")) {
  throw new Error('Product Page Starter is still locked to the old cleanFresh-only theme.');
}

if (modal.includes('清潔用品爆品頁 Demo')) {
  throw new Error('Product Page Starter modal still exposes the old cleaning-only demo title.');
}

console.log('Product Page Starter verification passed.');
