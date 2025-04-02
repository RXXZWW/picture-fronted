<template>
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="空间id">
      <a-input v-model:value="searchParams.spaceId" placeholder="输入空间Id" />
    </a-form-item>
    <a-form-item label="空间名称">
      <a-input v-model:value="searchParams.spaceName" placeholder="输入空间名称" />
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
      <template v-if="column.key === 'userAvatar'">
        <a-image :src="record.userAvatar" :width="120" />
      </template>
      <template v-else-if="column.dataIndex === 'spaceLevel'">
        <div v-if="record.spaceLevel === SPACE_LEVEL_ENUM.FLAGSHIP">
          <a-tag color="green">旗舰版</a-tag>
        </div>
        <div v-else-if="record.spaceLevel === SPACE_LEVEL_ENUM.PROFESSIONAL">
          <a-tag color="blue">专业版</a-tag>
        </div>
        <div v-else>
          <a-tag color="red">普通版</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="primary" danger @click="handleDelete(record.id)">删除</a-button>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { deleteUserByIdUsingPost } from '@/api/basicController'
import { listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { SPACE_LEVEL_ENUM } from '@/constants/space.ts'

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
  const res = await deleteUserByIdUsingPost({ id: Number(id) })
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
