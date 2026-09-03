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
 * 文章横卡（列表 / 首页最新文章共用）—— 横向列表式：左文字区 + 右封面
 *
 * - 整卡可点：外层 Link 承担焦点态，卡内无次级可点元素（触控纪律）
 * - 主题细节：左侧品牌竖线，hover 时点亮（scaleY 过渡，GPU 合成）
 * - 封面可选：右侧 16:10（桌面 240px / 移动 112px），无封面文字区占满（REQ-G8 显式宽高）
 */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}/`}
      className="focus-visible:outline-accent block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card
        variant="surface"
        interactive
        className={`group relative h-full overflow-hidden bg-gradient-to-br from-surface via-surface to-accent/[0.07] ${className ?? ""}`}
      >
        {/* 左侧品牌竖线：hover 点亮 */}
        <span
          className="bg-accent absolute inset-y-0 left-0 w-[3px] origin-center scale-y-25 opacity-0 transition-[transform,opacity] duration-200 ease-base group-hover:scale-y-100 group-hover:opacity-100"
          aria-hidden
        />

        <div className="flex h-full gap-3.5 p-3.5 md:gap-4 md:p-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Tag>{post.category}</Tag>
              {post.pinned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  <span className="icon-[mdi--pin] size-3.5" aria-hidden />
                  置顶
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 text-lg font-semibold transition-colors duration-200 ease-base group-hover:text-accent">
              {post.title}
            </h3>

            <p className="text-text-muted mt-1 line-clamp-2 text-sm leading-relaxed">
              {post.description}
            </p>

            <div className="text-text-muted mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="icon-[mdi--calendar-outline] size-4" aria-hidden />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="icon-[mdi--clock-outline] size-4" aria-hidden />
                {post.readingMinutes} 分钟
              </span>
              <span
                className="text-accent ml-auto -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 ease-base group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden
              >
                <span className="icon-[mdi--arrow-right] size-4" />
              </span>
            </div>
          </div>

          {post.cover ? (
            <span className="border-border/60 w-28 shrink-0 self-center overflow-hidden rounded-[calc(var(--radius-md)-4px)] border md:w-56">
              <img
                src={post.cover}
                alt=""
                width={840}
                height={525}
                loading="lazy"
                className="aspect-[16/10] h-full w-full object-cover transition-transform duration-300 ease-base group-hover:scale-[1.04]"
              />
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
