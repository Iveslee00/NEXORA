import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { IMAGE_SPECS, KV_IMAGE_SPECS, getKvImageSpecs, getBannerProductsImageSpecs } from '../lib/assets/imageSpecs.ts';

const heroPreview = readFileSync('modules/preview/HeroPreview.tsx', 'utf8');
const heroCarouselPreview = readFileSync('modules/preview/HeroCarouselPreview.tsx', 'utf8');
const css = readFileSync('lib/export/cssGenerator.ts', 'utf8');
const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

const spec = (width, height) => ({ width, height });

assert.deepEqual(IMAGE_SPECS.hero, spec(1920, 640));
assert.deepEqual(IMAGE_SPECS.kv, spec(1920, 640));
assert.deepEqual(getKvImageSpecs('small', true).desktop, spec(1920, 480));
assert.deepEqual(getKvImageSpecs('small', false).desktop, spec(1920, 480));
assert.deepEqual(getKvImageSpecs('medium', true).desktop, spec(1920, 640));
assert.deepEqual(getKvImageSpecs('medium', false).desktop, spec(1920, 640));
assert.deepEqual(getKvImageSpecs('large', true).desktop, spec(1920, 800));
assert.deepEqual(getKvImageSpecs('large', false).desktop, spec(1920, 800));
assert.deepEqual(KV_IMAGE_SPECS.medium.full.desktop, KV_IMAGE_SPECS.medium.split.desktop);

assert.deepEqual(getBannerProductsImageSpecs(2).desktop, spec(700, 350));
assert.deepEqual(getBannerProductsImageSpecs(3).desktop, spec(520, 350));
assert.deepEqual(getBannerProductsImageSpecs(4).desktop, spec(328, 350));

assert(heroPreview.includes("desktopRatio: '1920 / 640'"), 'Hero preview should use 1920 desktop ratio');
assert(heroPreview.includes("maxWidth: '1080px'"), 'Hero text should sit inside a safe content width');
assert(!heroPreview.includes("flex: isMobile ? '0 0 auto' : '0 0 35%'"), 'Hero text should not split desktop media width');
assert(heroCarouselPreview.includes("desktopRatio: '1920 / 640'"), 'KV carousel preview should use 1920 desktop ratio');
assert(heroCarouselPreview.includes("maxWidth: isMobile ? undefined : '1080px'"), 'KV carousel text should sit inside a safe content width');
assert(!heroCarouselPreview.includes("grid-template-columns: 35% 65%"), 'KV carousel should not split desktop media width');

assert(css.includes('max-width: 1080px;'), 'Generated content container should use 1080px safe width');
assert(css.includes('max-width: 1080px;'), 'Hero text should use safe content width inside full-bleed hero');
assert(css.includes('aspect-ratio: 1920 / 640'), 'Generated hero/KV CSS should use 1920 desktop ratio');
assert(!css.includes('aspect-ratio: 1200 / 400'), 'Generated hero/KV CSS should no longer use 1200 desktop ratio');

assert(formField.includes("const [colorTab, setColorTab] = useState<'solid' | 'gradient'>"), 'Color popover should have solid/gradient tabs');
assert(formField.includes('純色'), 'Color popover should expose solid colors');
assert(formField.includes('漸層'), 'Color popover should expose gradients');

console.log('pc layout verified');
