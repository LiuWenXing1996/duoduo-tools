<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" :rules="rules">
                <define-tool-area label="基础">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="roman" first label="罗马数字"
                        v-if="model.transferType === TransferType.romanToArabic">
                        <n-input v-model:value="model.roman"></n-input>
                    </n-form-item>
                    <n-form-item path="arabic" first label="阿拉伯数字"
                        v-if="model.transferType === TransferType.arabicToRoman">
                        <n-input v-model:value="model.arabic"></n-input>
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" break-all">
                {{ res }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(res)">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="ts">
import type { FormRules } from "naive-ui";
import { arabicToRoman, isValidRomanNumber, MAX_ARABIC_TO_ROMAN, MIN_ARABIC_TO_ROMAN, romanToArabic } from "./utils";

enum TransferType {
    arabicToRoman = "arabicToRoman",
    romanToArabic = "romanToArabic"
}


export type Model = {
    transferType: TransferType,
    arabic: string,
    roman: string
}

const model = reactive<Model>({
    transferType: TransferType.romanToArabic,
    roman: "XLII",
    arabic: "42",
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.arabicToRoman]: { label: "罗马数字转阿拉伯数字" },
    [TransferType.romanToArabic]: { label: "阿拉伯数字转罗马数字" },
})

const rules: FormRules = {
    arabic: [
        {
            validator: (rule, value: string) => {
                const n = Number(value);
                if (n > MAX_ARABIC_TO_ROMAN) {
                    return false
                }
                if (n < MIN_ARABIC_TO_ROMAN) {
                    return false
                }
                return true
            },
            message: `仅支持 ${MIN_ARABIC_TO_ROMAN} 到 ${MAX_ARABIC_TO_ROMAN} 之间的阿拉伯数字`, trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
    roman: [
        {
            validator: (rule, value: string) => {
                return isValidRomanNumber(value)
            },
            message: '无效的罗马数字', trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}


const res = computed(() => {
    const transferType = model.transferType;
    const roman = model.roman;
    const arabic = model.arabic;
    let text = "";
    if (transferType === TransferType.arabicToRoman) {
        text = arabicToRoman(Number(arabic))
    }
    if (transferType === TransferType.romanToArabic) {
        text = romanToArabic(roman)?.toString() || ""
    }
    return text
})

</script>