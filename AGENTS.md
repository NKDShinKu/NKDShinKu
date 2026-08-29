# AGENTS.md — NKDShinKu 博客项目约定

> AI 协作时的项目**规则**文件。项目事实（方案/选型/设计/外部服务）见
> `docs/project-manifest.md`；进度见 `docs/roadmap.md`；部署步骤见 `docs/ops/deploy-checklist.md`。
> 每次会话开始先读本文件与 project-manifest.md。
> **每次 commit 前把变更清单交用户评审，确认后才能提交**（用户规则）。

## 1. 常用命令

```bash
pnpm dev          # 开发（Turbopack）
pnpm build        # 静态导出 → out/
pnpm preview      # 本地预览 out/
pnpm build:search # Pagefind 索引
pnpm lint         # ESLint（flat config）
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier
```

## 2. 静态导出红线（最重要）

`next.config.ts` 已设 `output: "export"`，以下一律不可用、勿引入：

- ❌ API Routes / middleware / ISR / Server Actions / 动态渲染
- ❌ 服务端 SDK；构建期 `fetch` 外部数据（产物会过期）
- ⚠️ `next/image` 必须 unoptimized（已全局配置），远程图显式宽高
- ⚠️ 动态数据（Bangumi 等）走浏览器端 fetch，做好加载/失败态
- ⚠️ `NEXT_PUBLIC_*` 会打进静态产物，勿放密钥
- ⚠️ TypeScript 锁 5.9，勿升 TS 7

## 3. 代码约定

### 3.1 目录结构

```
src/
├── app/            # 路由页面；metadata 优先从 lib/site.config 扩展
├── components/
│   ├── layout/     # 页头/页脚等全局布局
│   ├── ui/         # 自研通用原语（按钮/卡片等，无组件库）
│   └── [feature]/  # 业务组件按功能分目录
└── lib/            # 纯函数/数据加载/外部 API 封装（无 JSX）
```

### 3.2 组件边界（重要）

- 默认写**服务端组件**（构建期渲染）；仅当用到 hooks / 事件处理 / 浏览器 API 时才加
  `'use client'`，且客户端组件尽量下沉到叶子。
- 客户端组件内不做数据获取；数据获取在构建期（服务端）或浏览器端封装于 `lib/`。

### 3.3 命名与导入

- `app/` 路由文件用固定名（`page.tsx` / `layout.tsx` / `not-found.tsx` / `icon.svg`），
  页面组件 default 导出。
- 其余组件文件 kebab-case、具名导出；函数组件 + 显式 `Props` 类型。
- 导入统一 `@/` 别名，禁止 `../../` 相对路径。

### 3.4 样式 / 图标 / 无障碍

- 样式全用 Tailwind 工具类；重复模式提炼为 token 或组件，不复制粘贴。
- 图标 `size-5/6`；装饰图标 `aria-hidden`，纯图标按钮 `aria-label`。
- 无障碍底线：对比度 ≥ 4.5:1、可见 focus、触控目标 ≥ 44px、图片必带 alt。
- 暗色模式：`dark:` 变体已配置，主题切换器在 M1 实现。

### 3.5 质量门槛

- 提交前 `lint + typecheck + build` 全绿；暂不引入测试框架。

## 4. 设计约定

待补充

## 5. skills 工作流

- 安装目录：`.claude/skills` / `.agents/skills`（不入库，新环境按本清单重装）。
- 已装 16 个：设计五件套 + GSAP×8 + `blog-write` + `git-commit` + `vercel-react-best-practices`
  （来源见 `docs/project-manifest.md` 变更记录；Vue 相关 skill 不装）。

按任务规模选用：

| 任务              | 流程                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 大改版 / 新页面   | `ui-ux-pro-max`(方向) → `frontend-design`(方案) → `tailwind-design-system`(规范) → 编码 → `web-design-guidelines`(审查) → `ui-animation`(润色) |
| 小改动 / 修 bug   | 直接编码；样式改动后按需用 `web-design-guidelines` 自查                                                                                        |
| 写文章            | `blog-write`                                                                                                                                   |
| 动画              | 按用途选 `gsap-*` + `ui-animation`                                                                                                             |
| React / Next 代码 | 编码时遵循 `vercel-react-best-practices`                                                                                                       |
| 提交              | `git-commit`                                                                                                                                   |

- `vercel-react-best-practices` 面向通用 Next.js（含服务端渲染/数据获取建议），其 server-* 规则
  与本项目静态导出红线冲突时，以 §2 为准。

## 6. Git 约定

- **commit 前必须将变更清单交用户评审，确认后才提交**（用户规则，勿擅自 commit）。
- Conventional Commits + 中文描述；一次提交只做一件事。
- 不入库：`docs/博客项目背景.md`（本地提示词）、`.claude/`、`.agents/`、构建产物（`out/`、`.next/`）。
- 提交前 `lint + typecheck + build` 全绿。
- **推送**：本环境 AI 无法完成 GitHub 认证，`git push` 由用户在终端执行；`main` 推送触发部署。

## 7. 已知坑（会再次遇到的）

- `trailingSlash: true` 是 GitHub Pages 无扩展名 URL 的前提，勿改回 `false`。
- Pagefind 只索引构建产物：新增页面后本地验证 `pnpm build && pnpm build:search`。
- Iconify 新图标集需先安装对应 `@iconify-json/<set>`。
- pnpm 11 的项目配置在 `pnpm-workspace.yaml`（不在 package.json 的 `pnpm` 字段）。

## 8. 维护约定

本文件随开发演进：

- **何时更新**：技术栈/依赖变化；新增红线或约定；踩坑经验（"会再次遇到且容易忘"的才记）。
- **怎么写**：一句话一条，删掉过时内容；禁止堆砌长篇说明。
- **谁更新**：每次修改同代码一样走用户评审后提交；事实类变化先改 manifest，规则类变化改本文件。
- **计划怎么写**：未来计划只记方向、不写细项（见 docs/roadmap.md 说明），避免频繁返工。
