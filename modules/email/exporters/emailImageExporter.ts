import { EmailImageData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailImageHTML(data: EmailImageData, link: string): string {
  const bg = data.backgroundColor || '#ffffff';
  const img = `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.altText || '')}" width="600" style="width:100%;height:auto;display:block;border:0;">`;

  return `<div style="background-color:${bg};line-height:0;">
  ${link && link !== '#'
    ? `<a href="${escapeHtml(link)}" target="_blank" style="display:block;line-height:0;">${img}</a>`
    : img}
</div>`;
}
