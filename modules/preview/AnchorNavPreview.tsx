'use client';

import { AnchorNavData, PageModule } from '@/types/modules';
import { getAnchorTargets } from '@/lib/modules/anchors';
import { useDevice } from '@/contexts/DeviceContext';
import { backgroundStyle, textColorStyle } from '@/lib/styles/colorStyles';

interface Props {
  data: AnchorNavData;
  moduleId: string;
  modules: PageModule[];
}

export function AnchorNavPreview({ data, moduleId, modules }: Props) {
  const { isMobile } = useDevice();
  const hidden = new Set(data.hiddenTargetIds ?? []);
  const targets = getAnchorTargets(modules, moduleId).filter((target) => !hidden.has(target.id));

  return (
    <nav style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '14px 16px' : '18px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: isMobile ? '8px' : '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              width: '100%',
              flex: isMobile ? '0 0 calc(50% - 4px)' : '0 0 168px',
              minHeight: isMobile ? '34px' : '38px',
              padding: '8px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(99,102,241,0.28)',
              ...backgroundStyle(data.buttonColor || 'linear-gradient(180deg, #1f2440 0%, #15192d 100%)'),
              boxShadow: '0 8px 20px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
              color: '#ffffff',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 700,
              lineHeight: 1.2,
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={textColorStyle(data.textColor || '#ffffff')}>{target.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
