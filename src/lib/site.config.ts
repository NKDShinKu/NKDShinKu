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
  email: "2010182879@qq.com",
  author: "NKDShinKu",
  locale: "zh-CN",
  /** 主导航（REQ-G1；首页由 logo 承担，用户决策）；/posts 等板块页在 M2/M3 落地，届时链接自然生效 */
  nav: [
    { href: "/posts", label: "文章", icon: "icon-[mdi--file-document-outline]" },
    { href: "/projects", label: "项目", icon: "icon-[mdi--flask-outline]" },
    { href: "/bangumi", label: "追番", icon: "icon-[mdi--television-classic]" },
    { href: "/about", label: "关于", icon: "icon-[mdi--information-outline]" },
  ],
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
