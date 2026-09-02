import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeCopyButtons } from "@/components/posts/code-copy-buttons";
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
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-14 pb-16 sm:px-6 md:pt-20 md:pb-24">
      {/* 双列：正文 720px 居中 + TOC 侧栏（xl 起，design-system/posts.md §3.2） */}
      <div className="mx-auto flex max-w-[720px] justify-center gap-10 xl:max-w-none xl:justify-between">
        <div className="w-full max-w-[720px]">
        <Link
          href="/posts/"
          className="focus-visible:outline-accent text-text-muted inline-flex items-center gap-1 text-sm transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
          返回全部文章
        </Link>

        <header className="mt-8">
          <div className="text-text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Tag>{post.category}</Tag>
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

        {/* 正文：零入场动画（P-9，阅读优先）；内容来源构建期渲染，静态 HTML 可信 */}
        <article
          className="post-body"
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
          <AdjacentCard label="上一篇" post={prev} align="left" />
          <AdjacentCard label="下一篇" post={next} align="right" />
        </nav>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
        />
        </div>

        {headings.length > 0 ? <TableOfContents headings={headings} /> : null}
      </div>

      {/* 复制按钮（纯增强，见组件注释）；随文章页挂载 */}
      <CodeCopyButtons />
    </div>
  );
}

type AdjacentCardProps = {
  label: string;
  post: { slug: string; title: string } | null;
  align: "left" | "right";
};

/** 上一篇 / 下一篇（§2.8）：无文章时禁用态占位 */
function AdjacentCard({ label, post, align }: AdjacentCardProps) {
  return (
    <Link
      href={post ? `/posts/${post.slug}/` : "/posts/"}
      aria-disabled={!post}
      className={`focus-visible:outline-accent block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 ${
        align === "right" ? "sm:text-right" : ""
      } ${post ? "" : "pointer-events-none opacity-40"}`}
    >
      <div className="border-border bg-surface hover:border-accent/60 hover:shadow-lg rounded-md border p-4 transition-[border-color,box-shadow] duration-200 ease-base">
        <p className="text-text-muted inline-flex items-center gap-1 text-xs">
          {align === "left" ? (
            <span className="icon-[mdi--chevron-left] size-4" aria-hidden />
          ) : null}
          {label}
          {align === "right" ? (
            <span className="icon-[mdi--chevron-right] size-4" aria-hidden />
          ) : null}
        </p>
        <p className="mt-1 text-base font-medium">{post ? post.title : "暂无更多文章"}</p>
      </div>
    </Link>
  );
}
