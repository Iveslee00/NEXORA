# Vercel 與資料庫成本風險備忘錄

更新日期：2026-06-27

這份文件是 Campaign Builder 產品化時的部署、帳號、資料庫與成本風險備忘錄。之後新增登入、雲端專案、圖片上傳、會員或付費功能時，優先依照這份原則判斷。

## 目前產品狀態

- 使用者數：約 10 位內測 user 起步
- 部署：Vercel
- 前端：Next.js
- 專案資料：目前主要存在瀏覽器 localStorage
- 圖片策略：
  - CMS 貼碼使用圖片連結
  - 使用者上傳圖片時，主要用於 ZIP 打包，輸出到 `images/`
  - 暫時不做圖片雲端、不做圖床、不做 Blob
- 暫時不做：
  - 付款
  - 權限等級
  - 忘記密碼
  - 註冊流程
  - 圖片雲端
  - AI 功能

## 核心判斷

短期內不太容易因 Neon、Supabase 或 Vercel 爆費用。

原因是目前產品型態是低流量工具，不是高運算、高圖片流量或 AI API 型產品。主要行為會是登入、讀取專案、儲存專案 JSON、匯出貼碼或 ZIP。這類操作通常比 AI 生成、圖片處理、影片儲存、即時多人協作便宜很多。

真正容易爆費用的情境不是「有資料庫」，而是「沒有控管的高用量功能」。

## 高風險情境

以下功能上線前必須重新評估成本與限制：

1. 圖片雲端上傳
   - 會產生儲存費、讀取流量、圖片 CDN 流量。
   - 如果使用 Vercel Blob、Supabase Storage 或 S3，都要設定容量和流量警示。

2. AI 功能
   - AI API 呼叫費用可能遠高於資料庫。
   - 若搭配 Vercel Functions，還可能增加 function duration 成本。

3. 大量預覽圖生成
   - 如果每次專案列表都即時截圖、轉圖、壓圖，成本與效能都會變差。
   - 建議先用資料中的 KV 圖片或色塊預覽，不做伺服器端截圖。

4. 長時間 Serverless Function
   - Vercel Functions 適合短請求，不適合長時間批次任務。
   - 匯出 ZIP 目前若在前端完成，成本較低。

5. Bot 或外部流量暴增
   - 未設定防護時，公開網址可能被掃描或爬取。
   - 應設定 usage alerts、spending limits、必要時加簡單 rate limit。

6. 專案 JSON 無限制成長
   - 如果使用者塞入大量 base64 圖片或超大資料，資料庫和 localStorage 都會出問題。
   - 雲端專案上線時應限制單一專案大小。

## 低風險情境

以下功能適合先做：

1. 真帳號密碼
   - 使用 `users` 表儲存帳號。
   - 密碼必須 hash，不存明碼。

2. 專案雲端儲存
   - 使用 `projects` 表儲存專案 JSON。
   - 先不存圖片檔，只存圖片網址或模組資料。

3. localStorage 備援
   - localStorage 可保留為草稿暫存。
   - 不能作為唯一正式儲存。

4. 低頻 API
   - 登入、讀專案、存專案都屬於低頻短請求。
   - 初期 10 位 user 通常不會造成明顯成本壓力。

## 建議資料庫架構

帳號資料庫與專案資料庫可以使用同一個資料庫，不需要拆成兩個服務。

建議使用一個 Postgres database，裡面建立多張表：

```text
database
├── users
│   ├── id
│   ├── email
│   ├── password_hash
│   ├── display_name
│   ├── created_at
│   └── updated_at
│
├── sessions
│   ├── id
│   ├── user_id
│   ├── token_hash
│   ├── expires_at
│   └── created_at
│
└── projects
    ├── id
    ├── user_id
    ├── name
    ├── project_json
    ├── created_at
    └── updated_at
```

這樣可以做到：

- 每個帳號只看到自己的專案
- 專案可以跨裝置同步
- 之後可以加停用帳號、專案數限制、匯出紀錄
- 未來要收費時可加 `plans`、`subscriptions`、`usage_events`

## 平台建議

### 首選：Neon Postgres

適合原因：

- 與 Vercel 整合順
- Postgres 適合帳號與專案 JSON
- 初期免費方案足夠小量內測
- 後續可升級，不需要大改資料模型
- 比較適合「先做小型 SaaS」的路線

使用原則：

- 先用 Neon Free 起步
- users、sessions、projects 放同一個 database
- project_json 儲存 Campaign Builder 狀態
- 設定資料大小限制
- 設定用量警示

### 可選：Supabase

適合原因：

- Auth、Database、Storage 都有完整管理介面
- 若未來想要一站式後台管理使用者，Supabase 會比較方便
- 若未來要做圖片 storage，Supabase Storage 也是選項

目前不一定首選的原因：

- 現階段不做圖片雲端，不需要 Supabase 的完整 Storage 能力
- 如果只需要 Postgres + 簡單帳號，Neon 會比較輕

## Vercel 成本風險提醒

Vercel 的 Pro 月費不代表所有功能無限使用。仍可能有額外 usage。

可能產生成本的地方：

- Function invocations
- Function duration
- Data transfer
- Image Optimization
- Blob / Storage
- Edge / Middleware
- Analytics / Observability 額外功能

目前 Campaign Builder 應避免：

- 在 Vercel Function 裡做大量圖片轉換
- 把 user 上傳圖片直接存 Vercel Blob
- 每次讀專案都做昂貴處理
- 沒有限制地儲存 base64 圖片到資料庫
- 沒有 spending alert 就開放大量公開流量

## 明天建議實作範圍

第一階段只做真正帳號與雲端專案，不做圖片雲端。

建議範圍：

1. 建立 Neon Postgres
2. 建立 users 表
3. 建立 sessions 表
4. 建立 projects 表
5. 新增登入 API
6. 新增登出 API
7. 新增讀取專案 API
8. 新增儲存專案 API
9. 登入後只顯示該 user 的專案
10. localStorage 保留為暫存備援

暫時不做：

- 圖片雲端
- 付款
- 權限等級
- 忘記密碼
- 註冊
- AI
- 多人即時協作

## 使用者溝通文字

在還沒做完整雲端同步前，介面要避免誤導。

可使用：

> 目前為受邀測試版本，專案會儲存在此瀏覽器。

做完雲端專案後可改成：

> 專案已儲存在你的帳號，可於不同裝置登入後繼續編輯。

如果圖片仍不雲端化，應保留：

> 圖片連結會直接用於 CMS 貼碼；上傳圖片僅會在 ZIP 匯出時打包至 images 資料夾。

## 決策原則

1. 先證明產品有人使用，再擴充昂貴功能。
2. 帳號與專案資料可以先雲端化，圖片先不要。
3. 資料庫先用一個 Postgres，不要拆服務。
4. 所有可能產生大量流量或長時間計算的功能，上線前要重新估算成本。
5. Vercel 適合部署與短 API，不要把它當大量檔案處理平台。
6. localStorage 只能當暫存，不是正式資料庫。
7. 密碼永遠不能明碼儲存。
8. 收費前必須加上備份、資料匯出、使用量限制與基礎監控。

## 後續一定要重新評估的時間點

- 使用者超過 30 人
- 每日活躍使用者超過 20 人
- 開始正式收費
- 開始支援圖片雲端
- 開始做 AI 功能
- 開始做多人協作
- Vercel 或資料庫帳單超過預期
- 單一專案資料超過合理大小

## 參考來源

- Vercel Pricing: https://vercel.com/pricing
- Vercel Storage: https://vercel.com/docs/storage
- Neon Pricing: https://neon.com/pricing
- Supabase Pricing: https://supabase.com/pricing
