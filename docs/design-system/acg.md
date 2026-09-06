# 页面设计 — ACG 板块（M3）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：构建下列路由时，本文档规则覆盖主文档的页面级决策；token / 基础组件 / 无障碍与响应式纪律仍以主文档为准。
> 覆盖路由：`/acg`（ACG 橱窗 hub）、`/acg/anime`（番剧归档）。
> 对应需求：REQ-M1–M11、REQ-H4/H5（首页小部件另行任务）。
> 板块定义（manifest D18）：ACG 两层结构，番剧先行；数据源 Bangumi v0 API 浏览器直连（D14 实测）。
> **2026-09 用户决策**：板块更名 ACG；hub 去头像/标语（数字勋章保留）；番剧橱窗卡 = 封面 + 少量信息；时间胶囊 RSS 弃用；容器 1400–1600 → 定档 **1440px**；归档页排版参考「编辑档案」式（顶栏 TOTAL + 左栏标题 + 行卡，取其神不抄其形）。

---

## 1. 设计决策总览

| #    | 决策点       | 结论                                                                                                                             |
| ---- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| M-1  | 容器         | ACG 两页专用 **`max-w-[1440px]`**（页面级覆盖主文档 1100）；px-5 sm:px-6，超宽屏居中不塌（REQ-G3）                              |
| M-2  | hub 氛围     | hub **随主题正常翻转**（用户决策）：亮色=「天空」、暗色=「夜空」——板块性格由主题双态天然承担，呼应站点关键词「天空·夜空」；背景沿用全局极光/星点粒子（用户决策：不额外加强）；页头区叠极淡品牌渐变（`from-accent/10 to-transparent`） |
| M-3  | 归档页基调   | 随主题正常翻转，信息密度优先、无特殊背景——hub 重氛围、归档重阅读 |
| M-4  | 数字勋章     | 页头一行六枚（在看/想看/看过/搁置/抛弃/总计）：等宽大数字 + 小标签，数字 `font-mono text-2xl`；数据来自 v0 `total` 字段        |
| M-5  | 橱窗封面卡   | 竖封面 2:3 + 中文名一行 + 评分一行（我的评分优先，0 → 显示 BN 评分并标注「BN」）；在看列表 `updated_at` 倒序取 12；点击新窗口跳条目页，**无确认弹窗**（高频轻交互，用户决策） |
| M-6  | 占位子类     | 游戏/音乐/小说三小卡：图标 + 名称 + 「策划中」warning 徽章；非链接、无 hover 位移                                                |
| M-7  | 归档页栅格   | 顶栏（返回 + 标题区 + TOTAL）→ `grid-cols-[260px_1fr]`：左栏 sticky（大字分组标题 + 英文副题 + 五分组 Tab）+ 右侧行卡两列        |
| M-8  | 行卡         | 竖封面(2:3, w-40) + 信息区（中文名 lg / 原名 xs muted / 简介 clamp-3 / 标签行）+ 数据面板（我的评分大数字 / BN 评分 / 放送日期 / 进度）；整卡点击新窗口跳 bgm.tv 条目页（stretched-link，同实验室卡修订前教训：无内层链接则无嵌套问题） |
| M-9  | 分组 Tab     | 左栏纵向按钮列表：active = `bg-accent/10 text-accent-dark border-l-2 border-accent`；移动端折叠为顶部横向滚动 pills               |
| M-10 | 数据层       | `src/lib/acg.ts`：fetch 封装 + localStorage 缓存（key `acg-collections-v1`，TTL **30 分钟**，O2 建议值）+ `refresh()` 手动刷新；纯客户端（静态导出无构建期取数） |
| M-11 | 三态         | 骨架屏（勋章/封面/行卡 shimmer，`aria-busy`）→ 错误行 + 重试 → 空分组提示；页面框架（标题/Tab/占位卡）不依赖 API                |
| M-12 | SEO          | 两页 metadata（title/description/canonical）；内容动态无 SSG，不进 Pagefind（天然排除）                                          |

---

## 2. 组件规范

> 均为自研组件，文件落位 `src/components/acg/`；样式全用工具类，禁止裸 hex。
> 背景沿用全局极光/星点粒子，本板块无特殊处理（用户决策）。

### 2.1 StatBadge 数字勋章（hub 页头）

```
┌──────────┐
│    41    │   font-mono text-2xl md:text-3xl font-bold（text-text）
│  在看    │   text-xs uppercase tracking-widest（text-muted）
└──────────┘
```

- 六枚横排（`flex flex-wrap gap-x-8 gap-y-4`）：在看 / 想看 / 看过 / 搁置 / 抛弃 / 总计；总计数值前加「TOTAL」小标（编辑档案式呼应）。
- 无卡片包裹（裸排，橱窗感）；加载时数字位渲染骨架块。

### 2.2 AnimeCoverCard 橱窗封面卡（hub，M-5）

```
┌────────┐
│ 封面    │   2:3，rounded-md border border-border，hover scale-[1.04]
│ (2:3)  │
├────────┤
│ 中文名  │   text-sm font-medium truncate
│ ★ 8.7  │   text-xs：我的评分（text-accent-dark）｜无则 BN 评分（text-muted + 「BN」标）
└────────┘
```

- 宽度：横向滚动流 `flex gap-4 overflow-x-auto`，卡 `w-32 md:w-36 shrink-0`；外层 `<a target="_blank" rel="noopener noreferrer">`（`aria-label="《中文名》在 Bangumi 查看（新窗口）"`）。
- hub 数据：在看组前 12（`updated_at` 倒序，单请求 limit=12）。

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

- 骨架：勋章 = `h-9 w-16 rounded bg-border/60 animate-pulse`；封面卡 = 同尺寸灰块；行卡 = 整卡灰块；骨架区 `aria-busy="true"`；shimmer 用 `animate-pulse`（reduced-motion 下静态色块）。
- 错误：区域级错误行（`text-danger` + 图标）+ 重试按钮（ghost 小按钮）；已缓存数据可用时**先渲染缓存再后台刷新**（stale-while-revalidate 语义）。
- 空分组：「这个分组还没有收藏」+ 云图标（复用空态模式）。

---

## 3. 页面布局

### 3.1 `/acg` hub

```
容器：max-w-[1440px] px-5 sm:px-6；pt-24 md:pt-28 pb-16 md:pb-24；随主题正常翻转（M-2）
─────────────────────────────────────
  页头（叠极淡品牌渐变）：「ACG」font-display text-3xl md:text-4xl + 一句副标（text-text-muted）
  数字勋章行 ×6（§2.1）                                ← Reveal
  ─────────────────────────────────
  番剧橱窗：区块头（「番剧」text-xl + 在看摘要 + 「进入归档 →」链接）
  封面卡流横滚 ×12（§2.2）                             ← Reveal subtle
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
- 缓存：localStorage `acg-collections-v1` = `{ cachedAt, groups: { [type]: { total, items } } }`；TTL 30 分钟（O2 建议值，设计定稿）；过期/无缓存 → 网络取 + 写回；未过期 → 直接用 + 静默后台刷新（SWR 语义）。
- 请求预算：hub 首次 = 在看(12) + 五分组 total（limit=1 ×5）= 6 请求；归档每组首开 = 按 `total/100` 分页拉全组；`refresh()` 清缓存全量重拉。
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

- 断点：hub 封面流全端横滚；归档 `<lg` 单列 + 顶部 pills；行卡 `xl` 双列 / 以下单列。
- hub 随主题：亮/暗两态用标准 token（text/muted/surface），对比度走主文档纪律。
- 封面/行卡外链 `aria-label` 含「新窗口」；`rel="noopener noreferrer"`。
- 分组 Tab：`aria-current="true"` 标注 active；计数徽章可读（非仅颜色）。
- 骨架 `aria-busy`；数据面板数字用 `<span class="font-mono">`（读屏逐字无碍）。
- 图片：全部封面 `alt=""`（装饰性，名称已在文字区）或 `alt="《中文名》封面"`——取后者（有意义图）。

---

## 7. 交付验收清单（本板块增量，接主文档 §8）

- [ ] hub 亮/暗两态走查（标准 token，含勋章与封面卡文字对比）
- [ ] 六枚勋章数值与 Bangumi 实际 total 一致；缓存生效（二次进入无网络请求，DevTools 验证）
- [ ] 归档页五分组切换正确拉取对应数据；看过组「加载更多」分页正确（389 → 100×3+89）
- [ ] 行卡全字段渲染正确（我的评分 0 → 「—」；BN 评分/日期/进度/短评）
- [ ] 条目外链新窗口 + `aria-label`；hub 封面卡无确认弹窗
- [ ] 375/768/1024/1440 四档无横向滚动；移动端 pills 横滚可用
- [ ] 断网/失败态：骨架 → 错误 + 重试；缓存场景 stale-while-revalidate 生效
- [ ] 主题切换：两页均随主题正常翻转、无闪变
