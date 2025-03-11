<template>
    <div class="size-full flex flex-col">
        <div class="h-[80px] w-full px-[30px] flex items-center justify-center">
            <n-input size="medium" placeholder="搜索工具, 支持关键字、拼音" v-model:value="searchKey" clearable />
        </div>
        <div class="relative h-[calc(100%-80px)] w-full">
            <div :class="[
                'absolute top-0 bottom-0 left-0 right-0 p-[10px]',
            ]" ref="container">
                <n-virtual-list :style="{
                    maxHeight: `${containerRectFinal.height}px`
                }" :item-size="itemHeight" :items="result">
                    <template #default="{ item }: { item: VirtualListItem }">
                        <div :style="{
                            height: `${itemHeight}px`
                        }" :key="item.keyIndex">
                            <template v-if="item.type == 'group'">
                                <div class="size-full flex items-center text-[18px]">
                                    <svg-icon :size="20" :name="item.group.icon || ''" class="ml-[10px] mr-[10px]" />
                                    {{ item.group.name }}
                                </div>
                            </template>
                            <template v-if="item.type == 'items'">
                                <div class="size-full flex">
                                    <div v-for="i in itemPer" class="p-[5px] flex-1">
                                        <template v-if="item.items[i - 1]">
                                            <ReuseItemTemplate :item="item.items[i - 1]" />
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </n-virtual-list>
            </div>
        </div>

    </div>

    <DefineItemTemplate v-slot="{ item }">
        <div class="size-full bg-secondary rounded flex flex-col items-center p-[2px] cursor-pointer hover:bg-primaryActiveBg hover:text-primary"
            @click="handleItemClick(item)">
            <div class="size-full flex items-center justify-center text-[20px] text-center">
                {{ item.meta?.title || item.name }}
            </div>
        </div>
    </DefineItemTemplate>
</template>

<script setup lang="tsx">
import { chunk } from "lodash-es"
import { pinyin } from 'pinyin-pro';
import type { Tool } from "~/modules/collect-tools/runtime/list";
const [
    DefineItemTemplate,
    ReuseItemTemplate,
] = createReusableTemplate<{ item: Tool }>()
const searchKey = ref("");
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
    const valTrim = (val || '').trim();
    const lowerVal = valTrim.toLowerCase();
    return sortedTools.filter(tool => tool.title.includes(valTrim) || tool.title.includes(lowerVal) || tool.pinyinList.some(pin => {
        return pin.includes(lowerVal)
    })).map(tool => tool.content)
}
const listSearched = computed(() => {
    const searchKeyVal = searchKey.value;
    if (!searchKeyVal) {
        return [...allTools]
    }
    const list = findTools(searchKeyVal);
    return list
})
const containerRef = useTemplateRef("container");
const containerRect = shallowRef<DOMRectReadOnly | undefined>()
useResizeObserver(containerRef, async (entries) => {
    const entry = entries[0]
    containerRect.value = entry.contentRect
});


type VirtualListItem = {
    keyIndex: number
} & ({
    type: "group",
    count: number,
    group: {
        name: string,
        icon: string
    }
} | {
    type: "items",
    items: Tool[]
})
const itemWidth = 300;
const itemHeight = 80;
const containerRectFinal = computed(() => {
    const width = containerRect.value?.width || 100;
    const height = containerRect.value?.height || 100;
    return {
        width,
        height
    }
})

const itemPer = computed(() => {
    const width = containerRectFinal.value.width;
    const val = Math.floor(width / itemWidth);
    if (val < 1) {
        return 1
    }
    return val;
})
const editTabs = useEditTabs();
const handleItemClick = (item: Tool) => {
    // 给一个延时，交互更自然
    setTimeout(() => {
        editTabs.addTab(item.name)
    }, 50);
}

const result = computed(() => {
    const itemPerVal = itemPer.value;
    const groups: Record<string, {
        meta: {
            name: string,
            icon: string
        },
        data: Record<string, Tool>
    }> = {};
    listSearched.value.forEach(e => {

        const meta = e.meta;
        if (!meta) {
            return;
        }
        if (!groups[meta.category]) {
            groups[meta.category] = {
                meta: {
                    name: ToolCategoryMap[meta.category as ToolCategory].title || meta.category,
                    icon: ToolCategoryMap[meta.category as ToolCategory].icon || ''
                },
                data: {}
            }
        }
        groups[meta.category].data[e.name] = {
            ...e
        }
    })
    const list: VirtualListItem[] = [];
    let keyIndex = 0;
    for (const key in groups) {
        const group = groups[key];

        const dataList = Object.values(group.data);
        list.push({
            keyIndex: keyIndex++,
            type: "group",
            count: dataList.length,
            group: {
                name: group.meta.name,
                icon: group.meta.icon
            }
        })
        const dataListCluster = chunk(dataList, itemPerVal);
        for (const key in dataListCluster) {
            const items = dataListCluster[key];
            list.push({
                keyIndex: keyIndex++,
                type: "items",
                items
            })
        }
    }
    console.log({ list })
    return list
})
</script>
