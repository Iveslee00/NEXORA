'use client';

import React from 'react';
import { PageModule } from '@/types/modules';
import { EmailPageModule } from '@/types/emailModules';
import { ModulePreviewRenderer } from '@/modules/preview/ModulePreviewRenderer';
import { EmailModulePreviewRenderer } from '@/modules/email/preview/EmailModulePreviewRenderer';
import { DeviceContext } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';
import { PageMode } from '@/app/page';
import { getBannerProductsLayoutLabel } from '@/lib/modules/bannerProducts';
import { getModuleAnchorId } from '@/lib/modules/anchors';
import { SizeSpecGuide } from './SizeSpecGuide';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, LayoutTemplate, Monitor, Smartphone, Mail, Ruler } from 'lucide-react';

const DESKTOP_CANVAS_WIDTH = 1200;
const DESKTOP_CANVAS_PADDING = 32;

// ── Campaign module labels ────────────────────────────────────────────────────
const campaignLabels: Record<string, string> = {
  'title': '標題區塊', 'hero': 'KV', 'split-section': '圖文區塊',
  'product-grid': '商品列表', 'banner-products': '活動 Banner + 商品',
  'product-banner': '單品主打', 'product-carousel': '商品輪播',
  'logo-wall': '品牌 Logo 牆', 'cta': '行動呼籲', 'faq': 'FAQ',
  'sticky-sidebar': '浮動工具列', 'article-text': '文章內容',
  'article-image': '文章搭配圖片', 'hero-carousel': 'KV 輪播', 'bank-promo': '銀行優惠',
  'anchor-nav': '錨點導覽',
};

const getCampaignModuleLabel = (module: PageModule) => {
  if (module.type === 'banner-products') return getBannerProductsLayoutLabel(module.data);
  return campaignLabels[module.type] ?? module.type;
};

const emailLabels: Record<string, string> = {
  'email-title': '標題', 'email-image': '純圖片', 'email-promo': '活動區塊',
  'email-kv': 'KV 主視覺', 'email-products': '商品',
  'email-image-products': '圖片帶商品', 'email-bank-info': '銀行資訊',
  'email-article': '文章', 'email-coupon': '折價券',
};

// ── Sortable campaign module ──────────────────────────────────────────────────
interface SortableModuleProps {
  module: PageModule;
  modules: PageModule[];
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableModule({ module, modules, isSelected, onSelect, onDelete, onDuplicate }: SortableModuleProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
  const [hovered, setHovered] = React.useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const shadow = isSelected
    ? 'inset 0 0 0 2px #6366f1'
    : hovered
    ? 'inset 0 0 0 1px rgba(99,102,241,0.45), 0 1px 0 0 rgba(0,0,0,0.06)'
    : '0 0 0 1px rgba(0,0,0,0.08), 0 1px 0 0 rgba(0,0,0,0.05)';

  return (
    <div ref={setNodeRef} id={'anchorName' in module.data && module.data.anchorName ? getModuleAnchorId(module.id) : undefined} style={style} className="relative group">
      <div
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative cursor-pointer transition-shadow"
        style={{ boxShadow: shadow }}
      >
        <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-medium transition-opacity pointer-events-none ${
          isSelected ? 'opacity-100 bg-indigo-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-800/90 text-slate-300'
        }`}>
          {getCampaignModuleLabel(module)}
        </div>
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-2 right-24 z-10 p-1.5 rounded cursor-grab active:cursor-grabbing transition-opacity ${
            isSelected ? 'opacity-100 bg-slate-800/90 text-slate-400 hover:text-slate-200' : 'opacity-0 group-hover:opacity-100 bg-slate-800/90 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GripVertical size={14} />
        </div>
        <div className={`absolute top-2 right-2 z-10 flex gap-1 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 rounded bg-slate-800/90 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors" title="複製">
            <Copy size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded bg-slate-800/90 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors" title="刪除">
            <Trash2 size={13} />
          </button>
        </div>
        <div className="pointer-events-none select-none overflow-hidden">
          <ModulePreviewRenderer module={module} modules={modules} />
        </div>
      </div>
    </div>
  );
}

// ── Sortable email module ─────────────────────────────────────────────────────
interface SortableEmailModuleProps {
  module: EmailPageModule;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableEmailModule({ module, isSelected, onSelect, onDelete, onDuplicate }: SortableEmailModuleProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
  const [hovered, setHovered] = React.useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const shadow = isSelected
    ? 'inset 0 0 0 2px #d97706'
    : hovered
    ? 'inset 0 0 0 1px rgba(217,119,6,0.45)'
    : 'none';

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative cursor-pointer transition-shadow"
        style={{ boxShadow: shadow }}
      >
        <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-medium transition-opacity pointer-events-none ${
          isSelected ? 'opacity-100 bg-amber-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-800/90 text-slate-300'
        }`}>
          {emailLabels[module.type] ?? module.type}
        </div>
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-2 right-24 z-10 p-1.5 rounded cursor-grab active:cursor-grabbing transition-opacity ${
            isSelected ? 'opacity-100 bg-slate-800/90 text-slate-400 hover:text-slate-200' : 'opacity-0 group-hover:opacity-100 bg-slate-800/90 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GripVertical size={14} />
        </div>
        <div className={`absolute top-2 right-2 z-10 flex gap-1 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 rounded bg-slate-800/90 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors" title="複製">
            <Copy size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded bg-slate-800/90 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors" title="刪除">
            <Trash2 size={13} />
          </button>
        </div>
        <div className="pointer-events-none select-none overflow-hidden">
          <EmailModulePreviewRenderer module={module} />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type DeviceMode = 'desktop' | 'mobile';

interface Props {
  pageMode: PageMode;
  onModeChange: (mode: PageMode) => void;
  modules: PageModule[];
  selectedId: string | null;
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  emailModules: EmailPageModule[];
  selectedEmailId: string | null;
  onEmailSelect: (id: string) => void;
  onEmailDelete: (id: string) => void;
  onEmailDuplicate: (id: string) => void;
  onEmailReorder: (activeId: string, overId: string) => void;
}

export function PreviewCanvas({
  pageMode, onModeChange,
  modules, selectedId, deviceMode, onDeviceChange,
  onSelect, onDelete, onDuplicate, onReorder,
  emailModules, selectedEmailId,
  onEmailSelect, onEmailDelete, onEmailDuplicate, onEmailReorder,
}: Props) {
  const [specOpen, setSpecOpen] = React.useState(false);
  const desktopViewportRef = React.useRef<HTMLDivElement>(null);
  const desktopCanvasRef = React.useRef<HTMLDivElement>(null);
  const [desktopScale, setDesktopScale] = React.useState(1);
  const [desktopCanvasHeight, setDesktopCanvasHeight] = React.useState(0);
  const { pageBackgroundColor, pageBackgroundImage } = useGlobalSettings();
  const emailSettings = useEmailSettings();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) onReorder(String(active.id), String(over.id));
  };

  const handleEmailDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) onEmailReorder(String(active.id), String(over.id));
  };

  const isEmail = pageMode === 'email';
  const isMobile = deviceMode === 'mobile';
  const campaignBackgroundStyle: React.CSSProperties = {
    background: pageBackgroundColor || '#ffffff',
    ...(pageBackgroundImage ? { backgroundImage: `url("${pageBackgroundImage}")`, backgroundRepeat: 'repeat-y', backgroundSize: '100% auto' } : {}),
  };
  const desktopCanvasStyle: React.CSSProperties = {
    ...campaignBackgroundStyle,
    width: DESKTOP_CANVAS_WIDTH,
    transform: `scale(${desktopScale})`,
    transformOrigin: 'top left',
  };
  const desktopFrameStyle: React.CSSProperties = {
    width: DESKTOP_CANVAS_WIDTH * desktopScale,
    height: desktopCanvasHeight || undefined,
  };

  React.useEffect(() => {
    if (isEmail || isMobile) return;
    const node = desktopViewportRef.current;
    if (!node) return;

    const updateScale = () => {
      const availableWidth = node.clientWidth - DESKTOP_CANVAS_PADDING;
      setDesktopScale(Math.min(1, Math.max(0.35, availableWidth / DESKTOP_CANVAS_WIDTH)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isEmail, isMobile]);

  React.useEffect(() => {
    if (isEmail || isMobile) return;
    const node = desktopCanvasRef.current;
    if (!node) return;

    const updateHeight = () => {
      setDesktopCanvasHeight(node.scrollHeight * desktopScale);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [desktopScale, isEmail, isMobile, modules.length]);

  return (
    <div className="min-h-0 flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Mode tabs */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-0 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => onModeChange('campaign')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 transition-colors ${
            !isEmail
              ? 'bg-slate-950 border-slate-700 text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <LayoutTemplate size={12} />
          活動頁面
        </button>
        <button
          onClick={() => onModeChange('email')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 transition-colors ${
            isEmail
              ? 'bg-slate-950 border-slate-700 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Mail size={12} />
          電子報
        </button>
      </div>

      {/* Canvas toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/60">
        <span className="text-xs text-slate-500">
          {isEmail
            ? emailModules.length > 0 ? `${emailModules.length} 個模組` : '電子報畫布'
            : modules.length > 0 ? `${modules.length} 個模組` : '活動頁畫布'
          }
        </span>
        {/* Device toggle — campaign only */}
        {!isEmail && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpecOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
            >
              <Ruler size={13} />
              <span>尺寸規格</span>
            </button>
            <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onDeviceChange('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Monitor size={13} />
                <span>桌機</span>
              </button>
              <button
                onClick={() => onDeviceChange('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Smartphone size={13} />
                <span>手機</span>
              </button>
            </div>
          </div>
        )}
        {specOpen && <SizeSpecGuide onClose={() => setSpecOpen(false)} />}
      </div>

      {/* ── Email canvas ──────────────────────────────────────────────────── */}
      {isEmail ? (
        emailModules.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-xs px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                <Mail size={28} className="text-amber-500/60" />
              </div>
              <div>
                <h3 className="text-slate-300 font-semibold text-base">開始建立電子報</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">從左側面板新增模組，開始設計你的電子報版面。</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-700/50" style={{ backgroundColor: emailSettings.backgroundColor || '#f4f4f4' }}>
            <div className="flex justify-center py-8 px-4">
              {/* Inbox simulation frame */}
              <div className="w-full" style={{ maxWidth: '600px' }}>
                {/* Fake inbox bar */}
                <div className="rounded-t-lg bg-slate-800 border border-slate-600 border-b-0 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                  <span className="text-xs text-slate-500 ml-2">電子報預覽 — 600px</span>
                </div>

                {/* Email content */}
                <div
                  className="border border-slate-600 border-t-0 rounded-b-lg overflow-hidden"
                  style={{ backgroundColor: emailSettings.contentBgColor || '#ffffff' }}
                >
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEmailDragEnd}>
                    <SortableContext items={emailModules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                      <div>
                        {emailModules.map((module) => (
                          <SortableEmailModule
                            key={module.id}
                            module={module}
                            isSelected={selectedEmailId === module.id}
                            onSelect={() => onEmailSelect(module.id)}
                            onDelete={() => onEmailDelete(module.id)}
                            onDuplicate={() => onEmailDuplicate(module.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* ── Campaign canvas ──────────────────────────────────────────────── */
        modules.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-xs px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                <LayoutTemplate size={28} className="text-slate-500" />
              </div>
              <div>
                <h3 className="text-slate-300 font-semibold text-base">開始建立活動頁</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">從左側新增模組，開始排版你的活動頁。</p>
              </div>
            </div>
          </div>
        ) : (
          <DeviceContext.Provider value={{ isMobile }}>
            <div
              ref={isMobile ? undefined : desktopViewportRef}
              className={`min-h-0 flex-1 overflow-y-auto ${isMobile ? 'bg-slate-800' : ''}`}
              style={isMobile ? undefined : campaignBackgroundStyle}
            >
              <div className={isMobile ? 'flex justify-center py-6 px-4' : 'flex min-h-full justify-center py-6 px-4'} style={isMobile ? undefined : campaignBackgroundStyle}>
                <div className={isMobile ? 'w-full shadow-2xl rounded-2xl overflow-hidden border border-slate-600' : 'flex-shrink-0'} style={isMobile ? { maxWidth: '390px' } : desktopFrameStyle}>
                  <div ref={isMobile ? undefined : desktopCanvasRef} style={isMobile ? undefined : desktopCanvasStyle}>
                  {isMobile && (
                    <div className="flex items-center justify-between px-5 py-2 bg-slate-900 text-slate-400 text-xs border-b border-slate-700">
                      <span className="font-medium">9:41</span>
                      <div className="flex gap-1 items-center">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="3" height="7" rx="1"/><rect x="4" y="2" width="3" height="8" rx="1"/><rect x="8" y="0" width="3" height="10" rx="1"/><rect x="12" y="4" width="2" height="6" rx="1" opacity=".4"/></svg>
                        <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4C5.4 2.4 3.1 3.5 1.5 5.2L0 3.7C2 1.4 4.8 0 8 0s6 1.4 8 3.7L14.5 5.2C12.9 3.5 10.6 2.4 8 2.4z"/><path d="M8 6.8C6.4 6.8 5 7.5 4 8.5L2.5 7C4 5.6 5.9 4.8 8 4.8s4 .8 5.5 2.2L12 8.5C11 7.5 9.6 6.8 8 6.8z"/><circle cx="8" cy="11" r="1.5"/></svg>
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor"><rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="1.5" y="2.5" width="16" height="7" rx="1"/><path d="M21 4v4a2 2 0 000-4z"/></svg>
                      </div>
                    </div>
                  )}

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                      <div
                        className="min-h-full divide-y divide-slate-800/50"
                        style={campaignBackgroundStyle}
                      >
                        {modules.map((module) => (
                          <SortableModule
                            key={module.id}
                            module={module}
                            modules={modules}
                            isSelected={selectedId === module.id}
                            onSelect={() => onSelect(module.id)}
                            onDelete={() => onDelete(module.id)}
                            onDuplicate={() => onDuplicate(module.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  </div>
                </div>
              </div>
            </div>
          </DeviceContext.Provider>
        )
      )}
    </div>
  );
}
