import type { Metadata } from "next";
import { AcgHubContent } from "@/components/acg/acg-hub-content";
import { PlaceholderCard } from "@/components/acg/placeholder-card";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "ACG",
  description:
    "NKDShinKu 的 ACG 收藏橱窗：番剧追番记录、进度与评分（数据来自 Bangumi），游戏/音乐/小说筹备中。",
  alternates: { canonical: "/acg/" },
};

const PLACEHOLDERS = [
  { icon: "icon-[mdi--gamepad-variant]", name: "游戏" },
  { icon: "icon-[mdi--music-note]", name: "音乐" },
  { icon: "icon-[mdi--book-open-outline]", name: "小说" },
] as const;

/**
 * ACG hub（/acg，design-system/acg.md §3.1）：橱窗页，随主题正常翻转
 * 服务端外壳（标题/占位子类不依赖 API）+ 客户端数据区（勋章/封面流，REQ-M1/M2/M4）
 */
export default function AcgPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <div className="">
        <Reveal>
          <header className="px-1 pb-10 md:px-2">
            <h1 className="font-display text-3xl font-bold md:text-4xl">ACG</h1>
            <p className="text-text-muted mt-2 text-sm">
              我的二次元收藏橱窗——番剧先行，游戏、音乐与小说在路上。
            </p>
          </header>
        </Reveal>
        <AcgHubContent />
      </div>

      {/* 占位子类（REQ-M3）：不依赖 API */}
      <section aria-labelledby="acg-more" className="mt-12">
        <div className="mb-5">
          <p className="text-accent text-xs font-bold tracking-widest uppercase">More</p>
          <h2 id="acg-more" className="font-display mt-1 text-xl font-bold">
            更多子类
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLACEHOLDERS.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.05} subtle>
              <PlaceholderCard icon={item.icon} name={item.name} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
