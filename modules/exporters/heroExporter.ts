import { HeroData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';

export function generateHeroHTML(data: HeroData): string {
  const heightClass = `cb-hero--${data.height ?? 'medium'}`;
  const imageOnlyClass = data.showText === false ? ' cb-hero--image-only' : '';
  const imageSpecs = getKvImageSpecs(data.height, data.showText !== false);
  const titleStyle = ` style="color: ${escapeHtml(data.titleColor || '#ffffff')}"`;
  const textStyle = ` style="color: ${escapeHtml(data.textColor || '#ffffff')}"`;
  const sectionStyle = data.backgroundColor
    ? ` style="--cb-hero-mobile-bg: ${escapeHtml(data.backgroundColor)}"`
    : '';

  const kicker = data.kicker
    ? `\n        <span class="cb-hero__kicker">${escapeHtml(data.kicker)}</span>`
    : '';

  const subtitle = data.subtitle
    ? `\n        <p class="cb-hero__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>`
    : '';

  const button = data.buttonText
    ? `\n        <a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn">${escapeHtml(data.buttonText)}</a>`
    : '';

  const mediaPicture = data.image
    ? `<picture class="cb-hero__picture">${data.mobileImage ? `\n            <source media="(max-width: 767px)" srcset="${escapeHtml(data.mobileImage)}">` : ''}\n            <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">\n          </picture>`
    : renderImagePlaceholder(data.showText === false ? 'KV PC 滿版' : 'KV PC 圖片區', imageSpecs.desktop, 'dark');

  if (data.showText === false) {
    const linkedMedia = data.buttonLink && data.buttonLink !== '#'
      ? `<a href="${escapeHtml(data.buttonLink)}" class="cb-hero__link">${mediaPicture}</a>`
      : mediaPicture;
    return `<section class="cb-hero ${heightClass}${imageOnlyClass}"${sectionStyle}>
  <span class="cb-hero__depth-layer"></span>
  <div class="cb-hero__media cb-hero__media--full">
          ${linkedMedia}
  </div>
</section>`;
  }

  return `<section class="cb-hero ${heightClass}"${sectionStyle}>
      <span class="cb-hero__depth-layer"></span>
      <div class="cb-hero__content">${kicker}
        <h1 class="cb-hero__title"${titleStyle}>${escapeHtml(data.title)}</h1>${subtitle}${button}
      </div>
      <div class="cb-hero__media">
          ${mediaPicture}
      </div>
</section>`;
}
