"use client";

import { useEffect } from "react";

/**
 * 代码块复制按钮（REQ-P5）—— 全局事件委托，一个组件服务整页所有代码块。
 *
 * - rehype-pretty-code 输出 `<figure data-rehype-pretty-code-figure><pre>…`，
 *   此组件构建期注入复制按钮到每个 figure，点击复制 pre>code 文本
 * - 成功反馈：图标切 ✓ + aria-live 状态文字，800ms 复位
 * - 纯增强：JS 不可用时无按钮，代码块仍完整可读
 */
export function CodeCopyButtons() {
  useEffect(() => {
    const root = document.querySelector(".post-body");
    if (!root) return;

    const figures = root.querySelectorAll<HTMLElement>(
      "figure[data-rehype-pretty-code-figure]",
    );
    const cleanups: (() => void)[] = [];

    for (const figure of figures) {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "code-copy-btn focus-visible:outline-accent absolute top-2 right-2 z-10 inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-text-muted transition-[border-color,color] duration-150 ease-out cursor-pointer hover:border-accent hover:text-accent";
      button.setAttribute("aria-label", "复制代码");
      button.innerHTML =
        '<span class="icon-[mdi--content-copy] size-4" aria-hidden="true"></span>';

      const onCopy = async () => {
        const code = figure.querySelector("pre code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          return; // 剪贴板权限被拒等：保持静默，不弹错误
        }
        button.innerHTML =
          '<span class="icon-[mdi--check] size-4" aria-hidden="true"></span><span class="sr-only">已复制</span>';
        button.setAttribute("aria-label", "已复制");
        window.setTimeout(() => {
          button.innerHTML =
            '<span class="icon-[mdi--content-copy] size-4" aria-hidden="true"></span>';
          button.setAttribute("aria-label", "复制代码");
        }, 800);
      };

      button.addEventListener("click", onCopy);
      figure.appendChild(button);
      cleanups.push(() => {
        button.removeEventListener("click", onCopy);
        button.remove();
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
