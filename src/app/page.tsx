import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/components/posts/post-card";
import { Card } from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-6">
      <HomeHero />

      <section className="pb-16 md:pb-24" aria-label="最新文章">
        <Reveal className="mb-10 text-center">
          <p className="text-accent-dark text-xs font-bold tracking-widest uppercase">Blog</p>
          <h2 className="mt-2 text-2xl font-bold">最新文章</h2>
          <p className="text-text-muted mx-auto mt-2 max-w-[480px]">文章、教程与笔记，记录学习与思考。</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-8 text-center">
          <Link
            href="/posts/"
            className="focus-visible:outline-accent inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-fast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            查看全部文章
            <span className="icon-[mdi--arrow-right] size-4" aria-hidden />
          </Link>
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
          {siteConfig.sections.map((section, index) => (
            <Reveal key={section.href} delay={index * 0.08} className={section.span}>
              <Link
                href={section.href}
                className="focus-visible:outline-accent block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Card variant="glass" interactive className="group h-full">
                  <div className="flex items-center gap-3">
                    <span className={`${section.icon} text-accent size-6 shrink-0`} aria-hidden />
                    <h3 className="text-lg font-semibold">{section.label}</h3>
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
