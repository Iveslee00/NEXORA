import { EmailKvData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailKvHTML(data: EmailKvData, link: string): string {
  const imgUrl = escapeHtml(data.image || '');
  const href = escapeHtml(link || data.link || '#');
  const alt = escapeHtml(data.altText || '');
  const bg = data.backgroundColor ? ` style="background-color:${escapeHtml(data.backgroundColor)}"` : '';

  return `<div${bg} style="line-height:0;${data.backgroundColor ? `background-color:${escapeHtml(data.backgroundColor)};` : ''}">
  <a href="${href}" target="_blank" style="display:block;line-height:0;">
    <img src="${imgUrl}" alt="${alt}" width="600" style="width:100%;max-width:600px;height:auto;display:block;border:0;">
  </a>
</div>`;
}
