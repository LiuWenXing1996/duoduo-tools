<template>
    <template v-for="item in editTabs.openedTabNames.value">
        <tool-item-render :name="item" v-show="item === editTabs.currentTabName.value" />
    </template>
</template>
<script setup lang="ts">
import { first } from 'radash';
definePageMeta({
    layout: "tool-workspace"
})
const route = useRoute();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
const editTabs = useEditTabs();
const title = computed(() => {
    const mainTitle = "多多益善"
    const tool = findTool(editTabs.currentTabName.value || "")
    return `${tool?.meta?.title ? `${tool?.meta?.title} - ` : ''}${mainTitle}`
})
useHead({
    title: title
})

watch(toolName, () => {
    if (toolName.value) {
        if (toolName.value !== editTabs.currentTabName.value) {
            editTabs.addTab(toolName.value)
        }
    }
}, {
    immediate: true
})

</script>