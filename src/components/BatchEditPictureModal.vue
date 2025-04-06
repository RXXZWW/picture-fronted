<template>
  <a-modal
    v-model:open="visible"
    title="批量编辑图片"
    :footer="false"
    @ok="openModal"
    @cancel="closeModal"
  >
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请选择分类"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="formData.tags"
          mode="multiple"
          :options="tagOptions"
          placeholder="请选择标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="nameRule" label="命名规则">
        <a-input
          v-model:value="formData.nameRule"
          placeholder="请输入命名规则，输入{序号}可动态生成"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { ref, reactive, onMounted } from 'vue'

// 定义组件属性类型
interface Props {
  pictureList: API.PictureVO[]
  spaceId: number
  onSuccess: () => void
}

//给组件指定初始值
const props = withDefaults(defineProps<Props>(), {})

//控制弹窗可见性
const visible = ref(false)

//打开弹窗
const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

//暴露函数给父组件
defineExpose({
  openModal,
})

//初始化表单数据
const formData = reactive({
  category: '', //分类
  tags: [], //标签
  nameRule: '', //命名规则
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
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
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

//提交表单时处理
const handleSubmit = async (values) => {
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('操作失败' + res.data.message)
  }
}
</script>
<style scoped></style>
