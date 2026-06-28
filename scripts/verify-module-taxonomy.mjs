import { readFileSync } from 'node:fs';

const schemas = readFileSync('data/moduleSchemas.ts', 'utf8');
const library = readFileSync('components/editor/ModuleLibrary.tsx', 'utf8');
const docs = readFileSync('docs/module-taxonomy.md', 'utf8');

for (const category of ['General', 'Campaign', 'Product', 'Brand']) {
  if (!library.includes(`key: '${category}'`)) {
    throw new Error(`Module library missing ${category} category.`);
  }
  if (!docs.includes(`### ${category}`)) {
    throw new Error(`Module taxonomy docs missing ${category} section.`);
  }
}

for (const staleCategory of ['版面區塊', '活動商品', '銷售頁模組', '內容說明', '品牌素材']) {
  if (schemas.includes(`category: '${staleCategory}'`) || library.includes(`'${staleCategory}'`)) {
    throw new Error(`Stale module category still in use: ${staleCategory}`);
  }
}

if (!library.includes('globalSettingsOpen') || !library.includes('SlidersHorizontal')) {
  throw new Error('Global settings is not using the compact collapsible control.');
}

console.log('Module taxonomy verification passed.');
