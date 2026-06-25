import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const css = readFileSync('lib/export/cssGenerator.ts', 'utf8');
const heroPreview = readFileSync('modules/preview/HeroPreview.tsx', 'utf8');
const heroExporter = readFileSync('modules/exporters/heroExporter.ts', 'utf8');
const heroForm = readFileSync('modules/forms/HeroForm.tsx', 'utf8');
const kvPreview = readFileSync('modules/preview/HeroCarouselPreview.tsx', 'utf8');
const kvExporter = readFileSync('modules/exporters/heroCarouselExporter.ts', 'utf8');
const kvForm = readFileSync('modules/forms/HeroCarouselForm.tsx', 'utf8');
const productBannerPreview = readFileSync('modules/preview/ProductBannerPreview.tsx', 'utf8');
const articleTextPreview = readFileSync('modules/preview/ArticleTextPreview.tsx', 'utf8');
const articleImagePreview = readFileSync('modules/preview/ArticleImagePreview.tsx', 'utf8');
const articleImageForm = readFileSync('modules/forms/ArticleImageForm.tsx', 'utf8');
const logoPreview = readFileSync('modules/preview/LogoWallPreview.tsx', 'utf8');
const globalSettings = readFileSync('contexts/GlobalSettingsContext.tsx', 'utf8');

assert(!kvPreview.includes('desktopOverlayBg'), 'KV carousel preview should not create a text gradient overlay');
assert(!kvExporter.includes('linear-gradient(90deg'), 'KV carousel export should not create a text gradient overlay');
assert(!kvPreview.includes('overlayOpacity ?'), 'KV carousel preview should not render image overlays');
assert(!kvExporter.includes('overlayOpacity ?'), 'KV carousel export should not render image overlays');
assert(!readFileSync('modules/forms/HeroCarouselForm.tsx', 'utf8').includes('遮罩透明度'), 'KV carousel form should hide overlay controls');
assert(!readFileSync('modules/forms/HeroCarouselForm.tsx', 'utf8').includes('文字區塊底色'), 'KV carousel form should hide text background controls');
assert(!css.includes('.cb-kv__text {\n  position: relative; z-index: 1; width: 100%; max-width: 1080px; height: 100%;\n  margin-left: auto; margin-right: auto; padding: 0 40px;\n  display: flex; flex-direction: column; justify-content: center; overflow: hidden;\n  background:'), 'KV carousel CSS should not force a text background');
assert(css.includes('.cb-kv__text {'), 'KV carousel text CSS should still exist');
assert(heroPreview.includes("const defaultTextColor = '#ffffff';"), 'KV preview should default text to white');
assert(heroPreview.includes("const titleStyle: React.CSSProperties = { color: data.titleColor || defaultTextColor };"), 'KV preview title should default to white');
assert(heroPreview.includes("const textStyle: React.CSSProperties = { color: data.textColor || defaultTextColor };"), 'KV preview body should default to white');
assert(heroExporter.includes("const titleStyle = ` style=\"color: ${escapeHtml(data.titleColor || '#ffffff')}\"`;"), 'KV export title should default to white');
assert(heroExporter.includes("const textStyle = ` style=\"color: ${escapeHtml(data.textColor || '#ffffff')}\"`;"), 'KV export body should default to white');
assert(heroForm.includes('titleDefaultColor="#ffffff"'), 'KV form should show white as the title default');
assert(heroForm.includes('textDefaultColor="#ffffff"'), 'KV form should show white as the body default');
assert(kvPreview.includes("const defaultTextColor = '#ffffff';"), 'KV carousel preview should default text to white');
assert(kvPreview.includes("color: s.titleColor || defaultTextColor"), 'KV carousel preview title should default to white');
assert(kvPreview.includes("color: s.textColor || defaultTextColor"), 'KV carousel preview body should default to white');
assert(kvExporter.includes("const titleStyle = ` style=\"color: ${escapeHtml(s.titleColor || '#ffffff')}\"`;"), 'KV carousel export title should default to white');
assert(kvExporter.includes("const textStyle = ` style=\"color: ${escapeHtml(s.textColor || '#ffffff')}\"`;"), 'KV carousel export body should default to white');
assert(kvForm.includes("titleColor: '',"), 'New KV carousel slides should not force dark title colors');
assert(kvForm.includes("textColor: '',"), 'New KV carousel slides should not force dark body colors');
assert(kvForm.includes('defaultPreviewColor="#ffffff"'), 'KV carousel form should show white as the text color default');
assert(css.includes('.cb-hero__title { max-width: 430px; font-size: clamp(1.25rem, 2.4vw, 2rem); font-weight: 800; line-height: 1.15; margin-bottom: 10px; color: #ffffff; }'), 'KV CSS title default should be white');
assert(css.includes('.cb-kv__title { font-size: clamp(1.1rem, 2vw, 1.65rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }'), 'KV carousel CSS title default should be white');
assert(css.includes('.cb-kv__subtitle { font-size: clamp(0.8rem, 1vw, 0.9rem); line-height: 1.6; color: #ffffff;'), 'KV carousel CSS body default should be white');

assert(productBannerPreview.includes("isMobile ? <>{media}{content}</>"), 'Mobile product banner should always render image above text');
assert(css.includes('.cb-product-banner__inner--reverse .cb-product-banner__media { order: -1; }'), 'Desktop product banner reverse should remain available');
assert(css.includes('.cb-product-banner__inner--reverse .cb-product-banner__media { order: 0; }'), 'Mobile product banner reverse should reset image above text in CMS');

assert(articleTextPreview.includes("textAlign: align"), 'Article text preview content should follow alignment');
assert(css.includes('.cb-article--center .cb-article__content { text-align: center; }'), 'Exported centered articles should center body content');

assert(articleImageForm.includes('getArticleImageSpec'), 'Article image form should use layout-aware image specs');
assert(articleImagePreview.includes('getArticleImageSpec'), 'Article image preview should use layout-aware image specs');
assert(css.includes('.cb-article-img__layout .cb-article-img__media { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 600 / 450; }'), 'Side article images should export as 600x450 ratio');
assert(css.includes('.cb-article-img__layout--right { grid-template-columns: 1fr; gap: 20px; }'), 'Mobile article image spacing should be tighter');

assert(!logoPreview.includes('grayscale(100%)'), 'Logo preview should not apply grayscale');
assert(!css.includes('grayscale(100%)'), 'Logo export should not apply grayscale');

assert(globalSettings.includes('buttonTextColor'), 'Global settings should expose button text color');
assert(css.includes('color: ${btnTextColor};'), 'Exported buttons should use configured button text color');

console.log('cms consistency verified');
