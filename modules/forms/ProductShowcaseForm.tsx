'use client';

import { ProductShowcaseData } from '@/types/modules';
import { ColorSection, FormField, ImageField, SegmentedField, ToggleField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: ProductShowcaseData; onChange: (data: ProductShowcaseData) => void }

const styleOptions = [
  { value: 'spacious', label: '留白展示' },
  { value: 'split', label: '左右分欄' },
  { value: 'luxury', label: '精品展示' },
];

const styleDescriptions: Record<ProductShowcaseData['style'], string> = {
  spacious: '留白展示：適合高質感單品，文字少、圖片要乾淨。',
  split: '左右分欄：電商資訊導購，圖片與文字同等重要，適合講利益點與 CTA。',
  luxury: '精品展示：玻璃文字卡搭配聚焦商品圖，適合想做高級感或主推爆品。',
};

const normalizeProductShowcaseStyle = (style: ProductShowcaseData['style'] | string): ProductShowcaseData['style'] => {
  if (style === 'split' || style === 'luxury') return style;
  return 'spacious';
};

export function ProductShowcaseForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductShowcaseData>(key: K, val: ProductShowcaseData[K]) => onChange({ ...data, [key]: val });
  const currentStyle = normalizeProductShowcaseStyle(data.style);

  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={currentStyle} options={styleOptions} onChange={(v) => set('style', v as ProductShowcaseData['style'])} />
      <p className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs leading-5 text-cyan-100/80">{styleDescriptions[currentStyle]}</p>
      <ToggleField label="左右對調" description="左右排版時可交換圖片與文字" value={data.reverse} onChange={(v) => set('reverse', v)} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={2} />
      <FormField label="說明" value={data.description} onChange={(v) => set('description', v)} type="textarea" rows={4} />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="展示圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.productShowcase} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">同 PC 視覺</button>
      <ImageField label="展示圖片（M）" value={data.mobileImage} onChange={(v) => set('mobileImage', v)} spec={IMAGE_SPECS.productShowcaseMobile} />
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
