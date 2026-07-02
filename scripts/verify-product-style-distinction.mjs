import { readFileSync } from 'node:fs';

const files = {
  types: readFileSync('types/modules.ts', 'utf8'),
  featuresForm: readFileSync('modules/forms/ProductFeaturesForm.tsx', 'utf8'),
  showcaseForm: readFileSync('modules/forms/ProductShowcaseForm.tsx', 'utf8'),
  infoForm: readFileSync('modules/forms/ProductInfoForm.tsx', 'utf8'),
  advancedForms: readFileSync('modules/forms/ProductAdvancedForms.tsx', 'utf8'),
  showcasePreview: readFileSync('modules/preview/ProductShowcasePreview.tsx', 'utf8'),
  showcaseExporter: readFileSync('modules/exporters/productShowcaseExporter.ts', 'utf8'),
  scenesPreview: readFileSync('modules/preview/ProductScenesPreview.tsx', 'utf8'),
  scenesExporter: readFileSync('modules/exporters/productScenesExporter.ts', 'utf8'),
  advancedPreview: readFileSync('modules/preview/ProductAdvancedPreview.tsx', 'utf8'),
  advancedExporter: readFileSync('modules/exporters/productAdvancedExporter.ts', 'utf8'),
  infoPreview: readFileSync('modules/preview/ProductInfoPreview.tsx', 'utf8'),
  infoExporter: readFileSync('modules/exporters/productInfoExporter.ts', 'utf8'),
  featuresPreview: readFileSync('modules/preview/ProductFeaturesPreview.tsx', 'utf8'),
  featuresExporter: readFileSync('modules/exporters/productFeaturesExporter.ts', 'utf8'),
  css: readFileSync('lib/export/cssGenerator.ts', 'utf8'),
};

const required = [
  [files.featuresForm, '四宮格：適合 4 個核心特色', 'features form should explain grid-4 usage'],
  [files.featuresForm, '卡片式：適合較長文字', 'features form should explain cards usage'],
  [files.showcaseForm, '左右分欄：電商資訊導購', 'showcase form should explain split usage'],
  [files.showcaseForm, '精品展示：玻璃文字卡', 'showcase form should explain luxury usage'],
  [files.infoForm, '成分：用 3 欄重點卡呈現', 'info form should explain ingredients usage'],
  [files.infoForm, '技術：用深色科技感規格板呈現', 'info form should explain technology usage'],
  [files.infoForm, '規格：標準 key-value 表格', 'info form should explain specs usage'],
  [files.infoForm, '內容物：用包裝清單呈現', 'info form should explain contents usage'],
  [files.advancedForms, '推薦組合：固定四品陳列', 'purchase form should explain bundle usage'],
  [files.advancedPreview, '一般商品', 'mobile comparison preview should expose before column title'],
  [files.advancedPreview, '使用本商品', 'mobile comparison preview should expose after column title'],
  [files.advancedExporter, 'data-label=', 'comparison export should add mobile data labels'],
  [files.css, '.cb-product-comparison__cell::before', 'comparison mobile CSS should display data labels'],
  [files.advancedPreview, 'reviewStars', 'reviews proof style should be visually distinct'],
  [files.advancedPreview, 'guaranteeSeal', 'guarantee proof style should be visually distinct'],
  [files.advancedPreview, 'certificationGrid', 'certification proof style should be visually distinct'],
  [files.css, '.cb-product-proof--certifications', 'certification proof CSS should be distinct'],
  [files.advancedPreview, 'bundleHeroCard', 'bundle purchase style should be visually distinct'],
  [files.css, '.cb-product-purchase--bundle', 'bundle purchase CSS should be distinct'],
  [files.css, '.cb-product-showcase--luxury .cb-product-showcase__content', 'luxury showcase should not reuse split layout'],
  [files.css, 'position: absolute; left: 24px; top: 50%', 'luxury showcase should use a floating content card'],
  [files.css, '.cb-product-info--contents .cb-product-info__table { counter-reset: cb-contents; }', 'contents info should use numbered package list'],
  [files.css, '.cb-product-features--cards .cb-product-features__grid { grid-template-columns: repeat(2', 'feature cards should not reuse four-column grid'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

function extractUnionValues(typeName) {
  const match = files.types.match(new RegExp(`export type ${typeName} = ([^;]+);`));
  if (!match) throw new Error(`${typeName} union should exist in types/modules.ts`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
}

const styleCoverage = {
  ProductFeaturesStyle: {
    'grid-4': [[files.css, '.cb-product-features__grid { display: grid; grid-template-columns: repeat(4'], [files.featuresPreview, 'repeat(4, 1fr)']],
    'grid-6': [[files.css, '.cb-product-features--grid-6'], [files.featuresPreview, 'isGrid6']],
    'icon-text': [[files.css, '.cb-product-features--icon-text'], [files.featuresPreview, 'isIconText'], [files.featuresExporter, 'cb-product-features__content']],
    cards: [[files.css, '.cb-product-features--cards'], [files.featuresPreview, 'isCards']],
  },
  ProductShowcaseStyle: {
    spacious: [[files.css, '.cb-product-showcase--spacious'], [files.showcasePreview, 'isSpacious'], [files.showcaseExporter, 'normalizeProductShowcaseStyle']],
    split: [[files.css, '.cb-product-showcase--split'], [files.showcasePreview, 'commerceGrid'], [files.showcaseExporter, "style === 'split'"]],
    luxury: [[files.css, '.cb-product-showcase--luxury'], [files.showcasePreview, 'isLuxury'], [files.showcaseExporter, "style === 'luxury'"]],
  },
  ProductScenesStyle: {
    'left-image': [[files.css, '.cb-product-scenes__single'], [files.scenesPreview, "data.style === 'left-image'"], [files.scenesExporter, "data.style === 'left-image'"]],
    'right-image': [[files.css, '.cb-product-scenes--right-image'], [files.scenesPreview, "data.style === 'right-image'"], [files.scenesExporter, "data.style === 'right-image'"]],
    'full-bleed': [[files.css, '.cb-product-scenes--full-bleed'], [files.scenesPreview, 'isFull'], [files.scenesExporter, "data.style === 'full-bleed'"]],
    'double-image': [[files.css, '.cb-product-scenes__grid'], [files.scenesPreview, 'data.items.slice(0, 4)'], [files.scenesExporter, 'data.items.slice(0, 4)']],
  },
  ProductInfoStyle: {
    ingredients: [[files.css, '.cb-product-info--ingredients'], [files.infoPreview, 'isIngredients']],
    technology: [[files.css, '.cb-product-info--technology'], [files.infoPreview, 'isTechnology']],
    specs: [[files.css, '.cb-product-info__row { display: grid; grid-template-columns: 180px 1fr'], [files.infoPreview, 'isSpecs']],
    contents: [[files.css, '.cb-product-info--contents'], [files.infoPreview, 'isContents']],
  },
  ProductBenefitsStyle: {
    'metric-cards': [[files.css, '.cb-product-benefits__metric { margin: 0 0 18px; font-size: 2rem'], [files.advancedPreview, 'metric-cards']],
    'pain-solution': [[files.css, '.cb-product-benefits--pain-solution'], [files.advancedPreview, 'isPainSolution']],
    stacked: [[files.css, '.cb-product-benefits--stacked'], [files.advancedPreview, 'isStacked']],
  },
  ProductStepsStyle: {
    numbered: [[files.css, '.cb-product-steps__grid { display: grid; grid-template-columns: repeat(3'], [files.advancedPreview, 'repeat(${Math.min(data.items.length, 3)}, 1fr)']],
    timeline: [[files.css, '.cb-product-steps--timeline'], [files.advancedPreview, 'isTimeline']],
    'image-cards': [[files.css, '.cb-product-steps__media'], [files.advancedPreview, "data.style === 'image-cards'"], [files.advancedExporter, "data.style === 'image-cards'"]],
  },
  ProductComparisonStyle: {
    'before-after': [[files.css, '.cb-product-comparison--before-after'], [files.advancedPreview, 'isBeforeAfter']],
    'product-table': [[files.css, '.cb-product-comparison__head { background: linear-gradient(135deg, #f8fafc'], [files.advancedExporter, 'cb-product-comparison--${escapeHtml(data.style)}']],
  },
  ProductProofStyle: {
    reviews: [[files.css, '.cb-product-proof--reviews'], [files.advancedPreview, 'reviewStars']],
    guarantee: [[files.css, '.cb-product-proof--guarantee'], [files.advancedPreview, 'guaranteeSeal']],
    certifications: [[files.css, '.cb-product-proof--certifications'], [files.advancedPreview, 'certificationGrid']],
  },
  ProductPurchaseStyle: {
    cta: [[files.css, '.cb-product-purchase--cta'], [files.advancedPreview, 'isCta'], [files.advancedExporter, "style === 'cta'"]],
    bundle: [[files.css, '.cb-product-purchase--bundle'], [files.advancedPreview, 'bundleHeroCard'], [files.advancedExporter, "const style = (data.style as string) === 'related' ? 'bundle' : data.style"]],
  },
};

for (const [typeName, contracts] of Object.entries(styleCoverage)) {
  const unionValues = extractUnionValues(typeName).sort();
  const contractValues = Object.keys(contracts).sort();
  if (unionValues.join('|') !== contractValues.join('|')) {
    throw new Error(`${typeName} style verifier coverage mismatch. types=${unionValues.join(',')} verifier=${contractValues.join(',')}`);
  }

  for (const [style, checks] of Object.entries(contracts)) {
    for (const [source, token] of checks) {
      if (!source.includes(token)) {
        throw new Error(`${typeName}.${style} should have product style coverage token: ${token}`);
      }
    }
  }
}

console.log('Product style distinction verification passed.');
