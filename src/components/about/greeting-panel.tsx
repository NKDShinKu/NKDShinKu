/* eslint-disable @next/next/no-img-element -- 头像为本地站点图标（O3 素材到位前兜底），
   显式宽高满足 REQ-G8；next/image 全局 unoptimized 下与原生 img 无差别（AGENTS §2） */
import { ABOUT_TAGLINE } from "@/lib/about";
import { siteConfig } from "@/lib/site.config";

const RSS_ENTRY = { label: "RSS 订阅", href: "/feed.xml", icon: "icon-[mdi--rss]" } as const;

const iconButtonClass =
  "text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex size-11 items-center justify-center rounded-full transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * 页头问候面板（about.md §2.2，2026-09 走查修订：品牌渐变玻璃卡）
 * 头像 + 一句话人设 + 社交/联系图标行（siteConfig.socials 单一来源 + RSS 订阅入口 REQ-F3）
 */
export function GreetingPanel() {
  const entries = [...siteConfig.socials, RSS_ENTRY];

  return (
    <div className="border-glass-border shadow-md flex flex-col gap-5 rounded-lg border bg-gradient-to-br from-accent/12 via-glass to-sakura/12 p-6 backdrop-blur-[16px] sm:flex-row sm:items-center md:p-8">
      {/* O3：用户头像素材到位后替换 src（站点 logo 兜底） */}
      <img
        src="/icon.svg"
        alt={`${siteConfig.author} 头像`}
        width={80}
        height={80}
        className="border-glass-border size-16 shrink-0 rounded-full border md:size-20"
      />
      <div className="min-w-0">
        <h1 className="font-display flex items-center gap-2 text-2xl font-bold md:text-3xl">
          你好，我是 {siteConfig.author}
          <span className="icon-[mdi--hand-wave] text-accent size-6 md:size-7" aria-hidden />
        </h1>
        <p className="text-text-muted mt-1.5 text-sm md:text-base">{ABOUT_TAGLINE}</p>

        <nav aria-label="社交与联系入口" className="mt-3 flex flex-wrap items-center gap-1">
          {entries.map((entry) => {
            const external = /^https?:\/\//.test(entry.href);
            return (
              <a
                key={entry.label}
                href={entry.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={entry.label}
                className={iconButtonClass}
              >
                <span className={`${entry.icon} size-5`} aria-hidden />
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
