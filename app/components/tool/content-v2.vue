<template>
    <div class="size-full flex flex-row">
        <div class="w-[30%] h-full rounded-[12px] border p-[10px] mr-[5px] mt-[0px]">
            <custom-scrollbar out-bar>
                <div class="relative">
                    <tool-area v-if="tool?.meta?.description" label="描述-v2布局" class=" mb-[10px]">
                        <rich-text :content="tool.meta.description" />
                    </tool-area>
                    <slot name="input"></slot>
                    <tool-area v-if="hasRelated" label="相关工具">
                        <tool-related :toolMeta="tool!.meta!" />
                    </tool-area>
                </div>
            </custom-scrollbar>
        </div>
        <div class="w-[70%] h-full rounded-[12px] border ml-[5px]">
            <div class="size-full flex flex-col p-[10px]">
                <div class="grow">
                    <tool-area class="size-full" v-bind="propsLocal.output?.area">
                        <div class="size-full relative">
                            <loading-wrapper v-bind="props.output?.loadingWrapper">
                                <custom-scrollbar v-bind="propsLocal.output?.scroll">
                                    <slot name="output"></slot>
                                </custom-scrollbar>
                            </loading-wrapper>
                        </div>
                    </tool-area>
                </div>
                <div class="mt-[10px]" v-if="slots.actions">
                    <tool-area :="propsLocal.actions?.area">
                        <slot name="actions"></slot>
                    </tool-area>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { assign } from 'radash'

export type Props = {
    vertical?: {
        enabled?: boolean,
        top?: {
            class?: string
        },
        bottom?: {
            class?: string
        }
    },
    actions?: {
        area?: ToolAreaComponentProps
    },
    output?: {
        area?: ToolAreaComponentProps
        scroll?: CustomScrollbarComponentProps,
        loadingWrapper?: LoadingWrapperComponentProps,
    }
}
const props = defineProps<Props>()
const propsLocal = computed(() => {
    const {
        vertical,
        output,
        actions
    } = toRefs(props);
    const newVal = assign<Props>({
        vertical: {
            enabled: false
        },
        output: {
            area: {
                label: "结果",
                foldDisabled: true
            },
            scroll: {
                outBar: true
            },
        },
        actions: {
            area: {
                label: "操作",
                foldDisabled: true
            },
        }
    }, { vertical: vertical.value, output: output.value, actions: actions.value })
    return newVal
})
const slots = defineSlots<{
    input(): any
    output(): any
    actions?: () => any
}>()
const toolRenderInjectHelper = useToolRenderInjectHelper();
const name = toolRenderInjectHelper.inject()
const tool = computed(() => {
    return findTool(name?.value || "")
});

const hasRelated = computed(() => {
    const related = tool.value?.meta?.related || []
    return related.length > 0
})

</script>