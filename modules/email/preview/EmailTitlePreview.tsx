'use client';
import { EmailTitleData } from '@/types/emailModules';

export function EmailTitlePreview({ data }: { data: EmailTitleData }) {
  const align = data.alignment || 'center';
  const bg = data.backgroundColor || '#ffffff';
  return (
    <div style={{ background: bg, padding: '20px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textAlign: align }}>
      {data.titleEn && (
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: data.subtitleColor || '#9090b0', margin: '0 0 4px' }}>
          {data.titleEn}
        </p>
      )}
      {data.titleZh && (
        <p style={{ fontSize: '20px', fontWeight: 800, color: data.titleColor || '#1a1a2e', margin: 0, lineHeight: 1.25 }}>
          {data.titleZh}
        </p>
      )}
    </div>
  );
}
