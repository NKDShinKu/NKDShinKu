import { siteConfig } from "@/lib/site.config";

const plannedModules = [
  {
    title: "文章 / 教程",
    description: "技术文章、教程与笔记",
    iconClass: "icon-[mdi--file-document-outline]",
  },
  {
    title: "实验室 / 项目",
    description: "个人项目与实验记录",
    iconClass: "icon-[mdi--flask-outline]",
  },
  {
    title: "二次元 / 追番",
    description: "追番记录（Bangumi 数据）",
    iconClass: "icon-[mdi--television-classic]",
  },
  {
    title: "日常",
    description: "生活与杂谈",
    iconClass: "icon-[mdi--coffee-outline]",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-6 py-24 text-center">
      <span className="border-border bg-surface text-text-muted mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
        <span className="bg-accent mr-2 inline-block size-2 rounded-full" aria-hidden />
        博客建设中 · Under Construction
      </span>

      <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
        <span className="from-accent via-twilight to-sakura bg-gradient-to-r bg-clip-text text-transparent">
          {siteConfig.name}
        </span>
      </h1>

      <p className="text-text-muted mt-6 max-w-xl text-lg leading-relaxed">
        一个二次元风格的现代个人技术博客。记录文章、教程、实验室项目、日常与追番，
        主要用来展示自己的成果。
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noreferrer"
          className="focus-visible:outline-accent bg-accent hover:bg-accent-dark inline-flex items-center gap-2 rounded-md px-6 py-2.5 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="icon-[mdi--github] size-5" aria-hidden />
          GitHub
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="focus-visible:outline-accent border-border text-text hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border bg-transparent px-6 py-2.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="icon-[mdi--email-outline] size-5" aria-hidden />
          联系我
        </a>
      </div>

      <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {plannedModules.map((module) => (
          <article
            key={module.title}
            className="border-border bg-surface rounded-md border p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className={`${module.iconClass} text-accent size-6 shrink-0`} aria-hidden />
              <h2 className="text-base font-semibold">{module.title}</h2>
            </div>
            <p className="text-text-muted mt-1.5 text-sm">{module.description}</p>
            <p className="text-text-muted mt-3 text-sm">敬请期待，模块将在后续迭代中上线。</p>
          </article>
        ))}
      </div>
    </div>
  );
}
