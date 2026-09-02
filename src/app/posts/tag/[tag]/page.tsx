import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsIndex } from "@/components/posts/posts-index";
import { getAllTags, getPostsByTag, tagSlug } from "@/lib/posts";

/** 参数空间 = 全站标签的 ASCII slug（从内容派生） */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const tag = (await params).tag;
  const all = getAllTags();
  const found = all.find((t) => t.slug === tag);
  if (!found) return {};
  return {
    title: `标签：${found.name}`,
    description: `标签「${found.name}」下的全部文章，共 ${found.count} 篇。`,
    alternates: { canonical: `/posts/tag/${found.slug}/` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const slug = (await params).tag;
  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();

  // 展示名取同 slug 标签的原始写法（frontmatter 原文）
  const display = getAllTags().find((t) => t.slug === tagSlug(slug))?.name ?? slug;

  return (
    <PostsIndex page={1} totalPages={1} posts={posts} context={{ kind: "tag", name: display }} />
  );
}
