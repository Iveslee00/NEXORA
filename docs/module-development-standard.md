# NEXORA Builder Module Development Standard

更新日期：2026-06-30

這份文件是 NEXORA Builder 模組新增、修改、重構的硬性標準。任何動到模組相關檔案的工作，不管是新增或修改，都必須遵守本文件。

## 適用範圍

只要改到以下任一範圍，就算模組相關工作：

- `types/modules.ts`
- `modules/forms/*`
- `modules/preview/*`
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

目前 Phase 1 已完成 registry 收斂，但尚未完全共用 React component。

新增模組時必須至少做到：

- Preview 與 Export 使用同一份資料來源。
- Preview 與 Export 的 item 數量、排序、空狀態、RWD 行為一致。
- Preview 與 Export 的 variant / style 名稱一致。
- Export 不得自行增加 Preview 沒有的 DOM 或 item。

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

## 新增模組流程

新增模組時照順序執行：

1. 更新 `types/modules.ts`
2. 更新 module schema / default data
3. 新增或更新 form
4. 新增或更新 preview
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
