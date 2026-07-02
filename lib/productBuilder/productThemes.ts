import {
  ProductBenefitsStyle,
  ProductComparisonStyle,
  ProductFeaturesStyle,
  ProductInfoStyle,
  ProductProofStyle,
  ProductPurchaseStyle,
  ProductScenesStyle,
  ProductShowcaseStyle,
  ProductStepsStyle,
} from '@/types/modules';

export type ProductPageTheme = 'freshClean' | 'luxury' | 'promo' | 'minimalCommerce';

export interface ProductThemePreset {
  eyebrow: string;
  heroBackground: string;
  sectionBackground: string;
  surface: string;
  softSurface: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  titleColor: string;
  textColor: string;
  accent: string;
  accentText: string;
  ctaBackground: string;
  heroTone: string;
  proofTone: string;
  purchaseTone: string;
  placeholderTone: 'fresh' | 'luxury' | 'promo' | 'commerce';
  darkSurface: string;
  darkTitle: string;
  darkText: string;
  showcaseStyle: ProductShowcaseStyle;
  benefitsStyle: ProductBenefitsStyle;
  featuresStyle: ProductFeaturesStyle;
  scenesStyle: ProductScenesStyle;
  infoStyle: ProductInfoStyle;
  stepsStyle: ProductStepsStyle;
  comparisonStyle: ProductComparisonStyle;
  proofStyle: ProductProofStyle;
  purchaseStyle: ProductPurchaseStyle;
}

export const productThemePresets: Record<ProductPageTheme, ProductThemePreset> = {
  freshClean: {
    eyebrow: 'Fresh Clean',
    heroBackground: 'linear-gradient(135deg, #e8f8ff 0%, #ffffff 44%, #d7f0f8 100%)',
    sectionBackground: '#f8fdff',
    surface: '#ffffff',
    softSurface: '#eefaff',
    cardBackground: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(239,250,255,0.76))',
    cardBorder: '1px solid rgba(14,165,198,0.14)',
    cardShadow: '0 22px 58px rgba(14,165,198,0.12)',
    titleColor: '#0f2f3f',
    textColor: '#4f6b78',
    accent: '#0ea5c6',
    accentText: '#ffffff',
    ctaBackground: '#0ea5c6',
    heroTone: '透亮藍白、柔光水感、商品去背圖置中放大',
    proofTone: '溫和安心、日常可用、清爽可信任',
    purchaseTone: '清楚導購、組合推薦、低壓轉換',
    placeholderTone: 'fresh',
    darkSurface: '#0f172a',
    darkTitle: '#ffffff',
    darkText: 'rgba(255,255,255,0.78)',
    showcaseStyle: 'spacious',
    benefitsStyle: 'metric-cards',
    featuresStyle: 'cards',
    scenesStyle: 'double-image',
    infoStyle: 'specs',
    stepsStyle: 'image-cards',
    comparisonStyle: 'before-after',
    proofStyle: 'certifications',
    purchaseStyle: 'bundle',
  },
  luxury: {
    eyebrow: 'Premium',
    heroBackground: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 45%, #f5f0ea 100%)',
    sectionBackground: '#fbfaf8',
    surface: '#ffffff',
    softSurface: '#f8f5f0',
    cardBackground: 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(248,245,240,0.68))',
    cardBorder: '1px solid rgba(47,42,37,0.12)',
    cardShadow: '0 26px 70px rgba(31,41,51,0.10)',
    titleColor: '#1f2933',
    textColor: '#667085',
    accent: '#2f2a25',
    accentText: '#ffffff',
    ctaBackground: '#2f2a25',
    heroTone: '低飽和精品留白、霧面玻璃文字卡、細框質感',
    proofTone: '品牌承諾、評價口碑、質感保證',
    purchaseTone: '單一精品 CTA、低干擾購買決策',
    placeholderTone: 'luxury',
    darkSurface: '#211d1a',
    darkTitle: '#ffffff',
    darkText: 'rgba(255,255,255,0.76)',
    showcaseStyle: 'luxury',
    benefitsStyle: 'stacked',
    featuresStyle: 'icon-text',
    scenesStyle: 'right-image',
    infoStyle: 'ingredients',
    stepsStyle: 'timeline',
    comparisonStyle: 'before-after',
    proofStyle: 'reviews',
    purchaseStyle: 'cta',
  },
  promo: {
    eyebrow: 'Limited Offer',
    heroBackground: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 42%, #fee2e2 100%)',
    sectionBackground: '#fff7ed',
    surface: '#ffffff',
    softSurface: '#fff7ed',
    cardBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,247,237,0.90))',
    cardBorder: '1px solid rgba(239,68,68,0.18)',
    cardShadow: '0 24px 66px rgba(239,68,68,0.16)',
    titleColor: '#7f1d1d',
    textColor: '#854d0e',
    accent: '#ef4444',
    accentText: '#ffffff',
    ctaBackground: '#ef4444',
    heroTone: '強促銷視覺、限時標籤、價格與 CTA 優先',
    proofTone: '折扣保證、檔期理由、立即購買信心',
    purchaseTone: '推薦組合、醒目按鈕、清楚價格感',
    placeholderTone: 'promo',
    darkSurface: '#111827',
    darkTitle: '#ffffff',
    darkText: 'rgba(255,255,255,0.80)',
    showcaseStyle: 'split',
    benefitsStyle: 'metric-cards',
    featuresStyle: 'grid-4',
    scenesStyle: 'full-bleed',
    infoStyle: 'contents',
    stepsStyle: 'numbered',
    comparisonStyle: 'product-table',
    proofStyle: 'guarantee',
    purchaseStyle: 'bundle',
  },
  minimalCommerce: {
    eyebrow: 'Commerce',
    heroBackground: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 56%, #eef2ff 100%)',
    sectionBackground: '#f8fafc',
    surface: '#ffffff',
    softSurface: '#f8fafc',
    cardBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))',
    cardBorder: '1px solid rgba(79,70,229,0.12)',
    cardShadow: '0 18px 48px rgba(79,70,229,0.10)',
    titleColor: '#111827',
    textColor: '#64748b',
    accent: '#4f46e5',
    accentText: '#ffffff',
    ctaBackground: '#4f46e5',
    heroTone: '白底電商、商品主圖突出、資訊規格化',
    proofTone: '規格、物流、評價與售後降低疑慮',
    purchaseTone: '四品推薦、清楚比較、快速加入購買路徑',
    placeholderTone: 'commerce',
    darkSurface: '#111827',
    darkTitle: '#ffffff',
    darkText: 'rgba(255,255,255,0.78)',
    showcaseStyle: 'split',
    benefitsStyle: 'pain-solution',
    featuresStyle: 'grid-6',
    scenesStyle: 'left-image',
    infoStyle: 'specs',
    stepsStyle: 'numbered',
    comparisonStyle: 'product-table',
    proofStyle: 'reviews',
    purchaseStyle: 'bundle',
  },
};

export const themeVisuals: Record<ProductPageTheme, string[]> = {
  freshClean: ['freshGlow', '透明感背景', '清爽商品光暈', '柔和藍白卡片'],
  luxury: ['luxuryFrame', '精品留白', '玻璃感文字卡', '低飽和質感'],
  promo: ['promoRibbon', '限時促購標', '高對比 CTA', '強轉換價格感'],
  minimalCommerce: ['commerceGrid', '白底商品突出', '規格化卡片', '電商清楚比較'],
};
