import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

// 静态导出红线：route handler 必须显式 force-static（AGENTS §7，缺了构建直接报错）
export const dynamic = "force-static";

/**
 * llms.txt（REQ-F4）：面向 AI 抻取的站点说明，llmstxt.org 约定格式。
 * 走 route handler 构建期生成（与 feed.xml 同模式）：文章索引随发文自动更新，不手维护静态文件。
 */
export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `站点：${siteConfig.url} · 作者：${siteConfig.author} · 语言：中文`,
    "技术博客：文章（技术/笔记/日常）、实验室（项目与站内 demo）、ACG（番剧收藏）、关于。",
    "",
    "## 板块",
    "",
    `- [文章](${siteConfig.url}/posts/): 技术、笔记与日常随笔`,
    `- [实验室](${siteConfig.url}/lab/): 个人项目、小工具与实验 demo`,
    `- [ACG](${siteConfig.url}/acg/): 番剧收藏与追番记录`,
    `- [关于](${siteConfig.url}/about/): 站点与作者介绍`,
    `- [RSS](${siteConfig.url}/feed.xml): 全量文章订阅`,
    "",
    "## 文章",
    "",
  ];

  for (const post of getAllPosts()) {
    lines.push(`- [${post.title}](${siteConfig.url}/posts/${post.slug}/): ${post.description}`);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
