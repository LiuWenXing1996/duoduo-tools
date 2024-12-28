<template>
    <div ref="container">
        <n-descriptions size="small" label-placement="left" :column="1" :label-style="{
            width: `${itemLabelWidth}px`
        }" label-class="inline-flex justify-between" :content-style="{
            width: `calc(100% - ${itemLabelWidth}px)`
        }">
            <n-descriptions-item v-for="item in data">
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

export type Props = {
    data: Item[],
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