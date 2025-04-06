<template>
  <div class="url-picture-upload">
    <a-input-search
      v-model:value="fileUrl"
      placeholder="请输入图片URL"
      enter-button="提交"
      @search="handleUpload"
      style="margin-bottom: 12px"
    />
    <div style="text-align: center">
      <img v-if="fileUrl" :src="fileUrl" alt="avrtar" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUrlUsingPost } from '@/api/pictureController'

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)
const fileUrl = ref<string>('')

/**
 * 上传
 */
const handleUpload = async () => {
  loading.value = true
  try {
    //检查父组件是否传来了图片信息，如果有就证明是更新图片的操作，所以将传来的图片id更新到参数中，方便后端获取信息
    const params: API.PictureUploadRequest = { id: props.picture?.id, spaceId: props.spaceId }

    params.spaceId = props.spaceId
    const res = await uploadPictureUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      //将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    // 可以在这里添加错误日志，方便调试
    console.error('图片上传过程中出现错误:', error)
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}
</script>
<style scoped></style>
