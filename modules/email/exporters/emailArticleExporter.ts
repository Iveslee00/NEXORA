import { EmailArticleData } from '@/types/emailModules';
import { escapeHtml } from '@/lib/utils';

export function generateEmailArticleHTML(data: EmailArticleData, link: string, primaryColor: string): string {
  const bg = data.backgroundColor || '#ffffff';
  const titleC = data.titleColor || '#1a1a2e';
  const textC = data.textColor || '#4a4a6a';
  const btn = primaryColor;

  const imageBlock = data.image
    ? `  <div style="margin-bottom:20px;border-radius:8px;overflow:hidden;">
    <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title || '')}" width="552" style="width:100%;height:auto;display:block;max-height:280px;object-fit:cover;border-radius:8px;">
  </div>`
    : '';

  const eyebrow = data.eyebrow
    ? `  <p style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9090b0;margin:0 0 8px 0;">${escapeHtml(data.eyebrow)}</p>`
    : '';

  const title = data.title
    ? `  <h2 style="font-size:20px;font-weight:800;line-height:1.2;letter-spacing:-0.01em;color:${titleC};margin:0 0 10px 0;">${escapeHtml(data.title)}</h2>`
    : '';

  const content = data.content
    ? `  <p style="font-size:14px;line-height:1.7;color:${textC};margin:0 0 18px 0;">${escapeHtml(data.content).replace(/\n/g, '<br>')}</p>`
    : '';

  const button = data.buttonText
    ? `  <a href="${escapeHtml(link || data.link || '#')}" target="_blank" style="display:inline-block;padding:10px 24px;background-color:${btn};color:#ffffff;border-radius:7px;font-weight:700;font-size:13px;text-decoration:none;">${escapeHtml(data.buttonText)}</a>`
    : '';

  return `<div style="background-color:${bg};padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${imageBlock}
${eyebrow}
${title}
${content}
${button}
</div>`;
}
