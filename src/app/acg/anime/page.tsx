import type { Metadata } from "next";
import { Suspense } from "react";
import { AcgArchive } from "@/components/acg/acg-archive";
import { AcgArchiveSkeleton } from "@/components/acg/acg-archive-skeleton";
import { AcgResourceHints } from "@/components/acg/acg-resource-hints";
import { BackButton } from "@/components/posts/back-button";

export const metadata: Metadata = {
  title: "番剧收藏",
  description:
    "NKDShinKu 的番剧收藏归档：在看、想看、看过、搁置与抛弃，含评分、进度与短评（数据来自 Bangumi）。",
  alternates: { canonical: "/acg/anime/" },
};

/**
 * 番剧归档（/acg/anime，design-system/acg.md §3.2）：编辑档案式排版，容器 1440px
 *
 * 结构（M5 修复批次）：**静态外壳 + 客户端数据区**。
 * - 标题区必须留在 Suspense 之外：数据区读 `useSearchParams`（分组初始值来自 `?group=`），
 *   静态导出下 Next 会把该边界标记为 BAILOUT_TO_CLIENT_SIDE_RENDERING、内容不进静态 HTML
 *   ——旧实现把标题也写在边界内，产物里整页只剩「返回 + 一条灰条」，无 h1、无文案。
 * - Suspense fallback 用 AcgArchiveSkeleton：静态 HTML 阶段就把首屏高度占住（CLS 修复）。
 * - AcgResourceHints：api.bgm.tv / lain.bgm.tv 连接预热（两个域都要等水合后才发起请求）。
 */
export default function AcgAnimePage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <AcgResourceHints />
      <BackButton fallbackHref="/acg/" />

      {/* 标题区（服务端渲染，不依赖 API）：SEO/无 JS/首次绘制都有内容（REQ-M4） */}
      <header className="border-border mt-4 border-b pb-4">
        <p className="text-text-muted text-xs font-bold tracking-widest uppercase">Anime Archive</p>
        <h1 className="font-display mt-1 text-2xl font-bold">番剧收藏</h1>
        <p className="text-text-muted mt-2 max-w-[60ch] text-sm">
          在看、想看、看过、搁置与抛弃五个分组，含个人评分、观看进度与短评；数据来自 Bangumi，30
          分钟缓存。
        </p>
      </header>

      <Suspense fallback={<AcgArchiveSkeleton />}>
        <AcgArchive />
      </Suspense>
    </div>
  );
}
