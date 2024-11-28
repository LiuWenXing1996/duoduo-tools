<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="type" first label="形状">
            <n-select v-model:value="model.type" :options="typeSelectOptions" />
        </n-form-item>
        <tools-qrcode-generator-color-form ref="color" />
    </n-form>
</template>
<script lang="ts">
export type Model = {
    type: DotType,
    color: ColorFormModel | undefined
}
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import type { DotType } from 'qr-code-styling';
import type { Model as ColorFormModel } from "./color-form.vue"

const colorRef = useTemplateRef('color');
const formRef = ref<FormInst | null>(null)

const model = reactive<Model>({
    type: "square",
    color: undefined
})
const rules: FormRules = {}

const typeSelectOptions = defineSelectOptionList<Record<DotType, unknown>>({
    dots: { label: "点集" },
    rounded: { label: "圆角 1" },
    'extra-rounded': { label: "圆角 2" },
    classy: { label: "对角圆角 1" },
    'classy-rounded': { label: "对角圆角 2" },
    square: { label: "方块" },
})

watch(() => colorRef.value?.model, (val) => {
    model.color = val
})

defineExpose({
    formRef,
    colorRef,
    model
})
</script>
