'use client';

import type React from 'react';
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
import { AnchorNavForm } from './AnchorNavForm';
import { FormField } from '@/components/ui/FormField';

interface Props {
  module: PageModule;
  modules: PageModule[];
  onChange: (data: PageModule['data']) => void;
}

export function FormRenderer({ module, modules, onChange }: Props) {
  if (module.type === 'anchor-nav') {
    return <AnchorNavForm data={module.data} moduleId={module.id} modules={modules} onChange={onChange as (d: typeof module.data) => void} />;
  }

  const anchorName = 'anchorName' in module.data ? module.data.anchorName ?? '' : '';
  const updateAnchorName = (value: string) => onChange({ ...module.data, anchorName: value } as PageModule['data']);
  const anchorField = (
    <>
      <FormField label="錨點名稱" value={anchorName} onChange={updateAnchorName} placeholder="例如：熱銷商品、活動說明" />
      <p className="-mt-2 text-xs leading-relaxed text-slate-500">填寫後可被「錨點導覽」模組列為跳轉按鈕。</p>
      <div className="h-px bg-slate-700/60" />
    </>
  );

  let form: React.ReactNode = null;
  switch (module.type) {
    case 'title':
      form = <TitleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'hero':
      form = <HeroForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'split-section':
      form = <SplitSectionForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-grid':
      form = <ProductGridForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'banner-products':
      form = <BannerProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-banner':
      form = <ProductBannerForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-carousel':
      form = <ProductCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'logo-wall':
      form = <LogoWallForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'cta':
      form = <CtaForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'faq':
      form = <FaqForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'sticky-sidebar':
      form = <StickySidebarForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'article-text':
      form = <ArticleTextForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'article-image':
      form = <ArticleImageForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'hero-carousel':
      form = <HeroCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'bank-promo':
      form = <BankPromoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    default:
      return null;
  }

  return <div className="space-y-4">{anchorField}{form}</div>;
}
