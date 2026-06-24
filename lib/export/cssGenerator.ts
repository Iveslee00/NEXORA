import { GlobalSettings } from '@/types/modules';

export function generatePageCSS(settings?: Partial<GlobalSettings>): string {
  const btnColor = settings?.buttonColor || '#6366f1';
  const btnHover = settings?.buttonColor ? darken(settings.buttonColor) : '#4f46e5';
  const pageBg = settings?.pageBackgroundColor || '#ffffff';
  const pageBgImg = settings?.pageBackgroundImage || '';

  return `/* ============================================================
   Campaign Builder — Generated Stylesheet
   Prefix: cb- (Campaign Builder)
   ============================================================ */

/* ------------------------------------------------------------
   1. BASE RESET & DEFAULTS
   ------------------------------------------------------------ */
.cb-page *, .cb-page *::before, .cb-page *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}
.cb-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px; line-height: 1.6; color: #1a1a2e;
  -webkit-font-smoothing: antialiased;${pageBg ? `\n  background-color: ${pageBg};` : ''}${pageBgImg ? `\n  background-image: url("${pageBgImg}");\n  background-repeat: repeat-y;\n  background-size: 100% auto;` : ''}
}
.cb-page img { max-width: 100%; height: auto; display: block; }
.cb-page a { color: inherit; text-decoration: none; }

/* ------------------------------------------------------------
   2. LAYOUT & UTILITIES
   ------------------------------------------------------------ */
.cb-container {
  width: 100%; max-width: 1200px;
  margin-left: auto; margin-right: auto;
  padding-left: 24px; padding-right: 24px;
}
.cb-section { padding-top: 80px; padding-bottom: 80px; }

/* Buttons */
.cb-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 32px; background-color: ${btnColor}; color: #ffffff;
  border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1;
  text-decoration: none; transition: background-color 0.2s ease, transform 0.1s ease;
  cursor: pointer; border: none; white-space: nowrap;
}
.cb-btn:hover { background-color: ${btnHover}; transform: translateY(-1px); }
.cb-btn--white { background-color: #ffffff; color: #1a1a2e; }
.cb-btn--white:hover { background-color: rgba(255,255,255,0.9); transform: translateY(-1px); }

/* ------------------------------------------------------------
   3. TITLE BLOCK MODULE
   ------------------------------------------------------------ */
.cb-title-block { padding: 24px 0 8px; }
.cb-title-block__cn {
  display: block; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700;
  letter-spacing: -0.02em; line-height: 1.2; color: #1a1a2e;
}
.cb-title-block__en {
  display: block; font-size: 0.75rem; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #1a1a2e; opacity: 0.4; margin-top: 6px;
}
.cb-title-block--left { text-align: left; }
.cb-title-block--center { text-align: center; }
.cb-title-block--right { text-align: right; }

/* ------------------------------------------------------------
   4. HERO MODULE
   ------------------------------------------------------------ */
.cb-hero { position: relative; overflow: hidden; display: flex; background: #1a1a2e; color: #ffffff; }
.cb-hero--small { aspect-ratio: 1200 / 300; }
.cb-hero--medium { aspect-ratio: 1200 / 400; }
.cb-hero--large { aspect-ratio: 1200 / 520; }
.cb-hero__content { flex: 0 0 35%; display: flex; flex-direction: column; justify-content: center; padding: 0 36px 0 44px; background: #1a1a2e; overflow: hidden; }
.cb-hero__kicker { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65; margin-bottom: 16px; }
.cb-hero__title { font-size: clamp(1.25rem, 2.4vw, 2rem); font-weight: 800; line-height: 1.15; margin-bottom: 10px; color: #ffffff; }
.cb-hero__subtitle { font-size: 0.95rem; line-height: 1.6; opacity: 0.85; margin-bottom: 16px; max-width: 560px; }
.cb-hero__media { flex: 0 0 65%; position: relative; overflow: hidden; }
.cb-hero__media--full { flex: 1 1 auto; }
.cb-hero__link { position: absolute; inset: 0; display: block; }
.cb-hero__picture { position: absolute; inset: 0; display: block; }
.cb-hero__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

/* ------------------------------------------------------------
   5. SPLIT CONTENT MODULE
   ------------------------------------------------------------ */
.cb-split {}
.cb-split--small { padding-top: 32px; padding-bottom: 32px; }
.cb-split--medium { padding-top: 48px; padding-bottom: 48px; }
.cb-split--large { padding-top: 72px; padding-bottom: 72px; }
.cb-split__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.cb-split__inner--reverse .cb-split__media { order: -1; }
.cb-split__content { display: flex; flex-direction: column; gap: 20px; }
.cb-split__title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; color: #1a1a2e; }
.cb-split__description { font-size: 1.05rem; line-height: 1.75; color: #4a4a6a; }
.cb-split__media { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 4 / 3; }
.cb-split__picture { position: absolute; inset: 0; display: block; }
.cb-split__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-split__btn { align-self: flex-start; padding-left: 18px; padding-right: 18px; }

/* ------------------------------------------------------------
   6. PRODUCT CARD (shared by grid, carousel, banner+products)
   ------------------------------------------------------------ */
.cb-product-card {
  background-color: #ffffff; border-radius: 12px; overflow: hidden;
  text-decoration: none; color: inherit; display: flex; flex-direction: column;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cb-product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05); }
.cb-product-card__media { position: relative; aspect-ratio: 1/1; overflow: hidden; background-color: #f5f5f5; }
.cb-product-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.cb-product-card:hover .cb-product-card__media img { transform: scale(1.05); }
.cb-product-card__badge {
  position: absolute; top: 10px; left: 10px;
  padding: 3px 8px; background-color: #e53e3e; color: #ffffff;
  font-size: 11px; font-weight: 700; letter-spacing: 0.05em; border-radius: 4px; line-height: 1.4; z-index: 1;
}
.cb-product-card__body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.cb-product-card__brand { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9090b0; }
.cb-product-card__name { font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.35; }
.cb-product-card__prices { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.cb-product-card__original-price { font-size: 12px; font-weight: 500; color: #9090b0; text-decoration: line-through; }
.cb-product-card__sale-price { font-size: 15px; font-weight: 700; color: #e53e3e; }
.cb-product-card__special-tag {
  display: inline-block; margin-top: 6px; padding: 2px 8px;
  background: #fff3cd; color: #b45309; border: 1px solid #fcd34d;
  font-size: 11px; font-weight: 600; border-radius: 3px; line-height: 1.5;
  align-self: flex-start;
}

/* ------------------------------------------------------------
   7. PRODUCT GRID MODULE
   ------------------------------------------------------------ */
.cb-products__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

/* ------------------------------------------------------------
   8. BANNER + PRODUCTS MODULE
   ------------------------------------------------------------ */
.cb-banner-products__inner { display: grid; gap: 20px; align-items: start; }
.cb-banner-products__inner--0 { grid-template-columns: 1fr; }
.cb-banner-products__inner--1 { grid-template-columns: minmax(0, 2fr) minmax(180px, 1fr); }
.cb-banner-products__inner--2 { grid-template-columns: minmax(0, 2fr) repeat(2, minmax(160px, 1fr)); }
.cb-banner-products__inner--3 { grid-template-columns: minmax(0, 2fr) repeat(3, minmax(150px, 1fr)); }
.cb-banner-products__inner--4 { grid-template-columns: minmax(0, 2fr) repeat(4, minmax(140px, 1fr)); }
.cb-banner-products__banner {
  position: relative; border-radius: 12px; overflow: hidden;
  background-color: #1a1a2e; aspect-ratio: 5 / 6; display: flex;
}
.cb-banner-products__inner--4 .cb-banner-products__banner { aspect-ratio: 5 / 8; }
.cb-banner-products__picture { position: absolute; inset: 0; display: block; }
.cb-banner-products__banner-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.cb-banner-products__banner-overlay {
  position: relative; z-index: 1; padding: 28px 24px;
  display: flex; flex-direction: column; justify-content: flex-end;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
  width: 100%;
}
.cb-banner-products__banner-title { font-size: 1.25rem; font-weight: 700; color: #ffffff; line-height: 1.2; margin-bottom: 6px; overflow-wrap: anywhere; }
.cb-banner-products__banner-subtitle { font-size: 0.875rem; color: rgba(255,255,255,0.8); margin-bottom: 16px; overflow-wrap: anywhere; }

/* ------------------------------------------------------------
   9. PRODUCT CAROUSEL MODULE
   ------------------------------------------------------------ */
.cb-carousel__wrapper { position: relative; }
.cb-carousel__track-outer { overflow: hidden; }
.cb-carousel__track {
  display: flex; gap: 20px;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cb-carousel__item { flex: 0 0 calc(25% - 15px); min-width: 0; }
.cb-carousel__btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: #ffffff; border: 1px solid #e8e8f4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 2; transition: box-shadow 0.2s ease;
  font-size: 18px; color: #1a1a2e;
}
.cb-carousel__btn:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.cb-carousel__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.cb-carousel__btn--prev { left: -20px; }
.cb-carousel__btn--next { right: -20px; }

/* ------------------------------------------------------------
   10. PRODUCT BANNER MODULE
   ------------------------------------------------------------ */
.cb-product-banner { position: relative; overflow: hidden; }
.cb-product-banner { color: #ffffff; }
.cb-product-banner--small { padding-top: 36px; padding-bottom: 36px; }
.cb-product-banner--medium { padding-top: 56px; padding-bottom: 56px; }
.cb-product-banner--large { padding-top: 76px; padding-bottom: 76px; }
.cb-product-banner__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.cb-product-banner__inner--reverse .cb-product-banner__media { order: -1; }
.cb-product-banner__content { display: flex; flex-direction: column; gap: 16px; }
.cb-product-banner__kicker { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.65; }
.cb-product-banner__headline { font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; }
.cb-product-banner__tagline { font-size: 1rem; line-height: 1.7; opacity: 0.75; max-width: 480px; }
.cb-product-banner__product-info { display: flex; flex-direction: column; gap: 6px; padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
.cb-product-banner--light .cb-product-banner__product-info { border-color: rgba(0,0,0,0.1); }
.cb-product-banner__product-brand { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; }
.cb-product-banner__product-name { font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
.cb-product-banner__prices { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.cb-product-banner__original-price { font-size: 14px; font-weight: 500; opacity: 0.5; text-decoration: line-through; }
.cb-product-banner__sale-price { font-size: 1.75rem; font-weight: 800; color: #ff6b6b; letter-spacing: -0.02em; }
.cb-product-banner--light .cb-product-banner__sale-price { color: #e53e3e; }
.cb-product-banner__media { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 700 / 600; }
.cb-product-banner--small .cb-product-banner__media { aspect-ratio: 700 / 460; }
.cb-product-banner--large .cb-product-banner__media { aspect-ratio: 700 / 740; }
.cb-product-banner__picture { position: absolute; inset: 0; display: block; }
.cb-product-banner__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-product-banner__badge { position: absolute; top: 16px; right: 16px; padding: 6px 12px; background-color: #e53e3e; color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; border-radius: 6px; z-index: 1; }

/* ------------------------------------------------------------
   11. LOGO WALL MODULE
   ------------------------------------------------------------ */
.cb-logo-wall__grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 40px 56px; }
.cb-logo-wall__item { display: flex; align-items: center; justify-content: center; opacity: 0.45; filter: grayscale(100%); transition: opacity 0.2s ease, filter 0.2s ease; }
.cb-logo-wall__item:hover { opacity: 1; filter: grayscale(0%); }
.cb-logo-wall__item img { height: 40px; width: auto; max-width: 160px; object-fit: contain; }

/* ------------------------------------------------------------
   12. CTA MODULE
   ------------------------------------------------------------ */
.cb-cta { position: relative; }
.cb-cta--light { background-color: #f8f8fc; color: #1a1a2e; }
.cb-cta--dark { background-color: #1a1a2e; color: #ffffff; }
.cb-cta--gradient { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; }
.cb-cta__inner { display: flex; flex-direction: column; gap: 20px; }
.cb-cta__inner--left { align-items: flex-start; text-align: left; }
.cb-cta__inner--center { align-items: center; text-align: center; }
.cb-cta__inner--right { align-items: flex-end; text-align: right; }
.cb-cta__title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; }
.cb-cta__subtitle { font-size: 1.1rem; line-height: 1.65; opacity: 0.8; max-width: 560px; }

/* ------------------------------------------------------------
   13. FAQ MODULE
   ------------------------------------------------------------ */
.cb-faq__list { max-width: 800px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 12px; }
.cb-faq__item { border: 1px solid #e8e8f4; border-radius: 12px; overflow: hidden; }
.cb-faq__item summary { list-style: none; }
.cb-faq__item summary::-webkit-details-marker { display: none; }
.cb-faq__question { padding: 20px 24px; font-size: 16px; font-weight: 600; color: #1a1a2e; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: background-color 0.15s ease; user-select: none; }
.cb-faq__question:hover { background-color: #f8f8fc; }
.cb-faq__toggle { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 300; color: ${btnColor}; transition: transform 0.2s ease; }
.cb-faq__item[open] .cb-faq__toggle { transform: rotate(45deg); }
.cb-faq__answer { padding: 0 24px 20px; font-size: 15px; line-height: 1.75; color: #4a4a6a; }

/* ------------------------------------------------------------
   14. STICKY SIDEBAR
   ------------------------------------------------------------ */
.cb-sticky-sidebar {
  position: fixed; top: 50%; transform: translateY(-50%); z-index: 1000;
  display: flex; flex-direction: column; gap: 4px;
}
.cb-sticky-sidebar--right { right: 0; }
.cb-sticky-sidebar--left { left: 0; }
.cb-sticky-sidebar__item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; color: #ffffff; font-size: 13px; font-weight: 600;
  text-decoration: none; transition: opacity 0.2s ease;
  white-space: nowrap;
}
.cb-sticky-sidebar__item:first-child { border-radius: 8px 0 0 0; }
.cb-sticky-sidebar__item:last-child { border-radius: 0 0 0 8px; }
.cb-sticky-sidebar--right .cb-sticky-sidebar__item:first-child { border-radius: 8px 0 0 0; }
.cb-sticky-sidebar--right .cb-sticky-sidebar__item:last-child { border-radius: 0 0 0 8px; }
.cb-sticky-sidebar--left .cb-sticky-sidebar__item:first-child { border-radius: 0 8px 0 0; }
.cb-sticky-sidebar--left .cb-sticky-sidebar__item:last-child { border-radius: 0 0 8px 0; }
.cb-sticky-sidebar__item:hover { opacity: 0.9; }
.cb-sticky-sidebar__icon { font-size: 18px; line-height: 1; }

/* ------------------------------------------------------------
   15. RESPONSIVE
   ------------------------------------------------------------ */
@media (max-width: 1024px) {
  .cb-container { padding-left: 20px; padding-right: 20px; }
  .cb-section { padding-top: 64px; padding-bottom: 64px; }
  .cb-split__inner { gap: 40px; }
  .cb-products__grid { grid-template-columns: repeat(3, 1fr); }
  .cb-carousel__item { flex: 0 0 calc(33.333% - 14px); }
  .cb-product-banner__inner { gap: 40px; }
  .cb-banner-products__inner--3,
  .cb-banner-products__inner--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cb-banner-products__inner--3 .cb-banner-products__banner,
  .cb-banner-products__inner--4 .cb-banner-products__banner { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  .cb-section { padding-top: 48px; padding-bottom: 48px; }
  .cb-title-block { padding-top: 20px; }
  .cb-hero { flex-direction: column; }
  .cb-hero--small,
  .cb-hero--medium,
  .cb-hero--large { aspect-ratio: auto; }
  .cb-hero--image-only.cb-hero--small { aspect-ratio: 750 / 370; }
  .cb-hero--image-only.cb-hero--medium { aspect-ratio: 750 / 460; }
  .cb-hero--image-only.cb-hero--large { aspect-ratio: 750 / 500; }
  .cb-hero__content { flex: 0 0 auto; padding: 20px 18px; }
  .cb-hero__media { flex: 0 0 auto; order: -1; aspect-ratio: 750 / 260; }
  .cb-hero--small .cb-hero__media { aspect-ratio: 750 / 210; }
  .cb-hero--large .cb-hero__media { aspect-ratio: 750 / 310; }
  .cb-hero--image-only .cb-hero__media { flex: 1 1 auto; order: 0; }
  .cb-hero__title { font-size: 1.5rem; }
  .cb-split__inner { grid-template-columns: 1fr; gap: 32px; }
  .cb-split__inner--reverse .cb-split__media { order: 0; }
  .cb-products__grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .cb-carousel__item { flex: 0 0 calc(50% - 10px); }
  .cb-banner-products__inner--0,
  .cb-banner-products__inner--1,
  .cb-banner-products__inner--2,
  .cb-banner-products__inner--3,
  .cb-banner-products__inner--4 { grid-template-columns: 1fr 1fr; }
  .cb-banner-products__banner,
  .cb-banner-products__inner--4 .cb-banner-products__banner { grid-column: 1 / -1; aspect-ratio: 5 / 6; }
  .cb-product-banner__inner { grid-template-columns: 1fr; gap: 32px; }
  .cb-product-banner__inner--reverse .cb-product-banner__media { order: 0; }
  .cb-product-banner__media { aspect-ratio: 750 / 850; }
  .cb-product-banner--small .cb-product-banner__media { aspect-ratio: 750 / 750; }
  .cb-product-banner--large .cb-product-banner__media { aspect-ratio: 750 / 900; }
  .cb-logo-wall__grid { gap: 24px 32px; }
  .cb-logo-wall__item img { height: 32px; }
  .cb-cta__title { font-size: 1.75rem; }
  .cb-title-block__cn { font-size: 1.5rem; }
}

@media (max-width: 480px) {
  .cb-container { padding-left: 16px; padding-right: 16px; }
  .cb-products__grid,
  .cb-banner-products__inner--0,
  .cb-banner-products__inner--1,
  .cb-banner-products__inner--2,
  .cb-banner-products__inner--3,
  .cb-banner-products__inner--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .cb-product-card__body { padding: 10px 12px; }
  .cb-btn { padding: 12px 24px; font-size: 15px; }
}

/* ------------------------------------------------------------
   16. ARTICLE TEXT MODULE
   ------------------------------------------------------------ */
.cb-article__inner { max-width: 800px; margin-left: auto; margin-right: auto; }
.cb-article--center .cb-article__inner { text-align: center; }
.cb-article--left .cb-article__inner { text-align: left; }
.cb-article__eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9090b0; margin-bottom: 12px; }
.cb-article__title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #1a1a2e; margin: 0 0 16px; }
.cb-article__subtitle { font-size: 1.1rem; line-height: 1.65; color: #4a4a6a; margin: 0 0 28px; opacity: 0.85; }
.cb-article__content { font-size: 15px; line-height: 1.85; color: #4a4a6a; text-align: left; }
.cb-article__meta { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e8e8f4; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.cb-article--center .cb-article__meta { justify-content: center; }
.cb-article__author { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.cb-article__date { font-size: 13px; color: #9090b0; }

/* ------------------------------------------------------------
   17. ARTICLE IMAGE MODULE
   ------------------------------------------------------------ */
.cb-article-img__picture { position: absolute; inset: 0; display: block; }
.cb-article-img__img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; }
.cb-article-img--top .cb-article-img__media--top { border-radius: 12px; overflow: hidden; margin-bottom: 36px; }
.cb-article-img--top .cb-article-img__media--top { position: relative; aspect-ratio: 1200 / 420; }
.cb-article-img__layout { display: grid; gap: 48px; align-items: flex-start; }
.cb-article-img__layout--left { grid-template-columns: 45% 1fr; }
.cb-article-img__layout--right { grid-template-columns: 1fr 45%; }
.cb-article-img__layout--right .cb-article-img__media { order: 2; }
.cb-article-img__layout--right .cb-article__inner { order: 1; }
.cb-article-img__layout .cb-article-img__media { position: relative; border-radius: 12px; overflow: hidden; min-height: 320px; }

@media (max-width: 768px) {
  .cb-article-img__layout--left,
  .cb-article-img__layout--right { grid-template-columns: 1fr; }
  .cb-article-img__layout--right .cb-article-img__media { order: 0; margin-bottom: 28px; }
  .cb-article-img__layout--right .cb-article__inner { order: 0; }
  .cb-article-img--top .cb-article-img__media--top { aspect-ratio: 750 / 420; }
  .cb-article-img__layout .cb-article-img__media { min-height: auto; height: 420px; }
}

/* ------------------------------------------------------------
   18. HERO CAROUSEL (KV) MODULE — split layout (text left, image right)
   ------------------------------------------------------------ */
.cb-kv { position: relative; overflow: hidden; }
.cb-kv--small  { aspect-ratio: 1200 / 300; }
.cb-kv--medium { aspect-ratio: 1200 / 400; }
.cb-kv--large  { aspect-ratio: 1200 / 520; }
.cb-kv__track { display: flex; height: 100%; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
.cb-kv__slide { flex: 0 0 100%; display: grid; grid-template-columns: 35% 65%; height: 100%; }
.cb-kv__slide--image-only { grid-template-columns: 1fr; }
.cb-kv__text { display: flex; flex-direction: column; justify-content: center; padding: 0 36px 0 44px; overflow: hidden; background: #1a1a2e; }
.cb-kv__text--left   { align-items: flex-start; text-align: left; }
.cb-kv__text--center { align-items: center; text-align: center; }
.cb-kv__text--right  { align-items: flex-end; text-align: right; }
.cb-kv__img { position: relative; overflow: hidden; }
.cb-kv__link { position: absolute; inset: 0; display: block; color: inherit; }
.cb-kv__picture { position: absolute; inset: 0; display: block; }
.cb-kv__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-kv__overlay { position: absolute; inset: 0; }
.cb-kv__title { font-size: clamp(1.1rem, 2vw, 1.65rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }
.cb-kv__subtitle { font-size: clamp(0.8rem, 1vw, 0.9rem); line-height: 1.6; color: rgba(255,255,255,0.85); margin: 0 0 16px; max-width: 320px; }
.cb-kv__btn { }
.cb-kv__nav { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 3; color: #fff; font-size: 16px; }
.cb-kv__nav--prev { left: calc(35% + 12px); }
.cb-kv__nav--next { right: 14px; }
.cb-kv__dots { position: absolute; bottom: 16px; left: 67.5%; transform: translateX(-50%); display: flex; gap: 7px; z-index: 3; }
.cb-kv__dot { width: 7px; height: 7px; border-radius: 4px; background: rgba(255,255,255,0.5); border: none; cursor: pointer; padding: 0; transition: width 0.3s, background 0.3s; }
.cb-kv__dot--active { width: 22px; background: #ffffff; }

@media (max-width: 768px) {
  .cb-kv--small,
  .cb-kv--medium,
  .cb-kv--large { aspect-ratio: auto; }
  .cb-kv__track { height: auto; }
  .cb-kv__slide { grid-template-columns: 1fr; grid-template-rows: auto auto; height: auto; }
  .cb-kv__img { aspect-ratio: 750 / 260; }
  .cb-kv--small .cb-kv__img { aspect-ratio: 750 / 210; }
  .cb-kv--large .cb-kv__img { aspect-ratio: 750 / 310; }
  .cb-kv__slide--image-only { grid-template-rows: 1fr; }
  .cb-kv__slide--image-only .cb-kv__img { aspect-ratio: auto; }
  .cb-kv--small .cb-kv__slide--image-only { aspect-ratio: 750 / 370; }
  .cb-kv--medium .cb-kv__slide--image-only { aspect-ratio: 750 / 460; }
  .cb-kv--large .cb-kv__slide--image-only { aspect-ratio: 750 / 500; }
  .cb-kv__img { grid-row: 1; grid-column: 1; }
  .cb-kv__text { grid-row: 2; grid-column: 1; padding: 20px 18px; }
  .cb-kv__text--center, .cb-kv__text--right { align-items: flex-start; text-align: left; }
  .cb-kv__nav--prev { left: 8px; top: 105px; }
  .cb-kv__nav--next { right: 8px; top: 105px; }
  .cb-kv__dots { bottom: auto; top: calc(210px - 22px); left: 50%; }
}

/* ------------------------------------------------------------
   19. BANK PROMO MODULE
   ------------------------------------------------------------ */
.cb-bank__header { text-align: center; margin-bottom: 32px; }
.cb-bank__title { font-size: clamp(1.1rem, 2vw, 1.6rem); font-weight: 700; letter-spacing: -0.02em; color: #1a1a2e; margin: 0 0 6px; }
.cb-bank__subtitle { font-size: 13px; color: #9090b0; margin: 0; }
.cb-bank__grid { display: grid; gap: 14px; }
.cb-bank__grid--1 { grid-template-columns: 1fr; }
.cb-bank__grid--2 { grid-template-columns: repeat(2, 1fr); }
.cb-bank__grid--3 { grid-template-columns: repeat(3, 1fr); }
.cb-bank__grid--4 { grid-template-columns: repeat(4, 1fr); }
.cb-bank-card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
.cb-bank-card__accent { height: 4px; flex-shrink: 0; }
.cb-bank-card__body { padding: 18px 20px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
.cb-bank-card__header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.cb-bank-card__logo { height: 20px; width: auto; object-fit: contain; flex-shrink: 0; }
.cb-bank-card__name { font-size: 12px; font-weight: 700; color: #1a1a2e; margin: 0; line-height: 1.3; }
.cb-bank-card__condition { font-size: 11px; color: #9090b0; margin: 0; line-height: 1.4; }
.cb-bank-card__benefit { font-size: 14px; font-weight: 700; margin: 4px 0 0; line-height: 1.4; }
.cb-bank-card__note { font-size: 11px; color: #9090b0; margin: 2px 0 0; line-height: 1.5; }
.cb-bank__footer { margin-top: 18px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
.cb-bank__disclaimer { font-size: 11px; color: #b0b0c0; margin: 0; }
.cb-bank__link { font-size: 12px; font-weight: 600; color: #6366f1; text-decoration: none; }
.cb-bank__link:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .cb-bank__grid--3, .cb-bank__grid--4 { grid-template-columns: repeat(2, 1fr); }
  .cb-bank__grid { gap: 10px; }
  .cb-bank-card__body { padding: 14px; }
  .cb-bank-card__benefit { font-size: 13px; }
  .cb-bank__header { margin-bottom: 24px; }
}

@media (max-width: 480px) {
  .cb-bank__grid--2, .cb-bank__grid--3, .cb-bank__grid--4 { grid-template-columns: 1fr; }
}

/* Carousel JS (auto-injected) */
`;
}

// Simple color darkening for button hover (works with hex colors)
function darken(hex: string): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (n >> 16) - 30);
    const g = Math.max(0, ((n >> 8) & 0xff) - 30);
    const b = Math.max(0, (n & 0xff) - 30);
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  } catch {
    return '#4f46e5';
  }
}

export function generateCarouselScript(): string {
  return `<script>
(function(){
  document.querySelectorAll('.cb-carousel').forEach(function(el){
    var outer = el.querySelector('.cb-carousel__track-outer');
    var track = el.querySelector('.cb-carousel__track');
    var items = el.querySelectorAll('.cb-carousel__item');
    var prevBtn = el.querySelector('.cb-carousel__btn--prev');
    var nextBtn = el.querySelector('.cb-carousel__btn--next');
    var cur = 0;
    var GAP = 20;
    function pp(){ return window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4; }
    function iw(p){ return (outer.offsetWidth - (p - 1) * GAP) / p; }
    function maxIdx(p){ return Math.max(0, items.length - p); }
    function upd(){
      var p = pp();
      var w = iw(p);
      var m = maxIdx(p);
      if(cur > m) cur = m;
      Array.prototype.forEach.call(items, function(it){ it.style.flex = '0 0 ' + w + 'px'; });
      track.style.transform = 'translateX(-' + (cur * (w + GAP)) + 'px)';
      if(prevBtn) prevBtn.disabled = cur === 0;
      if(nextBtn) nextBtn.disabled = cur >= m;
    }
    if(prevBtn) prevBtn.addEventListener('click', function(){ if(cur>0){cur--;upd();} });
    if(nextBtn) nextBtn.addEventListener('click', function(){ if(cur<maxIdx(pp())){cur++;upd();} });
    upd();
    window.addEventListener('resize', upd);
  });
})();
</script>`;
}
