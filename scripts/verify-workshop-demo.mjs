import { readFileSync } from 'node:fs';

const app = readFileSync('app/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(app.includes('alt="NEXORA"'), 'Login should use the NEXORA logo as the primary brand mark');
assert(app.includes('brightness-0 invert'), 'Login should render the NEXORA logo in white on the dark panel');
assert(app.includes('lg:w-[440px]'), 'Login should render a larger NEXORA logo on desktop');
assert(!app.includes('受邀測試版本'), 'Login should not show invited beta wording');
assert(!app.includes('目前專案會儲存在此瀏覽器，不會影響正式 CMS 貼碼與 ZIP 匯出功能。'), 'Login should not show the old invited beta explanation card');
assert(app.includes('進入 NEXORA Workspace'), 'Login action should feel like entering the branded workspace');
assert(app.includes('NEXORA Workspace'), 'Demo should include the branded product workspace shell');
assert(app.includes('NEXORA Builder'), 'Campaign Builder should be presented as NEXORA Builder');
assert(app.includes('NEXORA Builder 是目前第一個開放工具'), 'Workspace copy should use NEXORA Builder as the primary active tool name');
assert(app.includes('NEXORA Builder 專案'), 'Project list should use the branded tool title');
assert(app.includes('回到 Workspace'), 'Editor should provide a way back to the project canvas list');
assert(app.includes('handleLogin'), 'Demo should include a login transition handler');
assert(app.includes('handleLogout'), 'Demo should include a logout transition handler');
assert(app.includes('NEXORA Builder'), 'Sidebar should use the branded builder label');
assert(app.includes('素材'), 'Workshop sidebar should include a compact assets entry');
assert(app.includes('設定'), 'Workshop sidebar should include a compact settings entry');
assert(app.includes('準備中'), 'Unavailable future tools should be labeled as preparing');
assert(app.includes('getProjectHeroPreview'), 'Project cards should derive a hero preview from project modules');
assert(app.includes('function ProjectHeroImage'), 'Project cards should resolve local KV preview images before rendering.');
assert(app.includes('<ProjectHeroImage image={heroPreview.image} title={heroPreview.title} />'), 'Project cards should not render raw local-image URLs.');
assert(app.includes('尚未設定主視覺'), 'Project cards should show an empty hero state when no KV exists');
assert(app.includes('xl:grid-cols-4'), 'Project list should use smaller cards on wide screens');
assert(app.includes('group-hover:scale-105'), 'Hero preview should have a subtle hover animation');
assert(app.includes('h-9 w-9'), 'Project card icon buttons should use compact button height.');
assert(app.includes('px-3 py-2 text-xs'), 'Project card primary action should use compact height.');
assert(app.includes('animate-[fadeIn_0.45s_ease-out]'), 'Workspace screens should fade in subtly');
assert(app.includes('before:absolute before:left-0'), 'Active sidebar item should have a clear indicator strip');
assert(app.includes('opacity-0 transition-all duration-200 group-hover:opacity-100'), 'Project card actions should fade in on hover');
assert(app.includes('儲存中'), 'Save status should keep an explicit saving state');
assert(app.includes('animate-pulse'), 'Save status should include a small animated saving indicator');

console.log('workshop demo verified');
