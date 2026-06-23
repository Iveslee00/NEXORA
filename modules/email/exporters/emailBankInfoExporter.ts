import { EmailBankInfoData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailBankInfoHTML(data: EmailBankInfoData, linkUrl: string): string {
  const bg = data.backgroundColor || '#f8f8fc';
  const cols = data.columns ?? (data.items.length <= 1 ? 1 : 2);
  const align = data.alignment || 'center';
  const itemWidth = cols === 1 ? '100%' : cols === 2 ? '48%' : '31%';

  const cards = data.items.map((item) => {
    const accent = item.accentColor || '#6366f1';
    const logo = item.logo ? `<img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.cardName)}" height="16" style="height:16px;width:auto;vertical-align:middle;margin-right:6px;">` : '';
    const textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
    return `<div style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);display:inline-flex;width:${itemWidth};box-sizing:border-box;margin-bottom:10px;vertical-align:top;">
  <div style="width:4px;background:${accent};flex-shrink:0;min-height:60px;"></div>
  <div style="padding:12px 14px;flex:1;text-align:${textAlign};">
    <p style="font-size:11px;font-weight:700;color:#1a1a2e;margin:0 0 4px 0;">${logo}${escapeHtml(item.cardName)}</p>
    ${item.condition ? `<p style="font-size:10px;color:#9090b0;margin:0 0 3px 0;">${escapeHtml(item.condition)}</p>` : ''}
    ${item.benefit ? `<p style="font-size:13px;font-weight:700;color:${accent};margin:2px 0;">${escapeHtml(item.benefit)}</p>` : ''}
    ${item.note ? `<p style="font-size:10px;color:#9090b0;margin:0;">${escapeHtml(item.note)}</p>` : ''}
  </div>
</div>`;
  });

  const gap = cols > 1 ? 'gap:2%;' : '';
  const header = (data.title || data.subtitle)
    ? `<div style="text-align:${align === 'center' ? 'center' : align};margin-bottom:18px;">
  ${data.title ? `<h2 style="font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 4px 0;">${escapeHtml(data.title)}</h2>` : ''}
  ${data.subtitle ? `<p style="font-size:11px;color:#9090b0;margin:0;">${escapeHtml(data.subtitle)}</p>` : ''}
</div>`
    : '';

  const footer = (data.disclaimer || data.linkText)
    ? `<div style="margin-top:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
  ${data.disclaimer ? `<p style="font-size:10px;color:#b0b0c0;margin:0;">${escapeHtml(data.disclaimer)}</p>` : ''}
  ${data.linkText ? `<a href="${escapeHtml(linkUrl || data.linkUrl || '#')}" target="_blank" style="font-size:11px;font-weight:600;color:#6366f1;text-decoration:none;">${escapeHtml(data.linkText)}</a>` : ''}
</div>`
    : '';

  return `<div style="background-color:${bg};padding:24px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${header}<div style="display:flex;flex-wrap:wrap;${gap}">
  ${cards.join('\n  ')}
</div>
${footer}</div>`;
}
