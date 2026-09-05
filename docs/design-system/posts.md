# 页面设计 — 文章板块（M2）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：构建下列路由时，本文档规则覆盖主文档的页面级决策；token / 基础组件（Button / Card / Tag）/ 无障碍与响应式纪律仍以主文档为准。
> 覆盖路由：`/posts`、`/posts/[slug]`、`/posts/category/[cat]`、`/posts/tag/[tag]`、`/posts/categories`、`/posts/tags`、`/archive`，以及首页「最新文章」区块。
> 对应需求：REQ-P1–P6、P12、P13、P14、REQ-H2/H3、REQ-G4。
> **2026-09 用户走查修订**：横卡列表式布局、分类徽章改「前往」语义（无选中态）、新增分类/标签索引页、Hero 背景图方案移除（回归极光首屏）、顶栏 fixed 化——均已随实现更新入档。

---

## 1. 设计决策总览

| #    | 决策点       | 结论                                                                                                                                           |
| ---- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P-1  | 阅读区材质   | 文章卡 / 正文一律**实心 surface**（主文档 §1.6：文字密集区禁玻璃态）；玻璃态仅允许出现在空状态点缀外框                                         |
| P-2  | 列表栅格     | **横向列表卡单列纵排**（用户走查修订）：容器收窄 `max-w-[880px]`；信息密度优先                                                                 |
| P-3  | 正文行长     | 正文列 `max-w-[720px]`（中文 ~38 字/行，符合 65–75ch 纪律）；TOC 侧栏 `w-56`，`xl` 起显示                                                      |
| P-4  | 封面图       | 可选；横卡**右侧 16:10**（桌面 `w-56` / 移动 `w-28`），`<img>` 显式宽高（REQ-G8），hover 微缩放                                                |
| P-5  | 摘要         | 一律取 frontmatter `description`（不截断正文）；卡片内 `line-clamp-2`                                                                          |
| P-6  | 分页         | 静态分页路由 `/posts/page/[page]`（`generateStaticParams`），每页 10 篇                                                                        |
| P-7  | 代码高亮主题 | Shiki 双主题 **catppuccin-latte（亮）/ catppuccin-mocha（暗）**：粉彩色系与 Soft ACG 同频                                                      |
| P-8  | TOC 交互     | scrollspy 高亮当前 h2/h3；标题 `scroll-mt-24`（避让 fixed 顶栏）；**目录/正文锚点点击不进历史栈**（`replaceState` 同步 hash，方案 A 用户决策） |
| P-9  | 详情页动效   | 正文**不入场动画**（阅读优先）；列表卡用 Reveal `subtle` 变体（y 12px / 0.4s / stagger 0.05）                                                  |
| P-10 | 页面背景     | ~~极淡网格~~ → **Hero 背景图方案经多版尝试（fixed/视差/渐变衔接）效果不达预期，整体移除**：全屏首屏透出全局极光/萤火背景（用户决策）           |
| P-11 | 置顶         | `pinned` 文章卡片右上角「置顶」徽章；首页/列表页均优先排序（REQ-H3）                                                                           |
| P-12 | 顶栏形态     | **fixed 悬浮**（D11 演进）：首页首屏透明、滚动越阈切玻璃实心（300ms）；非首页恒实心；内容页 `pt-24/28` 补偿                                    |
| P-13 | 分类徽章语义 | chips 是**前往链接非筛选器**：图标 + 名称 + 计数 + hover 箭头，**无选中态**（含分类页）                                                        |
| P-14 | 索引页       | 新增 `/posts/categories`（分类卡+描述+篇数）与 `/posts/tags`（全量标签云）；列表页头右侧三入口                                                 |
| P-15 | 详情页返回   | 客户端 `BackButton`：`history.back()`，无历史时兜底 `/posts/`                                                                                  |

---

## 2. 新增组件规范

> 均为自研组件（主文档 §2 前言），文件落位 `src/components/posts/`；样式全用工具类，禁止裸 hex。

### 2.1 PostCard 文章横卡（列表 / 首页共用）

- **横向列表式**（用户走查修订）：左文字区 + 右封面；外层 `<Link>` 包 `Card variant="surface" interactive`，焦点态由 Link 承担。

```
┌────────────────────────────────────┐
│▎[分类 Tag] [置顶]                   │  ▎=左侧品牌竖线 w-[3px]，hover scaleY 点亮
│▎标题（text-lg semibold, h2）        │  hover → text-accent（200ms）
│▎摘要 2 行（text-sm muted）          │  line-clamp-2
│▎📅 日期 · ⏱ N 分钟        [→ hover]│  meta 行 text-xs；箭头 hover 滑入
│▎                        ┌────────┐│
│▎                        │封面16:10││  右侧 w-56/移动 w-28，hover scale-[1.04]
└────────────────────────┴────────┴┘
```

- 底色：`bg-gradient-to-br from-surface via-surface to-accent/[0.07]`（白底微品牌渐变，替代纯白）。
- 卡片 padding `p-3.5 md:p-4`；文字列 `min-w-0`（截断需要）。
- 卡片标题为 **h2**（/posts 页 h1 之下不跳级）；首页与列表页共用同一组件。
- 入场：`Reveal subtle`（y 12px / 0.4s / stagger 0.05，reduced-motion 不动画）。

### 2.2 分类徽章（前往语义，用户走查修订）

- **语义重定义**：chips 是跳往分类页的**链接**，非本页筛选器——**无选中/高亮态**（含分类页）。
- 形态：`rounded-full border-border bg-surface/70 backdrop-blur-sm`，`min-h-11`（触控纪律）、`flex-wrap`（禁止裁剪溢出）。
- 内容：分类图标（教程 `mdi--school-outline` / 笔记 `mdi--notebook-outline` / 日常 `mdi--coffee-outline`，`text-accent`）+ 名称 + 计数小徽章（`bg-accent/10 text-accent-dark`）+ hover 右滑箭头 `mdi--chevron-right`。
- 「全部文章」徽章带 `mdi--home-outline`；hover 整体 `border-accent/50 bg-accent/10 text-accent`（150ms）。

### 2.3 标签索引页（`/posts/tags`，用户走查修订）

- 标签云从列表页移除（防膨胀），独立索引页承载：`px-4 py-2 text-sm rounded-full bg-accent/10 text-accent-dark hover:bg-accent/15` + 篇数。
- 分类索引页 `/posts/categories`：三张行卡（图标 + 名称 + 篇数 + 描述 + hover 箭头）。
- 两页在 `/posts` 页头右侧以「分类 / 标签 / 归档」小入口（`EntranceLink`）可达。

### 2.4 分页控件（列表页底部）

- 结构：居中 `flex items-center gap-2`：‹ 上一页 · 页码 · 下一页 ›；页码可点（同 chips 样式，`min-h-[44px] w-11`）。
- 当前页 `bg-accent text-white`；首/末页对应方向按钮禁用态 `opacity-40 pointer-events-none`。
- 辅助文本 `text-xs text-text-muted`：「共 N 篇 · 第 x/y 页」。

### 2.5 文章元信息行（详情页页头）

- `flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted`：
  分类 Tag → `📅 date` → `↻ updated`（仅存在时）→ `⏱ N 分钟阅读`（图标 `size-4` `aria-hidden`）。

### 2.6 代码块（Shiki 容器 + 复制按钮，REQ-P5）

```
┌──────────────────────────┐
│ ts            [⧉ 复制]   │  头栏：语言名 font-mono text-xs muted；按钮 min 44px 触控
├──────────────────────────┤
│ <Shiki 高亮代码>          │  pre: p-4 overflow-x-auto text-sm/leading-relaxed
└──────────────────────────┘
```

- 容器：`rounded-md border border-border overflow-hidden bg-surface`（暗色 Shiki 背景由主题 CSS 变量接管）。
- 复制按钮：ghost 图标按钮 `size-11` 内缩图标 `icon-[mdi--content-copy]`，`aria-label="复制代码"`；成功后 `icon-[mdi--check]` 800ms 复位，配 `aria-live="polite"` 状态文字。
- 双主题切换 CSS（globals.css）：

```css
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

### 2.7 TOC 侧栏（详情页桌面，REQ-P6）

- `hidden xl:block w-56 shrink-0`；内层 `sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto`。
- 标题「目录」：`text-xs font-bold tracking-widest uppercase text-accent-dark`。
- 条目：h2 `text-sm`、h3 `text-sm pl-4`；默认 `border-l-2 border-transparent text-text-muted`；scrollspy 命中 `border-accent text-accent-dark font-medium`（200ms）；当前条目 `aria-current="true"`。
- 客户端组件（IntersectionObserver）；无 JS 时整块不渲染（服务端可渐进增强判断）。

### 2.8 上一篇 / 下一篇（详情页底部，REQ-P7，P2）

- `grid gap-4 sm:grid-cols-2`，两张 `Card surface interactive`：
  左「← 上一篇」右「下一篇 →」；小标 `text-xs text-text-muted` + 标题 `text-base font-medium` hover `text-accent`。
- 无对应文章时该格渲染为禁用态占位（`opacity-40`）。

### 2.9 归档时间线（`/archive`，REQ-P3）

- 年份组：`Reveal` 包裹；年标题行 = `text-2xl font-display font-bold` + 篇数 Tag。
- 时间线：`ml-2 border-l-2 border-border pl-6 space-y-4`；条目圆点 `absolute -left-[31px] top-1 size-2.5 rounded-full bg-accent-light`。
- 条目：日期 `font-mono text-xs text-text-muted` + 标题（hover `text-accent`）+ 分类 Tag；整条可点。

### 2.10 空状态（分类/标签/归档无内容）

- `Card surface` 居中 `py-16`：装饰图标 `icon-[mdi--cloud-search-outline] text-sakura size-10`（樱粉点缀，§3.2 允许项）+ 一句话文案 + Ghost 按钮「返回全部文章」。

---

## 3. 页面布局

### 3.1 `/posts` 列表页（用户走查修订）

```
容器：mx-auto w-full max-w-[880px] px-5 sm:px-6；pt-24 md:pt-28（fixed 顶栏补偿）
─────────────────────────────────
  紧凑页头一行：左「文章」标题   右三入口（分类 / 标签 / 归档，EntranceLink）
  分类徽章（全部文章 · 教程 · 笔记 · 日常，前往语义无选中态，§2.2）  ← flex-wrap
  ─────────────────────────────
  文章横卡单列纵排 gap-5（§2.1）                  ← Reveal subtle stagger 0.05
  ─────────────────────────────
  分页控件
  底部 pb-16 md:pb-24
```

### 3.2 `/posts/[slug]` 详情页

```
容器：mx-auto w-full max-w-[1100px] px-5 sm:px-6；pt-24 md:pt-28（fixed 顶栏补偿）
─────────────────────────────────
flex justify-center gap-10（xl 起）
┌──────────────┬─────────┐
│ 正文列 720px  │ TOC 224 │   ← TOC hidden xl:block（§2.7）
├──────────────┴─────────┤
│ « 返回（BackButton）    │   history.back()；无历史兜底 /posts/（P-15）
│ 元信息行（§2.5）        │
│ H1 标题                 │   text-2xl md:text-3xl font-display font-bold
│                          │   leading-tight [text-wrap:balance]
│ 导语（description）      │   text-base text-text-muted leading-relaxed
│                          │   border-l-2 border-sakura pl-4
│ ───────────────        │   分隔线 border-border
│ 正文 prose（§4）         │   零入场动画（P-9）
│ ───────────────        │
│ 标签行（Tag 列表）       │   gap-2 flex-wrap
│ 上一篇 / 下一篇（§2.8）  │   P2
└──────────────────────────┘
移动端（<xl）：无 TOC（已实现）；P2 再加 FAB（目录/回顶部，REQ-P14）
```

- 阅读进度条（REQ-P9，P2 预留槽位）：`fixed top-16 left-0 h-0.5 z-40 bg-gradient-to-r from-accent to-twilight`，宽度=滚动进度。

### 3.3 分类页 / 标签页

- 完全复用列表页布局，仅头部替换：`« 全部文章` 返回链接 + 名称标题（`text-2xl font-display font-bold`）+ 篇数 Tag + 分类描述（分类页有 / 标签页无）。
- 分类徽章照常渲染（§2.2 前往语义，无选中态）。

### 3.4 `/archive` 归档页

- 居中章节标题（Archive / 归档 / 共 N 篇）→ 年份组时间线自上而下（§2.9）。

### 3.5 首页「最新文章」区块改造（REQ-H2/H3）

- 区块头：§2.4 居中版式 + 右上「查看全部 →」链接（`text-sm text-accent-dark hover:text-accent`）。
- 栅格 `grid gap-6 md:grid-cols-3`，取最新 3 篇（`pinned` 优先）；卡片复用 PostCard（无封面形态）。
- 替换 M1 的「建设中」占位卡。

---

## 4. prose 排版定制（globals.css，@tailwindcss/typography）

| 元素       | 规范                                                                                                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 正文       | `text-base`，行高 **1.875**（中文舒朗），段距 `1.25em`；移动端不小于 16px                                                                                                                      |
| h2         | `text-2xl font-display font-semibold mt-12 mb-4` + 锚点（rehype-slug；hover 显示 `#` 链接）                                                                                                    |
| h3         | `text-xl font-display font-semibold mt-8 mb-3`                                                                                                                                                 |
| h4         | `text-lg font-semibold mt-6 mb-2`                                                                                                                                                              |
| a          | `text-accent-dark underline decoration-accent/40 underline-offset-4 hover:text-accent`                                                                                                         |
| strong     | `font-semibold text-text`                                                                                                                                                                      |
| blockquote | `border-l-4 border-accent/40 pl-4 my-6 text-text-muted`（**不用斜体**，中文排版纪律）                                                                                                          |
| 列表       | `my-4 space-y-2 pl-6`；marker `text-accent`                                                                                                                                                    |
| 行内代码   | `font-mono text-sm bg-accent/10 text-accent-dark rounded px-1.5 py-0.5`                                                                                                                        |
| pre/代码块 | 见 §2.6（Shiki 容器，非 prose 默认样式）                                                                                                                                                       |
| table      | `my-6 w-full text-sm`；th `bg-accent/8 font-semibold px-3 py-2 text-left border-b-border`；td `px-3 py-2 border-b-border/60`；斑马 `even:bg-bg/50`；外层 `overflow-x-auto`（移动端不横向溢出） |
| img        | `my-6 rounded-md border border-border`；figcaption `mt-2 text-center text-xs text-text-muted`                                                                                                  |
| hr         | `my-10 border-border`                                                                                                                                                                          |
| Mermaid    | 居中卡：`my-6 rounded-md border border-border bg-surface p-6 flex justify-center`（REQ-P12）                                                                                                   |

---

## 5. 动效（接主文档 §3.3）

| 场景            | 方式              | 参数                           |
| --------------- | ----------------- | ------------------------------ |
| 列表卡片入场    | GSAP Reveal       | 600ms power2.out，stagger 0.08 |
| 归档年份组入场  | GSAP Reveal       | 600ms power2.out               |
| 详情页正文      | **无动画**（P-9） | —                              |
| TOC scrollspy   | CSS               | 200ms ease-out                 |
| 卡片/标题 hover | CSS               | 150–200ms（主文档）            |
| 复制按钮反馈    | CSS + 状态切换    | 150ms；图标 800ms 复位         |

`prefers-reduced-motion: reduce` 下 GSAP 全部不触发（Reveal 已守卫）；smooth scroll 同步禁用（`@media` 内改 `auto`）。

---

## 6. 响应式与无障碍要点（本板块增量）

- 断点行为：`<768px` 卡片 1 列 / 表格横滚 / 无 TOC；`768–1279px` 卡片 2 列 / 无 TOC；`≥1280px` TOC 出现。
- 标题锚点链接：`aria-label="标题锚点"`；focus-visible 可达。
- TOC / chips 当前项用 `aria-current`；代码复制结果 `aria-live="polite"`。
- 分页禁用方向按钮保留在 DOM（`aria-disabled`），不裸删。
- 图片：封面与正文图均需 `alt`（写不出有效描述的装饰图 `alt=""`）。

---

## 7. 交付验收清单（本板块增量，接主文档 §8）

- [ ] 列表页 chips / 标签云在 375px 宽度可完整换行、无横向滚动
- [ ] 代码块双主题在亮/暗下均无「白底白字」或对比度事故（catppuccin 两态实测）
- [ ] TOC scrollspy 与实际阅读位置一致（长文实测），smooth scroll 避让顶栏
- [ ] 表格在 375px 横向滚动正常、正文列不溢出
- [ ] 无封面 / 有封面两形态卡片混排视觉一致
- [ ] 空状态（分类/标签/归档）文案与返回路径正确
- [ ] 详情页无入场动画干扰阅读（P-9）
