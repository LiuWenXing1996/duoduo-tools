<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="输入">
                    <n-form-item path="val" label="值" first>
                        <n-input v-model:value="model.val" />
                    </n-form-item>
                    <n-form-item path="inputBase" label="输入进制" first>
                        <n-input-number v-model:value="model.inputBase" :min="2" :max="64" />
                    </n-form-item>
                    <n-form-item path="outCustomBase" label="自定义输出进制" first>
                        <n-input-number v-model:value="model.outCustomBase" :min="2" :max="64" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[120px] inline-flex"
                content-class="w-[calc(100%-120px)]">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium break-all">
                                {{ `${text.base} 进制${text.isCustom ? '(自定义)' : ''}` }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text.target">
                        <span class=" break-all">
                            {{ text.target }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="copy(text.target)" />
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
import type { FormRules } from 'naive-ui';
import { BaseRange, isValidBase, isValidNumberForBase } from './utils';

export type Model = {
    val: string,
    inputBase: number,
    outCustomBase: number,
}

const copy = useCopy()
const convertBase = (params: { value: string; fromBase: number; toBase: number }) => {
    const { value, fromBase, toBase } = params
    const range = BaseRange;
    const fromRange = range.slice(0, fromBase);
    const toRange = range.slice(0, toBase);
    let decValue = value
        .split('')
        .reverse()
        .reduce((carry: bigint, digit: string, index: number) => {
            if (!fromRange.includes(digit)) {
                throw new Error(`无效数字，${fromBase} 不包含此数字 ${digit}`);
            }
            return (carry += BigInt(fromRange.indexOf(digit)) * BigInt(fromBase) ** BigInt(index));
        }, 0n);
    let newValue = '';
    while (decValue > 0) {
        newValue = toRange[Number(decValue % BigInt(toBase))] + newValue;
        decValue = (decValue - (decValue % BigInt(toBase))) / BigInt(toBase);
    }
    return newValue || '0';
}

const model = reactive<Model>({
    val: "42",
    inputBase: 10,
    outCustomBase: 33,
})
const form = useTemplateRef("formRef")
const normalBaseList = [2, 8, 10, 16, 32, 64]

watch([() => model.inputBase], async () => {
    try {
        const a = await form.value?.validate()
    } catch (error) { }
})

const rules: FormRules = {
    inputBase: [
        {
            validator: (rule, value: number) => {
                return isValidBase(value)
            },
            message: '无效的进制,进制必须在 2-64 之间', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
    outCustomBase: [
        {
            validator: (rule, value: number) => {
                return isValidBase(value)
            },
            message: '无效的进制,进制必须在 2-64 之间', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
    val: [
        { required: true, message: '请输入数值', trigger: ['input', 'change', 'blur', 'focus'] },
        {
            validator: (rule, value: string) => {
                return isValidNumberForBase(value, model.inputBase)
            },
            message: '无效的数值', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
}

const textRes = computed(() => {
    const val = model.val || "";
    const inputBase = model.inputBase;
    const outCustomBase = model.outCustomBase;
    const resList = normalBaseList.map(v => {
        return {
            base: v,
            isCustom: false
        }
    }).concat({
        base: outCustomBase,
        isCustom: true
    }).map(item => {
        let target = "";
        try {
            target = convertBase({
                value: val,
                fromBase: inputBase,
                toBase: item.base
            })
        } catch (error) {
            target = ""
        }
        return {
            ...item,
            target
        }
    })

    return resList
})
</script>