import { StickySidebarData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateStickySidebarHTML(data: StickySidebarData): string {
  const posClass = data.position === 'left' ? 'cb-sticky-sidebar--left' : 'cb-sticky-sidebar--right';

  const items = data.items
    .map(
      (item) => `  <a href="${escapeHtml(item.link || '#')}" class="cb-sticky-sidebar__item" style="background-color: ${escapeHtml(item.bgColor || '#6366f1')}">
    <span class="cb-sticky-sidebar__icon">${escapeHtml(item.icon)}</span>
    <span>${escapeHtml(item.label)}</span>
  </a>`
    )
    .join('\n');

  return `<div class="cb-sticky-sidebar ${posClass}">
${items}
</div>`;
}
