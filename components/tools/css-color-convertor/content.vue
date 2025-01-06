<template>
    <tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="inputType" label="输入方式">
                        <n-select :options="dataTypeOptions" v-model:value="model.inputType" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="colorPick" label="色板" v-if="model.inputType === 'pick'">
                        <n-color-picker v-model:value="model.colorPick" />
                    </n-form-item>
                    <template v-if="model.inputType === 'input'">
                        <n-form-item :="commonFormItemProps" path="inputColorType" label="颜色类型">
                            <n-select :options="inputColorTypeOptions" v-model:value="model.inputColorType" />
                        </n-form-item>
                        <n-form-item :="commonFormItemProps" path="colorInput" :rule="[
                            { required: true, message: '请输入颜色', trigger: allFormItemTrigger },
                            {
                                validator: (rule, value) => {
                                    let res = false;
                                    try {
                                        res = methods[model.inputColorType].validate(value)
                                    } catch (error) {
                                        res = false
                                    }
                                    return res
                                }, message: '无效的颜色类型', trigger: allFormItemTrigger
                            }
                        ]">
                            <template #label>
                                <tool-label label="文本" :actions="[
                                    {
                                        name: 'common-demo',
                                        tooltip: '使用示例',
                                        onClick: addInputExample
                                    }
                                ]" />
                            </template>
                            <n-input clearable placeholder="输入颜色" v-model:value="model.colorInput" />
                        </n-form-item>
                    </template>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :data="[
                {
                    label: '预览',
                    value: () => {
                        return h(
                            'div',
                            {
                                class: 'h-[30px] w-[30px]',
                                style: {
                                    backgroundColor: result?.preview || ''
                                }
                            }
                        )
                    }
                },
                ...((result?.list || []).map(item => {
                    return {
                        label: item.label,
                        value: item.result,
                        valueActions: [
                            {
                                name: 'common-copy',
                                onClick: () => {
                                    copy(item.result)
                                }
                            }
                        ]
                    }
                }))
            ]" />
        </template>
    </tool-wrapper>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { Colord } from "colord";
import { type ColorType, methods } from './utils';

export type Model = {
    inputType: "input" | "pick",
    inputColorType: ColorType,
    colorInput: string,
    colorPick: string
}

export type Result = {
    preview: string,
    list: {
        label: string,
        result: string
    }[]
}

const model = reactive<Model>({
    inputType: "pick",
    inputColorType: "Hexadecimal",
    colorInput: '',
    colorPick: ''
})

const initialColor = '#18a058';
onMounted(() => {
    const inputColorType = model.inputColorType
    const colordInstance = methods[inputColorType].form(initialColor);
    model.colorInput = methods[inputColorType].to(colordInstance)
    model.colorPick = methods[inputColorType].to(colordInstance)
})

const addInputExample = () => {
    const inputColorType = model.inputColorType
    const colordInstance = methods[inputColorType].form(initialColor);
    model.colorInput = methods[inputColorType].to(colordInstance)
}

const form = useTemplateRef("formRef")
const copy = useCopy()
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
const message = useAnyMessage()
const changeTag = useChangeTag(() => model, {
    deep: true,
    immediate: true
})
const result = computedAsync(async () => {
    let res: undefined | Result = undefined;
    changeTag.registerChange()
    try {
        await form?.value?.validate();
        const inputType = model.inputType;
        let inputColorType = model.inputColorType;
        const colorInput = model.colorInput || "";
        const colorPick = model.colorPick || "";
        let text = ""
        if (inputType === "input") {
            text = colorInput
        }
        if (inputType === "pick") {
            text = getRgb(colorPick) || ""
            inputColorType = "RGB"
        }
        let colordInstance: undefined | Colord = undefined;
        const m = methods[inputColorType]
        const isValid = m.validate(text);
        if (isValid) {
            colordInstance = m.form(text)
        }
        const list = Object.values(methods).map(m => {
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
        res = {
            preview: list[0].result,
            list
        }
    } catch (error) {
        res = undefined;
        message.anyError(error)
    }

    return res
})
const inputColorTypeOptions: SelectOption[] = Object.entries(methods).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const dataTypeOptions: SelectOption[] = defineSelectOptionList<Record<Model['inputType'], unknown>>({
    input: { label: "文本" },
    pick: { label: "色板" },
})
</script>