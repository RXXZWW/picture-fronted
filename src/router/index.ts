import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomewPage'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: '登录',
      component: UserLoginPage,
    },
    {
      path: '/register',
      name: '注册',
      component: UserRegisterPage,
    },
    {
      path: '/manage',
      name: '管理',
      component: UserManagePage,
    },

  ],
})

export default router
