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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" />
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
}
</script>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
defineOptions({
    toolMeta: defineToolMeta({
        title: '数字名称生成器',
        description: "数字名是一个用数字构成缩写的词。例如，“i18n”是“国际化”的名词，其中18表示单词中第一个i和最后一个n之间的字母数",
        category: ToolCategory.text,
        related: [
            {
                title: "IT-TOOLS - 数字名称生成器",
                url: "https://www.aiotools.top/numeronym-generator"
            }
        ]
    })
})
const initialText = `numeronym`

const model = reactive<Model>({
    text: initialText,
})
const message = useMessage()

const textRes = computedAsync(() => {
    const text = model.text || "";
    const wordLength = text.length;
    if (wordLength <= 3) {
        return text
    }
    return `${text.at(0)}${wordLength - 2}${text.at(-1)}`;
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