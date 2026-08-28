# AGENTS.md — NKDShinKu 博客项目约定

> 本文件是 AI 协作（vibe coding）时的项目事实来源。开始任何任务前先阅读本文件与
> docs/ 下的相关文档；任务完成后按本文件约定提交。

## 1. 项目概述

- 二次元风格的现代个人技术博客，内容板块：文章/教程、实验室/项目、日常、二次元/追番（Bangumi）。
- 设计方向：蓝白为主的 ACG 风格，排版/配色/微透视/交互优先，二次元素材克制使用。
- 站点域名：`https://nkdshinku.com`；GitHub 仓库（public）：`NKDShinKu/NKDShinKu`。

## 2. 技术栈与版本

| 项     | 选型                                      | 说明                                                      |
| ------ | ----------------------------------------- | --------------------------------------------------------- |
| 框架   | Next.js 16 (App Router)                   | `output: "export"` 全静态 SSG                             |
| 语言   | TypeScript 5.9 (strict)                   | **不要升级到 TS 7**（生态兼容未验证）                     |
| 样式   | TailwindCSS 4（CSS-first `@theme`）       | 禁止写裸 CSS，除非确实无法用工具类表达                    |
| 组件   | shadcn/ui（`pnpm dlx shadcn@latest add`） | 新组件一律走 CLI 引入，禁止手抄源码                       |
| 排版   | @tailwindcss/typography                   | 文章正文用 `prose`                                        |
| 图标   | Iconify（`@iconify/tailwind4`）           | 类名语法 `icon-[mdi--xxx]`，禁止 emoji 当图标             |
| 动画   | GSAP（后续阶段安装）                      | 只用 transform/opacity；必须尊重 `prefers-reduced-motion` |
| 搜索   | Pagefind                                  | CI 构建后对 `out/` 生成索引                               |
| 图床   | Cloudflare R2（后续接入）                 | 见 docs/部署清单.md                                       |
| 评论   | giscus（暂缓）                            | 见路线图 M3/M4                                            |
| 包管理 | pnpm（`packageManager` 已锁定）           | 不要引入 npm/yarn lockfile                                |

## 3. 常用命令

```bash
pnpm dev          # 开发服务器（Turbopack）
pnpm build        # 静态导出 → out/
pnpm preview      # 本地预览 out/
pnpm build:search # Pagefind 索引
pnpm lint         # ESLint（flat config）
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier
pnpm dlx shadcn@latest add <component>   # 新增 shadcn 组件
```

## 4. 硬性约束（静态导出红线）

`next.config.ts` 已设置 `output: "export"`，以下能力**一律不可用**，不要引入：

- ❌ API Routes / Route Handlers / Server Actions / middleware
- ❌ ISR / 动态渲染 / 依赖请求的页面数据（`generateStaticParams` 之外）
- ❌ 需要服务端的第三方 SDK（数据库、服务端鉴权等）
- ⚠️ `next/image` 必须是 `unoptimized`（配置已全局开启），远程图直接引用并显式宽高
- ⚠️ 需要实时数据的功能（如 Bangumi）走**浏览器端 fetch**，并做好加载/失败态
- ⚠️ 环境变量只在构建期存在：任何 `NEXT_PUBLIC_*` 都会打进静态产物，不要放密钥

## 5. 目录与代码约定

```
src/
├── app/            # 路由页面；每页 metadata 优先从 lib/site.config 扩展
├── components/
│   ├── layout/     # 页头/页脚等全局布局
│   ├── ui/         # shadcn 生成组件（不要手动修改，主题走 globals.css）
│   └── [feature]/  # 业务组件按功能分目录
└── lib/            # 纯函数/数据加载/外部 API 封装（无 JSX）
```

- 组件：函数组件 + 显式 `Props` 类型；文件用 kebab-case，导出具名组件。
- 样式：全部用 Tailwind 工具类；重复的模式提炼为 `@theme` token 或组件，不复制粘贴。
- 图标尺寸统一 `size-5`/`size-6`（24×24 viewBox）；纯装饰图标加 `aria-hidden`，纯图标按钮加 `aria-label`。
- 无障碍底线：对比度 ≥ 4.5:1、可见 focus 状态、触摸目标 ≥ 44px、图片必带 alt。
- 暗色模式：class 策略已配置（`dark:` 变体），主题切换器在设计阶段实现。

## 6. 设计系统（暂定）

- 当前 token 基于旧设计系统 `design-system-old/nkdshinku/MASTER.md`（Soft ACG Fusion：
  天蓝 `#5B8FD4` + 樱粉 `#F0A0B8` + 暮紫 `#9B8EC4`，字体 Quicksand/Inter/JetBrains Mono）。
- 设计参考：`docs/design/黏土质感风格参考.md`（Claymorphism，暂定待定）、`docs/design/滚动叙事参考.md`（Scrollytelling）。
- **M1 设计定稿前不要大改视觉**；定稿由 ui-ux-pro-max 输出并落库到 `docs/design/`。

## 7. 设计/实现工作流（skills 方案）

skills 目录：`.claude/skills` 与 `.agents/skills`（按所用 Agent 平台安装；skill 文件不入库，本仓库当前不装任何 skill）。

推荐流水线（每次页面/组件开发）：

1. `ui-ux-pro-max` —— 定设计方向（新页面/大改版时）
2. `frontend-design` —— 保证实现方式靠谱（技术选型/实现方案）
3. `tailwind-design-system` —— token 与代码规范落地，防止样式失控
4. 编码实现（遵守本文件约定）
5. `web-design-guidelines` —— 规范审查（排版/间距/无障碍）
6. `ui-animation` —— 动画润色（GSAP，克制、可降级）

## 8. Git 约定

- 提交信息：Conventional Commits，中文描述，如 `feat(blog): 新增文章列表页`。
- 一次提交只做一件事；构建产物（`out/`、`.next/`）已被忽略。
- `main` 分支推送会触发部署；提交前必须通过 `pnpm lint && pnpm typecheck && pnpm build`。
- 部署相关的平台手工步骤见 `docs/部署清单.md`，完成一项勾一项。

## 9. 常见坑（历史经验）

- 静态导出下不要在服务端组件里 `fetch()` 外部数据（构建期执行、产物过期）。
- Pagefind 只索引构建产物：新增页面后本地验证 `pnpm build && pnpm build:search`。
- GitHub Pages 无扩展名 URL 依赖 `trailingSlash: true` 的目录式输出，不要改回 `false`。
- Tailwind 4 里自定义主题用 `@theme`，不要在 JS 里配置 tailwind.config。
