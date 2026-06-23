'use client';

import { SplitSectionData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

const PLACEHOLDER = 'https://placehold.co/600x450/e0e0f0/9090c0?text=Image';

export function SplitSectionPreview({ data }: { data: SplitSectionData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', background: buttonColor, color: '#fff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px', lineHeight: 1, cursor: 'default',
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1a1a2e', margin: 0, ...titleStyle }}>
        {data.title || 'Section Title'}
      </h2>
      {data.description && <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#4a4a6a', margin: 0, ...textStyle }}>{data.description}</p>}
      {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
    </div>
  );

  const media = (
    <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
      <img src={data.image || PLACEHOLDER} alt="" style={{ width: '100%', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
    </div>
  );

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '60px', alignItems: 'center' }}>
        {data.reverse ? <>{media}{content}</> : <>{content}{media}</>}
      </div>
    </section>
  );
}
