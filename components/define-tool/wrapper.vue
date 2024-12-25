<template>
    <div :class="[
        'size-full flex flex-col-reverse ',
        propsLocal.vertical?.enabled ? '' : 'md:flex-row'
    ]">
        <div :class="[
            'w-full h-[50%] mt-[5px] rounded-[12px] border p-[10px]  ',
            propsLocal.vertical?.enabled ? '' : 'md:w-[50%] md:h-full md:mr-[5px] md:mt-[0px]',
            propsLocal.vertical?.top?.class
        ]">
            <custom-scrollbar out-bar>
                <div class="relative">
                    <define-tool-area v-if="tool?.meta?.description" label="描述" class=" mb-[10px]">
                        <div class="break-all whitespace-pre-wrap ">
                            <template v-if="isString(tool.meta.description)">
                                {{ tool.meta.description }}
                            </template>
                            <template v-else>
                                <component :is="tool.meta.description"></component>
                            </template>
                        </div>
                    </define-tool-area>
                    <slot name="input"></slot>
                    <define-tool-area v-if="toolRelated.length > 0" label="相关工具">
                        <n-space>
                            <n-tag size="small" v-for="item in toolRelated" class=" cursor-pointer hover:text-primary"
                                @click="() => handleToolRelatedItemClick(item)">
                                {{
                                    item.title
                                }}
                            </n-tag>
                        </n-space>
                    </define-tool-area>
                </div>
            </custom-scrollbar>
        </div>
        <div :class="[
            'w-full h-[50%] mb-[5px]  rounded-[12px] border ',
            propsLocal.vertical?.enabled ? '' : 'md:w-[50%] md:h-full md:ml-[5px] md:mb-[0px]',
            propsLocal.vertical?.bottom?.class
        ]">
            <div class="size-full flex flex-col p-[10px]">
                <div class="grow">
                    <define-tool-area class="size-full" v-bind="propsLocal.output?.area">
                        <div class="size-full relative">
                            <custom-scrollbar v-bind="propsLocal.output?.scroll">
                                <slot name="output"></slot>
                            </custom-scrollbar>
                        </div>
                    </define-tool-area>
                </div>
                <div class="mt-[10px]" v-if="slots.actions">
                    <define-tool-area>
                        <template #label>操作</template>
                        <slot name="actions"></slot>
                    </define-tool-area>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { assign, isString } from 'radash';
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
    output?: {
        area?: DefineToolAreaComponentProps
        scroll?: CustomScrollbarComponentProps,
    }
}
const props = defineProps<Props>()

const propsLocal = computed(() => {
    const {
        vertical,
        output
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
            }
        }
    }, { vertical: vertical.value, output: output.value })
    return newVal
})

const slots = defineSlots<{
    input(): any
    output(): any
    actions?: () => any
}>()
const editTabs = useEditTabs()
const toolRenderInjectHelper = useToolRenderInjectHelper();
const name = toolRenderInjectHelper.inject()
const tool = computed(() => {
    return findTool(name?.value || "")
});

enum ToolRelatedType {
    tool = "tool",
    external = "external"
}

type ToolRelatedItem = {
    type: ToolRelatedType;
    title: string;
    target: string;
}

const toolRelated: ComputedRef<ToolRelatedItem[]> = computed(() => {
    const related = tool.value?.meta?.related || []
    const res = filterNullable(related.map(r => {
        if (isString(r)) {
            const tool = findTool(r)
            if (tool) {
                return {
                    type: ToolRelatedType.tool,
                    title: `本站 - ${tool.meta?.title || tool.name}`,
                    target: tool.name
                }
            }
        } else {
            return {
                type: ToolRelatedType.external,
                title: r.title,
                target: r.url
            }
        }
    }))
    return res
})
const handleToolRelatedItemClick = async (item: ToolRelatedItem) => {
    if (item.type === ToolRelatedType.tool) {
        editTabs.addTab(item.target)
    }
    if (item.type === ToolRelatedType.external) {
        await navigateTo(item.target, {
            external: true,
            open: {
                target: '_blank'
            }
        })
    }
}
</script>