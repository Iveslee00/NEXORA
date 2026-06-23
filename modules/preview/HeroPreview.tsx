'use client';

import { HeroData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

const PLACEHOLDER = 'https://placehold.co/800x500/e0e0f0/9090c0?text=Image';

const bgMap: Record<string, React.CSSProperties> = {
  light: { background: 'transparent', color: '#1a1a2e' },
  dark: { background: '#1a1a2e', color: '#ffffff' },
  gradient: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' },
};

export function HeroPreview({ data }: { data: HeroData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const bg = data.backgroundColor
    ? { background: data.backgroundColor, color: '#1a1a2e' }
    : (bgMap[data.backgroundStyle] ?? bgMap.light);
  const isCentered = data.layout === 'centered';
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', background: buttonColor, color: '#fff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px', lineHeight: 1, cursor: 'default',
  };

  if (isCentered) {
    return (
      <section style={{ ...bg, padding: isMobile ? '44px 16px' : '64px 24px', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {data.kicker && <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.65, marginBottom: '14px', display: 'block', ...textStyle }}>{data.kicker}</span>}
          <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px', maxWidth: '700px', ...titleStyle }}>{data.title || 'Hero Title'}</h1>
          {data.subtitle && <p style={{ fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.8, marginBottom: '32px', maxWidth: '560px', ...textStyle }}>{data.subtitle}</p>}
          {data.image && (
            <div style={{ width: '100%', maxWidth: '800px', borderRadius: '14px', overflow: 'hidden', marginBottom: '36px' }}>
              <img src={data.image} alt="" style={{ width: '100%', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
            </div>
          )}
          {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
        </div>
      </section>
    );
  }

  return (
    <section style={{ ...bg, padding: isMobile ? '40px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '56px', alignItems: 'center' }}>
        <div>
          {data.kicker && <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.65, marginBottom: '14px', ...textStyle }}>{data.kicker}</span>}
          <h1 style={{ fontSize: isMobile ? '2rem' : '2.75rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px', ...titleStyle }}>{data.title || 'Hero Title'}</h1>
          {data.subtitle && <p style={{ fontSize: '1.05rem', lineHeight: 1.7, opacity: 0.8, marginBottom: '32px', ...textStyle }}>{data.subtitle}</p>}
          {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
        </div>
        <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
          <img src={data.image || PLACEHOLDER} alt="" style={{ width: '100%', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} />
        </div>
      </div>
    </section>
  );
}
