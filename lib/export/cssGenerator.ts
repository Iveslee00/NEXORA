import { GlobalSettings } from '@/types/modules';
import { getHighRiskModuleCssFragments } from '@/modules/definitions/highRiskModuleDefinitions';

export function generatePageCSS(settings?: Partial<GlobalSettings>): string {
  const btnColor = settings?.buttonColor || '#6366f1';
  const btnTextColor = settings?.buttonTextColor || '#ffffff';
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
  -webkit-font-smoothing: antialiased;${pageBg ? `\n  background: ${pageBg};` : ''}${pageBgImg ? `\n  background-image: url("${pageBgImg}");\n  background-repeat: repeat-y;\n  background-size: 100% auto;\n  background-position: top center;` : ''}
}
.cb-page img { max-width: 100%; height: auto; display: block; }
.cb-page a { color: inherit; text-decoration: none; }

/* ------------------------------------------------------------
   2. LAYOUT & UTILITIES
   ------------------------------------------------------------ */
.cb-container {
  width: 100%; max-width: 1080px;
  margin-left: auto; margin-right: auto;
  padding-left: 24px; padding-right: 24px;
}
.cb-section { padding-top: 36px; padding-bottom: 44px; }
.cb-section { position: relative; }
.cb-module-anchor { scroll-margin-top: 16px; }

/* Buttons */
.cb-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 32px; background: ${btnColor}; color: ${btnTextColor};
  border-radius: 999px; font-size: 16px; font-weight: 800; line-height: 1;
  text-decoration: none; transition: background-color 0.2s ease, transform 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer; border: 1px solid rgba(255,255,255,0.18); white-space: nowrap;
  box-shadow: 0 14px 34px rgba(99,102,241,0.24);
}
.cb-page a.cb-btn { color: ${btnTextColor}; }
.cb-btn:hover { background: ${btnHover}; transform: translateY(-2px); box-shadow: 0 18px 42px rgba(99,102,241,0.28); }
.cb-page a.cb-btn:hover { color: ${btnTextColor}; }
.cb-btn--white { background: ${btnColor}; color: ${btnTextColor}; }
.cb-btn--white:hover { background: ${btnHover}; transform: translateY(-1px); }

${getHighRiskModuleCssFragments()}

/* ------------------------------------------------------------
   3. ANCHOR NAV MODULE
   ------------------------------------------------------------ */
.cb-anchor-nav { padding: 14px 0; }
.cb-anchor-nav__inner {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
}
.cb-anchor-nav__link {
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 188px; width: 188px; min-height: 44px; padding: 10px 16px; border-radius: 999px;
  border: 1px solid rgba(99,102,241,0.28);
  background: linear-gradient(180deg, #1f2440 0%, #15192d 100%);
  color: #ffffff;
  font-size: 15px; font-weight: 700; line-height: 1.2; text-decoration: none;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  box-shadow: 0 22px 60px rgba(15,23,42,0.10);
  backdrop-filter: blur(14px);
  transition: transform 0.2s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.2s ease;
}
.cb-anchor-nav__link:hover {
  transform: translateY(-2px);
  border-color: rgba(99,102,241,0.52);
  background: linear-gradient(180deg, #343a6b 0%, #20264d 100%);
}
.cb-anchor-nav__link span { color: #ffffff; }
.cb-anchor-nav__link:active {
  transform: translateY(0);
}

/* ------------------------------------------------------------
   4. TITLE BLOCK MODULE
   ------------------------------------------------------------ */
.cb-title-block { padding: 12px 0 4px; }
.cb-title-block { position: relative; overflow: hidden; }
.cb-title-block .cb-container { position: relative; }
.cb-title-block__halo {
  position: absolute; top: 50%; left: 0; width: 180px; height: 180px;
  transform: translateY(-50%); border-radius: 999px; pointer-events: none;
  background: radial-gradient(circle, rgba(99,102,241,0.14), transparent 68%);
}
.cb-title-block--center .cb-title-block__halo { left: 50%; transform: translate(-50%, -50%); }
.cb-title-block--right .cb-title-block__halo { left: auto; right: 0; }
.cb-title-block::after {
  content: ""; display: block; width: 56px; height: 4px; margin-top: 14px;
  border-radius: 999px; background: linear-gradient(135deg, rgba(99,102,241,0.78), rgba(14,165,198,0.72));
}
.cb-title-block--center::after { margin-left: auto; margin-right: auto; }
.cb-title-block--right::after { margin-left: auto; }
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
.cb-hero { position: relative; overflow: hidden; display: flex; align-items: center; background: #1a1a2e; color: #ffffff; }
.cb-hero__depth-layer {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(circle at 18% 18%, rgba(255,255,255,0.24), transparent 28%), radial-gradient(circle at 76% 66%, rgba(99,102,241,0.22), transparent 30%);
  mix-blend-mode: screen;
}
.cb-hero--small { aspect-ratio: 1920 / 480; }
.cb-hero--medium { aspect-ratio: 1920 / 640; }
.cb-hero--large { aspect-ratio: 1920 / 800; }
.cb-hero__content {
  position: relative; z-index: 4; width: 100%; max-width: 1080px;
  margin-left: auto; margin-right: auto; padding: 0 40px;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  background: transparent;
  overflow: hidden;
}
.cb-hero__kicker { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65; margin-bottom: 16px; }
.cb-hero__title { max-width: 430px; font-size: 2.25rem; font-weight: 800; line-height: 1.15; margin-bottom: 10px; color: #ffffff; }
.cb-hero__subtitle { max-width: 430px; font-size: 1rem; line-height: 1.6; opacity: 0.85; margin-bottom: 16px; }
.cb-hero__media { position: absolute; inset: 0; overflow: hidden; }
.cb-hero__media--full { flex: 1 1 auto; }
.cb-hero__link { position: absolute; inset: 0; display: block; }
.cb-hero__picture { position: absolute; inset: 0; display: block; }
.cb-hero__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

/* ------------------------------------------------------------
   5. SPLIT CONTENT MODULE
   ------------------------------------------------------------ */
.cb-split { overflow: hidden; }
.cb-split__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.cb-split__inner--reverse .cb-split__media { order: -1; }
.cb-split__content {
  display: flex; flex-direction: column; gap: 20px;
  padding: 28px; border-radius: 26px;
  background: rgba(255,255,255,0.74);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 22px 60px rgba(15,23,42,0.10);
  backdrop-filter: blur(14px);
}
.cb-split__title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; color: #1a1a2e; }
.cb-split__description { font-size: 1rem; line-height: 1.75; color: #4a4a6a; }
.cb-split__media {
  position: relative; border-radius: 26px; overflow: hidden; aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.08);
}
.cb-split__picture { position: absolute; inset: 0; display: block; }
.cb-split__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-split__btn { align-self: flex-start; padding-left: 18px; padding-right: 18px; }

/* ------------------------------------------------------------
   6. PRODUCT CARD (shared by grid, carousel, banner+products)
   ------------------------------------------------------------ */
.cb-product-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96)); border-radius: 16px; overflow: hidden;
  text-decoration: none; color: inherit; display: flex; flex-direction: column;
  box-shadow: 0 14px 40px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.cb-product-card:hover { transform: translateY(-4px); box-shadow: 0 22px 60px rgba(15,23,42,0.14), 0 0 0 1px rgba(99,102,241,0.16); }
.cb-product-card__media { position: relative; aspect-ratio: 1/1; overflow: hidden; background: radial-gradient(circle at 30% 18%, #ffffff, #eef2ff 52%, #e0f2fe); }
.cb-product-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.cb-product-card:hover .cb-product-card__media img { transform: scale(1.05); }
.cb-product-card__signal {
  position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 2;
  height: 4px; border-radius: 999px;
  background: linear-gradient(90deg, rgba(99,102,241,0.78), rgba(14,165,198,0.62));
  box-shadow: 0 10px 24px rgba(99,102,241,0.22);
}
.cb-product-card__labels {
  position: absolute; top: 10px; left: 10px; z-index: 2;
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  max-width: calc(100% - 20px);
}
.cb-product-card__label {
  display: inline-block; max-width: 100%; padding: 3px 8px;
  font-size: 11px; font-weight: 700; border-radius: 4px; line-height: 1.35;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cb-product-card__label--badge {
  background-color: #e53e3e; color: #ffffff; letter-spacing: 0.05em;
}
.cb-product-card__label--special {
  background: #fff3cd; color: #b45309; border: 1px solid #fcd34d;
}
.cb-product-card__body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.cb-product-card__brand { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9090b0; }
.cb-product-card__name { font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.35; }
.cb-product-card__prices { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.cb-product-card__original-price { font-size: 12px; font-weight: 500; color: #9090b0; text-decoration: line-through; }
.cb-product-card__sale-price { font-size: 15px; font-weight: 700; color: #e53e3e; }

/* ------------------------------------------------------------
   7. PRODUCT GRID MODULE
   ------------------------------------------------------------ */
.cb-products__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cb-products.cb-section, .cb-carousel.cb-section { padding-top: 28px; padding-bottom: 44px; }

/* ------------------------------------------------------------
   8. BANNER + PRODUCTS MODULE
   ------------------------------------------------------------ */
.cb-banner-products__inner { display: grid; gap: 16px; align-items: stretch; }
.cb-banner-products.cb-section { padding-top: 32px; padding-bottom: 40px; }
.cb-banner-products .cb-container { padding-left: 0; padding-right: 0; }
.cb-banner-products__inner--0 { grid-template-columns: 1fr; }
.cb-banner-products__inner--1 { grid-template-columns: minmax(0, 880px) max-content; }
.cb-banner-products__inner--2 { grid-template-columns: minmax(0, 700px) max-content; }
.cb-banner-products__inner--3 { grid-template-columns: minmax(0, 520px) max-content; }
.cb-banner-products__inner--4 { grid-template-columns: minmax(0, 328px) max-content; }
.cb-banner-products__banner {
  position: relative; border-radius: 26px; overflow: hidden;
  background: radial-gradient(circle at 28% 18%, rgba(99,102,241,0.26), transparent 36%), #111827; height: 100%; display: flex;
  box-shadow: 0 22px 60px rgba(15,23,42,0.16);
}
.cb-banner-products__products { display: grid; gap: 16px; align-items: start; min-height: 0; }
.cb-banner-products__products--0 { display: none; }
.cb-banner-products__products--1 { grid-template-columns: repeat(1, 168px); }
.cb-banner-products__products--2 { grid-template-columns: repeat(2, 168px); }
.cb-banner-products__products--3 { grid-template-columns: repeat(3, 168px); }
.cb-banner-products__products--4 { grid-template-columns: repeat(4, 168px); }
.cb-banner-products .cb-product-card { width: 168px; min-height: 0; }
.cb-banner-products .cb-product-card__media { aspect-ratio: auto; height: 168px; flex: 0 0 auto; }
.cb-banner-products .cb-product-card__body { min-height: 0; padding: 10px 12px; gap: 3px; }
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
.cb-carousel__track-outer { overflow-x: hidden; overflow-y: visible; padding: 6px 0 12px; }
.cb-carousel__track {
  display: flex; gap: 20px;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cb-carousel__item { flex: 0 0 calc(25% - 15px); min-width: 0; }
.cb-carousel__btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: #ffffff; border: 1px solid #e8e8f4;
  box-shadow: 0 16px 42px rgba(15,23,42,0.14);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 2; transition: box-shadow 0.2s ease;
  font-size: 18px; color: #1a1a2e;
}
.cb-carousel__btn:hover { box-shadow: 0 22px 60px rgba(15,23,42,0.18); }
.cb-carousel__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.cb-carousel__btn--prev { left: -20px; }
.cb-carousel__btn--next { right: -20px; }

/* ------------------------------------------------------------
   10. PRODUCT BANNER MODULE
   ------------------------------------------------------------ */
.cb-product-banner { position: relative; overflow: hidden; }
.cb-product-banner { color: #1a1a2e; }
.cb-product-banner--small { padding-top: 28px; padding-bottom: 36px; }
.cb-product-banner--medium { padding-top: 40px; padding-bottom: 48px; }
.cb-product-banner--large { padding-top: 52px; padding-bottom: 60px; }
.cb-product-banner__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.cb-product-banner__inner--reverse .cb-product-banner__media { order: -1; }
.cb-product-banner__content {
  display: flex; flex-direction: column; gap: 16px;
  padding: 30px; border-radius: 28px;
  background: rgba(255,255,255,0.74);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 22px 60px rgba(15,23,42,0.10);
  backdrop-filter: blur(14px);
}
.cb-product-banner__kicker { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.65; }
.cb-product-banner__headline { font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; }
.cb-product-banner__tagline { font-size: 1rem; line-height: 1.7; opacity: 0.75; max-width: 480px; }
.cb-product-banner__product-info { display: flex; flex-direction: column; gap: 6px; padding: 20px 0; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); }
.cb-product-banner--light .cb-product-banner__product-info { border-color: rgba(0,0,0,0.1); }
.cb-product-banner__product-brand { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; }
.cb-product-banner__product-name { font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
.cb-product-banner__prices { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.cb-product-banner__original-price { font-size: 14px; font-weight: 500; opacity: 0.5; text-decoration: line-through; }
.cb-product-banner__sale-price { font-size: 1.75rem; font-weight: 800; color: #e53e3e; letter-spacing: -0.02em; }
.cb-product-banner--light .cb-product-banner__sale-price { color: #e53e3e; }
.cb-product-banner__media { position: relative; border-radius: 28px; overflow: hidden; aspect-ratio: 700 / 600; box-shadow: 0 22px 60px rgba(15,23,42,0.12); background: linear-gradient(135deg, #eef2ff, #f8fafc); }
.cb-product-banner--small .cb-product-banner__media { aspect-ratio: 700 / 460; }
.cb-product-banner--large .cb-product-banner__media { aspect-ratio: 700 / 740; }
.cb-product-banner__picture { position: absolute; inset: 0; display: block; }
.cb-product-banner__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-product-banner__badge { position: absolute; top: 16px; right: 16px; padding: 6px 12px; background-color: #e53e3e; color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; border-radius: 6px; z-index: 1; }

/* ------------------------------------------------------------
   11. LOGO WALL MODULE
   ------------------------------------------------------------ */
.cb-logo-wall__grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 28px 32px; }
.cb-logo-wall__item {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; opacity: 1;
  min-width: 196px; min-height: 92px; padding: 16px 18px; border-radius: 18px;
  background: rgba(255,255,255,0.78); border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 12px 32px rgba(15,23,42,0.06);
  backdrop-filter: blur(12px);
  transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.cb-logo-wall__item:hover { opacity: 1; transform: translateY(-2px); box-shadow: 0 18px 42px rgba(15,23,42,0.10); }
.cb-logo-wall__item img { position: relative; z-index: 2; width: 160px; height: 60px; object-fit: contain; display: block; }

/* ------------------------------------------------------------
   12. CTA MODULE
   ------------------------------------------------------------ */
.cb-cta { position: relative; overflow: hidden; }
.cb-cta--light { background-color: #f8f8fc; color: #1a1a2e; }
.cb-cta--dark { background-color: #1a1a2e; color: #ffffff; }
.cb-cta--gradient { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; }
.cb-cta__inner { display: flex; flex-direction: column; gap: 20px; }
.cb-cta--light .cb-cta__inner {
  padding: 32px; border-radius: 28px;
  background: rgba(255,255,255,0.74);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 22px 60px rgba(15,23,42,0.10);
  backdrop-filter: blur(14px);
}
.cb-cta__inner--left { align-items: flex-start; text-align: left; }
.cb-cta__inner--center { align-items: center; text-align: center; }
.cb-cta__inner--right { align-items: flex-end; text-align: right; }
.cb-cta__title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; }
.cb-cta__subtitle { font-size: 1rem; line-height: 1.65; opacity: 0.8; max-width: 560px; }

/* ------------------------------------------------------------
   13. FAQ MODULE
   ------------------------------------------------------------ */
.cb-faq__list { max-width: 800px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 12px; }
.cb-faq__item {
  position: relative;
  border: 1px solid rgba(15,23,42,0.07); border-radius: 18px; overflow: hidden;
  background: rgba(255,255,255,0.86);
  box-shadow: 0 14px 36px rgba(15,23,42,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.cb-faq__signal {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, rgba(99,102,241,0.88), rgba(14,165,198,0.58));
}
.cb-faq__item:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.18); box-shadow: 0 22px 60px rgba(15,23,42,0.10); }
.cb-faq__item summary { list-style: none; }
.cb-faq__item summary::-webkit-details-marker { display: none; }
.cb-faq__question { padding: 20px 24px; font-size: 16px; font-weight: 600; color: #1a1a2e; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: background-color 0.15s ease; user-select: none; }
.cb-faq__question:hover { background-color: rgba(99,102,241,0.06); }
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
   PRODUCT PAGE MVP MODULES
   ------------------------------------------------------------ */
.cb-product-block-head { max-width: 720px; margin-bottom: 32px; }
.cb-product-block-head__eyebrow { margin: 0 0 10px; font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #64748b; }
.cb-product-block-head__title { margin: 0; font-size: clamp(1.75rem, 4vw, 2.6rem); font-weight: 900; line-height: 1.08; color: #0f172a; }
.cb-product-block-head__subtitle { margin: 14px 0 0; max-width: 680px; font-size: 1rem; line-height: 1.7; color: #475569; }

.cb-product-features__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.cb-product-features--grid-6 .cb-product-features__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cb-product-features--icon-text .cb-product-features__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cb-product-features--cards .cb-product-features__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
.cb-product-features__item {
  position: relative; overflow: hidden; min-width: 0;
  min-height: 164px; border: 1px solid rgba(15,23,42,0.08); border-radius: 22px; padding: 24px 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,250,252,0.62));
  box-shadow: 0 18px 46px rgba(15,23,42,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cb-product-features__texture {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.48;
  background-image: linear-gradient(135deg, rgba(255,255,255,0.32), transparent 42%), linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px);
  background-size: auto, 18px 18px;
}
.cb-product-features__index {
  position: absolute; right: 22px; top: 20px;
  font-size: 12px; font-weight: 900; letter-spacing: 0.12em; color: rgba(15,23,42,0.26);
}
.cb-product-features__item:hover { transform: translateY(-3px); box-shadow: 0 24px 60px rgba(15,23,42,0.12); }
.cb-product-features--cards .cb-product-features__item {
  position: relative; min-height: 190px; padding: 30px 28px 28px; border-radius: 28px;
  background: #ffffff; border-color: rgba(79,70,229,0.13); box-shadow: 0 24px 70px rgba(79,70,229,0.11);
}
.cb-product-features--cards .cb-product-features__texture { opacity: 0.72; }
.cb-product-features--cards .cb-product-features__index { color: rgba(79,70,229,0.42); }
.cb-product-features--cards .cb-product-features__item::after {
  content: ""; position: absolute; right: 20px; top: 20px; width: 44px; height: 44px; border-radius: 999px;
  background: linear-gradient(135deg, rgba(79,70,229,0.12), rgba(125,211,252,0.16));
}
.cb-product-features--icon-text .cb-product-features__item {
  min-height: 112px; display: grid; grid-template-columns: 52px 1fr; gap: 16px; align-items: center;
  border-radius: 24px; background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(250,245,240,0.74));
}
.cb-product-features--grid-6 .cb-product-features__item { min-height: 142px; background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.78)); }
.cb-product-features__icon {
  position: relative; z-index: 1;
  display: inline-flex; width: 46px; height: 46px; align-items: center; justify-content: center;
  border-radius: 16px; background: linear-gradient(135deg, #e0f2fe, #eef2ff);
  box-shadow: inset 0 0 0 1px rgba(99,102,241,0.10);
  font-size: 22px; margin-bottom: 16px;
}
.cb-product-features--icon-text .cb-product-features__icon { margin-bottom: 0; }
.cb-product-features__content { position: relative; z-index: 1; min-width: 0; }
.cb-product-features--cards .cb-product-features__icon { width: 54px; height: 54px; border-radius: 20px; margin-bottom: 22px; font-size: 24px; }
.cb-product-features--cards .cb-product-features__item-title { font-size: 1.18rem; }
.cb-product-features--cards .cb-product-features__item-text { font-size: 0.96rem; line-height: 1.75; }
.cb-product-features__item-title { margin: 0 0 8px; font-size: 1.05rem; line-height: 1.25; font-weight: 800; color: #0f172a; }
.cb-product-features__item-text { margin: 0; font-size: 0.92rem; line-height: 1.65; color: #475569; }

.cb-product-showcase { overflow: hidden; }
.cb-product-showcase__inner { width: 100%; max-width: 1080px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 56px; align-items: center; }
.cb-product-showcase--spacious .cb-product-showcase__inner { grid-template-columns: 1fr; gap: 42px; text-align: center; }
.cb-product-showcase--spacious .cb-product-showcase__content { max-width: 680px; margin-left: auto; margin-right: auto; }
.cb-product-showcase--luxury { background-image: radial-gradient(circle at 78% 18%, rgba(125,211,252,0.26), transparent 34%), linear-gradient(135deg, rgba(248,251,255,0.95), rgba(234,247,255,0.82) 48%, rgba(255,247,237,0.9)); }
.cb-product-showcase--luxury .cb-product-showcase__inner { position: relative; display: block; min-height: 640px; }
.cb-product-showcase__inner--reverse .cb-product-showcase__media { order: -1; }
/* showcase content stays above overlapping product media */
.cb-product-showcase__content { position: relative; z-index: 4; max-width: 520px; }
.cb-product-showcase--split .cb-product-showcase__content {
  padding: 36px 38px; border-radius: 32px;
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(255,255,255,0.72);
  box-shadow: 0 28px 76px rgba(15,23,42,0.13);
  backdrop-filter: blur(14px);
}
.cb-product-showcase--luxury .cb-product-showcase__content {
  position: absolute; left: 24px; top: 50%; transform: translateY(-50%); z-index: 5;
  max-width: 430px; padding: 36px 34px; border-radius: 34px;
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(255,255,255,0.72);
  box-shadow: 0 28px 80px rgba(15,23,42,0.16);
  backdrop-filter: blur(18px);
}
.cb-product-showcase__title { margin: 0; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.05; font-weight: 900; color: #0f172a; }
.cb-product-showcase__subtitle { margin: 14px 0 0; font-size: 1.05rem; line-height: 1.65; font-weight: 650; color: #475569; }
.cb-product-showcase__description { margin: 12px 0 0; font-size: 0.96rem; line-height: 1.75; color: #475569; opacity: 0.86; }
.cb-product-showcase__btn { margin-top: 24px; border-radius: 999px; }
.cb-product-showcase__media { position: relative; z-index: 1; aspect-ratio: 1 / 1; border-radius: 28px; overflow: hidden; background: #eef2ff; box-shadow: 0 24px 70px rgba(15,23,42,0.12); }
.cb-product-showcase--spacious .cb-product-showcase__media { width: min(680px, 100%); margin-left: auto; margin-right: auto; }
.cb-product-showcase--split .cb-product-showcase__media {
  border: 1px solid rgba(79,70,229,0.12);
  box-shadow: 0 22px 58px rgba(79,70,229,0.13);
}
.cb-product-showcase--split .cb-product-showcase__media::after {
  content: ""; position: absolute; inset: 18px; border-radius: 24px;
  background-image: linear-gradient(rgba(79,70,229,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.08) 1px, transparent 1px);
  background-size: 28px 28px; pointer-events: none;
}
.cb-product-showcase--luxury .cb-product-showcase__media {
  width: 72%; margin-left: auto; aspect-ratio: 920 / 760; border-radius: 36px;
  background: radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98), rgba(224,242,254,0.78) 52%, rgba(219,234,254,0.62));
}
.cb-product-showcase__picture { position: absolute; inset: 0; display: block; }
.cb-product-showcase__picture img { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-product-showcase--luxury .cb-product-showcase__picture img { object-fit: cover; }

.cb-product-scenes__single { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.cb-product-scenes--right-image .cb-product-scenes__single .cb-product-scenes__media { order: 2; }
.cb-product-scenes--full-bleed .cb-product-scenes__single { display: block; position: relative; }
.cb-product-scenes--full-bleed .cb-container { max-width: none; padding-left: 0; padding-right: 0; }
.cb-product-scenes__media { position: relative; aspect-ratio: 900 / 640; border-radius: 28px; overflow: hidden; background: #eef2ff; box-shadow: 0 22px 64px rgba(15,23,42,0.12); }
.cb-product-scenes--full-bleed .cb-product-scenes__media { border-radius: 0; }
.cb-product-scenes--full-bleed .cb-product-scenes__media { aspect-ratio: 1920 / 680; box-shadow: none; }
.cb-product-scenes--full-bleed .cb-product-scenes__media::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(15,23,42,0.56), rgba(15,23,42,0.12) 46%, transparent);
}
.cb-product-scenes__picture { position: absolute; inset: 0; display: block; }
.cb-product-scenes__picture img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-product-scenes__content { max-width: 520px; }
.cb-product-scenes--full-bleed .cb-product-scenes__content {
  position: absolute; left: max(24px, calc(50% - 540px)); top: 50%; transform: translateY(-50%);
  z-index: 2; padding: 34px 36px; border-radius: 28px;
  background: rgba(255,255,255,0.82); box-shadow: 0 22px 64px rgba(15,23,42,0.14);
  backdrop-filter: blur(10px);
}
.cb-product-scenes__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.cb-product-scenes__card { overflow: hidden; border: 1px solid rgba(15,23,42,0.08); border-radius: 24px; background: #ffffff; box-shadow: 0 16px 42px rgba(15,23,42,0.08); }
.cb-product-scenes__body { padding: 20px 22px 22px; }
.cb-product-scenes__item-title { margin: 0 0 8px; font-size: 1.1rem; font-weight: 850; color: #0f172a; }
.cb-product-scenes__item-text { margin: 0; font-size: 0.94rem; line-height: 1.7; color: #475569; }

.cb-product-info__table { overflow: hidden; border: 1px solid rgba(15,23,42,0.08); border-radius: 24px; background: #ffffff; box-shadow: 0 22px 60px rgba(15,23,42,0.10); }
.cb-product-info__row { display: grid; grid-template-columns: 180px 1fr; gap: 18px; padding: 18px 20px; border-bottom: 1px solid rgba(15,23,42,0.08); }
.cb-product-info__row:last-child { border-bottom: none; }
.cb-product-info__label { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; }
.cb-product-info__value { margin: 0; font-size: 1.05rem; font-weight: 850; color: #0f172a; }
.cb-product-info__desc { margin: 6px 0 0; font-size: 0.9rem; line-height: 1.65; color: #475569; }
.cb-product-info--ingredients .cb-product-info__table,
.cb-product-info--technology .cb-product-info__table { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cb-product-info--ingredients .cb-product-info__row,
.cb-product-info--technology .cb-product-info__row { display: block; border-bottom: none; border-right: 1px solid rgba(15,23,42,0.08); }
.cb-product-info--ingredients .cb-product-info__table { gap: 16px; padding: 14px; background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(240,253,250,0.76)); box-shadow: 0 20px 58px rgba(20,184,166,0.08); }
.cb-product-info--ingredients .cb-product-info__row { padding: 22px 20px; border-radius: 20px; background: rgba(255,255,255,0.74); box-shadow: inset 0 0 0 1px rgba(20,184,166,0.10); }
.cb-product-info--ingredients .cb-product-info__label { display: inline-flex; border-radius: 999px; padding: 5px 10px; background: rgba(20,184,166,0.10); }
.cb-product-info--technology .cb-product-info__table {
  gap: 16px; padding: 14px; border-color: rgba(125,211,252,0.18); border-radius: 30px;
  background-image: linear-gradient(rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(135deg, #0f172a, #1e293b);
  background-size: 28px 28px, 28px 28px, auto; box-shadow: 0 24px 72px rgba(15,23,42,0.22);
}
.cb-product-info--technology .cb-product-info__row { padding: 24px 22px; border-radius: 20px; background: rgba(15,23,42,0.55); box-shadow: inset 0 0 0 1px rgba(125,211,252,0.14); }
.cb-product-info--technology .cb-product-info__label { width: fit-content; border-radius: 999px; padding: 4px 9px; background: rgba(125,211,252,0.13); color: #bae6fd; opacity: 1; }
.cb-product-info--technology .cb-product-info__value { color: #ffffff; font-size: 1.18rem; }
.cb-product-info--technology .cb-product-info__desc { color: rgba(226,232,240,0.78); }
.cb-product-info--contents .cb-product-info__table { padding: 14px; background: linear-gradient(180deg, #ffffff, #f8fafc); }
.cb-product-info--contents .cb-product-info__table { counter-reset: cb-contents; }
.cb-product-info--contents .cb-product-info__row { position: relative; padding: 18px 18px 18px 58px; border-bottom: none; border-radius: 20px; background: rgba(255,255,255,0.72); }
.cb-product-info--contents .cb-product-info__row::before {
  counter-increment: cb-contents; content: counter(cb-contents); position: absolute; left: 18px; top: 18px; width: 28px; height: 28px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: #eef2ff; color: #4f46e5; font-size: 12px; font-weight: 900; box-shadow: inset 0 0 0 1px rgba(79,70,229,0.16);
}

.cb-product-benefits__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.cb-product-benefits--stacked .cb-product-benefits__grid { grid-template-columns: 1fr; }
.cb-product-benefits__item { position: relative; overflow: hidden; border: 1px solid rgba(15,23,42,0.08); border-radius: 26px; padding: 28px; background: #ffffff; box-shadow: 0 18px 48px rgba(15,23,42,0.08); }
.cb-product-benefits__signal {
  position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
  background: linear-gradient(180deg, rgba(15,23,42,0.20), rgba(15,23,42,0.04));
}
.cb-product-benefits--pain-solution .cb-product-benefits__item { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.86)); border-color: rgba(79,70,229,0.14); box-shadow: 0 22px 58px rgba(79,70,229,0.10); }
.cb-product-benefits--pain-solution .cb-product-benefits__signal { width: 8px; background: linear-gradient(180deg, #4f46e5, #22d3ee); }
.cb-product-benefits--pain-solution .cb-product-benefits__item::after { content: ""; position: absolute; right: -24px; top: -24px; width: 86px; height: 86px; border-radius: 999px; background: rgba(79,70,229,0.10); }
.cb-product-benefits--stacked .cb-product-benefits__item { display: grid; grid-template-columns: 92px 1fr; gap: 22px; align-items: center; background: rgba(255,255,255,0.82); backdrop-filter: blur(10px); }
.cb-product-benefits__metric { margin: 0 0 18px; font-size: 2rem; line-height: 1; font-weight: 900; color: #0f172a; }
.cb-product-benefits--pain-solution .cb-product-benefits__metric,
.cb-product-benefits--stacked .cb-product-benefits__metric { font-size: 0.85rem; opacity: 0.64; }
.cb-product-benefits--stacked .cb-product-benefits__metric { display: inline-flex; width: 68px; height: 68px; align-items: center; justify-content: center; margin: 0; border-radius: 24px; background: linear-gradient(135deg, rgba(248,250,252,0.96), rgba(255,255,255,0.74)); opacity: 1; }
.cb-product-benefits__title { margin: 0 0 8px; font-size: 1.12rem; font-weight: 850; color: #0f172a; }
.cb-product-benefits__text { margin: 0; font-size: 0.95rem; line-height: 1.7; color: #475569; }

.cb-product-steps__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.cb-product-steps--timeline .cb-product-steps__grid { position: relative; grid-template-columns: 1fr; }
.cb-product-steps--timeline .cb-product-steps__grid::before { content: ""; position: absolute; left: 49px; top: 34px; bottom: 34px; width: 2px; background: linear-gradient(180deg, rgba(15,23,42,0.06), rgba(99,102,241,0.24), rgba(15,23,42,0.06)); }
.cb-product-steps__item { border: 1px solid rgba(15,23,42,0.08); border-radius: 26px; padding: 22px; background: #ffffff; box-shadow: 0 16px 42px rgba(15,23,42,0.07); }
.cb-product-steps--timeline .cb-product-steps__item { position: relative; display: grid; grid-template-columns: 120px 1fr; gap: 18px; }
.cb-product-steps__number { display: inline-flex; width: 54px; height: 54px; align-items: center; justify-content: center; border-radius: 18px; background: linear-gradient(135deg, #e0f2fe, #eef2ff); font-size: 1.35rem; line-height: 1; font-weight: 900; color: #0f172a; }
.cb-product-steps__media { position: relative; aspect-ratio: 900 / 640; margin: 16px 0; overflow: hidden; border-radius: 20px; background: #eef2ff; box-shadow: 0 16px 42px rgba(15,23,42,0.08); }
.cb-product-steps__picture { position: absolute; inset: 0; display: block; }
.cb-product-steps__picture img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-product-steps__title { margin: 0 0 8px; font-size: 1.1rem; font-weight: 850; color: #0f172a; }
.cb-product-steps__text { margin: 0; font-size: 0.94rem; line-height: 1.7; color: #475569; }

.cb-product-comparison__table { overflow: hidden; border: 1px solid rgba(15,23,42,0.08); border-radius: 26px; background: #ffffff; box-shadow: 0 20px 56px rgba(15,23,42,0.09); }
.cb-product-comparison__head,
.cb-product-comparison__row { display: grid; grid-template-columns: 1.1fr 1fr 1fr; }
.cb-product-comparison__head { background: linear-gradient(135deg, #f8fafc, #eef6ff); color: #0f172a; font-weight: 850; }
.cb-product-comparison--before-after .cb-product-comparison__head { background: linear-gradient(135deg, #111827, #334155); color: #ffffff; }
.cb-product-comparison__head > div,
.cb-product-comparison__label,
.cb-product-comparison__cell { padding: 16px 18px; }
.cb-product-comparison__row { border-top: 1px solid rgba(15,23,42,0.08); }
.cb-product-comparison__label { color: #0f172a; }
.cb-product-comparison__cell { margin: 0; color: #475569; }
.cb-product-comparison__cell::before { content: ""; display: none; }
.cb-product-comparison--before-after .cb-product-comparison__cell:last-child { background: rgba(14,165,198,0.08); font-weight: 760; }

.cb-product-proof__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.cb-product-proof__item { border: 1px solid rgba(15,23,42,0.08); border-radius: 26px; padding: 26px; background: #ffffff; text-align: center; box-shadow: 0 18px 48px rgba(15,23,42,0.08); }
.cb-product-proof--reviews .cb-product-proof__item { background: linear-gradient(180deg, #ffffff, #f8fafc); }
.cb-product-proof--reviews .cb-product-proof__item::before { content: "★★★★★"; display: block; margin-bottom: 12px; color: #f59e0b; font-size: 18px; letter-spacing: 2px; }
.cb-product-proof--guarantee .cb-product-proof__item { border-color: rgba(245,158,11,0.26); border-radius: 999px; box-shadow: 0 18px 48px rgba(245,158,11,0.10); }
.cb-product-proof--certifications .cb-product-proof__item {
  position: relative; overflow: hidden; border-radius: 18px; text-align: left;
  border-color: rgba(15,23,42,0.12); background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow: 0 14px 32px rgba(15,23,42,0.07);
}
.cb-product-proof--certifications .cb-product-proof__item::after {
  content: ""; position: absolute; right: 18px; top: 18px; width: 38px; height: 48px; border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.12); background: linear-gradient(180deg, #f8fafc, #ffffff);
}
.cb-product-proof__badge { display: inline-flex; min-width: 60px; height: 60px; align-items: center; justify-content: center; margin-bottom: 16px; padding: 0 14px; border-radius: 999px; background: linear-gradient(135deg, #e0f2fe, #eef2ff); box-shadow: inset 0 0 0 1px rgba(99,102,241,0.12); color: #0f172a; font-weight: 900; }
.cb-product-proof--guarantee .cb-product-proof__badge { min-width: 74px; height: 48px; background: linear-gradient(135deg, #fef3c7, #ffffff); }
.cb-product-proof--certifications .cb-product-proof__badge { min-width: 52px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #111827, #334155); color: #ffffff; }
.cb-product-proof__title { margin: 0 0 8px; font-size: 1.08rem; font-weight: 850; color: #0f172a; }
.cb-product-proof__text { margin: 0; font-size: 0.94rem; line-height: 1.7; color: #475569; }

.cb-product-purchase { color: rgba(255,255,255,0.78); }
.cb-product-purchase .cb-container { position: relative; }
.cb-product-purchase__glow {
  position: absolute; inset: -24px; border-radius: 36px; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(99,102,241,0.12), rgba(34,211,238,0.08));
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 90px rgba(0,0,0,0.20);
}
.cb-product-purchase .cb-product-block-head { margin-left: auto; margin-right: auto; text-align: center; }
.cb-product-purchase__action { margin-bottom: 28px; text-align: center; }
.cb-product-purchase__button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; border-radius: 999px; background: ${btnColor}; color: ${btnTextColor}; padding: 0 32px; font-weight: 850; text-decoration: none; box-shadow: 0 16px 36px rgba(0,0,0,0.18); }
.cb-page a.cb-product-purchase__button { color: ${btnTextColor}; }
.cb-product-purchase__button:hover { background: ${btnHover}; color: ${btnTextColor}; }
.cb-product-purchase--cta .cb-product-purchase__button { min-height: 56px; padding: 0 40px; box-shadow: none; }
.cb-product-purchase__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.cb-product-purchase__card { overflow: hidden; border-radius: 22px; background: #ffffff; color: #0f172a; text-decoration: none; box-shadow: 0 18px 48px rgba(0,0,0,0.18); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.cb-product-purchase__card:hover { transform: translateY(-3px); box-shadow: 0 22px 60px rgba(0,0,0,0.22); }
.cb-product-purchase--bundle .cb-product-purchase__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; }
.cb-product-purchase--bundle .cb-product-purchase__card:first-child { border-radius: 30px; transform: translateY(-10px); box-shadow: 0 26px 70px rgba(0,0,0,0.24); }
.cb-product-purchase--bundle .cb-product-purchase__card:first-child .cb-product-purchase__media::before {
  content: "推薦組合"; position: absolute; left: 14px; top: 14px; z-index: 1;
  border-radius: 999px; background: #0f172a; color: #ffffff; padding: 6px 10px; font-size: 12px; font-weight: 850;
}
.cb-product-purchase--related .cb-product-purchase__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.cb-product-purchase--related .cb-product-purchase__card { border-radius: 18px; box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
.cb-product-purchase__media { position: relative; display: block; aspect-ratio: 1 / 1; background: #eef2ff; }
.cb-product-purchase--related .cb-product-purchase__media { aspect-ratio: 4 / 3; }
.cb-product-purchase__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; display: block; }
.cb-product-purchase__body { display: block; padding: 16px; }
.cb-product-purchase--bundle .cb-product-purchase__card:first-child .cb-product-purchase__body { padding: 22px; }
.cb-product-purchase--related .cb-product-purchase__body { padding: 14px; }
.cb-product-purchase__brand { display: block; margin-bottom: 4px; font-size: 12px; font-weight: 750; color: #64748b; }
.cb-product-purchase__name { display: block; margin-bottom: 8px; font-size: 1rem; font-weight: 850; }
.cb-product-purchase--bundle .cb-product-purchase__card:first-child .cb-product-purchase__name { font-size: 1.16rem; }
.cb-product-purchase--related .cb-product-purchase__name { font-size: 0.95rem; }
.cb-product-purchase__price { display: block; font-weight: 900; color: #ef4444; }
.cb-product-purchase--bundle .cb-product-purchase__card:first-child .cb-product-purchase__price { font-size: 1.1rem; }

/* ------------------------------------------------------------
   15. RESPONSIVE
   ------------------------------------------------------------ */
@media (max-width: 1024px) {
  .cb-container { padding-left: 20px; padding-right: 20px; }
  .cb-section { padding-top: 32px; padding-bottom: 40px; }
  .cb-split__inner { gap: 40px; }
  .cb-products__grid { grid-template-columns: repeat(3, 1fr); }
  .cb-carousel__item { flex: 0 0 calc(33.333% - 14px); }
  .cb-product-banner__inner { gap: 40px; }
  .cb-product-features__grid,
  .cb-product-features--grid-6 .cb-product-features__grid,
  .cb-product-features--icon-text .cb-product-features__grid,
  .cb-product-features--cards .cb-product-features__grid,
  .cb-product-benefits__grid,
  .cb-product-steps__grid,
  .cb-product-proof__grid,
  .cb-product-purchase__grid,
  .cb-product-purchase--bundle .cb-product-purchase__grid,
  .cb-product-purchase--related .cb-product-purchase__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cb-product-showcase__inner,
  .cb-product-scenes__single { gap: 40px; }
  .cb-banner-products__inner { grid-template-columns: 1fr; height: auto; align-items: start; }
  .cb-banner-products__banner { aspect-ratio: 500 / 350; height: auto; }
  .cb-banner-products__inner--1 .cb-banner-products__banner { aspect-ratio: 880 / 350; }
  .cb-banner-products__inner--2 .cb-banner-products__banner { aspect-ratio: 700 / 350; }
  .cb-banner-products__inner--3 .cb-banner-products__banner { aspect-ratio: 520 / 350; }
  .cb-banner-products__inner--4 .cb-banner-products__banner { aspect-ratio: 328 / 350; }
  .cb-banner-products__products { height: auto; }
  .cb-banner-products .cb-product-card { width: auto; height: auto; }
  .cb-banner-products .cb-product-card__media { aspect-ratio: 1 / 1; height: auto; }
  .cb-banner-products__products--1 { grid-template-columns: 1fr; }
  .cb-banner-products__products--2,
  .cb-banner-products__products--3,
  .cb-banner-products__products--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cb-banner-products__products--4 { gap: 20px; }
}

@media (max-width: 768px) {
  ${pageBgImg ? `.cb-page { background-size: auto 100%; background-position: top center; }\n  ` : ''}.cb-section { padding-top: 24px; padding-bottom: 32px; }
  .cb-section { padding-top: 24px; padding-bottom: 32px; }
  .cb-title-block { padding-top: 10px; padding-bottom: 4px; }
  .cb-title-block__halo { width: 120px; height: 120px; }
  .cb-hero { flex-direction: column; align-items: stretch; }
  .cb-hero--small,
  .cb-hero--medium,
  .cb-hero--large { aspect-ratio: auto; }
  .cb-hero--image-only.cb-hero--small { aspect-ratio: 750 / 750; }
  .cb-hero--image-only.cb-hero--medium { aspect-ratio: 750 / 850; }
  .cb-hero--image-only.cb-hero--large { aspect-ratio: 750 / 950; }
  .cb-hero__content { position: relative; flex: 0 0 auto; width: 100%; max-width: none; padding: 20px 18px; background: var(--cb-hero-mobile-bg, #1a1a2e); }
  .cb-hero__media { position: relative; inset: auto; flex: 0 0 auto; order: -1; aspect-ratio: 750 / 850; }
  .cb-hero--small .cb-hero__media { aspect-ratio: 750 / 750; }
  .cb-hero--large .cb-hero__media { aspect-ratio: 750 / 950; }
  .cb-hero--image-only .cb-hero__media { flex: 1 1 auto; order: 0; }
  .cb-hero__title { font-size: 1.5rem; }
  .cb-split__inner { grid-template-columns: 1fr; gap: 32px; }
  .cb-split__inner--reverse .cb-split__media { order: 0; }
  .cb-products__grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .cb-carousel__item { flex: 0 0 calc(50% - 10px); }
  .cb-products.cb-section, .cb-carousel.cb-section { padding-top: 24px; padding-bottom: 32px; }
  .cb-banner-products__inner--0,
  .cb-banner-products__inner--1,
  .cb-banner-products__inner--2,
  .cb-banner-products__inner--3,
  .cb-banner-products__inner--4 { grid-template-columns: 1fr; }
  .cb-banner-products.cb-section { padding-top: 24px; padding-bottom: 32px; }
  .cb-banner-products .cb-container { padding-left: 16px; padding-right: 16px; }
  .cb-banner-products__banner,
  .cb-banner-products__inner--1 .cb-banner-products__banner,
  .cb-banner-products__inner--2 .cb-banner-products__banner,
  .cb-banner-products__inner--3 .cb-banner-products__banner,
  .cb-banner-products__inner--4 .cb-banner-products__banner { grid-column: 1 / -1; aspect-ratio: 750 / 520; }
  .cb-banner-products__products { grid-column: 1 / -1; }
  .cb-banner-products__products--1 { grid-template-columns: 1fr; }
  .cb-banner-products__products--2,
  .cb-banner-products__products--3,
  .cb-banner-products__products--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cb-anchor-nav { padding: 12px 0; }
  .cb-anchor-nav__inner { gap: 8px; }
  .cb-anchor-nav__link { flex-basis: calc(50% - 4px); width: calc(50% - 4px); }
  .cb-anchor-nav__link { min-height: 40px; font-size: 14px; }
  .cb-product-banner__inner { grid-template-columns: 1fr; gap: 32px; }
  .cb-product-banner__inner--reverse .cb-product-banner__media { order: 0; }
  .cb-product-banner__media { aspect-ratio: 750 / 850; }
  .cb-product-banner--small .cb-product-banner__media { aspect-ratio: 750 / 750; }
  .cb-product-banner--large .cb-product-banner__media { aspect-ratio: 750 / 900; }
  .cb-product-block-head { margin-bottom: 26px; }
  .cb-product-block-head__title { font-size: 1.75rem; }
  .cb-product-features__grid,
  .cb-product-features--grid-6 .cb-product-features__grid,
  .cb-product-features--icon-text .cb-product-features__grid,
  .cb-product-features--cards .cb-product-features__grid,
  .cb-product-scenes__grid,
  .cb-product-info--ingredients .cb-product-info__table,
  .cb-product-info--technology .cb-product-info__table,
  .cb-product-benefits__grid,
  .cb-product-steps__grid,
  .cb-product-proof__grid,
  .cb-product-purchase__grid,
  .cb-product-purchase--bundle .cb-product-purchase__grid,
  .cb-product-purchase--related .cb-product-purchase__grid { grid-template-columns: 1fr; }
  .cb-product-steps--timeline .cb-product-steps__item,
  .cb-product-benefits--stacked .cb-product-benefits__item,
  .cb-product-comparison__row { grid-template-columns: 1fr; }
  .cb-product-comparison__head { display: none; }
  .cb-product-comparison__row { gap: 10px; padding: 14px; }
  .cb-product-comparison__label { padding: 0 4px; }
  .cb-product-comparison__cell { padding: 12px 14px; border-radius: 16px; background: #f8fafc; }
  .cb-product-comparison__cell::before {
    content: attr(data-label); display: block; margin-bottom: 4px;
    font-size: 12px; font-weight: 850; letter-spacing: 0.08em; color: #64748b;
  }
  .cb-product-comparison--before-after .cb-product-comparison__cell:last-child::before { color: #0891b2; }
  .cb-product-purchase--bundle .cb-product-purchase__card:first-child { transform: none; }
  .cb-product-benefits--stacked .cb-product-benefits__metric { margin-bottom: 18px; }
  .cb-product-steps--timeline .cb-product-steps__grid::before { display: none; }
  .cb-product-steps__media { aspect-ratio: 750 / 900; }
  .cb-product-showcase__inner,
  .cb-product-showcase--spacious .cb-product-showcase__inner,
  .cb-product-scenes__single { grid-template-columns: 1fr; gap: 28px; padding-left: 16px; padding-right: 16px; }
  .cb-product-showcase--spacious .cb-product-showcase__inner { text-align: left; }
  .cb-product-showcase--luxury .cb-product-showcase__inner { display: grid; min-height: auto; }
  .cb-product-showcase--luxury .cb-product-showcase__media { width: auto; margin-left: 0; }
  .cb-product-showcase--split .cb-product-showcase__content,
  .cb-product-showcase--luxury .cb-product-showcase__content {
    position: relative; left: auto; top: auto; transform: none;
    padding: 0; border-radius: 0; background: transparent; box-shadow: none; backdrop-filter: none; border: none;
  }
  .cb-product-showcase__inner--reverse .cb-product-showcase__media,
  .cb-product-scenes--right-image .cb-product-scenes__single .cb-product-scenes__media { order: 0; }
  .cb-product-scenes--full-bleed .cb-product-scenes__single { display: grid; }
  .cb-product-scenes--full-bleed .cb-product-scenes__content {
    position: relative; left: auto; top: auto; transform: none;
    padding: 0; border-radius: 0; background: transparent; box-shadow: none; backdrop-filter: none;
  }
  .cb-product-scenes--full-bleed .cb-product-scenes__media::after { display: none; }
  .cb-product-showcase__media,
  .cb-product-scenes__media { aspect-ratio: 750 / 900; min-height: auto; }
  .cb-product-features--icon-text .cb-product-features__item { grid-template-columns: 44px 1fr; border-radius: 22px; padding: 18px 20px; }
  .cb-product-info__row { grid-template-columns: 1fr; gap: 6px; }
  .cb-logo-wall__grid { gap: 24px 32px; }
  .cb-logo-wall__item img { width: 160px; height: 60px; }
  .cb-cta__title { font-size: 1.75rem; }
  .cb-title-block__cn { font-size: 1.25rem; }
  .cb-title-block__en { font-size: 0.68rem; }
}

@media (max-width: 480px) {
  .cb-container { padding-left: 16px; padding-right: 16px; }
  .cb-products__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .cb-banner-products__products { gap: 12px; }
  .cb-product-card__body { padding: 10px 12px; }
  .cb-btn { padding: 12px 24px; font-size: 15px; }
}

/* ------------------------------------------------------------
   16. ARTICLE TEXT MODULE
   ------------------------------------------------------------ */
.cb-article-text,
.cb-article-image {
  position: relative;
  overflow: hidden;
}
.cb-article__inner {
  max-width: 800px; margin-left: auto; margin-right: auto;
  padding: 30px; border-radius: 28px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 22px 60px rgba(15,23,42,0.10);
  backdrop-filter: blur(14px);
}
.cb-article--center .cb-article__inner { text-align: center; }
.cb-article--left .cb-article__inner { text-align: left; }
.cb-article__eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9090b0; margin-bottom: 12px; }
.cb-article__title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #1a1a2e; margin: 0 0 16px; }
.cb-article__subtitle { font-size: 1rem; line-height: 1.65; color: #4a4a6a; margin: 0 0 28px; opacity: 0.85; }
.cb-article__content { font-size: 15px; line-height: 1.85; color: #4a4a6a; text-align: left; }
.cb-article--center .cb-article__content { text-align: center; }
.cb-article__meta { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e8e8f4; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.cb-article--center .cb-article__meta { justify-content: center; }
.cb-article__author { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.cb-article__date { font-size: 13px; color: #9090b0; }

/* ------------------------------------------------------------
   17. ARTICLE IMAGE MODULE
   ------------------------------------------------------------ */
.cb-article-img__picture { position: absolute; inset: 0; display: block; }
.cb-article-img__img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; }
.cb-article-img--top .cb-article-img__media--top {
  border-radius: 26px; overflow: hidden; margin-bottom: 36px;
  box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.08);
}
.cb-article-img--top .cb-article-img__media--top { position: relative; aspect-ratio: 1200 / 420; }
.cb-article-img__layout { display: grid; gap: 48px; align-items: flex-start; }
.cb-article-img__layout--left { grid-template-columns: 45% 1fr; }
.cb-article-img__layout--right { grid-template-columns: 1fr 45%; }
.cb-article-img__layout--right .cb-article-img__media { order: 2; }
.cb-article-img__layout--right .cb-article__inner { order: 1; }
.cb-article-img__layout .cb-article-img__media {
  position: relative; border-radius: 26px; overflow: hidden; aspect-ratio: 600 / 450;
  box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.08);
}

@media (max-width: 768px) {
  .cb-article-img__layout--left,
  .cb-article-img__layout--right { grid-template-columns: 1fr; gap: 20px; }
  .cb-article-img__layout--right .cb-article-img__media { order: 0; margin-bottom: 0; }
  .cb-article-img__layout--right .cb-article__inner { order: 0; }
  .cb-article-img--top .cb-article-img__media--top { aspect-ratio: 750 / 420; }
  .cb-article-img__layout .cb-article-img__media { min-height: auto; height: auto; aspect-ratio: 750 / 420; }
}

/* ------------------------------------------------------------
   18. HERO CAROUSEL (KV) MODULE — full-bleed desktop, stacked mobile
   ------------------------------------------------------------ */
.cb-kv { position: relative; overflow: hidden; }
.cb-kv--small  { aspect-ratio: 1920 / 480; }
.cb-kv--medium { aspect-ratio: 1920 / 640; }
.cb-kv--large  { aspect-ratio: 1920 / 800; }
.cb-kv__track { display: flex; height: 100%; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
.cb-kv__slide { flex: 0 0 100%; position: relative; height: 100%; overflow: hidden; }
.cb-kv__slide--image-only { }
.cb-kv__text {
  position: relative; z-index: 2; width: 100%; max-width: 1080px; height: 100%;
  margin-left: auto; margin-right: auto; padding: 0 40px;
  display: flex; flex-direction: column; justify-content: center; overflow: hidden;
}
.cb-kv__text--left   { align-items: flex-start; text-align: left; }
.cb-kv__text--center { align-items: center; text-align: center; }
.cb-kv__text--right  { align-items: flex-end; text-align: right; }
.cb-kv__img { position: absolute; inset: 0; overflow: hidden; }
.cb-kv__link { position: absolute; inset: 0; display: block; color: inherit; }
.cb-kv__picture { position: absolute; inset: 0; display: block; }
.cb-kv__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cb-kv__overlay { position: absolute; inset: 0; }
.cb-kv__title { font-size: 1.75rem; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }
.cb-kv__subtitle { font-size: clamp(0.8rem, 1vw, 0.9rem); line-height: 1.6; color: #ffffff; margin: 0 0 16px; max-width: 320px; }
.cb-kv__btn { }
.cb-kv__nav { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 3; color: #fff; font-size: 16px; box-shadow: 0 16px 42px rgba(15,23,42,0.18); transition: transform 0.2s ease, background 0.2s ease; }
.cb-kv__nav:hover { transform: translateY(-50%) scale(1.04); background: rgba(255,255,255,0.26); }
.cb-kv__nav--prev { left: 8px; }
.cb-kv__nav--next { right: 14px; }
.cb-kv__dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 7px; z-index: 3; }
.cb-kv__dot { width: 7px; height: 7px; border-radius: 4px; background: rgba(255,255,255,0.5); border: none; cursor: pointer; padding: 0; transition: width 0.3s, background 0.3s; }
.cb-kv__dot--active { width: 22px; background: #ffffff; }

@media (max-width: 768px) {
  .cb-kv--small,
  .cb-kv--medium,
  .cb-kv--large { aspect-ratio: auto; }
  .cb-kv__track { height: auto; }
  .cb-kv__slide { display: grid; grid-template-columns: 1fr; grid-template-rows: auto auto; height: auto; }
  .cb-kv__img { position: relative; inset: auto; aspect-ratio: 750 / 850; }
  .cb-kv--small .cb-kv__img { aspect-ratio: 750 / 750; }
  .cb-kv--large .cb-kv__img { aspect-ratio: 750 / 950; }
  .cb-kv__slide--image-only { grid-template-rows: 1fr; }
  .cb-kv__slide--image-only .cb-kv__img { aspect-ratio: auto; }
  .cb-kv--small .cb-kv__slide--image-only { aspect-ratio: 750 / 750; }
  .cb-kv--medium .cb-kv__slide--image-only { aspect-ratio: 750 / 850; }
  .cb-kv--large .cb-kv__slide--image-only { aspect-ratio: 750 / 950; }
  .cb-kv__img { grid-row: 1; grid-column: 1; }
  .cb-kv__text { grid-row: 2; grid-column: 1; width: 100%; max-width: none; height: auto; padding: 20px 18px; }
  .cb-kv__text--center, .cb-kv__text--right { align-items: flex-start; text-align: left; }
  .cb-kv__nav--prev { left: 8px; top: calc((100vw - 32px) / (750 / 850) / 2); }
  .cb-kv__nav--next { right: 8px; top: calc((100vw - 32px) / (750 / 850) / 2); }
  .cb-kv__dots { bottom: auto; top: calc((100vw - 32px) / (750 / 850) - 22px); left: 50%; }
  .cb-kv--small .cb-kv__nav--prev,
  .cb-kv--small .cb-kv__nav--next { top: calc((100vw - 32px) / (750 / 750) / 2); }
  .cb-kv--small .cb-kv__dots { top: calc((100vw - 32px) / (750 / 750) - 22px); }
  .cb-kv--large .cb-kv__nav--prev,
  .cb-kv--large .cb-kv__nav--next { top: calc((100vw - 32px) / (750 / 950) / 2); }
  .cb-kv--large .cb-kv__dots { top: calc((100vw - 32px) / (750 / 950) - 22px); }
}

/* ------------------------------------------------------------
   19. BANK PROMO MODULE
   ------------------------------------------------------------ */
.cb-bank-promo { position: relative; overflow: hidden; }
.cb-bank__header { text-align: center; margin-bottom: 32px; }
.cb-bank__title { font-size: clamp(1.1rem, 2vw, 1.6rem); font-weight: 700; letter-spacing: -0.02em; color: #1a1a2e; margin: 0 0 6px; }
.cb-bank__subtitle { font-size: 13px; color: #9090b0; margin: 0; }
.cb-bank__grid { display: grid; gap: 14px; }
.cb-bank__grid--1 { grid-template-columns: 1fr; }
.cb-bank__grid--2 { grid-template-columns: repeat(2, 1fr); }
.cb-bank__grid--3 { grid-template-columns: repeat(3, 1fr); }
.cb-bank__grid--4 { grid-template-columns: repeat(4, 1fr); }
.cb-bank-card {
  background: linear-gradient(180deg, #ffffff, #f8fafc); border-radius: 16px; overflow: hidden;
  box-shadow: 0 14px 36px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.08);
  display: flex; flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cb-bank-card:hover { transform: translateY(-3px); box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 0 0 1px rgba(99,102,241,0.16); }
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
  if (hex.includes('gradient(')) return hex;
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    if (Number.isNaN(n)) return '#4f46e5';
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
