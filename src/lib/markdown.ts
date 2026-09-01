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

/** 构建期渲染（React cache：同 slug 多次调用只跑一遍管线） */
export const renderMarkdown = cache(async (markdown: string): Promise<string> => {
  return processor.process(markdown).then((file) => String(file));
});
