import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

/** 板块入口（REQ-H4）：Bento 非对称网格（design-system.md §3.4），玻璃卡用于氛围区（§2.2） */
const sections = [
  {
    href: "/posts",
    title: "文章",
    icon: "icon-[mdi--file-document-outline]",
    description: "教程、技术笔记与日常，记录学习与思考。",
    span: "md:col-span-2",
  },
  {
    href: "/projects",
    title: "项目",
    icon: "icon-[mdi--flask-outline]",
    description: "个人项目与实验记录，点击直达仓库与演示。",
    span: "",
  },
  {
    href: "/bangumi",
    title: "追番",
    icon: "icon-[mdi--television-classic]",
    description: "Bangumi 追番记录、进度与评分。",
    span: "",
  },
  {
    href: "/about",
    title: "关于",
    icon: "icon-[mdi--information-outline]",
    description: "关于我、技能栈与联系方式。",
    span: "md:col-span-2",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-6">
      <HomeHero />

      <section className="pb-16 md:pb-24" aria-label="最新文章">
        <Reveal className="mb-10 text-center">
          <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Blog</p>
          <h2 className="mt-2 text-2xl font-bold">最新文章</h2>
          <p className="text-text-muted mx-auto mt-2 max-w-[480px]">文章、教程与笔记，即将发布。</p>
        </Reveal>
        <Reveal delay={0.08}>
          <Card
            variant="surface"
            className="text-text-muted flex flex-col items-center gap-2 py-12 text-center text-sm"
          >
            <span className="icon-[mdi--post-outline] text-accent size-8" aria-hidden />
            文章系统建设中，敬请期待。
          </Card>
        </Reveal>
      </section>

      <section className="pb-16 md:pb-24" aria-label="板块入口">
        <Reveal className="mb-10 text-center">
          <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Explore</p>
          <h2 className="mt-2 text-2xl font-bold">板块导航</h2>
          <p className="text-text-muted mx-auto mt-2 max-w-[480px]">
            从这里进入文章、项目、追番与关于。
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sections.map((section, index) => (
            <Reveal key={section.href} delay={index * 0.08} className={section.span}>
              <Link
                href={section.href}
                className="focus-visible:outline-accent block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Card variant="glass" interactive className="group h-full">
                  <div className="flex items-center gap-3">
                    <span className={`${section.icon} text-accent size-6 shrink-0`} aria-hidden />
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <span
                      className="icon-[mdi--arrow-right] text-accent ease-base ml-auto size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                  <p className="text-text-muted mt-2 text-sm">{section.description}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
