<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <!-- (8) 列表项渲染插槽，接收图片对象 -->
        <a-list-item style="padding: 0">
          <!-- (9) 无内边距的列表项容器 -->
          <!-- (10) 可交互的卡片组件 -->
          <a-card hoverable @click="handleClickPicture(picture)">
            <!-- (11) 卡片封面定义 -->
            <template #cover>
              <!-- (12) 响应式图片显示 -->
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
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
                  <ShareModal ref="shareModalRef" :link="shareLink" />
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-space @click.stop="(e) => doSearch(picture, e)">
                <search-outlined />
                搜索
              </a-space>
              <a-space @click.stop="(e) => doShare(picture, e)">
                <ShareAltOutlined />
                分享
              </a-space>
              <a-space @click.stop="(e) => doEdit(picture, e)">
                <edit-outlined />
                编辑
              </a-space>
              <a-space @click.stop="(e) => doDelete(picture, e)">
                <delete-outlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import { ref } from 'vue'
import ShareModal from './ShareModal.vue'

interface Props {
  // 图片列表数据
  dataList?: API.PictureVO[]
  // 是否正在加载中
  loading?: boolean
  // 是否显示操作按钮（编辑、删除）
  showOp?: boolean
  // 重新加载数据的回调函数，用于在删除图片后刷新列表
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: true,
  showOp: false,
})

//分享弹窗引用
const shareModalRef = ref()
//分享链接
const shareLink = ref<string>()

//分享
const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.showModal()
  }
}

const router = useRouter()

const emit = defineEmits<{
  (e: 'click-picture', picture: API.PictureVO): void
}>()

const handleClickPicture = (picture: API.PictureVO) => {
  emit('click-picture', picture)
}
// 在 script 部分修改 doSearch 函数定义
const doSearch = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

const doEdit = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

const doDelete = async (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    props.onReload?.()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped></style>
