import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getAnchorTargets, getModuleAnchorHref, getModuleAnchorId } from '../lib/modules/anchors.ts';

const modules = [
  {
    id: 'title-a',
    type: 'title',
    data: {
      anchorName: '活動首頁',
      titleCn: '主要標題',
      titleEn: 'Campaign',
      alignment: 'center',
      titleColor: '',
      backgroundColor: '',
    },
  },
  {
    id: 'nav-a',
    type: 'anchor-nav',
    data: {
      hiddenTargetIds: [],
      backgroundColor: '',
      textColor: '',
    },
  },
  {
    id: 'grid-a',
    type: 'product-grid',
    data: {
      anchorName: '熱銷商品',
      backgroundColor: '',
      titleColor: '',
      textColor: '',
      products: [],
    },
  },
  {
    id: 'faq-a',
    type: 'faq',
    data: {
      backgroundColor: '',
      titleColor: '',
      textColor: '',
      items: [],
    },
  },
];

assert.equal(getModuleAnchorId('grid-a'), 'cb-anchor-grid-a');
assert.equal(getModuleAnchorHref('grid-a'), '#cb-anchor-grid-a');

const targets = getAnchorTargets(modules, 'nav-a');
assert.deepEqual(targets.map((target) => target.label), ['活動首頁', '熱銷商品']);
assert.deepEqual(targets.map((target) => target.href), ['#cb-anchor-title-a', '#cb-anchor-grid-a']);

const targetIds = new Set(targets.map((target) => getModuleAnchorId(target.id)));
for (const target of targets) {
  assert.ok(targetIds.has(target.href.slice(1)), `${target.href} should point to an existing target id`);
}

const css = readFileSync(new URL('../lib/export/cssGenerator.ts', import.meta.url), 'utf8');
assert.match(css, /flex: 0 0 168px/);
assert.match(css, /\.cb-anchor-nav__link:hover/);
assert.match(css, /transform: translateY\(-2px\)/);
assert.match(css, /flex-basis: calc\(50% - 4px\)/);

console.log('anchors verified');
