<template>
    <div class="relative size-full">
        <div :class="[
            'absolute top-0 bottom-0 left-0 right-0 custom-n-scrollbar',
            outBar ? '-mr-[10px] -mb-[10px] out-bar' : ''
        ]">
            <n-scrollbar trigger="none" x-scrollable>
                <slot name="default"></slot>
            </n-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">
defineSlots<{
    default(): any
}>()
defineProps<{
    outBar?: boolean
}>()
</script>
<style lang="less" scoped>
.custom-n-scrollbar.out-bar {
    :deep(> .n-scrollbar) {
        padding-bottom: 10px;
        padding-right: 10px;

        >.n-scrollbar-rail {
            right: 3px;
            bottom: 3px;
        }

        >.n-scrollbar-rail--vertical {
            margin-bottom: 10px;
            width: 4px;

            .n-scrollbar-rail__scrollbar {
                width: 4px;
            }
        }

        >.n-scrollbar-rail--horizontal {
            margin-right: 10px;
            height: 4px;

            .n-scrollbar-rail__scrollbar {
                height: 4px;
            }
        }
    }

}
</style>