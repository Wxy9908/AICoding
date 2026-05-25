import { createRouter, createWebHistory } from 'vue-router'
import ProductManageView from '../views/ProductManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'products',
      component: ProductManageView,
    },
  ],
})

export default router
