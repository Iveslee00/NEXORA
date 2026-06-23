'use client';

import { ArticleImageData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const PLACEHOLDER = 'https://placehold.co/800x500/e8e8f8/6366f1?text=Article+Image';

export function ArticleImagePreview({ data }: { data: ArticleImageData }) {
  const { isMobile } = useDevice();
  const align = data.alignment || 'left';
  const pos = data.imagePosition || 'top';
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const isHorizontal = !isMobile && (pos === 'left' || pos === 'right');

  const imageEl = (
    <div style={{
      flexShrink: 0,
      width: isHorizontal ? '45%' : '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: pos === 'top' ? '36px' : 0,
    }}>
      <img
        src={data.image || PLACEHOLDER}
        alt={data.title || 'Article image'}
        style={{ width: '100%', height: pos === 'top' ? (isMobile ? '220px' : '420px') : '100%', objectFit: 'cover', display: 'block', minHeight: isHorizontal ? '320px' : undefined }}
        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
      />
    </div>
  );

  const textEl = (
    <div style={{ flex: 1, minWidth: 0, textAlign: align }}>
      {data.eyebrow && (
        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: data.textColor || '#9090b0', marginBottom: '12px' }}>
          {data.eyebrow}
        </p>
      )}
      {data.title && (
        <h2 style={{ fontSize: isMobile ? '1.5rem' : isHorizontal ? '1.75rem' : '2.25rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px', ...titleStyle }}>
          {data.title}
        </h2>
      )}
      {data.subtitle && (
        <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: data.textColor || '#4a4a6a', margin: '0 0 24px', opacity: 0.85 }}>
          {data.subtitle}
        </p>
      )}
      {data.content && (
        <div style={{ fontSize: '15px', lineHeight: 1.85, color: data.textColor || '#4a4a6a', whiteSpace: 'pre-wrap', textAlign: 'left', ...textStyle }}>
          {data.content}
        </div>
      )}
      {(data.author || data.date) && (
        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #e8e8f4', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
          {data.author && <span style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e' }}>{data.author}</span>}
          {data.date && <span style={{ fontSize: '13px', color: data.textColor || '#9090b0' }}>{data.date}</span>}
        </div>
      )}
    </div>
  );

  return (
    <section style={{
      background: data.backgroundColor || 'transparent',
      padding: isMobile ? '32px 16px' : '48px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ maxWidth: pos === 'top' ? '800px' : '1100px', margin: '0 auto' }}>
        {pos === 'top' ? (
          <>
            {imageEl}
            {textEl}
          </>
        ) : (
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexDirection: (isMobile || pos === 'left') ? 'row' : 'row-reverse' }}>
            {isMobile ? (
              <div style={{ width: '100%' }}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
                  <img
                    src={data.image || PLACEHOLDER}
                    alt={data.title || 'Article image'}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                </div>
                {textEl}
              </div>
            ) : (
              <>
                {imageEl}
                {textEl}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
