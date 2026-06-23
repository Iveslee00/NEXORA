import { EmailCouponData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailCouponHTML(data: EmailCouponData, link: string, primaryColor: string): string {
  const accent = data.accentColor || primaryColor;
  const bg = data.backgroundColor || '#f0f4ff';
  const textC = data.textColor || '#1a1a2e';

  return `<div style="background-color:${bg};padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;border:2px dashed ${accent};border-radius:12px;padding:28px 24px;text-align:center;background-color:#ffffff;">
    ${data.title ? `<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${accent};margin:0 0 12px 0;">${escapeHtml(data.title)}</p>` : ''}
    ${data.code ? `<div style="display:inline-block;border:2px solid ${accent};border-radius:8px;padding:10px 24px;margin-bottom:14px;background-color:${accent}18;">
      <span style="font-family:monospace;font-size:22px;font-weight:800;letter-spacing:4px;color:${accent};">${escapeHtml(data.code)}</span>
    </div>` : ''}
    ${data.description ? `<p style="font-size:13px;color:${textC};margin:0 0 8px 0;line-height:1.5;">${escapeHtml(data.description)}</p>` : ''}
    ${data.validity ? `<p style="font-size:11px;color:#9090b0;margin:0 0 18px 0;">${escapeHtml(data.validity)}</p>` : ''}
    ${data.buttonText ? `<a href="${escapeHtml(link || data.link || '#')}" target="_blank" style="display:inline-block;padding:10px 28px;background-color:${accent};color:#ffffff;border-radius:7px;font-weight:700;font-size:13px;text-decoration:none;">${escapeHtml(data.buttonText)}</a>` : ''}
  </div>
</div>`;
}
