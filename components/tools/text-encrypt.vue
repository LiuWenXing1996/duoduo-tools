<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model">
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    文本
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
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div class="break-all">{{ textRes }}</div>
        </template>
        <template #actions>
            <n-space>
                <n-button @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script lang="ts">
export enum EncryptType {
    AES = "AES",
    RC4 = "RC4",
    Rabbit = "Rabbit",
    TripleDES = "TripleDES"
}
export type Model = {
    text: string,
    key: string,
    type: EncryptType
}

</script>
<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES } from "crypto-js"
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '文本加密',
        description: `使用各种算法加密文本, 支持的算法:
${Object.entries(EncryptType).map(([e]) => {
            return `    ${e}`
        }).join(';\n')};
`,
        category: ToolCategory.text,
        related: [
            ToolName["text-decrypt"],
            {
                title: 'IT-TOOLS - 加密/解密文本',
                url: 'https://www.aiotools.top/encryption'
            }
        ]
    })
})
const initialText = '123456'
const message = useMessage()
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
        return AES.encrypt(val, key).toString()
    },
    [EncryptType.RC4]: (val, key) => {
        return RC4.encrypt(val, key).toString()
    },
    [EncryptType.Rabbit]: (val, key) => {
        return Rabbit.encrypt(val, key).toString()
    },
    [EncryptType.TripleDES]: (val, key) => {
        return TripleDES.encrypt(val, key).toString()
    },
}
const textRes = computed(() => {
    const text = model.text || "";
    const key = model.key || "";
    const type = model.type;
    const res = methods[type]?.(text, key)
    return res
})
const handleCopy = () => {
    const res = copy(textRes.value);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

</script>