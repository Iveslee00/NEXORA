import { AnchorNavData, PageModule } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getAnchorTargets } from '@/lib/modules/anchors';

export function generateAnchorNavHTML(data: AnchorNavData, moduleId: string, modules: PageModule[]): string {
  const hidden = new Set(data.hiddenTargetIds ?? []);
  const targets = getAnchorTargets(modules, moduleId).filter((target) => !hidden.has(target.id));
  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  if (targets.length === 0) return '';

  const links = targets
    .map((target) => `      <a href="${escapeHtml(target.href)}" class="cb-anchor-nav__link"${textStyle}>${escapeHtml(target.label)}</a>`)
    .join('\n');

  return `<nav class="cb-anchor-nav"${bgOverride}>
  <div class="cb-container">
    <div class="cb-anchor-nav__inner">
${links}
    </div>
  </div>
</nav>`;
}
