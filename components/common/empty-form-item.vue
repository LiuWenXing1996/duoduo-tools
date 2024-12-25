<template>
    <div class="n-form-item-custom-empty">
        <n-form-item :label-props="{ for: 'none' }" :show-feedback="showFeedback">
            <template #label>
                <div class="flex items-center justify-center">
                    <span>{{ label }}</span>
                    <div class="ml-[10px]" v-if="actions.length > 0">
                        <n-space :size="10">
                            <template v-for="item in actions">
                                <template v-if="item">
                                    <common-icon-button v-bind="item" />
                                </template>
                            </template>
                        </n-space>
                    </div>
                </div>
            </template>
            <div class="flex flex-col w-full">
                <slot></slot>
            </div>
        </n-form-item>
    </div>
</template>

<script setup lang="ts">
export type Props = {
    label?: string,
    showFeedback?: boolean,
    actions?: (CommonIconButtonComponentProps | undefined)[]
}
const props = defineProps<Props>()
const actions = computed(() => {
    const actionsValue = props.actions || [];
    return actionsValue
})

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