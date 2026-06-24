import assert from 'node:assert/strict';
import { IMAGE_SPECS, getBannerProductsImageSpecs, getKvImageSpecs, getProductBannerImageSpecs } from '../lib/assets/imageSpecs.ts';

const spec = (width, height) => ({ width, height });

const kvExpectations = [
  ['small', true, spec(780, 300), spec(750, 750)],
  ['medium', true, spec(780, 400), spec(750, 850)],
  ['large', true, spec(780, 520), spec(750, 950)],
  ['small', false, spec(1200, 300), spec(750, 750)],
  ['medium', false, spec(1200, 400), spec(750, 850)],
  ['large', false, spec(1200, 520), spec(750, 950)],
];

for (const [height, showText, desktop, mobile] of kvExpectations) {
  assert.deepEqual(getKvImageSpecs(height, showText), { desktop, mobile });
}

assert.deepEqual(getBannerProductsImageSpecs(2), { desktop: spec(500, 350), mobile: spec(750, 520) });
assert.deepEqual(getBannerProductsImageSpecs(3), { desktop: spec(500, 350), mobile: spec(750, 520) });
assert.deepEqual(getBannerProductsImageSpecs(4), { desktop: spec(500, 350), mobile: spec(750, 520) });

assert.deepEqual(getProductBannerImageSpecs('small'), { desktop: spec(700, 460), mobile: spec(750, 750) });
assert.deepEqual(getProductBannerImageSpecs('medium'), { desktop: spec(700, 600), mobile: spec(750, 850) });
assert.deepEqual(getProductBannerImageSpecs('large'), { desktop: spec(700, 740), mobile: spec(750, 900) });

assert.deepEqual(IMAGE_SPECS.split, spec(600, 450));
assert.deepEqual(IMAGE_SPECS.splitMobile, spec(750, 562));
assert.deepEqual(IMAGE_SPECS.article, spec(1200, 420));
assert.deepEqual(IMAGE_SPECS.articleMobile, spec(750, 420));
assert.deepEqual(IMAGE_SPECS.product, spec(400, 400));
assert.deepEqual(IMAGE_SPECS.logo, spec(160, 60));
assert.deepEqual(IMAGE_SPECS.bankLogo, spec(160, 60));
assert.deepEqual(IMAGE_SPECS.hero, spec(1200, 400));
assert.deepEqual(IMAGE_SPECS.heroMobile, spec(750, 850));
assert.deepEqual(IMAGE_SPECS.kv, spec(1200, 400));
assert.deepEqual(IMAGE_SPECS.kvMobile, spec(750, 850));

console.log('image specs v1.3 verified');
