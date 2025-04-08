<template>
  <a-modal
    class="image-out-painting"
    v-model:open="visible"
    title="AI 扩图"
    :footer="false"
    @cancel="closeModal"
  >
    <a-row gutter="16">
      <a-col span="12">
        <h4>原始图片</h4>
        <div
          style="
            text-align: center;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <a-spin :spinning="loading">
            <img
              :src="props.picture?.url"
              :alt="props.picture?.name"
              style="max-width: 100%; max-height: 300px"
            />
          </a-spin>
        </div>
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <div
          style="
            text-align: center;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <a-spin :spinning="!!taskId">
            <img
              v-if="resultImageUrl"
              :src="resultImageUrl"
              :alt="picture?.name"
              style="max-width: 100%; max-height: 300px"
            />
            <div v-else style="color: #999">暂无结果</div>
          </a-spin>
        </div>
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex gap="16" justify="center">
      <a-button type="primary" :loading="!!taskId" ghost @click="createTask">生成图片</a-button>
      <a-button type="primary" :loading="uploadLoading" v-if="resultImageUrl" @click="handleUpload">
        应用结果
      </a-button>
    </a-flex>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, defineProps, defineExpose, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import 'vue-cropper/dist/index.css'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureUrlUsingPost,
} from '@/api/pictureController'

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const resultImageUrl = ref<string>()

//任务id
const taskId = ref<string>()

/**
 * 创建任务
 */
const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  const res = await createPictureOutPaintingTaskUsingPost({
    pictureId: props.picture.id,
    // 可以根据需要设置扩图参数
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请耐心等待，不要退出界面')
    console.log(res.data.data.output.taskId)
    taskId.value = res.data.data.output.taskId
    // 开启轮询
    startPolling()
  } else {
    message.error('创建任务失败,' + res.data.message)
  }
}

//轮询定时器
let pollingTimer: ReturnType<typeof setInterval> | null = null

//清理轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}

//开始轮询
const startPolling = () => {
  if (!taskId.value) return

  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务成功')
          resultImageUrl.value = taskResult.outputImageUrl
          clearPolling()
        }
      }
    } catch (error) {
      console.error('轮询任务状态失败', error)
      message.error('检测任务状态失败，请稍后重试')
      clearPolling()
    }
  }, 3000) //每隔3秒轮询一次
}

// 清理定时器，避免内存泄漏
onUnmounted(() => {
  clearPolling()
})

const uploadLoading = ref<boolean>(false)

const loading = ref<boolean>(false)

/**
 * 上传
 * @param file
 */
const handleUpload = async () => {
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      // 关闭弹窗
      closeModal()
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

const visible = ref<boolean>(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})

const props = defineProps<Props>()
</script>

<style scoped>
.image-cropper {
  :deep(.ant-modal-body) {
    padding: 24px;
  }

  :deep(.vue-cropper) {
    height: 500px;
    width: 100%;
  }

  .image-cropper-actions {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}
</style>
