<template>
    <n-list hoverable clickable>
        <n-list-item v-for="group in data">
            <n-thing :title="group.label" content-style="margin-top: 10px;">
                <n-descriptions label-placement="left" :column="1" label-class="w-[120px] inline-flex"
                    content-class="w-[calc(100%-120px)]">
                    <n-descriptions-item v-for="item in group.items">
                        <template #label>
                            <div class="inline-flex">
                                <span class="font-medium break-all">
                                    {{ item.label }}
                                </span>
                            </div>
                        </template>
                        <div class="inline-flex">
                            <span class=" break-all">
                                {{ item.value }}
                                <n-tooltip trigger="hover" v-if="item.value !== ''">
                                    <template #trigger>
                                        <div class=" inline-flex">
                                            <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                                name="common-copy" @click="copy(item.value)" />
                                        </div>
                                    </template>
                                    {{ `点击复制` }}
                                </n-tooltip>
                            </span>
                        </div>
                    </n-descriptions-item>
                </n-descriptions>
            </n-thing>
        </n-list-item>
    </n-list>
</template>
<script setup lang="ts">
export type Item = {
    label: string,
    value: string
}

export type Group = {
    label: string,
    items: Item[]
}

export type Props = {
    data: Group[]
}
defineProps<Props>()
const copy = useCopy()
</script>