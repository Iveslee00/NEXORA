import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const sharedView = read('modules/renderers/SharedModuleView.tsx');
const deviceContext = read('contexts/DeviceContext.tsx');

const requiredTokens = [
  [packageJson, '"verify:mobile-picture-preview"', 'package.json should expose verify:mobile-picture-preview'],
  [deviceContext, 'isMobile', 'DeviceContext should expose isMobile'],
  [sharedView, 'useDevice', 'SharedModuleView should read DeviceContext'],
  [sharedView, 'forceMobilePictureSources', 'SharedModuleView should force mobile picture sources in mobile preview'],
  [sharedView, 'data-nexora-original-media', 'Forced mobile picture markup should preserve original source media for traceability'],
  [sharedView, 'data-nexora-forced-mobile-src', 'Forced mobile picture markup should mark selected mobile src'],
];

for (const [source, token, message] of requiredTokens) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Mobile picture preview verification passed.');
