import { HeroData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateHeroHTML(data: HeroData): string {
  const heightClass = `cb-hero--${data.height ?? 'medium'}`;
  const imageOnlyClass = data.showText === false ? ' cb-hero--image-only' : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';
  const textBgStyle = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';

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
    : '';

  if (data.showText === false) {
    const linkedMedia = data.buttonLink && data.buttonLink !== '#'
      ? `<a href="${escapeHtml(data.buttonLink)}" class="cb-hero__link">${mediaPicture}</a>`
      : mediaPicture;
    return `<section class="cb-hero ${heightClass}${imageOnlyClass}">
  <div class="cb-hero__media cb-hero__media--full">
          ${linkedMedia}
  </div>
</section>`;
  }

  return `<section class="cb-hero ${heightClass}">
      <div class="cb-hero__content"${textBgStyle}>${kicker}
        <h1 class="cb-hero__title"${titleStyle}>${escapeHtml(data.title)}</h1>${subtitle}${button}
      </div>
      <div class="cb-hero__media">
          ${mediaPicture}
      </div>
</section>`;
}
