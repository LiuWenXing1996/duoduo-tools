<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <define-tool-area label="文本">
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
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[145px] inline-flex"
                content-class="w-[calc(100%-145px)]">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ text.name }}
                            </span>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <svg-icon class="ml-[2px] pb-[5px] text-[12px]" name="common-info" />
                                </template>
                                <div>
                                    {{ `示例: ${text.example}` }}
                                </div>
                            </n-tooltip>
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
    </define-tool-wrapper>
</template>
<script lang="ts">
export const methods: {
    name: string,
    example: string,
    run: (val: string) => string
}[] = [
        { name: "camelCase", example: "twoWords", run: (val) => changeCase.camelCase(val) },
        { name: "capitalCase", example: "Two Words", run: (val) => changeCase.capitalCase(val) },
        { name: "constantCase", example: "TWO_WORDS", run: (val) => changeCase.constantCase(val) },
        { name: "dotCase", example: "two.words", run: (val) => changeCase.dotCase(val) },
        { name: "kebabCase", example: "two-words", run: (val) => changeCase.kebabCase(val) },
        { name: "noCase", example: "two words", run: (val) => changeCase.noCase(val) },
        { name: "pascalCase", example: "TwoWords", run: (val) => changeCase.pascalCase(val) },
        { name: "pascalSnakeCase", example: "Two_Words", run: (val) => changeCase.pascalSnakeCase(val) },
        { name: "pathCase", example: "two/words", run: (val) => changeCase.pathCase(val) },
        { name: "sentenceCase", example: "Two words", run: (val) => changeCase.sentenceCase(val) },
        { name: "snakeCase", example: "two_words", run: (val) => changeCase.snakeCase(val) },
        { name: "trainCase", example: "Two-Words", run: (val) => changeCase.trainCase(val) },
    ]
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import * as changeCase from "change-case"
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '更改单词格式',
        description: `更改单词格式, 支持各种单词格式:
${methods.map(e => {
            return `    ${e.example}`
        }).join(';\n')};
使用时，随意输入任意格式即可，程序会自动识别，也可以混用格式，例如 t-w-T_S`,
        category: ToolCategory.text
    })
})
const initialText = 'change-case'
const message = useMessage()
const model = reactive({
    text: initialText
})
const formRef = ref<FormInst | null>(null)
const finalText = computedAsync(
    async () => {
        const text = model.text;
        try {
            await formRef.value?.validate() || {}
        } catch (error) {
            return
        }
        return text
    },
    initialText,
)

const textRes = computed(() => {
    const text = finalText.value || "";
    return methods.map(m => {
        return {
            ...m,
            result: m.run(text)
        }
    })
})
const rules: FormRules = {
    text: [
        {
            required: true,
            message: '输入单词',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
const handleCopy = (val: string) => {
    const res = copy(val);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

</script>