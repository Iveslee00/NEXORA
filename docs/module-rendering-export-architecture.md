# NEXORA Builder Module Rendering and Export Architecture

Operational rule: any module-related add, edit, or refactor must follow `docs/module-development-standard.md`.

更新日期：2026-07-01

This file explains the rendering/export architecture. The development standard file defines the required checklist before commit.

## Current Diagnosis

目前 NEXORA Builder 的 Campaign / Product 模組不是單一路徑渲染：

1. Builder 畫布由 `components/editor/PreviewCanvas.tsx` 包 editor-only wrapper，再呼叫 `modules/preview/ModulePreviewRenderer.tsx`。
2. Preview Modal 也呼叫 `ModulePreviewRenderer`。
3. Export 由 `lib/export/htmlGenerator.ts` 輸出 HTML，過去在該檔案用 `switch (module.type)` 再呼叫 `modules/exporters/*Exporter.ts` 手刻 HTML string。
4. Export CSS 由 `lib/export/cssGenerator.ts` 產生，與 Builder preview inline style 是兩套不同來源。

歷史問題是同一個模組目前至少有兩份主要 DOM / style 實作：

- Preview DOM：React component / inline styles。
- Export DOM：HTML string / `.cb-*` CSS。

因此「畫布正常、匯出跑版」不是單一模組 bug，而是架構分裂造成的長期風險。2026-07-01 起，Builder / Preview 先改為透過 shared static rendering bridge 讀同一份 export HTML 與 export CSS，作為全模組深層重構的止血層。

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

Phase 2 先落地 shared static rendering bridge：

```text
PageModule
  ↓
moduleRegistry[type].renderExport()
  ↓
SharedModuleView
  ├─ Builder canvas
  └─ Preview modal
```

Builder canvas 與 Preview modal 會注入同一份 `generatePageCSS()` 輸出。手機預覽另外使用 `.nexora-preview-mobile-scope` 作用域強制套用 mobile media rules，避免 390px 畫布因瀏覽器視窗大於 768px 而吃桌機樣式。

使用 `<picture>` 的模組還有一層限制：Builder 手機預覽不是實際手機瀏覽器 viewport，因此原生 media query 可能仍選到 PC 圖。`SharedModuleView` 在 mobile preview mode 會透過 `forceMobilePictureSources()` 把 `<img src>` 暫時替換成 mobile `<source srcset>`，讓使用者上傳 M 版 KV / Banner 後，畫布與預覽立即顯示 M 圖。Export HTML 仍保留標準 `<picture>` 結構，給真實裝置自行選圖。

Phase 3 目前落地高風險模組 definition 層：

```text
PageModule
  ↓
moduleRegistry[type]
  ↓
highRiskModuleDefinitions[type]
  ├─ renderHTML(data)
  └─ cssFragment
  ↓
SharedModuleView / Export HTML
```

高風險模組不得在 `moduleRegistry` 直接呼叫 exporter，必須透過 `renderHighRiskModuleHTML()`。高風險 CSS 不再只依賴大型 `cssGenerator.ts`；每個高風險 definition 必須提供 scoped `cssFragment`，再由 `generatePageCSS()` 收集輸出。

目前已納入高風險 definition：

- `hero`
- `hero-carousel`
- `banner-products`
- `product-features`
- `product-showcase`
- `product-purchase`

圖片缺圖狀態統一使用 `renderImagePlaceholder()`，匯出 HTML 會保留 `data-image-width` / `data-image-height`，並在圖像區塊顯示尺寸，避免使用者看不到設計規格。

下一階段再把高風險模組改為：

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
- Added `verify:full-module-export-stability` as the full-module gate for registry coverage, export root classes, scoped CSS, mobile rules, and builder-only class leakage.
- Added `verify:product-export-hotfixes` for current export parity hotfixes.
- Added `verify:shared-module-rendering` for shared static rendering bridge coverage.
- Added `verify:phase3-shared-modules` for high-risk module definitions, scoped CSS fragments, and image size placeholders.

## Phase 3 current state

Phase 3 is currently at shared static rendering parity plus high-risk module definitions.

This means every module type is still registered through `previewRegistry`, but the preview registry now routes every module through `SharedModuleView`, which calls `renderModuleExportHTML`. Builder canvas, Preview modal, and Export therefore share the same module HTML source.

It does not yet mean every module has a hand-authored shared React component. The current safe bridge intentionally uses export HTML as the single visual source. High-risk modules now additionally pass through `highRiskModuleDefinitions`, which gives them a formal module contract and module-scoped CSS fragments.

Current Phase 2 guardrails:

- `verify:module-export-parity` checks every `ModuleType` for SharedModuleView preview routing, exporter file, preview registry entry, export registry entry, export root class, and scoped CSS.
- `verify:shared-module-rendering` checks `SharedModuleView`, PreviewCanvas CSS injection, PreviewModal CSS injection, and forced mobile preview CSS.
- `verify:phase3-shared-modules` checks high-risk module definitions, CSS fragment collection, registry routing, and image dimension placeholders.
- High-risk product modules now have explicit parity rules for DOM wrappers, item counts, icon/text layout, KV overlay removal, product showcase card treatment, and purchase bundle grid output.
- Export DOM must not split grouped preview content into independent grid/flex children.
- Export CSS must be scoped to `.cb-*` module classes and include the variant rules needed for CMS output.

The final target remains a shared `ModuleView` / `ModuleRenderer` path using `mode="builder" | "preview" | "export"` and module-scoped CSS fragments. Until that migration is complete, shared static rendering bridge + verifier parity is the required safety gate.

## Product Export Hotfix Rules

- KV / KV 輪播不輸出黑色漸層濾鏡。
- 所有圖片、Logo、Banner、KV、商品圖、情境圖、單品主打圖不得再輸出壓在圖片上的玻璃框線、玻璃面板、玻璃標籤或裝飾框；圖片視覺需保持乾淨。
- `product-showcase` 不提供滿版形象；舊 `full-bleed` data 轉為 `spacious`。
- `product-showcase` 左右分欄文字卡必須有內距、圓角、邊框、陰影。
- `product-showcase` 留白展示圖片不可過大，需限制寬度。
- `product-purchase` 推薦組合 preview / export 固定顯示前三品。
- `product-features` export 必須有 grid overflow 防護與 mobile icon-text 規則。
- `product-features` icon-text export 必須使用 `.cb-product-features__content` 包住 title / text，避免匯出後 grid children 被拆散。

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
7. Add verifier coverage, including `verify:module-export-parity`.
8. Update docs before commit.

## Remaining Work

Phase 1 centralized routing and blocked regressions. Phase 2 makes Builder / Preview consume the same export DOM through `SharedModuleView`. Phase 3 adds high-risk module definitions and scoped CSS fragments for the modules most likely to break after export.

The active product path is clean enough to use: Builder / Preview / Export and Quick Builder all resolve through the same `PageModule[]` and registry flow.

The repository still has legacy preview component files under `modules/preview/*Preview.tsx`. They are no longer the runtime source for Campaign Builder module rendering, but several older verifier scripts still inspect those files. Do not delete them casually. The cleanup must happen as a separate Legacy Preview Cleanup task:

1. Move old verifier expectations from legacy preview files to exporters / `highRiskModuleDefinitions` / export CSS.
2. Confirm `ModulePreviewRenderer.tsx` and `SharedModuleView` remain the only Campaign Builder preview runtime path.
3. Delete unused legacy preview components only after all verifier dependencies have been migrated.
4. Run full module, product starter, image, typecheck, and build gates.

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
