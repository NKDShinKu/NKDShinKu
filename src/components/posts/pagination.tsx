import Link from "next/link";
import { Card } from "@/components/ui/card";
import { POSTS_PER_PAGE } from "@/lib/posts-pagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** 第 1 页固定回 /posts/，避免 /posts/page/1/ 与 /posts/ 双入口（SEO 重复） */
  hrefForPage: (page: number) => string;
};

/**
 * 分页控件 —— design-system/posts.md §2.4
 * 当前页品牌彩底（D10）；禁用方向按钮保留 DOM（aria-disabled，不裸删）
 */
export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page - 1;
  const next = page + 1;

  return (
    <nav
      aria-label="文章分页"
      className="mt-12 flex flex-col items-center gap-3"
    >
      <div className="flex items-center gap-2">
        <PageLink
          href={prev >= 1 ? hrefForPage(prev) : undefined}
          disabled={prev < 1}
          label="上一页"
        >
          <span className="icon-[mdi--chevron-left] size-5" aria-hidden />
        </PageLink>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
          n === page ? (
            <span
              key={n}
              aria-current="page"
              className="bg-accent flex h-11 w-11 items-center justify-center rounded-md font-medium text-white"
            >
              {n}
            </span>
          ) : (
            <PageLink key={n} href={hrefForPage(n)} label={`第 ${n} 页`}>
              {n}
            </PageLink>
          ),
        )}

        <PageLink
          href={next <= totalPages ? hrefForPage(next) : undefined}
          disabled={next > totalPages}
          label="下一页"
        >
          <span className="icon-[mdi--chevron-right] size-5" aria-hidden />
        </PageLink>
      </div>
      <p className="text-text-muted text-xs">
        每页 {POSTS_PER_PAGE} 篇 · 第 {page} / {totalPages} 页
      </p>
    </nav>
  );
}

type PageLinkProps = {
  href?: string;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
};

function PageLink({ href, disabled, label, children }: PageLinkProps) {
  const base =
    "border-border bg-surface text-text-muted flex h-11 min-w-11 items-center justify-center rounded-md border px-3 transition-[border-color,color] duration-150 ease-fast";
  if (disabled || !href) {
    return (
      <span aria-disabled="true" className={`${base} pointer-events-none opacity-40`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${base} hover:border-accent hover:text-accent focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {children}
    </Link>
  );
}

/** 空状态卡（分类/标签筛选无结果时）—— design-system/posts.md §2.10 */
export function EmptyState({ message }: { message: string }) {
  return (
    <Card variant="surface" className="text-text-muted flex flex-col items-center gap-3 py-16 text-center">
      <span className="icon-[mdi--cloud-search-outline] text-sakura size-10" aria-hidden />
      <p className="text-sm">{message}</p>
      <Link
        href="/posts/"
        className="focus-visible:outline-accent mt-2 rounded-md border border-border px-6 py-2.5 font-medium transition-[border-color,color] duration-150 ease-fast hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        返回全部文章
      </Link>
    </Card>
  );
}
