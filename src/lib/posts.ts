/**
 * 文章数据层 —— Markdown 内容管线的元信息读取与聚合
 *
 * 约定（content/README.md + docs/design-system/posts.md）：
 * - 文章位于 `content/posts/*.md`，文件名（去扩展名）即 slug（不含日期前缀，manifest D9）
 * - frontmatter 字段以 content/README.md §2 为准；`draft: true` 构建期直接忽略
 * - 仅在构建期被服务端组件调用（node:fs），无任何浏览器端逻辑
 * - 元信息校验失败一律抛错：构建期快速失败优于静默产出坏数据
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { pinyin } from "pinyin-pro";

export const POST_CATEGORIES = ["教程", "笔记", "日常"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

/**
 * 分类英文 slug 映射 —— URL 全 ASCII（D12 补充决策）
 *
 * 背景：Next 16 dev 在静态导出模式下对非 ASCII 动态参数存在形态匹配缺陷
 * （编码/解码链路不一致，中文分类/标签 dev 下 500/404，见 AGENTS §7），
 * 且 GH Pages 对字面编码目录 404。路由参数一律走 ASCII slug，中文只做展示。
 */
const CATEGORY_SLUGS: Record<PostCategory, string> = {
  教程: "tutorial",
  笔记: "notes",
  日常: "daily",
};

/** 分类中文名 → 英文 slug（gSP 与链接生成共用；非法输入原样返回交由 404 兜底） */
export function categorySlug(category: PostCategory): string {
  return CATEGORY_SLUGS[category];
}

/** 英文 slug → 分类中文名；未知 slug 返回 null（页面 404） */
export function categoryFromSlug(slug: string): PostCategory | null {
  const entry = (Object.entries(CATEGORY_SLUGS) as [PostCategory, string][]).find(
    ([, value]) => value === slug,
  );
  return entry ? entry[0] : null;
}

/**
 * 标签 slug 覆盖表：希望用更可读英文 slug 的标签在此登记；未登记的自动转拼音。
 * 标签展示一律用 frontmatter 原文（中文为主），slug 仅用于路由。
 */
const TAG_SLUG_OVERRIDES: Record<string, string> = {
  随笔: "essay",
  建站: "site-building",
  踩坑: "pitfalls",
  设计系统: "design-system",
  静态导出: "static-export",
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** 标签 → 路由 slug：覆盖表优先，否则无声调拼音（非中文字符保留）；结果恒为 ASCII */
export function tagSlug(tag: string): string {
  const override = TAG_SLUG_OVERRIDES[tag];
  if (override) return override;
  return toSlug(pinyin(tag, { toneType: "none", nonZh: "consecutive" }));
}

export interface PostMeta {
  slug: string;
  title: string;
  /** 摘要（列表卡与 meta description 共用，frontmatter 必填） */
  description: string;
  /** ISO 日期字符串，排序与展示由上层格式化 */
  date: string;
  updated?: string;
  category: PostCategory;
  tags: readonly string[];
  keywords?: readonly string[];
  /** 封面图（R2 绝对 URL），无封面卡片走紧凑形态 */
  cover?: string;
  /** 置顶：列表与首页排序优先（REQ-H3） */
  pinned: boolean;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  /** Markdown 原文（详情页构建期渲染为 HTML） */
  content: string;
}

/** 解析中间态：额外携带 draft 标志，进入缓存前被过滤（对外类型不暴露） */
interface RawPost extends Post {
  draft: boolean;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** 阅读时长：中文 300 字/分钟 + 拉丁词 200 词/分钟，代码块按 12 行/分钟折算（D12） */
function calcReadingMinutes(markdown: string): number {
  const codeBlock = /^```[\s\S]*?^```/gm;
  const codeLines = (markdown.match(codeBlock) ?? []).reduce(
    (total, block) => total + Math.max(block.split("\n").length - 2, 0),
    0,
  );
  const prose = markdown.replace(codeBlock, "");
  const cjk = prose.match(/[\u4e00-\u9fff\u3040-\u30ff]/g)?.length ?? 0;
  const words = prose.match(/[a-zA-Z]+/g)?.length ?? 0;
  return Math.max(1, Math.round(cjk / 300 + words / 200 + codeLines / 12));
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`[posts] ${file}: frontmatter 缺少必填字符串字段「${key}」`);
  }
  return value;
}

function optionalString(data: Record<string, unknown>, key: string, file: string): string | undefined {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`[posts] ${file}: frontmatter 字段「${key}」须为非空字符串`);
  }
  return value;
}

function optionalStringArray(
  data: Record<string, unknown>,
  key: string,
  file: string,
): readonly string[] | undefined {
  const value = data[key];
  if (value === undefined) return undefined;
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || item.length === 0)
  ) {
    throw new Error(`[posts] ${file}: frontmatter 字段「${key}」须为非空字符串数组`);
  }
  return value as readonly string[];
}

/**
 * 日期字段归一化：YAML 会把 `2026-08-30` 解析成 Date 对象（js-yaml timestamp 类型），
 * 字符串写法（含带时间的 ISO）同样接受；统一输出 `YYYY-MM-DD`。
 */
function normalizeDate(value: unknown, key: string, file: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return value.slice(0, 10);
  }
  throw new Error(`[posts] ${file}: frontmatter 字段「${key}」不是合法日期（${String(value)}）`);
}

function requireDate(data: Record<string, unknown>, key: string, file: string): string {
  if (data[key] === undefined) {
    throw new Error(`[posts] ${file}: frontmatter 缺少必填日期字段「${key}」`);
  }
  return normalizeDate(data[key], key, file);
}

function optionalDate(data: Record<string, unknown>, key: string, file: string): string | undefined {
  if (data[key] === undefined) return undefined;
  return normalizeDate(data[key], key, file);
}

function parsePost(slug: string, raw: string): RawPost {
  const { data, content } = matter(raw);
  const file = `${slug}.md`;

  const tags = optionalStringArray(data, "tags", file) ?? [];
  // 标签自由填写（中文为主）；slug 由 tagSlug 自动生成（覆盖表/拼音），转换后为空说明标签写法异常
  for (const tag of tags) {
    if (tagSlug(tag).length === 0) {
      throw new Error(`[posts] ${file}: 标签「${tag}」无法生成有效路由 slug（转换后为空），请调整写法`);
    }
  }

  const category = requireString(data, "category", file);
  if (!POST_CATEGORIES.includes(category as PostCategory)) {
    throw new Error(
      `[posts] ${file}: category「${category}」不在 POST_CATEGORIES（${POST_CATEGORIES.join(" / ")}）内`,
    );
  }
  const date = requireDate(data, "date", file);
  const updated = optionalDate(data, "updated", file);

  return {
    slug,
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    date,
    updated,
    category: category as PostCategory,
    tags,
    keywords: optionalStringArray(data, "keywords", file),
    cover: optionalString(data, "cover", file),
    pinned: data.pinned === true,
    readingMinutes: calcReadingMinutes(content),
    content,
    draft: data.draft === true,
  };
}

/** 构建期读取一次并缓存；draft 在此过滤，排序 pinned 优先、日期倒序 */
function loadPosts(): Post[] {
  const files = readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"));
  if (files.length === 0) {
    throw new Error(`[posts] ${POSTS_DIR} 下没有任何 .md 文章`);
  }
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return parsePost(slug, readFileSync(path.join(POSTS_DIR, file), "utf-8"));
    })
    .filter((post) => !post.draft)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return Date.parse(b.date) - Date.parse(a.date);
    });
}

let cache: Post[] | null = null;
function allPosts(): Post[] {
  cache ??= loadPosts();
  return cache;
}

/** 全部文章元信息（不含正文），已按 pinned → 日期倒序排序 */
export function getAllPosts(): PostMeta[] {
  return allPosts().map(({ content, ...meta }) => meta);
}

/** 按 slug 取单篇文章（含正文）；不存在返回 null（404 由调用方处理） */
export function getPostBySlug(slug: string): Post | null {
  return allPosts().find((post) => post.slug === slug) ?? null;
}

export function getPostsByCategory(category: PostCategory): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): PostMeta[] {
  // tag 传入 slug 形态（URL），与 frontmatter 标签的 slug 化结果比对
  return getAllPosts().filter((post) => post.tags.some((t) => tagSlug(t) === tag));
}

/** 标签云数据：name 为原始标签（展示），slug 为路由形态；按篇数倒序、同篇数按名称排序 */
export function getAllTags(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, { name: string; count: number }>();
  for (const post of allPosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const existing = counts.get(slug);
      if (existing) existing.count += 1;
      else counts.set(slug, { name: tag, count: 1 });
    }
  }
  return [...counts.values()]
    .map(({ name, count }) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 分类计数（chips 徽标用）：三个固定分类恒返回，无文章的为 0；name 中文展示、slug 路由形态 */
export function getCategoryCounts(): { name: PostCategory; slug: string; count: number }[] {
  return POST_CATEGORIES.map((name) => ({
    name,
    slug: categorySlug(name),
    count: allPosts().filter((post) => post.category === name).length,
  }));
}
