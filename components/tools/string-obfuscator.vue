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
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
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
    keepFirst: number;
    keepLast: number;
    replacementChar: string;
    keepSpace: boolean,
}
</script>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
defineOptions({
    toolMeta: defineToolMeta({
        title: '字符串混淆器',
        description: `混淆字符串（如密钥、银行卡号或令牌），使其可共享和可识别，而不泄露其内容`,
        category: ToolCategory.text,
        related: [
            {
                title: "IT-TOOLS - 字符串混淆器",
                url: "https://www.aiotools.top/string-obfuscator"
            }
        ]
    })
})
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