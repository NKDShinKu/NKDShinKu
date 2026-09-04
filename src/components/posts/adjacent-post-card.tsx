"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AdjacentPostCardProps = {
  label: string;
  post: { slug: string; title: string } | null;
  align: "left" | "right";
};

/**
 * 上一篇 / 下一篇（§2.8）—— 同一阅读会话内的换页：左键 `router.replace` 跳转，
 * **不进历史栈**（D13 补充，用户决策），详情页「返回」一步退出文章区；
 * 保留 `<a>` 语义，中键 / 新标签打开仍可用。无文章时禁用态占位。
 */
export function AdjacentPostCard({ label, post, align }: AdjacentPostCardProps) {
  const router = useRouter();
  const href = post ? `/posts/${post.slug}/` : "/posts/";

  return (
    <Link
      href={href}
      aria-disabled={!post}
      onClick={(event) => {
        if (!post) return;
        event.preventDefault();
        router.replace(href);
      }}
      className={`focus-visible:outline-accent block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 ${
        align === "right" ? "sm:text-right" : ""
      } ${post ? "" : "pointer-events-none opacity-40"}`}
    >
      <div className="border-border bg-surface hover:border-accent/60 hover:shadow-lg rounded-md border p-4 transition-[border-color,box-shadow] duration-200 ease-base">
        <p className="text-text-muted inline-flex items-center gap-1 text-xs">
          {align === "left" ? (
            <span className="icon-[mdi--chevron-left] size-4" aria-hidden />
          ) : null}
          {label}
          {align === "right" ? (
            <span className="icon-[mdi--chevron-right] size-4" aria-hidden />
          ) : null}
        </p>
        <p className="mt-1 text-base font-medium">{post ? post.title : "暂无更多文章"}</p>
      </div>
    </Link>
  );
}
