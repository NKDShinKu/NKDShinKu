import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-6 py-32 text-center">
      <p className="font-display text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold">页面不存在</h1>
      <p className="mt-2 text-text-muted">你访问的页面可能已被移动或删除。</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl bg-brand px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark"
      >
        返回首页
      </Link>
    </div>
  );
}
