import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/types'

const STORAGE_KEY = 'nk-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(getInitialTheme())

  function applyTheme(t: Theme) {
    document.documentElement.classList.toggle('dark', t === 'dark')
    localStorage.setItem(STORAGE_KEY, t)
  }

  // 初始化时应用
  applyTheme(theme.value)

  // 监听系统偏好变化（用户未手动设置时跟随系统）
  const systemQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  watchEffect(() => {
    applyTheme(theme.value)
  })

  return { theme, toggleTheme, setTheme }
})
