/**
 * ACG 数据层 —— Bangumi v0 收藏（浏览器端 fetch + localStorage 缓存）
 *
 * 约定（docs/design-system/acg.md M-10 + manifest D14/D18）：
 * - api.bgm.tv 浏览器直连（ACAO *，D14 实测）；纯客户端，SSR 环境跳过缓存直连网络
 * - 缓存 localStorage `acg-collections-v1`：按分组存 {cachedAt,total,items}，TTL 30 分钟；
 *   过期但存在 → 先返回缓存并静默后台刷新（SWR 语义），手动刷新用 refresh: true
 * - 外部数据半可信：逐条防御性解析，坏条目跳过而非抛错（区别于 posts.ts 的构建期快失败）
 */
import { siteConfig } from "@/lib/site.config";

const API_BASE = "https://api.bgm.tv";
const CACHE_KEY = "acg-collections-v1";
const CACHE_TTL_MS = 30 * 60 * 1000;
const PAGE_SIZE = 100;
const FETCH_TIMEOUT_MS = 10_000;

/** Bangumi 收藏分组（v0 type 参数）；展示顺序：在看 → 想看 → 看过 → 搁置 → 抛弃 */
export const ACG_GROUP_TYPES = [3, 1, 2, 4, 5] as const;
export type AcgGroupType = (typeof ACG_GROUP_TYPES)[number];

export const ACG_GROUP_LABELS: Record<AcgGroupType, string> = {
  3: "在看",
  1: "想看",
  2: "看过",
  4: "搁置",
  5: "抛弃",
};

/** 归档页左栏英文副题 */
export const ACG_GROUP_EN: Record<AcgGroupType, string> = {
  3: "Watching",
  1: "Wish",
  2: "Completed",
  4: "On Hold",
  5: "Dropped",
};

export interface AcgSubject {
  id: number;
  name: string;
  nameCn: string;
  cover: string;
  summary: string;
  /** Bangumi 社区评分（0 = 无评分） */
  score: number;
  /** Bangumi 排名（0 = 无排名） */
  rank: number;
  /** 放送日期（YYYY-MM-DD 或空） */
  date: string;
  /** 社区热门标签（前 3） */
  tags: string[];
  /** 总集数（0 = 未知） */
  eps: number;
}

export interface AcgCollectionItem {
  subject: AcgSubject;
  /** 我的评分（0 = 未评分） */
  rate: number;
  /** 看到第几话 */
  epStatus: number;
  /** 我的短评（可空） */
  comment: string;
  updatedAt: string;
}

export interface AcgGroupData {
  type: AcgGroupType;
  total: number;
  items: AcgCollectionItem[];
}

export interface AcgGroupResult {
  data: AcgGroupData;
  fromCache: boolean;
}

export interface AcgSectionPreview {
  type: AcgGroupType;
  total: number;
  items: AcgCollectionItem[];
}

export interface AcgHubData {
  /** 橱窗区块（在看 → 看过 → 想看），各取前 12 */
  sections: AcgSectionPreview[];
  fromCache: boolean;
}

/** —— v0 响应原始形状（仅声明用到的字段，全部可选 + unknown） —— */
interface RawSubject {
  id?: unknown;
  name?: unknown;
  name_cn?: unknown;
  images?: { common?: unknown; medium?: unknown; large?: unknown };
  short_summary?: unknown;
  tags?: { name?: unknown }[];
  score?: unknown;
  rank?: unknown;
  date?: unknown;
  eps?: unknown;
}
interface RawCollection {
  subject?: RawSubject;
  rate?: unknown;
  ep_status?: unknown;
  comment?: unknown;
  updated_at?: unknown;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
}
function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** 单条防御性解析：subject 缺失或无 id 视为坏条目跳过 */
function parseItem(raw: RawCollection): AcgCollectionItem | null {
  const s = raw.subject;
  const id = asNumber(s?.id);
  if (!s || id === 0) return null;
  const images = s.images;
  return {
    subject: {
      id,
      name: asString(s.name),
      nameCn: asString(s.name_cn) || asString(s.name),
      cover: asString(images?.common) || asString(images?.medium) || asString(images?.large),
      summary: asString(s.short_summary),
      score: asNumber(s.score),
      rank: asNumber(s.rank),
      date: asString(s.date),
      tags: Array.isArray(s.tags)
        ? s.tags.slice(0, 3).map((t) => asString(t.name)).filter(Boolean)
        : [],
      eps: asNumber(s.eps),
    },
    rate: asNumber(raw.rate),
    epStatus: asNumber(raw.ep_status),
    comment: typeof raw.comment === "string" ? raw.comment : "",
    updatedAt: asString(raw.updated_at),
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`[acg] Bangumi API ${res.status}`);
  return res.json();
}

async function fetchGroupPage(
  type: AcgGroupType,
  offset: number,
  limit: number,
): Promise<{ total: number; items: AcgCollectionItem[] }> {
  const url = `${API_BASE}/v0/users/${siteConfig.bangumiUserId}/collections?subject_type=2&type=${type}&limit=${limit}&offset=${offset}`;
  const raw = (await fetchJson(url)) as { total?: unknown; data?: RawCollection[] };
  const list = Array.isArray(raw.data) ? raw.data : [];
  const items = list
    .map((item) => parseItem(item ?? {}))
    .filter((item): item is AcgCollectionItem => item !== null);
  return { total: asNumber(raw.total) || items.length, items };
}

/** 拉取整组（顺序翻页：对限流友好，看过 389 部 ≈ 4 页） */
async function fetchGroupAll(type: AcgGroupType): Promise<AcgGroupData> {
  const first = await fetchGroupPage(type, 0, PAGE_SIZE);
  const items = [...first.items];
  for (let offset = PAGE_SIZE; offset < first.total; offset += PAGE_SIZE) {
    const page = await fetchGroupPage(type, offset, PAGE_SIZE);
    items.push(...page.items);
  }
  return { type, total: first.total, items };
}

/** —— 缓存 —— */
interface AcgCacheEntry {
  cachedAt: number;
  total: number;
  /** totals-only 轻查询时可为空（仅缓存计数） */
  items?: AcgCollectionItem[];
}
interface AcgCache {
  groups: Partial<Record<AcgGroupType, AcgCacheEntry>>;
  /** hub 橱窗预览（在看/看过/想看 各前 12） */
  previews?: {
    cachedAt: number;
    sections: Partial<Record<AcgGroupType, { total: number; items: AcgCollectionItem[] }>>;
  };
}

function readCache(): AcgCache {
  if (typeof window === "undefined") return { groups: {} };
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    const parsed = raw ? (JSON.parse(raw) as AcgCache) : null;
    return parsed?.groups ? parsed : { groups: {} };
  } catch {
    return { groups: {} };
  }
}

function writeEntry(type: AcgGroupType, entry: AcgCacheEntry): void {
  if (typeof window === "undefined") return;
  try {
    const cache = readCache();
    cache.groups[type] = entry;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* 隐私模式等场景写失败不影响功能 */
  }
}

function isFresh(entry: AcgCacheEntry | undefined): entry is AcgCacheEntry & { items: AcgCollectionItem[] } {
  return (
    entry !== undefined &&
    typeof entry.cachedAt === "number" &&
    Date.now() - entry.cachedAt < CACHE_TTL_MS &&
    Array.isArray(entry.items)
  );
}

/** 过期但存在：返回 true 的同时触发静默后台刷新（SWR 语义，结果只写缓存） */
function revalidateInBackground(type: AcgGroupType, cachedAt: number): boolean {
  if (Date.now() - cachedAt < CACHE_TTL_MS) return false;
  void fetchGroupAll(type)
    .then((data) =>
      writeEntry(type, { cachedAt: Date.now(), total: data.total, items: data.items }),
    )
    .catch(() => {});
  return true;
}

/**
 * 取单个分组：缓存 30 分钟内直接用；过期但存在 → 返回缓存 + 后台刷新；
 * 无缓存或 refresh: true → 网络拉全量
 */
export async function getGroupData(
  type: AcgGroupType,
  options?: { refresh?: boolean },
): Promise<AcgGroupResult> {
  const cached = readCache().groups[type];
  if (!options?.refresh && isFresh(cached)) {
    return {
      data: { type, total: cached.total, items: cached.items },
      fromCache: true,
    };
  }
  if (!options?.refresh && cached && revalidateInBackground(type, cached.cachedAt)) {
    return {
      data: { type, total: cached.total, items: cached.items ?? [] },
      fromCache: true,
    };
  }
  const data = await fetchGroupAll(type);
  writeEntry(type, { cachedAt: Date.now(), total: data.total, items: data.items });
  return { data, fromCache: false };
}

/** 轻查询：只取分组计数（缓存优先，不拉条目列表）；归档顶栏 TOTAL 用 */
export async function getGroupTotal(type: AcgGroupType, refresh?: boolean): Promise<number> {
  const cached = readCache().groups[type];
  if (!refresh && cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    revalidateInBackground(type, cached.cachedAt);
    return cached.total;
  }
  const page = await fetchGroupPage(type, 0, 1);
  writeEntry(type, { cachedAt: Date.now(), total: page.total, items: cached?.items });
  return page.total;
}

/** hub 橱窗区块顺序（用户决策）：在看 → 看过 → 想看 */
const HUB_SECTIONS = [3, 2, 1] as const satisfies readonly AcgGroupType[];
const PREVIEW_LIMIT = 12;

/** hub 数据：三区橱窗预览（并行 3 请求，previews 缓存 30 分钟） */
export async function getHubData(options?: { refresh?: boolean }): Promise<AcgHubData> {
  const cached = readCache().previews;
  if (!options?.refresh && cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    const sections: AcgSectionPreview[] = [];
    for (const type of HUB_SECTIONS) {
      const entry = cached.sections[type];
      if (entry) sections.push({ type, total: entry.total, items: entry.items });
    }
    if (sections.length === HUB_SECTIONS.length) {
      return { sections, fromCache: true };
    }
  }
  const pages = await Promise.all(
    HUB_SECTIONS.map((type) => fetchGroupPage(type, 0, PREVIEW_LIMIT)),
  );
  const sections = pages.map((page, i) => ({
    type: HUB_SECTIONS[i],
    total: page.total,
    items: page.items,
  }));
  if (typeof window !== "undefined") {
    try {
      const cache = readCache();
      cache.previews = {
        cachedAt: Date.now(),
        sections: Object.fromEntries(
          sections.map((s) => [s.type, { total: s.total, items: s.items }]),
        ),
      };
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      /* 写失败不影响功能 */
    }
  }
  return { sections, fromCache: false };
}
