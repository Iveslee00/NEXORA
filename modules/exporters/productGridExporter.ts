import { ProductGridData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { generateProductCardLabels } from './productCardLabels';

export function generateProductGridHTML(data: ProductGridData): string {
  const productCards = data.products
    .map((p) => {
      const labels = generateProductCardLabels(p);
      const brandStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
      const nameStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

      return `      <a href="${escapeHtml(p.link || '#')}" class="cb-product-card">
        <div class="cb-product-card__media">${labels}
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
        </div>
        <div class="cb-product-card__body">
          ${p.brand ? `<p class="cb-product-card__brand"${brandStyle}>${escapeHtml(p.brand)}</p>` : ''}
          <p class="cb-product-card__name"${nameStyle}>${escapeHtml(p.name)}</p>
          ${p.originalPrice || p.salePrice ? `<div class="cb-product-card__prices">${p.originalPrice ? `<span class="cb-product-card__original-price">${escapeHtml(p.originalPrice)}</span>` : ''}${p.salePrice ? `<span class="cb-product-card__sale-price">${escapeHtml(p.salePrice)}</span>` : ''}</div>` : ''}
        </div>
      </a>`;
    })
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-products cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-products__grid">
${productCards}
    </div>
  </div>
</section>`;
}
