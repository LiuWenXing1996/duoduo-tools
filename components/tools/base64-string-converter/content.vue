<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" :rules="rules">
                <define-tool-area label="输入">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="needDecodeStr" first label="需要解码的字符串"
                        v-if="model.transferType === TransferType.decode">
                        <n-input type="textarea" v-model:value="model.needDecodeStr" :rows="3"></n-input>
                    </n-form-item>
                    <n-form-item path="needEncodeStr" first label="需要编码的字符串"
                        v-if="model.transferType === TransferType.encode">
                        <n-input type="textarea" v-model:value="model.needEncodeStr" :rows="3"></n-input>
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
import { Base64 } from 'js-base64';

enum TransferType {
    encode = "encode",
    decode = "decode"
}


export type Model = {
    transferType: TransferType,
    needEncodeStr: string,
    needDecodeStr: string
}

const model = reactive<Model>({
    transferType: TransferType.encode,
    needEncodeStr: "",
    needDecodeStr: "",
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.encode]: { label: "编码" },
    [TransferType.decode]: { label: "解码" },
})

const rules: FormRules = {
}


const res = computed(() => {
    const transferType = model.transferType;
    const needEncodeStr = model.needEncodeStr;
    const needDecodeStr = model.needDecodeStr;
    let text = "";
    if (transferType === TransferType.encode) {
        text = Base64.encode(needEncodeStr)
    }
    if (transferType === TransferType.decode) {
        text = Base64.decode(needDecodeStr)
    }
    return text
})

</script>