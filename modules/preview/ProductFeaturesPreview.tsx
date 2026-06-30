'use client';

import { ProductFeaturesData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { hoverLift, moduleSurface, premiumShadow, softBorder } from './visualStyles';

export function ProductFeaturesPreview({ data }: { data: ProductFeaturesData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const columns = isMobile ? '1fr' : data.style === 'grid-6' ? 'repeat(3, 1fr)' : data.style === 'icon-text' || data.style === 'cards' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
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
    <section style={{ ...moduleSurface(data.backgroundColor || '#ffffff'), padding: isMobile ? '36px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {data.eyebrow && <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.7 }}>{data.eyebrow}</p>}
        <h2 style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '1.75rem' : '2.5rem', lineHeight: 1.12, fontWeight: 850, color: titleColor }}>{data.title}</h2>
        {data.subtitle && <p style={{ margin: '14px 0 0', maxWidth: '680px', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{data.subtitle}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: isMobile ? '14px' : isCards ? '22px' : '18px', marginTop: isMobile ? '26px' : '34px' }}>
          {data.items.map((item, index) => (
            <div key={item.id} style={{ position: 'relative', minWidth: 0, minHeight: isIconText ? 112 : isCards ? 190 : isGrid6 ? 142 : 164, borderRadius: isIconText ? 24 : isCards ? 28 : 22, padding: isIconText ? '20px 24px' : isCards ? '30px 28px 28px' : '24px 22px', background: cardBg, border: isCards ? '1px solid rgba(79,70,229,0.13)' : softBorder, boxShadow: isIconText ? '0 14px 34px rgba(47,42,37,0.07)' : isCards ? '0 24px 70px rgba(79,70,229,0.11)' : premiumShadow, display: isIconText ? 'grid' : 'block', gridTemplateColumns: isIconText ? (isMobile ? '44px 1fr' : '52px 1fr') : undefined, gap: isIconText ? 16 : undefined, alignItems: isIconText ? 'center' : undefined, overflow: 'hidden', ...hoverLift }}>
              <span style={{ position: 'absolute', inset: 0, opacity: isCards ? 0.72 : 0.42, backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.32), transparent 42%), linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)', backgroundSize: 'auto, 18px 18px', pointerEvents: 'none' }} data-visual="featureTextureLayer" />
              <span style={{ position: 'absolute', right: 22, top: 20, fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', color: isCards ? 'rgba(79,70,229,0.42)' : 'rgba(15,23,42,0.26)' }} data-visual="featureIndexBadge">{String(index + 1).padStart(2, '0')}</span>
              <div style={{ width: isCards ? 54 : 46, height: isCards ? 54 : 46, borderRadius: isIconText ? 999 : isCards ? 20 : 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: accentBackground, fontSize: isCards ? 24 : isGrid6 ? 18 : 22, marginBottom: isIconText ? 0 : isCards ? 22 : 16, boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.10)' }}>{item.icon}</div>
              <div>
              <h3 style={{ margin: '0 0 8px', fontSize: isCards ? '1.18rem' : '1.05rem', lineHeight: 1.25, fontWeight: 800, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: isCards ? '0.96rem' : '0.92rem', lineHeight: isCards ? 1.75 : 1.65, color: textColor }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
