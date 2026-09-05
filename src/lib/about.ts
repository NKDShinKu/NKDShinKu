/**
 * 关于页数据层（about.md A-8）：事实集中派生，页面零硬编码
 *
 * O3 素材（站名由来 / 理念）以占位文案集中在本文件，素材到位后只改这里。
 * 2026-09 走查修订：个人长文与技能栈、建站时间线移除（与问候面板重复，用户决策）。
 */
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site.config";

/** 事实卡静态文案（O3 占位：站名由来与理念待用户终稿） */
export const ABOUT_FACTS = {
  nameOrigin: {
    value: "NKDShinKu",
    description: "由 ID 延伸而来的站点名——背后的故事，等我写进博客。",
  },
  philosophy: {
    value: "写下来，才算真的学会。",
    description: "沉淀学习、踩坑与造玩具的过程。",
  },
  siteType: {
    value: "个人博客",
    description: "教程、笔记与日常，与我的ACG爱好",
  },
  techStack: ["Next.js", "React 19", "Tailwind CSS 4", "TypeScript", "GSAP"],
} as const;

/** 一句话人设：从站点 hero 文案派生，不另行硬编码（问候面板用） */
export const ABOUT_TAGLINE = siteConfig.hero.subtitle.split("\n")[0].split("，")[0];

/** 全站文章 CJK 字数（含日文假名，与阅读时长的统计口径一致），构建期计算 */
function getTotalPostChars(): number {
  return getAllPosts().reduce((total, meta) => {
    const content = getPostBySlug(meta.slug)?.content ?? "";
    return total + (content.match(/[\u4e00-\u9fff\u3040-\u30ff]/g)?.length ?? 0);
  }, 0);
}

/** 字数事实：约 X.X 万字 ≈ Y.Y 本《小王子》（中文版约 2.5 万字/本），随内容增长自动更新 */
export function getWordCountFact(): { value: string; description: string } {
  const chars = getTotalPostChars();
  return {
    value: `约 ${(chars / 10000).toFixed(1)} 万字`,
    description: `≈ ${(chars / 25000).toFixed(1)} 本《小王子》，还在变厚。`,
  };
}

/** 站点状态事实：更新时间取最新一篇文章（updated 优先于 date） */
export function getSiteStatusFact(): { value: string; description: string } {
  const latest = getAllPosts()[0];
  const date = (latest?.updated ?? latest?.date ?? "").slice(0, 10);
  return { value: "持续建设中", description: date ? `内容更新至 ${date}` : "尚无内容" };
}
