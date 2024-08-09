<template>
  <el-menu
    default-active="/"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    router="true"
  >
    <el-menu-item index="/">
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/raidTier">
      <span>总力战档线</span>
    </el-menu-item>
    <el-menu-item index="/eraidTier">
      <span>大决战档线</span>
    </el-menu-item>
    <el-menu-item index="/friendSearch">
      <span>好友查询</span>
    </el-menu-item>
    <el-sub-menu>
      <template #title>
        <el-icon><PieChart /></el-icon>
        <span>数据分析</span>
      </template>
      <el-menu-item index="/raidAnalysis">总力战统计</el-menu-item>
      <el-menu-item index="/AliceFriend">爱丽丝的伙伴</el-menu-item>
      <el-menu-item index="rank1">第一名</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/about">
      <span>关于</span>
    </el-menu-item>
    
  </el-menu>
</template>

<script lang="ts" setup>
import {
  PieChart,
  Menu as IconMenu,
} from "@element-plus/icons-vue";

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.el-menu-vertical-demo{
  width: 220px;
}
</style>