'use client';

import {
  ProductBenefitsData,
  ProductComparisonData,
  ProductProofData,
  ProductPurchaseData,
  ProductStepsData,
} from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function ProductHead({ eyebrow, title, subtitle, titleColor, textColor, centered = false }: {
  eyebrow: string; title: string; subtitle: string; titleColor: string; textColor: string; centered?: boolean;
}) {
  return (
    <div style={{ maxWidth: 720, margin: centered ? '0 auto 30px' : '0 0 30px', textAlign: centered ? 'center' : 'left' }}>
      {eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{eyebrow}</p>}
      <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.08, fontWeight: 900, color: titleColor }}>{title}</h2>
      {subtitle && <p style={{ margin: '14px 0 0', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{subtitle}</p>}
    </div>
  );
}

export function ProductBenefitsPreview({ data }: { data: ProductBenefitsData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const columns = isMobile ? '1fr' : data.style === 'stacked' ? '1fr' : 'repeat(3, 1fr)';
  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} />
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 18 }}>
          {data.items.map((item) => (
            <article key={item.id} style={{ borderRadius: 26, padding: isMobile ? 20 : 28, background: data.style === 'pain-solution' ? 'linear-gradient(180deg, #f8fafc, #eef6ff)' : '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
              <p style={{ margin: '0 0 18px', fontSize: data.style === 'metric-cards' ? '2rem' : '0.85rem', fontWeight: 900, color: titleColor, opacity: data.style === 'metric-cards' ? 1 : 0.64 }}>{item.metric}</p>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.12rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductStepsPreview({ data }: { data: ProductStepsData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : data.style === 'timeline' ? '1fr' : `repeat(${Math.min(data.items.length, 3)}, 1fr)`, gap: 18 }}>
          {data.items.map((item) => (
            <article key={item.id} style={{ display: data.style === 'timeline' && !isMobile ? 'grid' : 'block', gridTemplateColumns: '120px 1fr', gap: 18, borderRadius: 26, padding: 22, background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 16px 42px rgba(15,23,42,0.07)' }}>
              <div style={{ display: 'inline-flex', width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 18, background: 'linear-gradient(135deg, #e0f2fe, #eef2ff)', fontSize: '1.35rem', lineHeight: 1, fontWeight: 900, color: titleColor }}>{item.step}</div>
              <div>
                {data.style === 'image-cards' && (
                  <div style={{ position: 'relative', aspectRatio: isMobile ? '750 / 900' : '900 / 640', marginBottom: 16, overflow: 'hidden', borderRadius: 16 }}>
                    <PreviewImage src={isMobile ? (item.mobileImage || item.image) : item.image} alt="" label={isMobile ? '步驟圖 M' : '步驟圖 PC'} spec={isMobile ? IMAGE_SPECS.productSceneMobile : IMAGE_SPECS.productScene} variant="scene" />
                  </div>
                )}
                <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductComparisonPreview({ data }: { data: ProductComparisonData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered={data.style === 'before-after'} />
        <div style={{ overflow: 'hidden', borderRadius: 26, border: '1px solid rgba(15,23,42,0.08)', background: '#ffffff', boxShadow: '0 20px 56px rgba(15,23,42,0.09)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', background: 'linear-gradient(135deg, #f8fafc, #eef6ff)', color: titleColor, fontWeight: 850 }}>
            <div style={{ padding: '16px 18px' }}>項目</div>
            <div style={{ padding: '16px 18px' }}>{data.beforeTitle}</div>
            <div style={{ padding: '16px 18px' }}>{data.afterTitle}</div>
          </div>
          {data.items.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr 1fr', borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <strong style={{ padding: '16px 18px', color: titleColor }}>{item.label}</strong>
              <p style={{ margin: 0, padding: '16px 18px', color: textColor }}>{item.before}</p>
              <p style={{ margin: 0, padding: '16px 18px', color: textColor }}>{item.after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductProofPreview({ data }: { data: ProductProofData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
          {data.items.map((item) => (
            <article key={item.id} style={{ borderRadius: 26, padding: 26, background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', textAlign: 'center', boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'inline-flex', minWidth: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'linear-gradient(135deg, #e0f2fe, #eef2ff)', padding: '0 14px', fontWeight: 900, color: titleColor, marginBottom: 16, boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.12)' }}>{item.badge}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.08rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductPurchasePreview({ data }: { data: ProductPurchaseData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#ffffff';
  const textColor = data.textColor || 'rgba(255,255,255,0.78)';
  return (
    <section style={{ background: data.backgroundColor || '#0f172a', padding: isMobile ? '40px 16px' : '64px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', color: textColor }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered={data.style === 'cta'} />
        <div style={{ textAlign: data.style === 'cta' ? 'center' : 'left', marginBottom: 28 }}>
          <a href={data.buttonLink || '#'} style={{ display: 'inline-flex', minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: '#ffffff', color: '#0f172a', padding: '0 32px', fontWeight: 850, textDecoration: 'none', boxShadow: '0 16px 36px rgba(0,0,0,0.18)' }}>{data.buttonText}</a>
        </div>
        {data.style !== 'cta' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(data.products.length, 3)}, 1fr)`, gap: 18 }}>
            {data.products.map((product) => (
              <article key={product.id} style={{ overflow: 'hidden', borderRadius: 22, background: '#ffffff', color: '#0f172a', boxShadow: '0 18px 48px rgba(0,0,0,0.18)' }}>
                <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#eef2ff' }}>
                  <PreviewImage src={product.image} alt="" label="商品圖" spec={IMAGE_SPECS.product} objectFit="contain" variant="product" />
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 750, color: '#64748b' }}>{product.brand}</p>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 850 }}>{product.name}</h3>
                  <p style={{ margin: 0, fontWeight: 900, color: '#ef4444' }}>{product.salePrice}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
