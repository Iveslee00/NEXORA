'use client';

import { useEffect, useRef, useState } from 'react';
import { BannerProductsData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const PLACEHOLDER_PRODUCT = 'https://placehold.co/400x400/e0e0f0/9090c0?text=Product';
const PLACEHOLDER_BANNER = 'https://placehold.co/500x600/1a1a2e/6366f1?text=Banner';

export function BannerProductsPreview({ data }: { data: BannerProductsData }) {
  const { isMobile } = useDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  const count = data.products.length;
  const brandStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const nameStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const bannerSrc = isMobile ? (data.mobileBannerImage || data.bannerImage || PLACEHOLDER_BANNER) : (data.bannerImage || PLACEHOLDER_BANNER);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => setIsCompact(node.getBoundingClientRect().width < 900);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const bgStyle: React.CSSProperties = data.backgroundColor ? { background: data.backgroundColor } : {};

  const gridCols = isMobile
    ? count <= 1 ? '1fr' : '1fr 1fr'
    : isCompact
    ? count <= 0
      ? '1fr'
      : count === 1
      ? '1fr'
      : 'repeat(2, minmax(0, 1fr))'
    : count <= 0
    ? '1fr'
    : count === 1
    ? 'minmax(0, 2fr) minmax(180px, 1fr)'
    : count >= 4
    ? 'minmax(0, 2fr) repeat(4, minmax(140px, 1fr))'
    : count >= 3
    ? 'minmax(0, 2fr) repeat(3, minmax(150px, 1fr))'
    : 'minmax(0, 2fr) repeat(2, minmax(160px, 1fr))';

  return (
    <section style={{ ...bgStyle, padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div ref={containerRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '12px' : '20px', alignItems: 'stretch' }}>
          {/* Banner */}
          <div style={{ ...(isMobile || isCompact || count <= 0 ? { gridColumn: '1 / -1' } : {}), position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#1a1a2e', minHeight: isMobile ? '180px' : '280px', display: 'flex' }}>
            <img
              src={bannerSrc}
              alt={data.bannerTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_BANNER; }}
            />
            <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}>
              {data.bannerTitle && (
                <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, color: data.bannerTitleColor || '#ffffff', lineHeight: 1.2, margin: 0, overflowWrap: 'anywhere' }}>
                  {data.bannerTitle}
                </p>
              )}
              {data.bannerSubtitle && (
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', overflowWrap: 'anywhere' }}>
                  {data.bannerSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Product cards */}
          {data.products.map((product) => (
            <div key={product.id} style={{ minWidth: 0, background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
                <img
                  src={product.image || PLACEHOLDER_PRODUCT}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_PRODUCT; }}
                />
                {product.showBadge && product.badgeText && (
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#e53e3e', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                    {product.badgeText}
                  </span>
                )}
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {product.brand && (
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.titleColor || '#9090b0', margin: 0, ...brandStyle }}>
                    {product.brand}
                  </p>
                )}
                <p style={{ fontSize: '12px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.3, overflowWrap: 'anywhere', ...nameStyle }}>
                  {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {product.originalPrice && (
                    <span style={{ fontSize: '10px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                  )}
                  {product.salePrice && (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                  )}
                </div>
                {product.showSpecialTag && product.specialTag && (
                  <span style={{ display: 'inline-block', maxWidth: '100%', marginTop: '3px', padding: '1px 6px', background: '#fff3cd', color: '#b45309', border: '1px solid #fcd34d', fontSize: '10px', fontWeight: 600, borderRadius: '3px', alignSelf: 'flex-start', overflowWrap: 'anywhere' }}>
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
