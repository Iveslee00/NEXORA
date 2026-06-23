'use client';

import { ProductGridData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const PLACEHOLDER = 'https://placehold.co/400x400/e0e0f0/9090c0?text=Product';

export function ProductGridPreview({ data }: { data: ProductGridData }) {
  const { isMobile } = useDevice();
  const cols = isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? '12px' : '20px' }}>
          {data.products.map((product) => (
            <div key={product.id} style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
                <img
                  src={product.image || PLACEHOLDER}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                />
                {product.showBadge && product.badgeText && (
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#e53e3e', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', padding: '2px 7px', borderRadius: '4px', lineHeight: 1.5 }}>
                    {product.badgeText}
                  </span>
                )}
              </div>
              <div style={{ padding: isMobile ? '10px 12px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: '3px', ...textStyle }}>
                {product.brand && (
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.textColor || '#9090b0', margin: 0 }}>
                    {product.brand}
                  </p>
                )}
                <p style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.35 }}>
                  {product.name || 'Product Name'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                  {product.originalPrice && (
                    <span style={{ fontSize: '11px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                  )}
                  {product.salePrice && (
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                  )}
                </div>
                {product.showSpecialTag && product.specialTag && (
                  <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 7px', background: '#fff3cd', color: '#b45309', border: '1px solid #fcd34d', fontSize: '10px', fontWeight: 600, borderRadius: '3px', alignSelf: 'flex-start' }}>
                    {product.specialTag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
