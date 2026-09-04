# 页面设计 — 关于页（M3）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：构建 `/about` 时，本文档规则覆盖主文档的页面级决策；token / 基础组件 / 无障碍与响应式纪律仍以主文档为准。
> 对应需求：REQ-A1（P1，走查修订见 §0 注）、REQ-A2（P2）、REQ-F3（订阅入口）、REQ-G4。
> 设计方向（manifest D16）：**站点事实卡**路线——页面主角是「这个站点」而非「我的履历」；个性化记忆点放在卡片文案、色调节奏与字数小组件。
> **2026-09 用户走查修订**：① 事实卡引入彩色节奏（参考站点事实卡形态：品牌渐变大卡 / 彩色点缀卡 / 白卡交替 + 值下装饰条 + 说明锚底留白）；② 「关于我」长文与技能栈移除（与问候面板人设重复）；③ 建站时间线移除。页面收敛为「问候面板 + 事实卡网格」。
> 内容素材（开放问题 O3）：站名由来/理念文案由用户提供；落地时先占位（`src/lib/about.ts` 集中一处），后替换。

---

## 1. 设计决策总览

| #    | 决策点     | 结论                                                                                                                              |
| ---- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| A-1  | 页面主角   | 「站点」事实卡为主体（D16）；个人内容仅存在于问候面板的一句话人设（2026-09 修订：长文/技能/时间线全部移除）                        |
| A-2  | 页面背景   | 沿用全局极光/萤火（本页不新增背景层）                                                                                             |
| A-3  | 卡片材质   | 事实卡**实心 surface 为基底**；彩色节奏：brand 渐变卡 / sakura / warning / twilight 点缀卡与白卡交替（10–12% 透明度纪律）；唯一玻璃态：问候面板（已升级为品牌渐变玻璃卡） |
| A-4  | 事实卡形式 | 小标签 + **大号主值** + 装饰条（h-1 圆角短棒）+ **锚底说明**——说明 `mt-auto` 沉底，卡内留白制造呼吸感（参考站点事实卡节奏）        |
| A-5  | 个性化记忆点 | ① 站名由来卡（品牌渐变 + 渐变文字大值，跨 2 列）② 字数换算小部件（≈ N 本《小王子》，跨 2 列，随写作自动增长）                    |
| A-6  | 个人区块   | 仅问候面板：头像 + 一句话人设 + 社交/联系图标行 + RSS 订阅（REQ-A1 收敛形态；长文自我介绍与技能栈经用户决策移除）                  |
| A-7  | 动效       | 事实卡 `Reveal subtle` stagger 0.04；问候面板 Reveal 入场；卡片区非交互无 hover 位移                                              |
| A-8  | 数据来源   | 所有「事实」从 `site.config` / `lib/about.ts` 派生或集中配置，**页面零硬编码**；O3 占位文案集中在 `lib/about.ts` 顶部              |
| A-9  | 卡片清单   | 7 张：站名由来（brand，跨2）/ 理念（sakura）/ 网站类型（白）/ 技术栈（白）/ 站点状态（warning，参考站点黄色状态卡）/ 写作字数（twilight，跨2）/ 源代码（白，含仓库外链） |

---

## 2. 新增组件规范

> 均为自研组件，文件落位 `src/components/about/`；样式全用工具类，禁止裸 hex。

### 2.1 FactCard 事实卡（A-4，2026-09 修订）

```
┌────────────────────────┐
│ ◆ 标签（xs uppercase）  │   图标 size-4 text-accent aria-hidden
│ 主值（text-lg~2xl bold）│   font-display；brand/字数卡 text-2xl~3xl
│ ▬▬▬▬                   │   h-1 w-10 rounded-full，色调同卡
│ （留白）               │
│ 说明（text-sm muted）   │   mt-auto 锚底
└────────────────────────┘  min-h-40（160px）
```

- 色调 prop `tone: plain | brand | sakura | warning | twilight`：
  - `plain`：`border-border bg-surface`，装饰条 `bg-accent/25`
  - `brand`：`border-accent/25` + `bg-gradient-to-br from-accent/15 via-surface to-sakura/15`，主值可用品牌渐变文字（`bg-clip-text`，主文档 §1.1 大号标题渐变许可）
  - `sakura`：`border-sakura/30 bg-sakura/10`；`warning`：`border-warning/40 bg-warning/12`（状态卡，参考站点黄色状态卡）；`twilight`：`border-twilight/30 bg-twilight/12`
- 非交互卡：无 hover 位移；`源代码` 卡说明内嵌仓库外链（prose 链接样式 + `↗`），是卡内唯一交互元素。
- 网格：`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`；brand 与字数卡 `sm:col-span-2`（行节奏：2+1 / 1+1+1 / 2+1）。

### 2.2 页头问候面板（A-3，唯一玻璃卡，2026-09 修订品牌渐变）

- 玻璃态升级为品牌渐变：`bg-gradient-to-br from-accent/12 via-glass to-sakura/12` + `backdrop-blur-[16px]` + `border-glass-border`，`rounded-lg p-6 md:p-8`。
- 头像（`/icon.svg` 兜底，O3 替换）+ h1「你好，我是 NKDShinKu」+ 挥手图标（`mdi--hand-wave`，aria-hidden）+ 人设一行。
- 社交行复用 `siteConfig.socials` + RSS（`/feed.xml`，REQ-F3）；图标按钮 `size-11`，`aria-label`。

### 2.3 小节标题

- 紧凑左对齐（lab.md §2.4 同款）：英文 uppercase 小标签 + 中文标题。整页仅一节：「About This Site / 关于本站」。

---

## 3. 页面布局（2026-09 修订后）

```
容器：mx-auto w-full max-w-[880px] px-5 sm:px-6；pt-24 md:pt-28 pb-16 md:pb-24
─────────────────────────────────
  问候面板（品牌渐变玻璃卡，§2.2）
  ─────────────────────────────
  「关于本站」小节标题
  事实卡网格 ×7（§2.1；行节奏 2+1 / 1+1+1 / 2+1）
```

- 已移除（2026-09 用户决策）：「关于我」prose 短文与技能 Tag 行（REQ-A1 修订）、「建站时间线」。
- metadata：`title: 关于 | NKDShinKu`；整页 `data-pagefind-ignore`（REQ-S2 首期仅文章）。

---

## 4. 动效（接主文档 §3.3）

| 场景         | 方式        | 参数                           |
| ------------ | ----------- | ------------------------------ |
| 问候面板入场 | GSAP Reveal | 600ms power2.out               |
| 事实卡入场   | GSAP Reveal | 400ms subtle，stagger 0.04     |

`prefers-reduced-motion: reduce` 全部禁用（Reveal 已守卫）。

---

## 5. 响应式与无障碍要点（本板块增量）

- 断点行为：`<640px` 事实卡 1 列 / 头像纵排；`≥640px` 2 列；`≥1024px` 3 列；跨列卡在 sm 即生效（`sm:col-span-2`）。
- 头像 `alt` 必填（O3 素材到位前用站点 icon 兜底）。
- 社交图标按钮 `aria-label` + `focus-visible` ring；触控 ≥ 44px；外链 `rel="noopener noreferrer"`。
- 事实卡非交互：不包 Link、无 hover 位移；彩色卡上的文字仍走 `text`/`text-muted`（tint ≤ 12% 不伤对比度）；装饰条 `aria-hidden`。
- 对比度：brand 卡渐变文字为大号展示值（≥ text-2xl），符合大号文字许可。

---

## 6. 交付验收清单（本板块增量，接主文档 §8）

- [ ] 7 张卡在 375px 单列不溢出；亮/暗两态下彩色卡（sakura/warning/twilight/brand）文字对比达标、边框可见
- [ ] 行节奏正确：lg 下 2+1 / 1+1+1 / 2+1；sm 下跨列卡占满
- [ ] 社交行图标键盘可达且 `aria-label` 齐全；RSS 入口存在（REQ-F3）
- [ ] 字数卡数值与实际内容一致（构建期派生）；状态卡日期 = 最新文章更新日
- [ ] 问候面板渐变玻璃在极光背景上两态可读（文字对比 ≥ 4.5:1）
- [ ] O3 占位文案集中在 `lib/about.ts`（站名由来/理念），待用户素材替换
