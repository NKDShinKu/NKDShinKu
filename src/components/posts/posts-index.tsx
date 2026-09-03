import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/components/posts/post-card";
import { EmptyState, Pagination } from "@/components/posts/pagination";
import { Tag } from "@/components/ui/tag";
import type { PostMeta } from "@/lib/posts";
import { tagSlug } from "@/lib/posts";
import { getCategoryChips, getTagCloud } from "@/lib/posts-pagination";

type PostsIndexProps = {
  page: number;
  totalPages: number;
  posts: PostMeta[];
};

/** 列表页上下文：无（/posts）/ 分类（category 页）/ 标签（tag 页）——决定 chips 高亮与头部 */
export type PostsContext =
  | { kind: "all" }
  | { kind: "category"; name: string; description?: string }
  | { kind: "tag"; name: string };

/**
 * 文章列表渲染体（/posts、/posts/page/[n]、分类页、标签页共用）—— design-system/posts.md §3.1/§3.3
 * 分类 chips 与标签云按上下文高亮：走链接而非客户端筛选（静态导出）
 */
export function PostsIndex({ page, totalPages, posts, context = { kind: "all" } }: PostsIndexProps & { context?: PostsContext }) {
  const chips = getCategoryChips();
  const tagCloud = getTagCloud();
  const title =
    context.kind === "category" ? `分类：${context.name}` : context.kind === "tag" ? `标签：${context.name}` : "文章";
  const countLabel = context.kind === "all" ? undefined : `共 ${posts.length} 篇`;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-14 pb-16 sm:px-6 md:pt-20 md:pb-24">
      {context.kind === "all" ? (
        <Reveal className="mb-10 text-center">
          <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Blog</p>
          <h1 className="mt-2 text-2xl font-bold">文章</h1>
          <p className="text-text-muted mx-auto mt-2 max-w-[480px]">
            教程、笔记与日常，记录学习与思考。
          </p>
          {/* 归档入口（REQ-P3）：归档页无导航直达，从文章页进入 */}
          <Link
            href="/archive/"
            className="text-accent-dark focus-visible:outline-accent mt-4 inline-flex items-center gap-1.5 rounded-md text-sm transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="icon-[mdi--history] size-4" aria-hidden />
            按时间线浏览归档
          </Link>
        </Reveal>
      ) : (
        <Reveal className="mb-10">
          <Link
            href="/posts/"
            className="focus-visible:outline-accent text-text-muted inline-flex items-center gap-1 text-sm transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
            返回全部文章
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            {countLabel ? <Tag>{countLabel}</Tag> : null}
          </div>
          {context.kind === "category" && context.description ? (
            <p className="text-text-muted mt-2 text-sm">{context.description}</p>
          ) : null}
        </Reveal>
      )}

      <Reveal delay={0.05}>
        {/* 分类 chips：药丸、min-h 44px 触控、flex-wrap（§2.2）；仅全部文章页显示（当前即上下文时隐藏，§3.3） */}
        {context.kind === "all" ? (
          <nav aria-label="按分类筛选" className="mb-6 flex flex-wrap items-center gap-2">
            <Link
              href="/posts/"
              aria-current="page"
              className="bg-accent focus-visible:outline-accent flex min-h-11 items-center rounded-full border border-transparent px-5 text-sm font-medium text-white transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              全部
            </Link>
            {chips.map((chip) => (
              <Link
                key={chip.name}
                href={`/posts/category/${chip.slug}/`}
                className="focus-visible:outline-accent flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-5 text-sm font-medium transition-[border-color,color] duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2 hover:border-accent hover:text-accent"
              >
                {chip.name}
                <span className="text-text-muted text-xs">{chip.count}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        {/* 标签云（§2.3）：紧凑 tag + 篇数；链接走 ASCII slug */}
        <nav aria-label="按标签筛选" className="mb-10 flex flex-wrap items-center gap-2">
          {tagCloud.map((tag) => {
            const active = context.kind === "tag" && tagSlug(context.name) === tag.slug;
            return (
              <Link
                key={tag.slug}
                href={`/posts/tag/${tag.slug}/`}
                aria-current={active ? "page" : undefined}
                className={`${active ? "bg-accent text-white" : "bg-accent/10 text-accent-dark hover:bg-accent/15"} rounded-full px-2.5 py-1 text-xs transition-colors duration-150 ease-fast focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                {tag.name}
                <span className={active ? "text-white/80" : "text-text-muted ml-1"}>{tag.count}</span>
              </Link>
            );
          })}
        </nav>
      </Reveal>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message={context.kind === "tag" ? "这个标签下还没有文章。" : "这个分类下还没有文章。"} />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefForPage={(n) => (n === 1 ? "/posts/" : `/posts/page/${n}/`)}
      />
    </div>
  );
}
