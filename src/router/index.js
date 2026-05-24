import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/todos',
      name: 'todos',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/TodosView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 全局前置守卫：只读 Pinia 登录态，不写 localStorage
router.beforeEach((to) => {
  const userStore = useUserStore()

  // 已登录用户不应再进入登录页
  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/todos'
  }

  // 需鉴权路由：未登录则拦截并跳转登录页
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }

  return true
})

export default router
