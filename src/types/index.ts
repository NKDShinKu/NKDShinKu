// ============================================================
// NKDShinKu — 全局 TypeScript 类型定义
// ============================================================

// ========== 博客文章 ==========

/** Markdown 文件 frontmatter 字段 */
export interface PostFrontmatter {
  title: string
  date: string // YYYY-MM-DD
  tags: string[]
  summary: string
  draft?: boolean // 默认 false，true 时生产构建过滤
  cover?: string // 封面图路径（预留）
}

/** 解析后的完整文章对象 */
export interface Post {
  slug: string // 文件名（不含扩展名），用作路由参数
  frontmatter: PostFrontmatter
  html: string // marked 渲染后的 HTML
}

// ========== 项目 ==========

export type ProjectStatus = 'active' | 'completed' | 'archived'

export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  link?: string // 在线地址
  github?: string // 源码地址
  status: ProjectStatus
  cover?: string
  learned: string // 「学到了什么」
}

// ========== Bangumi 追番 ==========

/** Bangumi 条目基础信息（来自 API） */
export interface BangumiSubject {
  id: number
  name: string // 日文名
  name_cn: string // 中文名
  cover: string // 封面图 URL
  eps: number // 总集数
  rating?: number // Bangumi 评分 (0-10)
}

export type BangumiStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped'

/** 用户收藏条目 */
export interface BangumiCollection {
  subject: BangumiSubject
  status: BangumiStatus
  progress: number // 已看集数
  rate?: number // 个人评分
}

// ========== 主题 ==========

export type Theme = 'light' | 'dark'

// ========== 通用 UI ==========

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'

export type TagVariant = 'default' | 'sakura' | 'twilight' | 'success'

/** 标签过滤选项 */
export interface TagOption {
  label: string
  value: string
  variant?: TagVariant
}

/** 分类过滤选项 */
export interface CategoryOption {
  label: string
  value: string
}

// ========== Bangumi API 响应（部分字段） ==========

/** bgm.tv /v0/users/:username/collections 响应 */
export interface BangumiCollectionResponse {
  data: {
    subject_id: number
    name: string
    name_cn: string
    images?: {
      large?: string
      common?: string
      medium?: string
      small?: string
    }
    eps?: number
    rating?: {
      score: number
      total: number
    }
  }[]
  total: number
}
