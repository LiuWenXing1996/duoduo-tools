<template>
    <div ref="container">
        <n-descriptions size="small" label-placement="left" :column="1" :label-style="{
            width: `${itemLabelWidth}px`
        }" label-class="inline-flex justify-between" :content-style="{
            width: `calc(100% - ${itemLabelWidth}px)`
        }">
            <n-descriptions-item v-for="item in items">
                <template #label>
                    <div class="inline-flex">
                        <tool-label :label="item.label" :actions="item.labelActions" />
                    </div>
                </template>
                <div class="inline-flex">
                    <tool-label :label="item.value" :actions="item.valueActions" />
                </div>
            </n-descriptions-item>
        </n-descriptions>
    </div>
</template>
<script setup lang="ts">
import { isFunction } from 'radash'
export type Item = {
    label: ToolLabelComponentProps['label'],
    labelActions?: ToolLabelComponentProps['actions'],
    value: ToolLabelComponentProps['label'],
    valueActions?: ToolLabelComponentProps['actions']
}

export type Props = {
    data: (Item | undefined | (() => Item | undefined))[],
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

const items = computed<Item[]>(() => {
    const items: (Item | undefined)[] = (props.data || []).map(item => {
        if (!item) {
            return undefined
        }
        let itemWithFunction: Item | undefined = undefined;
        if (isFunction(item)) {
            itemWithFunction = item();
        } else {
            itemWithFunction = item
        }
        return itemWithFunction
    });
    const itemsNullable = filterNullable(items)
    return itemsNullable
})
useResizeObserver(containerRef, async (entries) => {
    const entry = entries[0]
    containerRect.value = entry.contentRect
});
</script>