<template>
    <n-list v-bind="config?.list">
        <n-list-item v-for="group in data" class="!p-[10px]">
            <n-thing content-style="margin-top: 0px;">
                <template #header>
                    <div class="block">
                        <common-rich-text :content="group.label" />
                        <span class="ml-[10px] inline-flex" v-if="(group.labelActions || []).length > 0">
                            <n-space :size="10">
                                <template v-for="item in group.labelActions">
                                    <template v-if="item">
                                        <common-icon-button v-bind="item" />
                                    </template>
                                </template>
                            </n-space>
                        </span>
                    </div>
                </template>
                <slot name="item" v-bind="group.content"></slot>
            </n-thing>
        </n-list-item>
    </n-list>
</template>
<script setup lang="ts" generic="T">
import type { RenderFunction } from 'vue'
import type { ListProps } from "naive-ui"

export type Group<T> = {
    label: string | RenderFunction,
    labelActions?: (CommonIconButtonComponentProps | undefined)[],
    content: T,

}

export type Props<T> = {
    data: Group<T>[],
    config?: {
        list: ListProps
    }
}
defineProps<Props<T>>()
defineSlots<{
    item: (item: T) => any
}>()

</script>