'use client';

import { PageModule } from '@/types/modules';
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

export function ModulePreviewRenderer({ module }: { module: PageModule }) {
  switch (module.type) {
    case 'title':            return <TitlePreview data={module.data} />;
    case 'hero':             return <HeroPreview data={module.data} />;
    case 'split-section':    return <SplitSectionPreview data={module.data} />;
    case 'product-grid':     return <ProductGridPreview data={module.data} />;
    case 'banner-products':  return <BannerProductsPreview data={module.data} />;
    case 'product-banner':   return <ProductBannerPreview data={module.data} />;
    case 'product-carousel': return <ProductCarouselPreview data={module.data} />;
    case 'logo-wall':        return <LogoWallPreview data={module.data} />;
    case 'cta':              return <CtaPreview data={module.data} />;
    case 'faq':              return <FaqPreview data={module.data} />;
    case 'sticky-sidebar':   return <StickySidebarPreview data={module.data} />;
    case 'article-text':     return <ArticleTextPreview data={module.data} />;
    case 'article-image':    return <ArticleImagePreview data={module.data} />;
    case 'hero-carousel':    return <HeroCarouselPreview data={module.data} />;
    case 'bank-promo':       return <BankPromoPreview data={module.data} />;
    default:                 return null;
  }
}
