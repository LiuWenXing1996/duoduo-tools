<template>
    <tool-content>
        <template #input>
            <n-form :model="model" :rules="rules">
                <tool-area label="输入">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="ascii" first label="Unicode" v-if="model.transferType === TransferType.html">
                        <n-input type="textarea" v-model:value="model.entity" :rows="3"></n-input>
                    </n-form-item>
                    <n-form-item path="text" first label="文本" v-if="model.transferType === TransferType.entity">
                        <n-input type="textarea" v-model:value="model.html" :rows="3"></n-input>
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
import { escape, unescape } from 'html-escaper';

enum TransferType {
    html = "html",
    entity = "entity"
}

export type Model = {
    transferType: TransferType,
    html: string,
    entity: string
}

const model = reactive<Model>({
    transferType: TransferType.entity,
    html: "",
    entity: "",
})

onMounted(() => {
    const html = "<title>你好</title>";
    model.html = html;
    model.entity = escape(html)
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.html]: { label: "转HTML" },
    [TransferType.entity]: { label: "转实体" },
})

const rules: FormRules = {
}


const res = computed(() => {
    const transferType = model.transferType;
    const text = model.html;
    const ascii = model.entity;
    let textRes = "";
    if (transferType === TransferType.html) {
        textRes = unescape(ascii)
    }
    if (transferType === TransferType.entity) {
        textRes = escape(text)
    }
    return textRes
})

</script>