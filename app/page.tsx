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
import { analyzeExportPreflight } from '@/lib/export/preflight';
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
  projectSummaries,
  PROJECT_FILE_EXTENSION,
  saveProjectWorkspace,
  upsertProject,
} from '@/lib/projects/localProjectStorage';
import { createProjectPackage, parseProjectPackage } from '@/lib/projects/projectPackage';
import type { CampaignBuilderProject, ProjectSummary, ProjectWorkspace } from '@/types/project';
import { arrayMove } from '@dnd-kit/sortable';

import { GlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { EmailSettingsContext } from '@/contexts/EmailSettingsContext';
import { ModuleLibrary } from '@/components/editor/ModuleLibrary';
import { PreviewCanvas } from '@/components/editor/PreviewCanvas';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { PreviewModal } from '@/components/editor/PreviewModal';
import { ProductBuildModal } from '@/components/editor/ProductBuildModal';
import { ProductBuilderInput, createProductLandingModules } from '@/lib/productBuilder/productPageBuilder';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl } from '@/lib/assets/localImageStore';

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
  PackagePlus,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react';

export type PageMode = 'campaign' | 'email';
type DeviceMode = 'desktop' | 'mobile';
type AppView = 'login' | 'workshop' | 'editor';
type WorkspaceSection = 'home' | 'builder' | 'assets' | 'settings';
type WorkspaceLanguage = 'zh' | 'en' | 'ja';

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

function ProjectHeroImage({ image, title }: { image: string; title: string }) {
  const [resolvedImage, setResolvedImage] = useState(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    let objectUrl = '';

    setFailed(false);
    if (!image || !isLocalImageRef(image)) {
      setResolvedImage(image);
      return () => undefined;
    }

    setResolvedImage('');
    resolveLocalImageUrl(image)
      .then((value) => {
        objectUrl = value;
        if (alive) {
          if (value) {
            setResolvedImage(value);
          } else {
            setFailed(true);
          }
        }
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
      revokeResolvedLocalImageUrl(objectUrl);
    };
  }, [image]);

  if (!resolvedImage || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#4f46e5_0,#1e1b4b_38%,#020617_100%)] px-5 text-center text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">KV Preview</p>
          <p className="mt-2 text-base font-black">{failed ? '圖片載入失敗' : title}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolvedImage}
      alt={title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

const NEXORA_WORKSPACE_LANGUAGE_KEY = 'nexora-workspace-language-v1';

const workspaceLanguageOptions: Array<{ id: WorkspaceLanguage; label: string; nativeLabel: string }> = [
  { id: 'zh', label: '繁體中文', nativeLabel: '繁體中文' },
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'ja', label: '日本語', nativeLabel: '日本語' },
];

const workspaceCopy: Record<WorkspaceLanguage, {
  homeEyebrow: string;
  homeTitle: string;
  homeBody: string;
  currentTool: string;
  toolDescription: string;
  projectCountLabel: string;
  localProjectNote: string;
  assetsEyebrow: string;
  assetsTitle: string;
  assetsBody: string;
  settingsEyebrow: string;
  settingsTitle: string;
  settingsBody: string;
  currentSettings: string;
}> = {
  zh: {
    homeEyebrow: 'NEXORA Workspace',
    homeTitle: '建立活動頁、管理專案與備份素材',
    homeBody: 'NEXORA Builder 是目前第一個開放工具，可建立 CMS 可用的活動頁模組，並匯出貼碼、ZIP 或可搬移的 .cmb 專案包。',
    currentTool: '目前工具',
    toolDescription: 'NEXORA Builder 專注在活動頁、商品銷售頁與 CMS 貼碼工作流。',
    projectCountLabel: '本機專案',
    localProjectNote: '儲存在此瀏覽器，也可匯出 project.cmb 專案包自行備份。',
    assetsEyebrow: 'Demo Assets',
    assetsTitle: '清潔用品商品頁素材',
    assetsBody: '素材包會逐步整理成可重複使用的品牌資產，目前先提供清潔用品商品頁的規格示範與上傳建議。',
    settingsEyebrow: 'Settings',
    settingsTitle: '目前設定',
    settingsBody: '目前為 Local Project Mode，專案與圖片優先儲存在本機；匯出 .cmb 時會包含 project.json 與 images/。',
    currentSettings: '目前設定',
  },
  en: {
    homeEyebrow: 'NEXORA Workspace',
    homeTitle: 'Build campaigns, manage projects, and package assets',
    homeBody: 'NEXORA Builder is the first active tool. It creates CMS-ready campaign modules and exports paste code, ZIP packages, or portable .cmb project files.',
    currentTool: 'Current Tool',
    toolDescription: 'NEXORA Builder focuses on campaign pages, product landing pages, and CMS paste-code workflows.',
    projectCountLabel: 'Local Projects',
    localProjectNote: 'Projects are stored in this browser and can be backed up as a project.cmb package.',
    assetsEyebrow: 'Demo Assets',
    assetsTitle: 'Cleaning Product Page Assets',
    assetsBody: 'Demo assets will become reusable brand assets. This version starts with cleaning-product specs and upload guidance.',
    settingsEyebrow: 'Settings',
    settingsTitle: 'Current Settings',
    settingsBody: 'NEXORA is currently in Local Project Mode. Projects and images stay local first; .cmb export includes project.json and images/.',
    currentSettings: 'Current Settings',
  },
  ja: {
    homeEyebrow: 'NEXORA Workspace',
    homeTitle: 'キャンペーン制作、プロジェクト管理、素材のバックアップ',
    homeBody: 'NEXORA Builder は最初に公開しているツールです。CMS 向けのキャンペーンモジュール、貼り付けコード、ZIP、持ち運び可能な .cmb プロジェクトを作成できます。',
    currentTool: '現在のツール',
    toolDescription: 'NEXORA Builder はキャンペーンページ、商品ランディングページ、CMS 貼り付けワークフローに対応します。',
    projectCountLabel: 'ローカルプロジェクト',
    localProjectNote: 'このブラウザに保存され、project.cmb としてバックアップできます。',
    assetsEyebrow: 'Demo Assets',
    assetsTitle: 'クリーニング商品ページ素材',
    assetsBody: '素材包會逐步整理成可重複使用的品牌資產。まずは清掃用品の商品ページ仕様とアップロード例を用意しています。',
    settingsEyebrow: 'Settings',
    settingsTitle: '現在の設定',
    settingsBody: '現在は Local Project Mode です。プロジェクトと画像はローカル優先で保存され、.cmb には project.json と images/ が含まれます。',
    currentSettings: '現在の設定',
  },
};

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
  const [workspaceSection, setWorkspaceSection] = useState<WorkspaceSection>('home');
  const [workspaceLanguage, setWorkspaceLanguage] = useState<WorkspaceLanguage>('zh');

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
  const [productBuildOpen, setProductBuildOpen] = useState(false);

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
    const storedLanguage = window.localStorage.getItem(NEXORA_WORKSPACE_LANGUAGE_KEY);
    if (storedLanguage === 'zh' || storedLanguage === 'en' || storedLanguage === 'ja') {
      setWorkspaceLanguage(storedLanguage);
    }
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
    if (!hydrated) return;
    window.localStorage.setItem(NEXORA_WORKSPACE_LANGUAGE_KEY, workspaceLanguage);
  }, [hydrated, workspaceLanguage]);

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
    const saveResult = saveProjectWorkspace(window.localStorage, nextWorkspace);
    setProjectList(projectSummaries(nextWorkspace));
    setSaveStatus(saveResult.ok ? '已儲存於本機' : '專案暫存空間不足');
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

  const handleCreateFromProduct = useCallback((input: ProductBuilderInput) => {
    const createdModules = createProductLandingModules(input);
    const themeButtonColor = {
      freshClean: '#0ea5c6',
      luxury: '#2f2a25',
      promo: '#ef4444',
      minimalCommerce: '#4f46e5',
    }[input.theme];
    setPageMode('campaign');
    setModules((prev) => [...prev, ...createdModules]);
    setSelectedId(createdModules[0]?.id ?? null);
    setButtonColor(themeButtonColor);
    setButtonTextColor('#ffffff');
    setPageBackgroundColor('#ffffff');
    setProductBuildOpen(false);
    setSaveStatus('儲存中...');
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

  const handleExportProjectFile = useCallback(async (id: string) => {
    const workspace = workspaceRef.current;
    const project = workspace?.projects.find((item) => item.id === id);
    if (!project) return;

    const blob = await createProjectPackage(project);
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
      const importedProject = createImportedProject(await parseProjectPackage(file));
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
  const exportPreflight = {
    cms: analyzeExportPreflight({
      modules,
      settings: { buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage },
      mode: 'cms',
    }),
    zip: analyzeExportPreflight({
      modules,
      settings: { buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage },
      mode: 'zip',
    }),
    cmb: analyzeExportPreflight({
      modules,
      settings: { buttonColor, buttonTextColor, pageBackgroundColor, pageBackgroundImage },
      mode: 'cmb',
    }),
  };
  const exportedEmail = generateEmailHTML(emailModules, emailSettings);

  const canExport = pageMode === 'campaign' ? modules.length > 0 : emailModules.length > 0;
  const currentProjectCount = projectList.length;
  const currentWorkspaceCopy = workspaceCopy[workspaceLanguage];

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
      <div className="nexora-liquid-shell flex h-screen items-center justify-center text-sm font-semibold text-slate-500">
        載入 NEXORA...
      </div>
    );
  }

  if (appView === 'login') {
    return (
      <main className="nexora-liquid-shell min-h-screen text-slate-950 animate-[fadeIn_0.45s_ease-out]">
        <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
          <section className="nexora-glass-dark m-4 flex items-center justify-center rounded-[2rem] px-8 py-12 text-white lg:m-6 lg:px-12">
            <div className="flex w-full items-center justify-center">
              <div className="inline-flex">
                <img src="/brand/nexora-logo.svg" alt="NEXORA" className="h-auto w-[340px] max-w-full brightness-0 invert lg:w-[440px]" />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-6 py-12">
            <form
              onSubmit={handleLogin}
              className="nexora-glass w-full max-w-md rounded-[1.75rem] p-7 animate-[panelFloatIn_0.5s_ease-out]"
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
                  className="h-12 w-full rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-semibold text-slate-950 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="client01"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-bold text-slate-500">密碼</span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-semibold text-slate-950 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="請輸入密碼"
                />
              </label>

              <label className="mb-5 flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-4 py-3">
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
                className="nexora-button flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loginLoading ? '登入中...' : '進入 NEXORA Workspace'}
                <Sparkles size={16} />
              </button>

            </form>
          </section>
        </div>
      </main>
    );
  }

  if (appView === 'workshop') {
    return (
      <div className="nexora-liquid-shell flex h-screen min-h-screen overflow-hidden text-slate-950 animate-[fadeIn_0.45s_ease-out]">
        <aside className="nexora-glass-dark m-4 mr-0 flex w-64 flex-shrink-0 flex-col justify-between rounded-[1.75rem] px-4 py-5 text-slate-300">
          <div>
            <div className="mb-7 flex items-center px-2">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img src="/brand/nexora-icon.svg" alt="" className="h-full w-full object-contain" />
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setWorkspaceSection('home')}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-bold transition-all duration-200 hover:bg-white/[0.08] hover:text-white ${workspaceSection === 'home' ? 'bg-indigo-500/[0.18] text-white before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-1 before:rounded-r-full before:bg-indigo-300' : 'text-slate-300'}`}
              >
                <Home size={18} />
                首頁
              </button>
              <button
                onClick={() => setWorkspaceSection('builder')}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-bold transition-all duration-200 hover:bg-white/[0.08] hover:text-white ${workspaceSection === 'builder' ? 'bg-indigo-500/[0.18] text-white before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-1 before:rounded-r-full before:bg-indigo-300' : 'text-slate-300'}`}
              >
                <Wrench size={18} />
                NEXORA Builder
              </button>
              <button
                onClick={() => setWorkspaceSection('assets')}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-bold transition-all duration-200 hover:bg-white/[0.08] hover:text-white ${workspaceSection === 'assets' ? 'bg-indigo-500/[0.18] text-white before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-1 before:rounded-r-full before:bg-indigo-300' : 'text-slate-300'}`}
              >
                <span className="flex items-center gap-3">
                  <FolderOpen size={18} />
                  素材
                </span>
              </button>
              <button
                onClick={() => setWorkspaceSection('settings')}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-bold transition-all duration-200 hover:bg-white/[0.08] hover:text-white ${workspaceSection === 'settings' ? 'bg-indigo-500/[0.18] text-white before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-1 before:rounded-r-full before:bg-indigo-300' : 'text-slate-300'}`}
              >
                <span className="flex items-center gap-3">
                  <Settings size={18} />
                  設定
                </span>
              </button>
            </nav>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.08] p-4 shadow-inner shadow-white/[0.03]">
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
          <header className="sticky top-0 z-10 m-4 mb-0 flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/70 px-8 py-5 shadow-sm backdrop-blur-2xl">
            <div>
              <p className="text-sm font-bold text-indigo-600">{currentWorkspaceCopy.homeEyebrow}</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">
                {workspaceSection === 'assets'
                  ? currentWorkspaceCopy.assetsTitle
                  : workspaceSection === 'settings'
                    ? currentWorkspaceCopy.settingsTitle
                    : workspaceSection === 'builder'
                      ? 'NEXORA Builder 專案'
                      : 'NEXORA Workspace'}
              </h1>
            </div>
            {workspaceSection === 'builder' && (
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
                className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <FileUp size={17} />
                匯入專案檔
              </button>
              <button
                onClick={handleCreateAndOpenProject}
                className="nexora-button flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition-all"
              >
                <Plus size={17} />
                新增活動頁
              </button>
            </div>
            )}
          </header>

          <section className="px-8 py-8">
            {workspaceSection === 'settings' && (
              <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="nexora-glass nexora-card p-6">
                  <p className="text-sm font-black text-indigo-600">{currentWorkspaceCopy.settingsEyebrow}</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-950">{currentWorkspaceCopy.currentSettings}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{currentWorkspaceCopy.settingsBody}</p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {[
                      ['平台', 'NEXORA'],
                      ['工具', 'NEXORA Builder'],
                      ['模式', 'Local Project Mode'],
                      ['專案包', 'project.cmb = project.json + images/'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-black text-slate-400">{label}</p>
                        <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                    <p className="text-sm font-black text-indigo-900">資料與圖片策略</p>
                    <p className="mt-2 text-sm leading-7 text-indigo-900/70">
                      目前帳號只做使用權控管，專案資料先存在本機瀏覽器。上傳圖片暫存在 IndexedDB，匯出 ZIP 或 .cmb 時會放入 images/，不會佔用 Neon 容量。
                    </p>
                  </div>
                </div>

                <aside className="space-y-5">
                  <div className="nexora-glass nexora-card p-5">
                    <p className="text-sm font-black text-slate-950">語言 Language</p>
                    <div className="mt-4 grid gap-2">
                      {workspaceLanguageOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setWorkspaceLanguage(option.id)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-black transition-all ${workspaceLanguage === option.id ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}`}
                        >
                          {option.label}
                          <span className="text-xs font-bold text-slate-400">{option.nativeLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="nexora-glass nexora-card p-5">
                    <p className="text-sm font-black text-slate-950">下一階段</p>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-500">
                      <li>雲端專案同步準備中</li>
                      <li>正式素材庫與圖片雲端準備中</li>
                      <li>更多 AI 與行銷工具準備中</li>
                      <li>完整多語系 Builder 表單準備中</li>
                    </ul>
                  </div>
                </aside>
              </div>
            )}

            {workspaceSection === 'assets' && (
              <div className="space-y-5">
                <div className="nexora-glass nexora-card p-6">
                  <p className="text-sm font-black text-cyan-600">{currentWorkspaceCopy.assetsEyebrow}</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-950">{currentWorkspaceCopy.assetsTitle}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{currentWorkspaceCopy.assetsBody}</p>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {[
                    ['商品主圖', '1000 x 1000 去背 PNG', '適合商品 Hero、比較模組與購買區塊使用。'],
                    ['活動 Banner', '1920 x 640 / 750 寬 M 端', '適合清潔用品促銷頁首屏與活動檔期視覺。'],
                    ['商品詳情圖', '1200 寬內容圖', '適合成分、使用步驟、前後差異與特色說明。'],
                  ].map(([title, spec, body]) => (
                    <article key={title} className="nexora-glass nexora-card overflow-hidden">
                      <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#dffbff_0,#a7e7f2_28%,#f8fafc_70%)] p-6">
                        <div className="rounded-3xl border border-white/70 bg-white/65 px-6 py-5 text-center shadow-xl shadow-cyan-100/70 backdrop-blur">
                          <p className="text-xs font-black tracking-[0.2em] text-cyan-600">{title}</p>
                          <p className="mt-3 text-2xl font-black text-slate-950">{spec}</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-black text-slate-950">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="nexora-glass nexora-card p-6">
                  <p className="text-sm font-black text-slate-950">Demo 素材流程</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {['上傳商品圖', '建立商品頁', '匯出 CMS 貼碼', '備份 project.cmb'].map((item, index) => (
                      <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                        <p className="mt-3 text-sm font-black text-slate-950">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {workspaceSection === 'home' && (
              <div className="space-y-5">
                <div className="nexora-glass nexora-card p-6">
                  <p className="text-sm font-black text-indigo-600">{currentWorkspaceCopy.homeEyebrow}</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-950">{currentWorkspaceCopy.homeTitle}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{currentWorkspaceCopy.homeBody}</p>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <button
                    onClick={() => setWorkspaceSection('builder')}
                    className="nexora-glass nexora-card group p-5 text-left"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                      <Wrench size={22} />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-950">NEXORA Builder</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">進入活動頁與商品頁專案列表，建立 CMS 可用的模組頁面。</p>
                    <p className="mt-4 text-sm font-black text-indigo-600">開啟專案 →</p>
                  </button>

                  <button
                    onClick={() => setWorkspaceSection('assets')}
                    className="nexora-glass nexora-card group p-5 text-left"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                      <FolderOpen size={22} />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-950">Demo Assets</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">查看清潔用品商品頁素材規格，包含商品圖、Banner 與詳情圖。</p>
                    <p className="mt-4 text-sm font-black text-cyan-600">查看素材 →</p>
                  </button>

                  <button
                    onClick={() => setWorkspaceSection('settings')}
                    className="nexora-glass nexora-card group p-5 text-left"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Settings size={22} />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-950">設定</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">管理語言、查看本機專案模式、圖片暫存與 .cmb 專案包說明。</p>
                    <p className="mt-4 text-sm font-black text-slate-700">查看設定 →</p>
                  </button>
                </div>
              </div>
            )}

            {workspaceSection === 'builder' && (
              <>
            <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_240px]">
              <div className="nexora-glass nexora-card p-5">
                <p className="text-sm font-bold text-indigo-600">{currentWorkspaceCopy.currentTool}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{currentWorkspaceCopy.homeTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {currentWorkspaceCopy.homeBody}
                </p>
                <p className="mt-3 text-xs font-bold text-slate-400">{currentWorkspaceCopy.toolDescription}</p>
              </div>
              <div className="nexora-glass nexora-card p-5">
                <p className="text-sm font-bold text-slate-500">{currentWorkspaceCopy.projectCountLabel}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{currentProjectCount}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{currentWorkspaceCopy.localProjectNote}</p>
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
                  className="nexora-glass nexora-card group overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    {heroPreview?.image ? (
                      <ProjectHeroImage image={heroPreview.image} title={heroPreview.title} />
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

                  <div className="mt-4 flex items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-indigo-600"
                    >
                      開啟
                      <ArrowLeft size={15} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => handleDuplicateProjectById(project.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      title="建立副本"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleExportProjectFile(project.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                      title="匯出專案檔"
                    >
                      <FileDown size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <GlobalSettingsContext.Provider value={{ buttonColor, buttonTextColor, setButtonColor, setButtonTextColor, pageBackgroundColor, setPageBackgroundColor, pageBackgroundImage, setPageBackgroundImage }}>
      <EmailSettingsContext.Provider value={{ ...emailSettings, update: updateEmailSettings }}>
        <div className="nexora-dark-shell flex h-screen min-h-screen flex-col overflow-hidden animate-[fadeIn_0.35s_ease-out]">
          {/* Top bar */}
          <header className="nexora-glass-dark z-20 m-3 mb-0 flex flex-shrink-0 items-center justify-between rounded-2xl px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setAppView('workshop')}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.10] hover:text-white"
              >
                <ArrowLeft size={14} />
                回到 Workspace
              </button>
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-white">
                <img src="/brand/nexora-icon.svg" alt="" className="h-full w-full object-contain" />
              </div>
              <span className="hidden text-sm font-semibold tracking-tight text-slate-100 sm:inline">NEXORA Builder</span>
              <div className="ml-2 hidden min-w-0 items-center gap-2 lg:flex">
                <span className="max-w-[220px] truncate rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-200">
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
                onClick={() => setProductBuildOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-2 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-500/25"
              >
                <PackagePlus size={14} />
                快速建立
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
                className="nexora-button flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-30"
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
              preflight={exportPreflight}
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

          {productBuildOpen && (
            <ProductBuildModal
              onClose={() => setProductBuildOpen(false)}
              onCreate={handleCreateFromProduct}
            />
          )}

          {projectPanelOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
              <div className="nexora-glass-dark w-full max-w-2xl rounded-[1.5rem] p-6">
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

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
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
                      className="nexora-button flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all"
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
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-slate-400">
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
