export type ModuleType =
  | 'title'
  | 'hero'
  | 'split-section'
  | 'product-grid'
  | 'banner-products'
  | 'product-banner'
  | 'product-carousel'
  | 'logo-wall'
  | 'cta'
  | 'faq'
  | 'sticky-sidebar'
  | 'article-text'
  | 'article-image'
  | 'hero-carousel'
  | 'bank-promo'
  | 'anchor-nav'
  | 'product-features'
  | 'product-showcase'
  | 'product-scenes'
  | 'product-info'
  | 'product-benefits'
  | 'product-steps'
  | 'product-comparison'
  | 'product-proof'
  | 'product-purchase';

export interface BaseModule {
  id: string;
  type: ModuleType;
}

export interface AnchorableData {
  anchorName?: string;
}

// ── Shared Product ────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  image: string;
  brand: string;
  name: string;
  originalPrice: string;
  salePrice: string;
  link: string;
  showBadge: boolean;
  badgeText: string;
  showSpecialTag: boolean;
  specialTag: string;
}

// ── Title Block ───────────────────────────────────────────────────────────────
export type TitleAlignment = 'left' | 'center' | 'right';

export interface TitleData extends AnchorableData {
  titleCn: string;
  titleEn: string;
  alignment: TitleAlignment;
  titleColor: string;
  backgroundColor: string;
}

export interface TitleModule extends BaseModule {
  type: 'title';
  data: TitleData;
}

// ── Hero ─────────────────────────────────────────────────────────────────────
export type HeroLayout = 'left-text-right-image' | 'centered';
export type HeroBackground = 'light' | 'dark' | 'gradient';
export type ModuleHeight = 'small' | 'medium' | 'large';

export interface HeroData extends AnchorableData {
  showText: boolean;
  height: ModuleHeight;
  kicker: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  mobileImage: string;
  layout: HeroLayout;
  backgroundStyle: HeroBackground;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface HeroModule extends BaseModule {
  type: 'hero';
  data: HeroData;
}

// ── Split Section ─────────────────────────────────────────────────────────────
export interface SplitSectionData extends AnchorableData {
  height: ModuleHeight;
  title: string;
  description: string;
  image: string;
  mobileImage: string;
  buttonText: string;
  buttonLink: string;
  reverse: boolean;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface SplitSectionModule extends BaseModule {
  type: 'split-section';
  data: SplitSectionData;
}

// ── Product Grid ──────────────────────────────────────────────────────────────
export interface ProductGridData extends AnchorableData {
  products: Product[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductGridModule extends BaseModule {
  type: 'product-grid';
  data: ProductGridData;
}

// ── Banner + Products ─────────────────────────────────────────────────────────
export interface BannerProductsData extends AnchorableData {
  layoutLabel: string;
  bannerImage: string;
  mobileBannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerLink: string;
  bannerTitleColor: string;
  backgroundStyle: HeroBackground;
  backgroundColor: string;
  products: Product[];
  titleColor: string;
  textColor: string;
}

export interface BannerProductsModule extends BaseModule {
  type: 'banner-products';
  data: BannerProductsData;
}

// ── Product Banner ────────────────────────────────────────────────────────────
export interface ProductBannerData extends AnchorableData {
  height: ModuleHeight;
  kicker: string;
  headline: string;
  tagline: string;
  brand: string;
  productName: string;
  originalPrice: string;
  salePrice: string;
  showBadge: boolean;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  mobileImage: string;
  backgroundStyle: HeroBackground;
  backgroundColor: string;
  reverse: boolean;
  titleColor: string;
  textColor: string;
}

export interface ProductBannerModule extends BaseModule {
  type: 'product-banner';
  data: ProductBannerData;
}

// ── Product Carousel ──────────────────────────────────────────────────────────
export interface ProductCarouselData extends AnchorableData {
  products: Product[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductCarouselModule extends BaseModule {
  type: 'product-carousel';
  data: ProductCarouselData;
}

// ── Logo Wall ─────────────────────────────────────────────────────────────────
export interface LogoItem {
  id: string;
  image: string;
  alt: string;
  link: string;
}

export interface LogoWallData extends AnchorableData {
  logos: LogoItem[];
  backgroundColor: string;
  titleColor: string;
}

export interface LogoWallModule extends BaseModule {
  type: 'logo-wall';
  data: LogoWallData;
}

// ── CTA ───────────────────────────────────────────────────────────────────────
export type CtaAlignment = 'left' | 'center' | 'right';
export type CtaBackground = 'light' | 'dark' | 'gradient';

export interface CtaData extends AnchorableData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  alignment: CtaAlignment;
  backgroundStyle: CtaBackground;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface CtaModule extends BaseModule {
  type: 'cta';
  data: CtaData;
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqData extends AnchorableData {
  items: FaqItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface FaqModule extends BaseModule {
  type: 'faq';
  data: FaqData;
}

// ── Sticky Sidebar ────────────────────────────────────────────────────────────
export interface StickyItem {
  id: string;
  label: string;
  link: string;
  icon: string;
  bgColor: string;
}

export interface StickySidebarData extends AnchorableData {
  items: StickyItem[];
  position: 'right' | 'left';
}

export interface StickySidebarModule extends BaseModule {
  type: 'sticky-sidebar';
  data: StickySidebarData;
}

// ── Article Text ──────────────────────────────────────────────────────────────
export interface ArticleTextData extends AnchorableData {
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  date: string;
  alignment: 'left' | 'center';
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ArticleTextModule extends BaseModule {
  type: 'article-text';
  data: ArticleTextData;
}

// ── Article Image ─────────────────────────────────────────────────────────────
export interface ArticleImageData extends AnchorableData {
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  date: string;
  image: string;
  mobileImage: string;
  imagePosition: 'top' | 'left' | 'right';
  alignment: 'left' | 'center';
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ArticleImageModule extends BaseModule {
  type: 'article-image';
  data: ArticleImageData;
}

// ── Hero Carousel (KV輪播) ────────────────────────────────────────────────────
export interface KvSlide {
  id: string;
  showText: boolean;
  image: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  titleColor: string;
  textColor: string;
  textBgColor: string;
  overlayOpacity: number;
  alignment: 'left' | 'center' | 'right';
}

export type KvHeight = ModuleHeight;

export interface HeroCarouselData extends AnchorableData {
  slides: KvSlide[];
  height: KvHeight;
  autoPlay: boolean;
  backgroundColor: string;
}

export interface HeroCarouselModule extends BaseModule {
  type: 'hero-carousel';
  data: HeroCarouselData;
}

// ── Bank Promo (銀行贈獎活動) ─────────────────────────────────────────────────
export interface BankPromoItem {
  id: string;
  cardName: string;
  condition: string;
  benefit: string;
  note: string;
  logo: string;
  accentColor: string;
}

export interface BankPromoData extends AnchorableData {
  title: string;
  subtitle: string;
  items: BankPromoItem[];
  disclaimer: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface BankPromoModule extends BaseModule {
  type: 'bank-promo';
  data: BankPromoData;
}

// ── Anchor Navigation ────────────────────────────────────────────────────────
export interface AnchorNavData {
  hiddenTargetIds: string[];
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
}

export interface AnchorNavModule extends BaseModule {
  type: 'anchor-nav';
  data: AnchorNavData;
}

// ── Product Page MVP Modules ────────────────────────────────────────────────
export type ProductFeaturesStyle = 'grid-4' | 'grid-6' | 'icon-text' | 'cards';

export interface ProductFeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ProductFeaturesData extends AnchorableData {
  style: ProductFeaturesStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductFeatureItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductFeaturesModule extends BaseModule {
  type: 'product-features';
  data: ProductFeaturesData;
}

export type ProductShowcaseStyle = 'spacious' | 'split' | 'luxury';

export interface ProductShowcaseData extends AnchorableData {
  style: ProductShowcaseStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string;
  buttonText: string;
  buttonLink: string;
  reverse: boolean;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductShowcaseModule extends BaseModule {
  type: 'product-showcase';
  data: ProductShowcaseData;
}

export type ProductScenesStyle = 'left-image' | 'right-image' | 'full-bleed' | 'double-image';

export interface ProductSceneItem {
  id: string;
  title: string;
  description: string;
  image: string;
  mobileImage: string;
}

export interface ProductScenesData extends AnchorableData {
  style: ProductScenesStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductSceneItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductScenesModule extends BaseModule {
  type: 'product-scenes';
  data: ProductScenesData;
}

export type ProductInfoStyle = 'ingredients' | 'technology' | 'specs' | 'contents';

export interface ProductInfoItem {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface ProductInfoData extends AnchorableData {
  style: ProductInfoStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductInfoItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductInfoModule extends BaseModule {
  type: 'product-info';
  data: ProductInfoData;
}

export type ProductBenefitsStyle = 'metric-cards' | 'pain-solution' | 'stacked';

export interface ProductBenefitItem {
  id: string;
  metric: string;
  title: string;
  description: string;
}

export interface ProductBenefitsData extends AnchorableData {
  style: ProductBenefitsStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductBenefitItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductBenefitsModule extends BaseModule {
  type: 'product-benefits';
  data: ProductBenefitsData;
}

export type ProductStepsStyle = 'numbered' | 'timeline' | 'image-cards';

export interface ProductStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
  mobileImage: string;
}

export interface ProductStepsData extends AnchorableData {
  style: ProductStepsStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductStepItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductStepsModule extends BaseModule {
  type: 'product-steps';
  data: ProductStepsData;
}

export type ProductComparisonStyle = 'before-after' | 'product-table';

export interface ProductComparisonItem {
  id: string;
  label: string;
  before: string;
  after: string;
}

export interface ProductComparisonData extends AnchorableData {
  style: ProductComparisonStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  beforeTitle: string;
  afterTitle: string;
  items: ProductComparisonItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductComparisonModule extends BaseModule {
  type: 'product-comparison';
  data: ProductComparisonData;
}

export type ProductProofStyle = 'reviews' | 'guarantee' | 'certifications';

export interface ProductProofItem {
  id: string;
  badge: string;
  title: string;
  description: string;
}

export interface ProductProofData extends AnchorableData {
  style: ProductProofStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ProductProofItem[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductProofModule extends BaseModule {
  type: 'product-proof';
  data: ProductProofData;
}

export type ProductPurchaseStyle = 'cta' | 'bundle';

export interface ProductPurchaseData extends AnchorableData {
  style: ProductPurchaseStyle;
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  products: Product[];
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}

export interface ProductPurchaseModule extends BaseModule {
  type: 'product-purchase';
  data: ProductPurchaseData;
}

// ── Union & Export ────────────────────────────────────────────────────────────
export type PageModule =
  | TitleModule
  | HeroModule
  | SplitSectionModule
  | ProductGridModule
  | BannerProductsModule
  | ProductBannerModule
  | ProductCarouselModule
  | LogoWallModule
  | CtaModule
  | FaqModule
  | StickySidebarModule
  | ArticleTextModule
  | ArticleImageModule
  | HeroCarouselModule
  | BankPromoModule
  | AnchorNavModule
  | ProductFeaturesModule
  | ProductShowcaseModule
  | ProductScenesModule
  | ProductInfoModule
  | ProductBenefitsModule
  | ProductStepsModule
  | ProductComparisonModule
  | ProductProofModule
  | ProductPurchaseModule;

export interface ExportedCode {
  html: string;
  css: string;
}

export interface GlobalSettings {
  buttonColor: string;
  buttonTextColor: string;
  pageBackgroundColor: string;
  pageBackgroundImage: string;
}

export interface ModuleSchemaItem {
  type: ModuleType;
  key: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  defaultData: PageModule['data'];
}
