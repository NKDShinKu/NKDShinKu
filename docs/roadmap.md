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

## M1 设计定稿 ⏳

方向：确定视觉方向（蓝白 ACG 基底），定稿设计 token 并落地，重做首页与全局布局，
接入暗色模式与动画规范（GSAP）。

## M2 内容层 ⏳

方向：Markdown 内容管线、博客列表/详情页、RSS/sitemap、示例文章。

## M3 功能模块 ⏳

方向：项目页、追番页（Bangumi）、搜索 UI、关于页、评论（giscus）。

## M4 上线 🔨

方向：部署收尾（HTTPS 证书 + 验证）、R2 图床接入、性能与移动端走查、正式发布。

## M5 迭代 ⏳

方向：动画细节打磨、访问统计、内容持续更新；视国内访问质量评估迁移 Cloudflare Pages。
