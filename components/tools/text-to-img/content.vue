<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        area: {
            label: '配置'
        }
    }">
        <template #output>
            <n-form ref="form" :model="model">
                <n-form-item :="commonFormItemProps" label="图片宽度" path="width">
                    <n-input-number v-model:value="model.width" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="bgColor">
                    <template #label>
                        <tool-label label="背景颜色" />
                    </template>
                    <n-color-picker v-model:value="model.bgColor" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" label="导出格式" path="ext">
                    <n-select v-model:value="model.ext" :options="extTypeOptions"></n-select>
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="content">
                    <template #label>
                        <tool-label label="内容" :actions="[
                            {
                                name: 'common-demo',
                                tooltip: '使用示例',
                                onClick: () => {
                                    addExample()
                                }
                            }
                        ]" />
                    </template>
                    <div class="w-full">
                        <div class="border">
                            <iframe-wang-editor ref="iframeWangEditor" />
                        </div>
                    </div>
                </n-form-item>
            </n-form>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleDownload">导出</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, shallowRef } from 'vue'
export type Model = {
    width: number,
    content: string,
    ext: 'png' | 'jpg',
    bgColor: string,
}

export type Result = {
    barrage: string[],
    speed: number,
    channels: number,
    extraStyle: string,
    danmakuFullStyle: string,
    isHorizontal: boolean,
}
const exampleText = `文字转图片演示😀
拥有丰富的样式选择
可自由调整宽度背景色
支持一键导出为长图
`
const model = reactive<Model>({
    content: exampleText,
    width: 200,
    ext: 'png',
    bgColor: '#fff',
})
const editorRef = shallowRef()
const iframeWangEditorRef = useTemplateRef("iframeWangEditor")
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const addExample = () => {
    tryInit()
}
const tryInit = () => {
    const methods = iframeWangEditorRef.value?.getTargetWindowMethods?.();
    if (methods) {
        methods.setValue(exampleText)
        return
    }
    setTimeout(() => {
        tryInit();
    }, 100);
}
onMounted(() => {
    tryInit()
})
const extTypeOptions = defineSelectOptionList<Record<Model['ext'], unknown>>({
    png: { label: 'png' },
    jpg: { label: 'jpg' },
})
const handleDownload = async () => {
    const methods = iframeWangEditorRef.value?.getTargetWindowMethods?.();
    if (!methods) {
        return
    }
    await methods.downloadPng({
        bgColor: model.bgColor,
        width: model.width,
        ext: model.ext,
    })
}
</script>