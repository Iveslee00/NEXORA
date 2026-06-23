'use client';

import { SplitSectionData } from '@/types/modules';
import { FormField, ToggleField, ColorSection } from '@/components/ui/FormField';

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
      <FormField label="Image URL" value={data.image} onChange={(v) => set('image', v)} type="url" placeholder="https://..." />
      {data.image && (
        <div className="rounded-md overflow-hidden border border-slate-700">
          <img src={data.image} alt="" className="w-full block object-cover max-h-28" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
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
