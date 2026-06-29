import { ProductFeaturesData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateProductFeaturesHTML(data: ProductFeaturesData): string {
  const bg = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';
  const items = data.items.map((item, index) => `      <article class="cb-product-features__item">
        <span class="cb-product-features__texture" aria-hidden="true"></span>
        <span class="cb-product-features__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <span class="cb-product-features__icon">${escapeHtml(item.icon)}</span>
        <h3 class="cb-product-features__item-title"${titleStyle}>${escapeHtml(item.title)}</h3>
        <p class="cb-product-features__item-text"${textStyle}>${escapeHtml(item.description)}</p>
      </article>`).join('\n');

  return `<section class="cb-product-features cb-product-features--${escapeHtml(data.style)} cb-section"${bg}>
  <div class="cb-container">
    <div class="cb-product-block-head">
      ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${textStyle}>${escapeHtml(data.eyebrow)}</p>` : ''}
      <h2 class="cb-product-block-head__title"${titleStyle}>${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<p class="cb-product-block-head__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
    </div>
    <div class="cb-product-features__grid">
${items}
    </div>
  </div>
</section>`;
}
