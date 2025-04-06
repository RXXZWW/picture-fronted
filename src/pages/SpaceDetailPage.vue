<template>
  <BatchEditPictureModal
    ref="batchEditPictureModalRef"
    :spaceId="Number(id)"
    :pictureList="dataList"
    :onSuccess="onBatchEditPictureSuccess"
  />
  <div>
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}(私有空间)</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit"> 批量编辑 </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize || 0)}/${formatSize(space.spaceMaxSize || 0)}`"
        >
          <a-progress
            type="circle"
            :percent="((space.totalSize || 0) * 100) / (space.spaceMaxSize || 1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <div class="picture-search-form">
      <!-- 搜索表单 -->
      <PictureSearchForm :onSearch="onSearch" />
    </div>
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <ColorPicker
        format="hex"
        @pureColorChange="onColorChange"
        :pureColor="selectedColor"
        style="width: 200px"
      />
    </a-form-item>
    <!-- 图片列表 -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      showOp
      :onReload="fetchData"
      @click-picture="doClickPicture"
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total}/${space.spaceMaxCount}`"
      @change="onPageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { formatSize } from '@/utils'
import { message } from 'ant-design-vue'
import { ref, onMounted, h } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import PictureList from '@/components/PictureList.vue'
import { useRouter } from 'vue-router'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { searchPictureByColorUsingPost } from '@/api/pictureController'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import { EditOutlined } from '@ant-design/icons-vue'

//打开批量编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}

//分享弹窗引用
const batchEditPictureModalRef = ref()

//批量编辑成功后，刷新数据
const onBatchEditPictureSuccess = () => {
  fetchData()
}

const selectedColor = ref('')

const onColorChange = async (color: string) => {
  selectedColor.value = color
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: Number(props.id),
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败' + res.data.message)
  }
}

// 搜索
const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({ id: Number(props.id) })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败:' + res.data.message)
    }
  } catch (error) {
    message.error('获取空间详情失败:' + error)
  }
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})

// 数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params: API.PictureQueryRequest = {
    spaceId: Number(props.id),
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败:' + res.data.message)
  }
  loading.value = false
}

const router = useRouter()
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}
</style>
