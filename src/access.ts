import { useLoginUserStore } from "./stores/useLoginUserStore";
import { message } from 'ant-design-vue';
import router from '@/router'

let firstFetchLoginUser = true;

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;
  //确保页面刷新，首次加载时，能够等后端返回用户信息后再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
    firstFetchLoginUser = false;
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== "admin") {
      message.error('您没有权限访问该页面');
      next(`user/login?redirect=${toUrl}`)
      return;
    }
  } next()
})
