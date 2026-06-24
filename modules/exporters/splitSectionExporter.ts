import { SplitSectionData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateSplitSectionHTML(data: SplitSectionData): string {
  const reverseClass = data.reverse ? ' cb-split__inner--reverse' : '';
  const heightClass = ` cb-split--${data.height ?? 'medium'}`;
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const button = data.buttonText
    ? `\n          <a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn cb-split__btn">${escapeHtml(data.buttonText)}</a>`
    : '';

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';
  const imageEl = data.image
    ? `<picture class="cb-split__picture">${data.mobileImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(data.mobileImage)}">` : ''}\n          <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">\n        </picture>`
    : '';

  return `<section class="cb-split cb-section${heightClass}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-split__inner${reverseClass}">
      <div class="cb-split__content">
        <h2 class="cb-split__title"${titleStyle}>${escapeHtml(data.title)}</h2>
        <p class="cb-split__description"${textStyle}>${escapeHtml(data.description)}</p>${button}
      </div>
      <div class="cb-split__media">
        ${imageEl}
      </div>
    </div>
  </div>
</section>`;
}
