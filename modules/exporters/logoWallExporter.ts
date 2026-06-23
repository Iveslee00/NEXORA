import { LogoWallData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateLogoWallHTML(data: LogoWallData): string {
  const logoItems = data.logos
    .map(
      (logo) => `      <a href="${escapeHtml(logo.link || '#')}" class="cb-logo-wall__item">
        <img src="${escapeHtml(logo.image)}" alt="${escapeHtml(logo.alt)}">
      </a>`
    )
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-logo-wall cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-logo-wall__grid">
${logoItems}
    </div>
  </div>
</section>`;
}
