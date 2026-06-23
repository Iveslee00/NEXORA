'use client';
import { EmailBankInfoData } from '@/types/emailModules';

export function EmailBankInfoPreview({ data }: { data: EmailBankInfoData }) {
  const cols = data.columns ?? (data.items.length <= 1 ? 1 : 2);
  const align = data.alignment || 'center';

  return (
    <div style={{ background: data.backgroundColor || '#f8f8fc', padding: '24px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {(data.title || data.subtitle) && (
        <div style={{ textAlign: align, marginBottom: '18px' }}>
          {data.title && <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>{data.title}</h2>}
          {data.subtitle && <p style={{ fontSize: '11px', color: '#9090b0', margin: 0 }}>{data.subtitle}</p>}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
        {data.items.map((item) => (
          <div key={item.id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex' }}>
            <div style={{ width: '4px', background: item.accentColor || '#6366f1', flexShrink: 0 }} />
            <div style={{ padding: '12px 14px', flex: 1, textAlign: align === 'center' ? 'center' : align }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
                {item.logo && <img src={item.logo} alt={item.cardName} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{item.cardName}</p>
              </div>
              {item.condition && <p style={{ fontSize: '10px', color: '#9090b0', margin: '0 0 3px' }}>{item.condition}</p>}
              {item.benefit && <p style={{ fontSize: '13px', fontWeight: 700, color: item.accentColor || '#6366f1', margin: '2px 0' }}>{item.benefit}</p>}
              {item.note && <p style={{ fontSize: '10px', color: '#9090b0', margin: 0 }}>{item.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {(data.disclaimer || data.linkText) && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {data.disclaimer && <p style={{ fontSize: '10px', color: '#b0b0c0', margin: 0 }}>{data.disclaimer}</p>}
          {data.linkText && <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', cursor: 'default' }}>{data.linkText}</span>}
        </div>
      )}
    </div>
  );
}
