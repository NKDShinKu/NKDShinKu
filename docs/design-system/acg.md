# 页面设计 — ACG 板块（M3）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：构建下列路由时，本文档规则覆盖主文档的页面级决策；token / 基础组件 / 无障碍与响应式纪律仍以主文档为准。
> 覆盖路由：`/acg`（ACG 橱窗 hub）、`/acg/anime`（番剧归档）。
> 对应需求：REQ-M1–M11、REQ-H4/H5（首页小部件另行任务）。
> 板块定义（manifest D18）：ACG 两层结构，番剧先行；数据源 Bangumi v0 API 浏览器直连（D14 实测）。
> **2026-09 用户决策**：板块更名 ACG；hub 去头像/标语、去数字勋章行；番剧橱窗 = **三区（在看 → 看过 → 想看）叠层封面卡**（排名 + BN 评分 + 个人评分 + 在看进度）；时间胶囊 RSS 弃用；容器 1400–1600 → 定档 **1440px**；归档页排版参考「编辑档案」式（顶栏 TOTAL + 左栏标题 + 行卡，取其神不抄其形）。

---

## 1. 设计决策总览

| #    | 决策点       | 结论                                                                                                                             |
| ---- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| M-1  | 容器         | ACG 两页专用 **`max-w-[1440px]`**（页面级覆盖主文档 1100）；px-5 sm:px-6，超宽屏居中不塌（REQ-G3）                              |
| M-2  | hub 氛围     | hub **随主题正常翻转**（用户决策）：亮色=「天空」、暗色=「夜空」——板块性格由主题双态天然承担，呼应站点关键词「天空·夜空」；背景沿用全局极光/星点粒子（用户决策：不额外加强）；页头区叠极淡品牌渐变（`from-accent/10 to-transparent`） |
| M-3  | 归档页基调   | 随主题正常翻转，信息密度优先、无特殊背景——hub 重氛围、归档重阅读 |
| M-4  | 橱窗三区     | 番剧橱窗分三区（用户决策顺序）：在看 → 看过 → 想看，各取前 12；**番剧级区块头**（「番剧」标题 + 「进入归档 · 查看全部 →」）承载下钻主入口；分组小标题弱化（text-base semibold，非 display 大字），右侧「更多 →」带 `?group=` 初始分组；**无独立勋章行** |
| M-5  | 叠层封面卡   | 竖封面 2:3 叠层式（方案 1，用户决策）：左上 Rank 叠标（scrim 白字）+ 右上 BN 社区评分 pill（accent 底 ★）+ 底部渐变层两行——**个人评分 ★N（左）/ 进度（右，仅在看区）行在标题上方常驻渲染（缺失留白），中文名恒贴底**；整卡外链新窗口，**无确认弹窗** |
| M-6  | 占位子类     | 游戏/音乐/小说三小卡：图标 + 名称 + 「策划中」warning 徽章；非链接、无 hover 位移                                                |
| M-7  | 归档页栅格   | 顶栏（返回 + 标题区 + 刷新 + TOTAL）→ `grid lg:grid-cols-[260px_1fr]`：左栏 sticky **「收藏分布」条形列表**（组名 + 英文小字 + 等宽计数 + 细进度条，宽度 ∝ 计数/总数，active 为 accent→twilight 渐变填充）+ 右侧行卡；移动端分组折叠为顶部横滚 pills（active 渐变底） |
| M-8  | 行卡         | 竖封面(h-full 拉伸) + 信息区（**定高切片**：中文名 clamp-2 固定两行 / 原名恒渲染暮紫小字 / 简介+短评共享定高 3 行区（无短评：简介×3；有短评：简介×1+短评×2）/ 标签行恒渲染）+ 数据面板（我的评分大数字 / BN / Rank / 放送日期 / 进度）；整卡 stretched-link 新窗口跳 bgm.tv |
| M-9  | 分组 Tab     | 见 M-7 分布条；`aria-current` 标注 active；计数等宽字（非仅颜色）                                                              |
| M-10 | 数据层       | `src/lib/acg.ts`：fetch 封装 + localStorage 缓存（key `acg-collections-v1`，TTL **30 分钟**，O2 建议值）+ `refresh()` 手动刷新；hub 走 previews 轻缓存（3 预览请求），归档走 groups 全量缓存；纯客户端（静态导出无构建期取数） |
| M-11 | 三态         | 骨架屏（封面/行卡 shimmer，`aria-busy`）→ 错误行 + 重试 → 空分组提示；页面框架（标题/Tab/占位卡）不依赖 API                |
| M-12 | SEO          | 两页 metadata（title/description/canonical）；内容动态无 SSG，不进 Pagefind（天然排除）                                          |

---

## 2. 组件规范

> 均为自研组件，文件落位 `src/components/acg/`；样式全用工具类，禁止裸 hex。
> 背景沿用全局极光/星点粒子，本板块无特殊处理（用户决策）。

### 2.1 AnimeCoverCard 叠层封面卡（hub 橱窗，M-5）

```
┌────────────┐
│ [Rank 42]  │ [★8.7]  ← 左上 Rank scrim 叠标；右上 BN 评分 accent pill
│            │
│ ░░渐变░░   │   from-black/85 via-black/45
│ ★9   进度 9/12 │   个人评分 ★（左）+ 进度（右，仅在看区）；行常驻、缺失留白
│ 中文名      │   truncate 白字 + title 提示，恒贴底
└────────────┘
```

- 卡宽 `w-36 md:w-40`，横滚流 `flex gap-4 overflow-x-auto`；封面 hover `scale-[1.04]`。
- 整卡外链 `bgm.tv/subject/{id}`（新窗口 + `aria-label` + `title`）；`rel="noopener noreferrer"`。
- 叠层白字依赖 scrim（图片底色不可预测）——设计系统「纯黑禁令」的**图片叠层例外**，仅限此处。
- 三区数据：在看（进度叠层）/ 看过 / 想看，各 `limit=12`（previews 缓存）。

### 2.3 PlaceholderCard 占位子类卡（hub，M-6）

- 三列网格小卡：`bg-surface border-border rounded-md p-5 text-center`；图标（游戏 `mdi--gamepad-variant` / 音乐 `mdi--music-note` / 小说 `mdi--book-open-outline`，`size-7 text-accent`）+ 名称 + 「策划中」徽章（`bg-warning/12` 底 + `text-text-muted` 文字 + warning 色圆点图标，配对纪律同实验室状态徽章）。
- 非交互：无 hover、无链接；图标 aria-hidden，卡内文字即语义。

### 2.4 归档页顶栏（M-7）

- 一行三段：左 `« 返回 ACG`（BackButton 复用，兜底 `/acg/`）+ 中标题区（`ANIME ARCHIVE` uppercase 小标 + 「番剧收藏」font-display）+ 右 `TOTAL / 577`（`font-mono`，总数 = 五分组之和）。
- `border-b border-border pb-4`，与截图同构。

### 2.5 分组侧栏（M-9）

- 桌面（`lg+`）：`sticky top-24`，含：大字分组标题（`text-2xl font-display font-bold`，随 active 分组变文案）+ 英文副题（`text-xs uppercase tracking-widest text-text-muted`）+ 一句分组说明 + 分组按钮列表（`min-h-11 w-full justify-between`：名称 + 计数徽章；active 见 M-9 决策）。
- 移动：顶部横向滚动 pills（同文章分类 chips 形态，active `bg-accent text-white`）。

### 2.6 ArchiveRow 行卡（归档页，M-8）

```
┌──────┬──────────────────────────┬─────────┐
│ 封面  │ 中文名（text-lg semibold）│   9.2   │ 我的评分 font-mono text-2xl（未评分显示 —）
│ 2:3  │ 原名（text-xs muted）      │  ─────  │ 装饰条
│ w-40 │ 简介 clamp-3（text-sm）    │ BN 7.9  │ BN 评分 + 人数?（score 字段）
│      │ 标签行（xs muted ·分隔）   │ 2010.4  │ 放送日期（subject.date）
│      │ 进度▓▓▓░（仅在看组）       │ 12/12   │ 进度 ep_status/eps（在看组）
└──────┴──────────────────────────┴─────────┘
整卡 <a target="_blank"> stretched-link（bgm.tv/subject/{id}，aria-label 含「新窗口」）
```

- 底色 `bg-surface border-border`（纸感），hover 抬升同主文档卡片规范；数据面板 `bg-bg/60 border-l border-border/60 p-4 w-28 text-right`。
- 我的评分强调色：`text-accent-dark`（浅）/`text-accent`（暗），≥ 4.5:1。
- 标签取 `subject.tags` 前 3；短评 `comment` 有则显示在简介下方（`border-l-2 border-sakura pl-3 text-sm`，设计预留位）。

### 2.7 三态规范（M-11）

- 骨架：封面卡 = 同尺寸灰块；行卡 = 整卡灰块；骨架区 `aria-busy="true"`；shimmer 用 `animate-pulse`（reduced-motion 下静态色块）。
- 错误：区域级错误行（`text-danger` + 图标）+ 重试按钮（ghost 小按钮）；已缓存数据可用时**先渲染缓存再后台刷新**（stale-while-revalidate 语义）。
- 空分组：「这个分组还没有收藏」+ 云图标（复用空态模式）。

---

## 3. 页面布局

### 3.1 `/acg` hub

```
容器：max-w-[1440px] px-5 sm:px-6；pt-24 md:pt-28 pb-16 md:pb-24；随主题正常翻转（M-2）
─────────────────────────────────────
  页头（叠极淡品牌渐变）：「ACG」font-display text-3xl md:text-4xl + 一句副标（text-text-muted）
  ─────────────────────────────────
  番剧区块头（h2）：「番剧」+ 「进入归档 · 查看全部 →」                     ← Reveal
  分组小标题（h3 弱化）：在看/看过/想看 + 总数 + 更多 →               ← Reveal
  封面卡流横滚 ×12（§2.1）
  ─────────────────────────────────
  占位子类 ×3（§2.3）
  底部 pb-16 md:pb-24
```

### 3.2 `/acg/anime` 归档

```
容器：max-w-[1440px]；顶栏（§2.4）
grid lg:grid-cols-[260px_1fr] gap-10
├─ 左栏 sticky（§2.5）
└─ 右侧：行卡 grid xl:grid-cols-2 gap-5（§2.6）+ 「加载更多」按钮（底部居中，ghost）
移动端：<lg 左栏折叠为顶部标题 + 横向 pills；行卡单列
```

---

## 4. 数据层（M-10，`src/lib/acg.ts`）

- 端点（D14 实测）：`GET /v0/users/796189/collections?subject_type=2&type={1..5}&limit=100&offset=N`；`type` 1=想看 2=看过 3=在看 4=搁置 5=抛弃；默认 `updated_at` 倒序。
- 缓存：localStorage `acg-collections-v1` = `{ groups: { [type]: { cachedAt, total, items } }, previews: { cachedAt, sections } }`；TTL 30 分钟（O2 建议值，设计定稿）；过期/无缓存 → 网络取 + 写回；未过期 → 直接用 + 静默后台刷新（SWR 语义）。
- 请求预算：hub 首次 = 三区预览（在看/看过/想看 各 limit=12）= 3 请求（previews 缓存）；归档每组首开 = 按 `total/100` 分页拉全组（groups 缓存）；`refresh()` 强制网络重拉。
- 降级：请求失败 → 抛给 UI 三态；缓存未过期永远可用。
- 客户端边界：页面外壳为服务端组件（标题/布局/占位卡），数据区为叶子客户端组件（`useAcg` hook 消费 lib）。

---

## 5. 动效（接主文档 §3.3）

| 场景           | 方式        | 参数                          |
| -------------- | ----------- | ----------------------------- |
| hub 页头入场   | GSAP Reveal | 600ms power2.out              |
| 封面卡流       | GSAP Reveal | subtle，stagger 0.04          |
| 行卡入场       | GSAP Reveal | subtle，stagger 0.05          |
| 封面 hover     | CSS         | 200ms scale-[1.04]            |
| 骨架           | CSS         | animate-pulse（reduced-motion 静态） |

归档页正文级内容不引入复杂动效（阅读密度优先）。

---

## 6. 响应式与无障碍要点（本板块增量）

- 响应式 grid 一律写显式 `grid-cols-1` 基线（隐式 auto 轨道按 max-content 撑破容器——375 溢出实测根因，已录 AGENTS §7）。
- 行卡定高切片：标题 2 行 / 原名 1 行 / 简介+短评共享区 3 行 / 标签 1 行，超长一律省略号（title 属性兜底全名），无滚动动效。
- hub 随主题：亮/暗两态用标准 token（text/muted/surface），对比度走主文档纪律。
- 封面/行卡外链 `aria-label` 含「新窗口」；`rel="noopener noreferrer"`。
- 分组 Tab：`aria-current="true"` 标注 active；计数徽章可读（非仅颜色）。
- 骨架 `aria-busy`；数据面板数字用 `<span class="font-mono">`（读屏逐字无碍）。
- 图片：全部封面 `alt=""`（装饰性，名称已在文字区）或 `alt="《中文名》封面"`——取后者（有意义图）。

---

## 7. 交付验收清单（本板块增量，接主文档 §8）

- [ ] hub 亮/暗两态走查（标准 token，含叠层卡 scrim 上的白字可读性）
- [ ] 三区（在看/看过/想看）数值与 Bangumi 实际 total 一致；缓存生效（二次进入无网络请求，DevTools 验证）
- [ ] 归档页五分组切换正确拉取对应数据；看过组「加载更多」分页正确（389 → 100×3+89）
- [ ] 行卡全字段渲染正确（我的评分 0 → 「—」；BN 评分/日期/进度/短评）
- [ ] 条目外链新窗口 + `aria-label`；hub 封面卡无确认弹窗
- [ ] 375/768/1024/1440 四档无横向滚动；移动端 pills 横滚可用
- [ ] 断网/失败态：骨架 → 错误 + 重试；缓存场景 stale-while-revalidate 生效
- [ ] 主题切换：两页均随主题正常翻转、无闪变
