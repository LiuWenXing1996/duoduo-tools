<template>
  <span class="flex items-center">
    <n-icon :size="size" :color="color" :depth="depth">
      <custom-icon :name="name" :filled="!unFilled" />
    </n-icon>
  </span>
</template>
<script setup lang="ts">
import { NIcon, type IconProps } from "naive-ui";

export type Props = {
  name: string;
  color?: IconProps["color"];
  size?: IconProps["size"];
  depth?: IconProps["depth"];
  unFilled?: boolean;
}

defineProps<Props>();
</script>
