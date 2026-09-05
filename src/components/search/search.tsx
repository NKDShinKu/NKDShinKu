"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadPagefind, type PagefindInstance, type PagefindResultData } from "@/lib/pagefind";
import { siteConfig } from "@/lib/site.config";

export type SearchRecentPost = { title: string; href: string };

const DEBOUNCE_MS = 200;
const MAX_RESULTS = 8;

const iconButtonClass =
  "text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2";

const kbdClass =
  "border-border bg-bg text-text-muted rounded-sm border px-1.5 py-0.5 font-mono text-xs";

/** 结果标题：剥掉模板给 <title> 加的站点后缀 */
function resultTitle(data: PagefindResultData): string {
  const suffix = new RegExp(`\\s*\\|\\s*${siteConfig.name}$`);
  return data.meta.title?.replace(suffix, "") || data.url;
}

/**
 * 全局搜索（REQ-S，design-system/search.md）：页头入口 + 弹窗，无独立路由
 *
 * - Ctrl/Cmd+K 全站唤起（isComposing 守卫输入法）；Esc 关闭与焦点归还需由 Radix 保证
 * - Pagefind 索引首次唤起时懒加载；200ms 防抖即时检索；↑↓ 选择 + Enter 打开
 * - 未输入时展示最近文章（S-11，服务端派生经 layout 传入）；dev 无索引走错误态 + 重试（S-8）
 * - 加载/检索的加载中态均为派生值（react-hooks 纪律：setState 只出现在异步回调与事件处理器）
 */
export function Search({ recent }: { recent: SearchRecentPost[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [rawActiveIndex, setRawActiveIndex] = useState(0);
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const pagefindRef = useRef<PagefindInstance | null>(null);
  const router = useRouter();

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const ready = loaded && !loadError;
  const loadingIndex = open && !ready;
  // 「检索中」= 已就绪但输入的词尚未出结果（旧结果在等待期间保持可见）
  const searching = hasQuery && ready && searchedQuery !== trimmedQuery;
  const visibleResults = hasQuery ? results : [];
  const activeIndex = Math.min(rawActiveIndex, Math.max(visibleResults.length - 1, 0));

  // Ctrl/Cmd+K 全站唤起
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 首次打开时懒加载索引；失败进错误态（可重试）
  useEffect(() => {
    if (!open || loaded || loadError) return;
    let cancelled = false;
    loadPagefind()
      .then((instance) => {
        if (cancelled) return;
        pagefindRef.current = instance;
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, loaded, loadError]);

  // 即时检索：200ms 防抖，取前 MAX_RESULTS 条
  useEffect(() => {
    if (!ready || !hasQuery) return;
    const instance = pagefindRef.current;
    if (!instance) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      instance
        .search(trimmedQuery)
        .then(async (response) => {
          const data = await Promise.all(
            response.results.slice(0, MAX_RESULTS).map((result) => result.data()),
          );
          if (cancelled) return;
          setResults(data);
          setSearchedQuery(trimmedQuery);
          setRawActiveIndex(0);
        })
        .catch(() => {
          if (cancelled) return;
          setResults([]);
          setSearchedQuery(trimmedQuery);
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, trimmedQuery, hasQuery, ready]);

  function openResult(url: string) {
    setOpen(false);
    router.push(url);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setRawActiveIndex((index) => Math.min(index + 1, Math.max(visibleResults.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setRawActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const current = visibleResults[activeIndex];
      if (current) {
        event.preventDefault();
        openResult(current.url);
      }
    }
  }

  const statusText = !ready
    ? loadError
      ? "索引不可用"
      : "正在准备搜索索引…"
    : hasQuery
      ? searching
        ? "搜索中…"
        : `找到 ${visibleResults.length} 篇相关文章`
      : "输入关键词开始搜索";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="搜索文章（Ctrl+K）" title="搜索文章（Ctrl+K）" className={iconButtonClass}>
        <span className="icon-[mdi--magnify] size-5" aria-hidden />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="search-overlay bg-bg/60 fixed inset-0 z-[60] backdrop-blur-sm" />
        <Dialog.Content
          aria-label="站内搜索"
          className="search-dialog border-border bg-surface shadow-lg fixed left-1/2 top-[12vh] z-[60] flex w-[calc(100vw-24px)] max-w-[560px] -translate-x-1/2 flex-col overflow-hidden rounded-lg border max-sm:top-[8vh]"
        >
          <Dialog.Title className="sr-only">站内搜索</Dialog.Title>
          <Dialog.Description className="sr-only">
            输入关键词即时检索文章，回车打开结果。
          </Dialog.Description>

          {/* 输入行（S-6） */}
          <div className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
            <span className="icon-[mdi--magnify] text-text-muted size-5" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              role="combobox"
              aria-expanded={visibleResults.length > 0}
              aria-controls="search-results"
              aria-activedescendant={
                visibleResults.length > 0 ? `search-option-${activeIndex}` : undefined
              }
              aria-autocomplete="list"
              aria-label="搜索文章"
              autoComplete="off"
              placeholder="搜索文章…"
              className="text-text placeholder:text-text-muted/70 h-full min-w-0 flex-1 bg-transparent text-base outline-none"
            />
            <kbd className={`${kbdClass} hidden sm:inline-block`} aria-hidden>
              esc
            </kbd>
          </div>

          {/* 结果区（S-5/S-8/S-11） */}
          <div
            id="search-results"
            role="listbox"
            aria-label="搜索结果"
            className="max-h-[55vh] overflow-y-auto overscroll-contain md:max-h-[60vh]"
          >
            {loadingIndex ? (
              <p className="text-text-muted flex items-center gap-2 px-4 py-8 text-sm" role="status">
                <span
                  className="icon-[mdi--loading] size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden
                />
                正在准备搜索索引…
              </p>
            ) : loadError ? (
              <div className="px-4 py-8 text-center">
                <p className="text-text-muted text-sm">
                  搜索索引加载失败——本地开发需先构建索引（pnpm build && pnpm build:search）。
                </p>
                <button
                  type="button"
                  onClick={() => setLoadError(false)}
                  className="border-border text-text hover:border-accent hover:text-accent focus-visible:outline-accent mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-md border px-6 py-2 text-sm transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  重新加载
                </button>
              </div>
            ) : !hasQuery ? (
              <>
                <p className="text-text-muted px-4 pt-3 pb-1 text-xs font-bold tracking-widest uppercase">
                  最近文章
                </p>
                <ul>
                  {recent.map((post) => (
                    <li key={post.href}>
                      <a
                        href={post.href}
                        className="hover:bg-accent/10 focus-visible:bg-accent/10 flex items-start gap-3 px-4 py-3"
                      >
                        <span
                          className="icon-[mdi--file-document-outline] text-accent mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        <span className="text-text text-sm font-medium">{post.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : visibleResults.length > 0 ? (
              <ul>
                {visibleResults.map((result, index) => (
                  <li
                    key={result.url}
                    id={`search-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={() => openResult(result.url)}
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3 ${index === activeIndex ? "bg-accent/10" : ""}`}
                  >
                    <span
                      className="icon-[mdi--file-document-outline] text-accent mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-text text-sm font-medium">{resultTitle(result)}</p>
                      <div
                        className="text-text-muted mt-0.5 line-clamp-2 text-xs [&_mark]:bg-sakura/25 [&_mark]:text-inherit [&_mark]:rounded-xs [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                      {result.meta.category ? (
                        <span className="bg-accent/10 text-accent-dark mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs">
                          {result.meta.category}
                        </span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-10 text-center">
                <span className="icon-[mdi--cloud-search-outline] text-sakura size-8" aria-hidden />
                <p className="text-text mt-3 text-sm font-medium">没有找到相关文章</p>
                <p className="text-text-muted mt-1 text-xs">
                  换个关键词，或去
                  <Link
                    href="/posts/"
                    onClick={() => setOpen(false)}
                    className="text-accent-dark hover:text-accent mx-0.5 underline decoration-accent/40 underline-offset-4"
                  >
                    全部文章
                  </Link>
                  逛逛。
                </p>
              </div>
            )}
          </div>

          {/* 状态栏（S-6；上下文化播报） */}
          <div
            className="border-border text-text-muted flex h-10 shrink-0 items-center justify-between border-t px-4 text-xs"
            role="status"
            aria-atomic="true"
          >
            <span>{statusText}</span>
            <span className="hidden items-center gap-1.5 sm:inline-flex" aria-hidden>
              <kbd className={kbdClass}>↑</kbd>
              <kbd className={kbdClass}>↓</kbd>
              选择
              <kbd className={`${kbdClass} ml-1.5`}>↵</kbd>
              打开
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
