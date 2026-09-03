# 设计系统 — NKDShinKu

> 本文档是**设计约定的单一事实来源**（M1 设计定稿产出）。后续所有页面 / 组件编码以本文档为准。
> 已取代旧归档 `docs/archive/design-system-old/`（仅作历史参考，不再约束新方案）。
> 当构建某个具体页面时，若 `docs/design-system/` 下存在同名页面覆盖文件，其规则覆盖本文档；否则严格遵循本文档。

---

**项目：** NKDShinKu
**定稿日期：** 2026-08-30
**风格：** Soft ACG Fusion（玻璃态 × 极光背景 × 动效）
**类别：** 现代个人技术博客（ACG 气质）

---

## 1. 设计 token

所有 token 收敛于 `src/app/globals.css` 的 `@theme` 块（Tailwind v4 CSS-first）。
命名遵循 Tailwind 语义命名空间（`--color-*` / `--font-*` / `--radius-*` / `--shadow-*`），**无 `--nk-` 前缀**。
组件内一律通过工具类（`bg-accent`、`text-text-muted`）引用，不写裸 hex。

### 1.1 色彩

**主色叙事：天蓝（天空）× 樱粉 × 暮紫（夜空）。** 蓝白为基底，粉/紫克制点缀。

#### 亮色模式（默认）

| Token                  | 角色             | 值                       | 对比度（白底） | 用途                       |
| ---------------------- | ---------------- | ------------------------ | -------------- | -------------------------- |
| `--color-bg`           | 页面背景         | `#F0F4F8`                | —              | 天空蓝灰底                 |
| `--color-surface`      | 实心卡片         | `#FFFFFF`                | —              | 文章/博客卡（阅读区）      |
| `--color-glass`        | 玻璃卡片         | `rgba(255,255,255,0.60)` | —              | 导航/hero/入口卡           |
| `--color-glass-border` | 玻璃卡描边       | `rgba(255,255,255,0.30)` | —              | 玻璃卡 1px 边框            |
| `--color-accent`       | 品牌主色（天蓝） | `#5B8FD4`                | ~3.4:1         | 图标 / 大标题 / 非文本强调 |
| `--color-accent-light` | 主色浅变体       | `#8FB8E8`                | < 3:1          | 渐变 / 装饰                |
| `--color-accent-dark`  | 主色深变体       | `#3A6FB0`                | ~5.5:1         | 小号强调文字（标签/链接）  |
| `--color-sakura`       | 次强调（樱粉）   | `#F0A0B8`                | < 3:1          | 装饰 / 渐变 / 空状态点缀   |
| `--color-sakura-light` | 樱粉浅变体       | `#F4C0D0`                | < 3:1          | 渐变 / 背景                |
| `--color-twilight`     | 三次强调（暮紫） | `#9B8EC4`                | < 3:1          | 装饰 / 渐变 / 夜空元素     |
| `--color-text`         | 正文             | `#2D2B3A`                | ~13:1          | 所有正文/标题              |
| `--color-text-muted`   | 次要文字         | `#6B6880`                | ~5.5:1         | 说明 / 日期 / 辅助         |
| `--color-border`       | 分隔线 / 边框    | `#E2E8F0`                | —              | 卡片描边 / 分隔            |
| `--color-success`      | 成功             | `#7ECB9A`                | < 3:1          | 状态点 + 文字配对          |
| `--color-warning`      | 警示             | `#F0C878`                | < 3:1          | 状态点 + 文字配对          |
| `--color-danger`       | 错误             | `#E06679`                | ~4.0:1         | 错误提示（正文配对文字）   |

#### 暗色模式（`<html class="dark">`）

| Token                  | 角色          | 值                       |
| ---------------------- | ------------- | ------------------------ |
| `--color-bg`           | 页面背景      | `#1A1B2E`                |
| `--color-surface`      | 实心卡片      | `#242538`                |
| `--color-glass`        | 玻璃卡片      | `rgba(30,30,60,0.70)`    |
| `--color-glass-border` | 玻璃卡描边    | `rgba(255,255,255,0.10)` |
| `--color-accent`       | 品牌主色      | `#7EB8F4`                |
| `--color-accent-light` | 主色浅变体    | `#A8D0F8`                |
| `--color-accent-dark`  | 主色深变体    | `#5B9BD5`                |
| `--color-sakura`       | 次强调        | `#F4B8C8`                |
| `--color-sakura-light` | 樱粉浅变体    | `#F8D0D8`                |
| `--color-twilight`     | 三次强调      | `#B8A8E0`                |
| `--color-text`         | 正文          | `#E8E6F0`                |
| `--color-text-muted`   | 次要文字      | `#A09DB8`                |
| `--color-border`       | 分隔线 / 边框 | `#2E2E4A`                |
| `--color-success`      | 成功          | `#86D6A8`                |
| `--color-warning`      | 警示          | `#F0D08A`                |
| `--color-danger`       | 错误          | `#F08A9B`                |

**对比度纪律（ACG 粉彩色的关键约束）：**

- 正文/标题一律用 `--color-text`（亮）或 `--color-text-muted`；**不要用粉/紫/浅蓝作小号正文**。
- `accent` / `sakura` / `twilight` 仅用于：图标、大号标题渐变、装饰块、状态点、空状态氛围。需要**小号彩色文字**时（标签、链接），用 `--color-accent-dark`（≥ 4.5:1）。
- **品牌色作彩底不作对比度限制**（按钮、选中态、徽章等）：视觉优先，`bg-accent text-white` 可用。
  此为用户决策（project-manifest D10）；正文 / 长文本的对比度纪律不变。
- 状态色（success/warning/danger）作文字时必须与图标/文案配对，不能只靠颜色传达含义（`color-only`）。
- 纯 `#000` / `#FFF` 禁止，一律走 token。

### 1.2 字体

| 角色      | 拉丁字体       | 中文回退（系统字体，不自托管）                   | 字重     |
| --------- | -------------- | ------------------------------------------------ | -------- |
| 展示/标题 | Quicksand      | PingFang SC / Hiragino Sans GB / Microsoft YaHei | 400–700  |
| 正文      | Inter          | PingFang SC / Hiragino Sans GB / Microsoft YaHei | 300–600  |
| 代码      | JetBrains Mono | —                                                | 400, 500 |

- **自托管**：拉丁字体经 `next/font/google` 在构建期下载并注入 `--font-*` 变量（见 §7），
  不打运行时 Google CDN（符合 REQ-G7 + 静态导出 + 国内访问）。
- 中文用系统字体回退（覆盖率高、零体积），**不自托管中文字体**。
- 标题 `font-family` 取 `--font-display`；正文字体 `--font-sans`；代码 `--font-mono`。

**字号阶梯（1.25 模数）：**

| Token         | 值         | 行高 | 用途                 |
| ------------- | ---------- | ---- | -------------------- |
| `--text-xs`   | `0.75rem`  | 1.5  | 标注、徽章           |
| `--text-sm`   | `0.875rem` | 1.5  | 小号正文、标签       |
| `--text-base` | `1rem`     | 1.75 | 正文（移动端 ≥16px） |
| `--text-lg`   | `1.25rem`  | 1.6  | 导语、卡片标题       |
| `--text-xl`   | `1.5rem`   | 1.4  | 小节标题             |
| `--text-2xl`  | `2rem`     | 1.3  | 页面标题             |
| `--text-3xl`  | `2.5rem`   | 1.2  | Hero 副标题          |
| `--text-4xl`  | `3rem`     | 1.1  | Hero 主标题          |

- 正文行高 1.5–1.75；行长 ≤ 65–75 字符（`line-length`）；正文移动端最小 16px（`readable-font-size`）。
- Hero 标题可用 `clamp()` 流式缩放（参考旧预览 `clamp(2.4rem, 6vw, 3.5rem)`）。

### 1.3 间距

沿用 Tailwind 默认 4px 间距尺度（`space-1`=4px …），不自定义 `--space-*`。
页面级节奏固定：

| 场景           | 值                                      |
| -------------- | --------------------------------------- |
| 容器最大宽     | `1100px`（`max-w-[1100px]`）            |
| 容器内边距     | 桌面 `px-6`(24px) / 移动 `px-4`(16px)   |
| 区块上下内边距 | 桌面 `py-20`(80px) / 移动 `py-12`(48px) |
| 卡片内边距     | `p-6`(24px) / 大卡 `p-7`(28px)          |
| 卡片栅格间距   | `gap-6`(24px)                           |

### 1.4 圆角

| Token           | 值       | 用途                 |
| --------------- | -------- | -------------------- |
| `--radius-sm`   | `8px`    | 按钮、输入框、标签   |
| `--radius-md`   | `12px`   | 卡片（默认）         |
| `--radius-lg`   | `16px`   | 大卡、弹层           |
| `--radius-xl`   | `20px`   | Hero 面板、大容器    |
| `--radius-full` | `9999px` | 药丸、头像、浮动导航 |

### 1.5 阴影（玻璃态适配）

| Token              | 亮色                                 | 暗色                                 | 用途                            |
| ------------------ | ------------------------------------ | ------------------------------------ | ------------------------------- |
| `--shadow-sm`      | `0 1px 3px rgba(0,0,0,0.06)`         | `0 1px 3px rgba(0,0,0,0.30)`         | 轻微抬升                        |
| `--shadow-md`      | `0 4px 12px rgba(0,0,0,0.08)`        | `0 4px 12px rgba(0,0,0,0.40)`        | 玻璃卡默认                      |
| `--shadow-lg`      | `0 8px 24px rgba(0,0,0,0.10)`        | `0 8px 24px rgba(0,0,0,0.50)`        | 卡片 hover、弹层                |
| `--shadow-glow`    | `0 0 24px rgba(91,143,212,0.15)`     | `0 0 24px rgba(126,184,244,0.20)`    | 主色柔光（hover）               |
| `--shadow-lg-glow` | `0 8px 24px rgba(0,0,0,0.10)` + 柔光 | `0 8px 24px rgba(0,0,0,0.50)` + 柔光 | 卡片交互 hover（抬升+柔光复合） |

### 1.6 玻璃态（Glassmorphism）

```css
/* 规范值 */
backdrop-filter: blur(16px); /* 范围 12–20px */
background: var(--color-glass); /* 亮 60–80% / 暗 70% 白/深 */
border: 1px solid var(--color-glass-border);
border-radius: var(--radius-md);
box-shadow: var(--shadow-md);
```

- **绝不在文字密集的阅读区用玻璃态** —— 文章正文、博客列表卡用实心 `--color-surface`。
- 玻璃态只用于：浮动导航、hero 面板、板块入口卡、弹层遮罩等氛围场景。

### 1.7 动效时长 / 缓动

| Token           | 值                                     | 用途                   |
| --------------- | -------------------------------------- | ---------------------- |
| `--ease-fast`   | `150ms ease-out`                       | 按钮 hover、focus ring |
| `--ease-base`   | `200ms ease-out`                       | 卡片 hover、标签切换   |
| `--ease-slow`   | `300ms ease-out`                       | 弹层、主题切换         |
| `--ease-spring` | `400ms cubic-bezier(0.34,1.56,0.64,1)` | 入场 stagger           |

- 只动 `transform` + `opacity`（GPU 合成，`transform-performance`）；**禁 `transition: all`**（逐属性声明）。
- 落地映射：`--ease-*` token 只存缓动函数（CSS `transition-timing-function` 不能内嵌时长），
  时长经 `duration-150 / 200 / 300 / 400` 工具类表达。

---

## 2. 组件规范

> UI 全自研（手写 React 组件 + Tailwind 工具类，无组件库；确需无样式原语才引 Radix）。
> 图标用 Iconify `@iconify/tailwind4` + `@iconify-json/mdi`（mdi 图标集），SVG、按需；装饰图标 `aria-hidden`，纯图标按钮 `aria-label`。

### 2.1 按钮

- **Primary**：`bg-accent text-white font-semibold rounded-md px-6 py-2.5`（hover `bg-accent-dark` + `-translate-y-px`；active `scale-[0.97]`；`focus-visible:outline-2 outline-offset-2 outline-accent`）。
- **Ghost**：`bg-transparent text-text border border-border rounded-md px-6 py-2.5`（hover `border-accent text-accent`）。
- **Large CTA**：`px-8 py-3.5 text-lg rounded-lg`。
- 触控目标 ≥ 44×44px；纯图标按钮必 `aria-label`。

### 2.2 玻璃卡片 / 实心卡片

- **玻璃卡**（氛围区）：§1.6 玻璃态 + `p-6`；可交互时 hover `-translate-y-1` + `shadow-lg-glow`（§1.5 复合阴影）。
- **实心卡**（阅读区，博客卡）：`bg-surface border border-border rounded-md p-6`；hover `-translate-y-[3px] shadow-lg`。

### 2.3 标签 / 徽章

- 基础：`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`。
- 配色变体（背景 10–12% 透明度 + 对应前景色）：
  - 默认（天蓝）：`bg-accent/10 text-accent-dark`
  - 樱粉：`bg-sakura/12 text-sakura`（仅装饰语境；作文字时改用更深变体或配对图标）
  - 暮紫：`bg-twilight/12 text-twilight`
  - 成功：`bg-success/12 text-[…]`（配对文案）
- 选中态：`bg-accent text-white`（品牌色底不作对比度限制，见 §1.1 纪律与 manifest D10）。

### 2.4 章节标题

- 居中版式：`text-center mb-12`；小标签（`text-xs font-bold tracking-widest uppercase text-accent`）+ 主标题（`font-display text-2xl font-bold text-text`）+ 描述（`text-text-muted max-w-[480px] mx-auto`）。

### 2.5 导航

> 形态变更：浮动玻璃药丸 → 全宽 sticky 顶栏（D11）→ **fixed 悬浮顶栏 + 首页透明态**（M2 UI 改版，manifest D13）。

- 顶栏：`fixed inset-x-0 top-0 z-50 border-b`，容器 `max-w-[1100px]`、高 `h-16`；非首页/滚动后 `border-border/60 bg-bg/80 backdrop-blur-md`；首页首屏透明（`border-transparent bg-transparent`），滚动越过阈值 300ms 过渡为实心。
- 非首页内容以 `pt-24/28` 补偿顶栏高度；首页 Hero 满屏，顶栏悬浮其上。
- 桌面：左 logo（`font-display` 粗体），右侧文字导航（`text-sm font-medium text-text-muted`，hover/active `text-accent`）+ 主题切换。
- 移动：logo + 主题切换 + 汉堡按钮，下拉玻璃面板（图标 + 文字，行触控 ≥ 44px）。

---

## 3. 风格指南

### 3.1 核心风格 — Soft ACG Fusion

三种影响融合：

| 影响         | 角色     | 表达                                  |
| ------------ | -------- | ------------------------------------- |
| **玻璃态**   | 主导表面 | 卡片、导航、hero 面板 — 半透明 + 模糊 |
| **极光背景** | 背景氛围 | 大块模糊渐变光斑，12s 缓慢 morph      |
| **动效驱动** | 交互层   | 滚动揭示、视差、入场 stagger          |

**氛围关键词：** 通透 · 清新 · 柔软 · 轻科技 · 轻 ACG · 克制

### 3.2 视觉氛围

**背景系统（按页面）：**

| 页面     | 背景                             |
| -------- | -------------------------------- |
| 首页     | 极光渐变光斑 + hero 视觉（克制） |
| 文章列表 | 实心浅色背景 + 极淡网格          |
| 文章详情 | 实心浅色表面（保证可读性）       |
| 项目     | 极光光斑（弱化）                 |
| 追番     | 偏深渐变（夜空）+ 极淡网格       |

**允许的装饰元素（克制）：**

- ✅ 极光光斑（大尺寸、blur 80–120px、12s 缓慢动画）
- ✅ Canvas 粒子（~60 只萤火/星点，缓慢漂移；移动端减至 ~30）
- ✅ 纤细线稿分隔线、卡片 hover 柔光、hero 标题渐变文字（克制使用）
- ✅ 空状态里的樱粉点缀

**禁止：**

- ❌ 漫画分镜式布局、整幅角色插画作页面背景、霓虹闪烁
- ❌ 弹幕/聊天气泡美学、高饱和彩虹渐变、UI 用漫画字体、喧闹自动播放动画

### 3.3 动效规范

| 交互            | 方式               | 时长        | 缓动                     |
| --------------- | ------------------ | ----------- | ------------------------ |
| 按钮 hover      | CSS transition     | 150ms       | ease-out                 |
| 卡片 hover 抬升 | CSS transition     | 200ms       | ease-out                 |
| 主题切换        | CSS transition     | 300ms       | ease-out                 |
| 区块入场        | GSAP ScrollTrigger | 600ms       | power2.out               |
| Hero 入场       | GSAP Timeline      | 800ms 总计  | power3.out               |
| 卡片 stagger    | GSAP ScrollTrigger | 80–100ms/卡 | power2.out               |
| 页面过渡        | GSAP + Router      | 200ms       | power2.inOut             |
| 极光光斑漂移    | CSS animation      | 12s         | ease-in-out（alternate） |

- `@media (prefers-reduced-motion: reduce)` 禁用一切非必要动效（GSAP 全部包裹、粒子关闭）。
- 移动端降级：粒子减半、关闭视差层、视频改静态图。

### 3.4 页面模式

- **主：滚动叙事** —— 首页分区块揭示 + 进度指示；文章页 sticky 阅读进度条。
- **次：Bento 网格** —— 首页板块入口、项目网格用非对称卡片（1–3 卡/行，尺寸错落营造节奏）。

---

## 4. 无障碍（Critical）

| 规则     | 实现                                                       | 优先级   |
| -------- | ---------------------------------------------------------- | -------- |
| 色彩对比 | 正文 ≥ 4.5:1；粉/紫/浅蓝只作装饰或大号文字（见 §1.1 纪律） | CRITICAL |
| 焦点     | 所有可交互元素 `focus-visible` 可见 ring                   | CRITICAL |
| 触控目标 | ≥ 44×44px                                                  | CRITICAL |
| alt 文本 | 所有有意义图片必填描述性 alt                               | HIGH     |
| ARIA     | 纯图标按钮必 `aria-label`；装饰图标 `aria-hidden`          | HIGH     |
| 键盘导航 | Tab 顺序 = 视觉顺序；导航重度页提供 skip link              | HIGH     |
| 减少动效 | `prefers-reduced-motion` 包裹所有 GSAP                     | HIGH     |
| 非仅颜色 | 状态/标签必配图标或文字                                    | HIGH     |
| 表单标签 | 每个输入 `<label for>`（正文搜索、评论等）                 | HIGH     |

---

## 5. 响应式

| 断点 | 宽度       | 列数   | 导航         | Hero            |
| ---- | ---------- | ------ | ------------ | --------------- |
| 移动 | < 768px    | 1 列   | 汉堡下拉菜单 | 静态图，无视频  |
| 平板 | 768–1023px | 2 列   | 内联紧凑导航 | 视频降级视差    |
| 桌面 | ≥ 1024px   | 2–3 列 | 完整内联导航 | 全量视觉 + 视差 |

- 移动优先：320px 起可用；卡片 1→2→3 列；移动端字号整体降一级。
- 顶栏 `fixed top-0` 悬浮（§2.5）：非首页内容以 `pt-24/28` 避让，首页 Hero 满屏。

---

## 6. Tailwind v4 `@theme`（canonical）

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@iconify/tailwind4";

/* 深色模式：class 策略（<html class="dark">） */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* 字体（--font-* 由 next/font 在 layout 注入变量） */
  --font-display:
    var(--font-quicksand), "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-sans: var(--font-inter), "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* 品牌色（亮） */
  --color-accent: #5b8fd4;
  --color-accent-light: #8fb8e8;
  --color-accent-dark: #3a6fb0;
  --color-sakura: #f0a0b8;
  --color-sakura-light: #f4c0d0;
  --color-twilight: #9b8ec4;

  /* 语义色（亮） */
  --color-bg: #f0f4f8;
  --color-surface: #ffffff;
  --color-glass: rgba(255, 255, 255, 0.6);
  --color-glass-border: rgba(255, 255, 255, 0.3);
  --color-text: #2d2b3a;
  --color-text-muted: #6b6880;
  --color-border: #e2e8f0;
  --color-success: #7ecb9a;
  --color-warning: #f0c878;
  --color-danger: #e06679;

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 24px rgba(91, 143, 212, 0.15);
  --shadow-lg-glow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 24px rgba(91, 143, 212, 0.15);

  /* 缓动（时长经 duration-150/200/300/400 表达，见 §1.7） */
  --ease-fast: ease-out;
  --ease-base: ease-out;
  --ease-slow: ease-out;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 动画（形状静态化，仅 transform，见 §3.2/§3.3） */
  --animate-blob: blob-drift 12s ease-in-out infinite alternate;
  --animate-bounce-soft: bounce-soft 2s ease-in-out infinite;

  @keyframes blob-drift {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(40px, -30px) rotate(15deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(-10deg);
    }
    100% {
      transform: translate(10px, -10px) rotate(5deg);
    }
  }
  @keyframes bounce-soft {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }
}

/* 语义色 / 阴影（暗） */
.dark {
  --color-accent: #7eb8f4;
  --color-accent-light: #a8d0f8;
  --color-accent-dark: #5b9bd5;
  --color-sakura: #f4b8c8;
  --color-sakura-light: #f8d0d8;
  --color-twilight: #b8a8e0;
  --color-bg: #1a1b2e;
  --color-surface: #242538;
  --color-glass: rgba(30, 30, 60, 0.7);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  --color-text: #e8e6f0;
  --color-text-muted: #a09db8;
  --color-border: #2e2e4a;
  --color-success: #86d6a8;
  --color-warning: #f0d08a;
  --color-danger: #f08a9b;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 24px rgba(126, 184, 244, 0.2);
  --shadow-lg-glow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 24px rgba(126, 184, 244, 0.2);
}

@layer base {
  body {
    @apply bg-bg text-text;
    font-family: var(--font-sans);
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
  }
}
```

> 落地时同步在 `layout.tsx` 用 `next/font/google` 自托管 Quicksand / Inter / JetBrains Mono，
> 并把变量注入 `--font-quicksand` / `--font-inter` / `--font-jetbrains-mono`（见 REQ-G7）。

---

## 7. 反模式（禁止）

- ❌ 企业模板、通用布局、emoji 当图标（用 mdi SVG）
- ❌ `transition: all`（逐属性声明）
- ❌ 纯 `#000` / `#FFF`（走 token）
- ❌ 大面积高饱和色块、花哨粒子堆砌背景
- ❌ 缩放变换导致布局位移
- ❌ 低对比文字（< 4.5:1）、不可见焦点、移动端横向滚动
- ❌ 粉/紫/浅蓝作小号正文文字（见 §1.1 纪律）

---

## 8. 交付前清单

- [ ] 无 emoji 图标（mdi SVG）；图标尺寸统一 `size-5/6`
- [ ] 可点击元素有 `cursor-pointer`；hover 150–200ms、无布局位移
- [ ] 亮/暗两态色彩均验证、边框可见、玻璃卡两态可读
- [ ] 正文对比 ≥ 4.5:1；粉/紫/浅蓝仅装饰或大号文字
- [ ] 焦点可见（`focus-visible` ring）
- [ ] `prefers-reduced-motion` 生效
- [ ] 375 / 768 / 1024 / 1440 四档自测；无横向滚动
- [ ] 浮动元素留边距、不遮挡内容
- [ ] 所有图片有 alt；表单输入有 label；纯图标按钮有 `aria-label`

---

## 9. 与旧设计的命名变更映射

本文档取代 `docs/archive/design-system-old/`，落地时按此映射改 `globals.css`：

| 旧（archive / 占位）              | 新（本文档）                | 说明                         |
| --------------------------------- | --------------------------- | ---------------------------- |
| `--nk-accent` / `--color-brand`   | `--color-accent`            | 品牌主色统一语义名           |
| `--color-brand-light/dark`        | `--color-accent-light/dark` | 同上                         |
| `--nk-divider` / `--color-border` | `--color-border`            | 分隔线统一                   |
| `--color-card`（与 surface 重复） | 并入 `--color-surface`      | 去重                         |
| `--nk-glass*`                     | `--color-glass(-border)`    | 玻璃态纳入 `--color-*`       |
| Lucide 图标                       | Iconify mdi                 | 依 manifest 技术选型         |
| Vue 3                             | Next.js 16 + React 19       | 依 manifest 技术选型         |
| Google Fonts CDN 导入             | next/font 自托管            | REQ-G7 + 静态导出 + 国内访问 |
