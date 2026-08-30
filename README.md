# NKDShinKu Blog

二次元风格的现代个人技术博客。记录文章、教程、实验室/个人项目、日常与追番。

技术栈与选型理由见 [docs/project-manifest.md](docs/project-manifest.md)；协作规则见 [AGENTS.md](AGENTS.md)。

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
├── docs/                # 项目文档（见下方索引）
├── public/              # 静态资源（.nojekyll、robots 等）
└── src/
    ├── app/             # App Router（layout / 首页 / 404 / 全局样式与 token）
    ├── components/      # layout/ 全局布局；ui/ 自研原语；feature/ 业务组件
    └── lib/             # 站点配置等纯逻辑
```

## 文档索引

| 文档 | 内容 |
|------|------|
| [AGENTS.md](AGENTS.md) | AI 协作规则（红线/约定/git 规则/skills） |
| [docs/project-manifest.md](docs/project-manifest.md) | 项目事实：方案/选型/外部服务/决策/风险/变更记录 |
| [docs/requirements.md](docs/requirements.md) | 需求清单：功能 / 信息架构 / 优先级 / 设计诉求 |
| [docs/roadmap.md](docs/roadmap.md) | 里程碑进度 |
| [docs/ops/deploy-checklist.md](docs/ops/deploy-checklist.md) | 部署运维步骤 |
| [docs/archive/design-system-old/](docs/archive/design-system-old/) | 旧设计系统归档（Soft ACG Fusion，仅参考） |
| [content/README.md](content/README.md) | 内容编写约定：目录结构 / frontmatter / 项目数据模型 |

## 许可

个人项目，内容版权归作者所有。
