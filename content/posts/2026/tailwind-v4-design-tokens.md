---
title: Tailwind 4 的 @theme：把设计 token 写进 CSS
cover: https://img.nkdshinku.com/images/posts/tailwind-v4-design-tokens.webp
description: 用 @theme 管设计 token 的实际做法：语义化命名、亮暗两套、阴影成对、缓动与时长分离，以及对比度那条规则是怎么补出来的。
date: 2026-08-31
updated: 2026-09-13
category: 技术
tags:
  - Tailwind
  - CSS
  - 设计系统
keywords:
  - "Tailwind CSS 4"
  - "@theme"
  - 设计 token
---

Tailwind 4 去掉了 `tailwind.config.js`，token 全部写进 CSS 的 `@theme`。一开始我以为只是配置位置变了，实际用下来不止如此：声明一个 token，同时得到三样东西。

```css
@import "tailwindcss";

@theme {
  --color-accent: #5b8fd4;
}
```

1. 工具类：`bg-accent`、`text-accent`、`border-accent`；
2. CSS 变量：`var(--color-accent)`，手写 CSS 也能用；
3. 透明度修饰符：`bg-accent/10`。

这就是 CSS-first 的实际含义：token 不再是构建工具的配置，而是浏览器能直接读的变量。

## 命名按角色，不按颜色

不要按颜色本身命名（`--blue-500`），要按它扮演的角色命名。

```css
@theme {
  /* 品牌 */
  --color-accent: #5b8fd4; /* 天蓝，主强调 */
  --color-sakura: #f0a0b8; /* 樱粉，次强调 */
  --color-twilight: #9b8ec4; /* 暮紫，三次强调 */

  /* 语义 */
  --color-bg: #f0f4f8;
  --color-surface: #ffffff;
  --color-text: #2d2b3a;
  --color-text-muted: #6b6880;
  --color-border: #e2e8f0;
}
```

好处是换主题、调品牌色只改一处，页面上几十个工具类跟着走。命名要用 Tailwind 的语义命名空间（`--color-*`、`--font-*`、`--radius-*`、`--shadow-*`），自造前缀生成不出工具类。

## 亮暗两套

Tailwind 4 默认跟随系统。要支持手动切换，先声明一个自定义 variant：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

然后在 `@theme` 外面用 `.dark` 覆盖同名变量：

```css
.dark {
  --color-bg: #1a1b2e;
  --color-surface: #242538;
  --color-text: #e8e6f0;
}
```

切换只需要一行 JS：`document.documentElement.classList.toggle("dark")`。但要在 `<head>` 里放一段内联脚本提前判断主题，否则会闪一下亮色（FOUC）。

这里有个理解上的分界：`@theme` 里的是亮色基准，`.dark` 是运行时覆盖层，两者职责不同。

## 阴影要成对

玻璃卡片（半透明 + backdrop-blur）对阴影很敏感：亮色下合适的浅阴影，在暗色下几乎不可见。所以阴影也得两套。

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

`--shadow-lg-glow` 这种复合 token（抬升 + 品牌柔光）适合交互卡片的 hover 态：一个类名即可，全站效果一致。

## 动效 token 只存缓动

CSS 的 `transition-timing-function` 里不能带时长，所以把 `150ms ease-out` 整个塞进 token 是用不了的。约定成：token 只存缓动，时长交给 `duration-150/200/300`。

```css
@theme {
  --ease-fast: ease-out;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

另外只动 `transform` 和 `opacity`，不写 `transition: all`。

## 有一条规则是走查时才补出来的

品牌色里那三个深色变体（`--color-accent-dark`、`--color-sakura-dark`、`--color-twilight-dark`）不是一开始就有的。

起因是设计走查时检查对比度：粉色 `#f0a0b8` 当小号文字用时，实测只有 2.0:1，离 4.5:1 差得远。但粉色确实需要一个能落在文字上的版本，于是补了一组深变体：装饰和图形继续用亮粉，小号文字改用深色版本。

这条规则现在写在设计文档里：粉、紫、浅蓝只能做装饰或大号文字，小号彩色文字必须用深变体。

## token 管值，文档管用法

token 能约束「用哪些值」，约束不了「什么时候用」。上面那条对比度规则就是例子：它没法用 token 表达，只能写在文档里，由人来判断。

我的做法是：token 在 `globals.css`，规则在 `docs/design-system.md`。改 token 的时候顺手翻一下设计文档，两边对不上就先改文档。

## 现在的流程

要改配色：改 `globals.css` 里的变量 → 亮暗两态各跑一遍 → 确认设计文档里的规则仍然成立。没有其它需要记的步骤。
