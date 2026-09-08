import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnchorScroll } from "@/components/posts/anchor-scroll";
import { AdjacentPostCard } from "@/components/posts/adjacent-post-card";
import { AuthorCard } from "@/components/posts/author-card";
import { CodeCopyButtons } from "@/components/posts/code-copy-buttons";
import { BackButton } from "@/components/posts/back-button";
import { MermaidRenderer } from "@/components/posts/mermaid-chart";
import { PostComments } from "@/components/posts/post-comments";
import { PostPanelDrawer } from "@/components/posts/post-panel-drawer";
import { JumpToComments } from "@/components/posts/jump-to-comments";
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
      // openGraph 嵌套对象不与根布局合并，文章页须显式声明（OG 全站共用品牌图，D19）
      images: [{ url: "/og.png", width: 1200, height: 630, alt: post.title }],
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

            <h1 className="mt-4 text-2xl leading-tight font-bold [text-wrap:balance] md:text-3xl">
              {post.title}
            </h1>

            <p className="text-text-muted border-sakura mt-4 border-l-2 pl-4 text-base leading-relaxed">
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
                  <Tag className="ease-fast hover:bg-accent/15 transition-colors duration-150">
                    {tag}
                  </Tag>
                </Link>
              ))}
            </div>
          ) : null}

          {/* 评论（REQ-P10 / D19）：抽屉式 giscus，enabled 关闭即不挂载 */}
          {siteConfig.comments.enabled ? <PostComments /> : null}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
          />
        </div>

        {/* 右栏面板（用户需求，透明风）：作者信息 + 上下篇单行条目 + 目录
            sticky + max-h 防 sticky 溢出（底部留 2rem 呼吸位）；目录组件内部自带
            「标题钉住 + 仅列表内滚」（min-h-0 随面板收缩，滚动条隐藏），作者卡与上下篇恒定可见 */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-24 flex max-h-[calc(100dvh-8rem)] flex-col gap-5">
            <AuthorCard />
            <nav aria-label="文章导航" className="flex shrink-0 items-center gap-2">
              <AdjacentPostCard label="上一篇" post={prev} />
              <AdjacentPostCard label="下一篇" post={next} />
            </nav>
            {headings.length > 0 ? <TableOfContents headings={headings} /> : null}
          </div>
        </aside>
      </div>

      {/* 复制按钮 / Mermaid 渲染 / 锚点滚动 / 浮动评论直达（纯增强，见组件注释）；随文章页挂载 */}
      <CodeCopyButtons />
      <MermaidRenderer />
      <AnchorScroll />
      {siteConfig.comments.enabled ? <JumpToComments /> : null}
      {/* xl 以下右栏收进抽屉（作者卡/上下篇/目录），三横线浮动按钮唤出 */}
      <PostPanelDrawer headings={headings} prev={prev} next={next} />
    </div>
  );
}
