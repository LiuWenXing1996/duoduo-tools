<template>
    <div class="size-full">
        <n-spin :show="loading || contentComponentRequest.loading.value" size="small" class="size-full" :content-class="[
            'size-full',
            loading ? '!opacity-0' : ''
        ].join(' ')">
            <template v-if="tool">
                <template v-if="hasAuth">
                    <component :is="contentComponentRequest.data.value"></component>
                </template>
                <template v-else>
                    <div class="size-full flex items-center justify-center">
                        <!-- TODO:这个地方的图标换下 -->
                        <n-empty :description="noAuthTip">
                        </n-empty>
                    </div>
                </template>
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

const currentUser = useCurrentUser();
const loading = computed(() => {
    return loadingKeep.content.value || currentUser.userRequest.loading.value
})
const noAuthTip = computed(() => {
    const toolAuth = tool.value?.meta?.auth;
    if (toolAuth === ToolMetaAuth.user) {
        return "暂无权限，请登录"
    }
    if (toolAuth === ToolMetaAuth.admin) {
        return "暂无权限，需要管理员权限"
    }
    if (toolAuth === ToolMetaAuth.super) {
        return "暂无权限，需要超级管理员权限"
    }
    return "无权限"
})
const hasAuth = computed(() => {
    const toolAuth = tool.value?.meta?.auth;
    if (!toolAuth) {
        return true
    }
    if (toolAuth === ToolMetaAuth.user) {
        if (currentUser.current.value) {
            return true
        }
    }
    if (toolAuth === ToolMetaAuth.admin) {
        if (currentUser.current.value && (currentUser.current.value.isAdmin || currentUser.current.value.isSuper)) {
            return true
        }
    }

    if (toolAuth === ToolMetaAuth.super) {
        if (currentUser.current.value && currentUser.current.value.isSuper) {
            return true
        }
    }
    return false
})
</script>