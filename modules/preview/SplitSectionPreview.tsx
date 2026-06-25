'use client';

import { SplitSectionData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

export function SplitSectionPreview({ data }: { data: SplitSectionData }) {
  const { isMobile } = useDevice();
  const { buttonColor, buttonTextColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const imageSpec = isMobile ? IMAGE_SPECS.splitMobile : IMAGE_SPECS.split;

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '10px 18px', background: buttonColor, color: buttonTextColor,
    borderRadius: '8px', fontWeight: 600, fontSize: '15px', lineHeight: 1, cursor: 'default',
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1a1a2e', margin: 0, ...titleStyle }}>
        {data.title || '區塊標題'}
      </h2>
      {data.description && <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#4a4a6a', margin: 0, ...textStyle }}>{data.description}</p>}
      {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
    </div>
  );

  const media = (
    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '4 / 3' }}>
      <PreviewImage src={imageSrc} alt="" label={isMobile ? '圖文區塊 M' : '圖文區塊 PC'} spec={imageSpec} />
    </div>
  );

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '24px 16px 32px' : '36px 24px 44px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '60px', alignItems: 'center' }}>
        {data.reverse ? <>{media}{content}</> : <>{content}{media}</>}
      </div>
    </section>
  );
}
