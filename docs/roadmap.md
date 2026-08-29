# 路线图

> 里程碑规划与状态。每完成一个里程碑更新本文件并提交。
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
- [x] 15 个 skills 安装就位
- [x] 推送 main、GitHub Pages 部署上线（http 已通）
- [x] 文档重构：project-manifest 单一事实清单 + 分层结构

## M1 设计定稿 ⏳

- [ ] 用 ui-ux-pro-max 确定视觉方向（蓝白 ACG 基底；黏土质感 / 滚动叙事是否采用）
- [ ] 设计 token 定稿（色彩/字体/圆角/阴影/动效），落库 `docs/design/` 并同步 globals.css
- [ ] 首页真实设计（Hero、板块入口、Bento 或滚动叙事布局）
- [ ] 页头/页脚真实设计 + 移动端导航
- [ ] 安装 GSAP 并建立动画规范（transform/opacity、prefers-reduced-motion）
- [ ] 暗色模式 + 主题切换器
- [ ] web-design-guidelines 规范审查 + ui-animation 润色

## M2 内容层 ⏳

- [ ] Markdown 内容管线（frontmatter 解析、代码高亮）
- [ ] 博客列表页 `/blog/`（分页、标签分类：文章/教程/日常/实验室）
- [ ] 文章详情页 `/blog/[slug]/`（prose 排版、TOC、阅读进度）
- [ ] 首页接入最新文章
- [ ] RSS / sitemap.xml / 每页 metadata
- [ ] 示例文章 2–3 篇

## M3 功能模块 ⏳

- [ ] 实验室/项目页 `/projects/`
- [ ] 二次元/追番页 `/anime/`（Bangumi 浏览器端实时请求 + 缓存/失败态）
- [ ] 搜索 UI（Pagefind 前端接入）
- [ ] 关于页 `/about/`
- [ ] giscus 评论组件（按 deploy-checklist 第 3 节启用，含开关）

## M4 上线 🔨

- [ ] 部署收尾：HTTPS 证书 + Enforce HTTPS + 验证清单（见 docs/ops/deploy-checklist.md）
- [ ] R2 图床接入 + 文章配图迁移
- [ ] 性能自查（Lighthouse：性能/无障碍/SEO ≥ 90）
- [ ] 移动端全面走查
- [ ] 首次正式发布 🎉

## M5 迭代 ⏳

- [ ] 动画细节打磨（滚动叙事、页面过渡）
- [ ] 访问统计（Cloudflare Web Analytics）
- [ ] 内容持续更新
- [ ] 视国内访问质量决定是否迁移 Cloudflare Pages
