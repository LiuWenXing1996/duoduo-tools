<template>
    <define-tool-wrapper :vertical="{
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
        actions: {
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
                                        <div v-for="i in item.items" class="emoji-item p-[5px] ">
                                            <div class="size-full bg-secondary rounded flex items-center p-[2px] cursor-pointer hover:bg-primaryActiveBg hover:text-primary"
                                                @click="copy(i.char)">
                                                <div class="w-[30px] flex items-center justify-center">
                                                    {{ i.char }}
                                                </div>
                                                <div class="w-[calc(100%-30px)] ml-[2px] text-[12px]">
                                                    {{ i.cnName }}
                                                </div>
                                            </div>
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
    </define-tool-wrapper>
</template>

<script setup lang="tsx">
import emojiArray from "@angelofana/emoji-json/emoji-array.json";
import { chunk } from "lodash-es"

console.log({ emojiArray });

const searchKey = ref("");
const copy = useCopy();
const emojiListSearched = computed(() => {
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
    group: {
        enName: string,
        cnName: string
    }
} | {
    type: "items",
    items: {
        enName: string,
        cnName: string,
        codes: string,
        char: string
    }[]
})
const itemWidth = 200;
const itemHeight = 50;
const containerRectFinal = computed(() => {
    const width = containerRect.value?.width || 100;
    const height = containerRect.value?.height || 100;
    return {
        width,
        height
    }
})

const result = computed(() => {
    const width = containerRectFinal.value.width;
    const groups: Record<string, {
        meta: {
            enName: string,
            cnName: string,
        },
        data: Record<string, {
            enName: string,
            cnName: string,
            codes: string,
            char: string
        }>
    }> = {};
    emojiListSearched.value.forEach(e => {
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
            char: e.char
        }
    })
    const list: VirtualListItem[] = [];
    let keyIndex = 0;
    const itemPer = width / itemWidth;
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
        const dataListCluster = chunk(dataList, itemPer);
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
const itemWidthPx = computed(() => `${itemWidth}px`)

</script>
<style lang="less" scoped>
.emoji-item {
    width: v-bind(itemWidthPx);
}
</style>