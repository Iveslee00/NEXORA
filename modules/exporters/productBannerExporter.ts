import { ProductBannerData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateProductBannerHTML(data: ProductBannerData): string {
  const bgClass = `cb-product-banner--${data.backgroundStyle}`;
  const reverseClass = data.reverse ? ' cb-product-banner__inner--reverse' : '';

  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const kicker = data.kicker
    ? `<span class="cb-product-banner__kicker">${escapeHtml(data.kicker)}</span>\n        `
    : '';

  const tagline = data.tagline
    ? `\n        <p class="cb-product-banner__tagline"${textStyle}>${escapeHtml(data.tagline)}</p>`
    : '';

  const badge = data.showBadge && data.badgeText
    ? `\n        <span class="cb-product-banner__badge">${escapeHtml(data.badgeText)}</span>`
    : '';

  const originalPrice = data.originalPrice
    ? `<span class="cb-product-banner__original-price">${escapeHtml(data.originalPrice)}</span>`
    : '';

  const salePrice = data.salePrice
    ? `<span class="cb-product-banner__sale-price">${escapeHtml(data.salePrice)}</span>`
    : '';

  const button = data.buttonText
    ? `\n        <a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn">${escapeHtml(data.buttonText)}</a>`
    : '';

  const isDark = data.backgroundStyle === 'dark' || data.backgroundStyle === 'gradient';
  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-product-banner cb-section ${bgClass}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-product-banner__inner${reverseClass}">
      <div class="cb-product-banner__content">
        ${kicker}<h2 class="cb-product-banner__headline"${titleStyle}>${escapeHtml(data.headline)}</h2>${tagline}
        <div class="cb-product-banner__product-info">
          ${data.brand ? `<p class="cb-product-banner__product-brand">${escapeHtml(data.brand)}</p>` : ''}
          <p class="cb-product-banner__product-name"${titleStyle}>${escapeHtml(data.productName)}</p>
          ${originalPrice || salePrice ? `<div class="cb-product-banner__prices">${originalPrice}${salePrice}</div>` : ''}
        </div>${button}
      </div>
      <div class="cb-product-banner__media">
        <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.productName)}">${badge}
      </div>
    </div>
  </div>
</section>`;
}
