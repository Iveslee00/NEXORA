export interface SizeSpecTable {
  title?: string;
  headers: string[];
  rows: Array<{ cells: string[] }>;
}

export interface SizeSpecSection {
  title: string;
  description?: string[];
  tables: SizeSpecTable[];
  notes: string[];
}

export const SIZE_SPEC_SECTIONS: SizeSpecSection[] = [
  {
    title: '一、KV Banner',
    description: [
      'PC：KV 不分有文字或純 Banner，皆為滿版大視覺，文字放在安全區內。',
      'PC 建議以 1920px 寬製作，適合 CMS 外層寬版容器。',
      'M 端「有文字區」：圖片在上，文字區塊在下，文字區高度由內容決定，不計入圖片尺寸。',
    ],
    tables: [
      {
        headers: ['模組', '狀態', '尺寸', 'PC 圖片區', 'M 端圖片區'],
        rows: [
          { cells: ['KV', '有文字區', 'S', '1920 x 480', '750 x 750'] },
          { cells: ['KV', '有文字區', 'M', '1920 x 640', '750 x 850'] },
          { cells: ['KV', '有文字區', 'L', '1920 x 800', '750 x 950'] },
          { cells: ['KV', '純 Banner', 'S', '1920 x 480', '750 x 750'] },
          { cells: ['KV', '純 Banner', 'M', '1920 x 640', '750 x 850'] },
          { cells: ['KV', '純 Banner', 'L', '1920 x 800', '750 x 950'] },
          { cells: ['KV 輪播', '有文字區', 'S/M/L', '同 KV', '同 KV'] },
          { cells: ['KV 輪播', '純 Banner', 'S/M/L', '同 KV', '同 KV'] },
        ],
      },
    ],
    notes: [],
  },
  {
    title: '二、活動 Banner + 商品卡',
    description: [
      'PC：內容寬 1080px，商品卡固定一排顯示，Banner 圖片依商品數調整寬度。',
      'M 端：Banner 圖片在上，商品卡在下，750px 為整體模組寬度。',
    ],
    tables: [
      {
        headers: ['模組', 'PC 版型', 'PC Banner 尺寸', 'M 端版型', 'M 端尺寸'],
        rows: [
          { cells: ['活動 Banner + 2 商品', 'Banner 左、2 商品右側橫排', '700 x 350', 'Banner 上、2 商品下方橫排', '750 x 520'] },
          { cells: ['活動 Banner + 3 商品', 'Banner 左、3 商品右側橫排', '520 x 350', 'Banner 上、3 商品下方橫排', '750 x 520'] },
          { cells: ['活動 Banner + 4 商品', 'Banner 左、4 商品右側橫排', '328 x 350', 'Banner 上、4 商品下方橫排', '750 x 520'] },
        ],
      },
    ],
    notes: [],
  },
  {
    title: '三、單品主打',
    description: ['M 端 S/M/L 三個尺寸高度各異，與 PC 端同步呈現差異。'],
    tables: [
      {
        headers: ['模組', '尺寸', 'PC', 'M 端'],
        rows: [
          { cells: ['單品主打', 'S', '700 x 460', '750 x 750'] },
          { cells: ['單品主打', 'M', '700 x 600', '750 x 850'] },
          { cells: ['單品主打', 'L', '700 x 740', '750 x 900'] },
        ],
      },
    ],
    notes: [],
  },
  {
    title: '四、內容模組',
    tables: [
      {
        headers: ['模組', 'PC', 'M 端', '備註'],
        rows: [
          { cells: ['圖文區塊', '600 x 450', '750 x 562', '寬度統一 750px，高度維持 4:3 比例'] },
          { cells: ['文章搭配圖片（上方大圖）', '1200 x 420', '750 x 420', '高度固定，PC 全幅'] },
          { cells: ['品牌 Logo 牆（單 Logo）', '160 x 60', '160 x 60', '固定尺寸'] },
        ],
      },
    ],
    notes: [],
  },
  {
    title: '五、商品圖與 Logo 規格',
    tables: [
      {
        headers: ['圖片類型', '尺寸', '比例'],
        rows: [
          { cells: ['商品列表商品圖', '400 x 400', '1:1'] },
          { cells: ['商品輪播商品圖', '400 x 400', '1:1'] },
          { cells: ['活動 Banner 商品卡圖', '400 x 400', '1:1'] },
          { cells: ['銀行 / 品牌 Logo', '160 x 60', '8:3'] },
        ],
      },
    ],
    notes: [],
  },
  {
    title: '六、通用備註',
    tables: [],
    notes: [
      '所有尺寸單位為 px。',
      'M 端以 750px 寬為基準（對應 @2x 設計稿，實際顯示 375px）。',
      '商品圖統一 1:1 正方形，方便圖庫統一管理。',
      'M 端「有文字區」模組高度 = 圖片區高度 + 文字區高度，兩者分開計算。',
      'KV M 端最矮尺寸為 750 x 750，避免主視覺在手機版過扁。',
      'PC 除 KV 外，內容模組以 1080px 安全寬置中，避免貼邊。',
    ],
  },
];
