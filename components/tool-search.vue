<template>
    <div class="w-[200px]">
        <n-auto-complete v-model:value="selectVal" placeholder="搜索工具" :options="toolsSearchOptions" clear-after-select
            blur-after-select @select="handleSearch" />
        <!-- <n-select placeholder="搜索工具" :show-checkmark="false" filterable :value="selectVal" :options="toolsSearchOptions"
            @update:value="v => {
                // TODO:封装Ta
                console.log({ v })
                selectVal = undefined
                editTabs.addTab(v)
            }" /> -->
    </div>
</template>
<script setup lang="ts">
import type { AutoCompleteOption, SelectOption } from 'naive-ui';
import { pinyin } from 'pinyin-pro';

const editTabs = useEditTabs();
const selectVal = ref("");
const allTools = getAllTools();
const sortedTools = sortByPinyin(allTools, (tool) => tool.meta?.title || tool.name).map(tool => {
    const title = tool.meta?.title || "";
    return {
        name: tool.name,
        title,
        pinyinList: [
            pinyin(title, { separator: "", toneType: "none" }).toLowerCase(),
            pinyin(title, { separator: " ", toneType: "none" }).toLowerCase()
        ],
        content: tool,
    }
});
const findTools = (val: string) => {
    const lowerVal = (val || "").trim().toLowerCase();
    return sortedTools.filter(tool => tool.title.includes(lowerVal) || tool.pinyinList.some(pin => {
        return pin.includes(lowerVal)
    })).map(tool => tool.content)
}
const toolsSearchOptions: ComputedRef<AutoCompleteOption[]> = computed(() => {
    return findTools(selectVal.value).map(tool => {
        return {
            label: tool.meta?.title || tool.name,
            value: tool.name
        }
    })
})
const handleSearch = (v: string) => {
    // 给一个延时，交互更自然
    setTimeout(() => {
        editTabs.addTab(v)
    }, 50);
}
</script>