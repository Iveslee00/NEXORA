'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { PageModule, ModuleSchemaItem, ExportedCode } from '@/types/modules';
import { EmailPageModule, EmailSettings } from '@/types/emailModules';
import { EmailModuleSchemaItem } from '@/types/emailModules';
import { generateId } from '@/lib/utils';
import { generatePageHTML } from '@/lib/export/htmlGenerator';
import { generatePageCSS } from '@/lib/export/cssGenerator';
import { generateEmailHTML } from '@/lib/export/emailGenerator';
import {
  createEmptyProject,
  createImportedProject,
  createProjectSnapshot,
  createProjectWorkspace,
  defaultEmailSettings,
  defaultGlobalSettings,
  deleteProject,
  duplicateProject,
  getActiveProject,
  loadProjectWorkspace,
  parseProjectFile,
  projectSummaries,
  PROJECT_FILE_EXTENSION,
  PROJECT_FILE_MIME_TYPE,
  saveProjectWorkspace,
  serializeProjectFile,
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

import {
  ArrowLeft,
  CalendarClock,
  Copy,
  Download,
  Eye,
  FileDown,
  FileUp,
  FolderOpen,
  Home,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react';

export type PageMode = 'campaign' | 'email';
type DeviceMode = 'desktop' | 'mobile';
type AppView = 'login' | 'workshop' | 'editor';

interface LoggedInUser {
  id: string;
  username: string;
  displayName: string;
}

interface ProjectHeroPreview {
  title: string;
  subtitle: string;
  image: string;
  hasHero: boolean;
}

const formatProjectDate = (value: string) => {
  if (!value) return '尚未編輯';
  try {
    return new Intl.DateTimeFormat('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '尚未編輯';
  }
};

const sanitizeProjectFileName = (name: string) => {
  const safeName = name.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-');
  return safeName || 'campaign-project';
};

const getProjectHeroPreview = (project: CampaignBuilderProject): ProjectHeroPreview => {
  const heroModule = project.campaign.modules.find((module) => module.type === 'hero' || module.type === 'hero-carousel');

  if (!heroModule) {
    return {
      title: '尚未設定主視覺',
      subtitle: '點擊開啟後新增 KV 模組',
      image: '',
      hasHero: false,
    };
  }

  if (heroModule.type === 'hero') {
    return {
      title: heroModule.data.title || project.name,
      subtitle: heroModule.data.subtitle || '單張 KV',
      image: heroModule.data.image || heroModule.data.mobileImage || '',
      hasHero: true,
    };
  }

  const firstSlide = heroModule.data.slides[0];
  return {
    title: firstSlide?.title || project.name,
    subtitle: firstSlide?.subtitle || 'KV 輪播',
    image: firstSlide?.image || firstSlide?.mobileImage || '',
    hasHero: true,
  };
};

export default function Page() {
  const workspaceRef = useRef<ProjectWorkspace | null>(null);
  const projectImportInputRef = useRef<HTMLInputElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [appView, setAppView] = useState<AppView>('login');
  const [authUser, setAuthUser] = useState<LoggedInUser | null>(null);
  const [loginUsername, setLoginUsername] = useState('client01');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('未命名專案');
  const [projectList, setProjectList] = useState<ProjectSummary[]>([]);
  const [saveStatus, setSaveStatus] = useState('本機自動儲存');
  const [projectPanelOpen, setProjectPanelOpen] = useState(false);

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
    let alive = true;

    const workspace = loadProjectWorkspace(window.localStorage);
    const activeProject = getActiveProject(workspace);
    workspaceRef.current = workspace;
    setProjectList(projectSummaries(workspace));
    applyProject(activeProject);

    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data: { user: LoggedInUser | null }) => {
        if (!alive) return;
        if (data.user) {
          setAuthUser(data.user);
          setAppView('workshop');
        }
      })
      .catch(() => {
        if (alive) setAppView('login');
      })
      .finally(() => {
        if (alive) setHydrated(true);
      });

    return () => {
      alive = false;
    };
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

  const handleOpenProject = useCallback((id: string) => {
    handleSelectProject(id);
    setAppView('editor');
  }, [handleSelectProject]);

  const handleCreateProject = useCallback(() => {
    const project = createEmptyProject('未命名專案');
    const nextWorkspace = upsertProject(workspaceRef.current ?? createProjectWorkspace(project), project);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    applyProject(project);
  }, [applyProject]);

  const handleCreateAndOpenProject = useCallback(() => {
    handleCreateProject();
    setAppView('editor');
  }, [handleCreateProject]);

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

  const handleDuplicateProjectById = useCallback((id: string) => {
    const workspace = workspaceRef.current;
    const project = workspace?.projects.find((item) => item.id === id);
    if (!workspace || !project) return;

    const copiedProject = duplicateProject(project);
    const nextWorkspace = upsertProject(workspace, copiedProject);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    applyProject(copiedProject);
    setAppView('editor');
  }, [applyProject]);

  const handleExportProjectFile = useCallback((id: string) => {
    const workspace = workspaceRef.current;
    const project = workspace?.projects.find((item) => item.id === id);
    if (!project) return;

    const blob = new Blob([serializeProjectFile(project)], { type: PROJECT_FILE_MIME_TYPE });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeProjectFileName(project.name)}.${PROJECT_FILE_EXTENSION}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportProjectFile = useCallback(async (file: File | null) => {
    if (!file) return;

    try {
      const raw = await file.text();
      const importedProject = createImportedProject(parseProjectFile(raw));
      const nextWorkspace = upsertProject(workspaceRef.current ?? createProjectWorkspace(importedProject), importedProject);
      workspaceRef.current = nextWorkspace;
      saveProjectWorkspace(window.localStorage, nextWorkspace);
      setProjectList(projectSummaries(nextWorkspace));
      applyProject(importedProject);
      setAppView('editor');
    } catch {
      window.alert('專案檔讀取失敗，請確認檔案格式為 .cmb');
    } finally {
      if (projectImportInputRef.current) {
        projectImportInputRef.current.value = '';
      }
    }
  }, [applyProject]);

  const handleDeleteProject = useCallback((id: string) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const nextWorkspace = deleteProject(workspace, id);
    const nextProject = getActiveProject(nextWorkspace);
    workspaceRef.current = nextWorkspace;
    saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    applyProject(nextProject);
  }, [applyProject]);

  const exportedCode: ExportedCode = {
    html: generatePageHTML(modules),
    css: generatePageCSS({ buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage }),
  };
  const exportedEmail = generateEmailHTML(emailModules, emailSettings);

  const canExport = pageMode === 'campaign' ? modules.length > 0 : emailModules.length > 0;
  const currentProjectCount = projectList.length;

  const getProjectModuleCount = useCallback((id: string) => {
    const project = workspaceRef.current?.projects.find((item) => item.id === id);
    if (!project) return 0;
    return project.campaign.modules.length + project.email.modules.length;
  }, []);

  const handleLogin = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          remember: rememberLogin,
        }),
      });
      const data = await response.json() as { user?: LoggedInUser; message?: string };

      if (!response.ok || !data.user) {
        setLoginError(data.message || '登入失敗，請再試一次');
        return;
      }

      setAuthUser(data.user);
      setAppView('workshop');
      setLoginPassword('');
    } catch {
      setLoginError('暫時無法登入，請稍後再試');
    } finally {
      setLoginLoading(false);
    }
  }, [loginPassword, loginUsername, rememberLogin]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    setAuthUser(null);
    setAppView('login');
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
        載入 NEXORA...
      </div>
    );
  }

  if (appView === 'login') {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-950 animate-[fadeIn_0.45s_ease-out]">
        <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
          <section className="flex flex-col justify-between bg-[#172033] px-8 py-8 text-white lg:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                <img src="/brand/nexora-icon.svg" alt="" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-bold">NEXORA</p>
                <p className="text-xs font-semibold text-indigo-100">受邀測試版本</p>
              </div>
            </div>

            <div className="my-12 max-w-xl">
              <div className="mb-7 inline-flex rounded-2xl bg-white px-5 py-3 shadow-2xl shadow-slate-950/20">
                <img src="/brand/nexora-logo.svg" alt="NEXORA" className="h-12 w-auto max-w-[240px]" />
              </div>
              <p className="mb-4 inline-flex rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1 text-xs font-bold text-indigo-100">
                Build the Next Era.
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-6xl">
                登入 NEXORA
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-200">
                從同一個工作平台建立活動頁、管理行銷工具與匯出可用素材。現在先開放 NEXORA Builder，後續將加入更多 AI、行銷與營運工具。
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5 text-sm leading-7 text-slate-200">
              <p className="font-bold text-white">受邀測試版本</p>
              <p className="mt-1">目前專案會儲存在此瀏覽器，不會影響正式 CMS 貼碼與 ZIP 匯出功能。</p>
            </div>
          </section>

          <section className="flex items-center justify-center px-6 py-12">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/80 animate-[panelFloatIn_0.5s_ease-out]"
            >
              <div className="mb-6">
                <p className="text-2xl font-black text-slate-950">歡迎回來</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">輸入受邀帳號即可進入 NEXORA Workspace。</p>
              </div>

              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-bold text-slate-500">帳號</span>
                <input
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none transition-colors focus:border-indigo-400 focus:bg-white"
                  placeholder="client01"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-bold text-slate-500">密碼</span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none transition-colors focus:border-indigo-400 focus:bg-white"
                  placeholder="請輸入密碼"
                />
              </label>

              <label className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">記住我 30 天</span>
                <input
                  type="checkbox"
                  checked={rememberLogin}
                  onChange={(event) => setRememberLogin(event.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>

              {loginError && (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-200"
              >
                {loginLoading ? '登入中...' : '進入 NEXORA Workspace'}
                <Sparkles size={16} />
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                目前為受邀測試版本，專案會儲存在此瀏覽器，也可匯出 .cmb 專案檔自行備份。
              </p>
            </form>
          </section>
        </div>
      </main>
    );
  }

  if (appView === 'workshop') {
    return (
      <div className="flex h-screen min-h-screen overflow-hidden bg-slate-100 text-slate-950 animate-[fadeIn_0.45s_ease-out]">
        <aside className="flex w-64 flex-shrink-0 flex-col justify-between bg-[#172033] px-4 py-5 text-slate-300">
          <div>
            <div className="mb-7 flex items-center gap-3 px-2">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img src="/brand/nexora-icon.svg" alt="" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">NEXORA</p>
                <p className="text-xs font-semibold text-slate-500">Beta Access</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white">
                <Home size={18} />
                首頁
              </button>
              <button className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl bg-indigo-500/[0.18] px-3 py-3 text-left text-sm font-black text-white before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-1 before:rounded-r-full before:bg-indigo-300">
                <Wrench size={18} />
                NEXORA Builder
              </button>
              <button className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-white/5">
                <span className="flex items-center gap-3">
                  <FolderOpen size={18} />
                  NEXORA Assets
                </span>
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-black text-slate-400">準備中</span>
              </button>
              <button className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-white/5">
                <span className="flex items-center gap-3">
                  <Settings size={18} />
                  NEXORA Settings
                </span>
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-black text-slate-400">準備中</span>
              </button>
            </nav>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] p-4">
              <p className="truncate text-sm font-bold text-slate-200">{authUser?.displayName || authUser?.username || '測試帳號'}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">專案暫存於此瀏覽器</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
            >
              <LogOut size={18} />
              登出
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto animate-[fadeIn_0.45s_ease-out]">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
            <div>
              <p className="text-sm font-bold text-indigo-600">NEXORA Workspace</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">NEXORA Builder 專案</h1>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={projectImportInputRef}
                type="file"
                accept={`.${PROJECT_FILE_EXTENSION},application/json`}
                className="hidden"
                onChange={(event) => {
                  void handleImportProjectFile(event.target.files?.[0] ?? null);
                }}
              />
              <button
                onClick={() => projectImportInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <FileUp size={17} />
                匯入專案檔
              </button>
              <button
                onClick={handleCreateAndOpenProject}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-indigo-500"
              >
                <Plus size={17} />
                新增活動頁
              </button>
            </div>
          </header>

          <section className="px-8 py-8">
            <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_240px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold text-indigo-600">目前工具</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">NEXORA Builder</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Campaign Builder 是目前第一個開放工具，可建立 CMS 可用的活動頁模組，並匯出貼碼、ZIP 或 .cmb 本地專案檔。
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold text-slate-500">本機專案</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{currentProjectCount}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">儲存在此瀏覽器，也可匯出 .cmb 專案檔自行備份。</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <button
                onClick={handleCreateAndOpenProject}
                className="flex min-h-[210px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <Plus size={24} />
                </span>
                <span className="mt-4 text-lg font-black text-slate-950">新增活動頁</span>
                <span className="mt-2 text-sm leading-6 text-slate-500">建立空白畫布並進入編輯器</span>
              </button>

              {projectList.map((project) => {
                const workspaceProject = workspaceRef.current?.projects.find((item) => item.id === project.id);
                const heroPreview = workspaceProject ? getProjectHeroPreview(workspaceProject) : null;

                return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    {heroPreview?.image ? (
                      <img
                        src={heroPreview.image}
                        alt={heroPreview.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#4f46e5_0,#1e1b4b_38%,#020617_100%)] px-5 text-center text-white transition-transform duration-500 group-hover:scale-105">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Hero Preview</p>
                          <p className="mt-2 text-base font-black">{heroPreview?.title || '尚未設定主視覺'}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-300">{heroPreview?.subtitle || '點擊開啟後新增 KV 模組'}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-950 shadow-sm">
                      {heroPreview?.hasHero ? 'KV 預覽' : '空白畫布'}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-2 text-lg font-black text-slate-950">{project.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{heroPreview?.title || '尚未設定主視覺'}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        本機儲存
                      </span>
                    </div>
                    <div className="space-y-2 text-sm font-semibold text-slate-500">
                      <p className="flex items-center gap-2">
                        <CalendarClock size={15} />
                        {formatProjectDate(project.updatedAt)}
                      </p>
                      <p>{getProjectModuleCount(project.id)} 個模組</p>
                    </div>

                  <div className="mt-5 flex items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-indigo-600"
                    >
                      開啟
                      <ArrowLeft size={15} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => handleDuplicateProjectById(project.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      title="建立副本"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleExportProjectFile(project.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                      title="匯出專案檔"
                    >
                      <FileDown size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="刪除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  </div>
                </article>
              );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <GlobalSettingsContext.Provider value={{ buttonColor, buttonTextColor, setButtonColor, setButtonTextColor, pageBackgroundColor, setPageBackgroundColor, pageBackgroundImage, setPageBackgroundImage }}>
      <EmailSettingsContext.Provider value={{ ...emailSettings, update: updateEmailSettings }}>
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-slate-950 animate-[fadeIn_0.35s_ease-out]">
          {/* Top bar */}
          <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 z-20">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setAppView('workshop')}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <ArrowLeft size={14} />
                回到 Workspace
              </button>
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-white">
                <img src="/brand/nexora-icon.svg" alt="" className="h-full w-full object-contain" />
              </div>
              <span className="hidden text-sm font-semibold tracking-tight text-slate-100 sm:inline">NEXORA Builder</span>
              <div className="ml-2 hidden min-w-0 items-center gap-2 lg:flex">
                <span className="max-w-[220px] truncate rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-semibold text-slate-200">
                  {projectName || '未命名專案'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 transition-opacity duration-200">
                  <span className={`h-1.5 w-1.5 rounded-full bg-emerald-300 ${saveStatus.includes('儲存中') ? 'animate-pulse' : ''}`} />
                  {saveStatus || '本機自動儲存'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProjectPanelOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
              >
                <FolderOpen size={14} />
                專案管理
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

          {projectPanelOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-100">專案管理</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      目前專案會自動儲存在這台電腦的瀏覽器。新專案是空白畫布，建立副本會複製目前畫布。
                    </p>
                  </div>
                  <button
                    onClick={() => setProjectPanelOpen(false)}
                    className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
                    aria-label="關閉"
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-500">目前專案名稱</span>
                      <input
                        value={projectName}
                        onChange={(event) => {
                          setProjectName(event.target.value);
                          setSaveStatus('儲存中...');
                        }}
                        className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-slate-100 outline-none transition-colors focus:border-indigo-500"
                        placeholder="專案名稱"
                      />
                    </label>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60">
                      <div className="border-b border-slate-800 px-4 py-3">
                        <p className="text-xs font-semibold text-slate-500">已儲存專案</p>
                      </div>
                      <div className="max-h-72 overflow-y-auto p-2">
                        {projectList.map((project) => {
                          const active = project.id === projectId;
                          return (
                            <div
                              key={project.id}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                            >
                              <button
                                onClick={() => handleSelectProject(project.id)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <span className="block truncate text-sm font-semibold">{project.name}</span>
                                <span className={`mt-0.5 block text-[11px] ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                                  {active ? '使用中' : '點擊切換'}
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className={`shrink-0 rounded-md p-2 transition-colors ${active ? 'text-indigo-100 hover:bg-indigo-500' : 'text-slate-500 hover:bg-slate-700 hover:text-red-300'}`}
                                aria-label="刪除專案"
                                title="刪除專案"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleCreateProject();
                        setProjectPanelOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
                    >
                      <Plus size={16} />
                      新建空白專案
                    </button>
                    <button
                      onClick={() => {
                        handleDuplicateProject();
                        setProjectPanelOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-100 transition-colors hover:bg-slate-700"
                    >
                      <Copy size={16} />
                      複製目前專案
                    </button>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-400">
                      <p className="font-semibold text-slate-300">目前狀態：本機自動儲存</p>
                      <p className="mt-2">同一台電腦、同一個瀏覽器會記住專案。之後可以再升級成雲端同步。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </EmailSettingsContext.Provider>
    </GlobalSettingsContext.Provider>
  );
}
