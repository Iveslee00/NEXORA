'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { ImagePlus, PackagePlus, Sparkles, X } from 'lucide-react';
import {
  ProductBuilderInput,
  ProductGoal,
  ProductIndustry,
  ProductPageLength,
  ProductPageTheme,
  defaultInputForIndustry,
  defaultProductBuilderInput,
  moduleLabels,
  resolveProductPageRecipe,
} from '@/lib/productBuilder/productPageBuilder';
import { themeVisuals } from '@/lib/productBuilder/productThemes';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl, storeLocalImage } from '@/lib/assets/localImageStore';

interface ProductBuildModalProps {
  onClose: () => void;
  onCreate: (input: ProductBuilderInput) => void;
}

type SelectOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

const industries: Array<SelectOption<ProductIndustry>> = [
  { value: 'cleaning', label: '清潔用品', description: '洗衣精、清潔劑、除菌噴霧、居家用品' },
  { value: 'beauty', label: '美妝保養', description: '保養品、彩妝、面膜、洗沐保養' },
  { value: 'ecommerce', label: '電商綜合', description: '多線別商品、生活用品、一般電商商品' },
];

const goals: Array<SelectOption<ProductGoal>> = [
  { value: 'sales', label: '爆品銷售', description: '強化價格、賣點、購買 CTA' },
  { value: 'launch', label: '新品上市', description: '強化形象、特色、信任感' },
  { value: 'comparison', label: '比較說服', description: '強化差異、比較、購買理由' },
  { value: 'scenario', label: '情境導購', description: '強化場景、用途、適用對象' },
];

const themes: Array<SelectOption<ProductPageTheme>> = [
  { value: 'freshClean', label: '清爽潔淨', description: '藍白、透明感、適合生活與清潔用品' },
  { value: 'luxury', label: '高級精品', description: '低飽和、留白、適合高單價商品' },
  { value: 'promo', label: '強促銷', description: '高對比、促購感、適合檔期活動' },
  { value: 'minimalCommerce', label: '極簡電商', description: '白底商品突出，適合多線別商品' },
];

const lengths: Array<SelectOption<ProductPageLength>> = [
  { value: 'quick', label: '快速版', description: '約 5-6 個模組，快速上架' },
  { value: 'standard', label: '標準版', description: '約 8-9 個模組，一般商品頁' },
  { value: 'complete', label: '完整版', description: '約 10-12 個模組，完整說服' },
];

const industrySwitchPolicy = {
  title: '切換產業會套用該產業範例文案',
  description: '已輸入的價格、CTA 與圖片會保留；品牌、品名、分類、主標、副標、賣點與詳情會換成該產業範例，方便快速起稿。',
  preserved: '保留價格、CTA 與圖片',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function OptionGrid<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="mb-3 text-sm font-black text-slate-200">{label}</p>
      <div className="grid gap-2 md:grid-cols-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-xl border p-3 text-left transition-all ${
                active
                  ? 'border-indigo-300 bg-indigo-500/20 text-white shadow-[0_16px_40px_rgba(79,70,229,0.25)]'
                  : 'border-white/10 bg-slate-950/30 text-slate-300 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="block text-sm font-black">{option.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-slate-400">{option.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function inputClass() {
  return 'h-11 w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none transition-colors focus:border-indigo-300';
}

function textareaClass() {
  return 'w-full resize-none rounded-xl border border-white/10 bg-slate-950/45 px-3 py-3 text-sm font-semibold leading-6 text-white outline-none transition-colors focus:border-indigo-300';
}

export function ProductBuildModal({ onClose, onCreate }: ProductBuildModalProps) {
  const [input, setInput] = useState<ProductBuilderInput>(() => defaultProductBuilderInput());
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState('');

  const update = <K extends keyof ProductBuilderInput>(key: K, value: ProductBuilderInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const changeIndustry = (industry: ProductIndustry) => {
    const next = defaultInputForIndustry(industry);
    setInput((prev) => {
      const preservedProductFields = {
        goal: prev.goal,
        pageLength: prev.pageLength,
        originalPrice: prev.originalPrice,
        salePrice: prev.salePrice,
        ctaText: prev.ctaText,
        ctaLink: prev.ctaLink,
        mainImage: prev.mainImage,
        mobileImage: prev.mobileImage,
        backgroundImage: prev.backgroundImage,
      };
      return {
        ...next,
        ...preservedProductFields,
      };
    });
  };

  const handleImage = async (key: 'mainImage' | 'mobileImage' | 'backgroundImage', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(key);
    try {
      const stored = await storeLocalImage(file);
      update(key, stored.ref);
    } finally {
      setUploading('');
      event.target.value = '';
    }
  };

  useEffect(() => {
    let alive = true;
    const objectUrls: string[] = [];

    const resolveImages = async () => {
      const next: Record<string, string> = {};
      for (const key of ['mainImage', 'mobileImage', 'backgroundImage'] as const) {
        const value = input[key];
        if (!value) continue;
        if (!isLocalImageRef(value)) {
          next[key] = value;
          continue;
        }
        const resolved = await resolveLocalImageUrl(value);
        if (resolved) {
          objectUrls.push(resolved);
          next[key] = resolved;
        }
      }
      if (alive) setPreviewImages(next);
    };

    void resolveImages();

    return () => {
      alive = false;
      objectUrls.forEach(revokeResolvedLocalImageUrl);
    };
  }, [input.mainImage, input.mobileImage, input.backgroundImage]);

  const selectedIndustry = industries.find((item) => item.value === input.industry);
  const selectedGoal = goals.find((item) => item.value === input.goal);
  const selectedTheme = themes.find((item) => item.value === input.theme);
  const selectedLength = lengths.find((item) => item.value === input.pageLength);
  const recipePreview = resolveProductPageRecipe(input);
  const visualTags = themeVisuals[input.theme];
  const missingRequiredHints = [
    !input.productName.trim() ? '缺少品名' : '',
    !input.headline.trim() ? '缺少主標' : '',
    !(input.mainImage || input.backgroundImage) ? '缺少商品主圖或背景圖' : '',
    !input.ctaLink.trim() || input.ctaLink.trim() === '#' ? '缺少 CTA 連結' : '',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-400/10 px-3 py-1 text-xs font-black text-indigo-200">
              <Sparkles size={14} />
              Product Page Starter
            </div>
            <h2 className="text-2xl font-black text-white">從商品建立</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              先選產業、頁面目的、視覺主題與長度，再把商品資料轉成可編輯的 NEXORA Builder 模組。
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 p-6">
            <OptionGrid label="產業 / 線別" value={input.industry} options={industries} onChange={changeIndustry} />
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3">
              <p className="text-sm font-black text-cyan-100">{industrySwitchPolicy.title}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-cyan-100/70">{industrySwitchPolicy.description}</p>
              <span className="mt-2 inline-flex rounded-full bg-cyan-300/15 px-3 py-1 text-[11px] font-black text-cyan-100">
                {industrySwitchPolicy.preserved}
              </span>
            </div>
            <OptionGrid label="商品頁目的" value={input.goal} options={goals} onChange={(value) => update('goal', value)} />
            <OptionGrid label="視覺主題" value={input.theme} options={themes} onChange={(value) => update('theme', value)} />
            <OptionGrid label="頁面長度" value={input.pageLength} options={lengths} onChange={(value) => update('pageLength', value)} />

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-4 text-sm font-black text-slate-200">商品基本資料</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="品牌">
                  <input value={input.brand} onChange={(event) => update('brand', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="品名">
                  <input value={input.productName} onChange={(event) => update('productName', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="商品分類">
                  <input value={input.category} onChange={(event) => update('category', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="CTA 連結">
                  <input value={input.ctaLink} onChange={(event) => update('ctaLink', event.target.value)} className={inputClass()} placeholder="https://..." />
                </Field>
                <Field label="原價">
                  <input value={input.originalPrice} onChange={(event) => update('originalPrice', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="特價">
                  <input value={input.salePrice} onChange={(event) => update('salePrice', event.target.value)} className={inputClass()} />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-4 text-sm font-black text-slate-200">頁面文案</p>
              <div className="space-y-4">
                <Field label="主標">
                  <input value={input.headline} onChange={(event) => update('headline', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="副標">
                  <input value={input.subtitle} onChange={(event) => update('subtitle', event.target.value)} className={inputClass()} />
                </Field>
                <Field label="商品說明">
                  <textarea value={input.description} onChange={(event) => update('description', event.target.value)} rows={3} className={textareaClass()} />
                </Field>
                <Field label="商品詳情">
                  <textarea value={input.details} onChange={(event) => update('details', event.target.value)} rows={4} className={textareaClass()} />
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-5 border-t border-white/10 bg-slate-950/35 p-6 lg:border-l lg:border-t-0">
            <section className="rounded-2xl border border-indigo-300/20 bg-[linear-gradient(135deg,rgba(99,102,241,0.20),rgba(14,165,198,0.10))] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-200">Recipe Preview</p>
              <h3 className="mt-2 text-2xl font-black">
                {selectedIndustry?.label} / {selectedGoal?.label}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                {selectedTheme?.label}，{selectedLength?.label}。產生後會回到同一個畫布，可繼續拖拉、改色、換圖與匯出。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-300">
                <span className="rounded-lg bg-white/10 px-3 py-2">{selectedIndustry?.description}</span>
                <span className="rounded-lg bg-white/10 px-3 py-2">{selectedGoal?.description}</span>
                <span className="rounded-lg bg-white/10 px-3 py-2">{selectedTheme?.description}</span>
                <span className="rounded-lg bg-white/10 px-3 py-2">{selectedLength?.description}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-200">即將產生的頁面結構</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    預估產生 {recipePreview.modules.length} 個模組，建立後可在畫布自由增減。
                  </p>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-black text-indigo-200">
                  {selectedLength?.label}
                </span>
              </div>
              <div className="space-y-2">
                {recipePreview.modules.map((moduleType, index) => (
                  <div key={`${moduleType}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-black text-indigo-200">
                      {`${index + 1}`.padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-slate-200">{moduleLabels[moduleType]}</span>
                    <span className="ml-auto text-[11px] font-semibold text-slate-600">{moduleType}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {visualTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-4 text-sm font-black text-slate-200">圖片素材</p>
              <div className="space-y-3">
                {[
                  ['mainImage', '商品主圖', '1000 x 1000 去背 PNG'] as const,
                  ['mobileImage', 'M 版商品圖', '建議 750 x 850'] as const,
                  ['backgroundImage', 'KV / 情境背景圖', '建議 1920 x 640'] as const,
                ].map(([key, label, hint]) => (
                  <div key={key} className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-200">{label}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{hint}</p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-indigo-400">
                        <ImagePlus size={14} />
                        {uploading === key ? '上傳中' : '上傳'}
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(key, event)} />
                      </label>
                    </div>
                    {input[key] && (
                      <div className="mt-3 h-24 overflow-hidden rounded-lg bg-slate-800">
                        <img src={previewImages[key] || ''} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-4 text-sm font-black text-slate-200">賣點、情境與信任資訊</p>
              <div className="grid gap-3">
                <input value={input.benefitOne} onChange={(event) => update('benefitOne', event.target.value)} className={inputClass()} placeholder="核心賣點 1" />
                <input value={input.benefitTwo} onChange={(event) => update('benefitTwo', event.target.value)} className={inputClass()} placeholder="核心賣點 2" />
                <input value={input.benefitThree} onChange={(event) => update('benefitThree', event.target.value)} className={inputClass()} placeholder="核心賣點 3" />
                <input value={input.scenarioOne} onChange={(event) => update('scenarioOne', event.target.value)} className={inputClass()} placeholder="使用情境 1" />
                <input value={input.scenarioTwo} onChange={(event) => update('scenarioTwo', event.target.value)} className={inputClass()} placeholder="使用情境 2" />
                <input value={input.proofOne} onChange={(event) => update('proofOne', event.target.value)} className={inputClass()} placeholder="信任證明 1" />
                <input value={input.proofTwo} onChange={(event) => update('proofTwo', event.target.value)} className={inputClass()} placeholder="信任證明 2" />
                <input value={input.ctaText} onChange={(event) => update('ctaText', event.target.value)} className={inputClass()} placeholder="CTA 文字" />
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-500">
              產生的是既有模組組合，不是鎖死模板；後續仍可增減 General、Campaign、Product 模組。
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {missingRequiredHints.length > 0 ? (
                missingRequiredHints.map((hint) => (
                  <span key={hint} className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-100">
                    {hint}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
                  資料已足夠，可建立商品頁
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onCreate(input)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-500 px-6 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            <PackagePlus size={18} />
            建立商品頁
          </button>
        </div>
      </div>
    </div>
  );
}
