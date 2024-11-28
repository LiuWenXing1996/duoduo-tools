<template>
    <div class="h-[36px] w-[36px] flex justify-center items-center">
        <svg-icon :size="16" :name="name"></svg-icon>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    name: string
}>()
</script>