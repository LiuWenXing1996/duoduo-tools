<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="type" first label="形状">
            <n-select v-model:value="model.type" :options="typeSelectOptions" />
        </n-form-item>
        <n-form-item path="color.isCustom" first label="自定义颜色">
            <n-switch v-model:value="model.color.isCustom" />
        </n-form-item>
        <tools-qrcode-generator-color-form ref="color" v-show="model.color.isCustom" />
    </n-form>
</template>
<script lang="ts">
export type Model = {
    type: CornerDotType | "none",
    color: {
        isCustom: boolean,
        content: ColorFormModel | undefined
    }
}
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import type { CornerDotType } from 'qr-code-styling';
import type { Model as ColorFormModel } from "./color-form.vue"

const colorRef = useTemplateRef('color');
const formRef = ref<FormInst | null>(null)

const model = reactive<Model>({
    type: "none",
    color: {
        isCustom: false,
        content: undefined
    }
})
const rules: FormRules = {}

const typeSelectOptions = defineSelectOptionList<Record<Model["type"], unknown>>({
    dot: { label: "点" },
    square: { label: "方块" },
    none: { label: "和信息点保持一致" },
})

watch(() => colorRef.value?.model, (val) => {
    model.color.content = val
})

defineExpose({
    formRef,
    colorRef,
    model
})
</script>
