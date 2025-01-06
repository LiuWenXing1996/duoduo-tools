<template>
    <template v-if="propsLocal.enabled">
        <div class="size-full">
            <n-spin v-bind="propsLocal.spin" :show="propsLocal.loading" class="size-full" :content-class="[
                'size-full',
                propsLocal.loading ? '!opacity-0' : ''
            ].join(' ')">
                <slot name="default"></slot>
            </n-spin>
        </div>
    </template>
    <template v-else>
        <slot name="default"></slot>
    </template>
</template>
<script setup lang="ts">
import type { SpinProps } from 'naive-ui';
import { assign } from 'radash';

export type Props = {
    enabled?: boolean,
    loading?: boolean,
    spin?: Omit<SpinProps, "loading">
}
export type Slots = {
    default: () => any
}
const props = defineProps<Props>();
const slots = defineSlots<Slots>();

const propsLocal = computed(() => {
    const {
        enabled,
        loading,
        spin,
    } = toRefs(props);
    const newVal = assign<Props>(
        {
            spin: {
                size: "small",
            }
        },
        {
            enabled: enabled.value,
            loading: loading.value,
            spin: spin.value
        }
    )
    return newVal
})
</script>