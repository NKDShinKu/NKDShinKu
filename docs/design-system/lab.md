# 页面设计 — 实验室板块（M3）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：构建下列路由时，本文档规则覆盖主文档的页面级决策；token / 基础组件（Button / Card / Tag）/ 无障碍与响应式纪律仍以主文档为准。
> 覆盖路由：`/lab`、`/lab/[slug]`（站内型条目壳）。
> 对应需求：REQ-L1–L6、REQ-G4/G6/G8、REQ-H4（首页入口已随 D15 更新）。
> 板块定义（manifest D15）：外链型（跳仓库/直链）+ 站内型（`/lab/[slug]` 直接体验）双形态。
> 数据模型：`content/lab.ts`（`LabItem`，见 `content/README.md` §3）。

---

## 1. 设计决策总览

| #    | 决策点       | 结论                                                                                                                       |
| ---- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| L-1  | 页面背景     | 沿用主文档 §3.2「实验室（原项目）：极光光斑（弱化）」——透出全局极光/萤火，本页不新增背景层                                 |
| L-2  | 卡片材质     | 列表卡**实心 surface**（主文档 §1.6 文字区纪律）；玻璃态仅允许出现在页头类型徽章与空状态外框                               |
| L-3  | 栅格         | Bento 网格（主文档 §3.4 次模式）：`grid gap-6 md:grid-cols-2 xl:grid-cols-3`；featured 条目 `md:col-span-2`（REQ-L5）     |
| L-4  | 类型分组     | 按 `type` 分组渲染（项目 / 小工具 / 实验），组标题用主文档 §2.4 章节标题紧凑变体；**首版不做页内筛选**（REQ-L6 留 P2）    |
| L-5  | 外链与站内区分 | 类型徽章 + 卡片右上角行动箭头：站内型 `mdi--open-in-new` 置灰、外链型 `mdi--arrow-top-right` 品牌色；卡片整体行为一致（点击进入） |
| L-6  | 站内条目页壳 | `/lab/[slug]` 统一骨架：返回栏 + 条目标题/元信息 + demo 区（`min-h-[400px]`）+ 条目说明区；demo 实现为独立组件（叶子客户端组件） |
| L-7  | 封面图       | 可选；无封面时以类型图标 + 渐变底占位（`from-accent/10 via-surface to-twilight/10`），16:10 显式宽高（REQ-G8）             |
| L-8  | 动效         | 卡片 `Reveal subtle` stagger 0.05（同文章卡）；hover 抬升 `-translate-y-1` + `shadow-lg-glow`；站内 demo 页无入场动画      |
| L-9  | 搜索范围     | 本板块条目不进 Pagefind 索引（REQ-S2 后续扩展）；Pagefind 索引构建时需排除 `/lab` demo 页内容                              |

---

## 2. 新增组件规范

> 均为自研组件，文件落位 `src/components/lab/`；样式全用工具类，禁止裸 hex。

### 2.1 LabCard 条目卡（列表页）

- Bento 网格单元，外层 `<Link>`（站内型 → `/lab/[slug]`；外链型 → `links[0].href`，`target="_blank" rel="noopener noreferrer"`），包 `Card variant="surface" interactive`。

```
┌────────────────────────────┐
│ [类型 Tag]      [状态点]    │   类型：项目/工具/实验；状态：维护中/归档/构思（点+文字）
│ 条目名（text-lg semibold） │   h2；hover → text-accent（200ms）
│ 一句话简介（text-sm muted）│   line-clamp-2
│ ┌────────────────────────┐│
│ │ 封面 16:10 / 图标占位   ││   可选；hover scale-[1.04]
│ └────────────────────────┘│
│ 🔧 React · TypeScript  ↗  │   tech 标签 xs；行动箭头 hover 滑入
└────────────────────────────┘
```

- 底色同 PostCard：`bg-gradient-to-br from-surface via-surface to-accent/[0.07]`。
- 类型徽章配色（§2.3）；状态用 `success/warning/border` 点 + `text-xs` 文案（非仅颜色）。
- 外链型多链接时：卡片主点击 = `links[0]`；其余链接在**详情描述层不出现**——外链型无详情页，多链接以卡内小图标行呈现（GitHub `mdi--github` / 演示 `mdi--open-in-new` / 视频 `mdi--play-circle-outline`，`aria-label`，44px 触控）。
- 站内型卡片行动箭头为 `mdi--arrow-right`（站内跳转语义），配 `aria-hidden`。

### 2.2 类型徽章（Tag 扩展）

| type         | 文案   | 样式（接主文档 §2.3 配色纪律）                | 图标                          |
| ------------ | ------ | --------------------------------------------- | ----------------------------- |
| `project`    | 项目   | `bg-accent/10 text-accent-dark`               | `mdi--cube-outline`           |
| `tool`       | 小工具 | `bg-twilight/12 text-twilight`（配对图标）    | `mdi--tools`                  |
| `experiment` | 实验   | `bg-sakura/12 text-sakura`（仅徽章语境）      | `mdi--flask-outline`          |

- 均为静态徽章（非交互），`rounded-full px-2.5 py-1 text-xs font-medium`。

### 2.3 状态指示（卡片右上角）

- `active`（维护中）：`bg-success/12 text-[green-700 深]`——亮色 `text-success` 配对深变体待落地时以对比度实测为准；暗色 `text-success`。图标 `mdi--circle-small` 实心点。
- `archived`（归档）：`bg-bg/60 text-text-muted`，图标 `mdi--archive-outline`。
- `planned`（构思）：`bg-warning/12` + 深变体文字，图标 `mdi--lightbulb-outline`。
- 一律**点/图标 + 文字**，不允许纯色点（无障碍：非仅颜色）。

### 2.4 分组标题（L-4）

- 紧凑版章节标题：左对齐 `mb-6`：小标签（`text-xs font-bold tracking-widest uppercase text-accent`）+ 组名（`font-display text-xl font-bold text-text`）+ 计数（`text-sm text-text-muted`）。
- 组排序：featured 组（若 featured 条目 ≥ 2，可前置「精选」组）→ project → tool → experiment；组内 `featured` 优先 + `status` 权重（active > planned > archived）。

### 2.5 站内条目页壳（`/lab/[slug]`，L-6）

```
容器：mx-auto w-full max-w-[880px] px-5 sm:px-6；pt-24 md:pt-28
─────────────────────────────────
  « 返回实验室（BackButton 复用，兜底 /lab/）
  H1 条目名 + 类型/状态徽章行
  一句话简介（导语样式，border-l-2 border-sakura pl-4）
  ───────────────────────
  demo 区（LabDemoShell）
    ┌────────────────────────────┐
    │ min-h-[400px] rounded-lg    │   bg-surface border border-border
    │ (iframe 或客户端组件挂载)   │   p-4 md:p-6；JS 禁用时占位提示
    └────────────────────────────┘
  ───────────────────────
  条目说明区（prose，复用文章排版 §4）
  相关链接行（外链型 links 或站内型的源码/反馈入口）
  底部 pb-16 md:pb-24
```

- `LabDemoShell`（`src/components/lab/lab-demo-shell.tsx`）：客户端边界组件，接收 demo 组件或 URL；**demo 实现是独立叶子客户端组件**（`src/components/lab/demos/`），壳不 import 具体逻辑。
- 条目说明区内容来源：`lab.ts` 的 `description`（Markdown 渲染走既有管线，字段名与 content README 对齐）。
- SEO：站内条目页 metadata（title/description 派生自 `LabItem`）；`og` 同文章页策略。

---

## 3. 页面布局

### 3.1 `/lab` 列表页

```
容器：mx-auto w-full max-w-[1100px] px-5 sm:px-6；pt-24 md:pt-28
─────────────────────────────────
  页头（紧凑一行）：左「实验室」标题 + 简介一句   右：暂无入口（条目少）
  ─────────────────────────────
  featured 条目（若有）：Bento 首行，md:col-span-2 大卡 + 普通卡
  ─────────────────────────────
  分组 ×N（§2.4）：组标题 + grid gap-6 md:grid-cols-2 xl:grid-cols-3
  ─────────────────────────────
  空状态（条目为 0 时）
  底部 pb-16 md:pb-24
```

- 页头样式同 `/posts` 紧凑页头：`text-2xl md:text-3xl font-display font-bold`；副文案 `text-sm text-text-muted`「个人项目、小工具与实验 demo」。
- 空状态复用文章板块空状态模式（§2.10）：图标 `icon-[mdi--flask-empty-outline] text-sakura size-10` + 文案 + Ghost 按钮「返回首页」。

### 3.2 首页 Bento 入口（已上线，验证项）

- D15 后入口已改 `/lab`「实验室」；本阶段验证：图标语义（`mdi--flask-outline`）与板块新内容一致，无需改动。

---

## 4. 动效（接主文档 §3.3）

| 场景              | 方式        | 参数                                        |
| ----------------- | ----------- | ------------------------------------------- |
| 卡片入场          | GSAP Reveal | 600ms power2.out，stagger 0.05              |
| 卡片 hover        | CSS         | 150–200ms 抬升 + shadow-lg-glow             |
| 封面 hover 缩放   | CSS         | 200ms scale-[1.04]                          |
| 站内 demo 页      | 无入场动画  | 同 P-9（工具页功能优先）                    |
| demo 内部交互动效 | 由 demo 自带 | 遵守 reduced-motion；禁 transition:all      |

---

## 5. 响应式与无障碍要点（本板块增量）

- 断点行为：`<768px` 卡片 1 列；`768–1279px` 2 列；`≥1280px` 3 列；featured 大卡在移动端塌缩为普通卡（col-span-1）。
- 卡片整体是链接：标题 h2 内不再嵌链接；tech 标签为纯文本徽章（不可点）。
- 外链卡 `aria-label` 补「（新窗口打开）」提示；卡内小链接图标行各按钮 `aria-label`（如「GitHub 仓库」）。
- 封面/占位图 `alt`：有封面必填描述；图标占位 `alt=""`（装饰）。
- 站内条目页：BackButton 复用文章板块（`history.back()` 兜底 `/lab/`）；demo 区 JS 禁用时给出「此实验需要 JavaScript」提示（REQ-G6 渐进增强）。
- 页find 索引排除：`data-pagefind-body` 标记策略沿用文章板块；`/lab` demo 页不打 `data-pagefind-body`。

---

## 6. 交付验收清单（本板块增量，接主文档 §8）

- [ ] 外链卡新窗口打开且 `rel="noopener noreferrer"`；站内卡本窗口跳转
- [ ] 类型/状态徽章在亮/暗两态下文字对比度实测（sakura/twilight 徽章重点）
- [ ] featured 大卡 2 列跨度在 md/xl 断点正确塌缩
- [ ] 站内条目页 demo 区 375px 无横向溢出；JS 禁用提示可见
- [ ] 条目数从 0 → 3 → 10 增长时布局不破（空态/单列/满网格自测）
- [ ] `/lab` 与 `/lab/[slug]` 在 375/768/1024/1440 四档无横向滚动
- [ ] `pnpm build` 后 `pnpm build:search` 索引不含 lab demo 页内容
