import { EmailPageModule, EmailSettings } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';
import { generateEmailTitleHTML } from '@/modules/email/exporters/emailTitleExporter';
import { generateEmailImageHTML } from '@/modules/email/exporters/emailImageExporter';
import { generateEmailPromoHTML } from '@/modules/email/exporters/emailPromoExporter';
import { generateEmailKvHTML } from '@/modules/email/exporters/emailKvExporter';
import { generateEmailProductsHTML } from '@/modules/email/exporters/emailProductsExporter';
import { generateEmailImageProductsHTML } from '@/modules/email/exporters/emailImageProductsExporter';
import { generateEmailBankInfoHTML } from '@/modules/email/exporters/emailBankInfoExporter';
import { generateEmailArticleHTML } from '@/modules/email/exporters/emailArticleExporter';
import { generateEmailCouponHTML } from '@/modules/email/exporters/emailCouponExporter';

function applyUtm(url: string, s: EmailSettings): string {
  if (!url || url === '#' || url.startsWith('mailto:')) return url;
  if (!s.utmString) return url;
  return url + (url.includes('?') ? '&' : '?') + s.utmString;
}

function renderModule(module: EmailPageModule, settings: EmailSettings): string {
  const primaryColor = settings.primaryColor || '#6366f1';
  const utm = (url: string) => applyUtm(url, settings);

  switch (module.type) {
    case 'email-title':
      return generateEmailTitleHTML(module.data);
    case 'email-image':
      return generateEmailImageHTML(module.data, utm(module.data.link));
    case 'email-promo':
      return generateEmailPromoHTML(module.data);
    case 'email-kv':
      return generateEmailKvHTML(module.data, utm(module.data.link));
    case 'email-products':
      return generateEmailProductsHTML(module.data, primaryColor);
    case 'email-image-products':
      return generateEmailImageProductsHTML(module.data, primaryColor);
    case 'email-bank-info':
      return generateEmailBankInfoHTML(module.data, utm(module.data.linkUrl));
    case 'email-article':
      return generateEmailArticleHTML(module.data, utm(module.data.link), primaryColor);
    case 'email-coupon':
      return generateEmailCouponHTML(module.data, utm(module.data.link), primaryColor);
    default:
      return '';
  }
}

export function generateEmailHTML(modules: EmailPageModule[], settings: EmailSettings): string {
  if (!modules.length) return '<!-- No modules -->';

  const bodyBg = settings.backgroundColor || '#f4f4f4';
  const contentBg = settings.contentBgColor || '#ffffff';
  const previewText = settings.previewText
    ? `\n  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${bodyBg};">${escapeHtml(settings.previewText)}&zwnj;&nbsp;&zwnj;&nbsp;</div>`
    : '';
  const trackingPixel = settings.trackingPixel ? `\n  ${settings.trackingPixel}` : '';
  const modulesHTML = modules.map((m) => renderModule(m, settings)).filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-Hant" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: ${bodyBg}; }
    img { border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      table[class="two-col"] td { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${bodyBg};">${previewText}${trackingPixel}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bodyBg};">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${contentBg};">
          <tr>
            <td>
${modulesHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
