"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** 兜底：点击没有引发路由变化时收掉进度条 */
const SAFETY_TIMEOUT_MS = 4000;
/** 与 globals.css 里 done 阶段淡出时长对齐 */
const FADE_OUT_MS = 260;

type Phase = "idle" | "loading" | "done";

/** 只跟踪会引发站内路由变化的左键点击（外链 / 新窗口 / 下载 / 纯 hash / 同页都跳过） */
function isTrackableNavigation(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  // 同页（含仅 hash 变化）不显示进度
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }
  return true;
}

function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /** 开始加载时所在的「路由键」（pathname + query）；null = 空闲 */
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const safetyRef = useRef(0);

  const routeKey = `${pathname}?${searchParams.toString()}`;
  /**
   * 阶段是派生出来的（不在 effect 里同步 setState，见 react-hooks/set-state-in-effect）：
   * pendingRoute 为空 → 空闲；仍等于当前路由 → 等待中；已经不等 → 切过去了，收尾。
   */
  const phase: Phase =
    pendingRoute === null ? "idle" : pendingRoute === routeKey ? "loading" : "done";

  // 捕获阶段监听：Next 的 <Link> 与正文里的原生 <a> 都能覆盖
  //（bubble 阶段会被 Link 的 preventDefault 挡掉判定，故用 capture）
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !isTrackableNavigation(event, anchor)) return;

      const startedRoute = `${window.location.pathname}?${window.location.search.replace(/^\?/, "")}`;
      window.clearTimeout(safetyRef.current);
      setPendingRoute(startedRoute);
      // 兜底：点击没有引发路由变化时把进度条收回
      safetyRef.current = window.setTimeout(() => {
        setPendingRoute((current) => (current === startedRoute ? null : current));
      }, SAFETY_TIMEOUT_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(safetyRef.current);
    };
  }, []);

  // done → 淡出结束后归位（setState 在定时器回调里，不在 effect 体内）
  useEffect(() => {
    if (phase !== "done") return;
    const timer = window.setTimeout(() => setPendingRoute(null), FADE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return <div className="route-progress" data-phase={phase} aria-hidden="true" />;
}

/**
 * 路由切换进度条（体验优化 P0）：点击站内链接立即亮起，路由 commit 后冲到 100% 再淡出。
 * 静态导出没有 router 事件，故用「点击 + 路由变化」两端夹住；`useSearchParams` 需 Suspense 边界。
 */
export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBar />
    </Suspense>
  );
}
