'use client';
import { EmailKvData } from '@/types/emailModules';

const PH = 'https://placehold.co/600x240/1a1a2e/6366f1?text=Email+Banner';

export function EmailKvPreview({ data }: { data: EmailKvData }) {
  return (
    <div style={{ background: data.backgroundColor || '#1a1a2e', lineHeight: 0 }}>
      <img
        src={data.image || PH}
        alt={data.altText || ''}
        style={{ width: '100%', display: 'block', maxHeight: '260px', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).src = PH; }}
      />
    </div>
  );
}
