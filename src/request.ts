import axios from 'axios'
import { message } from 'ant-design-vue'

//创建Axios 实例
// 如果不写这个 withCredentials 前端就不会携带cookie，会出现前端已经登录，但是后端不认的情况
const myAxios = axios.create({
  baseURL: 'http://localhost:8123', //这里已经使用了代理，所以只需要请求自己，或者留空
  // baseURL: 'http://localhost:8123',
  withCredentials: true,
  timeout: 60000,
})

//全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    //Do something with request error
    return Promise.reject(error)
  },
)

//全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    //未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        // 获取用户当前信息的时候，不用跳转到登录的页面
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)
export default myAxios
