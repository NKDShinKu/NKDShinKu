import type { Metadata } from "next";
import Link from "next/link";
import { FactCard } from "@/components/about/fact-card";
import { GreetingPanel } from "@/components/about/greeting-panel";
import { Reveal } from "@/components/motion/reveal";
import { Tag } from "@/components/ui/tag";
import { ABOUT_FACTS, getSiteStatusFact, getWordCountFact } from "@/lib/about";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 NKDShinKu 与这个站点：站名由来、理念、技术栈与建站故事。",
  alternates: { canonical: "/about/" },
};

/** 小节标题（紧凑版式，lab.md §2.4 同款） */
function SectionHeading({ id, en, title }: { id: string; en: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-accent text-xs font-bold tracking-widest uppercase">{en}</p>
      <h2 id={id} className="font-display mt-1 text-xl font-bold">
        {title}
      </h2>
    </div>
  );
}

/**
 * 关于页（/about，design-system/about.md，2026-09 走查修订）
 * 站点事实卡为主体（D16）：问候面板 + 7 张彩色节奏事实卡；长文/技能/时间线已移除（用户决策）
 * 整页 data-pagefind-ignore：搜索首期仅覆盖文章（REQ-S2）
 */
export default function AboutPage() {
  const siteStatus = getSiteStatusFact();
  const wordCount = getWordCountFact();

  return (
    <div
      className="mx-auto w-full max-w-[880px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24"
      data-pagefind-ignore
    >
      <Reveal>
        <GreetingPanel />
      </Reveal>

      <section aria-labelledby="about-site" className="mt-12">
        <SectionHeading id="about-site" en="About This Site" title="关于本站" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0} subtle className="sm:col-span-2">
            <FactCard
              icon="icon-[mdi--book-open-variant]"
              label="站名由来"
              tone="brand"
              value={
                <span className="from-accent to-twilight-dark dark:to-twilight font-display bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                  {ABOUT_FACTS.nameOrigin.value}
                </span>
              }
              description={ABOUT_FACTS.nameOrigin.description}
            />
          </Reveal>
          <Reveal delay={0.04} subtle>
            <FactCard
              icon="icon-[mdi--lightbulb-outline]"
              label="理念"
              tone="sakura"
              value={
                <span className="font-display text-lg font-bold md:text-xl">
                  {ABOUT_FACTS.philosophy.value}
                </span>
              }
              description={ABOUT_FACTS.philosophy.description}
            />
          </Reveal>
          <Reveal delay={0.08} subtle>
            <FactCard
              icon="icon-[mdi--web]"
              label="网站类型"
              value={
                <span className="font-display text-lg font-bold md:text-xl">
                  {ABOUT_FACTS.siteType.value}
                </span>
              }
              description={ABOUT_FACTS.siteType.description}
            />
          </Reveal>
          <Reveal delay={0.12} subtle>
            <FactCard
              icon="icon-[mdi--wrench-outline]"
              label="本站技术栈"
              value={
                <ul className="flex flex-wrap gap-1.5" aria-label="站点技术栈">
                  {ABOUT_FACTS.techStack.map((tech) => (
                    <li key={tech}>
                      <Tag className="px-2.5">{tech}</Tag>
                    </li>
                  ))}
                </ul>
              }
            />
          </Reveal>
          <Reveal delay={0.16} subtle>
            <FactCard
              icon="icon-[mdi--progress-clock]"
              label="站点状态"
              tone="warning"
              value={
                <span className="font-display text-lg font-bold md:text-xl">
                  {siteStatus.value}
                </span>
              }
              description={siteStatus.description}
            />
          </Reveal>
          <Reveal delay={0.2} subtle className="sm:col-span-2">
            <FactCard
              icon="icon-[mdi--pencil-outline]"
              label="写作字数"
              tone="twilight"
              value={
                <span className="font-display text-2xl font-bold md:text-3xl">
                  {wordCount.value}
                </span>
              }
              description={wordCount.description}
            />
          </Reveal>
          <Reveal delay={0.24} subtle>
            <FactCard
              icon="icon-[mdi--github]"
              label="源代码"
              value={<span className="font-display text-lg font-bold md:text-xl">GitHub</span>}
              description={
                <>
                  本站仓库。{" "}
                  <Link
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-dark hover:text-accent focus-visible:outline-accent decoration-accent/40 ease-fast inline-flex items-center gap-0.5 font-medium underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    前往仓库
                    <span className="icon-[mdi--arrow-top-right] size-3.5" aria-hidden />
                  </Link>
                </>
              }
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
