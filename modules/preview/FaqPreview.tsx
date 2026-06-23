'use client';

import { useState } from 'react';
import { FaqData } from '@/types/modules';
import { ChevronDown } from 'lucide-react';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

export function FaqPreview({ data }: { data: FaqData }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  return (
    <section style={{ background: data.backgroundColor || 'transparent', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} style={{ border: '1px solid #e8e8f4', borderRadius: '10px', overflow: 'hidden' }}>
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
