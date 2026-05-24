<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

defineOptions({
  name: 'AppHeader',
})

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <nav class="app-header__nav" aria-label="主导航">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/todos">Todos</RouterLink>
    </nav>
    <div class="app-header__actions">
      <button
        v-if="isLoggedIn"
        type="button"
        class="btn btn--danger"
        aria-label="退出登录"
        @click="handleLogout"
      >
        退出登录
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.app-header__nav {
  display: flex;
  gap: 0.5rem;
}

.app-header__nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.app-header__nav a:hover {
  background-color: var(--color-background-mute);
}

.app-header__nav a.router-link-exact-active {
  color: var(--color-text);
  background-color: var(--color-background-soft);
}

.app-header__nav a.router-link-exact-active:hover {
  background-color: var(--color-background-soft);
}

.app-header__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>
