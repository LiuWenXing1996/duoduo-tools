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
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>

        </template>
        <template #actions>
            <n-space>
                <n-button @click="handleCopy">
                    复制
                </n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '文本去重',
        description: "支持删除文本中的重复行",
        category: ToolCategory.text,
        related: [
            {
                title: "帮小忙 - 文本去重",
                url: "https://tool.browser.qq.com/unique.html"
            },
            {
                title: "即时工具 - 删除重复行",
                url: "https://www.67tool.com/text/delete-duplicate-lines"
            }, {
                title: "Tools-Web - 文本去重",
                url: "https://tools.ranblogs.com/textremoveduplicate/"
            }
        ]
    })
})

const message = useMessage()
const initialText = `移除重复行
重复行
重复行
123`
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
    const lines = text.split("\n");
    const linesUniq = Array.from(new Set(lines))
    return linesUniq.join("\n")
})

const handleCopy = () => {
    const res = copy(textRes.value);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

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