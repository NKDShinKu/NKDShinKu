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

export const POST_CATEGORIES = ["教程", "笔记", "日常"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

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
    tags: optionalStringArray(data, "tags", file) ?? [],
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
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

/** 标签云数据：按篇数倒序、同篇数按名称排序（列表页头部） */
export function getAllTags(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of allPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 分类计数（chips 徽标用）：三个固定分类恒返回，无文章的为 0 */
export function getCategoryCounts(): { name: PostCategory; count: number }[] {
  return POST_CATEGORIES.map((name) => ({
    name,
    count: allPosts().filter((post) => post.category === name).length,
  }));
}
