<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="isCustom" first>
            <template #label>
                <div class="inline-flex">
                    <span>
                        圆角
                    </span>
                    <n-tooltip trigger="hover" placement="right-start">
                        <template #trigger>
                            <svg-icon class="ml-[2px] pb-[5px] text-[12px]" name="material-symbols:chat-info" />
                        </template>
                        <div>
                            设置圆角会将二维码
                            <br />
                            强制变为正方形
                        </div>
                    </n-tooltip>
                </div>
            </template>
            <n-input-number v-model:value="model.round" :min="0" :max="100" :step="5">
                <template #suffix>
                    %
                </template>
            </n-input-number>
        </n-form-item>
        <n-form-item path="isCustom" first label="自定义颜色">
            <n-switch v-model:value="model.color.isCustom" />
        </n-form-item>
        <tools-qrcode-generator-color-form ref="color" v-show="model.color.isCustom" />
    </n-form>
</template>
<script lang="ts">
export type Model = {
    round: number | undefined,
    color: {
        isCustom: boolean,
        content: ColorFormModel | undefined
    }
}

</script>
<script setup lang="ts">
import type { FormInst, FormRules, SelectOption } from 'naive-ui';
import type { Model as ColorFormModel } from "./color-form.vue"

const colorRef = useTemplateRef('color');
const formRef = ref<FormInst | null>(null)
const model = reactive<Model>({
    round: 0,
    color: {
        isCustom: false,
        content: undefined
    }
})
const rules: FormRules = {}

watch(() => colorRef.value?.model, (val) => {
    model.color.content = val
})

defineExpose({
    formRef,
    colorRef,
    model
})
</script>
