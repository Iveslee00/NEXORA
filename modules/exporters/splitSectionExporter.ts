import { SplitSectionData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateSplitSectionHTML(data: SplitSectionData): string {
  const reverseClass = data.reverse ? ' cb-split__inner--reverse' : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const button = data.buttonText
    ? `\n          <a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn">${escapeHtml(data.buttonText)}</a>`
    : '';

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-split cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-split__inner${reverseClass}">
      <div class="cb-split__content">
        <h2 class="cb-split__title"${titleStyle}>${escapeHtml(data.title)}</h2>
        <p class="cb-split__description"${textStyle}>${escapeHtml(data.description)}</p>${button}
      </div>
      <div class="cb-split__media">
        <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">
      </div>
    </div>
  </div>
</section>`;
}
