import { existsSync, readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = readFileSync('app/page.tsx', 'utf8');
const layout = readFileSync('app/layout.tsx', 'utf8');
const brandDoc = readFileSync('docs/nexora-brand.md', 'utf8');

assert(existsSync('public/brand/nexora-logo.svg'), 'Long-form NEXORA logo should be available as a public brand asset');
assert(existsSync('public/brand/nexora-icon.svg'), 'Square NEXORA icon should be available as a public brand asset');
assert(layout.includes("title: 'NEXORA'"), 'Browser title should use the NEXORA platform name');
assert(layout.includes('AI-powered digital creation platform'), 'Metadata should describe NEXORA as the platform');

assert(app.includes('NEXORA'), 'App shell should show the NEXORA platform name');
assert(app.includes('/brand/nexora-logo.svg'), 'Login page should render the long-form NEXORA logo');
assert(app.includes('/brand/nexora-icon.svg'), 'Workspace and editor shells should render the square NEXORA icon');
assert(app.includes('Build the Next Era.'), 'Login page should include the NEXORA tagline');
assert(app.includes('NEXORA Workspace'), 'Workspace shell should use the NEXORA Workspace name');
assert(app.includes('NEXORA Builder'), 'Campaign Builder tool should be renamed to NEXORA Builder in the workspace');
assert(app.includes('Campaign Builder'), 'Campaign Builder should remain as the current tool descriptor for continuity');
assert(app.includes('NEXORA Assets'), 'Future assets tool should follow NEXORA product naming');
assert(app.includes('NEXORA Settings'), 'Future settings area should follow NEXORA product naming');
assert(!app.includes('登入工作區'), 'Login heading should no longer use the generic workspace-only title');
assert(!app.includes('載入工作坊'), 'Loading state should no longer mention the old workshop wording');
assert(!app.includes('回到工作坊'), 'Editor return action should use workspace wording');

assert(brandDoc.includes('# NEXORA Brand Guide'), 'NEXORA brand guide should exist');
assert(brandDoc.includes('NEXORA Builder'), 'Brand guide should map Campaign Builder into NEXORA Builder');

console.log('NEXORA brand verified');
