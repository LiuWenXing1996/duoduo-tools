<template>
    <tool-content>
        <template #input>
            <n-form :model="model">
                <tool-area label="配置">
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    加密的文本
                                </span>
                            </div>
                        </template>
                        <n-input clearable type="textarea" :rows="3" placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                    <n-form-item path="key" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    密钥
                                </span>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入密钥" v-model:value="model.key" />
                    </n-form-item>
                    <n-form-item path="type" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    加密方式
                                </span>
                            </div>
                        </template>
                        <n-select :options="typeOptions" v-model:value="model.type" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="break-all">{{ textRes }}</div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(textRes)">复制</n-button>
            </n-space>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from "crypto-js"
import { EncryptType } from "./utils";
export type Model = {
    text: string,
    key: string,
    type: EncryptType
}

const initialText = 'U2FsdGVkX19M1bppvVsZiQAtFYEurl5fFIAQdNk7QDA='
const copy = useCopy();
const typeOptions = defineSelectOptionList<Record<EncryptType, unknown>>({
    [EncryptType.AES]: { label: EncryptType.AES },
    [EncryptType.RC4]: { label: EncryptType.RC4 },
    [EncryptType.Rabbit]: { label: EncryptType.Rabbit },
    [EncryptType.TripleDES]: { label: EncryptType.TripleDES },
})
const model = reactive<Model>({
    type: EncryptType.AES,
    text: initialText,
    key: "123"
})
const methods: Record<EncryptType, (val: string, key: string) => string> = {
    [EncryptType.AES]: (val, key) => {
        return AES.decrypt(val, key).toString(enc.Utf8)
    },
    [EncryptType.RC4]: (val, key) => {
        return RC4.decrypt(val, key).toString(enc.Utf8)
    },
    [EncryptType.Rabbit]: (val, key) => {
        return Rabbit.decrypt(val, key).toString(enc.Utf8)
    },
    [EncryptType.TripleDES]: (val, key) => {
        return TripleDES.decrypt(val, key).toString(enc.Utf8)
    },
}
const textRes = computed(() => {
    const text = model.text || "";
    const key = model.key || "";
    const type = model.type;
    let res = ""
    try {
        res = methods[type]?.(text, key)
    } catch (error) {
        res = "解密失败"
    }
    return res
})
</script>