import { LogoWallData } from '@/types/modules';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { escapeHtml } from '@/lib/utils';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';

export function generateLogoWallHTML(data: LogoWallData): string {
  const logoItems = data.logos
    .map(
      (logo) => `      <a href="${escapeHtml(logo.link || '#')}" class="cb-logo-wall__item">
        ${logo.image ? `<img src="${escapeHtml(logo.image)}" alt="${escapeHtml(logo.alt)}">` : renderImagePlaceholder('Logo', IMAGE_SPECS.logo)}
      </a>`
    )
    .join('\n');

  const bgOverride = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';

  return `<section class="cb-logo-wall cb-section"${bgOverride}>
  <div class="cb-container">
    <div class="cb-logo-wall__grid">
${logoItems}
    </div>
  </div>
</section>`;
}
