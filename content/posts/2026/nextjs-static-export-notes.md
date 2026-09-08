---
title: Next.js 16 静态导出的五个坑
description: force-static 必须显式声明、trailingSlash 与 GitHub Pages、Pagefind 只索引构建产物、.next 陈旧类型、pnpm store 漂移——建站实录踩坑合集。
date: 2026-09-01
category: 笔记
tags:
  - Next.js
  - 静态导出
  - 踩坑
keywords:
  - Next.js
  - 静态导出
  - GitHub Pages
---

把博客从「能跑」带到「能上线」，我在 Next.js 16 静态导出上踩了五个印象深刻的坑。这里逐个记录，给同样想做纯静态博客的人避雷。

## 1. `sitemap.ts` 也必须显式 force-static

官方文档说静态导出下 Route Handler 只支持 GET、需显式标记：

```ts
export const dynamic = "force-static";

export async function GET() {
  return Response.json({ name: "Lee" });
}
```

但文档**没有明说** `sitemap.ts` / `robots.ts` 这类 metadata routes 也要同样处理。实测不写就构建直接报错：

```text
Error: export const dynamic = "force-static"/export const revalidate
not configured on route "/sitemap.xml" with "output: export"
```

结论：静态导出项目里，所有 route handler 一律带 `force-static`，别信默认行为。

## 2. `trailingSlash: true` 是 GitHub Pages 无扩展名 URL 的前提

GitHub Pages 的静态文件形态是 `posts/index.html`。不开启 trailingSlash 时，`/posts` 这种无扩展名访问会 404。开启后 Next 会把链接导出成 `/posts/` 形式，正好命中目录下的 `index.html`。

> 一旦上线就不要改回 `false`，否则全站外链都会断。

## 3. Pagefind 只索引构建产物

本地跑 `pnpm build:search` 时索引的是 `out/` 目录，不是源码。新增页面后必须：

```bash
pnpm build && pnpm build:search
```

顺序不能反，索引的是上一次构建的产物就会漏页。

## 4. 删路由后 typecheck 假报错

删除或重命名 `app/` 下的路由文件后，`pnpm typecheck` 可能报：

```text
error TS2307: Cannot find module '../../src/app/feed.xml/route.js'
```

其实是 `.next/types/validator.ts` 里残留的陈旧生成类型在引用已删除的文件。清掉缓存重跑即可：

```bash
rm -rf .next && pnpm typecheck
```

## 5. pnpm 的 store 会漂移

某天 `pnpm install` 突然报 `ERR_PNPM_UNEXPECTED_STORE`，原因是 `node_modules` 与 store 的链接位置漂移了（本地 `.pnpm-store` 和全局 store 之间）。跑一次 `pnpm install` 重新链接就好。

另外 pnpm 11 的项目配置在 `pnpm-workspace.yaml`，**不在** package.json 的 `pnpm` 字段——找配置文件时别翻错地方。

## 小结

| 坑 | 一句话解法                |
| -- | ------------------------- |
| force-static     | route handler 全部显式声明 |
| trailingSlash    | 上线后永远别改回 false     |
| Pagefind         | 先 build 再 build:search   |
| .next 陈旧类型   | `rm -rf .next` 重跑        |
| store 漂移       | 重跑 `pnpm install`        |

静态导出看似简单，但每个「默认行为」背后都藏着一个「必须显式」——记住这条原则，能少踩一大半坑。
