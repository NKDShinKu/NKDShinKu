import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/components/posts/post-card";
import { Pagination } from "@/components/posts/pagination";
import type { PostMeta } from "@/lib/posts";
import { getCategoryChips, getTagCloud } from "@/lib/posts-pagination";

type PostsIndexProps = {
  page: number;
  totalPages: number;
  posts: PostMeta[];
};

/**
 * 文章列表渲染体（/posts 与 /posts/page/[n] 共用）—— design-system/posts.md §3.1
 * 分类 chips 与标签云按「当前页上下文」高亮：走链接而非客户端筛选（静态导出）
 */
export function PostsIndex({ page, totalPages, posts }: PostsIndexProps) {
  const chips = getCategoryChips();
  const tagCloud = getTagCloud();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-14 pb-16 sm:px-6 md:pt-20 md:pb-24">
      <Reveal className="mb-10 text-center">
        <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Blog</p>
        <h1 className="mt-2 text-2xl font-bold">文章</h1>
        <p className="text-text-muted mx-auto mt-2 max-w-[480px]">
          教程、笔记与日常，记录学习与思考。
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        {/* 分类 chips：药丸、min-h 44px 触控、flex-wrap（§2.2） */}
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
              href={`/posts/category/${chip.name}/`}
              className="focus-visible:outline-accent flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-5 text-sm font-medium transition-[border-color,color] duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2 hover:border-accent hover:text-accent"
            >
              {chip.name}
              <span className="text-text-muted text-xs">{chip.count}</span>
            </Link>
          ))}
        </nav>

        {/* 标签云（§2.3）：紧凑 tag + 篇数 */}
        <nav aria-label="按标签筛选" className="mb-10 flex flex-wrap items-center gap-2">
          {tagCloud.map((tag) => (
            <Link
              key={tag.name}
              href={`/posts/tag/${tag.name}/`}
              className="bg-accent/10 text-accent-dark rounded-full px-2.5 py-1 text-xs transition-colors duration-150 ease-fast hover:bg-accent/15 focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {tag.name}
              <span className="text-text-muted ml-1">{tag.count}</span>
            </Link>
          ))}
        </nav>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.08}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefForPage={(n) => (n === 1 ? "/posts/" : `/posts/page/${n}/`)}
      />
    </div>
  );
}
