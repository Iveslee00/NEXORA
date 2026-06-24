'use client';

import { HeroData } from '@/types/modules';
import { FormField, SegmentedField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';

interface Props { data: HeroData; onChange: (data: HeroData) => void }

const heightOptions = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

export function HeroForm({ data, onChange }: Props) {
  const set = <K extends keyof HeroData>(key: K, val: HeroData[K]) => onChange({ ...data, [key]: val });
  const imageSpecs = getKvImageSpecs(data.height);

  return (
    <div className="space-y-4">
      <SegmentedField label="高度" value={data.height ?? 'medium'} onChange={(v) => set('height', v as HeroData['height'])} options={heightOptions} />
      <ToggleField label="顯示文字區" description="關閉後會成為純 Banner" value={data.showText ?? true} onChange={(v) => set('showText', v)} />
      <div className="h-px bg-slate-700/60" />
      {data.showText !== false && (
        <>
          <FormField label="小標" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="活動主打" />
          <FormField label="主標" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="夏日限定優惠開跑" />
          <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} placeholder="用一句話說明活動利益點" />
          <div className="h-px bg-slate-700/60" />
          <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即看優惠" />
        </>
      )}
      <FormField label={data.showText === false ? '整張 Banner 連結' : '按鈕 / Banner 連結'} value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="KV 圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={imageSpecs.desktop} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
        同 PC 視覺
      </button>
      <ImageField label="KV 圖片（M）" value={data.mobileImage ?? ''} onChange={(v) => set('mobileImage', v)} spec={imageSpecs.mobile} />
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
