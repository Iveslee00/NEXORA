'use client';

import { SplitSectionData } from '@/types/modules';
import { FormField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: SplitSectionData; onChange: (data: SplitSectionData) => void }

export function SplitSectionForm({ data, onChange }: Props) {
  const set = <K extends keyof SplitSectionData>(key: K, val: SplitSectionData[K]) => onChange({ ...data, [key]: val });
  const heightOptions = [
    { value: 'small', label: 'S' },
    { value: 'medium', label: 'M' },
    { value: 'large', label: 'L' },
  ];

  return (
    <div className="space-y-4">
      <ToggleField label="左右對調" description="開啟後圖片在左、文字在右" value={data.reverse} onChange={(v) => set('reverse', v)} />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">高度</label>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-md p-0.5">
          {heightOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => set('height', o.value as SplitSectionData['height'])}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
                (data.height ?? 'medium') === o.value ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-px bg-slate-700/60" />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="活動亮點標題" />
      <FormField label="說明文字" value={data.description} onChange={(v) => set('description', v)} type="textarea" rows={4} placeholder="說明活動重點、商品特色或品牌故事" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="了解更多" />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="內容圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.split} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
        同 PC 視覺
      </button>
      <ImageField label="內容圖片（M）" value={data.mobileImage ?? ''} onChange={(v) => set('mobileImage', v)} spec={IMAGE_SPECS.splitMobile} />
      <div className="h-px bg-slate-700/60" />
      <ColorSection
        backgroundColor={data.backgroundColor}
        onBackgroundColorChange={(v) => set('backgroundColor', v)}
        titleColor={data.titleColor}
        textColor={data.textColor}
        onTitleColorChange={(v) => set('titleColor', v)}
        onTextColorChange={(v) => set('textColor', v)}
      />
    </div>
  );
}
