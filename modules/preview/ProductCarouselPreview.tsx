'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductCarouselData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PreviewImage } from './PreviewImage';
import { ProductCardLabels } from './ProductCardLabels';
import { hoverLift, moduleSurface, premiumShadow, productCardSurface } from './visualStyles';

export function ProductCarouselPreview({ data }: { data: ProductCarouselData }) {
  const { isMobile } = useDevice();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = isMobile ? 2 : 4;
  const gap = isMobile ? 12 : 20;
  const max = Math.max(0, data.products.length - visible);
  const brandStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const nameStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const carouselProductSignal: React.CSSProperties = {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 4,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(99,102,241,0.78), rgba(14,165,198,0.62))',
    zIndex: 2,
  };

  const viewportRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setCurrent((c) => Math.min(c, max));
  }, [max]);

  // auto-play: loop back to start after reaching the last page
  useEffect(() => {
    if (max === 0 || paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c >= max ? 0 : c + 1));
    }, 3000);
    return () => clearInterval(id);
  }, [max, paused]);

  const itemWidth = containerWidth > 0 ? (containerWidth - (visible - 1) * gap) / visible : 0;
  const offset = current * (itemWidth + gap);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(max, c + 1));

  return (
    <section
      style={{ ...moduleSurface(data.backgroundColor), padding: isMobile ? '28px 16px 36px' : '44px 0 56px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: isMobile ? '0' : '0 24px', position: 'relative' }}>
        {/* Prev button */}
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            position: 'absolute', left: isMobile ? '-4px' : '-16px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ffffff', border: '1px solid #e8e8f4',
            boxShadow: premiumShadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: current === 0 ? 'not-allowed' : 'pointer',
            opacity: current === 0 ? 0.3 : 1,
            zIndex: 2, transition: 'opacity 0.2s',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Track */}
        <div ref={viewportRef} style={{ overflowX: 'hidden', overflowY: 'visible', padding: '6px 0 12px' }}>
          <div style={{ display: 'flex', gap: `${gap}px`, transform: `translateX(-${offset}px)`, transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {data.products.map((product) => (
              <div
                key={product.id}
                style={{ flex: `0 0 ${itemWidth}px`, minWidth: 0 }}
              >
                <div style={{ ...productCardSurface, ...hoverLift }}>
                  <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: 'linear-gradient(135deg, #eef2ff, #f8fafc)' }}>
                    <PreviewImage src={product.image} alt={product.name} label="商品圖" spec={IMAGE_SPECS.product} />
                    <ProductCardLabels product={product} compact={isMobile} />
                    <span style={carouselProductSignal} />
                  </div>
                  <div style={{ padding: isMobile ? '10px 12px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {product.brand && (
                      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.titleColor || '#9090b0', margin: 0, ...brandStyle }}>
                        {product.brand}
                      </p>
                    )}
                    <p style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.35, ...nameStyle }}>
                      {product.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {product.originalPrice && (
                        <span style={{ fontSize: '11px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                      )}
                      {product.salePrice && (
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={next}
          disabled={current >= max}
          style={{
            position: 'absolute', right: isMobile ? '-4px' : '-16px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ffffff', border: '1px solid #e8e8f4',
            boxShadow: premiumShadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: current >= max ? 'not-allowed' : 'pointer',
            opacity: current >= max ? 0.3 : 1,
            zIndex: 2, transition: 'opacity 0.2s',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
