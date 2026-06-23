'use client';

import { ProductBannerData } from '@/types/modules';
import { FormField, SegmentedField, ToggleField, ColorSection } from '@/components/ui/FormField';

interface Props { data: ProductBannerData; onChange: (data: ProductBannerData) => void }

const bgOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'gradient', label: 'Grad.' },
];

export function ProductBannerForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductBannerData>(key: K, val: ProductBannerData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="Background" value={data.backgroundStyle} onChange={(v) => set('backgroundStyle', v as ProductBannerData['backgroundStyle'])} options={bgOptions} />
      <ToggleField label="Reverse Layout" description="Image on left, content on right" value={data.reverse} onChange={(v) => set('reverse', v)} />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Content</p>
      <FormField label="Kicker" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="限時優惠 LIMITED OFFER" />
      <FormField label="Headline" value={data.headline} onChange={(v) => set('headline', v)} type="textarea" rows={2} placeholder="Campaign headline" />
      <FormField label="Tagline" value={data.tagline} onChange={(v) => set('tagline', v)} type="textarea" rows={3} placeholder="Short supporting text..." />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Product</p>
      <FormField label="品牌 Brand" value={data.brand} onChange={(v) => set('brand', v)} placeholder="Brand Name" />
      <FormField label="品名 Product Name" value={data.productName} onChange={(v) => set('productName', v)} placeholder="Signature product name" />
      <div className="grid grid-cols-2 gap-2">
        <FormField label="原價" value={data.originalPrice} onChange={(v) => set('originalPrice', v)} placeholder="$299.00" />
        <FormField label="特價" value={data.salePrice} onChange={(v) => set('salePrice', v)} placeholder="$199.00" />
      </div>
      <ToggleField label="顯示 Badge" value={data.showBadge} onChange={(v) => set('showBadge', v)} />
      {data.showBadge && (
        <FormField label="Badge Text" value={data.badgeText} onChange={(v) => set('badgeText', v)} placeholder="特賣 / NEW / HOT" />
      )}

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">CTA</p>
      <FormField label="Button Text" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即選購" />
      <FormField label="Button Link" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Image</p>
      <FormField label="Product Image URL" value={data.image} onChange={(v) => set('image', v)} type="url" placeholder="https://..." />
      {data.image && (
        <div className="rounded-md overflow-hidden border border-slate-700">
          <img src={data.image} alt="" className="w-full block object-cover max-h-28" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}

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
