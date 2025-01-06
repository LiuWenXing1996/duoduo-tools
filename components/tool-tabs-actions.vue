<template>
    <n-dropdown trigger="click" :options="options" @select="handleSelect" placement="bottom-end">
        <div
            class="flex justify-center items-center h-[24px] w-[24px] cursor-pointer  rounded-[6px] hover:bg-hoverColor">
            <svg-icon class="origin-center -rotate-90" size="16" name="tool-tabs-actions-arrow"></svg-icon>
        </div>
    </n-dropdown>
    <DefinePreferenceTemplate v-slot="{ iconName, label }">
        <div class="flex items-center -ml-[10px]">
            <div class="h-[36px] w-[36px] flex justify-center items-center">
                <svg-icon :size="16" :name="iconName" />
            </div>
            <span>{{ label }}</span>
        </div>
    </DefinePreferenceTemplate>
</template>
<script setup lang="ts">
import { NormalIcon } from '#components';
import type { MenuOption } from 'naive-ui';
const [
    DefinePreferenceTemplate,
    ReusePreferenceTemplate
] = createReusableTemplate<{ iconName: string, label: string }>()
const router = useRouter();
const editTabs = useEditTabs();
const options: ComputedRef<MenuOption[]> = computed(() => {
    return [
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "tool-tabs-actions-refresh",
                    label: "刷新当前",
                })
            },
            key: 'refresh',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "tool-tabs-actions-close",
                    label: "关闭当前",
                })
            },
            key: 'close',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "tool-tabs-actions-close-other",
                    label: "关闭其他",
                })
            },
            key: 'close-other',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "tool-tabs-actions-close-all",
                    label: "关闭所有",
                })
            },
            key: 'close-all',
        },
    ]
})

const handleSelect = (key: string) => {
    if (key === "refresh") {
        router.go(0)
    }
    if (key === "close") {
        editTabs.closeCurrentTab()
    }
    if (key === "close-other") {
        editTabs.closeOtherTabs()
    }
    if (key === "close-all") {
        editTabs.closeAllTabs()
    }
}
</script>