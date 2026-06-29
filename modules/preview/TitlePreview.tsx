'use client';

import { TitleData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { moduleSurface, visualAccent } from './visualStyles';

export function TitlePreview({ data }: { data: TitleData }) {
  const { isMobile } = useDevice();
  const alignMap: Record<string, React.CSSProperties> = {
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
  };
  const align = alignMap[data.alignment] ?? alignMap.center;
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const bgStyle: React.CSSProperties = data.backgroundColor ? { background: data.backgroundColor } : {};
  const titleHaloLayer: React.CSSProperties = {
    position: 'absolute',
    left: data.alignment === 'right' ? 'auto' : data.alignment === 'center' ? '50%' : 24,
    right: data.alignment === 'right' ? 24 : 'auto',
    top: '50%',
    width: isMobile ? 120 : 180,
    height: isMobile ? 120 : 180,
    transform: data.alignment === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
    borderRadius: '999px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.14), transparent 68%)',
    pointerEvents: 'none',
  };

  return (
    <div style={{ ...moduleSurface(data.backgroundColor), position: 'relative', overflow: 'hidden', padding: '24px 24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', ...bgStyle }}>
      <span style={titleHaloLayer} />
      <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', ...align }}>
        <span style={{ display: 'block', fontSize: isMobile ? '1.25rem' : 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#1a1a2e', ...titleStyle }}>
          {data.titleCn || '主要標題'}
        </span>
        <span style={{ display: 'block', fontSize: isMobile ? '0.68rem' : '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a2e', opacity: 0.4, marginTop: '6px', ...titleStyle }}>
          {data.titleEn || '活動副標'}
        </span>
        <span style={{ display: 'inline-block', width: 56, height: 3, borderRadius: 999, marginTop: 14, background: visualAccent }} />
      </div>
    </div>
  );
}
