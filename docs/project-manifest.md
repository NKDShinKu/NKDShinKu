# 项目清单（Project Manifest）

> 本项目「事实」的唯一记录点：方案、技术选型、外部服务、决策、风险与变更记录。
> 规则类见 `AGENTS.md`；需求见 `docs/requirements.md`；进度见 `docs/roadmap.md`；部署步骤见 `docs/ops/deploy-checklist.md`。
> 任何事实变化时，就地修改本文件并在文末「变更记录」追加一行。

## 1. 项目概况

- 定位：二次元风格的现代个人技术博客；蓝白基调，排版/配色/微透视/交互优先，二次元素材克制使用。
- 内容板块：文章（含教程/笔记/日常分类）、实验室（外链项目 + 站内 demo/工具/实验，见 D15）、追番（Bangumi）、关于；详见 `docs/requirements.md`。
- 域名：`https://nkdshinku.com`（DNS 托管于 Cloudflare）
- 仓库：`https://github.com/NKDShinKu/NKDShinKu`（public）

## 2. 总体方案

部署链路：Markdown/代码 → Next.js 16 静态导出（`out/`）→ GitHub Actions（lint → typecheck → build → Pagefind 索引 → 上传 artifact）→ GitHub Pages（自定义域名）。

| 决策 | 选型                                                 | 核心理由                                     | 备选 / 退路                                                          |
| ---- | ---------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| 框架 | Next.js 16 App Router，`output: "export"` 全静态 SSG | 与 GH Pages 天然契合、生态成熟、参考仓库同栈 | Astro（更轻量）                                                      |
| 部署 | GH Actions + GH Pages + 自定义域名                   | 仓库 public 免费可用、零成本、全自动         | Cloudflare Pages（同生态、代码零改动可迁，作为国内访问质量差的退路） |
| 图片 | Cloudflare R2 + 自定义域 `img.nkdshinku.com`         | 免费 10GB、无出口费、同生态 CDN              | —                                                                    |
| 搜索 | Pagefind                                             | 纯静态索引、零服务端                         | —                                                                    |
| 评论 | giscus（暂缓，P3 默认不上线）                        | 数据存 GitHub Discussions、零成本            | Waline / Twikoo（需服务端）                                          |
| 订阅 | RSS/Atom + sitemap + robots（构建期生成）            | 静态导出兼容、零服务端                       | —                                                                    |

## 3. 技术选型清单

| 项       | 选型                                          | 说明                                                          | 状态                   |
| -------- | --------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| UI 组件  | **自研**（手写 React 组件 + Tailwind 工具类） | 个人博客不需要带样式组件库；确需无样式原语才引入 Radix        | ✅（shadcn 已弃用）    |
| 样式     | TailwindCSS 4                                 | CSS-first `@theme`，token 集中在 `src/app/globals.css`        | ✅                     |
| 图标     | Iconify（`@iconify/tailwind4` + mdi 图标集）  | 按需生成 CSS、SSG 友好                                        | ✅                     |
| 排版     | @tailwindcss/typography                       | 文章正文 `prose`                                              | ✅                     |
| 动画     | GSAP（+ @gsap/react）                         | 滚动/入场/过渡动画；尊重 prefers-reduced-motion               | ✅（M1 已安装）        |
| 语言     | TypeScript 5.9（strict）                      | 勿升 TS 7（生态兼容未验证）                                   | ✅                     |
| 包管理   | pnpm                                          | lockfile 锁定                                                 | ✅                     |
| 动态数据 | 浏览器端 fetch（Bangumi 等）                  | 静态导出下唯一可行方式；需加载/失败态                         | ✅ 直连实测通过（D14），待 M3 落地 |
| 图床     | Cloudflare R2（bucket `nkdshinku-assets`）    | 自定义域 `img.nkdshinku.com`                                  | ✅ 已建，文章接入待 M4 |
| 评论     | giscus                                        | 前置：开 Discussions + 安装 giscus App                        | ⏳ M3/M4               |
| 内容管线 | unified（remark + rehype）+ gray-matter       | 构建期渲染、零客户端 JS；插件覆盖 GFM/标题锚点/代码高亮       | ⏳ M2                  |
| 语法高亮 | Shiki（rehype-pretty-code）双主题             | 构建期高亮零运行时；亮暗双主题 CSS 变量随 `.dark` class 切换  | ⏳ M2                  |
| 流程图   | mermaid 懒加载（仅含图表页面动态 import）     | 构建零浏览器依赖；退路 rehype-mermaid 构建期渲染              | ⏳ M2                  |
| 站点文件 | sitemap.ts / feed.xml route handler + feed 包 | 构建期生成（实测需显式 force-static）；替代 D9 RSS 预构建脚本 | ⏳ M2                  |

## 4. 设计方向

由 ui-ux-pro-max 裁决（M1 定稿，视觉诉求见 `docs/requirements.md` §7）。

## 5. 外部服务

| 服务          | 资源                                            | 用途                       | 状态     |
| ------------- | ----------------------------------------------- | -------------------------- | -------- |
| GitHub        | `NKDShinKu/NKDShinKu`                           | 代码 + Actions + Pages     | ✅       |
| Cloudflare    | zone `nkdshinku.com`                            | DNS + R2                   | ✅       |
| Cloudflare R2 | bucket `nkdshinku-assets` → `img.nkdshinku.com` | 图床                       | ✅ 已建  |
| Bangumi       | 用户 ID `796189`                                | 追番数据（浏览器端 fetch） | ✅ 直连实测通过（D14），M3 落地 |
| giscus        | 待开 Discussions + 安装 App                     | 评论                       | ⏳ M3/M4 |

## 6. 风险与决策树

### 6.1 风险清单

1. ~~Bangumi API 浏览器直连的 CORS / User-Agent / 限流~~ 已实测排除（2026-09，D14）：ACAO `*`、浏览器 UA 放行、12 并发无限流，走直连分支。
2. GitHub Pages 国内访问质量一般；不可接受则迁移 Cloudflare Pages（代码零改动）。
3. 图床素材版权：插图使用自绘 / AI 生成 / 明确授权素材。

### 6.2 Bangumi 接入决策树（决策 D3）

```
浏览器实测 api.bgm.tv CORS
 ├─ 可用 → 浏览器直连 + 本地缓存（REQ-B1/B6）✅（2026-09 实测走此分支，见 D14）
 └─ 受限 → 方案 B：Cloudflare Worker 代理（补 CORS 头 + 缓存 + 限流保护，保留为退路）
           ├─ Worker 部署在 nkdshinku.com 同 zone（api.nkdshinku.com）
           └─ 失败 → 方案 C：GitHub Actions 定时抓取 → 静态 JSON 随站构建（数据有延迟）
```

## 7. 决策记录

| #   | 决策               | 结论                                                                                                                                                                                                                                                                                                                          | 日期    |
| --- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D1  | 文章与教程组织方式 | 合并为「文章」板块，用分类/标签区分；日常并入文章分类                                                                                                                                                                                                                                                                         | 2026-08 |
| D2  | 项目/日常内容管理  | 项目 = 结构化配置 + 卡片跳转外部（无站内详情页）；日常 = 文章分类（**已被 D15 取代**：实验室新增站内 demo 页）                                                                                                                                                                                                                                                             | 2026-08 |
| D3  | Bangumi 接入       | 浏览器直连 API，CORS 受限时 Cloudflare Worker 代理兜底（§6.2）                                                                                                                                                                                                                                                                | 2026-08 |
| D4  | 内容语言           | 仅中文                                                                                                                                                                                                                                                                                                                        | 2026-08 |
| D5  | 互动功能           | 不设友链页面、不设访问统计；RSS 默认提供；giscus 保留 P3 暂缓                                                                                                                                                                                                                                                                 | 2026-08 |
| D6  | Bangumi 用户 ID    | `796189` 已确认（M3 接入时写入 `site.config`）                                                                                                                                                                                                                                                                                | 2026-08 |
| D7  | 首页追番小部件     | 放；REQ-H5 由 P2 提升为 P1                                                                                                                                                                                                                                                                                                    | 2026-08 |
| D8  | 文章分类           | 「教程/笔记/日常」够用，维持现状                                                                                                                                                                                                                                                                                              | 2026-08 |
| D9  | 借鉴项评审         | 采纳：Mermaid、llms.txt、项目分组+多链接、FAB、复制整页、图标集、站长验证、RSS prebuild 脚本、抽屉式评论形态；互动教程列 P3 灵感；不采纳：教程独立板块、年份编号 slug、外链守卫、error.tsx                                                                                                                                    | 2026-08 |
| D10 | 品牌色彩底对比度   | 按钮／选中态等品牌色彩底**不作 4.5:1 对比度限制**，视觉优先；正文/长文本对比度纪律不变                                                                                                                                                                                                                                        | 2026-08 |
| D11 | 导航形态           | 全宽 sticky 顶栏（常规博客形态，用户决策），弃用浮动玻璃药丸／底部条                                                                                                                                                                                                                                                          | 2026-08 |
| D12 | M2 技术选型        | 管线 unified+gray-matter；高亮 Shiki 双主题；Mermaid 懒加载客户端渲染；RSS/sitemap 改 metadata routes 与静态 route handler（实测可行，替代 D9 的 RSS 预构建脚本项）；摘要取 frontmatter description，阅读时长中文自算                                                                                                         | 2026-09 |
| D13 | M2 UI 细节改版     | 横向列表卡（880px 单列）；新增分类/标签索引页 + 列表页头三入口，分类徽章改「前往」语义无选中态；顶栏 fixed 化（首页首屏透明态，D11 演进）；详情返回键 history.back 兜底 /posts/；页内锚点 replaceState 不进历史栈；Hero 背景图方案多版尝试后移除，回归极光首屏；路由参数 slug 化（分类英文映射、标签覆盖表+拼音，中文仅展示） | 2026-09 |
| D14 | Bangumi 直连实测   | D3 决策树走直连分支：`api.bgm.tv` ACAO `*`、任意 Origin 放行、浏览器 UA 200、12 并发无限流、`limit` 上限 100、默认按 `updated_at` 倒序；UID `796189` 可直接作 API username；Worker 代理保留为退路。数据形态：577 部 = 想看 120 / 看过 389 / 在看 41 / 搁置 17 / 抛弃 10 | 2026-09 |
| D15 | 板块更名「实验室」 | 原「项目」板块推倒重写（用户决策）：更名实验室 Lab、路由 `/lab`，同时收纳外链型（跳仓库/直链）与站内型（`/lab/[slug]` demo/小工具/实验）条目，取代 D2 的「无站内详情页」约束；REQ-J 重构为 REQ-L | 2026-09 |
| D16 | 关于页设计方向     | 「站点事实卡」路线（用户决策）：站名由来/理念/技术栈/站点状态等卡片为主体，REQ-A1 个人内容收敛为紧凑区块；个性化记忆点在卡片文案与小组件，非个人档案墙 | 2026-09 |
| D17 | 外链确认弹窗       | 用户决策（翻 D9「外链守卫不采纳」案）：实验室外链跳转前弹确认框；实现引入 `@radix-ui/react-dialog` 无样式原语 + 设计 token 自研样式（§3 例外条款适用），T5 搜索弹窗复用同一原语 | 2026-09 |

## 8. 变更记录

| 日期    | 变更                                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| 2026-08 | 清理旧 Vue 尝试，改用 Next.js 静态导出方案                                                                              |
| 2026-08 | 移除 shadcn/ui，UI 全部自研（仅按需 Radix 原语）                                                                        |
| 2026-08 | 确立「commit 前用户评审」规则                                                                                           |
| 2026-08 | 安装 16 个 skills（设计五件套 + GSAP×8 + blog-write + git-commit + vercel-react-best-practices）                        |
| 2026-08 | 域名 A 记录×4 生效，DNS 验证通过；HTTPS 证书签发中                                                                      |
| 2026-08 | 文档重构：分层单一事实来源（本清单建立，替代旧方案评估文档）                                                            |
| 2026-08 | 需求分析完成：建立 `docs/requirements.md`，关键决策经用户确认（D1–D9）                                                  |
| 2026-08 | roadmap 调整：已完成详录，未来里程碑只记方向                                                                            |
| 2026-08 | 文档职责再拆分：requirements 只留需求，决策/风险/外部集成并入本清单；旧设计归档移入 archive                             |
| 2026-08 | 决策 D10：品牌色彩底（按钮/选中态）视觉优先，不做对比度限制                                                             |
| 2026-08 | 安装 GSAP + @gsap/react；全局背景对齐预览稿（blob morph + 萤火粒子）                                                    |
| 2026-08 | 决策 D11：导航改全宽 sticky 顶栏；首页精简（去 CTA 按钮与关于卡）                                                       |
| 2026-08 | 页头导航去「首页」（logo 返回）；页脚板块链接改社交入口（GitHub/邮箱/Bangumi/QQ）；首页加最新文章占位                   |
| 2026-09 | HTTPS 证书签发完成（闭环 2026-08「签发中」记录）                                                                        |
| 2026-09 | M2 阶段 0 选型定稿（D12）：内容管线 / 高亮 / Mermaid / 站点文件；实测 sitemap.ts 静态导出需显式 force-static            |
| 2026-09 | M2 内容层完成（管线 / 列表详情 / 分类标签归档 / Mermaid / RSS·sitemap）+ UI 细节改版定稿（D13），移动端与无障碍走查通过 |
| 2026-09 | M3 阶段 0 spike：Bangumi API 从生产源浏览器直连实测通过（CORS/UA/限流/分页/排序），D3 决策树锁定直连分支，记为 D14 |
| 2026-09 | M3 需求重构：项目板块更名实验室（D15，REQ-J→REQ-L，站内 demo 页入 IA）；关于页定站点事实卡方向（D16）；搜索弃独立页改页头入口 + 全局弹窗（REQ-S 重写）；追番页调研/设计/落地排至 M3 末尾 |
| 2026-09 | M3 实验室走查修订：条目卡紧凑等大（弃封面占位与 featured 跨列）、外链改显式图标按钮 + 确认弹窗（D17，引入 Radix Dialog） |
| 2026-09 | M3 首批落地完成（实验室/关于页/搜索弹窗）并整体走查：对比度数值审计 74 项，补 sakura/twilight 浅色底文字级深变体 token；搜索索引经 data-pagefind-body 收敛至文章正文 |
