<template>
    <template v-if="propsLocal.enabled">
        <n-tooltip v-bind="propsLocal.tooltip">
            <template #trigger>
                <slot name="default"></slot>
            </template>
            <template v-if="slots.content">
                <slot name="content"></slot>
            </template>
            <template v-else-if="props.content">
                <rich-text :content="props.content" />
            </template>
        </n-tooltip>
    </template>
    <template v-else>
        <slot name="default"></slot>
    </template>
</template>
<script setup lang="ts">
import type { TooltipProps } from "naive-ui"
import { assign } from "radash";
import type { VNodeChild } from "vue";

export type Props = {
    enabled?: boolean,
    tooltip?: TooltipProps,
    content?: string | (() => VNodeChild),
}

export type Slots = {
    default(): any,
    content?: () => any
}

const props = defineProps<Props>();
const slots = defineSlots<Slots>();
const propsLocal = computed(() => {
    const {
        enabled,
        tooltip
    } = toRefs(props);
    const newVal = assign<Props>({
        enabled: false,
        tooltip: {
            trigger: "hover"
        }
    }, { enabled: enabled.value, tooltip: tooltip.value })
    return newVal
})
</script>
