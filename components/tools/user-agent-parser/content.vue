<template>
    <tool-wrapper>
        <template #input>
            <n-form :model="model">
                <tool-area label="配置">
                    <n-form-item path="content" label="输入 UA" first>
                        <n-input type="textarea" :rows="5" v-model:value="model.content" />
                    </n-form-item>
                    <common-empty-form-item label="当前浏览器 UA" :actions="[
                        {
                            type: 'common',
                            shortcut: {
                                'icon.name': 'common-copy',
                                'button.onClick': () => {
                                    copy(clientUserAgent)
                                },
                            }
                        }
                    ]">
                        <n-input disabled type="textarea" :rows="5" :value="clientUserAgent" />
                    </common-empty-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <group-list :data="result"></group-list>
        </template>
    </tool-wrapper>
</template>

<script setup lang="ts">
import { UAParser } from 'ua-parser-js';

export type Model = {
    content: string,
}
const copy = useCopy()
const model = reactive<Model>({
    content: ""
})

const clientUserAgent = navigator.userAgent

onMounted(() => {
    model.content = clientUserAgent
})

const showVal = (val: string | undefined) => {
    return val || "未知"
}
const result: ComputedRef<GroupListComponentProps['data']> = computed(() => {
    const ua = model.content;
    const { browser, cpu, os, engine, device } = UAParser(ua);
    const groups: GroupListComponentProps['data'] = [
        {
            label: "浏览器",
            items: [
                {
                    label: "名称",
                    value: showVal(browser.name)
                },
                {
                    label: "版本号",
                    value: showVal(browser.version)
                },
                {
                    label: "主版本",
                    value: showVal(browser.major)
                },
            ]
        },
        {
            label: "渲染引擎",
            items: [
                {
                    label: "名称",
                    value: showVal(engine.name)
                },
                {
                    label: "版本号",
                    value: showVal(engine.version)
                },
            ]
        },
        {
            label: "操作系统",
            items: [
                {
                    label: "名称",
                    value: showVal(os.name)
                },
                {
                    label: "版本",
                    value: showVal(os.version)
                },
            ]
        },
        {
            label: "CPU",
            items: [
                {
                    label: "架构",
                    value: showVal(cpu.architecture)
                },
            ]
        },
        {
            label: "设备",
            items: [
                {
                    label: "型号",
                    value: showVal(device.model)
                },
                {
                    label: "类型",
                    value: showVal(device.type)
                },
                {
                    label: "供应商",
                    value: showVal(device.vendor)
                },
            ]
        },
    ]

    return groups
})
</script>