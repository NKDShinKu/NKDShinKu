---
title: Vue 基础：2024 年的一份学习笔记
cover: https://img.nkdshinku.com/images/posts/vue-basics-cover.webp
description: 2024 年学 Vue 时记下的笔记：Vue2 的指令、计算属性、生命周期、组件通信与插槽，VueRouter 路由、Vuex 状态管理，以及 Vue3 组合式 API。
date: 2024-08-14
category: 笔记
tags:
  - Vue
  - 前端框架
  - 组件化
keywords:
  - Vue2 基础
  - VueRouter
  - Vuex
  - Vue3 组合式 API
  - 前端自学笔记
---

Vue 这份笔记是 2024 年前端学习笔记的最后一篇，从 Vue2 的选项式一路记到 Vue3 的组合式。

这也是第一次接触框架：从「操作 DOM」换到「操作数据」，一开始很不适应，写顺之后确实回不去了。

## 创建 Vue 实例

步骤：

1. 准备容器；
2. 引入 Vue（官网的开发版本 / 生产版本）；
3. `new Vue()` 创建实例；
4. 指定配置项，渲染数据。

```html
<!-- 准备容器 -->
<div id="app">
  <h1>{{ data1 }}</h1>
  <p>{{ data2 }}</p>
</div>

<!-- 引入包 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      data1: "genshin",
      data2: "abccba",
    },
    methods: {
      fn() {},
    },
  });
</script>
```

- `el`：指定容器；
- `data`：提供数据，里面的数据最终会被添加到实例上，比如 `app.data1`；
- `methods`：提供处理逻辑的函数。

## 基础使用

### 插值表达式 `{{}}`

- 作用：利用表达式进行插值，渲染到页面中。表达式是可以被求值的代码，JS 引擎会计算出一个结果。
- 语法：`{{ 表达式 }}`。
- 注意：使用的数据要存在（在 data 里）；支持的是表达式而不是语句（`if`、`for` 不行）；不能在标签属性里使用。

### Vue 指令

**v-html**

- 作用：动态设置元素的 innerHTML；
- 语法：`v-html = "表达式"`。

**v-show**

- 作用：控制元素显示隐藏；
- 语法：`v-show = "表达式"`，值为 true 显示、false 隐藏；
- 原理：切换 `display: none`；
- 场景：频繁切换显示隐藏。

**v-if**

- 作用：控制元素显示隐藏（条件渲染）；
- 语法：`v-if = "表达式"`；
- 原理：基于条件判断，创建或移除元素节点；
- 场景：要么显示要么隐藏、不频繁切换。

**v-else 和 v-else-if**

- 作用：辅助 v-if 进行判断渲染；
- 语法：`v-else`、`v-else-if = "表达式"`；
- 注意：需要紧挨着 v-if 一起使用。

**v-on**

- 作用：注册事件；
- 语法：`v-on:事件名 = "内联语句"` 或 `v-on:事件名 = "methods 中的函数名"`；
- 简写：`@事件名`；
- 注意：methods 函数内的 this 指向 Vue 实例。

**v-bind**

- 作用：动态设置 HTML 的标签属性；
- 语法：`v-bind:属性名="表达式"`；
- 简写：`:属性名="表达式"`。

**v-for**

- 作用：基于数据循环，多次渲染整个元素；
- 语法：`v-for = "(item, index) in 数组"`，简写 `v-for = "item in 数组"`。

**v-model**

- 作用：给表单元素使用，实现双向数据绑定——数据变化视图自动更新，视图变化数据自动更新；
- 语法：`v-model = "变量"`。

### 指令修饰符

- 按键修饰符：`@keyup.enter` 监听键盘回车。
- v-model 修饰符：`v-model.trim` 去除首尾空格、`v-model.number` 转数字。
- 事件修饰符：`@事件名.stop` 阻止冒泡、`@事件名.prevent` 阻止默认行为。

### v-bind 对样式的增强

`:class` 可以绑定对象或数组：

- 对象：键是类名，值是布尔值，为 true 就有这个类。

```html
<div class="box" :class="{ 类名1: 布尔值, 类名2: 布尔值 }"></div>
```

- 数组：数组里所有的类都会添加到元素上，本质是一个 class 列表。

```html
<div class="box" :class="[类名1, 类名2]"></div>
```

典型用法是 tab 导航高亮。

`:style` 绑定样式对象，适合动态设置某个具体属性：

```html
<div class="box" :style="{ CSS属性名1: 值, CSS属性名2: 值 }"></div>
```

### v-model 应用于其他表单元素

常见的表单元素都可以用 v-model 绑定，快速获取或设置值：

- 输入框 `input:text` → value；
- 文本域 `textarea` → value；
- 复选框 `input:checkbox` → checked；
- 单选框 `input:radio` → checked；
- 下拉菜单 `select` → value。

### computed 计算属性

概念：基于现有数据计算出来的新属性，依赖的数据变化时会自动重新计算。声明在 `computed` 配置项中，一个计算属性对应一个函数，使用起来和普通属性一样（`{{ 计算属性名 }}`）。

简写形式只能读取，不能修改：

```js
computed: {
  计算属性名() {
    return 结果;
  }
}
```

需要修改操作时，要写完整写法（get / set）：

```js
computed: {
  计算属性名: {
    get() {
      return 结果;
    },
    set(修改的值) {
      // 修改逻辑
    }
  }
}
```

computed 与 methods 的区别：

- computed：封装一段对数据的处理、求得一个结果，作为属性直接使用（`this.计算属性`、`{{ 计算属性 }}`）；
- methods：给实例提供一个方法，作为方法需要调用（`this.方法名()`、`{{ 方法名() }}`、`@事件名="方法名"`）。
- computed 有缓存特性：计算出来的结果会被缓存，再次使用直接读缓存；依赖项变化时才重新计算并再次缓存。

### watch 侦听器

作用：监视数据变化，执行一些业务逻辑或异步操作。

相关配置：

- `deep: true`：对复杂类型深度监视；
- `immediate: true`：初始化时立刻执行一次 handler；
- `handler`：执行核心代码的函数。

```js
watch: {
  数据属性名: {
    deep: true,
    immediate: true,
    handler(newValue, oldValue) {
      console.log(newValue, oldValue);
    }
  },
  "对象.数据属性名": {}
}
```

不需要额外配置时可以直接写函数：

```js
watch: {
  数据属性名(newValue, oldValue) {
    // 核心代码
  }
}
```

## 生命周期

定义：一个 Vue 实例从创建到销毁的整个过程，分为四个阶段：

1. 创建：响应式数据等，阶段末可以发送初始化渲染请求；
2. 挂载：渲染模板，阶段末可以操作 DOM；
3. 更新：用户修改数据、更新视图，这是一个循环过程；
4. 销毁：销毁实例，也就是关掉网页。

Vue 在生命周期过程中会自动运行一些函数，叫生命周期钩子，让开发者可以在特定阶段运行自己的代码。八个钩子是：

`beforeCreate` 和 `created`、`beforeMount` 和 `mounted`、`beforeUpdate` 和 `updated`、`beforeDestroy` 和 `destroyed`。

一般用 `created` 发送初始化渲染请求，用 `mounted` 操作 DOM。

```js
beforeCreate() {
  console.log("beforeCreate 响应式数据准备好之前", this.count);
},
created() {
  console.log("created 响应式数据准备好之后", this.count);
  // 可以开始发送初始化渲染的请求了
},
beforeMount() {
  console.log("beforeMount 模板渲染之前", document.querySelector("h3").innerHTML);
},
mounted() {
  console.log("mounted 模板渲染之后", document.querySelector("h3").innerHTML);
  // 可以开始操作 DOM 了
},
beforeUpdate() {
  console.log("beforeUpdate 数据修改了，视图还没更新");
},
updated() {
  console.log("updated 数据修改了，视图已经更新");
},
beforeDestroy() {
  // 清除掉一些 Vue 以外的资源占用，定时器、延时器……
},
destroyed() {
  console.log("destroyed，卸载后");
}
```

## Vue 脚手架与工程化

### 安装使用

Vue CLI 是 Vue 官方提供的全局命令工具，可以快速创建一个开发 Vue 项目的标准化基础架子（集成了 webpack 配置）。

```bash
npm i @vue/cli -g   # 全局安装
vue create project-name   # 创建项目架子
```

### 组件式开发

组件化：一个页面可以拆分成一个个组件，每个组件有自己独立的结构、样式、行为，便于维护和复用。

- `index.html`：模板文件；
- `main.js`：入口文件，引入 vue、App.vue 以及其他全局组件；
- `App.vue`：根组件，整个应用最上层的组件，包裹所有普通小组件；
- 其他普通组件（`xxx.vue`）放在 `components` 文件夹里，还可以继续细分。

注意组件命名需要大驼峰。

局部注册（只在注册的组件内使用）：

```js
import HmHeader from "./components/HmHeader";

export default {
  components: {
    HmHeader,
  },
};
```

全局注册（所有组件内都能使用），写在 main.js：

```js
import HmButton from "./components/HmButton";

Vue.component("HmButton", HmButton);
```

### 组件的三大组成部分

**结构 template**：Vue2 中只能有一个根元素。

**样式 style**：

- 默认组件中的样式会作用到全局，容易造成多个组件之间的样式冲突；
- 给组件加上 `scoped` 属性，可以让样式只作用于当前组件。
- 技巧：公共样式在 main.js 里注册，`import './style/index.css'`。

**逻辑 script**：

- `el` 是根实例独有的；
- 组件中的 `data` 必须是一个函数，保证每个组件实例维护独立的一份数据对象。

```js
data() {
  return {};
}
```

## 组件通信

组件的数据是独立的，无法直接访问其他组件的数据，需要专门的方案。组件关系分两类，对应的解决方式也不同：

- 父子关系 → props & \$emit；
- 非父子关系 → provide & inject 或 event bus；
- 通用方案 → Vuex。

### 父子关系

**父传子 props**：

1. 父组件给子组件添加属性传值（用 v-bind）；
2. 子组件用 props 接收；
3. 子组件使用。

![父传子 props](https://img.nkdshinku.com/images/posts/vue-basics/props.png)

props 也可以写成带校验的对象形式：

```js
props: {
  校验的属性名: {
    type: Number, // Number String Boolean ...
    required: true, // 是否必填
    default: 默认值,
    validator(value) {
      // 自定义校验逻辑，返回 Boolean
      return true;
    }
  }
}
```

**子传父 \$emit**：

1. 子组件 `$emit` 发送消息；
2. 父组件给子组件添加消息监听；
3. 父组件实现处理函数。

![子传父 $emit](https://img.nkdshinku.com/images/posts/vue-basics/emit.png)

```js
methods: {
  add() {
    this.$emit("add", 传入值);
  }
}
```

**props 与 data 的区别**：data 的数据是自己的，可以随便改；props 的数据是外部的，不能直接改，要遵循单向数据流。

### 非父子关系

**event bus（事件总线）**：用于非父子组件之间进行简易的消息传递。

1. 创建一个都能访问到的事件总线（空 Vue 实例），放在 `utils/EventBus.js`：

```js
import Vue from "vue";
const Bus = new Vue();
export default Bus;
```

2. A 组件（接收方）监听 Bus 实例的事件：

```js
created() {
  Bus.$on("sendMsg", (msg) => {
    this.msg = msg;
  });
}
```

3. B 组件（发送方）触发事件：

```js
Bus.$emit("sendMsg", "这是一个消息");
```

**provide & inject**：用于跨层级共享数据。

父组件 provide 提供数据：

```js
export default {
  provide() {
    return {
      color: this.color, // 普通类型：非响应式
      userInfo: this.userInfo, // 复杂类型：响应式
    };
  },
};
```

子 / 孙组件 inject 取值：

```js
export default {
  inject: ["color", "userInfo"],
  created() {
    console.log(this.color, this.userInfo);
  },
};
```

## 进阶语法

### v-model 原理

v-model 本质上是一个语法糖：用在输入框上，就是 value 属性和 input 事件的合写。

```html
<input v-model="msg" type="text" />
<input :value="msg" @input="msg = $event.target.value" type="text" />
```

`$event` 用于在模板中获取事件的形参。

### 表单类组件封装与 v-model 简化

封装表单类组件实现父子数据双向绑定：

- 父传子：数据通过 props 传给子组件，拆解 v-model 绑定的数据；
- 子传父：监听输入，子组件把值传给父组件修改。

父组件用 v-model 简化（子组件 props 通过 value 接收，事件触发 input）：

```html
<BaseSelect :cityId="selectId" @事件名="selectId = $event" />
<BaseSelect v-model="selectId"></BaseSelect>
```

```js
props: {
  cityId: String;
  // 父组件用 v-model 时，这里要用 value 接收
},

methods: {
  handleChange(e) {
    this.$emit("事件名", e.target.value);
  }
}
```

### .sync 修饰符

- 作用：实现子组件与父组件数据的双向绑定，简化代码；
- 特点：prop 属性名可以自定义，不固定为 value；
- 场景：封装弹框类组件，`visible` 为 true 显示、false 隐藏；
- 本质：`:属性名` 和 `@update:属性名` 的合写。

```html
<!-- 父组件 -->
<BaseDialog :visible.sync="isShow" />

<!-- 等价于 -->
<BaseDialog :visible="isShow" @update:visible="isShow = $event" />
```

```js
// 子组件
props: { visible: Boolean },
this.$emit("update:visible", false)
```

### ref 和 $refs

作用：获取 DOM 元素或组件实例。查找范围是当前组件内，比 querySelector 更精确稳定。

获取 DOM：

```html
<div ref="chartRef">我是渲染图表的容器</div>
```

```js
mounted() {
  console.log(this.$refs.chartRef);
}
```

获取组件：给组件加 ref，之后就能调用组件对象里的方法。

```html
<BaseForm ref="baseForm"></BaseForm>
```

```js
this.$refs.baseForm.组件方法();
```

### 异步更新与 $nextTick

`$nextTick`：等 DOM 更新后才会触发执行方法里的函数体。

```js
this.$nextTick(() => {
  this.$refs.inp.focus();
});
```

## 自定义

### 自定义指令

作用：封装一些 DOM 操作，扩展额外功能。

相关参数：

- `inserted`：元素被插入后触发的钩子函数；
- `el`：本标签；
- `binding.value`：指令的值。

局部注册：

```js
directives: {
  指令名: {
    inserted(el, binding) {
      el.focus();
      el.style.color = binding.value;
    },
    update(el, binding) {
      el.style.color = binding.value;
    }
  }
}
```

全局注册（main.js）：

```js
Vue.directive("指令名", {
  inserted(el, binding) {
    el.focus();
  },
});
```

使用：`<input v-指令名="指令值" type="text" />`。

### 插槽

作用：让组件内部的一些结构支持自定义。典型需求是把需要多次显示的对话框封装成组件，但内容部分不想写死。

组件里用 `<slot>` 占位，里面的内容就是默认值：

```html
<template>
  <div class="dialog-header">
    <slot name="head">默认标题</slot>
  </div>
  <div class="dialog-content">
    <slot name="content">默认内容</slot>
  </div>
  <div class="dialog-footer">
    <slot name="footer">默认尾部</slot>
  </div>
</template>
```

使用时用 `template` 配合 `v-slot:名字` 分发内容：

```html
<组件名字 :list="list">
  <template v-slot:head>我是标题</template>
  <template v-slot:content>我是内容</template>
  <template v-slot:footer>
    <button>我是尾部按钮</button>
  </template>
</组件名字>
```

作用域插槽（子给父传值）：

1. 以添加属性的方式传值：`<slot :id="item.id" msg="测试文本"></slot>`；
2. 所有添加的属性都会被收集到一个对象中；
3. 在 template 中通过 `#插槽名="obj"` 接收，默认插槽名是 `default`。

## VueRouter 路由

版本对应关系：Vue2 用 VueRouter3 + Vuex3，Vue3 用 VueRouter4 + Vuex4。

### 认识路由

Vue 中的路由是「路径和组件的映射关系」，作用是修改地址栏路径时切换显示匹配的组件，它是 Vue 官方的路由插件（第三方包）。

### 5 + 2 个基础步骤

在 main.js 里操作的前五步：

1. 下载：`npm install vue-router@3.6.5`；
2. 引入：`import VueRouter from 'vue-router'`；
3. 安装注册：`Vue.use(VueRouter)`；
4. 创建路由对象：`const router = new VueRouter()`；
5. 注入到 Vue 实例：

```js
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
```

两个核心步骤：

1. 创建组件（views 目录）并配置路由规则；
2. 配置导航和路由出口（路径匹配的组件显示的位置）。

```js
import Find from "./views/Find";

// 路由懒加载
const Login = () => import("@/views/login");

const router = new VueRouter({
  routes: [
    { path: "/find", component: Find },
    {
      path: "/friend",
      component: Friend,
      children: [{ path: "/路径", component: xxx }], // 二级路由
    },
  ],
});
```

```html
<div class="footer_wrap">
  <a href="#/find">发现音乐</a>
  <a href="#/my">我的音乐</a>
</div>
<div class="top">
  <!-- 路由出口：匹配的组件展示在这里 -->
  <router-view></router-view>
</div>
```

路由配置堆在 main.js 不太合适，可以抽离到 `src/router/index.js`，main.js 再引入。`@` 指代 src 目录，可以快速引入组件。

### 声明式导航

**router-link**：vue-router 提供的全局组件，用来取代 a 标签。

- 能跳转：用 `to` 属性指定路径（必须），本质还是 a 标签，`to` 不需要写 `#`；
- 能高亮：默认提供高亮类名，直接写样式就能高亮。

```html
<a href="#/friend">朋友</a>
<router-link to="/路径值"></router-link>
```

**高亮类名**：router-link 会自动添加两个类名。

- `router-link-active`：模糊匹配，`to="/my"` 可以匹配 `/my`、`/my/a`、`/my/b`……用得更多；
- `router-link-exact-active`：精确匹配，`to="/my"` 只能匹配 `/my`。

类名太长可以在创建路由对象时定制：

```js
const router = new VueRouter({
  routes: [],
  linkActiveClass: "类名1",
  linkExactActiveClass: "类名2",
});
```

**参数传递**：

- 查询参数：`to="/path?参数名1=值1&参数名2=值2"`，接收用 `$route.query.参数名`；
- 动态路由：`path: "/path/:参数名"` 表示必须传参（否则页面空白），`path: "/path/:参数名?"` 里的 `?` 表示可选；跳转用 `to="/path/值"`，接收用 `$route.params.参数名`。

查询参数适合传多个参数，动态路由传参更优雅简洁，适合单个参数。

### 重定向、404 与模式

**重定向**：打开网页时 url 默认是 `/`，未匹配到组件会空白，可以强制跳转。

```js
{ path: "/", redirect: "/home" }
```

**404 页面**：配在路由最后，任意路径都不匹配时命中。

```js
{ path: "*", component: NotFind }
```

**模式切换**：hash 路由（默认）形如 `http://localhost:8080/#/home`；history 路由形如 `http://localhost:8080/home`，路径更自然，但上线需要服务端支持。

```js
const router = new VueRouter({
  mode: "history",
  routes: [],
});
```

### 编程式导航

用 JS 代码跳转：

```js
// path 路径跳转
this.$router.push("/路由路径");
this.$router.push({ path: "/路由路径" });

// name 命名路由跳转（适合路径很长的场景）
this.$router.push({ name: "路由名" });
```

命名路由需要在配置里写 `name`。另外 `this.$router.replace` 和 push 功能差不多，区别是 push 会记录历史，replace 直接替换。

跳转时传参：

```js
// query 传参
this.$router.push("/路径?参数名1=参数值1");
this.$router.push({ path: "/路径", query: { 参数名1: "参数值1" } });

// 动态路由传参
this.$router.push("/路径/参数值");
this.$router.push({ path: "/路径/参数值" });

// 命名路由 + params
this.$router.push({ name: "路由名字", params: { 参数名: "参数值" } });
```

### 组件缓存 keep-alive

场景：从列表点到详情页，再点返回，数据重新加载了——希望回到原来的位置。原因是路由跳转后组件被销毁，返回时又重新创建，所以数据重新加载。

keep-alive 是 Vue 的内置组件，包裹动态组件时会缓存不活动的组件实例，而不是销毁它们。它是一个抽象组件：自身不会渲染成 DOM 元素，也不会出现在父组件链中。

优点：组件切换时把切出去的组件保留在内存中，防止重复渲染 DOM，减少加载时间和性能消耗。

三个属性：

- `include`：只有匹配的组件会被缓存；
- `exclude`：匹配的组件都不会被缓存；
- `max`：最多缓存多少个组件实例。

```html
<keep-alive :include="['LayoutPage']">
  <router-view></router-view>
</keep-alive>
```

钩子函数：

- `activated`：组件被激活（进入页面）时触发；
- `deactivated`：组件不被使用（离开页面）时触发。

组件被缓存后，就不会再执行 `created`、`mounted`、`destroyed` 这些钩子了。

## Vuex

Vuex 是 Vue 的状态管理工具，状态就是数据，可以帮我们管理 Vue 通用的数据。

优势：共同维护一份数据、数据集中化管理、响应式变化、操作简洁（提供了辅助函数）。

### 创建空仓库

1. `npm install vuex@3`；
2. 新建 `store/index.js` 专门存放 vuex；
3. 载入 `Vue.use(Vuex)`，创建仓库 `new Vuex.Store()`；
4. 在 main.js 中导入并挂载到 Vue 实例。

### state 状态

State 提供唯一的公共数据源，所有共享数据都统一放到 Store 的 State 中。

```js
const store = new Vuex.Store({
  state: {
    count: 101,
  },
});
```

和组件 data 的区别是：data 是组件自己的数据，state 是所有组件共享的数据。

使用数据：

```js
// 模板中
{{ $store.state.xxx }}
// 组件逻辑中
this.$store.state.xxx
// JS 模块中
store.state.xxx
```

也可以用辅助函数 `mapState` 把数据映射到组件的计算属性：

```js
import { mapState } from "vuex";

computed: {
  ...mapState(["count"])
  // 相当于
  // count() { return this.$store.state.count }
}
```

### mutations 修改数据

Vuex 遵循单向数据流，组件中不能直接修改仓库的数据，需要用 `mutations`。

```js
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    // 第一个参数是 state，n 是传入的参数
    addCount(state, n) {
      state.count += n;
    },
  },
});
```

`mapMutations` 可以把 mutations 中的方法映射到组件的 methods：

```js
import { mapMutations } from "vuex";

methods: {
  ...mapMutations(["subCount"])
  // 相当于
  // subCount(n) { this.$store.commit("subCount", n) }
}
```

### actions 处理异步操作

mutations 必须是同步的（便于监测数据变化、记录），异步操作放在 actions 里，再通过 commit 触发 mutations。

```js
actions: {
  // context 是上下文对象，可以调用 commit、dispatch，也能拿到 state、getters
  setAsyncCount(context, num) {
    setTimeout(() => {
      context.commit("changeCount", num);
    }, 1000);
  }
}
```

`mapActions` 把 actions 中的方法映射到组件的 methods：

```js
import { mapActions } from "vuex";

methods: {
  ...mapActions(["setAsyncCount"])
  // 相当于
  // changeCountAction(n) { this.$store.dispatch("setAsyncCount", n) }
}
```

### getters

从 state 中派生出一些状态、并且依赖 state 时，用 getters。比如 state 里有一个 1 到 10 的数组，组件里只想显示大于 5 的数据：

```js
getters: {
  filterList(state) {
    return state.list.filter((item) => item > 5);
  },
}
```

注意：getters 函数的第一个参数是 state，并且必须有返回值。使用方法和 state 一样，也可以用 `mapGetters` 映射。

### module 模块语法

Vuex 使用单一状态树，应用变得复杂时 store 会相当臃肿，所以可以把不同种类的状态分模块存放。

```js
// store/modules/user.js
const state = { userInfo: { name: "zs", age: 18 } };
const mutations = {};
const actions = {};
const getters = {};

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions,
  getters,
};
```

```js
// store/index.js
import user from "./modules/user";

const store = new Vuex.Store({
  modules: { user },
});
```

模块中的访问语法：

- state：`$store.state.模块名.xxx`，映射用 `mapState("模块名", ["xxx"])`（需要开启命名空间）；
- getters：`$store.getters["模块名/xxx"]`，映射用 `mapGetters("模块名", ["xxx"])`；
- mutation：`$store.commit("模块名/xxx", 额外参数)`，映射用 `mapMutations("模块名", ["xxx"])`；
- action：`$store.dispatch("模块名/xxx", 额外参数)`，映射用 `mapActions("模块名", ["xxx"])`。

## 用 json-server 准备后端接口

1. 全局安装：`npm i json-server -g`；
2. 在代码根目录新建 `db` 目录；
3. 把 `index.json` 放进 `db` 目录；
4. 进入 db 目录执行 `json-server index.json`；
5. 访问 `http://localhost:3000/cart` 测试接口。

推荐用 `json-server --watch index.json`，可以实时监听 JSON 文件的修改。

## Vue3 组合式开发

Vue3 相比 Vue2：

- 更容易维护：组合式 API、更好的 TypeScript 支持；
- 更快的速度：重写 diff 算法、模板编译优化、更高效的组件初始化；
- 更小的体积：良好的 TreeShaking、按需引入；
- 更优的数据响应式：基于 Proxy。

### 创建项目 create-vue

前提是 Node.js 16.0 以上。

```bash
npm init vue@latest
pnpm create vue
```

关键文件：

1. `vite.config.js`：项目配置文件，基于 vite；
2. `package.json`：核心依赖变成 Vue3 和 vite；
3. `main.js`：入口文件，用 `createApp` 创建应用实例；
4. `app.vue`：根组件（SFC 单文件组件，script / template / style）。变化有三处：script 和 template 的顺序调整了；template 不再要求唯一根元素；script 上添加 `setup` 标识以支持组合式 API；
5. `index.html`：单页入口，提供 id 为 app 的挂载点。

### 代码检查与提交钩子

`.eslintrc.cjs` 里可以配一套 Prettier 规则：单引号、不加分号、每行至多 80 字符、对象和数组末尾不加逗号、换行符不做限制；另外让 `vue/multi-word-component-names` 忽略 `index`、关掉 props 解构的校验、开启 `no-undef` 未定义变量提示。

**husky**（提交前自动检查）：

1. `git init` 初始化仓库；
2. `pnpm dlx husky-init && pnpm install` 初始化 husky 配置；
3. 修改 `.husky/pre-commit`，写入 `pnpm lint`。

问题是默认走全量检查，耗时长，而且历史遗留问题也会一起报出来。

**lint-staged**（只检查暂存区文件）：

1. 安装：`pnpm i lint-staged -D`；
2. 在 `package.json` 里配置 `"lint-staged": { "*.{js,ts,vue}": ["eslint --fix"] }`，并加上 `"lint-staged": "lint-staged"` 脚本；
3. 把 `.husky/pre-commit` 改成 `pnpm lint-staged`。

### 组合式 API setup

`setup()` 是组件中使用组合式 API 的入口，返回的对象会暴露给模板和组件实例。

- 在模板中访问 setup 返回的 ref 时会自动浅层解包，不需要写 `.value`，通过 this 访问时也一样；
- 在 `setup()` 中访问 this 会是 `undefined`。

```js
export default {
  setup() {
    const count = 0;
    const logMessage = () => {
      console.log("hello world");
    };
    return { count, logMessage };
  },
};
```

`<script setup>` 语法糖：

```js
<script setup>
const count = 0;
const logMessage = () => {
  console.log("hello world");
};
</script>
```

### 响应式核心

**reactive()**：接收对象类型数据，返回一个响应式对象。

```js
import { reactive } from "vue";
const state = reactive(对象);
```

**ref()**：接收简单类型或对象类型，返回响应式对象，内部实现依赖 reactive。

```js
import { ref } from "vue";
const count = ref(0);
console.log(count.value); // 0
```

```html
<!-- 模板中不需要 .value -->
<button @click="count++">{{ count }}</button>
```

**computed**：思想和 Vue2 一致，只是写法变了。计算属性默认只读，需要写入时加上 get 和 set。

```js
import { computed } from "vue";
const computedState = computed(() => {
  return 计算后的值;
});
```

**watch**：侦听一个或多个数据的变化，变化时执行回调。两个额外参数：`immediate`（立即执行）和 `deep`（深度侦听）。

```js
import { ref, watch } from "vue";

const count = ref(0);
const name = ref("a");

watch(
  [count, name],
  ([newCount, newName], [oldCount, oldName]) => {
    console.log("发生变化", newCount, newName, oldCount, oldName);
  },
  { deep: true, immediate: true },
);
```

### 生命周期

选项式与组合式的对应关系：

- `beforeCreate` / `created` → `setup`；
- `beforeMount` → `onBeforeMount`，`mounted` → `onMounted`；
- `beforeUpdate` → `onBeforeUpdate`，`updated` → `onUpdated`；
- `beforeUnmount` → `onBeforeUnmount`，`unmounted` → `onUnmounted`。

```js
import { onMounted } from "vue";

onMounted(() => {
  // 自定义逻辑
});
```

### 父子通信

**父传子**：父组件绑定属性，子组件用编译器宏 `defineProps` 接收。

```html
<sonCom message="this is message"></sonCom>
```

```js
// 子组件：因为写了 setup，无法直接配置 props 选项，要用编译器宏
const props = defineProps({
  message: String,
});
```

**子传父**：父组件用 `@` 绑定事件，子组件用 `defineEmits` 拿到 emit 方法后触发。

```html
<SonCom @changeMoney="changeFn"></SonCom>
```

```js
const emit = defineEmits(["changeMoney"]);
const buy = () => {
  emit("changeMoney", 5);
};
```

### 模板引用

通过 ref 获取真实的 DOM 对象或组件实例：

```js
import { ref } from "vue";
const h1Ref = ref(null);
```

```html
<h1 ref="h1Ref"></h1>
```

### defineExpose()

默认情况下，`<script setup>` 中组件内部的属性和方法不开放给父组件访问，可以用 `defineExpose` 编译宏指定允许访问的内容。

```js
const message = ref("hello world");
defineExpose({ message });
```

### 跨层组件通信

provide 和 inject：顶层组件向任意底层组件传递数据和方法。

```js
// 父组件
provide("key", 数据 / ref 对象 / 方法);

// 子组件
const x = inject("key");
```

### Vue3.3 新特性

**defineOptions**：直接在 `<script setup>` 中声明组件选项，不必再另开一个 `<script>` 块。主要用来定义 Options API 的选项，props、emits、expose、slots 除外（这些有对应的 defineXXX）。它是个宏，选项会被提升到模块作用域，无法访问 `<script setup>` 中不是字面常数的局部变量。

```js
defineOptions({
  // 选项
});
```

**defineModel**：用于简化父子组件之间的双向绑定，这次笔记只记下了名字，还没有展开。

## 写在最后

Vue 是这批笔记里最「成套」的一份：从模板语法、组件通信，到路由、状态管理，再到组合式 API，基本把入门要用的东西串了一遍。

现在回看，Vue2 的选项式和 Vue3 的组合式我都记了，虽然后来写项目时大多直接用 Vue3 的 `<script setup>`，但先学过选项式反而让组合式的对应关系更好理解。

2024 年的前端笔记到这里就整理完了——HTML、CSS、JavaScript（基础 + 进阶 6 篇）、Vue，一共 9 篇。谢谢当年的自己肯把东西记下来。
