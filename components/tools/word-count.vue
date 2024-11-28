<template>
    <tool-item-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="8" />
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ text.name }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ text.result }}
                        </span>
                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </tool-item-wrapper>
</template>
<script lang="ts">
const methods: {
    name: string,
    run: (val: string) => string | number
}[] = [
        { name: "总字数", run: (val) => val.length },
        { name: "汉字", run: (val) => (val.match(/[\u4e00-\u9fa5]/g) || []).length },
        { name: "数字", run: (val) => (val.match(/[\d+]/g) || []).length },
        { name: "行数", run: (val) => val.split(/\r\n|\r|\n/).length },
        { name: "字母", run: (val) => (val.match(/[a-zA-Z]/g) || []).length },
        { name: "空白字符", run: (val) => (val.match(/[\s*]/g) || []).length },
        {
            name: "大小", run: (val) => {
                const decimals = 2
                const bytes = new TextEncoder().encode(val).buffer.byteLength;
                if (bytes === 0) {
                    return '0 Bytes';
                }

                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));

                return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
            }
        },
    ]
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

defineOptions({
    toolMeta: defineToolMeta({
        title: '字数统计',
        description: `支持统计以下信息: 
${methods.map((e) => {
            return `    ${e.name}`
        }).join(";\n")};`,
        category: ToolCategory.text,
        related: [
            {
                title: "Tools-Web - 字数统计",
                url: "https://tools.ranblogs.com/wordcount"
            },
            {
                title: "IT-TOOLS - 文本统计",
                url: "https://www.aiotools.top/text-statistics"
            }
        ]
    })
})
const initialText = '字数统计123'
const model = reactive({
    text: initialText,
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
            message: '输入文本',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
</script>