'use client';

import { SplitSectionData } from '@/types/modules';
import { FormField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: SplitSectionData; onChange: (data: SplitSectionData) => void }

export function SplitSectionForm({ data, onChange }: Props) {
  const set = <K extends keyof SplitSectionData>(key: K, val: SplitSectionData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <FormField label="Title" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="Feature title" />
      <FormField label="Description" value={data.description} onChange={(v) => set('description', v)} type="textarea" rows={4} placeholder="Describe the feature..." />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Button Text" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="Learn More" />
      <FormField label="Button Link" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="內容圖片" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.split} />
      <ToggleField label="Reverse Layout" description="Image on left, text on right" value={data.reverse} onChange={(v) => set('reverse', v)} />
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
