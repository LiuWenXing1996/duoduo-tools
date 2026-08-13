<template>
    <div class="h-full w-[calc(100%-50px)]">
        <div class="size-full">
            <template v-if="hasOpenedTabs">
                <div class="flex h-[40px] w-full border-b">
                    <div class="h-full w-[calc(100%-40px)]">
                        <XScroll>
                            <div class="flex h-[38px] w-max justify-center p-[6px]">
                                <div v-for="item in toolTabs" :class="[
                                    'flex h-full justify-center items-center mx-[3px] p-[5px] border  cursor-pointer rounded-[5px]',
                                ]" @click="editTabs.activeTab(item.name)">
                                    <div :class="[
                                        'hover:text-primary mr-[4px]',
                                        item.name === editTabs.currentTabName.value ? 'text-primary' : ''
                                    ]">
                                        {{ item.tool?.meta?.title || `工具 ${item.name} 未实现` }}
                                    </div>
                                    <div class="flex justify-center items-center p-[2px] cursor-pointer  rounded-[2px] hover:bg-hoverColor"
                                        @click="(e) => {
                                            e.stopPropagation();
                                            editTabs.removeTab(item.name)
                                        }">
                                        <svg-icon size="16" name="common-close"></svg-icon>
                                    </div>
                                </div>
                            </div>
                        </XScroll>
                    </div>
                    <div class="h-full w-[40px] flex justify-center items-center border-l">
                        <tool-tabs-actions />
                    </div>
                </div>
                <div class="h-[calc(100%-40px)] w-full">
                    <div class="size-full p-[10px]">
                        <template v-for="item in editTabs.openedTabNames.value" :key="item">
                            <div class="size-full" v-show="item === editTabs.currentTabName.value">
                                <tool-render :name="item" />
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="size-full flex items-center justify-center">
                    <tool-list />
                </div>
            </template>

        </div>
    </div>
</template>
<script setup lang="ts">
import { XScroll } from 'vueuc'
const editTabs = useEditTabs();
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
        }
    })
})

const hasOpenedTabs = computed(() => {
    return editTabs.openedTabNames.value.length > 0
})
</script>
<style lang="less" scoped></style>