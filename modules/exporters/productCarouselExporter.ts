import { ProductCarouselData } from '@/types/modules';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { escapeHtml } from '@/lib/utils';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';
import { generateProductCardLabels } from './productCardLabels';

export function generateProductCarouselHTML(data: ProductCarouselData): string {
  const brandStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const nameStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const items = data.products
    .map((p) => {
      const labels = generateProductCardLabels(p);

      return `        <div class="cb-carousel__item">
          <a href="${escapeHtml(p.link || '#')}" class="cb-product-card">
            <div class="cb-product-card__media">${labels}
              ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">` : renderImagePlaceholder('商品圖', IMAGE_SPECS.product)}
              <span class="cb-product-card__signal"></span>
            </div>
            <div class="cb-product-card__body">
              ${p.brand ? `<p class="cb-product-card__brand"${brandStyle}>${escapeHtml(p.brand)}</p>` : ''}
              <p class="cb-product-card__name"${nameStyle}>${escapeHtml(p.name)}</p>
              ${p.originalPrice || p.salePrice ? `<div class="cb-product-card__prices">${p.originalPrice ? `<span class="cb-product-card__original-price">${escapeHtml(p.originalPrice)}</span>` : ''}${p.salePrice ? `<span class="cb-product-card__sale-price">${escapeHtml(p.salePrice)}</span>` : ''}</div>` : ''}
            </div>
          </a>
        </div>`;
    })
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-carousel cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-carousel__wrapper">
      <button class="cb-carousel__btn cb-carousel__btn--prev" aria-label="Previous">&#8592;</button>
      <div class="cb-carousel__track-outer">
        <div class="cb-carousel__track">
${items}
        </div>
      </div>
      <button class="cb-carousel__btn cb-carousel__btn--next" aria-label="Next">&#8594;</button>
    </div>
  </div>
</section>`;
}
