"use client";

import { useEffect } from "react";

/**
 * 正文标题锚点增强（REQ-P6 附带；同 CodeCopyButtons 的委托模式）：
 *
 * 拦截 `.post-body` 内 `href^="#"` 锚点的默认跳转，改为平滑滚动 + replaceState——
 * 位置跳转不进历史栈，详情页「返回」始终回到上一页面（用户决策，方案 A）；
 * URL hash 仍同步当前标题，复制锚点链接、分享定位不受影响。
 * JS 不可用时锚点退化为原生跳转（功能可用，仅历史栈会多记录）。
 */
export function AnchorScroll() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".post-body");
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || !root.contains(anchor)) return;
      const id = decodeURIComponent(anchor.hash.slice(1));
      const heading = document.getElementById(id);
      if (!heading) return;
      event.preventDefault();
      heading.scrollIntoView();
      window.history.replaceState(null, "", `#${id}`);
      // 键盘可达：焦点移至目标标题（不触发二次滚动）
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return null;
}
