<template>
  <div>
    <a-modal
      v-model:open="open"
      title="分享图片"
      :footer="false"
      @ok="showModal"
      @cancel="closeModal"
    >
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ link }}
      </a-typography-link>
      <div style="margin-bottom: 16px" />
      <h4>手机扫码查看</h4>
      <a-qrcode :value="link" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { defineExpose, withDefaults, defineProps } from 'vue'

/**
 * 定义组件属性类型
 */
interface Props {
  title: string
  link: string
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  title: () => '分享',
  link: () => 'https://laoyujianli.com/share/yupi',
})

const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}
const closeModal = () => {
  open.value = false
}

// 暴露函数给父组件
defineExpose({
  showModal,
})
</script>
