'use client';

import type React from 'react';
import { ModuleType, PageModule } from '@/types/modules';
import { TitlePreview } from './TitlePreview';
import { HeroPreview } from './HeroPreview';
import { SplitSectionPreview } from './SplitSectionPreview';
import { ProductGridPreview } from './ProductGridPreview';
import { BannerProductsPreview } from './BannerProductsPreview';
import { ProductBannerPreview } from './ProductBannerPreview';
import { ProductCarouselPreview } from './ProductCarouselPreview';
import { LogoWallPreview } from './LogoWallPreview';
import { CtaPreview } from './CtaPreview';
import { FaqPreview } from './FaqPreview';
import { StickySidebarPreview } from './StickySidebarPreview';
import { ArticleTextPreview } from './ArticleTextPreview';
import { ArticleImagePreview } from './ArticleImagePreview';
import { HeroCarouselPreview } from './HeroCarouselPreview';
import { BankPromoPreview } from './BankPromoPreview';
import { AnchorNavPreview } from './AnchorNavPreview';
import { ProductFeaturesPreview } from './ProductFeaturesPreview';
import { ProductShowcasePreview } from './ProductShowcasePreview';
import { ProductScenesPreview } from './ProductScenesPreview';
import { ProductInfoPreview } from './ProductInfoPreview';
import {
  ProductBenefitsPreview,
  ProductComparisonPreview,
  ProductProofPreview,
  ProductPurchasePreview,
  ProductStepsPreview,
} from './ProductAdvancedPreview';

type PreviewRegistryRenderer = (module: PageModule, modules: PageModule[]) => React.ReactNode;

export const previewRegistry: Record<ModuleType, PreviewRegistryRenderer> = {
  'title': (module) => <TitlePreview data={module.data as any} />,
  'hero': (module) => <HeroPreview data={module.data as any} />,
  'split-section': (module) => <SplitSectionPreview data={module.data as any} />,
  'product-grid': (module) => <ProductGridPreview data={module.data as any} />,
  'banner-products': (module) => <BannerProductsPreview data={module.data as any} />,
  'product-banner': (module) => <ProductBannerPreview data={module.data as any} />,
  'product-carousel': (module) => <ProductCarouselPreview data={module.data as any} />,
  'logo-wall': (module) => <LogoWallPreview data={module.data as any} />,
  'cta': (module) => <CtaPreview data={module.data as any} />,
  'faq': (module) => <FaqPreview data={module.data as any} />,
  'sticky-sidebar': (module) => <StickySidebarPreview data={module.data as any} />,
  'article-text': (module) => <ArticleTextPreview data={module.data as any} />,
  'article-image': (module) => <ArticleImagePreview data={module.data as any} />,
  'hero-carousel': (module) => <HeroCarouselPreview data={module.data as any} />,
  'bank-promo': (module) => <BankPromoPreview data={module.data as any} />,
  'anchor-nav': (module, modules) => <AnchorNavPreview data={module.data as any} moduleId={module.id} modules={modules} />,
  'product-features': (module) => <ProductFeaturesPreview data={module.data as any} />,
  'product-showcase': (module) => <ProductShowcasePreview data={module.data as any} />,
  'product-scenes': (module) => <ProductScenesPreview data={module.data as any} />,
  'product-info': (module) => <ProductInfoPreview data={module.data as any} />,
  'product-benefits': (module) => <ProductBenefitsPreview data={module.data as any} />,
  'product-steps': (module) => <ProductStepsPreview data={module.data as any} />,
  'product-comparison': (module) => <ProductComparisonPreview data={module.data as any} />,
  'product-proof': (module) => <ProductProofPreview data={module.data as any} />,
  'product-purchase': (module) => <ProductPurchasePreview data={module.data as any} />,
};

export function ModulePreviewRenderer({ module, modules = [] }: { module: PageModule; modules?: PageModule[] }) {
  return previewRegistry[module.type]?.(module, modules) ?? null;
}
