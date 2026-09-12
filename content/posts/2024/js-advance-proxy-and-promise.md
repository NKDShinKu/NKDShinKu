---
title: JavaScript 进阶 4：Proxy、Reflect 与 Promise
cover: https://img.nkdshinku.com/images/posts/js-advance-4.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：用 Object.defineProperty 监听对象的局限、Proxy 的捕获器、Reflect 的作用与 receiver，以及 Promise 的状态、then/catch 调度和类方法。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - Promise
keywords:
  - Proxy
  - Reflect
  - Promise
  - 响应式原理
  - 前端自学笔记
---

JavaScript 进阶笔记的第 4 篇：Proxy 与 Reflect，以及 Promise。

Proxy 那一节是第一次接触「拦截对象操作」的思路，后来才知道 Vue3 的响应式就建立在这上面；Promise 则是从回调地狱里爬出来的入口。

## Proxy 与 Reflect

### 监听对象的操作

利用 `Object.defineProperty` 的存取属性描述符，可以对属性的读写进行监听：

```js
const obj = { name: "why", age: 18, height: 1.88 };

let _name = obj.name;
Object.defineProperty(obj, "name", {
  set: function (newValue) {
    console.log("监听: 给 name 设置了新的值:", newValue);
    _name = newValue;
  },
  get: function () {
    console.log("监听: 获取 name 的值");
    return _name;
  },
});
```

但这种做法有缺点：

- `Object.defineProperty` 设计的初衷不是监听一个对象的所有属性，它一次只能处理一个属性；
- 有些属性初衷只是普通属性，却被强行改成了存取属性描述符；
- 想监听更丰富的操作，比如新增属性、删除属性，它就无能为力了。

### Proxy

Proxy 类用于创建一个代理，代理对象可以监听想对原对象进行的各种操作。之后的操作都是直接对 Proxy 进行，而不是原对象。

```js
const obj = { name: "why", age: 18 };
const objProxy = new Proxy(obj, {});
```

在 handler 中添加对应的捕捉器（Trap），就能监听具体的操作：

- `set` 有四个参数：target（目标对象）、property（将被设置的属性 key）、value（新属性值）、receiver（调用的代理对象）；
- `get` 有三个参数：target、property（被获取的属性 key）、receiver。

```js
const objProxy2 = new Proxy(obj, {
  set: function (target, key, newValue) {
    console.log(`监听: 监听 ${key} 的设置值: `, newValue);
    target[key] = newValue;
  },
  get: function (target, key) {
    console.log(`监听: 监听 ${key} 的获取`);
    return target[key];
  },
  deleteProperty: function (target, key) {
    console.log(`监听: 监听删除 ${key} 属性`);
    delete target[key];
  },
  has: function (target, key) {
    console.log(`监听: 监听 in 判断 ${key} 属性`);
    return key in target;
  },
});

objProxy2.address = "广州";
console.log(objProxy2.height);
delete objProxy2.name;
console.log("age" in objProxy2);
```

所有捕获器：

- `handler.getPrototypeOf()`：`Object.getPrototypeOf` 的捕捉器。
- `handler.setPrototypeOf()`：`Object.setPrototypeOf` 的捕捉器。
- `handler.isExtensible()`：`Object.isExtensible` 的捕捉器（判断是否可以新增属性）。
- `handler.preventExtensions()`：`Object.preventExtensions` 的捕捉器。
- `handler.getOwnPropertyDescriptor()`：`Object.getOwnPropertyDescriptor` 的捕捉器。
- `handler.defineProperty()`：`Object.defineProperty` 的捕捉器。
- `handler.ownKeys()`：`Object.getOwnPropertyNames` 和 `Object.getOwnPropertySymbols` 的捕捉器。
- `handler.has()`：`in` 操作符的捕捉器。
- `handler.get()` / `handler.set()`：属性读取 / 设置操作的捕捉器。
- `handler.deleteProperty()`：`delete` 操作符的捕捉器。
- `handler.apply()`：函数调用操作的捕捉器。
- `handler.construct()`：`new` 操作符的捕捉器。

construct 和 apply：

```js
function foo(num1, num2) {
  console.log(this, num1, num2);
}

const fooProxy = new Proxy(foo, {
  apply: function (target, thisArg, otherArgs) {
    console.log("监听执行了 apply 操作");
    target.apply(thisArg, otherArgs);
  },
  construct: function (target, otherArray) {
    console.log("监听执行了 new 操作");
    return new target(...otherArray);
  },
});

fooProxy.apply("abc", [111, 222]); // 监听执行了 apply 操作
new fooProxy("aaa", "bbb"); // 监听执行了 new 操作
```

### Reflect

Reflect 也是 ES6 新增的 API，它是一个对象，字面意思是「反射」。

它提供了很多操作 JavaScript 对象的方法，有点像 Object 上那些方法：`Reflect.getPrototypeOf(target)` 类似于 `Object.getPrototypeOf()`，`Reflect.defineProperty(target, key, attributes)` 类似于 `Object.defineProperty()`。

既然 Object 能做这些操作，为什么还要 Reflect：

- 早期 ECMA 规范没有考虑「对象本身的操作」该怎么设计才规范，就把这些 API 放到了 Object 上；
- 但 Object 作为一个构造函数，这些操作放在它身上并不合适；
- 还有一些类似 `in`、`delete` 的操作符，让 JS 看起来有点奇怪；
- 所以 ES6 新增了 Reflect，把这些操作集中到 Reflect 对象上；
- 另外在使用 Proxy 时，用 Reflect 可以做到不直接操作原对象。

所有方法（其中不少会返回 Boolean 表示操作是否成功）：

- `Reflect.getPrototypeOf(target)`：类似 `Object.getPrototypeOf()`。
- `Reflect.setPrototypeOf(target, prototype)`：设置原型，返回 Boolean。
- `Reflect.isExtensible(target)` / `Reflect.preventExtensions(target)`：类似 Object 上的同名方法。
- `Reflect.getOwnPropertyDescriptor(target, key)`：存在则返回属性描述符，否则返回 `undefined`。
- `Reflect.defineProperty(target, key, attributes)`：设置成功返回 `true`。
- `Reflect.ownKeys(target)`：返回所有自身属性（不含继承）的数组，不受 enumerable 影响。
- `Reflect.has(target, key)`：和 `in` 运算符功能完全相同。
- `Reflect.get(target, key[, receiver])`：获取属性值，类似 `target[key]`。
- `Reflect.set(target, key, value[, receiver])`：设置属性值，返回 Boolean。
- `Reflect.deleteProperty(target, key)`：相当于 `delete target[key]`。
- `Reflect.apply(target, thisArgument, argumentsList)`：调用函数并传入参数数组，类似 `Function.prototype.apply()`。
- `Reflect.construct(target, argumentsList[, newTarget])`：相当于 `new target(...args)`。

把前面 Proxy 案例里对原对象的操作都改成 Reflect：

```js
const objProxy3 = new Proxy(obj, {
  set: function (target, key, value) {
    return Reflect.set(target, key, value);
  },
  get: function (target, key) {
    return Reflect.get(target, key);
  },
});
```

**receiver 的作用**：如果源对象有 setter / getter 访问器属性，可以通过 receiver 改变里面的 this。

```js
const obj4 = {
  _name: "why",
  set name(newValue) {
    console.log("this:", this); // 默认是 obj4
    this._name = newValue;
  },
  get name() {
    return this._name;
  },
};

const objProxy4 = new Proxy(obj4, {
  set: function (target, key, newValue, receiver) {
    const isSuccess = Reflect.set(target, key, newValue, receiver);
    if (!isSuccess) {
      throw new Error(`set ${key} failure`);
    }
  },
  get: function (target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
});

objProxy4.name = "kobe";
console.log(objProxy4.name);
```

在 set / get 里传入 receiver 后，访问器里的 this 会指向代理对象 `objProxy4`，于是 `this._name = newValue` 又会走一次代理的 set，日志会打印两次——这正好说明 this 被换掉了。

另外，`Reflect.set` 返回 Boolean，可以用来判断本次操作是否成功，这也是它比直接赋值更好用的地方。

**construct 继承**：可以用一个类来创建另一个类的对象。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age) {
  const _this = Reflect.construct(Person, [name, age], Student);
  return _this;
}

const stu = new Student("why", 18);
console.log(stu.__proto__ === Student.prototype); // true
```

## Promise 详解

### 异步处理的困境

先看一个异步任务的例子，它需要在成功或失败时告知调用者：

```js
function execCode(counter, successCallback, failureCallback) {
  setTimeout(() => {
    if (counter > 0) {
      let total = 0;
      for (let i = 0; i < counter; i++) {
        total += i;
      }
      successCallback(total);
    } else {
      failureCallback(`${counter}值有问题`);
    }
  }, 3000);
}

execCode(
  100,
  (value) => {
    console.log("本次执行成功了:", value);
  },
  (err) => {
    console.log("本次执行失败了:", err);
  },
);
```

这种回调写法的问题是：

- 需要自己设计回调函数、回调函数的名称和使用方式；
- 不同的人、不同的框架设计出来的方案都不一样，用之前必须先去读源码或文档；
- 所以需要一个统一的规范。

### Promise 是什么

`Promise` 是一个类，可以翻译成承诺、许诺、期约。当需要给调用者一个承诺时，就可以创建一个 Promise 对象。

用 `new` 创建 Promise 时需要传入一个回调函数，称之为 Executor：

- 这个回调函数会被立即执行，并传入另外两个回调函数 `resolve`、`reject`；
- 调用 `resolve` 时，会执行 Promise 的 then 方法传入的回调；
- 调用 `reject` 时，会执行 Promise 的 catch 方法传入的回调。

Promise 有三个状态：

- 待定（`pending`）：初始状态，既没被兑现，也没被拒绝；执行 executor 中的代码时处于该状态。
- 已兑现（`fulfilled`）：操作成功完成，调用 `resolve` 后处于该状态。
- 已拒绝（`rejected`）：操作失败，调用 `reject` 后处于该状态。

注意：状态一旦确定就会被锁死，不可更改。所以调用 `resolve` 之后再去调用 `reject`，不会有任何响应——不是那行代码没执行，而是它无法再改变状态了。

```js
const promise = new Promise((resolve, reject) => {
  // 1. 待定状态 pending
  console.log("111111");

  // 2. 兑现状态 fulfilled，对应外部的 then
  resolve();

  // 3. 拒绝状态 rejected，对应外部的 catch
  reject();
});

promise
  .then((value) => {
    console.log("成功的回调");
  })
  .catch((err) => {
    console.log("失败的回调");
  });
```

用 Promise 改造前面的异步任务：

```js
function execCode2(counter) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (counter > 0) {
        let total = 0;
        for (let i = 0; i < counter; i++) {
          total += i;
        }
        resolve(total);
      } else {
        reject(`${counter}有问题`);
      }
    }, 3000);
  });
  return promise;
}

execCode2(255)
  .then((value) => {
    console.log("成功:", value);
  })
  .catch((err) => {
    console.log("失败:", err);
  });
```

### resolve 不同值的区别

- 情况一：传入普通的值或对象，这个值会作为 then 回调的参数（最常用）。
- 情况二：传入另一个 Promise，新 Promise 会决定原 Promise 的状态。
- 情况三：传入一个有 `then` 方法的对象（thenable），会执行该 then 方法，并根据它的结果决定 Promise 的状态。

```js
const promise2 = new Promise((resolve) => {
  resolve({
    name: "kobe",
    then: function (resolve) {
      resolve(11111);
    },
  });
});

promise2.then((res) => {
  console.log("then 中拿到结果:", res); // 11111
});
```

### then 与 catch 的调度

**then**：

- 是 Promise 的实例方法，实际放在 `Promise.prototype.then` 上；
- 接受两个参数：fulfilled 的回调、rejected 的回调。

```js
promise.then(
  (res) => {
    console.log("成功回调~", res);
  },
  (err) => {
    console.log("失败回调~", err);
  },
);
```

- 同一个 Promise 的 then 可以被多次调用，状态变成 fulfilled 时这些回调都会执行。

```js
promise.then((res) => console.log("成功回调~", res));
promise.then((res) => console.log("成功回调~", res));
```

- then 的返回值是一个 Promise：回调执行期间处于 pending，返回结果时变成 fulfilled 并把返回值作为 resolve 的参数（返回值可以是普通值、Promise 或 thenable）；回调抛出异常时变成 rejected 状态。

```js
const promise3 = new Promise((resolve) => resolve("aaaaaaa"));

promise3
  .then((res) => {
    console.log("第一个 then 方法:", res);
    return "bbbbbbbb";
  })
  .then((res) => {
    console.log("第二个 then 方法:", res);
    return "cccccccc";
  })
  .then((res) => {
    console.log("第三个 then 方法:", res);
  });
```

**catch**：

- 也是实例方法，放在 `Promise.prototype.catch` 上；
- 可以被多次调用，状态变成 rejected 时这些回调都会执行；
- catch 同样返回一个 Promise，所以后面可以继续接 then 或 catch；catch 的回调执行完后，默认状态依然是 fulfilled。

```js
promise.then((res) => {
  console.log("成功的回调:", res);
}).catch((err) => {
  console.log("失败的回调:", err);
});
```

### 实例方法与类方法

**finally（实例方法）**：ES9 新增，无论 Promise 变成 fulfilled 还是 rejected，最终都会执行。它不接收参数，因为它不在乎前面的状态。

```js
promise
  .then((res) => {
    console.log("then:", res);
  })
  .catch((err) => {
    console.log("catch:", err);
  })
  .finally(() => {
    console.log("我是无论如何最后都会执行的代码");
  });
```

**Promise.resolve（类方法）**：把现成的内容转成 Promise，相当于 `new Promise` 并执行 resolve。参数形态同样有三种（普通值、Promise、thenable）。

```js
const p1 = Promise.resolve("genshin");
// 等价于
const p2 = new Promise((resolve) => resolve("genshin"));
```

**Promise.reject（类方法）**：把状态设置为 rejected。传入的参数无论是什么形态，都会直接作为 rejected 的参数传到 catch。

```js
const p3 = Promise.reject("genshin");
// 等价于
const p4 = new Promise((resolve, reject) => reject("genshin"));
```

**Promise.all（类方法）**：把多个 Promise 包裹成一个新的 Promise，状态由所有 Promise 共同决定。

- 所有 Promise 都 fulfilled 时，新 Promise 也是 fulfilled，返回值是所有 Promise 返回值组成的数组；
- 有一个 rejected 时，新 Promise 立刻变成 rejected，参数是第一个 reject 的值。

```js
Promise.all([p1, p2, p3])
  .then((res) => {
    console.log("all promise res:", res);
  })
  .catch((err) => {
    console.log("all promise err:", err);
  });
```

**Promise.allSettled（类方法，ES11）**：`all` 的缺陷是有 Promise rejected 时立刻变成 rejected，那些已 fulfilled 或还在 pending 的结果就拿不到了。allSettled 会等所有 Promise 都有结果，并且最终状态一定是 fulfilled。

- 结果是一个数组，存放每个 Promise 的结果对象；
- 对象中包含 `status`（fulfilled / rejected）以及对应的 value（或 reason）。

**Promise.race（类方法）**：谁先有结果就用谁的结果——race 是竞赛的意思。

**Promise.any（类方法，ES12）**：

- 会等到第一个 fulfilled 状态来决定新 Promise 的状态；
- 如果所有 Promise 都 reject，也会等到全部变成 rejected；
- 全部失败时会抛出一个 `AggregateError` 错误。

## 写在最后

Proxy 和 Reflect 是那种「知道了原理，才发现平时用的框架都在这上面盖楼」的知识点；Promise 则是异步这一整套的地基，后面的 async/await、事件循环都得先把它理清楚。

下一篇是迭代器与生成器，以及 async-await 和事件循环。
