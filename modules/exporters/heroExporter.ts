import { HeroData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateHeroHTML(data: HeroData): string {
  const bgClass = `cb-hero--${data.backgroundStyle}`;
  const layoutClass = data.layout === 'centered' ? 'cb-hero--centered' : 'cb-hero--split';

  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const kicker = data.kicker
    ? `\n        <span class="cb-hero__kicker">${escapeHtml(data.kicker)}</span>`
    : '';

  const subtitle = data.subtitle
    ? `\n        <p class="cb-hero__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>`
    : '';

  const button = data.buttonText
    ? `\n        <a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn">${escapeHtml(data.buttonText)}</a>`
    : '';

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  if (data.layout === 'centered') {
    const media = data.image
      ? `\n        <div class="cb-hero__media cb-hero__media--centered">\n          <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">\n        </div>`
      : '';

    return `<section class="cb-hero cb-section ${bgClass} ${layoutClass}"${bgOverride}>
  <div class="cb-container">${kicker}
        <h1 class="cb-hero__title"${titleStyle}>${escapeHtml(data.title)}</h1>${subtitle}${media}${button}
  </div>
</section>`;
  }

  const media = data.image
    ? `<div class="cb-hero__media">\n          <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">\n        </div>`
    : '';

  return `<section class="cb-hero cb-section ${bgClass} ${layoutClass}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-hero__inner">
      <div class="cb-hero__content">${kicker}
        <h1 class="cb-hero__title"${titleStyle}>${escapeHtml(data.title)}</h1>${subtitle}${button}
      </div>
      ${media}
    </div>
  </div>
</section>`;
}
