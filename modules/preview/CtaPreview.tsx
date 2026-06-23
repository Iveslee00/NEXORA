'use client';

import { CtaData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

const bgMap: Record<string, React.CSSProperties> = {
  light: { background: 'transparent', color: '#1a1a2e' },
  dark: { background: '#1a1a2e', color: '#ffffff' },
  gradient: { background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' },
};

const alignMap: Record<string, React.CSSProperties> = {
  left: { alignItems: 'flex-start', textAlign: 'left' },
  center: { alignItems: 'center', textAlign: 'center' },
  right: { alignItems: 'flex-end', textAlign: 'right' },
};

export function CtaPreview({ data }: { data: CtaData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const bg = data.backgroundColor
    ? { background: data.backgroundColor, color: '#1a1a2e' }
    : (bgMap[data.backgroundStyle] ?? bgMap.dark);
  const align = alignMap[data.alignment] ?? alignMap.center;
  const isDark = data.backgroundStyle === 'dark' || data.backgroundStyle === 'gradient';
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '14px 32px',
    background: isDark ? '#ffffff' : buttonColor,
    color: isDark ? '#1a1a2e' : '#ffffff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px',
    lineHeight: 1, cursor: 'default', whiteSpace: 'nowrap',
  };

  return (
    <section style={{ ...bg, padding: isMobile ? '44px 16px' : '60px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', ...align }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0, ...titleStyle }}>
            {data.title || 'CTA Title'}
          </h2>
          {data.subtitle && <p style={{ fontSize: '1.05rem', lineHeight: 1.65, opacity: 0.8, maxWidth: '560px', margin: 0, ...textStyle }}>{data.subtitle}</p>}
          {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
        </div>
      </div>
    </section>
  );
}
