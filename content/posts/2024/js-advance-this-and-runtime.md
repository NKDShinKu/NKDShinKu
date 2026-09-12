---
title: JavaScript 进阶 1：this、执行原理与闭包
cover: https://img.nkdshinku.com/images/posts/js-advance-1.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：this 的四种绑定规则、箭头函数、浏览器渲染原理、V8 与 JS 执行过程、内存管理和闭包。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - 闭包
keywords:
  - this 指向
  - 浏览器渲染原理
  - V8 引擎
  - 闭包
  - 前端自学笔记
---

这份 JavaScript 进阶笔记的底子也是 2024 年记的，但体量比基础篇大得多，硬塞进一篇会失控，所以按当初的知识块拆成了几篇。这一篇是第 1 篇：this、箭头函数、浏览器渲染原理、JS 执行原理、内存管理和闭包。

翻笔记的时候发现，当初开头还列了个大纲，写着「细节性东西 / 原理性 / 进阶性 / ES6~ES13 / 手写原理或者工具函数」——大概就是「从会用，到想知道为什么」的那个阶段。

## this 指向

### 四项规则

1. 函数在调用时，JavaScript 会默认给 this 绑定一个值。
2. this 的绑定和定义的位置（编写的位置）没有关系。
3. this 的绑定和调用方式、调用的位置有关系。
4. this 是在运行时被绑定的。

### 默认绑定

通过独立函数调用，即函数没有被绑定到某个对象上进行调用。

### 隐式绑定

通过某个对象发起的函数调用。

### new 绑定

使用 `new` 关键字调用函数时，会执行如下操作：

1. 创建一个全新的对象；
2. 这个新对象会被执行 prototype 连接；
3. 这个新对象会绑定到函数调用的 this 上（this 的绑定在这个步骤完成）；
4. 如果函数没有返回其他对象，表达式会返回这个新对象。

### 显式绑定

不希望在对象内部包含这个函数的引用，同时又希望在这个对象上强制调用时，可以使用显式绑定。

```js
// call：参数依次传入
func.call(this指向, func参数1, func参数2, ...);

// apply：参数以数组传入
func.apply(this指向, [func参数1, func参数2, ...]);

// bind：返回一个绑定了 this 的新函数
bar = foo.bind(this指向);
bar();
```

### 规则优先级

`new` > `bind` > `call` / `apply` > 隐式 > 默认。

`new` 绑定和 `call`、`apply` 不允许同时使用，所以不存在谁的优先级更高。

### 其他情况

- 显式绑定中传入 `null` 或 `undefined`，这次显式绑定会被忽略，使用默认规则。
- 创建一个函数的间接引用时（比如 `obj2.foo = obj1.foo`），赋值的结果是 foo 函数本身；直接调用它就属于默认绑定。

## 箭头函数 arrow function

### 介绍箭头函数

箭头函数是 ES6 之后新增的写法，比函数表达式更简洁：

- 箭头函数不会绑定 this、arguments 属性；
- 箭头函数不能作为构造函数使用（不能和 `new` 一起用，会抛错）；
- 箭头函数没有显式原型 prototype，所以不能用来 `new` 对象；
- 箭头函数也不绑定 this、arguments、super 参数。

```js
var foo = (name) => {
  console.log(name);
};
```

### 编写优化

- 只有一个参数时，小括号可以省略。

```js
var foo = (name) => {
  console.log(name);
};
```

- 执行体只有一行代码时，可以省略大括号，这一行的返回值就是整个函数的返回值。

```js
var foo = (name) => console.log(name);

var foo2 = (name) => name === "genshin";
console.log(foo2("genshin")); // true
```

- 执行体只返回一个对象时，需要给对象加上小括号。

```js
var arrFn1 = () => ["abc", "cba"];
var arrFn2 = () => {}; // 注意：这里是执行体，不是对象
var arrFn3 = () => ({ name: "why" });
```

### this 规则

箭头函数不使用 this 的四种标准规则（也就是不绑定 this），而是根据外层作用域来决定 this。所以放在 `setTimeout` 的回调里，this 会从上层作用域中找到对应的值。

> 补充：正因为没有自己的 this，箭头函数也不能用 `call` / `apply` / `bind` 改变 this；需要动态 this 的场景（比如对象方法、事件处理函数）就不要用箭头函数。

## 浏览器渲染原理

![浏览器渲染流程](https://img.nkdshinku.com/images/posts/js-advance-1/rendering.png)

### 一、HTML 解析

默认情况下服务器会给浏览器返回 index.html 文件，所以解析 HTML 是所有步骤的开始。解析 HTML 会构建 `DOM Tree`。

### 二、生成 CSS 规则

解析过程中遇到 CSS 的 link 元素，浏览器会下载对应的 CSS 文件——下载 CSS 不会影响 DOM 的解析。下载完成后对 CSS 进行解析，得到 `CSSOM Tree`（CSS Object Model）。

### 三、构建 Render Tree

有了 DOM Tree 和 CSSOM Tree，两者结合构建 `Render Tree`。

- link 元素不会阻塞 DOM Tree 的构建，但会阻塞 Render Tree 的构建，因为构建 Render Tree 需要对应的 CSSOM Tree。
- Render Tree 和 DOM Tree 并不是一一对应的关系，比如 `display: none` 的元素压根不会出现在 Render Tree 中。

### 四、布局（layout）和绘制（Paint）

- 布局：在 Render Tree 上运行布局，计算每个节点的几何体。Render Tree 表示显示哪些节点和它们的样式，但不表示尺寸和位置，布局就是确定所有节点的宽度、高度和位置信息。
- 绘制：把布局阶段计算出的每个 frame 转成屏幕上实际的像素点，包括绘制元素的可见部分，比如文本、颜色、边框、阴影和替换元素（比如 img）。

### 回流和重绘

- 回流 reflow（也叫重排）：第一次确定节点的大小和位置叫布局，之后对节点的大小、位置修改重新计算就叫回流。
  - 触发场景：DOM 结构改变（添加或移除节点）、改变布局（修改 width、height、padding、font-size 等）、窗口 resize、调用 `getComputedStyle` 获取尺寸和位置信息。
- 重绘 repaint：第一次渲染内容叫绘制，之后重新渲染就叫重绘。
  - 触发场景：修改背景色、文字颜色、边框颜色、样式等。
- 回流一定会引起重绘，所以回流很消耗性能。

开发中尽量避免回流：

1. 修改样式尽量一次性完成，比如用 `cssText` 或加 class；
2. 避免频繁操作 DOM，可以在 DocumentFragment 或父元素里把操作做完再一次性插入；
3. 避免用 `getComputedStyle` 反复读取尺寸、位置；
4. 对某些元素使用 `position: absolute` 或 `fixed`——不是不会引起回流，而是开销相对小，不会影响其他元素。

### 特殊解析——composite 合成

- 绘制时可以把布局后的元素绘制到多个合成图层中，这是浏览器的一种优化手段。
- 默认情况下，标准流中的内容都绘制在同一个图层（Layer）里。
- 一些特殊属性会创建新的合成层（CompositingLayer），新图层可以利用 GPU 加速绘制，因为每个合成层都是单独渲染的。常见的有：3D transforms、video / canvas / iframe、opacity 动画转换时、`position: fixed`、`will-change`（实验性属性，提前告诉浏览器元素可能发生哪些变化）、animation 或 transition 设置了 opacity / transform。
- 分层确实能提高性能，但代价是内存，所以不要作为性能优化策略过度使用。

## JS 执行原理

### script 元素和页面解析的关系

- 浏览器解析 HTML 时遇到 script 元素，会停止构建 DOM 树，先下载并执行 JavaScript 脚本，执行结束后再继续解析 HTML。
- 停止构建 DOM 树的原因是：JavaScript 会操作、修改 DOM。如果等 DOM 树构建完成并渲染后再执行 JS，会造成严重的回流和重绘。
- 但这在现代页面开发中也会带来新问题：Vue、React 这类项目里脚本往往比 HTML 更「重」，处理时间更长，于是页面解析被阻塞，脚本下载执行完之前用户什么都看不到。
- 为了解决这个问题，script 元素提供了 `defer` 和 `async` 两个属性。

`defer`：

- 让浏览器不等待脚本下载，继续解析 HTML、构建 DOM Tree；
- 如果脚本提前下载好了，它会等 DOM Tree 构建完成，在 `DOMContentLoaded` 事件之前执行；
- 多个带 defer 的脚本可以保持正确的执行顺序；
- 某种程度上能提高页面性能，推荐放在 head 元素中；
- 只适用于外部脚本，写在 script 标签内部的代码会被忽略。

`async`：

- 也能让脚本不阻塞页面；
- 让脚本完全独立：独立下载、独立运行，不保证顺序，也不等待其他脚本；
- 不保证在 `DOMContentLoaded` 之前还是之后执行。

两者的选择：需要等文档解析完再操作 DOM、且多个脚本有顺序要求时用 defer；脚本彼此独立、对 DOM 也没有依赖时用 async。

> 补充：还有一种常见做法是把 script 放在 body 末尾，效果接近 defer，但 defer 更明确，也不依赖书写位置。

### V8 引擎

![V8 引擎执行流程](https://img.nkdshinku.com/images/posts/js-advance-1/v8.png)

- Parse 模块：把 JavaScript 代码转换成 AST（抽象语法树），因为解释器并不直接认识 JS 代码。如果函数没有被调用，就不会被转换成 AST。
- Ignition：解释器，把 AST 转换成 ByteCode（字节码），同时收集 TurboFan 优化所需要的信息（比如函数参数的类型）。函数只调用一次时，Ignition 直接解释执行字节码。
- TurboFan：编译器，把字节码编译成 CPU 可以直接执行的机器码。函数被多次调用会被标记为热点函数，经过 TurboFan 转换成优化的机器码，提升执行性能。
  - 但机器码也可能被还原成字节码：如果后续执行时类型发生变化（比如 sum 函数原来执行的是 number，后来变成了 string），之前优化的机器码无法正确处理，就会逆向转换回字节码。

整体链路可以简单记为：Blink 拿到代码 → stream → scanner（词法分析）→ parser（语法分析）。

### 初始化全局对象

JS 引擎在执行代码之前，会在堆内存中创建一个全局对象 Global Object（GO）：

- 所有的作用域都可以访问它；
- 里面包含 Date、Array、String、Number、setTimeout、setInterval 等等；
- 还有一个 window 属性指向它自己。

### 执行上下文（Execution Contexts）

JS 引擎内部有一个执行上下文栈（Execution Context Stack，ECS），用于执行代码的调用栈。

要执行全局代码时，会先构建一个 Global Execution Context（GEC），把它放入 ECS 中执行。GEC 包含两部分内容：

1. 代码执行前，在 parser 转成 AST 的过程中，把全局定义的变量、函数等加入 Global Object，但不会赋值——这个过程叫变量的作用域提升（hoisting）；
2. 代码执行中，对变量赋值，或者执行其他函数。

### VO 对象（Variable Object）

每一个执行上下文都会关联一个 VO（Variable Object，变量对象），变量和函数声明会被添加到这个 VO 对象中。全局代码执行时，VO 就是 GO 对象。

### 函数执行

执行到函数时，会根据函数体创建一个函数执行上下文（Functional Execution Context，FEC），压入 EC Stack。

每个执行上下文都会关联一个 VO，进入函数执行上下文时会创建一个 AO 对象（Activation Object）：

- AO 使用 arguments 作为初始化，初始值是传入的参数；
- AO 作为执行上下文的 VO 来存放变量的初始化；
- 此时 VO 就是 AO 对象。

### 作用域链

进入执行上下文时，还会关联一个作用域链（Scope Chain）：

- 作用域链是一个对象列表，用于变量标识符的求值；
- 进入执行上下文时作用域链被创建，并根据代码类型添加一系列对象；
- 每执行一个函数，这个函数对象就会关联到上一个作用域；
- 作用域链只与创建位置有关，与执行位置无关。

## 内存管理

### 栈与堆

- JS 在定义数据时会为我们分配内存。
- 原始数据类型的分配在执行时直接在栈空间进行。
- 复杂数据类型会在堆内存中开辟一块空间，并把这块空间的指针返回给变量引用。

### 垃圾回收

内存有限，不再需要的时候就要释放，腾出空间。

- 垃圾回收的英文是 `Garbage Collection`，简称 GC；
- 不再使用的对象被称为垃圾，需要被回收；
- 垃圾回收器也简称 GC，所以看到 GC 时可能指的是回收机制，也可能指的是回收器。

### GC 的实现与算法

- 引用计数（Reference counting）：对象有一个引用指向它，引用数 +1；引用数为 0 时就可以销毁。
  - 弊端：会产生循环引用（`obj1.info = obj2`，`obj2.info = obj1`）。
- 标记清除（Mark-Sweep）：核心思路是可达性（Reachability）。设置一个根对象，垃圾回收器定期从根开始找所有有引用到的对象，没引用到的就认为是不可用的对象。它可以很好地解决循环引用问题。
- 标记整理（Mark-Compact）：和标记清除相似，不同的是回收期间会把保留的对象搬运汇集到连续的内存空间，避免内存碎片化。
- 分代收集（Generational collection）：对象被分成「新的」和「旧的」两组。许多对象很快死去，可以被快速清理；长期存活的对象变得老旧，被检查的频次也会减少。
- 增量收集（Incremental collection）：如果一次遍历标记整个对象集，可能带来明显的延迟；引擎把垃圾回收工作分成几部分逐一处理，产生许多微小延迟而不是一个大延迟。
- 闲时收集（Idle-time collection）：垃圾收集器只会在 CPU 空闲时尝试运行，减少对代码执行的影响。

## 闭包

### 理解闭包

- 一个普通函数，如果它可以访问外层作用域的自由变量，那么这个函数和周围环境就是一个闭包。
- 广义上：JavaScript 中的函数都是闭包。
- 狭义上：一个函数访问了外层作用域的变量，它就是闭包。

### 闭包引起内存泄漏

```js
function createAdder(count) {
  function adder(num) {
    return count + num;
  }
  return adder;
}

var adder5 = createAdder(5);
adder5(100);
adder5(55);
adder5(12);

var adder8 = createAdder(8);
adder8(22);
adder8(35);
adder8(7);

console.log(adder5(24));
console.log(adder8(30));

// 从这里开始永远不会再使用 adder8
adder8 = null;
```

![闭包形成的内存图](https://img.nkdshinku.com/images/posts/js-advance-1/closure-memory.png)

从根节点开始能找到所有引用对象，所以这些对象都会保留：作用域指向了 0xb00 和 0xc00，所以 adder5 和 adder8 都不会自动销毁。

- 如果后续不再使用 adder5 和 adder8，这两个函数对象应该被销毁，它们引用的父作用域 AO 也应该被销毁；
- 但全局作用域下的 adder5 和 adder8 变量对 0xb00、0xc00 的函数对象有引用，而这两个函数对象的作用域又引用了 AO，最终这些内存都无法释放；
- 所以闭包会造成内存泄漏，一般是全局作用域对内层作用域有引用，导致引用链上的所有对象都无法释放；
- 想销毁就给变量赋值为空，比如 `adder8 = null`。

### 浏览器优化

如果一个 AO 对象不被销毁，里面没有使用过的属性会被释放。

```js
function foo() {
  var name = "foo";
  var age = 18;
  var height = 1.88;

  function bar() {
    debugger;
    console.log(name);
  }

  return bar;
}

var fn = foo();
fn();
```

![浏览器释放未使用属性的内存图](https://img.nkdshinku.com/images/posts/js-advance-1/closure-optimize.png)

在调试工具里可以看到：name 可以访问，age 和 height 已经不可访问，说明它们被释放了。

## 写在最后

这一块笔记大概是整个进阶篇里最「原理」的部分：this 的规则是背下来就能用，渲染原理和执行上下文则属于「知道了会突然想通很多事」的类型——比如为什么 script 要加 defer、为什么闭包会占着内存不放。

下一篇是函数与对象的增强、面向对象和 ES5 的继承。
