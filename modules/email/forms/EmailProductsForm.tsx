'use client';
import { EmailProductsData, EmailProductItem } from '@/types/emailModules';
import { FormField, ColorField, SegmentedField, ToggleField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: EmailProductsData; onChange: (d: EmailProductsData) => void }

const layoutLabels: Record<string, string> = {
  '1col': '單欄', '2col': '雙欄', '3col': '三欄', 'featured': '主推', '1+2': '1+2',
};

export function EmailProductsForm({ data, onChange }: Props) {
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
      <SegmentedField
        label="版型"
        value={data.layout}
        options={Object.entries(layoutLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => onChange({ ...data, layout: v as EmailProductsData['layout'] })}
      />
      <FormField label="區塊標題（選填）" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="本週精選" />
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
                <FormField label="圖片 URL" value={p.image} onChange={(v) => update(p.id, 'image', v)} type="url" placeholder="https://…" />
                <FormField label="品牌" value={p.brand} onChange={(v) => update(p.id, 'brand', v)} placeholder="Brand" />
                <FormField label="商品名稱" value={p.name} onChange={(v) => update(p.id, 'name', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="原價" value={p.originalPrice} onChange={(v) => update(p.id, 'originalPrice', v)} placeholder="$99.00" />
                  <FormField label="售價" value={p.salePrice} onChange={(v) => update(p.id, 'salePrice', v)} placeholder="$69.00" />
                </div>
                <FormField label="商品連結" value={p.link} onChange={(v) => update(p.id, 'link', v)} type="url" placeholder="#" />
                <ToggleField label="顯示 Badge" value={p.showBadge} onChange={(v) => update(p.id, 'showBadge', v)} />
                {p.showBadge && <FormField label="Badge 文字" value={p.badgeText} onChange={(v) => update(p.id, 'badgeText', v)} placeholder="特賣" />}
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
