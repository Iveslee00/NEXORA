# NEXORA Builder Inspector IA

更新日期：2026-06-30

本文件定義 NEXORA Builder 右側設定面板的欄位分組。後續 UI 改版必須依照這份分組執行，避免每個模組各自堆疊欄位。

## 1. 目標

右側設定面板要從「所有欄位一條長列表」改成「使用者能快速找到要改的東西」。

主要目標：

- 降低密密麻麻的感覺。
- 讓內容、圖片、樣式、按鈕、進階設定分清楚。
- 讓缺圖、缺連結、CMS/ZIP 圖片規則在編輯時就能被提醒。
- 保留既有 module data，不為了 UI 分組改資料結構。

## 2. 分組定義

| Group | 中文名稱 | 負責內容 | 顯示原則 |
|---|---|---|---|
| Content | 內容 | 標題、副標、內文、商品名稱、價格、FAQ、規格文字 | 預設展開 |
| Images | 圖片 | PC/M 圖片、Logo、商品圖、背景圖、尺寸提示、上傳/連結 | 有圖片欄位時顯示 |
| Style | 樣式 | 模組樣式、版型、高度、對齊、顏色、背景 | 預設展開，但放在 Content / Images 後 |
| Action | 行動 | CTA 文字、連結、Banner 連結、商品連結、錨點跳轉 | 有 link/button 欄位時顯示 |
| Advanced | 進階 | 錨點名稱、輪播 autoplay、較少使用的控制 | 預設收合 |
| Check | 檢查 | 缺圖、尺寸不符、local image 無法貼 CMS、空連結、placeholder | 固定在面板頂部或底部摘要 |

## 3. 欄位歸屬規則

1. 使用者主要要改的文案放 Content。
2. 所有可上傳或輸入圖片 URL 的欄位放 Images。
3. `backgroundColor`、`titleColor`、`textColor`、`buttonColor`、`style`、`alignment`、`height`、`reverse` 放 Style。
4. 所有會產生 `<a href>` 或跳轉的欄位放 Action。
5. `anchorName` 永遠放 Advanced，不再固定插在所有表單最上方。
6. `anchor-nav` 是導覽模組本身，目標選擇屬於 Content，顏色屬於 Style。
7. Product card 內的 `brand`、`name`、`originalPrice`、`salePrice` 屬於 Content；`link` 屬於 Action；`image` 屬於 Images；`showBadge`、`specialTag` 屬於 Style 或 Content，依 UI 呈現可放 Content 的商品標籤區。
8. Check 不直接改資料，只顯示問題與修正入口。

## 4. 全站設定面板

全站設定不應長駐占用左側模組庫高度，也不應混入單一模組 inspector。

全站設定分組：

| Group | 欄位 |
|---|---|
| Style | 底色、按鈕色、按鈕文字色 |
| Images | 背景圖 repeat-y、背景圖尺寸規格、上傳/連結 |
| Check | CMS 貼碼使用 local 背景圖時提示需改 URL；ZIP 可打包 |

背景圖規則：

- PC 背景圖可上傳或輸入 URL。
- M 版預設沿用 PC 背景圖裁切，不新增獨立 M 欄位。
- CMS 貼碼若使用上傳圖，Preflight 必須提示需改成外部 URL。
- ZIP 匯出可把背景圖放入 `images/`。

## 5. Module Field Map

### General 通用

| Module | Content | Images | Style | Action | Advanced | Check |
|---|---|---|---|---|---|---|
| 標題區塊 | `titleCn`, `titleEn` |  | `alignment`, `titleColor`, `backgroundColor` |  | `anchorName` | 標題空白 |
| 錨點導覽 | 可跳轉模組清單、隱藏目標 |  | `backgroundColor`, `buttonColor`, `textColor` | 目標錨點 |  | 目標不存在、無可用錨點 |
| KV | `kicker`, `title`, `subtitle`, `showText` | `image`, `mobileImage` | `height`, `layout`, `backgroundColor`, `titleColor`, `textColor` | `buttonText`, `buttonLink`，純 Banner 時為整張圖連結 | `anchorName` | 缺 PC/M 圖、純 Banner 無連結、local image 貼碼 |
| KV 輪播 | slides 文字、`showText` | slide `image`, `mobileImage` | `height`, slide `alignment`, `titleColor`, `textColor`, `backgroundColor` | slide `buttonText`, `buttonLink` | `autoPlay`, `anchorName` | 任一 slide 缺圖、空連結、PC/M 不完整 |
| 圖文區塊 | `title`, `description` | `image`, `mobileImage` | `height`, `reverse`, `backgroundColor`, `titleColor`, `textColor` | `buttonText`, `buttonLink` | `anchorName` | 缺圖、CTA 空連結 |
| 文章內容 | `eyebrow`, `title`, `subtitle`, `content`, `author`, `date` |  | `alignment`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 內文空白 |
| 文章搭配圖片 | `eyebrow`, `title`, `subtitle`, `content`, `author`, `date` | `image`, `mobileImage` | `imagePosition`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 缺圖、PC/M 尺寸不符 |
| FAQ | `items.question`, `items.answer` |  | `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 問題或回答空白 |
| 品牌 Logo 牆 | `logos.alt` | `logos.image` | `backgroundColor`, `titleColor` | `logos.link` | `anchorName` | Logo 缺圖、Logo 比例不符 |

### Campaign 活動頁

| Module | Content | Images | Style | Action | Advanced | Check |
|---|---|---|---|---|---|---|
| 商品列表 | product `brand`, `name`, prices, badges | product `image` | `backgroundColor`, `titleColor`, `textColor`, badge toggles | product `link` | `anchorName` | 商品缺圖、商品連結為 `#` |
| 商品輪播 | product `brand`, `name`, prices, badges | product `image` | `backgroundColor`, `titleColor`, `textColor`, badge toggles | product `link` | `anchorName` | 商品缺圖、特標高度檢查 |
| 活動 Banner + 商品 | `bannerTitle`, `bannerSubtitle`, product copy | `bannerImage`, `mobileBannerImage`, product `image` | `bannerTitleColor`, `backgroundColor`, `titleColor`, `textColor` | `bannerLink`, product `link` | `layoutLabel`, `anchorName` | Banner 缺圖、商品數量與版型不一致 |
| 單品主打 | `kicker`, `headline`, `tagline`, `brand`, `productName`, prices, badges | `image`, `mobileImage` | `height`, `reverse`, `backgroundColor`, `titleColor`, `textColor` | `buttonText`, `buttonLink` | `anchorName` | 缺 PC/M 圖、CTA 空連結 |
| 銀行優惠 | `title`, `subtitle`, card fields, disclaimer | card/logo image if present | `backgroundColor`, `titleColor`, `textColor`, item accent |  | `anchorName` | 卡片名稱或優惠空白 |

### Product 商品頁

| Module | Content | Images | Style | Action | Advanced | Check |
|---|---|---|---|---|---|---|
| 商品特色 | `eyebrow`, `title`, `subtitle`, feature items |  | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | style 說明是否足夠、項目空白 |
| 核心賣點 | `eyebrow`, `title`, `subtitle`, metric/title/description items |  | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 指標或說明空白 |
| 大圖展示 | `eyebrow`, `title`, `subtitle`, `description` | `image`, `mobileImage` | `style`, `reverse`, `backgroundColor`, `titleColor`, `textColor` | `buttonText`, `buttonLink` | `anchorName` | 缺圖、CTA 空連結 |
| 商品情境 | `eyebrow`, `title`, `subtitle`, scene items | item `image`, `mobileImage` | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 情境缺圖、雙圖情境項目不足 |
| 使用步驟 | `eyebrow`, `title`, `subtitle`, step items | item image for image-card style | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 步驟順序或圖片缺漏 |
| 商品資訊 | `eyebrow`, `title`, `subtitle`, info items |  | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 成分/技術/規格/內容物 style 是否對應內容 |
| 商品比較 | `eyebrow`, `title`, `subtitle`, before/after labels, comparison items |  | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | M 版欄位標題不可消失 |
| 信任證明 | `eyebrow`, `title`, `subtitle`, proof items |  | `style`, `backgroundColor`, `titleColor`, `textColor` |  | `anchorName` | 評價/保證/認證 style 不可同版 |
| 購買轉換 | `eyebrow`, `title`, `subtitle`, purchase items | item images if used | `style`, `backgroundColor`, `titleColor`, `textColor` | `buttonText`, `buttonLink`, item links | `anchorName` | CTA 空連結、推薦組合/相關商品語意混淆 |

## 6. BQ-003 UI Shell 建議

`BQ-003` 不應一次重寫所有模組表單。建議做法：

1. 新增共用 `InspectorSection`。
2. 新增 `InspectorGroupTabs` 或簡單 section header。
3. 先讓 `FormRenderer` 支援回傳 sectioned layout。
4. 第一批只套用高密度模組：KV、KV 輪播、商品列表、商品輪播、活動 Banner + 商品、單品主打、商品資訊、購買轉換。
5. 其餘模組保留原表單，但外層加 Content / Style / Advanced 的基本區塊。

建議不要先做太複雜的拖拉式設定或多層 Tab。右側面板寬度有限，過度分頁會讓 user 不知道欄位去哪裡。

## 7. Check Group 第一版規則

第一版 Check 可以先做成純前端提示，不阻止儲存。

| Severity | 條件 |
|---|---|
| Error | Required 圖片缺漏、CMS 貼碼含 local image、CTA 顯示但 link 空白 |
| Warning | link 為 `#`、M 圖缺漏但未標同 PC、placeholder/demo copy 未改 |
| Suggestion | 長頁無錨點、商品頁無購買轉換、活動頁無商品區 |

Check Group 和 Export Preflight 的差異：

- Check Group：編輯時提醒單一模組問題。
- Export Preflight：匯出時掃整頁並依 CMS / ZIP / `.cmb` 模式判定。

## 8. QA Checklist

`BQ-003` 開始實作後，每次右側設定改版要檢查：

- 選取每個 General 模組，主要內容欄位可找到。
- 選取每個 Campaign 模組，商品圖、商品連結、價格欄位可找到。
- 選取每個 Product 模組，style 說明與內容欄位可找到。
- 錨點名稱不再干擾主要內容編輯。
- 色盤只開一個，點旁邊可關閉。
- 圖片欄位顯示 PC/M 尺寸與 CMS/ZIP 用途。
- 任何模組欄位修改後，canvas preview 即時更新。
- Export output 與 preview 不因欄位分組改變。
