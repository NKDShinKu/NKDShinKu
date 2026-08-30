import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-6 py-32 text-center">
      <p className="font-display text-accent text-7xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-semibold">页面不存在</h1>
      <p className="text-text-muted mt-2">你访问的页面可能已被移动或删除。</p>
      <Link
        href="/"
        className="bg-accent focus-visible:outline-accent hover:bg-accent-dark mt-8 inline-flex items-center rounded-md px-6 py-2.5 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        返回首页
      </Link>
    </div>
  );
}
