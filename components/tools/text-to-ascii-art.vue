<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-item-input-fieldset>
                    <template #label>
                        文本
                    </template>
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="8" />
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="font" first label="字体">
                        <n-select filterable v-model:value="model.font" :options="fontSelectOptions" />
                    </n-form-item>
                    <n-form-item path="width" first label="宽度">
                        <n-input-number v-model:value="model.width" />
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div v-show="isShowScale.content.value" class="absolute top-0 right-[10px] z-10">
                <n-tag>放缩比: {{ scale.toFixed(1) }}</n-tag>
            </div>
            <div :style="{ zoom: scale }">
                <pre><code>{{ textRes }}</code></pre>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :disabled="textResLoading" @click="handleCopy">复制</n-button>
                <n-button size="small" :disabled="textResLoading" @click="scaleAdd">放大</n-button>
                <n-button size="small" :disabled="textResLoading" @click="scaleSub">缩小</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { Fonts } from 'figlet';
import type { SelectOption } from 'naive-ui';
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '生成 ASCII 艺术字',
        description: "将输入的文本转换成 ASCII 艺术字，支持上百种风格",
        category: ToolCategory.text,
        related: [
            {
                title: "Tools-Web - ASCII字形生成器",
                url: "https://tools.ranblogs.com/asciiwordpic/"
            },
            {
                title: "IT-TOOLS - ASCII Art Text Generator",
                url: "https://www.aiotools.top/ascii-text-drawer"
            }
        ]
    })
})

const message = useMessage()
const isShowScale = useAutoBoolean()

const scale = ref(1)

const scaleAdd = () => {
    scale.value = scale.value + 0.1;
    isShowScale.toggle();
}

const scaleSub = () => {
    const newVal = scale.value - 0.1;
    if (newVal <= 0.1) {
        scale.value = 0.1
    } else {
        scale.value = newVal
    }
    isShowScale.toggle();
}

const initialText = `ASCII
ART
TEXT`
const model = reactive<{
    text: string,
    font: Fonts,
    width: number
}>({
    text: initialText,
    font: "3D-ASCII",
    width: 80,
})
const figlet = useFiglet()
const fontSelectOptions: SelectOption[] = figlet.getAllFonts().map(font => {
    return {
        key: font,
        value: font,
        label: font
    }
})
const textResLoading = ref(false)
const textRes = computedAsync(async () => {
    return await figlet.text(model.text, { font: model.font, width: model.width })
}, undefined, textResLoading)
const handleCopy = () => {
    const res = copy(textRes.value || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}
</script>