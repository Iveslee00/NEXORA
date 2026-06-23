'use client';
import { EmailImageProductsData, EmailProductItem } from '@/types/emailModules';
import { FormField, ColorField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: EmailImageProductsData; onChange: (d: EmailImageProductsData) => void }

export function EmailImageProductsForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.products[0]?.id ?? null);

  const update = (id: string, field: keyof EmailProductItem, value: string | boolean) =>
    onChange({ ...data, products: data.products.map((p) => p.id === id ? { ...p, [field]: value } : p) });

  const add = () => {
    const item: EmailProductItem = { id: generateId(), image: '', name: 'Product', brand: '', originalPrice: '', salePrice: '', link: '#', badgeText: '', showBadge: false };
    onChange({ ...data, products: [...data.products, item] });
    setExpanded(item.id);
  };

  const remove = (id: string) => {
    onChange({ ...data, products: data.products.filter((p) => p.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <FormField label="Banner 圖片 URL" value={data.bannerImage} onChange={(v) => onChange({ ...data, bannerImage: v })} type="url" placeholder="https://…" />
      <FormField label="Banner 連結" value={data.bannerLink} onChange={(v) => onChange({ ...data, bannerLink: v })} type="url" placeholder="#" />
      <div className="space-y-1">
        <p className="text-xs text-slate-500">圖片位置</p>
        <div className="flex gap-1">
          <button onClick={() => onChange({ ...data, imagePosition: 'left' })} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${(data.imagePosition || 'left') === 'left' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>圖左文右</button>
          <button onClick={() => onChange({ ...data, imagePosition: 'right' })} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${data.imagePosition === 'right' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>文左圖右</button>
        </div>
      </div>
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => onChange({ ...data, buttonText: v })} placeholder="選購" />
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Products ({data.products.length})</span>
          <button onClick={add} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"><Plus size={13} /> Add</button>
        </div>
        {data.products.map((p, idx) => (
          <div key={p.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50">
              <span className="text-sm text-slate-300 truncate">{p.name || `Product ${idx + 1}`}</span>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); remove(p.id); }} className="text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                {expanded === p.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === p.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60 pt-3 space-y-3">
                <FormField label="圖片 URL" value={p.image} onChange={(v) => update(p.id, 'image', v)} type="url" />
                <FormField label="品牌" value={p.brand} onChange={(v) => update(p.id, 'brand', v)} />
                <FormField label="商品名稱" value={p.name} onChange={(v) => update(p.id, 'name', v)} />
                <FormField label="原價" value={p.originalPrice} onChange={(v) => update(p.id, 'originalPrice', v)} />
                <FormField label="售價" value={p.salePrice} onChange={(v) => update(p.id, 'salePrice', v)} />
                <FormField label="商品連結" value={p.link} onChange={(v) => update(p.id, 'link', v)} type="url" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-700/60" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
