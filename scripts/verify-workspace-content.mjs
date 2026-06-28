import { readFileSync } from 'node:fs';

const app = readFileSync('app/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(app.includes("type WorkspaceSection = 'home' | 'builder' | 'assets' | 'settings'"), 'Workspace should have separate home, builder, assets, and settings sections.');
assert(app.includes('workspaceCopy'), 'Workspace should centralize copy for language switching.');
assert(app.includes("type WorkspaceLanguage = 'zh' | 'en' | 'ja'"), 'Workspace should support zh, en, and ja language options.');
assert(app.includes("NEXORA_WORKSPACE_LANGUAGE_KEY"), 'Language choice should be remembered locally.');
assert(app.includes('Demo Assets'), 'Assets section should expose demo assets content.');
assert(app.includes('清潔用品商品頁素材'), 'Assets demo should target the current cleaning-product use case.');
assert(app.includes('1000 x 1000'), 'Assets demo should mention product PNG image specification.');
assert(app.includes('project.cmb'), 'Settings should explain portable .cmb project packages.');
assert(app.includes('Local Project Mode'), 'Settings should explain the current local project storage mode.');
assert(app.includes('繁體中文') && app.includes('English') && app.includes('日本語'), 'Settings should expose zh/en/ja language choices.');
assert(app.includes('目前設定') && app.includes('Current Settings') && app.includes('現在の設定'), 'Settings copy should have translated headings.');
assert(app.includes('NEXORA Builder'), 'Workspace should use NEXORA Builder as the visible builder name.');
assert(!app.includes('Campaign Builder 是目前第一個開放工具'), 'Workspace home copy should not use Campaign Builder as the primary visible tool name.');
assert(!app.includes('Campaign Builder is the first active tool'), 'English workspace copy should not use Campaign Builder as the primary visible tool name.');
assert(!app.includes('Campaign Builder は最初に公開しているツールです'), 'Japanese workspace copy should not use Campaign Builder as the primary visible tool name.');
assert(!app.includes("['工具', 'Campaign Builder']"), 'Settings should identify the active tool as NEXORA Builder.');
assert(app.includes("workspaceSection === 'builder' &&"), 'Project import/create actions should only show in the NEXORA Builder section.');
assert(app.includes("setWorkspaceSection('builder')"), 'Home should route into the NEXORA Builder project list.');
assert(app.includes('素材包會逐步整理成可重複使用的品牌資產'), 'Assets section should explain future asset library direction.');

console.log('Workspace content verified.');
