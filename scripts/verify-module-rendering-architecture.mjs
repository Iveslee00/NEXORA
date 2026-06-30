import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const pkg = JSON.parse(read('package.json'));
const htmlGenerator = read('lib/export/htmlGenerator.ts');
const previewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const registry = fs.existsSync('lib/modules/moduleRegistry.ts') ? read('lib/modules/moduleRegistry.ts') : '';
const types = read('types/modules.ts');
const architectureDoc = fs.existsSync('docs/module-rendering-export-architecture.md')
  ? read('docs/module-rendering-export-architecture.md')
  : '';

const typeMatch = types.match(/export type ModuleType =([\s\S]*?);/);
assert(typeMatch, 'ModuleType union should be readable');
const moduleTypes = [...typeMatch[1].matchAll(/\|\s*'([^']+)'/g)].map((match) => match[1]);
assert(moduleTypes.length > 0, 'ModuleType union should include module names');

assert(
  pkg.scripts['verify:module-rendering-architecture'] === 'node --no-warnings scripts/verify-module-rendering-architecture.mjs',
  'package.json should expose verify:module-rendering-architecture'
);

assert(registry.includes('moduleRegistry'), 'Export module registry should exist');
assert(registry.includes('renderModuleExportHTML'), 'Registry should expose renderModuleExportHTML');
for (const type of moduleTypes) {
  assert(registry.includes(`'${type}'`), `Registry missing module type: ${type}`);
}

assert(htmlGenerator.includes("from '@/lib/modules/moduleRegistry'"), 'HTML export should import the module registry');
assert(!/switch\s*\(\s*module\.type\s*\)/.test(htmlGenerator), 'HTML export should not hand-code a separate module switch');

assert(previewRenderer.includes('previewRegistry'), 'Preview renderer should use a registry map');
assert(!/switch\s*\(\s*module\.type\s*\)/.test(previewRenderer), 'Preview renderer should not hand-code a separate module switch');

assert(architectureDoc.includes('Current Diagnosis'), 'Architecture doc should include diagnosis');
assert(architectureDoc.includes('Migration Rule'), 'Architecture doc should include migration rule');
assert(architectureDoc.includes('Do not add a new module without registering it'), 'Architecture doc should define future module rule');

console.log('Module rendering architecture verified.');
