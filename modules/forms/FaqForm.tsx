'use client';

import { FaqData, FaqItem } from '@/types/modules';
import { FormField, ColorSection } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: FaqData; onChange: (data: FaqData) => void }

export function FaqForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.items[0]?.id ?? null);

  const updateItem = (id: string, field: keyof FaqItem, value: string) => {
    onChange({ ...data, items: data.items.map((item) => item.id === id ? { ...item, [field]: value } : item) });
  };

  const addItem = () => {
    const newItem: FaqItem = { id: generateId(), question: 'New Question', answer: 'Answer goes here.' };
    onChange({ ...data, items: [...data.items, newItem] });
    setExpanded(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Questions ({data.items.length})</span>
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
              <span className="text-sm text-slate-300 truncate">{item.question || `Question ${idx + 1}`}</span>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                {expanded === item.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60">
                <div className="pt-3 space-y-3">
                  <FormField label="Question" value={item.question} onChange={(v) => updateItem(item.id, 'question', v)} type="textarea" rows={2} />
                  <FormField label="Answer" value={item.answer} onChange={(v) => updateItem(item.id, 'answer', v)} type="textarea" rows={4} />
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
