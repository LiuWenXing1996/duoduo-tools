<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="颜色">
                    <n-form-item label="输入" path="color" first>
                        <n-input clearable placeholder="输入合法色值" v-model:value="model.color" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <template v-if="finalColor">
                <div class="h-[30px] w-[30px]" :style="{
                    backgroundColor: finalColor
                }"></div>
            </template>
            <template v-else>
                <n-empty description="无效色值" />
            </template>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

const initialColor = 'red'

const model = reactive({
    color: initialColor
})
const formRef = ref<FormInst | null>(null)
const finalColor = computedAsync(
    async () => {
        const color = model.color;
        try {
            await formRef.value?.validate() || {}
        } catch (error) {
            return
        }
        return color
    },
    initialColor,
)
const rules: FormRules = {
    color: [
        {
            required: true,
            message: '请输入色值',
            trigger: ['input', 'change', 'blur', 'focus']
        },
        {
            validator: (_rule, value: string) => {
                let otpNode = new Option();
                otpNode.style.color = value
                return !!otpNode.style.color
            },
            message: '请输入合法色值',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
</script>