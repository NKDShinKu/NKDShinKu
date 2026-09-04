# 页面设计 — 全局搜索弹窗（M3）

> 本文件是 `docs/design-system.md` §0 约定的**页面覆盖文件**：实现全局搜索弹窗时，本文档规则覆盖主文档的页面级决策；token / 基础组件 / 无障碍与响应式纪律仍以主文档为准。
> 覆盖载体：页头搜索入口（桌面/移动）+ 全局弹窗（非路由页面，REQ-S 2026-09 形态调整）。
> 对应需求：REQ-S1–S5、REQ-G6。
> 技术底座：Pagefind（索引已随构建产出，`pagefind/` 目录；索引文件需随 `out/` 部署）。

---

## 1. 设计决策总览

| #    | 决策点       | 结论                                                                                                                             |
| ---- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| S-1  | 形态         | 页头图标按钮 → 全局弹窗（无独立路由）；桌面移动同构，移动端弹窗近全屏（距边 12px）                                              |
| S-2  | 快捷键       | `Ctrl+K` / `Cmd+K` 唤起（可含 `/`——若 `/` 与输入无冲突时启用；首版仅 K 组合键，避免输入法误触）；`Esc` 关闭                     |
| S-3  | 索引加载     | **懒加载**：首次打开弹窗时 `import("/pagefind/pagefind.js")`；加载中显示骨架（输入框先可用，输入缓存待索引就绪）；失败态见 S-8  |
| S-4  | 即时检索     | 输入防抖 200ms → `pagefind.search()`；结果即时渲染（UX 检索依据：autocomplete-as-you-type，别等回车）                           |
| S-5  | 结果形态     | 行式结果（图标 + 标题 + 摘要片段（Pagefind excerpts 含 `<mark>` 高亮）+ 分类 Tag）；上下键选择 + 回车打开；点击同效            |
| S-6  | 弹窗结构     | 顶部输入行（放大镜图标 + input + Esc 提示）→ 结果列表（`max-h-[60vh] overflow-y-auto`）→ 底部状态栏（结果数 + 键位提示）      |
| S-7  | 焦点管理     | 打开：焦点移入输入框；关闭：焦点归还唤起按钮（REQ-S4）；弹窗内 **focus trap**（Tab/Shift+Tab 圈定）；`aria-modal="true"` + `role="dialog"` |
| S-8  | 降级态       | JS 禁用：入口按钮不渲染（服务端可探测 noscript 思路，静态导出下入口默认渲染、客户端组件挂载时校验）；索引加载失败：输入框下方错误行 + 重试按钮 |
| S-9  | 打开结果     | 结果点击 = `router.push`（Next Link 客户端导航）+ 弹窗关闭；外链无（本站搜索结果全是站内文章）                                 |
| S-10 | 搜索范围     | 文章（标题/摘要/正文/标签，Pagefind 默认能力）；实验室条目为后续扩展（REQ-S2，L-9 已预留排除策略）                            |

---

## 2. 新增组件规范

> 均为自研组件，文件落位 `src/components/search/`；入口挂 `src/components/layout/site-header.tsx`。样式全用工具类，禁止裸 hex。

### 2.1 SearchTrigger 入口按钮

- 纯图标按钮（`aria-label="搜索文章"`），`icon-[mdi--magnify] size-5`；尺寸/间距与主题切换器同规格（顶栏右侧一员）。
- 桌面端附加键盘提示：按钮右侧（或 tooltip）显示 `Ctrl K` / `⌘K` 键帽（`hidden md:inline-flex`，`kbd` 样式：`rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text-muted`）。
- 触控 ≥ 44px；`focus-visible` ring 同主文档。

### 2.2 SearchDialog 弹窗（S-6）

```
遮罩：fixed inset-0 z-[60] bg-bg/60 backdrop-blur-sm（300ms 淡入）
┌──────────────────────────────┐
│ 🔍 搜索文章…          [esc] │   输入行 h-14：图标 + input(text-base) + Esc 键帽
├──────────────────────────────┤
│ ▸ 最近文章（空态默认 5 条）   │   未输入时：最新文章快捷列表（S-11）
│ ▸ 标题（高亮 <mark>）        │
│   摘要片段… [分类Tag]        │   text-sm muted；excerpt 仅此行 line-clamp-2
│ ▸ …                          │
├──────────────────────────────┤
│ N 条结果 · ↑↓ 选择 · ↵ 打开  │   状态栏 text-xs muted；空结果给建议文案
└──────────────────────────────┘
```

- 弹窗卡：`fixed left-1/2 top-[12vh] -translate-x-1/2 w-[calc(100vw-24px)] max-w-[560px]`，`bg-surface border border-border rounded-lg shadow-lg`；桌面也可触发居中。
- **材质选择**：`bg-surface`（不透明）而非玻璃——结果列表是文字密集区（主文档 §1.6 纪律）；遮罩才用模糊。
- 动效：容器 `opacity 0→1 + scale 0.98→1 + translateY 8→0`，250ms `ease-slow`；关闭反向 150ms；reduced-motion 直接显隐。
- `role="dialog" aria-modal="true" aria-label="站内搜索"`；Esc 键帽为视觉提示（实际 Esc handler 在弹窗层）。

### 2.3 结果行（ResultRow）

- `role="option"`（列表容器 `role="listbox"` + `aria-activedescendant` 跟踪高亮项）；整行可点（`onMouseDown` 导航，避免 onClick 与焦点竞争）。
- 默认：`px-4 py-3`；高亮（键盘 ↑↓ 或 hover）：`bg-accent/10`（200ms）；`aria-selected="true"`。
- 结构：左图标 `icon-[mdi--file-document-outline] size-4 text-accent aria-hidden` + 标题（`text-sm font-medium text-text`，`<mark>` 样式：`bg-sakura/25 text-inherit rounded-xs px-0.5`）+ 摘要（`text-xs text-text-muted line-clamp-2`，excerpt 的 `<mark>` 同样式）+ 分类 Tag（`bg-accent/10 text-accent-dark`）。
- URL 显示：行尾或标题下 `font-mono text-xs text-text-muted`（`/posts/xxx`）——首版可省（结果全是文章，Tag 已足辨识）。

### 2.4 状态栏与空态

- 结果数：`role="status" aria-atomic="true"`（UX 检索依据：上下文化播报「找到 N 篇相关文章」而非裸数字）。
- 空结果（UX 检索依据：no-results 不给死胡同）：图标 `icon-[mdi--cloud-search-outline] text-sakura size-8` + 「没有找到相关文章」+ 建议文案（「换个关键词，或试试分类浏览」+「全部文章」链接）。
- 索引加载中：状态栏「正在准备搜索索引…」（`role="status"`）；输入先缓存，就绪后立即执行。
- 索引失败：错误行 `text-danger` +「重新加载」按钮（ghost 小按钮）。

### 2.5 快捷键（S-2，客户端监听）

| 键             | 行为                                       |
| -------------- | ------------------------------------------ |
| `Ctrl+K`/`⌘+K` | 全站任意页唤起（输入框聚焦时也可，抢占默认） |
| `Esc`          | 关闭弹窗（已关闭则忽略；不冒泡触发浏览器）   |
| `↑` / `↓`      | 结果列表内移动高亮（循环）                   |
| `Enter`        | 打开当前高亮项                              |
| `Tab`          | 弹窗内圈定（focus trap，S-7）               |

- 监听挂 `SearchDialog` 客户端根组件（挂载即全局监听 K 唤起）；避免在输入法组合确认前误触（`event.isComposing` 判断）。

---

## 3. 与页头/布局的集成

- `site-header.tsx` 右侧操作区改为：`SearchTrigger + ThemeToggle`（桌面）+ `SearchTrigger + ThemeToggle + 汉堡`（移动）；移动端下拉面板不加搜索项（入口已常驻顶栏）。
- 弹窗挂 `layout.tsx` 全局（客户端组件，动态 import 减少 SEO 页面首屏 JS；初始不渲染 DOM，唤起时渲染）。
- Pagefind 索引产物：`out/pagefind/`（CI 已产出）；`import("/pagefind/pagefind.js")` 用构建产物路径（dev 下无索引走 S-8 降级提示——本地 dev 需先 `pnpm build && pnpm build:search` 再 `pnpm preview` 验证）。
- `not-found.tsx` 等非文章页同样可用（全局挂载）。

---

## 4. 动效（接主文档 §3.3）

| 场景         | 方式 | 参数                     |
| ------------ | ---- | ------------------------ |
| 弹窗打开     | CSS  | 250ms ease-slow（透明+缩放+位移） |
| 弹窗关闭     | CSS  | 150ms 反向               |
| 结果高亮切换 | CSS  | 200ms ease-out           |
| 遮罩淡入     | CSS  | 300ms                    |
| reduced-motion | —  | 直接显隐（无动画）      |

结果行**不做 stagger 入场**（即时搜索场景，动画反而拖慢感知）。

---

## 5. 响应式与无障碍要点（本板块增量，重点区）

- 移动端弹窗 `w-[calc(100vw-24px)] max-w-[560px]`、`top-[8vh]`；结果列表 `max-h-[55vh]`（视口矮屏可用）；触控行高 ≥ 44px（`py-3` + 内容高）。
- **focus trap 实现**（S-7）：keydown 拦截 Tab，循环聚焦弹窗内可聚焦元素（输入框 / 结果行 / 底部链接）；关闭时 `triggerRef.current?.focus()` 归还。
- `aria-modal` + 打开时给 `body` 加 `overflow:hidden`（防背景滚动）；关闭移除。
- 输入框 `role="combobox" aria-expanded aria-controls="search-results"`（listbox 模式）或简化 `aria-label="搜索文章"` + 结果区 `role="listbox"`；首版实现取简式（label + listbox + activedescendant）。
- 高亮 `<mark>` 语义天然（无障碍读出无碍）；`mark` 样式亮暗两态对比验证（`bg-sakura/25` 亮色 / 暗色下加深文字底）。
- 空态/加载/失败三态均有 `role="status"` 播报，不裸切（UX 检索依据：async 状态需上下文播报）。
- K 键帽仅装饰（`aria-hidden`），实际快捷键行为在 handler；按钮 `aria-label` 说明（「搜索文章（Ctrl+K）」）。
- dev 环境 Pagefind 不可用时的降级实测（S-8 路径必走查）。

---

## 6. 交付验收清单（本板块增量，接主文档 §8）

- [ ] `Ctrl+K`/`⌘K` 在首页/文章页/404 页均可唤起；`Esc` 关闭且焦点归还按钮
- [ ] focus trap 生效：Tab 在弹窗内循环，不逃逸到底层页面
- [ ] 键盘流：输入 → ↑↓ 移动高亮 → Enter 打开 → 弹窗关闭 → 落地文章页
- [ ] 中文关键词实测（Pagefind 中文分词：「追番」「静态导出」等词有结果）
- [ ] 空结果有建议 + 加载/失败态走查（dev 无索引、断网模拟）
- [ ] 移动端 375px：弹窗宽度、结果触控、软键盘弹出后布局不塌
- [ ] `mark` 高亮亮/暗两态可读；状态栏播报「找到 N 篇」
- [ ] `pnpm build && pnpm build:search` 后 `out/pagefind/` 产物存在且线上可达
- [ ] 弹窗打开时背景无滚动（body overflow 锁定）；reduced-motion 直接显隐
