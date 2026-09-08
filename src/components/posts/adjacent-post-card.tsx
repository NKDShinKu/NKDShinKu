"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AdjacentPostCardProps = {
  label: string;
  post: { slug: string; title: string } | null;
  /**
   * desktop：对称玻璃短条（‹ 上一篇 / 下一篇 ›），hover/聚焦浮出标题气泡；
   * stacked：移动端抽屉形态——纵向全宽条，标题单行直显省略（触屏无 hover）。
   */
  variant?: "desktop" | "stacked";
};

/**
 * 上一篇 / 下一篇（§2.8 六版定稿）。换页走 `router.replace` 不进历史栈
 * （D13 补充，用户决策），保留 `<a>` 语义。无文章时禁用态。
 */
export function AdjacentPostCard({ label, post, variant = "desktop" }: AdjacentPostCardProps) {
  const router = useRouter();
  const href = post ? `/posts/${post.slug}/` : "/posts/";
  const isPrev = label === "上一篇";

  const linkClass = [
    "focus-visible:outline-accent group border-glass-border bg-glass backdrop-blur-[16px]",
    "hover:border-accent/50 focus-visible:border-accent/50 ease-base rounded-md border",
    "transition-[border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
    post ? "" : "pointer-events-none opacity-40",
    variant === "desktop"
      ? "relative flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-2 text-xs whitespace-nowrap"
      : "flex items-center gap-2 p-2.5",
  ].join(" ");

  return (
    <Link
      href={href}
      aria-label={post ? `${label}：${post.title}` : label}
      onClick={(event) => {
        if (!post) return;
        event.preventDefault();
        router.replace(href);
      }}
      className={linkClass}
    >
      {variant === "desktop" ? (
        <>
          <span
            className={`${
              isPrev ? "icon-[mdi--chevron-left]" : "icon-[mdi--chevron-right] order-last"
            } text-text-muted group-hover:text-accent ease-fast size-4 shrink-0 transition-colors duration-150`}
            aria-hidden
          />
          <span className="text-text-muted group-hover:text-accent ease-fast font-medium transition-colors duration-150">
            {label}
          </span>
          {/* hover / focus 浮现的标题气泡：朝下展开不溢出右栏 */}
          {post ? (
            <span
              className={`border-border bg-surface text-text pointer-events-none absolute top-full z-10 mt-1.5 hidden rounded-md border px-2.5 py-1 text-xs whitespace-nowrap shadow-md group-hover:block group-focus-visible:block ${
                isPrev ? "left-0" : "right-0"
              } max-w-[220px] truncate`}
            >
              {post.title}
            </span>
          ) : null}
        </>
      ) : (
        /* 移动端抽屉形态：箭头 + 标签 + 标题单行直显省略 */
        <>
          <span
            className={`${
              isPrev ? "icon-[mdi--chevron-left]" : "icon-[mdi--chevron-right]"
            } text-text-muted group-hover:text-accent ease-fast size-4 shrink-0 transition-colors duration-150`}
            aria-hidden
          />
          <span className="text-text-muted shrink-0 text-xs font-medium">{label}</span>
          <span className="text-text group-hover:text-accent ease-fast min-w-0 flex-1 truncate text-sm transition-colors duration-150">
            {post ? post.title : "暂无更多文章"}
          </span>
        </>
      )}
    </Link>
  );
}
