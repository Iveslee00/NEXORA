import type { PageModule, GlobalSettings } from '@/types/modules';
import type { EmailPageModule, EmailSettings } from '@/types/emailModules';

export type ProjectPageMode = 'campaign' | 'email';
export type ProjectDeviceMode = 'desktop' | 'mobile';

export interface CampaignProjectState {
  modules: PageModule[];
  selectedId: string | null;
  deviceMode: ProjectDeviceMode;
  settings: GlobalSettings;
}

export interface EmailProjectState {
  modules: EmailPageModule[];
  selectedId: string | null;
  settings: EmailSettings;
}

export interface CampaignBuilderProject {
  version: 1;
  id: string;
  name: string;
  pageMode: ProjectPageMode;
  campaign: CampaignProjectState;
  email: EmailProjectState;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWorkspace {
  version: 1;
  activeProjectId: string;
  projects: CampaignBuilderProject[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
}
