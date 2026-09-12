---
title: JavaScript 进阶 6：异常、手写题与网络请求
cover: https://img.nkdshinku.com/images/posts/js-advance-6.webp
description: 2024 年学 JavaScript 进阶时记下的笔记：异常处理与 Error、localStorage/sessionStorage、正则表达式、手写防抖节流深拷贝事件总线，以及 HTTP、XHR 与 Fetch。
date: 2024-06-19
category: 笔记
tags:
  - JavaScript
  - 进阶
  - 网络请求
keywords:
  - 异常处理
  - 正则表达式
  - 防抖节流
  - XMLHttpRequest
  - 前端自学笔记
---

JavaScript 进阶笔记的最后一篇，内容最杂：异常处理、storage、正则表达式、四个手写题，还有网络请求。

这部分像是「收尾大礼包」——把前面没归类的知识点统统塞了进来。

## 异常处理方案

开发中封装的工具函数是给别人用的，使用者可能传进来不符合预期的参数（比如想要数组却传了字符串），所以函数内部需要对参数做验证。

不严谨的做法是直接 `return`，弊端是调用者不知道是函数没正常执行，还是结果本来就是 `undefined`。

更好的做法是用 `throw` 关键字抛出异常：

- `throw` 语句用于抛出一个用户自定义的异常；
- 遇到 `throw` 时，当前函数执行会被停止（后面的语句不执行）；
- 执行代码时会报错，拿到错误信息就能及时修正。

`throw` 后面可以跟基本数据类型（number、string、Boolean），也可以跟对象类型——对象能包含更多信息。

```js
class HYError {
  constructor(message, code) {
    this.errMessage = message;
    this.errCode = code;
  }
}

function foo() {
  console.log("foo function1");

  // throw "发生错误"
  // throw { errMessage: "我是错误信息", errCode: -1001 }
  // throw new HYError("错误信息", -1001)
  throw new Error("我是错误信息");

  console.log("foo function2");
}
```

**Error 类型**：JavaScript 提供了 Error 类，可以直接创建它的对象。Error 包含三个属性：

- `message`：创建 Error 对象时传入的信息；
- `name`：Error 的名称，通常和类名一致；
- `stack`：整个错误信息，包括函数的调用栈，直接打印 Error 对象时打印的就是它。

Error 还有一些子类：

- `RangeError`：下标值越界时使用的错误类型；
- `SyntaxError`：解析语法错误时使用的错误类型；
- `TypeError`：出现类型错误时使用的错误类型。

异常的处理：函数抛出异常后，如果没有被处理，异常会继续传递到上一个函数调用中；如果到了最顶层的全局代码依然没有处理，就会报错并终止程序。

`try...catch` 可以在发现异常时避免程序终止，ES10 中 catch 后面绑定的 error 还可以省略。必须执行的代码放在 `finally` 里：

```js
function test() {
  try {
    foo();
  } catch (error) {
    console.log("catch 中的代码");
  } finally {
    console.log("finally 代码");
  }
}
```

自己捕获了异常，异常就不会传给浏览器，后续代码可以正常执行。

## storage

WebStorage 提供了一种比 cookie 更直观的 key-value 存储方式：

- `localStorage`：永久性存储，关闭网页重新打开后内容依然保留；
- `sessionStorage`：会话存储，关闭会话后内容会被清除。

区别：

1. 关闭网页后重新打开，localStorage 保留，sessionStorage 被删除；
2. 在页面内跳转，两者都保留；
3. 跳到页面外（打开新的网页），localStorage 保留，sessionStorage 不保留。

属性与方法：

- `Storage.length`：只读，表示存储中的数据项数量；
- `Storage.key(index)`：返回第 n 个 key 名称；
- `getItem()` / `setItem()` / `removeItem()` / `clear()`。

简单封装一下：

```js
class Cache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage;
  }

  setCache(key, value) {
    if (!value) {
      throw new Error("value error: value 必须有值!");
    }
    this.storage.setItem(key, JSON.stringify(value));
  }

  getCache(key) {
    const result = this.storage.getItem(key);
    if (result) {
      return JSON.parse(result);
    }
  }

  removeCache(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

const localCache = new Cache();
const sessionCache = new Cache(false);
```

## 正则表达式

### 初步认识

正则表达式是一种字符串匹配利器，可以帮助我们搜索、获取、替换字符串。它由两部分组成：模式（patterns）和修饰符（flags）。

```js
const re1 = /aaa/gi;
const re2 = new RegExp("aaa", "gi");
```

### 适用于正则的方法

RegExp 上的方法：

- `exec`：在字符串中执行查找匹配，返回一个数组，未匹配到返回 `null`；
- `test`：测试是否匹配，返回 true / false。

String 上的方法：

- `match`：查找匹配，返回数组，未匹配到返回 `null`；
- `matchAll`：查找所有匹配，返回一个迭代器；
- `search`：测试匹配，返回匹配到的位置索引，失败返回 -1；
- `replace`：查找匹配并替换；
- `split`：按正则或固定字符串分隔，把结果存到数组里。

### 修饰符 flags

- `g`：匹配全部；
- `i`：忽略大小写；
- `m`：多行匹配。

### 字符类

- `\d`（digit）：数字，0 到 9；
- `\s`（space）：空格符号，包括空格、制表符 `\t`、换行符 `\n`，以及 `\v`、`\f`、`\r` 这些；
- `\w`（word）：拉丁字母、数字或下划线；
- `.`：除换行符之外的任何字符；
- `\D` / `\S` / `\W`：分别是上面三个的「非」。

### 锚点

`^` 匹配文本开头，`$` 匹配文本末尾。

词边界 `\b`：像 `^` 和 `$` 一样，检查字符串中的位置是否处于词边界——它检查位置的一侧匹配 `\w`，另一侧不匹配。

### 转义字符

把特殊字符当作常规字符使用时要转义，在它前面加一个反斜杠即可。常见的需要转义的字符：`[] \ ^ $ . | ? * + ( )`。斜杠 `/` 本身不是特殊符号，但在字面量正则表达式里也需要转义。

### 集合（Sets）和范围（Ranges）

方括号里的几个字符或字符类表示「搜索其中的任意一个」：

- 集合：`[eao]` 表示查找 `a`、`e`、`o` 中的任意一个；
- 范围：`[a-z]` 匹配 a 到 z 的字母，`[0-5]` 表示 0 到 5 的数字，`[0-9A-F]` 表示两个范围；
- `\d` 和 `[0-9]` 相同，`\w` 和 `[a-zA-Z0-9_]` 相同；
- 排除范围：`[^…]` 表示「除了这些字符」。

### 量词（Quantifiers）

想找一段长度不固定的数字时，就要用数量范围来描述：

- `{n}`：确切的位数，比如 `{5}`；
- `{3,5}`：某个范围的位数。

缩写：

- `+`：一个或多个，相当于 `{1,}`；
- `?`：零个或一个，相当于 `{0,1}`，也就是让符号变得可选；
- `*`：零个或多个，相当于 `{0,}`。

### 贪婪（Greedy）和惰性（lazy）模式

默认情况下，匹配到内容后还会继续向后查找，一直找到最后一个匹配项，这叫贪婪模式。惰性模式则相反：拿到对应的内容后就不再往后匹配，在量词后面再加一个 `?` 就能启用，比如 `*?`、`+?`，甚至把 `?` 变成 `??`。

```js
const message = "我最喜欢的两本书: 《黄金时代》和《沉默的大多数》、《一只特立独行的猪》";

// 默认 .+ 采用贪婪模式
const nameRe1 = /《.+》/gi;
console.log(message.match(nameRe1));
// ['《黄金时代》和《沉默的大多数》、《一只特立独行的猪》']

// 使用惰性模式
const nameRe2 = /《.+?》/gi;
console.log(message.match(nameRe2));
// ['《黄金时代》', '《沉默的大多数》', '《一只特立独行的猪》']
```

### 捕获组（capturing group）

用括号把模式的一部分括起来就叫捕获组，它有两个作用：允许把匹配的一部分作为结果数组中的单独项；把括号里的内容视为一个整体。

`str.match(regexp)` 在没有 `g` 标志时查找第一个匹配并作为数组返回，有 `g` 时返回所有匹配：

- 索引 0：完全匹配；
- 索引 1：第一个括号的内容；
- 索引 2：第二个括号的内容；
- 依此类推。

括号多了不好数，可以用命名组：在开始括号之后立即写 `?<name>`。

有时只是需要用括号来正确应用量词，但不希望内容出现在结果里，可以用非捕获组：在开头添加 `?:`。

「或」在正则里用竖线 `|` 表示，通常和捕获组一起使用，在组内表示多个可选值。

## 手写：防抖、节流、深拷贝、事件总线

JavaScript 是事件驱动的，大量操作会触发事件并加入事件队列。对于频繁触发的事件，可以用防抖和节流来限制执行频率。

### 防抖 debounce

事件触发时不会立即执行函数，而是等待一段时间；如果在这段时间内又触发了，就重新等待。只有安静了一段时间没有新触发，才真正执行。

```js
function hydebounce(fn, delay) {
  let timer = null;

  const _debounce = () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };

  return _debounce;
}
```

### 节流 throttle

事件触发时会执行函数，但按照固定的频率执行——不管中间触发了多少次，执行次数总是固定的。

```js
function hythrottle(fn, interval) {
  let startTime = 0;

  const _throttle = function () {
    const nowTime = new Date().getTime();
    const waitTime = interval - (nowTime - startTime);
    if (waitTime <= 0) {
      fn();
      startTime = nowTime;
    }
  };

  return _throttle;
}
```

### 深拷贝

最简单的办法是 `JSON.parse(JSON.stringify(info))`，但它会丢掉函数、`undefined`、Symbol，也不能处理循环引用。

手写版本：

```js
function deepCopy(originValue, map = new WeakMap()) {
  // 0. Symbol 类型
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }

  // 1. 原始类型直接返回
  if (!isObject(originValue)) {
    return originValue;
  }

  // 2. Set 类型
  if (originValue instanceof Set) {
    const newSet = new Set();
    for (const setItem of originValue) {
      newSet.add(deepCopy(setItem, map));
    }
    return newSet;
  }

  // 3. 函数不需要深拷贝
  if (typeof originValue === "function") {
    return originValue;
  }

  // 4. 对象类型，用 map 处理循环引用
  if (map.get(originValue)) {
    return map.get(originValue);
  }
  const newObj = Array.isArray(originValue) ? [] : {};
  map.set(originValue, newObj);

  for (const key in originValue) {
    newObj[key] = deepCopy(originValue[key], map);
  }

  // 单独处理 Symbol 类型的 key
  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const symbolKey of symbolKeys) {
    newObj[symbolKey] = deepCopy(originValue[symbolKey], map);
  }

  return newObj;
}
```

### 事件总线

事件总线（Event Bus）用于在系统中传递事件和消息，基于发布-订阅模式，让不同组件之间解耦。

```js
class HYEventBus {
  constructor() {
    this.eventMap = {};
  }

  on(eventName, eventFn) {
    let eventFns = this.eventMap[eventName];
    if (!eventFns) {
      eventFns = [];
      this.eventMap[eventName] = eventFns;
    }
    eventFns.push(eventFn);
  }

  off(eventName, eventFn) {
    let eventFns = this.eventMap[eventName];
    if (!eventFns) return;
    for (let i = 0; i < eventFns.length; i++) {
      if (eventFns[i] === eventFn) {
        eventFns.splice(i, 1);
        break;
      }
    }
    if (eventFns.length === 0) {
      delete this.eventMap[eventName];
    }
  }

  emit(eventName, ...args) {
    let eventFns = this.eventMap[eventName];
    if (!eventFns) return;
    eventFns.forEach((fn) => fn(...args));
  }
}
```

## 网络请求

### 数据请求方式

**服务器端渲染（SSR）**：客户端发出请求 → 服务端接收并返回对应的 HTML 文档 → 页面刷新，客户端加载新的 HTML 文档。

![服务端渲染](https://img.nkdshinku.com/images/posts/js-advance-6/ssr.png)

缺点：

- 用户点击按钮只是数据变化，服务器却要把整个页面重新返回给浏览器加载，违背 DRY（Don't repeat yourself）原则；
- 只是数据变化却要返回整个 HTML 文档，给网络带宽带来不必要的开销。

**前后端分离**：只向服务器请求新的数据，在不让页面刷新的情况下动态替换页面中展示的数据，用的就是 AJAX。

![前后端分离](https://img.nkdshinku.com/images/posts/js-advance-6/frontend-backend-separation.png)

AJAX 是 Asynchronous JavaScript And XML（异步的 JavaScript 和 XML）的缩写，是一种实现「无页面刷新获取服务器数据」的技术：不重新加载页面就能和服务器通信，发送请求、接收并使用返回的数据。

### HTTP

**定义**：超文本传输协议（HyperText Transfer Protocol），一种用于分布式、协作式和超媒体信息系统的应用层协议。

- HTTP 是万维网数据通信的基础，最初的设计目的是提供一种发布和接收 HTML 页面的方法；
- 通过 HTTP 或 HTTPS 请求的资源由统一资源标识符（URI）标识；
- HTTP 是客户端（用户）和服务端（网站）之间请求和响应的标准；
- 客户端可以是浏览器、爬虫或其他工具，称为用户代理程序（user agent）；
- 响应方是存储资源的源服务器（origin server）。

**组成与版本**：一次 HTTP 请求主要包括请求（Request）和响应（Response）。

![HTTP 的组成](https://img.nkdshinku.com/images/posts/js-advance-6/http-composition.png)

- HTTP/0.9（1991）：只支持 GET 请求获取文本数据，主要为了获取 HTML 页面内容；
- HTTP/1.0（1996）：支持 POST、HEAD 等方法，支持请求头、响应头和更多数据类型，但每次请求都要建立一次 TCP 连接，完成后立即断开；
- HTTP/1.1（1997，使用最广泛）：增加 PUT、DELETE 等方法，采用持久连接（`Connection: keep-alive`），多个请求可以共用一个 TCP 连接；
- 2015 年发布 HTTP/2.0，2018 年发布 HTTP/3.0。

**请求方式**：

- `GET`：获取指定资源，应该只用于获取数据；
- `HEAD`：与 GET 的响应相同，但没有响应体，比如下载文件前先获取文件大小；
- `POST`：把实体提交到指定资源；
- `PUT`：用请求载荷替换目标资源的当前表示；
- `DELETE`：删除指定资源；
- `PATCH`：对资源做部分修改；
- `CONNECT`：建立到目标服务器的隧道，通常用于代理服务器，网页开发很少用；
- `TRACE`：沿路径执行消息环回测试。

**Request Header**：

![HTTP 请求头](https://img.nkdshinku.com/images/posts/js-advance-6/http-request-header.png)

- `content-type`：本次请求携带的数据类型。
  - `application/x-www-form-urlencoded`：数据被编码成以 `&` 分隔、以 `=` 连接键值的键值对；
  - `application/json`：JSON 类型；
  - `text/plain`：文本类型；
  - `application/xml`：XML 类型；
  - `multipart/form-data`：上传文件。
- `content-length`：文件的大小长度。
- `keep-alive`：HTTP 基于 TCP，通常一次请求响应结束后会断开。HTTP/1.0 中想保持连接，需要浏览器在请求头加 `Connection: keep-alive`、服务器在响应头也加同样的字段；HTTP/1.1 中所有连接默认就是 keep-alive，不同服务器保持的时间不同，Node 中默认 5 秒。
- `accept-encoding`：告知服务器客户端支持的文件压缩格式，比如 js 文件可以用 gzip 编码。
- `accept`：告知服务器客户端可接受的文件格式类型。
- `user-agent`：客户端相关信息。

**Response 响应状态码**：

- `200 OK`：请求成功；
- `201 Created`：POST 请求创建了新资源；
- `301 Moved Permanently`：资源的 URL 已修改，响应中会给出新的 URL；
- `400 Bad Request`：客户端错误，服务器无法或不进行处理；
- `401 Unauthorized`：未授权，必须携带身份信息；
- `403 Forbidden`：没有权限访问，被拒绝；
- `404 Not Found`：服务器找不到请求的资源；
- `500 Internal Server Error`：服务器遇到了不知道如何处理的情况；
- `503 Service Unavailable`：服务器不可用，可能在维护或重载。

![HTTP 响应头](https://img.nkdshinku.com/images/posts/js-advance-6/http-response-headers.png)

### XMLHttpRequest（XHR）

**AJAX 发送请求的步骤**：

1. 创建 XMLHttpRequest 对象；
2. 监听对象状态的变化，或者监听 `onload` 事件（请求完成时触发）；
3. 通过 `open` 方法配置请求（默认异步，第三个参数传 `false` 就是同步请求，会阻塞后续代码）；
4. 通过 `send` 发送请求。

```js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState !== XMLHttpRequest.DONE) return;
  const resJSON = JSON.parse(xhr.response);
  console.log(resJSON.data.banner.list);
};

xhr.open("get", "url");
xhr.send();
```

**事件监听**（宏任务）：

- `readystatechange`：HTTP 状态改变；
- `loadstart`：请求开始；
- `progress`：一个响应数据包到达；
- `abort`：调用 `xhr.abort()` 取消了请求；
- `error`：连接错误（比如域错误，404 这类 HTTP 错误不会触发它）；
- `load`：请求成功完成；
- `timeout`：请求超时被取消（仅发生在设置了 timeout 时）；
- `loadend`：在 load、error、timeout 或 abort 之后触发。

**state 状态**：

- `0 UNSENT`：代理被创建，但还没调用 `open()`；
- `1 OPENED`：`open()` 已经调用；
- `2 HEADERS_RECEIVED`：`send()` 已经调用，头部和状态可获取；
- `3 LOADING`：下载中，`responseText` 已包含部分数据；
- `4 DONE`：下载完成。

**响应数据和响应类型**：`response` 属性返回响应的正文内容，类型取决于 `responseType`。早期服务器返回的是文本和 XML，所以常用 `responseText`、`responseXML`，再手动转成 JS 对象；现在基本都返回 JSON，直接设置即可。

```js
xhr.responseType = "json";
console.log(xhr.response); // 自动转成对象
```

注意：XHR 的 state 记录的是对象本身的状态变化，不是 HTTP 请求的状态；要拿 HTTP 响应状态，用 `status` 和 `statusText`。

**GET / POST 传递参数**：用 `xhr.setRequestHeader("Content-type", "类型")` 设置传递类型，常见的四种方式：

```js
const xhr = new XMLHttpRequest();
xhr.onload = function () {
  console.log(xhr.response);
};
xhr.responseType = "json";

// 1. GET：query 参数
xhr.open("get", "https://example.com/api?name=why&age=18");

// 2. POST：urlencoded
xhr.open("post", "https://example.com/api");
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send("name=why&age=18");

// 3. POST：FormData
const formEl = document.querySelector(".info");
xhr.open("post", "https://example.com/api");
const formData = new FormData(formEl);
xhr.send(formData);

// 4. POST：JSON
xhr.open("post", "https://example.com/api");
xhr.setRequestHeader("Content-type", "application/json");
xhr.send(JSON.stringify({ name: "why", age: 18, height: 1.88 }));
```

**封装一个请求工具**：

```js
function hyajax({ url, method = "get", data = {}, success, failure } = {}) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      success && success(xhr.response);
    } else {
      failure && failure({ status: xhr.status, message: xhr.statusText });
    }
  };

  xhr.responseType = "json";

  if (method.toUpperCase() === "GET") {
    const queryStrings = [];
    for (const key in data) {
      queryStrings.push(`${key}=${data[key]}`);
    }
    xhr.open(method, url + "?" + queryStrings.join("&"));
    xhr.send();
  } else {
    xhr.open(method, url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
  }

  return xhr;
}
```

```js
hyajax({
  url: "https://example.com/api",
  method: "GET",
  data: { name: "why", age: 18 },
  success: function (res) {
    console.log("res:", res);
  },
  failure: function (err) {
    console.log(err);
  },
});
```

**超时与取消**：为避免服务器长时间不返回数据，可以给请求设置 `timeout`。到达超时时间后请求会被自动取消；默认值为 0，表示不设置超时。

```js
xhr.timeout = 3000; // 3s 超时
xhr.abort(); // 手动取消请求
```

### Fetch 函数使用

`json()` 是 Fetch API 中 Response 对象的方法，用于把响应体文本解析成 JSON 对象。

```js
// 1. 未优化：嵌套的 then
fetch("https://example.com/api").then((res) => {
  res.json().then((res) => {
    console.log("res:", res);
  });
}).catch((err) => {
  console.log("err:", err);
});

// 2. 优化一：把 json() 的 Promise 返回出去
fetch("https://example.com/api")
  .then((res) => res.json())
  .then((res) => {
    console.log("res:", res);
  })
  .catch((err) => {
    console.log("err:", err);
  });

// 3. 优化二：async/await
async function getData() {
  const response = await fetch("https://example.com/api");
  const res = await response.json();
  console.log("res:", res);
}
getData();
```

## 写在最后

到这一篇，2024 年的 JavaScript 笔记就整理完了。回头看，进阶篇覆盖的东西比基础篇杂得多：原理、API、手写题、网络请求都有，像是把「想搞明白的东西」一次性都记了下来。

手写题那几个（防抖、节流、深拷贝、事件总线）算是这批笔记里最实用的部分，后来做项目遇到类似需求，基本都能直接翻回来改一改就用。

前端笔记到这里还剩 Vue 一篇，写完就收工。
