'use client';

import { useEffect, useRef, useState } from 'react';
import { BannerProductsData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS, getBannerProductsImageSpecs } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { ProductCardLabels } from './ProductCardLabels';

export function BannerProductsPreview({ data }: { data: BannerProductsData }) {
  const { isMobile } = useDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  const count = data.products.length;
  const brandStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const nameStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const bannerSrc = isMobile ? (data.mobileBannerImage || data.bannerImage) : data.bannerImage;
  const bannerSpecs = getBannerProductsImageSpecs(count);
  const bannerSpec = isMobile ? bannerSpecs.mobile : bannerSpecs.desktop;
  const bannerAspectRatio = isMobile ? '750 / 520' : `${bannerSpec.width} / ${bannerSpec.height}`;

  useEffect(() => {
    if (!isMobile) {
      setIsCompact(false);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const update = () => setIsCompact(node.getBoundingClientRect().width < 900);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  const bgStyle: React.CSSProperties = data.backgroundColor ? { background: data.backgroundColor } : {};

  const isStacked = isMobile || isCompact || count <= 0;
  const productCardWidth = 168;
  const desktopGap = 16;
  const gridCols = isStacked ? '1fr' : `${bannerSpec.width}px max-content`;
  const productGridCols = isMobile
    ? count <= 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))'
    : isCompact
    ? count <= 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))'
    : `repeat(${Math.max(1, count)}, ${productCardWidth}px)`;
  const lockDesktopHeight = !isStacked;
  const productMediaStyle: React.CSSProperties = lockDesktopHeight
    ? { height: `${productCardWidth}px` }
    : { aspectRatio: '1/1' };

  return (
    <section style={{ ...bgStyle, padding: isMobile ? '32px 16px' : '48px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div ref={containerRef} style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '12px' : `${desktopGap}px`, alignItems: lockDesktopHeight ? 'stretch' : 'start' }}>
          {/* Banner */}
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#1a1a2e', aspectRatio: lockDesktopHeight ? undefined : bannerAspectRatio, height: lockDesktopHeight ? '100%' : undefined, display: 'flex' }}>
            <PreviewImage src={bannerSrc} alt={data.bannerTitle} label={isMobile ? '活動 Banner M' : '活動 Banner PC'} spec={bannerSpec} tone="dark" />
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

          <div style={{ display: 'grid', gridTemplateColumns: productGridCols, gap: isMobile ? '12px' : `${desktopGap}px`, alignItems: 'start', minHeight: 0 }}>
            {/* Product cards */}
            {data.products.map((product) => (
              <div key={product.id} style={{ width: lockDesktopHeight ? `${productCardWidth}px` : undefined, minWidth: 0, minHeight: 0, background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative', ...productMediaStyle, flexShrink: 0, overflow: 'hidden', background: '#f5f5f5' }}>
                  <PreviewImage src={product.image} alt={product.name} label="商品圖" spec={IMAGE_SPECS.product} />
                  <ProductCardLabels product={product} compact />
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '3px', minHeight: 0 }}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
