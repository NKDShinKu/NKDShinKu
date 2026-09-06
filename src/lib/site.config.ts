/**
 * 站点全局配置 —— 全站元信息唯一来源
 *
 * 约定：站名、域名、简介等基础信息一律从这里读取，不在页面里硬编码。
 * 后续接入 giscus / 评论 / 统计等第三方服务时，相关配置同样收敛到这里。
 */
/** 板块（REQ-H4 / REQ-G1 单一事实来源）：首页 Bento 入口卡与页头导航共同派生 */
const sections = [
  {
    href: "/posts",
    label: "文章",
    icon: "icon-[mdi--file-document-outline]",
    description: "教程、技术笔记与日常，记录学习与思考。",
    span: "md:col-span-2",
  },
  {
    href: "/lab",
    label: "实验室",
    icon: "icon-[mdi--flask-outline]",
    description: "个人项目、小工具与实验 demo，直达仓库或站内体验。",
    span: "",
  },
  {
    href: "/acg",
    label: "ACG",
    icon: "icon-[mdi--star-four-points-outline]",
    description: "二次元收藏橱窗——番剧追番记录、进度与评分。",
    span: "",
  },
  {
    href: "/about",
    label: "关于",
    icon: "icon-[mdi--information-outline]",
    description: "关于我、技能栈与联系方式。",
    span: "md:col-span-2",
  },
] as const;

export const siteConfig = {
  name: "NKDShinKu",
  url: "https://nkdshinku.com",
  description: "NKDShinKu 的个人博客 —— 记录文章、教程、实验室项目、日常与追番。",
  github: "https://github.com/NKDShinKu/NKDShinKu",
  email: "2010182879@qq.com",
  author: "NKDShinKu",
  locale: "zh-CN",
  /** Bangumi 用户 ID（ACG 板块数据源，manifest D6/D14） */
  bangumiUserId: "796189",
  /**
   * 首页全屏 Hero 文案。背景图方案经多版尝试效果不达预期已移除，
   * 首屏透出全局极光/萤火背景；`向下滚动探索` 锚点跳转 #home-content。
   */
  hero: {
    title: "NKDShinKu",
    subtitle: "前端开发者 · ACG爱好者，探索技术与创作的边界。\n这里记录我的文章、项目与追番足迹。",
  },
  /** 主导航（REQ-G1；首页由 logo 承担，用户决策）；从 sections 派生，只取导航所需字段 */
  nav: sections.map(({ href, label, icon }) => ({ href, label, icon })),
  /** 首页板块入口（REQ-H4）：Bento 非对称网格，玻璃卡用于氛围区 */
  sections,
  /** 社交 / 联系入口（页脚图标链接）；Bangumi 用户 ID 见 manifest D6 */
  socials: [
    { label: "GitHub", href: "https://github.com/NKDShinKu", icon: "icon-[mdi--github]" },
    { label: "邮箱", href: "mailto:2010182879@qq.com", icon: "icon-[mdi--email-outline]" },
    {
      label: "Bangumi",
      href: "https://bgm.tv/user/796189",
      icon: "icon-[mdi--television-classic]",
    },
    {
      // 官方「加好友」短链（QQ 内「推广二维码」生成的个人令牌），点开后唤起 QQ 加好友
      label: "QQ",
      href: "https://qm.qq.com/q/ZjeLcpufqs",
      icon: "icon-[mdi--qqchat]",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
