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
    // ```mermaid 块在渲染前提取（否则会被当代码高亮），以占位段落站位于原文
    const mermaidBlocks: string[] = [];
    const replaced = markdown.replace(/^```mermaid[^\S\n]*\n([\s\S]*?)^```/gm, (_, code) => {
      mermaidBlocks.push(code);
      return `\n\nMERMAIDPLACEHOLDER${mermaidBlocks.length - 1}END\n\n`;
    });

    const file = await processor.process(replaced);
    let html = String(file);

    // 占位段落 → slot div（源码进 data 属性，MermaidRenderer 客户端渲染）
    html = html.replace(/<p>MERMAIDPLACEHOLDER(\d+)END<\/p>/g, (_, index) =>
      mermaidSlotHtml(mermaidBlocks[Number(index)] ?? ""),
    );

    return { html, headings: extractHeadings(html) };
  },
);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Mermaid 占位卡样式见 globals.css .mermaid-slot（管线产出原始 HTML，不走 Tailwind 扫描） */
function mermaidSlotHtml(code: string): string {
  return `<div class="mermaid-slot" role="img" aria-busy="true" aria-label="图表" data-mermaid="${escapeHtml(code.trim())}"></div>`;
}

/** 从渲染后的 HTML 提取 h2/h3（锚点由 rehype-slug 保证存在；先剔除锚点 <a> 整体，再剥剩余标签） */
function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const match of html.matchAll(re)) {
    headings.push({
      level: Number(match[1]) as 2 | 3,
      id: match[2],
      text: match[3]
        .replace(/<a\b[\s\S]*?<\/a>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim(),
    });
  }
  return headings;
}
