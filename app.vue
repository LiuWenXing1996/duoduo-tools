<template>
  <n-config-provider :locale="zhCN" :theme-overrides="theme.themeOverrides" :date-locale="dateZhCN"
    inline-theme-disabled :theme="theme.current.value" class="size-full">
    <n-global-style />
    <global-css-vars />
    <n-message-provider>
      <n-dialog-provider>

        <NuxtLayout>
          <NuxtPage keepalive />
        </NuxtLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
const theme = useTheme()
</script>

<style lang="less">
:root {
  --bg-light: rgb(255, 255, 255);
  --bg-dark: rgb(16, 16, 20);
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  &.dark-mode {
    background-color: var(--bg-dark);
    color-scheme: dark;
  }

  &.light-mode {
    background-color: var(--bg-light);
    color-scheme: light;
  }
}

*,
::before,
::after {
  border-color: var(--naive-border-color);
}
</style>
