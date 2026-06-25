import { readFileSync } from 'node:fs';

const previewCanvas = readFileSync('components/editor/PreviewCanvas.tsx', 'utf8');
const previewModal = readFileSync('components/editor/PreviewModal.tsx', 'utf8');
const bannerProducts = readFileSync('modules/preview/BannerProductsPreview.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(previewCanvas.includes('DESKTOP_CANVAS_WIDTH = 1200'), 'desktop preview should use a fixed 1200px canvas');
assert(previewCanvas.includes('setDesktopScale(Math.min(1'), 'desktop preview should scale down to fit laptop viewports');
assert(previewCanvas.includes('React.useLayoutEffect'), 'desktop preview scale should be calculated before paint');
assert(previewCanvas.includes('}, [isEmail, isMobile, modules.length]);'), 'desktop preview should recalculate scale after adding the first module');
assert(previewCanvas.includes('transform: `scale(${desktopScale})`'), 'desktop preview should visually scale instead of narrowing layout width');
assert(previewCanvas.includes('width: DESKTOP_CANVAS_WIDTH * desktopScale'), 'desktop preview frame should occupy scaled width');
assert(!previewCanvas.includes('zoom: desktopScale'), 'desktop preview should not use CSS zoom because it creates overflow in the editor');
assert(previewCanvas.includes('width: DESKTOP_CANVAS_WIDTH'), 'desktop preview inner canvas should keep desktop width');
assert(previewModal.includes('DESKTOP_CANVAS_WIDTH = 1200'), 'desktop modal preview should use a fixed 1200px canvas');
assert(previewModal.includes('React.useLayoutEffect'), 'desktop modal scale should be calculated before paint');
assert(previewModal.includes('transform: `scale(${desktopScale})`'), 'desktop modal preview should visually scale instead of narrowing layout width');
assert(previewModal.includes('width: DESKTOP_CANVAS_WIDTH * desktopScale'), 'desktop modal frame should occupy scaled width');
assert(!previewModal.includes('zoom: desktopScale'), 'desktop modal preview should not use CSS zoom because it creates overflow');
assert(previewModal.includes('width: DESKTOP_CANVAS_WIDTH'), 'desktop modal inner canvas should keep desktop width');
assert(bannerProducts.includes('if (!isMobile)'), 'banner products should not switch to compact layout in desktop preview');
assert(bannerProducts.includes('setIsCompact(false)'), 'desktop banner products should stay in desktop layout');
assert(bannerProducts.includes("padding: isMobile ? '32px 16px' : '48px 0'"), 'desktop banner products preview should not add horizontal padding outside the 1200px layout');
assert(readFileSync('lib/export/cssGenerator.ts', 'utf8').includes('.cb-banner-products .cb-container { padding-left: 0; padding-right: 0; }'), 'exported banner products should not add horizontal container padding on desktop');

console.log('desktop canvas verified');
