import { defineStore } from 'pinia'
import { ref } from 'vue'

// 在其他文件中调用这个store时，通常不会直接涉及到 `defineStore` 的第一个参数（即store的id）。一般是通过导入 `useLoginUserStore` 函数来使用这个store，示例如下：
// 在其他文件中
// import { useLoginUserStore } from './path/to/useLoginUserStore';
// const loginUserStore = useLoginUserStore();
// 此时使用的是导出的 `useLoginUserStore` 函数，而不是直接使用id 'loginUser1'。不过在一些特定场景下，如使用Pinia的插件或调试工具时，这个id会起到作用。
export const useLoginUserStore = defineStore('loginUser1', () => {
  const loginUser = ref<any>({ userName: '未登录' })

  async function fetchLoginUser() {
    // todo 由于后端还没提供接口，暂时注释
    //  const res = await getCurrentUser();
    //   if (res.data.code === 0 && res.data.data) {
    //    loginUser.value = res.data.data;
    //  }
    // 测试
    setTimeout(() => {
      // 在TypeScript中，当你使用 `loginUser.value` 来定义一个对象时，对象的键名通常是可以自定义的。不过，这里的 `loginUser` 被定义为 `ref<any>`，这意味着它可以是任何类型的对象。
      // 因此，你可以自由地定义对象的键名，只要这些键名符合JavaScript的命名规范即可。
      //
      // 在你的代码中，你定义了 `userName` 和 `id` 作为对象的键名，这是完全合法的。你可以根据需要添加更多的键名，或者修改现有的键名。例如：
      //
      // ```typescript
      // loginUser.value = {
      //   userName: '张三',
      //   id: 1,
      //   email: 'zhangsan@example.com',
      //   role: 'admin'
      // };
      // ```
      //
      // 这里，我们添加了 `email` 和 `role` 作为新的键名。只要你在代码中正确地使用这些键名，就不会有问题。
      loginUser.value = {
        userName: '张三',
        id: 1,
      }
    }, 3000)
  }
  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }
  return { loginUser, setLoginUser, fetchLoginUser }
})
