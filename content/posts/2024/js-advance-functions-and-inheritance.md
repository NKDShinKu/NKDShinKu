---
title: JavaScript 进阶 2：函数对象增强与 ES5 继承
cover: https://img.nkdshinku.com/images/posts/js-advance-2.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：函数属性与剩余参数、纯函数、柯里化与组合函数、严格模式、属性描述符、多态，以及原型、原型链和 ES5 继承。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - 原型
keywords:
  - JavaScript 继承
  - 原型链
  - 属性描述符
  - 柯里化
  - 前端自学笔记
---

JavaScript 进阶笔记的第 2 篇：函数与对象的增强知识、面向对象，以及 ES5 时代那套继承方案。

写这些内容的时候应该是最痛苦的一段——原型的图我大概画了三遍才看明白「实例的原型指向构造函数的 prototype」到底是什么意思。

## 函数增强知识

### 函数属性和 arguments

**name**：函数的名字。

```js
function foo() {}
console.log(foo.name); // foo
```

**length**：形参的个数。rest 参数不计入，第一个带默认值的参数以及它后面的参数也不计入。

```js
function test(...args) {}
console.log(test.length); // 0

function foo(x, y, ...args) {}
console.log(foo.length); // 2
```

**arguments**：

- 是一个对应「传递给函数的参数」的类数组（array-like）对象；
- 箭头函数不绑定 arguments，在箭头函数里使用它会去上层作用域查找；
- 类数组意味着它不是数组类型，而是对象类型：拥有 length、可以通过索引访问，但没有数组的方法（filter、map 等）。

把 arguments 转成数组的几种写法：

```js
// 1. 遍历 arguments，逐个 push 到新数组
var newArguments = [];
for (var arg of arguments) {
  newArguments.push(arg);
}

// 2. 借用数组的 slice 方法
var newArgs = [].slice.call(arguments);

// 3. ES6 的两个方法
var newArgs1 = Array.from(arguments);
var newArgs2 = [...arguments];
```

**函数剩余（rest）参数**：

- 用法：最后一个参数并以 `...` 为前缀，它会收集剩余的参数，类型是数组。

```js
function foo(x, y, ...args) {}
function bar(...args) {}
```

- 与 arguments 的区别：
  - rest 参数只包含没有对应形参的实参，arguments 包含传给函数的所有实参；
  - arguments 不是真正的数组，rest 参数是真正的数组，可以做所有数组操作；
  - arguments 是早期 ECMAScript 为了方便获取所有参数提供的数据结构，rest 参数是 ES6 提供、希望用它替代 arguments 的。
- rest 参数必须放在最后一个位置，否则会报错。

### 纯函数

- 确定的输入一定产生确定的输出；
- 函数执行过程中不产生副作用（不修改全局变量、不触发事件、不改变外部状态等）；
- 输出和输入以外的隐藏信息、状态无关。

副作用指的是：执行函数时除了返回值，还对调用方产生了附加影响，比如修改全局变量、修改参数、改变外部存储——它往往是产生 bug 的温床。

例子：

- `slice` 截取数组时不会改动原数组，而是生成一个新数组，所以它是纯函数；
- `splice` 会返回新数组，同时修改原数组，所以它不是纯函数。

纯函数的优势在于：写的时候只需要单纯实现业务逻辑，不用关心传入的内容从哪来、依赖的外部变量有没有被改；用的时候也能确定输入不会被篡改、确定的输入一定有确定的输出。

### 柯里化函数（Currying）

把接收多个参数的函数，变成接受第一个参数、返回接受余下参数的新函数的技术——也就是把 `f(a, b, c)` 变成可调用的 `f(a)(b)(c)`。

```js
// 普通的函数
function foo1(x, y, z) {
  console.log(x + y + z);
}

// 柯里化函数
function foo2(x) {
  return function (y) {
    return function (z) {
      console.log(x + y + z);
    };
  };
}

var foo3 = (x) => (y) => (z) => console.log(x + y + z);
```

优势：

- 让一个函数处理的问题尽可能单一；
- 帮助复用参数逻辑，传过的参数不用再传；
- 每次传入的参数可以在单一函数里处理完，下一个函数直接用处理后的结果。

```js
function logInfo(date) {
  return function (type) {
    return function (message) {
      console.log(`时间:${date} 类型:${type} 内容:${message}`);
    };
  };
}

var logToday = logInfo("2022-06-01");
var logTodayDebug = logToday("DEBUG");
var logTodayFeature = logToday("FEATURE");

// 都是 2022-06-01 当天的内容，不需要再传日期
logTodayDebug("修复了从服务器请求数据后展示的 bug");
logTodayFeature("新建搜索功能");
```

利用 `fn.length`（形参个数）可以写一个自动柯里化的工具函数：参数够了就执行，不够就继续返回新函数接收参数。

```js
function hyCurrying(fn) {
  function curryFn(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function (...newArgs) {
      return curryFn(...args.concat(newArgs));
    };
  }
  return curryFn;
}
```

### 组合函数

对某个数据依次调用多个函数，把它们组合起来自动依次调用，这个过程叫组合函数（Compose Function）。

```js
function double(num) {
  return num * 2;
}
function pow(num) {
  return num ** 2;
}

// 组合
function composeFn(num) {
  return pow(double(num));
}
```

更通用的版本：

```js
function composeFn(...fns) {
  // 1. 边界判断
  var length = fns.length;
  if (length <= 0) return;
  for (var i = 0; i < length; i++) {
    if (typeof fns[i] !== "function") {
      throw new Error(`index position ${i} must be function`);
    }
  }

  // 2. 返回的新函数
  return function (...args) {
    var result = fns[0].apply(this, args);
    for (var i = 1; i < length; i++) {
      result = fns[i].apply(this, [result]);
    }
    return result;
  };
}
```

## with 和 eval

**with**：扩展一个语句的作用域链。

```js
var obj = { message: "我是信息" };
with (obj) {
  console.log(message); // 访问的是 obj 里的 message
}
```

不建议使用 with，它可能是混淆错误和兼容性问题的根源，严格模式下也不允许使用。

**eval**：一个特殊的函数，可以把传入的字符串当作 JavaScript 代码运行。

- 会把最后一句执行语句的结果作为返回值；
- 代码可读性很差，而可读性是高质量代码的重要原则；
- 传入的是字符串，执行过程中可能被篡改，存在被攻击的风险；
- 必须经过 JavaScript 解释器，不能被引擎优化。

## 严格模式

严格模式是一种具有限制性的 JavaScript 模式，让代码脱离「懒散」（sloppy）模式：

- 支持严格模式的浏览器检测到后会以更严格的方式检测和执行代码；
- 通过抛出错误来消除一些原有的静默（silent）错误；
- 让引擎可以做更多优化（不需要处理一些特殊语法）；
- 禁用了一些未来版本中可能会定义的语法。

开启方式：在文件或函数开头写 `"use strict"`。现代 JavaScript 中的 class 和 module 会自动启用严格模式。

严格模式的一些限制：

1. 无法意外创建全局变量（不使用 var 直接赋值会报错）；
2. 会引起静默失败的赋值操作会抛出异常；
3. 试图删除不可删除的属性会报错；
4. 不允许函数参数有相同的名称；
5. 不允许使用以 0 开头的八进制字面量（比如 `0123`）；
6. 不允许使用 with；
7. eval 不再为上层创建变量；
8. this 绑定不再被默认转成对象（默认绑定时是 `undefined`，而不是 window）。

```js
"use strict";
var obj = { name: "why" };

Object.defineProperty(obj, "name", {
  writable: false,
  configurable: false,
});

obj.name = "kobe"; // 抛出错误
delete obj.name; // 抛出错误
```

## 对象增强知识

### 对象的属性及其控制

想对属性做精准控制，就需要用**属性描述符**：

- 通过属性描述符可以精准地添加或修改对象的属性；
- 属性描述符需要用 `Object.defineProperty` 来添加或修改。

`Object.defineProperty(obj, prop, descriptor)`：

- `obj`：定义属性的对象；
- `prop`：定义或修改的属性名称（也可以是 Symbol）；
- `descriptor`：属性描述符；
- 返回值：传入的对象。

属性描述符有两种：数据属性描述符和存取属性（访问器）描述符。

### 数据属性描述符

- `configurable`：属性是否可以被 `delete` 删除、是否可以修改它的特性、是否可以改成存取属性描述符。
  - 直接在对象上定义属性时，默认是 `true`；用属性描述符定义时，默认是 `false`。
- `enumerable`：属性是否可以被 `for-in` 或 `Object.keys()` 返回。
  - 直接定义时默认 `true`，用描述符定义时默认 `false`。
- `writable`：属性值是否可以被修改。
  - 直接定义时默认 `true`，用描述符定义时默认 `false`。
- `value`：属性的值，读取时返回它，修改时改它，默认是 `undefined`。

```js
var obj = { name: "why", age: 18 };

Object.defineProperty(obj, "name", {
  configurable: false, // 不可删除
  enumerable: false, // 不可枚举
  writable: false, // 只读
  value: "coderwhy",
});
```

### 存取属性描述符

`configurable` 和 `enumerable` 的含义与数据属性描述符一致；区别是它用 `get` / `set` 代替了 `value` / `writable`：

- `get`：读取属性时执行的函数，默认 `undefined`；
- `set`：设置属性时执行的函数，默认 `undefined`。

```js
// Vue2 响应式原理的基础
var obj = { name: "why" };
var _name = "";

Object.defineProperty(obj, "name", {
  configurable: true,
  enumerable: false,
  set: function (value) {
    console.log("set 方法被调用了", value);
    _name = value;
  },
  get: function () {
    console.log("get 方法被调用了");
    return _name;
  },
});
```

### 对象方法补充（属性控制）

- 一次定义多个属性：`Object.defineProperties`。
- 获取属性描述符：`getOwnPropertyDescriptor` / `getOwnPropertyDescriptors`。
- 禁止扩展新属性：`preventExtensions`，再加新属性会失败（严格模式下报错）。
- 密封对象：`seal`，实际是调用 `preventExtensions`，并把现有属性的 `configurable` 设为 `false`。
- 冻结对象：`freeze`，实际是调用 `seal`，并把现有属性的 `writable` 设为 `false`。

```js
var obj = { name: "why", age: 18, height: 1.88 };

Object.defineProperties(obj, {
  name: { configurable: true },
  age: {},
  height: {},
});
```

## 面向对象的编程

### 三大特性：封装、继承、多态

- 封装：把属性和方法封装到一个类中。
- 继承：减少重复代码，也是多态的前提（纯面向对象中）。
- 多态：不同的对象在执行时表现出不同的形态。

### 继承

把重复的代码和逻辑抽取到父类中，子类直接继承过来使用即可。

### 多态

多态指为不同数据类型的实体提供统一的接口，或者用一个符号表示多个不同的类型。更直白一点的总结：**不同的数据类型做同一个操作，表现出不同的行为**。

严格意义上的多态需要满足两个条件：有继承（或实现接口）；有父类引用指向子类对象。

```js
class Shape {
  getArea() {}
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  getArea() {
    return this.radius * this.radius * 3.14;
  }
}

function getShapeArea(shape) {
  console.log(shape.getArea());
}

getShapeArea(new Rectangle(100, 200));
getShapeArea(new Circle(10));
```

JS 里到处都是多态，比如同一个 `sum(a1, a2)` 传数字是相加、传字符串是拼接。

## ES5 中的继承

### 对象的原型

每个对象都有一个特殊的内置属性 `[[prototype]]`（也叫隐式原型），它可以指向另外一个对象。

作用：通过引用对象的属性 key 获取 value 时，会触发 `[[Get]]` 操作——先检查对象自己有没有这个属性，有就用它；没有就访问 `[[prototype]]` 指向的对象上的属性。

获取方式：

- `obj.__proto__`（早期浏览器自己添加的，存在兼容性问题）；
- `Object.getPrototypeOf(obj)`。

设置方式：`Object.setPrototypeOf(obj, proto)`。

### 函数的原型

所有的函数都有一个 `[[prototype]]` 属性（隐式原型）和一个 `prototype` 属性（显式原型），注意区分：

- `[[prototype]]`：查找 key 对应的 value 时会找到原型身上；
- `prototype`：用来构建对象时，给对象设置隐式原型。

`new` 操作符、构造函数和原型的组合：

1. 在内存中创建一个新的空对象；
2. 这个对象内部的 `[[prototype]]` 属性会被赋值为构造函数的 `prototype` 属性；
3. 构造函数内部的 this 指向这个新对象；
4. 执行函数体代码；
5. 如果构造函数没有返回非空对象，就返回这个新对象。

这意味着通过 `Person` 创建出来的所有对象，`[[prototype]]` 都指向 `Person.prototype`。于是可以把多个对象共用的方法挂到显式原型上，避免每个实例都创建一个重复的函数：

```js
function Student(name, age) {
  this.name = name;
  this.age = age;
}

Student.prototype.running = function () {
  console.log(this.name + " running");
};

var stu1 = new Student("why", 18);
var stu2 = new Student("kobe", 30);
stu1.running();
stu2.running();
```

**constructor**：默认情况下原型上会有一个 `constructor` 属性，指向当前的函数对象。

![原型的内存图](https://img.nkdshinku.com/images/posts/js-advance-2/prototype.png)

**重写原型对象**：如果要在原型上添加很多属性，通常会直接重写整个原型对象。

但这样等于给 `prototype` 重新赋值了一个对象，新对象的 `constructor` 会指向 `Object` 构造函数，而不是原来的 `Person`。想让它指回 `Person` 可以手动添加，不过这样 `constructor` 的 `enumerable` 会变成 `true`，而原生的 `constructor` 是不可枚举的——要解决就用 `Object.defineProperty()`：

```js
function Person() {}

Person.prototype = {
  message: "Hello Person",
  running: function () {},
  eating: function () {},
};

Object.defineProperty(Person.prototype, "constructor", {
  enumerable: false,
  configurable: true,
  writable: true,
  value: Person,
});
```

### JS 的原型链

从一个对象上获取属性，当前对象没有就会去它的原型上找，一层层往上，就形成了原型链。

```js
var obj = { name: "why", age: 18 };

// 查找顺序：
// 1. obj 自身
// 2. obj.__proto__
// 3. obj.__proto__.__proto__ -> null（找不到就是 undefined）
console.log(obj.message);
```

原型链的尽头是 Object 的原型对象：

- 从 Object 直接创建出来的对象，它的原型是 `[Object: null prototype] {}`，这个原型就是最顶层的原型；
- 它有原型属性，但已经指向 `null`；上面还有很多默认的属性和方法。

也就是说，原型链最顶层的原型对象就是 Object 的原型对象，Object 是所有类的父类。

![原型链的内存图](https://img.nkdshinku.com/images/posts/js-advance-2/prototype-chain.png)

### 原型链实现方法继承

思路：创建一个父类的实例对象 `new Person()`，用它作为子类的原型对象。

```js
var p = new Person("属性");
Student.prototype = p;
```

缺点：只能继承方法，属性取决于这个实例对象的属性——直接打印对象看不到继承的属性；而且属性会被多个对象共享，如果属性是引用类型就会出问题。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.running = function () {
  console.log("I can running");
};

function Student(name, age, sno) {
  this.sno = sno;
}

var p = new Person("parents", 50);
Student.prototype = p;

var stu1 = new Student("kobes", 18, 111);
var stu2 = new Student("james", 20, 222);

stu1.running(); // I can running
console.log(stu1.name, stu2.name); // parents parents，都是从同一个原型 p 上找的
```

### 构造函数实现属性继承

思路：在子类型构造函数内部调用父类型构造函数。

```js
Person.call(this, "属性"); // this 会绑定子类对象
```

因为函数可以在任意时刻被调用，所以通过 `apply()` 和 `call()` 也可以在新创建的对象上执行构造函数。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.running = function () {
  console.log("I can running");
};

function Student(name, age, sno) {
  // 借用构造函数，继承属性
  Person.call(this, name, age);
  this.sno = sno;
}

// 继承方法
var p = new Person("parents", 50);
Student.prototype = p;

var stu1 = new Student("kobes", 18, 111);
console.log(stu1.name); // kobes，属性成功继承下来了
```

### 组合继承的缺点

会调用两次父类构造函数：一次在创建子类原型的时候，另一次在子类构造函数内部（每次创建子类实例时）。

结果是所有子类实例事实上会拥有两份父类属性：一份在自己的实例里，另一份在子类对应的原型对象里。访问时默认访问实例自己那一份，所以不会出错，但确实浪费。

### 最终方案——寄生组合式继承

目标是让 Student 对象的原型指向 Person 的原型，同时不再多调用一次父类构造函数。

发展过程：

```js
// 1. 之前的做法
var p = new Person();
Student.prototype = p;

// 2. 方案一
var obj = {};
Object.setPrototypeOf(obj, Person.prototype);
Student.prototype = obj;

// 3. 方案二
function F() {}
F.prototype = Person.prototype;
Student.prototype = new F();

// 4. 方案三
var obj2 = Object.create(Person.prototype);
Student.prototype = obj2;
```

把方案三规范化，就得到最终写法：

```js
// 相当于 Object.create(Person.prototype)
function createObject(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// 寄生式函数：把子类和父类联系在一起
function inherit(Subtype, Supertype) {
  Subtype.prototype = createObject(Supertype.prototype);
  Object.defineProperty(Subtype.prototype, "constructor", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: Subtype,
  });
}

function Person(name, age, height) {
  this.name = name;
  this.age = age;
  this.height = height;
}
Person.prototype.running = function () {
  console.log("running~");
};

function Student(name, age, height, sno, score) {
  Person.call(this, name, age, height); // 属性继承
  this.sno = sno;
  this.score = score;
}

inherit(Student, Person); // 方法继承
Student.prototype.studying = function () {
  console.log("studying");
};

var stu1 = new Student("why", 18, 1.88, 111, 100);
```

这套方案把原型链、借用构造函数、原型式继承和寄生式函数都用上了，所以叫寄生组合式继承。

### 对象方法补充（原型判断）

- `hasOwnProperty`：对象是否有某一个属于自己的属性（不是原型上的）。

```js
obj.hasOwnProperty("name");
```

- `in` / `for-in`：判断某个属性是否在对象**或它的原型**上。

```js
console.log("name" in obj);
for (var key in obj) {
  console.log(key);
}
```

- `instanceof`：检测构造函数的 prototype 是否出现在某个实例对象的原型链上（对象与构造函数的关系）。

```js
console.log(stu instanceof Student);
```

- `isPrototypeOf`：检测某个对象是否出现在另一个实例对象的原型链上（对象与对象的关系）。

```js
console.log(Person.prototype.isPrototypeOf(stu));
```

- 类方法（静态方法）的定义：直接 `类.方法 = ...` 即可创建。

### 总结

- Object 是所有类的父类，也是原型链的尽头。
  - 所有类的原型对象中的 `__proto__` 尽头都指向 Object 的原型对象（包括 Function）；
  - Object 的原型对象的 `__proto__` 指向 `null`。
- 所有构造函数（类）都是由 Function 创建出来的。
  - 所有构造函数本身的 `__proto__` 都指向 Function 的原型对象（包括 Function 自己）。
- Object 和 Function 很特殊：Object 是 Function 的父类，Function 是 Object 的构造函数。

```js
var obj = {}; // new Object()
console.log(obj.__proto__); // Object.prototype

function foo() {}
console.log(foo.__proto__ === Function.prototype); // true
console.log(Object.__proto__ === Function.prototype); // true
console.log(Function.__proto__ === Function.prototype); // true
console.log(Object.prototype.__proto__); // null
console.log(Function.prototype.__proto__); // Object.prototype
```

## 写在最后

这一块是当年最绕的部分：函数增强和属性描述符还好，到了原型链、继承方案那一串「方法继承 / 属性继承 / 寄生组合」，基本靠画内存图才勉强想通。

现在回头看，ES5 这套继承虽然日常已经用不到了，但它是理解 `class`、`Object.create`、`instanceof` 这些 API 的地基。

下一篇是 ES6 的继承、手写 apply/call/bind，以及 ES6 到 ES13 的新特性。
