<template>
    <n-dropdown trigger="click" :options="options" @select="handleSelect" v-model:value="theme.preference.value">
        <normal-icon v-if="theme.isDark.value" name="material-symbols:nightlight-badge-rounded"
            class="cursor-pointer rounded-[6px] hover:bg-hoverColor"></normal-icon>
        <normal-icon v-else name="material-symbols:light-mode-outline"
            class="cursor-pointer rounded-[6px] hover:bg-hoverColor"></normal-icon>
    </n-dropdown>
    <DefinePreferenceTemplate v-slot="{ iconName, label }">
        <div class="flex items-center -ml-[10px]">
            <normal-icon :name="iconName" />
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
const theme = useTheme()
const options: ComputedRef<MenuOption[]> = computed(() => {
    return [
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "material-symbols:light-mode-outline",
                    label: "亮色模式",
                })
            },
            key: 'light',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "material-symbols:nightlight-badge-rounded",
                    label: "暗色模式",
                })
            },
            key: 'dark',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "material-symbols:laptop-mac-outline",
                    label: "跟随系统",
                })
            },
            key: 'system',
        },
    ]
})

const handleSelect = (key: string) => {
    theme.setPreference(key)
}
</script>