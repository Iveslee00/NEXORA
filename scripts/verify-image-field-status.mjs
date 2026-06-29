import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const formField = read('components/ui/FormField.tsx');
const moduleLibrary = read('components/editor/ModuleLibrary.tsx');
const inspectorIa = read('docs/builder-inspector-ia.md');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:image-field-status"', 'package.json should expose verify:image-field-status'],
  [formField, "usage?: 'default' | 'background'", 'ImageField should support a background usage mode'],
  [formField, "usage === 'background'", 'ImageField should render background-specific hints'],
  [formField, '圖片狀態：本機上傳', 'ImageField should label local uploaded images'],
  [formField, '圖片狀態：圖片網址', 'ImageField should label URL images'],
  [formField, 'CMS 貼碼請改用圖片網址', 'ImageField should warn local images are not CMS paste ready'],
  [formField, 'ZIP 匯出會放入 images/', 'ImageField should explain ZIP image packaging'],
  [formField, 'CMS 貼碼可直接使用此圖片網址', 'ImageField should explain URL images are CMS ready'],
  [formField, '建議尺寸', 'ImageField should show explicit image spec wording'],
  [formField, '請上傳指定尺寸圖檔', 'ImageField should show a fallback spec hint'],
  [moduleLibrary, 'usage="background"', 'Global background ImageField should use background mode'],
  [moduleLibrary, 'CMS 貼碼需使用圖片網址；ZIP 可打包上傳圖', 'Global background should explain CMS and ZIP difference'],
  [inspectorIa, '背景圖 repeat-y 也納入上傳與規格提示', 'Inspector IA should document background image status'],
  [sprintSpec, 'Status：完成第一階段。已新增圖片欄位狀態提示', 'Sprint spec should mark BQ-004 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Image field status verification passed.');
