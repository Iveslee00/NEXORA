import { PageModule } from '@/types/modules';
import { generateTitleHTML } from '@/modules/exporters/titleExporter';
import { generateHeroHTML } from '@/modules/exporters/heroExporter';
import { generateSplitSectionHTML } from '@/modules/exporters/splitSectionExporter';
import { generateProductGridHTML } from '@/modules/exporters/productGridExporter';
import { generateBannerProductsHTML } from '@/modules/exporters/bannerProductsExporter';
import { generateProductBannerHTML } from '@/modules/exporters/productBannerExporter';
import { generateProductCarouselHTML } from '@/modules/exporters/productCarouselExporter';
import { generateLogoWallHTML } from '@/modules/exporters/logoWallExporter';
import { generateCtaHTML } from '@/modules/exporters/ctaExporter';
import { generateFaqHTML } from '@/modules/exporters/faqExporter';
import { generateStickySidebarHTML } from '@/modules/exporters/stickySidebarExporter';
import { generateArticleTextHTML } from '@/modules/exporters/articleTextExporter';
import { generateArticleImageHTML } from '@/modules/exporters/articleImageExporter';
import { generateHeroCarouselHTML, generateHeroCarouselScript } from '@/modules/exporters/heroCarouselExporter';
import { generateBankPromoHTML } from '@/modules/exporters/bankPromoExporter';
import { generateCarouselScript } from '@/lib/export/cssGenerator';

function renderModuleHTML(module: PageModule): string {
  switch (module.type) {
    case 'title':           return generateTitleHTML(module.data);
    case 'hero':            return generateHeroHTML(module.data);
    case 'split-section':   return generateSplitSectionHTML(module.data);
    case 'product-grid':    return generateProductGridHTML(module.data);
    case 'banner-products': return generateBannerProductsHTML(module.data);
    case 'product-banner':  return generateProductBannerHTML(module.data);
    case 'product-carousel':return generateProductCarouselHTML(module.data);
    case 'logo-wall':       return generateLogoWallHTML(module.data);
    case 'cta':             return generateCtaHTML(module.data);
    case 'faq':             return generateFaqHTML(module.data);
    case 'sticky-sidebar':  return generateStickySidebarHTML(module.data);
    case 'article-text':    return generateArticleTextHTML(module.data);
    case 'article-image':   return generateArticleImageHTML(module.data);
    case 'hero-carousel':   return generateHeroCarouselHTML(module.data);
    case 'bank-promo':      return generateBankPromoHTML(module.data);
    default:                return '';
  }
}

export function generatePageHTML(modules: PageModule[]): string {
  if (modules.length === 0) return '<div class="cb-page">\n  <!-- Add modules to get started -->\n</div>';
  const sectionsHTML = modules.map(renderModuleHTML).filter(Boolean).join('\n\n');
  const hasCarousel = modules.some((m) => m.type === 'product-carousel');
  const hasKv = modules.some((m) => m.type === 'hero-carousel');
  const script = [
    hasCarousel ? generateCarouselScript() : '',
    hasKv ? generateHeroCarouselScript() : '',
  ].filter(Boolean).join('\n\n');
  return `<div class="cb-page">\n\n${sectionsHTML}\n\n</div>${script ? '\n\n' + script : ''}`;
}
