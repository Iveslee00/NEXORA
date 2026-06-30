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
const docsIndex = fs.existsSync('docs/README.md') ? read('docs/README.md') : '';
const developmentStandard = fs.existsSync('docs/module-development-standard.md')
  ? read('docs/module-development-standard.md')
  : '';
const architectureDoc = fs.existsSync('docs/module-rendering-export-architecture.md')
  ? read('docs/module-rendering-export-architecture.md')
  : '';
const siteArchitectureDoc = fs.existsSync('docs/site-architecture.md') ? read('docs/site-architecture.md') : '';

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
assert(
  architectureDoc.includes('docs/module-development-standard.md'),
  'Architecture doc should reference the module development standard'
);

assert(docsIndex.includes('docs/module-development-standard.md'), 'Docs index should link the module development standard');
assert(docsIndex.includes('功能做完但文件沒有更新，不算完成'), 'Docs index should include the documentation completion rule');

assert(
  developmentStandard.includes('禁止在 `lib/export/htmlGenerator.ts` 重新新增 `switch (module.type)`'),
  'Module development standard should ban export switch regressions'
);
assert(
  developmentStandard.includes('禁止在 `modules/preview/ModulePreviewRenderer.tsx` 重新新增 `switch (module.type)`'),
  'Module development standard should ban preview switch regressions'
);
assert(
  developmentStandard.includes('功能做完但文件沒有更新，不算完成'),
  'Module development standard should include the documentation completion rule'
);
assert(
  developmentStandard.includes('npm run verify:module-rendering-architecture'),
  'Module development standard should list the architecture verifier'
);
assert(siteArchitectureDoc.includes('docs/README.md'), 'Site architecture should reference the docs index');
assert(siteArchitectureDoc.includes('docs/module-development-standard.md'), 'Site architecture should reference module standards');
assert(siteArchitectureDoc.includes('lib/modules/moduleRegistry.ts'), 'Site architecture should document module registry responsibility');

console.log('Module rendering architecture verified.');
