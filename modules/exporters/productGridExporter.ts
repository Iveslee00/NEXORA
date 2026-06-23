import { ProductGridData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateProductGridHTML(data: ProductGridData): string {
  const productCards = data.products
    .map((p) => {
      const badge = p.showBadge && p.badgeText
        ? `\n          <span class="cb-product-card__badge">${escapeHtml(p.badgeText)}</span>`
        : '';
      const specialTag = p.showSpecialTag && p.specialTag
        ? `\n          <span class="cb-product-card__special-tag">${escapeHtml(p.specialTag)}</span>`
        : '';
      const bodyStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

      return `      <a href="${escapeHtml(p.link || '#')}" class="cb-product-card">
        <div class="cb-product-card__media">${badge}
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
        </div>
        <div class="cb-product-card__body"${bodyStyle}>
          ${p.brand ? `<p class="cb-product-card__brand">${escapeHtml(p.brand)}</p>` : ''}
          <p class="cb-product-card__name">${escapeHtml(p.name)}</p>
          ${p.originalPrice || p.salePrice ? `<div class="cb-product-card__prices">${p.originalPrice ? `<span class="cb-product-card__original-price">${escapeHtml(p.originalPrice)}</span>` : ''}${p.salePrice ? `<span class="cb-product-card__sale-price">${escapeHtml(p.salePrice)}</span>` : ''}</div>` : ''}${specialTag}
        </div>
      </a>`;
    })
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-products cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-products__grid">
${productCards}
    </div>
  </div>
</section>`;
}
