import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState, Pagination } from "@/components/posts/pagination";
import { PostCard } from "@/components/posts/post-card";
import { Tag } from "@/components/ui/tag";
import type { PostCategory, PostMeta } from "@/lib/posts";
import { getCategoryChips } from "@/lib/posts-pagination";

type PostsIndexProps = {
  page: number;
  totalPages: number;
  posts: PostMeta[];
};

/** 列表页上下文：无（/posts）/ 分类（category 页）/ 标签（tag 页）——决定头部与 chips 显示 */
export type PostsContext =
  | { kind: "all" }
  | { kind: "category"; name: string; description?: string }
  | { kind: "tag"; name: string };

/** 页头板块入口小链接（分类/标签/归档） */
function EntranceLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-[color,background-color] duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className={`${icon} size-4`} aria-hidden />
      {children}
    </Link>
  );
}

/** 分类徽章图标（徽章 = 前往该分类页的链接，无选中态——用户决策） */
const CATEGORY_ICONS: Record<PostCategory, string> = {
  教程: "icon-[mdi--school-outline]",
  笔记: "icon-[mdi--notebook-outline]",
  日常: "icon-[mdi--coffee-outline]",
};

const chipBase =
  "group focus-visible:outline-accent inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface/70 px-4 text-sm font-medium text-text-muted backdrop-blur-sm transition-[border-color,color,background-color] duration-150 ease-fast hover:border-accent/50 hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2";

const chipArrow =
  "icon-[mdi--chevron-right] text-accent size-4 -translate-x-0.5 opacity-0 transition-[opacity,transform] duration-150 ease-fast group-hover:translate-x-0 group-hover:opacity-100";

/**
 * 文章列表渲染体（/posts、/posts/page/[n]、分类页、标签页共用）
 *
 * - 紧凑页头：左标题 + 右「分类/标签/归档」入口（入口页承载全量列表，本页不放标签云）
 * - 分类 chips 保留本页（选中高亮）；横向卡片单列纵排，容器收窄至 880px
 * - 无滚动叙事（文章板块不做入场动画，用户决策）
 */
export function PostsIndex({ page, totalPages, posts, context = { kind: "all" } }: PostsIndexProps & { context?: PostsContext }) {
  const chips = getCategoryChips();

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      {context.kind === "all" ? (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold">文章</h1>
          <nav aria-label="文章板块入口" className="flex items-center gap-1">
            <EntranceLink href="/posts/categories/" icon="icon-[mdi--folder-multiple-outline]">
              分类
            </EntranceLink>
            <EntranceLink href="/posts/tags/" icon="icon-[mdi--tag-multiple-outline]">
              标签
            </EntranceLink>
            <EntranceLink href="/archive/" icon="icon-[mdi--history]">
              归档
            </EntranceLink>
          </nav>
        </header>
      ) : (
        <header className="mb-6">
          <Link
            href="/posts/"
            className="text-text-muted focus-visible:outline-accent inline-flex items-center gap-1 text-sm transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
            返回全部文章
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold">
              {context.kind === "category" ? `分类：${context.name}` : `标签：${context.name}`}
            </h1>
            <Tag>共 {posts.length} 篇</Tag>
          </div>
          {context.kind === "category" && context.description ? (
            <p className="text-text-muted mt-1.5 text-sm">{context.description}</p>
          ) : null}
        </header>
      )}

      {/* 分类徽章：前往链接（图标 + 计数 + hover 箭头），无选中态（用户决策） */}
      <nav aria-label="前往分类" className="mb-8 flex flex-wrap items-center gap-2.5">
        <Link href="/posts/" className={chipBase}>
          <span className="icon-[mdi--home-outline] text-accent size-4" aria-hidden />
          全部文章
          <span className={chipArrow} aria-hidden />
        </Link>
        {chips.map((chip) => (
          <Link key={chip.slug} href={`/posts/category/${chip.slug}/`} className={chipBase}>
            <span className={`${CATEGORY_ICONS[chip.name]} text-accent size-4`} aria-hidden />
            {chip.name}
            <span className="bg-accent/10 text-accent-dark rounded-full px-2 py-0.5 text-xs">
              {chip.count}
            </span>
            <span className={chipArrow} aria-hidden />
          </Link>
        ))}
      </nav>

      {posts.length > 0 ? (
        <div className="flex flex-col gap-5">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05} subtle>
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
