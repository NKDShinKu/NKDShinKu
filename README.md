# NKDShinKu Blog

二次元风格的现代个人技术博客（建设中）。记录文章、教程、实验室/个人项目、日常与追番。

## 技术栈

- **框架**：Next.js 16（App Router，`output: "export"` 全静态导出 SSG）
- **样式**：TailwindCSS 4 + shadcn/ui + @tailwindcss/typography
- **图标**：Iconify（`@iconify/tailwind4`，类名方式使用）
- **部署**：GitHub Actions → GitHub Pages（自定义域名 `nkdshinku.com`）
- **搜索**：Pagefind（构建后生成索引）
- **图床**：Cloudflare R2（后续接入）
- **评论**：giscus（后续接入，暂缓）
- **动画**：GSAP（后续设计/动画阶段接入）

## 快速开始

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地开发（Turbopack）
pnpm build          # 静态导出构建 → out/
pnpm preview        # 本地预览构建产物
pnpm build:search   # 生成 Pagefind 索引
pnpm lint           # ESLint 检查
pnpm typecheck      # TypeScript 检查
pnpm format         # Prettier 格式化
```

## 目录结构

```
├── .github/workflows/   # CI：构建 + Pagefind + 部署到 Pages
├── content/             # 站点内容（M2 阶段启用，约定见 content/README.md）
├── docs/                # 方案评估、部署清单、路线图、设计参考
├── design-system-old/   # 旧设计系统（设计阶段参考）
├── public/              # 静态资源（.nojekyll、robots 等）
└── src/
    ├── app/             # App Router（layout / 首页 / 404 / 全局样式）
    ├── components/      # layout/ 通用布局；ui/ shadcn 组件
    └── lib/             # 站点配置等纯函数工具
```

## 文档索引

- [博客方案评估](docs/博客方案评估.md) —— 技术方案逐项评估与风险
- [部署清单](docs/部署清单.md) —— 上线前需要手工完成的平台配置
- [路线图](docs/路线图.md) —— 里程碑规划（M0–M5）
- [项目背景](docs/博客项目背景.md) —— 最初的需求文档
- [开发约定](AGENTS.md) —— AI 协作 / vibe coding 约定

## 许可

个人项目，内容版权归作者所有。
