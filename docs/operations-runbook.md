# NEXORA 正式站營運手冊

更新日期：2026-06-27

這份文件記錄 NEXORA 正式站的日常營運流程。之後只要改到登入、帳號、Vercel、Neon、部署、回滾或專案儲存策略，都必須同步更新本文件。

## 目前正式站狀態

| 項目 | 狀態 |
|---|---|
| GitHub repo | `Iveslee00/NEXORA` |
| Git remote | SSH：`git@github.com:Iveslee00/NEXORA.git` |
| 部署平台 | Vercel |
| Vercel project | `nexora` |
| 資料庫 | Neon Postgres |
| 登入 | 自建帳號密碼登入 |
| 專案資料 | 瀏覽器 localStorage + `.cmb` 本地專案檔 |
| 圖片資料 | 圖片連結用於 CMS 貼碼；上傳圖片只用於 ZIP 與 `.cmb` |
| 圖片雲端 | 尚未支援 |

目前 Neon 只儲存帳號與 session，不儲存 NEXORA Builder 專案內容，也不儲存上傳圖片。

正式品牌名稱為 NEXORA，目前工具名稱為 NEXORA Builder。GitHub repo 已改為 `Iveslee00/NEXORA`，Vercel project 已改為 `nexora`。

## 帳號管理

目前內測帳號為：

```text
client01 / cb2026
client02 / cb2026
...
client10 / cb2026
```

密碼不以明碼存在 Neon。系統使用 `scrypt` hash 後寫入 `users.password_hash`。

### 新增或重建初始帳號

目前可用腳本：

```bash
npm run setup:auth-db
```

用途：

- 建立 `users` 表
- 建立 `sessions` 表
- 建立 `client01` 到 `client10`

注意：

- 執行前必須確定本機 `.env.local` 有正確的 `DATABASE_URL`。
- 正式營運後，不建議反覆重建帳號。後續應改成單一新增帳號、停用帳號、重設密碼的管理腳本。
- 不要把使用者密碼寫進 Git。

### 停用帳號

目前資料表有 `users.is_active` 欄位。若要停用帳號，可在 Neon SQL Editor 將該帳號改為 inactive。

概念：

```sql
update users
set is_active = false
where username = 'client01';
```

停用後，該帳號不應再允許登入。

### 重設密碼

目前尚未提供正式後台按鈕。若要重設密碼，應新增專用腳本來產生 hash，不要在 Neon 直接存明碼。

短期建議：

1. 先由開發端新增安全的重設密碼腳本。
2. 重設後通知使用者新密碼。
3. 中長期再做管理後台或邀請制帳號流程。

## Vercel 環境變數

正式站必須設定：

```text
DATABASE_URL
```

Value 使用 Neon pooled connection string。

正確 host 應包含：

```text
-pooler
```

範例格式：

```text
postgresql://neondb_owner:<password>@<project>-pooler.<region>.aws.neon.tech/neondb?sslmode=require
```

規則：

- `DATABASE_URL` 必須設為 Sensitive。
- 至少要套用 Production。
- 建議同時套用 Production 與 Preview。
- 不要把 `DATABASE_URL` 放進 Git。
- 不要使用 `NEXT_PUBLIC_DATABASE_URL`，這會把資料庫密鑰暴露到前端。

### Neon 密碼外洩或曾貼到公開對話

若 Neon 密碼曾被貼出，請旋轉密碼：

1. 到 Neon 專案。
2. 找到 role，例如 `neondb_owner`。
3. Reset password。
4. 複製新的 pooled connection string。
5. 更新 Vercel 的 `DATABASE_URL`。
6. 更新本機 `.env.local`。
7. 重新部署 Vercel。

## 部署流程

正常流程：

```text
本機修改
  -> git commit
  -> git push origin main
  -> Vercel 自動部署
  -> 正式站更新
```

推送前建議至少檢查：

```bash
npm run typecheck
npm run build
```

登入或專案記憶相關修改，應額外跑：

```bash
npm run verify:auth-foundation
npm run verify:project-memory
npm run verify:workshop-demo
```

### 手動重新部署

修改 Vercel 環境變數後，需要手動 redeploy。

流程：

1. 到 Vercel 專案。
2. 進 `Deployments`。
3. 找最新部署。
4. 點右側 `...`。
5. 選 `Redeploy`。

## 回滾流程

若正式站壞掉，先不要急著改 code。

Vercel 回滾：

1. 到 Vercel 專案。
2. 進 `Deployments`。
3. 找上一個正常版本。
4. 點 `...`。
5. 選 `Promote to Production` 或 Vercel 當下提供的回滾選項。

回滾後要記錄：

- 壞掉的部署時間
- 壞掉的 commit
- 發生的問題
- 使用者看到的錯誤
- 是否影響登入
- 是否影響匯出

## 登入異常排查

### 正式站無法登入

優先檢查：

1. Vercel 是否有 `DATABASE_URL`。
2. `DATABASE_URL` 是否使用 pooled host。
3. Neon 專案是否正常。
4. Neon role 密碼是否有更新但 Vercel 沒同步。
5. Vercel 是否已在更新環境變數後重新部署。

### 登入後馬上被登出

可能原因：

- session 沒有成功寫入 Neon。
- cookie 沒有成功設定。
- `sessions.expires_at` 已過期。
- 正式站與預覽站使用了不同的環境變數。

### 只有本機可以，正式站不行

通常是 Vercel 環境變數問題。

本機讀 `.env.local`，正式站讀 Vercel Dashboard 的 Environment Variables。兩邊不會自動同步。

## 專案資料與圖片規則

目前專案資料不跟帳號雲端同步。

| 資料 | 儲存位置 | 說明 |
|---|---|---|
| 帳號 | Neon `users` | 使用權入口 |
| Session | Neon `sessions` | 登入狀態 |
| 專案列表 | localStorage | 同一瀏覽器記憶 |
| `.cmb` 專案檔 | 使用者本機 | 可手動備份與轉移 |
| 圖片連結 | 專案資料文字欄位 | CMS 貼碼直接使用 |
| 上傳圖片 | localStorage / `.cmb` / ZIP `images/` | 不進 Neon |

### 不可做的事

- 不要把上傳圖片 base64 存進 Neon。
- 不要把大量圖片塞進資料庫。
- 不要把 Neon 當圖床。
- 不要讓貼碼匯出含有超長 base64 圖片字串。

### ZIP 圖片策略

ZIP 匯出時，上傳圖片應輸出成：

```text
images/<filename>
```

HTML 內應引用：

```html
<img src="images/<filename>" alt="">
```

CMS 貼碼使用則以圖片網址為主，不應輸出 base64。

## 成本與用量監控

每週或每次公開給更多使用者前，檢查：

- Vercel bandwidth
- Vercel function usage
- Neon storage
- Neon compute
- Neon network transfer

目前高風險功能尚未上線：

- 圖片雲端
- AI 生成
- 專案雲端同步
- 付款
- 多人協作

上線這些功能前，先更新：

- `docs/site-architecture.md`
- `docs/vercel-database-cost-risk-notes.md`
- `docs/operations-runbook.md`

## 新版本發布前檢查清單

發布前：

- [ ] 確認沒有把 `.env.local` 或資料庫密鑰提交到 Git。
- [ ] 確認 `npm run typecheck` 通過。
- [ ] 確認 `npm run build` 通過。
- [ ] 若改登入，確認 `npm run verify:auth-foundation` 通過。
- [ ] 若改專案資料，確認 `npm run verify:project-memory` 通過。
- [ ] 若改工作區首頁，確認 `npm run verify:workshop-demo` 通過。
- [ ] 確認 GitHub push 成功。
- [ ] 確認 Vercel 部署成功。
- [ ] 正式站用 `client01` 測試登入。
- [ ] 測試進入 NEXORA Workspace。
- [ ] 測試建立專案、重新整理後仍存在。
- [ ] 測試匯出貼碼。

## 文件固定更新規則

以下情況必須更新本文件：

1. 新增或移除帳號管理流程。
2. 改變 Vercel 環境變數。
3. 改變 Neon schema。
4. 改變登入/session/cookie 流程。
5. 開始把專案存到 Neon。
6. 開始支援圖片雲端。
7. 新增付款、權限或方案限制。
8. 改變部署或回滾流程。
9. 新增會影響成本的功能。

## 相關文件

- `docs/site-architecture.md`
- `docs/vercel-database-cost-risk-notes.md`
