'use client';

import { useState, useCallback } from 'react';
import { PageModule, ModuleSchemaItem, ExportedCode } from '@/types/modules';
import { EmailPageModule, EmailSettings } from '@/types/emailModules';
import { EmailModuleSchemaItem } from '@/types/emailModules';
import { generateId } from '@/lib/utils';
import { generatePageHTML } from '@/lib/export/htmlGenerator';
import { generatePageCSS } from '@/lib/export/cssGenerator';
import { generateEmailHTML } from '@/lib/export/emailGenerator';
import { arrayMove } from '@dnd-kit/sortable';

import { GlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { EmailSettingsContext } from '@/contexts/EmailSettingsContext';
import { ModuleLibrary } from '@/components/editor/ModuleLibrary';
import { PreviewCanvas } from '@/components/editor/PreviewCanvas';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { PreviewModal } from '@/components/editor/PreviewModal';

import { Download, Layers, Eye } from 'lucide-react';

export type PageMode = 'campaign' | 'email';
type DeviceMode = 'desktop' | 'mobile';

export default function Page() {
  // Campaign state
  const [modules, setModules] = useState<PageModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [buttonColor, setButtonColor] = useState('#6366f1');
  const [pageBackgroundColor, setPageBackgroundColor] = useState('#ffffff');
  const [pageBackgroundImage, setPageBackgroundImage] = useState('');

  // Email state
  const [emailModules, setEmailModules] = useState<EmailPageModule[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    backgroundColor: '#f4f4f4',
    contentBgColor: '#ffffff',
    primaryColor: '#6366f1',
    utmString: '',
    trackingPixel: '',
    previewText: '',
  });

  // Shared
  const [pageMode, setPageMode] = useState<PageMode>('campaign');
  const [exportOpen, setExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // ── Campaign operations ───────────────────────────────────────────────────
  const selectedModule = modules.find((m) => m.id === selectedId) ?? null;

  const addModule = useCallback((schema: ModuleSchemaItem) => {
    const newModule = { id: generateId(), type: schema.type, data: JSON.parse(JSON.stringify(schema.defaultData)) } as PageModule;
    setModules((prev) => [...prev, newModule]);
    setSelectedId(newModule.id);
  }, []);

  const updateModule = useCallback((id: string, data: PageModule['data']) => {
    setModules((prev) => prev.map((m) => (m.id === id ? ({ ...m, data } as PageModule) : m)));
  }, []);

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateModule = useCallback((id: string) => {
    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: generateId(), data: JSON.parse(JSON.stringify(prev[idx].data)) } as PageModule;
      const next = [...prev]; next.splice(idx + 1, 0, copy); return next;
    });
  }, []);

  const reorderModules = useCallback((activeId: string, overId: string) => {
    setModules((prev) => {
      const a = prev.findIndex((m) => m.id === activeId);
      const b = prev.findIndex((m) => m.id === overId);
      if (a === -1 || b === -1) return prev;
      return arrayMove(prev, a, b);
    });
  }, []);

  // ── Email operations ──────────────────────────────────────────────────────
  const selectedEmailModule = emailModules.find((m) => m.id === selectedEmailId) ?? null;

  const addEmailModule = useCallback((schema: EmailModuleSchemaItem) => {
    const m = { id: generateId(), type: schema.type, data: JSON.parse(JSON.stringify(schema.defaultData)) } as EmailPageModule;
    setEmailModules((prev) => [...prev, m]);
    setSelectedEmailId(m.id);
  }, []);

  const updateEmailModule = useCallback((id: string, data: EmailPageModule['data']) => {
    setEmailModules((prev) => prev.map((m) => (m.id === id ? ({ ...m, data } as EmailPageModule) : m)));
  }, []);

  const deleteEmailModule = useCallback((id: string) => {
    setEmailModules((prev) => prev.filter((m) => m.id !== id));
    setSelectedEmailId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateEmailModule = useCallback((id: string) => {
    setEmailModules((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: generateId(), data: JSON.parse(JSON.stringify(prev[idx].data)) } as EmailPageModule;
      const next = [...prev]; next.splice(idx + 1, 0, copy); return next;
    });
  }, []);

  const reorderEmailModules = useCallback((activeId: string, overId: string) => {
    setEmailModules((prev) => {
      const a = prev.findIndex((m) => m.id === activeId);
      const b = prev.findIndex((m) => m.id === overId);
      if (a === -1 || b === -1) return prev;
      return arrayMove(prev, a, b);
    });
  }, []);

  const updateEmailSettings = useCallback((partial: Partial<EmailSettings>) => {
    setEmailSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const exportedCode: ExportedCode = {
    html: generatePageHTML(modules),
    css: generatePageCSS({ buttonColor, pageBackgroundColor, pageBackgroundImage }),
  };
  const exportedEmail = generateEmailHTML(emailModules, emailSettings);

  const canExport = pageMode === 'campaign' ? modules.length > 0 : emailModules.length > 0;

  return (
    <GlobalSettingsContext.Provider value={{ buttonColor, setButtonColor, pageBackgroundColor, setPageBackgroundColor, pageBackgroundImage, setPageBackgroundImage }}>
      <EmailSettingsContext.Provider value={{ ...emailSettings, update: updateEmailSettings }}>
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-slate-950">
          {/* Top bar */}
          <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 z-20">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Layers size={14} className="text-white" />
              </div>
              <span className="text-slate-100 font-semibold text-sm tracking-tight">Campaign Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewOpen(true)}
                disabled={!canExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-sm font-semibold rounded-lg transition-colors"
              >
                <Eye size={14} />
                預覽
              </button>
              <button
                onClick={() => setExportOpen(true)}
                disabled={!canExport}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Download size={14} />
                匯出
              </button>
            </div>
          </header>

          {/* Three-column layout */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <ModuleLibrary
              pageMode={pageMode}
              onAdd={addModule}
              onAddEmail={addEmailModule}
            />

            <PreviewCanvas
              pageMode={pageMode}
              onModeChange={setPageMode}
              modules={modules}
              selectedId={selectedId}
              deviceMode={deviceMode}
              onDeviceChange={setDeviceMode}
              onSelect={setSelectedId}
              onDelete={deleteModule}
              onDuplicate={duplicateModule}
              onReorder={reorderModules}
              emailModules={emailModules}
              selectedEmailId={selectedEmailId}
              onEmailSelect={setSelectedEmailId}
              onEmailDelete={deleteEmailModule}
              onEmailDuplicate={duplicateEmailModule}
              onEmailReorder={reorderEmailModules}
            />

            <InspectorPanel
              pageMode={pageMode}
              module={selectedModule}
              onChange={(data) => selectedId && updateModule(selectedId, data)}
              emailModule={selectedEmailModule}
              onEmailChange={(data) => selectedEmailId && updateEmailModule(selectedEmailId, data)}
            />
          </div>

          {exportOpen && (
            <ExportModal
              code={exportedCode}
              emailHTML={exportedEmail}
              initialTab={pageMode === 'email' ? 'email' : 'campaign'}
              onClose={() => setExportOpen(false)}
            />
          )}

          {previewOpen && (
            <PreviewModal
              pageMode={pageMode}
              modules={modules}
              emailModules={emailModules}
              onClose={() => setPreviewOpen(false)}
            />
          )}
        </div>
      </EmailSettingsContext.Provider>
    </GlobalSettingsContext.Provider>
  );
}
