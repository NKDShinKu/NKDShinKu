---
title: HTML 基础：2024 年的一份学习笔记
cover: https://img.nkdshinku.com/images/posts/html-basics.webp
description: 2024 年刚开始学前端时记下的 HTML 笔记：标题与段落、列表、文本处理、超链接、网站结构、图片与音视频、表格、表单控件。
date: 2024-04-15
category: 笔记
tags:
  - HTML
  - 前端基础
  - 语义化
keywords:
  - HTML 基础
  - 语义化标签
  - HTML 表单
  - HTML 多媒体
  - 前端自学笔记
---

这篇是 2024 年 4 月刚开始学前端时记下的笔记。那会儿刚从「看得懂网页」跨到「自己写网页」，连 `<h1>` 和 `<h6>` 谁大都要想一下。

2026 年重读，把里面的错改了、缺的补上，整理成这一篇。内容都是基础中的基础，放到今天实用价值大概也就剩那么一点了（笑），不过它是这条路的起点，就当个人回忆存个档。

## 标题与段落

- 标题：六种标题元素 `<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`，分别代表文档中不同级别的内容。`<h1>` 是主标题，`<h2>` 是二级子标题，依此类推。
- 段落：每个段落用 `<p>` 定义。

```html
<h1>我是一级标题</h1>
<h2>我是二级标题</h2>
<!-- ... -->
<p>我是一个段落。</p>
```

三点补充：

- 标题表示的是层级不是字号，不要为了字大去用标题标签，也不要跳级（`<h2>` 后面直接接 `<h4>`）。
- `<p>` 里只能放行内内容，塞 `<div>` 会让浏览器提前把 `<p>` 闭合。
- 源码里的换行和连续空格渲染时会折叠成一个空格，分段用 `<p>`，不要用 `<br>` 撑。

## 列表

- 无序列表：从 `<ul>` 开始，包裹所有列出的项目，每个项目用 `<li>` 单独包裹。

```html
<ul>
  <li>豆浆</li>
  <li>油条</li>
  <li>豆汁</li>
  <li>焦圈</li>
</ul>
```

- 有序列表：从 `<ol>` 开始，同样是 `<li>` 包裹每一项，适用于顺序有意义的内容。

```html
<ol>
  <li>沿这条路走到头</li>
  <li>右转</li>
  <li>直行穿过第一个十字路口</li>
  <li>在第三个十字路口处左转</li>
  <li>继续走 300 米，学校就在你的右手边</li>
</ol>
```

- 描述列表：`<dl>` 包裹，用 `<dt>`（description term）写术语，用 `<dd>`（description definition）写解释。

```html
<dl>
  <dt>内心独白</dt>
  <dd>戏剧中，某个角色对自己的内心活动或感受进行念白表演，这些台词只面向观众，其他角色不会听到。</dd>
  <dt>语言独白</dt>
  <dd>戏剧中，某个角色把自己的想法直接进行念白表演，观众和其他角色都可以听到。</dd>
  <dt>旁白</dt>
  <dd>戏剧中，为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白，只面向观众。</dd>
</dl>
```

嵌套列表要写在 `<li>` 内部；`<ol>` 可以用 `start` 指定起始编号、用 `reversed` 倒序；列表在屏幕阅读器里会被播报成「共 N 项」。

## 简单的文本处理

- `<em>`：强调，默认显示为斜体。
- `<strong>`：重要，默认显示为加粗。
- `<ins>`：插入的内容，默认带下划线。
- `<del>`：删除的内容，默认带删除线。
- `<hr>`：水平线，用于话题之间的分隔；`<br>`：换行。这两个是空元素，没有结束标签。
- `<abbr>`：缩略语，用 `title` 给出全称。

```html
<p>
  第 33 届<abbr title="夏季奥林匹克运动会">奥运会</abbr>于 2024 年 7 月至 8 月在法国巴黎举行。
</p>
```

- 块引用：一段或多段内容引自别处时，用 `<blockquote>` 包裹，`cite` 属性放来源 URL。
- 行内引用：`<q>`，浏览器会自动加引号。
- `cite` 属性的值只有机器读得到，页面上不会显示，想让人看见出处得另写一段可见的文字。
- 标记联系方式：`<address>`，只用来放联系方式。
- 上标：`<sup>`，比如 x²；下标：`<sub>`，比如 H₂O。

`<i>` 和 `<b>` 是纯视觉的斜体、加粗，没有强调语义；`<mark>` 表示高亮。

## 超链接

- 把文字或图片包在 `<a>` 里，再给它一个 `href` 属性（值为网址），就得到一个基本链接。
- `title`：鼠标悬停时出现的提示信息。触摸设备上没有 hover，所以它不能替代链接文字。
- `target="_blank"`：在新标签页打开。

```html
<a href="https://example.com" title="示例站点" target="_blank" rel="noopener noreferrer">示例站点</a>
```

`href` 的几种写法：`./a.html` 当前目录、`../a.html` 上一级、`/a.html` 站点根目录、`https://` 开头的绝对网址；页内跳转用 `#id`。外链加上 `rel="noopener noreferrer"` 更稳妥，新页面拿不到原页面的 `window.opener`。

## 网站结构

- 语义标签：`<header>` 页眉；`<nav>` 导航栏；`<main>` 主内容，里面还可以用 `<article>`、`<section>`、`<div>` 等划分；`<aside>` 侧边栏，经常嵌套在 `<main>` 中；`<footer>` 页脚。
- 无语义元素：`<div>` 和 `<span>`，应配合 `class` 属性使用，方便查询和选中。
  - `<span>` 是行内的无语义元素，最好只用在找不到更好的语义元素、或者不想增加特定含义时。
  - `<div>` 是块级的无语义元素，同样只在找不到更合适的块级元素时用。比如电商页面里一个常驻的购物车组件，外面那层容器用它就合适。

`<main>` 一个页面只放一个；`<section>` 表示有主题的区段，一般应该有自己的标题，否则用 `<div>` 更诚实。用语义标签还有个实际好处：屏幕阅读器用户可以按地标直接跳到导航或主内容。

## 图片

- 使用 `<img>` 元素，搭配 `src` 和 `alt`。
- `src`：图片地址，可以是相对 URL 或绝对 URL。
- `alt`：备选文本。图片不显示时用户会看到它，屏幕阅读器读的也是它。
- `width` 和 `height`：图片的宽度和高度，以像素为单位。写上原始尺寸能避免图片加载完成后页面往下跳。
- `title`：鼠标悬停在图片上时出现的提示信息。

```html
<img
  src="images/dinosaur.jpg"
  alt="一具恐龙骨架的头部和躯干"
  width="400"
  height="341"
  title="霸王龙骨架"
/>
```

- `<figure>` 和 `<figcaption>`：给图片提供一个语义容器，把说明文字和图片关联起来。`<figure>` 里不一定是图片，几张图、一段代码、音视频、公式、表格都可以。

```html
<figure>
  <img src="images/dinosaur.jpg" alt="一具恐龙骨架的头部和躯干" width="400" height="341" />
  <figcaption>曼彻斯特大学博物馆里展出的一具霸王龙骨架。</figcaption>
</figure>
```

装饰图写 `alt=""` 让辅助技术跳过；复杂图表的 `alt` 给概述，正文再讲数据。

## 视频

- 使用 `<video>` 元素，搭配 `src`。

```html
<video controls width="400" height="400" autoplay muted loop preload="auto" poster="poster.png">
  <source src="rabbit320.mp4" type="video/mp4" />
  <source src="rabbit320.webm" type="video/webm" />
  <p>你的浏览器不支持此视频，可点击<a href="rabbit320.mp4">此链接</a>观看。</p>
</video>
```

- `controls`：显示浏览器自带的控制界面。
- `width` 和 `height`：宽度和高度。
- `autoplay`：自动播放，通常要配 `muted` 才会被浏览器放行。
- `loop`：播放结束后重新开始。
- `muted`：默认静音。
- `poster`：视频播放前显示的画面，通常用于粗略的预览。
- `preload`：缓冲策略，`none` 不缓冲、`auto` 页面加载后缓存媒体文件、`metadata` 只缓冲元数据。
- `<source>`：浏览器会逐个检查，播放第一个与自身支持的格式相匹配的媒体；都不支持时，显示标签内部的备用内容。

视频不支持 `alt`，无障碍要靠 `<track>` 字幕。

## 音频

- 使用 `<audio>` 元素，其他与上文类似。

```html
<audio controls src="audio.mp3">
  <p>你的浏览器不支持此音频，可点击<a href="audio.mp3">此链接</a>收听。</p>
</audio>
```

`<audio>` 只处理声音，所以没有 `width`、`height`、`poster` 这些和画面有关的属性，同样也不支持 `alt`。

## 关于媒体的其他知识

- `<iframe>`：嵌入技术，把其他 Web 文档嵌入当前文档。很适合放第三方内容——正因为内容不受你控制，更要留心安全。

```html
<iframe
  src="https://example.com/embed"
  title="示例嵌入内容"
  width="640"
  height="360"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

`title` 是必须的，屏幕阅读器靠它说明这个框里是什么；`loading="lazy"` 让它别拖累首屏；`sandbox` 限制嵌入页面能做什么，按需放开。

- SVG：用来描述矢量图像的 XML 语言，它基本上和 HTML 一样是门标记语言，只是元素换成了一堆定义形状和效果的东西，比如 `<circle>` 和 `<rect>`。SVG 用来标记图形，而不是内容。

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
  <rect width="300" height="200" fill="black" />
  <circle cx="150" cy="100" r="90" fill="blue" />
</svg>
```

现代写法只需要 `xmlns` 和 `viewBox`，`version` 和 `baseProfile` 是 SVG 1.1 时代的写法，后者已经被移除了。`viewBox` 比 `width`/`height` 更关键，它决定图形怎么缩放。

- 响应式图片：`srcset` 定义浏览器可选择的图片以及每张图的宽度，每张图的信息和前一张之间用逗号隔开（名字、空格、宽度）；`sizes` 定义一组媒体条件，并指明条件为真时用多宽的图（条件、空格、图片将填充的槽宽）。

```html
<img
  srcset="elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
  src="elva-fairy-800w.jpg"
  alt="打扮成仙女的 Elva"
/>
```

首屏的那张大图不要加 `loading="lazy"`，可以用 `fetchpriority="high"`；格式上优先 WebP / AVIF，需要照顾老浏览器时用 `<picture>` 做回退。

## 表格

- `&nbsp;`：空白，准确说是「不换行空格」，属于字符实体，别漏了分号。
- `colspan`：让单元格横跨多个列（宽度）；`rowspan`：让单元格跨越多行（高度）。

```html
<table>
  <!-- 表格包含在 <table></table> -->
  <tr>
    <!-- 行 tr -->
    <td>Hi, I'm your first cell.</td>
    <!-- 列 td -->
    <td>I'm your second cell.</td>
    <td>I'm your third cell.</td>
    <td>I'm your fourth cell.</td>
  </tr>
  <tr>
    <td>Second row, first cell.</td>
    <td>Cell 2.</td>
    <td>Cell 3.</td>
    <td>Cell 4.</td>
  </tr>
</table>
```

- `colgroup` 和 `col`：在 `<table>` 下面、`<thead>` 之前加一个 `<colgroup>`，里面用 `<col>` 逐列控制样式。

```html
<colgroup>
  <col span="2" />
  <!-- 跳过前两列 -->
  <col style="background-color: #97db9a" />
  <!-- 控制第三列 -->
  <col style="width: 42px" />
  <col style="background-color: #97db9a" />
  <col style="background-color: #dcc48e; border: 4px solid #c1437a" />
  <col span="2" style="width: 42px" />
</colgroup>
```

- 表格边框：`border-collapse: collapse` 让相邻单元格的边框合并成一条，不加的话每条边各画各的，挨在一起会呈现出加倍的粗双线。

## 交互展示

这些控件直接写进 Markdown 是渲染不出来的——本站的 Markdown 管线会把正文里的原生 HTML 丢掉，所以下面只留代码。想看效果，把这段存成 `.html` 用浏览器打开。

```html
输入用户名：<input type="text" placeholder="请输入用户名" />
输入密码：<input type="password" placeholder="请输入密码" />

性别：
<input type="radio" name="x" checked /> 男
<input type="radio" name="x" /> 女

<input type="checkbox" checked /> 原神
<input type="checkbox" /> 星穹铁道
<input type="checkbox" /> 绝区零

文件：<input type="file" multiple />

选择游戏：
<select>
  <option>原神</option>
  <option>星穹铁道</option>
  <option>绝区零</option>
  <option selected>崩坏 3</option>
</select>
```

- 单选框靠相同的 `name` 分组互斥，名字不同就各选各的；`value` 决定提交时真正送出去的值。
- 控件要配合 `<label>` 使用，用 `for` 指向控件的 `id`，或者直接把控件包在 `<label>` 里，点击文字也能选中。
- `placeholder` 是提示，一输入就消失，不能替代 `<label>`。
- `<button>` 在表单里的默认类型是 `submit`，只做交互不提交时记得写 `type="button"`。

## 写在最后

这份笔记是 2024 年学 HTML 时整理的，来源包括 MDN 之类的官方文档和当时看的教程视频。那会儿的习惯是「先把结论抄下来」，很多标签为什么存在、什么时候该用，是后来才慢慢弄明白的。

重读时感受最深的是「语义化」这件事：当年觉得它是种讲究，现在才明白它是浏览器、搜索引擎和辅助技术之间的一份共识——你写的每个标签，都是在对它们说话。哪怕这些东西今天随手就能生成，知道它在说什么，和只是把它抄过来，还是两回事。

下一篇是 CSS 笔记。
