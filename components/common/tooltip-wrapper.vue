<template>
    <template v-if="propsLocal.enabled">
        <n-tooltip v-bind="propsLocal.tooltip">
            <template #trigger>
                <slot name="default"></slot>
            </template>
            <template v-if="props.content">
                {{ props.content }}
            </template>
            <template v-else-if="slots.content">
                <slot name="content"></slot>
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
export type Props = {
    enabled?: boolean,
    tooltip?: TooltipProps,
    content?: string
}

export type Slots = {
    default(): any,
    content?: () => any
}
const slots = defineSlots<Slots>()
const props = defineProps<Props>()
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
