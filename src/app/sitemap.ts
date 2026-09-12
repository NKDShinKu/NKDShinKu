import type { MetadataRoute } from "next";
import {
  POST_CATEGORIES,
  categorySlug,
  getAllPosts,
  getAllTags,
  getPostsByCategory,
  getPostsByTag,
  type PostMeta,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

// 静态导出红线：sitemap.ts 同样必须显式 force-static（AGENTS §7，官方文档未明说）
export const dynamic = "force-static";

/** 组内最新日期（updated 优先）：lastModified 由内容派生，不用构建时间（每次构建都变会稀释参考价值） */
function latestDate(posts: PostMeta[]): string | undefined {
  return posts.reduce<string | undefined>((latest, post) => {
    const date = post.updated ?? post.date;
    return !latest || date > latest ? date : latest;
  }, undefined);
}

/** 站点地图（REQ-F1）：静态页 + 文章 + 分类/标签（slug 形态）；分页页 noindex 故不入册 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const allPosts = getAllPosts();
  const contentDate = latestDate(allPosts);

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: contentDate, changeFrequency: "weekly", priority: 1 },
    { url: url("/posts/"), lastModified: contentDate, changeFrequency: "daily", priority: 0.9 },
    {
      url: url("/posts/categories/"),
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/posts/tags/"),
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    { url: url("/archive/"), lastModified: contentDate, changeFrequency: "monthly", priority: 0.5 },
  ];

  const posts: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: url(`/posts/${post.slug}/`),
    lastModified: post.updated ?? post.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categories: MetadataRoute.Sitemap = POST_CATEGORIES.map((category) => ({
    url: url(`/posts/category/${categorySlug(category)}/`),
    lastModified: latestDate(getPostsByCategory(category)),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: url(`/posts/tag/${tag.slug}/`),
    lastModified: latestDate(getPostsByTag(tag.slug)),
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...posts, ...categories, ...tags];
}
