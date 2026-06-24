'use client';

import { LogoWallData, LogoItem } from '@/types/modules';
import { FormField, ColorField, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { generateId } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface Props { data: LogoWallData; onChange: (data: LogoWallData) => void }

export function LogoWallForm({ data, onChange }: Props) {
  const updateLogo = (id: string, field: keyof LogoItem, value: string) => {
    onChange({ ...data, logos: data.logos.map((l) => l.id === id ? { ...l, [field]: value } : l) });
  };

  const addLogo = () => {
    const newLogo: LogoItem = { id: generateId(), image: 'https://placehold.co/160x60/f0f0f8/6366f1?text=品牌', alt: '品牌名稱', link: '#' };
    onChange({ ...data, logos: [...data.logos, newLogo] });
  };

  const removeLogo = (id: string) => {
    onChange({ ...data, logos: data.logos.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Logo（{data.logos.length}）</span>
          <button onClick={addLogo} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={13} /> 新增
          </button>
        </div>
        {data.logos.map((logo, idx) => (
          <div key={logo.id} className="border border-slate-700 rounded-lg p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Logo {idx + 1}</span>
              <button onClick={() => removeLogo(logo.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
            <FormField label="替代文字" value={logo.alt} onChange={(v) => updateLogo(logo.id, 'alt', v)} placeholder="品牌名稱" />
            <FormField label="連結" value={logo.link} onChange={(v) => updateLogo(logo.id, 'link', v)} type="url" placeholder="https://" />
            <ImageField label="Logo 圖片" value={logo.image} onChange={(v) => updateLogo(logo.id, 'image', v)} spec={IMAGE_SPECS.logo} />
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">顏色設定</p>
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorField label="標題色" value={data.titleColor} onChange={(v) => onChange({ ...data, titleColor: v })} />
    </div>
  );
}
