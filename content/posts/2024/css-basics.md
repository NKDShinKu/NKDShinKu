---
title: CSS 基础：2024 年的一份学习笔记
cover: https://img.nkdshinku.com/images/posts/css-basics.webp
description: 2024 年学前端时记下的 CSS 笔记：选择器与优先级、文本样式、背景与显示模式、盒子模型、浮动、Flex、定位，以及几个常用小技巧。
date: 2024-04-09
category: 笔记
tags:
  - CSS
  - 前端基础
  - 布局
keywords:
  - CSS 基础
  - 盒模型
  - Flex 布局
  - CSS 定位
  - 前端自学笔记
---

这篇和 HTML 那篇是一套，同样是 2024 年刚开始学前端时记下的。学到 CSS 的时候，我对「样式」的理解还停留在「给字换个颜色」，直到盒模型和浮动把我按在地上摩擦了几回——笔记里那些反复标红的概念，基本都是在那一阵子补上的。

2026 年重读，把错的改掉、缺的补上，整理成这一篇。内容依旧是最基础的那些，今天大概用不上了（笑），但当个回忆挺好。

## 选择器

- **类型选择器**：即标签名选择器。

```css
h1 {
  color: rebeccapurple;
}
em {
  color: rebeccapurple;
}
```

- **全局选择器**：用星号 `*` 表示，选中文档中的所有元素。

```css
* {
  margin: 0;
}
```

- **类选择器**：以句点 `.` 开头，选择文档中应用了这个类的所有元素，与 `class` 属性搭配。

```css
.className {
}
```

- **ID 选择器**：以 `#` 开头，用法和类选择器基本一样，与 `id` 属性搭配。

```css
#idName {
}
```

- **属性选择器**：

  *存否和值选择器*

  1. `[attr]`，例如 `a[title]`：匹配带有名为 attr 的属性的元素。
  2. `[attr=value]`，例如 `a[href="https://example.com"]`：匹配 attr 属性的值正好为 value 的元素。
  3. `[attr~=value]`，例如 `p[class~="special"]`：attr 的值等于 value，或者值中有多个（空格隔开）且至少有一个匹配 value。
  4. `[attr|=value]`，例如 `div[lang|="zh"]`：attr 的值等于 value，或者以 value 加一个连字符开头。

  *子字符串匹配选择器*

  1. `[attr^=value]`，例如 `li[class^="box-"]`：值以 value 开头。
  2. `[attr$=value]`，例如 `li[class$="-box"]`：值以 value 结尾。
  3. `[attr*=value]`，例如 `li[class*="box"]`：值中任意位置至少出现一次 value。

### 伪类和伪元素选择器

- 伪类用于选择处于**特定状态**的元素，以冒号 `:` 开头。
  - `:hover`：指针移到元素上时激活，一般用在链接上。
  - `:focus`：用键盘选中元素时激活。
  - `:link`：访问前。
  - `:visited`：访问后。
  - `:active`：点击时。

```css
a:hover {
  color: hotpink;
}
```

- 结构伪类选择器：
  - `:first-child`：选择第一个元素。
  - `:last-child`：选择最后一个元素。
  - `:nth-child(N)`：选择第 N 个元素，括号里可以填公式选中多个，比如 `2n`。

> 补充：写链接的这几个伪类时有顺序讲究，`link` → `visited` → `hover` → `active`（记作 LVHA），顺序不对某些状态会被覆盖掉。

- 伪元素的表现像是往标记文本里加入了一个**全新的 HTML 元素**。
  1. `::first-line`：选中第一行，即使字数变了也只选第一行。
  2. `::before`：插入到元素开头。
  3. `::after`：插入到元素末尾。

```css
.box::before {
  content: " xxx ";
}
```

> 补充：`::before` 和 `::after` 必须写 `content` 才会出现；常用的还有 `::placeholder`（输入框提示文字）和 `::selection`（选中文字）。

### 关系选择器

- 后代选择器：用一个空格组合两个选择器，只匹配 `.box` 里面的 `<p>`。

```css
.box p {
  color: red;
}
```

- 子代关系选择器：用大于号 `>`，只匹配直接子元素（只小一级），更远的后代不匹配。
- 邻接兄弟：用加号 `+`，选中紧挨在另一个同级元素后面的那一个。比如下面选中 `p` 后面的 `h1`。

```css
p + h1 {
}
```

- 通用兄弟：用波浪号 `~`，选中一个元素后面**所有**同级的目标元素。比如下面选中 `h1` 后面的所有 `p`。

```css
h1 ~ p {
}
```

## CSS 特性

### 继承性

- 子级默认继承父级的文字控制属性：子级没有对应属性就继承父级的，有就用自己的。

### 层叠性

- 相同的属性会覆盖：后面的 CSS 覆盖前面的。
- 不同的属性会叠加：都生效。

### 优先级

- 规则：选择器优先级高的样式生效。
- 公式：通配符选择器 < 标签选择器 < 类选择器 < id 选择器 < 行内样式 < `!important`。选中的范围越大，优先级越低。
- 叠加计算：复合选择器要按权重叠加，依次比较「行内样式 > id 选择器个数 > 类选择器个数 > 标签选择器个数」，每一级之间不存在进位；同一级里个数多的优先级高，个数相同就往后比。
- `!important` 权重最高。
- 继承来的样式权重最低，比通配符选择器还低——所以父级设了 `color`，子级随便一个选择器都能覆盖掉它。

## 文本样式化

### 基本文字样式

- `font-size`：字体大小，数字 + px（常用单位）。
- `font-weight`：字体粗细。正常 400 / `normal`，加粗 700 / `bold`。
- `font-style`：字体倾斜。正常 `normal`，倾斜 `italic`。
- `line-height`：行高，数字 + px，或者直接写数字（表示当前 font-size 的倍数）。
- `font-family`：字体族，值为字体名。一般使用无衬线字体，写成字体栈：

```css
font-family: "Microsoft YaHei", "Heiti SC", tahoma, arial, "Hiragino Sans GB", sans-serif;
```

> 补充：字体栈是从左往右找，前一个系统里没有就用下一个，最后的 `sans-serif` 是兜底。

- `font`：复合属性，一般用于设置网页公共样式，**必须写字号和字体**，可以跟「倾斜 加粗 字号/行高 字体」。
- `text-indent`：文本缩进，数字 + px，或者数字 + em（1em 等于当前标签的字号大小）。
- `text-align`：文本对齐方式，`left` 左对齐（默认）、`center` 居中、`right` 右对齐。
- `text-decoration`：修饰线，`none` 无、`underline` 下划线、`line-through` 删除线、`overline` 上划线。
- `color`：颜色。

![CSS 颜色值的几种写法对照](https://img.nkdshinku.com/images/posts/css-basics/color-formats.png)

> 补充：颜色的常见写法有颜色关键字（`red`）、十六进制（`#fff`、`#ffffff`）、`rgb()` / `rgba()`、`hsl()` / `hsla()`。十六进制和 rgb 适合颜色值固定的场合，hsl 调色更直观——比如只想改明暗，动第三个值就够了。

## 排版

### 背景属性

- 背景色：`background-color`。
- 背景图：`background-image`，属性值为 `url(背景图地址)`。背景图默认是平铺（重复）的。

```css
div {
  width: 400px;
  height: 400px;
  background-image: url(./images/1.png);
}
```

- 背景图平铺方式：`background-repeat`，`no-repeat` 不平铺、`repeat` 平铺（默认）、`repeat-x` 水平平铺、`repeat-y` 垂直平铺。
- 背景图位置：`background-position`，属性值是「水平位置 垂直位置」。
  1. 关键字：`left`、`right`、`center`、`top`、`bottom`。
  2. 数字 + px：正数向右或向下，负数向左或向上。
  - 提示：关键字写法可以颠倒顺序；只写一个关键字时，另一个方向默认为居中；只写一个数字时表示水平方向，垂直方向居中。
- 背景图缩放：`background-size`。
  1. `cover`：等比例缩放，完全覆盖背景区，图片可能有一部分看不见。
  2. `contain`：等比例缩放，完全装入背景区，背景区可能留白。
  3. 百分比：根据盒子尺寸计算图片大小。
  4. 数字 + 单位（比如 px）。
- 背景图固定：`background-attachment: fixed`，让背景相对于视口固定，页面滚动时背景不动。
- 背景复合属性：`background`，属性值为「背景色 背景图 平铺方式 位置/缩放 固定」，空格隔开，不区分顺序。

### 显示模式

- 块级元素（例如 `div`）：独占一行；宽度默认是父级的 100%；设置宽高生效。
- 行内元素（例如 `span`）：一行可以显示多个；设置宽高不生效，宽高由内容撑开。
- 行内块元素（例如 `img`）：一行可以显示多个；设置宽高生效，也可以由内容撑开。
- 转换显示模式：`display`，属性值 `block` 块级、`inline` 行内、`inline-block` 行内块。

### 盒子模型

#### 盒子模型——组成

- 内容区域：`width` 和 `height`。
- 内边距：`padding`，出现在内容与盒子边缘之间。
- 边框线：`border`。
- 外边距：`margin`，出现在盒子外面。

#### 盒子模型——边框线

- 属性名：`border`。
- 属性值：边框线粗细、线条样式、颜色，不区分顺序。常用样式有 `solid` 实线、`dashed` 虚线、`dotted` 点线。
- `border-方位名词` 可以单独设置某个方向。

```css
div {
  border-top: 2px solid red;
  border-right: 3px dashed green;
  border-bottom: 4px dotted blue;
  border-left: 5px solid orange;
  width: 200px;
  height: 200px;
  background-color: pink;
}
```

#### 盒子模型——内边距

- 作用：设置内容与盒子边缘之间的距离。
- 属性名：`padding` / `padding-方位名词`。

```css
div {
  /* 四个方向内边距相同 */
  padding: 30px;
  /* 单独设置一个方向 */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 40px;
  padding-left: 80px;
  width: 200px;
  height: 200px;
  background-color: pink;
}
```

- 多值写法：

![padding 一到四个值的简写规则](https://img.nkdshinku.com/images/posts/css-basics/padding-shorthand.png)

#### 盒子模型——尺寸计算

- 默认情况下，盒子尺寸 = 内容尺寸 + border 尺寸 + 内边距尺寸。
- 结论：给盒子加 border / padding 会把盒子撑大。
- 解决办法：手动做减法，减掉 border / padding 的尺寸；或者用内减模式 `box-sizing: border-box`。

#### 盒子模型——外边距

- 作用：拉开两个盒子之间的距离。
- 属性名：`margin`，属性值写法和含义与 padding 相同。
- 技巧：版心居中，左右 `margin` 写 `0 auto`（盒子必须有宽度）。

#### 清除默认样式

```css
/* 清除默认内外边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 清除列表项目符号 */
li {
  list-style: none;
}
```

#### 盒子模型——元素溢出

- 作用：控制溢出元素的内容怎么显示。
- 属性名：`overflow`，属性值 `hidden` 溢出隐藏、`scroll` 溢出滚动（无论是否溢出都显示滚动条位置）、`auto` 溢出滚动（溢出才显示）。

#### 外边距问题——合并与塌陷现象

- 合并现象
  1. 场景：垂直排列的兄弟元素，上下的 `margin` 会合并。
  2. 现象：取两个 `margin` 中的较大值生效。
- 塌陷现象
  1. 场景：父子级标签，给子级添加上外边距会产生塌陷。
  2. 现象：父级跟着一起向下移动。
  3. 解决方法：取消子级 `margin`，父级设置 `padding`；父级设置 `overflow: hidden`；父级设置 `border-top`。

#### 行内元素——内外边距问题

- 场景：给行内元素加 `margin` 和 `padding`，无法改变元素的垂直位置。
- 解决方法：给行内元素加 `line-height` 可以改变垂直位置。

```css
span {
  /* margin 和 padding 无法改变垂直位置 */
  margin: 50px;
  padding: 20px;
  /* 行高可以改变垂直位置 */
  line-height: 100px;
}
```

#### 盒子模型——圆角

- 作用：把元素的外边框设置成圆角。
- 属性名：`border-radius`，属性值为数字 + px 或百分比，数值就是圆角半径。
- 技巧：从左上角开始顺时针赋值，当前角没有数值时和对角取值相同。

![border-radius 从左上角开始顺时针取值的圆角示意](https://img.nkdshinku.com/images/posts/css-basics/border-radius.png)

#### 盒子模型——阴影（拓展）

- 作用：给元素设置阴影效果。
- 属性名：`box-shadow`。
- 属性值：X 轴偏移量、Y 轴偏移量、模糊半径、扩散半径、颜色、内外阴影。
- 注意：X 轴和 Y 轴偏移量必须写；默认是外阴影，内阴影要加 `inset`。

### 浮动

#### 标准流

标准流也叫文档流，指标签在页面中默认的排布规则，比如块元素独占一行、行内元素可以一行显示多个。

#### 浮动

- 作用：让块元素水平排列。
- 属性名：`float`，属性值 `left` 左对齐、`right` 右对齐。
- 特点：
  1. 浮动后的盒子顶对齐。
  2. 浮动后的盒子具备行内块的特点。
  3. 父级宽度不够时，浮动的子级会换行。
  4. 浮动后的盒子脱离标准流（脱标）。
- 清除浮动
  - 场景：浮动元素会脱标，如果父级没有高度，子级撑不开父级高度，可能导致布局错乱。
  - 方法一：额外标签法，在父元素内容的最后加一个块级元素，设置 `clear: both`。
  - 方法二：单伪元素法。

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

  - 方法三：双伪元素法（推荐）。

```css
.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
}
.clearfix::after {
  clear: both;
}
```

  - 方法四：给父元素加 `overflow: hidden`。

### Flex 布局

Flex 布局也叫弹性布局，适合结构化布局，提供了强大的空间分布和对齐能力。它不会产生浮动布局那种脱标现象，网页布局更简单、更灵活。

#### flex 组成

- 设置方式：给父元素设置 `display: flex`，子元素就可以自动挤压或拉伸。
- 组成部分：弹性容器、弹性盒子、主轴（默认水平方向）、侧轴 / 交叉轴（默认垂直方向）。

#### flex 常用属性一览

- 创建 flex 容器：`display: flex`
- 主轴对齐方式：`justify-content`
- 侧轴对齐方式：`align-items`，单个弹性盒子用 `align-self`
- 修改主轴方向：`flex-direction`
- 弹性伸缩比：`flex`
- 弹性盒子换行：`flex-wrap`
- 行对齐方式：`align-content`

#### 主轴对齐方式

属性名：`justify-content`

- `flex-start`：默认值，从起点开始依次排列。
- `flex-end`：从终点开始依次排列。
- `center`：沿主轴居中排列。
- `space-between`：沿主轴均匀排列，空白间距均分在弹性盒子之间。
- `space-around`：沿主轴均匀排列，空白间距均分在弹性盒子两侧。
- `space-evenly`：沿主轴均匀排列，弹性盒子之间、盒子与容器之间的间距都相等。

#### 侧轴对齐方式

- `align-items`：设置当前弹性容器内所有弹性盒子的侧轴对齐方式（给容器设置）。
- `align-self`：单独控制某个弹性盒子的侧轴对齐方式（给盒子设置）。

属性值：

- `stretch`：沿侧轴拉伸至铺满容器（弹性盒子没有设置侧轴方向尺寸时默认拉伸）。
- `center`：沿侧轴居中排列。
- `flex-start`：从起点开始依次排列。
- `flex-end`：从终点开始依次排列。

#### 修改主轴方向

属性名：`flex-direction`

- `row`：水平方向，从左向右（默认）。
- `column`：垂直方向，从上向下。
- `row-reverse`：水平方向，从右向左。
- `column-reverse`：垂直方向，从下向上。

#### 弹性伸缩比

- 作用：控制弹性盒子在主轴方向的尺寸。
- 属性名：`flex`，属性值是整数，表示占用父级剩余尺寸的份数。

#### 弹性盒子换行

弹性盒子可以自动挤压或拉伸，默认所有盒子都在一行显示。

- 属性名：`flex-wrap`。
- `wrap`：换行。
- `nowrap`：不换行（默认）。

#### 行对齐方式

属性名：`align-content`，控制多行弹性盒子在侧轴上的分布。

- `flex-start`：默认值，行从起点开始依次排列。
- `flex-end`：行从终点开始依次排列。
- `center`：行沿侧轴居中排列。
- `space-between`：行之间均匀分布，空白均分在行与行之间。
- `space-around`：行两侧的空白相等。
- `space-evenly`：行之间、行与容器之间的间距都相等。

注意：该属性对单行弹性盒子无效，只有换行之后出现多行才看得到效果。

### 定位

#### 定位

- 作用：灵活改变盒子在网页中的位置。
- 实现：先用 `position` 指定定位模式，再用边偏移 `left`、`right`、`top`、`bottom` 设置位置。

#### 相对定位

`position: relative`

- 不脱标，占用自己原来的位置。
- 显示模式特点保持不变。
- 设置边偏移时，相对自己原来的位置移动。
- 拓展：很少单独使用，一般是和其他定位方式配合。

#### 绝对定位

`position: absolute`

- 使用场景：子级绝对定位，父级相对定位（子绝父相）。
- 脱标，不占位。
- 显示模式具备行内块特点。
- 设置边偏移时，相对最近的已经定位的祖先元素改变位置。
- 如果所有祖先元素都没有定位，就相对浏览器可视区改变位置。

#### 定位居中

实现步骤：

1. 绝对定位。
2. 水平、垂直边偏移都设为 50%。
3. 子级向左、向上移动自身尺寸的一半：左、上的外边距为负的尺寸一半，或者用 `transform: translate(-50%, -50%)`。

#### 固定定位

`position: fixed`

- 场景：元素的位置在网页滚动时不会改变。
- 脱标，不占位。
- 显示模式具备行内块特点。
- 设置边偏移时，相对浏览器窗口改变位置。

#### 堆叠层级 z-index

- 默认效果：按标签书写顺序，后来者居上。
- 作用：设置定位元素的层级顺序，改变显示顺序。
- 属性名：`z-index`，属性值为整数，默认 0，取值越大层级越高。

![position 定位与边偏移示意](https://img.nkdshinku.com/images/posts/css-basics/position.png)

> 补充：`z-index` 只对定位元素生效，普通元素写它没有用；另外它比较的是「同一个层叠上下文」内部，父级一旦创建了新的上下文（比如带 `transform`），子级的层级就跑不出父级那一层了。

## 技巧

### CSS 精灵

CSS 精灵（CSS Sprites）是一种网页图片处理方式：把网页中一些背景图片整合到一张图片文件里，再用 `background-position` 精确地定位出要显示的位置。

- 优点：减少请求次数，减轻服务器压力，提高页面加载速度。
- 实现步骤：
  1. 创建盒子，盒子尺寸与小图尺寸相同。
  2. 设置盒子的背景图为精灵图。
  3. 用 `background-position` 改变背景图位置：先用 PxCook 测量小图左上角坐标，再取负数作为 `background-position` 的值（向左上移动图片位置）。

### 字体图标

- 引入字体样式表（iconfont.css）。
- 标签上使用字体图标的类名：
  1. `iconfont`：字体图标的基本样式（字体名、字体大小等）。
  2. `icon-xxx`：具体图标对应的类名。

### css 修饰属性

#### 垂直对齐方式 vertical-align

- 属性名：`vertical-align`。
- 属性值：`baseline` 基线对齐（默认）、`top` 顶部对齐、`middle` 居中对齐、`bottom` 底部对齐。

![vertical-align 的 baseline 等对齐方式示意](https://img.nkdshinku.com/images/posts/css-basics/vertical-align.png)

> 补充：`vertical-align` 只对行内元素和行内块元素生效，给块级元素写是不起作用的。

#### 过渡 transition

- 作用：为一个元素在不同状态之间切换时添加过渡效果。
- 属性名：`transition`（复合属性）。
- 属性值：过渡的属性、花费时间（单位 s）。
- 提示：
  1. 过渡的属性可以是具体的 CSS 属性。
  2. 也可以是 `all`，表示两个状态里取值不同的所有属性都产生过渡。
  3. `transition` 要设置在元素本身。

> 补充：完整写法是「属性 时长 缓动函数 延迟」，缓动常用 `ease`、`linear`、`ease-in-out`。

#### 透明度 opacity

- 作用：设置整个元素的透明度（包含背景和内容）。
- 属性名：`opacity`，属性值 0–1：0 完全透明（元素不可见）、1 不透明、中间的小数表示半透明。

> 补充：`opacity` 会让整个元素（包括子元素）一起变透明；只想让背景透明，用 `rgba()` 或 `hsl()` 里的 alpha 值。

#### 光标类型 cursor

- 作用：鼠标悬停在元素上时指针显示的样式。
- 属性名：`cursor`。
- `default`：默认值，通常是箭头。
- `pointer`：小手，提示用户可以点击。
- `text`：工字形，提示可以选择文字。
- `move`：十字光标，提示可以移动。

## 写在最后

这份笔记是 2024 年学 CSS 时整理的，来源包括 MDN 之类的官方文档和当时看的教程视频。回头看，最值钱的不是那些属性值，而是「盒模型会把盒子撑大」这种被坑过才记住的结论。

CSS 到今天依然是我觉得最容易被低估的东西：语法就那么点，但真要用得顺，靠的是对布局规则的理解。这份笔记只能算个开始。

下一篇是 JavaScript 基础，内容是变量、数据类型、函数和 DOM 操作这些。
