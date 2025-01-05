<template>
    <tool-wrapper :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => copy(result?.content || ''),
                }
            ]
        }
    }">
        <template #input>
            <n-form :model="model" ref="form">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="transferType" label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="needDecodeStr" :rule="[
                        { required: true, message: '请输入需要解码的字符串', trigger: allFormItemTrigger }
                    ]" v-if="model.transferType === 'decode'">
                        <template #label>
                            <tool-label label="需要解码的字符串" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        model.needDecodeStr = Base64.encode(exampleText)
                                    },
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" v-model:value="model.needDecodeStr" :rows="3"></n-input>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="needEncodeStr" :rule="[
                        { required: true, message: '请输入需要编码的字符串', trigger: allFormItemTrigger }
                    ]" v-if="model.transferType === 'encode'">
                        <template #label>
                            <tool-label label="需要编码的字符串" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        model.needEncodeStr = exampleText;
                                    },
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" v-model:value="model.needEncodeStr" :rows="3" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-rich-text :content="result?.content" />
        </template>
    </tool-wrapper>
</template>

<script setup lang="ts">
import { Base64 } from 'js-base64';

const transferTypes = ["encode", "decode"] as const;
type TransferType = typeof transferTypes[number];

export type Model = {
    transferType: TransferType,
    needEncodeStr: string,
    needDecodeStr: string
}

export type Result = {
    content: string
}

const model = reactive<Model>({
    transferType: "encode",
    needEncodeStr: "",
    needDecodeStr: "",
})
const formRef = useTemplateRef("form")
const exampleText = "我是一个示例文本 123"

onMounted(() => {
    model.needEncodeStr = exampleText;
    model.needDecodeStr = Base64.encode(exampleText)
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    encode: { label: "编码" },
    decode: { label: "解码" },
})

const result = computedAsync(async () => {
    let res: undefined | Result = undefined
    const transferType = model.transferType;
    const needEncodeStr = model.needEncodeStr;
    const needDecodeStr = model.needDecodeStr;
    try {
        await formRef.value?.validate()
        if (transferType === 'encode') {
            res = { content: Base64.encode(needEncodeStr) }
        }
        if (transferType === 'decode') {
            res = {
                content: Base64.decode(needDecodeStr)
            }
        }
    } catch (error) {
        res = undefined
    }

    return res
})
</script>