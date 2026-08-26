<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
import AppFooter from '@/components/app/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
