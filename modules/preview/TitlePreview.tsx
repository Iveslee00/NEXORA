'use client';

import { TitleData } from '@/types/modules';

export function TitlePreview({ data }: { data: TitleData }) {
  const alignMap: Record<string, React.CSSProperties> = {
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
  };
  const align = alignMap[data.alignment] ?? alignMap.center;
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const bgStyle: React.CSSProperties = data.backgroundColor ? { background: data.backgroundColor } : {};

  return (
    <div style={{ padding: '48px 24px 8px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', ...bgStyle }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', ...align }}>
        <span style={{ display: 'block', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#1a1a2e', ...titleStyle }}>
          {data.titleCn || '主要標題'}
        </span>
        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a2e', opacity: 0.4, marginTop: '6px', ...titleStyle }}>
          {data.titleEn || 'Section Heading'}
        </span>
      </div>
    </div>
  );
}
