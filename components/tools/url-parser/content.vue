<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" :rules="rules">
                <define-tool-area label="输入">
                    <n-form-item path="text" label="url" first>
                        <n-input clearable placeholder="输入url" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[100px] inline-flex"
                content-class="w-[calc(100%-100px)]">
                <n-descriptions-item v-for="property in textRes.properties">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium break-all">
                                {{ property.label }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span class=" break-all">
                            {{ property.result }}
                            <n-tooltip trigger="hover" v-if="property.result !== ''">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="copy(property.result)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>
                    </div>
                </n-descriptions-item>
            </n-descriptions>
            <n-divider title-placement="left">
                参数列表
            </n-divider>
            <template v-if="textRes.params.length > 0">
                <n-descriptions label-placement="left" :column="1" label-class="w-[100px] inline-flex"
                    content-class="w-[calc(100%-100px)]">
                    <n-descriptions-item v-for="param in textRes.params">
                        <template #label>
                            <div class="inline-flex">
                                <span class="font-medium break-all">
                                    {{ param.key }}
                                </span>
                            </div>
                        </template>
                        <div class="inline-flex">
                            <span class=" break-all">
                                {{ param.value }}
                                <n-tooltip trigger="hover" v-if="param.value !== ''">
                                    <template #trigger>
                                        <div class=" inline-flex">
                                            <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                                name="common-copy" @click="copy(param.value)" />
                                        </div>
                                    </template>
                                    {{ `点击复制` }}
                                </n-tooltip>
                            </span>
                        </div>
                    </n-descriptions-item>
                </n-descriptions>
            </template>
            <template v-else>
                <n-empty>没有参数</n-empty>
            </template>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormRules } from 'naive-ui';
import { exampleUrl, methods, parseUrlParams } from './utils';

export type Model = {
    text: string
}

const copy = useCopy()
const model = reactive<Model>({
    text: exampleUrl
})

const rules: FormRules = {
    text: [
        { required: true, message: '请输入url', trigger: ['input', 'change', 'blur', 'focus'] },
        {
            validator: (rule, value) => {
                let res = false;
                try {
                    return Boolean(new URL(value))
                } catch (error) {
                    res = false
                }
                return res
            }, message: '无效的url', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
}

const textRes = computed(() => {
    const text = model.text || "";
    let url: URL | undefined = undefined
    try {
        url = new URL(text)
    } catch (error) {
    }

    return {
        properties: Object.values(methods).map(m => {
            let res = "";
            try {
                res = url ? m.to(url) : ""
            } catch (error) {

            }
            return {
                ...m,
                result: res
            }
        }),
        params: url ? parseUrlParams(url) : []
    }
})
</script>