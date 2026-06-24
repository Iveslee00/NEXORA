'use client';

import { HeroData } from '@/types/modules';
import { FormField, SegmentedField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: HeroData; onChange: (data: HeroData) => void }

const bgOptions = [
  { value: 'light', label: '淺色' },
  { value: 'dark', label: '深色' },
  { value: 'gradient', label: '漸層' },
];

const layoutOptions = [
  { value: 'left-text-right-image', label: '圖文' },
  { value: 'centered', label: '置中' },
];

export function HeroForm({ data, onChange }: Props) {
  const set = <K extends keyof HeroData>(key: K, val: HeroData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="版型" value={data.layout} onChange={(v) => set('layout', v as HeroData['layout'])} options={layoutOptions} />
      <SegmentedField label="背景樣式" value={data.backgroundStyle} onChange={(v) => set('backgroundStyle', v as HeroData['backgroundStyle'])} options={bgOptions} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="小標" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="活動主打" />
      <FormField label="主標" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="夏日限定優惠開跑" />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} placeholder="用一句話說明活動利益點" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即看優惠" />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="主視覺圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.hero} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
        同 PC 視覺
      </button>
      <ImageField label="主視覺圖片（M）" value={data.mobileImage ?? ''} onChange={(v) => set('mobileImage', v)} spec={IMAGE_SPECS.heroMobile} />
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
