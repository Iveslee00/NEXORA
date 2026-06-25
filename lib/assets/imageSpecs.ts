export interface ImageSpec {
  width: number;
  height: number;
}

export const IMAGE_SPECS = {
  hero: { width: 1920, height: 640 },
  heroMobile: { width: 750, height: 850 },
  split: { width: 600, height: 450 },
  splitMobile: { width: 750, height: 562 },
  product: { width: 400, height: 400 },
  bannerProducts: { width: 520, height: 350 },
  bannerProductsMobile: { width: 750, height: 520 },
  productBanner: { width: 700, height: 600 },
  productBannerMobile: { width: 750, height: 900 },
  article: { width: 1200, height: 420 },
  articleMobile: { width: 750, height: 420 },
  kv: { width: 1920, height: 640 },
  kvMobile: { width: 750, height: 850 },
  logo: { width: 160, height: 60 },
  bankLogo: { width: 160, height: 60 },
} as const;

export const KV_IMAGE_SPECS = {
  small: {
    full: {
      desktop: { width: 1920, height: 480 },
      mobile: { width: 750, height: 750 },
    },
    split: {
      desktop: { width: 1920, height: 480 },
      mobile: { width: 750, height: 750 },
    },
  },
  medium: {
    full: {
      desktop: { width: 1920, height: 640 },
      mobile: { width: 750, height: 850 },
    },
    split: {
      desktop: { width: 1920, height: 640 },
      mobile: { width: 750, height: 850 },
    },
  },
  large: {
    full: {
      desktop: { width: 1920, height: 800 },
      mobile: { width: 750, height: 950 },
    },
    split: {
      desktop: { width: 1920, height: 800 },
      mobile: { width: 750, height: 950 },
    },
  },
} as const;

type KvSpecHeight = keyof typeof KV_IMAGE_SPECS;

export const getKvImageSpecs = (height: string | undefined, showText = true) => {
  const key: KvSpecHeight = height === 'small' || height === 'large' ? height : 'medium';
  return showText ? KV_IMAGE_SPECS[key].split : KV_IMAGE_SPECS[key].full;
};

export const getBannerProductsImageSpecs = (count: number) => ({
  desktop: count >= 4
    ? { width: 328, height: 350 }
    : count >= 3
    ? { width: 520, height: 350 }
    : { width: 700, height: 350 },
  mobile: IMAGE_SPECS.bannerProductsMobile,
});

export const PRODUCT_BANNER_IMAGE_SPECS = {
  small: {
    desktop: { width: 700, height: 460 },
    mobile: { width: 750, height: 750 },
  },
  medium: {
    desktop: { width: 700, height: 600 },
    mobile: { width: 750, height: 850 },
  },
  large: {
    desktop: { width: 700, height: 740 },
    mobile: { width: 750, height: 900 },
  },
} as const;

type ProductBannerSpecHeight = keyof typeof PRODUCT_BANNER_IMAGE_SPECS;

export const getProductBannerImageSpecs = (height: string | undefined) => {
  const key: ProductBannerSpecHeight = height === 'small' || height === 'large' ? height : 'medium';
  return PRODUCT_BANNER_IMAGE_SPECS[key];
};

export const formatImageSpec = (spec: ImageSpec) => `${spec.width} x ${spec.height}`;
