import { isLocalImageRef } from '@/lib/assets/localImageStore';
import type { GlobalSettings, PageModule, Product } from '@/types/modules';

export type ExportPreflightMode = 'cms' | 'zip' | 'cmb';
export type ExportPreflightSeverity = 'error' | 'warning' | 'suggestion';

export interface ExportPreflightIssue {
  id: string;
  severity: ExportPreflightSeverity;
  moduleId?: string;
  moduleType?: PageModule['type'] | 'global';
  title: string;
  message: string;
}

export interface ExportPreflightSummary {
  mode: ExportPreflightMode;
  issues: ExportPreflightIssue[];
  errors: ExportPreflightIssue[];
  warnings: ExportPreflightIssue[];
  suggestions: ExportPreflightIssue[];
  hasErrors: boolean;
}

export interface AnalyzeExportPreflightInput {
  modules: PageModule[];
  settings: GlobalSettings;
  mode: ExportPreflightMode;
}

interface ImageCheckOptions {
  module: PageModule;
  issues: ExportPreflightIssue[];
  mode: ExportPreflightMode;
  field: string;
  label: string;
  value?: string;
  required?: boolean;
  mobilePair?: boolean;
}

interface LinkCheckOptions {
  module: PageModule;
  issues: ExportPreflightIssue[];
  field: string;
  label: string;
  text?: string;
  link?: string;
}

const moduleLabels: Record<PageModule['type'], string> = {
  title: '標題區塊',
  hero: 'KV',
  'split-section': '圖文區塊',
  'product-grid': '商品列表',
  'banner-products': '活動 Banner + 商品',
  'product-banner': '單品主打',
  'product-carousel': '商品輪播',
  'logo-wall': '品牌 Logo 牆',
  cta: 'CTA',
  faq: 'FAQ',
  'sticky-sidebar': '黏人精',
  'article-text': '文章內容',
  'article-image': '文章搭配圖片',
  'hero-carousel': 'KV 輪播',
  'bank-promo': '信用卡優惠',
  'anchor-nav': '錨點導覽',
  'product-features': '商品特色',
  'product-showcase': '大圖展示',
  'product-scenes': '商品情境',
  'product-info': '商品資訊',
  'product-benefits': '核心賣點',
  'product-steps': '使用步驟',
  'product-comparison': '商品比較',
  'product-proof': '信任證明',
  'product-purchase': '購買與轉換',
};

const productModuleTypes = new Set<PageModule['type']>([
  'product-features',
  'product-showcase',
  'product-scenes',
  'product-info',
  'product-benefits',
  'product-steps',
  'product-comparison',
  'product-proof',
  'product-purchase',
]);

const campaignProductTypes = new Set<PageModule['type']>([
  'product-grid',
  'product-carousel',
  'banner-products',
  'product-banner',
]);

const isBlank = (value?: string) => !value || value.trim().length === 0;
const isPlaceholderLink = (value?: string) => {
  if (isBlank(value)) return false;
  const normalized = value?.trim();
  return normalized === '#' || normalized === 'javascript:void(0)' || normalized === 'javascript:;';
};

const moduleLabel = (module: PageModule) => moduleLabels[module.type] ?? module.type;

function pushIssue(
  issues: ExportPreflightIssue[],
  issue: Omit<ExportPreflightIssue, 'id'> & { id: string },
) {
  issues.push(issue);
}

function checkImage({ module, issues, mode, field, label, value, required = false, mobilePair = false }: ImageCheckOptions) {
  if (required && isBlank(value)) {
    pushIssue(issues, {
      id: `${module.id}:${field}:missing-image`,
      severity: 'error',
      moduleId: module.id,
      moduleType: module.type,
      title: '必填圖片尚未設定',
      message: `${moduleLabel(module)} 的「${label}」尚未設定。`,
    });
    return;
  }

  if (mobilePair && isBlank(value)) {
    pushIssue(issues, {
      id: `${module.id}:${field}:missing-mobile-image`,
      severity: 'warning',
      moduleId: module.id,
      moduleType: module.type,
      title: '手機圖尚未設定',
      message: `${moduleLabel(module)} 的「${label}」尚未設定，手機版可能會沿用 PC 圖或顯示不完整。`,
    });
    return;
  }

  if (mode === 'cms' && !isBlank(value) && isLocalImageRef(value)) {
    pushIssue(issues, {
      id: `${module.id}:${field}:local-image`,
      severity: 'error',
      moduleId: module.id,
      moduleType: module.type,
      title: 'CMS 貼碼請改用圖片網址',
      message: `${moduleLabel(module)} 的「${label}」目前是本機上傳圖。CMS 貼碼不會帶圖片檔，請改用圖片網址；ZIP 匯出可保留本機圖並放入 images/。`,
    });
  }
}

function checkGlobalImage(
  issues: ExportPreflightIssue[],
  settings: GlobalSettings,
  mode: ExportPreflightMode,
) {
  if (mode !== 'cms' || isBlank(settings.pageBackgroundImage) || !isLocalImageRef(settings.pageBackgroundImage)) {
    return;
  }

  pushIssue(issues, {
    id: 'global:pageBackgroundImage:local-image',
    severity: 'error',
    moduleType: 'global',
    title: 'CMS 貼碼請改用圖片網址',
    message: '全站背景圖目前是本機上傳圖。CMS 貼碼不會帶圖片檔，請改用圖片網址；ZIP 匯出可保留本機圖並放入 images/。',
  });
}

function checkLink({ module, issues, field, label, text, link }: LinkCheckOptions) {
  if (isBlank(text)) return;

  if (isBlank(link)) {
    pushIssue(issues, {
      id: `${module.id}:${field}:missing-link`,
      severity: 'error',
      moduleId: module.id,
      moduleType: module.type,
      title: '按鈕連結尚未設定',
      message: `${moduleLabel(module)} 的「${label}」有顯示按鈕文字，但連結尚未設定。`,
    });
    return;
  }

  if (isPlaceholderLink(link)) {
    pushIssue(issues, {
      id: `${module.id}:${field}:placeholder-link`,
      severity: 'warning',
      moduleId: module.id,
      moduleType: module.type,
      title: '連結仍為 #',
      message: `${moduleLabel(module)} 的「${label}」仍使用 placeholder 連結，正式匯出前建議改成實際網址或錨點。`,
    });
  }
}

function checkProduct(
  product: Product,
  module: PageModule,
  issues: ExportPreflightIssue[],
  mode: ExportPreflightMode,
  index: number,
) {
  const label = `商品 ${index + 1}`;

  checkImage({
    module,
    issues,
    mode,
    field: `products.${product.id}.image`,
    label: `${label} 圖片`,
    value: product.image,
    required: true,
  });

  if (isPlaceholderLink(product.link)) {
    pushIssue(issues, {
      id: `${module.id}:products.${product.id}.link:placeholder-link`,
      severity: 'warning',
      moduleId: module.id,
      moduleType: module.type,
      title: '連結仍為 #',
      message: `${moduleLabel(module)} 的「${label}」仍使用 placeholder 連結，正式匯出前建議改成實際商品連結。`,
    });
  }
}

function checkModule(module: PageModule, issues: ExportPreflightIssue[], mode: ExportPreflightMode) {
  switch (module.type) {
    case 'hero': {
      const { data } = module;
      checkImage({ module, issues, mode, field: 'image', label: 'PC 圖片', value: data.image, required: true });
      checkImage({ module, issues, mode, field: 'mobileImage', label: '手機圖片', value: data.mobileImage, mobilePair: true });
      checkLink({ module, issues, field: 'buttonLink', label: '按鈕連結', text: data.buttonText, link: data.buttonLink });
      break;
    }

    case 'hero-carousel':
      module.data.slides.forEach((slide, index) => {
        checkImage({ module, issues, mode, field: `slides.${slide.id}.image`, label: `第 ${index + 1} 張 PC 圖片`, value: slide.image, required: true });
        checkImage({ module, issues, mode, field: `slides.${slide.id}.mobileImage`, label: `第 ${index + 1} 張手機圖片`, value: slide.mobileImage, mobilePair: true });
        checkLink({ module, issues, field: `slides.${slide.id}.buttonLink`, label: `第 ${index + 1} 張按鈕連結`, text: slide.buttonText, link: slide.buttonLink });
      });
      break;

    case 'split-section':
    case 'article-image':
    case 'product-showcase': {
      const { data } = module;
      checkImage({ module, issues, mode, field: 'image', label: 'PC 圖片', value: data.image, required: true });
      checkImage({ module, issues, mode, field: 'mobileImage', label: '手機圖片', value: data.mobileImage, mobilePair: true });
      if ('buttonText' in data && 'buttonLink' in data) {
        checkLink({ module, issues, field: 'buttonLink', label: '按鈕連結', text: data.buttonText, link: data.buttonLink });
      }
      break;
    }

    case 'banner-products': {
      const { data } = module;
      checkImage({ module, issues, mode, field: 'bannerImage', label: 'PC Banner', value: data.bannerImage, required: true });
      checkImage({ module, issues, mode, field: 'mobileBannerImage', label: '手機 Banner', value: data.mobileBannerImage, mobilePair: true });
      if (data.bannerLink) {
        checkLink({ module, issues, field: 'bannerLink', label: 'Banner 連結', text: 'Banner', link: data.bannerLink });
      }
      data.products.forEach((product, index) => checkProduct(product, module, issues, mode, index));
      break;
    }

    case 'product-banner': {
      const { data } = module;
      checkImage({ module, issues, mode, field: 'image', label: 'PC 圖片', value: data.image, required: true });
      checkImage({ module, issues, mode, field: 'mobileImage', label: '手機圖片', value: data.mobileImage, mobilePair: true });
      checkLink({ module, issues, field: 'buttonLink', label: '按鈕連結', text: data.buttonText, link: data.buttonLink });
      break;
    }

    case 'product-grid':
    case 'product-carousel':
      module.data.products.forEach((product, index) => checkProduct(product, module, issues, mode, index));
      break;

    case 'logo-wall':
      module.data.logos.forEach((logo, index) => {
        checkImage({ module, issues, mode, field: `logos.${logo.id}.image`, label: `Logo ${index + 1}`, value: logo.image, required: true });
        if (isPlaceholderLink(logo.link)) {
          pushIssue(issues, {
            id: `${module.id}:logos.${logo.id}.link:placeholder-link`,
            severity: 'warning',
            moduleId: module.id,
            moduleType: module.type,
            title: '連結仍為 #',
            message: `${moduleLabel(module)} 的 Logo ${index + 1} 仍使用 placeholder 連結。`,
          });
        }
      });
      break;

    case 'cta':
      checkLink({ module, issues, field: 'buttonLink', label: '按鈕連結', text: module.data.buttonText, link: module.data.buttonLink });
      break;

    case 'bank-promo':
      module.data.items.forEach((item, index) => {
        checkImage({ module, issues, mode, field: `items.${item.id}.logo`, label: `信用卡 Logo ${index + 1}`, value: item.logo });
      });
      if (module.data.linkText) {
        checkLink({ module, issues, field: 'linkUrl', label: '優惠連結', text: module.data.linkText, link: module.data.linkUrl });
      }
      break;

    case 'sticky-sidebar':
      module.data.items.forEach((item, index) => {
        if (isPlaceholderLink(item.link)) {
          pushIssue(issues, {
            id: `${module.id}:items.${item.id}.link:placeholder-link`,
            severity: 'warning',
            moduleId: module.id,
            moduleType: module.type,
            title: '連結仍為 #',
            message: `${moduleLabel(module)} 的第 ${index + 1} 顆按鈕仍使用 placeholder 連結。`,
          });
        }
      });
      break;

    case 'product-scenes':
      module.data.items.forEach((item, index) => {
        checkImage({ module, issues, mode, field: `items.${item.id}.image`, label: `情境圖 ${index + 1} PC`, value: item.image, required: true });
        checkImage({ module, issues, mode, field: `items.${item.id}.mobileImage`, label: `情境圖 ${index + 1} 手機`, value: item.mobileImage, mobilePair: true });
      });
      break;

    case 'product-steps':
      module.data.items.forEach((item, index) => {
        checkImage({ module, issues, mode, field: `items.${item.id}.image`, label: `步驟圖 ${index + 1} PC`, value: item.image });
        checkImage({ module, issues, mode, field: `items.${item.id}.mobileImage`, label: `步驟圖 ${index + 1} 手機`, value: item.mobileImage, mobilePair: !isBlank(item.image) });
      });
      break;

    case 'product-purchase':
      checkLink({ module, issues, field: 'buttonLink', label: '購買按鈕連結', text: module.data.buttonText, link: module.data.buttonLink });
      module.data.products.forEach((product, index) => checkProduct(product, module, issues, mode, index));
      break;

    default:
      break;
  }
}

function checkAnchors(modules: PageModule[], issues: ExportPreflightIssue[]) {
  const availableTargetIds = new Set(
    modules
      .filter((module) => module.type !== 'anchor-nav' && 'anchorName' in module.data && !isBlank(module.data.anchorName))
      .map((module) => module.id),
  );

  modules
    .filter((module): module is Extract<PageModule, { type: 'anchor-nav' }> => module.type === 'anchor-nav')
    .forEach((module) => {
      module.data.hiddenTargetIds.forEach((targetId) => {
        if (!modules.some((target) => target.id === targetId)) {
          pushIssue(issues, {
            id: `${module.id}:hiddenTargetIds.${targetId}:missing-anchor-target`,
            severity: 'warning',
            moduleId: module.id,
            moduleType: module.type,
            title: '錨點目標不存在',
            message: `錨點導覽設定中包含已不存在的模組目標「${targetId}」。`,
          });
        }
      });

      if (availableTargetIds.size === 0) {
        pushIssue(issues, {
          id: `${module.id}:anchor-targets:empty`,
          severity: 'warning',
          moduleId: module.id,
          moduleType: module.type,
          title: '錨點目標不存在',
          message: '目前沒有任何模組設定錨點名稱，錨點導覽不會產生可跳轉按鈕。',
        });
      }
    });
}

function checkPageSuggestions(modules: PageModule[], issues: ExportPreflightIssue[]) {
  const hasAnchorNav = modules.some((module) => module.type === 'anchor-nav');
  const hasProductPageModule = modules.some((module) => productModuleTypes.has(module.type));
  const hasCampaignProductModule = modules.some((module) => campaignProductTypes.has(module.type));
  const hasPurchase = modules.some((module) => module.type === 'product-purchase');

  if (modules.length >= 5 && !hasAnchorNav) {
    pushIssue(issues, {
      id: 'page:anchor-nav:suggestion',
      severity: 'suggestion',
      title: '長頁建議加入錨點導覽',
      message: '目前頁面模組較多，建議加入錨點導覽，讓使用者能快速跳到主要區塊。',
    });
  }

  if (hasProductPageModule && !hasPurchase) {
    pushIssue(issues, {
      id: 'page:product-purchase:suggestion',
      severity: 'suggestion',
      title: '商品頁建議加入購買轉換',
      message: '目前已有商品頁內容模組，但缺少購買與轉換區塊，建議補上 CTA 或推薦組合。',
    });
  }

  if (!hasProductPageModule && !hasCampaignProductModule) {
    pushIssue(issues, {
      id: 'page:product-area:suggestion',
      severity: 'suggestion',
      title: '活動頁建議加入商品區',
      message: '目前頁面尚未加入商品列表、商品輪播或商品頁模組，若為銷售頁建議補上商品區。',
    });
  }
}

export function analyzeExportPreflight({
  modules,
  settings,
  mode,
}: AnalyzeExportPreflightInput): ExportPreflightSummary {
  const issues: ExportPreflightIssue[] = [];

  checkGlobalImage(issues, settings, mode);
  modules.forEach((module) => checkModule(module, issues, mode));
  checkAnchors(modules, issues);
  checkPageSuggestions(modules, issues);

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const suggestions = issues.filter((issue) => issue.severity === 'suggestion');

  return {
    mode,
    issues,
    errors,
    warnings,
    suggestions,
    hasErrors: errors.length > 0,
  };
}
