import type { PostMeta } from "@/lib/posts";
import { getAllPosts, getAllTags, getCategoryCounts } from "@/lib/posts";

/** 每页文章数（REQ-P1；改动会影响分页路由数量） */
export const POSTS_PER_PAGE = 10;

/**
 * 列表页纯视图模型：分页切片 + 标签云 + 分类计数。
 * 抽成 lib 纯函数便于 /posts 与 /posts/page/[n] 共用（P-6）。
 */
export function getPostsPage(page: number): PostMeta[] {
  return getAllPosts().slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}

export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}

export function getTagCloud() {
  return getAllTags();
}

export function getCategoryChips() {
  return getCategoryCounts();
}

/** 页码合法性校验：静态导出下非法页码应走 404（调用方 notFound()） */
export function isValidPage(page: number, totalPages: number): boolean {
  return Number.isInteger(page) && page >= 1 && page <= totalPages;
}
