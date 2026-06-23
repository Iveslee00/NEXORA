'use client';

import { PageModule } from '@/types/modules';
import { TitleForm } from './TitleForm';
import { HeroForm } from './HeroForm';
import { SplitSectionForm } from './SplitSectionForm';
import { ProductGridForm } from './ProductGridForm';
import { BannerProductsForm } from './BannerProductsForm';
import { ProductBannerForm } from './ProductBannerForm';
import { ProductCarouselForm } from './ProductCarouselForm';
import { LogoWallForm } from './LogoWallForm';
import { CtaForm } from './CtaForm';
import { FaqForm } from './FaqForm';
import { StickySidebarForm } from './StickySidebarForm';
import { ArticleTextForm } from './ArticleTextForm';
import { ArticleImageForm } from './ArticleImageForm';
import { HeroCarouselForm } from './HeroCarouselForm';
import { BankPromoForm } from './BankPromoForm';

interface Props {
  module: PageModule;
  onChange: (data: PageModule['data']) => void;
}

export function FormRenderer({ module, onChange }: Props) {
  switch (module.type) {
    case 'title':
      return <TitleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'hero':
      return <HeroForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'split-section':
      return <SplitSectionForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'product-grid':
      return <ProductGridForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'banner-products':
      return <BannerProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'product-banner':
      return <ProductBannerForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'product-carousel':
      return <ProductCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'logo-wall':
      return <LogoWallForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'cta':
      return <CtaForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'faq':
      return <FaqForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'sticky-sidebar':
      return <StickySidebarForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'article-text':
      return <ArticleTextForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'article-image':
      return <ArticleImageForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'hero-carousel':
      return <HeroCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'bank-promo':
      return <BankPromoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    default:
      return null;
  }
}
