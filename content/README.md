# content/ —— 站点内容目录

内容层（文章、项目）在路线图 M2 阶段实现。本文档约定**内容怎么组织与编写**。

## 1. 目录结构

```
content/
├── posts/            # 文章（含教程/笔记/日常，文件名即 slug）
│   └── 2026-08-01-hello-world.md
└── projects.ts       # 项目结构化配置
```

- 文章用 **Markdown + frontmatter**，统一经 `src/lib/` 加载与渲染（构建期，服务端组件）。
- 分类初始集合：`教程` / `笔记` / `日常`（可扩展；枚举收敛在 `site.config` 或 lib 常量中）。
- 标签自由填写，列表页自动聚合。

## 2. 文章 frontmatter 字段

| 字段          | 必填 | 说明                                                        |
| ------------- | ---- | ----------------------------------------------------------- |
| `title`       | ✅   | 标题                                                        |
| `description` | ✅   | 摘要；同时作 meta description                               |
| `date`        | ✅   | 发布日期（ISO）                                             |
| `updated`     | 可选 | 最后更新日期                                                |
| `category`    | ✅   | 教程 / 笔记 / 日常                                          |
| `tags`        | 可选 | 标签数组                                                    |
| `keywords`    | 可选 | SEO 关键词（meta keywords）                                 |
| `cover`       | 可选 | 封面图（R2 绝对 URL，`img.nkdshinku.com/images/posts/...`） |
| `pinned`      | 可选 | 置顶（首页优先展示）                                        |
| `draft`       | 可选 | 草稿（构建忽略）                                            |
| `series`      | 可选 | 系列名（预留）                                              |

## 3. 项目数据模型（`projects.ts`）

> 分组 + 多链接模型：按主题分组、每个项目多个 `{label, href}` 链接。

```ts
interface ProjectGroup {
  title: string; // 分组标题（如「AI 与 Agent」）
  description?: string;
  projects: Project[];
}

interface Project {
  slug: string; // 唯一标识
  name: string; // 项目名
  tagline: string; // 一句话简介
  description: string; // 卡片描述
  tech: string[]; // 技术栈标签
  links: { label: string; href: string }[]; // 多链接跳转（GitHub / 在线访问 / 视频…，至少一个）
  cover?: string; // 封面（R2）
  status: "active" | "archived" | "planned"; // 维护中 / 归档 / 构思
  featured?: boolean; // 精选
}
```

## 4. 图片与发布流程

- 图片统一走 R2 图床（自定义域）；本地预览允许相对路径占位。
- 素材版权：自绘 / AI 生成 / 明确授权（见 `docs/project-manifest.md` 风险清单）。
- 发布流程：写 Markdown → `pnpm dev` 本地预览 → 变更交用户评审 → commit（lint/typecheck/build 全绿）→ 用户 push → CI 部署。
