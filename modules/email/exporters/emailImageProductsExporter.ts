import { EmailImageProductsData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailImageProductsHTML(data: EmailImageProductsData, primaryColor: string): string {
  const bg = data.backgroundColor || '#ffffff';
  const btn = primaryColor;
  const imgRight = data.imagePosition === 'right';

  const productRows = data.products.map((p) => `    <tr>
      <td style="padding-bottom:10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e8e8f4;border-radius:8px;overflow:hidden;">
          <tr>
            <td width="80" valign="top"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="80" height="80" style="width:80px;height:80px;object-fit:cover;display:block;"></td>
            <td valign="middle" style="padding:10px 12px;">
              ${p.brand ? `<p style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9090b0;margin:0 0 2px 0;">${escapeHtml(p.brand)}</p>` : ''}
              <p style="font-size:12px;font-weight:600;color:#1a1a2e;margin:0 0 4px 0;line-height:1.3;">${escapeHtml(p.name)}</p>
              <div>
                ${p.originalPrice ? `<span style="font-size:10px;color:#9090b0;text-decoration:line-through;margin-right:4px;">${escapeHtml(p.originalPrice)}</span>` : ''}
                ${p.salePrice ? `<span style="font-size:12px;font-weight:700;color:#e53e3e;">${escapeHtml(p.salePrice)}</span>` : ''}
              </div>
              ${data.buttonText ? `<a href="${escapeHtml(p.link || '#')}" target="_blank" style="display:inline-block;margin-top:6px;padding:4px 12px;background-color:${btn};color:#ffffff;border-radius:5px;font-size:11px;font-weight:700;text-decoration:none;">${escapeHtml(data.buttonText)}</a>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('\n');

  const bannerTd = `<td width="220" valign="top" style="${imgRight ? 'padding-left:14px;' : 'padding-right:14px;'}">
        <a href="${escapeHtml(data.bannerLink || '#')}" target="_blank" style="display:block;line-height:0;">
          <img src="${escapeHtml(data.bannerImage)}" alt="${escapeHtml(data.bannerTitle || '')}" width="220" style="width:220px;height:auto;display:block;border-radius:8px;">
        </a>
      </td>`;

  const productsTd = `<td valign="top">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
${productRows}
        </table>
      </td>`;

  return `<div style="background-color:${bg};padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      ${imgRight ? `${productsTd}\n      ${bannerTd}` : `${bannerTd}\n      ${productsTd}`}
    </tr>
  </table>
</div>`;
}
