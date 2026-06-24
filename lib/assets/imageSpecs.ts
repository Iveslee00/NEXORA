export interface ImageSpec {
  width: number;
  height: number;
}

export const IMAGE_SPECS = {
  hero: { width: 1200, height: 600 },
  heroMobile: { width: 750, height: 1000 },
  split: { width: 600, height: 450 },
  product: { width: 400, height: 400 },
  bannerProducts: { width: 500, height: 600 },
  bannerProductsMobile: { width: 750, height: 900 },
  productBanner: { width: 700, height: 600 },
  productBannerMobile: { width: 750, height: 900 },
  article: { width: 800, height: 500 },
  kv: { width: 1200, height: 600 },
  kvMobile: { width: 750, height: 1000 },
  logo: { width: 160, height: 60 },
  bankLogo: { width: 160, height: 60 },
} as const;

export const KV_IMAGE_SPECS = {
  small: {
    full: {
      desktop: { width: 1200, height: 400 },
      mobile: { width: 750, height: 900 },
    },
    split: {
      desktop: { width: 780, height: 400 },
      mobile: { width: 750, height: 400 },
    },
  },
  medium: {
    full: {
      desktop: { width: 1200, height: 600 },
      mobile: { width: 750, height: 1000 },
    },
    split: {
      desktop: { width: 780, height: 600 },
      mobile: { width: 750, height: 500 },
    },
  },
  large: {
    full: {
      desktop: { width: 1200, height: 800 },
      mobile: { width: 750, height: 1200 },
    },
    split: {
      desktop: { width: 780, height: 800 },
      mobile: { width: 750, height: 600 },
    },
  },
} as const;

type KvSpecHeight = keyof typeof KV_IMAGE_SPECS;

export const getKvImageSpecs = (height: string | undefined, showText = true) => {
  const key: KvSpecHeight = height === 'small' || height === 'large' ? height : 'medium';
  return showText ? KV_IMAGE_SPECS[key].split : KV_IMAGE_SPECS[key].full;
};

export const formatImageSpec = (spec: ImageSpec) => `${spec.width} x ${spec.height}`;
