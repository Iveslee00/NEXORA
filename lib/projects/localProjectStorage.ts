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
export const PROJECT_FILE_EXTENSION = 'cmb';
export const PROJECT_FILE_MIME_TYPE = 'application/json';
const DEFAULT_PROJECT_NAME = '未命名專案';

interface ProjectFilePayload {
  fileType: 'campaign-builder-project';
  version: 1;
  exportedAt: string;
  project: CampaignBuilderProject;
}

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

function isCampaignBuilderProject(value: unknown): value is CampaignBuilderProject {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CampaignBuilderProject>;
  return candidate.version === 1
    && typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && candidate.campaign !== undefined
    && candidate.email !== undefined
    && typeof candidate.createdAt === 'string'
    && typeof candidate.updatedAt === 'string';
}

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

export function createImportedProject(project: CampaignBuilderProject): CampaignBuilderProject {
  const now = new Date().toISOString();
  return {
    ...clone(project),
    id: generateId(),
    name: `${project.name || DEFAULT_PROJECT_NAME} 匯入`,
    createdAt: now,
    updatedAt: now,
  };
}

export function serializeProjectFile(project: CampaignBuilderProject): string {
  const payload: ProjectFilePayload = {
    fileType: 'campaign-builder-project',
    version: 1,
    exportedAt: new Date().toISOString(),
    project: clone(project),
  };

  return JSON.stringify(payload, null, 2);
}

export function parseProjectFile(raw: string): CampaignBuilderProject {
  const parsed = JSON.parse(raw) as unknown;

  if (isCampaignBuilderProject(parsed)) {
    return parsed;
  }

  if (parsed && typeof parsed === 'object') {
    const candidate = parsed as Partial<ProjectFilePayload>;
    if (
      candidate.fileType === 'campaign-builder-project'
      && candidate.version === 1
      && isCampaignBuilderProject(candidate.project)
    ) {
      return candidate.project;
    }
  }

  throw new Error('invalid-project-file');
}

export function deleteProject(workspace: ProjectWorkspace, projectId: string): ProjectWorkspace {
  const remainingProjects = workspace.projects.filter((project) => project.id !== projectId);
  const projects = remainingProjects.length > 0 ? remainingProjects : [createEmptyProject()];
  const activeProjectId = workspace.activeProjectId === projectId ? projects[0].id : workspace.activeProjectId;

  return {
    version: 1,
    activeProjectId,
    projects,
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
