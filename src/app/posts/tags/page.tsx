import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "标签",
  description: "NKDShinKu 博客的全部标签索引。",
  alternates: { canonical: "/posts/tags/" },
};

/** 标签索引页（/posts 页头入口）：全量标签 + 篇数；链接走 ASCII slug */
export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <header className="mb-8">
        <Link
          href="/posts/"
          className="text-text-muted focus-visible:outline-accent inline-flex items-center gap-1 text-sm transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
          返回全部文章
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold">标签</h1>
        <p className="text-text-muted mt-1.5 text-sm">共 {tags.length} 个标签</p>
      </header>

      {tags.length > 0 ? (
        <nav aria-label="全部标签" className="flex flex-wrap items-center gap-2.5">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/posts/tag/${tag.slug}/`}
              className="bg-accent/10 text-accent-dark hover:bg-accent/15 focus-visible:outline-accent rounded-full px-4 py-2 text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {tag.name}
              <span className="text-text-muted ml-1.5 text-xs">{tag.count}</span>
            </Link>
          ))}
        </nav>
      ) : (
        <p className="text-text-muted text-sm">还没有任何标签。</p>
      )}
    </div>
  );
}
