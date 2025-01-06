<template>
    <tool-wrapper>
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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" />
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
    </tool-wrapper>
</template>
<script setup lang="ts">
export type Model = {
    text: string,
}
const initialText = `numeronym`

const model = reactive<Model>({
    text: initialText,
})
const copy = useCopy()
const textRes = computedAsync(() => {
    const text = model.text || "";
    const wordLength = text.length;
    if (wordLength <= 3) {
        return text
    }
    return `${text.at(0)}${wordLength - 2}${text.at(-1)}`;
})
</script>