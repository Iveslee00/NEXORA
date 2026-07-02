'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Product,
  ProductBenefitItem,
  ProductBenefitsData,
  ProductComparisonData,
  ProductComparisonItem,
  ProductProofData,
  ProductProofItem,
  ProductPurchaseData,
  ProductStepItem,
  ProductStepsData,
} from '@/types/modules';
import { ColorSection, FormField, FormSection, ImageField, SegmentedField, ToggleField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { generateId } from '@/lib/utils';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

const benefitsStyleOptions = [
  { value: 'metric-cards', label: '數據卡' },
  { value: 'pain-solution', label: '痛點解法' },
  { value: 'stacked', label: '堆疊式' },
];

const stepsStyleOptions = [
  { value: 'numbered', label: '編號' },
  { value: 'timeline', label: '時間軸' },
  { value: 'image-cards', label: '圖卡' },
];

const comparisonStyleOptions = [
  { value: 'before-after', label: '前後對比' },
  { value: 'product-table', label: '表格比較' },
];

const comparisonStyleDescriptions: Record<ProductComparisonData['style'], string> = {
  'before-after': '前後對比：用一般商品與使用本商品做直覺比較，適合轉換型商品頁。',
  'product-table': '表格比較：適合多條件規格比較，文字較多時仍清楚。',
};

const proofStyleOptions = [
  { value: 'reviews', label: '評價' },
  { value: 'guarantee', label: '保證' },
  { value: 'certifications', label: '認證' },
];

const proofStyleDescriptions: Record<ProductProofData['style'], string> = {
  reviews: '評價：用星等與口碑卡呈現，適合社群回饋與使用者心得。',
  guarantee: '保證：用印章式信任卡呈現，適合退換貨、品質保證與服務承諾。',
  certifications: '認證：用證書格狀版呈現，適合標章、檢驗與第三方認證。',
};

const purchaseStyleOptions = [
  { value: 'cta', label: 'CTA' },
  { value: 'bundle', label: '推薦組合' },
  { value: 'related', label: '相關商品' },
];

const purchaseStyleDescriptions: Record<ProductPurchaseData['style'], string> = {
  cta: 'CTA：單一轉換區塊，適合頁尾收斂到購買、諮詢或領券。',
  bundle: '推薦組合：固定四品陳列，適合主推成套購買與加價帶購。',
  related: '相關商品：固定四品延伸推薦，用一致卡片引導繼續逛。',
};

function SectionHeadFields<T extends {
  eyebrow: string; title: string; subtitle: string; backgroundColor: string; titleColor: string; textColor: string;
}>({ data, onChange }: { data: T; onChange: (data: T) => void }) {
  const setString = (key: keyof T, value: string) => onChange({ ...data, [key]: value } as T);
  return (
    <>
      <FormSection title="內容" description="設定區塊標題、副標與說明。">
        <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => setString('eyebrow', v)} />
        <FormField label="標題" value={data.title} onChange={(v) => setString('title', v)} type="textarea" rows={2} />
        <FormField label="副標" value={data.subtitle} onChange={(v) => setString('subtitle', v)} type="textarea" rows={3} />
      </FormSection>
      <FormSection title="樣式" description="控制區塊底色、標題色與內文字色。">
        <ColorSection
          backgroundColor={data.backgroundColor}
          onBackgroundColorChange={(v) => setString('backgroundColor', v)}
          titleColor={data.titleColor}
          textColor={data.textColor}
          onTitleColorChange={(v) => setString('titleColor', v)}
          onTextColorChange={(v) => setString('textColor', v)}
        />
      </FormSection>
    </>
  );
}

export function ProductBenefitsForm({ data, onChange }: { data: ProductBenefitsData; onChange: (data: ProductBenefitsData) => void }) {
  const set = <K extends keyof ProductBenefitsData>(key: K, value: ProductBenefitsData[K]) => onChange({ ...data, [key]: value });
  const updateItem = (id: string, patch: Partial<ProductBenefitItem>) => set('items', data.items.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={benefitsStyleOptions} onChange={(v) => set('style', v as ProductBenefitsData['style'])} />
      <SectionHeadFields data={data} onChange={onChange} />
      <EditableItems title="賣點項目" onAdd={() => set('items', [...data.items, { id: generateId(), metric: 'NEW', title: '賣點標題', description: '補充賣點說明。' }])}>
        {data.items.map((item, index) => (
          <ItemCard key={item.id} title={`賣點 ${index + 1}`} canRemove={data.items.length > 1} onRemove={() => set('items', data.items.filter((next) => next.id !== item.id))}>
            <FormField label="指標" value={item.metric} onChange={(v) => updateItem(item.id, { metric: v })} />
            <FormField label="標題" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <FormField label="說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={3} />
          </ItemCard>
        ))}
      </EditableItems>
    </div>
  );
}

export function ProductStepsForm({ data, onChange }: { data: ProductStepsData; onChange: (data: ProductStepsData) => void }) {
  const set = <K extends keyof ProductStepsData>(key: K, value: ProductStepsData[K]) => onChange({ ...data, [key]: value });
  const updateItem = (id: string, patch: Partial<ProductStepItem>) => set('items', data.items.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={stepsStyleOptions} onChange={(v) => set('style', v as ProductStepsData['style'])} />
      <SectionHeadFields data={data} onChange={onChange} />
      <EditableItems title="步驟項目" onAdd={() => set('items', [...data.items, { id: generateId(), step: `${data.items.length + 1}`.padStart(2, '0'), title: '步驟標題', description: '補充步驟說明。', image: '', mobileImage: '' }])}>
        {data.items.map((item, index) => (
          <ItemCard key={item.id} title={`步驟 ${index + 1}`} canRemove={data.items.length > 1} onRemove={() => set('items', data.items.filter((next) => next.id !== item.id))}>
            <FormField label="步驟編號" value={item.step} onChange={(v) => updateItem(item.id, { step: v })} />
            <FormField label="標題" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <FormField label="說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={3} />
            <ImageField label="步驟圖片（PC）" value={item.image} onChange={(v) => updateItem(item.id, { image: v })} spec={IMAGE_SPECS.productScene} />
            <ImageField label="步驟圖片（M）" value={item.mobileImage} onChange={(v) => updateItem(item.id, { mobileImage: v })} spec={IMAGE_SPECS.productSceneMobile} />
          </ItemCard>
        ))}
      </EditableItems>
    </div>
  );
}

export function ProductComparisonForm({ data, onChange }: { data: ProductComparisonData; onChange: (data: ProductComparisonData) => void }) {
  const set = <K extends keyof ProductComparisonData>(key: K, value: ProductComparisonData[K]) => onChange({ ...data, [key]: value });
  const updateItem = (id: string, patch: Partial<ProductComparisonItem>) => set('items', data.items.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={comparisonStyleOptions} onChange={(v) => set('style', v as ProductComparisonData['style'])} />
      <p className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs leading-5 text-cyan-100/80">{comparisonStyleDescriptions[data.style]}</p>
      <SectionHeadFields data={data} onChange={onChange} />
      <div className="grid grid-cols-2 gap-2">
        <FormField label="左欄標題" value={data.beforeTitle} onChange={(v) => set('beforeTitle', v)} />
        <FormField label="右欄標題" value={data.afterTitle} onChange={(v) => set('afterTitle', v)} />
      </div>
      <EditableItems title="比較項目" onAdd={() => set('items', [...data.items, { id: generateId(), label: '比較項目', before: '一般狀態', after: '使用後狀態' }])}>
        {data.items.map((item, index) => (
          <ItemCard key={item.id} title={`比較 ${index + 1}`} canRemove={data.items.length > 1} onRemove={() => set('items', data.items.filter((next) => next.id !== item.id))}>
            <FormField label="項目" value={item.label} onChange={(v) => updateItem(item.id, { label: v })} />
            <FormField label="左欄內容" value={item.before} onChange={(v) => updateItem(item.id, { before: v })} />
            <FormField label="右欄內容" value={item.after} onChange={(v) => updateItem(item.id, { after: v })} />
          </ItemCard>
        ))}
      </EditableItems>
    </div>
  );
}

export function ProductProofForm({ data, onChange }: { data: ProductProofData; onChange: (data: ProductProofData) => void }) {
  const set = <K extends keyof ProductProofData>(key: K, value: ProductProofData[K]) => onChange({ ...data, [key]: value });
  const updateItem = (id: string, patch: Partial<ProductProofItem>) => set('items', data.items.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={proofStyleOptions} onChange={(v) => set('style', v as ProductProofData['style'])} />
      <p className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs leading-5 text-cyan-100/80">{proofStyleDescriptions[data.style]}</p>
      <SectionHeadFields data={data} onChange={onChange} />
      <EditableItems title="證明項目" onAdd={() => set('items', [...data.items, { id: generateId(), badge: 'NEW', title: '證明標題', description: '補充說明。' }])}>
        {data.items.map((item, index) => (
          <ItemCard key={item.id} title={`證明 ${index + 1}`} canRemove={data.items.length > 1} onRemove={() => set('items', data.items.filter((next) => next.id !== item.id))}>
            <FormField label="標章/分數" value={item.badge} onChange={(v) => updateItem(item.id, { badge: v })} />
            <FormField label="標題" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <FormField label="說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={3} />
          </ItemCard>
        ))}
      </EditableItems>
    </div>
  );
}

export function ProductPurchaseForm({ data, onChange }: { data: ProductPurchaseData; onChange: (data: ProductPurchaseData) => void }) {
  const [expanded, setExpanded] = useState<string | null>(data.products[0]?.id ?? null);
  const set = <K extends keyof ProductPurchaseData>(key: K, value: ProductPurchaseData[K]) => onChange({ ...data, [key]: value });
  const updateProduct = (id: string, field: keyof Product, value: string | boolean) => set('products', data.products.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const addProduct = () => {
    const product: Product = { id: generateId(), image: '', brand: '品牌名稱', name: '新商品', originalPrice: '$0.00', salePrice: '$0.00', link: '#', showBadge: false, badgeText: '新品', showSpecialTag: false, specialTag: '' };
    set('products', [...data.products, product]);
    setExpanded(product.id);
  };
  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={purchaseStyleOptions} onChange={(v) => set('style', v as ProductPurchaseData['style'])} />
      <p className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs leading-5 text-cyan-100/80">{purchaseStyleDescriptions[data.style]}</p>
      <SectionHeadFields data={data} onChange={onChange} />
      <FormSection title="行動" description="設定主要轉換按鈕。">
        <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} />
        <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" />
      </FormSection>
      <EditableItems title={`商品（${data.products.length}）`} onAdd={addProduct}>
        {data.products.map((product, index) => (
          <div key={product.id} className="overflow-hidden rounded-lg border border-slate-700">
            <button type="button" onClick={() => setExpanded(expanded === product.id ? null : product.id)} className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-slate-800/50">
              <span className="truncate text-sm text-slate-300">{product.name || `商品 ${index + 1}`}</span>
              <span className="flex items-center gap-2">
                {data.products.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); set('products', data.products.filter((item) => item.id !== product.id)); }} className="text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>}
                {expanded === product.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </span>
            </button>
            {expanded === product.id && (
              <div className="space-y-3 border-t border-slate-700/60 px-3 pb-3 pt-3">
                <FormField label="品牌" value={product.brand} onChange={(v) => updateProduct(product.id, 'brand', v)} />
                <FormField label="品名" value={product.name} onChange={(v) => updateProduct(product.id, 'name', v)} />
                <div className="grid grid-cols-2 gap-2">
                  <FormField label="原價" value={product.originalPrice} onChange={(v) => updateProduct(product.id, 'originalPrice', v)} />
                  <FormField label="特價" value={product.salePrice} onChange={(v) => updateProduct(product.id, 'salePrice', v)} />
                </div>
                <FormField label="連結" value={product.link} onChange={(v) => updateProduct(product.id, 'link', v)} type="url" />
                <ImageField label="商品圖片" value={product.image} onChange={(v) => updateProduct(product.id, 'image', v)} spec={IMAGE_SPECS.product} />
                <ToggleField label="顯示標籤" value={product.showBadge} onChange={(v) => updateProduct(product.id, 'showBadge', v)} />
                {product.showBadge && <FormField label="標籤文字" value={product.badgeText} onChange={(v) => updateProduct(product.id, 'badgeText', v)} />}
              </div>
            )}
          </div>
        ))}
      </EditableItems>
    </div>
  );
}

function EditableItems({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"><Plus size={13} />新增</button>
      </div>
      {children}
    </div>
  );
}

function ItemCard({ title, canRemove, onRemove, children }: { title: string; canRemove: boolean; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400">{title}</p>
        {canRemove && <button type="button" onClick={onRemove} className="text-xs text-slate-500 hover:text-red-300">刪除</button>}
      </div>
      {children}
    </div>
  );
}
