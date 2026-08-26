<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const route = useRoute()

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/projects', label: '项目' },
  { to: '/anime', label: '追番' },
]
</script>

<template>
  <header class="nav-bar glass">
    <RouterLink to="/" class="nav-logo">NKDShinKu</RouterLink>

    <nav class="nav-links">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ active: route.path === link.to }"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <ThemeToggle />
  </header>

  <!-- 移动端底部导航 -->
  <nav class="bottom-bar glass">
    <RouterLink
      v-for="link in navLinks"
      :key="link.to"
      :to="link.to"
      class="bottom-link"
      :class="{ active: route.path === link.to }"
    >
      {{ link.label }}
    </RouterLink>
    <ThemeToggle />
  </nav>
</template>

<style scoped>
/* 桌面端 — 复用 .glass 类 + 扩展 */
.nav-bar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  border-radius: 9999px;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 150ms ease-out;
}
.nav-link:hover,
.nav-link.active {
  color: var(--color-accent);
}

/* 移动端 */
.bottom-bar {
  display: none;
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  border-radius: 9999px;
  padding: 8px 20px;
  gap: 16px;
  align-items: center;
}

.bottom-link {
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.8rem;
  padding: 4px 0;
  transition: color 150ms ease-out;
}
.bottom-link.active {
  color: var(--color-accent);
}

@media (max-width: 767px) {
  .nav-bar {
    display: none;
  }
  .bottom-bar {
    display: flex;
  }
}
</style>
