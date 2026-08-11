<template>
    <tool-content>
        <template #input>
            <n-form :model="model" :rules="rules">
                <tool-area label="输入">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="ascii" first label="Unicode" v-if="model.transferType === TransferType.text">
                        <n-input type="textarea" v-model:value="model.unicode" :rows="3"></n-input>
                    </n-form-item>
                    <n-form-item path="text" first label="文本" v-if="model.transferType === TransferType.unicode">
                        <n-input type="textarea" v-model:value="model.text" :rows="3"></n-input>
                    </n-form-item>
                </tool-area>
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
    </tool-content>
</template>

<script setup lang="ts">
import type { FormRules } from "naive-ui";

enum TransferType {
    text = "text",
    unicode = "unicode"
}

export type Model = {
    transferType: TransferType,
    text: string,
    unicode: string
}

const model = reactive<Model>({
    transferType: TransferType.unicode,
    text: "",
    unicode: "",
})

onMounted(() => {
    // cSpell:disable-next-line
    const text = "你好 123 haha";
    model.text = text;
    model.unicode = convertTextToUnicode(text)
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.text]: { label: "转文本" },
    [TransferType.unicode]: { label: "转Unicode" },
})

const rules: FormRules = {
}

const convertTextToUnicode = (text: string): string => {
    return text.split('').map(value => {
        const index = value.charCodeAt(0);
        const hex = index.toString(16);
        return `\\u${hex.padStart(4, '0')}`;
    }).join('');
}

const convertUnicodeToText = (unicodeStr: string): string => {
    const unicodePattern = /\\u([\dA-Fa-f]{4})/g;
    return unicodeStr.replace(unicodePattern, (match, hex) => {
        const dec = parseInt(hex, 16);
        return String.fromCharCode(dec)
    });
}

const res = computed(() => {
    const transferType = model.transferType;
    const text = model.text;
    const ascii = model.unicode;
    let textRes = "";
    if (transferType === TransferType.text) {
        textRes = convertUnicodeToText(ascii)
    }
    if (transferType === TransferType.unicode) {
        textRes = convertTextToUnicode(text)
    }
    return textRes
})

</script>