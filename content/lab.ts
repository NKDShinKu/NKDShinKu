/**
 * 实验室条目结构化配置 —— 板块内容唯一来源
 *
 * 约定（content/README.md §3 + docs/design-system/lab.md）：
 * - 外链型（kind: "external"）跳仓库/直链，无站内详情页；
 *   站内型（kind: "internal"）有对应 `/lab/[slug]` 静态路由（demo 实现在 src/components/lab/demos/）
 * - slug 一律 ASCII（AGENTS §7：非 ASCII 动态路由参数在静态导出下 500/404）
 * - featured 置顶；status 权重排序 active > planned > archived
 */
import type { LabItem, LabType, LabStatus, LabLink } from "@/lib/lab";

export const LAB_ITEMS: readonly LabItem[] = [
  {
    slug: "this-blog",
    name: "NKDShinKu Blog",
    tagline: "你正在看的这个博客——从零自建的全静态站点。",
    type: "project",
    tech: ["Next.js", "React 19", "Tailwind 4", "TypeScript"],
    status: "active",
    kind: "external",
    links: [
      { label: "GitHub 仓库", href: "https://github.com/NKDShinKu/NKDShinKu" },
      { label: "在线访问", href: "https://nkdshinku.com" },
    ],
  },
  {
    slug: "cp-resume",
    name: "cp-resume",
    tagline: "优雅直观的在线简历生成工具——多模板可视化编辑，实时预览，一键导出 PDF。",
    type: "project",
    tech: ["Vue 3", "Pinia", "TypeScript", "Tailwind CSS"],
    status: "archived",
    kind: "external",
    links: [
      { label: "GitHub 仓库", href: "https://github.com/codepaintstudio/cp-resume" },
      { label: "在线体验", href: "https://codepaintstudio.github.io/cp-resume/" },
    ],
  },
  {
    slug: "tech-share-hub",
    name: "TechShareHub",
    tagline: "技术社区前端平台——Vue3 实现内容创作、展示与互动，含文章管理与数据分析。",
    type: "project",
    tech: ["Vue 3", "Pinia", "TypeScript"],
    status: "completed",
    kind: "external",
    links: [{ label: "GitHub 仓库", href: "https://github.com/NKDShinKu/TechShareHub" }],
  },
  {
    slug: "hello-lab",
    name: "今日运势",
    tagline: "站内实验页机制的首个示例——「今日运势」抽签小工具。",
    type: "experiment",
    tech: ["React 19"],
    status: "active",
    kind: "internal",
    links: [],
    description:
      "这是 `/lab/[slug]` 站内条目页的第一个示例，验证从配置驱动的静态路由、demo 挂载壳到无 JS 降级的完整链路。想换成自己的小工具：在 `src/components/lab/demos/` 新增组件，并在 `registry.ts` 登记即可。",
  },
] as const satisfies readonly LabItem[];

export type { LabItem, LabType, LabStatus, LabLink };
