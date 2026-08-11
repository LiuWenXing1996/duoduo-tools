<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="type" first label="颜色类型">
            <n-radio-group v-model:value="model.type">
                <n-space>
                    <n-radio value="single"> 单色 </n-radio>
                    <n-radio value="gradient"> 渐变 </n-radio>
                </n-space>
            </n-radio-group>
        </n-form-item>
        <n-form-item path="content.single" first label="颜色" v-if="model.type === 'single'">
            <n-color-picker v-model:value="model.content.single" :render-label="() => ''" />
        </n-form-item>
        <tools-qrcode-generator-gradient-form ref="colorGradient" v-show="model.type === 'gradient'" />
    </n-form>
</template>
<script lang="ts">
export type Model = {
    type: "single" | "gradient",
    content: {
        single: string,
        gradient: GradientFormModel | undefined
    }
}
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import type { Model as GradientFormModel } from "./gradient-form.vue"

const colorGradientRef = useTemplateRef('colorGradient');
const formRef = ref<FormInst | null>(null)

const model = reactive<Model>({
    type: "single",
    content: {
        single: "#000",
        gradient: undefined
    }
})
const rules: FormRules = {}

watch(() => colorGradientRef.value?.model, (val) => {
    model.content.gradient = val
})

defineExpose({
    formRef,
    colorGradientRef,
    model
})
</script>
