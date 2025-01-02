<template>
    <n-form-item :="propsLocal.formItem">
        <template #label>
            <common-form-item-label :="propsLocal.label" />
        </template>
        <slot name="default"></slot>
    </n-form-item>
</template>
<script setup lang="tsx">
import type { FormItemProps } from 'naive-ui'
export type Props = Omit< /*@vue-ignore*/ FormItemProps, "label"> & {
    label?: CommonFormItemLabelComponentProps['label'],
    labelActions?: CommonFormItemLabelComponentProps['actions']
}
const props = defineProps<Props>()

const propsLocal = computed(() => {
    const { label, labelActions, ...rest } = props
    const labelProps = {
        label,
        actions: labelActions
    }
    return {
        formItem: rest,
        label: labelProps
    }
})
</script>