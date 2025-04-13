<template>
  <div class="space-rank-analyze">
    <a-card title="空间使用排行">
      <v-chart :option="options" style="height: 320px" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { getSpaceRankAnalyzeUsingPost } from '@/api/spaceAnalyzeController'
import { message } from 'ant-design-vue'
import { defineProps, withDefaults, watchEffect, ref, computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: number
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const options = computed(() => {
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) =>
    ((item?.totalSize ?? 0) / (1024 * 1024)).toFixed(2),
  ) // 转为MB

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: spaceNames },
    yAxis: { type: 'value', name: '空间使用量 (MB)' },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
      },
    ],
  }
})

// 图表数据
const dataList = ref<API.Space[]>([])
const loading = ref(true)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceRankAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败:' + res.data.message)
  }
  loading.value = false
}

/**
 * 监听变量，改变时触发数据重新加载
 */
watchEffect(() => {
  fetchData()
})
</script>

<style scoped></style>
