import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
};

const sharedModuleView = read('modules/renderers/SharedModuleView.tsx');
const modulePreviewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const previewModal = read('components/editor/PreviewModal.tsx');
const previewCanvas = read('components/editor/PreviewCanvas.tsx');
const splitExporter = read('modules/exporters/splitSectionExporter.ts');
const articleImageExporter = read('modules/exporters/articleImageExporter.ts');
const logoWallExporter = read('modules/exporters/logoWallExporter.ts');
const productGridExporter = read('modules/exporters/productGridExporter.ts');
const productCarouselExporter = read('modules/exporters/productCarouselExporter.ts');
const bannerProductsExporter = read('modules/exporters/bannerProductsExporter.ts');
const heroCarouselExporter = read('modules/exporters/heroCarouselExporter.ts');
const titleExporter = read('modules/exporters/titleExporter.ts');
const moduleSchemas = read('data/moduleSchemas.ts');
const css = read('lib/export/cssGenerator.ts');
const highRiskCss = read('modules/definitions/highRiskModuleDefinitions.ts');
const packageJson = read('package.json');

assert(
  sharedModuleView.includes('initializePreviewCarousels') &&
    sharedModuleView.includes("querySelectorAll<HTMLElement>('.cb-kv')") &&
    sharedModuleView.includes("querySelectorAll<HTMLElement>('.cb-carousel')"),
  'Shared module preview should initialize KV and product carousels'
);

assert(
  sharedModuleView.includes('requestAnimationFrame') &&
    sharedModuleView.includes('handlePreviewClickCapture') &&
    sharedModuleView.includes("closest('a')"),
  'Shared module preview should initialize after layout and block link navigation without blocking carousel controls'
);

assert(
  sharedModuleView.includes("closest('button, input, textarea, select, [role=\"button\"]')") &&
    sharedModuleView.includes('onPointerDownCapture={handlePreviewPointerDownCapture}') &&
    !sharedModuleView.includes('normalizePreviewFaqHtml') &&
    !sharedModuleView.includes('data-nexora-faq-trigger'),
  'Builder shared preview should stop interactive controls from bubbling to module selection without treating FAQ as interactive'
);

assert(
  !sharedModuleView.includes('initializePreviewFaq') &&
    !sharedModuleView.includes("item.classList.toggle('is-open', nextOpen)") &&
    !css.includes('.cb-faq__item.is-open .cb-faq__toggle'),
  'FAQ builder preview should keep native details markup and avoid preview-only DOM rewrites'
);

assert(
  sharedModuleView.includes('expandFaqDetailsForNonExport') &&
    sharedModuleView.includes('cb-faq__item--expanded') &&
    sharedModuleView.includes('data-nexora-static-faq="true"') &&
    !sharedModuleView.includes('openFaqIndexesRef') &&
    !sharedModuleView.includes('restorePreviewFaqDetails') &&
    !sharedModuleView.includes("querySelectorAll<HTMLDetailsElement>('details.cb-faq__item')"),
  'Builder and preview should render FAQ as static expanded content instead of native details'
);

assert(
  modulePreviewRenderer.includes('mode?: ModuleRenderMode') &&
    modulePreviewRenderer.includes('mode =') &&
    modulePreviewRenderer.includes('<SharedModuleView module={module} modules={modules} mode={mode} />') &&
    previewModal.includes('mode="preview"'),
  'Preview modal should pass preview mode through the shared module renderer'
);

assert(
  !previewCanvas.includes('<div className="pointer-events-none select-none overflow-hidden">\\n          <ModulePreviewRenderer module={module} modules={modules} />') &&
    previewCanvas.includes('className="select-none overflow-hidden"'),
  'Builder canvas should not block pointer events for interactive module previews'
);

assert(
  heroCarouselExporter.includes('DOMContentLoaded') &&
    heroCarouselExporter.includes('data-cb-kv-ready') &&
    css.includes('DOMContentLoaded') &&
    css.includes('data-cb-carousel-ready'),
  'Export carousel scripts should initialize after DOM ready and avoid duplicate initialization'
);

assert(
  splitExporter.includes("renderImagePlaceholder('圖文區塊'") &&
    splitExporter.includes('IMAGE_SPECS.split'),
  'Split section should show image size placeholder when image is missing'
);

assert(
  articleImageExporter.includes('getArticleImageSpec') &&
    articleImageExporter.includes("renderImagePlaceholder('文章圖片'"),
  'Article image module should show correct image size placeholder'
);

assert(
  logoWallExporter.includes('logo.image ?') &&
    logoWallExporter.includes("renderImagePlaceholder('Logo'"),
  'Logo wall should not output broken img tags for empty images'
);

assert(
  productGridExporter.includes('p.image ?') &&
    productGridExporter.includes("renderImagePlaceholder('商品圖'"),
  'Product grid should not output broken img tags for empty product images'
);

assert(
  productCarouselExporter.includes('p.image ?') &&
    productCarouselExporter.includes("renderImagePlaceholder('商品圖'"),
  'Product carousel should not output broken img tags for empty product images'
);

assert(
  !productGridExporter.includes('cb-product-card__signal') &&
    !productCarouselExporter.includes('cb-product-card__signal') &&
    !bannerProductsExporter.includes('cb-product-card__signal') &&
    !css.includes('cb-product-card__signal'),
  'Product cards should not render the blue signal line'
);

assert(
  titleExporter.includes('const subtitle') &&
    titleExporter.includes('data.titleEn?.trim()'),
  'Title block should omit subtitle when titleEn is empty'
);

assert(
  moduleSchemas.includes("titleEn: ''"),
  'New title modules should default to empty subtitle'
);

assert(
  highRiskCss.includes('.cb-banner-products__banner .cb-image-placeholder__size') &&
    highRiskCss.includes('font-size: clamp(1rem, 2vw, 1.35rem);'),
  'Banner-products missing-image size label should be compact'
);

assert(
  css.includes('.cb-product-features--cards .cb-product-features__index') &&
    css.includes('width: 44px;') &&
    css.includes('justify-content: center;') &&
    !css.includes('.cb-product-features--cards .cb-product-features__item::after'),
  'Product feature cards should center index inside a circular badge'
);

assert(
  css.includes('.cb-product-benefits--pain-solution .cb-product-benefits__metric') &&
    css.includes('position: absolute; right: 18px; top: 18px;') &&
    css.includes('border-radius: 18px;'),
  'Pain-solution benefit metric should be placed in top-right rounded badge'
);

assert(
  css.includes('.cb-product-proof--certifications .cb-product-proof__item') &&
    css.includes('grid-template-columns: 54px 1fr') &&
    css.includes('.cb-product-proof--certifications .cb-product-proof__text') &&
    css.includes('grid-column: 2;'),
  'Certification proof layout should use a stable badge/text grid'
);

assert(
  css.includes('.cb-article-img__layout') &&
    css.includes('background: rgba(255,255,255,0.86)') &&
    css.includes('.cb-article-img__layout .cb-article__inner'),
  'Article image side layouts should render as one cohesive block'
);

assert(
  packageJson.includes('"verify:reported-module-regressions"'),
  'package.json should expose reported module regression verifier'
);

console.log('Reported module regressions verifier passed');
