"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site.config";

/**
 * 移动端汉堡菜单（REQ-G1）：顶栏下拉玻璃面板；点击链接 / Esc / 点击外部时收起。
 * 面板经 portal 挂到 body（fixed 定位对齐顶栏下方）：若作为带 backdrop-filter 的顶栏的
 * DOM 后代，其 backdrop 根会被顶栏截断，backdrop-blur 采样不到页面内容——表现为透明无模糊。
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const inRoot = rootRef.current?.contains(target) ?? false;
      const inPanel = panelRef.current?.contains(target) ?? false;
      if (!inRoot && !inPanel) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className="text-text-muted hover:text-accent ease-fast focus-visible:outline-accent flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className={`${open ? "icon-[mdi--close]" : "icon-[mdi--menu]"} size-5`} aria-hidden />
      </button>

      {open &&
        createPortal(
          <nav
            ref={panelRef}
            id="mobile-menu"
            aria-label="移动端导航"
            className="border-glass-border bg-glass fixed top-[72px] right-4 z-[60] w-44 rounded-lg border p-2 shadow-lg backdrop-blur-[16px]"
          >
            <ul>
              {siteConfig.nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`ease-fast focus-visible:outline-accent flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-text-muted hover:bg-accent/10 hover:text-accent"
                      }`}
                    >
                      <span className={`${item.icon} size-5`} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>,
          document.body,
        )}
    </div>
  );
}
