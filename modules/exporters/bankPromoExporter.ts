import { BankPromoData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateBankPromoHTML(data: BankPromoData): string {
  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const header = (data.title || data.subtitle)
    ? `  <div class="cb-bank__header">
    ${data.title ? `<h2 class="cb-bank__title"${titleStyle}>${escapeHtml(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="cb-bank__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
  </div>`
    : '';

  const cols = data.items.length <= 2
    ? data.items.length
    : data.items.length === 3
    ? 3
    : 4;

  const cards = data.items
    .map((item) => {
      const accent = item.accentColor || '#6366f1';
      const logo = item.logo
        ? `<img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.cardName)}" class="cb-bank-card__logo">`
        : '';
      const condition = item.condition ? `<p class="cb-bank-card__condition">${escapeHtml(item.condition)}</p>` : '';
      const benefit = item.benefit
        ? `<p class="cb-bank-card__benefit" style="color: ${escapeHtml(accent)}">${escapeHtml(item.benefit)}</p>`
        : '';
      const note = item.note ? `<p class="cb-bank-card__note">${escapeHtml(item.note)}</p>` : '';

      return `    <div class="cb-bank-card">
      <div class="cb-bank-card__accent" style="background: ${escapeHtml(accent)}"></div>
      <div class="cb-bank-card__body">
        <div class="cb-bank-card__header">
          ${logo}
          <p class="cb-bank-card__name">${escapeHtml(item.cardName)}</p>
        </div>
        ${condition}
        ${benefit}
        ${note}
      </div>
    </div>`;
    })
    .join('\n');

  const footer = (data.disclaimer || data.linkText)
    ? `  <div class="cb-bank__footer">
    ${data.disclaimer ? `<p class="cb-bank__disclaimer"${textStyle}>${escapeHtml(data.disclaimer)}</p>` : ''}
    ${data.linkText ? `<a href="${escapeHtml(data.linkUrl || '#')}" class="cb-bank__link">${escapeHtml(data.linkText)}</a>` : ''}
  </div>`
    : '';

  return `<section class="cb-bank-promo cb-section"${bgOverride}>
  <div class="cb-container">
${header}
    <div class="cb-bank__grid cb-bank__grid--${cols}">
${cards}
    </div>
${footer}
  </div>
</section>`;
}
