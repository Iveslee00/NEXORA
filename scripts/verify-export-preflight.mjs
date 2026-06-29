import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const preflight = read('lib/export/preflight.ts');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:export-preflight"', 'package.json should expose verify:export-preflight'],
  [preflight, "export type ExportPreflightMode = 'cms' | 'zip' | 'cmb'", 'preflight should support cms/zip/cmb modes'],
  [preflight, "export type ExportPreflightSeverity = 'error' | 'warning' | 'suggestion'", 'preflight should expose severity levels'],
  [preflight, 'export function analyzeExportPreflight', 'preflight should export analyzeExportPreflight'],
  [preflight, 'CMS 貼碼請改用圖片網址', 'preflight should error on local images for CMS paste'],
  [preflight, '必填圖片尚未設定', 'preflight should detect missing required images'],
  [preflight, '按鈕連結尚未設定', 'preflight should detect visible CTA without link'],
  [preflight, '連結仍為 #', 'preflight should warn on placeholder links'],
  [preflight, '手機圖尚未設定', 'preflight should warn when mobile image is missing'],
  [preflight, '錨點目標不存在', 'preflight should warn on invalid anchor targets'],
  [preflight, '長頁建議加入錨點導覽', 'preflight should suggest anchor nav on long pages'],
  [preflight, '商品頁建議加入購買轉換', 'preflight should suggest final purchase CTA'],
  [preflight, 'hasErrors', 'preflight summary should expose hasErrors'],
  [sprintSpec, 'Status：完成第一階段。已新增 `lib/export/preflight.ts`', 'Sprint spec should mark BQ-005 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Export preflight verification passed.');
