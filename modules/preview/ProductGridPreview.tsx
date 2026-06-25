'use client';

import { ProductGridData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { ProductCardLabels } from './ProductCardLabels';

export function ProductGridPreview({ data }: { data: ProductGridData }) {
  const { isMobile } = useDevice();
  const cols = isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const brandStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const nameStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '24px 16px 32px' : '28px 24px 44px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? '12px' : '20px' }}>
          {data.products.map((product) => (
            <div key={product.id} style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
                <PreviewImage src={product.image} alt={product.name} label="商品圖" spec={IMAGE_SPECS.product} />
                <ProductCardLabels product={product} compact={isMobile} />
              </div>
              <div style={{ padding: isMobile ? '10px 12px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {product.brand && (
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.titleColor || '#9090b0', margin: 0, ...brandStyle }}>
                    {product.brand}
                  </p>
                )}
                <p style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.35, ...nameStyle }}>
                  {product.name || '商品名稱'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                  {product.originalPrice && (
                    <span style={{ fontSize: '11px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                  )}
                  {product.salePrice && (
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
