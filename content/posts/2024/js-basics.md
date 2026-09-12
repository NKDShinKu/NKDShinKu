---
title: JavaScript 基础：2024 年的一份学习笔记
cover: https://img.nkdshinku.com/images/posts/js-basics.webp
description: 2024 年学前端时记下的 JavaScript 基础笔记：语言规范与基本语法、函数与对象、内置类、DOM 与事件、BOM、JSON。
date: 2024-05-11
category: 笔记
tags:
  - JavaScript
  - 前端基础
  - DOM
keywords:
  - JavaScript 基础
  - DOM 操作
  - 事件冒泡
  - BOM
  - 前端自学笔记
---

这篇也是 2024 年刚开始学前端时记下的，分量比 HTML 和 CSS 那两篇重得多——笔记本身就把大纲写成了三块：ECMAScript 语法、DOM、BOM，后面还补了 JSON。

写这篇的时候我已经知道「Web 三件套」里的 JS 才是重头戏，所以记得格外细，连 `arguments`、`this` 指向、事件冒泡这些都没放过。现在回看，这些依然最容易被问到、也最容易被自己忘掉。

内容还是基础中的基础，留个档。

## 编写方式与注意事项

### 三种编写位置

- 行内写在 HTML 标签上（不推荐）。
- 写在 `<script>` 标签里。
- 写成外部 `.js` 文件，通过 `<script>` 的 `src` 属性引入。

### noscript 元素

`<noscript></noscript>` 用于给不支持（或被关闭）JavaScript 的浏览器提供替代内容。

### 四条注意事项

1. `<script>` 不能写成单标签。外链引入 JS 文件时，标签里不能再写代码，也不能写成 `<script src="index.js" />`。
2. 可以省略 `type`。以前要写 `type="text/javascript"`，现在不用了，JavaScript 是所有现代浏览器和 HTML5 的默认脚本语言。
3. 加载顺序。作为 HTML 文档的一部分，JS 默认遵循自上而下的加载顺序。
4. JS 严格区分大小写，这一点和 HTML 元素、CSS 属性都不一样。

### 浏览器交互方式

```js
alert("Hello World"); // 弹窗
console.log("Hello World"); // 输出到控制台
document.write("Hello World"); // 写进页面

var result = prompt("请输入你的名字: "); // 接收用户输入
alert("您刚才输入的内容是:" + result);
```

## 基本语法

### 变量命名方法

用 `var` 关键字声明变量（variable 的缩写），后续还有 ES6 的 `let` 和 `const`。

```js
var name = "genshin";
```

### 常见的数据类型

JavaScript 是动态类型语言，常见类型有八个：

1. **Number**：整数或浮点数。支持加减乘除等运算，还包括两个特殊值——`Infinity`（无穷大，比如 `1/0`）和 `NaN`（代表一个计算错误，比如字符串和数字相乘）。字面量可以写十进制、十六进制（`0x`）、二进制（`0b`）、八进制（`0o`）。
   - 最小正数值 `Number.MIN_VALUE` 是 `5e-324`，比它小的数会被转成 0；最大正数值 `Number.MAX_VALUE` 是 `1.7976931348623157e+308`。
   - `isNaN` 用来判断「是不是不是一个数字」：不是数字返回 `true`，是数字返回 `false`。
2. **String**：字符串，可以包含 0 个或多个字符，所以没有单独的单字符类型。字符串要用双引号、单引号或反引号包起来，前后符号一致；转义字符用 `\`；拼接用 `+`，或者用反引号和 `${变量/表达式}`；长度用 `name.length`。
3. **Boolean**：`true` 和 `false`。
4. **Undefined**：只有一个值 `undefined` 的独立类型，用于未初始化的值。变量定义时最好直接初始化；不要显式把变量赋值为 `undefined`，刚开始什么都没有时可以初始化为 0、空字符串或 `null`。
5. **Null**：只有一个值 `null` 的独立类型，通常表示一个对象为空，所以对象初始化时常赋 `null`。
6. **Object**：用于更复杂的数据结构。其他类型通常称为「原始类型」，因为它们的值只包含一个单独的内容；对象往往表示一组数据的集合，用花括号 `{}` 表示。

```js
var person = {
  name: "why",
  age: 18,
  height: 1.88,
};
```

7. **BigInt**：用于任意长度的整数。
8. **Symbol**：用于唯一的标识符。

### typeof 操作符

- 作用：确定任意变量的数据类型。
- 用法：`typeof(x)` 或 `typeof x`。
- 注意：typeof 是一个操作符，不是函数，`()` 只是把后面的内容当成一个整体。

### 数据类型的转换

**转成 String**

- 隐式转换：和其他类型做 `+` 运算，左右两边有一个是字符串，另一边就会自动转成字符串再拼接。

```js
var num1Str = num1 + "";
```

- 显式转换：调用 `String()` 函数，或者调用 `toString()` 方法。

```js
var num1Str2 = String(num1);
```

**转成 Number**

- 隐式转换：算术运算中通常会把其他类型转成数字再计算，比如 `"6" / "2"` 得到 3。
- 显式转换：使用 `Number()` 函数。

```js
console.log(Number(undefined)); // NaN
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number("abc123")); // NaN
console.log(Number("    123    ")); // 123
console.log(Number("")); // 0
```

**转成 Boolean**

- 调用 `Boolean(value)`。
- 直观上为「空」的值（`0`、空字符串、`null`、`undefined`、`NaN`）会变成 `false`，其他值都是 `true`。

### 运算符

- 算术运算符：`+` `-` `*` `/` `%` `**`，分别是加、减、乘、除（有小数）、取余、求幂。
- 赋值运算符：`=`；支持链式赋值（`var a = b = c = 2 + 3`）；原地修改有 `+=` `-=` `*=` `/=` `%=` `**=`。
- 自增自减：`a++`、`++a`。注意 `5++`、`++5` 这种写法会报错，因为自增只能作用于变量。
- 比较运算符：`>` `<` `>=` `<=` `==` `!=`。
  - `==` 两侧的值会先被转成数字再比较，空字符串和 `false` 也不例外（都转成 0）。
  - `===` 比较时不做任何类型转换。
  - `!=` 和 `!==` 同理。

### 分支语句

**if 分支**

- 单分支 `if...`；多分支 `if...else...`、`if...else if...else`。
- `if(...)` 会计算括号里的表达式并转成布尔值：`0`、`""`、`null`、`undefined`、`NaN` 都会转成 `false`，其他值都是 `true`。

**三元运算符**

```js
var result = condition ? value1 : value2;
```

常用场景是赋默认值，防止外来变量是 `undefined`：

```js
var info = { name: "why" };
var obj = info ? info : {};
console.log(obj); // why
```

**逻辑运算符**

- `||`（或）：从左到右依次计算，每个操作数都先转成布尔值；遇到第一个真值就停止并返回它的初始值，如果全是假值，就返回最后一个操作数。
  - 记住一句话：或运算返回第一个真值，没有真值就返回最后一个值；返回的是操作数的初始形式，不会被转成布尔类型。

```js
var info = "abc";
var obj = { name: "why" };
var message = info || obj || "我是默认值";
console.log(message.length); // abc
```

- `&&`（与）：同样从左到右，遇到第一个假值就停止并返回它的初始值，全是真值则返回最后一个。
  - 一句话：与运算返回第一个假值，没有假值就返回最后一个值。

```js
obj && obj.friend && obj.friend.eating && obj.friend.eating();
```

- `!`（非）：先把操作数转成布尔类型，再返回相反的值。两个非运算 `!!` 常用来把某个值转成布尔类型。

**switch 语句**

```js
var btnIndex = 0;
switch (btnIndex) {
  case 0:
    console.log("点击了上一首");
    break;
  case 1:
    console.log("点击了播放/暂停");
    break;
  case 2:
    console.log("点击了下一首");
    break;
  default:
    console.log("当前按钮的索引有问题~");
    break;
}
```

- case 穿透：一条 case 语句结束后，会自动执行下一个 case 的语句。
- `break` 关键字用来解决穿透问题，在每个 case 的代码块后加上它。
- 注意：这里的相等是严格相等，被比较的值必须类型也相同才能匹配。

### 循环

- `while` 循环、`do...while` 循环、`for` 循环。
- `break` 跳出循环，`continue` 立刻进入下一次循环。

## 函数

### 定义与调用

```js
function 函数名(形参) {
  // 函数封装的代码
}

函数名(实参);
```

### 形参和实参

- 形参（parameter）：定义函数时小括号里的参数，在函数内部当变量用。
- 实参（argument）：调用函数时小括号里的参数，用来把数据传进函数内部。

### 返回值

- 用 `return` 返回结果。
- 一旦执行 return，当前函数就会终止。
- 没有 return 语句，函数的默认返回值是 `undefined`；return 后面没有值，返回值同样是 `undefined`。

### arguments 对象

- 所有非箭头函数里都可以使用的局部变量。
- 里面按顺序存放着调用者传入的所有实参，从 0 开始。
- 类型是 object（array-like），不是数组，但用法看起来很像。
- 调用者传入的参数多于函数接收的参数时，可以用它把多出来的参数都取到。

```js
function sum() {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
console.log(sum(10, 20)); // 30
console.log(sum(10, 20, 30, 40)); // 100
```

### 递归

函数自己调用自己：

```js
function pow(x, n) {
  if (n === 1) return x;
  return x * pow(x, n - 1);
}
```

### 局部变量与全局变量

- 局部变量：函数内定义，只有函数内部能访问。
- 全局变量：函数外、script 内定义，在任何函数中都可见。
- 访问变量时优先找自己函数里的，找不到再往外找，都没有就报错。
- 用 `var` 声明的全局变量，会在 window 对象上添加一个同名属性。

### 作用域

1. 变量能在哪个范围内使用，这个范围就叫它的作用域（scope）。
2. ES5 之前没有块级作用域，`var` 定义的变量没有块级作用域，比如 for 循环的代码块也没有自己的作用域——在 for 里用 `var` 定义的变量，for 外面照样能访问。
3. ES5 之前只有函数代码块会形成自己的作用域。

### 函数表达式

不管函数怎么创建，它本身都是一个值，类型是对象。

```js
var bar = function () {
  // 省略函数名
  console.log("bar 函数被执行了~");
};
```

### 函数声明与函数表达式

- 函数声明：在主代码流中声明为单独语句的函数。它在被定义之前就可以调用——JS 准备运行脚本时会先找出全局函数声明并创建它们。
- 函数表达式：在表达式或其他语法结构中创建的函数，代码执行到它时才被创建，从那一刻起可用。

### 头等公民

函数可以：赋值给变量、在变量之间传递、作为另一个函数的参数、作为另一个函数的返回值、存进其他数据结构。

```js
var foo1 = function () {
  console.log("foo1 函数被执行~");
};

var foo2 = foo1;
foo2();

function bar(fn) {
  fn();
}
bar(foo1);

function sayHello() {
  function hi() {
    console.log("hi kobe");
  }
  return hi;
}
var fn = sayHello();
fn();
```

### 回调函数与匿名函数

```js
function foo(fn) {
  // 通过 fn 调用 bar，这个过程叫函数的回调
  fn();
}
function bar() {
  console.log("bar 函数被执行了~");
}
foo(bar);
```

- 高阶函数：接受一个或多个函数作为输入，或者输出一个函数。
- 匿名函数：传入函数时没有指定名字，也没有通过函数表达式指定对应的变量。

```js
request("url", function (res) {
  console.log("拿到结果:", res);
});
```

### 立即执行函数

- 函数定义完后立即执行。前半部分是定义了一个匿名函数（有自己的独立作用域），后面的 `()` 表示执行它。
- 作用：创建一个独立的执行上下文环境，避免外部访问或修改内部的变量。

```js
(function () {
  console.log("立即执行函数被调用~");
})();

// 其他写法（了解）
(function (fn) {
  console.log("立即执行函数被调用");
})();

+(function foo() {})();
```

## 对象

### 什么是对象

把现实世界抽象成对象，比如一辆车（属性：颜色、重量；方法：行驶）。对象用 `{...}` 创建，里面是键值对：`key` 是字符串类型（ES6 之后可以是 Symbol），`value` 可以是任意类型。

### 创建方法

```js
// 1. 对象字面量
var obj1 = { name: "why" };

// 2. new Object() 后动态添加属性
var obj2 = new Object();
obj2.name = "kobe";

// 3. new 其他类
function Person() {}
var obj3 = new Person();
```

### 对象操作

- 访问属性：用 `.` 或 `[]`。
- 修改属性：直接改。
- 添加属性：直接加。
- 删除属性：用 `delete` 操作符。

```js
var info = {
  name: "why",
  age: 18,
  friend: { name: "kobe", age: 30 },
  running: function () {
    console.log("running~");
  },
};

// 访问
console.log(info.name);
console.log(info.friend.name);
info.running();

// 修改
info.age = 25;

// 添加
info.height = 1.88;
info.studying = function () {
  console.log("I am studying~");
};

// 删除
delete info.age;
delete info.height;
```

### 方括号

属性名里有空格之类的特殊字符时，只能用方括号访问：

```js
info["my friend"];
```

### 对象的遍历

`Object.keys(对象)` 会返回一个由对象自身可枚举属性组成的数组。

```js
var infoKeys = Object.keys(info);
for (var i = 0; i < infoKeys.length; i++) {
  var key = infoKeys[i];
  console.log(`key: ${key}, value: ${info[key]}`);
}

// for in
for (var key in info) {
  console.log(`key: ${key}, value: ${info[key]}`);
}
```

### 栈内存和堆内存

- 原始类型占据的空间在栈内存中分配，也叫值类型。
- 对象类型占据的空间在堆内存中分配，也叫引用类型。

### this 指针

- 普通函数被默认调用时，this 指向 window。
- 函数被某个对象引用并调用时，this 指向那个对象。

目前掌握两个判断方法：全局环境下 this 指向 window；通过对象调用，this 指向调用的对象。

### 工厂函数

封装一个函数来帮我们创建对象，创建出来的是 object 类型。

```js
function createStudent(name, age, height) {
  var stu = {};
  stu.name = name;
  stu.age = age;
  stu.height = height;
  stu.running = function () {
    console.log("running~");
  };
  return stu;
}
var stu1 = createStudent("why", 18, 1.88);
```

### 构造函数（类）

- 用一个函数帮我们创建对象，创建出来的是想要的类型（比如 student 类型，而不是 object 类型）。
- 普通函数被 `new` 操作符调用，这个函数就是构造函数，扮演的是类的角色。

```js
function Coder(name, age, height) {
  this.name = name;
  this.age = age;
  this.height = height;
  this.running = function () {
    console.log("running~");
  };
}
var stu1 = new Coder("why", 18, 1.88);
```

函数被 `new` 调用时会执行这几步：

1. 在内存中创建一个新的空对象；
2. 这个对象内部的 `[[prototype]]` 属性被赋值为构造函数的 `prototype` 属性（后面细讲）；
3. 构造函数内部的 this 指向这个新对象；
4. 执行函数体代码；
5. 如果构造函数没有返回非空对象，就返回创建出来的新对象。

## 内置类

### 原始类型的包装类

原始类型不是对象，按理没法获取属性或调用方法，但：

```js
var str = "genshin";
console.log(str.length); // 7
```

这是因为 JS 为它们封装了对应的包装类型，也可以显式地写成：

```js
var str = new String("genshin");
```

常见的包装类型有 String、Number、Boolean、Symbol、BigInt；`null` 和 `undefined` 没有包装类。

### Number 类

- `Number.MAX_SAFE_INTEGER` / `Number.MIN_SAFE_INTEGER`：JS 中最大 / 最小的安全整数，即 `2^53 - 1`。
- `Number.toString(base)`：把数字转成字符串，并按 base 进制转换（2 到 36，默认 10）。直接对数字字面量操作时要注意写法，比如 `(10).toString(2)`。
- `Number.toFixed(digits)`：保留 digits 位小数（0 到 20）。
- `Number.parseInt(string[, radix])` / `Number.parseFloat(string)`：把字符串解析成整数 / 浮点数，也有对应的全局方法 `parseInt`、`parseFloat`。

### Math 对象

- `Math.PI`：圆周率，约等于 3.14159。
- `Math.floor`：向下取整；`Math.ceil`：向上取整；`Math.round`：四舍五入。
- `Math.random`：生成 0 到 1 的随机数（包含 0，不包含 1）。
- `Math.pow(x, y)`：返回 x 的 y 次幂，也可以用运算符 `**`。

### String 类

字符串不可修改。

- 访问字符：`str[0]`（没找到返回 `undefined`）、`str.charAt(pos)`（没找到返回空字符串）。
- `str.length`：长度。
- `str.toLowerCase()` / `str.toUpperCase()`：转小写 / 大写。
- `str.indexOf(searchValue[, fromIndex])`：从 fromIndex 开始查找，找不到返回 -1；`lastIndexOf` 从后往前找。
- `str.includes(searchString[, position])`：从 position 开始查找，返回 true / false。
- `str.startsWith(searchString[, position])` / `str.endsWith(searchString[, length])`：判断是否以某段字符串开头 / 结尾。
- `str.replace(substr, newSubstr)`：找到对应字符串并替换。
- 截取字符串：
  - `slice(start, end)`：从 start 到 end（不含 end），允许负值。
  - `substring(start, end)`：从 start 到 end（不含 end），负值代表 0。
  - `substr(start, length)`：从 start 开始取 length 长，允许 start 为负。
- `str.concat(str2[, ...strN])`：拼接字符串。
- `str.trim()`：删除首尾空白。
- `str.split([separator[, limit]])`：按 separator 分割（也可以是正则），limit 限制返回片段的数量。

### 数组 Array

数组和对象一样是保存多个数据的数据结构，区别是它有序。

```js
// 方法一
var names = ["why", "kobe", "james", "curry"];
var products = [
  { name: "鼠标", price: 98 },
  { name: "键盘", price: 100 },
  { name: "西瓜", price: 20 },
];

// 方法二
var arr1 = new Array();
var arr2 = new Array("abc", "cba", "nba");

console.log(names[0]); // 第一个元素
console.log(names[names.length - 1]); // 最后一个元素
```

- 访问元素：用中括号 `[]`，或者 `arr.at(i)`；`i` 为负数时从数组尾部访问，比如 `arr.at(-1)` 是最后一个元素。注意 `arr[-1]` 这种写法取不到元素（结果是 `undefined`），负数索引要用 `at`。
- 修改元素：`arr[0] = "genshin"`。
- 添加或删除：
  - 直接索引添加会有空元素，比如 `names[10] = "james"`，中间的位置会空出来。
  - `delete names[0]` 可以删除，但会留下空槽。
  - `push` / `pop`：末尾添加 / 删除。
  - `unshift` / `shift`：首端添加 / 取出，其他元素整体后移 / 前移。
- `splice(start, deleteCount, item)`：添加、删除、替换三合一。

```js
arr.splice(1, 1); // 删除位置 1 的元素
arr.splice(1, 0, "a", "b"); // 从位置 1 开始添加 2 个元素
arr.splice(1, 2, "a", "b"); // 从位置 1 开始替换 2 个元素
```

- `length` 属性：数组变化时自动更新；直接改 `arr.length`，变长会补空元素，变短会直接删掉多出来的元素。
- 遍历：

```js
for (var i = 0; i < names.length; i++) {
  console.log(names[i]);
}

for (var index in names) {
  // 遍历键
  console.log(index, names[index]);
}

for (var item of names) {
  // 遍历值
  console.log(item);
}
```

- 其他方法：
  - `arr.slice(start, end)`：截取数组。
  - `arr.concat(arr1, arr2...)`：拼接数组并返回。
  - `arr.join("字符")`：把数组元素连接成字符串，不填默认用逗号。
  - `arr.indexOf(x, s)` / `arr.includes(x, s)`：从 s 位置开始找 x。
  - `find` / `findIndex`：查找元素或元素索引。

```js
var stu = students.find(function (item) {
  if (item.id === 101) return true;
});
```

  - `sort([排序规则函数])`：排序，默认按字符串比较；它会原地排序并返回同一个数组。
  - `reverse()`：把数组元素位置颠倒。
- 高阶函数：
  - `forEach`：遍历数组，每个元素执行一次回调，没有返回值。
  - `map`：返回一个新数组，新数组由每个元素调用函数后的返回值组成。
  - `filter`：返回一个新数组，只包含调用函数返回 `true` 的元素。

```js
let arr = [1, 2, 3, 4, 5, 6];
arr = arr.filter((item) => item % 2 === 0); // [2, 4, 6]
```

  - `reduce`：把数组元素汇总成一个值。

```js
arr.reduce((sum, item) => sum + item, 0);
// 第二个参数 0 是初始值，会作为第一次调用的 sum
```

  - `every`：数组里每个元素都符合要求才返回 `true`。

```js
arr.every((item) => item.isFlag);
```

### 时间 Date

创建 Date 对象：

```js
new Date();
new Date(value);
new Date(dateString);
new Date(year, monthIndex[, day[, hours[, minutes[, seconds[, milliseconds]]]]]);
```

日期的表示方式有两种：RFC 2822 标准和 ISO 8601 标准。

```js
var date = new Date();
console.log(date); // RFC 2822 标准
console.log(date.toDateString());
console.log(date.toISOString()); // ISO 8601 标准
```

获取信息的方法：

- `getFullYear()`：年份（4 位）。
- `getMonth()`：月份，从 0 到 11。
- `getDate()`：当月的日期，从 1 到 31（名字有点迷）。
- `getHours()` / `getMinutes()` / `getSeconds()` / `getMilliseconds()`：时、分、秒、毫秒。
- `getDay()`：一周中的第几天，从 0（星期日）到 6（星期六）。

设置信息的方法：`setFullYear`、`setMonth`、`setDate`、`setHours`、`setMinutes`、`setSeconds`、`setMilliseconds`、`setTime`。

获取时间戳：

```js
new Date().getTime();
new Date().valueOf();
+new Date();
Date.now();
```

`Date.parse(str)` 可以从字符串中读取日期，并输出对应的 Unix 时间戳。

## DOM

### 什么是 DOM 和 BOM

- DOM：文档对象模型（Document Object Model），把页面所有内容表示为可以修改的对象。把 HTML 抽象成 DOM 对象时，它们会形成一个树结构，类型之间有继承关系。
- BOM：浏览器对象模型（Browser Object Model），由浏览器提供的、用于处理文档（document）之外所有内容的其他对象。

### document 对象

它是 DOM 的入口点，从 document 开始可以访问任何节点元素。

- `<html>` = `document.documentElement`
- `<body>` = `document.body`
- `<head>` = `document.head`
- `<!DOCTYPE html>` = `document.doctype`

### 节点之间的导航

拿到一个节点后，可以据此获取其他节点：

- 父节点：`parentNode`
- 前兄弟节点：`previousSibling`，后兄弟节点：`nextSibling`
- 子节点：`childNodes`
- 第一个子节点：`firstChild`，最后一个子节点：`lastChild`

### 元素之间的导航

拿到一个元素后，可以据此获取其他元素：

- 父元素：`parentElement`
- 前兄弟元素：`previousElementSibling`，后兄弟元素：`nextElementSibling`
- 子元素：`children`
- 第一个子元素：`firstElementChild`，最后一个子元素：`lastElementChild`

两套导航的区别在于：节点（Node）那一套包含文本节点、注释节点，元素（Element）那一套只包含元素。

### 表格元素的导航

- `<table>`：`table.rows` 是 `<tr>` 的集合；`table.caption` / `tHead` / `tFoot` 分别引用 `<caption>`、`<thead>`、`<tfoot>`；`table.tBodies` 是 `<tbody>` 的集合。
- `<thead>`、`<tfoot>`、`<tbody>`：提供 `rows` 属性，比如 `tbody.rows`。
- `<tr>`：`tr.cells` 是行内 `<td>` 和 `<th>` 的集合；`tr.sectionRowIndex` 是在所属 `<thead>` / `<tbody>` / `<tfoot>` 中的位置；`tr.rowIndex` 是在整个表格中的编号。
- `<td>` 和 `<th>`：`td.cellIndex` 是在所属 `<tr>` 中的编号。

### 表单元素的导航

- `<form>` 可以通过 `document.forms` 获取。
- 表单里的内容通过 `form.elements` 获取。
- 也可以给表单子元素设置 `name`，再用名字取。

### 获取 DOM 元素

- `querySelector` / `querySelectorAll`：通过选择器获取。
- `getElementById`：通过 id 获取。
- `getElementsByName`：通过表单 name 获取。
- `getElementsByTagName`：通过标签获取。
- `getElementsByClassName`：通过 class 获取。

### 节点的常见属性

- 节点类型（数字）：`nodeType`。

![nodeType 的取值对照](https://img.nkdshinku.com/images/posts/js-basics/node-type.png)

- 节点类型名称：`nodeName` 获取节点名字；`tagName` 获取标签名，只适用于元素节点。
- 节点数据：`data` / `nodeValue` 获取非元素节点的文本内容。
- `innerHTML`：获取元素内部的所有内容；`textContent`：只获取内部的文字内容；`outerHTML`：获取元素内部的所有内容加上自己。

### 元素的一些属性

**hidden**

全局属性，用于隐藏元素：

```js
box.hidden = true;
```

**attribute（元素的属性）**

- 分类：标准的 attribute（`id`、`class`、`href`、`type`、`value` 等）和非标准的 attribute（自定义的 `abc`、`age`、`height` 等）。
- 常用方法：`hasAttribute(name)` 检查是否存在、`getAttribute(name)` 获取值、`setAttribute(name, value)` 设置值、`removeAttribute(name)` 移除、`attributes` 拿到特性对象的集合。
- 特征：大小写不敏感；值总是字符串。

**property（节点中元素的属性）**

- 标准的 attribute 会在 DOM 对象上创建对应的 property，可以通过 `elem.property` 访问。
- property 和 attribute 操作会互相影响：改 property，用 attribute 读到的新值也跟着变，反之亦然。
- 大多数情况用 property 的方式设置和获取；只有 input 的 value 值习惯用 attribute 操作。

**class 与 style**

```js
elem.className; // class attribute 对应的 property 叫 className，不叫 class

elem.classList.add("cls"); // 添加类
elem.classList.remove("cls"); // 移除类
elem.classList.toggle("cls"); // 不存在就添加，存在就移除
elem.classList.contains("cls"); // 返回 true / false
```

- `classList` 是一个特殊的对象，可以用 for of 遍历。
- `style`：多词属性要用驼峰式（`background-color` 写成 `backgroundColor`）；把值设为空字符串会使用 CSS 的默认样式；要写多条样式可以用 `cssText`。

```js
boxEl.style.cssText = "font-size: 30px; color: red;";
```

- 内联样式可以通过 `style.` 读到；写在 CSS 文件里的样式要用 `getComputedStyle`。

```js
getComputedStyle(boxEl).fontSize;
```

- `data-自定义属性名`：通过 `dataset` 读取。

```html
<div id="abc" class="box" data-age="18" data-height="1.88"></div>

<script>
  var boxEl = document.querySelector(".box");
  console.log(boxEl.dataset.age);
  console.log(boxEl.dataset.height);
</script>
```

### 创建元素

- `document.write`：不利于处理复杂情况。
- 通过 `innerHTML` 手动添加。
- `document.createElement(tag)`：

```js
var h2El = document.createElement("h2");
h2El.className = "title";
h2El.classList.add("active");
h2El.textContent = "我是标题";
```

### 插入元素

- `node.append(...nodes or strings)`：在 node 末尾插入。
- `node.prepend(...)`：在 node 开头插入。
- `node.before(...)`：在 node 前面插入。
- `node.after(...)`：在 node 后面插入。
- `node.replaceWith(...)`：把 node 替换成给定的节点或字符串。

![append、prepend、before、after 等插入位置的示意](https://img.nkdshinku.com/images/posts/js-basics/node-insert.png)

### 移除与克隆

- 移除元素：调用元素本身的 `remove` 方法。
- 克隆元素：`elem.cloneNode(true/false)`，`true` 表示深度克隆，会连子元素一起克隆。

### 元素的大小与滚动

- `clientWidth` / `clientHeight`：content + padding（不包含滚动条）。
- `clientTop` / `clientLeft`：上 / 左边框的宽度。
- `offsetWidth` / `offsetHeight`：元素完整的宽度 / 高度。
- `offsetLeft` / `offsetTop`：距离父元素的 x / y。
- `scrollHeight`：整个可滚动区域的高度。
- `scrollTop`：已经滚动部分的高度。

### window 的大小与滚动

- `innerWidth` / `innerHeight`：window 窗口的宽高（包含滚动条）。
- `outerWidth` / `outerHeight`：整个窗口的宽高（包括调试工具、工具栏）。
- `documentElement.clientWidth` / `clientHeight`：html 的宽高（不包含滚动条）。
- `scrollX` / `scrollY`：X / Y 轴滚动的位置（别名是 `pageXOffset` / `pageYOffset`）。
- `scrollBy(x, y)`：相对当前位置滚动；`scrollTo(pageX, pageY)`：滚动到绝对坐标。

### 事件的监听方式

- 在 script 中直接监听（很少用）。
- 通过元素的 `on` 属性监听，比如 `onclick`。
- 通过 EventTarget 的 `addEventListener` 监听（推荐）。

```html
<button onclick="console.log('按钮1发生了点击~');">按钮1</button>

<script>
  box.onclick = function () {
    console.log("box 发生了点击~");
  };

  btn.addEventListener("click", function () {
    console.log("btn 的事件监听~");
  });
</script>
```

### 常见的事件类型

- 鼠标事件：`click`、`mouseover` / `mouseout`、`mousedown` / `mouseup`、`mousemove`。
- 键盘事件：`keydown` / `keyup`。
- 表单事件：`submit`、`focus`。
- Document 事件：`DOMContentLoaded`。
- CSS 事件：`transitionend`。

### 事件冒泡与事件捕获

点击一个元素时，点击的不仅仅是这个元素本身：默认情况下事件从最内层向外依次传递，这个顺序叫事件冒泡；反过来从外层到内层（body → span）叫事件捕获。

```js
element.addEventListener("事件", function () {}, true); // 第三个参数 true 表示捕获阶段
```

### 事件对象

事件发生时，浏览器会创建一个 Event 对象，把它作为参数传给处理函数。

常见属性：

- `type`：事件类型。
- `target`：当前事件发生的元素。
- `currentTarget`：当前处理事件的元素。
- `eventPhase`：事件所处的阶段。
- `offsetX` / `offsetY`：事件在元素内的位置。
- `clientX` / `clientY`：事件在客户端内的位置。
- `pageX` / `pageY`：事件相对于 document 的位置。
- `screenX` / `screenY`：事件相对于屏幕的位置。

常见方法：

- `preventDefault()`：取消事件的默认行为。
- `stopPropagation()`：阻止事件进一步传递（冒泡和捕获都能阻止）。

在事件处理函数里，`this` 指向当前绑定事件的元素。

### EventTarget

- 所有节点、元素都继承自 EventTarget，Window 也是。
- EventTarget 是一个 DOM 接口，主要用于添加、删除、派发事件。
- 常见方法：`addEventListener`（注册事件类型和处理函数）、`removeEventListener`（移除）、`dispatchEvent`（派发事件）。

### 事件委托

事件冒泡衍生出的模式：子元素被点击时，父元素可以通过冒泡监听到；再通过 `event.target` 拿到真正被点的元素。

比如一个 ul 里放着多个 li，点击某个 li 让它变红：可以给每个 li 都加监听，也可以只在 ul 上监听一次，再通过 `event.target` 处理对应的 li——后者就是事件委托。

### 鼠标事件

- `click`：点击。
- `contextmenu`：右键打开上下文菜单时触发。
- `dblclick`：双击。
- `mousedown` / `mouseup`：按下 / 松开鼠标按钮。
- `mousemove`：鼠标移动。
- `mouseover` / `mouseout`：鼠标移入 / 移出（支持冒泡）。
- `mouseenter` / `mouseleave`：鼠标移入 / 移出（不支持冒泡）。
  - `mouseenter` / `mouseleave` 进入子元素时没有任何反应，因为子元素依然在该元素内。
  - `mouseover` / `mouseout` 进入子元素时会先触发父元素的 `mouseout`，再触发子元素的 `mouseover`，并且因为支持冒泡会继续传到父元素。

### 键盘事件

- `keydown`、`keypress`、`keyup`，执行顺序也是这个顺序（`keypress` 已经废弃，了解即可）。
- 通过 `key` 和 `code` 区分按下的键：`code` 是按键代码（`"KeyA"`、`"ArrowLeft"`），对应键盘上的物理位置；`key` 是字符（`"A"`、`"a"`），非字符按键通常和 code 的值相同。

### 表单事件

- `change`：表单元素的内容改变时触发。
- `input`：元素获取用户输入时触发。
- `focus` / `blur`：获得 / 失去焦点时触发。
- `reset` / `submit`：表单重置 / 提交时触发。

### 文档加载事件

- `DOMContentLoaded`：浏览器已完全加载 HTML 并构建了 DOM 树，但 `<img>` 和样式表之类的外部资源可能还没加载完。
- `load`：不仅 HTML 加载完成，所有外部资源也加载完成。

## BOM

BOM 由浏览器提供，用来处理 document 之外的内容，可以看作 JS 脚本与浏览器窗口之间的桥梁，比如 `navigator`、`location`、`history`、`screen` 这些对象。

### window

- 包含大量属性：`localStorage`、`console`、`location`、`history`、`scrollX` 等。
- 包含大量方法：`alert`、`close`、`scrollTo`、`open` 等。
- 包含大量事件：`focus`、`blur`、`load`、`hashchange` 等。
- 还从 EventTarget 继承了 `addEventListener`、`removeEventListener`、`dispatchEvent`。

### location

常见属性：

- `href`：当前窗口对应的完整 URL。
- `protocol`：协议。
- `host`：主机地址（带端口）；`hostname`：主机地址（不带端口）。
- `port`：端口。
- `pathname`：路径。
- `search`：查询字符串。
- `hash`：哈希值。
- `username` / `password`：URL 中的用户名和密码，很多浏览器已经禁用。

常见方法：

- `assign`：赋值一个新 URL 并跳转。
- `replace`：跳转到新 URL，但不会在浏览记录里留下之前的记录。
- `reload`：重新加载页面，可以传一个布尔值。

URLSearchParams 可以把字符串和参数对象互相转换，常见方法有 `get`（取值）、`set`（设置）、`append`（追加）、`has`（判断是否存在）。

### history

history 对象用来访问浏览器曾经的会话历史记录。

- 属性：`length`（会话中的记录条数）、`state`（当前保留的状态值）。
- 方法：`back()`（返回上一页，等价于 `go(-1)`）、`forward()`（前进下一页，等价于 `go(1)`）、`go()`（加载历史中的某一页）、`pushState()`（改变地址栏并压入一条历史记录，不会真的加载页面）、`replaceState()`（同上，但替换当前记录）。

## JSON

### JSON 顶层支持的三种值

- 简单值：数字、字符串（不支持单引号）、布尔类型、`null`。
- 对象值：由 key、value 组成，key 必须是字符串且要加双引号，值可以是简单值、对象值、数组值。
- 数组值：值可以是简单值、对象值、数组值。

### 序列化

- `JSON.stringify()`：把 JavaScript 类型转成对应的 JSON 字符串。
- `JSON.parse()`：解析 JSON 字符串，转回对应的 JavaScript 类型。

## 写在最后

这份笔记是 2024 年学 JavaScript 基础时整理的，来源包括 MDN 之类的官方文档和当时看的教程视频。这一篇记的内容最多，也最杂：语法部分看着简单，真正花时间的是 `this`、作用域和事件流这些「规则类」的东西。

现在回看，JS 基础最值得反复确认的其实不是 API 记不记得住，而是几个判断标准——`==` 和 `===` 什么时候结果不同、`this` 到底指向谁、事件到底是冒泡还是捕获。这些东西后来写框架代码时也一直在用。

下一篇是 JavaScript 进阶，讲原型、Promise、迭代器和异步这些。
