'use client';

import { HeroData } from '@/types/modules';
import { FormField, SegmentedField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: HeroData; onChange: (data: HeroData) => void }

const bgOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'gradient', label: 'Grad.' },
];

const layoutOptions = [
  { value: 'left-text-right-image', label: 'Split' },
  { value: 'centered', label: 'Centered' },
];

export function HeroForm({ data, onChange }: Props) {
  const set = <K extends keyof HeroData>(key: K, val: HeroData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="Layout" value={data.layout} onChange={(v) => set('layout', v as HeroData['layout'])} options={layoutOptions} />
      <SegmentedField label="Background" value={data.backgroundStyle} onChange={(v) => set('backgroundStyle', v as HeroData['backgroundStyle'])} options={bgOptions} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Kicker" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="e.g. Introducing" />
      <FormField label="Title" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="Your main headline" />
      <FormField label="Subtitle" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} placeholder="Supporting description" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Button Text" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="Get Started" />
      <FormField label="Button Link" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="主視覺圖片" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.hero} />
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
