'use client';

import { BankPromoData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const DEFAULT_ACCENT = '#6366f1';

export function BankPromoPreview({ data }: { data: BankPromoData }) {
  const { isMobile } = useDevice();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const cols = isMobile
    ? 1
    : data.items.length <= 2
    ? data.items.length
    : data.items.length === 3
    ? 3
    : 4;

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        {(data.title || data.subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
            {data.title && (
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1a1a2e', margin: '0 0 6px', ...titleStyle }}>
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p style={{ fontSize: '13px', color: '#9090b0', margin: 0, ...textStyle }}>{data.subtitle}</p>
            )}
          </div>
        )}

        {/* Cards grid */}
        {data.items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? '10px' : '14px' }}>
            {data.items.map((item) => {
              const accent = item.accentColor || DEFAULT_ACCENT;
              return (
                <div key={item.id} style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  {/* Accent bar */}
                  <div style={{ height: '4px', background: accent, flexShrink: 0 }} />

                  <div style={{ padding: isMobile ? '14px' : '18px 20px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    {/* Logo + card name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {item.logo && (
                        <img src={item.logo} alt={item.cardName} style={{ height: '20px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>
                        {item.cardName}
                      </p>
                    </div>

                    {/* Condition */}
                    {item.condition && (
                      <p style={{ fontSize: '11px', color: '#9090b0', margin: 0, lineHeight: 1.4 }}>
                        {item.condition}
                      </p>
                    )}

                    {/* Benefit — main highlight */}
                    {item.benefit && (
                      <p style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 700, color: accent, margin: '4px 0 0', lineHeight: 1.4 }}>
                        {item.benefit}
                      </p>
                    )}

                    {/* Note */}
                    {item.note && (
                      <p style={{ fontSize: '11px', color: '#9090b0', margin: '2px 0 0', lineHeight: 1.5 }}>
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer: disclaimer + link */}
        {(data.disclaimer || data.linkText) && (
          <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            {data.disclaimer && (
              <p style={{ fontSize: '11px', color: '#b0b0c0', margin: 0, ...textStyle }}>
                {data.disclaimer}
              </p>
            )}
            {data.linkText && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: data.textColor || '#6366f1', cursor: 'default' }}>
                {data.linkText}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
