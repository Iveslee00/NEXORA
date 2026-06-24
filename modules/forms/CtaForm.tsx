'use client';

import { CtaData } from '@/types/modules';
import { FormField, SegmentedField, ColorSection } from '@/components/ui/FormField';

interface Props { data: CtaData; onChange: (data: CtaData) => void }

const bgOptions = [
  { value: 'light', label: '淺色' },
  { value: 'dark', label: '深色' },
  { value: 'gradient', label: 'Grad.' },
];

const alignOptions = [
  { value: 'left', label: '左' },
  { value: 'center', label: '中' },
  { value: 'right', label: '右' },
];

export function CtaForm({ data, onChange }: Props) {
  const set = <K extends keyof CtaData>(key: K, val: CtaData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="背景樣式" value={data.backgroundStyle} onChange={(v) => set('backgroundStyle', v as CtaData['backgroundStyle'])} options={bgOptions} />
      <SegmentedField label="對齊" value={data.alignment} onChange={(v) => set('alignment', v as CtaData['alignment'])} options={alignOptions} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="行動呼籲標題" />
      <FormField label="Subtitle" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} placeholder="Supporting text" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即前往" />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
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
