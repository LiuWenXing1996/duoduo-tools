<template>
    <tool-content>
        <template #input>
            <n-form :model="model">
                <tool-area label="配置">
                    <n-form-item path="content" label="输入 UA" first>
                        <n-input type="textarea" :rows="5" v-model:value="model.content" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps">
                        <template #label>
                            <tool-label label="当前浏览器 UA" :actions="[
                                {
                                    name: 'common-copy',
                                    onClick: () => {
                                        copy(clientUserAgent)
                                    }
                                }
                            ]" />
                        </template>
                        <n-input disabled type="textarea" :rows="5" :value="clientUserAgent" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="groupItem in result">
                    <n-thing :title="groupItem.label" content-style="margin-top: 10px;">
                        <key-value :item-label-width="70" :data="groupItem.items" />
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
    </tool-content>
</template>

<script setup lang="ts">
import { UAParser } from 'ua-parser-js';

export type Model = {
    content: string,
}
export type Result = {
    label: string,
    items: KeyValueComponentProps['data']
}[]
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
const message = useAnyMessage()
const result = computed(() => {
    let res: Result | undefined = undefined
    try {
        const ua = model.content;
        const { browser, cpu, os, engine, device } = UAParser(ua);
        const groups: Result = [
            {
                label: "浏览器",
                items: [
                    {
                        label: "名称",
                        value: showVal(browser.name),
                        valueCopy: true
                    },
                    {
                        label: "版本号",
                        value: showVal(browser.version),
                        valueCopy: true
                    },
                    {
                        label: "主版本",
                        value: showVal(browser.major),
                        valueCopy: true
                    },
                ]
            },
            {
                label: "渲染引擎",
                items: [
                    {
                        label: "名称",
                        value: showVal(engine.name),
                        valueCopy: true
                    },
                    {
                        label: "版本号",
                        value: showVal(engine.version),
                        valueCopy: true
                    },
                ]
            },
            {
                label: "操作系统",
                items: [
                    {
                        label: "名称",
                        value: showVal(os.name),
                        valueCopy: true
                    },
                    {
                        label: "版本",
                        value: showVal(os.version),
                        valueCopy: true
                    },
                ]
            },
            {
                label: "CPU",
                items: [
                    {
                        label: "架构",
                        value: showVal(cpu.architecture),
                        valueCopy: true
                    },
                ]
            },
            {
                label: "设备",
                items: [
                    {
                        label: "型号",
                        value: showVal(device.model),
                        valueCopy: true
                    },
                    {
                        label: "类型",
                        value: showVal(device.type),
                        valueCopy: true
                    },
                    {
                        label: "供应商",
                        value: showVal(device.vendor),
                        valueCopy: true
                    },
                ]
            },
        ]
        res = groups
    } catch (error) {
        message.anyError(error)
        res = undefined
    }

    return res
})
</script>