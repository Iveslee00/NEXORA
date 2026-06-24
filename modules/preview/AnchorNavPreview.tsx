'use client';

import { AnchorNavData, PageModule } from '@/types/modules';
import { getAnchorTargets } from '@/lib/modules/anchors';

interface Props {
  data: AnchorNavData;
  moduleId: string;
  modules: PageModule[];
}

export function AnchorNavPreview({ data, moduleId, modules }: Props) {
  const hidden = new Set(data.hiddenTargetIds ?? []);
  const targets = getAnchorTargets(modules, moduleId).filter((target) => !hidden.has(target.id));

  return (
    <nav style={{ background: data.backgroundColor || 'transparent', padding: '18px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {targets.length === 0 ? (
          <span style={{ fontSize: '13px', color: '#9090b0' }}>請先設定錨點名稱</span>
        ) : targets.map((target) => (
          <a
            key={target.id}
            href={target.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '36px',
              padding: '8px 16px',
              borderRadius: '999px',
              border: '1px solid #dfe3f0',
              background: '#ffffff',
              color: data.textColor || '#1a1a2e',
              fontSize: '14px',
              fontWeight: 700,
              lineHeight: 1.2,
              textDecoration: 'none',
            }}
          >
            {target.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
