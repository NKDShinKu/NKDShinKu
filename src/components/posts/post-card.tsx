/* eslint-disable @next/next/no-img-element -- 封面恒为 R2 远程 URL：next/image 全局 unoptimized
   下与原生 img 无差别，显式宽高 + lazy 已满足 REQ-G8（AGENTS §2 远程图约定） */
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { PostMeta } from "@/lib/posts";

/** 日期展示格式：YYYY-MM-DD（列表/归档统一） */
function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

type PostCardProps = {
  post: PostMeta;
  /** 卡片外层动画/栅格类由调用方控制（Reveal 包裹、列宽等） */
  className?: string;
};

/**
 * 文章卡（列表页 / 首页最新文章共用）—— design-system/posts.md §2.1
 *
 * - 整卡可点：外层 Link 承担焦点态，卡内无次级可点元素（触控纪律）
 * - 封面可选：有封面走 21:9 顶部图形态，无封面走紧凑形态（REQ-G8 显式宽高 + 懒加载）
 * - 标签最多 2 个 +「+n」；摘录取 frontmatter description，line-clamp-2
 */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}/`}
      className="focus-visible:outline-accent block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card variant="surface" interactive className={`group h-full ${className ?? ""}`}>
        {post.cover ? (
          // 21:9 固定比例预留空间（CLS=0）；显式宽高满足 unoptimized next 语义下的 alt/尺寸纪律
          <span className="mb-5 block overflow-hidden rounded-[calc(var(--radius-md)-4px)] border border-border/60">
            <img
              src={post.cover}
              alt=""
              width={840}
              height={360}
              loading="lazy"
              className="aspect-[21/9] w-full object-cover"
            />
          </span>
        ) : null}

        <div className="flex items-center gap-2">
          <Tag>{post.category}</Tag>
          {post.pinned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              <span className="icon-[mdi--pin] size-3.5" aria-hidden />
              置顶
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg font-semibold transition-colors duration-200 ease-base group-hover:text-accent">
          {post.title}
        </h3>

        <p className="text-text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
          {post.description}
        </p>

        <div className="border-border/60 mt-4 border-t pt-4">
          <div className="text-text-muted flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="icon-[mdi--calendar-outline] size-4" aria-hidden />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="icon-[mdi--clock-outline] size-4" aria-hidden />
              {post.readingMinutes} 分钟
            </span>
            {post.tags.length > 0 ? (
              <span className="text-accent-dark ml-auto inline-flex flex-wrap items-center gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-accent/10 rounded-full px-2.5 py-1 font-medium">
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 ? (
                  <span className="text-text-muted">+{post.tags.length - 2}</span>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
