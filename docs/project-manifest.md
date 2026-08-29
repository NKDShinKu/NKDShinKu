# 项目清单（Project Manifest）

> 本项目"事实"的唯一记录点：方案、技术选型、设计方向、外部服务、风险与变更记录。
> 规则类内容见 `AGENTS.md`，进度见 `docs/roadmap.md`，部署步骤见 `docs/ops/deploy-checklist.md`。
> 任何事实发生变化时，就地修改本文件并在文末"变更记录"追加一行。

## 1. 项目概况

- 定位：二次元风格的现代个人技术博客；蓝白基调，排版/配色/微透视/交互优先，二次元素材克制使用。
- 内容板块：文章/教程、实验室/项目、日常、二次元/追番（Bangumi）。
- 域名：`https://nkdshinku.com`（DNS 托管于 Cloudflare）
- 仓库：`https://github.com/NKDShinKu/NKDShinKu`（public）

## 2. 总体方案

部署链路：Markdown/代码 → Next.js 16 静态导出（`out/`）→ GitHub Actions
（lint → typecheck → build → Pagefind 索引 → 上传 artifact）→ GitHub Pages（自定义域名）。

| 决策 | 选型                                                 | 核心理由                                     | 备选 / 退路                                                          |
| ---- | ---------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| 框架 | Next.js 16 App Router，`output: "export"` 全静态 SSG | 与 GH Pages 天然契合、生态成熟、参考仓库同栈 | Astro（更轻量）                                                      |
| 部署 | GH Actions + GH Pages + 自定义域名                   | 仓库 public 免费可用、零成本、全自动         | Cloudflare Pages（同生态、代码零改动可迁，作为国内访问质量差的退路） |
| 图片 | Cloudflare R2 + 自定义域 `img.nkdshinku.com`         | 免费 10GB、无出口费、同生态 CDN              | —                                                                    |
| 搜索 | Pagefind                                             | 纯静态索引、零服务端                         | —                                                                    |
| 评论 | giscus（暂缓）                                       | 数据存 GitHub Discussions、零成本            | Waline / Twikoo（需服务端）                                          |

## 3. 技术选型清单

| 项       | 选型                                          | 说明                                                               | 状态                   |
| -------- | --------------------------------------------- | ------------------------------------------------------------------ | ---------------------- |
| UI 组件  | **自研**（手写 React 组件 + Tailwind 工具类） | 个人博客不需要带样式组件库；确需无样式原语才引入 Radix             | ✅（shadcn 已弃用）    |
| 样式     | TailwindCSS 4                                 | CSS-first `@theme`，token 集中在 `src/app/globals.css`             | ✅                     |
| 图标     | Iconify（`@iconify/tailwind4` + mdi 图标集）  | 按需生成 CSS、SSG 友好                                             | ✅                     |
| 排版     | @tailwindcss/typography                       | 文章正文 `prose`                                                   | ✅                     |
| 动画     | GSAP                                          | 滚动/入场动画；只用 transform/opacity，尊重 prefers-reduced-motion | ⏳ M1 后按需安装       |
| 语言     | TypeScript 5.9（strict）                      | 勿升 TS 7（生态兼容未验证）                                        | ✅                     |
| 包管理   | pnpm                                          | lockfile 锁定                                                      | ✅                     |
| 动态数据 | 浏览器端 fetch（Bangumi 等）                  | 静态导出下唯一可行方式；需加载/失败态                              | ⏳ M3                  |
| 图床     | Cloudflare R2（bucket `nkdshinku-assets`）    | 自定义域 `img.nkdshinku.com`                                       | ✅ 已建，文章接入待 M4 |
| 评论     | giscus                                        | 前置：开 Discussions + 安装 giscus App                             | ⏳ M3/M4               |

## 4. 设计方向

由 ui-ux-pro-max 裁决

## 5. 外部服务

| 服务          | 资源                                            | 用途                                  | 状态     |
| ------------- | ----------------------------------------------- | ------------------------------------- | -------- |
| GitHub        | `NKDShinKu/NKDShinKu`                           | 代码 + Actions + Pages                | ✅       |
| Cloudflare    | zone `nkdshinku.com`                            | DNS + R2                              | ✅       |
| Cloudflare R2 | bucket `nkdshinku-assets` → `img.nkdshinku.com` | 图床                                  | ✅ 已建  |
| Bangumi       | 待获取用户 ID                                   | 追番数据（浏览器端 fetch，CORS 待测） | ⏳ M3    |
| giscus        | 待开 Discussions + 安装 App                     | 评论                                  | ⏳ M3/M4 |

## 6. 风险与待验证项

1. Bangumi API 浏览器端跨域（CORS）需实测；受限则改构建期抓取或 Cloudflare Worker 代理。
2. GitHub Pages 国内访问质量一般；不可接受则迁移 Cloudflare Pages（代码零改动）。
3. 图床素材版权：插图使用自绘 / AI 生成 / 明确授权素材。

## 7. 变更记录

| 日期    | 变更                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------ |
| 2026-08 | 清理旧 Vue 尝试，改用 Next.js 静态导出方案                                                       |
| 2026-08 | 移除 shadcn/ui，UI 全部自研（仅按需 Radix 原语）                                                 |
| 2026-08 | docs 入库（`docs/博客项目背景.md` 除外，本地提示词）                                             |
| 2026-08 | 确立"commit 前用户评审"规则                                                                      |
| 2026-08 | 安装 16 个 skills（设计五件套 + GSAP×8 + blog-write + git-commit + vercel-react-best-practices） |
| 2026-08 | 域名 A 记录×4 生效，DNS 验证通过；HTTPS 证书签发中                                               |
| 2026-08 | 文档重构：分层单一事实来源（本清单建立，替代旧方案评估文档）                                     |
| 2026-08 | 删除黏土质感与滚动叙事参考文档，视觉风格 M1 再定调                                               |
| 2026-08 | roadmap 调整：已完成详录，未来里程碑只记方向                                                     |
