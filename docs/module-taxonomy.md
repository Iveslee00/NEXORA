# NEXORA Builder Module Taxonomy

Last updated: 2026-06-29

Before adding or changing any module, also read `docs/module-development-standard.md` and `docs/module-rendering-export-architecture.md`.

## Core Rule

Module = content structure and business purpose.

Style = layout, visual treatment, spacing, animation, or presentation variant.

Do not create a new module only because the section looks different. Create a new module only when the editor needs a different content model, different controls, or different export behavior.

Product Page Starter = recipe generator. It chooses existing modules, module styles, and theme defaults from product input. It does not create a parallel module system.

Taxonomy changes are module-related changes. They require matching updates to registry coverage, preview/export behavior, verifier scripts, and this document.

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
  - 四宮格：4 個短賣點，快速掃描。
  - 六宮格
  - Icon + 文字
  - 卡片式：較長利益說明或情境式特色，卡片空間更大。
- 核心賣點
  - 重點橫排
  - 重點直排
  - 數字賣點
- 大圖展示
  - 上下留白
  - 左右排版：電商導購型，圖片與文字同等重要。
  - 精品風：玻璃文字卡與聚焦商品展示，適合高級感主推。
- 商品情境
  - 左圖右文
  - 右圖左文
  - 滿版情境
  - 雙圖情境
- 使用步驟
  - 使用步驟
- 商品資訊
  - 成分介紹：3 欄重點卡，適合成分、香調、材質等短內容。
  - 技術特色：深色科技感規格板，適合專利、配方、測試數據。
  - 商品規格：標準 key-value 表格，適合容量、尺寸、產地、保存方式。
  - 商品內容物：包裝清單，適合套組、配件、贈品、盒內物。
- 商品比較
  - 使用前後比較
  - 商品比較
- 信任證明
  - 商品評價：星等口碑卡。
  - 品牌保證：印章式承諾卡。
  - 認證標章：證書格狀卡。
- 購買轉換
  - 購買資訊 CTA
  - 推薦組合：主推成套購買，預覽與匯出固定顯示前三品。
  - 相關商品：同系列延伸推薦，輕量卡片導購。

Product FAQ does not get its own module. Use the General FAQ module and style/copy it for product questions.

Product scenes cover 適用場景. Product info covers 成分介紹、技術特色、商品規格、商品內容物.

### Brand 品牌

Brand modules are narrative sections. They should share one consistent content model first, then branch into styles only if the editing requirements diverge.

- 品牌故事
- 品牌理念
- 品牌歷程

## Current Implementation State

Implemented product-page modules:

- `product-features`：商品特色，支援四宮格、六宮格、Icon + 文字、卡片式。
- `product-showcase`：大圖展示，支援上下留白、左右排版、精品風；滿版視覺請使用 KV 或商品情境。
- `product-scenes`：商品情境，支援左圖右文、右圖左文、滿版情境、雙圖情境。
- `product-info`：商品資訊，支援成分介紹、技術特色、商品規格、商品內容物。
- `product-benefits`：核心賣點，支援數據卡、痛點解法、堆疊式。
- `product-steps`：使用步驟，支援編號、時間軸、圖卡。
- `product-comparison`：商品比較，支援使用前後與商品差異表。
- `product-proof`：信任證明，支援評價、品牌保證、認證標章。
- `product-purchase`：購買轉換，支援 CTA、推薦組合、相關商品。

Removed duplicate Product wrappers:

- `sales-product-hero` was too close to Campaign `單品主打`.
- `sales-benefits` was replaced by `product-benefits`.
- `sales-detail` was replaced by `product-info`.
- `sales-faq` was removed because General `FAQ` is the single FAQ source.

`Brand` is reserved for the next module implementation pass.

New modules should only be exposed after their inspector fields, preview rendering, export HTML, ZIP handling, and responsive behavior are complete.

## Product Page Starter Relationship

Product Page Starter uses the taxonomy above as its output target.

It should never output a one-off template section that cannot be edited through the normal Builder inspector. Every generated section must map back to one of these existing module groups:

- General modules for shared structure: KV, KV carousel, title, FAQ, anchor navigation, article, split content.
- Campaign modules for event and commerce structures: product list, product carousel, banner + products, single product highlight.
- Product modules for product-page storytelling: features, showcase, scenes, info, benefits, steps, comparison, proof, purchase.
- Brand modules later for narrative product pages that require brand story or brand trust sections.

Generator decisions:

| Decision | Affects |
|---|---|
| Industry | Required fields, recommended copy groups, default content emphasis |
| Product Goal | Module order and which module groups are included |
| Visual Theme | Style variants, colors, spacing, card treatment, CTA treatment |
| Page Length | Number of modules generated |

Initial industries:

- Cleaning 清潔用品
- Beauty 美妝保養
- Ecommerce 電商綜合

Initial product goals:

- Sales 爆品銷售
- Launch 新品上市
- Comparison 比較說服
- Scenario 情境導購

Initial themes:

- Fresh Clean 清爽潔淨
- Luxury 高級精品
- Promo 強促銷
- Minimal Commerce 極簡電商

The generator must keep page variety by combining goal, theme, length, and module style. Industry alone must not determine a fixed template.

## Global Settings Placement

Global settings should not occupy persistent module-library height.

The module library keeps one compact `全站設定` button at the bottom. Clicking it opens the site-level settings panel for:

- Page background color
- Repeating background image
- Global button color
- Global button text color

This keeps the left rail focused on module insertion while preserving access to site-wide styling.
