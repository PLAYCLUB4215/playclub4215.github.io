// 音樂播放清單。之後把歌曲檔放進 public/music/，再到這裡加一筆即可。
//   範例：{ title: '歌名', src: '/music/song.mp3' }
// 目前清單為空，播放器會顯示「尚未加入音樂」的停用狀態。

export interface Track {
  title: string;
  src: string;
}

export const playlist: Track[] = [
  { title: 'Moonlit Shoreline', src: '/music/moonlit-shoreline.mp3' },
  { title: 'Golden Hour Surf', src: '/music/golden-hour-surf.mp3' },
  { title: 'Coastal Reverie', src: '/music/coastal-reverie.mp3' },
];
