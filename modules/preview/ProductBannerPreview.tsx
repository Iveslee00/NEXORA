'use client';

import { ProductBannerData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { getProductBannerImageSpecs } from '@/lib/assets/imageSpecs';

const PLACEHOLDER = 'https://placehold.co/700x600/e0e0f0/9090c0?text=Product';

const heightPadding = {
  small: { desktop: '36px 24px', mobile: '28px 16px' },
  medium: { desktop: '56px 24px', mobile: '40px 16px' },
  large: { desktop: '76px 24px', mobile: '56px 16px' },
};

export function ProductBannerPreview({ data }: { data: ProductBannerData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const bg = { background: data.backgroundColor || '#1a1a2e', color: '#ffffff' };
  const padding = heightPadding[data.height ?? 'medium'];

  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const imageSrc = isMobile ? (data.mobileImage || data.image || PLACEHOLDER) : (data.image || PLACEHOLDER);
  const imageSpecs = getProductBannerImageSpecs(data.height);
  const mediaSpec = isMobile ? imageSpecs.mobile : imageSpecs.desktop;

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 28px',
    background: buttonColor,
    color: '#ffffff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px',
    lineHeight: 1, cursor: 'default', whiteSpace: 'nowrap',
  };

  const dividerColor = 'rgba(255,255,255,0.12)';
  const salePriceColor = '#ff6b6b';

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {data.kicker && (
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6, ...textStyle }}>
          {data.kicker}
        </span>
      )}
      <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, ...titleStyle }}>
        {data.headline || '單品主打'}
      </h2>
      {data.tagline && (
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.75, margin: 0, ...textStyle }}>
          {data.tagline}
        </p>
      )}
      <div style={{ borderTop: `1px solid ${dividerColor}`, borderBottom: `1px solid ${dividerColor}`, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {data.brand && (
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55, margin: 0, ...textStyle }}>
            {data.brand}
          </p>
        )}
        {data.productName && (
          <p style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2, margin: 0, ...titleStyle }}>
            {data.productName}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          {data.originalPrice && (
            <span style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'line-through' }}>{data.originalPrice}</span>
          )}
          {data.salePrice && (
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: salePriceColor, letterSpacing: '-0.02em' }}>{data.salePrice}</span>
          )}
        </div>
      </div>
      {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
    </div>
  );

  const media = (
    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: `${mediaSpec.width} / ${mediaSpec.height}` }}>
      <img
        src={imageSrc}
        alt={data.productName || ''}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
      />
      {data.showBadge && data.badgeText && (
        <span style={{ position: 'absolute', top: '14px', right: '14px', background: '#e53e3e', color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', padding: '5px 10px', borderRadius: '6px' }}>
          {data.badgeText}
        </span>
      )}
    </div>
  );

  return (
    <section style={{ ...bg, padding: isMobile ? padding.mobile : padding.desktop, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '56px', alignItems: 'center' }}>
          {data.reverse ? <>{media}{content}</> : <>{content}{media}</>}
        </div>
      </div>
    </section>
  );
}
