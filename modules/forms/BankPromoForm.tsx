'use client';

import { BankPromoData, BankPromoItem } from '@/types/modules';
import { FormField, ColorField, ColorSection } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: BankPromoData; onChange: (data: BankPromoData) => void }

export function BankPromoForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.items[0]?.id ?? null);

  const updateItem = (id: string, field: keyof BankPromoItem, value: string) => {
    onChange({ ...data, items: data.items.map((item) => item.id === id ? { ...item, [field]: value } : item) });
  };

  const addItem = () => {
    const newItem: BankPromoItem = {
      id: generateId(),
      cardName: '信用卡名稱',
      condition: '指定消費條件',
      benefit: '最高回饋 X%',
      note: '備註說明',
      logo: '',
      accentColor: '#6366f1',
    };
    onChange({ ...data, items: [...data.items, newItem] });
    setExpanded(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <FormField label="區塊標題" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="信用卡優惠說明" />
      <FormField label="副標題" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="活動期間…" />

      <div className="h-px bg-slate-700/60" />

      {/* Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Cards ({data.items.length})</span>
          <button onClick={addItem} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={13} /> Add
          </button>
        </div>
        {data.items.map((item, idx) => (
          <div key={item.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {item.accentColor && (
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.accentColor }} />
                )}
                <span className="text-sm text-slate-300 truncate">{item.cardName || `Card ${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                {expanded === item.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60">
                <div className="pt-3 space-y-3">
                  <FormField label="卡片名稱" value={item.cardName} onChange={(v) => updateItem(item.id, 'cardName', v)} placeholder="台新 Richart 卡" />
                  <FormField label="Logo URL" value={item.logo} onChange={(v) => updateItem(item.id, 'logo', v)} type="url" placeholder="https://…" />
                  <ColorField label="強調色" value={item.accentColor} onChange={(v) => updateItem(item.id, 'accentColor', v)} placeholder="#6366f1" />
                  <FormField label="活動條件" value={item.condition} onChange={(v) => updateItem(item.id, 'condition', v)} placeholder="指定通路消費滿 NT$1,000" />
                  <FormField label="優惠說明（主要）" value={item.benefit} onChange={(v) => updateItem(item.id, 'benefit', v)} placeholder="最高 3.8% 回饋" />
                  <FormField label="備註" value={item.note} onChange={(v) => updateItem(item.id, 'note', v)} type="textarea" rows={2} placeholder="謹慎理財 信用至上" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-700/60" />
      <FormField label="免責聲明" value={data.disclaimer} onChange={(v) => onChange({ ...data, disclaimer: v })} type="textarea" rows={2} placeholder="謹慎理財 信用至上…" />
      <FormField label="連結文字" value={data.linkText} onChange={(v) => onChange({ ...data, linkText: v })} placeholder="查看更多優惠 ›" />
      <FormField label="連結網址" value={data.linkUrl} onChange={(v) => onChange({ ...data, linkUrl: v })} type="url" placeholder="#" />

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
