<template>
    <div class="size-full">
        <n-spin :show="loading || contentComponentRequest.loading.value" size="small" class="size-full" :content-class="[
            'size-full',
            loading ? '!opacity-0' : ''
        ].join(' ')">
            <template v-if="tool">
                <div class="size-full flex flex-row">
                    <div class="w-[30%] h-full rounded-[12px] border p-[10px] mr-[5px] mt-[0px]">
                        <custom-scrollbar out-bar>
                            <div class="relative">
                                <tool-area v-if="tool?.meta?.description" label="描述" class=" mb-[10px]">
                                    <rich-text :content="tool.meta.description" />
                                </tool-area>
                                <tool-area v-if="tool?.meta?.v2?.operator" label="操作" class=" mb-[10px]">
                                    <component :is="tool.meta.v2.operator" />
                                </tool-area>
                                <tool-area v-if="hasRelated" label="相关工具">
                                    <tool-related :toolMeta="tool.meta!" />
                                </tool-area>
                            </div>
                        </custom-scrollbar>
                    </div>
                    <div class="w-[70%] h-full rounded-[12px] border p-[10px] ml-[5px]">
                        <custom-scrollbar out-bar>
                            <tool-area label="结果">
                                <component :is="tool.meta?.v2?.preview"></component>
                            </tool-area>
                        </custom-scrollbar>
                    </div>
                </div>
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

const hasRelated = computed(() => {
    const related = tool.value?.meta?.related || []
    return related.length > 0
})

const loading = computed(() => {
    return loadingKeep.content.value
})
</script>