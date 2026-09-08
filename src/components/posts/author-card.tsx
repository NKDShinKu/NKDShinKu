/* eslint-disable @next/next/no-img-element -- 头像为本地站点图标（O3 素材到位前兜底），
   显式宽高满足 REQ-G8；next/image 全局 unoptimized 下与原生 img 无差别（AGENTS §2） */
import { siteConfig } from "@/lib/site.config";

/**
 * 作者信息卡（右栏面板顶部，用户需求参考成熟博客；纵向居中版式）。
 * 浅染玻璃卡：头像居上（64px）→ 名字 → 签名一句话；桌面右栏与移动端抽屉共用。
 * 文案收敛 siteConfig.authorTagline（单一来源）。
 */
export function AuthorCard() {
  return (
    <div className="border-glass-border bg-glass flex shrink-0 flex-col items-center gap-1.5 rounded-md border p-4 shadow-sm backdrop-blur-[16px]">
      {/* O3：用户头像素材到位后替换 src（站点 logo 兜底，与关于页同源） */}
      <img
        src="/icon.svg"
        alt={`${siteConfig.author} 头像`}
        width={64}
        height={64}
        className="border-glass-border size-16 shrink-0 rounded-full border"
      />
      <p className="font-display mt-1 truncate text-base font-bold">{siteConfig.author}</p>
      <p className="text-text-muted w-full text-center text-xs leading-relaxed">
        {siteConfig.authorTagline}
      </p>
    </div>
  );
}
