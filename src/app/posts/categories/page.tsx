import type { Metadata } from "next";
import Link from "next/link";
import { POST_CATEGORIES, getCategoryCounts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "分类",
  description: "NKDShinKu 博客的全部文章分类。",
  alternates: { canonical: "/posts/categories/" },
};

const CATEGORY_DESCRIPTIONS: Record<(typeof POST_CATEGORIES)[number], string> = {
  技术: "技术相关的教程、实战与思考，成体系地讲清楚一件事。",
  笔记: "短平快的踩坑与经验记录。",
  日常: "随笔、追番与生活碎片。",
};

/** 分类索引页（/posts 页头入口）：三分类卡，含描述与篇数 */
export default function CategoriesPage() {
  const counts = getCategoryCounts();

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <header className="mb-8">
        <Link
          href="/posts/"
          className="text-text-muted focus-visible:outline-accent ease-fast hover:text-accent inline-flex items-center gap-1 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
          返回全部文章
        </Link>
        <h1 className="font-display mt-3 text-2xl font-bold">分类</h1>
      </header>

      <div className="flex flex-col gap-5">
        {counts.map(({ name, slug, count }) => (
          <Link
            key={slug}
            href={`/posts/category/${slug}/`}
            className="focus-visible:outline-accent block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="border-border bg-surface hover:border-accent/60 group ease-base rounded-md border p-6 transition-[border-color,box-shadow] duration-200 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <span
                  className="icon-[mdi--folder-multiple-outline] text-accent size-6 shrink-0"
                  aria-hidden
                />
                <h2 className="ease-base group-hover:text-accent text-lg font-semibold transition-colors duration-200">
                  {name}
                </h2>
                <span className="text-text-muted text-sm">{count} 篇</span>
                <span
                  className="icon-[mdi--arrow-right] text-accent ease-base ml-auto size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </div>
              <p className="text-text-muted mt-2 text-sm">{CATEGORY_DESCRIPTIONS[name]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
