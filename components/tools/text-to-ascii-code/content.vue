<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" :rules="rules">
                <define-tool-area label="基础">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="ascii" first label="ASCII" v-if="model.transferType === TransferType.text">
                        <n-input type="textarea" v-model:value="model.ascii" :rows="3"></n-input>
                    </n-form-item>
                    <n-form-item path="text" first label="文本" v-if="model.transferType === TransferType.ascii">
                        <n-input type="textarea" v-model:value="model.text" :rows="3"></n-input>
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

enum TransferType {
    text = "text",
    ascii = "ascii"
}


export type Model = {
    transferType: TransferType,
    text: string,
    ascii: string
}

const model = reactive<Model>({
    transferType: TransferType.text,
    text: "",
    ascii: "",
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.text]: { label: "转文本" },
    [TransferType.ascii]: { label: "转ASCII" },
})

const rules: FormRules = {
}



const convertTextToAsciiBinary = (text: string): string => {
    const separator = " ";
    return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(separator);
}

const convertAsciiBinaryToText = (binary: string): string => {
    const cleanBinary = binary.replace(/[^01]/g, '');

    if (cleanBinary.length % 8) {
        return ""
    }

    return cleanBinary
        .split(/(\d{8})/)
        .filter(Boolean)
        .map(binary => String.fromCharCode(Number.parseInt(binary, 2)))
        .join('');
}


const res = computed(() => {
    const transferType = model.transferType;
    const text = model.text;
    const ascii = model.ascii;
    let textRes = "";
    if (transferType === TransferType.text) {
        textRes = convertAsciiBinaryToText(ascii)
    }
    if (transferType === TransferType.ascii) {
        textRes = convertTextToAsciiBinary(text)
    }
    return textRes
})

</script>