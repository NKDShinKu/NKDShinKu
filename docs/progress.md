# NKDShinKu — 项目进度

> 最后更新：2026-07-07

## 进度总览

```
设计系统    ████████████ ✅ 完成
项目基础    ████████████ ✅ 完成
通用组件    ░░░░░░░░░░░░ ⏳ 待开始
首页        ░░░░░░░░░░░░ ⏳ 待开始
博客模块    ░░░░░░░░░░░░ ⏳ 待开始
项目模块    ░░░░░░░░░░░░ ⏳ 待开始
追番模块    ░░░░░░░░░░░░ ⏳ 待开始
动效打磨    ░░░░░░░░░░░░ ⏳ 待开始
测试上线    ░░░░░░░░░░░░ ⏳ 待开始
```

---

## 1. 设计系统 ✅

| 产出 | 文件 | 状态 |
|------|------|:--:|
| 全局设计规则 | `design-system/nkdshinku/MASTER.md` | ✅ |
| 首页规格 | `design-system/nkdshinku/pages/home.md` | ✅ |
| 博客列表规格 | `design-system/nkdshinku/pages/blog.md` | ✅ |
| 文章详情规格 | `design-system/nkdshinku/pages/blog-post.md` | ✅ |
| 项目页规格 | `design-system/nkdshinku/pages/projects.md` | ✅ |
| 追番页规格 | `design-system/nkdshinku/pages/anime.md` | ✅ |
| 视觉预览 | `design-system/preview.html` | ✅ |
| AI 指令文件 | `CLAUDE.md` | ✅ |

---

## 2. 项目基础 ✅

| 产出 | 文件 | 状态 |
|------|------|:--:|
| 类型定义（Post/Project/Bangumi/Theme） | `src/types/index.ts` | ✅ |
| TailwindCSS v4 主题 + 暗色模式 | `src/assets/css/main.css` | ✅ |
| Google Fonts 引入 | `index.html` | ✅ |
| Glass 工具类（`.glass` / `.glass-interactive`） | `src/assets/css/main.css` | ✅ |
| Prose 覆盖样式 | `src/assets/css/main.css` | ✅ |
| Focus 环 + Reduced Motion | `src/assets/css/main.css` | ✅ |
| 主题 Store（localStorage 持久化） | `src/stores/theme.ts` | ✅ |
| AppHeader（玻璃态导航 + 移动端底部 Tab） | `src/components/app/AppHeader.vue` | ✅ |
| AppFooter（社交链接 + 版权） | `src/components/app/AppFooter.vue` | ✅ |
| AppLayout（Header + RouterView + Footer） | `src/App.vue` | ✅ |
| 路由配置（含 /anime） | `src/router/index.ts` | ✅ |
| 主题切换按钮（月亮/太阳 SVG） | `src/components/common/ThemeToggle.vue` | ✅ |
| AnimaPage 占位 | `src/pages/anime/AnimePage.vue` | ✅ |
| 清理样板代码（counter store） | — | ✅ |
| README + package.json 修正 | `README.md` / `package.json` | ✅ |
| 项目进度文档 | `docs/progress.md` | ✅ |

---

## 3. 通用组件 ⏳

| 组件 | 文件 | 说明 |
|------|------|------|
| BaseButton | `src/components/common/BaseButton.vue` | primary / secondary / ghost / icon 变体 |
| BaseCard | `src/components/common/BaseCard.vue` | 玻璃态卡片容器 |
| BaseTag | `src/components/common/BaseTag.vue` | 标签/徽章（default/sakura/twilight/success） |
| FadeInSection | `src/components/common/FadeInSection.vue` | Intersection Observer 入场包装器 |
| ParallaxLayer | `src/components/common/ParallaxLayer.vue` | 视差滚动包装器 |
| ParticleBackground | `src/components/common/ParticleBackground.vue` | Canvas 粒子背景 |
| ScrollProgress | `src/components/common/ScrollProgress.vue` | 阅读进度条 |

---

## 4. 首页 ⏳

| 组件 | 文件 | 说明 |
|------|------|------|
| HomePage | `src/pages/home/HomePage.vue` | 页面入口（组合各 Section） |
| HeroSection | `src/components/home/HeroSection.vue` | 视频背景 + 标题 + CTA |
| AboutCapsule | `src/components/home/AboutCapsule.vue` | 头像 + 简介玻璃态卡片 |
| ContentHub | `src/components/home/ContentHub.vue` | 3 卡片 Bento 导航 |
| LatestPosts | `src/components/home/LatestPosts.vue` | 最近文章卡片 |

---

## 5. 博客模块 ⏳

| 产出 | 文件 | 说明 |
|------|------|------|
| BlogPage | `src/pages/blog/BlogPage.vue` | 博客列表页 |
| BlogPostPage | `src/pages/blog/BlogPostPage.vue` | 文章详情页 |
| PostCard | `src/components/blog/PostCard.vue` | 文章摘要卡片 |
| TagFilter | `src/components/blog/TagFilter.vue` | 标签过滤横条 |
| PostHeader | `src/components/blog/PostHeader.vue` | 文章页头 |
| PostContent | `src/components/blog/PostContent.vue` | markdown 渲染正文 |
| Markdown 解析工具 | `src/utils/markdown.ts` | gray-matter + marked |
| 文章 Store | `src/stores/posts.ts` | 加载、过滤、查找 |
| 示例文章 | `src/content/posts/*.md` | 至少 1 篇 |

---

## 6. 项目模块 ⏳

| 产出 | 文件 | 说明 |
|------|------|------|
| ProjectsPage | `src/pages/projects/ProjectsPage.vue` | 项目列表页 |
| ProjectCard | `src/components/project/ProjectCard.vue` | 项目卡片 |
| CategoryFilter | `src/components/project/CategoryFilter.vue` | 分类过滤 |
| ProjectModal | `src/components/project/ProjectModal.vue` | 项目详情弹窗 |
| 项目 Store | `src/stores/projects.ts` | 加载、过滤 |
| 项目数据 | `src/data/projects.json` | 静态项目数据 |

---

## 7. 追番模块 ⏳

| 产出 | 文件 | 说明 |
|------|------|------|
| AnimePage | `src/pages/anime/AnimePage.vue` | 追番页面 |
| StatusTabs | `src/components/anime/StatusTabs.vue` | 在看/看过/想看 Tab |
| AnimeCard | `src/components/anime/AnimeCard.vue` | 封面卡片 |
| 追番 Store | `src/stores/anime.ts` | Bangumi API + localStorage 缓存 |

---

## 8. 动效打磨 ⏳

| 产出 | 说明 |
|------|------|
| 粒子背景 | Canvas 萤火虫/星光粒子系统（ParticleBackground） |
| 极光渐变背景 | CSS 大尺寸模糊 blob 缓慢流动（main.css 或独立组件） |
| Hero 视差 | GSAP ScrollTrigger 多层 parallax |
| 入场动画 | GSAP Timeline（Hero 标题/CTA stagger） |
| 滚动揭示 | FadeInSection + ScrollTrigger |
| 页面切换动画 | GSAP + Vue Router 守卫（fade 200ms） |

---

## 9. 测试上线 ⏳

| 产出 | 说明 |
|------|------|
| GitHub Actions CI | `.github/workflows/deploy.yml` → 自动 build + 部署 GitHub Pages |
| SEO 增强 | index.html Open Graph / Twitter Card + 动态 meta |
| 响应式验证 | 375 / 768 / 1024 / 1440 四断点检查 |
| A11y 审计 | 键盘导航、焦点环、对比度、alt 文本 |
| 性能检查 | Lighthouse ≥ 90 |
