"use client";

import { useEffect, useState } from "react";

/** 滚过约半屏后出现（px） */
const SHOW_AFTER = 480;
const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;

/**
 * 回到顶部悬浮按钮（用户需求）：环形进度实时展示滚动百分比，
 * hover 切换为回顶图标，点击回顶（滚动行为跟随 CSS scroll-behavior，reduced-motion 自动降级）。
 * 进度更新走 rAF 节流；只动 transform/opacity/stroke-dashoffset。
 */
export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setProgress(p);
      setVisible(window.scrollY > SHOW_AFTER);
    };
    raf = requestAnimationFrame(update);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="回到顶部"
      className={`group border-border bg-surface/80 text-text shadow-md backdrop-blur-sm focus-visible:outline-accent hover:border-accent hover:text-accent fixed right-5 bottom-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border transition-[opacity,transform,border-color,color] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r={RING_R}
          fill="none"
          stroke="currentColor"
          className="text-border/60"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r={RING_R}
          fill="none"
          stroke="currentColor"
          className="text-accent transition-[stroke-dashoffset] duration-150 ease-out"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={RING_C * (1 - progress)}
        />
      </svg>
      <span className="text-xs font-semibold tabular-nums transition-opacity duration-150 group-hover:opacity-0">
        {Math.round(progress * 100)}%
      </span>
      <span
        className="icon-[mdi--arrow-up] absolute size-5 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:opacity-100"
        aria-hidden
      />
    </button>
  );
}
