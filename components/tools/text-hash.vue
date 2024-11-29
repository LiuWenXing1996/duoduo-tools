<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model">
                <tool-item-input-fieldset>
                    <template #label>
                        文本
                    </template>
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入单词" v-model:value="model.text" />
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[100px] inline-flex"
                content-class="w-[calc(100%-100px)]">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ text.name }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text.result">
                        <span class=" break-all">
                            {{ text.result }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="handleCopy(text.result)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>

                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </tool-item-wrapper>
</template>
<script lang="ts">
export const methods: {
    name: string,
    example: string,
    run: (val: string) => string
}[] = [
        { name: "MD5", example: "", run: (val) => MD5(val).toString() },
        { name: "RipeMD-160", example: "", run: (val) => RIPEMD160(val).toString() },
        { name: "SHA-1", example: "", run: (val) => SHA1(val).toString() },
        { name: "SHA-224", example: "", run: (val) => SHA224(val).toString() },
        { name: "SHA-256", example: "", run: (val) => SHA256(val).toString() },
        { name: "SHA-3", example: "", run: (val) => SHA3(val).toString() },
        { name: "SHA-384", example: "", run: (val) => SHA384(val).toString() },
        { name: "SHA-512", example: "", run: (val) => SHA512(val).toString() },
    ]
</script>
<script setup lang="ts">
import { MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512 } from "crypto-js"
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: 'Hash 文本',
        description: `使用各种 Hash 算法处理文本, 支持的算法:
${methods.map(e => {
            return `    ${e.name}`
        }).join(';\n')};
`,
        category: ToolCategory.text,
        related: [{
            title: 'IT-TOOLS - Hash 文本',
            url: 'https://www.aiotools.top/hash-text'
        }]
    })
})
const initialText = '123456'
const message = useMessage()
const model = reactive({
    text: initialText
})
const textRes = computed(() => {
    const text = model.text || "";
    return methods.map(m => {
        return {
            ...m,
            result: m.run(text)
        }
    })
})
const handleCopy = (val: string) => {
    const res = copy(val);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

</script>