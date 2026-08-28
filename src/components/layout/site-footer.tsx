import { siteConfig } from "@/lib/site.config";

/**
 * 全站页脚（占位实现）
 * 设计阶段定稿后按设计系统重做。
 */
export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-between gap-2 px-6 py-8 text-sm sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.author} · {siteConfig.name}
        </p>
        <p>
          由 <span className="text-foreground font-medium">Next.js</span> 构建 · 部署于{" "}
          <span className="text-foreground font-medium">GitHub Pages</span>
        </p>
      </div>
    </footer>
  );
}
