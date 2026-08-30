"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site.config";

function isActive(pathname: string, href: string): boolean {
  return pathname.startsWith(href);
}

/** 顶栏文字导航（hover/active 均 text-accent；移动端收纳进汉堡菜单，故 md 以下隐藏） */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-5 md:flex">
      {siteConfig.nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`text-text-muted hover:text-accent ease-fast focus-visible:outline-accent rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${active ? "text-accent" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
