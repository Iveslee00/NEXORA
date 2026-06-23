import { EmailProductsData, EmailProductItem } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

function productCard(p: EmailProductItem, btnText: string, btnColor: string, width: string): string {
  const badge = p.showBadge && p.badgeText
    ? `<div style="position:relative;"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="${parseInt(width)}" style="width:100%;height:auto;display:block;"><span style="position:absolute;top:6px;left:6px;background:#e53e3e;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;">${escapeHtml(p.badgeText)}</span></div>`
    : `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="${parseInt(width)}" style="width:100%;height:auto;display:block;">`;

  return `<div style="background:#ffffff;border:1px solid #e8e8f4;border-radius:8px;overflow:hidden;box-sizing:border-box;width:${width};">
  ${badge}
  <div style="padding:10px 12px;">
    ${p.brand ? `<p style="font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#9090b0;margin:0 0 2px 0;">${escapeHtml(p.brand)}</p>` : ''}
    <p style="font-size:12px;font-weight:600;color:#1a1a2e;margin:0 0 4px 0;line-height:1.3;">${escapeHtml(p.name)}</p>
    <div style="display:inline-flex;gap:4px;align-items:center;flex-wrap:wrap;">
      ${p.originalPrice ? `<span style="font-size:10px;color:#9090b0;text-decoration:line-through;">${escapeHtml(p.originalPrice)}</span>` : ''}
      ${p.salePrice ? `<span style="font-size:13px;font-weight:700;color:#e53e3e;">${escapeHtml(p.salePrice)}</span>` : ''}
    </div>
    ${btnText ? `<a href="${escapeHtml(p.link || '#')}" target="_blank" style="display:block;text-align:center;margin-top:8px;padding:6px 0;background-color:${btnColor};color:#ffffff;border-radius:5px;font-size:11px;font-weight:700;text-decoration:none;">${escapeHtml(btnText)}</a>` : ''}
  </div>
</div>`;
}

export function generateEmailProductsHTML(data: EmailProductsData, primaryColor: string): string {
  const bg = data.backgroundColor || '#ffffff';
  const btn = primaryColor;
  const { layout, products, title, buttonText } = data;

  const header = title ? `<p style="font-size:13px;font-weight:700;color:#1a1a2e;text-align:center;margin:0 0 12px 0;">${escapeHtml(title)}</p>` : '';

  let body = '';

  if (layout === '1col') {
    const p = products[0];
    if (!p) return '';
    body = `<div style="border:1px solid #e8e8f4;border-radius:8px;overflow:hidden;background:#ffffff;text-align:center;">
  <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="552" style="width:100%;height:auto;display:block;max-height:280px;object-fit:cover;">
  <div style="padding:16px 18px;">
    ${p.brand ? `<p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9090b0;margin:0 0 4px 0;">${escapeHtml(p.brand)}</p>` : ''}
    <p style="font-size:16px;font-weight:700;color:#1a1a2e;margin:0 0 8px 0;">${escapeHtml(p.name)}</p>
    <div style="margin-bottom:14px;">
      ${p.originalPrice ? `<span style="font-size:12px;color:#9090b0;text-decoration:line-through;margin-right:6px;">${escapeHtml(p.originalPrice)}</span>` : ''}
      ${p.salePrice ? `<span style="font-size:18px;font-weight:800;color:#e53e3e;">${escapeHtml(p.salePrice)}</span>` : ''}
    </div>
    ${buttonText ? `<a href="${escapeHtml(p.link || '#')}" target="_blank" style="display:inline-block;padding:10px 32px;background-color:${btn};color:#ffffff;border-radius:7px;font-weight:700;font-size:13px;text-decoration:none;">${escapeHtml(buttonText)}</a>` : ''}
  </div>
</div>`;
  } else if (layout === 'featured') {
    const p = products[0];
    if (!p) return '';
    body = `<div style="border:1px solid #e8e8f4;border-radius:8px;overflow:hidden;background:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="50%" valign="top"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="276" style="width:100%;height:auto;display:block;min-height:200px;object-fit:cover;"></td>
    <td width="50%" valign="middle" style="padding:20px 18px;text-align:center;">
      ${p.brand ? `<p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9090b0;margin:0 0 6px 0;">${escapeHtml(p.brand)}</p>` : ''}
      <p style="font-size:18px;font-weight:800;color:#1a1a2e;margin:0 0 10px 0;line-height:1.2;">${escapeHtml(p.name)}</p>
      <div style="margin-bottom:16px;">
        ${p.originalPrice ? `<span style="font-size:12px;color:#9090b0;text-decoration:line-through;margin-right:6px;">${escapeHtml(p.originalPrice)}</span>` : ''}
        ${p.salePrice ? `<span style="font-size:22px;font-weight:800;color:#e53e3e;">${escapeHtml(p.salePrice)}</span>` : ''}
      </div>
      ${buttonText ? `<a href="${escapeHtml(p.link || '#')}" target="_blank" style="display:inline-block;padding:10px 24px;background-color:${btn};color:#ffffff;border-radius:7px;font-weight:700;font-size:13px;text-decoration:none;">${escapeHtml(buttonText)}</a>` : ''}
    </td>
  </tr></table>
</div>`;
  } else if (layout === '2col') {
    body = `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  ${products.slice(0, 2).map((p) => `<td width="50%" valign="top" style="padding:0 5px;">${productCard(p, buttonText, btn, '100%')}</td>`).join('\n  ')}
</tr></table>`;
  } else if (layout === '3col') {
    body = `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  ${products.slice(0, 3).map((p) => `<td width="33%" valign="top" style="padding:0 4px;">${productCard(p, buttonText, btn, '100%')}</td>`).join('\n  ')}
</tr></table>`;
  } else if (layout === '1+2') {
    const [main, ...rest] = products;
    const mainHtml = main ? `<div style="border:1px solid #e8e8f4;border-radius:8px;overflow:hidden;background:#ffffff;margin-bottom:10px;">
  <img src="${escapeHtml(main.image)}" alt="${escapeHtml(main.name)}" width="568" style="width:100%;height:auto;display:block;max-height:240px;object-fit:cover;">
  <div style="padding:14px 16px;text-align:center;">
    ${main.brand ? `<p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9090b0;margin:0 0 4px 0;">${escapeHtml(main.brand)}</p>` : ''}
    <p style="font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 6px 0;">${escapeHtml(main.name)}</p>
    <div style="margin-bottom:10px;">
      ${main.originalPrice ? `<span style="font-size:11px;color:#9090b0;text-decoration:line-through;margin-right:4px;">${escapeHtml(main.originalPrice)}</span>` : ''}
      ${main.salePrice ? `<span style="font-size:16px;font-weight:800;color:#e53e3e;">${escapeHtml(main.salePrice)}</span>` : ''}
    </div>
    ${buttonText ? `<a href="${escapeHtml(main.link || '#')}" target="_blank" style="display:inline-block;padding:8px 28px;background-color:${btn};color:#ffffff;border-radius:6px;font-weight:700;font-size:12px;text-decoration:none;">${escapeHtml(buttonText)}</a>` : ''}
  </div>
</div>` : '';
    body = `${mainHtml}<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  ${rest.slice(0, 2).map((p) => `<td width="50%" valign="top" style="padding:0 5px;">${productCard(p, buttonText, btn, '100%')}</td>`).join('\n  ')}
</tr></table>`;
  }

  return `<div style="background-color:${bg};padding:20px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${header}
${body}
</div>`;
}
