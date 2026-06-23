'use client';

import { ArticleTextData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

export function ArticleTextPreview({ data }: { data: ArticleTextData }) {
  const { isMobile } = useDevice();
  const align = data.alignment || 'left';
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  return (
    <section style={{
      background: data.backgroundColor || 'transparent',
      padding: isMobile ? '32px 16px' : '48px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: align }}>
        {data.eyebrow && (
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: data.textColor || '#9090b0', marginBottom: '12px' }}>
            {data.eyebrow}
          </p>
        )}
        {data.title && (
          <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.25rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 16px', ...titleStyle }}>
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', lineHeight: 1.65, color: data.textColor || '#4a4a6a', margin: '0 0 28px', opacity: 0.85 }}>
            {data.subtitle}
          </p>
        )}
        {data.content && (
          <div style={{ fontSize: '15px', lineHeight: 1.85, color: data.textColor || '#4a4a6a', whiteSpace: 'pre-wrap', textAlign: 'left', ...textStyle }}>
            {data.content}
          </div>
        )}
        {(data.author || data.date) && (
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e8e8f4', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
            {data.author && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e' }}>{data.author}</span>
            )}
            {data.date && (
              <span style={{ fontSize: '13px', color: data.textColor || '#9090b0' }}>{data.date}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
