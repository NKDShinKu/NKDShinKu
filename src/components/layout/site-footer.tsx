import { siteConfig } from "@/lib/site.config";

/**
 * 全站页脚（占位实现）
 * 设计阶段定稿后按设计系统重做。
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.author} · {siteConfig.name}
        </p>
        <p>
          由 <span className="font-medium text-text">Next.js</span> 构建 · 部署于{" "}
          <span className="font-medium text-text">GitHub Pages</span>
        </p>
      </div>
    </footer>
  );
}
