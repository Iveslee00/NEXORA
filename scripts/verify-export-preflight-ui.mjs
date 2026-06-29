import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const page = read('app/page.tsx');
const exportModal = read('components/editor/ExportModal.tsx');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');
const inspectorDoc = read('docs/builder-inspector-ia.md');

const required = [
  [packageJson, '"verify:export-preflight-ui"', 'package.json should expose verify:export-preflight-ui'],
  [page, 'analyzeExportPreflight', 'app page should generate export preflight summaries'],
  [page, 'preflight={exportPreflight}', 'ExportModal should receive preflight summaries'],
  [exportModal, 'ExportPreflightSummary', 'ExportModal should type preflight summaries'],
  [exportModal, '檢查結果', 'ExportModal should show preflight result section'],
  [exportModal, '無阻擋問題', 'ExportModal should show a clean state'],
  [exportModal, '錯誤', 'ExportModal should display errors'],
  [exportModal, '警告', 'ExportModal should display warnings'],
  [exportModal, '建議', 'ExportModal should display suggestions'],
  [exportModal, 'preflight.cms', 'Campaign paste tab should use CMS preflight'],
  [exportModal, 'preflight.zip', 'ZIP tab should use ZIP preflight'],
  [sprintSpec, 'Status：完成第一階段。匯出視窗已接上 `analyzeExportPreflight`', 'Sprint spec should mark BQ-006 first phase complete'],
  [inspectorDoc, '已完成 `BQ-006` 第一階段匯出視窗檢查提示', 'Inspector IA doc should mention BQ-006 completion'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Export preflight UI verification passed.');
