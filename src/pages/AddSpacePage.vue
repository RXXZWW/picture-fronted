<template>
  <div>
    <!-- 空间信息表单 -->
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="name" label="空间名称">
        <a-input v-model:value="spaceForm" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >创建</a-button
        >
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="https://codefather.cn" target="_blank"> 修罗殿下啦啦啦 </a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}: 大小 {{ formatSize(spaceLevel.maxSize) }}, 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  addSpaceUsingPost,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/SpaceController'
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { SPACE_LEVEL_ENUM } from '@/constants/space.ts'
import { getSpaceVoByIdUsingGet } from '@/api/SpaceController'
import { useRoute } from 'vue-router'

const spaceForm = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})
const loading = ref(false)

// 原代码中使用了 any 类型，这会绕过 TypeScript 的类型检查，不符合最佳实践。
// 这里我们将 any 替换为具体的类型 API.PictureEditRequest，以提高代码的类型安全性。
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: API.PictureEditRequest) => {
  const spaceId = oldSpace.value?.id
  loading.value = true
  let res
  //更新
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...spaceForm,
    })
  } else {
    // 新增
    res = await addSpaceUsingPost({
      ...spaceForm,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    const path = `/space/${spaceId ?? res.data.data}`
    router.push({ path })
  } else {
    message.error('创建失败:' + res.data.message)
  }
  loading.value = false
}
const tagOptions = ref<string[]>([])

const spaceLevelList = ref<API.SpaceLevel[]>([])

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('加载空间级别失败：' + res.data.message)
  }
}

onMounted(() => {
  fetchSpaceLevelList()
})

const route = useRoute()
const oldSpace = ref<API.Space>()

// 获取老数据
const getOldSpace = async () => {
  //获取数据
  const res = await getSpaceVoByIdUsingGet({
    id: id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data
    oldSpace.value = data
    spaceForm.spaceName = data.spaceName
    spaceForm.spaceLevel = data.spaceLevel
  }
}
// 页面加载时，请求老数据
onMounted(() => {
  getOldSpace()
})
</script>

const route = useR
<style>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
