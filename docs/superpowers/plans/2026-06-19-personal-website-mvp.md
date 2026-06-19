# 個人網站 MVP 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個 Astro 個人網站（生活日誌 / 旅遊 / 相簿 / AI 專案 / 關於），並透過 GitHub Actions 自動部署到 `https://playclub4215.github.io`。

**Architecture:** Astro 5 靜態網站；內容用 Content Collections（Markdown）管理，列表與內頁自動生成；圖片放 `public/images/` 並透過統一 `Image.astro` 元件引用（未來可改 R2）；GitHub Actions 在 push 時 build 並部署到 GitHub Pages。

**Tech Stack:** Astro 5、Markdown、原生 CSS、GitHub Pages、GitHub Actions、Node 24 / npm 11、Git。

**驗證方式說明：** 本專案為靜態網站，主要驗證手段是 `npm run build` 成功（會驗證 Content Collections schema 與所有頁面渲染）＋對 build 產出的 HTML 做內容檢查；必要時用 `npm run dev` 目視。所有指令以 Windows PowerShell 為主。

**重要環境事實：**
- 開發資料夾：`C:\workspace\ClaudeProject\MINZANG_Website`（目前非 git repo、無檔案）。
- GitHub 帳號：`playclub4215`。User Page 的 repo 名稱**必須**為 `playclub4215.github.io`。
- 本機已裝 Node v24.16.0、npm 11.13.0、Git 2.53；**未裝 gh**，故建 repo 走網頁手動建立 + git 推送。

---

### Task 1: 建立 Astro 專案骨架並初始化 git

**Files:**
- Create: 整個 Astro 專案（`package.json`、`astro.config.mjs`、`src/`、`public/` 等）於 `C:\workspace\ClaudeProject\MINZANG_Website`
- Create: `.gitignore`

- [ ] **Step 1: 在現有資料夾建立 Astro 專案（minimal 範本）**

於 `C:\workspace\ClaudeProject\MINZANG_Website` 執行：

```powershell
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
```

說明：`.` 代表安裝在目前資料夾；`--no-install`、`--no-git` 之後手動處理；範本選 minimal 之後我們自己加結構。
若提示資料夾非空（因為已有 `docs/`），選擇繼續（merge）即可。

- [ ] **Step 2: 安裝相依套件**

```powershell
npm install
```

Expected：成功安裝，產生 `node_modules/` 與 `package-lock.json`，無 error。

- [ ] **Step 3: 設定 `astro.config.mjs`（User Page）**

覆寫 `astro.config.mjs` 內容為：

```js
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://playclub4215.github.io',
  // User Page 根網址，base 維持預設 '/'
});
```

- [ ] **Step 4: 建立 `.gitignore`**

建立 `.gitignore`：

```gitignore
# build output
dist/
# dependencies
node_modules/
# generated types
.astro/
# env
.env
.env.production
# os
.DS_Store
Thumbs.db
```

- [ ] **Step 5: 確認可 build**

```powershell
npm run build
```

Expected：輸出 `Complete!`，產生 `dist/` 資料夾，無 error。

- [ ] **Step 6: git 初始化並首次提交**

```powershell
git init
git add -A
git commit -m "chore: scaffold Astro project"
```

Expected：建立第一個 commit，無 error。

---

### Task 2: 共用版型、導覽列與簡約清爽樣式

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Nav.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 建立全域樣式 `src/styles/global.css`**

```css
:root {
  --max-width: 720px;
  --color-text: #1a1a1a;
  --color-muted: #6b7280;
  --color-bg: #ffffff;
  --color-accent: #2563eb;
  --color-border: #e5e7eb;
  --font-sans: -apple-system, "Segoe UI", "Noto Sans TC", system-ui, sans-serif;
}

* { box-sizing: border-box; }

html { font-size: 17px; }

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.7;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
}

a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; height: auto; }

h1, h2, h3 { line-height: 1.3; font-weight: 700; }

.muted { color: var(--color-muted); font-size: 0.9rem; }

.site-header {
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  margin-bottom: 2.5rem;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  padding: 2rem 0;
  margin-top: 4rem;
  color: var(--color-muted);
  font-size: 0.85rem;
  text-align: center;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: baseline;
}
.nav .brand { font-weight: 700; font-size: 1.1rem; color: var(--color-text); }
.nav .links { display: flex; gap: 1rem; margin-left: auto; flex-wrap: wrap; }

.post-list { list-style: none; padding: 0; }
.post-list li { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
.post-list .title { font-size: 1.15rem; font-weight: 600; }

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}
.album-grid figure { margin: 0; }
.album-grid figcaption { font-size: 0.8rem; color: var(--color-muted); margin-top: 0.25rem; }
```

- [ ] **Step 2: 建立導覽列 `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '/journal', label: '生活日誌' },
  { href: '/travel', label: '旅遊' },
  { href: '/albums', label: '相簿' },
  { href: '/projects', label: 'AI 專案' },
  { href: '/about', label: '關於' },
];
---
<nav class="nav">
  <a class="brand" href="/">MIN ZANG</a>
  <div class="links">
    {links.map((l) => <a href={l.href}>{l.label}</a>)}
  </div>
</nav>
```

- [ ] **Step 3: 建立共用版型 `src/layouts/BaseLayout.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = '生活、旅遊與 AI 專案的個人紀錄。' } = Astro.props;
---
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <header class="site-header">
      <div class="container"><Nav /></div>
    </header>
    <main class="container">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="container">© {new Date().getFullYear()} MIN ZANG</div>
    </footer>
  </body>
</html>
```

- [ ] **Step 4: 驗證 build 通過**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: base layout, nav and global styles"
```

---

### Task 3: Content Collections 設定（journal / travel / projects / albums）

**Files:**
- Create: `src/content.config.ts`
- Create: 空內容資料夾佔位檔 `src/content/journal/.gitkeep`、`src/content/travel/.gitkeep`、`src/content/projects/.gitkeep`、`src/content/albums/.gitkeep`

- [ ] **Step 1: 建立 `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: postSchema,
});

const travel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/travel' }),
  schema: postSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: postSchema.extend({
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

const albums = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/albums' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    cover: z.string().optional(),
    images: z
      .array(z.object({ src: z.string(), caption: z.string().optional() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { journal, travel, projects, albums };
```

- [ ] **Step 2: 建立佔位檔讓空資料夾可被 git 追蹤**

建立以下 4 個空檔：
- `src/content/journal/.gitkeep`
- `src/content/travel/.gitkeep`
- `src/content/projects/.gitkeep`
- `src/content/albums/.gitkeep`

- [ ] **Step 3: 驗證 build（schema 正確、無內容也能過）**

```powershell
npm run build
```

Expected：`Complete!`，無 error（此時各 collection 為空）。

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat: content collections config for journal/travel/projects/albums"
```

---

### Task 4: 圖片抽象元件 `Image.astro`

**Files:**
- Create: `src/components/Image.astro`

- [ ] **Step 1: 建立 `src/components/Image.astro`**

```astro
---
// 圖片引用抽象層：
// 現在 IMAGE_BASE='' → 圖片由 public/ 直接 serve（如 /images/foo.jpg）。
// 未來搬到 Cloudflare R2 時，只要把 IMAGE_BASE 改成 CDN 網址即可，文章不需更動。
const IMAGE_BASE = '';

interface Props {
  src: string;
  alt?: string;
  class?: string;
}
const { src, alt = '', class: className = '' } = Astro.props;
const finalSrc = src.startsWith('http') ? src : `${IMAGE_BASE}${src}`;
---
<img src={finalSrc} alt={alt} class={className} loading="lazy" decoding="async" />
```

- [ ] **Step 2: 驗證 build 通過**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "feat: Image component as image-source abstraction layer"
```

---

### Task 5: 文章型區塊（journal / travel / projects）列表頁與內頁

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/journal/index.astro`
- Create: `src/pages/journal/[slug].astro`
- Create: `src/pages/travel/index.astro`
- Create: `src/pages/travel/[slug].astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`

- [ ] **Step 1: 建立列表卡片 `src/components/PostCard.astro`**

```astro
---
interface Props {
  href: string;
  title: string;
  date: Date;
  description?: string;
}
const { href, title, date, description } = Astro.props;
const dateStr = date.toISOString().slice(0, 10);
---
<li>
  <a class="title" href={href}>{title}</a>
  <div class="muted">{dateStr}</div>
  {description && <p>{description}</p>}
</li>
```

- [ ] **Step 2: 建立文章內頁版型 `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  date: Date;
  description?: string;
}
const { title, date, description } = Astro.props;
const dateStr = date.toISOString().slice(0, 10);
---
<BaseLayout title={title} description={description}>
  <article>
    <h1>{title}</h1>
    <p class="muted">{dateStr}</p>
    <slot />
  </article>
  <p style="margin-top:2rem"><a href="/">← 回首頁</a></p>
</BaseLayout>
```

- [ ] **Step 3: 建立 journal 列表頁 `src/pages/journal/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('journal'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="生活日誌 | MIN ZANG">
  <h1>生活日誌</h1>
  {posts.length === 0 ? (
    <p class="muted">還沒有文章。</p>
  ) : (
    <ul class="post-list">
      {posts.map((p) => (
        <PostCard
          href={`/journal/${p.id}`}
          title={p.data.title}
          date={p.data.date}
          description={p.data.description}
        />
      ))}
    </ul>
  )}
</BaseLayout>
```

- [ ] **Step 4: 建立 journal 內頁 `src/pages/journal/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('journal');
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<PostLayout title={entry.data.title} date={entry.data.date} description={entry.data.description}>
  <Content />
</PostLayout>
```

- [ ] **Step 5: 建立 travel 列表頁 `src/pages/travel/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('travel'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="旅遊 | MIN ZANG">
  <h1>旅遊</h1>
  {posts.length === 0 ? (
    <p class="muted">還沒有文章。</p>
  ) : (
    <ul class="post-list">
      {posts.map((p) => (
        <PostCard
          href={`/travel/${p.id}`}
          title={p.data.title}
          date={p.data.date}
          description={p.data.description}
        />
      ))}
    </ul>
  )}
</BaseLayout>
```

- [ ] **Step 6: 建立 travel 內頁 `src/pages/travel/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('travel');
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<PostLayout title={entry.data.title} date={entry.data.date} description={entry.data.description}>
  <Content />
</PostLayout>
```

- [ ] **Step 7: 建立 projects 列表頁 `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('projects'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="AI 專案 | MIN ZANG">
  <h1>AI 專案</h1>
  {posts.length === 0 ? (
    <p class="muted">還沒有專案。</p>
  ) : (
    <ul class="post-list">
      {posts.map((p) => (
        <PostCard
          href={`/projects/${p.id}`}
          title={p.data.title}
          date={p.data.date}
          description={p.data.description}
        />
      ))}
    </ul>
  )}
</BaseLayout>
```

- [ ] **Step 8: 建立 projects 內頁 `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('projects');
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<PostLayout title={entry.data.title} date={entry.data.date} description={entry.data.description}>
  <Content />
  <p style="margin-top:1.5rem">
    {entry.data.repo && <a href={entry.data.repo}>原始碼 ↗</a>}
    {entry.data.repo && entry.data.demo && ' · '}
    {entry.data.demo && <a href={entry.data.demo}>Demo ↗</a>}
  </p>
</PostLayout>
```

- [ ] **Step 9: 驗證 build 通過（仍無內容，列表顯示空狀態）**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 10: Commit**

```powershell
git add -A
git commit -m "feat: list and detail pages for journal/travel/projects"
```

---

### Task 6: 相簿區塊（列表頁、相簿頁、圖片資料夾）

**Files:**
- Create: `src/pages/albums/index.astro`
- Create: `src/pages/albums/[slug].astro`
- Create: `public/images/.gitkeep`

- [ ] **Step 1: 建立圖片資料夾佔位檔 `public/images/.gitkeep`**

建立空檔 `public/images/.gitkeep`。

- [ ] **Step 2: 建立相簿列表頁 `src/pages/albums/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Image from '../../components/Image.astro';

const albums = (await getCollection('albums'))
  .filter((a) => !a.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="相簿 | MIN ZANG">
  <h1>相簿</h1>
  {albums.length === 0 ? (
    <p class="muted">還沒有相簿。</p>
  ) : (
    <div class="album-grid">
      {albums.map((a) => (
        <figure>
          <a href={`/albums/${a.id}`}>
            {a.data.cover && <Image src={a.data.cover} alt={a.data.title} />}
          </a>
          <figcaption><a href={`/albums/${a.id}`}>{a.data.title}</a></figcaption>
        </figure>
      ))}
    </div>
  )}
</BaseLayout>
```

- [ ] **Step 3: 建立相簿內頁 `src/pages/albums/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Image from '../../components/Image.astro';

export async function getStaticPaths() {
  const albums = await getCollection('albums');
  return albums.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const dateStr = entry.data.date.toISOString().slice(0, 10);
---
<BaseLayout title={`${entry.data.title} | 相簿`} description={entry.data.description}>
  <h1>{entry.data.title}</h1>
  <p class="muted">{dateStr}</p>
  <Content />
  <div class="album-grid">
    {entry.data.images.map((img) => (
      <figure>
        <Image src={img.src} alt={img.caption ?? entry.data.title} />
        {img.caption && <figcaption>{img.caption}</figcaption>}
      </figure>
    ))}
  </div>
  <p style="margin-top:2rem"><a href="/albums">← 回相簿</a></p>
</BaseLayout>
```

- [ ] **Step 4: 驗證 build 通過**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: albums list and album detail pages"
```

---

### Task 7: 首頁與「關於」頁

**Files:**
- Create: `src/pages/index.astro`（覆寫 scaffold 產生的版本）
- Create: `src/pages/about.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: 建立 `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#2563eb"/>
  <text x="16" y="22" font-size="16" font-family="sans-serif" fill="#fff" text-anchor="middle">M</text>
</svg>
```

- [ ] **Step 2: 覆寫首頁 `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';

// 匯整 journal + travel 最新 5 篇
const journal = (await getCollection('journal')).filter((p) => !p.data.draft);
const travel = (await getCollection('travel')).filter((p) => !p.data.draft);
const latest = [
  ...journal.map((p) => ({ ...p, section: 'journal' })),
  ...travel.map((p) => ({ ...p, section: 'travel' })),
]
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 5);
---
<BaseLayout title="MIN ZANG | 個人網站">
  <section>
    <h1>嗨，我是 MIN ZANG 👋</h1>
    <p>這裡記錄我的生活、旅遊，以及 AI 專案。</p>
  </section>

  <section>
    <h2>最新文章</h2>
    {latest.length === 0 ? (
      <p class="muted">還沒有文章。</p>
    ) : (
      <ul class="post-list">
        {latest.map((p) => (
          <PostCard
            href={`/${p.section}/${p.id}`}
            title={p.data.title}
            date={p.data.date}
            description={p.data.description}
          />
        ))}
      </ul>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 3: 建立 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="關於 | MIN ZANG">
  <h1>關於我</h1>
  <p>我是 MIN ZANG。這個網站用來記錄生活、旅遊與 AI 專案。</p>
  <p>（之後可以請 Claude 幫你把這段改成完整的自我介紹。）</p>
</BaseLayout>
```

- [ ] **Step 4: 驗證 build 通過**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: home page, about page and favicon"
```

---

### Task 8: 範例內容（1 篇日誌 + 1 個含圖相簿）以驗證完整流程

**Files:**
- Create: `src/content/journal/2026-06-19-hello-world.md`
- Create: `src/content/albums/2026-06-sample.md`
- Create: `public/images/albums/2026-06-sample/01.svg`
- Create: `public/images/albums/2026-06-sample/cover.svg`

> 註：範例用 SVG 佔位圖，避免在計畫中嵌入二進位。實際相片之後由使用者下載、Claude 壓縮為 jpg 放入相同結構。

- [ ] **Step 1: 建立範例日誌 `src/content/journal/2026-06-19-hello-world.md`**

```markdown
---
title: 網站上線了
date: 2026-06-19
description: 用 Astro 建立的個人網站第一篇。
tags: [日誌]
---

這是我的個人網站第一篇文章。之後生活、旅遊、AI 專案都會記錄在這裡。
```

- [ ] **Step 2: 建立範例封面圖 `public/images/albums/2026-06-sample/cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#dbeafe"/>
  <text x="200" y="160" font-size="28" font-family="sans-serif" fill="#1e3a8a" text-anchor="middle">Sample Cover</text>
</svg>
```

- [ ] **Step 3: 建立範例相片 `public/images/albums/2026-06-sample/01.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#bfdbfe"/>
  <text x="200" y="160" font-size="28" font-family="sans-serif" fill="#1e3a8a" text-anchor="middle">Photo 01</text>
</svg>
```

- [ ] **Step 4: 建立範例相簿 `src/content/albums/2026-06-sample.md`**

```markdown
---
title: 範例相簿
date: 2026-06-19
description: 驗證圖片流程用的範例相簿。
cover: /images/albums/2026-06-sample/cover.svg
images:
  - src: /images/albums/2026-06-sample/01.svg
    caption: 範例照片
---

這是一個範例相簿，用來確認圖片放在 repo、透過 Image 元件顯示的流程正常。
```

- [ ] **Step 5: 驗證 build 並檢查產出 HTML 含範例內容**

```powershell
npm run build
Select-String -Path dist/journal/index.html -Pattern "網站上線了"
Select-String -Path dist/albums/2026-06-sample/index.html -Pattern "2026-06-sample/01.svg"
```

Expected：build `Complete!`；兩個 `Select-String` 各至少一筆 match（代表日誌標題與相簿圖片路徑都正確輸出）。

- [ ] **Step 6: （可選）目視確認**

```powershell
npm run dev
```

於瀏覽器開 `http://localhost:4321/`，確認首頁、`/journal`、`/albums`、`/albums/2026-06-sample` 顯示正常，圖片有出現。確認後在終端機按 `Ctrl+C` 結束。

- [ ] **Step 7: Commit**

```powershell
git add -A
git commit -m "content: sample journal post and sample album"
```

---

### Task 9: GitHub Actions 自動部署設定

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 建立部署 workflow `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

說明：`withastro/action@v3` 會自動偵測 npm、安裝相依、`npm run build` 並上傳 artifact；`actions/deploy-pages@v4` 負責部署。

- [ ] **Step 2: 確認本機 build 仍通過（workflow 與本機一致）**

```powershell
npm run build
```

Expected：`Complete!`，無 error。

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "ci: add GitHub Pages deploy workflow"
```

---

### Task 10: 建立 GitHub repo、推送、啟用 Pages（含使用者手動步驟）

**Files:** 無（操作 GitHub 與 git remote）

- [ ] **Step 1: 【使用者手動】在 GitHub 建立空 repo**

請使用者用 `playclub4215` 帳號到 <https://github.com/new> 建立 repo：
- Repository name：**`playclub4215.github.io`**（必須完全一致）
- 設為 **Public**
- **不要**勾選 Add README / .gitignore / license（保持空 repo）

推送前先確認本機 git 身分已設定（若未設定，請使用者執行）：

```powershell
git config --global user.name "playclub4215"
git config --global user.email "zangunknow42@gmail.com"
```

- [ ] **Step 2: 設定 git 預設分支為 main 並接上 remote**

```powershell
git branch -M main
git remote add origin https://github.com/playclub4215/playclub4215.github.io.git
```

Expected：無 error（若 remote 已存在，改用 `git remote set-url origin ...`）。

- [ ] **Step 3: 推送**

```powershell
git push -u origin main
```

Expected：推送成功。首次會跳出 GitHub 登入授權（瀏覽器或裝置碼），依指示完成。

- [ ] **Step 4: 【使用者手動】設定 Pages 來源為 GitHub Actions**

到 repo 的 **Settings → Pages → Build and deployment → Source**，選擇 **GitHub Actions**。

- [ ] **Step 5: 確認部署成功**

到 repo 的 **Actions** 分頁，確認 "Deploy to GitHub Pages" workflow 為綠勾。
然後開啟 <https://playclub4215.github.io> 確認網站上線、各區塊與範例圖片正常。

Expected：網站可正常開啟，首頁、journal、albums、about 皆正常，範例圖片顯示。

- [ ] **Step 6: （若需要）排除常見問題**

- 若 Actions 失敗在 build：本機重跑 `npm run build` 對照錯誤訊息修正後重新 commit/push。
- 若頁面 404：確認 Source 已選 GitHub Actions、repo 名稱完全等於 `playclub4215.github.io`、且 workflow 已成功跑完一次。
- 若圖片破圖：確認圖片在 `public/images/...` 且 Markdown 內 `src` 路徑以 `/images/` 開頭。

---

## 完成標準（MVP Done）

- `https://playclub4215.github.io` 可開啟。
- 6 個區塊（首頁、生活日誌、旅遊、相簿、AI 專案、關於）皆可瀏覽。
- 範例日誌與範例相簿正常顯示，相簿圖片由 repo 載入。
- push 到 main 會自動觸發 GitHub Actions 重新部署。

## 後續（第二階段，YAGNI，不在本計畫）

- 站內搜尋（Fuse.js）、標籤分類頁、RSS feed、首頁封面美化。
- 照片量接近 1GB 時改接 Cloudflare R2（只改 `Image.astro` 的 `IMAGE_BASE`）。
