import { ProductScenesData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';

const renderImage = (image: string, mobileImage: string, title: string) => image
  ? `<picture class="cb-product-scenes__picture">${mobileImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(mobileImage)}">` : ''}\n          <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">\n        </picture>`
  : renderImagePlaceholder('商品情境', IMAGE_SPECS.productScene);

export function generateProductScenesHTML(data: ProductScenesData): string {
  const bg = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';
  const first = data.items[0];
  const isSingle = data.style === 'left-image' || data.style === 'right-image' || data.style === 'full-bleed';
  const cards = data.items.slice(0, 4).map((item) => `      <article class="cb-product-scenes__card">
        <div class="cb-product-scenes__media">${renderImage(item.image, item.mobileImage, item.title)}</div>
        <div class="cb-product-scenes__body">
          <h3 class="cb-product-scenes__item-title"${titleStyle}>${escapeHtml(item.title)}</h3>
          <p class="cb-product-scenes__item-text"${textStyle}>${escapeHtml(item.description)}</p>
        </div>
      </article>`).join('\n');

  const singleBody = first ? `<div class="cb-product-scenes__media">${renderImage(first.image, first.mobileImage, first.title)}</div>
    <div class="cb-product-scenes__content">
      <div class="cb-product-block-head">
        ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${textStyle}>${escapeHtml(data.eyebrow)}</p>` : ''}
        <h2 class="cb-product-block-head__title"${titleStyle}>${escapeHtml(data.title)}</h2>
        ${data.subtitle ? `<p class="cb-product-block-head__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
      </div>
      <h3 class="cb-product-scenes__item-title"${titleStyle}>${escapeHtml(first.title)}</h3>
      <p class="cb-product-scenes__item-text"${textStyle}>${escapeHtml(first.description)}</p>
    </div>` : '';

  return `<section class="cb-product-scenes cb-product-scenes--${escapeHtml(data.style)} cb-section"${bg}>
  <div class="cb-container">
    ${isSingle ? `<div class="cb-product-scenes__single">${singleBody}</div>` : `<div class="cb-product-block-head">
      ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${textStyle}>${escapeHtml(data.eyebrow)}</p>` : ''}
      <h2 class="cb-product-block-head__title"${titleStyle}>${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<p class="cb-product-block-head__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
    </div>
    <div class="cb-product-scenes__grid">
${cards}
    </div>`}
  </div>
</section>`;
}
