import { CtaData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateCtaHTML(data: CtaData): string {
  const bgClass = `cb-cta--${data.backgroundStyle}`;
  const alignClass = `cb-cta__inner--${data.alignment}`;
  const isDark = data.backgroundStyle === 'dark' || data.backgroundStyle === 'gradient';
  const btnClass = isDark ? 'cb-btn cb-btn--white' : 'cb-btn';

  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const subtitle = data.subtitle
    ? `\n        <p class="cb-cta__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>`
    : '';

  const button = data.buttonText
    ? `\n        <a href="${escapeHtml(data.buttonLink || '#')}" class="${btnClass}">${escapeHtml(data.buttonText)}</a>`
    : '';

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-cta cb-section ${bgClass}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-cta__inner ${alignClass}">
      <h2 class="cb-cta__title"${titleStyle}>${escapeHtml(data.title)}</h2>${subtitle}${button}
    </div>
  </div>
</section>`;
}
