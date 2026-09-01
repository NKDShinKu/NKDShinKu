import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsIndex } from "@/components/posts/posts-index";
import { getPostsPage, getTotalPages, isValidPage } from "@/lib/posts-pagination";

/** 静态导出红线：非 generateStaticParams 生成的页码一律 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  // 第 1 页固定在 /posts/，分页路由只产出第 2 页起（避免双入口）。
  // 静态导出要求参数空间非空：文章不足两页时以第 1 页占位（运行时对 page<2 走 404，
  // canonical 也指回 /posts/，不产生重复入口）。
  const totalPages = getTotalPages();
  const pages =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
      : [1];
  return pages.map((n) => ({ page: String(n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const page = Number((await params).page);
  const title = `文章 · 第 ${page} 页`;
  return {
    title,
    alternates: { canonical: `/posts/page/${page}/` },
    robots: { index: false }, // 分页内容与列表第一页高度重复，不进索引
  };
}

export default async function PostsPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const totalPages = getTotalPages();
  if (!isValidPage(page, totalPages) || page < 2) {
    notFound();
  }
  return (
    <PostsIndex
      page={page}
      totalPages={totalPages}
      posts={getPostsPage(page)}
    />
  );
}
