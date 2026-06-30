import { PageModule } from '@/types/modules';
import { generateHeroCarouselScript } from '@/modules/exporters/heroCarouselExporter';
import { generateCarouselScript } from '@/lib/export/cssGenerator';
import { getModuleAnchorId } from '@/lib/modules/anchors';
import { renderModuleExportHTML } from '@/lib/modules/moduleRegistry';

function renderModuleHTML(module: PageModule, modules: PageModule[]): string {
  const raw = renderModuleExportHTML(module, { modules });

  const anchorName = 'anchorName' in module.data ? module.data.anchorName?.trim() : '';
  if (!raw || !anchorName || module.type === 'anchor-nav') return raw;
  return `<div id="${getModuleAnchorId(module.id)}" class="cb-module-anchor">\n${raw}\n</div>`;
}

export function generatePageHTML(modules: PageModule[]): string {
  if (modules.length === 0) return '<div class="cb-page">\n  <!-- Add modules to get started -->\n</div>';
  const sectionsHTML = modules.map((module) => renderModuleHTML(module, modules)).filter(Boolean).join('\n\n');
  const hasCarousel = modules.some((m) => m.type === 'product-carousel');
  const hasKv = modules.some((m) => m.type === 'hero-carousel');
  const script = [
    hasCarousel ? generateCarouselScript() : '',
    hasKv ? generateHeroCarouselScript() : '',
  ].filter(Boolean).join('\n\n');
  return `<div class="cb-page">\n\n${sectionsHTML}\n\n</div>${script ? '\n\n' + script : ''}`;
}
