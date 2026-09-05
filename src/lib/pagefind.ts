/**
 * Pagefind 运行时加载（search.md S-3：首次唤起弹窗时懒加载）
 *
 * `/pagefind/` 产物由 `pnpm build:search` 在静态导出之后生成，构建期不存在——
 * 必须绕过打包器走浏览器原生动态 import（webpackIgnore / turbopackIgnore 双注释，
 * 覆盖 build 与 dev 两条链路；经变量传入以避开 TS 模块解析）。
 * dev 服务器没有索引产物，加载会 404 → 弹窗进入错误态 + 重试（S-8 降级路径）。
 */

interface PagefindResultData {
  url: string;
  /** 摘要片段（HTML，命中词带 <mark>） */
  excerpt: string;
  meta: { title?: string; category?: string };
}

interface PagefindSearchResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindInstance {
  search(query: string): Promise<{ results: PagefindSearchResult[] }>;
}

export type { PagefindInstance, PagefindResultData };

export async function loadPagefind(): Promise<PagefindInstance> {
  const runtimePath = "/pagefind/pagefind.js";
  return import(
    /* webpackIgnore: true */
    /* turbopackIgnore: true */
    runtimePath
  ) as Promise<PagefindInstance>;
}
