<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" inline-theme-disabled :theme="theme.current.value"
    class="size-full">
    <n-global-style />
    <global-css-vars />
    <n-dialog-provider>
      <n-message-provider>
        <NuxtPage keepalive />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
const theme = useTheme()
</script>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  &.dark-mode {
    background-color: rgb(16, 16, 20);
    color-scheme: dark;
  }

  &.light-mode {
    background-color: rgb(255, 255, 255);
    color-scheme: light;
  }
}

*,
::before,
::after {
  border-color: var(--naive-border-color);
}
</style>
