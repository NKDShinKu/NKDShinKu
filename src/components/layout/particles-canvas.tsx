"use client";

import { useEffect, useRef } from "react";

/**
 * 萤火/星点粒子背景（与 design-system-preview 同源，design-system.md §3.2 允许的装饰）：
 * ~60 颗缓慢漂移（移动端减半），亮暗两套颜色；prefers-reduced-motion 下不启动并隐藏。
 * 画布按 devicePixelRatio 缩放（上限 2×）保证高分屏清晰，resize 走 rAF 防抖，页面隐藏时暂停 rAF。
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      // 坐标系保持 CSS 像素，绘制按 dpr 缩放，避免高分屏发虚
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // resize 防抖：合并在同一帧内执行
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize);

    const count = window.innerWidth < 768 ? 30 : 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let raf = 0;
    const animate = () => {
      if (document.hidden) return; // 切后台不调度下一帧，由 visibilitychange 恢复
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const color = document.documentElement.classList.contains("dark")
        ? "180,200,240"
        : "91,143,212";
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onVisibility = () => {
      if (!document.hidden) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-60 motion-reduce:hidden"
    />
  );
}
