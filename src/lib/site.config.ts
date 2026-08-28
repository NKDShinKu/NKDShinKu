/**
 * 站点全局配置 —— 全站元信息唯一来源
 *
 * 约定：站名、域名、简介等基础信息一律从这里读取，不在页面里硬编码。
 * 后续接入 giscus / 评论 / 统计等第三方服务时，相关配置同样收敛到这里。
 */
export const siteConfig = {
  name: "NKDShinKu",
  url: "https://nkdshinku.com",
  description: "NKDShinKu 的个人博客 —— 记录文章、教程、实验室项目、日常与追番。",
  github: "https://github.com/NKDShinKu/NKDShinKu",
  author: "NKDShinKu",
  locale: "zh-CN",
} as const;

export type SiteConfig = typeof siteConfig;
