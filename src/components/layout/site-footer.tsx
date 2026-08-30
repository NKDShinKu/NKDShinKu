import { siteConfig } from "@/lib/site.config";

/**
 * 全站页脚：站点信息 + 版权 + 社交/联系入口（REQ-G1，用户决策：板块链接改社交图标）。
 */
export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-text-muted mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* 年份在构建期固化为构建当年；静态导出无运行时，靠持续重建保持新鲜 */}
          <p>
            © {new Date().getFullYear()} {siteConfig.author} · {siteConfig.name}
          </p>
          <p className="mt-1 text-xs">
            由 <span className="text-text font-medium">Next.js</span> 构建 · 部署于{" "}
            <span className="text-text font-medium">GitHub Pages</span>
          </p>
        </div>
        <ul className="flex items-center gap-1">
          {siteConfig.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={
                  social.href.startsWith("http://") || social.href.startsWith("https://")
                    ? "_blank"
                    : undefined
                }
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                className="text-text-muted hover:bg-accent/10 hover:text-accent ease-fast focus-visible:outline-accent flex size-11 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className={`${social.icon} size-5`} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
