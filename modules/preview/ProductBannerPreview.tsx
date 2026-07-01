'use client';

import { ProductBannerData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { getProductBannerImageSpecs } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { glassPanel, moduleSurface, premiumShadow } from './visualStyles';

const heightPadding = {
  small: { desktop: '28px 24px 36px', mobile: '24px 16px 32px' },
  medium: { desktop: '40px 24px 48px', mobile: '32px 16px 40px' },
  large: { desktop: '52px 24px 60px', mobile: '40px 16px 48px' },
};

export function ProductBannerPreview({ data }: { data: ProductBannerData }) {
  const { isMobile } = useDevice();
  const { buttonColor, buttonTextColor } = useGlobalSettings();
  const bg = { ...moduleSurface(data.backgroundColor), color: '#1a1a2e' };
  const padding = heightPadding[data.height ?? 'medium'];

  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const imageSpecs = getProductBannerImageSpecs(data.height);
  const mediaSpec = isMobile ? imageSpecs.mobile : imageSpecs.desktop;

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '13px 28px',
    background: buttonColor,
    color: buttonTextColor,
    borderRadius: '8px', fontWeight: 600, fontSize: '15px',
    lineHeight: 1, cursor: 'default', whiteSpace: 'nowrap',
  };

  const dividerColor = 'rgba(0,0,0,0.1)';
  const salePriceColor = '#e53e3e';

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: 28, padding: isMobile ? 0 : '30px 32px', ...(!isMobile ? glassPanel : {}) }}>
      {data.kicker && (
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6, ...textStyle }}>
          {data.kicker}
        </span>
      )}
      <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, ...titleStyle }}>
        {data.headline || '單品主打'}
      </h2>
      {data.tagline && (
        <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.75, margin: 0, ...textStyle }}>
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
    <div style={{ position: 'relative', borderRadius: '26px', overflow: 'hidden', aspectRatio: `${mediaSpec.width} / ${mediaSpec.height}`, boxShadow: premiumShadow }}>
      <PreviewImage src={imageSrc} alt={data.productName || ''} label={isMobile ? '單品主打 M' : '單品主打 PC'} spec={mediaSpec} />
      {data.showBadge && data.badgeText && (
        <span style={{ position: 'absolute', top: '14px', right: '14px', background: '#e53e3e', color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', padding: '5px 10px', borderRadius: '6px' }}>
          {data.badgeText}
        </span>
      )}
    </div>
  );

  return (
    <section style={{ ...bg, padding: isMobile ? padding.mobile : padding.desktop, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '56px', alignItems: 'center' }}>
        {isMobile ? <>{media}{content}</> : data.reverse ? <>{media}{content}</> : <>{content}{media}</>}
        </div>
      </div>
    </section>
  );
}
