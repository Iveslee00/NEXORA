import { ProductShowcaseData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';

function normalizeProductShowcaseStyle(style: ProductShowcaseData['style'] | string): ProductShowcaseData['style'] {
  if (style === 'split' || style === 'luxury') return style;
  return 'spacious';
}

export function generateProductShowcaseHTML(data: ProductShowcaseData): string {
  const style = normalizeProductShowcaseStyle(data.style);
  const bg = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';
  const reverse = data.reverse ? ' cb-product-showcase__inner--reverse' : '';
  const image = data.image
    ? `<picture class="cb-product-showcase__picture">${data.mobileImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(data.mobileImage)}">` : ''}\n          <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">\n        </picture>`
    : renderImagePlaceholder('展示圖片', IMAGE_SPECS.productShowcase);
  const button = data.buttonText ? `<a href="${escapeHtml(data.buttonLink || '#')}" class="cb-btn cb-product-showcase__btn">${escapeHtml(data.buttonText)}</a>` : '';

  return `<section class="cb-product-showcase cb-product-showcase--${escapeHtml(style)} cb-section"${bg}>
  <div class="cb-product-showcase__inner${reverse}">
    <div class="cb-product-showcase__content">
      ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${textStyle}>${escapeHtml(data.eyebrow)}</p>` : ''}
      <h2 class="cb-product-showcase__title"${titleStyle}>${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<p class="cb-product-showcase__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
      ${data.description ? `<p class="cb-product-showcase__description"${textStyle}>${escapeHtml(data.description)}</p>` : ''}
      ${button}
    </div>
    <div class="cb-product-showcase__media">
      ${image}
    </div>
  </div>
</section>`;
}
