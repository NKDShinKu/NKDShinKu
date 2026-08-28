import Link from "next/link";
import { siteConfig } from "@/lib/site.config";

/**
 * 全站页头（占位实现）
 * 设计阶段定稿后按设计系统重做；现在仅保证布局骨架可用。
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-text transition-colors hover:text-brand"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-2">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 仓库"
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-brand/10 hover:text-brand"
          >
            <span className="icon-[mdi--github] size-5" aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}
