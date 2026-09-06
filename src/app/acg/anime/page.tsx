import type { Metadata } from "next";
import { Suspense } from "react";
import { AcgArchive } from "@/components/acg/acg-archive";
import { BackButton } from "@/components/posts/back-button";

export const metadata: Metadata = {
  title: "番剧收藏",
  description:
    "NKDShinKu 的番剧收藏归档：在看、想看、看过、搁置与抛弃，含评分、进度与短评（数据来自 Bangumi）。",
  alternates: { canonical: "/acg/anime/" },
};

/**
 * 番剧归档（/acg/anime，design-system/acg.md §3.2）：编辑档案式排版，容器 1440px
 * 分组初始值经 ?group= 传入（useSearchParams 需 Suspense 边界，静态导出硬要求）
 */
export default function AcgAnimePage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <BackButton fallbackHref="/acg/" />
      <Suspense fallback={<div className="border-border bg-border/60 mt-4 h-16 animate-pulse rounded-md border" />}>
        <AcgArchive />
      </Suspense>
    </div>
  );
}
