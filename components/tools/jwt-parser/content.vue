<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="内容">
                    <n-form-item :="commonFormItemProps" path="jwt" :rule="[
                        {
                            required: true,
                            message: '请输入 JWT',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_rule, value: string) => {
                                return isValidJwt(value)
                            },
                            message: '无效的 JWT',
                            trigger: allFormItemTrigger
                        }
                    ]">
                        <template #label>
                            <tool-label label="输入" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        addExample()
                                    }
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" clearable v-model:value="model.jwt" :rows="5" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="groupItem in result">
                    <n-thing :title="groupItem.label" content-style="margin-top: 10px;">
                        <key-value :data="groupItem.items" />
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import { decodeJwt, isValidJwt, } from './utils';
import { displayDateValue, displayTextValue } from '~/utils/display';

export type Result = {
    label: string,
    items: KeyValueComponentProps['data']
}[]

export type Model = {
    jwt: string,
}

const model = reactive<Model>({
    jwt: ""
})

// cSpell:disable-next-line
const example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUxOTU2MjEwMDAsInN1YiI6InRlc3QiLCJuYmYiOjE3MzUwMjI4NDcwMDAsImlhdCI6MTczNDg1MDA1MTAwMCwiYXVkIjoiMTIzIiwiaGVsbG8iOiLkvaDlpb0ifQ.oFkocq3rWSrZRUVUnBq-OatGCALZKMfb39tGY7GTOf0"

onMounted(() => {
    model.jwt = example
})

const message = useAnyMessage();
const addExample = () => {
    model.jwt = example
}

const formRef = useTemplateRef('form')
const result = computedAsync(
    async () => {
        let res: undefined | Result = undefined;
        const jwt = model.jwt;

        try {
            await formRef.value?.validate();
            if (jwt) {
                let decodeJwtRes = decodeJwt(jwt);
                const group: Result = [
                    {
                        label: "header(头部)",
                        items: Object.entries(decodeJwtRes?.header || {}).map(([key, value]) => {
                            let displayKey = displayTextValue(key)
                            let displayValue = displayTextValue(value)
                            if (key === "alg") {
                                displayKey = `alg(签名算法)`
                            }
                            if (key === "typ") {
                                displayKey = `typ(类型)`
                            }
                            if (key === "kid") {
                                displayKey = `kid(密钥标识符)`
                            }
                            return {
                                label: displayKey,
                                value: displayValue,
                                valueCopy: true
                            }
                        })
                    },
                    {
                        label: "payload(负载)",
                        items: Object.entries(decodeJwtRes?.payload || {}).map(([key, value]) => {
                            let displayKey = displayTextValue(key)
                            let displayValue = displayTextValue(value)
                            if (key === "iss") {
                                displayKey = `iss(签发人)`
                            }
                            if (key === "exp") {
                                displayKey = `exp(过期时间)`
                                displayValue = `${displayValue}(${displayDateValue(value)})`
                            }
                            if (key === "sub") {
                                displayKey = `sub(主题)`
                            }
                            if (key === "aud") {
                                displayKey = `aud(受众)`
                            }
                            if (key === "nbf") {
                                displayKey = `nbf(生效时间)`
                                displayValue = `${displayValue}(${displayDateValue(value)})`
                            }
                            if (key === "iat") {
                                displayKey = `iat(签发时间)`
                                displayValue = `${displayValue}(${displayDateValue(value)})`
                            }
                            if (key === "jti") {
                                displayKey = `jti(编号)`
                            }
                            return {
                                label: displayKey,
                                value: displayValue,
                                valueCopy: true
                            }
                        })
                    }
                ]

                res = group
            }
        } catch (error) {
            message.anyError(error)
            res = undefined
        }
        return res
    }
)

</script>