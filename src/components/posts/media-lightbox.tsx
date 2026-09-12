"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "mermaid"; svg: string; naturalW: number; naturalH: number };

const MAX_SCALE = 5;
const DRAG_THRESHOLD = 3;
// 屏幕适配交给 CSS（初始状态恒为「适应窗口」，零挂载时序依赖），transform 只承载交互
const FIT_IMG_STYLE: CSSProperties = {
  maxWidth: "calc(100vw - 48px)",
  maxHeight: "calc(100vh - 48px)",
  width: "auto",
  height: "auto",
};
const FIT_SVG_STYLE = "max-width:calc(100vw - 48px);max-height:calc(100vh - 48px)";

/**
 * 媒体灯箱（REQ-P8）：正文图片与 Mermaid 图表点击后全屏查看大图。
 *
 * - 事件委托挂在 document：`.post-body img` 与 `.mermaid-slot svg` 点击即开灯箱
 * - 尺寸策略（关键）：屏幕适配交给 CSS max 约束——初始状态恒为「适应窗口」，
 *   打开时刻的任何挂载/布局时序都不影响正确性；transform 只承载用户缩放/平移交互
 * - 查看器：滚轮缩放（以光标为锚点）、拖拽平移、双击在「适应窗口 ↔ 1:1」间切换，
 *   工具栏提供 −/百分比/＋/适应/1:1；Mermaid 以 viewBox 原始尺寸渲染（矢量不糊）
 * - 无障碍：Radix Dialog 焦点圈定 + Esc 关闭 + 滚动锁定；alt 作为标题与图注
 * - 移动端：单指拖动可用，双指捏合未实现（用工具栏按钮缩放）
 */
export function MediaLightbox() {
  const [media, setMedia] = useState<Media | null>(null);
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const draggedRef = useRef(false);
  const naturalRef = useRef(1); // 原始尺寸 / CSS 适配尺寸，1:1 按钮据此换算倍率

  // 事件委托：图片与 mermaid svg 点击即开灯箱（preventDefault 阻断图片外层链接的导航）
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img = target.closest<HTMLImageElement>(".post-body img");
      const svg = target.closest<SVGSVGElement>(".mermaid-slot svg");
      if (img?.getAttribute("src")) {
        e.preventDefault();
        setT({ s: 1, x: 0, y: 0 });
        naturalRef.current = 1;
        setMedia({ kind: "image", src: img.getAttribute("src") ?? "", alt: img.alt });
      } else if (svg) {
        e.preventDefault();
        // viewBox 为原始坐标系；缺失时以当前显示尺寸兜底
        const vb = svg.viewBox?.baseVal;
        const rect = svg.getBoundingClientRect();
        const w = Math.round(vb?.width || rect.width);
        const h = Math.round(vb?.height || rect.height);
        // 注入前写入自然尺寸 + CSS 屏幕适配约束（CSS 会压过 width/height 属性）
        const prepared = svg.outerHTML.replace(
          /\s?style="[^"]*"/,
          ` style="width:${w}px;height:${h}px;${FIT_SVG_STYLE}"`,
        );
        setT({ s: 1, x: 0, y: 0 });
        naturalRef.current = w;
        setMedia({ kind: "mermaid", svg: prepared, naturalW: w, naturalH: h });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const cx0 = () => (viewportRef.current?.clientWidth ?? 0) / 2;
  const cy0 = () => (viewportRef.current?.clientHeight ?? 0) / 2;

  /** 以视口内某点为锚点缩放（useCallback：滚轮监听 effect 的依赖，避免每次渲染重挂监听） */
  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    const viewport = viewportRef.current;
    setT((prev) => {
      const ns = Math.min(MAX_SCALE, Math.max(0.1, prev.s * factor));
      const k = ns / prev.s;
      const centerX = (viewport?.clientWidth ?? 0) / 2;
      const centerY = (viewport?.clientHeight ?? 0) / 2;
      return {
        s: ns,
        x: (cx - centerX) * (1 - k) + prev.x * k,
        y: (cy - centerY) * (1 - k) + prev.y * k,
      };
    });
  }, []);

  // 滚轮缩放（非 passive 才能阻止页面滚动）
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !media) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [media, zoomAt]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = { px: e.clientX, py: e.clientY, x: t.x, y: t.y };
    draggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    // 位移超阈值标记为拖拽：释放后浏览器合成的 click 会被吞掉（防止误关灯箱）
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) draggedRef.current = true;
    setT((prev) => ({ ...prev, x: d.x + dx, y: d.y + dy }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const applyFit = () => setT({ s: 1, x: 0, y: 0 });
  const applyOneToOne = () => {
    // 原始尺寸 / 当前 CSS 适配尺寸 = 需要的放大倍率
    const rect = contentRef.current?.getBoundingClientRect();
    const current = rect?.width ?? 0;
    setT({ s: current > 0 ? naturalRef.current / current : 1, x: 0, y: 0 });
  };

  const title = media?.kind === "image" ? media.alt || "查看大图" : "查看图表大图";
  const caption =
    media?.kind === "image" && media.alt ? media.alt : "滚轮缩放 · 拖动平移 · 双击 1:1";

  return (
    <Dialog.Root open={media !== null} onOpenChange={(open) => !open && setMedia(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-bg/80 fixed inset-0 z-[70] backdrop-blur-sm" />
        <Dialog.Content
          aria-label={title}
          className="fixed inset-0 z-[70] outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            滚轮或按钮缩放，拖动平移，Esc 关闭。
          </Dialog.Description>

          {/* 查看区：grid 居中（初始/适应态由布局与 CSS max 约束保证），点击空白处关闭 */}
          <div
            ref={viewportRef}
            className="absolute inset-0 grid place-items-center overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDoubleClick={applyOneToOne}
            onClick={(e) => {
              // 拖拽结束合成的 click 不视为「点击空白」
              if (draggedRef.current) {
                draggedRef.current = false;
                return;
              }
              if (e.target === e.currentTarget) setMedia(null);
            }}
          >
            {media ? (
              <div
                ref={contentRef}
                className="max-w-none select-none"
                style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})` }}
                onClick={(e) => e.stopPropagation()}
              >
                {media.kind === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- 灯箱展示远程原图；屏幕适配由 CSS max 约束，交互缩放由 transform 承载 */
                  <img
                    src={media.src}
                    alt={media.alt}
                    draggable={false}
                    style={FIT_IMG_STYLE}
                    className="block select-none"
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: media.svg }} />
                )}
              </div>
            ) : null}
          </div>

          {/* 工具栏 */}
          <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-white backdrop-blur-sm">
            <button
              type="button"
              aria-label="缩小"
              onClick={() => zoomAt(cx0(), cy0(), 1 / 1.25)}
              className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--minus] size-5" aria-hidden />
            </button>
            <span className="w-12 text-center text-xs font-medium tabular-nums">
              {Math.round(t.s * 100)}%
            </span>
            <button
              type="button"
              aria-label="放大"
              onClick={() => zoomAt(cx0(), cy0(), 1.25)}
              className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--plus] size-5" aria-hidden />
            </button>
            <span className="mx-1 h-5 w-px bg-white/20" aria-hidden />
            <button
              type="button"
              aria-label="适应窗口"
              onClick={applyFit}
              className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--fit-to-page-outline] size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="原始尺寸"
              onClick={applyOneToOne}
              className="grid h-9 cursor-pointer place-items-center rounded-full px-2 text-xs font-medium transition-colors hover:bg-white/15"
            >
              1:1
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="关闭"
                className="ml-1 grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
              >
                <span className="icon-[mdi--close] size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          {/* 图注 */}
          <p className="absolute bottom-4 left-1/2 z-10 max-w-[80%] -translate-x-1/2 truncate rounded-full bg-black/55 px-3 py-1 text-xs text-white/90">
            {caption}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
