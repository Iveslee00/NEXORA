'use client';

import { HeroData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

const PLACEHOLDER = 'https://placehold.co/800x500/e0e0f0/9090c0?text=Image';

const heightMap = {
  small: { desktop: '300px', mobile: '370px', mobileImg: '210px' },
  medium: { desktop: '400px', mobile: '460px', mobileImg: '260px' },
  large: { desktop: '520px', mobile: '550px', mobileImg: '310px' },
};

export function HeroPreview({ data }: { data: HeroData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const imageSrc = isMobile ? (data.mobileImage || data.image || PLACEHOLDER) : (data.image || PLACEHOLDER);
  const h = heightMap[data.height ?? 'medium'];
  const slideHeight = isMobile ? h.mobile : h.desktop;
  const showText = data.showText !== false;
  const textBg = data.backgroundColor || '#1a1a2e';

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', background: buttonColor, color: '#fff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px', lineHeight: 1, cursor: 'default',
  };

  return (
    <section style={{ height: slideHeight, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden', background: textBg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {!showText ? (
        <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
          <img src={imageSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
        </div>
      ) : (
        <>
          {isMobile && (
            <div style={{ height: h.mobileImg, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <img src={imageSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
            </div>
          )}
          <div style={{ flex: isMobile ? '1 0 0' : '0 0 35%', background: textBg, color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '20px 18px' : '0 36px 0 44px', overflow: 'hidden' }}>
            {data.kicker && <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', opacity: 0.65, marginBottom: '14px', ...textStyle }}>{data.kicker}</span>}
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, lineHeight: 1.15, margin: '0 0 10px', color: '#ffffff', ...titleStyle }}>{data.title || 'KV 標題'}</h1>
            {data.subtitle && <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', lineHeight: 1.6, opacity: 0.85, margin: '0 0 16px', ...textStyle }}>{data.subtitle}</p>}
            {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
          </div>
          {!isMobile && (
            <div style={{ flex: '0 0 65%', position: 'relative', overflow: 'hidden' }}>
              <img src={imageSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
