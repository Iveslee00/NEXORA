import { BannerProductsData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getBannerProductsCountClass } from '@/lib/modules/bannerProducts';
import { generateProductCardLabels } from './productCardLabels';

export function generateBannerProductsHTML(data: BannerProductsData): string {
  const count = data.products.length;
  const countClass = getBannerProductsCountClass(count);
  const bannerTitleStyle = data.bannerTitleColor ? ` style="color: ${escapeHtml(data.bannerTitleColor)}"` : '';

  const productCards = data.products
    .map((p) => {
      const labels = generateProductCardLabels(p);
      const brandStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
      const nameStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

      return `      <a href="${escapeHtml(p.link || '#')}" class="cb-product-card">
        <div class="cb-product-card__media">${labels}
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
          <span class="cb-product-card__signal"></span>
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
  const bannerImg = data.bannerImage
    ? `<picture class="cb-banner-products__picture">${data.mobileBannerImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(data.mobileBannerImage)}">` : ''}\n          <img src="${escapeHtml(data.bannerImage)}" alt="${escapeHtml(data.bannerTitle)}" class="cb-banner-products__banner-img">\n        </picture>`
    : '';

  return `<section class="cb-banner-products cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-banner-products__inner cb-banner-products__inner${countClass}">
      <a href="${escapeHtml(data.bannerLink || '#')}" class="cb-banner-products__banner">
        <span class="cb-banner-products__frame"></span>
        ${bannerImg}
        <div class="cb-banner-products__banner-overlay">
          ${data.bannerTitle ? `<p class="cb-banner-products__banner-title"${bannerTitleStyle}>${escapeHtml(data.bannerTitle)}</p>` : ''}
          ${data.bannerSubtitle ? `<p class="cb-banner-products__banner-subtitle">${escapeHtml(data.bannerSubtitle)}</p>` : ''}
        </div>
      </a>
      <div class="cb-banner-products__products cb-banner-products__products${countClass}">
${productCards}
      </div>
    </div>
  </div>
</section>`;
}
