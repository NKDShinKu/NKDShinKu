# content/ —— 站点内容目录

内容层（文章、实验室）在路线图 M2/M3 阶段实现。本文档约定**内容怎么组织与编写**。

## 1. 目录结构

```
content/
├── posts/            # 文章（含教程/笔记/日常，文件名即 slug）
│   └── 2026-08-01-hello-world.md
└── lab.ts            # 实验室条目结构化配置（外链项目 + 站内 demo）
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
| `tags`        | 可选 | 标签数组，自由填写（中文为主）；路由 slug 自动生成——登记标签用 `src/lib/posts.ts` 覆盖表，其余转无声调拼音 |
| `keywords`    | 可选 | SEO 关键词（meta keywords）                                 |
| `cover`       | 可选 | 封面图（R2 绝对 URL，`img.nkdshinku.com/images/posts/...`） |
| `pinned`      | 可选 | 置顶（首页优先展示）                                        |
| `draft`       | 可选 | 草稿（构建忽略）                                            |
| `series`      | 可选 | 系列名（预留）                                              |

## 3. 实验室数据模型（`lab.ts`）

> 2026-09 重构（D15）：原 `projects.ts` 模型取代。两类形态——**外链型**（跳仓库/直链）与**站内型**（`/lab/[slug]` 可直接体验的 demo/小工具）。站内 demo 的页面实现是代码（`src/`），这里只登记条目元数据。

```ts
interface LabItem {
  slug: string; // ASCII，唯一；站内型即路由 /lab/[slug]
  name: string; // 条目名
  tagline: string; // 一句话简介
  type: "project" | "tool" | "experiment"; // 类型徽章，用于分组展示
  tech: string[]; // 技术栈标签
  status: "active" | "archived" | "planned"; // 维护中 / 归档 / 构思
  featured?: boolean; // 置顶
  cover?: string; // 封面（R2）
  kind: "external" | "internal";
  links: { label: string; href: string }[]; // 外链型必填（GitHub / 在线访问 / 视频…至少一个）；站内型可留空
}
```

- `kind: "internal"` 的条目必须有对应的 `/lab/[slug]` 静态路由实现（`generateStaticParams` 派生自此配置）。
- 分组展示按 `type` 聚合（如「项目 / 小工具 / 实验」），`featured` 置顶。

## 4. 图片与发布流程

- 图片统一走 R2 图床（自定义域）；本地预览允许相对路径占位。
- 素材版权：自绘 / AI 生成 / 明确授权（见 `docs/project-manifest.md` 风险清单）。
- 发布流程：写 Markdown → `pnpm dev` 本地预览 → 变更交用户评审 → commit（lint/typecheck/build 全绿）→ 用户 push → CI 部署。
