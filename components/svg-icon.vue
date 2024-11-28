<template>
  <span class="flex items-center">
    <n-icon :size="size" :color="color" :depth="depth">
      <icon :name="name" />
    </n-icon>
  </span>
</template>
<script setup lang="ts">
import { NIcon, type IconProps } from "naive-ui";
defineProps<{
  name: string;
  color?: IconProps["color"];
  size?: IconProps["size"];
  depth?: IconProps["depth"];
  unFilled?: boolean;
}>();
</script>
