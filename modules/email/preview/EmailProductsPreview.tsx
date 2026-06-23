'use client';
import { EmailProductsData, EmailProductItem } from '@/types/emailModules';
import { useDevice } from '@/contexts/DeviceContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';

const PH = 'https://placehold.co/300x300/f0f0f8/6366f1?text=Product';

function ProductCard({
  product, buttonText, primaryColor,
  imgHeight = '100%', style,
}: {
  product: EmailProductItem; buttonText?: string; primaryColor: string;
  imgHeight?: string | number; style?: React.CSSProperties;
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden', ...style }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: '#f5f5f5' }}>
        <img src={product.image || PH} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).src = PH; }} />
        {product.showBadge && product.badgeText && (
          <span style={{ position: 'absolute', top: 6, left: 6, background: '#e53e3e', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
            {product.badgeText}
          </span>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        {product.brand && <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9090b0', margin: '0 0 2px' }}>{product.brand}</p>}
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.3 }}>{product.name}</p>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          {product.originalPrice && <span style={{ fontSize: '10px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>}
          {product.salePrice && <span style={{ fontSize: '13px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>}
        </div>
        {buttonText && (
          <span style={{ display: 'block', textAlign: 'center', marginTop: '8px', padding: '6px 0', background: primaryColor, color: '#fff', borderRadius: '5px', fontSize: '11px', fontWeight: 700, cursor: 'default' }}>
            {buttonText}
          </span>
        )}
      </div>
    </div>
  );
}

export function EmailProductsPreview({ data }: { data: EmailProductsData }) {
  const { isMobile } = useDevice();
  const { primaryColor } = useEmailSettings();
  const { layout, products, title, buttonText } = data;
  const p = primaryColor;

  const header = title && (
    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px', textAlign: 'center' }}>{title}</p>
  );

  const wrapper = (children: React.ReactNode) => (
    <div style={{ background: data.backgroundColor || '#ffffff', padding: '20px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {header}
      {children}
    </div>
  );

  if (layout === '1col') {
    const prod = products[0];
    if (!prod) return wrapper(null);
    return wrapper(
      <div style={{ border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <img src={prod.image || PH} alt={prod.name} style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = PH; }} />
        <div style={{ padding: '16px 18px', textAlign: 'center' }}>
          {prod.brand && <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9090b0', margin: '0 0 4px' }}>{prod.brand}</p>}
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>{prod.name}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
            {prod.originalPrice && <span style={{ fontSize: '12px', color: '#9090b0', textDecoration: 'line-through' }}>{prod.originalPrice}</span>}
            {prod.salePrice && <span style={{ fontSize: '18px', fontWeight: 800, color: '#e53e3e' }}>{prod.salePrice}</span>}
          </div>
          {buttonText && <span style={{ display: 'inline-block', padding: '10px 32px', background: p, color: '#fff', borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'default' }}>{buttonText}</span>}
        </div>
      </div>
    );
  }

  if (layout === 'featured') {
    const prod = products[0];
    if (!prod) return wrapper(null);
    const isRow = !isMobile;
    return wrapper(
      <div style={{ border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: isRow ? 'grid' : 'block', gridTemplateColumns: isRow ? '1fr 1fr' : undefined }}>
        <img src={prod.image || PH} alt={prod.name} style={{ width: '100%', display: 'block', height: isRow ? '100%' : '220px', objectFit: 'cover', minHeight: isRow ? '200px' : undefined }} onError={(e) => { (e.target as HTMLImageElement).src = PH; }} />
        <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {prod.brand && <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9090b0', margin: '0 0 6px' }}>{prod.brand}</p>}
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e', margin: '0 0 10px', lineHeight: 1.2 }}>{prod.name}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '16px', justifyContent: 'center' }}>
            {prod.originalPrice && <span style={{ fontSize: '12px', color: '#9090b0', textDecoration: 'line-through' }}>{prod.originalPrice}</span>}
            {prod.salePrice && <span style={{ fontSize: '22px', fontWeight: 800, color: '#e53e3e' }}>{prod.salePrice}</span>}
          </div>
          {buttonText && <span style={{ display: 'inline-block', padding: '10px 24px', background: p, color: '#fff', borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'default' }}>{buttonText}</span>}
        </div>
      </div>
    );
  }

  if (layout === '2col') {
    return wrapper(
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {products.slice(0, 2).map((prod) => (
          <ProductCard key={prod.id} product={prod} buttonText={buttonText} primaryColor={p} />
        ))}
      </div>
    );
  }

  if (layout === '3col') {
    const cols = isMobile ? 2 : 3;
    return wrapper(
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
        {products.slice(0, 3).map((prod) => (
          <ProductCard key={prod.id} product={prod} buttonText={buttonText} primaryColor={p} />
        ))}
      </div>
    );
  }

  if (layout === '1+2') {
    const [main, ...rest] = products;
    return wrapper(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {main && (
          <div style={{ border: '1px solid #e8e8f4', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            <img src={main.image || PH} alt={main.name} style={{ width: '100%', display: 'block', maxHeight: '240px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = PH; }} />
            <div style={{ padding: '14px 16px', textAlign: 'center' }}>
              {main.brand && <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9090b0', margin: '0 0 4px' }}>{main.brand}</p>}
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>{main.name}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                {main.originalPrice && <span style={{ fontSize: '11px', color: '#9090b0', textDecoration: 'line-through' }}>{main.originalPrice}</span>}
                {main.salePrice && <span style={{ fontSize: '16px', fontWeight: 800, color: '#e53e3e' }}>{main.salePrice}</span>}
              </div>
              {buttonText && <span style={{ display: 'inline-block', padding: '8px 28px', background: p, color: '#fff', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'default' }}>{buttonText}</span>}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {rest.slice(0, 2).map((prod) => (
            <ProductCard key={prod.id} product={prod} buttonText={buttonText} primaryColor={p} />
          ))}
        </div>
      </div>
    );
  }

  return wrapper(null);
}
