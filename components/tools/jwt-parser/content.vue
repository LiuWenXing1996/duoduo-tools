<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="内容">
                    <n-form-item label="输入" path="jwt" first>
                        <n-input type="textarea" clearable v-model:value="model.jwt" :rows="5" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <group-list :data="result"></group-list>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import { decodeJwt, isValidJwt, type DecodeJwtResult, } from './utils';
import { displayDateValue, displayTextValue } from '~/utils/display';

const model = reactive({
    jwt: ""
})

onMounted(() => {
    // cSpell:disable-next-line
    model.jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUxOTU2MjEwMDAsInN1YiI6InRlc3QiLCJuYmYiOjE3MzUwMjI4NDcwMDAsImlhdCI6MTczNDg1MDA1MTAwMCwiYXVkIjoiMTIzIiwiaGVsbG8iOiLkvaDlpb0ifQ.oFkocq3rWSrZRUVUnBq-OatGCALZKMfb39tGY7GTOf0"
})

const formRef = ref<FormInst | null>(null)
const result: ComputedRef<GroupListComponentProps["data"]> = computed(
    () => {
        const jwt = model.jwt;
        if (!jwt) {
            return []
        }
        let decodeJwtRes: DecodeJwtResult | undefined = undefined;
        try {
            decodeJwtRes = decodeJwt(jwt);
        } catch (error) {

        }
        console.log({ decodeJwtRes })
        const group: GroupListComponentProps["data"] = [
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
                        value: displayValue
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
                        value: displayValue
                    }
                })
            }
        ]
        return group
    }
)
const rules: FormRules = {
    jwt: [
        {
            required: true,
            message: '请输入 JWT',
            trigger: ['input', 'change', 'blur', 'focus']
        },
        {
            validator: (_rule, value: string) => {
                return isValidJwt(value)
            },
            message: '无效的 JWT',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
</script>