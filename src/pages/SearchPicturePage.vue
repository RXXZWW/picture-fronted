<template>
  <div class="searchPicturePage">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <h3 style="margin: 16px">原图</h3>
    <a-card style="width: 240px">
      <template #cover>
        <img
          style="height: 180px; object-fit: cover"
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
          loading="lazy"
        />
      </template>
    </a-card>
    <h3 style="margin: 16px">识图结果</h3>
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
    >
      <template #renderItem="{ item }">
        <!-- (8) 列表项渲染插槽，接收图片对象 -->
        <a-list-item style="padding: 0">
          <!-- (9) 无内边距的列表项容器 -->
          <!-- (10) 可交互的卡片组件 -->
          <a :href="item.fromUrl" target="_blank">
            <a-card>
              <!-- (11) 卡片封面定义 -->
              <template #cover>
                <!-- (12) 响应式图片显示 -->
                <img
                  style="height: 180px; object-fit: cover"
                  :src="item.thumbnailUrl ?? item.url"
                  loading="lazy"
                />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPictureVoByIdUsingGet, searchPictureByPictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

const route = useRouter()

//图片id
const pictureId = computed(() => {
  return route.currentRoute.value.query?.pictureId
})

const picture = ref<API.PictureVO>({})

//获取老数据
const getOldPicture = async () => {
  //获取到id
  const id = route.currentRoute.value.query?.pictureId
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      // 将id转换为number类型
      id: Number(id),
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
    }
  }
}

onMounted(() => {
  getOldPicture()
  fetchData()
})

const dataList = ref<API.ImageSearchResult[]>([])
//获取搜图结果
const fetchData = async () => {
  const res = await searchPictureByPictureUsingPost({
    pictureId: Number(pictureId.value),
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败,' + res.data.message)
  }
}
</script>

<style scoped></style>
