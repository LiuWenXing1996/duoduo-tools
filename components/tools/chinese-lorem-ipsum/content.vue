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
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="type" label="文字类型">
                        <n-radio-group v-model:value="model.type">
                            <n-space>
                                <n-radio v-for="option in typeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="size" label="字数">
                        <n-input-number v-model:value="model.size" :min="1" :step="10" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="paragraph" label="段落数">
                        <n-input-number v-model:value="model.paragraph" :min="1" :step="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="withPunctuation" label="包含标点符号">
                        <n-switch v-model:value="model.withPunctuation" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-rich-text :content="result?.content" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import { gen, type ChineseLoremIpsumGeneratorType } from './utils'

export type Model = {
    type: ChineseLoremIpsumGeneratorType,
    withPunctuation: boolean,
    size: number
    paragraph: number
}

export type Result = {
    content: string
}

const model = reactive<Model>({
    type: "simplified-chinese",
    withPunctuation: false,
    size: 400,
    paragraph: 4
})
const typeOptions = defineSelectOptionList<Record<Model['type'], unknown>>({
    "simplified-chinese": { label: "简体中文" },
    "traditional-chinese": { label: "繁体中文" }
})

const copy = useCopy();
const message = useAnyMessage();

const result = computed(() => {
    let res: undefined | Result = undefined
    try {
        const text = gen({
            type: model.type,
            size: model.size,
            withPunctuation: model.withPunctuation,
            paragraph: model.paragraph
        })
        res = {
            content: text
        }
    } catch (error) {
        message.anyError(error);
        res = undefined
    }
    return res;
})
</script>