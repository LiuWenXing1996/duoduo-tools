<template>
    <div class="h-full w-[50px] flex flex-col border-r py-[8px]">
        <div v-for="opt in sideBarOptions" :class="`w-[full] last:mb-0 mb-[4px] items-center justify-center flex`">
            <n-popselect :show-checkmark="false" :value="editTabs.currentTabName.value" :options="opt.list"
                size="medium" scrollable placement='right-start' @update:value="(v) => {
                    editTabs.addTab(v)
                }">
                <template #header>
                    {{ opt.title }}{{ `（${opt.list.length}）` }}
                </template>
                <div :class="[
                    'cursor-pointer rounded-[6px] h-[36px] w-[36px] flex justify-center items-center',
                    opt.list.find(e => e.value === editTabs.currentTabName.value) ? 'bg-primaryActiveBg text-primary' : 'hover:bg-hoverColor'
                ]">
                    <svg-icon :size="16" :name="opt.icon || ''" />
                </div>
            </n-popselect>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
const editTabs = useEditTabs();
const allTools = getAllTools();
const sideBarOptions = computed(() => {
    const defaultList = sortByPinyin(Object.entries(ToolCategoryMap), ([name]) => name)
        .map(([name, meta]) => {
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
    return [...defaultList]
})
</script>