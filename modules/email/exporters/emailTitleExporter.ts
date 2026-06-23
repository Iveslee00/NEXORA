import { EmailTitleData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailTitleHTML(data: EmailTitleData): string {
  const align = data.alignment || 'center';
  const bg = data.backgroundColor || '#ffffff';
  const titleColor = data.titleColor || '#1a1a2e';
  const subtitleColor = data.subtitleColor || '#9090b0';

  return `<div style="background-color:${bg};padding:20px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:${align};">
  ${data.titleEn ? `<p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${subtitleColor};margin:0 0 4px 0;">${escapeHtml(data.titleEn)}</p>` : ''}
  ${data.titleZh ? `<p style="font-size:20px;font-weight:800;color:${titleColor};margin:0;line-height:1.25;">${escapeHtml(data.titleZh)}</p>` : ''}
</div>`;
}
