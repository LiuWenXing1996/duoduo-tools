<template>
    <div class="size-full">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <a :href="home.href" target="_blank"
                        :class="`w-[50px] h-full items-center justify-center flex border-r hover:text-primary`">
                        <normal-icon name="logo" class="cursor-pointer border rounded-[6px]"></normal-icon>
                    </a>
                    <div class="ml-[10px]">
                        <tool-search />
                    </div>
                </div>
                <div class="pr-[10px] flex">
                    <theme-button />
                    <a href="https://github.com/LiuWenXing1996/duoduo-tools" target="_blank"
                        :class="`h-full items-center justify-center flex pl-[2px]`">
                        <normal-icon name="github"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>
                    </a>
                    <user-avatar />
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <div class="h-full w-[50px] flex flex-col border-r py-[8px]">
                    <div v-for="opt in sideBarOptions"
                        :class="`w-[full] last:mb-0 mb-[4px] items-center justify-center flex`">
                        <n-popselect :show-checkmark="false" :value="editTabs.currentTabName.value" :options="opt.list"
                            size="medium" scrollable placement='right-start' @update:value="(v) => {
                                editTabs.addTab(v)
                            }">
                            <template #header>
                                {{ opt.title }}{{ `（${opt.list.length}）` }}
                            </template>
                            <normal-icon :name="opt.icon || ''" :class="[
                                'cursor-pointer rounded-[6px]',
                                opt.list.find(e => e.value === editTabs.currentTabName.value) ? 'bg-primaryActiveBg text-primary' : 'hover:bg-hoverColor'
                            ]"></normal-icon>
                        </n-popselect>
                    </div>
                </div>
                <div class="h-full w-[calc(100%-50px)]">
                    <div class="size-full">
                        <template v-if="hasOpenedTabs">
                            <div class="flex h-[40px] w-full border-b">
                                <div class="h-full w-[calc(100%-60px)]">
                                    <!-- TODO：滚动时产生一个阴影？ -->
                                    <XScroll>
                                        <div class="flex h-[38px] w-max justify-center p-[6px]">
                                            <div v-for="item in toolTabs" :class="[
                                                'flex h-full justify-center items-center mx-[3px] p-[5px] border  cursor-pointer rounded-[5px]',
                                            ]" @click="editTabs.activeTab(item.name)">
                                                <div :class="[
                                                    'hover:text-primary mr-[4px]',
                                                    item.name === editTabs.currentTabName.value ? 'text-primary' : ''
                                                ]">
                                                    {{ item.tool?.meta?.title || `工具 ${item.name} 未实现` }}
                                                </div>
                                                <div class="flex justify-center items-center p-[2px] cursor-pointer  rounded-[2px] hover:bg-hoverColor"
                                                    @click="(e) => {
                                                        e.stopPropagation();
                                                        editTabs.removeTab(item.name)
                                                    }">
                                                    <svg-icon size="16" name="common-close"></svg-icon>
                                                </div>
                                            </div>
                                        </div>
                                    </XScroll>
                                </div>
                                <div class="h-full w-[60px] flex justify-center items-center border-l">
                                    <div :class="[
                                        'relative flex justify-center items-center h-[24px] w-[24px] cursor-pointer rounded-[6px] hover:bg-hoverColor',
                                        collectToolRequest.loading.value ? ' cursor-not-allowed pointer-events-none' : ''
                                    ]" @click="collectToolRequest.runAsync">
                                        <svg-icon size="16" class="absolute" name="common-loading"
                                            v-if="collectToolRequest.loading.value"></svg-icon>
                                        <svg-icon size="16" :class="[
                                            sideBarTools.includes(toolName || '') ? 'text-primary' : '',
                                        ]" name="tool-tabs-user-collect" v-else></svg-icon>
                                    </div>
                                    <tool-tabs-actions />
                                </div>
                            </div>
                            <div class="h-[calc(100%-40px)] w-full">
                                <div class="size-full p-[10px]">
                                    <slot></slot>
                                    <!-- 此处直接渲染内容，具体原因参照[pages/tools/toolName] -->
                                    <template v-for="item in editTabs.openedTabNames.value" :key="item">
                                        <div class="size-full" v-show="item === editTabs.currentTabName.value">
                                            <define-tool-render :name="item" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="size-full flex items-center justify-center">
                                <n-empty description="没有打开的工具">
                                </n-empty>
                            </div>
                        </template>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { XScroll } from 'vueuc'
import { first } from 'radash';
const router = useRouter();
const route = useRoute();
const home = router.resolve("/")
const editTabs = useEditTabs();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
const title = computed(() => {
    const mainTitle = "多多益善"
    const tool = findTool(editTabs.currentTabName.value || "")
    return `${tool?.meta?.title ? `${tool?.meta?.title} - ` : ''}${mainTitle}`
})
useHead({
    title: title
})
const currentUser = useCurrentUser();
const allTools = getAllTools();
const sideBarTools = computed(() => {
    return filterNullable(Object.entries(currentUser.setting.value?.sideBar?.tools || {}).map(([key, value]) => {
        if (value) {
            return key
        }
    }))
})
const sideBarOptions = computed(() => {
    const user = currentUser.current.value;
    const defaultList = sortByPinyin(Object.entries(ToolCategoryMap), ([name]) => name)
        .filter(([name, meta]) => {
            if (!meta.auth) {
                return true
            }
            if (meta.auth === ToolMetaAuth.user) {
                if (user) {
                    return true
                }
            }
            if (meta.auth === ToolMetaAuth.admin) {
                if (user && (user.isAdmin || user?.isSuper)) {
                    return true
                }
            }
            if (meta.auth === ToolMetaAuth.super) {
                if (user && user?.isSuper) {
                    return true
                }
            }
            return false
        }).map(([name, meta]) => {
            const toolList = allTools.filter(tool => tool.meta?.category === name);
            const toolListSorted = sortByPinyin(toolList, (val) => val.meta?.title || val.name);
            const list: SelectOption[] = toolListSorted.map(tool => {
                return {
                    label: tool.meta?.title || tool.name,
                    value: tool.name
                }
            })
            return {
                name,
                ...meta,
                list
            }
        })

    const useCollectList: ToolCategoryMeta & { name: string, list: SelectOption[] } = {
        name: "tool-user-collect",
        icon: "tool-category-user-collect",
        title: "收藏工具",
        list: sortByPinyin(
            allTools.filter(tool => sideBarTools.value.includes(tool.name)),
            (val) => val.meta?.title || val.name
        ).map(tool => {
            return {
                label: tool.meta?.title || tool.name,
                value: tool.name
            }
        })
    }

    return [useCollectList, ...defaultList]
})
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
        }
    })
})
const collectToolRequest = useCustomRequest(async () => {
    const toolNameValue = toolName.value;
    if (!toolNameValue) {
        return
    }
    if (sideBarTools.value.includes(toolNameValue)) {
        await currentUser.collectToolRequest.runAsync({ toolName: toolNameValue, unCollect: true })
    } else {
        await currentUser.collectToolRequest.runAsync({ toolName: toolNameValue, unCollect: false })
    }

})

const hasOpenedTabs = computed(() => {
    return editTabs.openedTabNames.value.length > 0
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