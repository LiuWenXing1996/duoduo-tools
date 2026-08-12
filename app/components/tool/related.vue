<template>
    <n-space>
        <n-tag size="small" v-for="item in toolRelated" class=" cursor-pointer hover:text-primary"
            @click="() => handleToolRelatedItemClick(item)">
            {{
                item.title
            }}
        </n-tag>
    </n-space>
</template>
<script setup lang="ts">
import { isString } from 'radash';
export type Props = {
    toolMeta: ToolMeta
}
const props = defineProps<Props>()
const editTabs = useEditTabs()

enum ToolRelatedType {
    tool = "tool",
    external = "external"
}
const toolMeta = computed(() => props.toolMeta)

type ToolRelatedItem = {
    type: ToolRelatedType;
    title: string;
    target: string;
}

const toolRelated: ComputedRef<ToolRelatedItem[]> = computed(() => {
    const related = toolMeta.value?.related || []
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