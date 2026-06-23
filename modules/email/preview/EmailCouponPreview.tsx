'use client';
import { EmailCouponData } from '@/types/emailModules';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';

export function EmailCouponPreview({ data }: { data: EmailCouponData }) {
  const { primaryColor } = useEmailSettings();
  const accent = data.accentColor || primaryColor;

  return (
    <div style={{ background: data.backgroundColor || '#f0f4ff', padding: '28px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', border: `2px dashed ${accent}`, borderRadius: '12px', padding: '28px 24px', textAlign: 'center', background: '#fff' }}>
        {data.title && (
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>
            {data.title}
          </p>
        )}
        {data.code && (
          <div style={{ display: 'inline-block', border: `2px solid ${accent}`, borderRadius: '8px', padding: '10px 24px', marginBottom: '14px', background: `${accent}12` }}>
            <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 800, letterSpacing: '4px', color: accent }}>
              {data.code}
            </span>
          </div>
        )}
        {data.description && (
          <p style={{ fontSize: '13px', color: data.textColor || '#4a4a6a', margin: '0 0 8px', lineHeight: 1.5 }}>
            {data.description}
          </p>
        )}
        {data.validity && (
          <p style={{ fontSize: '11px', color: '#9090b0', margin: '0 0 18px' }}>
            {data.validity}
          </p>
        )}
        {data.buttonText && (
          <span style={{ display: 'inline-block', padding: '10px 28px', background: accent, color: '#fff', borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'default' }}>
            {data.buttonText}
          </span>
        )}
      </div>
    </div>
  );
}
