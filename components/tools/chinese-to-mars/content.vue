<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <define-tool-area label="文本">
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
                </define-tool-area>
                <define-tool-area label="配置">
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
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(textRes)">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import cnchar from 'cnchar';
import 'cnchar-trad';
export type Model = {
    text: string,
    toType: "mars" | "chinese",
    chineseType: "simplified" | "traditional",
}
const initialText = `把球还我，我要回家`

const model = reactive<Model>({
    text: initialText,
    toType: "mars",
    chineseType: "simplified",
})
const copy = useCopy()
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
</script>