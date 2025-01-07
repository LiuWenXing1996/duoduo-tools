<template>
    <n-dropdown trigger="click" :options="options" @select="handleSelect" v-model:value="theme.preference.value">
        <div
            class="h-[36px] w-[36px] flex justify-center items-center cursor-pointer rounded-[6px] hover:bg-hoverColor">
            <svg-icon v-if="theme.isDark.value" :size="16" name="theme-dark-mode" />
            <svg-icon v-else :size="16" name="theme-light-mode" />
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
                    iconName: "theme-light-mode",
                    label: "亮色模式",
                })
            },
            key: 'light',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "theme-dark-mode",
                    label: "暗色模式",
                })
            },
            key: 'dark',
        },
        {
            label: () => {
                return h(ReusePreferenceTemplate, {
                    iconName: "theme-system-mode",
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