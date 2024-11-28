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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="3" />
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="type" first label="转换类型">
                        <n-radio-group v-model:value="model.toType">
                            <n-space>
                                <n-radio v-for="option in toTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item path="type" first label="中文类型">
                        <n-radio-group v-model:value="model.chineseType">
                            <n-space>
                                <n-radio v-for="option in chineseTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script lang="ts">
export type Model = {
    text: string,
    toType: "mars" | "chinese",
    chineseType: "simplified" | "traditional",
}
</script>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import cnchar from 'cnchar';
import 'cnchar-trad';
defineOptions({
    toolMeta: defineToolMeta({
        title: '中文火星文互转',
        description: `支持中文火星文互转之间相互转换`,
        category: ToolCategory.text,
        related: [
            ToolName['text-chinese-transfer'],
            {
                title: "帮小忙 - 火星文翻译器",
                url: "https://tool.browser.qq.com/toMars.html"
            }
        ]
    })
})
const initialText = `把球还我，我要回家`

const model = reactive<Model>({
    text: initialText,
    toType: "mars",
    chineseType: "simplified",
})
const message = useMessage()
const toTypeOptions = defineSelectOptionList<Record<Model['toType'], unknown>>({
    mars: { label: "火星文" },
    chinese: { label: "中文" },
})

const chineseTypeOptions = defineSelectOptionList<Record<Model['chineseType'], unknown>>({
    traditional: { label: "中文繁体" },
    simplified: { label: "中文简体" },
})
const textRes = computedAsync(() => {

    const text = model.text || "";
    let result = "";
    if (model.toType === "chinese") {
        if (model.chineseType === "simplified") {
            result = cnchar.convert.sparkToSimple(text);
        }
        if (model.chineseType === "traditional") {
            result = cnchar.convert.sparkToTrad(text);
        }
    }
    if (model.toType === "mars") {
        if (model.chineseType === "simplified") {
            result = cnchar.convert.simpleToSpark(text);
        }
        if (model.chineseType === "traditional") {
            result = cnchar.convert.tradToSpark(text);
        }
    }
    return result
})
const handleCopy = () => {
    const res = copy(textRes.value || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

</script>