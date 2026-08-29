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

## 4. 设计约定（暂定）

- token 与色板见 `docs/project-manifest.md` 第 4 节；定义在 `src/app/globals.css`。
- **M1 定稿前勿大改视觉**；定稿后同步更新 manifest。

## 5. skills 工作流

- 安装目录：`.claude/skills` / `.agents/skills`（不入库，新环境按本清单重装）。
- 流水线：`ui-ux-pro-max`(方向) → `frontend-design`(方案) → `tailwind-design-system`(规范落地)
  → 编码 → `web-design-guidelines`(审查) → `ui-animation`(润色)。
- 已装 15 个：设计五件套 + GSAP×8 + `blog-write` + `git-commit`（来源见
  `docs/project-manifest.md` 变更记录；Vue 相关 skill 不装）。

## 6. Git 约定

- **commit 前必须将变更清单交用户评审，确认后才提交**（用户规则，勿擅自 commit）。
- Conventional Commits + 中文描述；一次提交只做一件事。
- 不入库：`docs/博客项目背景.md`（本地提示词）、`.claude/`、`.agents/`、构建产物（`out/`、`.next/`）。
- 提交前 `lint + typecheck + build` 全绿。
- `main` 推送触发部署；是否推送、何时推送由用户决定。

## 7. 维护约定

本文件随开发演进：

- **何时更新**：技术栈/依赖变化；新增红线或约定；踩坑经验（"会再次遇到且容易忘"的才记）。
- **怎么写**：一句话一条，删掉过时内容；禁止堆砌长篇说明。
- **谁更新**：每次修改同代码一样走用户评审后提交；事实类变化先改 manifest，规则类变化改本文件。
