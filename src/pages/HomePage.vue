<template class="homePage">
  <div class="search-bar">
    <a-input-search
      placeholder="从海量图片中搜索"
      v-model:value="searchParams.searchText"
      enter-button="搜索"
      size="large"
      @search="doSearch"
    />
  </div>
  <div style="margin-bottom: 20px">
    <!-- 分类 + 标签 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          :v-model-checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
  </div>

  <div class="picture-card">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <!-- (8) 列表项渲染插槽，接收图片对象 -->
        <a-list-item style="padding: 0">
          <!-- (9) 无内边距的列表项容器 -->
          <!-- (10) 可交互的卡片组件 -->
          <a-card hoverable>
            <!-- (11) 卡片封面定义 -->
            <template #cover>
              <!-- (12) 响应式图片显示 -->
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.url"
              />
            </template>

            <!-- (16) 卡片元信息区域 -->
            <a-card-meta :title="picture.name">
              <!-- (17) 显示图片名称作为标题 -->
              <template #description>
                <!-- (18) 弹性布局容器 -->
                <a-flex>
                  <!-- (19) 分类标签显示 -->
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                    <!-- (20) 空值处理 -->
                  </a-tag>

                  <!-- (22) 动态渲染标签列表 -->
                  <a-tag v-for="tag in JSON.parse(picture.tags || '[]')" :key="tag"
                    ><!-- (23) 字符串转数组 -->
                    {{ tag }}
                    <!-- (25) 显示单个标签 -->
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { listPictureTagCategoryUsingGet, listPictureVoByPageUsingPost } from '@/api/fileController'
import { computed } from 'vue'
import { onMounted } from 'vue'

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])
//数据
const dataList = ref([])
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

//分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    //切换页号时，会修改搜索参数并获取数据
    //@ts-expect-error 这里的类型检查会报错，但是实际上是正确的
    onChange: (page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})
//获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [],
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
  if (res.data.data) {
    //@ts-expect-error  这里的类型检查会报错，但是实际上是正确的
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
</script>
<style scoped>
.search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
  margin-bottom: 24px;
}
</style>
