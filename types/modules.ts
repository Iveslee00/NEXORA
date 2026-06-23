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
  | 'bank-promo';

export interface BaseModule {
  id: string;
  type: ModuleType;
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

export interface TitleData {
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

export interface HeroData {
  kicker: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
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
export interface SplitSectionData {
  title: string;
  description: string;
  image: string;
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
export interface ProductGridData {
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
export interface BannerProductsData {
  layoutLabel: string;
  bannerImage: string;
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
export interface ProductBannerData {
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
export interface ProductCarouselData {
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

export interface LogoWallData {
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

export interface CtaData {
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

export interface FaqData {
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

export interface StickySidebarData {
  items: StickyItem[];
  position: 'right' | 'left';
}

export interface StickySidebarModule extends BaseModule {
  type: 'sticky-sidebar';
  data: StickySidebarData;
}

// ── Article Text ──────────────────────────────────────────────────────────────
export interface ArticleTextData {
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
export interface ArticleImageData {
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  date: string;
  image: string;
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
  image: string;
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

export type KvHeight = 'small' | 'medium' | 'large';

export interface HeroCarouselData {
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

export interface BankPromoData {
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
  | BankPromoModule;

export interface ExportedCode {
  html: string;
  css: string;
}

export interface GlobalSettings {
  buttonColor: string;
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
