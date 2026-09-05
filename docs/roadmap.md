# 路线图

> 里程碑规划与状态。**已完成的内容详细记录；未来的里程碑只写方向，开工时再展开细项。**
> 状态图例：✅ 完成 / 🔨 进行中 / ⏳ 未开始

## M0 项目框架 ✅

- [x] 方案调研与评估（已并入 docs/project-manifest.md）
- [x] 旧 Vue 尝试清理并提交，保留 git 历史
- [x] Next.js 16 + TypeScript + Tailwind 4 骨架
- [x] 静态导出配置（trailingSlash / unoptimized images / .nojekyll）
- [x] 首页占位 + 404 + 页头/页脚骨架
- [x] GitHub Actions 部署流水线（build + Pagefind + deploy-pages）
- [x] 开发约定与文档体系（分层单一事实来源）
- [x] 本地验证：`pnpm build` / `lint` / `typecheck` / `build:search` 全绿
- [x] 16 个 skills 安装就位（含 vercel-react-best-practices）
- [x] 推送 main、GitHub Pages 部署上线（http 已通）
- [x] 文档两轮规整：project-manifest 单一事实清单、未来计划方向化

## M1 设计定稿 ✅

- [x] 设计系统定稿 `docs/design-system.md`（Soft ACG Fusion：玻璃态 × 极光 × 动效）
- [x] 设计 token 落地 `globals.css`（色彩/字号阶梯/圆角/阴影/缓动/动画），UI 原语 Button / Card / Tag
- [x] 全局布局重做：全宽 sticky 顶栏（D11）+ 移动端汉堡菜单 + 页脚社交入口 + skip link
- [x] 暗色模式（REQ-G2）：无闪烁内联脚本（`<head>` + 绘制保底）+ 跟随系统/亮/暗三态切换器
- [x] 全局背景：极光光斑（形状静态化，仅 transform 漂移）+ 萤火粒子（DPR 适配、后台暂停）
- [x] 新首页：hero + 最新文章占位 + Bento 板块入口（sections 收敛 site.config 单一来源）
- [x] GSAP 动效层：动态加载不阻塞首屏可交互；prefers-reduced-motion 全守卫
- [x] 移动端修复：webview 闪屏（渐进渲染时序）与首屏 JS 减重
- [x] 设计走查（web-design-guidelines + 设计文档 §8 清单）与文档同步

## M2 内容层 ✅

- [x] 技术选型定稿（D12）与内容管线：unified + gray-matter 构建期渲染；frontmatter 校验、中文阅读时长、置顶排序、draft 过滤、标签 slug
- [x] 文章列表页：横向列表卡、分类徽章（前往语义）、分页路由；分类/标签索引页；归档时间线
- [x] 文章详情页：prose 排版、Shiki 双主题代码高亮 + 复制按钮、TOC scrollspy（锚点不进历史栈）、Mermaid 懒加载、Article 结构化数据、返回键
- [x] 站点文件：RSS（feed.xml）、sitemap、robots 补 Sitemap 行；Pagefind 索引验证（23 页入库）
- [x] UI 细节改版（D13）：极光全屏首屏（背景图方案移除）、顶栏 fixed 化（首页透明态）、横向列表卡、移动端与无障碍走查
- [x] 示例文章 4 篇上线（建站随笔 / 静态导出笔记 / Tailwind 教程 / 发布流水线）；首页接入最新文章

## M3 功能模块 🔨

- [x] 实验室板块（D15）：数据层（`content/lab.ts` 校验/聚合/排序）、列表页（type 分组 Bento、紧凑等大卡、外链确认弹窗 D17）、站内实验页壳 + 首个 demo「今日运势」
- [x] 关于页（D16）：站点事实卡路线——问候面板 + 7 张彩色节奏事实卡，字数/站点状态构建期派生
- [x] 搜索弹窗（REQ-S 重写）：页头入口 + Ctrl/Cmd+K + Pagefind 懒加载即时检索；索引经 `data-pagefind-body` 收敛至文章正文
- [x] 阶段走查：对比度数值审计（74 项，两页两态）——补 sakura/twilight 深变体 token、搜索弹窗 ARIA 修正；375/1280 无横向溢出；focus trap / Esc 焦点归还 / reduced-motion 验证通过
- [ ] 追番页（Bangumi，D14 直连已实测）：需求待改且繁杂，设计 + 落地排至本阶段最后
- [ ] 首页追番小部件（REQ-H5，依赖追番数据层）
- [ ] giscus 评论（P3，默认不上线，启用需用户确认）

## M4 上线 ⏳

方向：部署收尾（HTTPS 证书 + 验证）、R2 图床接入、性能与移动端走查、正式发布。

## M5 迭代 ⏳

方向：动画细节打磨、访问统计、内容持续更新；视国内访问质量评估迁移 Cloudflare Pages。
