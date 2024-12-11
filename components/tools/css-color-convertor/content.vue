<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="输入">
                    <n-form-item path="inputType" label="输入方式" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.inputType" />
                    </n-form-item>
                    <n-form-item path="colorPick" label="色板" first v-if="model.inputType === InputType.pick">
                        <n-color-picker v-model:value="model.colorPick" />
                    </n-form-item>
                    <template v-if="model.inputType === InputType.input">
                        <n-form-item path="inputColorType" label="颜色类型" first>
                            <n-select :options="inputColorTypeOptions" v-model:value="model.inputColorType" />
                        </n-form-item>
                        <n-form-item path="colorInput" label="文本" first>
                            <n-input clearable placeholder="输入颜色" v-model:value="model.colorInput" />
                        </n-form-item>
                    </template>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[100px] inline-flex"
                content-class="w-[calc(100%-100px)]">
                <n-descriptions-item>
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium break-all">
                                预览
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <template v-if="textRes[0].result">
                            <div class="h-[30px] w-[30px]" :style="{
                                backgroundColor: textRes[0].result
                            }"></div>
                        </template>
                        <template v-else>
                            <n-empty description="无效色值" />
                        </template>
                    </div>
                </n-descriptions-item>
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium break-all">
                                {{ text.label }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text.result">
                        <span class=" break-all">
                            {{ text.result }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="copy(text.result)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>
                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules, SelectOption } from 'naive-ui';
import { Colord } from "colord";
import { ColorType, methods } from './utils';
const copy = useCopy()
enum InputType {
    input = "input",
    pick = "pick"
}

export type Model = {
    inputType: InputType,
    inputColorType: ColorType,
    colorInput: string,
    colorPick: string
}

const model = reactive<Model>({
    inputType: InputType.pick,
    inputColorType: ColorType.Hexadecimal,
    colorInput: '',
    colorPick: ''
})

onMounted(() => {
    const initialColor = '#18a058'
    const colordInstance = methods[ColorType.Hexadecimal].form(initialColor);
    model.colorInput = methods[ColorType.Hexadecimal].to(colordInstance)
    model.colorPick = methods[ColorType.Hexadecimal].to(colordInstance)
})

const form = useTemplateRef("formRef")

function getRgb(colorName: string) {
    if (!colorName) {
        return
    }
    const el = document.createElement('div')
    el.style.color = colorName
    if (!el.style.color) {
        return
    }
    document.body.appendChild(el)
    const rgbColor = getComputedStyle(el).color
    document.body.removeChild(el)
    return rgbColor
}

const textRes = computed(() => {
    const inputType = model.inputType;
    let inputColorType = model.inputColorType;
    const colorInput = model.colorInput || "";
    const colorPick = model.colorPick || "";
    let text = ""
    if (inputType === InputType.input) {
        text = colorInput
    }
    if (inputType === InputType.pick) {
        text = getRgb(colorPick) || ""
        inputColorType = ColorType.RGB
    }
    let colordInstance: undefined | Colord = undefined;
    try {

        const m = methods[inputColorType]
        const isValid = m.validate(text);
        if (isValid) {
            colordInstance = m.form(text)
        }
    } catch (error) {
    }

    return Object.values(methods).map(m => {
        let res = "";
        try {
            if (colordInstance) {
                res = m.to(colordInstance)
            }
        } catch (error) {

        }
        return {
            ...m,
            result: res
        }
    })
})

const inputColorTypeOptions: SelectOption[] = Object.entries(methods).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

watch(() => model.inputColorType, () => {
    try {
        form?.value?.validate()
    } catch (error) {
    }
})

const dataTypeOptions: SelectOption[] = defineSelectOptionList<Record<InputType, unknown>>({
    [InputType.input]: { label: "文本" },
    [InputType.pick]: { label: "色板" },
})
const rules: FormRules = {
    colorInput: [
        { required: true, message: '请输入颜色', trigger: ['input', 'change', 'blur', 'focus'] },
        {
            validator: (rule, value) => {
                let res = false;
                try {
                    res = methods[model.inputColorType].validate(value)
                } catch (error) {
                    res = false
                }
                return res
            }, message: '无效的颜色类型', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
}
</script>