# Product Starter QA Checklist

更新日期：2026-06-29

本文件用於每次正式推版前檢查 NEXORA Builder 的「快速建立」商品頁流程。測試時請填 `Pass`、`Fail` 或 `N/A`，並在 Note 記錄專案名稱、瀏覽器、裝置尺寸、失敗原因或截圖檔名。

## 1. 測試範圍

### 必測產業

| Industry | Result | Note |
|---|---|---|
| 清潔用品 |  |  |
| 美妝保養 |  |  |
| 電商綜合 |  |  |

### 必測商品頁目的

| Goal | Expected focus | Result | Note |
|---|---|---|---|
| 爆品銷售 | 價格、利益點、購買 CTA 明確 |  |  |
| 新品上市 | 視覺形象、核心特色、品牌感明確 |  |  |
| 比較說服 | 差異、使用前後、比較表明確 |  |  |
| 情境導購 | 生活情境、適用場景、適用對象明確 |  |  |

### 必測視覺主題

| Theme | Expected visual direction | Result | Note |
|---|---|---|---|
| 清爽潔淨 | 藍白、透明感、乾淨留白 |  |  |
| 高級精品 | 低飽和、留白、精緻商品展示 |  |  |
| 強促銷 | 高對比、價格標籤、明確 CTA |  |  |
| 極簡電商 | 白底、商品突出、卡片清楚 |  |  |

### 必測頁面長度

| Length | Expected module count | Result | Note |
|---|---:|---|---|
| 快速版 | 約 5 個模組 |  |  |
| 標準版 | 約 8 個模組 |  |  |
| 完整版 | 約 12 個模組 |  |  |

## 2. 建議最小測試組合

完整排列為 `3 industries x 4 goals x 4 themes x 3 lengths = 144` 組，不適合每次人工全跑。正式試用前至少跑以下 12 組，覆蓋所有產業、目的、主題與長度。

| ID | Industry | Goal | Theme | Length | Result | Note |
|---|---|---|---|---|---|---|
| QA-01 | 清潔用品 | 爆品銷售 | 清爽潔淨 | 快速版 |  |  |
| QA-02 | 清潔用品 | 比較說服 | 專業科技或清爽潔淨 | 標準版 |  |  |
| QA-03 | 清潔用品 | 情境導購 | 溫暖生活或極簡電商 | 完整版 |  |  |
| QA-04 | 美妝保養 | 新品上市 | 高級精品 | 快速版 |  |  |
| QA-05 | 美妝保養 | 成分安心或比較說服 | 高級精品 | 標準版 |  |  |
| QA-06 | 美妝保養 | 情境導購 | 極簡電商 | 完整版 |  |  |
| QA-07 | 電商綜合 | 爆品銷售 | 強促銷 | 快速版 |  |  |
| QA-08 | 電商綜合 | 新品上市 | 極簡電商 | 標準版 |  |  |
| QA-09 | 電商綜合 | 比較說服 | 強促銷 | 完整版 |  |  |
| QA-10 | 清潔用品 | 新品上市 | 極簡電商 | 標準版 |  |  |
| QA-11 | 美妝保養 | 爆品銷售 | 強促銷 | 標準版 |  |  |
| QA-12 | 電商綜合 | 情境導購 | 清爽潔淨 | 完整版 |  |  |

若某個主題尚未提供在 UI 選項內，請以目前最接近的主題測試並在 Note 記錄。

## 3. 快速建立流程檢查

| Check | Expected | Result | Note |
|---|---|---|---|
| Open Quick Builder | 可從 NEXORA Builder 開啟「快速建立」 |  |  |
| Product input | 品名、品牌、價格、CTA、描述可輸入 |  |  |
| Image upload | 商品主圖與背景圖可上傳，預覽不破圖 |  |  |
| Industry switch | 切換產業時保留共用欄位資料 |  |  |
| Goal switch | 切換目的後 Recipe Preview 更新 |  |  |
| Theme switch | 切換主題後配色與預覽方向更新 |  |  |
| Length switch | 切換長度後模組數量合理變化 |  |  |
| Readiness hints | 缺主圖、CTA 或關鍵欄位時有提示，不阻擋建立 |  |  |
| Create page | 建立後回到同一畫布 |  |  |
| Editable modules | 產生後模組可拖拉、刪除、複製、編輯 |  |  |

## 4. 模組內容檢查

| Check | Expected | Result | Note |
|---|---|---|---|
| KV / Hero | 首屏與商品目的相符，PC/M 不裁切重點 |  |  |
| 商品特色 | 四宮格、卡片式、Icon + 文字等 style 肉眼可區分 |  |  |
| 大圖展示 | 左右分欄、滿版、精品展示有明確差異 |  |  |
| 商品資訊 | 成分、技術、規格、內容物語意不同 |  |  |
| 商品比較 | PC/M 表格不跑版，欄位標題清楚 |  |  |
| 信任證明 | 評價、保證、認證三種 style 不相同 |  |  |
| 購買與轉換 | CTA、推薦組合、相關商品商業目的清楚 |  |  |
| Placeholder | 沒上圖時不出現破圖 icon |  |  |
| Button style | 預設深色底白字，可讀性正常 |  |  |
| Text hierarchy | 標題最大，內文與輔助文字層級一致 |  |  |

## 5. PC / Mobile RWD 檢查

| Check | Expected | Result | Note |
|---|---|---|---|
| Desktop canvas | 桌機預覽維持桌機版型，不因工作區變窄轉手機版 |  |  |
| Desktop spacing | 模組不貼邊，Hero 外其他模組有合理容器寬度 |  |  |
| Mobile preview | M 版可切換且不爆版 |  |  |
| Mobile hero | M 版 Hero 不過扁，文字與圖片順序合理 |  |  |
| Mobile product cards | 商品卡不裁切特標、價格與 CTA |  |  |
| Mobile comparison | 比較表欄位不超出畫面 |  |  |

## 6. 圖片與匯出檢查

| Check | Expected | Result | Note |
|---|---|---|---|
| Local image preview | 上傳圖片後預覽正常，不出現黑畫面 |  |  |
| CMS paste code | 貼碼不包含 base64 圖片，遇本機圖片會提示改用圖片連結 |  |  |
| HTML / CSS / JS tabs | 三種分頁內容完整且可複製 |  |  |
| ZIP export | ZIP 內含 `index.html`、`css/style.css`、`js/campaign.js`、`images/` |  |  |
| ZIP image paths | HTML 圖片路徑指向 `images/xxx` |  |  |
| `.cmb` export | `.cmb` 內含 `project.json` 與 `images/` |  |  |
| `.cmb` import | 匯入 `.cmb` 後圖片與模組可還原 |  |  |
| Re-export | 匯入 `.cmb` 後再次匯出 ZIP 不破圖 |  |  |

## 7. Release Decision

| Decision | Owner | Result | Note |
|---|---|---|---|
| Can trial users test tomorrow? |  |  |  |
| Blocking issue exists? |  |  |  |
| Known issue accepted? |  |  |  |
| Needs rollback? |  |  |  |
| Next required fix |  |  |  |

## 8. Failure Log

| Time | Browser / Device | Test ID | Issue | Severity | Owner | Status |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
