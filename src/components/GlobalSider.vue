<template id="globalSider">
  <a-layout-sider
    v-if="loginUserStore.loginUser.id"
    class="sider"
    width="200"
    collapsed-width="0"
    breakpoint="lg"
  >
    <a-menu mode="inline" v-model:selectedKeys="current" :items="menuItems" @click="doMenuClick" />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

const openKeys = ref<string[]>(['sub1'])

const menuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  current.value = [to.path]
})

const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

watch(openKeys, (val) => {
  console.log('openKeys', val)
})
</script>

<style scoped></style>
