'use client';

import { ProductScenesData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

export function ProductScenesPreview({ data }: { data: ProductScenesData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const first = data.items[0];
  const isSingleVisual = data.style === 'left-image' || data.style === 'right-image' || data.style === 'full-bleed';
  const singleImage = isMobile ? (first?.mobileImage || first?.image) : first?.image;
  const isFull = data.style === 'full-bleed';
  const media = first ? (
    <div style={{ position: 'relative', aspectRatio: isMobile ? '750 / 900' : isFull ? '1920 / 680' : '900 / 640', borderRadius: isFull ? 0 : 28, overflow: 'hidden', boxShadow: isFull ? undefined : '0 22px 64px rgba(15,23,42,0.12)' }}>
      <PreviewImage src={singleImage} alt="" label={isMobile ? '商品情境 M' : '商品情境 PC'} spec={isMobile ? IMAGE_SPECS.productSceneMobile : IMAGE_SPECS.productScene} variant="scene" />
      {isFull && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.56), rgba(15,23,42,0.12) 46%, transparent)' }} />}
    </div>
  ) : null;

  const intro = (
    <div style={{ maxWidth: 520, position: 'relative', zIndex: 1 }}>
      {data.eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{data.eyebrow}</p>}
      <h2 style={{ margin: 0, fontSize: isMobile ? '1.9rem' : '2.6rem', lineHeight: 1.08, fontWeight: 900, color: titleColor }}>{data.title}</h2>
      {data.subtitle && <p style={{ margin: '14px 0 0', fontSize: '1rem', lineHeight: 1.75, color: textColor }}>{data.subtitle}</p>}
      {first && isSingleVisual && (
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(15,23,42,0.12)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 850, color: titleColor }}>{first.title}</h3>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: textColor }}>{first.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : isFull ? '0' : '64px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: isFull ? 'none' : '1080px', margin: '0 auto', position: 'relative' }}>
        {isSingleVisual ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isFull ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
            {isFull && !isMobile ? (
              <>
                {media}
                <div style={{ position: 'absolute', left: 'calc(50% - 540px)', top: '50%', transform: 'translateY(-50%)', padding: '34px 36px', borderRadius: 28, background: 'rgba(255,255,255,0.82)', boxShadow: '0 22px 64px rgba(15,23,42,0.14)', backdropFilter: 'blur(10px)' }}>{intro}</div>
              </>
            ) : data.style === 'right-image' || isMobile ? <>{intro}{media}</> : <>{media}{intro}</>}
          </div>
        ) : (
          <>
            {intro}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 18 : 24, marginTop: isMobile ? 28 : 36 }}>
              {data.items.slice(0, 4).map((item) => (
                <div key={item.id} style={{ borderRadius: 24, overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 16px 42px rgba(15,23,42,0.08)' }}>
                  <div style={{ position: 'relative', aspectRatio: isMobile ? '750 / 900' : '900 / 640' }}>
                    <PreviewImage src={isMobile ? (item.mobileImage || item.image) : item.image} alt="" label={isMobile ? '商品情境 M' : '商品情境 PC'} spec={isMobile ? IMAGE_SPECS.productSceneMobile : IMAGE_SPECS.productScene} variant="scene" />
                  </div>
                  <div style={{ padding: '20px 22px 22px' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
