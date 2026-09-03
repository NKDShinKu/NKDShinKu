import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

// 静态导出红线：route handler 必须显式 force-static（AGENTS §7，缺了构建直接报错）
export const dynamic = "force-static";

/** RSS 2.0（REQ-F2）：全量已发布文章，摘要取 frontmatter description */
export function GET() {
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.locale,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author}`,
    author: { name: siteConfig.author, link: siteConfig.github },
    feedLinks: { rss: `${siteConfig.url}/feed.xml` },
  });

  for (const post of getAllPosts()) {
    feed.addItem({
      id: `${siteConfig.url}/posts/${post.slug}/`,
      title: post.title,
      description: post.description,
      link: `${siteConfig.url}/posts/${post.slug}/`,
      date: new Date(post.date),
      category: [{ name: post.category }],
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
