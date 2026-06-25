import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const css = readFileSync('lib/export/cssGenerator.ts', 'utf8');
const titlePreview = readFileSync('modules/preview/TitlePreview.tsx', 'utf8');
const anchorPreview = readFileSync('modules/preview/AnchorNavPreview.tsx', 'utf8');
const anchorForm = readFileSync('modules/forms/AnchorNavForm.tsx', 'utf8');
const productGridPreview = readFileSync('modules/preview/ProductGridPreview.tsx', 'utf8');
const productCarouselPreview = readFileSync('modules/preview/ProductCarouselPreview.tsx', 'utf8');
const bannerProductsPreview = readFileSync('modules/preview/BannerProductsPreview.tsx', 'utf8');
const splitPreview = readFileSync('modules/preview/SplitSectionPreview.tsx', 'utf8');
const articlePreview = readFileSync('modules/preview/ArticleTextPreview.tsx', 'utf8');
const articleImagePreview = readFileSync('modules/preview/ArticleImagePreview.tsx', 'utf8');
const logoPreview = readFileSync('modules/preview/LogoWallPreview.tsx', 'utf8');
const faqPreview = readFileSync('modules/preview/FaqPreview.tsx', 'utf8');
const bankPreview = readFileSync('modules/preview/BankPromoPreview.tsx', 'utf8');
const ctaPreview = readFileSync('modules/preview/CtaPreview.tsx', 'utf8');
const productBannerPreview = readFileSync('modules/preview/ProductBannerPreview.tsx', 'utf8');

assert(css.includes('.cb-page a.cb-btn { color: ${btnTextColor}; }'), 'Export buttons should override global link colors with button text color');
assert(css.includes('.cb-btn {'), 'Export CSS should include shared button styles');
assert(css.includes('background: ${btnColor}; color: ${btnTextColor};'), 'Shared buttons should default to dark button color with white text');

assert(css.includes('.cb-hero__title { max-width: 430px; font-size: 2.25rem;'), 'Desktop KV title should match editor preview size in exported HTML');
assert(css.includes('.cb-kv__title { font-size: 1.75rem;'), 'Desktop KV carousel title should match editor preview size in exported HTML');
assert(css.includes('.cb-hero__subtitle { max-width: 430px; font-size: 1rem;'), 'KV body copy should use the shared body size');
assert(css.includes('.cb-split__description { font-size: 1rem;'), 'Split content body copy should use the shared body size');
assert(css.includes('.cb-cta__subtitle { font-size: 1rem;'), 'CTA body copy should use the shared body size');
assert(css.includes('.cb-article__subtitle { font-size: 1rem;'), 'Article subtitle should use the shared body size');

assert(css.includes('.cb-title-block { padding: 12px 0 4px; }'), 'Export title block spacing should be compact');
assert(titlePreview.includes("padding: '12px 24px 4px'"), 'Editor title block spacing should match compact export spacing');
assert(css.includes('.cb-section { padding-top: 36px; padding-bottom: 44px; }'), 'Default exported modules should use compact desktop vertical spacing');
assert(css.includes('.cb-section { padding-top: 32px; padding-bottom: 40px; }'), 'Default exported tablet modules should use compact vertical spacing');
assert(css.includes('.cb-section { padding-top: 24px; padding-bottom: 32px; }'), 'Default exported mobile modules should use compact vertical spacing');
assert(css.includes('.cb-products.cb-section, .cb-carousel.cb-section { padding-top: 28px; padding-bottom: 44px; }'), 'Product modules should not add oversized vertical space after title blocks');
assert(css.includes('.cb-products.cb-section, .cb-carousel.cb-section { padding-top: 24px; padding-bottom: 32px; }'), 'Mobile product modules should use compact vertical spacing');
assert(productGridPreview.includes("padding: isMobile ? '24px 16px 32px' : '28px 24px 44px'"), 'Product grid preview should match compact product spacing');
assert(productCarouselPreview.includes("padding: isMobile ? '24px 16px 32px' : '28px 0 44px'"), 'Product carousel preview should match compact product spacing');
assert(bannerProductsPreview.includes("padding: isMobile ? '24px 16px 32px' : '32px 0 40px'"), 'Banner products preview should use compact visual-heavy spacing');
assert(splitPreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'Split preview should use standard compact spacing');
assert(articlePreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'Article text preview should use standard compact spacing');
assert(articleImagePreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'Article image preview should use standard compact spacing');
assert(logoPreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'Logo wall preview should use standard compact spacing');
assert(faqPreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'FAQ preview should use standard compact spacing');
assert(bankPreview.includes("padding: isMobile ? '24px 16px 32px' : '36px 24px 44px'"), 'Bank promo preview should use standard compact spacing');
assert(ctaPreview.includes("padding: isMobile ? '32px 16px 40px' : '44px 24px 52px'"), 'CTA preview should remain prominent without oversized spacing');
assert(productBannerPreview.includes("small: { desktop: '28px 24px 36px', mobile: '24px 16px 32px' }"), 'Product banner small spacing should be compact');
assert(productBannerPreview.includes("medium: { desktop: '40px 24px 48px', mobile: '32px 16px 40px' }"), 'Product banner medium spacing should be compact');
assert(productBannerPreview.includes("large: { desktop: '52px 24px 60px', mobile: '40px 16px 48px' }"), 'Product banner large spacing should be compact but distinct');

assert(css.includes('.cb-anchor-nav { padding: 14px 0; }'), 'Anchor nav export spacing should be compact');
assert(css.includes('flex: 0 0 188px; width: 188px; min-height: 44px; padding: 10px 16px;'), 'Anchor buttons should be larger and equal width on desktop');
assert(!css.includes('box-shadow: 0 8px 20px rgba(15,23,42,0.12)'), 'Anchor buttons should not use drop shadows');
assert(!css.includes('box-shadow: 0 12px 26px rgba(15,23,42,0.18)'), 'Anchor hover should not add drop shadows');
assert(anchorPreview.includes("flex: isMobile ? '0 0 calc(50% - 4px)' : '0 0 188px'"), 'Anchor preview should use the larger desktop button width');
assert(anchorPreview.includes("minHeight: isMobile ? '40px' : '44px'"), 'Anchor preview should use larger button height');
assert(!anchorPreview.includes('boxShadow'), 'Anchor preview should not use drop shadows');

assert(anchorForm.includes('defaultPreviewColor="#ffffff"'), 'Anchor text color picker should show the white default users will actually get');

console.log('design system verified');
