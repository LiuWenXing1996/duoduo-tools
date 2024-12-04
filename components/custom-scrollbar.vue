<template>
    <template v-if="!disabled">
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
    <template v-else>
        <slot name="default"></slot>
    </template>
</template>
<script setup lang="ts">
export type Props = {
    disabled?: boolean,
    outBar?: boolean,
    bottom?: number
}
defineSlots<{
    default(): any
}>()
const props = defineProps<Props>()
const bottomPx = computed(() => `${props.bottom}px`)
</script>
<style lang="less" scoped>
// .custom-n-scrollbar {
//     :deep(> .n-scrollbar) {
//         >.n-scrollbar-rail {
//             bottom: v-bind(bottomPx);
//         }

//         >.n-scrollbar-rail--vertical {
//             margin-bottom: 10px;
//             width: 4px;

//             .n-scrollbar-rail__scrollbar {
//                 width: 4px;
//             }
//         }

//         >.n-scrollbar-rail--horizontal {
//             margin-right: 10px;
//             height: 4px;

//             .n-scrollbar-rail__scrollbar {
//                 height: 4px;
//             }
//         }
//     }

// }

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