// 時間線資料：由過去到現在，每天做了哪些事的精簡紀錄。
// 新增方式：在陣列裡加一筆（頁面會自動由近到遠排序、依年份分組）。
//   category 可省略；有值會顯示分類標籤：life=生活, work=工作, travel=旅遊, project=專案
//   link 可省略；那天若有完整日誌/文章，填入網址就能從時間線點進去。
//   icon 可省略；填一個 emoji（如 🌅 🚌 🏔️ 🔥）會顯示在路上的圓圈裡。

export interface TimelineEntry {
  date: string; // 'YYYY-MM-DD'
  summary: string;
  category?: 'life' | 'work' | 'travel' | 'project';
  link?: string;
  icon?: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: '2026-06-19',
    summary: '個人網站正式上線，並寫下第一篇日誌：烏魯瓦圖的海邊日落。',
    category: 'project',
    link: '/journal/2026-06-19-bali-uluwatu-sunset',
    icon: '🌅',
  },
];
