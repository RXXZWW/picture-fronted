import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/access.ts'
import 'vue-cropper/dist/index.css'
import VueCropper from 'vue-cropper'

const app = createApp(App)

app.use(Antd)
app.use(createPinia())
app.use(router)
app.use(VueCropper)
app.mount('#app')
