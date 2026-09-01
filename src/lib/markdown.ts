/**
 * Markdown → HTML 构建期渲染管线（详情页专用）
 *
 * 管线：remark-parse → remark-gfm → remark-rehype → rehype-slug（标题锚点）
 *   → rehype-autolink-headings → rehype-pretty-code（Shiki 双主题高亮）→ rehype-stringify
 *
 * 约定（design-system/posts.md）：
 * - 双主题 catppuccin-latte / catppuccin-mocha，暗色经 CSS 变量切换（globals.css）
 * - 标题锚点用「#」旁挂链接（hover 可见），不动标题文本本身
 * - 同一 slug 构建期只渲染一次（页面级缓存）
 */
import { cache } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "append",
    properties: {
      className: ["heading-anchor"],
      ariaLabel: "标题锚点",
      tabIndex: -1,
    },
    content: { type: "text", value: "#" },
  })
  .use(rehypePrettyCode, {
    theme: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
    keepBackground: false,
  })
  .use(rehypeStringify);

/** HTML 与 h2/h3 标题列表一次产出（TOC 数据源；h4 不进目录，design-system/posts.md §2.7） */
export const renderMarkdown = cache(
  async (markdown: string): Promise<{ html: string; headings: Heading[] }> => {
    const file = await processor.process(markdown);
    const html = String(file);
    return { html, headings: extractHeadings(html) };
  },
);

/** 从渲染后的 HTML 提取 h2/h3（锚点由 rehype-slug 保证存在；内层可能含锚点 <a> 或行内代码） */
function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const match of html.matchAll(re)) {
    headings.push({
      level: Number(match[1]) as 2 | 3,
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return headings;
}
