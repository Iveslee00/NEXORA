import { EmailPromoData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailPromoHTML(data: EmailPromoData): string {
  const bg = data.backgroundColor || '#ffffff';
  const boxBg = data.boxBgColor || '#f8f8fc';
  const cols = data.columns || 2;
  const boxes = data.boxes.slice(0, cols * 4);
  const colWidth = Math.floor(100 / cols);

  const header = data.sectionTitle
    ? `<p style="font-size:14px;font-weight:700;color:#1a1a2e;text-align:center;margin:0 0 14px 0;">${escapeHtml(data.sectionTitle)}</p>`
    : '';

  const cells = boxes.map((box) => {
    const accent = box.accentColor || '#e8e8f4';
    const img = box.image
      ? `<img src="${escapeHtml(box.image)}" alt="${escapeHtml(box.title)}" width="100%" style="width:100%;height:80px;object-fit:cover;display:block;">`
      : '';
    return `<td width="${colWidth}%" valign="top" style="padding:0 5px 10px;">
  <div style="background:${boxBg};border-radius:8px;overflow:hidden;border:2px solid ${accent};">
    ${img}
    <div style="padding:12px;">
      ${box.title ? `<p style="font-size:13px;font-weight:700;color:#1a1a2e;margin:0 0 4px 0;line-height:1.3;">${escapeHtml(box.title)}</p>` : ''}
      ${box.description ? `<p style="font-size:11px;color:#6060a0;margin:0;line-height:1.5;">${escapeHtml(box.description)}</p>` : ''}
    </div>
  </div>
</td>`;
  });

  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += cols) {
    rows.push(`<tr>${cells.slice(i, i + cols).join('')}</tr>`);
  }

  return `<div style="background-color:${bg};padding:20px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${header}<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 -5px;">
  ${rows.join('\n  ')}
</table>
</div>`;
}
