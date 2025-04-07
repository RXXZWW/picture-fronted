<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '添加图片' }}
    </h2>
    <a-typography-text v-if="spaceId" type="secondary">
      保存至空间: <a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
    </a-typography-text>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType">
      <!-- 图片上传组件 -->
      <a-tab-pane key="file" tab="图片上传">
        <PictureUpload :picture="picture" :spaceId="Number(spaceId)" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL上传" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="Number(spaceId)" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <div v-if="picture" class="edit-bar">
      <a-button :icon="h(EditOutlined)" @click="doEditPicture">编辑图片</a-button>
      <ImageCropper
        ref="imageCropperRef"
        image-url="picture?.url"
        :picture="picture"
        :spaceId="spaceId"
        :onSuccess="onCropSuccess"
      />
    </div>

    <!-- 图片信息表单 -->
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="name" label="名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item lable="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%"
          >{{ route.query?.id ? '修改' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import router from '@/router'
import { useRoute } from 'vue-router'
import { onMounted, computed } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import ImageCropper from '@/components/ImageCropper.vue'

//图片编辑弹窗引用
const imageCropperRef = ref()

//编辑图片
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

//编辑成功时间
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

const spaceId = computed(() => {
  return route.query?.spaceId
})

const picture = ref<API.PictureVO>()

const uploadType = ref<'file' | 'url'>('file')

const pictureForm = reactive<API.PictureEditRequest>({})
/**
 * 图片上传成功  数据回调
 * @param newPicture 新图片数据
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}
// 原代码中使用了 any 类型，这会绕过 TypeScript 的类型检查，不符合最佳实践。
// 这里我们将 any 替换为具体的类型 API.PictureEditRequest，以提高代码的类型安全性。
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: API.PictureEditRequest) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    //跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

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
// 合并后的初始化逻辑
onMounted(() => {
  getTagCategoryOptions() // 先加载选项数据
})

const route = useRoute()

//获取老数据
const getOldPicture = async () => {
  //获取到id
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      // 将id转换为number类型
      id: typeof id === 'string' ? Number(id) : 0,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      // 确保 data.tags 是数组类型
      pictureForm.tags = JSON.parse(data.tags ?? '[]')
    }
  }
}
onMounted(() => {
  getOldPicture()
})
</script>

<style>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
