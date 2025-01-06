<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <tool-area label="文本">
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="8" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button @click="copy(textRes)">
                    复制
                </n-button>
            </n-space>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

const copy = useCopy()
const initialText = `移除重复行
重复行
重复行
123`
const model = reactive({
    text: initialText,
})
const formRef = ref<FormInst | null>(null)
const finalText = computedAsync(
    async () => {
        const text = model.text;
        try {
            await formRef.value?.validate() || {}
        } catch (error) {
            return
        }
        return text
    },
    initialText,
)

const textRes = computed(() => {
    const text = finalText.value || "";
    const lines = text.split("\n");
    const linesUniq = Array.from(new Set(lines))
    return linesUniq.join("\n")
})

const rules: FormRules = {
    text: [
        {
            required: true,
            message: '输入文本',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
</script>