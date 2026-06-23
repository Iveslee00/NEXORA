'use client';

import { StickySidebarData } from '@/types/modules';

export function StickySidebarPreview({ data }: { data: StickySidebarData }) {
  const isRight = data.position !== 'left';

  return (
    <div style={{ background: 'transparent', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
      <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#9090b0', whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Fixed sidebar · {isRight ? 'right' : 'left'} side
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {data.items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 14px',
              background: item.bgColor || '#6366f1',
              color: '#ffffff',
              fontSize: '12px', fontWeight: 600,
              borderRadius: i === 0 ? (isRight ? '8px 0 0 0' : '0 8px 0 0') : i === data.items.length - 1 ? (isRight ? '0 0 0 8px' : '0 0 8px 0') : '0',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
