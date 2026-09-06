"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type HScrollProps = {
  children: ReactNode;
  /** 滚动容器类名（横滚布局类由调用方传入） */
  className?: string;
  testId?: string;
};

/**
 * 横滚容器 + 覆盖式滚动条（通用原语，acg.md §2.1）
 *
 * - 原生滚动条隐藏（.no-scrollbar），自绘拇指绝对悬浮于容器底部——零布局位移
 * - 悬停 / 键盘聚焦 / 拖拽时 200ms 渐显；无横向溢出时完全不渲染
 * - 拇指可拖拽；滚轮 / 触摸仍走原生滚动
 */
export function HScroll({ children, className, testId }: HScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, startScroll: 0, thumbW: 0 });
  const [metrics, setMetrics] = useState({ hasOverflow: false, thumbW: 0, x: 0 });
  const [active, setActive] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    const trackW = trackRef.current?.clientWidth ?? 0;
    const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    setMetrics({
      hasOverflow,
      thumbW: Math.max(40, Math.round(trackW * ratio)),
      x: Math.round((el.scrollLeft / el.scrollWidth) * trackW),
    });
  }, []);

  // 容器与内容尺寸变化（含封面图加载）都要重算
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    event.preventDefault();
    dragState.current = {
      startX: event.clientX,
      startScroll: el.scrollLeft,
      thumbW: metrics.thumbW,
    };
    setActive(true);
    const onMove = (ev: PointerEvent) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const trackW = track.clientWidth - dragState.current.thumbW;
      if (trackW <= 0) return;
      const delta = ((ev.clientX - dragState.current.startX) / trackW) * maxScroll;
      el.scrollLeft = Math.min(Math.max(dragState.current.startScroll + delta, 0), maxScroll);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      className="relative"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div
        ref={scrollRef}
        onScroll={update}
        className={`no-scrollbar overflow-x-auto ${className ?? ""}`}
        data-testid={testId}
      >
        {children}
      </div>

      {/* 覆盖式滚动条：absolute 悬浮（零布局位移），hover/focus/拖拽渐显 */}
      <div
        ref={trackRef}
        aria-hidden
        className={`pointer-events-none absolute inset-x-4 bottom-1 h-1.5 transition-opacity duration-200 ${
          active && metrics.hasOverflow ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-border/40 h-full w-full rounded-full" />
        <div
          onPointerDown={startDrag}
          className="bg-border/90 hover:bg-text-muted/90 pointer-events-auto absolute top-0 h-full cursor-grab rounded-full transition-colors duration-150 active:cursor-grabbing"
          style={{ width: metrics.thumbW, left: metrics.x }}
        />
      </div>
    </div>
  );
}
