export interface ImageSpec {
  width: number;
  height: number;
}

export const IMAGE_SPECS = {
  hero: { width: 800, height: 500 },
  split: { width: 600, height: 450 },
  product: { width: 400, height: 400 },
  bannerProducts: { width: 500, height: 600 },
  productBanner: { width: 700, height: 600 },
  article: { width: 800, height: 500 },
  kv: { width: 1200, height: 600 },
  logo: { width: 160, height: 60 },
  bankLogo: { width: 160, height: 60 },
} as const;

export const formatImageSpec = (spec: ImageSpec) => `${spec.width} x ${spec.height}`;
