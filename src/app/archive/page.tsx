import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/posts/pagination";
import { Tag } from "@/components/ui/tag";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "归档",
  description: "全部文章的时间线归档，按年份分组。",
  alternates: { canonical: "/archive/" },
};

/** 归档页 —— design-system/posts.md §2.9：年份分组时间线（pinned 已在排序内，此处不再标识） */
export default function ArchivePage() {
  const posts = getAllPosts();

  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const group = groups.get(year);
    if (group) group.push(post);
    else groups.set(year, [post]);
  }
  const yearGroups = [...groups.entries()]; // posts 已按日期倒序，年份组天然降序

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <header className="mb-10 text-center">
        <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Archive</p>
        <h1 className="mt-2 text-2xl font-bold">归档</h1>
        <p className="text-text-muted mx-auto mt-2 max-w-[480px]">共 {posts.length} 篇文章。</p>
      </header>

      {yearGroups.length === 0 ? (
        <EmptyState message="还没有任何文章。" />
      ) : (
        <div className="mx-auto max-w-[720px] space-y-12">
          {yearGroups.map(([year, yearPosts]) => (
            <section key={year}>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold">{year}</h2>
                <Tag>{yearPosts.length} 篇</Tag>
              </div>
              <ol className="border-border ml-2 space-y-5 border-l-2 pl-6">
                {yearPosts.map((post) => (
                  <li key={post.slug} className="relative">
                    {/* 时间线圆点：绝对定位于左侧边线上 */}
                    <span
                      className="bg-accent-light absolute top-1.5 -left-[31px] size-2.5 rounded-full"
                      aria-hidden
                    />
                    <Link
                      href={`/posts/${post.slug}/`}
                      className="focus-visible:outline-accent group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      <p className="text-text-muted font-mono text-xs">{post.date}</p>
                      <p className="mt-0.5 text-base font-medium transition-colors duration-200 ease-base group-hover:text-accent">
                        {post.title}
                      </p>
                      <span className="text-text-muted mt-1 inline-flex items-center gap-2 text-xs">
                        <Tag className="px-2.5 py-0.5">{post.category}</Tag>
                        {post.pinned ? (
                          <span className="text-accent-dark inline-flex items-center gap-0.5">
                            <span className="icon-[mdi--pin] size-3" aria-hidden />
                            置顶
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
