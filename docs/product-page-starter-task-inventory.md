# Product Page Starter Task Inventory

更新日期：2026-06-29

本文件是 `docs/product-page-starter-spec.md` 的執行任務池。後續 ChatGPT / Codex 接力時，應一次只處理一個 Task，不要跨 Task 擴張範圍。

## 0. 執行規則

### Scope

- 僅處理 NEXORA Builder 的 Product Page Starter 與商品頁模組體驗。
- 產生結果必須回到既有 `PageModule[]`。
- 必須沿用既有模組分類：`General`、`Campaign`、`Product`、`Brand`。
- 每個 Task 完成後都要回報修改檔案、驗證命令與結果。

### Non-scope

- 不新增另一套 Builder。
- 不新增另一套匯出系統。
- 不新增 Neon schema、migration 或雲端專案同步。
- 不把上傳圖片存進 Neon 或 localStorage。
- 不新增付費、權限等級、註冊流程、忘記密碼。
- 不因為視覺不同就新增重複模組。

### 必跑驗證

依 Task 影響範圍選用：

```bash
npm run typecheck
npm run verify:product-page-starter
npm run verify:product-builder-demo
npm run verify:product-mvp-modules
npm run verify:preview-placeholders
npm run verify:project-package
npm run build
```

## Phase 1. Product Starter UX

### Task PS-001：配方預覽可理解化

Goal：讓使用者在建立前知道會產生哪些模組，以及為什麼這樣排。

Scope：

- `ProductBuildModal` 右側顯示模組順序。
- 顯示頁面目的、長度、主題對結果的影響。
- 顯示每個模組的中文名稱。

Non-scope：

- 不改模組產生邏輯。
- 不新增模組。

Impact：

- `components/editor/ProductBuildModal.tsx`
- `lib/productBuilder/productPageBuilder.ts`
- `scripts/verify-product-page-starter.mjs`

Acceptance：

- 選不同 `goal` / `pageLength` 時，預覽模組數與順序會更新。
- `npm run verify:product-page-starter` 通過。

Status：完成於 `2019dc5d`。

### Task PS-002：產業切換時的資料保留策略

Goal：避免使用者切換產業後誤以為已輸入的品名、價格、圖片被吃掉。

Scope：

- 切換產業時保留價格、CTA、圖片。
- 明確決定是否保留品名、品牌、文案。
- 若會覆蓋文案，UI 需提示「會套用該產業範例文案」。

Non-scope：

- 不做 undo history。
- 不做多商品資料庫。

Impact：

- `components/editor/ProductBuildModal.tsx`
- `lib/productBuilder/productPageBuilder.ts`

Acceptance：

- 切換清潔用品 / 美妝 / 電商後，圖片與價格不消失。
- UI 文案清楚說明哪些資料會被範例覆蓋。
- `npm run typecheck`、`npm run verify:product-page-starter` 通過。

Status：完成於目前工作分支；已補產業切換提示與保留欄位策略。

### Task PS-003：建立前欄位完整度提示

Goal：降低使用者產生空頁或缺圖頁的機率。

Scope：

- 在建立按鈕附近顯示缺少的關鍵資料。
- 必填建議：品名、主標、商品主圖或背景圖、CTA 連結。
- 允許使用者仍可建立，但要知道缺什麼。

Non-scope：

- 不阻擋建立。
- 不做表單驗證 library。

Impact：

- `components/editor/ProductBuildModal.tsx`

Acceptance：

- 缺主圖時顯示提示。
- 缺 CTA 連結時顯示提示。
- 完整填寫後提示消失或改成「可建立」。

Status：完成於目前工作分支；已補建立前欄位完整度提示，缺資料只提醒不阻擋建立。

驗證：

- `npm run verify:product-page-starter` 通過。
- `npm run typecheck` 通過。
- `npm run build` 通過。

## Phase 2. Theme System

### Task PS-004：主題 preset 正規化

Goal：把 Product Starter 的視覺設定整理成可維護 preset，而不是散在各模組。

Scope：

- 定義主題 preset 結構。
- 包含 section 背景、卡片、CTA、文字色、陰影、placeholder tone。
- 產生模組時由 preset 決定 style 與顏色。

Non-scope：

- 不做使用者自訂主題儲存。
- 不新增全站 Theme Builder。

Impact：

- `lib/productBuilder/productPageBuilder.ts`
- 可選新增 `lib/productBuilder/productThemes.ts`

Acceptance：

- 四個主題都可從同一個 preset 來源生成。
- `npm run verify:product-page-starter` 通過。

Status：完成於目前工作分支；已將主題 preset 拆到 `lib/productBuilder/productThemes.ts`，Builder 從同一來源取得主題樣式、色彩與視覺標籤。

驗證：

- `npm run verify:product-page-starter` 通過。
- `npm run build` 通過。
- `npm run typecheck` 通過。

### Task PS-005：四主題視覺差異深化

Goal：讓清爽潔淨、高級精品、強促銷、極簡電商不只是換色，而是版面語言不同。

Scope：

- 清爽潔淨：透明感、柔光、藍白留白。
- 高級精品：低飽和、細框、玻璃文字卡、留白。
- 強促銷：標籤、價格感、高對比 CTA。
- 極簡電商：白底、格線、規格化卡片、清楚比較。

Non-scope：

- 不做動畫-heavy 版本。
- 不引入第三方動畫庫。

Impact：

- `modules/preview/ProductShowcasePreview.tsx`
- `modules/preview/ProductFeaturesPreview.tsx`
- `modules/preview/ProductAdvancedPreview.tsx`
- `modules/exporters/*` 相關商品頁 exporter

Acceptance：

- 四主題在同一商品資料下肉眼可區分。
- CMS 貼碼與 ZIP 匯出保持一致。
- `npm run build` 通過。

Status：完成於目前工作分支；四主題已補主題 token、商品頁生成文案語氣、預覽樣式與 CMS/ZIP 匯出 CSS 一致性。

驗證：

- `npm run verify:product-page-starter` 通過。
- `npm run verify:product-mvp-modules` 通過。
- `npm run verify:cms-consistency` 通過。
- `npm run typecheck` 通過。
- `npm run build` 通過。

### Task PS-006：主題與全站樣式關係整理

Goal：避免 Product Starter 套主題後，與 Builder 全站設定互相打架。

Scope：

- 定義 Product Starter 建立後是否覆蓋全站按鈕色。
- 定義模組內色彩與全站色彩的優先順序。
- 在文件中補上規則。

Non-scope：

- 不改所有舊活動頁模組。

Impact：

- `app/page.tsx`
- `docs/product-page-starter-spec.md`
- `docs/site-architecture.md`

Acceptance：

- 建立商品頁後，全站按鈕色符合所選主題。
- 使用者仍可在全站設定手動覆蓋。

Status：部分完成於 `7cae5550`；仍需建立主題與全站設定優先順序文件規則。

## Phase 3. Product Module Coverage

### Task PS-007：商品內容物模組補強

Goal：讓商品頁能清楚呈現包裝內容、組合物、容量與 SKU。

Scope：

- 使用既有 `product-info` 的 `contents` style。
- 補齊 preview/export/form 的內容物樣式。
- Product Starter 在適合情境下產生此 style。

Non-scope：

- 不新增 `product-contents` 獨立模組。

Impact：

- `modules/preview/ProductAdvancedPreview.tsx` 或 `ProductInfoPreview.tsx`
- `modules/exporters/productInfoExporter.ts`
- `modules/forms/ProductInfoForm.tsx`
- `lib/productBuilder/productPageBuilder.ts`

Acceptance：

- 商品內容物可在右側表單編輯。
- 匯出 HTML 正常。
- `npm run verify:product-mvp-modules` 通過。

Status：完成於 `e306b5a7`；已補 `product-info` 的 `contents` style，在表單、預覽與匯出 CSS 中改為包裝清單語意，並加入樣式差異驗證。

驗證：

- `npm run verify:product-style-distinction` 通過。
- `npm run verify:product-mvp-modules` 通過。
- `npm run typecheck` 通過。
- `npm run build` 通過。

剩餘人工 QA：

- 使用 Quick Builder 產生商品頁後，確認「內容物」是否在正確情境出現。
- 實際匯出 CMS 貼碼與 ZIP 後人工檢查版面。

### Task PS-008：適用場景補強

Goal：讓商品情境不只是圖片排版，而能支援「適用族群 / 場景 / 場合」。

Scope：

- 使用既有 `product-scenes`。
- 補 style 差異與欄位文案。
- Product Starter 依 `scenario` goal 優先產生。

Non-scope：

- 不新增 `product-use-cases` 模組。

Impact：

- `modules/preview/ProductScenesPreview.tsx`
- `modules/exporters/productScenesExporter.ts`
- `components/editor/ProductBuildModal.tsx`

Acceptance：

- 情境導購產生的頁面中，場景模組位置靠前。
- M 版不跑版。

Status：待做。

### Task PS-009：商品評價 / 認證 / 品牌保證補強

Goal：把信任證明做成完整可用模組，而不是單純三張卡。

Scope：

- 使用既有 `product-proof`。
- `reviews`、`guarantee`、`certifications` 三種 style 要明顯不同。
- 支援 badge、標題、說明。

Non-scope：

- 不接真實評論 API。
- 不做星等互動元件。

Impact：

- `modules/preview/ProductAdvancedPreview.tsx`
- `modules/exporters/productAdvancedExporter.ts`
- `modules/forms/ProductAdvancedForms.tsx`

Acceptance：

- 三種 proof style 肉眼可區分。
- 匯出後樣式不斷版。

Status：完成於 `e306b5a7`；`product-proof` 已將 `reviews`、`guarantee`、`certifications` 拆成星等口碑卡、印章式保證卡與證書格狀卡，表單也補上各 style 使用情境說明。

驗證：

- `npm run verify:product-style-distinction` 通過。
- `npm run verify:product-mvp-modules` 通過。
- `npm run typecheck` 通過。
- `npm run build` 通過。

剩餘人工 QA：

- 實際在 PC / M 預覽中檢查三種 proof style 是否足夠可辨識。
- 實際 CMS 貼碼檢查樣式不斷版。

### Task PS-010：推薦組合 / 相關商品補強

Goal：讓購買轉換區能支援單 CTA、推薦組合、相關商品三種商業目的。

Scope：

- 使用既有 `product-purchase`。
- 強化 `cta`、`bundle`、`related` style。
- 確認商品卡高度與圖片 placeholder 一致。

Non-scope：

- 不新增商品資料庫。
- 不接購物車 API。

Impact：

- `modules/preview/ProductAdvancedPreview.tsx`
- `modules/exporters/productAdvancedExporter.ts`
- `modules/forms/ProductAdvancedForms.tsx`

Acceptance：

- 三種 purchase style 可在表單切換。
- M 版商品卡不被裁切。

Status：完成於 `e306b5a7`；`product-purchase` 已將 `cta`、`bundle`、`related` 拆成不同商業目的。推薦組合會強化第一張主推商品，相關商品改為輕量延伸導購卡。

驗證：

- `npm run verify:product-style-distinction` 通過。
- `npm run verify:product-mvp-modules` 通過。
- `npm run typecheck` 通過。
- `npm run build` 通過。

剩餘人工 QA：

- 檢查 M 版商品卡高度與圖片比例。
- 實際用 Quick Builder 產生頁面後，確認推薦組合 / 相關商品語意沒有混淆。

## Phase 4. Image And Export QA

### Task PS-011：商品頁 placeholder 全面一致

Goal：所有商品頁模組在沒上圖時都像設計稿，不像壞圖。

Scope：

- 商品主圖使用 `variant="product"`。
- 情境 / 步驟圖使用 `variant="scene"`。
- KV / 背景使用 `variant="hero"`。
- 確認一般活動頁 placeholder 不被破壞。

Non-scope：

- 不做圖片自動生成。

Impact：

- `modules/preview/PreviewImage.tsx`
- 商品頁相關 preview files
- `scripts/verify-preview-placeholders.mjs`

Acceptance：

- 無圖時不出現破圖 icon。
- `npm run verify:preview-placeholders` 通過。

Status：部分完成於 `2019dc5d`，仍需補 hero variant 覆蓋。

### Task PS-012：ZIP / `.cmb` 商品頁圖片驗證

Goal：確認 Product Starter 生成頁面後，上傳圖檔能被 ZIP 與 `.cmb` 正確帶出與匯入。

Scope：

- 使用本地 IndexedDB 圖片流程。
- 驗證 ZIP 產出 `images/`。
- 驗證 `.cmb` 匯入後圖片參照可還原。

Non-scope：

- 不做雲端素材庫。
- 不把圖片存入 Neon。

Impact：

- `lib/projects/*`
- `lib/export/*`
- `scripts/verify-project-package.mjs`
- `scripts/verify-local-image-store.mjs`

Acceptance：

- Product Starter 生成頁面可匯出 `.cmb`。
- 匯入後模組與圖片參照存在。
- `npm run verify:project-package` 通過。

Status：部分完成；平台層 `.cmb` / ZIP 圖片流程已於 `NX-010` 完成自動驗證，但 Product Starter 生成頁面的完整人工 QA 尚未完成。

已驗證：

- `npm run verify:local-image-store` 通過。
- `npm run verify:project-package` 通過。

剩餘人工 QA：

- 用 Quick Builder 產生清潔用品 / 美妝 / 電商綜合頁面。
- 分別上傳商品圖與背景圖。
- 匯出 `.cmb` 後重新匯入，確認圖片與模組都還原。
- 匯出 ZIP 後確認 `images/` 與 HTML 圖片路徑正常。

### Task PS-013：CMS 貼碼商品頁驗證

Goal：確認 Product Starter 生成的所有商品頁模組能貼到 CMS 使用。

Scope：

- 驗證 HTML/CSS/JS 分頁輸出。
- 本地圖片在 CMS 貼碼情境需提示改用圖片網址。
- CSS 不應因 Product Starter 產生重複或漏樣式。

Non-scope：

- 不新增 CMS 平台專屬 adapter。

Impact：

- `modules/exporters/*`
- `lib/export/*`
- `components/editor/ExportModal.tsx`

Acceptance：

- 匯出貼碼不出現 base64 圖片爆字。
- Product Starter 模組匯出完整。
- `npm run verify:cms-consistency` 通過。

Status：部分完成；平台層 CMS 匯出已於 `NX-009` 驗證，Product Starter 生成頁面的三產業人工貼碼測試尚未完成。

已驗證：

- `npm run verify:cms-consistency` 通過。
- `npm run verify:export-modal` 通過。

剩餘人工 QA：

- 用 Quick Builder 生成至少三種產業頁面。
- 匯出 HTML / CSS / JS。
- 確認貼碼不含 base64 圖片爆字。
- 確認本地圖片情境會提示改用圖片網址。

## Phase 5. Industry Expansion

### Task PS-014：食品飲品產業支援

Goal：新增食品飲品商品頁生成資料結構與預設文案。

Scope：

- 新增 industry option。
- 補口味、規格、成分、產地、保存方式等文案欄位策略。
- Recipe 可先沿用現有模組。

Non-scope：

- 不新增營養標示專用模組，除非後續確認需要不同資料結構。

Impact：

- `lib/productBuilder/productPageBuilder.ts`
- `components/editor/ProductBuildModal.tsx`
- `docs/product-page-starter-spec.md`

Acceptance：

- 食品飲品可被選擇並產生頁面。
- 不影響既有三個產業。

Status：待做。

### Task PS-015：家電 3C 產業支援

Goal：支援需要規格、技術特色、比較表的 3C / 家電商品。

Scope：

- 新增 industry option。
- 預設 goal 建議偏 `comparison`。
- 強化 `product-comparison` 與 `product-info`。

Non-scope：

- 不做規格資料匯入。

Impact：

- `lib/productBuilder/productPageBuilder.ts`
- `components/editor/ProductBuildModal.tsx`

Acceptance：

- 家電 3C 產生結果包含比較與規格模組。

Status：待做。

### Task PS-016：服飾配件產業支援

Goal：支援尺寸、材質、穿搭情境與商品變體。

Scope：

- 新增 industry option。
- 預設產生情境、規格與相關商品。

Non-scope：

- 不做 SKU 管理。
- 不做尺碼推薦算法。

Impact：

- `lib/productBuilder/productPageBuilder.ts`
- `components/editor/ProductBuildModal.tsx`

Acceptance：

- 服飾配件可產生合理商品頁初稿。

Status：待做。

## Phase 6. Full QA

### Task PS-017：Product Starter 手動 QA 清單

Goal：建立每次正式推版前可以照表檢查的 QA 文件。

Scope：

- 測清潔用品 / 美妝 / 電商。
- 測四種 goal。
- 測四種 theme。
- 測三種 length。
- 測 PC / M。
- 測 CMS、ZIP、`.cmb`。

Non-scope：

- 不要求全自動 E2E。

Impact：

- `docs/product-page-starter-qa-checklist.md`

Acceptance：

- QA 文件能被人照表操作。
- 每項有通過 / 失敗 / 備註欄位。

Status：完成於目前工作分支；已新增 `docs/product-page-starter-qa-checklist.md`，覆蓋清潔用品 / 美妝 / 電商、四種商品頁目的、四種主題、三種長度、PC / M、CMS、ZIP、`.cmb` 與失敗紀錄。

驗證：

- `git diff --check` 通過。

剩餘人工 QA：

- 依 checklist 實際跑至少 12 組最小測試組合。
- 將測試結果填回 checklist 或另存試用紀錄。

### Task PS-018：Product Starter 自動驗證擴充

Goal：讓重要規則可以用 `npm run verify:*` 重跑。

Scope：

- 檢查每個 industry / goal / theme / length 都能產生至少 1 個頁面。
- 檢查所有生成模組都屬於既有 `PageModule`。
- 檢查不輸出 legacy campaign/content wrapper。

Non-scope：

- 不引入大型測試框架，除非後續決定。

Impact：

- `scripts/verify-product-page-starter.mjs`

Acceptance：

- verifier 會遍歷所有組合。
- `npm run verify:product-page-starter` 通過。

Status：待做。

## Completion Report Template

每次完成任務後使用：

```text
Task:
Commit:
Pushed:
Files changed:
Summary:
Validation commands:
Validation results:
Unfinished items:
Non-scope touched:
Human confirmation needed:
Next suggested task:
```
