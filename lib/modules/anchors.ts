import type { PageModule } from '@/types/modules';

export interface AnchorTarget {
  id: string;
  href: string;
  label: string;
}

export const getModuleAnchorId = (moduleId: string) => `cb-anchor-${moduleId}`;

export const getModuleAnchorHref = (moduleId: string) => `#${getModuleAnchorId(moduleId)}`;

export const getAnchorTargets = (modules: PageModule[], currentModuleId?: string): AnchorTarget[] =>
  modules
    .filter((module) => module.type !== 'anchor-nav' && module.id !== currentModuleId)
    .map((module) => ({
      id: module.id,
      href: getModuleAnchorHref(module.id),
      label: 'anchorName' in module.data ? module.data.anchorName?.trim() ?? '' : '',
    }))
    .filter((target) => target.label.length > 0);
