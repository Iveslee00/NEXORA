import { TitleData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateTitleHTML(data: TitleData): string {
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const bgStyle = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const alignClass = data.alignment === 'left' ? ' cb-title-block--left' : data.alignment === 'right' ? ' cb-title-block--right' : ' cb-title-block--center';

  return `<div class="cb-title-block${alignClass}"${bgStyle}>
  <div class="cb-container">
    <span class="cb-title-block__cn"${titleStyle}>${escapeHtml(data.titleCn)}</span>
    <span class="cb-title-block__en"${titleStyle}>${escapeHtml(data.titleEn)}</span>
  </div>
</div>`;
}
