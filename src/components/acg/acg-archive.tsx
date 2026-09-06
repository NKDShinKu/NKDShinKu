"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArchiveRow } from "@/components/acg/archive-row";
import {
  ACG_GROUP_EN,
  ACG_GROUP_LABELS,
  ACG_GROUP_TYPES,
  getGroupData,
  getGroupTotal,
  type AcgGroupData,
  type AcgGroupType,
} from "@/lib/acg";

const PAGE_STEP = 20;

function parseGroupParam(value: string | null): AcgGroupType {
  const n = Number(value);
  return (ACG_GROUP_TYPES as readonly number[]).includes(n) ? (n as AcgGroupType) : 3;
}

/**
 * 番剧归档（acg.md §2.4–§2.7 + §3.2）：顶栏 TOTAL + 左栏分组（桌面 sticky/移动 pills）
 * + 编辑式行卡两列 + 加载更多（客户端切片，网络层一次拉全组）
 */
export function AcgArchive() {
  const searchParams = useSearchParams();
  const [groupType, setGroupType] = useState<AcgGroupType>(() => parseGroupParam(searchParams.get("group")));
  const [groupData, setGroupData] = useState<AcgGroupData | null>(null);
  const [groupError, setGroupError] = useState(false);
  const [totals, setTotals] = useState<Record<AcgGroupType, number> | null>(null);
  const [renderCount, setRenderCount] = useState(PAGE_STEP);
  const [refreshing, setRefreshing] = useState(false);

  // 归档总数（五组轻查询，缓存优先；失败静默——TOTAL 显示 …）
  useEffect(() => {
    let cancelled = false;
    Promise.all(ACG_GROUP_TYPES.map((type) => getGroupTotal(type)))
      .then((values) => {
        if (!cancelled) {
          setTotals(Object.fromEntries(ACG_GROUP_TYPES.map((type, i) => [type, values[i]])) as Record<AcgGroupType, number>);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // 当前分组数据：active 按 type 派生（切换分组时旧数据自动失配 → 骨架），effect 内无同步 setState
  useEffect(() => {
    let cancelled = false;
    getGroupData(groupType)
      .then((result) => {
        if (!cancelled) setGroupData(result.data);
      })
      .catch(() => {
        if (!cancelled) setGroupError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [groupType]);

  const active = groupData && groupData.type === groupType ? groupData : null;
  const loading = !active && !groupError;
  const shown = active ? active.items.slice(0, renderCount) : [];

  const switchTo = useCallback((type: AcgGroupType) => {
    setGroupType(type);
    setRenderCount(PAGE_STEP);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setGroupError(false);
    getGroupData(groupType, { refresh: true })
      .then((result) => setGroupData(result.data))
      .catch(() => setGroupError(true))
      .finally(() => setRefreshing(false));
    Promise.all(ACG_GROUP_TYPES.map((type) => getGroupTotal(type, true)))
      .then((values) => {
        setTotals(Object.fromEntries(ACG_GROUP_TYPES.map((type, i) => [type, values[i]])) as Record<AcgGroupType, number>);
      })
      .catch(() => {});
  }, [groupType]);

  const grandTotal = totals ? ACG_GROUP_TYPES.reduce((sum, t) => sum + (totals[t] ?? 0), 0) : null;

  /** 收藏分布条：宽度 ∝ 计数/总数（M-7 重设计：数据可视化感） */
  const barWidth = (type: AcgGroupType): string => {
    if (!totals || !grandTotal) return "0%";
    return `${Math.round(((totals[type] ?? 0) / grandTotal) * 100)}%`;
  };

  const groupTabs = (
    <div className="space-y-3">
      {ACG_GROUP_TYPES.map((type) => {
        const isActive = type === groupType;
        return (
          <button
            key={type}
            type="button"
            onClick={() => switchTo(type)}
            aria-current={isActive ? "true" : undefined}
            className="group/bar focus-visible:outline-accent block w-full cursor-pointer rounded-md py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "text-accent-dark dark:text-accent"
                    : "text-text-muted group-hover/bar:text-accent"
                }`}
              >
                {ACG_GROUP_LABELS[type]}
                <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-70">
                  {ACG_GROUP_EN[type]}
                </span>
              </span>
              <span className="text-text-muted font-mono text-xs">
                {totals?.[type] ?? "…"}
              </span>
            </span>
            <span className="bg-border/60 mt-1.5 block h-1.5 w-full overflow-hidden rounded-full">
              <span
                className={`ease-base block h-full rounded-full transition-[width] duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-twilight"
                    : "bg-border group-hover/bar:bg-accent/40"
                }`}
                style={{ width: barWidth(type) }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );

  const groupTabsMobile = (
    <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {ACG_GROUP_TYPES.map((type) => {
        const isActive = type === groupType;
        return (
          <button
            key={type}
            type="button"
            onClick={() => switchTo(type)}
            aria-current={isActive ? "true" : undefined}
            className={`ease-fast focus-visible:outline-accent inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isActive
                ? "border-accent bg-gradient-to-r from-accent to-twilight text-white"
                : "text-text-muted hover:border-accent/50 hover:text-accent border-border bg-surface/70"
            }`}
          >
            {ACG_GROUP_LABELS[type]}
            <span className={`font-mono text-xs ${isActive ? "text-white/85" : ""}`}>
              {totals?.[type] ?? "…"}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      {/* 档案顶栏（M-7）：标题区 + 刷新 + TOTAL */}
      <div className="border-border mt-4 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
        <div>
          <p className="text-text-muted text-xs font-bold tracking-widest uppercase">
            Anime Archive
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold">番剧收藏</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            aria-label="刷新收藏数据"
            title="刷新收藏数据"
            className="text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span
              className={`icon-[mdi--refresh] size-5 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`}
              aria-hidden
            />
          </button>
          <p className="text-text-muted font-mono text-sm">
            TOTAL /{" "}
            <span className="text-text text-lg font-semibold">{grandTotal ?? "…"}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* 左栏（桌面 sticky）：收藏分布条 + 说明 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-text-muted text-xs font-bold tracking-widest uppercase">
              Collection
            </p>
            <p className="font-display mt-1 text-xl font-bold">收藏分布</p>
            <nav aria-label="收藏分组" className="mt-6">
              {groupTabs}
            </nav>
            <p className="text-text-muted mt-6 border-t border-border/60 pt-4 text-xs leading-relaxed">
              数据来自 Bangumi（30 分钟缓存）
              <br />
              点击条目可在 Bangumi 查看
            </p>
          </div>
        </aside>

        {/* 右侧：行卡流（min-w-0：grid 项默认 min-width:auto 会让横滚 pills 撑破页面——375 溢出根因） */}
        <div className="min-w-0">
          {groupTabsMobile}

          {groupError ? (
            <div className="rounded-md border border-border bg-surface px-6 py-12 text-center">
              <span className="icon-[mdi--wifi-off-outline] text-sakura size-8" aria-hidden />
              <p className="text-text-muted mt-3 text-sm">Bangumi 数据加载失败，请检查网络后重试。</p>
              <button
                type="button"
                onClick={refresh}
                className="border-border text-text hover:border-accent hover:text-accent focus-visible:outline-accent mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-md border px-6 py-2 text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                重试
              </button>
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-1 gap-5 xl:grid-cols-2"
                aria-busy={loading}
              >
                {loading
                  ? Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={i}
                        className="border-border bg-surface flex h-52 gap-4 overflow-hidden rounded-md border"
                        aria-hidden
                      >
                        <div className="bg-border/60 w-32 shrink-0 sm:w-36 md:w-40" />
                        <div className="flex-1 space-y-3 p-5">
                          <div className="bg-border/60 h-5 w-2/3 animate-pulse rounded" />
                          <div className="bg-border/60 h-3 w-1/3 animate-pulse rounded" />
                          <div className="bg-border/60 h-3 w-full animate-pulse rounded" />
                          <div className="bg-border/60 h-3 w-5/6 animate-pulse rounded" />
                        </div>
                      </div>
                    ))
                  : shown.length > 0
                    ? shown.map((item) => (
                        <ArchiveRow
                          key={item.subject.id}
                          item={item}
                          showProgress={groupType === 3}
                        />
                      ))
                    : (
                        <div className="rounded-md border border-border bg-surface px-6 py-16 text-center sm:col-span-full">
                          <span className="icon-[mdi--cloud-off-outline] text-sakura size-8" aria-hidden />
                          <p className="text-text-muted mt-3 text-sm">这个分组还没有收藏。</p>
                        </div>
                      )}
              </div>

              {active && shown.length < active.items.length ? (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setRenderCount((count) => count + PAGE_STEP)}
                    className="border-border text-text hover:border-accent hover:text-accent focus-visible:outline-accent inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-8 py-2.5 text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    加载更多
                    <span className="text-text-muted font-mono text-xs">
                      {active.items.length - shown.length}
                    </span>
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* 返回 ACG（移动端在顶栏上方已可用；此处保留桌面路径冗余） */}
      <div className="mt-12 lg:hidden">
        <Link
          href="/acg/"
          className="text-text-muted hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="icon-[mdi--arrow-left] size-4" aria-hidden />
          返回 ACG
        </Link>
      </div>
    </div>
  );
}
