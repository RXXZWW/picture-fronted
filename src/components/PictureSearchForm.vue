<template>
  <div class="search-form">
    <a-form layout="inline" :model="searchForm">
      <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel key="1" :header="null">
          <a-row :gutter="[16, 16]" style="width: 100%">
            <a-col :span="8">
              <a-form-item label="关键词" name="searchText">
                <a-input
                  v-model:value="searchForm.searchText"
                  placeholder="从名称和简介中搜索"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="name" label="图片名称">
                <a-input
                  v-model:value="searchForm.name"
                  placeholder="请输入图片名称"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="category" label="分类">
                <a-select
                  v-model:value="searchForm.category"
                  :options="categoryOptions"
                  placeholder="请选择分类"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="tags" label="标签">
                <a-select
                  v-model:value="searchForm.tags"
                  mode="multiple"
                  :options="tagOptions"
                  placeholder="请选择标签"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="picFormat" label="图片格式">
                <a-select
                  v-model:value="searchForm.picFormat"
                  :options="formatOptions"
                  placeholder="请选择图片格式"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="picScale" label="图片比例">
                <a-select
                  v-model:value="searchForm.picScale"
                  :options="scaleOptions"
                  placeholder="请选择图片比例"
                  allow-clear
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="日期" name="">
                <a-range-picker
                  style="width: 400px"
                  show-time
                  v-model:value="dateRange"
                  :placeholder="['编辑开始日期', '编辑结束时间']"
                  format="YYYY/MM/DD HH:mm:ss"
                  @change="onRangeChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
    <!-- 将按钮移到折叠面板外部 -->
    <div style="margin-top: 16px; text-align: right">
      <a-space>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { listPictureTagCategoryUsingGet } from '@/api/pictureController'

interface Props {
  onSearch: (searchParams: API.PictureQueryRequest) => void
}
const props = defineProps<Props>()

const doSearch = () => {
  props.onSearch?.(searchForm.value)
}

const dateRange = ref<[]>([])

/**
 * 日期范围更改时触发
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    searchForm.value.startEditTime = undefined
    searchForm.value.endEditTime = undefined
  } else {
    searchForm.value.startEditTime = dates[0]
    searchForm.value.endEditTime = dates[1]
  }
}

const activeKey = ref<string[]>(['1'])

// 搜索条件
const searchForm = ref<API.PictureQueryRequest>({
  searchText: '',
  name: '',
  category: undefined,
  tags: [],
  picFormat: undefined,
  picScale: undefined,
  startEditTime: undefined,
  endEditTime: undefined,
})

// 分类选项
const categoryOptions = ref<[]>([])

// 标签选项
const tagOptions = ref<[]>([])

// 获取标签选项
//获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    //@ts-expect-error 此处代码可能在类型检查上存在暂时无法解决的问题，为了保证代码能继续运行，暂时忽略类型检查
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    //@ts-expect-error 此处代码可能在类型检查上存在暂时无法解决的问题，为了保证代码能继续运行，暂时忽略类型检查
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取标签和分类失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

// 图片格式选项
const formatOptions = [
  { label: 'JPG', value: 'JPG' },
  { label: 'PNG', value: 'PNG' },
]

// 图片比例选项
const scaleOptions = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 1.33 },
  { label: '16:9', value: 1.78 },
]

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchForm.value)
}
</script>

<style scoped>
.search-form {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.search-form :deep(.ant-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.ant-form-item-label) {
  min-width: 80px;
  text-align: right;
}

.search-form :deep(.ant-select) {
  min-width: 200px;
}

.search-form :deep(.ant-collapse) {
  background: transparent;
}

.search-form :deep(.ant-collapse-header) {
  padding: 0 !important;
}

.search-form :deep(.ant-collapse-content) {
  background: transparent;
}
</style>
