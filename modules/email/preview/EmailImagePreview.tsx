'use client';
import { EmailImageData } from '@/types/emailModules';

const PH = 'https://placehold.co/600x300/1a1a2e/6366f1?text=Image';

export function EmailImagePreview({ data }: { data: EmailImageData }) {
  return (
    <div style={{ background: data.backgroundColor || '#ffffff', lineHeight: 0 }}>
      <img
        src={data.image || PH}
        alt={data.altText || ''}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onError={(e) => { (e.target as HTMLImageElement).src = PH; }}
      />
    </div>
  );
}
