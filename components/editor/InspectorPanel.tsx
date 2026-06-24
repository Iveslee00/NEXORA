'use client';

import { PageModule } from '@/types/modules';
import { EmailPageModule } from '@/types/emailModules';
import { FormRenderer } from '@/modules/forms/FormRenderer';
import { EmailFormRenderer } from '@/modules/email/forms/EmailFormRenderer';
import { MousePointerClick } from 'lucide-react';
import { PageMode } from '@/app/page';
import { getBannerProductsLayoutLabel } from '@/lib/modules/bannerProducts';

const moduleLabels: Record<string, string> = {
  'title': '標題區塊', 'hero': 'KV', 'split-section': '圖文區塊',
  'product-grid': '商品列表', 'banner-products': '活動 Banner + 商品',
  'product-banner': '單品主打', 'product-carousel': '商品輪播',
  'logo-wall': '品牌 Logo 牆', 'cta': '行動呼籲', 'faq': 'FAQ',
  'sticky-sidebar': '浮動工具列', 'article-text': '文章內容',
  'article-image': '文章搭配圖片', 'hero-carousel': 'KV 輪播', 'bank-promo': '銀行優惠',
  'anchor-nav': '錨點導覽',
  'email-title': '標題', 'email-image': '純圖片', 'email-promo': '活動區塊',
  'email-kv': 'KV 主視覺', 'email-products': '商品', 'email-image-products': '圖片帶商品',
  'email-bank-info': '銀行資訊', 'email-article': '文章', 'email-coupon': '折價券',
};

const moduleColors: Record<string, string> = {
  'title': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  'hero': 'bg-violet-600/20 text-violet-400 border-violet-600/30',
  'split-section': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'product-grid': 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  'banner-products': 'bg-teal-600/20 text-teal-400 border-teal-600/30',
  'product-banner': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'product-carousel': 'bg-green-600/20 text-green-400 border-green-600/30',
  'logo-wall': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  'cta': 'bg-rose-600/20 text-rose-400 border-rose-600/30',
  'faq': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
  'sticky-sidebar': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'article-text': 'bg-sky-600/20 text-sky-400 border-sky-600/30',
  'article-image': 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
  'hero-carousel': 'bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-600/30',
  'bank-promo': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  'anchor-nav': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
  // email
  'email-title': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  'email-image': 'bg-violet-600/20 text-violet-400 border-violet-600/30',
  'email-promo': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'email-kv': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  'email-products': 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  'email-image-products': 'bg-teal-600/20 text-teal-400 border-teal-600/30',
  'email-bank-info': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  'email-article': 'bg-sky-600/20 text-sky-400 border-sky-600/30',
  'email-coupon': 'bg-rose-600/20 text-rose-400 border-rose-600/30',
};

interface Props {
  pageMode: PageMode;
  module: PageModule | null;
  modules: PageModule[];
  onChange: (data: PageModule['data']) => void;
  emailModule: EmailPageModule | null;
  onEmailChange: (data: EmailPageModule['data']) => void;
}

export function InspectorPanel({ pageMode, module, modules, onChange, emailModule, onEmailChange }: Props) {
  const isEmail = pageMode === 'email';
  const activeModule = isEmail ? emailModule : module;

  if (!activeModule) {
    return (
      <aside className="flex h-full min-h-0 w-72 flex-shrink-0 items-center justify-center border-l border-slate-800 bg-slate-900">
        <div className="text-center px-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mx-auto">
            <MousePointerClick size={18} className="text-slate-500" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">尚未選取模組</p>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">點擊模組來編輯內容<br/>全站設定請見左下角</p>
          </div>
        </div>
      </aside>
    );
  }

  const label = !isEmail && module?.type === 'banner-products'
    ? getBannerProductsLayoutLabel(module.data)
    : moduleLabels[activeModule.type] ?? activeModule.type;
  const colorClass = moduleColors[activeModule.type] ?? 'bg-slate-700 text-slate-300 border-slate-600';

  return (
    <aside className="flex h-full min-h-0 w-72 flex-shrink-0 flex-col overflow-hidden border-l border-slate-800 bg-slate-900">
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colorClass}`}>
          {label}
        </span>
        <span className="text-xs text-slate-500">設定</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {isEmail
          ? <EmailFormRenderer module={emailModule!} onChange={onEmailChange} />
          : <FormRenderer module={module!} modules={modules} onChange={onChange} />
        }
      </div>
    </aside>
  );
}
