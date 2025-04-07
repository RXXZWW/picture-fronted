<template>
  <a-modal class="image-cropper" v-model='visible' title="编辑图片" :footer="false" @cancel="closeModal">
    <vueCropper
      ref="cropperRef"
      :img="imageUrl"
      :auto-crop="true"
      :fixed-box="false"
      :center-box="true"
      :can-move-box="true"
      :info="true"
      :outputType="png"
    />
    <div style="margin-bottom: 16px" />
    <!--    图片操作-->
    <div class="image-cropper-actions">
      <a-button @click="rotateLeft">向左旋转</a-button>
      <a-button @click="rotateRight">向右旋转</a-button>
      <a-button @click="changeScale(1)">放大</a-button>
      <a-button @click="changeScale(-1)">缩小</a-button>
      <a-button type="primary" :loading="loading" @click="handleConfirm">确认</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  imageUrl?: string,
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const loading = ref<boolean>(false)

//确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName=(props.picture?.name || 'image') + '.png'
    const file = new File([blob],fileName,{type:blob.type})
    //上传图片
    handleUpload({file})
  })
}

/**
 * 上传
 * @param file
 */
const handleUpload = async ({file}) => {
  loading.value = true
  try{
    const params:API.PictureUploadRequest = props.picture? {id:props.picture.id}:{}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params,{},file)
    if(res.data.code === 0 && res.data.data) {
      message.success("图片上传成功")
      //将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal()
    }else{
      message.error("图片上传失败" + res.data.message)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error){
    message.error("图片上传失败")
  }finally {
    loading.value = false
  }
}

const visible = ref<boolean>(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})

const props = defineProps<Props>()

//编辑器组件的引用
const cropperRef = ref()

//向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

//向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

//缩放
const changeScale = (val: number) => {
  cropperRef.value.changeScale(val)
}

</script>

<style scoped></style>
