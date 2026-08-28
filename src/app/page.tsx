import { siteConfig } from "@/lib/site.config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Badge variant="outline" className="mb-8 text-sm">
        博客建设中 · Under Construction
      </Badge>

      <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
        <span className="from-brand via-twilight to-sakura bg-gradient-to-r bg-clip-text text-transparent">
          {siteConfig.name}
        </span>
      </h1>

      <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
        一个二次元风格的现代个人技术博客。记录文章、教程、实验室项目、日常与追番，
        主要用来展示自己的成果。
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">
            <span className="icon-[mdi--github] size-5" aria-hidden />
            GitHub
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:2010182879@qq.com">
            <span className="icon-[mdi--email-outline] size-5" aria-hidden />
            联系我
          </a>
        </Button>
      </div>

      <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {plannedModules.map((module) => (
          <Card key={module.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <span className={`${module.iconClass} text-brand size-6 shrink-0`} aria-hidden />
              <div className="text-left">
                <CardTitle className="text-base">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground text-left text-sm">
              敬请期待，模块将在后续迭代中上线。
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
