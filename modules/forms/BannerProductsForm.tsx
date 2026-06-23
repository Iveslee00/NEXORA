'use client';

import { BannerProductsData, Product } from '@/types/modules';
import { FormField, ToggleField, ColorField, SegmentedField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: BannerProductsData; onChange: (data: BannerProductsData) => void }

export function BannerProductsForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.products[0]?.id ?? null);

  const updateProduct = (id: string, field: keyof Product, value: string | boolean) => {
    onChange({ ...data, products: data.products.map((p) => p.id === id ? { ...p, [field]: value } : p) });
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: generateId(),
      image: 'https://placehold.co/400x400/f0f0f8/6366f1?text=New',
      brand: 'Brand Name', name: 'New Product',
      originalPrice: '$0.00', salePrice: '',
      link: '#', showBadge: false, badgeText: 'NEW',
      showSpecialTag: false, specialTag: '',
    };
    onChange({ ...data, products: [...data.products, newProduct] });
    setExpanded(newProduct.id);
  };

  const removeProduct = (id: string) => {
    onChange({ ...data, products: data.products.filter((p) => p.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      {/* Banner fields */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Banner</p>
      <FormField label="模組標示" value={data.layoutLabel} onChange={(v) => onChange({ ...data, layoutLabel: v })} placeholder={`Banner + ${data.products.length || 1} 品`} />
      <FormField label="Banner Title" value={data.bannerTitle} onChange={(v) => onChange({ ...data, bannerTitle: v })} placeholder="Campaign Title" />
      <FormField label="Banner Subtitle" value={data.bannerSubtitle} onChange={(v) => onChange({ ...data, bannerSubtitle: v })} placeholder="Limited time offer" />
      <FormField label="Banner Link" value={data.bannerLink} onChange={(v) => onChange({ ...data, bannerLink: v })} type="url" placeholder="https://" />
      <ImageField label="活動 Banner 圖片" value={data.bannerImage} onChange={(v) => onChange({ ...data, bannerImage: v })} spec={IMAGE_SPECS.bannerProducts} />
      <ColorField label="Banner Title Color" value={data.bannerTitleColor} onChange={(v) => onChange({ ...data, bannerTitleColor: v })} />
      <SegmentedField
        label="Background"
        value={data.backgroundStyle}
        options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'gradient', label: 'Gradient' }]}
        onChange={(v) => onChange({ ...data, backgroundStyle: v as BannerProductsData['backgroundStyle'] })}
      />

      <div className="h-px bg-slate-700/60" />

      {/* Product list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Products ({data.products.length})</span>
          <button onClick={addProduct} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={13} /> Add
          </button>
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
                  <span className="text-sm text-slate-300 truncate">{product.name || `Product ${idx + 1}`}</span>
                </span>
              </button>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  disabled={data.products.length <= 1}
                  className="text-slate-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  aria-label={`刪除 ${product.name || `Product ${idx + 1}`}`}
                  title={data.products.length <= 1 ? '至少保留 1 個商品' : '刪除商品'}
                >
                  <Trash2 size={13} />
                </button>
                {expanded === product.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </div>
            {expanded === product.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60">
                <div className="pt-3 space-y-3">
                  <FormField label="品牌 Brand" value={product.brand} onChange={(v) => updateProduct(product.id, 'brand', v)} placeholder="Brand Name" />
                  <FormField label="品名 Name" value={product.name} onChange={(v) => updateProduct(product.id, 'name', v)} placeholder="Product name" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="原價" value={product.originalPrice} onChange={(v) => updateProduct(product.id, 'originalPrice', v)} placeholder="$0.00" />
                    <FormField label="特價" value={product.salePrice} onChange={(v) => updateProduct(product.id, 'salePrice', v)} placeholder="$0.00" />
                  </div>
                  <FormField label="Link" value={product.link} onChange={(v) => updateProduct(product.id, 'link', v)} type="url" placeholder="https://" />
                  <ImageField label="商品圖片" value={product.image} onChange={(v) => updateProduct(product.id, 'image', v)} spec={IMAGE_SPECS.product} />
                  <ToggleField label="顯示 Badge" value={product.showBadge} onChange={(v) => updateProduct(product.id, 'showBadge', v)} />
                  {product.showBadge && (
                    <FormField label="Badge Text" value={product.badgeText} onChange={(v) => updateProduct(product.id, 'badgeText', v)} placeholder="特賣 / NEW" />
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
