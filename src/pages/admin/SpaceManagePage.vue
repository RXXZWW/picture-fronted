<template>
  <a-space>
    <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
    <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank">
      分析公共图库
    </a-button>
    <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank">
      分析全空间
    </a-button>
  </a-space>
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="空间名称">
      <a-input v-model:value="searchParams.spaceName" placeholder="输入空间名称" />
    </a-form-item>
    <a-form-item label="空间级别">
      <a-select
        v-model:value="searchParams.spaceLevel"
        :options="SPACE_LEVEL_OPTIONS"
        placeholder="输入空间级别"
        style="min-width: 180px"
        allow-clear
      />
    </a-form-item>
    <a-form-item label="用户id">
      <a-input v-model:value="searchParams.userId" placeholder="输入用户id" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    @change="doTableChange"
  >
    <template #bodyCell="{ column, record }">
      <!-- 空间级别 -->
      <template v-if="column.dataIndex === 'spaceLevel'">
        <a-tag>
          {{ SPACE_LEVEL_MAP[record.spaceLevel as keyof typeof SPACE_LEVEL_MAP] }}
        </a-tag>
      </template>
      <!-- 使用情况 -->
      <template v-if="column.dataIndex === 'spaceUseInfo'">
        <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
        <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button type="primary" :href="`/space_analyze?spaceId=${record.id}`" target="_blank">
            分析
          </a-button>
          <a-button type="primary" :href="`/add_space?id=${record.id}`">编辑</a-button>
          <a-button type="primary" danger @click="handleDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { listSpaceByPageUsingPost, deleteSpaceUsingPost } from '@/api/spaceController'
import { formatSize } from '@/utils'
import { message } from 'ant-design-vue'
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { SPACE_LEVEL_OPTIONS, SPACE_LEVEL_MAP } from '@/constants/space.ts'

const columns = [
  {
    name: 'id',
    title: 'id',
    dataIndex: 'id',
  },
  {
    name: '空间名称',
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户id',
    dataIndex: 'userId',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

//数据
const dataList = ref([])
const total = ref(0)

//搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

//获取数据
const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    //@ts-expect-error 这里是为了方便，实际应该是res.data.data.records
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.data.message)
  }
}
// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})
//表格变化处理
const doTableChange = (page: { current: number; pageSize: number }) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  //重置分页
  searchParams.current = 1
  fetchData()
}
const handleDelete = async (id: string) => {
  if (!id) {
    return
  }
  // 将 id 转换为 number 类型
  const res = await deleteSpaceUsingPost({ id: Number(id) })
  if (res.data.code === 0) {
    message.success('删除成功')
    //刷新数据
    fetchData()
  } else {
    message.error('删除失败' + res.data.message)
  }
}
</script>

<style scoped></style>
