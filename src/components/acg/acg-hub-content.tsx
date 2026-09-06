"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimeCoverCard } from "@/components/acg/anime-cover-card";
import { Reveal } from "@/components/motion/reveal";
import { getHubData, type AcgSectionPreview } from "@/lib/acg";

/** 橱窗区块（用户决策顺序）：在看 → 看过 → 想看；在看卡叠层显示观看进度 */
const HUB_SECTIONS = [
  { type: 3, label: "在看", showProgress: true },
  { type: 2, label: "看过", showProgress: false },
  { type: 1, label: "想看", showProgress: false },
] as const;

const PREVIEW_COUNT = 12;

/**
 * hub 数据区（acg.md §2.1/§3.1 + M-11 三态）：番剧橱窗三区（在看/看过/想看）
 * 页面框架（标题/占位子类）在服务端外壳，不依赖 API；本组件只承载动态数据
 */
export function AcgHubContent() {
  const [data, setData] = useState<AcgSectionPreview[] | null>(null);
  const [error, setError] = useState(false);
  // 当前鼠标悬停的分组 type：驱动橱窗滚动条显形（规避 Chrome 下容器 :hover 不触发 ::-webkit-scrollbar-thumb）
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  // 首次加载：effect 内只在异步回调 setState（react-hooks 纪律）；data === null 即加载中（骨架）
  useEffect(() => {
    let cancelled = false;
    getHubData()
      .then((d) => {
        if (!cancelled) setData(d.sections);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const retry = useCallback(() => {
    setError(false);
    getHubData({ refresh: true })
      .then((d) => setData(d.sections))
      .catch(() => setError(true));
  }, []);

  if (error && !data) {
    return (
      <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
        <span className="icon-[mdi--wifi-off-outline] text-sakura size-8" aria-hidden />
        <p className="text-text-muted mt-3 text-sm">Bangumi 数据加载失败，请检查网络后重试。</p>
        <button
          type="button"
          onClick={retry}
          className="border-border text-text hover:border-accent hover:text-accent focus-visible:outline-accent ease-fast mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-md border px-6 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          重试
        </button>
      </div>
    );
  }

  const sectionOf = (type: 3 | 2 | 1): AcgSectionPreview | null =>
    data?.find((s) => s.type === type) ?? null;

  return (
    <section aria-labelledby="acg-anime">
      {/* 番剧级区块头：标题 + 查看全部入口（用户决策） */}
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="acg-anime" className="font-display text-xl font-bold">
            番剧
            <span className="text-text-muted ml-2.5 text-sm font-normal">Bangumi 收藏归档</span>
          </h2>
          <Link
            href="/acg/anime/"
            className="text-accent-dark focus-visible:outline-accent ease-fast hover:text-accent inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            查看全部
            <span className="icon-[mdi--arrow-right] size-4" aria-hidden />
          </Link>
        </div>
      </Reveal>

      {HUB_SECTIONS.map((section, i) => {
        const preview = sectionOf(section.type);
        return (
          <div key={section.type} className={i > 0 ? "mt-8" : ""}>
            <Reveal>
              {/* 分组小标题：弱化形态（用户决策） */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">
                  {section.label}
                  <span className="text-text-muted ml-2 text-sm font-normal">
                    {preview ? `${preview.total} 部` : "…"}
                  </span>
                </h3>
                <Link
                  href={`/acg/anime/?group=${section.type}`}
                  className="text-text-muted focus-visible:outline-accent ease-fast hover:text-accent inline-flex items-center gap-0.5 text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  更多
                  <span className="icon-[mdi--chevron-right] size-3.5" aria-hidden />
                </Link>
              </div>
            </Reveal>
            <div
              className="scrollbar-fade flex gap-4 overflow-x-auto pb-1"
              data-hovered={hoveredType === section.type ? "true" : undefined}
              onMouseEnter={() => setHoveredType(section.type)}
              onMouseLeave={() => setHoveredType((cur) => (cur === section.type ? null : cur))}
              data-testid={`acg-cover-stream-${section.type}`}
            >
              {preview
                ? preview.items.map((item) => (
                    <AnimeCoverCard
                      key={item.subject.id}
                      item={item}
                      showProgress={section.showProgress}
                    />
                  ))
                : Array.from({ length: PREVIEW_COUNT }, (_, k) => (
                    <div key={k} className="w-36 shrink-0 md:w-40" aria-hidden>
                      <div className="border-border/60 bg-border/60 aspect-[2/3] animate-pulse rounded-md border" />
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
