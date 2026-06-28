'use client';

import React, { useState } from 'react';
import { ModuleSchemaItem } from '@/types/modules';
import { EmailModuleSchemaItem } from '@/types/emailModules';
import { moduleSchemas } from '@/data/moduleSchemas';
import { emailModuleSchemas } from '@/data/emailModuleSchemas';
import { PageMode } from '@/app/page';
import {
  Layout, Columns2, Grid2X2, Image as ImageIcon,
  Megaphone, HelpCircle, Plus, Package, Star,
  Type, GalleryHorizontal, LayoutPanelLeft, Pin, FileText, FileImage,
  CreditCard, Tag, GalleryHorizontalEnd, ChevronDown, SlidersHorizontal,
  ListOrdered, BadgeCheck, ShoppingBag,
} from 'lucide-react';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';
import { GradientPickerPopover, ImageField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { colorSwatchStyle, isGradientValue } from '@/lib/styles/colorStyles';

const iconMap: Record<string, React.ReactNode> = {
  layout: <Layout size={18} />,
  columns: <Columns2 size={18} />,
  'columns-2': <Columns2 size={18} />,
  grid: <Grid2X2 size={18} />,
  package: <Package size={18} />,
  image: <ImageIcon size={18} />,
  megaphone: <Megaphone size={18} />,
  'help-circle': <HelpCircle size={18} />,
  type: <Type size={18} />,
  'gallery-horizontal': <GalleryHorizontal size={18} />,
  'gallery-horizontal-end': <GalleryHorizontalEnd size={18} />,
  'layout-panel-left': <LayoutPanelLeft size={18} />,
  pin: <Pin size={18} />,
  'file-text': <FileText size={18} />,
  'file-image': <FileImage size={18} />,
  'credit-card': <CreditCard size={18} />,
  tag: <Tag size={18} />,
  star: <Star size={18} />,
  'list-ordered': <ListOrdered size={18} />,
  'badge-check': <BadgeCheck size={18} />,
  'shopping-bag': <ShoppingBag size={18} />,
};

const campaignCategories = [
  { key: 'General', label: 'General', helper: '通用' },
  { key: 'Campaign', label: 'Campaign', helper: '活動頁' },
  { key: 'Product', label: 'Product', helper: '商品頁' },
  { key: 'Brand', label: 'Brand', helper: '品牌' },
];
const emailCategories = ['標題', '圖片', 'KV', '商品', '圖片帶商品', '活動', '銀行資訊', '文章', '折價券'];

// ── Color picker ─────────────────────────────────────────────────────────────
function ColorPicker({ label, value, onChange, allowEmpty, onReset }: {
  label: string; value: string; onChange: (v: string) => void;
  allowEmpty?: boolean; onReset?: () => void;
}) {
  const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
  const isGradient = isGradientValue(value);
  const defaultPreviewColor = label.includes('底色') ? '#ffffff' : label.includes('文字') ? '#ffffff' : '#6366f1';
  const swatchValue = value || defaultPreviewColor;
  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          {isHex && !isGradient && (
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          )}
          <div className="w-7 h-7 rounded-md border border-slate-600 overflow-hidden" style={colorSwatchStyle(swatchValue)}>
            {!value && allowEmpty && (
              <span className="flex h-full w-full items-center justify-center text-[9px] font-bold text-slate-700">預</span>
            )}
          </div>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={allowEmpty ? '無底色' : '#000000'} className="min-w-0 flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 placeholder-slate-600" />
        <GradientPickerPopover value={value} onChange={onChange} />
        {allowEmpty && value && <button onClick={() => onChange('')} className="text-xs text-slate-500 hover:text-slate-300 px-1" title="Clear">✕</button>}
        {!allowEmpty && onReset && <button onClick={onReset} className="text-xs text-slate-500 hover:text-slate-300 px-1" title="Reset">↺</button>}
      </div>
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────
function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-1 group"
      >
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</p>
        <ChevronDown size={12} className={`text-slate-600 group-hover:text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

interface Props {
  pageMode: PageMode;
  onAdd: (schema: ModuleSchemaItem) => void;
  onAddEmail: (schema: EmailModuleSchemaItem) => void;
}

export function ModuleLibrary({ pageMode, onAdd, onAddEmail }: Props) {
  const { buttonColor, buttonTextColor, setButtonColor, setButtonTextColor, pageBackgroundColor, setPageBackgroundColor, pageBackgroundImage, setPageBackgroundImage } = useGlobalSettings();
  const emailSettings = useEmailSettings();
  const [globalSettingsOpen, setGlobalSettingsOpen] = useState(false);

  const isEmail = pageMode === 'email';

  return (
    <aside className="nexora-editor-panel relative m-3 mr-0 flex h-[calc(100%-1.5rem)] min-h-0 w-64 flex-shrink-0 flex-col overflow-hidden rounded-2xl border">
      <div className="border-b border-white/10 px-4 py-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {isEmail ? '電子報模組' : '頁面模組'}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {isEmail ? (
          emailCategories.map((cat) => {
            const items = emailModuleSchemas.filter((s) => s.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest px-1 mb-2">{cat}</p>
                <div className="space-y-1">
                  {items.map((schema) => (
                    <button key={schema.key} onClick={() => onAddEmail(schema)} className="group grid h-16 w-full grid-cols-[2rem_1fr_0.875rem] items-center gap-3 rounded-xl border border-transparent px-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.07] active:bg-white/[0.10]">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-400 transition-colors group-hover:bg-amber-500/15 group-hover:text-amber-300">
                        {iconMap[schema.icon] ?? <Layout size={18} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 leading-tight">{schema.label}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{schema.description}</p>
                      </div>
                      <Plus size={14} className="flex-shrink-0 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          campaignCategories.map((cat) => {
            const items = moduleSchemas.filter((s) => s.category === cat.key);
            if (!items.length) return null;
            return (
              <div key={cat.key}>
                <div className="px-1 mb-2 flex items-baseline gap-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{cat.label}</p>
                  <span className="text-[11px] font-medium text-slate-600">{cat.helper}</span>
                </div>
                <div className="space-y-1">
                  {items.map((schema) => (
                    <button key={schema.key} onClick={() => onAdd(schema)} className="group grid h-16 w-full grid-cols-[2rem_1fr_0.875rem] items-center gap-3 rounded-xl border border-transparent px-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.07] active:bg-white/[0.10]">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-400 transition-colors group-hover:bg-indigo-500/15 group-hover:text-indigo-300">
                        {iconMap[schema.icon] ?? <Layout size={18} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 leading-tight">{schema.label}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{schema.description}</p>
                      </div>
                      <Plus size={14} className="flex-shrink-0 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Global settings */}
      <div className="flex-shrink-0 border-t border-white/10 bg-slate-950/30 px-3 py-3">
        {isEmail ? (
          <div className="max-h-72 space-y-3 overflow-y-auto px-1">
            <Section title="電子報設定">
              <ColorPicker label="信件背景色" value={emailSettings.backgroundColor} onChange={(v) => emailSettings.update({ backgroundColor: v })} />
              <ColorPicker label="內容底色" value={emailSettings.contentBgColor} onChange={(v) => emailSettings.update({ contentBgColor: v })} />
              <ColorPicker label="主色（按鈕）" value={emailSettings.primaryColor} onChange={(v) => emailSettings.update({ primaryColor: v })} onReset={() => emailSettings.update({ primaryColor: '#6366f1' })} />
            </Section>
            <div className="h-px bg-slate-700/60" />
            <Section title="追蹤碼" defaultOpen={false}>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">UTM 參數</p>
                <input
                  type="text"
                  value={emailSettings.utmString}
                  onChange={(e) => emailSettings.update({ utmString: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="utm_source=edm&utm_medium=skm_email&utm_campaign=0430"
                />
                <p className="text-xs text-slate-600 leading-relaxed">自動附加到所有連結後方</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Tracking Pixel HTML</p>
                <textarea value={emailSettings.trackingPixel} onChange={(e) => emailSettings.update({ trackingPixel: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 resize-none" placeholder='<img src="https://..." width="1" height="1">' />
              </div>
            </Section>
            <div className="h-px bg-slate-700/60" />
            <Section title="收件匣設定" defaultOpen={false}>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">預覽文字（收件匣顯示）</p>
                <input type="text" value={emailSettings.previewText} onChange={(e) => emailSettings.update({ previewText: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500" placeholder="本週精選優惠，最高折扣…" />
              </div>
            </Section>
          </div>
        ) : (
          <>
            {globalSettingsOpen && (
              <div className="nexora-glass-dark absolute bottom-16 left-3 right-3 z-30 max-h-[calc(100%-5rem)] overflow-y-auto rounded-2xl p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">全站設定</p>
                  <button
                    onClick={() => setGlobalSettingsOpen(false)}
                    className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                  >
                    關閉
                  </button>
                </div>
                <div className="space-y-3">
                  <ColorPicker label="底色" value={pageBackgroundColor} onChange={setPageBackgroundColor} allowEmpty />
                  <ImageField
                    label="背景圖（PC repeat-y）"
                    value={pageBackgroundImage}
                    onChange={setPageBackgroundImage}
                    spec={IMAGE_SPECS.pageBackground}
                    placeholder="https://… (圖片網址)"
                  />
                  <p className="-mt-1 text-[11px] leading-relaxed text-slate-600">
                    M 版使用同一張 PC 背景圖置中裁切，不需另外上傳。
                  </p>
                  <ColorPicker label="按鈕色" value={buttonColor} onChange={setButtonColor} onReset={() => setButtonColor('#6366f1')} />
                  <ColorPicker label="按鈕文字色" value={buttonTextColor} onChange={setButtonTextColor} onReset={() => setButtonTextColor('#ffffff')} />
                </div>
              </div>
            )}
            <button
              onClick={() => setGlobalSettingsOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/50 hover:bg-white/[0.10]"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-300" />
                全站設定
              </span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${globalSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
