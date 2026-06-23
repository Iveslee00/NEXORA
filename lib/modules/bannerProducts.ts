import { BannerProductsData } from '@/types/modules';

export const getBannerProductsLayoutLabel = (data: Pick<BannerProductsData, 'layoutLabel' | 'products'>) => {
  if (data.layoutLabel?.trim()) return data.layoutLabel.trim();
  const count = data.products?.length ?? 0;
  return count > 0 ? `Banner + ${count} 品` : 'Banner + Products';
};

export const getBannerProductsCountClass = (count: number) => {
  if (count <= 0) return '--0';
  if (count === 1) return '--1';
  if (count === 2) return '--2';
  if (count === 3) return '--3';
  return '--4';
};
