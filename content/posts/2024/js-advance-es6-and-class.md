---
title: JavaScript 进阶 3：ES6 继承与新特性
cover: https://img.nkdshinku.com/images/posts/js-advance-3.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：class 与继承、手写 apply/call/bind、ES6 的字面量增强、解构、let/const、模板字符串、Symbol、Set/Map，以及 ES7 到 ES13 的新特性。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - ES6
keywords:
  - ES6 新特性
  - class 继承
  - 手写 call apply bind
  - Set 与 Map
  - 前端自学笔记
---

JavaScript 进阶笔记的第 3 篇：ES6 的 class 与继承、手写 apply/call/bind，以及从 ES6 一路排到 ES13 的新特性。

这一段大概是「成就感」最强的一节——手写 call/apply/bind 跟着敲完，才算真的明白 this 的显式绑定是怎么实现的。

## ES6 中的继承

### class 对象

- ES6（ECMAScript 2015）开始可以用 `class` 关键字直接定义类。
- 但类本质上依然是构造函数和原型链的语法糖。
- 声明方式有两种：类声明和类表达式。

```js
class Person {} // 类声明
var Student = class {}; // 类表达式
```

类和 ES5 构造函数的异同：

- 特性其实是一致的；
- 类不能作为普通函数调用，构造函数可以。

```js
class Person {}
Person(); // 报错
```

类的构造函数：

- 每个类都可以有自己的构造函数，方法名固定为 `constructor`；
- 通过 `new` 操作一个类时，会调用它；
- 每个类只能有一个构造函数，写多个会抛异常。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

用 `new` 操作类时，`constructor` 会执行如下操作：

1. 在内存中创建一个新的空对象；
2. 这个对象内部的 `[[prototype]]` 属性被赋值为该类的 `prototype` 属性；
3. 构造函数内部的 this 指向这个新对象；
4. 执行构造函数内部代码；
5. 如果构造函数没有返回非空对象，就返回创建出来的新对象。

类的实例方法：直接写在类里的属性会放到 this 上（即创建出来的新对象里），而实例方法希望被多个实例共享，所以要放到原型上——写法就是方法名加大括号：

```js
class Person {
  running() {
    console.log("running~");
  }
}
```

类的静态方法：用 `static` 关键字定义，通常用于直接通过类执行、不需要实例的方法。

```js
class Person {
  constructor(age) {
    this.age = age;
  }
  static create() {
    return new this(Math.floor(Math.random() * 100));
  }
}
```

类的访问器方法（对象也可以这样定义）：即 `get` 和 `set`，分别是获取属性时和设置属性时执行的函数。

```js
class Person {
  // 约定：以 _ 开头的属性和方法不在外界访问
  constructor(name) {
    this._name = name;
  }

  set name(value) {
    console.log("设置 name");
    this._name = value;
  }

  get name() {
    console.log("获取 name");
    return this._name;
  }
}

var p1 = new Person("why");
p1.name = "kobe"; // 默认调用 set
console.log(p1.name); // 默认调用 get
```

### 类的继承

**extends**（继承方法）：

```js
class Person {}
class Student extends Person {} // 实现（方法）继承
```

**super**（可以继承属性）：

- 使用位置有三个：子类的构造函数、实例方法、静态方法；
- 在子类的构造函数中使用 this 或者返回默认对象之前，必须先通过 super 调用父类的构造函数。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  eating() {
    console.log("eating~");
  }
  static sleep() {
    console.log("sleep~");
  }
}

class Student extends Person {
  constructor(name, age, sno, score) {
    super(name, age); // 继承父类的属性
    this.sno = sno;
    this.score = score;
  }
  eating() {
    // 重写：保留父类方法，并新增功能
    console.log("学校食堂");
    super.eating(); // 调用父类的方法
  }
  static sleep() {
    console.log("学校寝室");
    super.sleep();
  }
}
```

继承内置类——一般是想给内置类添加新功能：

```js
// ES6：继承出新类再添加方法
class HYArray extends Array {
  get lastItem() {
    return this[this.length - 1];
  }
}

// ES5：直接在原型上添加方法
Array.prototype.lastItem = function () {
  return this[this.length - 1];
};
```

实现多继承（类的混入 mixin）——JavaScript 只支持单继承，多继承要靠混入：

```js
function mixinAnimal(BaseClass) {
  return class extends BaseClass {
    running() {
      console.log("running~");
    }
  };
}

function mixinRunner(BaseClass) {
  return class extends BaseClass {
    flying() {
      console.log("flying~");
    }
  };
}

class NewBird extends mixinRunner(mixinAnimal(Bird)) {}

var bird = new NewBird();
bird.flying();
bird.running();
bird.eating();
```

## 手写 apply / call / bind

思路都是一样的：把函数临时挂到目标对象上，通过「对象调用方法」触发隐式绑定，再把临时属性删掉。

### 手写 apply

```js
Function.prototype.hyapply = function (thisArg, otherArgs) {
  // 确保 thisArg 是对象类型
  thisArg = thisArg === null || thisArg === undefined ? window : Object(thisArg);

  Object.defineProperty(thisArg, "fn", {
    enumerable: false,
    configurable: true,
    value: this,
  });

  thisArg.fn(...otherArgs);

  delete thisArg.fn;
};
```

### 手写 call

```js
Function.prototype.hycall = function (thisArg, ...otherArgs) {
  thisArg = thisArg === null || thisArg === undefined ? window : Object(thisArg);

  Object.defineProperty(thisArg, "fn", {
    enumerable: false,
    configurable: true,
    value: this,
  });

  thisArg.fn(...otherArgs);

  delete thisArg.fn;
};
```

### 封装 call 和 apply

```js
Function.prototype.hyexec = function (thisArg, otherArgs) {
  thisArg = thisArg === null || thisArg === undefined ? window : Object(thisArg);

  Object.defineProperty(thisArg, "fn", {
    enumerable: false,
    configurable: true,
    value: this,
  });

  thisArg.fn(...otherArgs);

  delete thisArg.fn;
};

Function.prototype.hyapply = function (thisArg, otherArgs) {
  this.hyexec(thisArg, otherArgs);
};

Function.prototype.hycall = function (thisArg, ...otherArgs) {
  this.hyexec(thisArg, otherArgs);
};
```

### 手写 bind

bind 与 call/apply 的区别是：它不立即执行，而是返回一个绑定了 this 的新函数。

```js
Function.prototype.hybind = function (thisArg, ...otherArgs) {
  thisArg = thisArg === null || thisArg === undefined ? window : Object(thisArg);

  Object.defineProperty(thisArg, "fn", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: this,
  });

  return (...newArgs) => {
    var allArgs = [...otherArgs, ...newArgs];
    thisArg.fn(...allArgs);
  };
};
```

## ES6 新特性

### 对象字面量简写

包含三类增强：属性增强、方法增强、计算属性名。

```js
var name = "why";
var age = 18;
var key = "address" + " city";

var obj = {
  // 1. 属性增强
  name, // 相当于 name: name
  age, // 相当于 age: age

  // 2. 方法增强
  swimming() {}, // 相当于 swimming: function() {}

  // 3. 计算属性名
  [key]: "广州",
};
```

### 解构 Destructuring

数组的解构：

```js
var names = ["abc", "cba", undefined, "nba", "mba"];

var [name1, name2, name3] = names; // abc cba undefined
var [name1, , name2] = names; // abc undefined
var [name1, name2, ...newNames] = names; // abc cba [undefined, nba, mba]
var [name1, name2, name3 = "default"] = names; // abc cba default
```

对象的解构（没有顺序，按 key 解构）：

```js
var obj = { name: "why", age: 18, height: 1.88 };

// 重命名
var { height: wHeight, name: wName, age: wAge } = obj;

// 默认值
var { name: wName2, age: wAge2, address: wAddress = "中国" } = obj;

// 剩余内容
var { name, age, ...newObj } = obj;
```

### 新的 ECMA 代码执行描述

ES5 中的描述：

- 执行上下文栈（Execution Context Stack）：用于执行上下文的栈结构；
- 执行上下文（Execution Context）：代码执行前会先创建对应的执行上下文；
- 变量对象（Variable Object）：上下文关联的 VO 对象，用于记录函数和变量声明；
- 全局对象（Global Object）：全局执行上下文关联的 VO 对象；
- 激活对象（Activation Object）：函数执行上下文关联的 VO 对象；
- 作用域链（scope chain）：用于关联指向上下文的变量查找。

基本思路是相同的，只是词汇描述变了：执行上下文栈和执行上下文没有变。

**词法环境（Lexical Environments）**：一种规范类型，用于在词法嵌套结构中定义关联的变量、函数等标识符。

- 一个词法环境由环境记录（Environment Record）和一个外部词法环境（outer Lexical Environment）组成；
- 词法环境常用来关联函数声明、代码块语句、try-catch 语句，代码执行时被创建出来；
- 词法环境又分为 `LexicalEnvironment` 和 `VariableEnvironment`：前者处理 `let`、`const` 声明的标识符，后者处理 `var`、`function` 声明的标识符。

**环境记录（Environment Record）**：规范中有两种主要的环境记录值——声明式环境记录和对象式环境记录（全局环境记录一般分为这两个）。

- 声明式环境记录：用于定义函数声明、变量声明，以及把标识符绑定到语言值上的 catch 子句；
- 对象式环境记录：用于定义 WithStatement 这类元素的效果，把标识符绑定与对象的属性关联起来。

![词法环境与新特性的内存图](https://img.nkdshinku.com/images/posts/js-advance-3/lexical-environment.png)

### let 和 const

- `let`：直观上和 `var` 没有太大区别，都是声明一个变量。
- `const`：constant 的缩写，表示常量。保存的数据一旦被赋值就不能被修改；但如果赋值的是引用类型，可以通过引用找到对象并修改对象的内容。

注意：`let`、`const` 不允许重复声明变量。

**暂时性死区（TDZ）**：在 `let`、`const` 定义的标识符真正执行到声明代码之前，是不能被访问的。从块作用域的顶部一直到变量声明完成之前，这个变量都处在暂时性死区。

用「temporal」这个词，是因为这个区域取决于执行顺序（时间），而不是编写代码的位置。

```js
console.log(message); // 报错，这里是 TDZ

function foo() {
  console.log(message);
}
let message = "hello world";
foo(); // 打印成功，说明和位置没关系，取决于执行顺序
```

**作用域提升**：

- `var` 声明的变量会进行作用域提升；
- `let` 声明的变量在声明之前访问会报错；
- `let`、`const` 没有进行作用域提升，但在解析阶段就被创建出来了，只是不能访问而已。

**window 对象添加属性**：

- 全局用 `var` 声明变量，会在 window 上添加一个属性，放在全局环境记录的对象式 window 上；
- `let`、`const` 不会给 window 添加任何属性，它们放在声明式环境记录中。

**块级作用域**：

- ES5 及之前只有全局和函数会形成自己的作用域；
- ES6 新增了块级作用域，通过 `let`、`const`、`function`、`class` 声明的标识符都受块级作用域限制；
- 但函数虽然拥有块级作用域，外面却依然可以访问——这是因为引擎对函数声明做了特殊处理，允许像 `var` 那样提升。

```js
{
  var message = "Hello World";
  let age = 18;
  const height = 1.88;
  class Person {}
  function foo() {
    console.log("foo function");
  }
}

console.log(age); // 报错
console.log(height); // 报错
new Person(); // 报错
foo(); // 可以访问
```

### 模板字符串

ES6 允许用模板字符串嵌入变量或表达式：

- 用反引号 `` ` `` 编写；
- 用 `${expression}` 嵌入动态内容。

```js
const name = "why";
const age = 18;
const info = `my name is ${name}, age is ${age}`;
```

**标签模板字符串**：调用函数时使用模板字符串，并在其中插入变量。

- 模板字符串会被拆分；
- 第一个参数是数组，由被拆分的字符串片段组成；
- 后面的参数是每个插入的内容。

```js
function foo(...args) {
  console.log("参数:", args);
}

foo`my name is ${name} age is ${age}`;
// [['my name is ', ' age is ', ''], 'why', 18]
```

### 默认参数

- 不严谨的写法：`arg1 = arg1 ? arg1 : "默认值"` 或 `arg1 = arg1 || "默认值"`，输入 `false`、`0`、`""` 时也会走默认值。
- 严格判断：`arg1 = arg1 === undefined || arg1 === null ? "默认值" : arg1`。
- ES6 之后可以用空值合并运算符：`arg1 = arg1 ?? "默认值"`，结果和上一条一样。
- ES6 的函数默认值：只有遇到 `undefined` 才会使用默认值。

```js
function foo(arg1 = "默认值", arg2 = "默认值") {
  console.log(arg1, arg2);
}
```

搭配解构：

```js
function foo1({ name, age } = { name: "why", age: 18 }) {
  console.log(name, age);
}

function foo2({ name = "why", age = 18 } = {}) {
  console.log(name, age);
}
```

注意事项：

1. 有默认参数的形参尽量写到后面；
2. 有默认参数的形参不计算在 `length` 之内，并且它后面所有的参数都不计算在内；
3. 剩余参数也要放到后面（默认参数放在剩余参数前面）。

```js
function foo(age, name = "why", ...args) {
  console.log(name, age, args);
}
console.log(foo.length); // 1
```

### 剩余参数

`...args`，前面已经提过：收集没有对应形参的实参，类型是真正的数组。

### 展开语法

展开运算符 `...` 可以在函数调用、数组构造时把数组表达式或字符串展开，也可以在构造对象字面量时把对象按 key-value 展开（对象展开是 ES2018 加入的）。

```js
// 数组构造
const names = ["abc", "cba", "nba", "mba"];
const newNames = [...names, "aaa", "bbb"];

// 函数调用
function foo(name1, name2, ...args) {
  console.log(name1, name2, args);
}
foo(...nums);

// 构建对象
const info = { ...obj, height: 1.88, address: "广州市" };
```

注意：展开运算符是一种浅拷贝——拷贝内容里的对象时，只会拷贝地址。

### Symbol 使用

为什么需要 Symbol：

- ES6 之前对象的属性名都是字符串，很容易造成属性名冲突；
- 比如往一个已有的对象里添加属性，不确定它内部有什么，就可能覆盖掉原有属性；
- 比如手写 apply/call/bind 时临时加的 `fn` 属性，如果对象里本来就有 `fn`，就会被覆盖；
- 比如混入时出现同名属性，必然有一个被覆盖。

Symbol 用来生成一个独一无二的值，可以作为属性名。即使多次创建，每次的值也是不同的。

```js
const s1 = Symbol();
const s2 = Symbol();

const obj = { [s1]: "aaa" };
obj[s2] = "bbb";
```

- 获取 Symbol 属性名：`Object.getOwnPropertySymbols(obj)`。
- `Symbol.for("ddd")`：相同的 key 会生成相同的 Symbol 值（`Symbol.keyFor` 可以取回这个 key）。
- 创建时可以传入描述：`Symbol("ccc").description` 就是 `"ccc"`。

```js
const s5 = Symbol.for("ddd");
const s6 = Symbol.for("ddd");
console.log(s5 === s6); // true
console.log(Symbol.keyFor(s5)); // ddd

const s3 = Symbol("ccc");
console.log(s3.description); // ccc
```

### Set 与 Map

**Set**：类似数组，但元素不能重复，常用于数组去重。

- 属性：`size`。
- 方法：`add(value)`、`delete(value)`、`has(value)`、`clear()`、`forEach(callback[, thisArg])`。
- 支持 for of 遍历。

**WeakSet**：元素也不能重复，但和 Set 有两点区别：

- 只能存放对象类型，不能存放基本数据类型；
- 对元素是弱引用，如果没有其他引用指向某个对象，GC 可以回收它。

方法有 `add`、`delete`、`has`。注意 WeakSet 不能遍历：因为它是弱引用，如果能遍历拿到元素，就可能造成对象无法正常销毁。

```js
// 场景：arr 里存了几个对象并放进了 set，用完销毁 arr 后希望 set 也跟着销毁
const weakSet = new WeakSet();
```

**Map**：用于存储映射关系。对象也能存映射，但对象的 key 只能是字符串（ES6 加了 Symbol），如果拿对象当 key 会被自动转成字符串，Map 没有这个限制。

- 属性：`size`。
- 方法：`set(key, value)`、`get(key)`、`has(key)`、`delete(key)`、`clear()`、`forEach(callback[, thisArg])`。
- 也可以通过 for of 遍历。

**WeakMap**：同样是键值对，区别是：

- key 只能使用对象，不接受其他类型；
- key 对对象是弱引用，没有其他引用时 GC 可以回收。

方法有 `set`、`get`、`has`、`delete`。同样不能遍历，没有 `forEach`，也不支持 for of。

## ES7–ES13 新特性

### ES7

- `Array.prototype.includes`：判断数组是否包含某个元素，返回 true / false。

```js
arr.includes(value[, fromIndex]);
```

- 指数运算符 `**`：之前要用 `Math.pow` 计算乘方。

### ES8

- `Object.values`：获取对象所有的 value。
- `Object.entries`：获取可枚举属性的键值对数组，可以作用于对象、数组和字符串。

```js
const obj = { name: "why", age: 18, height: 1.88 };

console.log(Object.entries(obj));
// [['name', 'why'], ['age', 18], ['height', 1.88]]

console.log(Object.entries(["abc", "cba"]));
// [['0', 'abc'], ['1', 'cba']]

console.log(Object.entries("abc"));
// [['0', 'a'], ['1', 'b'], ['2', 'c']]
```

- 字符串填充：`padStart` 和 `padEnd`，第一个参数是填充后的长度，第二个是填充的字符。

```js
const minute = "5";
console.log(minute.padStart(2, "0")); // 05

const x = "1.2";
console.log(x.padEnd(5, "0")); // 1.200
```

- Trailing Commas：函数定义和调用时允许末尾多一个逗号。
- `Object.getOwnPropertyDescriptors`：前面讲过。
- Async Function（async、await）：放在后面的 Promise 和异步部分。

### ES9

- Async iterators：放在迭代器部分。
- 对象展开运算符：前面讲过。
- Promise finally：放在 Promise 部分。

### ES10

- `flat(depth)`：按指定深度递归遍历数组，把子数组元素合并成一个新数组返回。

```js
const nums = [10, 20, [111, 222], [333, 444], [[123, 321], [231, 312]]];

console.log(nums.flat(1));
// [10, 20, 111, 222, 333, 444, [123, 321], [231, 312]]

console.log(nums.flat(2));
// [10, 20, 111, 222, 333, 444, 123, 321, 231, 312]
```

- `flatMap()`：先 map 再 flat，其中 flat 的深度相当于 1。

```js
const messages = ["Hello World aaaaa", "Hello Coderwhy", "你好啊 李银河"];
const finalMessages = messages.flatMap((item) => item.split(" "));
// ['Hello', 'World', 'aaaaa', 'Hello', 'Coderwhy', '你好啊', '李银河']
```

- `Object.fromEntries`：把 entries 转回对象（`Object.entries` 的逆操作）。
- `trimStart` / `trimEnd`：分别去掉字符串前面、后面的空格。

```js
const message = "   Hello World    ";
console.log(message.trim());
console.log(message.trimStart());
console.log(message.trimEnd());
```

- Symbol description：前面讲过。
- Optional catch binding：放在 try-catch 部分。

### ES11

- BigInt：超过 `MAX_SAFE_INTEGER` 的数值表示可能不正确，ES11 引入了 BigInt 表示大整数，写法是在数字后面加 `n`。
- 空值合并运算符 `??`：只有 `x` 为 `undefined` 或 `null` 时才用默认值。

```js
const value = x ?? "默认";
```

- 可选链 `?.`：让 null / undefined 判断更简洁。

```js
// 直接调用非常危险
obj.friend.running();

// if 判断比较麻烦
if (obj.friend && obj.friend.running) {
  obj.friend.running();
}

// 可选链
obj?.friend?.running?.();
```

- `globalThis`：统一了获取全局对象的方式。之前浏览器里用 this、window，Node 里用 global。
- `for...in`：ES11 之前虽然很多浏览器支持，但没有被 ECMA 标准化；ES11 把它标准化，用于遍历对象的 key。
- Dynamic Import、`Promise.allSettled`、`import.meta`：分别放在模块化和 Promise 部分。

### ES12

- `FinalizationRegistry`：当注册表中注册的对象被回收时，请求在某个时间点调用清理回调（finalizer）。

```js
let obj = { name: "why", age: 18 };
let info = { name: "kobe", age: 30 };

const finalRegistry = new FinalizationRegistry((value) => {
  console.log("某一个对象被回收了:", value);
});

finalRegistry.register(obj, "why");
finalRegistry.register(info, "kobe");

obj = null; // 某一个对象被回收了: why
info = null; // 某一个对象被回收了: kobe
```

- `WeakRef`：默认把一个对象赋值给另一个引用是强引用，想用弱引用可以用 WeakRef，通过 `deref()` 解析出对象或属性。

```js
let info2 = { name: "why", age: 18 };
let obj2 = new WeakRef(info2);
console.log(obj2.deref().name, obj2.deref().age);
```

- 逻辑赋值运算符：

```js
x ||= "默认值"; // x = x || "默认值"
x &&= "默认值"; // x = x && "默认值"
x ??= "默认值"; // x = x ?? "默认值"
```

- 数字分隔符：`const number = 1000_000_000;`，方便辨认数字。
- `String.replaceAll`：`replace` 只替换第一个目标字符串，`replaceAll` 替换所有。

```js
const message2 = "my name is why, why age is 18";

console.log(message2.replace("why", "kobe"));
// "my name is kobe, why age is 18"

console.log(message2.replaceAll("why", "kobe"));
// "my name is kobe, kobe age is 18"
```

### ES13

- `at()`：访问数组和字符串的元素。

```js
const arr = ["123", "abc", "cba"];
const str = "Hello world";

console.log(arr.at(0), arr.at(-1)); // 123 cba
console.log(str.at(0), str.at(-1)); // H d
```

- `Object.hasOwn(obj, propKey)`：静态方法，判断对象是否有某个自己的属性。和 `Object.prototype.hasOwnProperty` 的区别是：可以防止对象内部重写了 `hasOwnProperty`；对于隐式原型指向 null 的对象，`hasOwnProperty` 无法判断。

```js
const info3 = Object.create(null);
info3.name = "why";
console.log(Object.hasOwn(info3, "name")); // true
```

- 类的新成员：实例属性、私有属性（`#` 开头，外部不可访问）、静态属性（`static`）、私有静态属性、类方法、静态代码块（创建时默认调用）。

```js
class Person {
  // 1. 实例属性
  height = 1.88;

  // 2. 约定俗成的私有属性（仍可访问）
  _intro = "name is why";

  // 3. ES13 真正的私有属性，外部不可访问
  #intro = "name is why";

  // 4. 静态属性
  static totalCount = "70亿";
  static #maleTotalCount = "20亿";

  // 5. 类方法
  static test() {
    console.log("我是类方法");
  }

  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.address = "广州市";
  }

  // 6. 静态代码块，创建时默认调用
  static {
    console.log("Hello Person");
  }
}
```

## 写在最后

这一篇把 ES6 到 ES13 的新增特性串了一遍。当年记的时候是「按版本抄 API」，现在回头看，真正常用到的其实就是 let/const、解构、展开、模板字符串和可选链这几样，其他更像词典——用得着的时候查一下就行。

下一篇是 Proxy 与 Reflect，以及 Promise。
