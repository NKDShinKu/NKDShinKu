---
title: JavaScript 进阶 5：迭代器、生成器与事件循环
cover: https://img.nkdshinku.com/images/posts/js-advance-5.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：迭代器与可迭代协议、生成器的 yield 与提前返回、从回调地狱到 async/await 的五种写法，以及进程线程、事件循环和宏微任务。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - 异步
keywords:
  - 迭代器
  - 生成器
  - async await
  - 事件循环
  - 前端自学笔记
---

JavaScript 进阶笔记的第 5 篇：迭代器与生成器，以及 async-await、进程线程和事件循环。

这一块的顺序很舒服——先有迭代器，再有生成器，然后用生成器实现异步流程，最后自然过渡到 async/await，再揭开事件循环。

## 迭代器

### 初识迭代器

迭代器是帮助我们遍历某个数据结构的对象。JavaScript 的标准是它要实现一个特定的 `next` 方法：无参数或者一个参数，返回一个拥有以下两个属性的对象。

- `done`（boolean）：如果迭代器可以产生序列中的下一个值，则为 `false`（等价于没有指定这个属性）；如果把序列迭代完了，则为 `true`。此时 `value` 是可选的，如果依然存在，就是迭代结束后的默认返回值。
- `value`：迭代器返回的任何 JavaScript 值，`done` 为 `true` 时可以省略。

```js
const names = ["abc", "cba", "nba"];

let index = 0;
const namesIterator = {
  next: function () {
    if (index < names.length) {
      return { done: false, value: names[index++] };
    } else {
      return { done: true };
    }
  },
};

console.log(namesIterator.next()); // { done: false, value: 'abc' }
console.log(namesIterator.next()); // { done: false, value: 'cba' }
console.log(namesIterator.next()); // { done: false, value: 'nba' }
console.log(namesIterator.next()); // { done: true }
```

把「创建迭代器」这件事封装成函数：

```js
function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true };
      }
    },
  };
}
```

### 可迭代对象

可迭代对象和迭代器是不同的概念：当一个对象实现了 iterable protocol 协议时，它就是一个可迭代对象。要求是必须实现 `@@iterator` 方法，在代码中用 `Symbol.iterator` 访问。

作用：对象变成可迭代对象之后，就可以进行某些迭代操作，比如 `for...of` 实际上就是调用了它的 `@@iterator` 方法。

```js
const infos = {
  name: "why",
  age: 18,
  height: 1.88,

  [Symbol.iterator]: function () {
    const entries = Object.entries(this);
    let index = 0;
    const iterator = {
      next: function () {
        if (index < entries.length) {
          return { done: false, value: entries[index++] };
        } else {
          return { done: true };
        }
      },
    };
    return iterator;
  },
};
```

很多原生对象已经实现了可迭代协议：String、Array、Map、Set、arguments 对象、NodeList 集合。

应用场景：

- 语法：`for...of`、展开语法、`yield*`、解构赋值；
- 创建对象：`new Map([iterable])`、`new Set([iterable])`、WeakMap / WeakSet 同理；
- 方法调用：`Promise.all(iterable)`、`Promise.race(iterable)`、`Array.from(iterable)`。

### 自定义类的迭代

Array、Set、String、Map 创建出来的对象都是可迭代对象。想让自己的类创建出来的对象默认可迭代，只要在类里加上 `@@iterator` 方法：

```js
class Person {
  constructor(name, age, height, friends) {
    this.name = name;
    this.age = age;
    this.height = height;
    this.friends = friends;
  }

  [Symbol.iterator]() {
    let index = 0;
    const iterator = {
      next: () => {
        if (index < this.friends.length) {
          return { done: false, value: this.friends[index++] };
        } else {
          return { done: true };
        }
      },
    };
    return iterator;
  }
}

const p1 = new Person("why", 18, 1.88, ["curry", "kobe", "james"]);

for (const item of p1) {
  console.log(item);
}
```

### 迭代器的中断

遍历过程中通过 `break`、`return`、`throw` 中断循环，或者在解构时没有解构所有的值，都会中断迭代器。

想监听中断，可以在迭代器里添加 `return` 方法：

```js
const iterator = {
  next: () => {
    // ...
  },
  return: () => {
    console.log("监听到迭代器中断了");
    return { done: true };
  },
};
```

## 生成器

### 认识生成器

生成器是 ES6 新增的一种函数控制方案，可以更灵活地控制函数什么时候继续执行、什么时候暂停。

生成器函数也是函数，但和普通函数有一些区别：

- 需要在 `function` 后面加一个 `*`；
- 可以通过 `yield` 关键字控制函数的执行流程；
- 调用生成器函数，返回值是一个 Generator（生成器）。

生成器事实上是一种特殊的迭代器。

### 生成器的使用

调用 `next` 可以让它继续执行，`next` 会执行到下一次遇到 `yield` 为止。

```js
function* foo() {
  console.log("1111");
  console.log("2222");
  yield;
  console.log("3333");
  console.log("4444");
  yield;
  console.log("5555");
  console.log("6666");
}

const generator = foo();

generator.next(); // 1111 2222
generator.next(); // 3333 4444
generator.next(); // 5555 6666
```

参数与返回值：

- 参数在 `yield` 的前面（`next` 传入的值会成为上一个 `yield` 表达式的返回值）；
- 返回值在 `yield` 的后面（`{ value, done }` 里的 value）；
- 第一个参数在获得生成器时传入。

```js
function* foo2(name1) {
  console.log("执行内部代码:1111", name1);
  const name2 = yield "aaaa"; // name2 是下一次 next 传入的参数，"aaaa" 是返回对象的 value
  console.log("执行内部代码:3333", name2);
  const name3 = yield "bbbb";
  console.log("执行内部代码:5555", name3);
  yield "cccc";
  return undefined;
}

const generator2 = foo2("next1");
console.log(generator2.next()); // { value: 'aaaa', done: false }
console.log(generator2.next("next2")); // { value: 'bbbb', done: false }
console.log(generator2.next("next3")); // { value: 'cccc', done: false }
```

### 生成器提前返回

**return**：可以给生成器函数传参。传值之后生成器函数就会结束，之后调用 `next` 不会再生成值。

```js
console.log(generator2.next());
console.log(generator2.return("next2")); // { value: 'next2', done: true }
console.log(generator2.next("next3")); // { value: undefined, done: true }
```

**throw**：除了传参，还可以向生成器函数内部抛出异常，异常可以在生成器函数里被捕获。

- 抛出异常后可以在生成器函数中捕获；
- 但 catch 语句中不能继续 `yield` 新值，可以在 catch 语句外继续 `yield` 中断函数执行。

```js
console.log(generator3.next());
console.log(generator3.throw(new Error("next2 throw error")));
```

### 生成器替代迭代器

因为生成器本身就是特殊的迭代器，用 `yield*` 可以直接产出一个可迭代对象，写起来比自己维护 `index` 简单得多。

```js
function* createArrayIterator(arr) {
  yield* arr;
}
```

类里同样可以：

```js
class Person2 {
  constructor(name, age, height, friends) {
    this.name = name;
    this.age = age;
    this.height = height;
    this.friends = friends;
  }

  *[Symbol.iterator]() {
    yield* this.friends;
  }
}
```

## 异步 async-await

### 网络请求异步处理

需求：向服务器连发三次请求，第二次的 url 依赖第一次的结果，第三次依赖第二次，依次类推。

先把请求封装成一个返回 Promise 的方法：

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 2000);
  });
}
```

**方式一：层层嵌套（回调地狱 callback hell）**

```js
function getData1() {
  requestData("why").then((res1) => {
    console.log("第一次结果:", res1);
    requestData(res1 + "kobe").then((res2) => {
      console.log("第二次结果:", res2);
      requestData(res2 + "james").then((res3) => {
        console.log("第三次结果:", res3);
      });
    });
  });
}
```

**方式二：用 Promise 重构（解决回调地狱）**

```js
function getData2() {
  requestData("why")
    .then((res1) => {
      console.log("第一次结果:", res1);
      return requestData(res1 + "kobe");
    })
    .then((res2) => {
      console.log("第二次结果:", res2);
      return requestData(res2 + "james");
    })
    .then((res3) => {
      console.log("第三次结果:", res3);
    });
}
```

**方式三：利用生成器**

```js
function* getData3() {
  const res1 = yield requestData("why");
  console.log("res1:", res1);
  const res2 = yield requestData(res1 + "kobe");
  console.log("res2:", res2);
  const res3 = yield requestData(res2 + "james");
  console.log("res3:", res3);
}

const generator4 = getData3();
generator4.next().value.then((res1) => {
  generator4.next(res1).value.then((res2) => {
    generator4.next(res2).value.then((res3) => {
      generator4.next(res3);
    });
  });
});
```

**方式四：生成器函数自动化**

上面的手动 `next` 也可以自动执行——写一个递归函数，把每次的结果再传回生成器，直到 `done` 为止。

```js
function execGenFn(genFn) {
  const generator = genFn();
  function exec(res) {
    const result = generator.next(res);
    if (result.done) return;
    result.value.then((res) => {
      exec(res);
    });
  }
  exec();
}

execGenFn(getData3);
```

这种方式就是 async/await 的雏形。

**方式五：async/await**

```js
async function getData5() {
  const res1 = await requestData("why");
  console.log("res1:", res1);
  const res2 = await requestData(res1 + "kobe");
  console.log("res2:", res2);
  const res3 = await requestData(res2 + "james");
  console.log("res3:", res3);
}
```

### 异步函数 async function

`async` 是 asynchronous 的缩写，表示异步；`sync` 是 synchronous 的缩写，表示同步。

```js
async function foo() {}

const bar = async function () {};

const baz = async () => {};

class Person3 {
  async running() {}
}
```

异步函数的执行流程：

- 内部代码的执行过程和普通函数一致，默认也是同步执行；
- 有返回值时和普通函数有区别（与 Promise 的三个状态一样）：
  - 返回值相当于被包裹到 `Promise.resolve` 中；
  - 如果返回值本身是 Promise，状态由这个 Promise 决定；
  - 如果返回值是实现了 thenable 的对象，由对象的 then 方法决定；
- 在 async 中抛出异常，程序不会像普通函数那样直接报错，而是作为 Promise 的 reject 传递。

**await 关键字**：

- 只能在 async 函数内部使用，普通函数里不行；
- 通常后面跟一个返回 Promise 的表达式；
- await 会等 Promise 变成 fulfilled 后，继续执行异步函数；
- 从 await 到下一个 await 之间的代码，可以当作 then 来理解。

返回值规则：

- await 后面是普通值，直接返回这个值；
- await 后面是 thenable 对象，根据对象的 then 方法调用决定后续的值；
- await 后面的 Promise 是 rejected，那么会把 reject 结果作为函数 Promise 的 reject 值。

```js
async function foo2() {
  console.log("-------");
  const res1 = await bar2();
  console.log("await 后面的代码:", res1);
  const res2 = await bar2();
  console.log("await 后面的代码:", res2);
  console.log("+++++++");
}
```

## 进程与线程

### 概念

- 进程（process）：计算机已经运行的程序，是操作系统管理程序的一种方式。可以认为启动一个应用程序就会默认启动一个进程（也可能是多个）。
- 线程（thread）：操作系统能够运行运算调度的最小单位，通常被包含在进程中。每一个进程都会启动至少一个线程来执行程序中的代码，这个线程叫主线程。
- 所以也可以说进程是线程的容器。

形象一点：操作系统像一个大工厂，工厂里的车间是进程，车间里的工人是线程。

![进程与线程](https://img.nkdshinku.com/images/posts/js-advance-5/process-thread.png)

操作系统的工作方式：CPU 运算速度非常快，可以在多个进程之间快速切换，做到同时运行多个进程的效果。进程中的线程获取到时间片时，就可以快速执行我们编写的代码，用户感受不到这种快速切换。

### 浏览器中的 JavaScript

JS 的容器进程是浏览器或者 Node。

- 目前多数浏览器是多进程的：打开一个 tab 页面就会开启一个新的进程，这是为了防止一个页面卡死导致所有页面无法响应、整个浏览器强制退出；
- 每个进程中又有很多线程，其中包括执行 JavaScript 代码的线程；
- JavaScript 是单线程的（可以开启 workers），意味着同一时刻只能做一件事，如果这件事很耗时，当前线程就会被阻塞；
- 所以真正耗时的操作，是交给浏览器的其他线程来完成的。

### 事件循环

- JS 解析一段代码时，会把同步代码按顺序排进执行栈，依次执行里面的函数；
- 遇到异步任务时交给其他线程处理；
- 当前执行栈的同步代码全部执行完后，会从队列里取出已完成的异步任务回调，加入执行栈继续执行，遇到异步任务又交给其他线程；
- 如此循环往复。其他异步任务完成后，会把回调放进任务队列，等着执行栈来取。

![事件循环](https://img.nkdshinku.com/images/posts/js-advance-5/event-loop.png)

### 宏任务、微任务

事件循环中不是只有一个队列，事实上维护了两个：

- 宏任务队列（macrotask queue）：ajax、setTimeout、DOM 监听、UI Rendering 等；
- 微任务队列（microtask queue）：Promise 的 then 回调、MutationObserver API、`queueMicrotask()` 等。

代码的优先级：

- main script 中的代码优先执行（也就是顶层 script 代码）；
- 在执行任何一个宏任务之前，都会先查看微任务队列里是否有任务需要执行；
- 也就是说宏任务执行之前必须保证微任务队列是空的，不为空就优先执行微任务队列里的回调。

### 事件循环相关经典题目

**题目一**

```js
console.log("script start");

setTimeout(function () {
  console.log("setTimeout1");
  new Promise(function (resolve) {
    resolve();
  }).then(function () {
    new Promise(function (resolve) {
      resolve();
    }).then(function () {
      console.log("then4");
    });
    console.log("then2");
  });
});

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("then1");
});

setTimeout(function () {
  console.log("setTimeout2");
});

console.log(2);

queueMicrotask(() => {
  console.log("queueMicrotask1");
});

new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("then3");
});

console.log("script end");

// script start → promise1 → 2 → script end
// then1 → queueMicrotask1 → then3
// setTimeout1 → then2 → then4 → setTimeout2
```

**题目二**

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});

console.log("script end");

// script start → async1 start → async2 → promise1 → script end
// async1 end → promise2
// setTimeout
```

## 写在最后

这一篇里最「神清气爽」的是生成器那一节：先是自己维护 `index` 写迭代器，然后用 `yield*` 一行搞定；再往下，把生成器自动化执行的那段代码改写成 async/await，几乎就是同一件事换了写法。

事件循环的经典题目我当年也抄了两道，答案是对的，但说实话是「背下来的正确」——真正弄懂还是靠后面写项目时踩坑。

下一篇是进阶的最后一篇：额外知识（异常、storage、正则）、手写防抖节流拷贝事件总线，以及网络请求。
