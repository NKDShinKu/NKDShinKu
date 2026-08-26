# NKDShinKu

个人技术博客与作品集。V1 纯前端静态站点。设计风格：Soft ACG Fusion（玻璃态 × 极光 × 轻二次元）。

## AI 行为规则

- 编码前先说明改什么、为什么
- 不确定需求时提问，不自作假设
- 一次只改一个功能点，不顺手重构无关代码
- 新增 npm 依赖前必须告知并说明原因
- TypeScript 类型报错 → 修类型，禁止 `as any`
- 新组件先查 `design-system/nkdshinku/pages/<page>.md` 的规格，没有则用 MASTER.md 的全局规则

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 + Composition API (`<script setup lang="ts">`) | ^3.5 |
| 构建 | Vite | ^8.0 |
| 语言 | TypeScript | ~5.9 |
| 路由 | Vue Router 4 (Hash history) | ^4.6 |
| 状态 | Pinia 3 (Composition API style) | ^3.0 |
| 样式 | TailwindCSS 4 (`@import 'tailwindcss'` + `@theme`) | ^4.1 |
| 图标 | Iconify (`@iconify/tailwind4` + Lucide 图标集) | ^2.2 |
| 排版 | `@tailwindcss/typography`（文章正文 prose） | ^0.5 |
| 动画 | GSAP 3 (Timeline / ScrollTrigger) | ^3.14 |
| 内容 | marked (Markdown → HTML, `{ breaks: true, gfm: true }`) | ^18.0 |
| 部署 | GitHub Pages（静态托管, `base: './'`） | — |

## 目录结构

```
src/
├── assets/
│   ├── css/main.css              # Tailwind 入口 + @theme + 暗色变量
│   ├── images/                   # 静态图片
│   └── video/                    # Hero 视频素材
├── components/
│   ├── app/                      # AppHeader, AppFooter
│   ├── blog/                     # PostCard, TagFilter, PostHeader, PostContent
│   ├── project/                  # ProjectCard, CategoryFilter, ProjectModal
│   ├── anime/                    # StatusTabs, AnimeCard
│   └── common/                   # BaseButton, BaseCard, BaseTag, FadeInSection,
│                                 # ParallaxLayer, ParticleBackground, ThemeToggle,
│                                 # ScrollProgress
├── composables/                  # useXxx 组合式函数
├── content/posts/                # Markdown 文章 (*.md)
├── pages/
│   ├── home/HomePage.vue
│   ├── blog/BlogPage.vue
│   ├── blog/BlogPostPage.vue
│   ├── projects/ProjectsPage.vue
│   ├── anime/AnimePage.vue
│   └── error/NotFoundPage.vue
├── types/index.ts                # 所有 TS 接口定义
├── utils/                        # markdown 解析、日期格式化等
├── stores/                       # Pinia: posts, projects, anime, theme
└── router/index.ts               # 路由配置 + meta 类型扩展
```

## 路由表

| Path | Name | Page | Meta |
|------|------|------|------|
| `/` | `home` | HomePage | `{ title: '首页' }` |
| `/blog` | `blog` | BlogPage | `{ title: '博客' }` |
| `/blog/:slug` | `blog-post` | BlogPostPage | `{ title: '' }`（动态） |
| `/projects` | `projects` | ProjectsPage | `{ title: '项目' }` |
| `/anime` | `anime` | AnimePage | `{ title: '追番' }` |
| `/:pathMatch(.*)*` | `not-found` | NotFoundPage | `{ title: '404' }` |

## 设计系统

```
design-system/nkdshinku/
├── MASTER.md           # 全局规则（配色/字体/间距/阴影/动效/组件 CSS）
└── pages/
    ├── home.md         # 首页：Video Hero + About + Bento Hub + LatestPosts
    ├── blog.md         # 博客列表：TagFilter + PostCard 网格
    ├── blog-post.md    # 文章详情：prose 阅读区 + 滚动进度条
    ├── projects.md     # 项目：CategoryFilter + ProjectCard + Modal
    └── anime.md        # 追番：StatusTabs + AnimeCard 封面网格
```

**使用方式：** 构建页面时先查 `pages/<name>.md`（覆盖规则），没有则用 MASTER.md。

**设计约束速查：**

- 玻璃态卡片 → 半透明底 + `backdrop-blur` + 白边框 + 柔和阴影。**阅读区不用玻璃态**，用 solid surface
- 圆角：8px(小) / 12px(卡片) / 16px(大)
- 动画：仅 `transform` + `opacity`，微交互 150-200ms ease-out
- 不用纯白 `#FFF`、纯黑 `#000`，不用 `transition: all`
- 不用 emoji 做 UI 图标 → 用 Lucide SVG
- 触控目标 ≥ 44×44px，文字对比度 ≥ 4.5:1，可见焦点环
- 尊重 `prefers-reduced-motion`

## 编码规范

### Vue

- `<script setup lang="ts">`，文件名 PascalCase 多单词
- Props: `defineProps<{ ... }>()`，Emits: `defineEmits<{ ... }>()`
- 模板中用 PascalCase 引用组件，单文件 ≤ ~200 行
- 组合式函数命名 `useXxx`，放 `src/composables/`
- 类型定义放 `src/types/index.ts`，接口/类型 PascalCase
- 页面目录 kebab-case，路由路径 kebab-case

### TailwindCSS v4

- 入口 `src/assets/css/main.css`，自定义 token 在 `@theme {}` 中定义
- 暗色模式通过 `.dark` 类 + CSS 变量覆盖
- 响应式移动优先：`md:` `lg:` 渐进增强
- 文章区用 `<article class="prose">`

### GSAP

- 简单 hover → CSS transition（150-200ms ease-out）
- 入场动画 → GSAP Timeline（标题/CTA stagger）
- 滚动触发 → GSAP ScrollTrigger + FadeInSection 包装组件
- 页面切换 → GSAP + Vue Router 守卫
- 必须检查 `prefers-reduced-motion`，移动端降级

## 数据流

```
V1: .md 文件 → import.meta.glob → frontmatter 解析 + marked → Post.html → v-html
Bangumi: fetch(bgm.tv API) → localStorage cache → Pinia store → 组件
```

## 命令

```bash
npm run dev          # localhost:5173
npm run build        # type-check + 生产构建
npm run preview      # 预览构建产物
npm run type-check   # 仅类型检查
npm run lint         # ESLint 检查 + 修复
npm run format       # Prettier 格式化
```

## V1 约束

❌ 后端 · 数据库 · 登录 · 后台 · 评论
✅ Markdown 管理内容 · GitHub Pages 部署 · Hash 路由 · 客户端 fetch Bangumi API

## Skill 调用

> 设计文档告诉你「做成什么样」，Skill 告诉你「怎么高效地做出来」。

### AI 应主动调用（写相关代码时自动加载）

写 `.vue` / Pinia / 路由 / TailwindCSS / GSAP 代码时，AI 自动加载对应的 skill（`vue-best-practices`、`vue-pinia-best-practices`、`vue-router-best-practices`、`tailwind-design-system`、`gsap-*`、`create-adaptable-composable`、`vue-debug-guides`）。

### 速查表

| 你要做什么 | 调哪个 |
|-----------|--------|
| 选配色 / 挑字体 / 定风格 | `python .Codex/skills/ui-ux-pro-max/scripts/search.py "关键词" --design-system` |
| 新建页面，需要视觉方向 | `/frontend-design`（仅在现有设计系统不适用时） |
| 加复杂入场/滚动动画 | `/gsap-timeline` 或 `/gsap-scrolltrigger` |
| Vue 中集成 GSAP | `/gsap-frameworks` |
| 动效参数不确定 | `/ui-animation` |
| 动画性能问题 | `/gsap-performance` |
| 提交代码 | `/git-commit`（自动跑 lint → type-check → build） |
| 上线前设计审查 | `/web-design-guidelines` |
| 代码审查 / 重构 | `/code-review` 或 `/simplify` |
| 验证改动是否生效 | `/verify` |
| 做数据图表 | `/dataviz` |
| 深度调研某方案 | `/deep-research "问题"` |

> ⚠️ `ui-ux-pro-max --persist` 会覆盖 `design-system/` 下的文件，仅在需要**重新生成**设计系统时使用。日常调整直接编辑 MASTER.md 或 pages/\*.md。

## 参考文档

| 文档 | 用途 |
|------|------|
| [design-system/nkdshinku/MASTER.md](./design-system/nkdshinku/MASTER.md) | 全局设计系统 |
| [design-system/nkdshinku/pages/](./design-system/nkdshinku/pages/) | 逐页设计规格 |
| [design-system/preview.html](./design-system/preview.html) | 浏览器预览整体效果 |
| [docs/plan.md](./docs/plan.md) | 长期项目规划 |
