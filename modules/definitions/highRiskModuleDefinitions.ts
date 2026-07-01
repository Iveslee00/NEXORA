import type {
  BannerProductsData,
  HeroCarouselData,
  HeroData,
  ModuleType,
  PageModule,
  ProductFeaturesData,
  ProductPurchaseData,
  ProductShowcaseData,
} from '@/types/modules';
import { generateBannerProductsHTML } from '@/modules/exporters/bannerProductsExporter';
import { generateHeroCarouselHTML } from '@/modules/exporters/heroCarouselExporter';
import { generateHeroHTML } from '@/modules/exporters/heroExporter';
import { generateProductFeaturesHTML } from '@/modules/exporters/productFeaturesExporter';
import { generateProductPurchaseHTML } from '@/modules/exporters/productAdvancedExporter';
import { generateProductShowcaseHTML } from '@/modules/exporters/productShowcaseExporter';
import type { ModuleDefinition } from './moduleDefinition';

const imagePlaceholderCss = `
/* Phase 3 shared image placeholder */
.cb-image-placeholder {
  position: absolute; inset: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px;
  width: 100%; height: 100%; padding: 18px; text-align: center;
  background: linear-gradient(135deg, #eef4ff 0%, #e7edff 100%);
  color: #4f46e5;
  box-shadow: inset 0 0 0 1px rgba(79,70,229,0.12);
}
.cb-image-placeholder--dark {
  background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(31,41,68,0.95));
  color: #dbeafe;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
}
.cb-image-placeholder__label {
  display: block; font-size: 12px; font-weight: 850; line-height: 1.2;
  letter-spacing: 0.08em; text-transform: uppercase;
}
.cb-image-placeholder__size {
  display: block; font-size: clamp(1.35rem, 3vw, 2rem); font-weight: 950; line-height: 1;
  letter-spacing: -0.02em;
}
.cb-image-placeholder__hint {
  display: block; max-width: 220px; font-size: 12px; font-weight: 700; line-height: 1.35;
  opacity: 0.72;
}
`;

const heroCss = `
/* Phase 3 hero scoped stability */
.cb-hero .cb-image-placeholder,
.cb-kv .cb-image-placeholder {
  border-radius: inherit;
}
.cb-hero__media,
.cb-hero__picture,
.cb-kv__img,
.cb-kv__picture {
  min-width: 0;
}
`;

const bannerProductsCss = `
/* Phase 3 banner-products scoped stability */
.cb-banner-products__banner,
.cb-banner-products__products,
.cb-banner-products .cb-product-card,
.cb-banner-products .cb-product-card__media {
  min-width: 0;
}
.cb-banner-products .cb-product-card__media .cb-image-placeholder {
  position: absolute;
}
.cb-banner-products__banner .cb-image-placeholder__label {
  font-size: 11px;
}
.cb-banner-products__banner .cb-image-placeholder__size {
  font-size: clamp(1rem, 2vw, 1.35rem);
}
.cb-banner-products__banner .cb-image-placeholder__hint {
  font-size: 11px;
}
`;

const productFeaturesCss = `
/* Phase 3 product-features scoped stability */
.cb-product-features__grid,
.cb-product-features__item,
.cb-product-features__content {
  min-width: 0;
}
.cb-product-features__item-title,
.cb-product-features__item-text {
  overflow-wrap: anywhere;
}
.cb-product-features--icon-text .cb-product-features__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}
`;

const productShowcaseCss = `
/* Phase 3 product-showcase scoped stability */
.cb-product-showcase__inner,
.cb-product-showcase__content,
.cb-product-showcase__media {
  min-width: 0;
}
.cb-product-showcase__media .cb-image-placeholder {
  border-radius: inherit;
}
`;

const productPurchaseCss = `
/* Phase 3 product-purchase scoped stability */
.cb-product-purchase__grid,
.cb-product-purchase__card,
.cb-product-purchase__media,
.cb-product-purchase__body {
  min-width: 0;
}
.cb-product-purchase__media {
  position: relative;
  overflow: hidden;
}
.cb-product-purchase__media .cb-image-placeholder {
  position: absolute;
}
`;

export const highRiskModuleDefinitions: Partial<Record<ModuleType, ModuleDefinition<any>>> = {
  'hero': {
    type: 'hero',
    rootClass: 'cb-hero',
    cssFragment: heroCss,
    renderHTML: (data: HeroData) => generateHeroHTML(data),
  },
  'hero-carousel': {
    type: 'hero-carousel',
    rootClass: 'cb-kv',
    cssFragment: heroCss,
    renderHTML: (data: HeroCarouselData) => generateHeroCarouselHTML(data),
  },
  'banner-products': {
    type: 'banner-products',
    rootClass: 'cb-banner-products',
    cssFragment: bannerProductsCss,
    renderHTML: (data: BannerProductsData) => generateBannerProductsHTML(data),
  },
  'product-features': {
    type: 'product-features',
    rootClass: 'cb-product-features',
    cssFragment: productFeaturesCss,
    renderHTML: (data: ProductFeaturesData) => generateProductFeaturesHTML(data),
  },
  'product-showcase': {
    type: 'product-showcase',
    rootClass: 'cb-product-showcase',
    cssFragment: productShowcaseCss,
    renderHTML: (data: ProductShowcaseData) => generateProductShowcaseHTML(data),
  },
  'product-purchase': {
    type: 'product-purchase',
    rootClass: 'cb-product-purchase',
    cssFragment: productPurchaseCss,
    renderHTML: (data: ProductPurchaseData) => generateProductPurchaseHTML(data),
  },
};

export function getHighRiskModuleDefinition(type: ModuleType) {
  return highRiskModuleDefinitions[type as keyof typeof highRiskModuleDefinitions];
}

export function renderHighRiskModuleHTML(module: PageModule, context: { modules: PageModule[] }) {
  const definition = getHighRiskModuleDefinition(module.type);
  if (!definition) return null;
  return definition.renderHTML(module.data, module, context);
}

export function getHighRiskModuleCssFragments() {
  const fragments = [imagePlaceholderCss, ...Object.values(highRiskModuleDefinitions)
    .map((definition) => definition.cssFragment.trim())
    .filter(Boolean)];

  return Array.from(new Set(fragments)).join('\n\n');
}
