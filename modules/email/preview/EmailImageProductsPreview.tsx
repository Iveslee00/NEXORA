'use client';
import { EmailImageProductsData } from '@/types/emailModules';
import { useDevice } from '@/contexts/DeviceContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';

const PH_BANNER = 'https://placehold.co/220x360/1a1a2e/6366f1?text=Banner';
const PH_PRODUCT = 'https://placehold.co/280x280/f0f0f8/6366f1?text=Product';

export function EmailImageProductsPreview({ data }: { data: EmailImageProductsData }) {
  const { isMobile } = useDevice();
  const { primaryColor } = useEmailSettings();
  const imgRight = data.imagePosition === 'right';

  if (isMobile) {
    return (
      <div style={{ background: data.backgroundColor || '#ffffff', padding: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
          <img src={data.bannerImage || PH_BANNER} alt={data.bannerTitle || ''} style={{ width: '100%', display: 'block', height: '160px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = PH_BANNER; }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {data.products.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={p.image || PH_PRODUCT} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PH_PRODUCT; }} />
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 3px' }}>{p.name}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {p.originalPrice && <span style={{ fontSize: '10px', color: '#9090b0', textDecoration: 'line-through' }}>{p.originalPrice}</span>}
                  {p.salePrice && <span style={{ fontSize: '12px', fontWeight: 700, color: '#e53e3e' }}>{p.salePrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const bannerCol = (
    <div style={{ width: '220px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
      <img src={data.bannerImage || PH_BANNER} alt={data.bannerTitle || ''} style={{ width: '100%', display: 'block', minHeight: '200px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = PH_BANNER; }} />
    </div>
  );

  const productsCol = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.products.map((p) => (
        <div key={p.id} style={{ background: '#fff', border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
          <img src={p.image || PH_PRODUCT} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).src = PH_PRODUCT; }} />
          <div style={{ padding: '10px 12px', flex: 1 }}>
            {p.brand && <p style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9090b0', margin: '0 0 2px' }}>{p.brand}</p>}
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.3 }}>{p.name}</p>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {p.originalPrice && <span style={{ fontSize: '10px', color: '#9090b0', textDecoration: 'line-through' }}>{p.originalPrice}</span>}
              {p.salePrice && <span style={{ fontSize: '12px', fontWeight: 700, color: '#e53e3e' }}>{p.salePrice}</span>}
            </div>
            {data.buttonText && (
              <span style={{ display: 'inline-block', marginTop: '6px', padding: '4px 12px', background: primaryColor, color: '#fff', borderRadius: '5px', fontSize: '11px', fontWeight: 700, cursor: 'default' }}>
                {data.buttonText}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: data.backgroundColor || '#ffffff', padding: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {imgRight ? <>{productsCol}{bannerCol}</> : <>{bannerCol}{productsCol}</>}
      </div>
    </div>
  );
}
