'use client';
import { EmailArticleData } from '@/types/emailModules';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';

const PH = 'https://placehold.co/600x300/e8e8f8/6366f1?text=Article+Image';

export function EmailArticlePreview({ data }: { data: EmailArticleData }) {
  const { primaryColor } = useEmailSettings();

  return (
    <div style={{ background: data.backgroundColor || '#ffffff', padding: '28px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {data.image && (
        <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
          <img
            src={data.image}
            alt={data.title || ''}
            style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = PH; }}
          />
        </div>
      )}
      {data.eyebrow && (
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9090b0', margin: '0 0 8px' }}>
          {data.eyebrow}
        </p>
      )}
      {data.title && (
        <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em', color: data.titleColor || '#1a1a2e', margin: '0 0 10px' }}>
          {data.title}
        </h2>
      )}
      {data.content && (
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: data.textColor || '#4a4a6a', margin: '0 0 18px', whiteSpace: 'pre-line' }}>
          {data.content}
        </p>
      )}
      {data.buttonText && (
        <span style={{ display: 'inline-block', padding: '10px 24px', background: primaryColor, color: '#fff', borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'default' }}>
          {data.buttonText}
        </span>
      )}
    </div>
  );
}
