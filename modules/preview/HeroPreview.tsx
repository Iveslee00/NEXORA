'use client';

import { HeroData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { premiumShadow } from './visualStyles';

const heightMap = {
  small: { desktopRatio: '1920 / 480', mobileFullRatio: '750 / 750', mobileImgRatio: '750 / 750' },
  medium: { desktopRatio: '1920 / 640', mobileFullRatio: '750 / 850', mobileImgRatio: '750 / 850' },
  large: { desktopRatio: '1920 / 800', mobileFullRatio: '750 / 950', mobileImgRatio: '750 / 950' },
};

export function HeroPreview({ data }: { data: HeroData }) {
  const { isMobile } = useDevice();
  const { buttonColor, buttonTextColor } = useGlobalSettings();
  const defaultTextColor = '#ffffff';
  const titleStyle: React.CSSProperties = { color: data.titleColor || defaultTextColor };
  const textStyle: React.CSSProperties = { color: data.textColor || defaultTextColor };
  const h = heightMap[data.height ?? 'medium'];
  const showText = data.showText !== false;
  const imageSpecs = getKvImageSpecs(data.height, showText);
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const imageSpec = isMobile ? imageSpecs.mobile : imageSpecs.desktop;
  const imageLabel = isMobile ? 'KV M' : 'KV PC 滿版';
  const textBg = data.backgroundColor || '#1a1a2e';
  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    overflow: 'hidden',
    background: textBg,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    ...(isMobile
      ? showText ? {} : { aspectRatio: h.mobileFullRatio }
      : { aspectRatio: h.desktopRatio }),
  };
  const hasBannerLink = Boolean(data.buttonLink && data.buttonLink !== '#');
  const heroImage = (
    <PreviewImage src={imageSrc} alt="" label={imageLabel} spec={imageSpec} tone="dark" />
  );
  const heroDepthLayer: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.24), transparent 28%), radial-gradient(circle at 76% 66%, rgba(99,102,241,0.22), transparent 30%)',
    mixBlendMode: 'screen',
    zIndex: 1,
  };
  const heroGlassShell: React.CSSProperties = {
    position: 'absolute',
    inset: isMobile ? '12px' : '28px',
    pointerEvents: 'none',
    borderRadius: isMobile ? '20px' : '34px',
    border: '1px solid rgba(255,255,255,0.18)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 28px 80px rgba(15,23,42,0.18)',
    zIndex: 1,
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', background: buttonColor, color: buttonTextColor,
    borderRadius: '999px', fontWeight: 750, fontSize: '15px', lineHeight: 1, cursor: 'default',
    boxShadow: premiumShadow,
  };

  return (
    <section style={sectionStyle}>
      <span style={heroDepthLayer} />
      <span style={heroGlassShell} />
      {!showText ? (
        <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
          {hasBannerLink ? (
            <a href={data.buttonLink} style={{ position: 'absolute', inset: 0, display: 'block', cursor: 'pointer' }}>
              {heroImage}
            </a>
          ) : heroImage}
        </div>
      ) : (
        <>
          {isMobile && (
            <div style={{ aspectRatio: h.mobileImgRatio, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              {heroImage}
            </div>
          )}
          {!isMobile && (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {heroImage}
            </div>
          )}
          <div style={{ position: isMobile ? 'relative' : 'absolute', inset: isMobile ? undefined : 0, zIndex: 2, display: 'flex', alignItems: 'center', background: isMobile ? textBg : 'transparent', color: defaultTextColor }}>
            <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', padding: isMobile ? '20px 18px' : '0 40px' }}>
              <div style={{ maxWidth: isMobile ? 'none' : '430px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {data.kicker && <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', opacity: 0.65, marginBottom: '14px', ...textStyle }}>{data.kicker}</span>}
                <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: 800, lineHeight: 1.15, margin: '0 0 10px', ...titleStyle }}>{data.title || 'KV 標題'}</h1>
                {data.subtitle && <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', lineHeight: 1.6, opacity: 0.85, margin: '0 0 16px', ...textStyle }}>{data.subtitle}</p>}
                {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
