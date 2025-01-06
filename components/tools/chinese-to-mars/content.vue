<template>
    <tool-content :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => copy(result?.content || ''),
                }
            ]
        }
    }">
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-area label="文本">
                    <n-form-item :="commonFormItemProps" path="text" label="输入">
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="3" />
                    </n-form-item>
                </tool-area>
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="type" label="转换类型">
                        <n-radio-group v-model:value="model.toType">
                            <n-space>
                                <n-radio v-for="option in toTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="type" label="中文类型">
                        <n-radio-group v-model:value="model.chineseType">
                            <n-space>
                                <n-radio v-for="option in chineseTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <rich-text :content="result?.content" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import cnchar from 'cnchar';
import 'cnchar-trad';
export type Model = {
    text: string,
    toType: "mars" | "chinese",
    chineseType: "simplified" | "traditional",
}

export type Result = {
    content: string
}

const initialText = `把球还我，我要回家`

const model = reactive<Model>({
    text: initialText,
    toType: "mars",
    chineseType: "simplified",
})
const copy = useCopy()
const message = useAnyMessage();

const toTypeOptions = defineSelectOptionList<Record<Model['toType'], unknown>>({
    mars: { label: "火星文" },
    chinese: { label: "中文" },
})

const chineseTypeOptions = defineSelectOptionList<Record<Model['chineseType'], unknown>>({
    traditional: { label: "中文繁体" },
    simplified: { label: "中文简体" },
})
const result = computedAsync(() => {
    let res: undefined | Result = undefined;
    try {
        const text = model.text || "";
        let content = "";
        if (model.toType === "chinese") {
            if (model.chineseType === "simplified") {
                content = cnchar.convert.sparkToSimple(text);
            }
            if (model.chineseType === "traditional") {
                content = cnchar.convert.sparkToTrad(text);
            }
        }
        if (model.toType === "mars") {
            if (model.chineseType === "simplified") {
                content = cnchar.convert.simpleToSpark(text);
            }
            if (model.chineseType === "traditional") {
                content = cnchar.convert.tradToSpark(text);
            }
        }
        res = {
            content: content
        }
    } catch (error) {
        message.anyError(error);
        res = undefined
    }
    return res
})
</script>