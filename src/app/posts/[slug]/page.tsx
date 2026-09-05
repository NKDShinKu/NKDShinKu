import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnchorScroll } from "@/components/posts/anchor-scroll";
import { AdjacentPostCard } from "@/components/posts/adjacent-post-card";
import { CodeCopyButtons } from "@/components/posts/code-copy-buttons";
import { BackButton } from "@/components/posts/back-button";
import { MermaidRenderer } from "@/components/posts/mermaid-chart";
import { TableOfContents } from "@/components/posts/table-of-contents";
import { Tag } from "@/components/ui/tag";
import { renderMarkdown } from "@/lib/markdown";
import { getAllPosts, getPostBySlug, tagSlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords ? [...post.keywords] : undefined,
    alternates: { canonical: `/posts/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/posts/${post.slug}/`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: [...post.tags],
    },
  };
}

/** Article 结构化数据（REQ-G4） */
function articleJsonLd(post: NonNullable<ReturnType<typeof getPostBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/posts/${post.slug}/`,
    keywords: [...post.tags],
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  const { html, headings } = await renderMarkdown(post.content);
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? all[index - 1] : null; // 时间线上更晚的一篇
  const next = index < all.length - 1 ? all[index + 1] : null; // 时间线上更早的一篇

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      {/* 双列：正文 720px 居中 + TOC 侧栏（xl 起，design-system/posts.md §3.2） */}
      <div className="mx-auto flex max-w-[720px] justify-center gap-10 xl:max-w-none xl:justify-between">
        <div className="w-full max-w-[720px]">
        <BackButton fallbackHref="/posts/" />

        <header className="mt-8">
          <div className="text-text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {/* data-pagefind-meta：结果行展示分类（search.md S-5） */}
            <Tag data-pagefind-meta="category">{post.category}</Tag>
            <span className="inline-flex items-center gap-1">
              <span className="icon-[mdi--calendar-outline] size-4" aria-hidden />
              <time dateTime={post.date}>{post.date}</time>
            </span>
            {post.updated ? (
              <span className="inline-flex items-center gap-1">
                <span className="icon-[mdi--update] size-4" aria-hidden />
                更新于 <time dateTime={post.updated}>{post.updated}</time>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <span className="icon-[mdi--clock-outline] size-4" aria-hidden />
              {post.readingMinutes} 分钟阅读
            </span>
          </div>

          <h1 className="mt-4 text-3xl leading-tight font-bold [text-wrap:balance] md:text-4xl">
            {post.title}
          </h1>

          <p className="text-text-muted mt-4 border-l-2 border-sakura pl-4 text-lg leading-relaxed">
            {post.description}
          </p>
        </header>

        <hr className="border-border my-8" />

        {/* 正文：零入场动画（P-9，阅读优先）；内容来源构建期渲染，静态 HTML 可信
            data-pagefind-body：站点存在该标记后 Pagefind 仅索引文章正文（REQ-S2 首期仅文章） */}
        <article
          className="post-body"
          data-pagefind-body
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {post.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/posts/tag/${tagSlug(tag)}/`}>
                <Tag className="transition-colors duration-150 ease-fast hover:bg-accent/15">
                  {tag}
                </Tag>
              </Link>
            ))}
          </div>
        ) : null}

        <nav
          aria-label="文章导航"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          <AdjacentPostCard label="上一篇" post={prev} align="left" />
          <AdjacentPostCard label="下一篇" post={next} align="right" />
        </nav>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
        />
        </div>

        {headings.length > 0 ? <TableOfContents headings={headings} /> : null}
      </div>

      {/* 复制按钮 / Mermaid 渲染 / 锚点滚动（纯增强，见组件注释）；随文章页挂载 */}
      <CodeCopyButtons />
      <MermaidRenderer />
      <AnchorScroll />
    </div>
  );
}
