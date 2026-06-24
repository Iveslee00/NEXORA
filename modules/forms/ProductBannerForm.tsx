'use client';

import { ProductBannerData } from '@/types/modules';
import { FormField, SegmentedField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: ProductBannerData; onChange: (data: ProductBannerData) => void }

const bgOptions = [
  { value: 'light', label: '淺色' },
  { value: 'dark', label: '深色' },
  { value: 'gradient', label: '漸層' },
];

export function ProductBannerForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductBannerData>(key: K, val: ProductBannerData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="背景樣式" value={data.backgroundStyle} onChange={(v) => set('backgroundStyle', v as ProductBannerData['backgroundStyle'])} options={bgOptions} />
      <ToggleField label="左右對調" description="開啟後圖片在左、文字在右" value={data.reverse} onChange={(v) => set('reverse', v)} />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">文字內容</p>
      <FormField label="小標" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="限時優惠" />
      <FormField label="主標" value={data.headline} onChange={(v) => set('headline', v)} type="textarea" rows={2} placeholder="主打商品活動標題" />
      <FormField label="說明文字" value={data.tagline} onChange={(v) => set('tagline', v)} type="textarea" rows={3} placeholder="用簡短文字說明商品賣點" />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">商品資訊</p>
      <FormField label="品牌" value={data.brand} onChange={(v) => set('brand', v)} placeholder="品牌名稱" />
      <FormField label="品名" value={data.productName} onChange={(v) => set('productName', v)} placeholder="主打商品名稱" />
      <div className="grid grid-cols-2 gap-2">
        <FormField label="原價" value={data.originalPrice} onChange={(v) => set('originalPrice', v)} placeholder="$299.00" />
        <FormField label="特價" value={data.salePrice} onChange={(v) => set('salePrice', v)} placeholder="$199.00" />
      </div>
      <ToggleField label="顯示標籤" value={data.showBadge} onChange={(v) => set('showBadge', v)} />
      {data.showBadge && (
        <FormField label="標籤文字" value={data.badgeText} onChange={(v) => set('badgeText', v)} placeholder="特賣 / 新品 / 熱銷" />
      )}

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">按鈕</p>
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即選購" />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />

      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">圖片</p>
      <ImageField label="商品主打圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.productBanner} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
        同 PC 視覺
      </button>
      <ImageField label="商品主打圖片（M）" value={data.mobileImage ?? ''} onChange={(v) => set('mobileImage', v)} spec={IMAGE_SPECS.productBannerMobile} />

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
