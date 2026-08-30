import Link from "next/link";
import { siteConfig } from "@/lib/site.config";

/**
 * 全站页头（占位实现）
 * 设计阶段定稿后按设计系统重做；现在仅保证布局骨架可用。
 */
export function SiteHeader() {
  return (
    <header className="border-border/60 bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-text hover:text-accent text-lg font-bold tracking-tight transition-colors"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-2">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 仓库"
            className="text-text-muted focus-visible:outline-accent hover:bg-accent/10 hover:text-accent rounded-md p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="icon-[mdi--github] size-5" aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}
