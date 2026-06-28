# NEXORA Builder Module Taxonomy

Last updated: 2026-06-28

## Core Rule

Module = content structure and business purpose.

Style = layout, visual treatment, spacing, animation, or presentation variant.

Do not create a new module only because the section looks different. Create a new module only when the editor needs a different content model, different controls, or different export behavior.

## Categories

### General 通用

Reusable building blocks that can appear in campaign pages, product pages, and brand pages.

- KV
- KV 輪播
- 標題
- 圖文區塊
- 文章內容
- FAQ
- Logo Wall
- 錨點導覽

### Campaign 活動頁

Campaign-oriented selling modules built around product cards, event banners, and limited-time promotion layouts.

- 商品列表
- 商品輪播
- 活動 Banner + 2 商品
- 活動 Banner + 3 商品
- 活動 Banner + 4 商品
- 單品主打

### Product 商品頁

Product-page modules should be fewer than the visible section names. Each base module can expose multiple styles.

- 商品特色
  - 四宮格
  - 六宮格
  - Icon + 文字
  - 卡片式
- 核心賣點
  - 重點橫排
  - 重點直排
  - 數字賣點
- 大圖展示
  - 滿版圖片 + 文字
  - 上下留白
  - 左右排版
  - 精品風
- 商品情境
  - 左圖右文
  - 右圖左文
  - 滿版情境
  - 雙圖情境
- 使用說明
  - 使用步驟
  - 適用場景
- 商品資訊
  - 成分介紹
  - 技術特色
  - 商品規格
  - 商品內容物
- 比較證明
  - 使用前後比較
  - 商品比較
  - 商品評價
  - 品牌保證
  - 認證標章
- 轉換區塊
  - 商品 FAQ
  - 購買資訊 CTA
  - 推薦組合
  - 相關商品

### Brand 品牌

Brand modules are narrative sections. They should share one consistent content model first, then branch into styles only if the editing requirements diverge.

- 品牌故事
- 品牌理念
- 品牌歷程

## Current Implementation State

The first implementation pass only reclassifies existing modules:

- Existing common modules are shown under `General`.
- Existing campaign commerce modules are shown under `Campaign`.
- Existing product-page demo modules are shown under `Product`.
- `Brand` is reserved for the next module implementation pass.

This avoids exposing unfinished modules before their inspector fields, preview rendering, export HTML, ZIP handling, and responsive behavior are complete.

## Global Settings Placement

Global settings should not occupy persistent module-library height.

The module library keeps one compact `全站設定` button at the bottom. Clicking it opens the site-level settings panel for:

- Page background color
- Repeating background image
- Global button color
- Global button text color

This keeps the left rail focused on module insertion while preserving access to site-wide styling.
