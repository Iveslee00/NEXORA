'use client';

import { ProductCarouselData, Product } from '@/types/modules';
import { FormField, ToggleField, ColorSection } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: ProductCarouselData; onChange: (data: ProductCarouselData) => void }

export function ProductCarouselForm({ data, onChange }: Props) {
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Products ({data.products.length})</span>
          <button onClick={addProduct} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={13} /> Add
          </button>
        </div>
        {data.products.map((product, idx) => (
          <div key={product.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {product.image && (
                  <img src={product.image} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0 border border-slate-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <span className="text-sm text-slate-300 truncate">{product.name || `Product ${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                {expanded === product.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
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
                  <FormField label="Image URL" value={product.image} onChange={(v) => updateProduct(product.id, 'image', v)} type="url" placeholder="https://..." />
                  <ToggleField label="顯示 Badge" value={product.showBadge} onChange={(v) => updateProduct(product.id, 'showBadge', v)} />
                  {product.showBadge && (
                    <FormField label="Badge Text" value={product.badgeText} onChange={(v) => updateProduct(product.id, 'badgeText', v)} placeholder="特賣 / NEW / HOT" />
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
