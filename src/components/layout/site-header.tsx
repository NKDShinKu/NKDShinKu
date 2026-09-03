"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site.config";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * 全站页头：fixed 悬浮顶栏（D11 演进，见 manifest）
 *
 * - 非首页：玻璃实心底（原形态）
 * - 首页：首屏透明（Hero 顶部渐变遮罩垫底），滚动越过阈值后过渡为实心底（300ms）
 * - 文字配色两态一致（浅色遮罩方案，不切白字）
 */
export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    let raf = 0;
    const update = () => setScrolled(window.scrollY > 24);
    // 初始态经 rAF 异步校正（避免 effect 内同步 setState 级联渲染）
    raf = requestAnimationFrame(update);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onHome]);

  const transparent = onHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out ${
        transparent ? "border-transparent bg-transparent" : "border-border/60 bg-bg/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-display text-text hover:text-accent ease-fast focus-visible:outline-accent rounded-md text-lg font-bold tracking-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <NavLinks />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
