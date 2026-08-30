"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/lib/site.config";

gsap.registerPlugin(useGSAP);

/** 首页 hero（REQ-H1）：徽章 + 渐变标题 + 简介 + 滚动提示；GSAP 入场（§3.3，reduced-motion 下不动画） */
export function HomeHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-hero-badge]", { opacity: 0, y: 16, duration: 0.35 })
          .from("[data-hero-title]", { opacity: 0, y: 24, duration: 0.5 }, "-=0.1")
          .from("[data-hero-desc]", { opacity: 0, y: 24, duration: 0.45 }, "-=0.25")
          .from("[data-hero-scroll]", { opacity: 0, duration: 0.3 }, "-=0.15");
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="flex flex-col items-center pt-14 pb-12 text-center md:pt-20 md:pb-16"
    >
      <span
        data-hero-badge
        className="bg-accent/10 text-accent-dark inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium"
      >
        <span className="icon-[mdi--star-four-points-outline] size-3.5" aria-hidden />
        天空 · 夜空
      </span>

      <h1
        data-hero-title
        className="mt-5 text-[clamp(2.4rem,6vw,3.5rem)] leading-[1.15] font-bold tracking-[-0.03em]"
      >
        <span className="from-accent to-twilight bg-gradient-to-br bg-clip-text text-transparent">
          {siteConfig.name}
        </span>
      </h1>

      <p
        data-hero-desc
        className="text-text-muted mt-4 max-w-xl text-base leading-relaxed md:text-lg"
      >
        前端开发者 · 二次元爱好者，探索技术与创作的边界。
        <br />
        这里记录我的文章、项目与追番足迹。
      </p>

      <div data-hero-scroll className="text-text-muted mt-12 text-xs">
        <span
          className="icon-[mdi--chevron-down] motion-safe:animate-bounce-soft mx-auto block size-5"
          aria-hidden
        />
        向下滚动探索
      </div>
    </section>
  );
}
