import type { MetadataRoute } from "next";
import { POST_CATEGORIES, categorySlug, getAllPosts, getAllTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

// 静态导出红线：sitemap.ts 同样必须显式 force-static（AGENTS §7，官方文档未明说）
export const dynamic = "force-static";

/** 站点地图（REQ-F1）：静态页 + 文章 + 分类/标签（slug 形态）；分页页 noindex 故不入册 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const buildTime = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: buildTime, changeFrequency: "weekly", priority: 1 },
    { url: url("/posts/"), lastModified: buildTime, changeFrequency: "daily", priority: 0.9 },
    { url: url("/archive/"), lastModified: buildTime, changeFrequency: "monthly", priority: 0.5 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: url(`/posts/${post.slug}/`),
    lastModified: post.updated ?? post.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categories: MetadataRoute.Sitemap = POST_CATEGORIES.map((category) => ({
    url: url(`/posts/category/${categorySlug(category)}/`),
    lastModified: buildTime,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: url(`/posts/tag/${tag.slug}/`),
    lastModified: buildTime,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...posts, ...categories, ...tags];
}
