import type { Metadata } from "next";
import Link from "next/link";
import { LabCard } from "@/components/lab/lab-card";
import { Reveal } from "@/components/motion/reveal";
import { LAB_ITEMS } from "@content/lab";
import { groupLabItemsByType, LAB_TYPE_EN_LABELS, normalizeLabItems } from "@/lib/lab";

export const metadata: Metadata = {
  title: "实验室",
  description: "NKDShinKu 的实验室：个人项目、小工具与实验 demo，直达仓库或站内体验。",
  alternates: { canonical: "/lab/" },
};

/**
 * 实验室列表页（/lab，design-system/lab.md §3.1）
 *
 * - 条目数据唯一来源 content/lab.ts；构建期校验排序后按 type 分组渲染
 * - Bento 网格 md:2 / xl:3 列，featured 大卡跨 2 列；卡片 Reveal subtle stagger
 * - 背景透出全局极光/萤火（L-1，本页无独立背景层）
 */
export default function LabPage() {
  const groups = groupLabItemsByType(normalizeLabItems(LAB_ITEMS));

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <header className="mb-10">
        <h1 className="font-display text-2xl font-bold md:text-3xl">实验室</h1>
        <p className="text-text-muted mt-2 text-sm">
          个人项目、小工具与实验 demo——直达仓库，或就在这里体验。
        </p>
      </header>

      {groups.length === 0 ? (
        <div className="rounded-md border border-border bg-surface px-6 py-16 text-center">
          <span className="icon-[mdi--flask-empty-outline] text-sakura size-10" aria-hidden />
          <p className="text-text-muted mt-4 text-sm">实验室还在筹备中，敬请期待。</p>
          <Link
            href="/"
            className="text-text focus-visible:outline-accent mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-6 py-2.5 transition-colors duration-150 ease-fast hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            返回首页
          </Link>
        </div>
      ) : (
        groups.map((group) => (
          <section
            key={group.type}
            aria-labelledby={`lab-group-${group.type}`}
            className="mb-12 last:mb-0"
          >
            <div className="mb-5">
              <p className="text-accent text-xs font-bold tracking-widest uppercase">
                {LAB_TYPE_EN_LABELS[group.type]}
              </p>
              <h2 id={`lab-group-${group.type}`} className="font-display mt-1 text-xl font-bold">
                {group.label}
                <span className="text-text-muted ml-2.5 text-sm font-normal">
                  {group.items.length} 个
                </span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.05} subtle>
                  <LabCard item={item} className="h-full" />
                </Reveal>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
