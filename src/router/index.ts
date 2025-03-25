import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddPicturePage from '@/pages/admin/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/manage',
      name: '管理',
      component: UserManagePage,
    },
    {
      path: '/admin/add_picture',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/admin/picture_manage',
      name: '图片管理',
      component: PictureManagePage,
    },
  ],
})

export default router
