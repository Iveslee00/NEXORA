'use client';
import { EmailPromoData, EmailPromoBox } from '@/types/emailModules';
import { FormField, ColorField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: EmailPromoData; onChange: (d: EmailPromoData) => void }

export function EmailPromoForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.boxes[0]?.id ?? null);

  const set = <K extends keyof EmailPromoData>(k: K, v: EmailPromoData[K]) => onChange({ ...data, [k]: v });

  const updateBox = (id: string, field: keyof EmailPromoBox, value: string) =>
    onChange({ ...data, boxes: data.boxes.map((b) => b.id === id ? { ...b, [field]: value } : b) });

  const addBox = () => {
    const box: EmailPromoBox = { id: generateId(), title: '活動名稱', description: '活動說明文字', accentColor: '#6366f1', image: '' };
    onChange({ ...data, boxes: [...data.boxes, box] });
    setExpanded(box.id);
  };

  const removeBox = (id: string) => {
    onChange({ ...data, boxes: data.boxes.filter((b) => b.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <FormField label="區塊標題" value={data.sectionTitle} onChange={(v) => set('sectionTitle', v)} placeholder="精選活動" />
      <div className="space-y-1">
        <p className="text-xs text-slate-500">每排欄數</p>
        <div className="flex gap-1">
          {([1, 2, 3, 4] as const).map((n) => (
            <button key={n} onClick={() => set('columns', n)} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${data.columns === n ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
              {n}欄
            </button>
          ))}
        </div>
      </div>
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">方框 ({data.boxes.length})</span>
          <button onClick={addBox} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"><Plus size={13} /> 新增</button>
        </div>
        {data.boxes.map((box, idx) => (
          <div key={box.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button onClick={() => setExpanded(expanded === box.id ? null : box.id)} className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: box.accentColor || '#6366f1' }} />
                <span className="text-sm text-slate-300 truncate">{box.title || `方框 ${idx + 1}`}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); removeBox(box.id); }} className="text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                {expanded === box.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === box.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60 pt-3 space-y-3">
                <FormField label="標題" value={box.title} onChange={(v) => updateBox(box.id, 'title', v)} />
                <FormField label="說明文字" value={box.description} onChange={(v) => updateBox(box.id, 'description', v)} type="textarea" rows={2} />
                <FormField label="圖片網址（選填）" value={box.image} onChange={(v) => updateBox(box.id, 'image', v)} type="url" placeholder="https://…" />
                <ColorField label="強調色（邊框）" value={box.accentColor} onChange={(v) => updateBox(box.id, 'accentColor', v)} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-700/60" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => set('backgroundColor', v)} />
      <ColorField label="方框底色" value={data.boxBgColor} onChange={(v) => set('boxBgColor', v)} />
    </div>
  );
}
