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
                                    <div class="size-full flex items-center text-[18px]">
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
        </template>
        <template #actions>
            <n-input size="small" placeholder="搜索ASCII码, 支持十进制、16 进制、八进制、二进制、code" v-model:value="searchKey"
                clearable />
        </template>
    </tool-content>
    <DefineItemTemplate v-slot="{ item }">
        <div class="size-full bg-secondary rounded flex items-center p-[2px] cursor-pointer hover:bg-primaryActiveBg hover:text-primary"
            @click="handleItemClick(item)">
            <div class="w-[80px] flex items-center justify-center text-[25px] ">
                {{ item.symbol }}
            </div>
            <div class="w-[calc(100%-80px)] ml-[2px] mr-[10px] text-[12px]">
                <div class="text-[18px]">
                    {{ item.dec }}
                </div>
                <div class="text-[12px] leading-none">
                    <rich-text :content="item.descriptionChinese" />
                </div>
            </div>
        </div>
    </DefineItemTemplate>
    <DefineItemDialogTemplate v-slot="{ item }">
        <key-value :item-label-width="100" :data="[
            { label: '符号', value: item.symbol },
            { label: '二进制BIN', value: item.bin },
            { label: '八进制OCT', value: item.oct },
            { label: '十进制DEC', value: item.dec.toString() },
            { label: '十六进制HEX', value: item.hex },
            { label: '描述', value: item.descriptionChinese || '' },
            { label: '英文描述', value: item.description || '' },
        ].map(e => { return { ...e, valueCopy: Boolean(e.value) } })" />
    </DefineItemDialogTemplate>
</template>

<script setup lang="tsx">
import { chunk } from "lodash-es"
import { asciiList, type AsciiGroup, type AsciiItem } from "./utils"

const [
    DefineItemTemplate,
    ReuseItemTemplate,
] = createReusableTemplate<{ item: AsciiItem }>()
const [
    DefineItemDialogTemplate,
    ReuseItemDialogTemplate,
] = createReusableTemplate<{ item: AsciiItem }>()
const searchKey = ref("");
const copy = useCopy();
const listSearched = computed(() => {
    const searchKeyVal = searchKey.value;
    if (!searchKeyVal) {
        return [...asciiList]
    }
    const list = asciiList.filter(e => {
        if (e.symbol.includes(searchKeyVal)) {
            return true
        }
        if (e.dec.toString().includes(searchKeyVal)) {
            return true
        }
        if (e.bin.toString().includes(searchKeyVal)) {
            return true
        }
        if (e.hex.toString().includes(searchKeyVal)) {
            return true
        }
        if (e.oct.toString().includes(searchKeyVal)) {
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

const groupMetaMap: Record<AsciiGroup, {
    name: string,
}> = {
    control: {
        name: "ASCII 控制字符 (字符编码: 0-31)"
    },
    printable: {
        name: "ASCII 打印字符 (字符编码: 32-127)"
    },
    extended: {
        name: "ASCII 扩展码 (字符编码: 128-255)"
    }
}

type VirtualListItem = {
    keyIndex: number
} & ({
    type: "group",
    count: number,
    group: {
        name: string,
    }
} | {
    type: "items",
    items: AsciiItem[]
})
const itemWidth = 200;
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
const dialog = useDialog()
const handleItemClick = (item: AsciiItem) => {
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
        meta: {
            name: string,
        },
        data: Record<string, AsciiItem>
    }> = {};
    listSearched.value.forEach(e => {
        if (!groups[e.group]) {
            groups[e.group] = {
                meta: groupMetaMap[e.group],
                data: {}
            }
        }
        groups[e.group].data[e.hex] = {
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
                name: group.meta.name
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
