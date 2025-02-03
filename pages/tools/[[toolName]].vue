<template>
    <!-- 由于页面路由在切换是[Nuxt-Page]会使对应的组件的 setup 等方法重新运行，导致一些不可预测的 bug
    故将页面的具体渲染内容直接移到[tool-workspace]布局中 -->
</template>
<script setup lang="ts">
definePageMeta({
    layout: "tool-workspace"
})
</script>
<style lang="css">
@tailwind base;
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color:var(--naive-border-color);
  }
}
</style>