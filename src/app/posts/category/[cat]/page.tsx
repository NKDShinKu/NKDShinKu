import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsIndex } from "@/components/posts/posts-index";
import { categorySlug, categoryFromSlug, getPostsByCategory, POST_CATEGORIES, type PostCategory } from "@/lib/posts";

/** 参数空间 = 固定三分类的英文 slug（ASCII，dev/build/GH Pages 全链路一致） */
export const dynamicParams = false;

const CATEGORY_DESCRIPTIONS: Record<PostCategory, string> = {
  教程: "完整地讲清楚一件事，从原理到落地。",
  笔记: "短平快的踩坑与经验记录。",
  日常: "随笔、追番与生活碎片。",
};

export function generateStaticParams() {
  return POST_CATEGORIES.map((cat) => ({ cat: categorySlug(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const category = categoryFromSlug((await params).cat);
  if (!category) return {};
  return {
    title: `分类：${category}`,
    description: `${category}分类下的全部文章。`,
    alternates: { canonical: `/posts/category/${(await params).cat}/` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const category = categoryFromSlug((await params).cat);
  if (!category) notFound();

  const posts = getPostsByCategory(category);
  return (
    <PostsIndex
      page={1}
      totalPages={1}
      posts={posts}
      context={{
        kind: "category",
        name: category,
        description: CATEGORY_DESCRIPTIONS[category],
      }}
    />
  );
}
