import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 扩展 vue-router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/blog/BlogPage.vue'),
    meta: { title: '博客' },
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/pages/blog/BlogPostPage.vue'),
    meta: { title: '' }, // 动态设置
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/pages/projects/ProjectsPage.vue'),
    meta: { title: '项目' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/error/NotFoundPage.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | NKDShinKu` : 'NKDShinKu'

  const descEl = document.querySelector('meta[name="description"]')
  if (descEl) {
    descEl.setAttribute(
      'content',
      (to.meta.description as string) || '个人技术博客与作品集',
    )
  }
})

export default router
