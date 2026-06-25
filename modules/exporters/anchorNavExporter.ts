import { AnchorNavData, PageModule } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getAnchorTargets } from '@/lib/modules/anchors';

export function generateAnchorNavHTML(data: AnchorNavData, moduleId: string, modules: PageModule[]): string {
  const hidden = new Set(data.hiddenTargetIds ?? []);
  const targets = getAnchorTargets(modules, moduleId).filter((target) => !hidden.has(target.id));
  const bgOverride = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const styleParts = [
    data.buttonColor ? `background: ${escapeHtml(data.buttonColor)}` : '',
  ].filter(Boolean);
  const buttonStyle = styleParts.length ? ` style="${styleParts.join('; ')}"` : '';
  const textStyle = data.textColor?.includes('gradient(')
    ? ` style="background-image: ${escapeHtml(data.textColor)}; -webkit-background-clip: text; background-clip: text; color: transparent"`
    : data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';

  if (targets.length === 0) return '';

  const links = targets
    .map((target) => `      <a href="${escapeHtml(target.href)}" class="cb-anchor-nav__link"${buttonStyle}><span${textStyle}>${escapeHtml(target.label)}</span></a>`)
    .join('\n');

  return `<nav class="cb-anchor-nav"${bgOverride}>
  <div class="cb-container">
    <div class="cb-anchor-nav__inner">
${links}
    </div>
  </div>
</nav>`;
}
