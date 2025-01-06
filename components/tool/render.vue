<template>
    <div class="size-full">
        <n-spin :show="loading || contentComponentRequest.loading.value" size="small" class="size-full" :content-class="[
            'size-full',
            loading ? '!opacity-0' : ''
        ].join(' ')">
            <template v-if="tool">
                <component :is="contentComponentRequest.data.value"></component>
            </template>
            <template v-else>
                {{ `工具 ${name} 未实现` }}
            </template>
        </n-spin>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    name: string
}>()
const refs = toRefs(props)
const loadingKeep = useAutoBoolean({
    time: 600,
    init: false
})
const editTabs = useEditTabs()
const loaded = ref(false);
loadingKeep.toggle()
const toolRenderInjectHelper = useToolRenderInjectHelper();
toolRenderInjectHelper.provide(refs.name)
const tool = computed(() => {
    return findTool(props.name)
});
const contentComponentRequest = useCustomRequest(async () => {
    console.log(`load ${props.name}`)
    if (!tool.value?.content) {
        return undefined
    }
    const res = (await tool.value.content()).default;
    return res
})

watch(() => editTabs.currentTabName.value, (currentTabNameValue) => {
    if (currentTabNameValue === props.name && loaded.value == false) {
        loaded.value = true;
        contentComponentRequest.runAsync()
    }
}, {
    immediate: true
})

const loading = computed(() => {
    return loadingKeep.content.value
})
</script>