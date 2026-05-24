<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './layout/AppHeader.vue'

defineOptions({
  name: 'App',
})

const route = useRoute()

const LAYOUT_HEADER_HIDDEN_PATHS = ['/login']

const showLayoutHeader = computed(
  () => !LAYOUT_HEADER_HIDDEN_PATHS.includes(route.path),
)
</script>

<template>
  <div class="app-layout">
    <AppHeader v-if="showLayoutHeader" />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-main {
  padding: 1.5rem;
}
</style>
