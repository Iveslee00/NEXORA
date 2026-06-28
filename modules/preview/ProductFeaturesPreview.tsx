'use client';

import { ProductFeaturesData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

export function ProductFeaturesPreview({ data }: { data: ProductFeaturesData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const columns = isMobile ? '1fr' : data.style === 'grid-6' ? 'repeat(3, 1fr)' : data.style === 'icon-text' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const isIconText = data.style === 'icon-text';
  const isGrid6 = data.style === 'grid-6';
  const isCards = data.style === 'cards';
  const cardBg = isCards
    ? '#ffffff'
    : isIconText
      ? 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(250,245,240,0.74))'
      : isGrid6
        ? 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.78))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,250,252,0.62))';
  const accentBackground = isIconText
    ? 'linear-gradient(135deg, #f5f0ea, #ffffff)'
    : isGrid6
      ? 'linear-gradient(135deg, #eef2ff, #ffffff)'
      : 'linear-gradient(135deg, #e0f2fe, #eef2ff)';

  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {data.eyebrow && <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.7 }}>{data.eyebrow}</p>}
        <h2 style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '1.75rem' : '2.5rem', lineHeight: 1.12, fontWeight: 850, color: titleColor }}>{data.title}</h2>
        {data.subtitle && <p style={{ margin: '14px 0 0', maxWidth: '680px', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{data.subtitle}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: isMobile ? '14px' : '18px', marginTop: isMobile ? '26px' : '34px' }}>
          {data.items.map((item) => (
            <div key={item.id} style={{ minHeight: isIconText ? 112 : isGrid6 ? 142 : 164, borderRadius: isIconText ? 999 : 22, padding: isIconText ? '20px 24px' : '24px 22px', background: cardBg, border: '1px solid rgba(15,23,42,0.08)', boxShadow: isIconText ? '0 14px 34px rgba(47,42,37,0.07)' : '0 18px 46px rgba(15,23,42,0.08)', display: isIconText ? 'grid' : 'block', gridTemplateColumns: isIconText ? '52px 1fr' : undefined, gap: isIconText ? 16 : undefined, alignItems: isIconText ? 'center' : undefined }}>
              <div style={{ width: 46, height: 46, borderRadius: isIconText ? 999 : 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: accentBackground, fontSize: isGrid6 ? 18 : 22, marginBottom: isIconText ? 0 : 16, boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.10)' }}>{item.icon}</div>
              <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', lineHeight: 1.25, fontWeight: 800, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: textColor }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
