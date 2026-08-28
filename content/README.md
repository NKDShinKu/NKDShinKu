# content/ —— 站点内容目录

内容层（文章、项目等）在路线图 M2 阶段实现。届时约定：

## 规划中的目录结构

```
content/
├── posts/          # 博客文章（Markdown + frontmatter）
│   └── 2026/
│       └── hello-world.md
└── projects/       # 实验室 / 项目条目
```

## 规划中的 frontmatter 约定（草案，M2 定稿）

```yaml
---
title: 文章标题
description: 摘要
date: 2026-08-01
updated: 2026-08-02
tags: [nextjs, 教程]
category: 文章 | 教程 | 日常 | 实验室
cover: https://static.nkdshinku.com/images/xxx.webp # 图床走 Cloudflare R2
draft: false
---
```

## 图片约定

- 文章配图统一上传 Cloudflare R2（自定义域 `static.nkdshinku.com`，见 docs/部署清单.md）
- 静态导出下 next/image 为 unoptimized 模式，直接引用 R2 公网 URL 并显式声明宽高
