# NEXORA Builder Module Development Standard

更新日期：2026-07-01

這份文件是 NEXORA Builder 模組新增、修改、重構的硬性標準。任何動到模組相關檔案的工作，不管是新增或修改，都必須遵守本文件。

## 適用範圍

只要改到以下任一範圍，就算模組相關工作：

- `types/modules.ts`
- `modules/forms/*`
- `modules/definitions/*`
- `modules/preview/*`
- `modules/renderers/*`
- `modules/exporters/*`
- `lib/modules/*`
- `lib/export/*`
- `lib/productBuilder/*`
- `components/editor/ModuleLibrary.tsx`
- `components/editor/PreviewCanvas.tsx`
- `components/editor/PreviewModal.tsx`
- `components/editor/ExportModal.tsx`
- `docs/module-*`
- `docs/product-page-*`
- `scripts/verify-*module*`
- `scripts/verify-*product*`
- `scripts/verify-*export*`

## 核心原則

### 1. Registry 是模組入口

新增或修改模組時，必須確認模組已登錄：

- Preview：`modules/preview/ModulePreviewRenderer.tsx` 的 `previewRegistry`
- Export：`lib/modules/moduleRegistry.ts` 的 `moduleRegistry`

禁止在 `lib/export/htmlGenerator.ts` 重新新增 `switch (module.type)`。

禁止在 `modules/preview/ModulePreviewRenderer.tsx` 重新新增 `switch (module.type)`。

### 2. Builder / Preview / Export 必須盡量共用規格

目前 Phase 3 current state 是「shared static rendering parity + high-risk module definitions」。`modules/preview/ModulePreviewRenderer.tsx` 仍保留 `previewRegistry`，但每個模組都必須透過 `SharedModuleView` 讀同一份 export HTML。高風險模組必須額外登錄在 `modules/definitions/highRiskModuleDefinitions.ts`，並提供 module-scoped `cssFragment`。

因此任何模組調整都不能只看 Builder 畫布，必須同時檢查 Export DOM 與 Export CSS。全模組合約由 `npm run verify:shared-module-rendering` 與 `npm run verify:module-export-parity` 負責檢查。

新增模組時必須至少做到：

- Preview 與 Export 使用同一份資料來源。
- Builder / Preview 入口不可繞過 `SharedModuleView`。
- 高風險模組不可直接在 `moduleRegistry` 呼叫 exporter，必須透過 `renderHighRiskModuleHTML`。
- Preview 與 Export 的 item 數量、排序、空狀態、RWD 行為一致。
- Preview 與 Export 的 variant / style 名稱一致。
- Export 不得自行增加 Preview 沒有的 DOM 或 item。
- Export 不得拆散 Preview 中作為同一組排版的 DOM，例如 icon + content、image + card、title + body。
- Export CSS 必須包含該 variant 的 desktop / tablet / mobile 規則。
- 有圖片欄位的高風險模組，缺圖時必須使用 `renderImagePlaceholder()` 顯示尺寸，並輸出 `data-image-width` / `data-image-height`。
- 圖片本身不可再壓上玻璃框線、玻璃面板或玻璃標籤。禁止在 banner / KV / 商品展示圖片上輸出類似 `glass-shell`、`glass-track`、`ambient-panel`、`floating-badge` 的覆蓋層；需要質感時只能放在文字卡、背景層或按鈕，不可壓在圖片視覺上。

目標架構：

```text
Module Definition
  ↓
Module Component
  ↓
mode="builder" | "preview" | "export"
```

### 3. 資料結構只能有一份來源

目前正式資料格式為：

```ts
{
  id: string;
  type: ModuleType;
  data: ModuleData;
}
```

短期不得破壞既有 `{ id, type, data }` 專案格式。

若要導入新格式：

```ts
{
  id: string;
  type: string;
  variant: string;
  props: Record<string, unknown>;
  styles: Record<string, unknown>;
  children?: unknown[];
  order?: number;
}
```

必須先做 compatibility layer，不可直接讓舊專案失效。

### 4. CSS 必須 scoped

Export CSS 必須使用模組 scope。

允許：

```css
.cb-product-showcase {}
.cb-product-showcase__title {}
.cb-product-showcase--split {}
```

或未來：

```css
.nexora-product-showcase-01 {}
.nexora-product-showcase-01__title {}
```

禁止：

```css
.title {}
.image {}
.button {}
.container {}
```

### 5. Builder-only 樣式不得進 Export

Export HTML / CSS 不得輸出：

- `.builder-canvas`
- `.module-wrapper`
- `.selected`
- `.drag-handle`
- `.resize-handle`
- `.editor-toolbar`
- 編輯器選取框
- 拖曳控制
- hover toolbar

這些只能存在 Builder mode。

### 6. 排版優先使用 grid / flex / aspect-ratio

主要版面不得依賴 absolute positioning。

優先使用：

- `display: grid`
- `display: flex`
- `max-width`
- `gap`
- `padding`
- `aspect-ratio`
- `object-fit`
- `minmax(0, 1fr)`
- `min-width: 0`

限制使用：

- `position: absolute`
- `top / left`
- `transform: translate`
- 固定高度
- 固定寬度

absolute 只能用於裝飾、badge、背景層，不可作為主要排版基礎。

### 7. RWD 必須跟模組綁在一起

每個 module variant 都要確認：

- Desktop
- Tablet
- Mobile
- CMS 寬度變化
- ZIP / local HTML 開啟

RWD 不可只存在 Builder Preview。Export CSS 必須包含完整規則。

Builder / Preview 的手機畫布必須透過 `.nexora-preview-mobile-scope` 強制套用 mobile media rules，不能只依賴瀏覽器 viewport。

### 8. Export 必須獨立可用

匯出 HTML 必須包含完整：

- reset / base CSS
- layout CSS
- module CSS
- responsive CSS
- animation CSS
- font 設定
- image sizing 設定

匯出結果不可依賴 `app/globals.css` 或 Builder 頁面的 Tailwind class。

### 9. 圖片與 item 數量要與 Preview 一致

如果 Preview 只顯示前三品，Export 也只能輸出前三品。

如果 Preview 有 mobile image fallback，Export 也要有同樣 fallback。

如果 Preview 有尺寸限制，Export 也要輸出對應 CSS。

### 10. 每次修改都要有 verifier

新增或修改模組時，必須補或更新 verifier。

最低要求：

- registry coverage
- export CSS safety
- preview/export parity
- mobile rule
- CMS consistency
- shared rendering bridge
- high-risk module definition / css fragment / image placeholder

### 11. 全模組都要被合約涵蓋

每一個 `ModuleType` 都必須被 `scripts/verify-module-export-parity.mjs` 納入合約。合約最低要檢查：

- `previewRegistry` 有登錄該 type，且透過 `SharedModuleView` 渲染。
- Exporter file 存在且輸出正確 root class。
- `previewRegistry` 不得直接 import per-module preview component。
- `moduleRegistry` 有登錄該 type。
- Export CSS 有該模組 root selector。
- 高風險 variant 有專屬 parity rule，例如 item 數量、DOM wrapper、RWD grid、圖片尺寸。

如果新增 `ModuleType` 但沒有更新這支 verifier，工作不算完成。

### 12. 視覺變體要有真差異

模組 style / variant 不可只是換文案或微調顏色。每個變體至少要有一個明確差異：

- layout 差異，例如 grid / split / stacked / editorial。
- content hierarchy 差異，例如 icon-first、image-first、comparison-first。
- spacing / card treatment 差異，例如 dense card、premium panel、glass overlay。
- interaction / motion 差異，例如 hover lift、soft reveal、carousel behavior。

如果兩個變體輸出結果幾乎一樣，必須合併或重做，不要保留假選項。

## 新增模組流程

新增模組時照順序執行：

1. 更新 `types/modules.ts`
2. 更新 module schema / default data
3. 新增或更新 form
4. 確認 `previewRegistry` 透過 `SharedModuleView` 支援該模組
5. 登錄 `previewRegistry`
6. 新增或更新 exporter
7. 登錄 `moduleRegistry`
8. 新增或更新 scoped export CSS
9. 新增 verifier
10. 更新文件
11. 跑驗證
12. commit / push

## 修改既有模組流程

修改既有模組時照順序執行：

1. 找出 Preview 與 Export 是否同源。
2. 找出資料來源是否一致。
3. 先新增 failing verifier。
4. 修改 Preview / Export / CSS。
5. 更新 docs。
6. 跑驗證。
7. commit / push。

## 必跑驗證

模組相關修改至少跑：

```bash
npm run verify:full-module-export-stability
npm run verify:phase3-shared-modules
npm run verify:shared-module-rendering
npm run verify:module-export-parity
npm run verify:module-rendering-architecture
npm run verify:product-export-hotfixes
npm run verify:cms-consistency
npm run verify:visual-safety
npm run typecheck
npm run build
```

視修改範圍加跑：

```bash
npm run verify:module-taxonomy
npm run verify:product-style-distinction
npm run verify:product-page-visual-upgrade
npm run verify:general-campaign-visual-upgrade
npm run verify:product-starter-export-readiness
npm run verify:export-preflight
```

## 不可接受的完成狀態

- 只修 Builder，不修 Export。
- 只修 Export，不修 Preview。
- 只修 CSS，不補 verifier。
- 新增模組但沒有登錄 registry。
- 新增 style 但 Preview / Export 顯示不同。
- 文件沒有更新。
- 匯出結果需要依賴 Builder 頁面的 CSS 才正常。

功能做完但文件沒有更新，不算完成。

## 完成定義

模組工作完成必須同時符合：

1. Builder 畫布可正常顯示。
2. Preview Modal 可正常顯示。
3. Export 貼碼可獨立顯示。
4. ZIP HTML 可獨立打開。
5. Desktop / Mobile 不跑版。
6. verifier 通過。
7. 文件已更新。
8. commit 已建立。
9. 需要上正式站時已 push。

全模組匯出穩定性必須由 `npm run verify:full-module-export-stability` 驗證。這支 verifier 負責檢查每個 `ModuleType` 是否同時具備 registry、preview registry、export root class、scoped CSS 與高風險 mobile 規則。
