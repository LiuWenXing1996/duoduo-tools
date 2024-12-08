<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <define-tool-area label="配置">
                    <n-form-item path="type" first label="文字类型">
                        <n-radio-group v-model:value="model.type">
                            <n-space>
                                <n-radio v-for="option in typeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item path="size" first label="字数">
                        <n-input-number v-model:value="model.size" :min="1" :step="10" />
                    </n-form-item>
                    <n-form-item path="paragraph" first label="段落数">
                        <n-input-number v-model:value="model.paragraph" :min="1" :step="1" />
                    </n-form-item>
                    <n-form-item path="withPunctuation" first label="包含标点符号">
                        <n-switch v-model:value="model.withPunctuation" />
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
export type Model = {
    type: ChineseLoremIpsumGeneratorType,
    withPunctuation: boolean,
    size: number
    paragraph: number
}
const model = reactive<Model>({
    type: ChineseLoremIpsumGeneratorType['simplified-chinese'],
    withPunctuation: false,
    size: 400,
    paragraph: 4
})
const typeOptions = defineSelectOptionList<Record<Model['type'], unknown>>({
    [ChineseLoremIpsumGeneratorType["simplified-chinese"]]: { label: "简体中文" },
    [ChineseLoremIpsumGeneratorType["traditional-chinese"]]: { label: "繁体中文" }
})

const copy = useCopy();
const generator = useChineseLoremIpsumGenerator()

const textRes = computed(() => {
    const result = generator.gen({
        type: model.type,
        size: model.size,
        withPunctuation: model.withPunctuation,
        paragraph: model.paragraph
    })
    return result;
})
</script>