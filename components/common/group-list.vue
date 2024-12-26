<template>
    <div ref="container">
        <n-list hoverable clickable>
            <n-list-item v-for="group in data" class="!p-[10px]">
                <n-thing content-class="ml-[10px] !mt-[5px]">
                    <template #header>
                        <div class="block">
                            <common-rich-text :content="group.label" />
                            <span class="ml-[10px] inline-flex" v-if="(group.labelActions || []).length > 0">
                                <n-space :size="10">
                                    <template v-for="item in group.labelActions">
                                        <template v-if="item">
                                            <common-icon-button v-bind="item" />
                                        </template>
                                    </template>
                                </n-space>
                            </span>
                        </div>
                    </template>

                    <n-descriptions size="small" label-placement="left" :column="1" :label-style="{
                        width: `${itemLabelWidth}px`
                    }" label-class="inline-flex justify-between" :content-style="{
                        width: `calc(100% - ${itemLabelWidth}px)`
                    }">
                        <n-descriptions-item v-for="item in group.items">
                            <template #label>
                                <div class="block">
                                    <common-rich-text :content="item.label" />
                                    <span class="ml-[10px] inline-flex" v-if="(item.labelActions || []).length > 0">
                                        <n-space :size="10" inline>
                                            <template v-for="action in item.labelActions">
                                                <template v-if="action">
                                                    <common-icon-button v-bind="action" />
                                                </template>
                                            </template>
                                        </n-space>
                                    </span>
                                </div>
                            </template>
                            <div class="block">
                                <common-rich-text :content="item.value" />
                                <span class="ml-[10px] inline-flex" v-if="(item.valueActions || []).length > 0">
                                    <n-space :size="10">
                                        <template v-for="action in item.valueActions">
                                            <template v-if="action">
                                                <common-icon-button v-bind="action" />
                                            </template>
                                        </template>
                                    </n-space>
                                </span>
                            </div>
                        </n-descriptions-item>
                    </n-descriptions>
                </n-thing>
            </n-list-item>
        </n-list>
    </div>
</template>
<script setup lang="ts">
import { isFunction } from 'radash'
import type { RenderFunction } from 'vue'

export type Item = {
    label: string | RenderFunction,
    value: string | RenderFunction,
    labelActions?: (CommonIconButtonComponentProps | undefined)[],
    valueActions?: (CommonIconButtonComponentProps | undefined)[]
}

export type Group = {
    label: string | RenderFunction,
    labelActions?: (CommonIconButtonComponentProps | undefined)[],
    items: Item[]
}



export type Props = {
    data: Group[],
    itemLabelWidth?: number | ((container: DOMRectReadOnly | undefined) => number | undefined);
}
const props = defineProps<Props>()
const defaultItemLabelWidth = 120;
const containerRef = useTemplateRef("container");
const containerRect = shallowRef<DOMRectReadOnly | undefined>()
const itemLabelWidth = computed(() => {
    if (!props.itemLabelWidth) {
        return defaultItemLabelWidth
    }
    if (!isFunction(props.itemLabelWidth)) {
        return props.itemLabelWidth
    }
    const val = props.itemLabelWidth(containerRect.value);
    return val || defaultItemLabelWidth
})
useResizeObserver(containerRef, async (entries) => {
    const entry = entries[0]
    containerRect.value = entry.contentRect
});
</script>