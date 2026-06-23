'use client';

import React, { useRef, useState, useCallback } from 'react';
import { PageModule } from '@/types/modules';
import { EmailPageModule } from '@/types/emailModules';
import { ModulePreviewRenderer } from '@/modules/preview/ModulePreviewRenderer';
import { EmailModulePreviewRenderer } from '@/modules/email/preview/EmailModulePreviewRenderer';
import { DeviceContext } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';
import { PageMode } from '@/app/page';
import { X, Camera, Monitor, Smartphone } from 'lucide-react';

type DeviceMode = 'desktop' | 'mobile';

interface Props {
  pageMode: PageMode;
  modules: PageModule[];
  emailModules: EmailPageModule[];
  onClose: () => void;
}

// html2canvas doesn't support aspect-ratio. Before capture we convert every
// element that uses it to an explicit pixel height, then restore afterwards.
async function fixAspectRatio(root: HTMLElement): Promise<() => void> {
  type Fix = { el: HTMLElement; origAR: string; origH: string };
  const fixes: Fix[] = [];

  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el.style.aspectRatio) {
      fixes.push({ el, origAR: el.style.aspectRatio, origH: el.style.height });
      el.style.height = el.getBoundingClientRect().height + 'px';
      el.style.aspectRatio = 'unset';
    }
  });

  // Wait for reflow
  await new Promise<void>((r) => requestAnimationFrame(() => { requestAnimationFrame(() => r()); }));

  return () => {
    fixes.forEach(({ el, origAR, origH }) => {
      el.style.aspectRatio = origAR;
      el.style.height = origH;
    });
  };
}

export function PreviewModal({ pageMode, modules, emailModules, onClose }: Props) {
  const { pageBackgroundColor, pageBackgroundImage } = useGlobalSettings();
  const emailSettings = useEmailSettings();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [capturing, setCapturing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isEmail = pageMode === 'email';
  const isMobile = deviceMode === 'mobile';

  const handleScreenshot = useCallback(async () => {
    if (!contentRef.current || capturing) return;
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = contentRef.current;

      // Wait for all images to finish loading
      const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(
        imgs.map((img) =>
          img.complete ? Promise.resolve() : new Promise<void>((r) => { img.onload = () => r(); img.onerror = () => r(); })
        )
      );

      // Scroll to top
      const prevScroll = scrollRef.current?.scrollTop ?? 0;
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      // Fix aspect-ratio elements (not supported by html2canvas 1.x)
      const restoreAR = await fixAspectRatio(el);

      const w = el.offsetWidth;
      const h = el.scrollHeight;

      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: isEmail
          ? (emailSettings.backgroundColor || '#f4f4f4')
          : (pageBackgroundColor || '#ffffff'),
        logging: false,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
        imageTimeout: 15000,
      });

      // Restore aspect-ratio
      restoreAR();
      if (scrollRef.current) scrollRef.current.scrollTop = prevScroll;

      const link = document.createElement('a');
      link.download = `preview-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    } catch (e) {
      console.error('Screenshot failed', e);
    } finally {
      setCapturing(false);
    }
  }, [capturing, isEmail, emailSettings.backgroundColor, pageBackgroundColor]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-200">
            {isEmail ? '電子報預覽' : '活動頁面預覽'}
          </span>
          {!isEmail && (
            <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${!isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Monitor size={13} /><span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Smartphone size={13} /><span>Mobile</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScreenshot}
            disabled={capturing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-wait text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Camera size={14} />
            {capturing ? '截圖中…' : '截圖 JPG'}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Preview scroll area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto ${isEmail ? '' : isMobile ? 'bg-slate-800' : 'bg-slate-950'}`}
        style={isEmail ? { backgroundColor: emailSettings.backgroundColor || '#f4f4f4' } : {}}
      >
        {isEmail ? (
          <div className="flex justify-center py-8 px-4">
            <div
              ref={contentRef}
              style={{ width: '600px', maxWidth: '100%', backgroundColor: emailSettings.contentBgColor || '#ffffff' }}
            >
              {emailModules.map((module) => (
                <EmailModulePreviewRenderer key={module.id} module={module} />
              ))}
            </div>
          </div>
        ) : (
          <DeviceContext.Provider value={{ isMobile }}>
            {isMobile ? (
              <div className="flex justify-center py-6 px-4">
                <div style={{ width: '390px' }} className="shadow-2xl rounded-2xl overflow-hidden border border-slate-600">
                  <div className="flex items-center justify-between px-5 py-2 bg-slate-900 text-slate-400 text-xs border-b border-slate-700">
                    <span className="font-medium">9:41</span>
                    <div className="flex gap-1 items-center">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="3" height="7" rx="1"/><rect x="4" y="2" width="3" height="8" rx="1"/><rect x="8" y="0" width="3" height="10" rx="1"/><rect x="12" y="4" width="2" height="6" rx="1" opacity=".4"/></svg>
                    </div>
                  </div>
                  <div
                    ref={contentRef}
                    style={{
                      width: '390px',
                      ...(pageBackgroundColor ? { backgroundColor: pageBackgroundColor } : {}),
                      ...(pageBackgroundImage ? { backgroundImage: `url("${pageBackgroundImage}")`, backgroundRepeat: 'repeat-y', backgroundSize: '100% auto' } : {}),
                    }}
                  >
                    {modules.map((module) => (
                      <ModulePreviewRenderer key={module.id} module={module} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={contentRef}
                style={{
                  ...(pageBackgroundColor ? { backgroundColor: pageBackgroundColor } : {}),
                  ...(pageBackgroundImage ? { backgroundImage: `url("${pageBackgroundImage}")`, backgroundRepeat: 'repeat-y', backgroundSize: '100% auto' } : {}),
                }}
              >
                {modules.map((module) => (
                  <ModulePreviewRenderer key={module.id} module={module} />
                ))}
              </div>
            )}
          </DeviceContext.Provider>
        )}
      </div>
    </div>
  );
}
