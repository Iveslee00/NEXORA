import { BannerProductsData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getBannerProductsCountClass, getBannerProductsLayoutLabel } from '@/lib/modules/bannerProducts';

export function generateBannerProductsHTML(data: BannerProductsData): string {
  const count = data.products.length;
  const countClass = getBannerProductsCountClass(count);
  const bgClass = data.backgroundStyle === 'dark' ? 'cb-banner-products--dark' : data.backgroundStyle === 'gradient' ? 'cb-banner-products--gradient' : '';
  const layoutLabel = getBannerProductsLayoutLabel(data);

  const bannerTitleStyle = data.bannerTitleColor ? ` style="color: ${escapeHtml(data.bannerTitleColor)}"` : '';

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

  return `<section class="cb-banner-products cb-section${bgClass ? ' ' + bgClass : ''}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-banner-products__inner cb-banner-products__inner${countClass}">
      <a href="${escapeHtml(data.bannerLink || '#')}" class="cb-banner-products__banner">
        ${data.bannerImage ? `<img src="${escapeHtml(data.bannerImage)}" alt="${escapeHtml(data.bannerTitle)}" class="cb-banner-products__banner-img">` : ''}
        <div class="cb-banner-products__banner-overlay">
          ${layoutLabel ? `<span class="cb-banner-products__layout-label">${escapeHtml(layoutLabel)}</span>` : ''}
          ${data.bannerTitle ? `<p class="cb-banner-products__banner-title"${bannerTitleStyle}>${escapeHtml(data.bannerTitle)}</p>` : ''}
          ${data.bannerSubtitle ? `<p class="cb-banner-products__banner-subtitle">${escapeHtml(data.bannerSubtitle)}</p>` : ''}
        </div>
      </a>
${productCards}
    </div>
  </div>
</section>`;
}
