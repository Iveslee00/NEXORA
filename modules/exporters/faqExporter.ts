import { FaqData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateFaqHTML(data: FaqData): string {
  const answerStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  const items = data.items
    .map(
      (item) => `      <details class="cb-faq__item">
        <summary class="cb-faq__question">
          ${escapeHtml(item.question)}
          <span class="cb-faq__toggle">+</span>
        </summary>
        <div class="cb-faq__answer"${answerStyle}>${escapeHtml(item.answer)}</div>
      </details>`
    )
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-faq cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-faq__list">
${items}
    </div>
  </div>
</section>`;
}
