'use client';

import { ProductShowcaseData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

function normalizeProductShowcaseStyle(style: ProductShowcaseData['style'] | string): ProductShowcaseData['style'] {
  if (style === 'split' || style === 'luxury') return style;
  return 'spacious';
}

export function ProductShowcasePreview({ data }: { data: ProductShowcaseData }) {
  const { isMobile } = useDevice();
  const { buttonColor, buttonTextColor } = useGlobalSettings();
  const style = normalizeProductShowcaseStyle(data.style);
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isLuxury = style === 'luxury';
  const isSpacious = style === 'spacious';
  const isSplit = style === 'split' || style === 'luxury';
  const luxuryFrame = isLuxury;
  const commerceGrid = style === 'split';
  const freshGlow = isSpacious;
  const sectionBackground = data.backgroundColor || (isLuxury ? 'linear-gradient(135deg, #f8fbff 0%, #eaf7ff 48%, #fff7ed 100%)' : '#eefaff');

  const content = (
    <div style={{
      position: isLuxury && !isMobile ? 'absolute' : 'relative',
      left: isLuxury && !isMobile ? 0 : undefined,
      top: isLuxury && !isMobile ? '50%' : undefined,
      transform: isLuxury && !isMobile ? 'translateY(-50%)' : undefined,
      zIndex: 4,
      maxWidth: isSpacious ? 680 : isLuxury ? 430 : 460,
      margin: isSpacious ? '0 auto' : undefined,
      textAlign: isSpacious ? 'center' : 'left',
      padding: isLuxury && !isMobile ? '36px 34px' : commerceGrid && !isMobile ? '36px 38px' : undefined,
      borderRadius: isLuxury && !isMobile ? 34 : commerceGrid && !isMobile ? 32 : undefined,
      background: isLuxury && !isMobile ? 'rgba(255,255,255,0.84)' : commerceGrid && !isMobile ? 'rgba(255,255,255,0.84)' : undefined,
      boxShadow: isLuxury && !isMobile ? '0 28px 80px rgba(15,23,42,0.16)' : commerceGrid && !isMobile ? '0 28px 76px rgba(15,23,42,0.13)' : undefined,
      backdropFilter: isLuxury && !isMobile ? 'blur(18px)' : commerceGrid && !isMobile ? 'blur(14px)' : undefined,
      border: (isLuxury || commerceGrid) && !isMobile ? '1px solid rgba(255,255,255,0.72)' : undefined,
    }}>
      {data.eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{data.eyebrow}</p>}
      <h2 style={{ margin: 0, fontSize: isMobile ? '2rem' : '3rem', lineHeight: 1.05, fontWeight: 900, color: titleColor }}>{data.title}</h2>
      {data.subtitle && <p style={{ margin: '14px 0 0', fontSize: '1.05rem', lineHeight: 1.65, fontWeight: 650, color: textColor }}>{data.subtitle}</p>}
      {data.description && <p style={{ margin: '12px 0 0', fontSize: '0.96rem', lineHeight: 1.75, color: textColor, opacity: 0.86 }}>{data.description}</p>}
      {data.buttonText && <span style={{ display: 'inline-flex', marginTop: 24, padding: '12px 22px', borderRadius: 999, background: buttonColor, color: buttonTextColor, fontSize: 15, fontWeight: 800 }}>{data.buttonText}</span>}
    </div>
  );

  const media = (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: isLuxury && !isMobile ? '72%' : isSpacious && !isMobile ? 'min(680px, 100%)' : undefined,
      marginLeft: isLuxury && !isMobile ? 'auto' : isSpacious && !isMobile ? 'auto' : undefined,
      marginRight: isSpacious && !isMobile ? 'auto' : undefined,
      aspectRatio: isMobile ? '750 / 900' : isLuxury ? '920 / 760' : '1 / 1',
      borderRadius: isLuxury ? 36 : 28,
      overflow: 'hidden',
      background: isLuxury ? 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98), rgba(224,242,254,0.78) 52%, rgba(219,234,254,0.62))' : '#eef2ff',
      boxShadow: commerceGrid ? '0 22px 58px rgba(79,70,229,0.13)' : '0 24px 70px rgba(15,23,42,0.12)',
      border: luxuryFrame ? '1px solid rgba(47,42,37,0.12)' : commerceGrid ? '1px solid rgba(79,70,229,0.12)' : undefined,
    }}>
      {isLuxury && <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', background: 'rgba(125,211,252,0.24)', filter: 'blur(34px)' }} />}
      {freshGlow && <div style={{ position: 'absolute', inset: '-18%', borderRadius: '50%', background: 'rgba(14,165,198,0.18)', filter: 'blur(44px)' }} />}
      {commerceGrid && <div style={{ position: 'absolute', inset: 18, borderRadius: 24, backgroundImage: 'linear-gradient(rgba(79,70,229,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />}
      <PreviewImage src={imageSrc} alt="" label={isMobile ? '商品展示 M' : '商品展示 PC'} spec={isMobile ? IMAGE_SPECS.productShowcaseMobile : IMAGE_SPECS.productShowcase} objectFit={isLuxury ? 'contain' : 'cover'} variant="product" />
    </div>
  );

  const layout = isMobile || !isSplit
    ? <>{media}<div style={{ padding: 0 }}>{content}</div></>
    : data.reverse ? <>{media}{content}</> : <>{content}{media}</>;

  return (
    <section style={{ background: sectionBackground, padding: isMobile ? '36px 16px' : isLuxury ? '76px 24px' : '64px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', position: isLuxury && !isMobile ? 'relative' : undefined, minHeight: isLuxury && !isMobile ? 620 : undefined, display: isLuxury && !isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? '1fr' : isSplit ? (isLuxury ? '1fr 0.95fr' : '0.9fr 1.1fr') : '1fr', gap: isMobile ? 28 : isSpacious ? 42 : 56, alignItems: 'center', padding: 0 }}>
        {layout}
      </div>
    </section>
  );
}
