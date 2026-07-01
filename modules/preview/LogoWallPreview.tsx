'use client';

import { LogoWallData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { hoverLift, moduleSurface, softBorder } from './visualStyles';

export function LogoWallPreview({ data }: { data: LogoWallData }) {
  const { isMobile } = useDevice();

  return (
    <section style={{ ...moduleSurface(data.backgroundColor), padding: isMobile ? '24px 16px 32px' : '36px 24px 44px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '20px 28px' : '32px 48px' }}>
          {data.logos.map((logo) => (
            <div key={logo.id} style={{ position: 'relative', padding: '14px 18px', borderRadius: 18, background: 'rgba(255,255,255,0.86)', border: softBorder, boxShadow: '0 10px 26px rgba(15,23,42,0.06)', ...hoverLift }}>
              <div style={{ position: 'relative', width: '160px', aspectRatio: '160 / 60', overflow: 'hidden', zIndex: 1 }}>
                <PreviewImage src={logo.image} alt={logo.alt} label="Logo" spec={IMAGE_SPECS.logo} objectFit="contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
