"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 入场延迟（秒），用于网格卡片的 stagger（§3.3：80–100ms/卡） */
  delay?: number;
  /** 轻量变体：位移与时长减半（文章卡等只需"一点点"入场的场景） */
  subtle?: boolean;
};

/** 滚动入场（design-system.md §3.3：600ms power2.out）；reduced-motion 下不动画、内容直接可见 */
export function Reveal({ children, className, delay = 0, subtle = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: subtle ? 12 : 24,
          duration: subtle ? 0.4 : 0.6,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
