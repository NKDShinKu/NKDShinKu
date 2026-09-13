---
title: 静态博客的 SEO，我补了这些
cover: https://img.nkdshinku.com/images/posts/static-blog-seo-guide.webp
description: 给静态博客补 SEO 的逐项记录：元信息、sitemap、结构化数据、分享卡、性能与 llms.txt，附一份可以照着做的清单，以及我还没做完的事。
date: 2026-09-10
updated: 2026-09-13
category: 技术
tags:
  - SEO
  - 静态博客
  - Next.js
keywords:
  - SEO
  - sitemap
  - 结构化数据
  - Open Graph
  - llms.txt
---

站上线之后有一轮收尾，SEO 是其中一块。这篇就是那一轮做的事：哪些真的有用，哪些我一开始想复杂了。

先给结论：静态博客做 SEO 是占便宜的。HTML 在构建期就渲染好了，爬虫拿到的是完整内容，不存在「客户端渲染导致爬虫看到白屏」的问题。剩下的都是能逐项做完的活。

## 搜索引擎那边只有三步

1. **抓取**：爬虫顺着链接和 sitemap 过来，拿走 HTML；
2. **收录**：解析 HTML，判断这页讲什么，存进索引；
3. **排名**：用户搜索时，按相关性和质量排序。

补 SEO 就是把这三步上的障碍清掉：让爬虫找得到（sitemap、内链、robots 别挡路），让机器看得懂（语义化结构、元信息、结构化数据），别在体验上扣分（性能）。

技术能做的是「不丢分」。分数上限还是内容本身。这不是我总结的，Google 的官方口径一直如此（E-E-A-T：经验、专业、权威、可信）。

## 元信息：每页独立

- **标题模板**：根布局里定 `%s | NKDShinKu`，每个页面只填自己的标题；
- **description**：每页手写，直接复用文章 frontmatter 里的摘要，这段会出现在搜索结果里；
- **canonical**：每页显式声明权威 URL，用来收口「带不带尾斜杠」「分页参数」这类重复内容；
- **分页页 noindex**：`/posts/page/2/` 这种是导航辅助，不该跟正文抢收录。

关键词 meta 需要澄清一下：Google 早已忽略这个字段，留着无害，但不要指望它。真正起作用的关键词在标题、描述和正文里。

## sitemap 和 robots

sitemap 是主动递给搜索引擎的清单。我的实现是 Next.js 的 metadata route，构建期生成静态文件：

- 首页和板块页优先，文章页次之，分类标签页再次；
- 文章条目带 `lastModified`，取的是内容本身的更新时间，不是构建时间：每次构建都变的话，这个字段就没有参考价值了；
- 分页页不进 sitemap，跟 noindex 保持一致。

有一点要说明：Google 官方讲过，`priority` 和 `changefreq` 基本被忽略。它真正消费的是「有哪些 URL、什么时候更新过」。所以不必在优先级数值上纠结，保证清单完整、及时、准确即可。

robots.txt 只有四行：允许所有爬虫，声明 sitemap 地址。它的作用不是加分，而是防止以后自己误加规则，把整站挡在外面。

## 结构化数据

元信息告诉爬虫「这页叫什么」，结构化数据告诉它「这页是什么类型的东西」。文章详情页我注入了一段 BlogPosting 的 JSON-LD，字段从 frontmatter 派生，构建期生成，不用手动维护：

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "文章标题",
  "datePublished": "2026-09-10",
  "dateModified": "2026-09-10",
  "author": { "@type": "Person", "name": "NKDShinKu" },
  "keywords": ["giscus", "静态博客"]
}
```

一点提醒：结构化数据不是万能加分项，而且富结果的样式一直在变，Google 这几年陆续砍掉过好几种。长期值得投入的是描述「这是什么」的基础类型：Article、Person、Organization。为了某个富结果样式去堆 schema，不划算。

## 分享卡

把链接粘到聊天软件或社交平台时出现的那张「图片 + 标题 + 摘要」卡片，读的是 Open Graph 标签：

- `og:image`：卡片配图，推荐 1200×630。我用了一张静态品牌图，全站共用；
- `og:title` / `og:description`：和页面元信息同源；
- `twitter:card: summary_large_image`：声明用大图卡片。

对技术博客来说，这张卡是点击率的第一关：群里看到链接，卡片的样子几乎等于第一印象。另外，微信基本不读 OG，国内分享生态自成一套，不必为它单独优化。

## 图标和 manifest

favicon 不影响排名，但它属于「这个站是不是正经站」的一部分。我用脚本从一份 SVG 源文件派生出整套：`favicon.ico`（16/32/48）、`apple-touch-icon`（180）、PWA 的 192/512，外加一个声明主题色的 `manifest.webmanifest`。

这是典型的一次性工程：以后换 logo，改一份源文件重跑脚本，各平台图标一起更新。

## 性能

页面体验是正式的排名信号，Core Web Vitals 三个指标：LCP 要 2.5 秒内、CLS 接近 0、INP 200ms 内。

静态导出在这三项上是躺赢的：HTML 直出，没有客户端渲染等待；图片都有显式宽高加懒加载，所以 CLS 一直是 0。我跑了四个页面、桌面和移动两态：

| 页面     | 桌面性能 | 移动性能 | CLS |
| -------- | -------- | -------- | --- |
| 首页     | 100      | 92       | 0   |
| 实验室   | 100      | 92       | 0   |
| 文章页   | 100      | 93       | 0   |
| ACG 归档 | 97       | 80       | 0   |

分数偏低的是 ACG 归档页，移动端 LCP 5.0 秒。我最初判断是封面图过大，实测后并不是：那页的数据是串行请求的，封面本身已经用了 bgm.tv 的缩略尺寸。这条还没改，记在待办里。

## RSS

RSS 严格说不属于 SEO，它不参与排名。但它是分发的另一条路：读者订阅之后，新文章自动送到，不看算法脸色。实现是一个构建期生成的 `feed.xml`，全量文章，摘要取自 frontmatter。

## llms.txt

最后一个不是给人看的：站点根目录放一份 Markdown，写清这个站是什么、有哪些板块、每篇文章的标题和链接，相当于递给大模型一份「站点说明书」。我的实现是构建期生成的 route handler，发文自动更新，零维护。

需要说明的是，这是个还没有搜索引擎官方采用的前瞻约定，收益取决于 AI 搜索是否会成为主要入口。好在成本几乎为零。

比这个文件更值得做的，其实是把内容写清楚：结构明确、事实准确、观点能独立引用。大模型抓取网页时，最容易引用的就是这种「自包含、有结论、有上下文」的段落。

## 还没做的

- 站长验证（Google / 百度）没做，需求里记着，留到后面；
- ACG 归档页移动端 LCP 5.0 秒，还没处理。

## 可以照着做的清单

- [ ] 每页独立的 title 与 description，全站统一标题模板
- [ ] 每页声明 canonical；导航性质的页面（分页等）noindex
- [ ] sitemap 覆盖全部应收录页面，`lastModified` 取内容更新时间
- [ ] robots.txt 保持极简，声明 sitemap 地址
- [ ] 文章页注入 Article / BlogPosting 结构化数据
- [ ] Open Graph 标签 + 一张 1200×630 分享图 + twitter card
- [ ] favicon 全套（ico / apple-touch / PWA 图标）+ manifest
- [ ] Core Web Vitals 达标（LCP < 2.5s / CLS ≈ 0 / INP < 200ms）
- [ ] RSS 订阅入口
- [ ] （前瞻）llms.txt
- [ ] sitemap 提交到 Google Search Console
