# NEXORA Release QA Checklist

更新日期：2026-06-28

每次推正式站前，請用本文件逐項檢查。結果請填 `Pass`、`Fail` 或 `N/A`，並在 Note 記錄 commit、Vercel deployment 或異常。

## Release Info

| 項目 | 內容 |
|---|---|
| Date |  |
| Commit |  |
| Vercel deployment |  |
| Tester |  |
| Browser |  |
| Result |  |

## 1. Local Verification

| Check | Command | Result | Note |
|---|---|---|---|
| TypeScript | `npm run typecheck` |  |  |
| Production build | `npm run build` |  |  |
| Auth foundation | `npm run verify:auth-foundation` |  |  |
| Workspace content | `npm run verify:workspace-content` |  |  |
| Workshop demo | `npm run verify:workshop-demo` |  |  |
| NEXORA brand | `npm run verify:nexora-brand` |  |  |
| Module taxonomy | `npm run verify:module-taxonomy` |  |  |
| Product MVP modules | `npm run verify:product-mvp-modules` |  |  |
| Module visual polish | `npm run verify:module-visual-polish` |  |  |
| Product Starter | `npm run verify:product-page-starter` |  |  |
| CMS export | `npm run verify:cms-consistency` |  |  |
| Export modal | `npm run verify:export-modal` |  |  |
| Local images | `npm run verify:local-image-store` |  |  |
| `.cmb` package | `npm run verify:project-package` |  |  |

## 2. Production Smoke Test

| Check | Expected | Result | Note |
|---|---|---|---|
| Open site | 正式站可開啟，不是 404 / blank page |  |  |
| Login page | 顯示 NEXORA logo 與登入表單 |  |  |
| Login | `client01` 可登入 |  |  |
| Workspace | 登入後進入 NEXORA Workspace |  |  |
| Navigation | 首頁、NEXORA Builder、素材、設定可切換 |  |  |
| Builder-only actions | 只有 NEXORA Builder 頁顯示「匯入專案檔 / 新增活動頁」 |  |  |
| Logout | 登出後回到登入頁 |  |  |

## 3. NEXORA Builder Manual Test

| Check | Expected | Result | Note |
|---|---|---|---|
| Create project | 可新增活動頁並進入畫布 |  |  |
| Add KV | 可新增 KV，PC/M 預覽不跑版 |  |  |
| Add product module | 可新增商品列表或商品輪播 |  |  |
| Select module | 右側 Inspector 正常顯示中文欄位 |  |  |
| Color picker | 只出現一個色盤，點外側可關閉 |  |  |
| Desktop preview | 桌機預覽維持桌機版型，不因工作區寬度變手機版 |  |  |
| Mobile preview | 手機預覽可切換且不爆版 |  |  |

## 4. Product Starter Manual Test

完整人工測試矩陣請使用 `docs/product-page-starter-qa-checklist.md`。本段只保留正式推版前的最小入口檢查。

| Check | Expected | Result | Note |
|---|---|---|---|
| Open modal | 可開啟「快速建立」 |  |  |
| Industry switch | 切換產業時保留價格、CTA 與圖片 |  |  |
| Readiness hints | 缺主圖或 CTA 連結時顯示提示，但不阻擋建立 |  |  |
| Theme selection | 四個主題可選，Recipe Preview 會更新 |  |  |
| Create page | 建立後回到同一畫布，模組可拖拉與編輯 |  |  |

## 5. Image And Package Test

| Check | Expected | Result | Note |
|---|---|---|---|
| Image upload | 上傳圖片後預覽正常，不造成黑畫面 |  |  |
| CMS paste code | 貼碼不包含 base64 圖片，遇本機圖片會提示改用圖片連結 |  |  |
| ZIP export | ZIP 內含 `index.html`、`css/style.css`、`js/campaign.js`、`images/` |  |  |
| `.cmb` export | `.cmb` 內含 `project.json` 與 `images/` |  |  |
| `.cmb` import | 匯入 `.cmb` 後圖片可重新預覽 |  |  |

## 6. Release Decision

| Decision | Owner | Note |
|---|---|---|
| Go / No-go |  |  |
| Required rollback point |  |  |
| Known issues accepted |  |  |
| Customer-facing note |  |  |

## 7. 2026-06-28 Trial Hardening Snapshot

本段記錄明天使用者試用前的自動檢查狀態。正式上線前仍建議補一次瀏覽器人工 smoke test。

| Check | Result | Note |
|---|---|---|
| Product Starter visual differentiation | Pass | 四主題已補 preset token、預覽樣式與匯出 CSS 一致性。 |
| Product Page Starter | Pass | `npm run verify:product-page-starter` |
| Product MVP modules | Pass | `npm run verify:product-mvp-modules` |
| Module visual polish | Pass | `npm run verify:module-visual-polish` |
| CMS export consistency | Pass | `npm run verify:cms-consistency` |
| Auth foundation | Pass | `npm run verify:auth-foundation` |
| Workspace content | Pass | `npm run verify:workspace-content` |
| Workshop demo | Pass | `npm run verify:workshop-demo` |
| Project package | Pass | `npm run verify:project-package` |
| Color popover behavior | Pass | `npm run verify:color-popover` |
| Desktop canvas behavior | Pass | `npm run verify:desktop-canvas` |
| Export modal | Pass | `npm run verify:export-modal` |
| Local image store | Pass | `npm run verify:local-image-store` |
| Image specs | Pass | `npm run verify:image-specs` |
| Module taxonomy | Pass | `npm run verify:module-taxonomy` |
| Preview placeholders | Pass | `npm run verify:preview-placeholders` |
| NEXORA brand | Pass | `npm run verify:nexora-brand` |
| TypeScript | Pass | `npm run typecheck` |
| Production build | Pass | `npm run build` |
| Production homepage HTTP | Pass | `curl -s -i https://campaignbuilder-coral.vercel.app/` 回 HTTP 200 |
| Production login API | Pass | `POST /api/auth/login` 回 HTTP 200 |
| Production session API | Pass | `GET /api/auth/me` 回 HTTP 200，回傳 `client01` |
| Wrong password handling | Pass | 錯誤密碼回 HTTP 401 |
| Logout handling | Pass | `POST /api/auth/logout` 回 HTTP 200，登出後 `/api/auth/me` 回 `user: null` |
| Inactive account handling | Pending | 程式查詢已限制 `is_active = true`；正式資料停用測試需先指定可停用帳號 |
| Browser manual smoke | Pending | 仍需在正式站用瀏覽器實際登入、進 Workspace、進 NEXORA Builder |
