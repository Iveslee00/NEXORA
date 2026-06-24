'use client';

import { BannerProductsData, Product } from '@/types/modules';
import { FormField, ToggleField, ColorField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: BannerProductsData; onChange: (data: BannerProductsData) => void }

export function BannerProductsForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.products[0]?.id ?? null);

  const updateProduct = (id: string, field: keyof Product, value: string | boolean) => {
    onChange({ ...data, products: data.products.map((p) => p.id === id ? { ...p, [field]: value } : p) });
  };

  return (
    <div className="space-y-4">
      {/* Banner fields */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">活動 Banner</p>
      <FormField label="Banner 標題" value={data.bannerTitle} onChange={(v) => onChange({ ...data, bannerTitle: v })} placeholder="活動主標" />
      <FormField label="Banner 副標" value={data.bannerSubtitle} onChange={(v) => onChange({ ...data, bannerSubtitle: v })} placeholder="限時優惠" />
      <FormField label="Banner 連結" value={data.bannerLink} onChange={(v) => onChange({ ...data, bannerLink: v })} type="url" placeholder="https://" />
      <ImageField label="活動 Banner 圖片（PC）" value={data.bannerImage} onChange={(v) => onChange({ ...data, bannerImage: v })} spec={IMAGE_SPECS.bannerProducts} />
      <button type="button" onClick={() => onChange({ ...data, mobileBannerImage: data.bannerImage })} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
        同 PC 視覺
      </button>
      <ImageField label="活動 Banner 圖片（M）" value={data.mobileBannerImage ?? ''} onChange={(v) => onChange({ ...data, mobileBannerImage: v })} spec={IMAGE_SPECS.bannerProductsMobile} />
      <ColorField label="Banner 標題色" value={data.bannerTitleColor} onChange={(v) => onChange({ ...data, bannerTitleColor: v })} />

      <div className="h-px bg-slate-700/60" />

      {/* Product list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">固定商品（{data.products.length}）</span>
        </div>
        {data.products.map((product, idx) => (
          <div key={product.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-800/50 transition-colors">
              <button
                type="button"
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                aria-expanded={expanded === product.id}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {product.image && (
                    <img src={product.image} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0 border border-slate-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <span className="text-sm text-slate-300 truncate">{product.name || `商品 ${idx + 1}`}</span>
                </span>
              </button>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {expanded === product.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </div>
            {expanded === product.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60">
                <div className="pt-3 space-y-3">
                  <FormField label="品牌" value={product.brand} onChange={(v) => updateProduct(product.id, 'brand', v)} placeholder="品牌名稱" />
                  <FormField label="品名" value={product.name} onChange={(v) => updateProduct(product.id, 'name', v)} placeholder="商品名稱" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="原價" value={product.originalPrice} onChange={(v) => updateProduct(product.id, 'originalPrice', v)} placeholder="$0.00" />
                    <FormField label="特價" value={product.salePrice} onChange={(v) => updateProduct(product.id, 'salePrice', v)} placeholder="$0.00" />
                  </div>
                  <FormField label="連結" value={product.link} onChange={(v) => updateProduct(product.id, 'link', v)} type="url" placeholder="https://" />
                  <ImageField label="商品圖片" value={product.image} onChange={(v) => updateProduct(product.id, 'image', v)} spec={IMAGE_SPECS.product} />
                  <ToggleField label="顯示標籤" value={product.showBadge} onChange={(v) => updateProduct(product.id, 'showBadge', v)} />
                  {product.showBadge && (
                    <FormField label="標籤文字" value={product.badgeText} onChange={(v) => updateProduct(product.id, 'badgeText', v)} placeholder="特賣 / 新品" />
                  )}
                  <ToggleField label="顯示特標" value={product.showSpecialTag} onChange={(v) => updateProduct(product.id, 'showSpecialTag', v)} />
                  {product.showSpecialTag && (
                    <FormField label="特標文字" value={product.specialTag} onChange={(v) => updateProduct(product.id, 'specialTag', v)} placeholder="任三件85折" />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-700/60" />
      <ColorSection
        backgroundColor={data.backgroundColor}
        onBackgroundColorChange={(v) => onChange({ ...data, backgroundColor: v })}
        titleColor={data.titleColor}
        textColor={data.textColor}
        onTitleColorChange={(v) => onChange({ ...data, titleColor: v })}
        onTextColorChange={(v) => onChange({ ...data, textColor: v })}
      />
    </div>
  );
}
