<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '列表'
        },
    }" :actions="{
        area: {
            label: '搜索'
        }
    }">
        <template #output>
            <div class="relative size-full">
                <div :class="[
                    'absolute top-0 bottom-0 left-0 right-0',
                ]" ref="container">
                    <n-virtual-list :style="{
                        maxHeight: `${containerRectFinal.height}px`
                    }" :item-size="itemHeight" :items="result">
                        <template #default="{ item }: { item: VirtualListItem }">
                            <div :style="{
                                height: `${itemHeight}px`
                            }" :key="item.keyIndex">
                                <template v-if="item.type == 'group'">
                                    <div class="size-full flex items-center">
                                        {{ item.group.cnName }} ({{ item.count }} 个)
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
        </template>
        <template #actions>
            <n-input size="small" placeholder="搜索Emoji, 支持中文、英文、code" v-model:value="searchKey" clearable></n-input>
        </template>
    </tool-content>
    <DefineItemTemplate v-slot="{ item }">
        <div class="size-full bg-secondary rounded flex items-center p-[2px] cursor-pointer hover:bg-primaryActiveBg hover:text-primary"
            @click="handleItemClick(item)">
            <div class="w-[60px] flex items-center justify-center text-[40px] ">
                {{ item.char }}
            </div>
            <div class="w-[calc(100%-60px)] ml-[2px] mr-[10px] text-[12px]">
                <div class="text-[12px] leading-none mb-[10px]">
                    <rich-text :content="item.codes" />
                </div>
                <div class="text-[12px] leading-none">
                    <rich-text :content="item.cnName" />
                </div>
            </div>
        </div>
    </DefineItemTemplate>
    <DefineItemDialogTemplate v-slot="{ item }">
        <key-value :item-label-width="80" :data="[
            { label: 'emoji', value: item.char },
            { label: '编码', value: item.codes },
            { label: '描述', value: item.cnName },
            { label: '英文描述', value: item.enName },
            { label: '分组', value: item.group.cnName },
        ].map(e => { return { ...e, valueCopy: Boolean(e.value) } })" />
    </DefineItemDialogTemplate>
</template>

<script setup lang="tsx">
import emojiArray from "@angelofana/emoji-json/emoji-array.json";
import { chunk } from "lodash-es"

type Item = {
    enName: string,
    cnName: string,
    codes: string,
    char: string,
    group: {
        enName: string,
        cnName: string
    }
}
console.log({ emojiArray });
const [
    DefineItemTemplate,
    ReuseItemTemplate,
] = createReusableTemplate<{ item: Item }>()
const [
    DefineItemDialogTemplate,
    ReuseItemDialogTemplate,
] = createReusableTemplate<{ item: Item }>()
const searchKey = ref("");
const listSearched = computed(() => {
    const searchKeyVal = searchKey.value;
    if (!searchKeyVal) {
        return [...emojiArray]
    }
    const list = emojiArray.filter(e => {
        if (e.char.includes(searchKeyVal)) {
            return true
        }
        if (e.codes.includes(searchKeyVal)) {
            return true
        }
        if (e.group_i18n.en.includes(searchKeyVal)) {
            return true
        }
        if (e.group_i18n.zh_CN.includes(searchKeyVal)) {
            return true
        }
        if (e.name_i18n.en.includes(searchKeyVal)) {
            return true
        }
        if (e.name_i18n.zh_CN.includes(searchKeyVal)) {
            return true
        }
        return false
    })

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
    group: Item['group']
} | {
    type: "items",
    items: Item[]
})
const itemWidth = 200;
const itemHeight = 100;
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
const dialog = useDialog()
const handleItemClick = (item: Item) => {
    dialog.create({
        showIcon: false,
        title: "ASCII 码详情",
        content: () => {
            return h(ReuseItemDialogTemplate, { item })
        }
    })
}

const result = computed(() => {
    const itemPerVal = itemPer.value;
    const groups: Record<string, {
        meta: Item['group'],
        data: Record<string, Item>
    }> = {};
    listSearched.value.forEach(e => {
        if (!groups[e.group]) {
            groups[e.group] = {
                meta: {
                    enName: e.group_i18n.en,
                    cnName: e.group_i18n.zh_CN
                },
                data: {}
            }
        }
        groups[e.group].data[e.codes] = {
            enName: e.name_i18n.en,
            cnName: e.name_i18n.zh_CN,
            codes: e.codes,
            char: e.char,
            group: {
                enName: e.group_i18n.en,
                cnName: e.group_i18n.zh_CN
            }
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
                enName: group.meta.enName,
                cnName: group.meta.cnName
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
