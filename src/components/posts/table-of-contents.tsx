"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";

type TocProps = {
  headings: Heading[];
};

/**
 * 文章目录侧栏（REQ-P6）—— design-system/posts.md §2.7
 *
 * - scrollspy：IntersectionObserver 检测视口内当前 h2/h3（取最后一个进入的标题，
 *   顶部补偿 sticky 顶栏高度），命中项左边线高亮 + aria-current
 * - 点击目录项：平滑滚动 + replaceState 更新 URL hash——位置跳转不进历史栈，
 *   「返回」始终回到上一页面（用户决策）；复制的锚点链接不受影响
 * - 纯增强：标题来自构建期数据，无 JS 时侧栏仍可点击跳转（仅无高亮）
 * - reduced-motion 无需特判：scrollIntoView() 缺省行为跟随 CSS scroll-behavior
 */
export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) return;
    heading.scrollIntoView();
    window.history.replaceState(null, "", `#${id}`);
    // 键盘可达：焦点移至目标标题（不触发二次滚动）
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  };

  useEffect(() => {
    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 视口内最靠上的可见标题为当前节
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const el of headingEls) observer.observe(el);
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="目录" className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto">
        <p className="text-accent-dark mb-3 text-xs font-bold tracking-widest uppercase">目录</p>
        <ul className="space-y-1 border-border/60 border-l">
          {headings.map((heading) => {
            const active = heading.id === activeId;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={active ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToHeading(heading.id);
                  }}
                  className={`focus-visible:outline-accent -ml-px block border-l-2 py-1.5 pr-2 text-sm leading-snug transition-[border-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    heading.level === 3 ? "pl-7" : "pl-4"
                  } ${
                    active
                      ? "border-accent text-accent-dark font-medium"
                      : "border-transparent text-text-muted hover:text-accent"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
