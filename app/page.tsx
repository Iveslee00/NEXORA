'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PageModule, ModuleSchemaItem, ExportedCode } from '@/types/modules';
import { EmailPageModule, EmailSettings } from '@/types/emailModules';
import { EmailModuleSchemaItem } from '@/types/emailModules';
import { generateId } from '@/lib/utils';
import { generatePageHTML } from '@/lib/export/htmlGenerator';
import { generatePageCSS } from '@/lib/export/cssGenerator';
import { generateEmailHTML } from '@/lib/export/emailGenerator';
import {
  createEmptyProject,
  createProjectSnapshot,
  createProjectWorkspace,
  defaultEmailSettings,
  defaultGlobalSettings,
  duplicateProject,
  getActiveProject,
  loadProjectWorkspace,
  projectSummaries,
  saveProjectWorkspace,
  upsertProject,
} from '@/lib/projects/localProjectStorage';
import type { CampaignBuilderProject, ProjectSummary, ProjectWorkspace } from '@/types/project';
import { arrayMove } from '@dnd-kit/sortable';

import { GlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { EmailSettingsContext } from '@/contexts/EmailSettingsContext';
import { ModuleLibrary } from '@/components/editor/ModuleLibrary';
import { PreviewCanvas } from '@/components/editor/PreviewCanvas';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { PreviewModal } from '@/components/editor/PreviewModal';

import { Copy, Download, Eye, Layers, LogIn, Plus } from 'lucide-react';

export type PageMode = 'campaign' | 'email';
type DeviceMode = 'desktop' | 'mobile';

export default function Page() {
  const workspaceRef = useRef<ProjectWorkspace | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('未命名專案');
  const [projectList, setProjectList] = useState<ProjectSummary[]>([]);
  const [saveStatus, setSaveStatus] = useState('本機自動儲存');
  const [loginOpen, setLoginOpen] = useState(false);

  // Campaign state
  const [modules, setModules] = useState<PageModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [buttonColor, setButtonColor] = useState(defaultGlobalSettings().buttonColor);
  const [buttonTextColor, setButtonTextColor] = useState(defaultGlobalSettings().buttonTextColor);
  const [pageBackgroundColor, setPageBackgroundColor] = useState(defaultGlobalSettings().pageBackgroundColor);
  const [pageBackgroundImage, setPageBackgroundImage] = useState('');

  // Email state
  const [emailModules, setEmailModules] = useState<EmailPageModule[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings());

  // Shared
  const [pageMode, setPageMode] = useState<PageMode>('campaign');
  const [exportOpen, setExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const applyProject = useCallback((project: CampaignBuilderProject) => {
    setProjectId(project.id);
    setProjectName(project.name);
    setPageMode(project.pageMode);
    setModules(project.campaign.modules);
    setSelectedId(project.campaign.selectedId);
    setDeviceMode(project.campaign.deviceMode);
    setButtonColor(project.campaign.settings.buttonColor);
    setButtonTextColor(project.campaign.settings.buttonTextColor);
    setPageBackgroundColor(project.campaign.settings.pageBackgroundColor);
    setPageBackgroundImage(project.campaign.settings.pageBackgroundImage);
    setEmailModules(project.email.modules);
    setSelectedEmailId(project.email.selectedId);
    setEmailSettings(project.email.settings);
  }, []);

  useEffect(() => {
    const workspace = loadProjectWorkspace(window.localStorage);
    const activeProject = getActiveProject(workspace);
    workspaceRef.current = workspace;
    setProjectList(projectSummaries(workspace));
    applyProject(activeProject);
    setHydrated(true);
  }, [applyProject]);

  useEffect(() => {
    if (!hydrated || !projectId) return;

    const currentProject = createProjectSnapshot({
      id: projectId,
      name: projectName,
      pageMode,
      modules,
      selectedId,
      deviceMode,
      globalSettings: { buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage },
      emailModules,
      selectedEmailId,
      emailSettings,
      createdAt: workspaceRef.current?.projects.find((project) => project.id === projectId)?.createdAt,
    });
    const nextWorkspace = upsertProject(workspaceRef.current ?? createProjectWorkspace(currentProject), currentProject);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    setSaveStatus('已儲存於本機');
  }, [
    hydrated,
    projectId,
    projectName,
    pageMode,
    modules,
    selectedId,
    deviceMode,
    buttonColor,
    buttonTextColor,
    pageBackgroundColor,
    pageBackgroundImage,
    emailModules,
    selectedEmailId,
    emailSettings,
  ]);

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

  const handleSelectProject = useCallback((id: string) => {
    const workspace = workspaceRef.current;
    const project = workspace?.projects.find((item) => item.id === id);
    if (!workspace || !project) return;

    const nextWorkspace = { ...workspace, activeProjectId: id };
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    applyProject(project);
  }, [applyProject]);

  const handleCreateProject = useCallback(() => {
    const project = createEmptyProject('未命名專案');
    const nextWorkspace = upsertProject(workspaceRef.current ?? createProjectWorkspace(project), project);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    applyProject(project);
  }, [applyProject]);

  const handleDuplicateProject = useCallback(() => {
    const workspace = workspaceRef.current;
    const current = workspace?.projects.find((item) => item.id === projectId);
    if (!workspace || !current) return;

    const copiedProject = duplicateProject(createProjectSnapshot({
      id: current.id,
      name: projectName,
      pageMode,
      modules,
      selectedId,
      deviceMode,
      globalSettings: { buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage },
      emailModules,
      selectedEmailId,
      emailSettings,
      createdAt: current.createdAt,
    }));
    const nextWorkspace = upsertProject(workspace, copiedProject);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    applyProject(copiedProject);
  }, [
    applyProject,
    buttonColor,
    buttonTextColor,
    deviceMode,
    emailModules,
    emailSettings,
    modules,
    pageBackgroundColor,
    pageBackgroundImage,
    pageMode,
    projectId,
    projectName,
    selectedEmailId,
    selectedId,
  ]);

  const exportedCode: ExportedCode = {
    html: generatePageHTML(modules),
    css: generatePageCSS({ buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage }),
  };
  const exportedEmail = generateEmailHTML(emailModules, emailSettings);

  const canExport = pageMode === 'campaign' ? modules.length > 0 : emailModules.length > 0;

  return (
    <GlobalSettingsContext.Provider value={{ buttonColor, buttonTextColor, setButtonColor, setButtonTextColor, pageBackgroundColor, setPageBackgroundColor, pageBackgroundImage, setPageBackgroundImage }}>
      <EmailSettingsContext.Provider value={{ ...emailSettings, update: updateEmailSettings }}>
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-slate-950">
          {/* Top bar */}
          <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 z-20">
            <div className="flex min-w-0 items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Layers size={14} className="text-white" />
              </div>
              <span className="hidden text-sm font-semibold tracking-tight text-slate-100 sm:inline">Campaign Builder</span>
              <div className="ml-2 hidden items-center gap-2 xl:flex">
                <input
                  value={projectName}
                  onChange={(event) => {
                    setProjectName(event.target.value);
                    setSaveStatus('儲存中...');
                  }}
                  className="h-9 w-44 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-slate-100 outline-none transition-colors focus:border-indigo-500"
                  placeholder="專案名稱"
                />
                {projectList.length > 1 && (
                  <select
                    value={projectId}
                    onChange={(event) => handleSelectProject(event.target.value)}
                    className="h-9 w-40 rounded-lg border border-slate-700 bg-slate-800 px-2 text-xs font-semibold text-slate-300 outline-none transition-colors focus:border-indigo-500"
                    aria-label="切換專案"
                  >
                    {projectList.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <span className="w-24 text-xs font-medium text-slate-500">{saveStatus || '本機自動儲存'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateProject}
                className="hidden items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 lg:flex"
              >
                <Plus size={14} />
                新專案
              </button>
              <button
                onClick={handleDuplicateProject}
                className="hidden items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 lg:flex"
              >
                <Copy size={14} />
                建立副本
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
              >
                <LogIn size={14} />
                登入
              </button>
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
              modules={modules}
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

          {loginOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-100">登入功能準備中</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      目前已先啟用本機自動儲存與多專案副本。下一階段接上雲端後，這些專案會改為同步到帳號底下。
                    </p>
                  </div>
                  <button
                    onClick={() => setLoginOpen(false)}
                    className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
                    aria-label="關閉"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4">
                    <span>目前狀態</span>
                    <span className="font-semibold text-emerald-400">本機自動儲存</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>下一階段</span>
                    <span className="font-semibold text-indigo-300">雲端登入與同步</span>
                  </div>
                </div>
                <button
                  onClick={() => setLoginOpen(false)}
                  className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
                >
                  了解
                </button>
              </div>
            </div>
          )}
        </div>
      </EmailSettingsContext.Provider>
    </GlobalSettingsContext.Provider>
  );
}
