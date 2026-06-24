'use client';

import { SplitSectionData } from '@/types/modules';
import { FormField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: SplitSectionData; onChange: (data: SplitSectionData) => void }

export function SplitSectionForm({ data, onChange }: Props) {
  const set = <K extends keyof SplitSectionData>(key: K, val: SplitSectionData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="活動亮點標題" />
      <FormField label="說明文字" value={data.description} onChange={(v) => set('description', v)} type="textarea" rows={4} placeholder="說明活動重點、商品特色或品牌故事" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="了解更多" />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="內容圖片" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.split} />
      <ToggleField label="左右對調" description="開啟後圖片在左、文字在右" value={data.reverse} onChange={(v) => set('reverse', v)} />
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
