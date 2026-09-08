"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimeCoverCard } from "@/components/acg/anime-cover-card";
import { Reveal } from "@/components/motion/reveal";
import { getHubData, type AcgSectionPreview } from "@/lib/acg";

const PREVIEW_COUNT = 6;

/**
 * 首页「最近在看」小部件（REQ-H5）：数据源同 ACG 番剧在看列表（共享 localStorage 缓存）
 * 优雅降级：加载失败 / 分组为空时整块不渲染——首页框架与观感不受影响
 */
export function RecentWatching() {
  const [preview, setPreview] = useState<AcgSectionPreview | null>(null);
  const [failed, setFailed] = useState(false);

  // 首次加载：effect 内只在异步回调 setState（react-hooks 纪律）
  useEffect(() => {
    let cancelled = false;
    getHubData()
      .then((data) => {
        if (!cancelled) {
          setPreview(data.sections.find((s) => s.type === 3) ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 失败 / 无在看数据：整块不渲染（首页保持干净）
  if (failed || !preview || preview.items.length === 0) return null;

  return (
    <section aria-labelledby="home-watching" className="pt-16 pb-16 md:pt-20 md:pb-24">
      <Reveal className="mb-10 text-center">
        <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Anime</p>
        <h2 id="home-watching" className="mt-2 text-2xl font-bold">
          最近在看
        </h2>
        <p className="text-text-muted mx-auto mt-2 max-w-[480px]">
          Bangumi 追番中——进度与评分实时同步。
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="scrollbar-fade mx-auto flex max-w-[880px] gap-4 overflow-x-auto pb-2 sm:max-w-none">
          {preview.items.slice(0, PREVIEW_COUNT).map((item) => (
            <AnimeCoverCard key={item.subject.id} item={item} showProgress />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mt-8 text-center">
        <Link
          href="/acg/anime/"
          className="focus-visible:outline-accent ease-fast hover:text-accent inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          进入 ACG · 查看全部
          <span className="icon-[mdi--arrow-right] size-4" aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}
