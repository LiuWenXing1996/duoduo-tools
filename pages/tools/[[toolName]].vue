<template>
    <div class="size-full">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <a :href="home.href" target="_blank"
                        :class="`w-[50px] h-full items-center justify-center flex border-r hover:text-primary`">
                        <normal-icon name="ri:tools-fill" class="cursor-pointer border rounded-[6px]"></normal-icon>
                    </a>
                    <div class="ml-[10px]">
                        <tool-search />
                    </div>
                </div>
                <div class="pr-[10px] flex">
                    <theme-button />
                    <a href="https://github.com/LiuWenXing1996/web-tools" target="_blank"
                        :class="`h-full items-center justify-center flex pl-[2px]`">
                        <normal-icon name="mdi:github"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>
                    </a>
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <div class="h-full w-[50px] flex flex-col border-r py-[8px]">
                    <div v-for="opt in sideBarOptions"
                        :class="`w-[full] last:mb-0 mb-[4px] items-center justify-center flex`">
                        <n-popselect :show-checkmark="false" v-model:value="editTabs.currentTabName.value"
                            :options="opt.list" size="medium" scrollable placement='right-start' @update:value="(v) => {
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
                    <template v-if="editTabs.currentTabName.value && editTabs.currentTabName.value.length > 0">
                        <n-tabs class="h-full" :value="editTabs.currentTabName.value" @update:value="(v) => {
                            editTabs.activeTab(v)
                        }" size="small" type="card" closable @close="(key) => {
                            editTabs.removeTab(key);
                        }" pane-class="size-full !p-[10px]">
                            <template #suffix>
                                <div class="mr-[10px]">
                                    <tool-tabs-actions />
                                </div>

                            </template>
                            <n-tab-pane :name="item.name" :tab="item.tool?.meta?.title || `工具 ${item.name} 未实现`"
                                v-for="item in toolTabs" display-directive="show">
                                <tool-item-render :name="item.name" />
                            </n-tab-pane>
                        </n-tabs>
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
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { first } from 'radash';
const route = useRoute();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
const router = useRouter();
const home = router.resolve("/")
const editTabs = useEditTabs();
const title = computed(() => {
    const mainTitle = "Web-Tools"
    const tool = findTool(editTabs.currentTabName.value || "")
    return `${tool?.meta?.title ? `${tool?.meta?.title} - ` : ''}${mainTitle}`
})
useHead({
    title: title
})
const allTools = getAllTools();
const sideBarOptions = sortByPinyin(Object.entries(ToolCategoryMap), ([name]) => name).map(([name, meta]) => {
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
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
        }
    })
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