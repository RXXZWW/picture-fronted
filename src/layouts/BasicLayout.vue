<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout has-sider>
        <!-- 新增 has-sider 属性 -->
        <a-layout-sider class="sider">
          <!-- 替换原有组件为 layout-sider -->
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content class="content">
          <RouterView />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        <a href="http://codefather.cn" target="_blank">编程导航 by RXXZWW</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import { RouterView } from 'vue-router'
import GlobalSider from '@/components/GlobalSider.vue'
</script>

<style scoped>
.footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
.header {
  /* margin-bottom: 1px; */
  padding: 0 28px;
  background: #fff;
  border-bottom: 0.5px solid #eee;
}
.content {
  padding: 28px;
  margin-bottom: 20px;
}
.sider {
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}
:deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>
