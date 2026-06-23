'use client';
import { EmailPromoData } from '@/types/emailModules';

const PH = 'https://placehold.co/120x80/f0f0f8/6366f1?text=IMG';

export function EmailPromoPreview({ data }: { data: EmailPromoData }) {
  const bg = data.backgroundColor || '#ffffff';
  const boxBg = data.boxBgColor || '#f8f8fc';
  const cols = data.columns || 2;
  const boxes = data.boxes.slice(0, cols * 4);

  return (
    <div style={{ background: bg, padding: '20px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {data.sectionTitle && (
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', textAlign: 'center', margin: '0 0 14px' }}>{data.sectionTitle}</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
        {boxes.map((box) => (
          <div key={box.id} style={{ background: boxBg, borderRadius: '8px', overflow: 'hidden', border: `2px solid ${box.accentColor || '#e8e8f4'}` }}>
            {box.image && (
              <img src={box.image} alt={box.title} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PH; }} />
            )}
            <div style={{ padding: '12px' }}>
              {box.title && <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.3 }}>{box.title}</p>}
              {box.description && <p style={{ fontSize: '11px', color: '#6060a0', margin: 0, lineHeight: 1.5 }}>{box.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
