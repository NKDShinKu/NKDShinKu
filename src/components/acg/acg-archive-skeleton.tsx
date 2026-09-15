import { ACG_GROUP_TYPES, ACG_PAGE_STEP } from "@/lib/acg";

/**
 * 行卡骨架（acg.md §2.7）：与 ArchiveRow 同高（`h-52` = 行卡 `min-h-[13rem]`），
 * 保证「骨架 → 真卡」高度不变。
 */
export function AcgRowSkeleton() {
  return (
    <div className="border-border bg-surface flex h-52 gap-4 overflow-hidden rounded-md border">
      <div className="bg-border/60 w-32 shrink-0 sm:w-36 md:w-40" />
      <div className="flex-1 space-y-3 p-4 md:p-5">
        <div className="bg-border/60 h-5 w-2/3 animate-pulse rounded" />
        <div className="bg-border/60 h-3 w-1/3 animate-pulse rounded" />
        <div className="bg-border/60 h-3 w-full animate-pulse rounded" />
        <div className="bg-border/60 h-3 w-5/6 animate-pulse rounded" />
      </div>
    </div>
  );
}

/**
 * 归档骨架（M5 修复批次）：Suspense fallback 与数据区载入态共用同一份形状。
 *
 * 两件事必须对齐，否则就是布局抖动来源：
 * 1. **行数**——fallback 就是静态 HTML 的正文（数据区用 useSearchParams，静态导出下被判为
 *    BAILOUT_TO_CLIENT_SIDE_RENDERING），旧实现只画 4 行、数据到达变 20 行，页脚被推下
 *    ~3600px（Lighthouse 实测 CLS 0.168，culprit = footer）；
 * 2. **左栏/工具条占位**——与真实布局同结构，hydrate 前后高度基本一致。
 */
export function AcgArchiveSkeleton({ rows = ACG_PAGE_STEP }: { rows?: number }) {
  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[260px_1fr]" aria-hidden>
      <div className="hidden lg:block">
        <div className="bg-border/60 h-3 w-20 animate-pulse rounded" />
        <div className="bg-border/60 mt-2 h-6 w-28 animate-pulse rounded" />
        <div className="mt-6 space-y-3">
          {ACG_GROUP_TYPES.map((type) => (
            <div key={type} className="bg-border/60 h-7 animate-pulse rounded" />
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-end gap-3">
          <div className="bg-border/60 size-11 animate-pulse rounded-full" />
          <div className="bg-border/60 h-6 w-32 animate-pulse rounded" />
        </div>
        <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {ACG_GROUP_TYPES.map((type) => (
            <div
              key={type}
              className="bg-border/60 h-11 w-20 shrink-0 animate-pulse rounded-full"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {Array.from({ length: rows }, (_, i) => (
            <AcgRowSkeleton key={i} />
          ))}
        </div>
        {/* 「加载更多」与移动端底部返回链接的占位：真实内容比骨架多这两块，
            不预留就会在数据到达后把整页高度撑开（剩余 CLS 的主要来源） */}
        <div className="mt-8 flex justify-center">
          <div className="bg-border/60 h-11 w-40 animate-pulse rounded-md" />
        </div>
        <div className="mt-12 lg:hidden">
          <div className="bg-border/60 h-5 w-24 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
