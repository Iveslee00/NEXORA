'use client';
import { EmailBankInfoData, EmailBankItem } from '@/types/emailModules';
import { FormField, ColorField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: EmailBankInfoData; onChange: (d: EmailBankInfoData) => void }

export function EmailBankInfoForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.items[0]?.id ?? null);

  const update = (id: string, field: keyof EmailBankItem, value: string) =>
    onChange({ ...data, items: data.items.map((i) => i.id === id ? { ...i, [field]: value } : i) });

  const add = () => {
    const item: EmailBankItem = { id: generateId(), cardName: '信用卡名稱', benefit: '最高回饋', condition: '', note: '', accentColor: '#6366f1', logo: '' };
    onChange({ ...data, items: [...data.items, item] });
    setExpanded(item.id);
  };

  const remove = (id: string) => {
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <FormField label="標題" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <FormField label="副標題" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <div className="space-y-1">
        <p className="text-xs text-slate-500">欄數</p>
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((n) => (
            <button key={n} onClick={() => onChange({ ...data, columns: n })} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${(data.columns ?? 2) === n ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
              {n}欄
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-500">對齊</p>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button key={a} onClick={() => onChange({ ...data, alignment: a })} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${(data.alignment || 'center') === a ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
              {a === 'left' ? '靠左' : a === 'center' ? '置中' : '靠右'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Cards ({data.items.length})</span>
          <button onClick={add} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"><Plus size={13} /> Add</button>
        </div>
        {data.items.map((item, idx) => (
          <div key={item.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.accentColor || '#6366f1' }} />
                <span className="text-sm text-slate-300 truncate">{item.cardName || `Card ${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                {expanded === item.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60 pt-3 space-y-3">
                <FormField label="卡片名稱" value={item.cardName} onChange={(v) => update(item.id, 'cardName', v)} />
                <FormField label="Logo URL" value={item.logo} onChange={(v) => update(item.id, 'logo', v)} type="url" placeholder="https://…" />
                <ColorField label="強調色" value={item.accentColor} onChange={(v) => update(item.id, 'accentColor', v)} />
                <FormField label="活動條件" value={item.condition} onChange={(v) => update(item.id, 'condition', v)} />
                <FormField label="優惠說明" value={item.benefit} onChange={(v) => update(item.id, 'benefit', v)} />
                <FormField label="備註" value={item.note} onChange={(v) => update(item.id, 'note', v)} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-700/60" />
      <FormField label="免責聲明" value={data.disclaimer} onChange={(v) => onChange({ ...data, disclaimer: v })} type="textarea" rows={2} />
      <FormField label="連結文字" value={data.linkText} onChange={(v) => onChange({ ...data, linkText: v })} />
      <FormField label="連結網址" value={data.linkUrl} onChange={(v) => onChange({ ...data, linkUrl: v })} type="url" placeholder="#" />
      <div className="h-px bg-slate-700/60" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
