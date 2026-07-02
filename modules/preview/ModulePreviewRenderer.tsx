'use client';

import type React from 'react';
import { ModuleType, PageModule } from '@/types/modules';
import { SharedModuleView } from '@/modules/renderers/SharedModuleView';
import type { ModuleRenderMode } from '@/modules/renderers/types';

type PreviewRegistryRenderer = (module: PageModule, modules: PageModule[], mode: ModuleRenderMode) => React.ReactNode;

const renderSharedPreview: PreviewRegistryRenderer = (module, modules, mode) => (
  <SharedModuleView module={module} modules={modules} mode={mode} />
);

export const previewRegistry: Record<ModuleType, PreviewRegistryRenderer> = {
  'title': renderSharedPreview,
  'hero': renderSharedPreview,
  'split-section': renderSharedPreview,
  'product-grid': renderSharedPreview,
  'banner-products': renderSharedPreview,
  'product-banner': renderSharedPreview,
  'product-carousel': renderSharedPreview,
  'logo-wall': renderSharedPreview,
  'cta': renderSharedPreview,
  'faq': renderSharedPreview,
  'sticky-sidebar': renderSharedPreview,
  'article-text': renderSharedPreview,
  'article-image': renderSharedPreview,
  'hero-carousel': renderSharedPreview,
  'bank-promo': renderSharedPreview,
  'anchor-nav': renderSharedPreview,
  'product-features': renderSharedPreview,
  'product-showcase': renderSharedPreview,
  'product-scenes': renderSharedPreview,
  'product-info': renderSharedPreview,
  'product-benefits': renderSharedPreview,
  'product-steps': renderSharedPreview,
  'product-comparison': renderSharedPreview,
  'product-proof': renderSharedPreview,
  'product-purchase': renderSharedPreview,
};

export function ModulePreviewRenderer({
  module,
  modules = [],
  mode = 'builder',
}: {
  module: PageModule;
  modules?: PageModule[];
  mode?: ModuleRenderMode;
}) {
  return previewRegistry[module.type]?.(module, modules, mode) ?? null;
}
