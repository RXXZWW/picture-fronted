<template>
  <div id="spaceAnalyzePage">
    <h2>
      图库空间分析 -
      <span v-if="queryAll">全部空间</span>
      <span v-else-if="queryPublic">公共图库</span>
      <span v-else>
        <a :href="`/space/${spaceId}`" target="_blank">ID: {{ spaceId }}</a>
      </span>
    </h2>
    <a-row :gutter="[16, 16]">
      <!-- 空间使用分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 空间分类分析 -->
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 标签分析 -->
      <a-col :xs="24" :md="12">
        <SpaceTagsAnalyze
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 图片大小分段分析 -->
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 用户上传行为分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 空间使用排行分析 -->
      <a-col :xs="24" :md="12">
        <SpaceRankAnalyze
          v-if="isAdmin"
          :spaceId="Number(spaceId)"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import SpaceUsageAnalyze from '@/components/analyze/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/analyze/SpaceCategoryAnalyze.vue'
import SpaceTagsAnalyze from '@/components/analyze/SpaceTagsAnalyze.vue'
import SpaceSizeAnalyze from '@/components/analyze/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/analyze/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/analyze/SpaceRankAnalyze.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const isAdmin = computed(() => {
  return loginUser.userRole === 'admin'
})

const route = useRoute()

// 空间id
const spaceId = computed(() => {
  return route.query?.spaceId as string
})

// 是否查询所有空间
const queryAll = computed(() => {
  return !!route.query?.queryAll
})

const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})
</script>

<style scoped></style>
