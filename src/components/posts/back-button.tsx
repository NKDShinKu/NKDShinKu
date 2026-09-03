"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  /** 无历史记录时（直接落地/新标签打开）的兜底地址 */
  fallbackHref: string;
};

/**
 * 返回上一页按钮（用户决策：替代「返回全部文章」固定链接）。
 * history.length > 1 才回退，否则兜底跳转；服务端渲染为纯按钮，无水合前不可点（可接受）。
 */
export function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="text-text-muted hover:text-accent focus-visible:outline-accent inline-flex cursor-pointer items-center gap-1 rounded-md text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
      返回
    </button>
  );
}
