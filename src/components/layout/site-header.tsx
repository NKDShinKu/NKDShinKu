import Link from "next/link";
import { siteConfig } from "@/lib/site.config";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * 全站页头：全宽 sticky 顶栏（常规博客形态，用户决策 D11，取代浮动玻璃药丸）。
 * 桌面：logo + 文字导航 + 主题切换；移动：logo + 主题切换 + 汉堡下拉菜单。
 */
export function SiteHeader() {
  return (
    <header className="border-border/60 bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-md">
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
