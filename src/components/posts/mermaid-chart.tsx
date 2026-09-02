"use client";

import { useEffect } from "react";

/**
 * Mermaid 图表渲染器（REQ-P12）—— design-system/posts.md「Mermaid 卡」
 *
 * 懒加载策略（D12）：管线把 ```mermaid 代码块替换为 .mermaid-slot 占位 div
 * （data-mermaid 携带源码）；本组件扫描占位并动态 import mermaid（~300KB 级，
 * 不进公共 bundle），渲染为静态 SVG。跟随亮/暗主题重渲染（命令式，不经 React state）。
 */
export function MermaidRenderer() {
  useEffect(() => {
    const slots = Array.from(document.querySelectorAll<HTMLElement>(".mermaid-slot"));
    if (slots.length === 0) return;

    let cancelled = false;
    let renderId = 0;
    let mermaid: (typeof import("mermaid"))["default"] | null = null;

    const renderAll = async () => {
      if (!mermaid) return;
      const isDark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: isDark ? "dark" : "default",
        fontFamily: "var(--font-sans)",
      });
      for (const [index, slot] of slots.entries()) {
        const code = slot.dataset.mermaid ?? "";
        try {
          const { svg } = await mermaid.render(`mermaid-${index}-${++renderId}`, code);
          if (cancelled) return;
          slot.innerHTML = svg;
          slot.removeAttribute("aria-busy");
        } catch {
          if (cancelled) return;
          slot.textContent = "图表渲染失败，请检查 mermaid 语法。";
          slot.removeAttribute("aria-busy");
        }
      }
    };

    (async () => {
      mermaid = (await import("mermaid")).default;
      if (!cancelled) await renderAll();
    })();

    // 主题切换只改 html.dark class，监听它重渲染
    const themeObserver = new MutationObserver(() => {
      if (!cancelled) void renderAll();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      themeObserver.disconnect();
    };
  }, []);

  return null;
}
