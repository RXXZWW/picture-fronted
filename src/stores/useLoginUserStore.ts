import { getCurrentUser } from '@/api/basicController'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 在其他文件中调用这个store时，通常不会直接涉及到 `defineStore` 的第一个参数（即store的id）。一般是通过导入 `useLoginUserStore` 函数来使用这个store，示例如下：
// 在其他文件中
// import { useLoginUserStore } from './path/to/useLoginUserStore';
// const loginUserStore = useLoginUserStore();
// 此时使用的是导出的 `useLoginUserStore` 函数，而不是直接使用id 'loginUser1'。不过在一些特定场景下，如使用Pinia的插件或调试工具时，这个id会起到作用。
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({ userName: '未登录' })

  async function fetchLoginUser() {
    // todo 由于后端还没提供接口，暂时注释
    const res = await getCurrentUser()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }
  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser
  }
  return { loginUser, setLoginUser, fetchLoginUser }
})
