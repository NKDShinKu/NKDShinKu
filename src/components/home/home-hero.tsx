"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/lib/site.config";

gsap.registerPlugin(useGSAP);

/**
 * 首页全屏 Hero（用户决策：满屏首屏 + 居中标题，滚动进入正文）
 *
 * - 无背景图（多版背景方案效果不达预期，已移除）：透出全局极光与萤火背景
 * - 入场：GSAP timeline（§3.3）；prefers-reduced-motion 下不动画，内容直接可见
 */
export function HomeHero() {
  const scope = useRef<HTMLElement>(null);
  const { title, subtitle } = siteConfig.hero;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-badge]", { opacity: 0, y: 16, duration: 0.35 })
          .from("[data-hero-title]", { opacity: 0, y: 24, duration: 0.5 }, "-=0.1")
          .from("[data-hero-desc]", { opacity: 0, y: 24, duration: 0.45 }, "-=0.25")
          .from("[data-hero-scroll]", { opacity: 0, duration: 0.3 }, "-=0.15");
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative flex min-h-dvh items-center justify-center">
      {/* 内容：居中（用户决策） */}
      <div className="relative mx-auto w-full max-w-[1100px] px-5 pt-32 pb-20 text-center sm:px-6">
        <p
          data-hero-badge
          className="bg-accent/10 text-accent-dark inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium"
        >
          <span className="icon-[mdi--star-four-points-outline] size-3.5" aria-hidden />
          天空 · 夜空
        </p>

        <h1
          data-hero-title
          className="mt-5 text-[clamp(2.4rem,6vw,3.5rem)] leading-[1.15] font-bold tracking-[-0.03em] [text-wrap:balance]"
        >
          <span className="from-accent to-twilight bg-gradient-to-br bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p
          data-hero-desc
          className="text-text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed whitespace-pre-line md:text-lg"
        >
          {subtitle}
        </p>

        {/* 原生锚点：平滑滚动走 CSS scroll-behavior（reduced-motion 下自动降级）；样式沿用原滚动指示器 */}
        <a
          data-hero-scroll
          href="#home-content"
          className="text-text-muted hover:text-accent focus-visible:outline-accent mt-12 inline-flex flex-col items-center gap-1 rounded-md text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span
            className="icon-[mdi--chevron-down] motion-safe:animate-bounce-soft mx-auto block size-5"
            aria-hidden
          />
          向下滚动探索
        </a>
      </div>
    </section>
  );
}
