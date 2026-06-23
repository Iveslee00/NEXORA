'use client';

import { LogoWallData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const PLACEHOLDER = 'https://placehold.co/160x60/e0e0f0/9090c0?text=Brand';

export function LogoWallPreview({ data }: { data: LogoWallData }) {
  const { isMobile } = useDevice();

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '20px 28px' : '32px 48px' }}>
          {data.logos.map((logo) => (
            <div key={logo.id} style={{ opacity: 0.5, filter: 'grayscale(100%)' }}>
              <img
                src={logo.image || PLACEHOLDER}
                alt={logo.alt}
                style={{ height: isMobile ? '28px' : '36px', width: 'auto', maxWidth: '130px', objectFit: 'contain', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
