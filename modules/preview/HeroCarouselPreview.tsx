'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeroCarouselData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

const heightMap = {
  small:  { desktopRatio: '1920 / 480', mobileFullRatio: '750 / 750', mobileImgRatio: '750 / 750' },
  medium: { desktopRatio: '1920 / 640', mobileFullRatio: '750 / 850', mobileImgRatio: '750 / 850' },
  large:  { desktopRatio: '1920 / 800', mobileFullRatio: '750 / 950', mobileImgRatio: '750 / 950' },
};

export function HeroCarouselPreview({ data }: { data: HeroCarouselData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = data.slides;
  const total = slides.length;
  const h = heightMap[data.height ?? 'medium'];
  const currentSlideHasText = slides[current]?.showText !== false;
  const frameStyle: React.CSSProperties = isMobile
    ? currentSlideHasText ? {} : { aspectRatio: h.mobileFullRatio }
    : { aspectRatio: h.desktopRatio };

  const goTo = useCallback((idx: number) => setCurrent((idx + total) % total), [total]);
  const prev = () => { setPaused(true); goTo(current - 1); };
  const next = () => { setPaused(true); goTo(current + 1); };

  useEffect(() => {
    if (!data.autoPlay || paused || total <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 4000);
    return () => clearInterval(id);
  }, [data.autoPlay, paused, total]);

  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 6000);
    return () => clearTimeout(id);
  }, [paused, current]);

  if (!total) {
    return (
      <section style={{ background: data.backgroundColor || '#1a1a2e', aspectRatio: isMobile ? h.mobileFullRatio : h.desktopRatio, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>尚未新增任何 slide</p>
      </section>
    );
  }

  const navBtn: React.CSSProperties = {
    position: 'absolute',
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 3, color: '#fff',
  };

  const imgCenterTop = isMobile && currentSlideHasText ? `calc(50vw / (${h.mobileImgRatio}))` : '50%';
  const imgRight = '14px';
  const imgLeft = '8px';

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', background: data.backgroundColor || '#1a1a2e', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto', ...frameStyle }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides strip */}
      <div style={{ display: 'flex', transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', height: '100%' }}>
        {slides.map((s) => {
          const showText = s.showText !== false;
          const textBg = s.textBgColor || '#1a1a2e';
          const desktopOverlayBg = textBg.includes('gradient(')
            ? textBg
            : `linear-gradient(90deg, ${textBg} 0%, rgba(26,26,46,0.72) 38%, rgba(26,26,46,0) 72%)`;
          const overlay = s.overlayOpacity ? `rgba(0,0,0,${s.overlayOpacity / 100})` : undefined;
          const align = s.alignment ?? 'left';
          const alignStyle: React.CSSProperties =
            align === 'center' ? { textAlign: 'center', alignItems: 'center' }
            : align === 'right' ? { textAlign: 'right', alignItems: 'flex-end' }
            : { textAlign: 'left', alignItems: 'flex-start' };

          const imageSpecs = getKvImageSpecs(data.height, showText);
          const imageSpec = isMobile ? imageSpecs.mobile : imageSpecs.desktop;
          const imageSrc = isMobile ? (s.mobileImage || s.image) : s.image;
          const imageEl = (
            <PreviewImage src={imageSrc} alt={s.title} label={isMobile ? 'KV 輪播 M' : showText ? 'KV 輪播 PC 圖片區' : 'KV 輪播 PC 純 Banner'} spec={imageSpec} tone="dark" />
          );
          const imageLayer = (
            <>
              {imageEl}
              {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
            </>
          );
          const hasBannerLink = Boolean(s.buttonLink && s.buttonLink !== '#');

          return (
            <div
              key={s.id}
              style={{
                flex: '0 0 100%',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile && showText ? 'auto' : '100%',
                position: 'relative',
              }}
            >
              {!showText && (
                <div style={{ flex: '0 0 100%', position: 'relative', overflow: 'hidden' }}>
                  {hasBannerLink ? (
                    <a href={s.buttonLink} style={{ position: 'absolute', inset: 0, display: 'block', cursor: 'pointer' }}>
                      {imageLayer}
                    </a>
                  ) : imageLayer}
                </div>
              )}

              {/* Mobile: image on top */}
              {showText && isMobile && (
                <div style={{ aspectRatio: h.mobileImgRatio, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {imageEl}
                  {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
                </div>
              )}

              {showText && !isMobile && (
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  {imageEl}
                  {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
                </div>
              )}

              {/* Text panel — over desktop image, bottom on mobile */}
              {showText && (
                <div
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    inset: isMobile ? undefined : 0,
                    zIndex: 1,
                    background: isMobile ? textBg : desktopOverlayBg,
                    flex: isMobile ? '0 0 auto' : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: isMobile ? '20px 18px' : '0',
                    overflow: 'hidden',
                    ...alignStyle,
                  }}
                >
                  <div style={{ width: '100%', maxWidth: isMobile ? undefined : '1080px', margin: isMobile ? undefined : '0 auto', padding: isMobile ? 0 : '0 40px', display: 'flex', flexDirection: 'column', ...alignStyle }}>
                    <div style={{ maxWidth: isMobile ? 'none' : '430px' }}>
                      {s.title && (
                        <h1 style={{ fontSize: isMobile ? '1.15rem' : '1.75rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: s.titleColor || '#ffffff', marginBottom: '8px' }}>
                          {s.title}
                        </h1>
                      )}
                      {s.subtitle && (
                        <p style={{ fontSize: isMobile ? '0.8rem' : '0.95rem', lineHeight: 1.6, color: s.textColor || 'rgba(255,255,255,0.85)', marginBottom: '16px', maxWidth: '320px' }}>
                          {s.subtitle}
                        </p>
                      )}
                      {s.buttonText && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: isMobile ? '8px 18px' : '10px 22px', background: buttonColor, color: '#fff', borderRadius: '7px', fontWeight: 700, fontSize: isMobile ? '12px' : '13px', cursor: 'default' }}>
                          {s.buttonText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev/Next — anchored in image area */}
      {total > 1 && (
        <>
          <button onClick={prev} style={{ ...navBtn, left: imgLeft, top: imgCenterTop, transform: 'translateY(-50%)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} style={{ ...navBtn, right: imgRight, top: imgCenterTop, transform: 'translateY(-50%)' }}>
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots — anchored at bottom of image area */}
      {total > 1 && (
        <div style={{
          position: 'absolute',
          bottom: isMobile && currentSlideHasText ? 'auto' : '16px',
          top: isMobile && currentSlideHasText ? `calc((100vw - 32px) / (${h.mobileImgRatio}) - 22px)` : undefined,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '7px', zIndex: 3,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); goTo(i); }}
              style={{ width: i === current ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === current ? '#ffffff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
