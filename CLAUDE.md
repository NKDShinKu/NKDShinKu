# NKDShinKu 个人博客 — CLAUDE.md

## 项目概述

个人技术博客与作品集站点，长期学习型项目。承载笔记文章、项目展示、Demo 实验、以及前端→后端→运维的完整学习链路。

- **V1（当前）**：纯前端静态站点，Markdown 管理内容，GitHub Pages 免费部署
- **V2（未来）**：后端 + 数据库 + 后台管理

## AI 行为约束

- 修改代码前先说明改什么、为什么，再动手
- 不确定需求时先问，不要自己脑补
- 单次修改控制在一个功能点，不要顺带重构不相关代码
- 新增依赖前必须告知，不能静默 `npm install`
- 遇到 TypeScript 类型问题，修复类型而不是用 `as any` 逃脱
- 新建组件前必须先按 [DESIGN.md](./DESIGN.md) 第 4 章模板写规格说明

## 技术栈

| 类别 | 技术                         | 版本  |
| ---- | ---------------------------- | ----- |
| 框架 | Vue 3 (Composition API)      | ^3.5  |
| 构建 | Vite                         | ^8.0  |
| 语言 | TypeScript                   | ~5.9  |
| 路由 | Vue Router 4 (Hash History)  | ^4.6  |
| 状态 | Pinia 3                      | ^3.0  |
| 样式 | TailwindCSS 4                | ^4.1  |
| 动画 | GSAP 3                       | ^3.14 |
| 图标 | Iconify + @iconify/tailwind4 | ^2.2  |
| 内容 | gray-matter + marked         | —     |
| 部署 | GitHub Pages (Actions)       | —     |

## 目录结构

```
src/
├── assets/css/main.css        # TailwindCSS 入口
├── components/
│   ├── app/                   # 应用外壳（Layout, Header, Footer）
│   ├── blog/                  # 博客相关组件
│   ├── project/               # 项目相关组件
│   └── common/                # 跨域复用的通用 UI（BaseButton, BaseCard, BaseTag）
├── composables/               # 组合式函数 useXxx，不放业务副作用
├── content/posts/             # Markdown 文章（*.md），frontmatter 字段见 Markdown 内容规范
├── pages/                     # 页面组件（按功能域分组，仅为入口组件）
│   ├── home/HomePage.vue
│   ├── blog/BlogPage.vue, BlogPostPage.vue
│   ├── projects/ProjectsPage.vue
│   └── error/NotFoundPage.vue
├── types/                     # TypeScript 类型定义
├── utils/                     # 工具函数（markdown, format）
├── stores/                    # Pinia stores（仅应用级状态）
└── router/                    # 路由配置
```

## 代码规范

### Vue 组件

- **一律使用 `<script setup lang="ts">`**（Composition API）
- 组件文件命名：**PascalCase、多单词**（`PostCard.vue`，不是 `postcard.vue`）
- Props 声明：类型语法 `defineProps<{ title: string }>()`
- Emits 声明：类型语法 `defineEmits<{ click: [id: number] }>()`
- 模板中使用 PascalCase 引用组件：`<PostCard />`
- 单文件不超过 ~200 行，超出则抽取子组件

### TypeScript

- 类型定义统一放在 `src/types/` 目录
- 接口/类型使用 PascalCase 命名
- 组合式函数使用 `useXxx` 命名（驼峰）
- 工具函数使用 camelCase 命名

### 样式

- **TailwindCSS 4 原子类优先**，不写自定义 CSS 文件
- 文章内容区使用 `prose` 类（@tailwindcss/typography）
- 响应式：移动优先（`md:`、`lg:` 渐进增强）
- 动画仅使用 `transform` 和 `opacity`（GPU 加速）

### 设计风格

详见 [DESIGN.md](./DESIGN.md)，快速摘要：

- **基调**：通透、清新、轻科技、轻 ACG
- **配色**：浅色底 `#F8FAFC` + 天蓝主色 `#4A90D9` + 玻璃拟态卡片
- **动效**：克制——hover 上浮 + 阴影过渡，150-200ms ease-out，仅用 transform + opacity
- **组件**：圆角（10-16px）、玻璃态（半透明底 + backdrop-blur + 白边框 + 柔和阴影）
- **禁止**：纯白底 `#FFF`、纯黑文字 `#000`、大面积高饱和色、`transition: all`、花哨粒子背景

### 组件设计流程（重要）

**编码前必须按 [DESIGN.md](./DESIGN.md) 第 4 章模板写规格说明**，明确以下内容后再动手：

1. 使用场景（这个组件用在哪里）
2. 用户操作（可点击 / 悬停 / 输入...）及对应反馈
3. 状态要求（默认 → hover → active → loading → success → error → empty → disabled，按需选取）
4. 动效要求（对齐全局风格：hover 上浮 + 阴影过渡，150-200ms ease-out）
5. 响应式要求（桌面 + 移动端，移动端不依赖 hover）
6. 技术要求（代码结构清晰、状态可维护）

### 目录与路由

- 页面目录名使用 kebab-case（`pages/blog/`）
- 路由路径使用 kebab-case（`/blog/my-first-post`）
- 组件目录按功能域分组（`app/`, `blog/`, `project/`, `common/`）

## 命令

```bash
npm run dev          # 开发服务器（localhost:5173）
npm run build        # 生产构建（含 type-check）
npm run preview      # 预览生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 检查并自动修复
npm run format       # Prettier 格式化
```

## Git 提交

提交前执行 `npm run lint && npm run type-check && npm run build`，通过后按 `type: 中文描述` 格式提交。详细规范见 `/git-commit` skill。

## V1 约束

- ❌ 不做后端服务、不做数据库
- ❌ 不做登录/认证系统
- ❌ 不做后台管理界面
- ❌ 不做评论系统
- ✅ 所有内容通过 Markdown 文件管理
- ✅ 部署到 GitHub Pages（Hash 路由）

## V1→V2 升级路径

Markdown 渲染管线设计为数据源无关：

```
V1: .md 文件 → gray-matter + marked → Post.html → v-html
V2: Tiptap编辑器 → 数据库 → API → Post.html → v-html
                              ↑ 渲染组件不变
```

关键接口 `Post.html: string`，不关心 HTML 来源。

## Markdown 内容规范

### Frontmatter 字段

| 字段      | 类型                | 必填 | 说明                                    |
| --------- | ------------------- | ---- | --------------------------------------- |
| `title`   | string              | ✅   | 文章标题                                |
| `date`    | string (YYYY-MM-DD) | ✅   | 发布日期                                |
| `tags`    | string[]            | ✅   | 标签列表                                |
| `summary` | string              | ✅   | 摘要（列表页展示）                      |
| `draft`   | boolean             | ❌   | 草稿（默认 false），true 时生产构建过滤 |
| `cover`   | string              | ❌   | 封面图路径（暂不使用，预留）            |

### 渲染栈

- 解析：`gray-matter`（frontmatter） + `marked`（正文 → HTML）
- marked 配置：`{ breaks: true, gfm: true }`
- 代码高亮：V1 用 marked 原生处理代码块，V2 加 highlight.js
- 样式：`@tailwindcss/typography` 的 `prose` 类 + 品牌自定义覆盖

## 参考文档

- [DESIGN.md](./DESIGN.md) — 设计系统全文档（~500 行），**按需按章节读取，不要整体加载**
  - 新建组件 → 读第 4 章（组件规格模板 + 具体组件参数）
  - 配色/字体/间距决策 → 读第 2-3 章
  - 动效参数不确定 → 读第 4 章对应组件
  - 响应式断点 → 读第 8 章
- [docs/plan.md](./docs/plan.md) — 长期项目规划（Phase 0–6）

## 工具约束

- 新组件动效统一走 GSAP（gsap-core / gsap-timeline / gsap-scrolltrigger），简单 hover 可用 CSS transition
- 上线前跑 `web-design-guidelines` 检查无障碍问题
- TailwindCSS 按 `tailwind-design-system` skill 规范，不用自定义 CSS 文件
