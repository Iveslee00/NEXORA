import { PageModule, Product } from '@/types/modules';
import { generateId } from '@/lib/utils';
import { productThemePresets, themeVisuals } from './productThemes';
import type { ProductPageTheme } from './productThemes';

export type ProductIndustry = 'cleaning' | 'beauty' | 'ecommerce' | 'food' | 'electronics' | 'fashion';
export type ProductGoal = 'sales' | 'launch' | 'comparison' | 'scenario';
export type { ProductPageTheme } from './productThemes';
export type ProductPageLength = 'quick' | 'standard' | 'complete';

type ProductModuleType =
  | 'hero'
  | 'anchor-nav'
  | 'product-showcase'
  | 'product-benefits'
  | 'product-features'
  | 'product-scenes'
  | 'product-info'
  | 'product-steps'
  | 'product-comparison'
  | 'product-proof'
  | 'faq'
  | 'product-purchase';

export interface ProductBuilderInput {
  industry: ProductIndustry;
  goal: ProductGoal;
  pageLength: ProductPageLength;
  productName: string;
  brand: string;
  category: string;
  headline: string;
  subtitle: string;
  description: string;
  details: string;
  originalPrice: string;
  salePrice: string;
  ctaText: string;
  ctaLink: string;
  mainImage: string;
  mobileImage: string;
  backgroundImage: string;
  benefitOne: string;
  benefitTwo: string;
  benefitThree: string;
  scenarioOne: string;
  scenarioTwo: string;
  proofOne: string;
  proofTwo: string;
  theme: ProductPageTheme;
}

export interface ProductPageRecipe {
  modules: ProductModuleType[];
  emphasis: string;
  visualTags: string[];
}

export const moduleLabels: Record<ProductModuleType, string> = {
  hero: '商品 KV',
  'anchor-nav': '錨點導覽',
  'product-showcase': '商品展示',
  'product-benefits': '核心賣點',
  'product-features': '商品特色',
  'product-scenes': '商品情境',
  'product-info': '商品資訊',
  'product-steps': '使用步驟',
  'product-comparison': '商品比較',
  'product-proof': '信任證明',
  faq: '商品 FAQ',
  'product-purchase': '購買 CTA',
};

const industryCopy: Record<ProductIndustry, {
  label: string;
  tag: string;
  defaultProduct: string;
  defaultBrand: string;
  defaultCategory: string;
  headline: string;
  subtitle: string;
  description: string;
  details: string;
  benefits: [string, string, string];
  scenarios: [string, string];
  proof: [string, string];
  faq: Array<{ question: string; answer: string }>;
}> = {
  cleaning: {
    label: '清潔用品',
    tag: '清潔用品',
    defaultProduct: '高效植萃洗衣精',
    defaultBrand: 'NEXORA CLEAN',
    defaultCategory: '居家清潔',
    headline: '讓日常清潔變得更輕鬆',
    subtitle: '溫和配方、強效去污，適合全家每日使用。',
    description: '以清爽潔淨感為核心，主打衣物、居家與日常使用場景。',
    details: '容量：1.8L\n香調：清新皂香\n適用：日常衣物、毛巾、寢具\n特色：低泡易沖洗、溫和不刺鼻、瓶身好握好倒。',
    benefits: ['強效去污', '溫和不刺鼻', '清爽留香'],
    scenarios: ['每日衣物清潔', '寢具毛巾深層洗淨'],
    proof: ['低泡易沖洗', '全家日常適用'],
    faq: [
      { question: '這款清潔用品適合每天使用嗎？', answer: '適合日常清潔使用。可依照實際商品配方補充適用材質、衣物類型或居家場景。' },
      { question: '味道會不會太刺激？', answer: '可在這裡說明香調、是否低刺激、是否有植萃或溫和配方等資訊。' },
      { question: '優惠活動到什麼時候？', answer: '請依照實際檔期填寫，若售完或活動調整，以頁面與購物車顯示為準。' },
    ],
  },
  beauty: {
    label: '美妝保養',
    tag: '美妝保養',
    defaultProduct: '水光修護精華',
    defaultBrand: 'NEXORA BEAUTY',
    defaultCategory: '保養品',
    headline: '把日常保養升級成穩定透亮',
    subtitle: '針對乾燥、暗沉與膚況不穩，建立簡單有效的保養節奏。',
    description: '以成分、膚感與使用週期建立信任，適合精華、乳霜、面膜與保養組合。',
    details: '容量：30ml\n適用：乾燥、暗沉、一般膚質\n使用：化妝水後、乳霜前\n特色：清爽吸收、保濕修護、日夜皆可使用。',
    benefits: ['長效保濕', '穩定修護', '清爽吸收'],
    scenarios: ['妝前快速補水', '夜間修護保養'],
    proof: ['成分安心', '使用感清爽'],
    faq: [
      { question: '敏感肌可以使用嗎？', answer: '請依照實際商品檢測、成分與使用建議補充。初次使用建議先做局部測試。' },
      { question: '多久可以看到效果？', answer: '可依實際商品週期填寫，例如連續使用 7 天、14 天或 28 天後的觀察重點。' },
      { question: '白天可以使用嗎？', answer: '若商品適合日間使用，可補充是否需要搭配防曬或後續保養步驟。' },
    ],
  },
  ecommerce: {
    label: '電商綜合',
    tag: '精選商品',
    defaultProduct: '熱銷機能商品',
    defaultBrand: 'NEXORA SELECT',
    defaultCategory: '電商商品',
    headline: '一頁說清楚商品為什麼值得買',
    subtitle: '用賣點、規格、比較與 CTA 快速完成商品轉換頁。',
    description: '適合多線別電商商品，重點是快速整理特色、適用對象、規格與購買理由。',
    details: '規格：依商品填寫\n適用：依目標族群填寫\n內容物：依包裝填寫\n售後：依平台政策填寫。',
    benefits: ['高 CP 值', '規格清楚', '快速出貨'],
    scenarios: ['日常使用', '送禮或組合購買'],
    proof: ['熱銷好評', '售後保障'],
    faq: [
      { question: '商品規格怎麼選？', answer: '可依實際 SKU、尺寸、容量、顏色或組合說明填寫。' },
      { question: '配送時間多久？', answer: '請依實際平台物流與檔期狀況補充。' },
      { question: '是否有保固或退換貨？', answer: '請依實際售後政策填寫，讓使用者購買前有清楚預期。' },
    ],
  },
  food: {
    label: '食品飲料',
    tag: '人氣風味',
    defaultProduct: '低糖氣泡果茶',
    defaultBrand: 'NEXORA TASTE',
    defaultCategory: '食品飲料',
    headline: '把日常補水變成清爽享受',
    subtitle: '低負擔、好入口，適合辦公、聚會與日常囤貨。',
    description: '適合飲品、零食、禮盒、冷凍食品與季節限定商品，重點是口味、食用情境與安心資訊。',
    details: '容量：330ml\n口味：蜜桃烏龍\n保存：常溫保存，開封後請冷藏\n特色：低糖、清爽氣泡、適合餐後與下午茶。',
    benefits: ['清爽低負擔', '風味好入口', '適合多種情境'],
    scenarios: ['辦公室下午茶', '聚會分享與日常囤貨'],
    proof: ['嚴選原料', '安心保存標示'],
    faq: [
      { question: '保存方式是什麼？', answer: '請依實際商品填寫常溫、冷藏或冷凍保存條件，並補充開封後建議。' },
      { question: '是否適合素食或過敏族群？', answer: '可補充成分、過敏原、素食標示與營養資訊。' },
      { question: '可以大量訂購嗎？', answer: '若有箱購、組合或團購優惠，可在此補充購買方式。' },
    ],
  },
  electronics: {
    label: '3C 家電',
    tag: '科技精選',
    defaultProduct: '智慧除濕空氣循環機',
    defaultBrand: 'NEXORA TECH',
    defaultCategory: '3C 家電',
    headline: '用一台設備改善居家空氣感',
    subtitle: '規格清楚、情境明確，讓功能轉成看得懂的生活效益。',
    description: '適合小家電、3C 配件、智慧裝置與居家科技商品，重點是規格、功能比較與售後保固。',
    details: '尺寸：320 x 220 x 520mm\n適用坪數：8-12 坪\n功能：除濕、循環、智慧模式\n保固：依實際商品政策填寫。',
    benefits: ['功能整合', '操作直覺', '規格清楚'],
    scenarios: ['臥室與更衣間除濕', '梅雨季居家空氣管理'],
    proof: ['原廠保固', '規格清楚可比較'],
    faq: [
      { question: '適合多大的空間？', answer: '請依實際坪數、功率或使用環境填寫，避免使用者期待落差。' },
      { question: '耗電量與噪音如何？', answer: '可補充能源效率、分貝、模式差異與建議使用時間。' },
      { question: '保固與維修方式？', answer: '請依平台與原廠政策補充保固期限、客服與維修流程。' },
    ],
  },
  fashion: {
    label: '服飾配件',
    tag: '風格推薦',
    defaultProduct: '輕量防潑水通勤包',
    defaultBrand: 'NEXORA STYLE',
    defaultCategory: '服飾配件',
    headline: '讓日常穿搭多一點俐落感',
    subtitle: '以材質、容量、搭配情境與細節設計完成轉換。',
    description: '適合服飾、包款、鞋履、飾品與穿搭配件，重點是風格、材質、尺寸與搭配情境。',
    details: '尺寸：依實際商品填寫\n材質：防潑水尼龍 / 五金配件\n容量：可放 13 吋筆電\n顏色：黑、灰、奶茶色。',
    benefits: ['百搭風格', '輕量好收納', '細節質感'],
    scenarios: ['通勤與日常外出', '週末短程旅行'],
    proof: ['材質細節清楚', '多情境搭配'],
    faq: [
      { question: '尺寸如何選擇？', answer: '請補充尺寸表、模特身高或實際容量，降低購買猶豫。' },
      { question: '材質如何保養？', answer: '可說明清潔方式、防水程度、是否可機洗或需乾洗。' },
      { question: '顏色會有色差嗎？', answer: '可補充拍攝光線、螢幕色差與實際商品顏色說明。' },
    ],
  },
};

const recipeMap: Record<ProductGoal, ProductModuleType[]> = {
  sales: ['hero', 'anchor-nav', 'product-showcase', 'product-benefits', 'product-features', 'product-scenes', 'product-comparison', 'faq', 'product-purchase'],
  launch: ['hero', 'anchor-nav', 'product-showcase', 'product-scenes', 'product-features', 'product-info', 'product-proof', 'faq', 'product-purchase'],
  comparison: ['hero', 'anchor-nav', 'product-showcase', 'product-benefits', 'product-comparison', 'product-info', 'product-proof', 'faq', 'product-purchase'],
  scenario: ['hero', 'anchor-nav', 'product-showcase', 'product-scenes', 'product-steps', 'product-features', 'product-info', 'faq', 'product-purchase'],
};

const industryRecipeBoosts: Record<ProductIndustry, ProductModuleType[]> = {
  cleaning: ['product-scenes', 'product-steps', 'product-info'],
  beauty: ['product-info', 'product-proof', 'product-steps'],
  ecommerce: ['product-comparison', 'product-info', 'product-purchase'],
  food: ['product-scenes', 'product-info', 'product-proof'],
  electronics: ['product-info', 'product-comparison', 'product-proof'],
  fashion: ['product-scenes', 'product-showcase', 'product-proof'],
};

const lengthTargets: Record<ProductPageLength, number> = {
  quick: 6,
  standard: 9,
  complete: 12,
};

export const defaultProductBuilderInput = (): ProductBuilderInput => {
  const copy = industryCopy.cleaning;
  return {
    industry: 'cleaning',
    goal: 'sales',
    pageLength: 'standard',
    productName: copy.defaultProduct,
    brand: copy.defaultBrand,
    category: copy.defaultCategory,
    headline: copy.headline,
    subtitle: copy.subtitle,
    description: copy.description,
    details: copy.details,
    originalPrice: '$399',
    salePrice: '$299',
    ctaText: '立即選購',
    ctaLink: '#',
    mainImage: '',
    mobileImage: '',
    backgroundImage: '',
    benefitOne: copy.benefits[0],
    benefitTwo: copy.benefits[1],
    benefitThree: copy.benefits[2],
    scenarioOne: copy.scenarios[0],
    scenarioTwo: copy.scenarios[1],
    proofOne: copy.proof[0],
    proofTwo: copy.proof[1],
    theme: 'freshClean',
  };
};

export function defaultInputForIndustry(industry: ProductIndustry): ProductBuilderInput {
  const base = defaultProductBuilderInput();
  const copy = industryCopy[industry];
  const theme: ProductPageTheme = industry === 'beauty'
    ? 'luxury'
    : industry === 'ecommerce'
      ? 'minimalCommerce'
      : industry === 'electronics'
        ? 'minimalCommerce'
        : industry === 'fashion'
          ? 'luxury'
          : industry === 'food'
            ? 'promo'
            : 'freshClean';
  return {
    ...base,
    industry,
    theme,
    productName: copy.defaultProduct,
    brand: copy.defaultBrand,
    category: copy.defaultCategory,
    headline: copy.headline,
    subtitle: copy.subtitle,
    description: copy.description,
    details: copy.details,
    benefitOne: copy.benefits[0],
    benefitTwo: copy.benefits[1],
    benefitThree: copy.benefits[2],
    scenarioOne: copy.scenarios[0],
    scenarioTwo: copy.scenarios[1],
    proofOne: copy.proof[0],
    proofTwo: copy.proof[1],
  };
}

const compact = <T>(items: Array<T | false | null | undefined>): T[] => items.filter(Boolean) as T[];

export function resolveProductPageRecipe(input: Pick<ProductBuilderInput, 'goal' | 'pageLength'> & Partial<Pick<ProductBuilderInput, 'industry' | 'theme'>>): ProductPageRecipe {
  const full = Array.from(new Set([...recipeMap[input.goal], ...(input.industry ? industryRecipeBoosts[input.industry] : [])]));
  const target = lengthTargets[input.pageLength];
  const priority: ProductModuleType[] = [
    'hero',
    'anchor-nav',
    'product-showcase',
    ...(input.industry ? industryRecipeBoosts[input.industry] : []),
    'product-benefits',
    'product-features',
    'product-scenes',
    'product-comparison',
    'product-info',
    'product-steps',
    'product-proof',
    'faq',
    'product-purchase',
  ];
  const included = priority.filter((type) => full.includes(type));
  const required: ProductModuleType[] = ['hero', 'product-showcase', 'product-purchase'];
  const modules = Array.from(new Set([...required, ...included])).slice(0, target);

  if (!modules.includes('product-purchase')) {
    modules[modules.length - 1] = 'product-purchase';
  }

  return {
    modules,
    emphasis: input.goal,
    visualTags: themeVisuals[input.theme || 'freshClean'],
  };
}

function productFromInput(input: ProductBuilderInput, name = input.productName, tag = industryCopy[input.industry].tag): Product {
  return {
    id: generateId(),
    image: input.mainImage,
    brand: input.brand,
    name,
    originalPrice: input.originalPrice,
    salePrice: input.salePrice,
    link: input.ctaLink || '#',
    showBadge: true,
    badgeText: '推薦',
    showSpecialTag: true,
    specialTag: tag,
  };
}

function parseDetails(details: string) {
  return details.split('\n').filter(Boolean).map((line) => {
    const [label, ...rest] = line.split(/[：:]/);
    return {
      id: generateId(),
      label: label || '項目',
      value: rest.join('：') || line,
      description: '',
    };
  });
}

function copyFor(input: ProductBuilderInput) {
  return industryCopy[input.industry];
}

function themeFor(input: ProductBuilderInput) {
  return productThemePresets[input.theme];
}

function visualDirectionFor(input: ProductBuilderInput) {
  const theme = themeFor(input);
  const cardMood = theme.cardBorder.includes('239,68,68')
    ? '卡片會偏促購感，適合強調優惠、檔期和立即行動。'
    : theme.cardBorder.includes('47,42,37')
      ? '卡片會偏精品感，適合強調質感、留白和品牌信任。'
      : theme.cardBorder.includes('79,70,229')
        ? '卡片會偏電商感，適合強調規格、比較和清楚資訊。'
        : '卡片會偏清爽感，適合強調潔淨、日常情境和安心使用。';
  return {
    hero: theme.heroTone,
    cards: `${cardMood} 背景以 ${theme.cardBackground.includes('linear-gradient') ? '柔和層次' : '乾淨純色'} 呈現。`,
    proof: theme.proofTone,
    purchase: theme.purchaseTone,
  };
}

function visualHook(input: ProductBuilderInput) {
  const copy = copyFor(input);
  const hooks: Record<ProductIndustry, string> = {
    cleaning: '用清爽明亮的視覺把潔淨感放大，讓商品從第一屏就能被理解。',
    beauty: '用留白、細節與質感光影強化品牌信任，讓保養價值更容易被感受。',
    ecommerce: '用白底商品主圖與規格化資訊降低比較成本，讓使用者快速做選擇。',
    food: '用風味、口感與食用情境建立想像，讓商品看起來更有食慾與檔期感。',
    electronics: '用規格、功能與場景化利益建立專業感，讓複雜商品更容易被看懂。',
    fashion: '用風格情境、材質細節與穿搭想像建立質感，讓商品更有記憶點。',
  };
  return `${hooks[input.industry]} 目前線別：${copy.label}。`;
}

function proofHook(input: ProductBuilderInput) {
  const hooks: Record<ProductIndustry, string> = {
    cleaning: '信任重點放在溫和、適用場景、清潔效率與日常安心。',
    beauty: '信任重點放在成分、膚感、使用週期與品牌承諾。',
    ecommerce: '信任重點放在規格、評價、物流與售後政策。',
    food: '信任重點放在原料、保存、過敏資訊與食用安心。',
    electronics: '信任重點放在規格、保固、效能與使用限制。',
    fashion: '信任重點放在材質、尺寸、保養方式與實穿情境。',
  };
  return hooks[input.industry];
}

function conversionIntent(input: ProductBuilderInput) {
  const intents: Record<ProductGoal, string> = {
    sales: '最後一屏要集中火力承接價格、組合與立即購買。',
    launch: '最後一屏要把新品亮點轉成第一波嘗鮮理由。',
    comparison: '最後一屏要承接比較結果，讓使用者知道為什麼選這個。',
    scenario: '最後一屏要回扣使用情境，讓使用者找到自己的購買理由。',
  };
  return intents[input.goal];
}

function createModule(type: ProductModuleType, input: ProductBuilderInput): PageModule {
  const copy = copyFor(input);
  const theme = themeFor(input);
  const direction = visualDirectionFor(input);
  const heroImage = input.backgroundImage || input.mainImage;
  const product = productFromInput(input);

  switch (type) {
    case 'hero':
      return {
        id: generateId(),
        type: 'hero',
        data: {
          anchorName: '商品主視覺',
          showText: true,
          height: input.pageLength === 'quick' ? 'small' : input.pageLength === 'complete' ? 'large' : 'medium',
          kicker: input.brand,
          title: input.headline,
          subtitle: input.subtitle,
          buttonText: input.ctaText,
          buttonLink: input.ctaLink,
          image: heroImage,
          mobileImage: input.mobileImage || heroImage,
          layout: 'left-text-right-image',
          backgroundStyle: 'light',
          backgroundColor: theme.heroBackground,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          buttonTextColor: theme.accentText,
        },
      } as PageModule;
    case 'anchor-nav':
      return {
        id: generateId(),
        type: 'anchor-nav',
        data: {
          hiddenTargetIds: [],
          backgroundColor: theme.surface,
          buttonColor: theme.accent,
          textColor: theme.accentText,
        },
      };
    case 'product-showcase':
      return {
        id: generateId(),
        type: 'product-showcase',
        data: {
          anchorName: '商品展示',
          style: theme.showcaseStyle,
          eyebrow: theme.eyebrow,
          title: input.productName,
          subtitle: input.description,
          description: input.industry === 'ecommerce'
            ? `適合放置 1000 x 1000 去背商品圖，快速呈現商品外觀、規格與購買理由。${visualHook(input)} ${direction.hero}`
            : `適合放置 1000 x 1000 去背商品圖，搭配主題背景建立商品頁質感。${visualHook(input)} ${direction.hero}`,
          image: input.mainImage,
          mobileImage: input.mobileImage || input.mainImage,
          buttonText: input.ctaText,
          buttonLink: input.ctaLink,
          reverse: input.theme === 'luxury',
          backgroundColor: theme.softSurface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
        },
      };
    case 'product-benefits':
      return {
        id: generateId(),
        type: 'product-benefits',
        data: {
          anchorName: '核心賣點',
          style: theme.benefitsStyle,
          eyebrow: theme.eyebrow,
          title: input.goal === 'comparison' ? '先解決購買前最常見的疑慮' : '三個理由，讓商品更容易被選擇',
          subtitle: `以購買理由重新整理商品利益，而不是只列功能。${conversionIntent(input)}`,
          backgroundColor: theme.cardBackground,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), metric: '01', title: input.benefitOne, description: `${copy.label}的第一個購買理由，建議用短句說清楚利益。` },
            { id: generateId(), metric: '02', title: input.benefitTwo, description: '補充使用感、效率、安心感或商品差異。' },
            { id: generateId(), metric: '03', title: input.benefitThree, description: '承接情境與轉換，讓使用者知道適合自己的原因。' },
          ],
        },
      };
    case 'product-features':
      return {
        id: generateId(),
        type: 'product-features',
        data: {
          anchorName: '商品特色',
          style: theme.featuresStyle,
          eyebrow: 'Features',
          title: `${copy.label}需要被快速理解`,
          subtitle: '用短句拆出功能特色，適合營運快速完成商品頁。',
          backgroundColor: theme.cardBackground,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), icon: '01', title: input.benefitOne, description: `把功能翻成使用者能理解的利益。${direction.cards}` },
            { id: generateId(), icon: '02', title: input.benefitTwo, description: '補充商品差異與使用感。' },
            { id: generateId(), icon: '03', title: input.benefitThree, description: '說明適用對象或使用場景。' },
            { id: generateId(), icon: '04', title: input.category || copy.defaultCategory, description: '可改成商品分類、線別或檔期主題。' },
          ],
        },
      };
    case 'product-scenes':
      return {
        id: generateId(),
        type: 'product-scenes',
        data: {
          anchorName: '商品情境',
          style: theme.scenesStyle,
          eyebrow: 'Scenarios',
          title: '讓使用者看見自己的使用情境',
          subtitle: '情境模組用來降低想像成本，適合商品頁中段承接說服。',
          backgroundColor: theme.softSurface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), title: input.scenarioOne, description: '補充此情境下的痛點、使用方式或商品帶來的改善。', image: input.backgroundImage || input.mainImage, mobileImage: input.mobileImage || input.mainImage },
            { id: generateId(), title: input.scenarioTwo, description: '可替換為第二個族群、場合、空間或購買理由。', image: input.mainImage, mobileImage: input.mobileImage || input.mainImage },
          ],
        },
      };
    case 'product-info':
      return {
        id: generateId(),
        type: 'product-info',
        data: {
          anchorName: '商品資訊',
          style: theme.infoStyle,
          eyebrow: 'Product Detail',
          title: input.industry === 'beauty' ? '成分、使用方式與保養節奏' : '商品規格與使用說明',
          subtitle: '把容量、適用範圍、使用方式與注意事項整理清楚，減少購買前疑問。',
          backgroundColor: theme.softSurface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: parseDetails(input.details),
        },
      };
    case 'product-steps':
      return {
        id: generateId(),
        type: 'product-steps',
        data: {
          anchorName: '使用步驟',
          style: theme.stepsStyle,
          eyebrow: 'How to Use',
          title: '用三步驟降低第一次使用門檻',
          subtitle: '適合需要教育使用者的商品，像清潔用品、保養品、家電或組合商品。',
          backgroundColor: theme.surface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), step: '01', title: '確認使用情境', description: `選擇適合的${copy.label}使用方式或商品規格。`, image: input.mainImage, mobileImage: input.mobileImage || input.mainImage },
            { id: generateId(), step: '02', title: '依建議方式使用', description: '補上用量、順序、等待時間或注意事項。', image: input.backgroundImage || input.mainImage, mobileImage: input.mobileImage || input.mainImage },
            { id: generateId(), step: '03', title: '完成並持續維持', description: '說明使用後效果、保養週期或再次購買情境。', image: input.mainImage, mobileImage: input.mobileImage || input.mainImage },
          ],
        },
      };
    case 'product-comparison':
      return {
        id: generateId(),
        type: 'product-comparison',
        data: {
          anchorName: '商品比較',
          style: theme.comparisonStyle,
          eyebrow: 'Comparison',
          title: input.goal === 'comparison' ? '把差異說清楚，使用者才會下決定' : '使用前後差異一眼看懂',
          subtitle: '比較模組用於處理猶豫、取代競品或說明升級價值。',
          beforeTitle: '一般狀態',
          afterTitle: input.productName,
          backgroundColor: theme.cardBackground,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), label: '核心利益', before: '需要自行比較資訊', after: input.benefitOne },
            { id: generateId(), label: '使用體驗', before: '效果或規格不明確', after: input.benefitTwo },
            { id: generateId(), label: '購買理由', before: '缺少立即行動理由', after: input.benefitThree },
          ],
        },
      };
    case 'product-proof':
      return {
        id: generateId(),
        type: 'product-proof',
        data: {
          anchorName: '信任證明',
          style: theme.proofStyle,
          eyebrow: 'Trust',
          title: '補上讓人放心購買的理由',
          subtitle: `可放評價、認證、保證、檢測或品牌承諾。${proofHook(input)}`,
          backgroundColor: theme.softSurface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: [
            { id: generateId(), badge: '01', title: input.proofOne, description: `補充檢測、評價、使用者回饋或品牌承諾。${direction.proof}` },
            { id: generateId(), badge: '02', title: input.proofTwo, description: '補充售後、保固、安心成分或平台保障。' },
            { id: generateId(), badge: '03', title: copy.tag, description: '可替換成產業認證、銷售成績或合作通路。' },
          ],
        },
      };
    case 'faq':
      return {
        id: generateId(),
        type: 'faq',
        data: {
          anchorName: '常見問題',
          backgroundColor: theme.surface,
          titleColor: theme.titleColor,
          textColor: theme.textColor,
          items: copy.faq.map((item) => ({ id: generateId(), ...item })),
        },
      };
    case 'product-purchase':
      return {
        id: generateId(),
        type: 'product-purchase',
        data: {
          anchorName: '立即購買',
          style: theme.purchaseStyle,
          eyebrow: input.goal === 'sales' ? 'Shop Now' : 'Next Step',
          title: input.goal === 'launch' ? `立即體驗 ${input.productName}` : '現在入手推薦組合',
          subtitle: `用購買 CTA 承接最後轉換，也可改成相關商品、推薦組合或單一購買按鈕。${conversionIntent(input)} ${direction.purchase}`,
          buttonText: input.ctaText,
          buttonLink: input.ctaLink,
          backgroundColor: theme.darkSurface,
          titleColor: theme.darkTitle,
          textColor: theme.darkText,
          products: compact([
            product,
            input.pageLength !== 'quick' && productFromInput(input, `${input.productName} 補充組`),
            input.pageLength !== 'quick' && productFromInput(input, `${input.category || copy.defaultCategory} 搭配組`),
          ]),
        },
      };
  }
}

export function buildProductPageModules(input: ProductBuilderInput): PageModule[] {
  const normalized = {
    ...defaultInputForIndustry(input.industry || 'cleaning'),
    ...input,
  };
  const recipe = resolveProductPageRecipe(normalized);
  return recipe.modules.map((type) => createModule(type, normalized));
}

export function createProductLandingModules(input: ProductBuilderInput): PageModule[] {
  return buildProductPageModules(input);
}
