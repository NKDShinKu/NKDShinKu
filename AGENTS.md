# AGENTS.md — NKDShinKu 博客项目约定

> AI 协作时的项目事实来源。保持精简；docs/ 规划文档已入库（其中 博客项目背景.md
> 为本地提示词、不入库）。每次会话开始先读本文件；**每次 commit 前把变更清单交用户评审，确认后才能提交**。

## 1. 项目概述

- 二次元风格现代个人技术博客，蓝白基调；排版/配色/微透视/交互优先，二次元素材克制使用。
- 内容板块：文章/教程、实验室/项目、日常、二次元/追番（Bangumi）。
- 域名 `https://nkdshinku.com`；仓库 `NKDShinKu/NKDShinKu`（public）。
- 当前进度：M0 框架完成 → **M1 设计定稿**。

## 2. 技术栈

| 项 | 选型 |
|----|------|
| 框架 | Next.js 16 App Router，`output: "export"` 全静态 SSG |
| 语言 | TypeScript 5.9 strict（勿升 TS 7） |
| 样式 | TailwindCSS 4（CSS-first `@theme`；勿加 tailwind.config、勿写裸 CSS） |
| UI 组件 | **自研**：手写 React 组件 + Tailwind 工具类；确需无样式原语才引入 Radix；不用带样式组件库（shadcn 已弃用） |
| 图标 | Iconify（`@iconify/tailwind4`，类名 `icon-[mdi--xxx]`；新图标集需安装 `@iconify-json/*`） |
| 排版 | @tailwindcss/typography（文章正文 `prose`） |
| 动画 | GSAP（M1 定稿后按需安装；只用 transform/opacity，尊重 prefers-reduced-motion） |
| 搜索 | Pagefind（CI 构建后对 `out/` 索引） |
| 图床 | Cloudflare R2（自定义域，M4 接入） |
| 评论 | giscus（暂缓） |
| 包管理 | pnpm（lockfile 已锁定） |

## 3. 常用命令

```bash
pnpm dev          # 开发（Turbopack）
pnpm build        # 静态导出 → out/
pnpm preview      # 本地预览 out/
pnpm build:search # Pagefind 索引
pnpm lint         # ESLint（flat config）
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier
```

## 4. 静态导出红线（最重要）

`next.config.ts` 已设 `output: "export"`，以下一律不可用、勿引入：

- ❌ API Routes / middleware / ISR / Server Actions / 动态渲染
- ❌ 服务端 SDK；构建期 `fetch` 外部数据（产物会过期）
- ⚠️ `next/image` 必须 unoptimized（已全局配置），远程图显式宽高
- ⚠️ 动态数据（Bangumi 等）走浏览器端 fetch，做好加载/失败态
- ⚠️ `NEXT_PUBLIC_*` 会打进静态产物，勿放密钥

## 5. 目录与代码约定

```
src/
├── app/            # 路由页面；metadata 优先从 lib/site.config 扩展
├── components/
│   ├── layout/     # 页头/页脚等全局布局
│   ├── ui/         # 自研通用原语（按钮/卡片等，无组件库）
│   └── [feature]/  # 业务组件按功能分目录
└── lib/            # 纯函数/数据加载/外部 API 封装（无 JSX）
```

- 组件：函数组件 + 显式 `Props` 类型；文件 kebab-case，具名导出。
- 样式全用 Tailwind 工具类；重复模式提炼为 token 或组件，不复制粘贴。
- 图标 `size-5/6`；装饰图标 `aria-hidden`，纯图标按钮 `aria-label`。
- 无障碍底线：对比度 ≥ 4.5:1、可见 focus、触控目标 ≥ 44px、图片必带 alt。
- 暗色模式：`dark:` 变体已配置，主题切换器在 M1 实现。

## 6. 设计系统（暂定，M1 定稿）

- token 在 `src/app/globals.css`：品牌蓝 `#5B8FD4` + 樱粉 `#F0A0B8` + 暮紫 `#9B8EC4`；
  字体 Quicksand/Inter/JetBrains Mono（next/font）+ 中文系统回退。
- M1 定稿前勿大改视觉；定稿后同步更新本文件。

## 7. 工作流（skills）

- skills 安装到 `.claude/skills` / `.agents/skills`（不入库，新环境按本清单重装）。
- 流水线：`ui-ux-pro-max`(方向) → `frontend-design`(方案) → `tailwind-design-system`(规范落地)
  → 编码 → `web-design-guidelines`(审查) → `ui-animation`(润色)。

推荐安装清单（按阶段按需）：

| 阶段 | skill | 用途 |
|------|-------|------|
| M1 设计 | ui-ux-pro-max / frontend-design / tailwind-design-system / web-design-guidelines / ui-animation | 设计流水线五件套 |
| 动画 | gsap-core / gsap-scrolltrigger / gsap-react | GSAP 用法与性能规范 |
| M2 内容 | blog-write 或同类 SEO 写作 skill（可选） | 文章结构与 SEO |
| 全阶段 | git-commit | 提交信息规范 |

## 8. Git 约定（含用户规则）

- **commit 前必须将变更清单交用户评审，确认后才提交**（用户规则，勿擅自 commit）。
- Conventional Commits + 中文描述；一次提交只做一件事。
- 不入库：`docs/博客项目背景.md`（本地提示词）、`.claude/`、`.agents/`、构建产物（`out/`、`.next/`）。
- 提交前 `lint + typecheck + build` 全绿。
- `main` 推送触发部署；是否推送、何时推送由用户决定。

## 9. 部署要点（摘要，完整清单见 docs/部署清单.md）

- GitHub Pages：Settings → Pages → Source 选 **GitHub Actions**；自定义域名 `nkdshinku.com`；
  DNS 加 A 记录（185.199.108.153 等 4 个）或 CNAME 到 `NKDShinKu.github.io`；开启 Enforce HTTPS。
- R2 图床绑自定义域（勿用 r2.dev）；giscus 需开 Discussions + 安装 giscus App；Bangumi 需实测 CORS。

## 10. 路线图摘要（详见 docs/路线图.md）

M0 框架 ✅ → **M1 设计定稿** → M2 内容层（markdown 管线、博客列表/详情）→
M3 功能（项目/追番/搜索 UI/评论/关于）→ M4 上线 → M5 迭代。

## 11. AGENTS.md 维护约定

本文件随开发演进，注意：

- **何时更新**：技术栈/依赖变化；新增红线或约定；踩坑经验（"会再次遇到且容易忘"的才记）。
- **怎么写**：一句话一条，删掉过时内容；禁止堆砌长篇说明。
- **谁更新**：每次修改同代码一样走用户评审后提交；第 1 节"当前进度"随里程碑推进更新。
