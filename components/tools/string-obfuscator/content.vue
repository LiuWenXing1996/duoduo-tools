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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
                <define-tool-area label="配置">
                    <n-form-item path="keepFirst" first label="前置保留数量">
                        <n-input-number v-model:value="model.keepFirst" :min="0" />
                    </n-form-item>
                    <n-form-item path="keepLast" first label="后置保留数量">
                        <n-input-number v-model:value="model.keepLast" :min="0" />
                    </n-form-item>
                    <n-form-item path="keepSpace" first label="保留空格">
                        <n-switch v-model:value="model.keepSpace" />
                    </n-form-item>
                    <n-form-item path="replacementChar" first label="加密替换字符">
                        <n-input v-model:value="model.replacementChar" />
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
                <n-button size="small" @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
export type Model = {
    text: string,
    keepFirst: number;
    keepLast: number;
    replacementChar: string;
    keepSpace: boolean,
}
const initialText = `6666 5555 4444 333`

const model = reactive<Model>({
    text: initialText,
    keepFirst: 4,
    keepLast: 4,
    replacementChar: "*",
    keepSpace: true,
})
const message = useMessage()
const textRes = computedAsync(() => {
    const text = model.text || "";
    const keepSpace = model.keepSpace;
    const keepFirst = model.keepFirst;
    const keepLast = model.keepLast;
    const replacementChar = model.replacementChar;
    const result = text.split('').map((char, index, array) => {
        if (keepSpace && char === ' ') {
            return char;
        }

        return (index < keepFirst || index >= array.length - keepLast) ? char : replacementChar;
    })
        .join('');
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