import { readFileSync } from 'node:fs';

const app = readFileSync('app/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(app.includes('受邀測試版本'), 'Demo should explain this is an invited beta experience');
assert(app.includes('登入工作區'), 'Login should use neutral workspace naming while platform name is undecided');
assert(app.includes('進入工作區'), 'Login action should feel like entering a product workspace');
assert(app.includes('工作區'), 'Demo should include the product workspace shell');
assert(app.includes('Campaign Builder'), 'Demo should keep Campaign Builder as one workshop tool');
assert(app.includes('活動頁專案'), 'Campaign Builder project list should use a clearer product title');
assert(app.includes('回到工作坊'), 'Editor should provide a way back to the project canvas list');
assert(app.includes('handleLogin'), 'Demo should include a login transition handler');
assert(app.includes('handleLogout'), 'Demo should include a logout transition handler');
assert(app.includes('活動頁'), 'Sidebar should use the clearer campaign page label');
assert(app.includes('素材庫'), 'Workshop sidebar should include a clear assets entry');
assert(app.includes('準備中'), 'Unavailable future tools should be labeled as preparing');
assert(app.includes('getProjectHeroPreview'), 'Project cards should derive a hero preview from project modules');
assert(app.includes('尚未設定主視覺'), 'Project cards should show an empty hero state when no KV exists');
assert(app.includes('xl:grid-cols-4'), 'Project list should use smaller cards on wide screens');
assert(app.includes('group-hover:scale-105'), 'Hero preview should have a subtle hover animation');
assert(app.includes('animate-[fadeIn_0.45s_ease-out]'), 'Workspace screens should fade in subtly');
assert(app.includes('before:absolute before:left-0'), 'Active sidebar item should have a clear indicator strip');
assert(app.includes('opacity-0 transition-all duration-200 group-hover:opacity-100'), 'Project card actions should fade in on hover');
assert(app.includes('儲存中'), 'Save status should keep an explicit saving state');
assert(app.includes('animate-pulse'), 'Save status should include a small animated saving indicator');

console.log('workshop demo verified');
