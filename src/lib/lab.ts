/**
 * 实验室数据层 —— 类型定义与聚合（构建期，服务端组件调用）
 *
 * 约定（content/lab.ts 头注释 + docs/design-system/lab.md）：
 * - 条目数据唯一来源是 content/lab.ts；本模块只做类型、校验与聚合，不再读文件
 * - 校验失败直接抛错：构建期快速失败优于静默产出坏数据（同 posts.ts 纪律）
 */

export const LAB_TYPES = ["project", "tool", "experiment"] as const;
export type LabType = (typeof LAB_TYPES)[number];

export const LAB_STATUSES = ["active", "archived", "planned"] as const;
export type LabStatus = (typeof LAB_STATUSES)[number];

/** 类型展示文案（徽章/分组标题用），集中在此防散落硬编码 */
export const LAB_TYPE_LABELS: Record<LabType, string> = {
  project: "项目",
  tool: "小工具",
  experiment: "实验",
};

export const LAB_STATUS_LABELS: Record<LabStatus, string> = {
  active: "维护中",
  archived: "归档",
  planned: "构思",
};

export interface LabLink {
  label: string;
  href: string;
}

export interface LabItem {
  /** ASCII slug；站内型即路由 /lab/[slug] */
  slug: string;
  name: string;
  /** 一句话简介（卡片展示） */
  tagline: string;
  type: LabType;
  tech: readonly string[];
  status: LabStatus;
  featured?: boolean;
  cover?: string;
  kind: "external" | "internal";
  /** 外链型必填（至少一个）；站内型可为空数组 */
  links: readonly LabLink[];
  /** 站内型条目说明（/lab/[slug] prose 区渲染，Markdown）；外链型可省 */
  description?: string;
}

/** status 展示权重（lab.md §2.4：active > planned > archived） */
const STATUS_WEIGHT: Record<LabStatus, number> = {
  active: 0,
  planned: 1,
  archived: 2,
};

/** 单条目静态校验：slug ASCII、外链型至少一链、站内型须有 description（demo 页内容） */
export function validateLabItem(item: LabItem): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
    throw new Error(
      `[lab] 条目「${item.name}」slug「${item.slug}」须为小写 ASCII kebab-case（静态导出红线，AGENTS §7）`,
    );
  }
  if (!LAB_TYPES.includes(item.type)) {
    throw new Error(`[lab] 条目「${item.name}」type「${item.type}」不在 LAB_TYPES 内`);
  }
  if (!LAB_STATUSES.includes(item.status)) {
    throw new Error(`[lab] 条目「${item.name}」status「${item.status}」不在 LAB_STATUSES 内`);
  }
  if (item.kind === "external" && item.links.length === 0) {
    throw new Error(`[lab] 外链型条目「${item.name}」links 至少需要一个链接`);
  }
  for (const link of item.links) {
    if (link.label.length === 0 || !/^https?:\/\//.test(link.href)) {
      throw new Error(
        `[lab] 条目「${item.name}」链接「${link.label}」须有非空 label 与 http(s) href`,
      );
    }
  }
  if (item.kind === "internal" && !item.description) {
    throw new Error(`[lab] 站内型条目「${item.name}」须提供 description（demo 页说明区内容）`);
  }
}

/** 组内排序：featured 优先 → status 权重 → 名称稳定序 */
function compareItems(a: LabItem, b: LabItem): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const byStatus = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
  if (byStatus !== 0) return byStatus;
  return a.name.localeCompare(b.name);
}

/** 全量校验 + 排序后的条目列表（构建期调用一次） */
export function normalizeLabItems(items: readonly LabItem[]): LabItem[] {
  const seen = new Set<string>();
  for (const item of items) {
    validateLabItem(item);
    if (seen.has(item.slug)) {
      throw new Error(`[lab] slug「${item.slug}」重复（name: ${item.name}）`);
    }
    seen.add(item.slug);
  }
  return [...items].sort(compareItems);
}

/** 按 type 分组（组序 project → tool → experiment，lab.md §2.4），组内已排序 */
export function groupLabItemsByType(
  items: readonly LabItem[],
): { type: LabType; label: string; items: LabItem[] }[] {
  const groups = LAB_TYPES.map((type) => ({
    type,
    label: LAB_TYPE_LABELS[type],
    items: items.filter((item) => item.type === type).sort(compareItems),
  })).filter((group) => group.items.length > 0);
  return groups;
}

/** 按 slug 取单条目；不存在返回 null（页面 404 处理） */
export function getLabItemBySlug(items: readonly LabItem[], slug: string): LabItem | null {
  return items.find((item) => item.slug === slug) ?? null;
}
