# 個人網站設計 spec

- 日期：2026-06-19
- 狀態：已通過 brainstorming，待寫實作計畫
- 專案資料夾：`C:\workspace\ClaudeProject\MINZANG_Website`

## 1. 目標

建立一個可長期維護、免費、可由 Claude Code 自動生成內容的個人網站，用途：

- 生活紀錄（日誌）
- 旅遊文章
- 照片相簿
- AI 專案展示

## 2. 核心技術決定（已確認）

| 項目 | 決定 | 理由 |
|---|---|---|
| 框架 | **Astro + Markdown** | 適合部落格、好維護、SEO 友善、Markdown 原生 → 頁面 |
| 部署 | **GitHub Pages + GitHub Actions** | 免費、自動 build & deploy |
| Repo / 網址 | 新建 repo **`playclub4215.github.io`** → `https://playclub4215.github.io` | User Page，乾淨無子路徑（base = `/`） |
| 圖片 | **存在 repo**，透過統一 `Image` 元件引用 | 唯一能讓 Claude 全自動的路；穩定、永久、可版本控制 |
| 圖片升級路徑 | Cloudflare R2（未來，照片量大才做） | 換成 R2 只改 `Image` 元件設定，不用重寫文章（YAGNI） |
| 風格 | **簡約清爽** | 大量留白、簡潔字型、主色點綴；類 Medium / Bear Blog |
| 語言 | 繁體中文 | |

### 被排除的方案與原因
- **Google Photos 分享連結直接 `<img src>`**：Google 不保證 hotlink，連結會過期/被擋。
- **Google Photos API / google-photos-automation MCP**：① 方向是「上傳/整理」而非「取出顯示」；② 2025 API 限制只能存取「app 自己上傳的內容」，看不到使用者既有圖庫；③ 回傳的 baseUrl 約 60 分鐘過期，不能當網站圖片來源；④ 靜態網站沒有後端保存 OAuth token。
- **Google Drive 直連**：半穩定，大量圖片會被流量限制 / 轉址。
- 結論：Google One 繼續當「原始照片倉庫 / 備份」，網站圖片走 repo。

## 3. 網站內容（6 個區塊）

| 區塊 | 路徑 | 內容 |
|---|---|---|
| 首頁 | `/` | 封面 + 自我介紹一句 + 最新文章列表 |
| 生活日誌 | `/journal` | 日常紀錄列表 + 內頁 |
| 旅遊文章 | `/travel` | 旅遊遊記（含照片）列表 + 內頁 |
| 相簿 | `/albums` | 照片集，一個相簿一頁 |
| AI 專案 | `/projects` | 作品展示列表 + 內頁 |
| 關於我 | `/about` | 個人介紹 |

## 4. 資料夾結構

```
playclub4215.github.io/            # repo root
├── astro.config.mjs               # site URL、整合設定（base = '/'）
├── package.json
├── .github/workflows/deploy.yml   # 自動 build + 部署到 GitHub Pages
├── public/
│   └── images/                    # 壓縮後照片，依相簿/文章分子資料夾
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro        # <head>、頁首、導覽、頁尾
│   │   └── PostLayout.astro        # 文章內頁版型
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── PostCard.astro          # 列表卡片
│   │   └── Image.astro             # 圖片引用抽象層（repo 現在 / R2 未來）
│   ├── content/
│   │   ├── config.ts               # content collections schema（型別檢查）
│   │   ├── journal/*.md
│   │   ├── travel/*.md
│   │   ├── albums/*.md             # 每個相簿一檔：frontmatter + 圖片清單
│   │   └── projects/*.md
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── journal/                # 列表 + [slug] 自動生成內頁
│   │   ├── travel/
│   │   ├── albums/
│   │   └── projects/
│   └── styles/global.css
```

各區塊用 Astro **Content Collections** 管理：列表頁與內頁由 Markdown 自動生成，frontmatter 含 `title`、`date`、`tags`、`cover` 等欄位並做型別檢查。

## 5. 日常工作流程

- **寫文章**：跟 Claude 說「幫我寫一篇 X 的日誌」→ Claude 產生 `.md` → commit → push → 自動上線。
- **做相簿**：
  1. 使用者從 Google Photos 挑照片、下載到本機資料夾（如 `照片/2026-京都/`）— 此步只有使用者能做。
  2. 跟 Claude 說「把這個資料夾做成相簿頁」。
  3. Claude 壓縮、命名、產生相簿頁、寫說明、commit + push、上線。
- 使用者不需碰 build、不需懂 Astro。

## 6. 分階段交付

### 第一階段（MVP）— 目標：讓 `https://playclub4215.github.io` 正常上線
- 新建 repo `playclub4215.github.io`
- Astro 專案骨架 + 簡約清爽樣式
- 6 個區塊版型 + 導覽
- GitHub Actions 自動部署
- 1 篇範例文章 + 1 個範例相簿（驗證圖片流程）

### 第二階段（用順之後再做，YAGNI）
- 站內搜尋（Fuse.js）
- 標籤分類
- RSS feed
- 首頁封面美化

## 7. 大量圖片擴充策略

預設走「repo 優先、R2 為升級路徑」。決策依預期照片量：

### 階段一：壓縮就夠（預設、多數情況）
- Claude 放圖前一律壓成網路尺寸（約寬 1600px、每張 200–300KB）。
- GitHub repo 建議上限約 1GB ≈ 3,000～5,000 張壓縮圖 ≈ 個人網站數年用量。
- 原始大圖（RAW、手機原檔）永不放 repo，留在 Google Photos / One；repo 只放壓縮小圖。

### 階段二：repo 接近 1GB → 搬到 Cloudflare R2
因所有圖片走統一 `Image` 元件，搬家只改設定，文章不需更動。流程：
1. 註冊 Cloudflare → 開 R2 bucket（免費 10GB、流出費 $0）。
2. Claude 以 `rclone` / `wrangler` 批次上傳圖片到 R2。
3. `Image` 元件圖片來源由 `/images/...` 改為 R2 CDN 網址。
4. 之後維持全自動，文章寫法不變。

### 真實細節 / 提醒
- git 會把已刪除的圖片永久留在歷史，`.git` 只增不減。
- 因此若**預期會大量、頻繁放照片**（例如每週數百張），建議**第一階段即直接接 R2**，不要等。
- 普通生活/旅遊紀錄量 → 先用 repo，日後再升級即可。

### 待確認
- 使用者預期照片量為「普通量」或「大量狂放」尚未明確回覆；**預設採普通量（repo 優先）**。若日後改為大量，第一階段可直接改接 R2。

## 8. 待辦前置條件（使用者需提供 / 確認）
- GitHub 帳號 `playclub4215` 可登入，且尚未存在名為 `playclub4215.github.io` 的 repo（或同意新建）。
- 本機已安裝 Git 與 Node.js（Astro 需要 Node）；GitHub CLI 可選。
