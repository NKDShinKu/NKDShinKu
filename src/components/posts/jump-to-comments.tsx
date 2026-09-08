"use client";

import { COMMENTS_FOCUS_EVENT } from "@/components/posts/post-comments";

/** 展开后布局稳定等待（giscus 展开/iframe 加载撑高文档需要一帧以上） */
const EXPAND_SETTLE_MS = 400;

/**
 * 浮动评论按钮（用户需求，参考博客交互）：固定于回顶部按钮上方，
 * 点击先广播事件展开评论区、等布局稳定（文档被撑高、产生足够滚动余量）
 * 再平滑滚动到位——顺序不可颠倒：折叠态评论区位于 maxScroll 之外，先滚永远滚不到。
 * 仅文章页挂载；reduced-motion 下瞬时滚动。
 */
export function JumpToComments() {
  const onClick = () => {
    const target = document.getElementById("comments");
    if (!target) return;
    window.dispatchEvent(new Event(COMMENTS_FOCUS_EVENT));
    const scroll = () =>
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    window.setTimeout(scroll, EXPAND_SETTLE_MS);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="跳到评论区"
      className="border-border bg-surface/80 text-text focus-visible:outline-accent hover:border-accent hover:text-accent fixed right-5 bottom-[9.5rem] z-40 grid size-12 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur-sm transition-[border-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 xl:bottom-[5.25rem]"
    >
      <span className="icon-[mdi--comment-text-outline] size-5" aria-hidden />
    </button>
  );
}
