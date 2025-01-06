<template>
    <div class="n-form-item-custom-empty">
        <n-form-item :="commonFormItemProps" :label-props="{ for: 'none' }" :show-feedback="showFeedback">
            <template #label>
                <tool-label :label="label" :actions="actions" />
            </template>
            <div class="flex flex-col w-full">
                <slot></slot>
            </div>
        </n-form-item>
    </div>
</template>

<script setup lang="ts">
export type Props = {
    label?: ToolLabelComponentProps['label'],
    showFeedback?: boolean,
    actions?: ToolLabelComponentProps['actions']
}
defineProps<Props>()

</script>

<style lang="less" scoped>
.n-form-item-custom-empty {
    :deep(> .n-form-item) {
        >.n-form-item-blank {
            display: flex;
            flex-direction: column;
            // min-height: 0px;
        }
    }
}
</style>