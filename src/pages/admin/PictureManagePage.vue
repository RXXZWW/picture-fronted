<template>
  <a-flex justify="space-between" style="margin-bottom: 8px">
    <h2>图片管理</h2>
    <a-button type="primary" href="/add_picture" target="_blank">添加图片</a-button>
  </a-flex>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 8px">
    <a-form-item label="关键词" name="searchText">
      <a-input v-model:value="searchParams.searchText" placeholder="从名称和简介搜索" allow-clear />
    </a-form-item>
    <a-form-item label="类型" name="category">
      <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
    </a-form-item>
    <a-form-item label="标签" name="tags">
      <a-select
        v-model:value="searchParams.tags"
        mode="tags"
        placeholder="请选择标签"
        allow-clear
        style="min-width: 180px"
      />
    </a-form-item>
    <a-form-item label="审核状态" name="reviewStatus">
      <a-select
        v-model:value="searchParams.reviewStatus"
        :options="PIC_REVIEW_STATUS_OPTIONS"
        placeholder="请选择状态"
        allow-clear
        style="min-width: 180px"
      />
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
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'url'">
        <a-image :src="record.url" :width="120" />
      </template>
      <!-- 标签 -->
      <template v-if="column.dataIndex === 'tags'">
        <a-space wrap>
          <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!-- 图片信息 -->
      <template v-if="column.dataIndex === 'picInfo'">
        <div>格式: {{ record.picFormat }}</div>
        <div>宽度: {{ record.picWidth }}</div>
        <div>高度: {{ record.picHeight }}</div>
        <div>宽高比: {{ record.picScale }}</div>
        <div>大小: {{ (record.picSize / 1024).toFixed(2) }}KB</div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-if="column.dataIndex === 'reviewMessage'">
        <div>审核状态: {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
        <div>审核信息: {{ record.reviewMessage }}</div>
        <div>审核时间: {{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space wrap>
          <a-button
            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
            type="primary"
            @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >通过</a-button
          >
          <a-button
            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
            type="primary"
            danger
            @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >拒绝</a-button
          >
          <a-button type="primary" href="/add_picture" target="_blank">编辑</a-button>
          <a-button type="primary" danger @click="handleDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  listPictureByPageUsingPost,
  deletePictureUsingPost,
  doPictureReviewUsingPost,
} from '@/api/PictureController'
import { message } from 'ant-design-vue'
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { computed } from 'vue'
import {
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture.ts'

const columns = [
  {
    name: 'id',
    title: 'id',
    dataIndex: 'id',
  },
  {
    name: '图片',
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户id',
    dataIndex: 'createTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
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
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

//获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
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
  const res = await deletePictureUsingPost({ id: Number(id) })
  if (res.data.code === 0) {
    message.success('删除成功')
    //刷新数据
    fetchData()
  } else {
    message.error('删除失败' + res.data.message)
  }
}

const handleReview = async (record: API.PictureVO, reviewStatus: number) => {
  const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '审核通过' : '审核拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('审核成功')
    //重新获取列表
    fetchData()
  } else {
    message.error('审核失败:' + res.data.message)
  }
}
</script>

<style scoped></style>
