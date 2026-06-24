'use client';

import { HeroCarouselData, KvSlide } from '@/types/modules';
import { FormField, ColorField, ToggleField, SegmentedField, ImageField } from '@/components/ui/FormField';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { data: HeroCarouselData; onChange: (data: HeroCarouselData) => void }

export function HeroCarouselForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data.slides[0]?.id ?? null);

  const updateSlide = (id: string, field: keyof KvSlide, value: string | number | boolean) => {
    onChange({ ...data, slides: data.slides.map((s) => s.id === id ? { ...s, [field]: value } : s) });
  };

  const addSlide = () => {
    const newSlide: KvSlide = {
      id: generateId(),
      showText: true,
      image: '',
      mobileImage: '',
      title: '活動主視覺標題',
      subtitle: '用一句話說明活動利益點。',
      buttonText: '立即看優惠',
      buttonLink: '#',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.85)',
      textBgColor: '#1a1a2e',
      overlayOpacity: 0,
      alignment: 'left',
    };
    onChange({ ...data, slides: [...data.slides, newSlide] });
    setExpanded(newSlide.id);
  };

  const removeSlide = (id: string) => {
    onChange({ ...data, slides: data.slides.filter((s) => s.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <SegmentedField
        label="高度"
        value={data.height ?? 'medium'}
        options={[{ value: 'small', label: 'S' }, { value: 'medium', label: 'M' }, { value: 'large', label: 'L' }]}
        onChange={(v) => onChange({ ...data, height: v as HeroCarouselData['height'] })}
      />
      <ToggleField
        label="自動輪播"
        value={data.autoPlay ?? true}
        onChange={(v) => onChange({ ...data, autoPlay: v })}
      />
      <div className="h-px bg-slate-700/60" />

      {/* Slides */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">輪播項目（{data.slides.length}）</span>
          <button onClick={addSlide} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={13} /> 新增
          </button>
        </div>
        {data.slides.map((slide, idx) => (
          (() => {
            const showText = slide.showText !== false;
            const imageSpecs = getKvImageSpecs(data.height, showText);

            return (
          <div key={slide.id} className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === slide.id ? null : slide.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-sm text-slate-300 truncate">{slide.title || `第 ${idx + 1} 張`}</span>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                {expanded === slide.id ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
              </div>
            </button>
            {expanded === slide.id && (
              <div className="px-3 pb-3 border-t border-slate-700/60">
                <div className="pt-3 space-y-3">
                  <ImageField label={showText ? 'KV 圖片（PC 右側）' : 'KV 圖片（PC 整張）'} value={slide.image} onChange={(v) => updateSlide(slide.id, 'image', v)} spec={imageSpecs.desktop} />
                  <button type="button" onClick={() => updateSlide(slide.id, 'mobileImage', slide.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
                    同 PC 視覺
                  </button>
                  <ImageField label={showText ? 'KV 圖片（M 上方）' : 'KV 圖片（M 整張）'} value={slide.mobileImage ?? ''} onChange={(v) => updateSlide(slide.id, 'mobileImage', v)} spec={imageSpecs.mobile} />
                  <ToggleField label="顯示文字區" description="關閉後會成為純 Banner" value={slide.showText ?? true} onChange={(v) => updateSlide(slide.id, 'showText', v)} />
                  {showText && (
                    <>
                      <FormField label="標題" value={slide.title} onChange={(v) => updateSlide(slide.id, 'title', v)} placeholder="活動主視覺標題" />
                      <FormField label="副標題" value={slide.subtitle} onChange={(v) => updateSlide(slide.id, 'subtitle', v)} type="textarea" rows={2} placeholder="用一句話說明活動利益點" />
                      <FormField label="按鈕文字" value={slide.buttonText} onChange={(v) => updateSlide(slide.id, 'buttonText', v)} placeholder="立即看優惠" />
                      <SegmentedField
                        label="對齊"
                        value={slide.alignment ?? 'center'}
                        options={[{ value: 'left', label: '左' }, { value: 'center', label: '中' }, { value: 'right', label: '右' }]}
                        onChange={(v) => updateSlide(slide.id, 'alignment', v)}
                      />
                    </>
                  )}
                  <FormField label={showText ? '按鈕 / Banner 連結' : '整張 Banner 連結'} value={slide.buttonLink} onChange={(v) => updateSlide(slide.id, 'buttonLink', v)} type="url" placeholder="https://" />
                  <FormField
                    label="遮罩透明度 (%)"
                    value={String(slide.overlayOpacity ?? 40)}
                    onChange={(v) => updateSlide(slide.id, 'overlayOpacity', Math.min(100, Math.max(0, Number(v) || 0)))}
                    type="text"
                    placeholder="0–100"
                  />
                  <ColorField label="文字區塊底色" value={slide.textBgColor} onChange={(v) => updateSlide(slide.id, 'textBgColor', v)} placeholder="#1a1a2e" />
                  <div className="grid grid-cols-2 gap-3">
                    <ColorField label="標題色" value={slide.titleColor} onChange={(v) => updateSlide(slide.id, 'titleColor', v)} placeholder="#ffffff" />
                    <ColorField label="文字色" value={slide.textColor} onChange={(v) => updateSlide(slide.id, 'textColor', v)} placeholder="rgba(255,255,255,0.85)" />
                  </div>
                </div>
              </div>
            )}
          </div>
            );
          })()
        ))}
      </div>

      <div className="h-px bg-slate-700/60" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
