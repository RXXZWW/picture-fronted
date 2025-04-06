<template>
  <div>
    <h2 style="margin-bottom: 20px">创建空间</h2>
    <!-- 空间信息表单 -->
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="name" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
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
        <a href="https://codefather.cn" target="_blank">管理员</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList" :key="spaceLevel.text">
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
  getSpaceVoByIdUsingGet,
} from '@/api/spaceController'
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'
import { useRoute } from 'vue-router'

const spaceForm = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})
const loading = ref(false)
const oldSpace = ref<API.Space>()
const spaceLevelList = ref<API.SpaceLevel[]>([])

const route = useRoute()
const spaceId = route.query.id as string

/**
 * 提交表单
 */
const handleSubmit = async () => {
  const id = oldSpace.value?.id
  loading.value = true
  let res
  //更新
  if (id) {
    res = await updateSpaceUsingPost({
      id,
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
    const path = `/space/${id ?? res.data.data}`
    router.push({ path })
  } else {
    message.error('创建失败:' + res.data.message)
  }
  loading.value = false
}

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('加载空间级别失败：' + res.data.message)
  }
}

// 获取老数据
const getOldSpace = async () => {
  if (!spaceId) return
  const res = await getSpaceVoByIdUsingGet({
    id: Number(spaceId),
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data
    oldSpace.value = data
    spaceForm.spaceName = data.spaceName
    spaceForm.spaceLevel = data.spaceLevel
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})
</script>

<style>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
