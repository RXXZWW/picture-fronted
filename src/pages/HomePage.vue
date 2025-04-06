<template class="homePage">
  <!-- 搜索框 -->
  <div class="search-bar">
    <a-input-search
      placeholder="从海量图片中搜索"
      v-model:value="searchParams.searchText"
      enter-button="搜索"
      size="large"
      @search="doSearch"
    />
  </div>
  <!-- 分类 + 标签 -->
  <a-tabs v-model:active-key="selectedCategory" @change="doSearch">
    <!-- 这里key指向高亮 -->
    <a-tab-pane key="all" tab="全部" />
    <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
  </a-tabs>
  <div class="tag-bar">
    <span style="margin-right: 8px">标签:</span>
    <a-space :size="[0, 8]" wrap>
      <a-checkable-tag
        v-for="(tag, index) in tagList"
        :key="tag"
        v-model:checked="selectedTagList[index]"
        @change="doSearch"
      >
        {{ tag }}
      </a-checkable-tag>
    </a-space>
  </div>
  <!-- 图片列表 -->
  <PictureList :data-list="dataList" :loading="loading" @click-picture="doClickPicture" />
  <!-- 分页 -->
  <a-pagination
    style="text-align: right"
    v-model:current="searchParams.current"
    v-model:pageSize="searchParams.pageSize"
    :total="total"
    @change="onPageChange"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])
//数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

//获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    //转换成下拉选项组件接受到格式
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败:' + res.data.message)
  }
}
onMounted(() => {
  getTagCategoryOptions()
})

//搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

//获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败:' + res.data.message)
  }
  loading.value = false
}

// 页面加载时请求一次  获取数据
onMounted(() => {
  fetchData()
})

const doSearch = () => {
  //重置搜索条件
  searchParams.current = 1
  fetchData()
}

const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const router = useRouter()
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style scoped>
.search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
  margin-bottom: 24px;
}
.tag-bar {
  margin-bottom: 16px;
}
</style>
