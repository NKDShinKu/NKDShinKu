# content/ —— 站点内容目录

文章、实验室两大板块的内容组织与编写约定（板块已上线）。**AI 协作写内容时以本文档为操作手册。**

## 1. 目录结构

```
content/
├── posts/            # 文章（含技术/笔记/日常，按年分子目录，D19）
│   └── 2026/
│       └── hello-world.md
└── lab.ts            # 实验室条目结构化配置（外链项目 + 站内 demo）
```

- 文章用 **Markdown + frontmatter**，统一经 `src/lib/` 加载与渲染（构建期，服务端组件）。
- **文件名（去扩展名）即 slug，全局唯一**（跨年份目录不可重名，构建期校验）；排序依据 frontmatter `date`，与文件名无关，不使用日期/序号前缀（D9）。
- **slug 一律 ASCII**（英文/数字/连字符，如 `my-post.md`；中文文件名会导致静态导出路由 500/404，见 AGENTS §7）。
- 分类初始集合：`技术` / `笔记` / `日常`（D20 起教程并入技术；可扩展，枚举收敛在 posts.ts）。
- 标签自由填写，列表页自动聚合。

## 2. 文章 frontmatter 字段

| 字段          | 必填 | 说明                                                                                                       |
| ------------- | ---- | ---------------------------------------------------------------------------------------------------------- |
| `title`       | ✅   | 标题                                                                                                       |
| `description` | ✅   | 摘要；同时作 meta description                                                                              |
| `date`        | ✅   | 发布日期（ISO）                                                                                            |
| `updated`     | 可选 | 最后更新日期                                                                                               |
| `category`    | ✅   | 技术 / 笔记 / 日常                                                                                         |
| `tags`        | 可选 | 标签数组，自由填写（中文为主）；路由 slug 自动生成——登记标签用 `src/lib/posts.ts` 覆盖表，其余转无声调拼音 |
| `keywords`    | 可选 | SEO 关键词（meta keywords）                                                                                |
| `cover`       | 可选 | 封面图（R2 绝对 URL，`img.nkdshinku.com/images/posts/...`）；不填则卡片走紧凑形态                          |
| `pinned`      | 可选 | 置顶（首页优先展示）                                                                                       |
| `draft`       | 可选 | 草稿（`draft: true` 构建期忽略——写一半先藏起来）                                                           |
| `series`      | 可选 | 系列名（预留）                                                                                             |

## 3. 实验室（`lab.ts`）

> 2026-09 重构（D15）。两类形态——**外链型**（跳仓库/直链）与**站内型**（`/lab/[slug]` 可直接体验的 demo/小工具）。

**外链型：只改 `content/lab.ts` 一处。** 在 `LAB_ITEMS` 数组登记一条即完成，卡片自动按 `type` 分组展示（`featured: true` 置顶）：

```ts
interface LabItem {
  slug: string; // ASCII，唯一；站内型即路由 /lab/[slug]
  name: string; // 条目名
  tagline: string; // 一句话简介
  type: "project" | "tool" | "experiment"; // 类型徽章，用于分组展示
  tech: string[]; // 技术栈标签
  status: "active" | "completed" | "archived" | "planned"; // 维护中 / 已完成 / 归档 / 构思
  featured?: boolean; // 置顶
  cover?: string; // 封面（R2）
  kind: "external" | "internal";
  links: { label: string; href: string }[]; // 外链型必填（GitHub / 在线访问 / 视频…至少一个）；站内型可留空
}
```

**站内型：三步，缺一不可。**

1. `content/lab.ts` 登记条目（`kind: "internal"`，`links` 可留空）；
2. 建 demo 组件 `src/components/lab/demos/<slug>.tsx`（交互任意，参考现有 `fortune-draw.tsx`）；
3. `src/components/lab/demos/registry.ts` 登记一行映射（`"<slug>": 组件`）。

路由 `/lab/[slug]` 由 `generateStaticParams` 派生自配置，自动生成；已登记但组件未写的条目页只渲染说明区、不报错。

## 4. 图片与发布流程

**图片统一走 R2 图床**（自定义域 `img.nkdshinku.com`，桶 `nkdshinku-assets`）；本地预览允许相对路径占位。

- **上传**（rclone 已配置 remote `r2`；AI 可直接代跑，用户也可在 Cloudflare 面板拖拽）：

  ```bash
  # 文章封面（源文件在 assets/covers/，由 scripts/generate-covers.mjs 生成）
  rclone copy assets/covers r2:nkdshinku-assets/images/posts
  # 单张图片 / 其他目录：/images/posts/（文章）、/images/projects/（实验室）
  rclone copyto 图片.png r2:nkdshinku-assets/images/posts/图片.png
  ```

- 封面 URL 规则：`https://img.nkdshinku.com/images/posts/<slug>.webp`（与文件名同名；由 `pnpm generate:covers` 生成 960×600 WebP，源文件在 `assets/covers/`）。
- **正文插图按文章建子目录**：`images/posts/<slug>/xxx.png`（如 `images/posts/my-post/shot-01.png`）——单篇文章的图集中存放、互不冲突，文章废弃时整目录删除。**文章无图就不建目录**（R2 目录随文件自然存在，不预创建空目录）。
- **图床管理**：`rclone lsl r2:nkdshinku-assets` 列出全部（含大小/时间）；`rclone deletefile` 删单个、`rclone purge` 删整目录（慎用）；也可用 Cloudflare 面板（R2 → 桶 → 对象）图形化浏览/删除。删除前确认无引用（frontmatter `cover` 或正文 `![]()`），否则线上破图；已删图片的 CDN 缓存副本最长残留 4 小时。
- **换图就换文件名**：R2 缓存 `max-age=14400`（4 小时），同名覆盖后旧图最长 4 小时才刷新，新名字即时生效。
- **正文插图**：Markdown `![alt](https://img.nkdshinku.com/images/...)`；**alt 必填**（构建期缺失告警，装饰图 `alt=""`）；懒加载（`lazy`/`async`）由渲染管线自动注入，无需手写。
- **素材版权**：自绘 / AI 生成 / 明确授权（见 `docs/project-manifest.md` 风险清单），不取未授权网图。

**发布流程**：写 Markdown → `pnpm dev` 本地预览 → 变更交用户评审 → commit（`lint + typecheck + build` 全绿）→ 用户 push → CI 部署。

**发布自动化（零手动站点操作）**：push 后 CI 自动构建并部署，同时自动更新——搜索索引（Pagefind）、RSS（`/feed.xml`）、sitemap、llms.txt；文章页 giscus 评论区自动就位（首个访客评论时 GitHub Discussions 自动建帖，作者只需在 GitHub 回复）。
