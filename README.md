# NKDShinKu Blog

二次元风格的现代个人技术博客（建设中）。记录文章、教程、实验室/个人项目、日常与追番。

## 技术栈

- **框架**：Next.js 16（App Router，`output: "export"` 全静态导出 SSG）
- **样式**：TailwindCSS 4 + @tailwindcss/typography；UI 组件全部自研（按需 Radix 原语）
- **图标**：Iconify（`@iconify/tailwind4`）
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
├── .github/workflows/   # CI：lint → typecheck → build → Pagefind → 部署
├── content/             # 站点内容（M2 启用，约定见 content/README.md）
├── public/              # 静态资源（.nojekyll、robots 等）
└── src/
    ├── app/             # App Router（layout / 首页 / 404 / 全局样式与 token）
    ├── components/      # layout/ 全局布局；ui/ 自研原语；feature/ 业务组件
    └── lib/             # 站点配置等纯逻辑
```

## 开发文档

- `AGENTS.md` —— AI 协作约定（事实来源），开始任何开发前先读
- `content/README.md` —— 内容目录与 frontmatter 约定（M2 启用）
- `docs/` —— 方案评估、部署清单、路线图、设计参考（其中 博客项目背景.md 为本地提示词，不入库）

## 许可

个人项目，内容版权归作者所有。
