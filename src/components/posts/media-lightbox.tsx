"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";

/** 入场 FLIP 起点：位移相对视口中心，s 为相对「适应窗口」尺寸的比例 */
type Flip = { x: number; y: number; s: number };

/** 灯箱内容：图片（位图）或 Mermaid（矢量，保留原始 viewBox 尺寸） */
type Media =
  | {
      kind: "image";
      src: string;
      alt: string;
      naturalW: number;
      naturalH: number;
      flip: Flip | null;
    }
  | { kind: "mermaid"; svg: string; naturalW: number; naturalH: number; flip: Flip | null };

/** 交互变换：translate 在 scale 之前应用（与 CSS transform 顺序一致），基准点是元素中心 */
type ViewTransform = { s: number; x: number; y: number };

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const WHEEL_STEP = 1.15;
const BUTTON_STEP = 1.25;
const DOUBLE_CLICK_SCALE = 2;
const DRAG_THRESHOLD = 3;
const KEY_PAN_STEP = 40;
const IDENTITY: ViewTransform = { s: 1, x: 0, y: 0 };

// 屏幕适配交给 CSS（初始状态恒为「适应窗口」，零挂载时序依赖），transform 只承载交互
const FIT_IMG_STYLE: CSSProperties = {
  maxWidth: "calc(100vw - 48px)",
  maxHeight: "calc(100vh - 48px)",
  width: "auto",
  height: "auto",
};
const FIT_SVG_STYLE = "max-width:calc(100vw - 48px);max-height:calc(100vh - 48px)";
/** CSS 与 JS 共用的适配留白（FIT_* 里的 48px 即两侧各 24px） */
const FIT_MARGIN = 48;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 系统「减弱动态效果」：入场 FLIP 与所有过渡都跳过（AGENTS §3.4） */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * 入场 FLIP 起点：被点元素的位置与尺寸 → 相对视口中心 + 相对适应尺寸的比例。
 * 用「自然尺寸 + 视口」直接算适应尺寸，不依赖挂载后测量，因此任何重挂载都能重放。
 */
function computeFlip(
  origin: { x: number; y: number; width: number; height: number },
  naturalW: number,
  naturalH: number,
): Flip | null {
  if (prefersReducedMotion() || naturalW <= 0 || naturalH <= 0) return null;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const factor = Math.min(
    1,
    (viewportW - FIT_MARGIN) / naturalW,
    (viewportH - FIT_MARGIN) / naturalH,
  );
  const fittedW = naturalW * factor;
  if (fittedW <= 0) return null;
  return {
    x: origin.x + origin.width / 2 - viewportW / 2,
    y: origin.y + origin.height / 2 - viewportH / 2,
    s: clamp(origin.width / fittedW, MIN_SCALE, MAX_SCALE),
  };
}

/** 以视口内某点为锚点缩放：保持锚点下的内容不动（k 为新旧倍率之比） */
function zoomTransform(
  prev: ViewTransform,
  factor: number,
  anchorX: number,
  anchorY: number,
  viewportW: number,
  viewportH: number,
): ViewTransform {
  const s = clamp(prev.s * factor, MIN_SCALE, MAX_SCALE);
  const k = s / prev.s;
  return {
    s,
    x: (anchorX - viewportW / 2) * (1 - k) + prev.x * k,
    y: (anchorY - viewportH / 2) * (1 - k) + prev.y * k,
  };
}

/**
 * 媒体灯箱（REQ-P8）：正文图片与 Mermaid 图表点击后全屏查看大图。
 *
 * - 打开：document 事件委托命中 `.post-body img` / `.mermaid-slot svg`（preventDefault 阻断图片外层链接）
 * - 尺寸：初始「适应窗口」由 CSS max 约束保证；Mermaid 以 viewBox 原始尺寸注入，矢量不糊
 * - 交互：滚轮缩放（光标为锚点）、拖拽平移、双击在「适应窗口 ↔ 2x」间切换、
 *   `1` 键 / 工具栏 1:1 回原始像素、`0` 键适应窗口、方向键微调
 * - 动效：入场 FLIP 由 CSS 动画在独立舞台层执行（起点经 CSS 变量注入；变量缺失即原地落位，
 *   不会因重挂载/时序留残帧），Overlay 与面板淡入淡出；过渡只服务离散操作，
 *   滚轮与拖拽瞬时跟手；prefers-reduced-motion 下全部跳过
 * - 无障碍：Radix 焦点圈定 + Esc + 滚动锁定；打开后焦点落在面板（键盘操作可用、无可见焦点环）
 * - 移动端：单指拖动可用，双指捏合未实现（用工具栏按钮缩放）
 */
export function MediaLightbox() {
  const [media, setMedia] = useState<Media | null>(null);
  const [t, setT] = useState<ViewTransform>(IDENTITY);
  /** 离散操作（按钮/双击/键盘）走 transform 过渡；滚轮与拖拽必须跟手（瞬时） */
  const [smooth, setSmooth] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  /**
   * 单次指针手势的判定结果（pointerdown 记录、click 消费）：
   * moved = 位移超过阈值（判定为拖拽）；onBlank = 起点在空白区（决定 click 是否关闭灯箱）
   */
  const gestureRef = useRef({ moved: false, onBlank: false });

  /**
   * 平移边界：内容大于视口时可拖到自己的边缘（看细节）；小于视口时允许把中心拖到视口内任意处
   * （拖动始终自由，且内容不会整块移出视野）。
   */
  const clampPan = useCallback((next: ViewTransform): ViewTransform => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return next;
    const limitX = Math.max(
      (content.offsetWidth * next.s - viewport.clientWidth) / 2,
      viewport.clientWidth / 2,
    );
    const limitY = Math.max(
      (content.offsetHeight * next.s - viewport.clientHeight) / 2,
      viewport.clientHeight / 2,
    );
    return { s: next.s, x: clamp(next.x, -limitX, limitX), y: clamp(next.y, -limitY, limitY) };
  }, []);

  /** 以视口中心（或指定锚点）缩放；离散操作 → 带过渡 */
  const zoomAt = useCallback(
    (factor: number, anchor?: { x: number; y: number }) => {
      const viewport = viewportRef.current;
      const vw = viewport?.clientWidth ?? 0;
      const vh = viewport?.clientHeight ?? 0;
      setSmooth(true);
      setT((prev) =>
        clampPan(zoomTransform(prev, factor, anchor?.x ?? vw / 2, anchor?.y ?? vh / 2, vw, vh)),
      );
    },
    [clampPan],
  );

  // 事件委托：图片与 mermaid svg 点击即开灯箱（同时算出入场 FLIP 起点）
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const img = target.closest<HTMLImageElement>(".post-body img");
      const svg = target.closest<SVGSVGElement>(".mermaid-slot svg");

      if (img?.getAttribute("src")) {
        event.preventDefault();
        const rect = img.getBoundingClientRect();
        const naturalW = img.naturalWidth || Math.round(rect.width);
        const naturalH = img.naturalHeight || Math.round(rect.height);
        setSmooth(false);
        setT(IDENTITY);
        setMedia({
          kind: "image",
          src: img.getAttribute("src") ?? "",
          alt: img.alt,
          naturalW,
          naturalH,
          flip: computeFlip(rect, naturalW, naturalH),
        });
        return;
      }

      if (svg) {
        event.preventDefault();
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
        setSmooth(false);
        setT(IDENTITY);
        setMedia({
          kind: "mermaid",
          svg: prepared,
          naturalW: w,
          naturalH: h,
          flip: computeFlip(rect, w, h),
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /**
   * 滚轮缩放（非 passive 才能阻止页面滚动）。
   *
   * 用 callback ref 在真实节点挂载时绑定：Radix Portal 的内容晚于本组件 effect 挂载，
   * 早前写在 `useEffect([media])` 里取 `viewportRef.current` 会取到 null 并早退，
   * 且依赖不再变化 → 监听器永远挂不上（滚轮失效的根因）。
   */
  const bindViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      if (!node) return;
      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        const rect = node.getBoundingClientRect();
        const factor = event.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP;
        setSmooth(false);
        setT((prev) =>
          clampPan(
            zoomTransform(
              prev,
              factor,
              event.clientX - rect.left,
              event.clientY - rect.top,
              node.clientWidth,
              node.clientHeight,
            ),
          ),
        );
      };
      node.addEventListener("wheel", onWheel, { passive: false });
      return () => node.removeEventListener("wheel", onWheel);
    },
    [clampPan],
  );

  // 视口尺寸变化后重新夹取（倍率不变，只保证平移边界合法）
  useEffect(() => {
    if (!media) return;
    const onResize = () => setT((prev) => clampPan(prev));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [media, clampPan]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    gestureRef.current = { moved: false, onBlank: event.target === event.currentTarget };
    dragRef.current = { px: event.clientX, py: event.clientY, x: t.x, y: t.y };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.px;
    const dy = event.clientY - drag.py;
    if (!gestureRef.current.moved) {
      if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) return;
      // 超阈值才夺取指针：pointerdown 即 capture 会让 pointerup/click 重定向到本元素，
      // 于是「单击内容区」被误判成点击空白 → 关灯箱，浏览器也不会再合成 dblclick
      gestureRef.current.moved = true;
      setSmooth(false);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setT((prev) => clampPan({ s: prev.s, x: drag.x + dx, y: drag.y + dy }));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  /** 点击空白区关闭；拖拽释放合成的 click 与内容区点击都不关闭 */
  const onClickViewport = () => {
    const gesture = gestureRef.current;
    if (gesture.moved) {
      gesture.moved = false;
      return;
    }
    if (gesture.onBlank) setMedia(null);
  };

  const applyFit = useCallback(() => {
    setSmooth(true);
    setT(IDENTITY);
  }, []);

  /** 1:1：自然像素 ÷ 当前布局宽度（图片用 naturalWidth，Mermaid 用 viewBox 宽） */
  const applyOneToOne = useCallback(() => {
    const content = contentRef.current;
    const current = content?.offsetWidth ?? 0;
    if (!media || !current) return;
    setSmooth(true);
    setT(clampPan({ s: clamp(media.naturalW / current, MIN_SCALE, MAX_SCALE), x: 0, y: 0 }));
  }, [media, clampPan]);

  /** 双击：适应窗口 ↔ 2x（1:1 交给 `1` 键与工具栏按钮） */
  const toggleDoubleClickZoom = useCallback(() => {
    setSmooth(true);
    setT((prev) =>
      prev.s > 1.01 ? clampPan({ ...IDENTITY }) : clampPan({ s: DOUBLE_CLICK_SCALE, x: 0, y: 0 }),
    );
  }, [clampPan]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    switch (event.key) {
      case "+":
      case "=":
        event.preventDefault();
        zoomAt(BUTTON_STEP);
        break;
      case "-":
      case "_":
        event.preventDefault();
        zoomAt(1 / BUTTON_STEP);
        break;
      case "0":
        event.preventDefault();
        applyFit();
        break;
      case "1":
        event.preventDefault();
        applyOneToOne();
        break;
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const dx =
          event.key === "ArrowLeft" ? -KEY_PAN_STEP : event.key === "ArrowRight" ? KEY_PAN_STEP : 0;
        const dy =
          event.key === "ArrowUp" ? -KEY_PAN_STEP : event.key === "ArrowDown" ? KEY_PAN_STEP : 0;
        setSmooth(true);
        setT((prev) => clampPan({ s: prev.s, x: prev.x + dx, y: prev.y + dy }));
        break;
      }
    }
  };

  const title = media?.kind === "image" ? media.alt || "查看大图" : "查看图表大图";
  const caption =
    media?.kind === "image" && media.alt ? media.alt : "滚轮缩放 · 拖动平移 · 双击放大";

  return (
    <Dialog.Root open={media !== null} onOpenChange={(open) => !open && setMedia(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay bg-bg/80 fixed inset-0 z-[70] backdrop-blur-sm" />
        <Dialog.Content
          ref={panelRef}
          tabIndex={-1}
          aria-label={title}
          className="lightbox-panel fixed inset-0 z-[70] outline-none"
          // 焦点落在面板本身（不是第一个按钮）：键盘快捷键可用且无可见焦点环
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            panelRef.current?.focus();
          }}
          onKeyDown={onKeyDown}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            滚轮或 +/− 缩放，拖动平移，双击放大，0 键适应窗口，1 键原始尺寸，Esc 关闭。
          </Dialog.Description>

          {/* 查看区：grid 居中（初始/适应态由布局与 CSS max 约束保证），点击空白处关闭 */}
          <div
            ref={bindViewport}
            className="absolute inset-0 grid touch-none place-items-center overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={toggleDoubleClickZoom}
            onClick={onClickViewport}
          >
            {media ? (
              /* 舞台层只承载入场 FLIP（CSS 动画）：变量缺失时起点即终点、不留残帧；
                 自身对指针透明——否则它固定的盒会盖住内容的空白区，出现
                 「图片拖走或缩小后，点原来那块空白关不掉灯箱」 */
              <div
                className="lightbox-stage pointer-events-none"
                style={
                  {
                    "--lightbox-flip-x": `${media.flip?.x ?? 0}px`,
                    "--lightbox-flip-y": `${media.flip?.y ?? 0}px`,
                    "--lightbox-flip-s": `${media.flip?.s ?? 1}`,
                  } as CSSProperties
                }
              >
                <div
                  ref={contentRef}
                  className={`lightbox-content pointer-events-auto max-w-none cursor-grab select-none active:cursor-grabbing ${
                    smooth ? "" : "lightbox-content--instant"
                  }`}
                  style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})` }}
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
              </div>
            ) : null}
          </div>

          {/* 工具栏 */}
          <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-white backdrop-blur-sm">
            <button
              type="button"
              aria-label="缩小"
              onClick={() => zoomAt(1 / BUTTON_STEP)}
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--minus] size-5" aria-hidden />
            </button>
            <span className="w-12 text-center text-xs font-medium tabular-nums">
              {Math.round(t.s * 100)}%
            </span>
            <button
              type="button"
              aria-label="放大"
              onClick={() => zoomAt(BUTTON_STEP)}
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--plus] size-5" aria-hidden />
            </button>
            <span className="mx-1 h-5 w-px bg-white/20" aria-hidden />
            <button
              type="button"
              aria-label="适应窗口"
              onClick={applyFit}
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <span className="icon-[mdi--fit-to-page-outline] size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="原始尺寸"
              onClick={applyOneToOne}
              className="grid h-11 cursor-pointer place-items-center rounded-full px-2.5 text-xs font-medium transition-colors hover:bg-white/15"
            >
              1:1
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="关闭"
                className="ml-1 grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
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
