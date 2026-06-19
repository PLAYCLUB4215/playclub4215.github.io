// 時間線資料：由過去到現在，每天做了哪些事的精簡紀錄。
// 新增方式：在陣列裡加一筆（日期新的在上、舊的在下都可以，頁面會自動由近到遠排序）。
//   category 可省略；有值時會顯示分類標籤與對應顏色：life=生活, work=工作, travel=旅遊, project=專案
//   link 可省略；那天若有完整日誌/文章，填入網址就能從時間線點進去。

export interface TimelineEntry {
  date: string; // 'YYYY-MM-DD'
  summary: string;
  category?: 'life' | 'work' | 'travel' | 'project';
  link?: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: '2026-06-19',
    summary: '個人網站正式上線，並寫下第一篇日誌：烏魯瓦圖的海邊日落。',
    category: 'project',
    link: '/journal/2026-06-19-bali-uluwatu-sunset',
  },
];
