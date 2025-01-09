<template>
    <tool-content>
        <template #input>
            <n-form :model="model" ref="form">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="inputType" label="输入类型">
                        <n-select :options="inputTypeOptions" v-model:value="model.inputType"></n-select>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="content" :rule="[
                        { required: true, message: '请输入数字', trigger: allFormItemTrigger },
                        {
                            validator: (rule, value) => {
                                let res = false;
                                try {
                                    if (model.inputType === 'num') {
                                        res = true
                                    } else {
                                        res = chineseNumTransferMap[model.inputType].validate(value)
                                    }
                                } catch (error) {
                                    res = false
                                }
                                return res
                            }, message: '无效的数字类型', trigger: allFormItemTrigger
                        }
                    ]">
                        <template #label>
                            <tool-label label="数字" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: addExample,
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" v-model:value="model.content" :rows="3" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="100" :data="[
                ...(result?.list || []).map(item => ({ label: item.label, value: item.result, valueCopy: true }))
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import type { SelectOption } from "naive-ui"
import { chineseNumTransferMap, type ChineseNumType } from "./utils"
export type Model = {
    content: string,
    inputType: "num" | ChineseNumType
}

export type Result = {
    list: {
        label: string,
        result: string
    }[]
}
const exampleText = "1.101"
const model = reactive<Model>({
    content: "",
    inputType: "num"
})
const addExample = () => {
    if (model.inputType === 'num') {
        model.content = exampleText
    } else {
        model.content = chineseNumTransferMap[model.inputType].fromNum(exampleText)
    };
}
onMounted(() => {
    addExample()
})
const formRef = useTemplateRef("form")

const message = useAnyMessage()
const result = computedAsync(async () => {
    let res: undefined | Result = undefined
    const inputType = model.inputType;
    const content = model.content;
    try {
        await formRef.value?.validate();
        let num: undefined | string = undefined;
        if (inputType === 'num') {
            num = content
        } else {
            num = chineseNumTransferMap[inputType].toNum(content)
        }
        const list: Result['list'] = [
            {
                label: "阿拉伯数字",
                result: num || ""
            },
            ...Object.values(chineseNumTransferMap).map(m => {
                let res = "";
                if (num !== undefined) {
                    res = m.fromNum(num)
                }
                return {
                    ...m,
                    result: res
                }
            })
        ]
        res = {
            list
        }
    } catch (error) {
        message.anyError(error)
        res = undefined
    }

    return res
})

const inputTypeOptions: SelectOption[] = [
    {
        label: "阿拉伯数字",
        value: "num"
    },
    ...Object.entries(chineseNumTransferMap).map(([key, value]) => {
        return {
            key,
            label: value.label,
            value: key,
        }
    })
]

</script>