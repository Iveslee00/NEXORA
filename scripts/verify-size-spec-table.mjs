import assert from 'node:assert/strict';
import { SIZE_SPEC_SECTIONS } from '../lib/assets/sizeSpecTable.ts';

const allRows = SIZE_SPEC_SECTIONS.flatMap((section) => section.tables.flatMap((table) => table.rows));
const hasRow = (cells) => allRows.some((row) => cells.every((cell, index) => row.cells[index] === cell));

assert.equal(SIZE_SPEC_SECTIONS[0].title, '一、KV Banner');
assert.ok(hasRow(['KV', '有文字區', 'S', '780 x 300', '750 x 210']));
assert.ok(hasRow(['KV', '純 Banner', 'L', '1200 x 520', '750 x 500']));
assert.ok(hasRow(['活動 Banner + 4 商品', 'Banner 左、4 商品右側 2x2 格', '500 x 800', 'Banner 上、4 商品下方 2x2 格', '750 x 900']));
assert.ok(hasRow(['單品主打', 'M', '700 x 600', '750 x 850']));
assert.ok(hasRow(['圖文區塊 S/M/L', '600 x 450', '750 x 562', '寬度統一 750px，高度維持 4:3 比例']));
assert.ok(hasRow(['文章搭配圖片（上方大圖）', '1200 x 420', '750 x 420', '高度固定，PC 全幅']));
assert.ok(hasRow(['商品列表商品圖', '400 x 400', '1:1']));
assert.ok(hasRow(['銀行 / 品牌 Logo', '160 x 60', '8:3']));

assert.ok(SIZE_SPEC_SECTIONS.some((section) => section.notes.some((note) => note.includes('M 端以 750px 寬為基準'))));

console.log('size spec table verified');
