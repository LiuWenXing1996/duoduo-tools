<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <define-tool-area label="文本">
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
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ text.name }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ text.result }}
                        </span>
                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import { methods } from './utils';

const initialText = '字数统计123'
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
    return methods.map(m => {
        return {
            ...m,
            result: m.run(text)
        }
    })
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