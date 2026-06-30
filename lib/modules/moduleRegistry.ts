import type { ModuleType, PageModule } from '@/types/modules';
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
import { generateHeroCarouselHTML } from '@/modules/exporters/heroCarouselExporter';
import { generateBankPromoHTML } from '@/modules/exporters/bankPromoExporter';
import { generateAnchorNavHTML } from '@/modules/exporters/anchorNavExporter';
import { generateProductFeaturesHTML } from '@/modules/exporters/productFeaturesExporter';
import { generateProductShowcaseHTML } from '@/modules/exporters/productShowcaseExporter';
import { generateProductScenesHTML } from '@/modules/exporters/productScenesExporter';
import { generateProductInfoHTML } from '@/modules/exporters/productInfoExporter';
import {
  generateProductBenefitsHTML,
  generateProductComparisonHTML,
  generateProductProofHTML,
  generateProductPurchaseHTML,
  generateProductStepsHTML,
} from '@/modules/exporters/productAdvancedExporter';

export type ModuleRegistryCategory = 'general' | 'campaign' | 'product';

export interface ModuleExportContext {
  modules: PageModule[];
}

export interface ModuleRegistryEntry {
  type: ModuleType;
  label: string;
  category: ModuleRegistryCategory;
  renderExport: (module: PageModule, context: ModuleExportContext) => string;
}

const dataOf = <T>(module: PageModule) => module.data as T;

export const moduleRegistry: Record<ModuleType, ModuleRegistryEntry> = {
  'title': {
    type: 'title',
    label: '標題區塊',
    category: 'general',
    renderExport: (module) => generateTitleHTML(dataOf(module)),
  },
  'anchor-nav': {
    type: 'anchor-nav',
    label: '錨點導覽',
    category: 'general',
    renderExport: (module, context) => generateAnchorNavHTML(dataOf(module), module.id, context.modules),
  },
  'hero': {
    type: 'hero',
    label: 'KV',
    category: 'general',
    renderExport: (module) => generateHeroHTML(dataOf(module)),
  },
  'hero-carousel': {
    type: 'hero-carousel',
    label: 'KV 輪播',
    category: 'general',
    renderExport: (module) => generateHeroCarouselHTML(dataOf(module)),
  },
  'split-section': {
    type: 'split-section',
    label: '圖文區塊',
    category: 'general',
    renderExport: (module) => generateSplitSectionHTML(dataOf(module)),
  },
  'article-text': {
    type: 'article-text',
    label: '文章內容',
    category: 'general',
    renderExport: (module) => generateArticleTextHTML(dataOf(module)),
  },
  'article-image': {
    type: 'article-image',
    label: '文章搭配圖片',
    category: 'general',
    renderExport: (module) => generateArticleImageHTML(dataOf(module)),
  },
  'faq': {
    type: 'faq',
    label: 'FAQ',
    category: 'general',
    renderExport: (module) => generateFaqHTML(dataOf(module)),
  },
  'logo-wall': {
    type: 'logo-wall',
    label: '品牌 Logo 牆',
    category: 'general',
    renderExport: (module) => generateLogoWallHTML(dataOf(module)),
  },
  'sticky-sidebar': {
    type: 'sticky-sidebar',
    label: '浮動工具列',
    category: 'general',
    renderExport: (module) => generateStickySidebarHTML(dataOf(module)),
  },
  'cta': {
    type: 'cta',
    label: '行動呼籲',
    category: 'general',
    renderExport: (module) => generateCtaHTML(dataOf(module)),
  },
  'bank-promo': {
    type: 'bank-promo',
    label: '銀行優惠',
    category: 'campaign',
    renderExport: (module) => generateBankPromoHTML(dataOf(module)),
  },
  'product-grid': {
    type: 'product-grid',
    label: '商品列表',
    category: 'campaign',
    renderExport: (module) => generateProductGridHTML(dataOf(module)),
  },
  'product-carousel': {
    type: 'product-carousel',
    label: '商品輪播',
    category: 'campaign',
    renderExport: (module) => generateProductCarouselHTML(dataOf(module)),
  },
  'banner-products': {
    type: 'banner-products',
    label: '活動 Banner + 商品',
    category: 'campaign',
    renderExport: (module) => generateBannerProductsHTML(dataOf(module)),
  },
  'product-banner': {
    type: 'product-banner',
    label: '單品主打',
    category: 'campaign',
    renderExport: (module) => generateProductBannerHTML(dataOf(module)),
  },
  'product-features': {
    type: 'product-features',
    label: '商品特色',
    category: 'product',
    renderExport: (module) => generateProductFeaturesHTML(dataOf(module)),
  },
  'product-showcase': {
    type: 'product-showcase',
    label: '大圖展示',
    category: 'product',
    renderExport: (module) => generateProductShowcaseHTML(dataOf(module)),
  },
  'product-scenes': {
    type: 'product-scenes',
    label: '商品情境',
    category: 'product',
    renderExport: (module) => generateProductScenesHTML(dataOf(module)),
  },
  'product-info': {
    type: 'product-info',
    label: '商品資訊',
    category: 'product',
    renderExport: (module) => generateProductInfoHTML(dataOf(module)),
  },
  'product-benefits': {
    type: 'product-benefits',
    label: '核心賣點',
    category: 'product',
    renderExport: (module) => generateProductBenefitsHTML(dataOf(module)),
  },
  'product-steps': {
    type: 'product-steps',
    label: '使用步驟',
    category: 'product',
    renderExport: (module) => generateProductStepsHTML(dataOf(module)),
  },
  'product-comparison': {
    type: 'product-comparison',
    label: '商品比較',
    category: 'product',
    renderExport: (module) => generateProductComparisonHTML(dataOf(module)),
  },
  'product-proof': {
    type: 'product-proof',
    label: '信任證明',
    category: 'product',
    renderExport: (module) => generateProductProofHTML(dataOf(module)),
  },
  'product-purchase': {
    type: 'product-purchase',
    label: '購買轉換',
    category: 'product',
    renderExport: (module) => generateProductPurchaseHTML(dataOf(module)),
  },
};

export function getModuleRegistryEntry(type: ModuleType) {
  return moduleRegistry[type];
}

export function renderModuleExportHTML(module: PageModule, context: ModuleExportContext) {
  return moduleRegistry[module.type].renderExport(module, context);
}
