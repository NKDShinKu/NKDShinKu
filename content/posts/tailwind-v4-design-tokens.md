---
title: 用 Tailwind CSS 4 的 @theme 落地一套设计 Token
description: 从设计稿到 CSS-first token：色彩语义化、暗色 class 策略、玻璃态规范与动效 token 的一次完整实践。
date: 2026-08-31
category: 教程
tags:
  - Tailwind
  - CSS
  - 设计系统
keywords:
  - "Tailwind CSS 4"
  - "@theme"
  - 设计 token
---

Tailwind CSS 4 换成了 CSS-first 配置：不再有 `tailwind.config.js`，token 全部写进 CSS 的 `@theme` 块。这篇教程以本博客的真实落地过程为例，讲清楚从设计稿到可用 token 的完整路径。

## 为什么用 @theme 而不是 config 文件

传统 config 的 token 是「工具类生成配置」，和运行时的 CSS 变量是两套东西。`@theme` 的区别在于：**你声明的每个 token 同时就是一个 CSS 自定义属性**。

```css
@import "tailwindcss";

@theme {
  --color-accent: #5b8fd4;
}
```

这一段代码同时给你三样东西：

1. 工具类 `bg-accent` / `text-accent` / `border-accent`；
2. CSS 变量 `var(--color-accent)`，任何手写 CSS 都能引用；
3. 透明度修饰符直接可用：`bg-accent/10`。

## 第一步：色彩语义化

不要把 token 命名成颜色本身（`--blue-500`），要命名成**角色**：

```css
@theme {
  /* 品牌 */
  --color-accent: #5b8fd4;        /* 天蓝，主强调 */
  --color-sakura: #f0a0b8;        /* 樱粉，次强调 */
  --color-twilight: #9b8ec4;      /* 暮紫，三次强调 */

  /* 语义 */
  --color-bg: #f0f4f8;            /* 页面背景 */
  --color-surface: #ffffff;       /* 实心卡片 */
  --color-text: #2d2b3a;          /* 正文 */
  --color-text-muted: #6b6880;    /* 次要文字 */
  --color-border: #e2e8f0;        /* 分隔线 */
}
```

好处是换主题、调品牌色时改一处即可，页面上几十个工具类全部跟着走。命名直接用 Tailwind 的语义命名空间（`--color-*` / `--font-*` / `--radius-*` / `--shadow-*`），**不要自造前缀**，否则工具类生成不出来。

## 第二步：暗色模式用 class 策略

Tailwind 4 默认暗色跟随系统。要支持手动切换，声明一个自定义 variant：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

然后**在 `@theme` 外**用 `.dark` 覆盖同名变量：

```css
.dark {
  --color-bg: #1a1b2e;
  --color-surface: #242538;
  --color-text: #e8e6f0;
}
```

切换主题只需一行 JS：`document.documentElement.classList.toggle("dark")`。注意搭配一段内联脚本在 `<head>` 里预判主题，否则会有亮暗闪烁（FOUC）。

> 关键认知：`@theme` 里的变量是「亮色基准」，`.dark` 是运行时覆盖层，两者职责不同。

## 第三步：玻璃态需要配套的阴影 token

玻璃卡片（半透明 + backdrop-blur）对阴影很敏感——亮色模式的浅阴影在暗色下几乎不可见。所以阴影也要成对：

```css
@theme {
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg-glow:
    0 8px 24px rgba(0, 0, 0, 0.1), 0 0 24px rgba(91, 143, 212, 0.15);
}

.dark {
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

`--shadow-lg-glow` 这种复合 token（抬升 + 品牌柔光）很适合交互卡片的 hover 态，效果统一且只需一个类名。

## 第四步：动效 token 只存缓动，不存时长

CSS 的 `transition-timing-function` 不能内嵌时长，所以硬塞 `150ms ease-out` 进 token 是用不了的。约定成：

```css
@theme {
  --ease-fast: ease-out;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

```html
<div class="transition-[translate,box-shadow] duration-200 ease-base hover:-translate-y-1">
```

时长交给 `duration-150/200/300` 工具类，缓动交给 token。另外只动 `transform` 和 `opacity`，**禁用 `transition: all`**。

## 第五步：给设计纪律留出「成文」的地方

token 只能约束「值」，约束不了「用法」。比如我的对比度纪律是：粉/紫/浅蓝只能做装饰或大号文字，小号彩色文字必须用 `--color-accent-dark`（对比度 ≥ 4.5:1）。这类规则写进设计文档，token 是执行手段，文档才是裁判。

## 总结

| 步骤 | 关键动作                     | 产出                     |
| ---- | ---------------------------- | ------------------------ |
| 1    | 色彩语义化命名               | `--color-*` 角色色板     |
| 2    | `@custom-variant dark` + 覆盖 | 双主题切换               |
| 3    | 阴影成对声明                 | 玻璃态两态可读           |
| 4    | 缓动与时长分离               | 动效统一且性能安全       |
| 5    | 纪律成文                     | token 用法有裁判         |

Tailwind 4 的 `@theme` 本质上是让你「用 CSS 的方式写配置」——一旦接受了这个设定，设计系统就是一份普通的 CSS 文件：可读、可 diff、可直接被浏览器消费。
