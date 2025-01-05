<template>
    <template v-if="!disabled">
        <fieldset class="rounded-[8px]  border-dashed border-2 p-[10px] mt-[10px] first:mt-[0px]">
            <legend class="-ml-[4px] px-[5px] text-[14px] font-medium" v-if="labelProps.label">
                <tool-label :="labelProps" />
            </legend>
            <div class="size-full" v-show="isExpand">
                <slot name="default"></slot>
            </div>
        </fieldset>
    </template>
    <template v-else>
        <slot name="default"></slot>
    </template>
</template>
<script setup lang="ts">
export type Props = {
    disabled?: boolean,
    label?: ToolLabelComponentProps['label'],
    labelActions?: ToolLabelComponentProps['actions'],
    foldDisabled?: boolean
}
const props = defineProps<Props>()
const slots = defineSlots<{
    label?: () => any
    default(): any
}>()
const isExpand = ref(true);
const labelProps = computed<ToolLabelComponentProps>(() => {
    const labelActions: ToolLabelComponentProps['actions'] = [
        props.foldDisabled
            ? undefined
            : isExpand.value
                ? {
                    name: 'common-fold',
                    tooltip: "折叠面板",
                    onClick: () => {
                        isExpand.value = false;
                    },
                }
                : {
                    name: 'common-unfold',
                    tooltip: "展开面板",
                    onClick: () => {
                        isExpand.value = true;
                    },
                },
        ...props.labelActions || []
    ]
    return {
        label: slots.label || props.label,
        actions: labelActions,
    }
})
</script>