import { generateId } from '@/lib/utils';
import type { EmailSettings } from '@/types/emailModules';
import type { GlobalSettings, PageModule } from '@/types/modules';
import type {
  CampaignBuilderProject,
  ProjectDeviceMode,
  ProjectPageMode,
  ProjectSummary,
  ProjectWorkspace,
} from '@/types/project';

export const PROJECT_WORKSPACE_STORAGE_KEY = 'campaign-builder-project-workspace-v1';
const DEFAULT_PROJECT_NAME = '未命名專案';

export interface ProjectSnapshotInput {
  id?: string;
  name?: string;
  pageMode: ProjectPageMode;
  modules: PageModule[];
  selectedId: string | null;
  deviceMode: ProjectDeviceMode;
  globalSettings: GlobalSettings;
  emailModules: CampaignBuilderProject['email']['modules'];
  selectedEmailId: string | null;
  emailSettings: EmailSettings;
  createdAt?: string;
}

export const defaultGlobalSettings = (): GlobalSettings => ({
  buttonColor: '#6366f1',
  buttonTextColor: '#ffffff',
  pageBackgroundColor: '#ffffff',
  pageBackgroundImage: '',
});

export const defaultEmailSettings = (): EmailSettings => ({
  backgroundColor: '#f4f4f4',
  contentBgColor: '#ffffff',
  primaryColor: '#6366f1',
  utmString: '',
  trackingPixel: '',
  previewText: '',
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function createProjectSnapshot(input: ProjectSnapshotInput): CampaignBuilderProject {
  const now = new Date().toISOString();

  return {
    version: 1,
    id: input.id || generateId(),
    name: input.name?.trim() || DEFAULT_PROJECT_NAME,
    pageMode: input.pageMode,
    campaign: {
      modules: clone(input.modules),
      selectedId: input.selectedId,
      deviceMode: input.deviceMode,
      settings: { ...defaultGlobalSettings(), ...input.globalSettings },
    },
    email: {
      modules: clone(input.emailModules),
      selectedId: input.selectedEmailId,
      settings: { ...defaultEmailSettings(), ...input.emailSettings },
    },
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

export function createEmptyProject(name = DEFAULT_PROJECT_NAME): CampaignBuilderProject {
  return createProjectSnapshot({
    name,
    pageMode: 'campaign',
    modules: [],
    selectedId: null,
    deviceMode: 'desktop',
    globalSettings: defaultGlobalSettings(),
    emailModules: [],
    selectedEmailId: null,
    emailSettings: defaultEmailSettings(),
  });
}

export function duplicateProject(project: CampaignBuilderProject): CampaignBuilderProject {
  return {
    ...clone(project),
    id: generateId(),
    name: `${project.name || DEFAULT_PROJECT_NAME} 副本`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createProjectWorkspace(project = createEmptyProject()): ProjectWorkspace {
  return {
    version: 1,
    activeProjectId: project.id,
    projects: [project],
  };
}

export function upsertProject(workspace: ProjectWorkspace, project: CampaignBuilderProject): ProjectWorkspace {
  const exists = workspace.projects.some((item) => item.id === project.id);
  const projects = exists
    ? workspace.projects.map((item) => (item.id === project.id ? project : item))
    : [...workspace.projects, project];

  return {
    version: 1,
    activeProjectId: project.id,
    projects,
  };
}

export function projectSummaries(workspace: ProjectWorkspace): ProjectSummary[] {
  return workspace.projects
    .map((project) => ({ id: project.id, name: project.name, updatedAt: project.updatedAt }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getActiveProject(workspace: ProjectWorkspace): CampaignBuilderProject {
  return workspace.projects.find((project) => project.id === workspace.activeProjectId)
    ?? workspace.projects[0]
    ?? createEmptyProject();
}

function isProjectWorkspace(value: unknown): value is ProjectWorkspace {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ProjectWorkspace>;
  return candidate.version === 1
    && typeof candidate.activeProjectId === 'string'
    && Array.isArray(candidate.projects);
}

export function loadProjectWorkspace(storage: Storage): ProjectWorkspace {
  try {
    const raw = storage.getItem(PROJECT_WORKSPACE_STORAGE_KEY);
    if (!raw) return createProjectWorkspace();
    const parsed = JSON.parse(raw) as unknown;
    if (!isProjectWorkspace(parsed)) return createProjectWorkspace();
    if (parsed.projects.length === 0) return createProjectWorkspace();
    return parsed;
  } catch {
    return createProjectWorkspace();
  }
}

export function saveProjectWorkspace(storage: Storage, workspace: ProjectWorkspace) {
  storage.setItem(PROJECT_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
}
