import type { Metadata } from "next";
import { PostsIndex } from "@/components/posts/posts-index";
import { getPostsPage, getTotalPages } from "@/lib/posts-pagination";

export const metadata: Metadata = {
  title: "文章",
  description: "NKDShinKu 的博客文章：教程、技术笔记与日常。",
  alternates: { canonical: "/posts/" },
};

/** 文章列表第一页（分页第 n>1 页见 /posts/page/[page]） */
export default function PostsPage() {
  const totalPages = getTotalPages();
  return <PostsIndex page={1} totalPages={totalPages} posts={getPostsPage(1)} />;
}
