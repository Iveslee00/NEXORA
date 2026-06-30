import {
  ProductBenefitsData,
  ProductComparisonData,
  ProductProofData,
  ProductPurchaseData,
  ProductStepsData,
} from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

const textStyle = (color: string) => color ? ` style="color: ${escapeHtml(color)}"` : '';
const bgStyle = (color: string) => color ? ` style="background: ${escapeHtml(color)}"` : '';

function headHTML(data: { eyebrow: string; title: string; subtitle: string; titleColor: string; textColor: string }) {
  const title = textStyle(data.titleColor);
  const text = textStyle(data.textColor);
  return `<div class="cb-product-block-head">
      ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${text}>${escapeHtml(data.eyebrow)}</p>` : ''}
      <h2 class="cb-product-block-head__title"${title}>${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<p class="cb-product-block-head__subtitle"${text}>${escapeHtml(data.subtitle)}</p>` : ''}
    </div>`;
}

const renderPicture = (image: string, mobileImage: string, title: string) => image
  ? `<picture class="cb-product-steps__picture">${mobileImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(mobileImage)}">` : ''}\n          <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">\n        </picture>`
  : '';

export function generateProductBenefitsHTML(data: ProductBenefitsData): string {
  const title = textStyle(data.titleColor);
  const text = textStyle(data.textColor);
  const items = data.items.map((item) => `      <article class="cb-product-benefits__item">
        <span class="cb-product-benefits__signal" aria-hidden="true"></span>
        <p class="cb-product-benefits__metric"${title}>${escapeHtml(item.metric)}</p>
        <h3 class="cb-product-benefits__title"${title}>${escapeHtml(item.title)}</h3>
        <p class="cb-product-benefits__text"${text}>${escapeHtml(item.description)}</p>
      </article>`).join('\n');

  return `<section class="cb-product-benefits cb-product-benefits--${escapeHtml(data.style)} cb-section"${bgStyle(data.backgroundColor)}>
  <div class="cb-container">
    ${headHTML(data)}
    <div class="cb-product-benefits__grid">
${items}
    </div>
  </div>
</section>`;
}

export function generateProductStepsHTML(data: ProductStepsData): string {
  const title = textStyle(data.titleColor);
  const text = textStyle(data.textColor);
  const items = data.items.map((item) => `      <article class="cb-product-steps__item">
        <div class="cb-product-steps__number"${title}>${escapeHtml(item.step)}</div>
        ${data.style === 'image-cards' ? `<div class="cb-product-steps__media">${renderPicture(item.image, item.mobileImage, item.title)}</div>` : ''}
        <div class="cb-product-steps__body">
          <h3 class="cb-product-steps__title"${title}>${escapeHtml(item.title)}</h3>
          <p class="cb-product-steps__text"${text}>${escapeHtml(item.description)}</p>
        </div>
      </article>`).join('\n');

  return `<section class="cb-product-steps cb-product-steps--${escapeHtml(data.style)} cb-section"${bgStyle(data.backgroundColor)}>
  <div class="cb-container">
    ${headHTML(data)}
    <div class="cb-product-steps__grid">
${items}
    </div>
  </div>
</section>`;
}

export function generateProductComparisonHTML(data: ProductComparisonData): string {
  const title = textStyle(data.titleColor);
  const text = textStyle(data.textColor);
  const beforeLabel = escapeHtml(data.beforeTitle || '一般商品');
  const afterLabel = escapeHtml(data.afterTitle || '使用本商品');
  const rows = data.items.map((item) => `      <div class="cb-product-comparison__row">
        <strong class="cb-product-comparison__label"${title}>${escapeHtml(item.label)}</strong>
        <p class="cb-product-comparison__cell"${text} data-label="${beforeLabel}">${escapeHtml(item.before)}</p>
        <p class="cb-product-comparison__cell"${text} data-label="${afterLabel}">${escapeHtml(item.after)}</p>
      </div>`).join('\n');

  return `<section class="cb-product-comparison cb-product-comparison--${escapeHtml(data.style)} cb-section"${bgStyle(data.backgroundColor)}>
  <div class="cb-container">
    ${headHTML(data)}
    <div class="cb-product-comparison__table">
      <div class="cb-product-comparison__head">
        <div>項目</div>
        <div>${beforeLabel}</div>
        <div>${afterLabel}</div>
      </div>
${rows}
    </div>
  </div>
</section>`;
}

export function generateProductProofHTML(data: ProductProofData): string {
  const title = textStyle(data.titleColor);
  const text = textStyle(data.textColor);
  const items = data.items.map((item) => `      <article class="cb-product-proof__item">
        <span class="cb-product-proof__badge"${title}>${escapeHtml(item.badge)}</span>
        <h3 class="cb-product-proof__title"${title}>${escapeHtml(item.title)}</h3>
        <p class="cb-product-proof__text"${text}>${escapeHtml(item.description)}</p>
      </article>`).join('\n');

  return `<section class="cb-product-proof cb-product-proof--${escapeHtml(data.style)} cb-section"${bgStyle(data.backgroundColor)}>
  <div class="cb-container">
    ${headHTML(data)}
    <div class="cb-product-proof__grid">
${items}
    </div>
  </div>
</section>`;
}

export function generateProductPurchaseHTML(data: ProductPurchaseData): string {
  const visibleProducts = data.style === 'bundle' ? data.products.slice(0, 3) : data.products;
  const products = visibleProducts.map((product) => `      <a class="cb-product-purchase__card" href="${escapeHtml(product.link || '#')}">
        <span class="cb-product-purchase__media">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">` : ''}</span>
        <span class="cb-product-purchase__body">
          <span class="cb-product-purchase__brand">${escapeHtml(product.brand)}</span>
          <strong class="cb-product-purchase__name">${escapeHtml(product.name)}</strong>
          <span class="cb-product-purchase__price">${escapeHtml(product.salePrice)}</span>
        </span>
      </a>`).join('\n');

  return `<section class="cb-product-purchase cb-product-purchase--${escapeHtml(data.style)} cb-section"${bgStyle(data.backgroundColor)}>
  <div class="cb-container">
    <span class="cb-product-purchase__glow" aria-hidden="true"></span>
    ${headHTML(data)}
    <div class="cb-product-purchase__action">
      <a class="cb-product-purchase__button" href="${escapeHtml(data.buttonLink || '#')}">${escapeHtml(data.buttonText)}</a>
    </div>
    ${data.style === 'cta' ? '' : `<div class="cb-product-purchase__grid">
${products}
    </div>`}
  </div>
</section>`;
}
