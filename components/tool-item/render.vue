<template>
    <template v-if="tool">
        <component :is="tool.content"></component>
    </template>
    <template v-else>
        {{ `工具 ${name} 未实现` }}
    </template>
</template>
<script setup lang="ts">

const props = defineProps<{
    name: string
}>()
const refs = toRefs(props)
const toolRenderInjectHelper = useToolRenderInjectHelper();
toolRenderInjectHelper.provide(refs.name)
const tool = computed(() => {
    return findTool(props.name)
});
</script>