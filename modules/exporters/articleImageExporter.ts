import { ArticleImageData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateArticleImageHTML(data: ArticleImageData): string {
  const align = data.alignment || 'left';
  const pos = data.imagePosition || 'top';
  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const eyebrow = data.eyebrow
    ? `        <p class="cb-article__eyebrow">${escapeHtml(data.eyebrow)}</p>`
    : '';
  const title = data.title
    ? `        <h2 class="cb-article__title"${titleStyle}>${escapeHtml(data.title)}</h2>`
    : '';
  const subtitle = data.subtitle
    ? `        <p class="cb-article__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>`
    : '';
  const content = data.content
    ? `        <div class="cb-article__content"${textStyle}>${escapeHtml(data.content).replace(/\n/g, '<br>')}</div>`
    : '';
  const meta = (data.author || data.date)
    ? `        <div class="cb-article__meta">
          ${data.author ? `<span class="cb-article__author"${textStyle}>${escapeHtml(data.author)}</span>` : ''}
          ${data.date ? `<span class="cb-article__date">${escapeHtml(data.date)}</span>` : ''}
        </div>`
    : '';

  const imgEl = data.image
    ? `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title || '')}" class="cb-article-img__img">`
    : '';

  if (pos === 'top') {
    return `<section class="cb-article-image cb-section cb-article--${align} cb-article-img--top"${bgOverride}>
  <div class="cb-container">
    <div class="cb-article-img__media cb-article-img__media--top">${imgEl}</div>
    <div class="cb-article__inner">
${eyebrow}
${title}
${subtitle}
${content}
${meta}
    </div>
  </div>
</section>`;
  }

  return `<section class="cb-article-image cb-section cb-article--${align} cb-article-img--${pos}"${bgOverride}>
  <div class="cb-container">
    <div class="cb-article-img__layout cb-article-img__layout--${pos}">
      <div class="cb-article-img__media">${imgEl}</div>
      <div class="cb-article__inner">
${eyebrow}
${title}
${subtitle}
${content}
${meta}
      </div>
    </div>
  </div>
</section>`;
}
