import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-6 py-32 text-center">
      <p className="font-display text-accent text-7xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-semibold">页面不存在</h1>
      <p className="text-text-muted mt-2">你访问的页面可能已被移动或删除。</p>
      <Link href="/" className={`${buttonStyles("primary")} mt-8`}>
        返回首页
      </Link>
    </div>
  );
}
