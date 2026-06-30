# NEXORA Builder Module Rendering and Export Architecture

Operational rule: any module-related add, edit, or refactor must follow `docs/module-development-standard.md`.

This file explains the rendering/export architecture. The development standard file defines the required checklist before commit.

## Current Diagnosis

目前 NEXORA Builder 的 Campaign / Product 模組不是單一路徑渲染：

1. Builder 畫布由 `components/editor/PreviewCanvas.tsx` 包 editor-only wrapper，再呼叫 `modules/preview/ModulePreviewRenderer.tsx`。
2. Preview Modal 也呼叫 `ModulePreviewRenderer`，但仍是 React preview component + inline style。
3. Export 由 `lib/export/htmlGenerator.ts` 輸出 HTML，過去在該檔案用 `switch (module.type)` 再呼叫 `modules/exporters/*Exporter.ts` 手刻 HTML string。
4. Export CSS 由 `lib/export/cssGenerator.ts` 產生，與 Builder preview inline style 是兩套不同來源。

這代表同一個模組目前至少有兩份主要 DOM / style 實作：

- Preview DOM：React component / inline styles。
- Export DOM：HTML string / `.cb-*` CSS。

因此「畫布正常、匯出跑版」不是單一模組 bug，而是架構分裂造成的長期風險。

## Root Causes

- Preview 和 Export 各自維護 DOM，容易欄位、數量、排序、RWD 行為不同步。
- Export CSS 集中在單一 `cssGenerator.ts`，模組樣式彼此接近時容易互相影響。
- 部分模組使用 absolute positioning、固定尺寸、特殊 transform，CMS 寬度不同時容易跑版。
- Product modules 快速增加後，style variant 的語意與實作沒有被同一個 registry 約束。
- 舊資料格式是 `{ id, type, data }`，variant / props / styles 混在 `data`，沒有獨立資料層。

## Migration Rule

正式站已有使用者與本機專案記憶，因此不能一次把所有資料改成新格式。遷移規則如下：

1. 保留現有 `{ id, type, data }` 作為 compatibility layer。
2. 新增 Module Registry 作為唯一模組入口。
3. Export 不允許再在 `htmlGenerator.ts` 手刻 `switch (module.type)`。
4. Preview 不允許再在 `ModulePreviewRenderer.tsx` 手刻 `switch (module.type)`。
5. 高風險模組優先改成共用 render contract，低風險模組逐步遷移。
6. 新增模組時必須同時登錄 preview / export / metadata / CSS scope / verifier。

## Target Architecture

```text
PageModule data
  ↓
Module Registry
  ↓
Module Renderer
  ├─ builder mode：加外層選取、拖曳、工具列
  ├─ preview mode：使用同一模組定義呈現
  └─ export mode：使用同一模組定義輸出 HTML / CSS
```

Phase 1 採取低風險落地方式：

```text
PageModule
  ↓
moduleRegistry[type]
  ├─ previewRegistry[type]
  └─ renderExport(module, context)
```

Phase 2 逐步把高風險模組改為：

```text
ModuleView component
  ├─ mode="preview"
  └─ mode="export"
```

最後 Export 才能全面改為：

```text
page.modules
  ↓
ModuleRenderer mode="export"
  ↓
renderToStaticMarkup
  ↓
collectModuleCss
  ↓
final HTML / CSS / JS / assets
```

## CSS Scope Rules

Export CSS 必須遵守：

- 所有模組 class 使用 `.cb-[module]` 或未來 `.nexora-[module]-[variant]` scope。
- 禁止使用 `.title`、`.image`、`.button`、`.container` 這類通用 class。
- Builder-only class 不可進入 Export：
  - `.builder-canvas`
  - `.module-wrapper`
  - `.selected`
  - `.drag-handle`
  - `.resize-handle`
  - `.editor-toolbar`
- 每個 module variant 的 RWD 規則必須跟著 module CSS 一起定義。

## Current Phase 1 Changes

- Added `lib/modules/moduleRegistry.ts`.
- `lib/export/htmlGenerator.ts` now renders modules through `renderModuleExportHTML`.
- `modules/preview/ModulePreviewRenderer.tsx` now uses `previewRegistry`.
- Added `verify:module-rendering-architecture`.
- Added `verify:product-export-hotfixes` for current export parity hotfixes.

## Product Export Hotfix Rules

- KV / KV 輪播不輸出黑色漸層濾鏡。
- `product-showcase` 不提供滿版形象；舊 `full-bleed` data 轉為 `spacious`。
- `product-showcase` 左右分欄文字卡必須有內距、圓角、邊框、陰影。
- `product-showcase` 留白展示圖片不可過大，需限制寬度。
- `product-purchase` 推薦組合 preview / export 固定顯示前三品。
- `product-features` export 必須有 grid overflow 防護與 mobile icon-text 規則。

## Future Module Rule

Do not add a new module without registering it in the registry.

Do not complete module work without updating the related docs and verifier. 功能做完但文件沒有更新，不算完成。

新增模組最小流程：

1. Add or update type in `types/modules.ts`.
2. Add default data in `app/page.tsx` module schema.
3. Add form in `modules/forms`.
4. Add preview renderer entry in `previewRegistry`.
5. Add export renderer entry in `moduleRegistry`.
6. Add scoped CSS in export CSS source.
7. Add verifier coverage.
8. Update docs before commit.

## Remaining Work

Phase 1 only centralizes routing and blocks regressions. It does not yet make every module share the same React component.

Next phases:

1. Extract pure `ModuleView` components for high-risk modules:
   - `hero`
   - `hero-carousel`
   - `product-showcase`
   - `product-features`
   - `product-purchase`
   - `banner-products`
2. Add `mode="preview" | "export"` to those ModuleView components.
3. Move module CSS from one large `cssGenerator.ts` into module-scoped CSS fragments.
4. Add CSS collection from registry.
5. Replace legacy string exporters module by module.
