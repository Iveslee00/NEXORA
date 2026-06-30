# NEXORA Documentation Index

更新日期：2026-06-30

這份文件是 NEXORA 文件入口。後續交接給 ChatGPT、Codex 或人工開發時，先讀本檔，再依任務類型讀對應文件。

## 必讀文件

| 文件 | 用途 |
|---|---|
| `docs/site-architecture.md` | 目前網站架構、資料流、主要檔案責任 |
| `docs/module-development-standard.md` | 模組新增 / 修改的硬性標準 |
| `docs/module-rendering-export-architecture.md` | Builder / Preview / Export 渲染與匯出架構 |
| `docs/module-taxonomy.md` | 模組分類、重複模組判斷、Product / Campaign / General 邊界 |
| `docs/operations-runbook.md` | 正式站、帳號、Vercel、Neon、部署、回滾操作 |

## 產品與品牌

| 文件 | 用途 |
|---|---|
| `docs/nexora-brand.md` | NEXORA 品牌故事、定位、品牌宇宙 |
| `docs/nexora-platform-launch-plan.md` | 平台上線階段、NX 任務池、產品化路線 |
| `docs/vercel-database-cost-risk-notes.md` | Vercel / Neon / 資料庫成本與風險筆記 |

## NEXORA Builder / 模組

| 文件 | 用途 |
|---|---|
| `docs/module-development-standard.md` | 動到任何模組前必讀 |
| `docs/module-rendering-export-architecture.md` | 模組渲染、匯出、registry 遷移策略 |
| `docs/module-taxonomy.md` | 模組分類與重複判斷 |
| `docs/builder-inspector-ia.md` | 右側設定面板資訊架構 |
| `docs/product-page-starter-spec.md` | 快速建立 / Product Page Starter 規格 |
| `docs/product-page-starter-task-inventory.md` | Product Page Starter 任務池 |
| `docs/product-page-starter-qa-checklist.md` | Product Page Starter QA 清單 |

## Working Specs

`docs/superpowers/` 底下是開發中的 spec / plan，不是最終入口文件。

| 文件 | 用途 |
|---|---|
| `docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md` | Builder 品質強化 sprint 規格 |
| `docs/superpowers/plans/2026-06-30-builder-inspector-ia.md` | Inspector IA 執行計畫 |

## 文件更新規則

### 動到模組相關檔案時

必須同步檢查：

1. `docs/module-development-standard.md`
2. `docs/module-rendering-export-architecture.md`
3. `docs/module-taxonomy.md`
4. 對應 spec / task inventory
5. 對應 verify script

功能做完但文件沒有更新，不算完成。

### 動到帳號 / Neon / Vercel / 部署時

必須同步檢查：

1. `docs/operations-runbook.md`
2. `docs/site-architecture.md`
3. `docs/nexora-platform-launch-plan.md`

### 動到品牌 / 命名 / 平台定位時

必須同步檢查：

1. `docs/nexora-brand.md`
2. `docs/site-architecture.md`
3. `docs/nexora-platform-launch-plan.md`

## 文件整理原則

- `README.md` 只當入口，不塞長規格。
- 架構原則放在 architecture / standard 文件。
- 任務執行放在 specs / plans / task inventory。
- 已完成但仍有參考價值的工作文件先保留，不直接刪除。
- 任何文件新增後，必須能從本索引找到。
