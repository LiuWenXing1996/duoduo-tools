<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="count" first label="段落数量">
                        <n-input-number v-model:value="model.count" :min="1" />
                    </n-form-item>
                    <n-form-item path="paragraphLowerBound" first label="每段句子最少数量">
                        <n-input-number v-model:value="model.paragraphLowerBound" :min="1" />
                    </n-form-item>
                    <n-form-item path="paragraphUpperBound" first label="每段句子最多数量">
                        <n-input-number v-model:value="model.paragraphUpperBound" :min="1" />
                    </n-form-item>
                    <n-form-item path="sentenceLowerBound" first label="每句单词最少数量">
                        <n-input-number v-model:value="model.sentenceLowerBound" :min="1" />
                    </n-form-item>
                    <n-form-item path="sentenceUpperBound" first label="每句单词最多数量">
                        <n-input-number v-model:value="model.sentenceUpperBound" :min="1" />
                    </n-form-item>
                    <n-form-item path="paragraphSpacingLines" first label="段落间换行数量">
                        <n-input-number v-model:value="model.paragraphSpacingLines" :min="0" />
                    </n-form-item>
                    <n-form-item path="format" first label="输出格式">
                        <n-radio-group v-model:value="model.format">
                            <n-space>
                                <n-radio v-for="option in formatOptions" :value="option.value">
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
    count: number,
    format: "plain" | "html",
    paragraphSpacingLines: number,
    paragraphLowerBound: number,
    paragraphUpperBound: number,
    sentenceLowerBound: number,
    sentenceUpperBound: number,
    // TODO:支持自定以单词组
    words: {
        isCustom: boolean,
        content: {
            word: string,
            disabled?: boolean
        }[]
    }
}
</script>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import { loremIpsum } from "lorem-ipsum";
import { iterate } from 'radash';
defineOptions({
    toolMeta: defineToolMeta({
        title: 'Lorem ipsum 生成器',
        description: "Lorem ipsum 是一种占位符文本，通常用于演示文档或字体的视觉形式，而不依赖于有意义的内容",
        category: ToolCategory.text,
        related: [
            {
                title: "IT-TOOLS - Lorem ipsum生成器",
                url: "https://www.aiotools.top/lorem-ipsum-generator"
            }
        ]
    })
})
// TODO:支持显示生成结果的统计信息，如段落数，单词数等
// TODO:支持设置开始句子
const model = reactive<Model>({
    count: 2,
    format: 'plain',
    paragraphSpacingLines: 1,
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
    sentenceLowerBound: 5,
    sentenceUpperBound: 15,
    words: {
        isCustom: false,
        content: []
    },
})
const formatOptions = defineSelectOptionList<Record<Model['format'], unknown>>({
    plain: { label: "纯文本(plain)" },
    html: { label: "网页(html)" },
})

const message = useMessage()

const textRes = computedAsync(() => {
    const words = model.words.isCustom
        ? [...model.words.content.filter(e => e.disabled).map(e => e.word)]
        : undefined
    const paragraphSpacingLines = model.paragraphSpacingLines
    const newLines = iterate(
        paragraphSpacingLines,
        (acc, idx) => {
            return `${acc}\n`
        },
        ""
    );
    const result = loremIpsum({
        units: "paragraphs",
        count: model.count,
        format: model.format,
        paragraphLowerBound: model.paragraphLowerBound,
        paragraphUpperBound: model.paragraphUpperBound,
        sentenceLowerBound: model.sentenceLowerBound,
        sentenceUpperBound: model.sentenceUpperBound,
        suffix: `\n${newLines}`,
        words: words,
    })
    return result;
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