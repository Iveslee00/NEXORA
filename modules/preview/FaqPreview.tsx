'use client';

import { useState } from 'react';
import { FaqData } from '@/types/modules';
import { ChevronDown } from 'lucide-react';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { hoverLift, moduleSurface, premiumShadow, softBorder } from './visualStyles';

export function FaqPreview({ data }: { data: FaqData }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const faqSignalLine: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    background: isMobile ? 'linear-gradient(180deg, rgba(99,102,241,0.74), rgba(14,165,198,0.52))' : 'linear-gradient(180deg, rgba(99,102,241,0.88), rgba(14,165,198,0.58))',
    opacity: 0.88,
  };

  return (
    <section style={{ ...moduleSurface(data.backgroundColor), padding: isMobile ? '28px 16px 36px' : '56px 24px 64px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} style={{ position: 'relative', border: softBorder, borderRadius: '18px', overflow: 'hidden', background: '#ffffff', boxShadow: isOpen ? premiumShadow : '0 10px 28px rgba(15,23,42,0.06)', ...hoverLift }}>
                <span style={faqSignalLine} />
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  style={{
                    width: '100%', padding: '18px 22px', fontSize: '15px', fontWeight: 600,
                    color: '#1a1a2e', background: isOpen ? '#f8f8fc' : 'transparent',
                    border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '16px', textAlign: 'left', fontFamily: 'inherit',
                    ...titleStyle,
                  }}
                >
                  <span>{item.question}</span>
                  <ChevronDown size={18} style={{ flexShrink: 0, color: buttonColor, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 22px 18px', fontSize: '14px', lineHeight: 1.75, color: '#4a4a6a', ...textStyle }}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
